import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../src/Timetabla";
import { Done } from "@testdeck/core";
import { Response } from "superagent";
import { resetUserCollectionState } from "../utils/BeforeEach";
import LoginCredentialsBody from "../../src/schema/requestbody/LoginCredentialsBody";
import UpdatePasswordBody from "../../src/schema/requestbody/UpdatePasswordBody";
import createUser, { defaultUserBody } from "../utils/CreateUser";
import UserSchema, { User } from "../../src/schema/database/UserSchema";
import userLogin from "../utils/UserLogin";
import UserService from "../../src/service/UserService";
import PasswordResetBody from "../../src/schema/requestbody/PasswordResetBody";
const should = chai.should();

chai.use(chaiHttp);

describe("Users", () => {
    beforeEach(resetUserCollectionState);

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

    describe("GET /api/user/:username/activate/:activationcode", () => {
        it("Should create a user and activate them", async () => {
            await createUser();

            const user: User = await UserService.findOne(defaultUserBody.username);

            let res: Response = await chai
                .request(app)
                .get(`/api/user/${defaultUserBody.username}/activate/${user.activationCode}`)
                .send();

            res.should.have.status(200);
            res.body.should.be.not.empty;

            res = await userLogin(defaultUserBody.username, defaultUserBody.password);

            res.should.have.status(200);
            res.body.should.be.not.empty;
        });

        it("Create a user and send invalid activation code should return unauthorised", async () => {
            await createUser();

            const user: User = await UserService.findOne(defaultUserBody.username);

            let res: Response = await chai
                .request(app)
                .get(`/api/user/${defaultUserBody.username}/activate/${user.activationCode}_invalid`)
                .send();

            res.should.have.status(401);
            res.body.should.be.not.empty;

            res = await userLogin(defaultUserBody.username, defaultUserBody.password);

            res.should.have.status(403);
            res.body.should.be.not.empty;
        });

        it("Sending activation code for a wrong user should return unauthorised", async () => {
            const user: User = await UserService.findOne("unactivated_user_2");

            let res: Response = await chai
                .request(app)
                .get(`/api/user/unactivated_user/activate/${user.activationCode}_invalid`)
                .send();

            res.should.have.status(401);
            res.body.should.be.not.empty;

            res = await userLogin("unactivated_user_2", "password");

            res.should.have.status(403);
            res.body.should.be.not.empty;
        });

        it("Sending activation code for non-existant user should return not found", async () => {
            const username = "unactivated_user";

            const user: User = await UserService.findOne(username);

            let res: Response = await chai
                .request(app)
                .get(`/api/user/nonexistent_username/activate/${user.activationCode}`)
                .send();

            res.should.have.status(404);
            res.body.should.be.not.empty;
        });

        it("Sending activation code for an already activated user should return method not allowed", async () => {
            const username = "admin";
            const activationCode = "1d6f9ca63eba57ee2197edcaa4a33e8ba13445d61402a9b31fd0c6b9e1c75dc9$";

            let res: Response = await chai.request(app).get(`/api/user/${username}/activate/${activationCode}`).send();

            res.should.have.status(405);
            res.body.should.be.not.empty;
        });
    });

    describe("POST /api/user/:username/reset", () => {
        it("Should request a new reset code for a user and return ok", async () => {
            const username = "berriesgrease";

            const res: Response = await chai.request(app).post(`/api/user/${username}/reset`).send();

            res.should.have.status(200);
            res.body.should.be.not.empty;

            const user: User = await UserService.findOne(username);

            expect(user.resetCode).to.not.be.null;
        });

        it("Should request a new reset code for a non-existent user and return not found", async () => {
            const username = "berriesgrease_2";

            const res: Response = await chai.request(app).post(`/api/user/${username}/reset`).send();

            res.should.have.status(404);
            res.body.should.be.not.empty;
        });

        it("Requesting a new reset code twice should re-create reset code", async () => {
            const username = "berriesgrease";

            let res: Response = await chai.request(app).post(`/api/user/${username}/reset`).send();

            res.should.have.status(200);
            res.body.should.be.not.empty;

            let user: User = await UserService.findOne(username);

            expect(user.resetCode).to.be.not.null;

            const oldResetCode = user.resetCode;

            res = await chai.request(app).post(`/api/user/${username}/reset`).send();

            res.should.have.status(200);
            res.body.should.be.not.empty;

            user = await UserService.findOne(username);

            expect(user.resetCode).to.be.not.null;
            expect(user.resetCode).to.be.not.equals(oldResetCode);
        });


    });

    describe("POST /api/user/:username/reset/:resetcode", function() {
        it("Request a new reset code and reset password. Should return ok", async function() {
            const username = "berriesgrease";

            let res: Response = await chai.request(app).post(`/api/user/${username}/reset`).send();

            res.should.have.status(200);
            res.body.should.be.not.empty;

            let user: User = await UserService.findOne(username);

            expect(user.resetCode).to.be.not.null;

            const resetPasswordBody: PasswordResetBody = { newPassword: "new_password" };

            res = await chai.request(app).post(`/api/user/${username}/reset/${user.resetCode}`).send(resetPasswordBody);

            res.should.have.status(200);
            res.body.should.be.not.empty;

            res = await userLogin(username, resetPasswordBody.newPassword);

            res.should.have.status(200);
            res.body.should.be.not.empty;
        });

        it("Sending reset code for non-existent user should return not found", async function() {
            let user: User = await UserService.findOne("reset_code_user");

            expect(user.resetCode).to.be.not.null;

            const resetPasswordBody: PasswordResetBody = { newPassword: "new_password" };

            const res: Response = await chai
                .request(app)
                .post(`/api/user/nonexistent_user/reset/${user.resetCode}`)
                .send(resetPasswordBody);

            res.should.have.status(404);
            res.body.should.be.not.empty;
        });

        it("Sending invalid reset code for non-existent user should return unauthorised", async function() {
            const resetCode = "1d6f9ca63eba57ee2197edcaa4a33e8ba13445d61402a9b31fd0c6b9e1c75dc9$";

            const resetPasswordBody: PasswordResetBody = { newPassword: "new_password" };

            const res: Response = await chai.request(app).post(`/api/user/reset_code_user/reset/${resetCode}`).send(resetPasswordBody);

            res.should.have.status(401);
            res.body.should.be.not.empty;
        });
    });
});
