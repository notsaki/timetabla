import { IsDefined, Matches } from "class-validator";
import { Expose } from "class-transformer";
import { regex, Role } from "../../database/UserSchema";

export class AdminUpdateUsernameBody {
    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.username))
    newUsername: string;
}

export class AdminUpdateFullnameBody {
    @IsDefined()
    @Expose()
    newFullname: string;
}

export class AdminUpdateUserPasswordBody {
    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.password))
    newPassword: string;
}

export class AdminUpdateUserRoleBody {
    @IsDefined()
    @Expose()
    newRole: Role;
}

export class AdminUpdateUserEmailBody {
    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.email))
    newEmail: string;
}

export class AdminBlockUserBody {
    @IsDefined()
    @Expose()
    block: boolean;
}
