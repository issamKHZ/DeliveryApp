import { TagSeverity } from "../../components/utils/custom-tag/custom-tag.component";


export class Sieges {
    id: string;
    type: {label: string, code: string};
    adresse: string;    
    villePays: string;
    status: {label: string, code: string};    
    email: string;
    phone: string;
    isDest: boolean;
    editing?: boolean;
    editStorage?: boolean;
    originalData?: Sieges;

    public constructor(init?: Partial<Sieges>) {
        Object.assign(this, init);
    }
}