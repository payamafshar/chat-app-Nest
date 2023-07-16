import {
  Controller,
  Inject,
  Post,
  Body,
  Get,
  UseGuards,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IAuthService } from './auth';
import { CreateUserDto } from './dtos/createUserDto';
import { IUsersService } from 'src/users/users';
import { instanceToPlain } from 'class-transformer';
import { LocalAuthGuard } from './utils/guards';
import { Response } from 'express';
import { RegisterInterceptor } from './utils/registerInterceptor';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private authService: IAuthService,
    @Inject(Services.USERS) private usersService: IUsersService,
  ) {}

  @Post('register')
  @UseInterceptors(RegisterInterceptor)
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return instanceToPlain(await this.usersService.createUser(createUserDto));
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  loginUser(@Res() response: Response) {
    return response.send('hello');
  }

  @Post('logout')
  logoutUser() {}

  @Get('status')
  getUserStatus() {}
}
