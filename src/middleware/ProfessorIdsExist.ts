import { NextFunction, Request, Response } from "express";
import CourseBody from "../schema/requestbody/CourseBody";
import ResponseHandler from "../utils/ResponseHandler";
import UserService from "../service/UserService";
import ServiceSingleton from "../singleton/ServiceSingleton";

const userService: UserService = ServiceSingleton.userService;

export default async function professorIdsExist(req: Request, res: Response, next: NextFunction) {
    const course: CourseBody = req.body;

    const nonExistentIds: string[] = [];
    // course.professorIds.filter(async (id: string) => await userService.idExists(id));
    for (const id of course.professorIds) {
        if (!(await userService.idExists(id))) {
            nonExistentIds.push(id);
        }
    }

    if (nonExistentIds.length > 0) {
        ResponseHandler.sendNotFound("One or more of the referenced professors do not exist.", nonExistentIds);
        return;
    }

    next();
}
