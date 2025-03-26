import { Module } from '@nestjs/common';
import { MinioController } from './minio.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestMinioModule } from 'nestjs-minio';

@Module({
  imports: [
    ConfigModule,
    NestMinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        endPoint: configService.get<string>('MINIO_ENDPOINT'),
        port: parseInt(configService.get<string>('MINIO_PORT'), 10),
        useSSL: configService.get<string>('MINIO_USE_SSL') === 'true',
        accessKey: configService.get<string>('MINIO_ACCESS_KEY'),
        secretKey: configService.get<string>('MINIO_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MinioController],
})
export class MinioModule {} 