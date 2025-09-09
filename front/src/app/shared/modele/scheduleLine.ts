import { Days } from "./enumerate/Days";

export class ScheduleLine {  
      
    day: Days;
    startHour: string;
    endHour: string;
    dispo: boolean;

    public constructor(init?: Partial<ScheduleLine>) {
        Object.assign(this, init);
    }
}