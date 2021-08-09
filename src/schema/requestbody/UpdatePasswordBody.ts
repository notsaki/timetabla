import { IsDefined, Matches } from "class-validator";
import { Expose } from "class-transformer";
import { regex } from "../database/UserSchema";

class UpdatePasswordBody {
    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.password))
    newPassword: string;

    @IsDefined()
    @Expose()
    oldPassword: string;
}

export default UpdatePasswordBody;
