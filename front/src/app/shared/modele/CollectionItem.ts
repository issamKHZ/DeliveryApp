
export class CollectionItem {    
    label: string;
    code: string;        
    public constructor(init?: Partial<CollectionItem>) {
        Object.assign(this, init);
    }
}