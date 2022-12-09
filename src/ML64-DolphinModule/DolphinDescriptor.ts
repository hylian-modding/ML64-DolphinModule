import IConsole, { IConsoleDescriptor } from 'modloader64_api/IConsole';
import { ILogger, IConfig } from 'modloader64_api/IModLoaderAPI';
import { ProxySide } from 'modloader64_api/SidedProxy/SidedProxy';
import { FakeGamecube } from './FakeGamecube';
import path from 'path';

export default class DolphinDescriptor implements IConsoleDescriptor {

    constructConsole(side: ProxySide, rom: string, logger: ILogger, lobby: string, config: IConfig): IConsole {
        if (side === ProxySide.CLIENT) {
            const DolphinConsole = require(path.resolve(__dirname, "DolphinConsole")).default;
            return new DolphinConsole(rom, logger, lobby, config);
        } else {
            return new FakeGamecube(rom, logger, lobby, config);
        }
    }

    getConsoleLabel(): string {
        return "Dolphin";
    }

}