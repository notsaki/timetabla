import { IsDefined } from "class-validator";
import { Expose } from "class-transformer";

export class LoginCredentials {
    @IsDefined()
    @Expose()
    password: string;

    @IsDefined()
    @Expose()
    username: string;
}

export default LoginCredentials;
