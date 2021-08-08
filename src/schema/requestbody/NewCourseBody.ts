import { IsDefined } from "class-validator";
import { Expose } from "class-transformer";
import { Semester } from "../database/CourseSchema";

export default class NewCourseBody {
    @IsDefined()
    @Expose()
    name: string;

    @IsDefined()
    @Expose()
    professorIds: string[];

    @IsDefined()
    @Expose()
    theoryHours: number;

    @IsDefined()
    @Expose()
    labHours: number;

    @IsDefined()
    @Expose()
    coachingHours: number;

    @IsDefined()
    @Expose()
    semester: Semester;
}
