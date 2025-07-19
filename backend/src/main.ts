import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // API prefix
  // app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('RapidWaste API')
    .setDescription('Emergency waste pickup service API for managing bookings, drivers, and customers')
    .setVersion('1.0')
    .setContact('RapidWaste Team', 'https://rapidwaste.com', 'support@rapidwaste.com')
    .addTag('Authentication', 'User and driver authentication endpoints')
    .addTag('Bookings', 'Waste pickup booking management')
    .addTag('Drivers', 'Driver dashboard and management')
    .addTag('Users', 'User management and profiles')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addServer('http://localhost:3001', 'Development server')
    .addServer('https://api.rapidwaste.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'RapidWaste API Documentation',
    customfavIcon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBjbGFzcz0idzYgaDYiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDdsLS44NjcgMTIuMTQyQTIgMiAwIDAgMSAxNi4xMzggMjFINy44NjJhMiAyIDAgMCAxLTEuOTk1LTEuODU4TDUgN201IDR2Nm00LTZ2Nm0xLTEwVjRhMSAxIDAgMCAwLTEtMWgtNGExIDEgMCAwIDAtMSAxdjNNNCA3aDE2IiAvPjwvc3ZnPg==',
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 RapidWaste Backend running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/docs`);
}

bootstrap(); 