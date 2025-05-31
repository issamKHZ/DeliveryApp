import { TagSeverity } from "../components/utils/custom-tag/custom-tag.component";

export class AccountStatus {
    severity: TagSeverity;
    content: string;
    

    public constructor(init?: Partial<AccountStatus>) {
        Object.assign(this, init);
    }
}