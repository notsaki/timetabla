import chai from "chai";
import chaiHttp from "chai-http";
import insertTestData from "../src/utils/InsertTestData";
import app from "../src/Timetabla";
import { User } from "../src/schema/UserSchema";
const should = chai.should();

chai.use(chaiHttp);

describe("Users", () => {
    beforeEach((done) => {
        insertTestData().then(() => {
            done();
        });
    });

    describe("POST /api/user", () => {
        it("Should save a new user to the database", (done) => {
            const user = new User().assign({
                username: "user",
                password: "password",
                email: "user@domain.com",
                fullname: "User",
            });

            chai.request(app)
                .post("/api/user")
                .send(user)
                .end((error, res) => {
                    res.should.have.status(201);
                    res.body.should.be.empty;
                    done();
                });
        });
    });
});
