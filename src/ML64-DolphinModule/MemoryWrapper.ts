import IMemory from "modloader64_api/IMemory";
import { IRomMemory } from "modloader64_api/IRomMemory";
import { Dolphin } from "./Sylvain/Dolphin/Dolphin";

export class DolphinMemoryWrapper implements IMemory, IRomMemory {

    dolphin!: Dolphin;

    constructor(emu: any) {
        this.dolphin = emu;
    }

    /** @todo implement these */
    rdramRead64(addr: number): number {
        throw new Error("Method not implemented.");
    }

    rdramReadS64(addr: number): number {
        throw new Error("Method not implemented.");
    }

    rdramReadF64(addr: number): number {
        throw new Error("Method not implemented.");
    }

    rdramWrite64(addr: number, val: number): void {
        throw new Error("Method not implemented.");
    }

    rdramWriteF64(addr: number, val: number): void {
        throw new Error("Method not implemented.");
    }

    rdramReadBigInt64(addr: number): BigInt {
        throw new Error("Method not implemented.");
    }

    rdramReadBigIntS64(addr: number): BigInt {
        throw new Error("Method not implemented.");
    }

    rdramWriteBigInt64(addr: number, val: BigInt): void {
        throw new Error("Method not implemented.");
    }
    
    romRead8(addr: number): number {
        return 0;
    }
    romWrite8(addr: number, value: number): void {
    }
    romRead16(addr: number): number {
        return 0;
    }
    romWrite16(addr: number, value: number): void {
    }
    romRead32(addr: number): number {
        return 0;
    }
    romWrite32(addr: number, value: number): void {
    }
    romReadBuffer(addr: number, size: number): Buffer {
        return Buffer.alloc(size);
    }
    romWriteBuffer(addr: number, buf: Buffer): void {
    }
    getRomBuffer(): Buffer {
        return Buffer.alloc(0x1);
    }

    rdramRead8(addr: number): number {
        return this.dolphin.Memmap.readU8(addr);
    }
    rdramWrite8(addr: number, value: number): void {
        return this.dolphin.Memmap.writeU8(addr, value);
    }
    rdramRead16(addr: number): number {
        return this.dolphin.Memmap.readU16BE(addr);
    }
    rdramWrite16(addr: number, value: number): void {
        return this.dolphin.Memmap.writeU16BE(addr, value);
    }
    rdramWrite32(addr: number, value: number): void {
        return this.dolphin.Memmap.writeU32BE(addr, value);
    }
    rdramRead32(addr: number): number {
        return this.dolphin.Memmap.readU32BE(addr);
    }
    rdramReadBuffer(addr: number, size: number): Buffer {
        return Buffer.from(this.dolphin.Memmap.readBufferU8(addr, size));
    }
    rdramWriteBuffer(addr: number, buf: Buffer): void {
        return this.dolphin.Memmap.writeBufferU8(addr, buf);
    }
    dereferencePointer(addr: number): number {
        return this.dolphin.Memmap.derefPtr(addr);
    }
    rdramReadS8(addr: number): number {
        return this.dolphin.Memmap.readS8(addr);
    }
    rdramReadS16(addr: number): number {
        return this.dolphin.Memmap.readS16BE(addr);
    }
    rdramReadS32(addr: number): number {
        return this.dolphin.Memmap.readS32BE(addr);
    }
    rdramReadBitsBuffer(addr: number, bytes: number): Buffer {
        return Buffer.from(this.dolphin.Memmap.readBitsBufferU8(addr, bytes));
    }
    rdramReadBits8(addr: number): Buffer {
        return Buffer.from(this.dolphin.Memmap.readBitsU8(addr));
    }
    rdramReadBit8(addr: number, bitoffset: number): boolean {
        return this.dolphin.Memmap.readBitU8(addr, bitoffset);
    }
    rdramWriteBitsBuffer(addr: number, buf: Buffer): void {
        return this.dolphin.Memmap.writeBitsBufferU8(addr, buf);
    }
    rdramWriteBits8(addr: number, buf: Buffer): void {
        return this.dolphin.Memmap.writeBitsU8(addr, buf);
    }
    rdramWriteBit8(addr: number, bitoffset: number, bit: boolean): void {
        return this.dolphin.Memmap.writeBitU8(addr, bitoffset, bit);
    }
    rdramReadPtr8(addr: number, offset: number): number {
        return this.dolphin.Memmap.readPtrU8(addr, offset);
    }
    rdramWritePtr8(addr: number, offset: number, value: number): void {
        return this.dolphin.Memmap.writePtrU8(addr, offset, value);
    }
    rdramReadPtr16(addr: number, offset: number): number {
        return this.dolphin.Memmap.readPtrU16BE(addr, offset);
    }
    rdramWritePtr16(addr: number, offset: number, value: number): void {
        return this.dolphin.Memmap.writePtrU16BE(addr, offset, value);
    }
    rdramWritePtr32(addr: number, offset: number, value: number): void {
        return this.dolphin.Memmap.writePtrU32BE(addr, offset, value);
    }
    rdramReadPtr32(addr: number, offset: number): number {
        return this.dolphin.Memmap.readPtrU32BE(addr, offset);
    }
    rdramReadPtrBuffer(addr: number, offset: number, size: number): Buffer {
        return Buffer.from(this.dolphin.Memmap.readPtrBufferU8(addr, offset, size));
    }
    rdramWritePtrBuffer(addr: number, offset: number, buf: Buffer): void {
        return this.dolphin.Memmap.writePtrBufferU8(addr, offset, buf);
    }
    rdramReadPtrS8(addr: number, offset: number): number {
        return this.dolphin.Memmap.readPtrS8(addr, offset);
    }
    rdramReadPtrS16(addr: number, offset: number): number {
        return this.dolphin.Memmap.readPtrS16BE(addr, offset);
    }
    rdramReadPtrS32(addr: number, offset: number): number {
        return this.dolphin.Memmap.readPtrS32BE(addr, offset);
    }
    rdramReadPtrBitsBuffer(addr: number, offset: number, bytes: number): Buffer {
        return Buffer.from(this.dolphin.Memmap.readPtrBitsBufferU8(addr, offset, bytes));
    }
    rdramReadPtrBits8(addr: number, offset: number): Buffer {
        return Buffer.from(this.dolphin.Memmap.readPtrBitsU8(addr, offset));
    }
    rdramReadPtrBit8(addr: number, offset: number, bitoffset: number): boolean {
        return this.dolphin.Memmap.readPtrBitU8(addr, offset, bitoffset);
    }
    rdramWritePtrBitsBuffer(addr: number, offset: number, buf: Buffer): void {
        return this.dolphin.Memmap.writePtrBitsBufferU8(addr, offset, buf);
    }
    rdramWritePtrBits8(addr: number, offset: number, buf: Buffer): void {
        return this.dolphin.Memmap.writePtrBitsU8(addr, offset, buf);
    }
    rdramWritePtrBit8(addr: number, offset: number, bitoffset: number, bit: boolean): void {
        return this.dolphin.Memmap.writePtrBitU8(addr, offset, bitoffset, bit);
    }
    rdramReadF32(addr: number): number {
        return this.dolphin.Memmap.readF32BE(addr);
    }
    rdramReadPtrF32(addr: number, offset: number): number {
        return this.dolphin.Memmap.readPtrF32BE(addr, offset);
    }
    rdramWriteF32(addr: number, value: number): void {
        return this.dolphin.Memmap.writeF32BE(addr, value);
    }
    rdramWritePtrF32(addr: number, offset: number, value: number): void {
        return this.dolphin.Memmap.writePtrF32BE(addr, offset, value);
    }
    bitCount8(value: number): number {
        return 0;
    }
    bitCount16(value: number): number {
        return 0;
    }
    bitCount32(value: number): number {
        return 0;
    }
    bitCountBuffer(buf: Buffer, off: number, len: number): number {
        return 0;
    }
    getRdramBuffer(): Buffer {
        return Buffer.alloc(1);
    }
    invalidateCachedCode(address?: number, size?: number, forced?: boolean): void {
        this.dolphin.JitInterface.invalidateICache(address!, size!, forced!);
    }

}