import { Injectable } from '@nestjs/common';
import { CategoryDTO, updateCategoryDTO } from './category.dto';
import { CategoryCurl } from './category.interface';
import { PrismaService } from '~/prisma';

@Injectable()
export class CategoryDAO
  implements CategoryCurl<CategoryDTO, updateCategoryDTO>
{
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.category.findMany();
  }
  update(t: updateCategoryDTO) {
    return this.prismaService.category.update({
      where: {
        id: t.id,
      },
      data: {
        name: t.name,
      },
      select: {
        id: true,
      },
    });
  }
  del({ ids }: { ids: string[] }) {
    return this.prismaService.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
  add(t: CategoryDTO) {
    return this.prismaService.category.create({
      data: {
        name: t.name,
      },
      select: {
        id: true,
      },
    });
  }
}
