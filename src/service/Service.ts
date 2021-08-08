export default interface Service {
    saveOne(entity: any): Promise<any>;
    saveMany(entity: any[]): Promise<any>;
    findOne(search: object): Promise<any>;
    findMany(search: object): Promise<any[]>;
    updateOne(id: any, data: object): Promise<any>;
    updateMany(search: any, data: object): Promise<any>;
    deleteOne(id: any): Promise<any>;
    deleteMany(search: any): Promise<any>;
    findById(id: string): Promise<any>;
    findByManyIds(id: string[]): Promise<any[]>;
    exists(search: any): Promise<boolean>;
}
