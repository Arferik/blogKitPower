import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { OrderBy, PaginationParam } from './prisma.interface';

const sortMap = {
  ascend: 'asc',
  descend: 'desc',
};

@Injectable()
export class PrismaHelper {
  /**
   * 针对 antd 排序
   * @param createdAt
   * @param updatedAt
   */
  getOrderBy(createdAt?: string, updatedAt?: string): OrderBy {
    if (createdAt) {
      return {
        created_at: sortMap[createdAt] as never,
      };
    }
    if (updatedAt) {
      return {
        modified_at: sortMap[updatedAt] as never,
      };
    }
    return {};
  }

  paginationParams(params: PaginationParam): {
    take?: number;
    skip?: number;
    orderBy?: OrderBy;
  } {
    const { current, page_size, created_at, modified_at } = params;
    if (!current || !page_size) {
      return {};
    }
    const pageNum = current || 1;
    //默认20
    const take = page_size || 20;
    const orderBy = this.getOrderBy(created_at, modified_at);
    if (!isEmpty(orderBy)) {
      return {
        take: Number(take),
        skip: Number(pageNum) - 1,
        orderBy,
      };
    }
    return {
      take: Number(take),
      skip: Number(pageNum) - 1,
    };
  }

  likeQuery<T>(keyWord?: string, pickKey?: keyof T) {
    const queryParam = {} as Record<keyof T, any>;
    if (keyWord) {
      queryParam[pickKey] = {
        contains: keyWord,
      };
    }
    return queryParam;
  }
}
