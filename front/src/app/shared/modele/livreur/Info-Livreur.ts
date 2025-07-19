import { AccountStatus } from "../AccountStatus";
import { CollectionItem } from "../CollectionItem";

export class InfosLivreur {    
    img: string;
    status: AccountStatus;
    name: string;
    lastname: string;
    immatricule: string;
    dateInscription: Date;
    langue: CollectionItem[];
    horaire: any;
    livMail: string;
    livPhone: string;
    livAdresse: string;
    ville: string;
    codePostal: string;
    vType: string;
    vmatricule: string;
    vmodele: string;
    vImg: string;
    permis: any;
    assurance: any;

    public constructor(init?: Partial<InfosLivreur>) {
        Object.assign(this, init);
    }
}