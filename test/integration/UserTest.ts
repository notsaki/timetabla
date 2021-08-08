import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../src/Timetabla";
import { Response } from "superagent";
import { resetUserCollectionState } from "../utils/BeforeEach";
import LoginCredentialsBody from "../../src/schema/requestbody/LoginCredentialsBody";
import UpdatePasswordBody from "../../src/schema/requestbody/UpdatePasswordBody";
import createUser, { defaultUserBody } from "../utils/CreateUser";
import { User } from "../../src/schema/database/UserSchema";
import userLogin, { adminLogin, getSessionId } from "../utils/UserLogin";
import PasswordResetBody from "../../src/schema/requestbody/PasswordResetBody";
import UserService from "../../src/service/UserService";
import ServiceSingleton from "../../src/singleton/ServiceSingleton";
const should = chai.should();

chai.use(chaiHttp);

const userService: UserService = ServiceSingleton.userService;

describe("Users", () => {
    beforeEach(resetUserCollectionState);

    describe("PUT /api/user/password", () => {
        it("Valid old password should return ok and update password successfully", async function () {
            let res: Response = await adminLogin();

            res.should.have.status(200);
            res.body.should.not.be.empty;

            const updatePassword: UpdatePasswordBody = {
                oldPassword: "password",
                newPassword: "new_password",
            };

            res = await chai
                .request(app)
                .put("/api/user/password")
                .set("Cookie", getSessionId(res))
                .send(updatePassword);

            res.should.have.status(200);
            res.body.should.not.be.empty;

            res = await userLogin("secretary_office", updatePassword.newPassword);

            res.should.have.status(200);
            res.body.should.not.be.empty;
        });

        it("Invalid old password should return unauthorised and not update password", async function () {
            let res: Response = await adminLogin();

            res.should.have.status(200);
            res.body.should.not.be.empty;

            const updatePassword: UpdatePasswordBody = {
                oldPassword: "wrong_password",
                newPassword: "new_password",
            };

            res = await chai
                .request(app)
                .put("/api/user/password")
                .set("Cookie", getSessionId(res))
                .send(updatePassword);

            res.should.have.status(401);
            res.body.should.not.be.empty;

            const loginCredentials: LoginCredentialsBody = {
                username: "admin",
                password: "password",
            };

            res = await chai.request(app).post("/api/auth/login").send(loginCredentials);

            res.should.have.status(200);
            res.body.should.not.be.empty;
        });

        it("Unauthorised session should return unauthorised and not update password", async function () {
            let res: Response = await adminLogin();

            res.should.have.status(200);
            res.body.should.not.be.empty;

            res = await chai.request(app).post("/api/auth/logout").set("Cookie", getSessionId(res)).send();

            res.should.have.status(200);
            res.body.should.not.be.empty;

            const updatePassword: UpdatePasswordBody = {
                oldPassword: "password",
                newPassword: "new_password",
            };

            res = await chai
                .request(app)
                .put("/api/user/password")
                .set("Cookie", getSessionId(res))
                .send(updatePassword);

            res.should.have.status(401);
            res.body.should.not.be.empty;

            const loginCredentials: LoginCredentialsBody = {
                username: "admin",
                password: updatePassword.oldPassword,
            };

            res = await chai.request(app).post("/api/auth/login").send(loginCredentials);

            res.should.have.status(200);
            res.body.should.not.be.empty;
        });
    });

    it("Short new password should return unprocessable entity and not update password", async function () {
        let res: Response = await adminLogin();

        res.should.have.status(200);
        res.body.should.not.be.empty;

        const updatePassword: UpdatePasswordBody = {
            oldPassword: "password",
            newPassword: "pass",
        };

        res = await chai.request(app).put("/api/user/password").set("Cookie", getSessionId(res)).send(updatePassword);

        res.should.have.status(422);
        res.body.should.not.be.empty;

        const loginCredentials: LoginCredentialsBody = {
            username: "admin",
            password: updatePassword.oldPassword,
        };

        res = await chai.request(app).post("/api/auth/login").send(loginCredentials);

        res.should.have.status(200);
        res.body.should.not.be.empty;
    });

    it("No session cookie should return unauthorised and not update password", async function () {
        const updatePassword: UpdatePasswordBody = {
            oldPassword: "password",
            newPassword: "pass",
        };

        let res = await chai.request(app).put("/api/user/password").send(updatePassword);

        res.should.have.status(401);
        res.body.should.not.be.empty;

        const loginCredentials: LoginCredentialsBody = {
            username: "admin",
            password: updatePassword.oldPassword,
        };

        res = await chai.request(app).post("/api/auth/login").send(loginCredentials);

        res.should.have.status(200);
        res.body.should.not.be.empty;
    });

    describe("GET /api/user/:username/activate/:activationcode", () => {
        it("Should create a user and activate them", async () => {
            await createUser();

            const user: User = await userService.findByUsername(defaultUserBody.username);

            let res: Response = await chai
                .request(app)
                .get(`/api/user/${user._id}/activate/${user.activationCode}`)
                .send();

            res.should.have.status(200);
            res.body.should.be.not.empty;

            res = await userLogin(user.username, defaultUserBody.password);

            res.should.have.status(200);
            res.body.should.be.not.empty;
        });

        it("Create a user and send invalid activation code should return unauthorised", async () => {
            await createUser();

            const user: User = await userService.findByUsername(defaultUserBody.username);

            let res: Response = await chai
                .request(app)
                .get(`/api/user/${user._id}/activate/${user.activationCode}_invalid`)
                .send();

            res.should.have.status(401);
            res.body.should.be.not.empty;

            res = await userLogin(user.username, defaultUserBody.password);

            res.should.have.status(403);
            res.body.should.be.not.empty;
        });

        it("Sending activation code for a wrong user should return unauthorised", async () => {
            const username = "unactivated_user_2";

            const user: User = await userService.findByUsername(username);

            let res: Response = await chai
                .request(app)
                .get(`/api/user/${user._id}/activate/${user.activationCode}_invalid`)
                .send();

            res.should.have.status(401);
            res.body.should.be.not.empty;

            res = await userLogin(username, "password");

            res.should.have.status(403);
            res.body.should.be.not.empty;
        });

        it("Sending activation code for non-existant user should return not found", async () => {
            const username = "unactivated_user";

            const user: User = await userService.findByUsername(username);

            let res: Response = await chai
                .request(app)
                .get(`/api/user/000000000000000000000000/activate/${user.activationCode}`)
                .send();

            res.should.have.status(404);
            res.body.should.be.not.empty;
        });

        it("Sending activation code for an already activated user should return method not allowed", async () => {
            const activationCode = "1d6f9ca63eba57ee2197edcaa4a33e8ba13445d61402a9b31fd0c6b9e1c75dc9$";
            const id: string = (await userService.findByUsername("admin"))._id;

            let res: Response = await chai.request(app).get(`/api/user/${id}/activate/${activationCode}`).send();

            res.should.have.status(405);
            res.body.should.be.not.empty;
        });
    });

    describe("POST /api/user/:username/reset", () => {
        it("Should request a new reset code for a user and return ok", async () => {
            const id: string = (await userService.findByUsername("berriesgrease"))._id;

            const res: Response = await chai.request(app).post(`/api/user/${id}/reset`).send();

            res.should.have.status(200);
            res.body.should.be.not.empty;

            expect((await userService.findById(id)).resetCode).to.not.be.null;
        });

        it("Should request a new reset code for a non-existent user and return not found", async () => {
            const res: Response = await chai.request(app).post("/api/user/000000000000000000000000/reset").send();

            res.should.have.status(404);
            res.body.should.be.not.empty;
        });

        it("Requesting a new reset code twice should re-create reset code", async () => {
            const id: string = (await userService.findByUsername("berriesgrease"))._id;
            let res: Response = await chai.request(app).post(`/api/user/${id}/reset`).send();

            res.should.have.status(200);
            res.body.should.be.not.empty;

            let user: User = await userService.findById(id);

            expect(user.resetCode).to.be.not.null;

            const oldResetCode = user.resetCode;

            res = await chai.request(app).post(`/api/user/${id}/reset`).send();

            res.should.have.status(200);
            res.body.should.be.not.empty;

            user = await userService.findById(id);

            expect(user.resetCode).to.be.not.null;
            expect(user.resetCode).to.be.not.equals(oldResetCode);
        });
    });

    describe("POST /api/user/:username/reset/:resetcode", function () {
        it("Request a new reset code and reset password. Should return ok", async function () {
            const id: string = (await userService.findByUsername("berriesgrease"))._id;

            let res: Response = await chai.request(app).post(`/api/user/${id}/reset`).send();

            res.should.have.status(200);
            res.body.should.be.not.empty;

            let user: User = await userService.findById(id);

            expect(user.resetCode).to.be.not.null;

            const resetPasswordBody: PasswordResetBody = { newPassword: "new_password" };

            res = await chai.request(app).post(`/api/user/${id}/reset/${user.resetCode}`).send(resetPasswordBody);

            res.should.have.status(200);
            res.body.should.be.not.empty;

            res = await userLogin(user.username, resetPasswordBody.newPassword);

            res.should.have.status(200);
            res.body.should.be.not.empty;
        });

        it("Sending reset code for non-existent user should return not found", async function () {
            let user: User = await userService.findByUsername("reset_code_user");

            expect(user.resetCode).to.be.not.null;

            const resetPasswordBody: PasswordResetBody = { newPassword: "new_password" };

            const res: Response = await chai
                .request(app)
                .post(`/api/user/000000000000000000000000/reset/${user.resetCode}`)
                .send(resetPasswordBody);

            res.should.have.status(404);
            res.body.should.be.not.empty;
        });

        it("Sending invalid reset code for non-existent user should return unauthorised", async function () {
            const resetCode = "1d6f9ca63eba57ee2197edcaa4a33e8ba13445d61402a9b31fd0c6b9e1c75dc9$";

            const id: string = (await userService.findByUsername("reset_code_user"))._id;
            const resetPasswordBody: PasswordResetBody = { newPassword: "new_password" };

            const res: Response = await chai
                .request(app)
                .post(`/api/user/${id}/reset/${resetCode}`)
                .send(resetPasswordBody);

            res.should.have.status(401);
            res.body.should.be.not.empty;
        });
    });
});
