import chai, { expect } from "chai";
import { hashNew, verify } from "../../src/utils/Hash";
import ErrorCode from "../../src/schema/ErrorCode";
import getErrorCode from "../../src/utils/GetErrorCode";
import BlockedUserError from "../../src/error/BlockedUserError";
import roleAuthenticator from "../../src/utils/RoleAuthenticator";
import { Role } from "../../src/schema/database/UserSchema";
const should = chai.should();

describe("Error code parser", () => {
    it("Should authenticate admin", (done) => {
        expect(roleAuthenticator(Role.Admin, Role.Admin)).to.be.true;

        done();
    });

    it("Should authenticate admin", (done) => {
        expect(roleAuthenticator(Role.Admin, Role.Student)).to.be.true;

        done();
    });

    it("Should not authenticate guest", (done) => {
        expect(roleAuthenticator(Role.Guest, Role.Student)).to.be.false;

        done();
    });
});
