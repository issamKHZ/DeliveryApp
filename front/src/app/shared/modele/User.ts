import { UserRoles } from "./enumerate/userRoles";

export class User {    
    mail!: string;
    fullname!: string;
    lastname!: string;
    adresse!: string;
    phone!: string;
    img?: string;
    role!: UserRoles;
    

    public constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}