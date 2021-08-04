import { User } from "./UserSchema";

export class Course {
    _id?: string = undefined;
    name: string;
    professors: User[];
    theoryHours: number;
    labHours: number;
}
