import { NextFunction, Request, Response } from "express";
import NewCourseBody from "../schema/requestbody/NewCourseBody";
import ResponseHandler from "../utils/ResponseHandler";
import UserService from "../service/UserService";
import ServiceSingleton from "../singleton/ServiceSingleton";

const userService: UserService = ServiceSingleton.userService;

export default function professorIdsExist(req: Request, res: Response, next: NextFunction) {
    const course: NewCourseBody = req.body;
    const nonExistentIds: string[] = course.professorIds.filter(
        async (id: string) => !(await userService.idExists(id))
    );

    if (nonExistentIds.length > 0) {
        ResponseHandler.sendNotFound("One or more of the referenced professors do not exist.", nonExistentIds);
        return;
    }

    next();
}
