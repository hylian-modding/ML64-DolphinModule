import IConsole from 'modloader64_api/IConsole';
import { IHiResTexture } from 'modloader64_api/IHiResTexture';
import IMemory from 'modloader64_api/IMemory';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { IRomMemory } from 'modloader64_api/IRomMemory';
import ISaveState from 'modloader64_api/ISaveState';
import IUtils from 'modloader64_api/IUtils';
import { Debugger } from 'modloader64_api/Sylvain/Debugger';
import { IImGui } from 'modloader64_api/Sylvain/ImGui';
import { Input } from 'modloader64_api/Sylvain/Input';
import { SDL } from 'modloader64_api/Sylvain/SDL';
import { IYaz0 } from 'modloader64_api/Sylvain/Yaz0';
import { Dolphin, Core, State, Util, UICommon, Config, Gui, Enums } from 'dolphin-js';
import { FakeRom } from 'modloader64_api/SidedProxy/FakeMemory';
import { ILogger, IConfig } from 'modloader64_api/IModLoaderAPI';
import fs from 'fs';
import path from 'path';
import { GCRomHeader } from './GCRomHeader';
import { DolphinMemory } from './DolphinMemory';
import { bus } from 'modloader64_api/EventHandler';
import { ImGui } from 'ml64tk';
import { DolphinStartInfo } from './DolphinStartInfo';
import { getDolphinLibraryPath } from './getDolphinLibraryPath';
import { Emulator_Callbacks } from './Emulator_Callbacks';
import { getDolphinUserDirectoryPath } from './getDolphinUserDirectoryPath';
import { ImGuiAppImpl } from './ImGuiAppImpl';
import worker_threads from 'worker_threads';

export default class DolphinConsole implements IConsole {

    startInfo: DolphinStartInfo = { isConfigure: false, gameFilePath: "", lobby: "" };
    rom: Buffer;
    mem!: DolphinMemory;
    frame: number = 0;
    callbacks: Map<string, Array<Function>> = new Map<string, Array<Function>>();
    lobby: string;

    constructor(rom: string, logger: ILogger, lobby: string, config: IConfig) {
        this.rom = fs.readFileSync(rom);
        this.startInfo.gameFilePath = rom;

        this.lobby = lobby;
        this.startInfo.lobby = lobby;

        this.mem = new DolphinMemory();

        bus.on("DOLPHIN_ENABLE_PATCH", (evt: any) => {
            Util.enablePatch(new UICommon.GameFile(rom), evt);
        });
        bus.on("DOLPHIN_ENABLE_GECKO", (evt: any) => {
            Util.enableGeckoCode(new UICommon.GameFile(rom), evt);
        });
        bus.on("DOLPHIN_ENABLE_ARCODE", (evt: any) => {
            Util.enableARCode(new UICommon.GameFile(rom), evt);
        });

        if (global.ModLoader.hasOwnProperty("EXTRA_DATA")) {
            this.startInfo.isConfigure = global.ModLoader["EXTRA_DATA"].toUpperCase() === "TRUE";
        }

    }

    onNewFrame(): void {
        if (this.callbacks.has(Emulator_Callbacks.vi_update)) {
            this.callbacks.get(Emulator_Callbacks.vi_update)!.forEach((fn: Function) => {
                fn(this.frame);
            });
        }
    }

    startEmulator(preStartCallback: Function): IMemory {

        let buf: Buffer = preStartCallback();

        if (worker_threads.isMainThread) {
            Dolphin.loadLibrary({
                libraryPath: getDolphinLibraryPath()
            });
        
            process.on('message', (startInfo: DolphinStartInfo) => {
                const hostWorker = new worker_threads.Worker(path.join(__dirname, 'DolphinHostThread.js'), { workerData: startInfo });
        
                if (!startInfo.isConfigure) {
                    const app = new ImGuiAppImpl();
                    app.run();
                    app.setHostWorker(hostWorker);
        
                    let processFrame: NodeJS.Timer;
        
                    hostWorker.on('message', value => {
                        if (value.msg == 'hostReady') {
                            processFrame = setInterval(() => {
                                Dolphin.handleFrame(() => {
                                    if (this.callbacks.has(Emulator_Callbacks.new_frame)) {
                                        this.callbacks.get(Emulator_Callbacks.new_frame)!.forEach((fn: Function) => {
                                            fn(this.frame);
                                        });
                                    }
                                });
                            }, 1);
                            Dolphin.enableFrameHandler(true);
                        }
                        else if (value.msg == 'toggleImGuiVisibility') {
                            const checked: boolean = value.data;
                            if (checked) app.show();
                            else app.hide();
                        }
                    });
        
                    hostWorker.on('exit', () => {
                        if (!startInfo.isConfigure)
                            clearInterval(processFrame);
                        app.close();
                        try{
                            this.stopEmulator();
                        }catch(err){
                        }
                        bus.emit('SHUTDOWN_EVERYTHING', {});
                        setTimeout(() => {
                            process.exit(0);
                        }, 3000);
                    });
                }
        
                process.removeAllListeners('message');
            });
        }

        //@ts-ignore
        this.rom = undefined;

        return this.mem;
    }

    stopEmulator(): void {
        Dolphin.shutdown();
    }

    softReset(): void {
    }

    hardReset(): void {
    }

    saveState(file: string): void {
        State.saveAs(file);
    }

    loadState(file: string): void {
        State.loadAs(file);
    }

    finishInjects(): void {

    }

    isEmulatorReady(): boolean {
        return Core.isRunning();
    }

    getLoadedRom(): Buffer {
        return this.rom;
    }

    getRomOriginalSize(): number {
        return this.rom.byteLength;
    }

    getRomHeader(): IRomHeader {
        let head = new GCRomHeader();
        head.id = this.rom.slice(0, 4).toString();
        let b = -1;
        let o = 0x20;
        while (b !== 0) {
            b = this.rom.readUInt8(o);
            head.name += this.rom.slice(o, o + 1).toString();
            o++;
        }
        head.name = head.name.trim();
        return head;
    }

    pauseEmulator(): void {
    }

    resumeEmulator(): void {
    }

    getMemoryAccess(): IMemory {
        return this.mem;
    }

    setSaveDir(path: string): void {
    }

    getUtils(): IUtils {
        return {} as any;
    }

    getFrameCount(): number {
        return this.frame;
    }

    setFrameCount(num: number): void {
        this.frame = num;
    }

    private registerCallback(type: string, callback: Function) {
        if (!this.callbacks.has(type)) {
            this.callbacks.set(type, []);
        }
        this.callbacks.get(type)!.push(callback);
    }

    on(which: string, callback: any): void {
        this.registerCallback(which, callback);
    }

    getSaveStateManager(): ISaveState {
        return {} as any;
    }

    getImGuiAccess(): IImGui {
        return ImGui as any;
    }

    getSDLAccess(): SDL {
        return {} as any;
    }

    getGfxAccess(): any {
        return {} as any;
    }

    getInputAccess(): Input {
        return {} as any;
    }

    getYaz0Encoder(): IYaz0 {
        return {} as any;
    }

    getDebuggerAccess(): Debugger {
        return {} as any;
    }

    getHiResTextureAccess(): IHiResTexture {
        return {} as any;
    }

    getInternalPlugin(): string {
        return "";
    }

    getRomAccess(): IRomMemory {
        return new FakeRom();
    }

}