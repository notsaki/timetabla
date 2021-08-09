import { IsDefined, Matches } from "class-validator";
import { Expose } from "class-transformer";
import { Semester } from "../database/CourseSchema";

const regex = {
    name: /.{1,64}/,
};

export default class NewCourseBody {
    @IsDefined()
    @Expose()
    @Matches(RegExp(regex.name))
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
