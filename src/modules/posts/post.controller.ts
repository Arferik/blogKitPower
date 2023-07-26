import { Message, Pagination } from '@ddboot/core';
import {
  Body,
  Controller,
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '~/guard/auth.guard';
import { QueryParam } from '~/models/queryParam.dto';
import { PostDTO, PostReleaseDTO } from './post.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('upload')
  @UseGuards(AuthGuard)
  @Message('upload post image success')
  @UseInterceptors(FileInterceptor('pic'))
  uploadPostImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.postService.uploadPostImage(file);
  }
}
