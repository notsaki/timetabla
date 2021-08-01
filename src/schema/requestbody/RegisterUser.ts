import { IsDefined, Matches } from "class-validator";
import { Expose } from "class-transformer";
import { regex } from "../database/UserSchema";

class RegisterUser {
    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.username))
    username: string;

    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.password))
    password: string;

    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.email))
    email: string;

    @IsDefined()
    @Expose()
    fullname: string;
}

export default RegisterUser;
