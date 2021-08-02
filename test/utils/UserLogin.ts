import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../src/Timetabla";
import { Response } from "superagent";
const should = chai.should();

chai.use(chaiHttp);

export async function headAdminLogin(): Promise<Response> {
    return userLogin("admin", "password");
}

export async function adminLogin(): Promise<Response> {
    return userLogin("secretary_office", "password");
}

async function userLogin(username: string, password: string): Promise<Response> {
    return chai.request(app).post("/api/auth/login").send({ username, password });
}

export function getSessionId(res: Response): string {
    return res.get("Set-Cookie")[0].split(";")[0];
}

export default userLogin;
