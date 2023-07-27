import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryDAO } from './category.dao';
import { JwtModule } from '@nestjs/jwt';
import { CONFIG, ConfigService } from '@ddboot/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('jwt.key');
        return {
          secret,
        };
      },
      inject: [CONFIG],
    }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryDAO],
})
export class CategoryModule {}
