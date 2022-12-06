import path from 'path';


export function getDolphinLibraryPath() {
    return path.join(__dirname, 'node_modules', 'dolphin-plugin');
}
