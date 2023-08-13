import { IsNotEmpty, IsString } from 'class-validator';

export class EditGroupMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
