import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  // 设置全局路由前缀
  app.setGlobalPrefix('api'); 


  // 配置全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true, // 去除未定义的属性
      forbidNonWhitelisted: true, // 禁止未定义的属性
    })
  );
  await app.listen(3000);
}
bootstrap();
