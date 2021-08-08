import { Role } from "../database/UserSchema";

export default class UserData {
    id?: string;
    username: string;
    email: string;
    fullname: string;
    role: Role = Role.Student;
}
