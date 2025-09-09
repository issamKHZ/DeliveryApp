import { TagSeverity } from "../../components/utils/custom-tag/custom-tag.component";


export class Sieges {
    id: number;
    typeCode: string;
    adresse: string;    
    city: string;
    country: string;
    dispoCode: string;    
    email: string;
    phone: string;
    isDest: boolean;
    editing?: boolean;
    editStorage?: boolean;
    originalData?: Sieges;
    entrepriseId?: string;

    public constructor(init?: Partial<Sieges>) {
        Object.assign(this, init);
    }
}