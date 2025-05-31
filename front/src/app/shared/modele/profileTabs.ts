import { RoutesEnum } from "./enumerate/routes";

export class ProfileTabs {    
    
    label: string;
    icon: string;
    route: string;
    code: string;

    public constructor(init?: Partial<Notification>) {
        Object.assign(this, init);
    }
}