import chai, { expect } from "chai";
import { User } from "../../src/schema/database/UserSchema";
import UserService from "../../src/service/UserService";
import ServiceSingleton from "../../src/singleton/ServiceSingleton";
const should = chai.should();

const userService: UserService = ServiceSingleton.userService;

describe("Find by id", () => {
    it("Should get a user by id", async function () {
        const user: User = await userService.findOne({ _id: "100000000000000000001015" });

        expect(user).to.be.not.null;
    });
});
