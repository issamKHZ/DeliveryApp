export class AdminInfoEntreprise { 
    iD: string;   
    responsableName?: string;
    responsableEmail?: string;
    responsablePhone?: string;
    adresse?: string;
    postalCode?:string;
    city?: string;
    country?: string;
    siretNumber?: string;
    activitySector?: string[];
    description?: string;
    justificatifDomicil?: string;
    domicileFile: File;
    fileDownloadName?: string;

    public constructor(init?: Partial<AdminInfoEntreprise>) {
        Object.assign(this, init);
    }
}