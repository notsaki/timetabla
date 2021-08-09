import { NextFunction, Request, Response } from "express";
import NewCourseBody from "../schema/requestbody/NewCourseBody";
import ResponseHandler from "../utils/ResponseHandler";
import { atLeastOne, isBetween, sum } from "../utils/DataValidation";
import { Semester } from "../schema/database/CourseSchema";
import UserService from "../service/UserService";
import ServiceSingleton from "../singleton/ServiceSingleton";
import { Role, User } from "../schema/database/UserSchema";

const userService: UserService = ServiceSingleton.userService;

function userDataValidator(role: number, req: Request, res: Response, next: NextFunction) {
    if (role < 0 || role > 4) {
        ResponseHandler.sendUnprocessableEntity("Invalid role value.");
        return;
    }

    next();
}

export function adminNewUserDataValidator(req: Request, res: Response, next: NextFunction) {
    userDataValidator(req.body.role, req, res, next);
}

export function adminUpdateRoleDataValidatorMid(req: Request, res: Response, next: NextFunction) {
    userDataValidator(req.body.data.role, req, res, next);
}

export async function adminNewCourseDataValidatorMid(req: Request, res: Response, next: NextFunction) {
    const course: NewCourseBody = req.body;
    const min = 0;
    const max = 168;

    const courseHours: number[] = [course.theoryHours, course.labHours, course.coachingHours];

    const errorsList: string[] = [];

    if (!isBetween(course.theoryHours, min, max)) {
        errorsList.push(`Theory hours must be greater than ${min}-${max} hours.`);
    }

    if (!isBetween(course.labHours, min, max)) {
        errorsList.push(`Lab hours must be between ${min}-${max} hours.`);
    }

    if (!isBetween(course.coachingHours, min, max)) {
        errorsList.push(`Coaching hours must be between ${min}-${max} hours.`);
    }

    if (course.professorIds.length === 0) {
        errorsList.push("You need to add at least one professor.");
    }

    if (sum(course.theoryHours, course.labHours, course.coachingHours) > max) {
        errorsList.push(`Hours in total must not exceed ${max}.`);
    }

    if (!atLeastOne((val: number) => val > min, ...courseHours)) {
        errorsList.push(`At least one hour of lesson time must be provided.`);
    }

    if (!(course.semester in [Semester.Winter, course.semester])) {
        errorsList.push(
            `Invalid semester value. Should be ${Semester.Winter} for winter or ${Semester.Summer} for summer.`
        );
    }

    for (const id of course.professorIds) {
        const user: User = await userService.findById(id);

        if (user.role !== Role.Professor) {
            errorsList.push(`User ${user.fullname} (${id}) is not a professor`);
        }
    }

    if (errorsList.length > 0) {
        ResponseHandler.sendUnprocessableEntity("One or more properties in the body have invalid values.", errorsList);
        return;
    }

    next();
}
