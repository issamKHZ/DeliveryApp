import { UserRoles } from "./enumerate/userRoles";

export class UserRegistration {    
    name: string;    
    email: string;
    password: string;    
    phoneNumber: string; 
    role: UserRoles;   

    public constructor(init?: Partial<UserRegistration>) {
        Object.assign(this, init);
    }
}