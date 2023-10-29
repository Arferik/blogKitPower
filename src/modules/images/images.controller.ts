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
import { OAuthGuard } from '~/guard/oauth.guard';
import { BatchDeleteDTO, QueryParam } from '~/models/queryParam.dto';

@Controller('image')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseGuards(OAuthGuard)
  @Message('upload post image success')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpeg',
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
  @UseGuards(OAuthGuard)
  @Get()
  listImage(@Query() queryParam: QueryParam, @Query('id') id: string) {
    return this.imagesService.listImg(queryParam, id);
  }

  @Delete()
  @UseGuards(OAuthGuard)
  @Message('remove image success')
  removeImage(@Body() { ids }: BatchDeleteDTO) {
    return this.imagesService.batchRemoveImage(ids);
  }
}
