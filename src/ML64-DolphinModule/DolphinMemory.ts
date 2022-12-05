import { Memory, JitInterface } from 'dolphin-js';
import IMemory from 'modloader64_api/IMemory';
import bitwise from 'bitwise';

export class DolphinMemory implements IMemory {

    rdramRead8(addr: number): number {
        return Memory.readU8(addr);
    }
    rdramWrite8(addr: number, value: number): void {
        Memory.writeU8(addr, value);
    }
    rdramRead16(addr: number): number {
        return Memory.readU16BE(addr);
    }
    rdramWrite16(addr: number, value: number): void {
        Memory.writeU16BE(addr, value);
    }
    rdramWrite32(addr: number, value: number): void {
        Memory.writeU32BE(addr, value);
    }
    rdramRead32(addr: number): number {
        return Memory.readU32BE(addr);
    }
    rdramReadBuffer(addr: number, size: number): Buffer {
        return Buffer.from(Memory.readBufferU8(addr, size));
    }
    rdramWriteBuffer(addr: number, buf: Buffer): void {
        Memory.writeBufferU8(addr, buf);
    }
    dereferencePointer(addr: number): number {
        return 0;
    }
    rdramReadS8(addr: number): number {
        return Memory.readS8(addr);
    }
    rdramReadS16(addr: number): number {
        return Memory.readS16BE(addr);
    }
    rdramReadS32(addr: number): number {
        return Memory.readS32BE(addr);
    }
    rdramReadBitsBuffer(addr: number, bytes: number): Buffer {
        return Buffer.from(Memory.readBitsBufferU8(addr, bytes));
    }
    rdramReadBits8(addr: number): Buffer {
        //return Buffer.from(bitwise.byte.read(this.rdramRead8(addr) as any));

        return Buffer.from(Memory.readBitsU8(addr));
    }
    rdramReadBit8(addr: number, bitoffset: number): boolean {
        return Memory.readBitU8(addr, bitoffset);
    }
    rdramWriteBitsBuffer(addr: number, buf: Buffer): void {
        Memory.writeBitsBufferU8(addr, buf);
    }
    // @Sylvain - writeBitsU8 appears to be broken.
    rdramWriteBits8(addr: number, buf: Buffer): void {
        /*         let arr = [...buf];
                let b = bitwise.byte.write(arr as any);
                this.rdramWrite8(addr, b); */

        Memory.writeBitsU8(addr, buf);
    }
    rdramWriteBit8(addr: number, bitoffset: number, bit: boolean): void {
        Memory.writeBitU8(addr, bitoffset, bit);
    }
    rdramReadPtr8(addr: number, offset: number): number {
        return Memory.readPtrU8(addr, offset);
    }
    rdramWritePtr8(addr: number, offset: number, value: number): void {
        Memory.writePtrU8(addr, offset, value);
    }
    rdramReadPtr16(addr: number, offset: number): number {
        return Memory.readPtrU16BE(addr, offset);
    }
    rdramWritePtr16(addr: number, offset: number, value: number): void {
        Memory.writePtrU16BE(addr, offset, value);
    }
    rdramWritePtr32(addr: number, offset: number, value: number): void {
        Memory.writePtrU32BE(addr, offset, value);
    }
    rdramReadPtr32(addr: number, offset: number): number {
        return Memory.readPtrU32BE(addr, offset);
    }
    rdramReadPtrBuffer(addr: number, offset: number, size: number): Buffer {
        return Buffer.from(Memory.readPtrBufferU8(addr, offset, size));
    }
    rdramWritePtrBuffer(addr: number, offset: number, buf: Buffer): void {
        Memory.writePtrBufferU8(addr, offset, buf);
    }
    rdramReadPtrS8(addr: number, offset: number): number {
        return Memory.readPtrS8(addr, offset);
    }
    rdramReadPtrS16(addr: number, offset: number): number {
        return Memory.readPtrS16BE(addr, offset);
    }
    rdramReadPtrS32(addr: number, offset: number): number {
        return Memory.readPtrS32BE(addr, offset);
    }
    rdramReadPtrBitsBuffer(addr: number, offset: number, bytes: number): Buffer {
        return Buffer.from(Memory.readPtrBitsBufferU8(addr, offset, bytes));
    }
    rdramReadPtrBits8(addr: number, offset: number): Buffer {
        return Buffer.from(Memory.readPtrBitsU8(addr, offset));
    }
    rdramReadPtrBit8(addr: number, offset: number, bitoffset: number): boolean {
        return Memory.readPtrBitU8(addr, offset, bitoffset);
    }
    rdramWritePtrBitsBuffer(addr: number, offset: number, buf: Buffer): void {
        Memory.writePtrBitsBufferU8(addr, offset, buf);
    }
    rdramWritePtrBits8(addr: number, offset: number, buf: Buffer): void {
        Memory.writePtrBitsU8(addr, offset, buf)
    }
    rdramWritePtrBit8(addr: number, offset: number, bitoffset: number, bit: boolean): void {
        Memory.writePtrBitU8(addr, offset, bitoffset, bit)
    }
    rdramReadF32(addr: number): number {
        return Memory.readF32BE(addr);
    }
    rdramReadPtrF32(addr: number, offset: number): number {
        return Memory.readPtrF32BE(addr, offset);
    }
    rdramWriteF32(addr: number, value: number): void {
        Memory.writeF32BE(addr, value);
    }
    rdramWritePtrF32(addr: number, offset: number, value: number): void {
        Memory.writePtrF32BE(addr, offset, value);
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
    getRdramBuffer(): ArrayBuffer {
        return new ArrayBuffer(0);
    }
    rdramRead64(addr: number): number {
        return 0;
    }
    rdramReadS64(addr: number): number {
        return 0;
    }
    rdramReadF64(addr: number): number {
        return Memory.readF64BE(addr);
    }
    rdramWrite64(addr: number, val: number): void {
        Memory.writeU64BE(addr, val);
    }
    rdramWriteF64(addr: number, val: number): void {
        Memory.writeF64BE(addr, val);
    }
    rdramReadBigInt64(addr: number): BigInt {
        throw new Error('Method not implemented.');
    }
    rdramReadBigIntS64(addr: number): BigInt {
        throw new Error('Method not implemented.');
    }
    rdramWriteBigInt64(addr: number, val: BigInt): void {
        throw new Error('Method not implemented.');
    }

    u8: number[] = [];
    u16: number[] = [];
    u32: number[] = [];
    u64: number[] = [];
    s8: number[] = [];
    s16: number[] = [];
    s32: number[] = [];
    s64: number[] = [];
    f32: number[] = [];
    f64: number[] = [];

    invalidateCachedCode(address?: number | undefined, size?: number | undefined, forced?: boolean | undefined): void {
        JitInterface.clearCache();
    }

}