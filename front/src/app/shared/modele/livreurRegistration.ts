export class LivreurRegistration {    
    name!: string;
    lastname!: string;
    email!: string;
    password!: string;
    vehicle!: string;
    age!: number;
    phone!: string;    

    public constructor(init?: Partial<LivreurRegistration>) {
        Object.assign(this, init);
    }
}