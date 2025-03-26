import { Controller, Post, BadRequestException, Logger, Req, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { FastifyRequest } from 'fastify';
import { MultipartFile } from '@fastify/multipart';

@Controller('minio')
export class MinioController {
  private readonly logger = new Logger(MinioController.name);
  private readonly bucketName: string;
  
  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: Client,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET', 'sunflower-budget');
  }

  @Post('upload')
  async uploadFile(@Req() request: FastifyRequest) {
    try {
      const file = await request.file() as MultipartFile;
      
      if (!file) {
        this.logger.error('没有接收到文件');
        throw new BadRequestException('No file uploaded');
      }

      this.logger.debug(`文件信息: ${JSON.stringify({
        filename: file.filename,
        mimetype: file.mimetype,
        encoding: file.encoding,
      })}`);

      const buffer = await file.toBuffer();
      const objectName = `${Date.now()}-${file.filename}`;
      
      try {
        // 确认 bucket 存在
        const bucketExists = await this.minioClient.bucketExists(this.bucketName);
        if (!bucketExists) {
          await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
          this.logger.log(`Bucket ${this.bucketName} 创建成功`);
        }

        // 上传文件到 MinIO
        await this.minioClient.putObject(
          this.bucketName,
          objectName,
          buffer,
          buffer.length,
          { 'Content-Type': file.mimetype }
        );

        // 返回访问 URL
        const minioEndpoint = this.configService.get<string>('MINIO_ENDPOINT');
        const minioPort = this.configService.get<string>('MINIO_PORT');
        const url = `http://${minioEndpoint}:${minioPort}/${this.bucketName}/${objectName}`;
        
        this.logger.log(`文件上传成功: ${url}`);
        return { url };
      } catch (error) {
        this.logger.error(`MinIO操作失败: ${error.message}`, error.stack);
        throw new BadRequestException(`MinIO operation failed: ${error.message}`);
      }
    } catch (error) {
      this.logger.error(`文件处理失败: ${error.message}`, error.stack);
      throw new BadRequestException(`File processing failed: ${error.message}`);
    }
  }
}