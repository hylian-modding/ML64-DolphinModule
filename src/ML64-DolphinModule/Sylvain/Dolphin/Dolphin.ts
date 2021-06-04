import * as path from 'path'

export interface CreateInfo {
  orgName: string,
  orgDomain: string,
  appName: string,
  appDisplayName: string,
  baseDir: string,
  userDir: string
}

export interface BootInfo {
  path: string,
  isNandTitle: boolean,
  savestatePath?: string
}

export enum CoreState {
  Uninitialized, Paused, Running, Stopping, Starting
};

export interface JitInterface {
  invalidateICache(address: number, size: number, forced: boolean): void;
}

export interface Memmap {
  memset(address: number, value: number, size: number): void;

  readU8(address: number): number;
  readU16LE(address: number): number;
  readU32LE(address: number): number;
  readU64LE(address: number): bigint;
  readF32LE(address: number): number;
  readF64LE(address: number): number;
  readU16BE(address: number): number;
  readU32BE(address: number): number;
  readU64BE(address: number): bigint;
  readF32BE(address: number): number;
  readF64BE(address: number): number;
  readS8(address: number): number;
  readS16LE(address: number): number;
  readS32LE(address: number): number;
  readS64LE(address: number): bigint;
  readS16BE(address: number): number;
  readS32BE(address: number): number;
  readS64BE(address: number): bigint;
  readBufferU8(address: number, size: number): Uint8Array;
  readBitU8(address: number, bitOffset: number): boolean;
  readBitsU8(address: number): Uint8Array;
  readBitsBufferU8(address: number, size: number): Uint8Array;
  writeU8(address: number, value: number): void;
  writeU16LE(address: number, value: number): void;
  writeU32LE(address: number, value: number): void;
  writeU64LE(address: number, value: bigint): void;
  writeF32LE(address: number, value: number): void;
  writeF64LE(address: number, value: number): void;
  writeU16BE(address: number, value: number): void;
  writeU32BE(address: number, value: number): void;
  writeU64BE(address: number, value: bigint): void;
  writeF32BE(address: number, value: number): void;
  writeF64BE(address: number, value: number): void;
  writeBufferU8(address: number, data: Uint8Array): void;
  writeBitU8(address: number, bitOffset: number, set: boolean): void;
  writeBitsU8(address: number, data: Uint8Array): void;
  writeBitsBufferU8(address: number, data: Uint8Array): void;

  derefPtr(address: number): number;
  readPtrU8(address: number, offset: number): number;
  readPtrU16LE(address: number, offset: number): number;
  readPtrU32LE(address: number, offset: number): number;
  readPtrU64LE(address: number, offset: number): bigint;
  readPtrF32LE(address: number, offset: number): number;
  readPtrF64LE(address: number, offset: number): number;
  readPtrU16BE(address: number, offset: number): number;
  readPtrU32BE(address: number, offset: number): number;
  readPtrU64BE(address: number, offset: number): bigint;
  readPtrF32BE(address: number, offset: number): number;
  readPtrF64BE(address: number, offset: number): number;
  readPtrS8(address: number, offset: number): number;
  readPtrS16LE(address: number, offset: number): number;
  readPtrS32LE(address: number, offset: number): number;
  readPtrS64LE(address: number, offset: number): bigint;
  readPtrS16BE(address: number, offset: number): number;
  readPtrS32BE(address: number, offset: number): number;
  readPtrS64BE(address: number, offset: number): bigint;
  readPtrBufferU8(address: number, offset: number, size: number): Uint8Array;
  readPtrBitU8(address: number, offset: number, bitOffset: number): boolean;
  readPtrBitsU8(address: number, offset: number): Uint8Array;
  readPtrBitsBufferU8(address: number, offset: number, size: number): Uint8Array;
  writePtrU8(address: number, offset: number, value: number): void;
  writePtrU16LE(address: number, offset: number, value: number): void;
  writePtrU32LE(address: number, offset: number, value: number): void;
  writePtrU64LE(address: number, offset: number, value: bigint): void;
  writePtrF32LE(address: number, offset: number, value: number): void;
  writePtrF64LE(address: number, offset: number, value: number): void;
  writePtrU16BE(address: number, offset: number, value: number): void;
  writePtrU32BE(address: number, offset: number, value: number): void;
  writePtrU64BE(address: number, offset: number, value: bigint): void;
  writePtrF32BE(address: number, offset: number, value: number): void;
  writePtrF64BE(address: number, offset: number, value: number): void;
  writePtrBufferU8(address: number, offset: number, data: Uint8Array): void;
  writePtrBitU8(address: number, offset: number, bitOffset: number, set: boolean): void;
  writePtrBitsU8(address: number, offset: number, data: Uint8Array): void;
  writePtrBitsBufferU8(address: number, offset: number, data: Uint8Array): void;
}

export module AddressSpace {

export enum Type {
  Effective, Auxiliary, Physical, Mem1, Mem2, Fake
}

export interface Accessors {
  isValidAddress(address: number): boolean;
  memset(address: number, value: number, size: number): void;

  readU8(address: number): number;
  readU16LE(address: number): number;
  readU32LE(address: number): number;
  readU64LE(address: number): bigint;
  readF32LE(address: number): number;
  readF64LE(address: number): number;
  readU16BE(address: number): number;
  readU32BE(address: number): number;
  readU64BE(address: number): bigint;
  readF32BE(address: number): number;
  readF64BE(address: number): number;
  readS8(address: number): number;
  readS16LE(address: number): number;
  readS32LE(address: number): number;
  readS64LE(address: number): bigint;
  readS16BE(address: number): number;
  readS32BE(address: number): number;
  readS64BE(address: number): bigint;
  readBufferU8(address: number, size: number): Uint8Array;
  readBitU8(address: number, bitOffset: number): boolean;
  readBitsU8(address: number): Uint8Array;
  readBitsBufferU8(address: number, size: number): Uint8Array;
  writeU8(address: number, value: number): void;
  writeU16LE(address: number, value: number): void;
  writeU32LE(address: number, value: number): void;
  writeU64LE(address: number, value: bigint): void;
  writeF32LE(address: number, value: number): void;
  writeF64LE(address: number, value: number): void;
  writeU16BE(address: number, value: number): void;
  writeU32BE(address: number, value: number): void;
  writeU64BE(address: number, value: bigint): void;
  writeF32BE(address: number, value: number): void;
  writeF64BE(address: number, value: number): void;
  writeBufferU8(address: number, data: Uint8Array): void;
  writeBitU8(address: number, bitOffset: number, set: boolean): void;
  writeBitsU8(address: number, data: Uint8Array): void;
  writeBitsBufferU8(address: number, data: Uint8Array): void;

  get(): ArrayBuffer;
  search(haystackOffset: number, needle: Uint8Array, forward: boolean): number | undefined;
}

}

export interface AddressSpace {
  getAccessors(addressSpace: AddressSpace.Type): AddressSpace.Accessors;
}

export class Dolphin {
  private module: any;
  private frontend: any;
  private createInfo?: CreateInfo;
  private eventHandler?: NodeJS.Timeout = undefined;
  private mtCbHandler?: NodeJS.Timeout = undefined;
  private numTicks = 0;
  private coreState = -1;

  public onTick?: () => void = undefined;
  public onImGui?: () => void = undefined;
  public onStateChanged?: (newState: CoreState) => void = undefined;

  public constructor(createInfo: CreateInfo) {
    this.module = require(path.join(process.cwd(), "dolphin", "binding", 'dolphin.node'));
    this.frontend = new this.module.Frontend();
    this.createInfo = createInfo;
  }

  public start(bootInfo: BootInfo) {
    this.frontend.initialize(this.createInfo);
    delete this.createInfo;
    this.eventHandler = setInterval((() => this.frontend.processEvents(4)).bind(this), 16);
    this.mtCbHandler = setInterval(this.handleMtCb.bind(this), 0);
    this.bindCallbacks();
    this.frontend.enableMtCallbacks();
    this.frontend.startup(bootInfo);
    this.handleStateChanged(0);
  }

  private bindCallbacks() {
    this.frontend.on('state-changed', this.handleStateChanged.bind(this));
    this.frontend.on('stop-requested', this.handleStopRequested.bind(this));
    this.frontend.on('stop-complete', this.handleStopComplete.bind(this));
    this.frontend.on('exit-requested', this.handleExitRequested.bind(this));
  }

  private handleStateChanged(newState: CoreState) {
    if (this.coreState != newState) {
      try { if (this.onStateChanged) this.onStateChanged(newState); }
      finally { this.coreState = newState; }
    }
  }

  private handleStopRequested(): boolean {
    if (this.coreState == CoreState.Uninitialized) return true;
    if (this.numTicks < 30) return false;
    let v: boolean = this.frontend.requestStop();
    if (v) this.frontend.disableMtCallbacks();
    return v;
  }

  private handleStopComplete() {
    this.numTicks = 0;
  }

  private handleExitRequested() {
    if (this.eventHandler) clearInterval(this.eventHandler);
    this.frontend.shutdown();
    if (this.mtCbHandler) clearInterval(this.mtCbHandler);
  }

  private handleMtCb() {
    if (this.frontend.isOnTickPending()) {
      this.frontend.signalHandlingOnTick();
      ++this.numTicks;
      try { if (this.onTick) this.onTick(); }
      finally { this.frontend.unlockOnTick(); }
    }

    if (this.frontend.isOnImGuiPending()) {
      this.frontend.signalHandlingOnImGui();
      try { if (this.onImGui) this.onImGui(); }
      finally { this.frontend.unlockOnImGui(); }
    }
  }

  public displayMessage(text: string, timeMs: number) {
    this.frontend.displayMessage(text, timeMs);
  }

  public button(text: string): boolean {
    return this.frontend.button(text);
  }

  public get JitInterface(): JitInterface {
    return this.module.JitInterface;
  }

  public get Memmap(): Memmap {
    return this.module.Memmap;
  }

  public get AddressSpace(): AddressSpace {
    return this.module.AddressSpace;
  }
}
