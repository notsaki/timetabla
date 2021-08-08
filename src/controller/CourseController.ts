import { Request, Response, Router } from "express";
import CourseService from "../service/CourseService";
import ServiceSingleton from "../singleton/ServiceSingleton";
import ResponseHandler from "../utils/ResponseHandler";
import { addNewCourseSchemaValidator } from "../middleware/SchemaValidatorMiddleware";
import NewCourseBody from "../schema/requestbody/NewCourseBody";
import professorIdsExist from "../middleware/ProfessorIdsExist";

const courseController = Router();

const courseService: CourseService = ServiceSingleton.courseService;

courseController.get("/", addNewCourseSchemaValidator, professorIdsExist, async function (req: Request, res: Response) {
    const course: NewCourseBody = req.body;

    try {
        await courseService.saveOne(course);
    } catch (error: any) {
        ResponseHandler.sendInternalServerError();
        return;
    }

    ResponseHandler.sendOk("Course added successfully!");
});

export default courseController;
