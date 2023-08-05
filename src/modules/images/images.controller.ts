import { ImagesService } from './images.service';
import { Message, Pagination } from '@ddboot/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '~/guard/auth.guard';
import { BatchDeleteDTO, QueryParam } from '~/models/queryParam.dto';

@Controller('image')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @Message('upload post image success')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 3 * 1024 * 1024, //b
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.imagesService.uploadImage(file);
  }

  @Message('get post image success')
  @Pagination()
  @UseGuards(AuthGuard)
  @Get()
  listImage(@Query() queryParam: QueryParam, @Query('id') id: string) {
    return this.imagesService.listImg(queryParam, id);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @Message('remove image success')
  removeImage(@Body() { ids }: BatchDeleteDTO) {
    return this.imagesService.batchRemoveImage(ids);
  }
}
