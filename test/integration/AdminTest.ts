import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../src/Timetabla";
import { Done } from "@testdeck/core";
import { Response } from "superagent";
import { resetUserCollectionState } from "../utils/BeforeEach";
import LoginCredentialsBody from "../../src/schema/requestbody/LoginCredentialsBody";
import userLogin, { adminLogin, getSessionId, headAdminLogin } from "utils/UserLogin";
import RegisterUserBody from "../../src/schema/requestbody/RegisterUserBody";
import AdminRequestBody from "../../src/schema/requestbody/admin/AdminRequestBody";
import UserSchema, { Role } from "../../src/schema/database/UserSchema";
import AdminUpdateUsernameBody from "../../src/schema/requestbody/admin/AdminUpdateUsernameBody";
const should = chai.should();

chai.use(chaiHttp);

describe("Admin", () => {
    beforeEach(resetUserCollectionState);

    describe("POST /api/admin/user", () => {
        it("Should save a new user to the database", (done: Done) => {
            adminLogin().then((res: Response) => {
                res.should.have.status(200);
                res.body.should.be.not.empty;

                const adminCreateUserBody: AdminRequestBody<RegisterUserBody> = {
                    adminPassword: "password",
                    data: {
                        username: "user",
                        password: "password",
                        email: "user@domain.com",
                        fullname: "User",
                        role: Role.Student,
                    },
                };

                chai.request(app)
                    .post("/api/admin/user")
                    .set("Cookie", getSessionId(res))
                    .send(adminCreateUserBody)
                    .end((error: any, res: Response) => {
                        res.should.have.status(201);
                        res.body.should.be.not.empty;

                        UserSchema.exists({ username: "user" }, (error: any, res: boolean) => {
                            expect(res).to.be.true;
                            done();
                        });
                    });
            });
        });

        it("Username already exists. Should respond with conflict response code", (done: Done) => {
            adminLogin().then((res: Response) => {
                const adminCreateUserBody: AdminRequestBody<RegisterUserBody> = {
                    adminPassword: "password",
                    data: {
                        username: "calandrace",
                        password: "password",
                        email: "user@domain.com",
                        fullname: "User",
                        role: Role.Professor,
                    },
                };

                chai.request(app)
                    .post("/api/admin/user")
                    .set("Cookie", getSessionId(res))
                    .send(adminCreateUserBody)
                    .end((error: any, res: Response) => {
                        res.should.have.status(409);
                        res.body.should.be.not.empty;
                        done();
                    });
            });
        });

        it("Invalid username format. Should respond with unprocessable entity response code", (done: Done) => {
            adminLogin().then((res: Response) => {
                const adminCreateUserBody: AdminRequestBody<RegisterUserBody> = {
                    adminPassword: "password",
                    data: {
                        username: "25user",
                        password: "password",
                        email: "user@domain.com",
                        fullname: "User",
                        role: Role.Student,
                    },
                };

                chai.request(app)
                    .post("/api/admin/user")
                    .set("Cookie", getSessionId(res))
                    .send(adminCreateUserBody)
                    .end((error: any, res: Response) => {
                        res.should.have.status(422);
                        res.body.should.be.not.empty;
                        done();
                    });
            });
        });

        it("Invalid email format. Should respond with unprocessable entity response code", (done: Done) => {
            adminLogin().then((res: Response) => {
                const adminCreateUserBody: AdminRequestBody<RegisterUserBody> = {
                    adminPassword: "password",
                    data: {
                        username: "user",
                        password: "password",
                        email: "userdomain.com",
                        fullname: "User",
                        role: Role.Student,
                    },
                };

                chai.request(app)
                    .post("/api/admin/user")
                    .set("Cookie", getSessionId(res))
                    .send(adminCreateUserBody)
                    .end((error: any, res: Response) => {
                        res.should.have.status(422);
                        res.body.should.be.not.empty;
                        done();
                    });
            });
        });
        it("Invalid password format. Should respond with unprocessable entity response code", (done: Done) => {
            adminLogin().then((res: Response) => {
                const adminCreateUserBody: AdminRequestBody<RegisterUserBody> = {
                    adminPassword: "password",
                    data: {
                        username: "user",
                        password: "pass",
                        email: "user@domain.com",
                        fullname: "User",
                        role: Role.Student,
                    },
                };

                chai.request(app)
                    .post("/api/admin/user")
                    .set("Cookie", getSessionId(res))
                    .send(adminCreateUserBody)
                    .end((error: any, res: Response) => {
                        res.should.have.status(422);
                        res.body.should.be.not.empty;
                        done();
                    });
            });
        });

        it("Unauthorised session should return unauthorised", (done: Done) => {
            const adminCreateUserBody: AdminRequestBody<RegisterUserBody> = {
                adminPassword: "password",
                data: {
                    username: "user",
                    password: "password",
                    email: "user@domain.com",
                    fullname: "User",
                    role: Role.Student,
                },
            };

            userLogin("berriesgrease", "password").then((res: Response) => {
                chai.request(app)
                    .post("/api/admin/user")
                    .set("Cookie", getSessionId(res))
                    .send(adminCreateUserBody)
                    .end((error: any, res: Response) => {
                        res.should.have.status(401);
                        res.body.should.be.not.empty;
                        done();
                    });
            });
        });

        it("Authorised non admin session should return unauthorised", (done: Done) => {
            userLogin("calandrace", "password").then((res: Response) => {
                chai.request(app)
                    .post("/api/admin/user")
                    .set("Cookie", getSessionId(res))
                    .send('{"username":"user')
                    .end((error: any, res: Response) => {
                        res.should.have.status(401);
                        res.body.should.be.not.empty;
                        done();
                    });
            });
        });

        it("Head admin creating a head admin user should return unauthorised", (done: Done) => {
            const adminCreateUserBody: AdminRequestBody<RegisterUserBody> = {
                adminPassword: "password",
                data: {
                    username: "head_admin",
                    password: "password",
                    email: "user@domain.com",
                    fullname: "User",
                    role: Role.HeadAdmin,
                },
            };

            headAdminLogin().then((res: Response) => {
                chai.request(app)
                    .post("/api/admin/user")
                    .set("Cookie", getSessionId(res))
                    .send(adminCreateUserBody)
                    .end((error: any, res: Response) => {
                        res.should.have.status(401);
                        res.body.should.be.not.empty;

                        UserSchema.exists({ username: adminCreateUserBody.data.username }).then((res: boolean) => {
                            expect(res).to.be.false;
                            done();
                        });
                    });
            });
        });

        it("Head admin creating an admin user should return created", (done: Done) => {
            const adminCreateUserBody: AdminRequestBody<RegisterUserBody> = {
                adminPassword: "password",
                data: {
                    username: "new_admin",
                    password: "password",
                    email: "user@domain.com",
                    fullname: "User",
                    role: Role.Admin,
                },
            };

            headAdminLogin().then((res: Response) => {
                chai.request(app)
                    .post("/api/admin/user")
                    .set("Cookie", getSessionId(res))
                    .send(adminCreateUserBody)
                    .end((error: any, res: Response) => {
                        res.should.have.status(201);
                        res.body.should.be.not.empty;

                        UserSchema.exists({ username: "new_admin" }).then((res: boolean) => {
                            expect(res).to.be.true;
                            done();
                        });
                    });
            });
        });

        it("Admin creating an admin user should return unauthorised", (done: Done) => {
            const adminCreateUserBody: AdminRequestBody<RegisterUserBody> = {
                adminPassword: "password",
                data: {
                    username: "new_admin",
                    password: "password",
                    email: "user@domain.com",
                    fullname: "User",
                    role: Role.Admin,
                },
            };

            adminLogin().then((res: Response) => {
                chai.request(app)
                    .post("/api/admin/user")
                    .set("Cookie", getSessionId(res))
                    .send(adminCreateUserBody)
                    .end((error: any, res: Response) => {
                        res.should.have.status(401);
                        res.body.should.be.not.empty;

                        UserSchema.exists({ username: adminCreateUserBody.data.username }).then((res: boolean) => {
                            expect(res).to.be.false;
                            done();
                        });
                    });
            });
        });
    });

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

        it("Admin should not be able to update another admin's username", (done: Done) => {
            const updateUsernameBody: AdminRequestBody<AdminUpdateUsernameBody> = {
                adminPassword: "password",
                data: {
                    newUsername: "new_admin_username",
                },
            };

            adminLogin().then((res: Response) => {
                chai.request(app)
                    .put("/api/admin/user/secretary_office_2/username")
                    .set("Cookie", getSessionId(res))
                    .send(updateUsernameBody)
                    .end((error: any, res: Response) => {
                        res.should.have.status(401);
                        res.body.should.be.not.empty;

                        UserSchema.exists({ username: "secretary_office_2" }).then((res: boolean) => {
                            expect(res).to.be.true;
                            done();
                        });
                    });
            });
        });

        it("Head admin should be able to update another admin's username", (done: Done) => {
            const updateUsernameBody: AdminRequestBody<AdminUpdateUsernameBody> = {
                adminPassword: "password",
                data: {
                    newUsername: "new_admin_username",
                },
            };

            headAdminLogin().then((res: Response) => {
                chai.request(app)
                    .put("/api/admin/user/secretary_office_2/username")
                    .set("Cookie", getSessionId(res))
                    .send(updateUsernameBody)
                    .end((error: any, res: Response) => {
                        res.should.have.status(200);
                        res.body.should.be.not.empty;

                        UserSchema.exists({ username: updateUsernameBody.data.newUsername }).then((res: boolean) => {
                            expect(res).to.be.true;
                            done();
                        });
                    });
            });
        });
    });
});
