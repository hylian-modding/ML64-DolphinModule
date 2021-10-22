import IConsole, { IConsoleDescriptor } from "modloader64_api/IConsole";
import { IHiResTexture } from "modloader64_api/IHiResTexture";
import IMemory from "modloader64_api/IMemory";
import { IConfig, ILogger } from "modloader64_api/IModLoaderAPI";
import { IRomHeader } from "modloader64_api/IRomHeader";
import { IRomMemory } from "modloader64_api/IRomMemory";
import ISaveState from "modloader64_api/ISaveState";
import IUtils from "modloader64_api/IUtils";
import { ProxySide } from "modloader64_api/SidedProxy/SidedProxy";
import { Debugger } from "modloader64_api/Sylvain/Debugger";
import { Gfx } from "modloader64_api/Sylvain/Gfx";
import { IImGui } from "modloader64_api/Sylvain/ImGui";
import { Input } from "modloader64_api/Sylvain/Input";
import { SDL } from "modloader64_api/Sylvain/SDL";
import { IYaz0 } from "modloader64_api/Sylvain/Yaz0";
import path from "path";
import fs from 'fs';

export abstract class DummyMupen implements IConsole {

    lolMupen: any;

    constructor(logger: ILogger, lobby: string, config: IConfig) {
        // Sketchy shit
        let _md = require(path.resolve('./src/modloader/consoles/mupen/MupenDescriptor.js')).MupenDescriptor;
        let md: IConsoleDescriptor = new _md();
        this.lolMupen = md.constructConsole(ProxySide.CLIENT, "./emulator/mupen64plus.v64", logger, lobby, config);
    }

    startEmulator(preStartCallback: Function): IMemory {
        let mem = this.lolMupen.startEmulator(()=>{});
        return mem;
    }

    stopEmulator(): void {
        this.lolMupen.stopEmulator();
    }

    softReset(): void {
        this.lolMupen.softReset();
    }

    hardReset(): void {
        this.lolMupen.hardReset();
    }

    saveState(file: string): void {
        this.lolMupen.saveState(file);
    }

    loadState(file: string): void {
        this.lolMupen.loadState(file);
    }

    finishInjects(): void {
        this.lolMupen.finishInjects();
    }

    isEmulatorReady(): boolean {
        return this.lolMupen.isEmulatorReady();
    }

    getLoadedRom(): Buffer {
        return this.lolMupen.getLoadedRom();
    }

    getRomOriginalSize(): number {
        return this.lolMupen.rom_size;
    }

    abstract getRomHeader(): IRomHeader;

    pauseEmulator(): void {
        this.lolMupen.pauseEmulator();
    }

    resumeEmulator(): void {
        this.lolMupen.resumeEmulator();
    }

    getMemoryAccess(): IMemory {
        //@ts-ignore
        return this.mem;
    }

    setSaveDir(path: string): void {
        this.lolMupen.setSaveDir(path);
    }

    getUtils(): IUtils {
        return this.lolMupen.getUtils();
    }

    getSaveStateManager(): ISaveState {
        return this.lolMupen.getSaveStateManager();
    }

    getFrameCount(): number {
        return this.lolMupen.getFrameCount();
    }

    setFrameCount(num: number): void {
    }

    on(which: string, callback: any): void {
        this.lolMupen.on(which, callback);
    }

    getImGuiAccess(): IImGui {
        return this.lolMupen.getImGuiAccess();
    }

    getSDLAccess(): SDL {
        return this.lolMupen.getSDLAccess();
    }

    getGfxAccess(): Gfx {
        return this.lolMupen.getGfxAccess();
    }

    getInputAccess(): Input {
        return this.lolMupen.getInputAccess();
    }

    getYaz0Encoder(): IYaz0 {
        return this.lolMupen.getYaz0Encoder();
    }

    getDebuggerAccess(): Debugger {
        return this.lolMupen.getDebuggerAccess();
    }

    getHiResTextureAccess(): IHiResTexture {
        return this.lolMupen.getHiResTextureAccess();
    }

    getInternalPlugin(): string {
        return this.lolMupen.getInternalPlugin();
    }

    getRomAccess(): IRomMemory {
        return this.lolMupen.getRomAccess();
    }

}