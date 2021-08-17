import { NextFunction, Request, Response } from "express";
import CourseService from "../service/CourseService";
import ServiceSingleton from "../singleton/ServiceSingleton";
import ResponseHandler from "../utils/ResponseHandler";

const courseService: CourseService = ServiceSingleton.courseService;

export default async function courseExistsMid(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;

    if (!(await courseService.idExists(id))) {
        ResponseHandler.sendNotFound("Course not found.");
        return;
    }

    next();
}
