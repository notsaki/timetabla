import chai, { expect } from "chai";
import ErrorCode from "../../src/schema/ErrorCode";
import getErrorCode from "../../src/utils/GetErrorCode";
import BlockedUserError from "../../src/error/BlockedUserError";
const should = chai.should();

describe("Error code parser", () => {
    it(`Should parse ${ErrorCode.BlockedUser}`, function () {
        try {
            throw new BlockedUserError();
        } catch (error: any) {
            const errorCode = getErrorCode(error);

            expect(errorCode).to.equal(ErrorCode.BlockedUser);
        }
    });
});
