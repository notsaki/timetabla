import { Schema, model } from "mongoose";
import { IsDefined, Matches } from "class-validator";
import { Expose } from "class-transformer";
import randomString from "../utils/RandomString";

export enum Role {
    Student,
    Professor,
    Admin,
}

export class RegisterUser {
    @IsDefined()
    @Expose()
    @Matches(RegExp(/^[A-Za-z_][A-Za-z0-9_]{3,31}$/))
    username: string;

    @IsDefined()
    @Expose()
    @Matches(RegExp(/^.{8,1024}$/))
    password: string;

    @IsDefined()
    @Expose()
    @Matches(RegExp(/^.+@.+$/))
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
    @IsDefined()
    @Expose()
    @Matches(RegExp(/^[A-Za-z_][A-Za-z0-9_]{3,31}$/))
    username: string;

    @IsDefined()
    @Expose()
    @Matches(RegExp(/^.{8,1024}$/))
    password: string;

    @IsDefined()
    @Expose()
    @Matches(RegExp(/^.+@.+$/))
    email: string;

    @IsDefined()
    @Expose()
    @Matches(RegExp(/^(\\p{L}|[ ,.'-]){1,64}$/))
    fullname: string;

    @IsDefined()
    @Expose()
    role: Role = Role.Student;

    @IsDefined()
    @Expose()
    activationCode?: string = randomString();

    @IsDefined()
    @Expose()
    resetCode?: string = undefined;

    @IsDefined()
    @Expose()
    blocked: boolean = false;

    assign(registerUser: RegisterUser): User {
        this.username = registerUser.username;
        this.password = registerUser.password;
        this.email = registerUser.email;
        this.fullname = registerUser.fullname;
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
