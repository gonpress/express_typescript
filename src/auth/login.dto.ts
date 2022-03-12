import {IsEmail, IsString} from "class-validator";


class LoginUserDto {
    @IsEmail()
    public email: string;

    @IsString()
    public password: string;
}

export default LoginUserDto