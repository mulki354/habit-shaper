import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Mengaktifkan Exception Filter global
  app.useGlobalFilters(new HttpExceptionFilter());
  // Mengaktifkan validasi DTO secara global dengan pembatasan ketat
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // secara otomatis menghapus properti yang tidak ada di DTO
    forbidNonWhitelisted: true, // menolak request jika mengirimkan properti asing (400 Bad Request)
    transform: true, // otomatis mengubah payload request ke instance class DTO-nya
  }));
  // Mengaktifkan CORS untuk komunikasi dengan frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
bootstrap();