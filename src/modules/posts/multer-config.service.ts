import { Value } from '@ddboot/config';
import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  @Value('upload.imageDestPath')
  private imageDestPath: string;

  createMulterOptions(): MulterModuleOptions {
    return {
      dest: this.imageDestPath,
    };
  }
}
