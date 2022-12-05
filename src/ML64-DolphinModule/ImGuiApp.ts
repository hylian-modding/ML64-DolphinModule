import { $, AppWindow, Gui, ImGui } from 'ml64tk'

export abstract class ImGuiApp {
    protected appWindow: AppWindow;
    private darkMode = false;

    constructor(title: string, viewports?: boolean) {
        this.appWindow = new AppWindow(false, viewports ? viewports : false);
        this.appWindow.on('init', this.init.bind(this));
        this.appWindow.on('new-frame', this.newFrame.bind(this));
        this.appWindow.on('close', this.onClose.bind(this));
        this.appWindow.title = title;
        this.appWindow.clearColor = $.rgbaf(0, 0, 0, 1);
    }

    run(): void {
        const process = setInterval((() => {
            if (this.appWindow.doIteration()) {
                clearInterval(process);
                this.onClosed();
            }
        }).bind(this));
    }

    private init(): void {
        this.onInit();
    }

    private newFrame(): void {
        if (!this.darkMode) {
            this.darkMode = true;
            if (process.platform == 'win32') {
                // @ts-ignore
                Gui.useImmersiveDarkMode(ImGui.getWindowViewport(), true);
            }
        }
        this.createMainDockSpace();
        this.onNewFrame();
    }

    private createMainDockSpace(): void {
        const mainViewport = ImGui.getMainViewport();
        ImGui.setNextWindowViewport(mainViewport.id);
        ImGui.setNextWindowPos(mainViewport.workPos, ImGui.Cond.Always);
        ImGui.setNextWindowSize(mainViewport.workSize, ImGui.Cond.Always);
        ImGui.pushStyleVar(ImGui.StyleVar.WindowPadding, $.xy(0, 0));
        ImGui.pushStyleColor(ImGui.Col.DockingEmptyBg, $.rgbaf(0, 0, 0, 0));
        ImGui.begin("##MainWindowDockSpace", undefined,
            ImGui.WindowFlags.NoNav | ImGui.WindowFlags.NoDecoration
            | ImGui.WindowFlags.NoSavedSettings | ImGui.WindowFlags.NoBackground
            | ImGui.WindowFlags.NoBringToFrontOnFocus | ImGui.WindowFlags.NoFocusOnAppearing);
        ImGui.dockSpace(ImGui.getId("MainDockSpace"));
        ImGui.end();
        ImGui.popStyleColor();
        ImGui.popStyleVar();
    }

    onInit(): void {
    }

    onNewFrame(): void {
    }

    onClose(): boolean {
        return true;
    }

    onClosed(): void {
    }
}
