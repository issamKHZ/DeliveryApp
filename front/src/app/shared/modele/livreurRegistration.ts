import { VehicleType } from "./enumerate/VehicleTypes";

export class LivreurRegistration {    
    firstName: string;
    lastName: string;
    age: number;
    vehicleType: VehicleType;

    public constructor(init?: Partial<LivreurRegistration>) {
        Object.assign(this, init);
    }
}