import { PaginationParam, PrismaHelper, PrismaService } from '@ddboot/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PostDTO, PostReleaseDTO } from './post.dto';
import { Log4j } from '@ddboot/log4js';

@Injectable()
export class PostDao {
  @Log4j()
  private log: Logger;

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
        modified_at: true,
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
        modified_at: true,
        is_release: true,
        images: {
          select: {
            id: true,
            url: true,
            name: true,
            type: true,
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

  addPost(postDTO: PostDTO) {
    return this.prismaService.post.create({
      data: {
        title: postDTO.title,
        content: postDTO.content,
        description: postDTO.description,
        is_release: postDTO.is_release,
        Category: {
          connect: {
            id: postDTO.category_id,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }

  addPostTag(postId: string, tagIds: string[]) {
    return this.prismaService.postOnTags.createMany({
      data: tagIds.map((tagId) => {
        return {
          post_id: postId,
          tag_id: tagId,
        };
      }),
    });
  }
  /**
   * 批量更新图片id 和 类型
   * @param postDTO
   * @param postId
   * @returns
   */
  updatePostImage(postDTO: PostDTO, postId: string) {
    const updateImages = postDTO.images.map((image) => {
      return this.prismaService.image.update({
        where: {
          id: image.id,
        },
        data: {
          type: image.type,
          Post: {
            connect: {
              id: postId,
            },
          },
        },
      });
    });
    return this.prismaService.$transaction(updateImages);
  }

  releasePost(postDTO: PostReleaseDTO) {
    return this.prismaService.post.update({
      where: {
        id: postDTO.id,
      },
      data: {
        is_release: postDTO.is_release,
      },
    });
  }

  uploadPostImage(fileInfo: { filename: string; path: string }) {
    return this.prismaService.image.create({
      data: {
        name: fileInfo.filename,
        url: fileInfo.path,
      },
      select: {
        id: true,
        name: true,
        url: true,
      },
    });
  }
}
