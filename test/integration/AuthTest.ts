import chai, { expect } from "chai";
import { hashNew, verify } from "../../src/utils/Hash";
import { Done } from "@testdeck/core";
import { insertTestUsers } from "../utils/InsertTestData";
import credentialsValidatorMiddleware from "../../src/middleware/CredentialsValidatorMiddleware";
import { LoginCredentials, User } from "../../src/schema/UserSchema";
import app from "../../src/Timetabla";
const should = chai.should();

describe("Auth login", () => {
    beforeEach((done: Done) => {
        insertTestUsers()
            .then(done)
            .catch((error) => {
                console.log(`Error resetting the database state: ${error}`);
            });
    });

    describe("POST /api/auth/login", () => {
        it("Correct username and password should successfully validate user", (done) => {
            const loginCredentials = new LoginCredentials().assign({
                username: "calandrace",
                password: "password",
            });

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.empty;
                    done();
                });
        });

        it("Incorrect username should return unauthorised", (done) => {
            const loginCredentials = new LoginCredentials().assign({
                username: "random_username",
                password: "password",
            });

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error, res) => {
                    res.should.have.status(401);
                    res.body.should.be.empty;
                    done();
                });
        });

        it("Incorrect password should return unauthorised", (done) => {
            const loginCredentials = new LoginCredentials().assign({
                username: "calandrace",
                password: "random_password",
            });

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error, res) => {
                    res.should.have.status(401);
                    res.body.should.be.empty;
                    done();
                });
        });

        it("Invalid json should return unprocessable entity", (done) => {
            chai.request(app)
                .post("/api/auth/login")
                .send('{"username":"test"')
                .end((error, res) => {
                    res.should.have.status(422);
                    res.body.should.be.empty;
                    done();
                });
        });

        it("Unactivated user should return forbidden", (done) => {
            const loginCredentials = new LoginCredentials().assign({
                username: "unactivated_user",
                password: "password",
            });

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error, res) => {
                    res.should.have.status(403);
                    res.body.should.be.empty;
                    done();
                });
        });

        it("Blocked user should return forbidden", (done) => {
            const loginCredentials = new LoginCredentials().assign({
                username: "blocked_user",
                password: "password",
            });

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error, res) => {
                    res.should.have.status(403);
                    res.body.should.be.empty;
                    done();
                });
        });
    });
});
