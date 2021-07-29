import { Schema, model } from "mongoose";
import { IsDefined, Matches } from "class-validator";
import { Expose } from "class-transformer";
import randomString from "../utils/RandomString";
import { log } from "util";

export enum Role {
    Student,
    Professor,
    Admin,
}

const regex = {
    username: /^[A-Za-z_][A-Za-z0-9_]{3,31}$/,
    password: /^.{8,1024}$/,
    email: /^.+@.+$/,
};

export class LoginCredentials {
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

export class RegisterUser {
    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.username))
    username: string;

    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.password))
    password: string;

    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.email))
    email: string;

    @IsDefined()
    @Expose()
    fullname: string;

    assign(registerUser: any): RegisterUser {
        this.username = registerUser.username;
        this.password = registerUser.password;
        this.email = registerUser.email;
        this.fullname = registerUser.fullname;
        return this;
    }
}

export class User {
    _id: number;
    username: string;
    password: string;
    email: string;
    fullname: string;
    role: Role = Role.Student;
    activationCode?: string = randomString();
    resetCode?: string = undefined;
    blocked: boolean = false;

    assign(user: any): User {
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.fullname = user.fullname;
        return this;
    }
}

const schema = new Schema<User>({
    username: {
        type: String,
        required: true,
        createIndexes: true,
        dropDups: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        type: Role,
        required: false,
        default: Role.Student,
    },
    activationCode: {
        type: String,
        required: false,
        default: randomString(),
    },
    resetCode: {
        type: String,
        required: false,
        default: null,
    },
    blocked: {
        type: Boolean,
        required: false,
        default: false,
    },
});

export default model<User>("Users", schema);
