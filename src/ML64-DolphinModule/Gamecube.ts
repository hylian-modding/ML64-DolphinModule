import IConsole from "modloader64_api/IConsole";
import IMemory from "modloader64_api/IMemory";
import { ILogger } from "modloader64_api/IModLoaderAPI";
import { IRomHeader } from "modloader64_api/IRomHeader";
import ISaveState from "modloader64_api/ISaveState";
import IUtils from "modloader64_api/IUtils";
import { Debugger } from "modloader64_api/Sylvain/Debugger";
import { Gfx } from "modloader64_api/Sylvain/Gfx";
import { Emulator_Callbacks, IImGui } from "modloader64_api/Sylvain/ImGui";
import { Input } from "modloader64_api/Sylvain/Input";
import { SDL } from "modloader64_api/Sylvain/SDL";
import { IYaz0 } from "modloader64_api/Sylvain/Yaz0";
import path from 'path';
import { GCRomHeader } from "./GCRomHeader";
import { DolphinMemoryWrapper } from "./MemoryWrapper";
import fs from 'fs';
//@ts-ignore
import { CoreState, Dolphin } from '@dolphin/binding/Dolphin';
import { bus } from "modloader64_api/EventHandler";
import { ModLoaderErrorCodes } from "modloader64_api/ModLoaderErrorCodes";
import { IRomMemory } from "modloader64_api/IRomMemory";
import { FakeRom } from 'modloader64_api/SidedProxy/FakeMemory';
import { IHiResTexture } from "modloader64_api/IHiResTexture";

export default class Gamecube implements IConsole {

    mod: Dolphin;
    rom: string;
    mem: DolphinMemoryWrapper;
    callbacks: Map<string, Array<Function>> = new Map<string, Array<Function>>();
    isRunning: boolean = false;
    iso: Buffer;
    logger: ILogger;

    constructor(rom: string, logger: ILogger, lobby: string) {
        this.logger = logger;
        this.mod = new Dolphin({
            // Qt app metadata, mostly used when storing settings via QSetting
            orgName: 'ModLoader64',
            orgDomain: 'https://modloader64.com/',
            appName: 'modloader64-dolphin-emu',
            appDisplayName: 'ModLoader64', // window title suffix: `${title} - ${appDisplayName}`
            baseDir: global["module-alias"]["moduleAliases"]["@dolphin"], // folder containing Sys/;Languages/;QtPlugins/ and dolphin.node
            userDir: path.join(global["module-alias"]["moduleAliases"]["@dolphin"], 'UserData') // user settings, Documents/Dolphin Emulator/
        });
        this.rom = rom;
        this.mem = new DolphinMemoryWrapper(this.mod);
        this.mod.onTick = () => {
            for (let i = 0; i < this.callbacks.get(Emulator_Callbacks.new_frame)!.length; i++) {
                this.callbacks.get(Emulator_Callbacks.new_frame)![i]();
            }
        };
        this.mod.onStateChanged = (newState: CoreState) => {
            logger.debug('New state: ' + CoreState[newState]);
            bus.emit("DolphinStateChanged", newState);
            if (newState === CoreState.Running) {
                this.isRunning = true;
            } else {
                if (this.isRunning && newState === CoreState.Uninitialized) {
                    // Emulation ended.
                    process.exit(0);
                }
            }
        };
        // Only load this temporarily. Null it after boot.
        logger.info("Loading rom: " + rom + ".");
        if (rom === "") {
            this.logger.error("No rom selected!");
            process.exit(ModLoaderErrorCodes.NO_ROM);
        }
        if (!fs.existsSync(rom)) {
            this.logger.error("No rom selected!");
            process.exit(ModLoaderErrorCodes.NO_ROM);
        }
        this.iso = fs.readFileSync(this.rom);
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

    startEmulator(preStartCallback: Function): IMemory {
        preStartCallback();
        this.mod.start({
            path: this.rom,
            isNandTitle: false,
            savestatePath: undefined
        });
        // null the cached iso now.
        //@ts-ignore
        this.iso = undefined;
        return this.mem;
    }

    stopEmulator(): void {
    }

    softReset(): void {
    }

    hardReset(): void {
    }

    saveState(file: string): void {
    }

    loadState(file: string): void {
    }

    finishInjects(): void {
    }

    isEmulatorReady(): boolean {
        return true;
    }

    getLoadedRom(): Buffer {
        return this.iso;
    }

    getRomOriginalSize(): number {
        return this.iso.byteLength;
    }

    getRomHeader(): IRomHeader {
        let head = new GCRomHeader();
        head.id = this.iso.slice(0, 4).toString();
        let b = -1;
        let o = 0x20;
        while (b !== 0) {
            b = this.iso.readUInt8(o);
            head.name += this.iso.slice(o, o + 1).toString();
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

    getSaveStateManager(): ISaveState {
        return {} as any;
    }

    getFrameCount(): number {
        return 0;
    }

    setFrameCount(num: number): void {
    }

    on(which: string, callback: any): void {
        this.registerCallback(which, callback);
    }

    getImGuiAccess(): IImGui {
        return {} as any;
    }

    getSDLAccess(): SDL {
        return {} as any;
    }

    getGfxAccess(): Gfx {
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

    private registerCallback(type: string, callback: Function) {
        if (!this.callbacks.has(type)) {
            this.callbacks.set(type, []);
        }
        this.callbacks.get(type)!.push(callback);
    }

}