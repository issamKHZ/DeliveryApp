import { Task } from "./day-descriptif";

export class ScheduleDailyCell {
    date: Date;    
    task?: Task;
    slotInTask?: boolean;
    
    public constructor(init?: Partial<ScheduleDailyCell>) {
        Object.assign(this, init);
    }
}