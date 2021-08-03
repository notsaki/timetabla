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
import UserSchema, { Role, User } from "../../src/schema/database/UserSchema";
import {
    AdminBlockUserBody,
    AdminUpdateFullnameBody,
    AdminUpdateUserEmailBody,
    AdminUpdateUsernameBody,
    AdminUpdateUserPasswordBody,
    AdminUpdateUserRoleBody,
} from "../../src/schema/requestbody/admin/AdminUpdateUserBody";
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

    describe("PUT /api/admin/user/:username/fullname", () => {
        it("Admin updating user's fullname should return ok", (done: Done) => {
            const body: AdminRequestBody<AdminUpdateFullnameBody> = {
                adminPassword: "password",
                data: { newFullname: "New Fullname" },
            };

            adminLogin().then((res: Response) => {
                chai.request(app)
                    .put("/api/admin/user/calandrace/fullname")
                    .set("Cookie", getSessionId(res))
                    .send(body)
                    .end((error: any, res: Response) => {
                        res.should.have.status(200);
                        res.body.should.be.not.empty;

                        UserSchema.findOne({ username: "calandrace" }).then((user: User) => {
                            expect(user.fullname).to.be.equals(body.data.newFullname);
                            done();
                        });
                    });
            });
        });
    });

    describe("PUT /api/admin/user/:username/password", () => {
        it("Admin updating user's password should return ok", (done: Done) => {
            const body: AdminRequestBody<AdminUpdateUserPasswordBody> = {
                adminPassword: "password",
                data: { newPassword: "new_password" },
            };

            adminLogin().then((res: Response) => {
                chai.request(app)
                    .put("/api/admin/user/calandrace/password")
                    .set("Cookie", getSessionId(res))
                    .send(body)
                    .end((error: any, res: Response) => {
                        res.should.have.status(200);
                        res.body.should.be.not.empty;

                        userLogin("calandrace", body.data.newPassword).then((res: Response) => {
                            res.should.have.status(200);
                            done();
                        });
                    });
            });
        });
    });

    describe("PUT /api/admin/user/:username/role", () => {
        it("Admin updating user's password should return ok", (done: Done) => {
            const body: AdminRequestBody<AdminUpdateUserRoleBody> = {
                adminPassword: "password",
                data: { newRole: Role.Admin },
            };

            adminLogin().then((res: Response) => {
                chai.request(app)
                    .put("/api/admin/user/calandrace/role")
                    .set("Cookie", getSessionId(res))
                    .send(body)
                    .end((error: any, res: Response) => {
                        res.should.have.status(200);
                        res.body.should.be.not.empty;

                        UserSchema.exists({ username: "calandrace", role: body.data.newRole }).then((res: boolean) => {
                            expect(res).to.be.true;
                            done();
                        });
                    });
            });
        });
    });

    describe("PUT /api/admin/user/:username/email", () => {
        it("Admin updating user's email should return ok", (done: Done) => {
            const body: AdminRequestBody<AdminUpdateUserEmailBody> = {
                adminPassword: "password",
                data: { newEmail: "new_email@timetabla.com" },
            };

            adminLogin().then((res: Response) => {
                chai.request(app)
                    .put("/api/admin/user/calandrace/email")
                    .set("Cookie", getSessionId(res))
                    .send(body)
                    .end((error: any, res: Response) => {
                        res.should.have.status(200);
                        res.body.should.be.not.empty;

                        UserSchema.exists({ username: "calandrace", email: body.data.newEmail }).then(
                            (res: boolean) => {
                                expect(res).to.be.true;
                                done();
                            }
                        );
                    });
            });
        });
    });

    describe("PUT /api/admin/user/:username/block", () => {
        it("Admin updating user's email should return ok", (done: Done) => {
            const body: AdminRequestBody<AdminBlockUserBody> = {
                adminPassword: "password",
                data: { block: true },
            };

            adminLogin().then((res: Response) => {
                chai.request(app)
                    .put("/api/admin/user/calandrace/block")
                    .set("Cookie", getSessionId(res))
                    .send(body)
                    .end((error: any, res: Response) => {
                        res.should.have.status(200);
                        res.body.should.be.not.empty;

                        userLogin("calandrace", "password").then((res: Response) => {
                            res.should.have.status(403);
                            done();
                        });
                    });
            });
        });
    });

    describe("DELETE /api/admin/user/:username", () => {
        it("Admin deleting user should return ok", (done: Done) => {
            const body: AdminRequestBody<any> = {
                adminPassword: "password",
                data: {},
            };

            adminLogin().then((res: Response) => {
                chai.request(app)
                    .delete("/api/admin/user/calandrace")
                    .set("Cookie", getSessionId(res))
                    .send(body)
                    .end((error: any, res: Response) => {
                        res.should.have.status(200);
                        res.body.should.be.not.empty;

                        UserSchema.exists({ username: "clandrace" }).then((res: boolean) => {
                            expect(res).to.be.false;
                            done();
                        });
                    });
            });
        });
    });
});
