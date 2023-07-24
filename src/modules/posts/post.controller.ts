import { Message, Pagination } from '@ddboot/core';
import { Controller, Query, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '~/guard/auth.guard';
import { QueryParam } from '~/models/queryParam.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Message('get post list success')
  @Pagination()
  @UseGuards(AuthGuard)
  listPost(
    @Query() queryParam: QueryParam,
    @Query('title') hostname: string,
    @Query('id') id: string,
  ) {
    return this.postService.listPost(queryParam, hostname, id);
  }
}
