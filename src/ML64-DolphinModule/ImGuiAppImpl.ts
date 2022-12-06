import { Core, Gui, AddressSpace } from 'dolphin-js';
import { ImGuiApp } from './ImGuiApp';
import { ImGui } from 'ml64tk';

export class ImGuiAppImpl extends ImGuiApp {
    private toggleImGuiAction!: Gui.Q.Action;
    private mem1View = new ImGui.MemoryEditor();
    framecallback: Function | undefined;

    constructor() {
        super('ImGui', true);
    }

    onInit() {
        ImGui.getIO().iniFilename = 'data/dolphin_imgui.ini';
    }

    onNewFrame() {
        const mem1 = AddressSpace.get(AddressSpace.Type.Mem1);
        this.mem1View.drawWindow('Mem1', mem1, mem1.byteLength);

        if (this.framecallback !== undefined) this.framecallback();
    }

    onClose() {
        this.toggleImGuiAction.checked = false;
        return !Core.isRunningAndStarted();
    }

    setToggleImGuiAction(a: Gui.Q.Action) {
        this.toggleImGuiAction = a;
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
