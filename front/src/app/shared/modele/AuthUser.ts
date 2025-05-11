export class AuthUser {    
    mail!: string;
    mdp!: string;

    public constructor(init?: Partial<AuthUser>) {
        Object.assign(this, init);
    }
}