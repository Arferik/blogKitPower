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
import { AuthGuard } from '~/guard/auth.guard';

@Controller('category')
export class CategoryController
  implements CategoryCurl<CategoryDTO, updateCategoryDTO>
{
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Message('get category list success')
  @UseGuards(AuthGuard)
  getAll() {
    return this.categoryService.getAll();
  }

  @Put()
  @Message('update category success')
  @UseGuards(AuthGuard)
  update(@Body() t: updateCategoryDTO) {
    return this.categoryService.update(t);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @Message('delete category success')
  del(@Body() delId: { ids: string[] }) {
    return this.categoryService.del(delId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Message('add category success')
  add(@Body() t: CategoryDTO) {
    return this.categoryService.add(t);
  }
}
