import chai, { expect } from "chai";
import { hashNew, verify } from "../../src/utils/Hash";
const should = chai.should();

describe("Password hashing", () => {
    describe("Verify hash", () => {
        it("Should successfully verify password", (done) => {
            const password = "password";

            const hash = hashNew(password);
            const result: boolean = verify(password, hash);

            expect(result).to.be.true;

            done();
        });

        it("Should not verify password", (done) => {
            const hash = hashNew("password");
            const result: boolean = verify(hash, "new_password");

            expect(result).to.be.false;

            done();
        });
    });
});
