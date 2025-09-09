import { SafeUrl } from "@angular/platform-browser";
import { AccountStatus } from "../AccountStatus";

export class PersonelInfosEntreprise {
    ID: string;
    img: string;
    imgFile: File;
    status: AccountStatus;
    name: string;
    Type: string;
    doc: string;
    mail: string;
    phone: string;
    web?: string;
    imageResult?: {
        fileContents: string;
        contentType: string;
    };

    public constructor(init?: Partial<PersonelInfosEntreprise>) {
        Object.assign(this, init);
    }
}

export class PersonalInfosGeneralDto {
    iD: string;
    name: string;
    email: string;
    phone: string;
    web: string;
    image: FormData;

    public constructor(init?: Partial<PersonalInfosGeneralDto>) {
        Object.assign(this, init);
    }
}