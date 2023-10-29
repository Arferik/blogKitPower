import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryDAO } from './category.dao';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryDAO],
})
export class CategoryModule {}
