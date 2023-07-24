import { PaginationParam, PrismaHelper, PrismaService } from '@ddboot/prisma';
import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';

@Injectable()
export class PostDao {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly prismaHelper: PrismaHelper,
  ) {}

  /**
   *  文章列表
   * @param pagination
   * @param keyWord
   * @returns
   */
  listPost(pagination: PaginationParam, keyWord?: string) {
    const containName = this.prismaHelper.likeQuery<Post>(keyWord, 'title');
    const pageParams = this.prismaHelper.paginationParams(pagination);
    const data = this.prismaService.post.findMany({
      ...pageParams,
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        update_at: true,
        is_release: true,
        Category: {
          select: {
            id: true,
            name: true,
          },
        },
        PostOnTag: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        ...containName,
      },
    });
    const count = this.prismaService.post.count({
      where: {
        ...containName,
      },
    });
    return this.prismaService.$transaction([data, count]);
  }

  getPostDetailById(vmId: string) {
    return this.prismaService.post.findUnique({
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        update_at: true,
        is_release: true,
        cover: {
          select: {
            id: true,
            url: true,
            name: true,
          },
        },
        Category: {
          select: {
            id: true,
            name: true,
          },
        },
        PostOnTag: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        id: vmId,
      },
    });
  }
}
