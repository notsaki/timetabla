import { IsDefined, Matches } from "class-validator";
import { Expose } from "class-transformer";
import { regex } from "../database/UserSchema";

class UpdateUsernameBody {
    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.username))
    username: string;
}

export default UpdateUsernameBody;
