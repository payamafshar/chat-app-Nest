import { IsNotEmpty, IsString } from 'class-validator';

export class AddRecipientDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
