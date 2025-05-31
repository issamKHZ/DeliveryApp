export class UserAfterValid {    
    
    redirectToLogin: boolean;
    token: string;
    loginToken: string;
    message: string;

    public constructor(init?: Partial<UserAfterValid>) {
        Object.assign(this, init);
    }
}