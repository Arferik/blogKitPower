import { Module } from '@nestjs/common';
import { ClientDAO } from './client.dao';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
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
  providers: [ClientDAO, ClientService],
  controllers: [ClientController],
  exports: [],
})
export class ClientModule {}
