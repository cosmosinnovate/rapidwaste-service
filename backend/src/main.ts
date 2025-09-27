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
    .setTitle('NotaryNow API')
    .setDescription('Online notary service API for managing notarization sessions, notaries, and customers')
    .setVersion('1.0')
    .setContact('NotaryNow Team', 'https://notarynow.com', 'support@notarynow.com')
    .addTag('Authentication', 'User and notary authentication endpoints')
    .addTag('Bookings', 'Notarization session booking management')
    .addTag('Notary', 'Notary dashboard and session management')
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
    .addServer('https://api.notarynow.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'notary_now API Documentation',
    customfavIcon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBjbGFzcz0idzYgaDYiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDdsLS44NjcgMTIuMTQyQTIgMiAwIDAgMSAxNi4xMzggMjFINy44NjJhMiAyIDAgMCAxLTEuOTk1LTEuODU4TDUgN201IDR2Nm00LTZ2Nm0xLTEwVjRhMSAxIDAgMCAwLTEtMWgtNGExIDEgMCAwIDAtMSAxdjNNNCA3aDE2IiAvPjwvc3ZnPg==',
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 NotaryNow Backend running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/docs`);
}

bootstrap(); 