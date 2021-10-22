import IConsole from "modloader64_api/IConsole";
import { IHiResTexture } from "modloader64_api/IHiResTexture";
import IMemory from "modloader64_api/IMemory";
import { IRomHeader } from "modloader64_api/IRomHeader";
import { IRomMemory } from "modloader64_api/IRomMemory";
import ISaveState from "modloader64_api/ISaveState";
import IUtils from "modloader64_api/IUtils";
import { FakeMemory, FakeRom } from "modloader64_api/SidedProxy/FakeMemory";
import { Debugger } from "modloader64_api/Sylvain/Debugger";
import { Gfx } from "modloader64_api/Sylvain/Gfx";
import { IImGui } from "modloader64_api/Sylvain/ImGui";
import { Input } from "modloader64_api/Sylvain/Input";
import { SDL } from "modloader64_api/Sylvain/SDL";
import { IYaz0 } from "modloader64_api/Sylvain/Yaz0";
import { GCRomHeader } from './GCRomHeader';

export class EmptyConsole implements IConsole {

    fakemem: FakeMemory = new FakeMemory();
    fakerom: FakeRom = new FakeRom();

    startEmulator(preStartCallback: Function): IMemory {
        return this.fakemem;
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
        return Buffer.alloc(64 * 1024 * 1024);
    }

    getRomOriginalSize(): number {
        return 32 * 1024 * 1024;
    }

    getRomHeader(): IRomHeader {
        return new GCRomHeader();
    }

    pauseEmulator(): void {
    }

    resumeEmulator(): void {
    }

    getMemoryAccess(): IMemory {
        return this.fakemem;
    }

    setSaveDir(path: string): void {
    }

    getUtils(): IUtils {
        return {} as any;
    }

    getFrameCount(): number {
        return 0;
    }

    setFrameCount(num: number): void {
    }

    on(which: string, callback: any): void {
    }

    getSaveStateManager(): ISaveState {
        return {} as any;
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

    getHiResTextureAccess(): IHiResTexture {
        return {} as any;
    }

    getInternalPlugin(): string {
        return {} as any;
    }

    getRomAccess(): IRomMemory {
        return this.fakerom;
    }
}
