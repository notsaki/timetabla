import { IsDefined, Matches } from "class-validator";
import { Expose } from "class-transformer";
import { regex } from "../database/UserSchema";

class UpdatePassword {
    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.password))
    newPassword: string;
    oldPassword: string;
}

export default UpdatePassword;
