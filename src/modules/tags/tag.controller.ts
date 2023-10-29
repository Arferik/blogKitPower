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
import { TAGCurl } from './tag.interface';
import { TagDTO, UpdateTagDTO } from './tag.dto';
import { TagService } from './tag.service';
import { OAuthGuard } from '~/guard/oauth.guard';
import { OAuthScope } from '~/decorator';

@Controller('tag')
export class TagController implements TAGCurl<TagDTO, UpdateTagDTO> {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @Message('get tag list success')
  @UseGuards(OAuthGuard)
  @OAuthScope(['admin:blog'])
  getAll() {
    return this.tagService.getAll();
  }

  @Put()
  @Message('update tag success')
  @UseGuards(OAuthGuard)
  @OAuthScope(['admin:blog'])
  update(@Body() t: UpdateTagDTO) {
    return this.tagService.update(t);
  }

  @Delete()
  @UseGuards(OAuthGuard)
  @OAuthScope(['admin:blog'])
  @Message('delete tag success')
  del(@Body() delId: { ids: string[] }) {
    return this.tagService.del(delId);
  }

  @Post()
  @UseGuards(OAuthGuard)
  @OAuthScope(['admin:blog'])
  @Message('add tag success')
  add(@Body() t: TagDTO) {
    return this.tagService.add(t);
  }
}
