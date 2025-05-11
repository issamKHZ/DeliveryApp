export class Country {
    code!: string;
    name!: string;
    flag!: string;
    mask!: string;
    placeholder!: string;
    indicatif!: string;
    

    public constructor(init?: Partial<Country>) {
        Object.assign(this, init);
    }
}