import IConsole from 'modloader64_api/IConsole';
import IMemory from 'modloader64_api/IMemory';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import IUtils from 'modloader64_api/IUtils';
import ISaveState from 'modloader64_api/ISaveState';
import { Debugger } from 'modloader64_api/Sylvain/Debugger';
import { IYaz0 } from 'modloader64_api/Sylvain/Yaz0';
import { Input } from 'modloader64_api/Sylvain/Input';
import { Gfx } from 'modloader64_api/Sylvain/Gfx';
import { SDL } from 'modloader64_api/Sylvain/SDL';
import { IImGui } from 'modloader64_api//Sylvain/ImGui';
import { FakeMemory, FakeRom } from 'modloader64_api/SidedProxy/FakeMemory';
import { ILogger } from 'modloader64_api/IModLoaderAPI';
import { IRomMemory } from 'modloader64_api/IRomMemory';
import { GCRomHeader } from './GCRomHeader';
import { IHiResTexture } from 'modloader64_api/IHiResTexture';

export class FakeGamecube implements IConsole {
    rom: string;
    rom_data: Buffer;
    ram: FakeMemory;
    dummy: any = {};

    constructor(rom: string, logger: ILogger, lobby: string) {
        this.rom = rom;
        this.rom_data = Buffer.alloc(1);
        this.ram = new FakeMemory();
    }

    getHiResTextureAccess(): IHiResTexture {
        return this.dummy;
    }

    getRomAccess(): IRomMemory {
        return new FakeRom();
    }

    getInternalPlugin(): string {
        return "";
    }

    getDebuggerAccess(): Debugger {
        return this.dummy;
    }

    getRomOriginalSize(): number {
        return -1;
    }

    getYaz0Encoder(): IYaz0 {
        return this.dummy;
    }

    getInputAccess(): Input {
        return this.dummy;
    }
    getGfxAccess(): Gfx {
        return this.dummy;
    }

    getSDLAccess(): SDL {
        return this.dummy;
    }
    getImGuiAccess(): IImGui {
        return this.dummy;
    }

    on(which: string, callback: any): void {
    }

    startEmulator(preStartCallback: Function): IMemory {
        preStartCallback(this.rom_data);
        return this.ram;
    }

    stopEmulator(): void { }

    finishInjects(): void { }

    isEmulatorReady(): boolean {
        return true;
    }

    getLoadedRom(): Buffer {
        return this.rom_data;
    }

    getFrameCount(): number {
        return -1;
    }

    setFrameCount(num: number): void { }

    pauseEmulator(): void { }

    resumeEmulator(): void { }

    getRomHeader(): IRomHeader {
        return new GCRomHeader();
    }

    getMemoryAccess(): IMemory {
        return this.ram;
    }

    softReset(): void { }

    hardReset(): void { }

    saveState(file: string): void { }

    loadState(file: string): void { }

    setSaveDir(path: string): void { }

    getUtils(): IUtils {
        return this.dummy;
    }

    getSaveStateManager(): ISaveState {
        return this.dummy;
    }
}