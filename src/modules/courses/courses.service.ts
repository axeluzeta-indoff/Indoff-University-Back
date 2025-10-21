import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Lang } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  list(params: { q?: string; lang?: Lang; limit?: number }) {
    const { q, lang, limit = 12 } = params;

    return this.prisma.course.findMany({
      where: {
        isActive: true,
        ...(lang ? { language: lang } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 50), // 1..50
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        durationMinutes: true,
        price: true,
        language: true,
        imageUrl: true,
      },
    });
  }

  async getBySlug(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        durationMinutes: true,
        price: true,
        language: true,
        imageUrl: true,
        isActive: true,
      },
    });

    if (!course || !course.isActive) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }
}
