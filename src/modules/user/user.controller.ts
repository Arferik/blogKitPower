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
import { Request } from 'express';
import { BatchDeleteDTO, QueryParam } from '~/models/queryParam.dto';
import { OAuthGuard } from '~/guard/oauth.guard';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Message('user register success')
  register(@Body() user: UserDto) {
    return this.userService.createUser(user.username, user.password);
  }

  @Get('current')
  @UseGuards(OAuthGuard)
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
  @UseGuards(OAuthGuard)
  @Get()
  listPost(
    @Query() queryParam: QueryParam,
    @Query('title') postTitle: string,
    @Query('id') id: string,
  ) {
    return this.userService.listUser(queryParam, postTitle, id);
  }

  @Delete()
  @UseGuards(OAuthGuard)
  @Message('delete user success')
  del(@Body() delId: BatchDeleteDTO) {
    return this.userService.delBatchById(delId);
  }

  @Put()
  @Message('delete user success')
  @UseGuards(OAuthGuard)
  updateUser(@Body() userUpdate: UpdateUserDTO) {
    this.userService.updateUser(userUpdate);
  }
}
