import { Message, Pagination } from '@ddboot/core';
import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { BatchDeleteDTO, QueryParam } from '~/models';
import { AddPostDTO, PostReleaseDTO, UpdatePostDTO } from './post.dto';
import { ICurl } from '~/interfaces';
import { Observable } from 'rxjs';
import { OAuthGuard } from '~/guard/oauth.guard';
import { OAuthScope } from '~/decorator';

@Controller('post')
export class PostController implements ICurl<AddPostDTO, UpdatePostDTO> {
  constructor(private readonly postService: PostService) {}

  @Message('get post list success')
  @Pagination()
  @UseGuards(OAuthGuard)
  @OAuthScope(['admin:blog'])
  @Get()
  list(
    @Query() queryParam: QueryParam,
    @Query('title') postTitle: string,
    @Query('id') id: string,
  ): Observable<any> | Promise<any> {
    return this.postService.list(queryParam, postTitle, id);
  }

  @Post()
  @UseGuards(OAuthGuard)
  @OAuthScope(['admin:blog'])
  @Message('add post success')
  post(
    @Body() addDTO: AddPostDTO,
  ): Observable<{ id: string }> | Promise<{ id: string }> {
    return this.postService.post(addDTO);
  }

  @Put()
  @UseGuards(OAuthGuard)
  @OAuthScope(['admin:blog'])
  @Message('update post success')
  put(@Body() updateDTO: UpdatePostDTO): Observable<{ id: string }> {
    return this.postService.put(updateDTO);
  }

  @Delete()
  @UseGuards(OAuthGuard)
  @OAuthScope(['admin:blog'])
  @Message('delete post success')
  batchDel(
    @Body() batchDel: BatchDeleteDTO,
  ): Promise<object> | Observable<object> {
    return this.postService.batchDel(batchDel);
  }

  @Put('release')
  @UseGuards(OAuthGuard)
  @OAuthScope(['admin:blog'])
  @Message('release post success')
  releasePost(@Body() postRelease: PostReleaseDTO) {
    return this.postService.releasePost(postRelease);
  }
}
