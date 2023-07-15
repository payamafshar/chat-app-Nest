import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(16)
  username: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
