import { IsDefined } from "class-validator";
import { Expose } from "class-transformer";

class LoginCredentials {
    @IsDefined()
    @Expose()
    username: string;

    @IsDefined()
    @Expose()
    password: string;

    assign(loginCredentials: any) {
        this.username = loginCredentials.username;
        this.password = loginCredentials.password;
        return this;
    }
}

export default LoginCredentials;
