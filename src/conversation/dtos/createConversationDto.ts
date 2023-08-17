import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  message?: string;
}
