export class EntrepriseRegistration {        
    address: string;
    postalCode: number;
    city: string;  

    public constructor(init?: Partial<EntrepriseRegistration>) {
        Object.assign(this, init);
    }
}