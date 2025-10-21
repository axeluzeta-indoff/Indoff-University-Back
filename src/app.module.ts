import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { CoursesModule } from './modules/courses/courses.module';

@Module({
  imports: [PrismaModule, HealthModule, CoursesModule],
})
export class AppModule {}
