import { IsString, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(5, 50)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
