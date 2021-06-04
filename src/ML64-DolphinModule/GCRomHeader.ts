import { IRomHeader } from "modloader64_api/IRomHeader";

export class GCRomHeader implements IRomHeader{
    name: string = "";
    country_code: string = "E";
    revision: number = 0;
    id: string = "";
}