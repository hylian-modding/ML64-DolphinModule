import path from 'path';


export function getDolphinUserDirectoryPath() {
    return path.resolve(process.cwd(), './data/dolphin');
}
