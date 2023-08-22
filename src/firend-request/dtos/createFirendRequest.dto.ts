import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFirendRequestDto {
  @IsString()
  @IsNotEmpty()
  receiver: string;
}
