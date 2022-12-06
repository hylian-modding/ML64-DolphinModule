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
import { Dolphin, Core, State, Util, UICommon, Config, Gui } from 'dolphin-js';
import { FakeRom } from 'modloader64_api/SidedProxy/FakeMemory';
import { ILogger, IConfig } from 'modloader64_api/IModLoaderAPI';
import fs from 'fs';
import { GCRomHeader } from './GCRomHeader';
import { DolphinMemory } from './DolphinMemory';
import { bus } from 'modloader64_api/EventHandler';
import { ImGui } from 'ml64tk';
import { DolphinStartInfo } from './DolphinStartInfo';
import { getDolphinLibraryPath } from './getDolphinLibraryPath';
import { Emulator_Callbacks } from './Emulator_Callbacks';
import worker_threads from 'worker_threads';
import path from 'path';
import { ImGuiAppImpl } from './ImGuiAppImpl';
import { getDolphinUserDirectoryPath } from './getDolphinUserDirectoryPath';

export default class DolphinConsole implements IConsole {

    startInfo: DolphinStartInfo = { isConfigure: false, gameFilePath: "" };
    processUI: any;
    processFrame: any;
    rom: Buffer;
    mem!: DolphinMemory;
    frame: number = 0;
    callbacks: Map<string, Array<Function>> = new Map<string, Array<Function>>();
    lobby: string;

    constructor(rom: string, logger: ILogger, lobby: string, config: IConfig) {
        this.rom = fs.readFileSync(rom);
        this.startInfo.gameFilePath = rom;

        this.lobby = lobby;

        this.mem = new DolphinMemory();

        bus.on("DOLPHIN_ENABLE_PATCH", (evt: any) => {
            Util.enablePatch(new UICommon.GameFile(rom), evt);
        });

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

        Dolphin.loadLibrary({
            libraryPath: getDolphinLibraryPath()
        });

        let app: ImGuiAppImpl;
        if (!this.startInfo.isConfigure) {
            app = new ImGuiAppImpl();
            app.run();
        }

        Dolphin.startup({
            applicationDisplayName: 'ModLoader64',
            userDirectoryPath: getDolphinUserDirectoryPath()
        }, () => {
            Config.setBool('-MAIN_USE_PANIC_HANDLERS', false);
            Config.setBool('-Main,Interface.PlayMode', !this.startInfo.isConfigure);
            Config.setBool('-Main,Display.RenderToMain', !this.startInfo.isConfigure);
            Config.setBool('-Main,Interface.HideFPSInfo', false);
        });

        Gui.MainWindow.setIcon('assets/icon.png');
        Gui.MainWindow.show();
        Gui.Settings.setToolBarVisible(this.startInfo.isConfigure);
        Gui.Settings.setDebugModeEnabled(false);

        if (!this.startInfo.isConfigure) {
            let debugMenu = Gui.MainWindow.getMenuBar().addMenu('Debug');
            let toggleImGuiAction = debugMenu.addAction('ImGui');
            toggleImGuiAction.checkable = true;
            toggleImGuiAction.setToggledCallback((c) => {
                if (c) app.show();
                else app.hide();
            });
            toggleImGuiAction.checked = false;
            toggleImGuiAction.setShortcut('Ctrl+I');
            // @ts-ignore
            app.setToggleImGuiAction(toggleImGuiAction);
        }

        let helpMenu = Gui.MainWindow.findMenu('Help');
        if (helpMenu) {
            let aboutAction = helpMenu.addAction('About ModLoader64');
            aboutAction.setTriggeredCallback(() => {
                Gui.Q.CommonDialogs.about(Gui.MainWindow.asWidget(), 'About ModLoader64',
                    'ModLoader64 is a network capable mod loading system for Nintendo 64 and GameCube games.<br/>' +
                    'Its main purpose is creating online multiplayer mods for various games like Ocarina of Time.<br/>' +
                    '<a href="https://modloader64.com/">Website</a> <a href="https://discord.gg/nHb4fXX">Discord</a>');
            });
        }

        if (!this.startInfo.isConfigure)
            Gui.MainWindow.startGame(this.startInfo.gameFilePath!);

        const processFrame = setInterval(() => {
            Dolphin.handleFrame(() => {
                // new frame
                if (this.callbacks.has(Emulator_Callbacks.new_frame)) {
                    this.callbacks.get(Emulator_Callbacks.new_frame)!.forEach((fn: Function) => {
                        fn(this.frame);
                    });
                }
            });
        }, 1);

        Dolphin.enableFrameHandler(true);
        const processUI = setInterval(() => {
            Dolphin.processOne();
            this.onNewFrame();
            if (Gui.Application.hasExited()) {
                clearInterval(processUI);
                if (!this.startInfo.isConfigure) {
                    app.close();
                    Dolphin.enableFrameHandler(false);
                }
                Dolphin.shutdown();

                if (!this.startInfo.isConfigure)
                    clearInterval(processFrame);
                bus.emit('SHUTDOWN_EVERYTHING', {});
                setTimeout(() => {
                    process.exit(0);
                }, 3000);
            }
        }, 16);

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