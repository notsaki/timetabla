import chai from "chai";
import { Done } from "@testdeck/core";
import app from "../../src/Timetabla";
import LoginCredentials from "../../src/schema/requestbody/LoginCredentials";
import { Response } from "superagent";
import { resetUserCollectionState } from "../utils/BeforeEach";
const should = chai.should();

describe("Auth login", () => {
    beforeEach(resetUserCollectionState);

    describe("POST /api/auth/login", () => {
        it("Correct username and password should successfully validate user", (done: Done) => {
            const loginCredentials: LoginCredentials = {
                username: "calandrace",
                password: "password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(200);
                    res.body.should.be.not.empty;
                    done();
                });
        });

        it("Incorrect username should return unauthorised", (done: Done) => {
            const loginCredentials: LoginCredentials = {
                username: "random_username",
                password: "password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(401);
                    res.body.should.be.not.empty;
                    done();
                });
        });

        it("Incorrect password should return unauthorised", (done: Done) => {
            const loginCredentials: LoginCredentials = {
                username: "calandrace",
                password: "random_password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(401);
                    res.body.should.be.not.empty;
                    done();
                });
        });

        it("Invalid json should return unprocessable entity", (done: Done) => {
            chai.request(app)
                .post("/api/auth/login")
                .send('{"username":"test"')
                .end((error: any, res: Response) => {
                    res.should.have.status(422);
                    res.body.should.be.not.empty;
                    done();
                });
        });

        it("Unactivated user should return forbidden", (done: Done) => {
            const loginCredentials: LoginCredentials = {
                username: "unactivated_user",
                password: "password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(403);
                    res.body.should.be.not.empty;
                    done();
                });
        });

        it("Blocked user should return forbidden", (done: Done) => {
            const loginCredentials: LoginCredentials = {
                username: "blocked_user",
                password: "password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(403);
                    res.body.should.be.not.empty;
                    done();
                });
        });
    });

    describe("POST /api/auth/logout", () => {
        it("Authenticated session should return ok", (done: Done) => {
            const loginCredentials: LoginCredentials = {
                username: "calandrace",
                password: "password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(200);
                    res.should.have.cookie("user");

                    const sessionCookie: string = res.get("Set-Cookie")[0];

                    chai.request(app)
                        .post("/api/auth/logout")
                        .set("Cookie", sessionCookie)
                        .send()
                        .end((error: any, res: Response) => {
                            res.should.have.status(200);
                            res.body.should.be.not.empty;
                            done();
                        });
                });
        });
    });

    describe("POST /api/auth/logout", () => {
        it("Non-authenticated session should return unauthorised", (done: Done) => {
            chai.request(app)
                .post("/api/auth/logout")
                .send()
                .end((error: any, res: Response) => {
                    res.should.have.status(401);
                    res.body.should.be.not.empty;
                    done();
                });
        });

        it("User who already logged out should return unauthorised", (done: Done) => {
            const loginCredentials: LoginCredentials = {
                username: "calandrace",
                password: "password",
            };

            chai.request(app)
                .post("/api/auth/login")
                .send(loginCredentials)
                .end((error: any, res: Response) => {
                    res.should.have.status(200);
                    res.should.have.cookie("user");

                    const sessionCookie: string = res.get("Set-Cookie")[0];

                    chai.request(app)
                        .post("/api/auth/logout")
                        .set("Cookie", sessionCookie)
                        .send()
                        .end((error: any, res: Response) => {
                            res.should.have.status(200);

                            chai.request(app)
                                .post("/api/auth/logout")
                                .set("Cookie", sessionCookie)
                                .send()
                                .end((error: any, res: Response) => {
                                    res.should.have.status(401);
                                    res.body.should.be.not.empty;
                                    done();
                                });
                        });
                });
        });
    });
});
