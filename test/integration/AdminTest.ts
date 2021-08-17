import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../src/Timetabla";
import { Response } from "superagent";
import { resetUserCollectionState } from "../utils/BeforeEach";
import userLogin, { adminLogin, getSessionId, headAdminLogin } from "utils/UserLogin";
import RegisterUserBody from "../../src/schema/requestbody/RegisterUserBody";
import AdminRequestBody from "../../src/schema/requestbody/admin/AdminRequestBody";
import { Role, User } from "../../src/schema/database/UserSchema";
import {
    AdminBlockUserBody,
    AdminUpdateFullnameBody,
    AdminUpdateUserEmailBody,
    AdminUpdateUsernameBody,
    AdminUpdateUserPasswordBody,
    AdminUpdateUserRoleBody,
} from "../../src/schema/requestbody/admin/AdminUpdateUserBody";
import UserService from "../../src/service/UserService";
import ServiceSingleton from "../../src/singleton/ServiceSingleton";
const should = chai.should();

chai.use(chaiHttp);

const userService: UserService = ServiceSingleton.userService;

describe("Admin", () => {
    beforeEach(resetUserCollectionState);

    describe("POST /api/admin/user", () => {
        it("Should save a new user to the database", async function () {
            let res: Response = await adminLogin();

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

            res = await chai
                .request(app)
                .post("/api/admin/user")
                .set("Cookie", getSessionId(res))
                .send(adminCreateUserBody);

            res.should.have.status(201);
            res.body.should.be.not.empty;

            expect(await userService.usernameExists("user")).to.be.true;
        });

        it("Username already exists. Should respond with conflict response code", async function () {
            let res: Response = await adminLogin();

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

            res = await chai
                .request(app)
                .post("/api/admin/user")
                .set("Cookie", getSessionId(res))
                .send(adminCreateUserBody);

            res.should.have.status(409);
            res.body.should.be.not.empty;
        });

        it("Invalid username format. Should respond with unprocessable entity response code", async function () {
            let res: Response = await adminLogin();

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

            res = await chai
                .request(app)
                .post("/api/admin/user")
                .set("Cookie", getSessionId(res))
                .send(adminCreateUserBody);

            res.should.have.status(422);
            res.body.should.be.not.empty;
        });

        it("Invalid email format. Should respond with unprocessable entity response code", async function () {
            let res: Response = await adminLogin();

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

            res = await chai
                .request(app)
                .post("/api/admin/user")
                .set("Cookie", getSessionId(res))
                .send(adminCreateUserBody);

            res.should.have.status(422);
            res.body.should.be.not.empty;
        });
        it("Invalid password format. Should respond with unprocessable entity response code", async function () {
            let res: Response = await adminLogin();

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

            res = await chai
                .request(app)
                .post("/api/admin/user")
                .set("Cookie", getSessionId(res))
                .send(adminCreateUserBody);

            res.should.have.status(422);
            res.body.should.be.not.empty;
        });

        it("Non authorised role should return forbidden", async function () {
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

            let res: Response = await userLogin("berriesgrease", "password");

            res = await chai
                .request(app)
                .post("/api/admin/user")
                .set("Cookie", getSessionId(res))
                .send(adminCreateUserBody);

            res.should.have.status(403);
            res.body.should.be.not.empty;
        });

        it("Authorised non admin session should return forbidden", async function () {
            let res: Response = await userLogin("calandrace", "password");

            res = await chai
                .request(app)
                .post("/api/admin/user")
                .set("Cookie", getSessionId(res))
                .send('{"username":"user');

            res.should.have.status(403);
            res.body.should.be.not.empty;
        });

        it("Head admin creating a head admin user should return forbidden", async function () {
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

            let res: Response = await headAdminLogin();

            res = await chai
                .request(app)
                .post("/api/admin/user")
                .set("Cookie", getSessionId(res))
                .send(adminCreateUserBody);

            res.should.have.status(403);
            res.body.should.be.not.empty;

            expect(await userService.usernameExists(adminCreateUserBody.data.username)).to.be.false;
        });

        it("Head admin creating an admin user should return created", async function () {
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

            let res: Response = await headAdminLogin();
            res = await chai
                .request(app)
                .post("/api/admin/user")
                .set("Cookie", getSessionId(res))
                .send(adminCreateUserBody);

            res.should.have.status(201);
            res.body.should.be.not.empty;

            expect(await userService.usernameExists("new_admin")).to.be.true;
        });

        it("Admin creating an admin user should return forbidden", async function () {
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

            let res: Response = await adminLogin();

            res = await chai
                .request(app)
                .post("/api/admin/user")
                .set("Cookie", getSessionId(res))
                .send(adminCreateUserBody);

            res.should.have.status(403);
            res.body.should.be.not.empty;

            expect(await userService.usernameExists(adminCreateUserBody.data.username)).to.be.false;
        });
    });

    describe("PUT /api/admin/user/:id/username", () => {
        it("Admin role and valid password should return ok and update user's username", async function () {
            let res: Response = await adminLogin();

            res.should.have.status(200);
            res.body.should.be.not.empty;

            const newUsername = "new_massrarely";
            const id: string = (await userService.findByUsername("massrarely"))._id;

            const adminUpdateUsernameBody: AdminRequestBody<AdminUpdateUsernameBody> = {
                adminPassword: "password",
                data: { newUsername },
            };

            res = await chai
                .request(app)
                .put(`/api/admin/user/${id}/username`)
                .set("Cookie", getSessionId(res))
                .send(adminUpdateUsernameBody);

            res.should.have.status(200);
            res.body.should.be.not.empty;

            expect(await userService.usernameExists(newUsername)).to.be.true;
        });

        it("Non existent user should return not found", async function () {
            let res: Response = await adminLogin();

            res.should.have.status(200);
            res.body.should.be.not.empty;

            const adminUpdateUsernameBody: AdminRequestBody<AdminUpdateUsernameBody> = {
                adminPassword: "password",
                data: { newUsername: "new_massrarely" },
            };

            res = await chai
                .request(app)
                .put("/api/admin/user/000000000000000000000000/username")
                .set("Cookie", getSessionId(res))
                .send(adminUpdateUsernameBody);

            res.should.have.status(404);
            res.body.should.be.not.empty;
        });

        it("Existent new username should return conflict", async function () {
            let res: Response = await adminLogin();

            res.should.have.status(200);
            res.body.should.be.not.empty;

            const id: string = (await userService.findByUsername("massrarely"))._id;
            const adminUpdateUsernameBody: AdminRequestBody<AdminUpdateUsernameBody> = {
                adminPassword: "password",
                data: { newUsername: "admin" },
            };

            res = await chai
                .request(app)
                .put(`/api/admin/user/${id}/username`)
                .set("Cookie", getSessionId(res))
                .send(adminUpdateUsernameBody);

            res.should.have.status(409);
            res.body.should.be.not.empty;
        });

        it("Admin should not be able to update another admin's username", async function () {
            const username = "secretary_office_2";
            const updateUsernameBody: AdminRequestBody<AdminUpdateUsernameBody> = {
                adminPassword: "password",
                data: {
                    newUsername: "new_admin_username",
                },
            };

            let res: Response = await adminLogin();

            const id: string = (await userService.findByUsername(username))._id;

            res = await chai
                .request(app)
                .put(`/api/admin/user/${id}/username`)
                .set("Cookie", getSessionId(res))
                .send(updateUsernameBody);

            res.should.have.status(403);
            res.body.should.be.not.empty;

            expect(await userService.usernameExists(username)).to.be.true;
        });

        it("Head admin should be able to update another admin's username", async function () {
            const newUsername = "new_admin_username";

            const id: string = (await userService.findByUsername("massrarely"))._id;
            const updateUsernameBody: AdminRequestBody<AdminUpdateUsernameBody> = {
                adminPassword: "password",
                data: { newUsername },
            };

            let res: Response = await headAdminLogin();

            res = await chai
                .request(app)
                .put(`/api/admin/user/${id}/username`)
                .set("Cookie", getSessionId(res))
                .send(updateUsernameBody);

            res.should.have.status(200);
            res.body.should.be.not.empty;

            expect(await userService.usernameExists(newUsername)).to.be.true;
        });
    });

    describe("PUT /api/admin/user/:id/fullname", () => {
        it("Admin updating user's fullname should return ok", async function () {
            const newFullname = "New Fullname";

            const id: string = (await userService.findByUsername("calandrace"))._id;
            const body: AdminRequestBody<AdminUpdateFullnameBody> = {
                adminPassword: "password",
                data: { newFullname },
            };

            let res: Response = await adminLogin();

            res = await chai
                .request(app)
                .put(`/api/admin/user/${id}/fullname`)
                .set("Cookie", getSessionId(res))
                .send(body);

            res.should.have.status(200);
            expect((await userService.findById(id)).fullname).to.equals(newFullname);
        });
    });

    describe("PUT /api/admin/user/:id/password", () => {
        it("Admin updating user's password should return ok", async function () {
            const username = "calandrace";
            const newPassword = "new_password";

            const id: string = (await userService.findByUsername(username))._id;
            const body: AdminRequestBody<AdminUpdateUserPasswordBody> = {
                adminPassword: "password",
                data: { newPassword },
            };

            let res: Response = await adminLogin();

            res = await chai
                .request(app)
                .put(`/api/admin/user/${id}/password`)
                .set("Cookie", getSessionId(res))
                .send(body);

            res.should.have.status(200);
            res.body.should.be.not.empty;

            res = await userLogin(username, newPassword);

            res.should.have.status(200);
        });
    });

    describe("PUT /api/admin/user/:id/role", () => {
        it("Admin updating user's role should return ok", async function () {
            const newRole = Role.Admin;

            const id: string = (await userService.findByUsername("calandrace"))._id;
            const body: AdminRequestBody<AdminUpdateUserRoleBody> = {
                adminPassword: "password",
                data: { newRole },
            };

            let res: Response = await adminLogin();

            res = await chai.request(app).put(`/api/admin/user/${id}/role`).set("Cookie", getSessionId(res)).send(body);

            res.should.have.status(200);
            res.body.should.be.not.empty;

            expect((await userService.findById(id)).role).to.equals(newRole);
        });
    });

    describe("PUT /api/admin/user/:id/email", () => {
        it("Admin updating user's email should return ok", async function () {
            const newEmail = "new_email@timetabla.com";

            const id: string = (await userService.findByUsername("calandrace"))._id;
            const body: AdminRequestBody<AdminUpdateUserEmailBody> = {
                adminPassword: "password",
                data: { newEmail },
            };

            let res: Response = await adminLogin();

            res = await chai
                .request(app)
                .put(`/api/admin/user/${id}/email`)
                .set("Cookie", getSessionId(res))
                .send(body);

            res.should.have.status(200);
            res.body.should.be.not.empty;

            expect((await userService.findById(id)).email).to.equals(newEmail);
        });
    });

    describe("PUT /api/admin/user/:id/block", () => {
        it("Admin blocking user should return ok and user login should return forbidden", async function () {
            const username = "calandrace";

            const id: string = (await userService.findByUsername(username))._id;
            const body: AdminRequestBody<AdminBlockUserBody> = {
                adminPassword: "password",
                data: { block: true },
            };

            let res: Response = await adminLogin();

            res = await chai
                .request(app)
                .put(`/api/admin/user/${id}/block`)
                .set("Cookie", getSessionId(res))
                .send(body);

            res.should.have.status(200);
            res.body.should.be.not.empty;

            res = await userLogin(username, "password");

            res.should.have.status(403);
        });

        describe("DELETE /api/admin/user/:id", () => {
            it("Admin deleting user should return ok", async function () {
                const id: string = (await userService.findByUsername("calandrace"))._id;
                const body: AdminRequestBody<any> = {
                    adminPassword: "password",
                    data: {},
                };

                let res: Response = await adminLogin();

                res = await chai
                    .request(app)
                    .delete(`/api/admin/user/${id}`)
                    .set("Cookie", getSessionId(res))
                    .send(body);

                res.should.have.status(200);
                res.body.should.be.not.empty;

                expect(await userService.usernameExists(id)).to.be.false;
            });
        });
    });
});
