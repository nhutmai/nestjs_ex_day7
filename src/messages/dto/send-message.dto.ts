import { IsMongoId, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsMongoId()
  roomId: string;

  @IsString()
  content: string;
}
