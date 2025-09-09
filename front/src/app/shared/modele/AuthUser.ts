export class AuthUser {    
    email!: string;
    password!: string;
    remember: boolean;

    public constructor(init?: Partial<AuthUser>) {
        Object.assign(this, init);
    }
}