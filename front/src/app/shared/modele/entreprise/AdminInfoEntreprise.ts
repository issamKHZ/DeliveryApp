export class AdminInfoEntreprise {    
    responsableName?: string;
    responsableEmail?: string;
    responsablePhone?: string;
    adress?: string;
    postalCode?:string;
    city?: string;
    country?: string;
    siretNumber?: string;
    activitySector?: string[];
    description?: string;
    justificatifDomicil?: string;

    public constructor(init?: Partial<AdminInfoEntreprise>) {
        Object.assign(this, init);
    }
}