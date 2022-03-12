import * as express from 'express';
import Controller from '../interfaces/controller.interface'
import userModel from "../user/users.model";
import ValidationMiddleware from "../middleware/validation.middleware";
import CreateUserDto from "../user/users.dto";
import LoginUserDto from "./login.dto";
import * as bcrypt from 'bcrypt';
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import WrongCredentialException from "../exceptions/WrongCredentialException";

class AuthController implements Controller {
    public path = '/auth';
    public router = express.Router();
    private user = userModel;

    constructor() {
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(`${this.path}/register`, ValidationMiddleware(CreateUserDto), this.registration);
        this.router.post(`${this.path}/login`, this.login);
    }

    public registration = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const userData: CreateUserDto = req.body;
        const email = await this.user.findOne({email:userData.email});

        if(email) {
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        } else {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await this.user.create({
                ...userData,
                password: hashedPassword
            });

            user.password = undefined;
            res.json(user);
        }
    }

    public login = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const loginData: LoginUserDto = req.body;
        const user = await this.user.findOne({email:loginData.email});

        if(user) {
            const isPasswordMatching = await bcrypt.compare(loginData.password, user.password);

            if(isPasswordMatching) {
                user.password = undefined;
                res.json(user);
            } else {
                next(new WrongCredentialException());
            }
        } else {
            next(new WrongCredentialException());
        }
    }
}

export default AuthController;