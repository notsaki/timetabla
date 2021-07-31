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

    assign(registerUser: any): RegisterUser {
        this.username = registerUser.username;
        this.password = registerUser.password;
        this.email = registerUser.email;
        this.fullname = registerUser.fullname;
        return this;
    }
}

export default RegisterUser;
