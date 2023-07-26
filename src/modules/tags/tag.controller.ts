import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Message } from '@ddboot/core';
import { AuthGuard } from '~/guard/auth.guard';
import { TAGCurl } from './tag.interface';
import { TagDTO, UpdateTagDTO } from './tag.dto';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController implements TAGCurl<TagDTO, UpdateTagDTO> {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @Message('get category list success')
  @UseGuards(AuthGuard)
  getAll() {
    return this.tagService.getAll();
  }

  @Put()
  @Message('update category success')
  @UseGuards(AuthGuard)
  update(@Body() t: UpdateTagDTO) {
    return this.tagService.update(t);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @Message('delete category success')
  del(@Body() delId: { ids: string[] }) {
    return this.tagService.del(delId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Message('add category success')
  add(@Body() t: TagDTO) {
    return this.tagService.add(t);
  }
}
