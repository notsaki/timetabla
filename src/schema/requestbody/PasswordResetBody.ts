import { IsDefined, Matches } from "class-validator";
import { Expose } from "class-transformer";
import { regex } from "../database/UserSchema";

class PasswordResetBody {
    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.password))
    newPassword: string;
}

export default PasswordResetBody;
