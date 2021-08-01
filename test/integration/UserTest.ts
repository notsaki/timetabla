import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../src/Timetabla";
import { Done } from "@testdeck/core";
import { Response } from "superagent";
import { resetUserCollectionState } from "../utils/BeforeEach";
import LoginCredentialsBody from "../../src/schema/requestbody/LoginCredentialsBody";
import UpdatePasswordBody from "../../src/schema/requestbody/UpdatePasswordBody";
import RegisterUserBody from "../../src/schema/requestbody/RegisterUserBody";
const should = chai.should();

chai.use(chaiHttp);

describe("Users", () => {
    beforeEach(resetUserCollectionState);

    describe("POST /api/user", () => {
        it("Should save a new user to the database", (done: Done) => {
            const user: RegisterUserBody = {
                username: "user",
                password: "password",
                email: "user@domain.com",
                fullname: "User",
            };

            chai.request(app)
                .post("/api/user")
                .send(user)
                .end((error: any, res: Response) => {
                    res.should.have.status(201);
                    res.body.should.be.not.empty;
                    done();
                });
        });

        it("Username already exists. Should respond with conflict response code", (done: Done) => {
            const user: RegisterUserBody = {
                username: "calandrace",
                password: "password",
                email: "user@domain.com",
                fullname: "User",
            };

            chai.request(app)
                .post("/api/user")
                .send(user)
                .end((error: any, res: Response) => {
                    res.should.have.status(409);
                    res.body.should.be.not.empty;
                    done();
                });
        });

        it("Invalidate username format. Should respond with unprocessable entity response code", (done: Done) => {
            const user: RegisterUserBody = {
                username: "25user",
                password: "password",
                email: "user@domain.com",
                fullname: "User",
            };

            chai.request(app)
                .post("/api/user")
                .send(user)
                .end((error: any, res: Response) => {
                    res.should.have.status(422);
                    res.body.should.be.not.empty;
                    done();
                });
        });

        it("Invalidate email format. Should respond with unprocessable entity response code", (done: Done) => {
            const user: RegisterUserBody = {
                username: "user",
                password: "password",
                email: "userdomain.com",
                fullname: "User",
            };

            chai.request(app)
                .post("/api/user")
                .send(user)
                .end((error: any, res: Response) => {
                    res.should.have.status(422);
                    res.body.should.be.not.empty;
                    done();
                });
        });

        it("Invalidate password format. Should respond with unprocessable entity response code", (done: Done) => {
            const user: RegisterUserBody = {
                username: "user",
                password: "pass",
                email: "user@domain.com",
                fullname: "User",
            };

            chai.request(app)
                .post("/api/user")
                .send(user)
                .end((error: any, res: Response) => {
                    res.should.have.status(422);
                    res.body.should.be.not.empty;
                    done();
                });
        });

        it("Invalid json format. Should respond with bad request", (done: Done) => {
            chai.request(app)
                .post("/api/user")
                .send('{"username":"user')
                .end((error: any, res: Response) => {
                    res.should.have.status(422);
                    res.body.should.be.not.empty;
                    done();
                });
        });
    });

    describe("PUT /api/user/password", () => {
        it("Valid old password should return ok and update password sucessfully", (done: Done) => {
            const loginCredentials: LoginCredentialsBody = {
                username: "admin",
                password: "password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(200);
                    res.body.should.not.be.empty;

                    const sessionCookie: string = res.get("Set-Cookie")[0];

                    const updatePassword: UpdatePasswordBody = {
                        oldPassword: loginCredentials.password,
                        newPassword: "new_password",
                    };

                    chai.request(app)
                        .put("/api/user/password")
                        .set("Cookie", sessionCookie)
                        .send(updatePassword)
                        .end((error: any, res: Response) => {
                            res.should.have.status(200);
                            res.body.should.not.be.empty;

                            const loginCredentials: LoginCredentialsBody = {
                                username: "admin",
                                password: updatePassword.newPassword,
                            };

                            chai.request(app)
                                .post("/api/auth/login")
                                .send(loginCredentials)
                                .end((error: any, res: Response) => {
                                    res.should.have.status(200);
                                    res.body.should.not.be.empty;
                                    done();
                                });
                        });
                });
        });

        it("Invalid old password should return unauthorised and not update password", (done: Done) => {
            const loginCredentials: LoginCredentialsBody = {
                username: "admin",
                password: "password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(200);
                    res.body.should.not.be.empty;

                    const sessionCookie: string = res.get("Set-Cookie")[0];

                    const updatePassword: UpdatePasswordBody = {
                        oldPassword: `wrong_${loginCredentials.password}`,
                        newPassword: "new_password",
                    };

                    chai.request(app)
                        .put("/api/user/password")
                        .set("Cookie", sessionCookie)
                        .send(updatePassword)
                        .end((error: any, res: Response) => {
                            res.should.have.status(401);
                            res.body.should.not.be.empty;

                            const loginCredentials: LoginCredentialsBody = {
                                username: "admin",
                                password: "password",
                            };

                            chai.request(app)
                                .post("/api/auth/login")
                                .send(loginCredentials)
                                .end((error: any, res: Response) => {
                                    res.should.have.status(200);
                                    res.body.should.not.be.empty;
                                    done();
                                });
                        });
                });
        });

        it("Unauthorised session should return unauthorised and not update password", (done: Done) => {
            const loginCredentials: LoginCredentialsBody = {
                username: "admin",
                password: "password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(200);
                    res.body.should.not.be.empty;

                    const sessionCookie: string = res.get("Set-Cookie")[0];

                    chai.request(app)
                        .post("/api/auth/logout")
                        .set("Cookie", sessionCookie)
                        .send()
                        .end((error: any, res: Response) => {
                            res.should.have.status(200);
                            res.body.should.not.be.empty;

                            const updatePassword: UpdatePasswordBody = {
                                oldPassword: loginCredentials.password,
                                newPassword: "new_password",
                            };

                            chai.request(app)
                                .put("/api/user/password")
                                .set("Cookie", sessionCookie)
                                .send(updatePassword)
                                .end((error: any, res: Response) => {
                                    res.should.have.status(401);
                                    res.body.should.not.be.empty;

                                    const loginCredentials: LoginCredentialsBody = {
                                        username: "admin",
                                        password: updatePassword.oldPassword,
                                    };

                                    chai.request(app)
                                        .post("/api/auth/login")
                                        .send(loginCredentials)
                                        .end((error: any, res: Response) => {
                                            res.should.have.status(200);
                                            res.body.should.not.be.empty;
                                            done();
                                        });
                                });
                        });
                });
        });

        it("Short new password should return unprocessable entity and not update password", (done: Done) => {
            const loginCredentials: LoginCredentialsBody = {
                username: "admin",
                password: "password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(200);
                    res.body.should.not.be.empty;

                    const sessionCookie: string = res.get("Set-Cookie")[0];

                    const updatePassword: UpdatePasswordBody = {
                        oldPassword: loginCredentials.password,
                        newPassword: "pass",
                    };

                    chai.request(app)
                        .put("/api/user/password")
                        .set("Cookie", sessionCookie)
                        .send(updatePassword)
                        .end((error: any, res: Response) => {
                            res.should.have.status(422);
                            res.body.should.not.be.empty;

                            const loginCredentials: LoginCredentialsBody = {
                                username: "admin",
                                password: updatePassword.oldPassword,
                            };

                            chai.request(app)
                                .post("/api/auth/login")
                                .send(loginCredentials)
                                .end((error: any, res: Response) => {
                                    res.should.have.status(200);
                                    res.body.should.not.be.empty;
                                    done();
                                });
                        });
                });
        });

        it("No session cookie should return unauthorised and not update password", (done: Done) => {
            const updatePassword: UpdatePasswordBody = {
                oldPassword: "password",
                newPassword: "pass",
            };

            chai.request(app)
                .put("/api/user/password")
                .send(updatePassword)
                .end((error: any, res: Response) => {
                    res.should.have.status(401);
                    res.body.should.not.be.empty;

                    const loginCredentials: LoginCredentialsBody = {
                        username: "admin",
                        password: updatePassword.oldPassword,
                    };

                    chai.request(app)
                        .post("/api/auth/login")
                        .send(loginCredentials)
                        .end((error: any, res: Response) => {
                            res.should.have.status(200);
                            res.body.should.not.be.empty;
                            done();
                        });
                });
        });
    });
});
