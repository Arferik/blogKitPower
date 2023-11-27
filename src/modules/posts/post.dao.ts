import { PaginationParam, PrismaHelper, PrismaService } from '~/prisma';
import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { AddPostDTO, PostReleaseDTO, UpdatePostDTO } from './post.dto';
import { Log4j, Logger } from '@ddboot/log4js';

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
    this.log.debug('call listPost ,pageParams', pageParams);
    const data = this.prismaService.post.findMany({
      ...pageParams,
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        modified_at: true,
        is_release: true,
        description: true,
        images: {
          select: {
            id: true,
            url: true,
            name: true,
            type: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
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
        description: true,
        images: {
          select: {
            id: true,
            url: true,
            name: true,
            type: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
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

  addPost(postDTO: AddPostDTO) {
    return this.prismaService.post.create({
      data: {
        title: postDTO.title,
        content: postDTO.content,
        description: postDTO.description,
        is_release: postDTO.is_release,
        category: {
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

  delPostTagByPostId(postId: string) {
    return this.prismaService.postOnTags.deleteMany({
      where: {
        post_id: postId,
      },
    });
  }

  /**
   * 批量更新图片id 和 类型
   * @param postDTO
   * @param postId
   * @returns
   */
  updatePostImage(postDTO: AddPostDTO, postId: string) {
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
    return updateImages;
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

  batchDel(delId: string[]) {
    return this.prismaService.$transaction([
      this.prismaService.postOnTags.deleteMany({
        where: {
          post_id: {
            in: delId,
          },
        },
      }),
      this.prismaService.post.deleteMany({
        where: {
          id: {
            in: delId,
          },
        },
      }),
    ]);
  }

  updatePost(post: UpdatePostDTO) {
    const updatePost = this.prismaService.post.update({
      where: {
        id: post.id,
      },
      data: {
        title: post.title,
        content: post.content,
        description: post.description,
        is_release: post.is_release,
        category: {
          connect: {
            id: post.category_id,
          },
        },
      },
    });
    const delPostTagByPostId = this.delPostTagByPostId(post.id);
    const addPostTag = this.addPostTag(post.id, post.tag_ids);
    const updatePostImage = this.updatePostImage(post, post.id);
    return this.prismaService.$transaction([
      updatePost,
      delPostTagByPostId,
      addPostTag,
      ...updatePostImage,
    ]);
  }

  latestPost() {
    return this.prismaService.post.findMany({
      take: 20,
      select: {
        id: true,
        title: true,
        description: true,
        images: {
          select: {
            url: true,
            id: true,
          },
          where: {
            type: 'COVER',
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        created_at: true,
      },
      where: {
        is_release: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
