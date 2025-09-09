import { Task } from "./day-descriptif";

export class Schedule {
    day: number;
    month: number;
    year: number;    
    disponibility: boolean;
    livreurID: string;
    livreur_Tasks?: Task[];
    
    public constructor(init?: Partial<Schedule>) {
        Object.assign(this, init);
    }
}