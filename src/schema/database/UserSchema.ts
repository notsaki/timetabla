import mongoose, { Schema, model } from "mongoose";
import randomString from "../../utils/RandomString";

export enum Role {
    Guest,
    Student,
    Professor,
    Admin,
}

export const regex = {
    username: /^[A-Za-z_][A-Za-z0-9_]{3,31}$/,
    password: /^.{8,1024}$/,
    email: /^.+@.+$/,
};

export class User {
    _id?: string = undefined;
    username: string;
    password: string;
    email: string;
    fullname: string;
    role: Role = Role.Student;
    activationCode?: string = randomString();
    resetCode?: string = undefined;
    blocked: boolean = false;
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
