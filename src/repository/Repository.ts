export default interface Repository<T> {
    saveOne(entry: T): Promise<void>;
    saveMany(entries: T[]): Promise<void>;
    deleteOne(id: string): Promise<void>;
    deleteMany(search: object): Promise<void>;
    findOne(id: string): Promise<T>;
    findMany(search: object): Promise<T[]>;
    exists(id: string): Promise<boolean>;
    count(search: object): Promise<number>;
    updateOne(id: string, update: object): Promise<void>;
    updateMany(search: object, update: object): Promise<void>;
}
