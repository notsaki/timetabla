import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { Response } from "superagent";
import { resetUserCollectionState } from "../../utils/BeforeEach";
import userLogin, { headAdminLogin, getSessionId, adminLogin } from "utils/UserLogin";
const should = chai.should();

chai.use(chaiHttp);

describe("User login utilities tests", () => {
    beforeEach(resetUserCollectionState);

    describe("UserLogin Utils", () => {
        describe("userLogin", () => {
            it("Valid credentials should return ok", async function () {
                const res: Response = await userLogin("admin", "password");

                res.should.have.status(200);
            });

            describe("adminLogin", () => {
                it("adminLogin: Admin login must be return ok", async function () {
                    const res: Response = await adminLogin();

                    res.should.have.status(200);
                });
            });

            describe("headAdminLogin", () => {
                it("headAdminLogin: Head Admin login must be return ok", async function () {
                    const res: Response = await headAdminLogin();

                    res.should.have.status(200);
                });
            });

            describe("getSessionCookie", () => {
                it("Must parse user cookie", async function () {
                    const res: Response = await adminLogin();

                    expect(getSessionId(res)).to.match(/^user=s%[^;]+$/);
                });
            });
        });
    });
});
