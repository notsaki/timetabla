import CourseService from "../service/CourseService";
import UserService from "../service/UserService";

export default class ServiceSingleton {
    private static _userService: UserService = new UserService();
    private static _courseService: CourseService = new CourseService();

    static get userService(): UserService {
        return ServiceSingleton._userService;
    }

    static get courseService(): CourseService {
        return ServiceSingleton._courseService;
    }
}
