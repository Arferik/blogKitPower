import { Injectable } from '@nestjs/common';
import { CategoryDTO, updateCategoryDTO } from './category.dto';
import { CategoryCurl } from './category.interface';
import { CategoryDAO } from './category.dao';

@Injectable()
export class CategoryService
  implements CategoryCurl<CategoryDTO, updateCategoryDTO>
{
  constructor(private readonly categoryDAO: CategoryDAO) {}

  getAll() {
    return this.categoryDAO.getAll();
  }
  update(t: updateCategoryDTO) {
    return this.categoryDAO.update(t);
  }

  del(ids: { ids: string[] }) {
    return this.categoryDAO.del(ids);
  }
  add(t: CategoryDTO) {
    return this.categoryDAO.add(t);
  }
}
