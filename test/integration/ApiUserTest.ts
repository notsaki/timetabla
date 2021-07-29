import chai from "chai";
import chaiHttp from "chai-http";
import { insertTestUsers } from "../utils/InsertTestData";
import app from "../../src/Timetabla";
import { User } from "../../src/schema/UserSchema";
import { Done } from "@testdeck/core";
const should = chai.should();

chai.use(chaiHttp);

describe("Users", () => {
    beforeEach((done: Done) => {
        insertTestUsers()
            .then(done)
            .catch((error) => {
                console.log(`Error resetting the database state: ${error}`);
            });
    });

    describe("POST /api/user", () => {
        it("Should save a new user to the database", (done: Done) => {
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

        it("Username already exists. Should respond with conflict response code", (done: Done) => {
            const user = new User().assign({
                username: "calandrace",
                password: "password",
                email: "user@domain.com",
                fullname: "User",
            });

            chai.request(app)
                .post("/api/user")
                .send(user)
                .end((error, res) => {
                    res.should.have.status(409);
                    res.body.should.be.empty;
                    done();
                });
        });

        it("Invalidate username format. Should respond with unprocessable entity response code", (done: Done) => {
            const user = new User().assign({
                username: "25user",
                password: "password",
                email: "user@domain.com",
                fullname: "User",
            });

            chai.request(app)
                .post("/api/user")
                .send(user)
                .end((error, res) => {
                    res.should.have.status(422);
                    res.body.should.be.empty;
                    done();
                });
        });

        it("Invalidate email format. Should respond with unprocessable entity response code", (done: Done) => {
            const user = new User().assign({
                username: "user",
                password: "password",
                email: "userdomain.com",
                fullname: "User",
            });

            chai.request(app)
                .post("/api/user")
                .send(user)
                .end((error, res) => {
                    res.should.have.status(422);
                    res.body.should.be.empty;
                    done();
                });
        });

        it("Invalidate password format. Should respond with unprocessable entity response code", (done: Done) => {
            const user = new User().assign({
                username: "user",
                password: "pass",
                email: "user@domain.com",
                fullname: "User",
            });

            chai.request(app)
                .post("/api/user")
                .send(user)
                .end((error, res) => {
                    res.should.have.status(422);
                    res.body.should.be.empty;
                    done();
                });
        });

        it("Invalid json format. Should respond with bad request", (done: Done) => {
            chai.request(app)
                .post("/api/user")
                .send('{"username":"user')
                .end((error, res) => {
                    res.should.have.status(422);
                    res.body.should.be.empty;
                    done();
                });
        });
    });
});
