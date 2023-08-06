import { ArrayNotEmpty, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @ArrayNotEmpty()
  users: string[];

  @IsOptional()
  title?: string;
}
