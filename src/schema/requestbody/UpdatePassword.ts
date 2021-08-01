import { IsDefined, Matches } from "class-validator";
import { Expose } from "class-transformer";
import { regex } from "../database/UserSchema";

class UpdatePassword {
    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.password))
    newPassword: string;
    oldPassword: string;

    assign(updatePassword: any): UpdatePassword {
        this.newPassword = updatePassword.newPassword;
        this.oldPassword = updatePassword.oldPassword;
        return this;
    }
}

export default UpdatePassword;
