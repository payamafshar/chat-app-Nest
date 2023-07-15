import { Controller, Inject, Post, Body, Get } from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IAuthService } from './auth';
import { CreateUserDto } from './dtos/createUserDto';
import { IUsersService } from 'src/users/users';
import { instanceToPlain } from 'class-transformer';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private authService: IAuthService,
    @Inject(Services.USERS) private usersService: IUsersService,
  ) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return instanceToPlain(await this.usersService.createUser(createUserDto));
  }

  @Post('login')
  loginUser() {}

  @Post('logout')
  logoutUser() {}

  @Get('status')
  getUserStatus() {}
}
