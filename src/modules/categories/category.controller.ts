import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryCurl } from './category.interface';
import { CategoryDTO, updateCategoryDTO } from './category.dto';
import { Message } from '@ddboot/core';
import { CategoryService } from './category.service';
import { OAuthGuard } from '~/guard/oauth.guard';
import { OAuthScope } from '~/decorator';

@Controller('category')
export class CategoryController
  implements CategoryCurl<CategoryDTO, updateCategoryDTO>
{
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Message('get category list success')
  getAll() {
    return this.categoryService.getAll();
  }

  @Put()
  @Message('update category success')
  @UseGuards(OAuthGuard)
  @OAuthScope(['admin:blog'])
  update(@Body() t: updateCategoryDTO) {
    return this.categoryService.update(t);
  }

  @Delete()
  @UseGuards(OAuthGuard)
  @OAuthScope(['admin:blog'])
  @Message('delete category success')
  del(@Body() delId: { ids: string[] }) {
    return this.categoryService.del(delId);
  }

  @Post()
  @UseGuards(OAuthGuard)
  @OAuthScope(['admin:blog'])
  @Message('add category success')
  add(@Body() t: CategoryDTO) {
    return this.categoryService.add(t);
  }
}
