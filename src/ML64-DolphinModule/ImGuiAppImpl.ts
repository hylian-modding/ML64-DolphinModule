import { Core, Gui, AddressSpace } from 'dolphin-js';
import { ImGuiApp } from './ImGuiApp';
import worker_threads from 'worker_threads';
import { ImGui } from 'ml64tk';

export class ImGuiAppImpl extends ImGuiApp {
    private hostWorker!: worker_threads.Worker;
    private mem1View = new ImGui.MemoryEditor();

    constructor() {
        super('ImGui', true);
    }

    onInit() {
        ImGui.getIO().iniFilename = 'data/dolphin_imgui.ini';
    }

    onNewFrame() {
        if (!Core.isRunningAndStarted() || !this.appWindow.isVisible())
            return;

        const mem1 = AddressSpace.get(AddressSpace.Type.Mem1);
        this.mem1View.drawWindow('Mem1', mem1, mem1.byteLength);

        // new imgui frame
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
