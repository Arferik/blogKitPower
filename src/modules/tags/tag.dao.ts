import { Injectable } from '@nestjs/common';
import { PrismaService } from '@ddboot/prisma';
import { TagDTO, UpdateTagDTO } from './tag.dto';
import { TAGCurl } from './tag.interface';

@Injectable()
export class TagDAO implements TAGCurl<TagDTO, UpdateTagDTO> {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.category.findMany({});
  }
  update(t: UpdateTagDTO) {
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
  add(t: TagDTO) {
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
