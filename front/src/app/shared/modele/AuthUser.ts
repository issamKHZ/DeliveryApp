export class AuthUser {    
    email!: string;
    password!: string;

    public constructor(init?: Partial<AuthUser>) {
        Object.assign(this, init);
    }
}