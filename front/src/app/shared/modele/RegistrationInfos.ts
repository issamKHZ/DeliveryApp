import { EntrepriseRegistration } from "./entrepriseRegistration";
import { LivreurRegistration } from "./livreurRegistration";
import { UserRegistration } from "./UserRegistration";

export class RegistrationInfos {    
    user: UserRegistration;
    entreprise: EntrepriseRegistration;
    livreur: LivreurRegistration;

    public constructor(init?: Partial<RegistrationInfos>) {
        Object.assign(this, init);
    }
}