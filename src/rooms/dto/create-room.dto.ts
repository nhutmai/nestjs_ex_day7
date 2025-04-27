import { IsString, IsOptional, IsArray, IsIn } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsIn(['private', 'group'])
  type: 'private' | 'group';

  @IsOptional()
  @IsArray()
  members?: string[];
}
