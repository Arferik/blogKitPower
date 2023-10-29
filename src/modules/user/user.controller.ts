import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '~/modules/user/user.service';
import { UpdateUserDTO, UserDto } from '~/modules/user/user.dto';
import { Message, Pagination } from '@ddboot/core';
import { AuthGuard } from '~/guard/auth.guard';
import { Request } from 'express';
import { BatchDeleteDTO, QueryParam } from '~/models/queryParam.dto';
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

  @Post()
  @Message('user add success')
  userAdd(@Body() user: UserDto) {
    return this.userService.createUser(user.username, user.password);
  }

  @Message('get user list success')
  @Pagination()
  @UseGuards(AuthGuard)
  @Get()
  listPost(
    @Query() queryParam: QueryParam,
    @Query('title') postTitle: string,
    @Query('id') id: string,
  ) {
    return this.userService.listUser(queryParam, postTitle, id);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @Message('delete user success')
  del(@Body() delId: BatchDeleteDTO) {
    return this.userService.delBatchById(delId);
  }

  @Put()
  @Message('delete user success')
  @UseGuards(AuthGuard)
  updateUser(@Body() userUpdate: UpdateUserDTO) {
    this.userService.updateUser(userUpdate);
  }
}
