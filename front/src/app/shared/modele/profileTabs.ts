import { EntrepSideBar } from "./enumerate/EntrepSideBar";
import { LivreurSideBar } from "./enumerate/LivreurSideBar";

export class ProfileTabs {    
    
    label: string;
    icon: string;
    route: string;
    code: EntrepSideBar | LivreurSideBar;
    isnotif?: boolean;

    public constructor(init?: Partial<Notification>) {
        Object.assign(this, init);
    }
}