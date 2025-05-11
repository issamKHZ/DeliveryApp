export class EntrepriseRegistration {    
    name!: string;    
    email!: string;    
    password!: string;
    adresse!: string;
    postal!: number;
    ville!: string;
    phone!: string;    

    public constructor(init?: Partial<EntrepriseRegistration>) {
        Object.assign(this, init);
    }
}