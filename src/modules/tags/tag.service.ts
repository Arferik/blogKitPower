import { Injectable } from '@nestjs/common';
import { TagDTO, UpdateTagDTO } from './tag.dto';
import { TAGCurl } from './tag.interface';
import { TagDAO } from './tag.dao';
import { from, map } from 'rxjs';

@Injectable()
export class TagService implements TAGCurl<TagDTO, UpdateTagDTO> {
  constructor(private readonly tagDAO: TagDAO) {}

  async getAll() {
    return from(this.tagDAO.getAll()).pipe(
      map((res) => {
        return res ?? [];
      }),
    );
  }
  update(t: UpdateTagDTO) {
    return this.tagDAO.update(t);
  }

  del(ids: { ids: string[] }) {
    return this.tagDAO.del(ids);
  }
  add(t: TagDTO) {
    return this.tagDAO.add(t);
  }
}
