import { AccountStatus } from "../AccountStatus";
import { CollectionItem } from "../CollectionItem";
import { ScheduleLine } from "../scheduleLine";

export class InfosLivreur {
    id: string;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    age: number;
    rib: string;
    creationDate: Date;
    adresse?: string;
    postal?: string;
    city?: string;
    country?: string;
    status?: AccountStatus;
    matricule?: string;
    typeVehicle?: string;
    modele?: string;
    langues?: string[];
    horaires?: ScheduleLine[];
    profilImgStr?: string;
    profilImg?: File;
    profilImgResult?: {
        fileContents: string;
        contentType: string;
    };
    vehicleImgStr?: string;
    vehicleImg?: File;
    vehicleImgResult?: {
        fileContents: string;
        contentType: string;
    };
    permisStr: string;
    permis?: File;
    permisResult?: {
        fileContents: string;
        contentType: string;
        fileDownloadName: string;
    };
    permisDownloadName?: string;
    assuranceStr: string;
    assurance?: File;
    assuranceResult?: {
        fileContents: string;
        contentType: string;
        fileDownloadName: string;
    };
    assuranceDownloadName?: string;

    public constructor(init?: Partial<InfosLivreur>) {
        Object.assign(this, init);
    }
}