import { NotifType } from "./enumerate/NotifType";

export class Notification {    
    id: number;
    title: string;
    subject: string;
    date: Date;
    message: string;
    type: NotifType;
    sub_type: string;
    source?: string;
    readed: boolean;
    style?: string;
    color?: string;
    isFavoris?: boolean;
    selected?: boolean;
    opened?: boolean;

    public constructor(init?: Partial<Notification>) {
        Object.assign(this, init);
    }
}