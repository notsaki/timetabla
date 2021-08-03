import RegisterUserBody from "../../src/schema/requestbody/RegisterUserBody";
import { adminLogin, getSessionId } from "./UserLogin";
import { Response } from "superagent";
import AdminRequestBody from "../../src/schema/requestbody/admin/AdminRequestBody";
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../src/Timetabla";
import { Role } from "../../src/schema/database/UserSchema";
const should = chai.should();

chai.use(chaiHttp);

export const defaultUserBody: RegisterUserBody = {
    username: "user",
    password: "password",
    email: "user@timetabla.com",
    fullname: "User",
    role: Role.Student,
};

export default async function createUser(user: RegisterUserBody = defaultUserBody): Promise<Response> {
    let res: Response = await adminLogin();

    const registerUserBody: AdminRequestBody<RegisterUserBody> = {
        adminPassword: "password",
        data: user,
    };

    res = await chai.request(app).post("/api/admin/user").set("Cookie", getSessionId(res)).send(registerUserBody);

    return res;
}
