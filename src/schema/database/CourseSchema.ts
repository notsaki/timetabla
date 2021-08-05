import { model, Schema } from "mongoose";

export enum Semester {
    Winter,
    Summer,
}

export class Course {
    _id?: string = undefined;
    name: string;
    professorIds: string[];
    theoryHours: number;
    labHours: number;
    coachingHours: number;
    semester: Semester;
}

const schema = new Schema<Course>({
    name: {
        type: String,
        required: true,
        createIndexes: true,
        dropDups: true,
    },
    professorIds: {
        type: [String],
        required: true,
    },
    theoryHours: {
        type: Number,
        required: true,
    },
    labHours: {
        type: Number,
        required: true,
    },
    coachingHours: {
        type: Number,
        required: true,
    },
    semester: {
        type: Semester,
        required: true,
    },
});

export default model<Course>("Courses", schema);
