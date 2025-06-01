import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const uploadDir = join(process.cwd(), 'uploads');
  // if (!existsSync(uploadDir)) {
  //   mkdirSync(uploadDir);
  // }
// app.useGlobalPipes(
//   new ValidationPipe({
//     whitelist: true,            
//     forbidNonWhitelisted: true,  
//     transform: true,             
//   }),
// )

app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true, 
});
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation with Swagger')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`server run on http://localhost:${process.env.PORT ?? 80}/api/v1`);
}
bootstrap();
