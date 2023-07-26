import { Injectable } from '@nestjs/common';
import { TagDTO, UpdateTagDTO } from './tag.dto';
import { TAGCurl } from './tag.interface';
import { TagDAO } from './tag.dao';

@Injectable()
export class TagService implements TAGCurl<TagDTO, UpdateTagDTO> {
  constructor(private readonly tagDAO: TagDAO) {}

  getAll() {
    return this.tagDAO.getAll();
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
