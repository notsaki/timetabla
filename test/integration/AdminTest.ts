import chai, { expect } from "chai";
import { Done } from "@testdeck/core";
import app from "../../src/Timetabla";
import LoginCredentialsBody from "../../src/schema/requestbody/LoginCredentialsBody";
import { Response } from "superagent";
import { resetUserCollectionState } from "../utils/BeforeEach";
import AdminRequestBody from "../../src/schema/requestbody/admin/AdminRequestBody";
import AdminUpdateUsernameBody from "../../src/schema/requestbody/admin/AdminUpdateUsernameBody";
import UserSchema from "../../src/schema/database/UserSchema";
import chaiHttp from "chai-http";
const should = chai.should();

chai.use(chaiHttp);

describe("Admin", () => {
    beforeEach(resetUserCollectionState);

    describe("PUT /api/admin/user/:username/username", () => {
        it("Admin role and valid password should return ok and update user's username", (done: Done) => {
            const loginCredentials: LoginCredentialsBody = {
                username: "admin",
                password: "password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(200);
                    res.body.should.be.not.empty;

                    const sessionCookie: string = res.get("Set-Cookie")[0];

                    const adminUpdateUsernameBody: AdminRequestBody<AdminUpdateUsernameBody> = {
                        adminPassword: loginCredentials.password,
                        data: { newUsername: "new_massrarely" },
                    };

                    chai.request(app)
                        .put("/api/admin/user/massrarely/username")
                        .set("Cookie", sessionCookie)
                        .send(adminUpdateUsernameBody)
                        .end((error: any, res: Response) => {
                            res.should.have.status(200);
                            res.body.should.be.not.empty;

                            UserSchema.exists({ username: "new_massrarely" }, (error: any, res: boolean) => {
                                expect(res).to.be.true;
                                done();
                            });
                        });
                });
        });

        it("Non existent user should return not found", (done: Done) => {
            const loginCredentials: LoginCredentialsBody = {
                username: "admin",
                password: "password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(200);
                    res.body.should.be.not.empty;

                    const sessionCookie: string = res.get("Set-Cookie")[0];

                    const adminUpdateUsernameBody: AdminRequestBody<AdminUpdateUsernameBody> = {
                        adminPassword: loginCredentials.password,
                        data: { newUsername: "new_massrarely" },
                    };

                    chai.request(app)
                        .put("/api/admin/user/non_massrarely/username")
                        .set("Cookie", sessionCookie)
                        .send(adminUpdateUsernameBody)
                        .end((error: any, res: Response) => {
                            res.should.have.status(404);
                            res.body.should.be.not.empty;
                            done();
                        });
                });
        });

        it("Existent new username should return conflict", (done: Done) => {
            const loginCredentials: LoginCredentialsBody = {
                username: "admin",
                password: "password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(200);
                    res.body.should.be.not.empty;

                    const sessionCookie: string = res.get("Set-Cookie")[0];

                    const adminUpdateUsernameBody: AdminRequestBody<AdminUpdateUsernameBody> = {
                        adminPassword: loginCredentials.password,
                        data: { newUsername: "admin" },
                    };

                    chai.request(app)
                        .put("/api/admin/user/massrarely/username")
                        .set("Cookie", sessionCookie)
                        .send(adminUpdateUsernameBody)
                        .end((error: any, res: Response) => {
                            res.should.have.status(409);
                            res.body.should.be.not.empty;
                            done();
                        });
                });
        });
    });
});
