import { Value } from '@ddboot/config';
import { PaginationParam, PrismaHelper, PrismaService } from '~/prisma';
import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';

@Injectable()
export class ImageDAO {
  @Value('assets.img.server_prefix')
  private readonly serverPrefix: string;

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
  listImgs(pagination: PaginationParam, keyWord?: string) {
    const containName = this.prismaHelper.likeQuery<Image>(keyWord, 'id');
    const pageParams = this.prismaHelper.paginationParams(pagination);
    const data = this.prismaService.image.findMany({
      ...pageParams,
      select: {
        id: true,
        url: true,
        created_at: true,
        modified_at: true,
        post_id: true,
        type: true,
        Post: {
          select: {
            title: true,
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

  uploadImage(fileInfo: { filename: string; path: string }) {
    const imgUrl = `${this.serverPrefix}/${fileInfo.filename}`;
    return this.prismaService.image.create({
      data: {
        name: fileInfo.filename,
        url: imgUrl,
        path: fileInfo.path,
      },
      select: {
        id: true,
        name: true,
        url: true,
      },
    });
  }

  removeImage(id: string) {
    return this.prismaService.image.delete({
      where: {
        id,
      },
    });
  }

  getImagePathById(id: string) {
    return this.prismaService.image.findUnique({
      where: {
        id,
      },
      select: {
        path: true,
      },
    });
  }
}
