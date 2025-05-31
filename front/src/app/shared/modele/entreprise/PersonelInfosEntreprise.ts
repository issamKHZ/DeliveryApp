import { AccountStatus } from "../AccountStatus";

export class PersonelInfosEntreprise {
    ID: string;
    img: string;
    status: AccountStatus;    
    name: string;
    Type: string;
    doc: string;
    mail: string;
    phone: string;
    website?: string;

    public constructor(init?: Partial<PersonelInfosEntreprise>) {
        Object.assign(this, init);
    }
}