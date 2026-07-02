import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Mengaktifkan validasi DTO secara global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // secara otomatis menghapus properti yang tidak ada di DTO
    transform: true, // otomatis mengubah payload request ke instance class DTO-nya
  }));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
