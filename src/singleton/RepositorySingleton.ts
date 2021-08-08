import UserRepository from "../repository/UserRepository";
import CourseRepository from "../repository/CourseRepository";

export default class RepositorySingleton {
    private static _userRepository: UserRepository = new UserRepository();
    private static _courseRepository: CourseRepository = new CourseRepository();

    static get userRepository(): UserRepository {
        return RepositorySingleton._userRepository;
    }

    static get courseRepository(): CourseRepository {
        return RepositorySingleton._courseRepository;
    }
}
