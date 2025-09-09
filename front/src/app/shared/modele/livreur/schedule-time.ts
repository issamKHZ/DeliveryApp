export class ScheduleTime {
    month: number;
    year: number;
    livreurID: string;

    public constructor(init?: Partial<ScheduleTime>) {
        Object.assign(this, init);
    }
}