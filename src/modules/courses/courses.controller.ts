import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Lang } from '@prisma/client';

@Controller('courses')
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

  // Público para el home: sólo activos
  @Get()
  list(
    @Query('q') q?: string,
    @Query('lang') lang?: Lang, // 'ES' | 'EN' (opcional)
    @Query('limit') limit = '12', // cuántos para el home
  ) {
    return this.courses.list({
      q,
      lang: (lang as Lang) || undefined,
      limit: Number(limit) || 12,
    });
  }

  // Detalle por slug (también público)
  @Get(':slug')
  getOne(@Param('slug') slug: string) {
    return this.courses.getBySlug(slug);
  }
}
