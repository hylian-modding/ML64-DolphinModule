import IConsole, { IConsoleDescriptor } from 'modloader64_api/IConsole';
import { ILogger, IConfig } from 'modloader64_api/IModLoaderAPI';
import { ProxySide } from 'modloader64_api/SidedProxy/SidedProxy';
import DolphinConsole from './DolphinConsole';
import { FakeGamecube } from './FakeGamecube';

export default class DolphinDescriptor implements IConsoleDescriptor {

    constructConsole(side: ProxySide, rom: string, logger: ILogger, lobby: string, config: IConfig): IConsole {
        if (side === ProxySide.CLIENT) {
            return new DolphinConsole(rom, logger, lobby, config);
        } else {
            return new FakeGamecube(rom, logger, lobby, config);
        }
    }

    getConsoleLabel(): string {
        return "Dolphin";
    }

}