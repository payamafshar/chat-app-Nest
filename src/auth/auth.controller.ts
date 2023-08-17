import {
  Controller,
  Inject,
  Post,
  Body,
  Get,
  UseGuards,
  Res,
  Req,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IAuthService } from './auth';
import { CreateUserDto } from './dtos/createUserDto';
import { IUsersService } from 'src/users/users';
import { instanceToPlain } from 'class-transformer';
import { AuthenticatedGuard, LocalAuthGuard } from './Strategy/guards';
import { Request, Response } from 'express';
import { RegisterInterceptor } from './Strategy/registerInterceptor';
import { SessionSerializer } from './Strategy/sessionSerializer';

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
    return response.send(HttpStatus.OK);
  }

  @Post('logout')
  logoutUser() {}

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  async status(@Req() req: Request, @Res() response: Response) {
    return response.send(req.user);
  }
}
