import { Core, Gui, AddressSpace } from 'dolphin-js';
import { ImGuiApp } from './ImGuiApp';
import worker_threads from 'worker_threads';
import { ImGui } from 'ml64tk';

export class ImGuiAppImpl extends ImGuiApp {
    private hostWorker!: worker_threads.Worker;
    private mem1View = new ImGui.MemoryEditor();
    framecallback!: () => void;
    Mem1!: Buffer;

    constructor() {
        super('ImGui', true);
    }

    onInit() {
        ImGui.getIO().iniFilename = 'data/dolphin_imgui.ini';
    }

    onNewFrame() {
        if (!Core.isRunningAndStarted() || !this.appWindow.isVisible())
            return;

        if (this.Mem1 === undefined) {
            this.Mem1 = Buffer.from(AddressSpace.get(AddressSpace.Type.Mem1));
        } else {
            this.mem1View.drawWindow('Mem1', this.Mem1.buffer, this.Mem1.buffer.byteLength);
        }

        // new imgui frame

        this.framecallback();
    }

    onClose() {
        this.hostWorker.postMessage({ 'msg': 'notifyHideImGui' });
        return !Core.isRunningAndStarted();
    }

    setHostWorker(w: worker_threads.Worker) {
        this.hostWorker = w;
    }

    show() {
        this.appWindow.show();
    }

    hide() {
        this.appWindow.hide();
    }

    close() {
        this.appWindow.close();
    }
}
