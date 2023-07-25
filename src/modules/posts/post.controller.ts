import { Message, Pagination } from '@ddboot/core';
import { Body, Controller, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '~/guard/auth.guard';
import { QueryParam } from '~/models/queryParam.dto';
import {
  CategoryDTO,
  PostDTO,
  PostReleaseDTO,
  Tag,
  updateCategoryDTO,
  updateTagDTO,
} from './post.dto';

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

  @Post()
  @UseGuards(AuthGuard)
  @Message('add post success')
  addPost(@Body() postDTO: PostDTO) {
    return this.postService.addPost(postDTO);
  }

  @Put('release')
  @UseGuards(AuthGuard)
  @Message('release post success')
  releasePost(@Body() postRelease: PostReleaseDTO) {
    return this.postService.releasePost(postRelease);
  }

  @Post('category')
  @UseGuards(AuthGuard)
  @Message('add category success')
  addCategory(@Body() category: CategoryDTO) {
    return this.postService.addCategory(category);
  }

  @Post('tag')
  @UseGuards(AuthGuard)
  @Message('add tag success')
  addTag(@Body() tag: Tag) {
    return this.postService.addTag(tag);
  }

  @Put('category')
  @UseGuards(AuthGuard)
  @Message('add category success')
  updateCategory(@Body() category: updateCategoryDTO) {
    return this.postService.updateCategory(category);
  }

  @Put('tag')
  @UseGuards(AuthGuard)
  @Message('add tag success')
  updateTag(@Body() tag: updateTagDTO) {
    return this.postService.updateTag(tag);
  }
}
