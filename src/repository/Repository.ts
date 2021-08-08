export default interface Repository<T> {
    saveOne(entry: T): Promise<T>;
    saveMany(entries: T[]): Promise<T[]>;
    deleteOne(id: string): Promise<void>;
    deleteMany(search: object): Promise<void>;
    findOne(search: object): Promise<T>;
    findMany(search: object): Promise<T[]>;
    findById(id: string): Promise<T>;
    exists(search: object): Promise<boolean>;
    count(search: object): Promise<number>;
    updateOne(id: string, update: object): Promise<void>;
    updateMany(search: object, update: object): Promise<void>;
}
