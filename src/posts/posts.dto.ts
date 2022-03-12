import {IsString, Length} from "class-validator";


class CreatePostDto {
    @IsString()
    public author: string;

    @IsString()
    public title: string;

    @IsString()
    @Length(10, 50)
    public content: string;
}

export default CreatePostDto;