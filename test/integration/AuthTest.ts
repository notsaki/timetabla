import chai from "chai";
import app from "../../src/Timetabla";
import { Response } from "superagent";
import { resetUserCollectionState } from "../utils/BeforeEach";
import chaiHttp from "chai-http";
import userLogin, { getSessionId } from "../utils/UserLogin";
const should = chai.should();

chai.use(chaiHttp);

describe("Auth login", () => {
    beforeEach(resetUserCollectionState);

    describe("POST /api/auth/login", () => {
        it("Correct username and password should successfully validate user", async function () {
            const username = "calandrace";
            const password = "password";

            let res: Response = await userLogin(username, password);

            res.should.have.status(200);
            res.body.should.be.not.empty;
        });

        it("Incorrect username should return unauthorised", async function () {
            const username = "random_username";
            const password = "password";

            let res: Response = await userLogin(username, password);

            res.should.have.status(401);
            res.body.should.be.not.empty;
        });

        it("Incorrect password should return unauthorised", async function () {
            const username = "calandrace";
            const password = "random_password";

            let res: Response = await userLogin(username, password);

            res.should.have.status(401);
            res.body.should.be.not.empty;
        });

        it("Invalid json should return unprocessable entity", async function () {
            const res: Response = await chai.request(app).post("/api/auth/login").send('{"username":"test"');

            res.should.have.status(422);
            res.body.should.be.not.empty;
        });

        it("Unactivated user should return forbidden", async function () {
            const username = "unactivated_user";
            const password = "password";

            let res: Response = await userLogin(username, password);

            res.should.have.status(403);
            res.body.should.be.not.empty;
        });

        it("Blocked user should return forbidden", async function () {
            const username = "blocked_user";
            const password = "password";

            let res: Response = await userLogin(username, password);

            res.should.have.status(403);
            res.body.should.be.not.empty;
        });
    });

    describe("POST /api/auth/logout", () => {
        it("Authenticated session should return ok", async function () {
            const username = "calandrace";
            const password = "password";

            let res: Response = await userLogin(username, password);

            res.should.have.status(200);
            res.should.have.cookie("user");

            chai.request(app).post("/api/auth/logout").set("Cookie", getSessionId(res)).send();

            res.should.have.status(200);
            res.body.should.be.not.empty;
        });
    });

    describe("POST /api/auth/logout", () => {
        it("Non-authenticated session should return unauthorised", async function () {
            const res: Response = await chai.request(app).post("/api/auth/logout").send();

            res.should.have.status(401);
            res.body.should.be.not.empty;
        });

        it("User who already logged out should return unauthorised", async function () {
            const username = "calandrace";
            const password = "password";

            let res: Response = await userLogin(username, password);

            res.should.have.status(200);
            res.should.have.cookie("user");

            res = await chai.request(app).post("/api/auth/logout").set("Cookie", getSessionId(res)).send();

            res.should.have.status(200);

            res = await chai.request(app).post("/api/auth/logout").set("Cookie", getSessionId(res)).send();

            res.should.have.status(401);
            res.body.should.be.not.empty;
        });
    });
});
