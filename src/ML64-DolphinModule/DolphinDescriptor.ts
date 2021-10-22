import IConsole, { IConsoleDescriptor } from "modloader64_api/IConsole";
import { IConfig, ILogger } from "modloader64_api/IModLoaderAPI";
import { ProxySide } from "modloader64_api/SidedProxy/SidedProxy";
import { FakeGamecube } from "./FakeGamecube";
import moduleAlias from 'module-alias';
import path from 'path';

export default class DolphinDescriptor implements IConsoleDescriptor {

    constructor() {
        let platformkey = '';
        if (process.env.PROCESSOR_ARCHITECTURE === undefined) {
            platformkey = process.platform.trim() + 'x64';
        } else {
            platformkey = process.platform.trim() + process.env.PROCESSOR_ARCHITECTURE;
        }
        if (platformkey === "win32AMD64") platformkey = "win32x64";
        if (platformkey.indexOf("win32") > -1){
            moduleAlias.addAlias("@dolphin", path.join(process.cwd(), "bindings", "ML64-DolphinModule", "windows"));
        }else{
            moduleAlias.addAlias("@dolphin", path.join(process.cwd(), "bindings", "ML64-DolphinModule", "linux"));
        }
    }

    constructConsole(side: ProxySide, rom: string, logger: ILogger, lobby: string, config: IConfig): IConsole {
        switch (side) {
            case ProxySide.CLIENT:
                let binding: any = require(path.resolve(__dirname, "Gamecube.js")).default;
                return new binding(rom, logger, lobby, config);
            case ProxySide.SERVER:
                return new FakeGamecube(rom, logger, lobby, config);
            default:
                return {} as any;
        }
    }

    getConsoleLabel(): string {
        return "Dolphin";
    }

}