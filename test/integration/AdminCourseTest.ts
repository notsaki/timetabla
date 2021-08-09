import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../src/Timetabla";
import { Response } from "superagent";
import { resetCourseCollectionState, resetUserCollectionState } from "../utils/BeforeEach";
import userLogin, { adminLogin, getSessionId } from "utils/UserLogin";
import ServiceSingleton from "../../src/singleton/ServiceSingleton";
import NewCourseBody from "../../src/schema/requestbody/NewCourseBody";
import { Semester } from "../../src/schema/database/CourseSchema";
import CourseService from "../../src/service/CourseService";

const should = chai.should();

chai.use(chaiHttp);

const courseService: CourseService = ServiceSingleton.courseService;

describe("Admin Course", () => {
    before(resetUserCollectionState);
    beforeEach(resetCourseCollectionState);

    describe("POST /api/admin/course", () => {
        it("Admin creating a course should return ok", async function () {
            const adminNewCourseBody: NewCourseBody = {
                name: "Ham cutting",
                professorIds: ["100000000000000000001012", "100000000000000000001013"],
                theoryHours: 3,
                labHours: 2,
                coachingHours: 2,
                semester: Semester.Winter,
            };

            let res: Response = await adminLogin();

            res = await chai
                .request(app)
                .post("/api/admin/course")
                .set("Cookie", getSessionId(res))
                .send(adminNewCourseBody);

            res.should.have.status(200);
            res.body.should.be.not.empty;

            expect(await courseService.exists({ name: adminNewCourseBody.name })).to.be.true;
        });

        it("Admin creating a course including a non-professor user should return unprocessable entity", async function () {
            const adminNewCourseBody: NewCourseBody = {
                name: "Ham cutting",
                professorIds: ["100000000000000000001000", "100000000000000000001013"],
                theoryHours: 3,
                labHours: 2,
                coachingHours: 2,
                semester: Semester.Winter,
            };

            let res: Response = await adminLogin();

            res = await chai
                .request(app)
                .post("/api/admin/course")
                .set("Cookie", getSessionId(res))
                .send(adminNewCourseBody);

            res.should.have.status(422);
            res.body.should.be.not.empty;

            expect(await courseService.exists({ name: adminNewCourseBody.name })).to.be.false;
        });

        it("User creating a course should return forbidden", async function () {
            const adminNewCourseBody: NewCourseBody = {
                name: "Ham cutting",
                professorIds: ["100000000000000000001012", "100000000000000000001013"],
                theoryHours: 3,
                labHours: 2,
                coachingHours: 2,
                semester: Semester.Winter,
            };

            let res: Response = await userLogin("coltenemy", "password");

            res = await chai
                .request(app)
                .post("/api/admin/course")
                .set("Cookie", getSessionId(res))
                .send(adminNewCourseBody);

            res.should.have.status(403);
            res.body.should.be.not.empty;

            expect(await courseService.exists({ name: adminNewCourseBody.name })).to.be.false;
        });

        it("Admin creating a course with no professors should return unprocessable entity", async function () {
            const adminNewCourseBody: NewCourseBody = {
                name: "Ham cutting",
                professorIds: [],
                theoryHours: 3,
                labHours: 2,
                coachingHours: 2,
                semester: Semester.Winter,
            };

            let res: Response = await adminLogin();

            res = await chai
                .request(app)
                .post("/api/admin/course")
                .set("Cookie", getSessionId(res))
                .send(adminNewCourseBody);

            res.should.have.status(422);
            res.body.should.be.not.empty;

            expect(await courseService.exists({ name: adminNewCourseBody.name })).to.be.false;
        });

        it("Admin creating a course with invalid semester should return unprocessable entity", async function () {
            const adminNewCourseBody: NewCourseBody = {
                name: "Ham cutting",
                professorIds: ["100000000000000000001012", "100000000000000000001013"],
                theoryHours: 3,
                labHours: 2,
                coachingHours: 2,
                semester: 3,
            };

            let res: Response = await adminLogin();

            res = await chai
                .request(app)
                .post("/api/admin/course")
                .set("Cookie", getSessionId(res))
                .send(adminNewCourseBody);

            res.should.have.status(422);
            res.body.should.be.not.empty;

            expect(await courseService.exists({ name: adminNewCourseBody.name })).to.be.false;
        });

        it("Admin creating a course with negative numbers should return unprocessable entity", async function () {
            const adminNewCourseBody: NewCourseBody = {
                name: "Ham cutting",
                professorIds: ["100000000000000000001012", "100000000000000000001013"],
                theoryHours: -2,
                labHours: 2,
                coachingHours: 2,
                semester: 3,
            };

            let res: Response = await adminLogin();

            res = await chai
                .request(app)
                .post("/api/admin/course")
                .set("Cookie", getSessionId(res))
                .send(adminNewCourseBody);

            res.should.have.status(422);
            res.body.should.be.not.empty;

            expect(await courseService.exists({ name: adminNewCourseBody.name })).to.be.false;
        });

        it("Admin creating a course with empty name should return unprocessable entity", async function () {
            const adminNewCourseBody: NewCourseBody = {
                name: "",
                professorIds: ["100000000000000000001012", "100000000000000000001013"],
                theoryHours: 3,
                labHours: 2,
                coachingHours: 2,
                semester: 3,
            };

            let res: Response = await adminLogin();

            res = await chai
                .request(app)
                .post("/api/admin/course")
                .set("Cookie", getSessionId(res))
                .send(adminNewCourseBody);

            res.should.have.status(422);
            res.body.should.be.not.empty;

            expect(await courseService.exists({ name: adminNewCourseBody.name })).to.be.false;
        });

        it("Admin creating a course with zero hours should return unprocessable entity", async function () {
            const adminNewCourseBody: NewCourseBody = {
                name: "",
                professorIds: ["100000000000000000001012", "100000000000000000001013"],
                theoryHours: 0,
                labHours: 0,
                coachingHours: 0,
                semester: Semester.Winter,
            };

            let res: Response = await adminLogin();

            res = await chai
                .request(app)
                .post("/api/admin/course")
                .set("Cookie", getSessionId(res))
                .send(adminNewCourseBody);

            res.should.have.status(422);
            res.body.should.be.not.empty;

            expect(await courseService.exists({ name: adminNewCourseBody.name })).to.be.false;
        });

        it("Admin creating a course with more than 168 hours in total should return unprocessable entity", async function () {
            const adminNewCourseBody: NewCourseBody = {
                name: "",
                professorIds: ["100000000000000000001012", "100000000000000000001013"],
                theoryHours: 160,
                labHours: 80,
                coachingHours: 0,
                semester: Semester.Winter,
            };

            let res: Response = await adminLogin();

            res = await chai
                .request(app)
                .post("/api/admin/course")
                .set("Cookie", getSessionId(res))
                .send(adminNewCourseBody);

            res.should.have.status(422);
            res.body.should.be.not.empty;

            expect(await courseService.exists({ name: adminNewCourseBody.name })).to.be.false;
        });
    });
});
