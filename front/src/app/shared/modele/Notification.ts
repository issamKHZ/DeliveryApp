import { NotifType } from "./enumerate/NotifType";

export class Notification {    
    
    title: string;
    subject: string;
    message: string;
    type: NotifType;
    sub_type: string;
    source?: string;
    readed: boolean;
    style?: string;
    color?: string;

    public constructor(init?: Partial<Notification>) {
        Object.assign(this, init);
    }
}