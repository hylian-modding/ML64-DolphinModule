import worker_threads from 'worker_threads';
import { Config, Dolphin, Gui } from 'dolphin-js';
import { DolphinStartInfo } from './DolphinStartInfo';
import { getDolphinUserDirectoryPath } from './getDolphinUserDirectoryPath';

const startInfo: DolphinStartInfo = worker_threads.workerData;

Dolphin.startup({
    applicationDisplayName: 'ModLoader64',
    userDirectoryPath: getDolphinUserDirectoryPath()
}, () => {
    Config.setBool('-MAIN_USE_PANIC_HANDLERS', false);
    Config.setBool('-Main,Interface.PlayMode', !startInfo.isConfigure);
    Config.setBool('-Main,Display.RenderToMain', !startInfo.isConfigure);
    Config.setBool('-Main,Interface.HideFPSInfo', false);
});

const processUI = setInterval(() => {
    Dolphin.processOne();
    if (Gui.Application.hasExited()) {
        clearInterval(processUI);
        if (!startInfo.isConfigure)
            Dolphin.enableFrameHandler(false);
        Dolphin.shutdown();
        worker_threads.parentPort?.close();
    }
}, 16);

Gui.MainWindow.setIcon('assets/icon.png');
Gui.MainWindow.show();
Gui.Settings.setToolBarVisible(startInfo.isConfigure);
Gui.Settings.setDebugModeEnabled(false);

if (!startInfo.isConfigure) {
    const debugMenu = Gui.MainWindow.getMenuBar().addMenu('Debug');
    const toggleImGuiAction = debugMenu.addAction('ImGui');
    toggleImGuiAction.checkable = true;
    toggleImGuiAction.setToggledCallback((c) => {
        worker_threads.parentPort?.postMessage({ msg: 'toggleImGuiVisibility', data: c });
    });
    toggleImGuiAction.checked = false;
    toggleImGuiAction.setShortcut('Ctrl+I');

    worker_threads.parentPort?.on('message', value => {
        if (value.msg == 'notifyHideImGui')
            toggleImGuiAction.checked = false;
    });

    Gui.MainWindow.startGame(startInfo.gameFilePath!);
}

const helpMenu = Gui.MainWindow.findMenu('Help');
if (helpMenu) {
    const aboutAction = helpMenu.addAction('About ModLoader64');
    aboutAction.setTriggeredCallback(() => {
        Gui.Q.CommonDialogs.about(Gui.MainWindow.asWidget(), 'About ModLoader64',
            'ModLoader64 is a network capable mod loading system for Nintendo 64 and GameCube games.<br/>' +
            'Its main purpose is creating online multiplayer mods for various games like Ocarina of Time.<br/>' +
            '<a href="https://modloader64.com/">Website</a> <a href="https://discord.gg/nHb4fXX">Discord</a>');
    });
}

worker_threads.parentPort?.postMessage({ msg: 'hostReady' });
