import { IsDefined } from "class-validator";
import { Expose } from "class-transformer";

export class LoginCredentialsBody {
    @IsDefined()
    @Expose()
    password: string;

    @IsDefined()
    @Expose()
    username: string;
}

export default LoginCredentialsBody;
