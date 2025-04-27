import { IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  id: string;

  @IsString()
  @MinLength(2)
  username: string;
}
