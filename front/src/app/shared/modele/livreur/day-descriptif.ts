export class DayDescriptif {
    id?: number;
    date: Date;
    disponibility: boolean;
    tasks?: Task[];
    
    public constructor(init?: Partial<DayDescriptif>) {
        Object.assign(this, init);
    }
}

export class Task {
    title: string;
    startHour: Date;
    endHour: Date;
    description?: string;
    isContinuation?: boolean;

    public constructor(init?: Partial<Task>) {
        Object.assign(this, init);
    }
}