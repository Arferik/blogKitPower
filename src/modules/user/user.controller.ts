import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from '~/modules/user/user.service';
import { UserDto } from '~/modules/user/user.dto';
import { Message } from '@ddboot/core';
import { AuthGuard } from '~/guard/auth.guard';
import { Request } from 'express';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('login')
  @Message('user login success')
  login(@Body() user: UserDto) {
    return this.userService.signIn(user.username, user.password);
  }

  @Post('register')
  @Message('user register success')
  register(@Body() user: UserDto) {
    return this.userService.createUser(user.username, user.password);
  }

  @Get('current')
  @UseGuards(AuthGuard)
  getCurrent(@Req() request: Request) {
    const user = request['user'];
    return {
      username: user.username,
    };
  }
}
