import { IsDefined, Matches } from "class-validator";
import { Expose } from "class-transformer";
import { regex } from "../../database/UserSchema";

class AdminUpdateUsernameBody {
    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.username))
    newUsername: string;
}

export default AdminUpdateUsernameBody;
