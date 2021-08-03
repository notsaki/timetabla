import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { Done } from "@testdeck/core";
import { Response } from "superagent";
import { resetUserCollectionState } from "../../utils/BeforeEach";
import userLogin, { headAdminLogin, getSessionId } from "utils/UserLogin";
const should = chai.should();

chai.use(chaiHttp);

describe("Admin", () => {
    beforeEach(resetUserCollectionState);

    describe("UserLogin Utils", () => {
        describe("userLogin", () => {
            it("Valid credentials should return ok", (done: Done) => {
                userLogin("admin", "password").then((res: Response) => {
                    res.should.have.status(200);
                    done();
                });
            });
        });

        describe("adminLogin", () => {
            it("adminLogin: Admin login must be return ok", (done: Done) => {
                headAdminLogin().then((res: Response) => {
                    res.should.have.status(200);
                    done();
                });
            });
        });

        describe("getSessionCookie", () => {
            it("Must parse user cookie", (done: Done) => {
                headAdminLogin().then((res: Response) => {
                    expect(getSessionId(res)).to.match(/^user=s%[^;]+$/);
                    done();
                });
            });
        });
    });
});
