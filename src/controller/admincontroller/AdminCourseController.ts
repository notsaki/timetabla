import { Request, Response, Router } from "express";
import CourseService from "../../service/CourseService";
import ServiceSingleton from "../../singleton/ServiceSingleton";
import ResponseHandler from "../../utils/ResponseHandler";
import { courseBodySchemaValidator } from "../../middleware/SchemaValidatorMiddleware";
import CourseBody from "../../schema/requestbody/CourseBody";
import professorIdsExist from "../../middleware/ProfessorIdsExist";
import { adminCourseBodyDataValidatorMid } from "../../middleware/DataValidatorMid";
import courseExistsMid from "../../middleware/CourseExistsMid";

const adminCourseController = Router();

const courseService: CourseService = ServiceSingleton.courseService;

adminCourseController.post(
    "/",
    courseBodySchemaValidator,
    professorIdsExist,
    adminCourseBodyDataValidatorMid,
    async function (req: Request, res: Response) {
        const course: CourseBody = req.body;

        try {
            await courseService.saveOne(course);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Course added successfully!");
    }
);

adminCourseController.patch(
    "/:id",
    courseBodySchemaValidator,
    courseExistsMid,
    professorIdsExist,
    adminCourseBodyDataValidatorMid,
    async function (req: Request, res: Response) {
        const id: string = req.params.id;
        const course: CourseBody = req.body;

        try {
            await courseService.updateOne(id, course);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Course updated successfully!");
    }
);

adminCourseController.delete("/:id", courseExistsMid, async function (req: Request, res: Response) {
    const id: string = req.params.id;

    try {
        await courseService.deleteOne(id);
    } catch (error: any) {
        ResponseHandler.sendInternalServerError();
        return;
    }

    ResponseHandler.sendOk("Course deleted successfully!");
});

export default adminCourseController;
