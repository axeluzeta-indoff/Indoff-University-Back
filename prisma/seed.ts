import { PrismaClient, Lang } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD') // elimina tildes
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function main() {
  const courses = [
    {
      title: 'Seguridad Industrial DC-3',
      description:
        'Capacitación oficial para cumplimiento y seguridad laboral en centros de trabajo.',
      durationMinutes: 240,
      price: 1200.0,
      language: Lang.ES,
      imageUrl: '/uploads_university/courses/dc3.webp',
      scormCloudCourseId: null,
      isActive: true,
    },
    {
      title: 'Lockout/Tagout (LOTO) Fundamentals',
      description:
        'Procedimientos de control de energía para mantenimiento seguro de maquinaria.',
      durationMinutes: 180,
      price: 950.0,
      language: Lang.EN,
      imageUrl: '/uploads_university/courses/loto.webp',
      scormCloudCourseId: 'SCORM-LOTO-001',
      isActive: true,
    },
    {
      title: 'Trabajo en Alturas — Básico',
      description:
        'Formación sobre prevención de caídas y uso correcto del equipo de protección personal.',
      durationMinutes: 150,
      price: 750.0,
      language: Lang.ES,
      imageUrl: '/uploads_university/courses/alturas.webp',
      scormCloudCourseId: null,
      isActive: true,
    },
  ];

  for (const c of courses) {
    const slug = slugify(c.title);

    await prisma.course.upsert({
      where: { slug },
      update: {
        description: c.description,
        durationMinutes: c.durationMinutes,
        price: c.price,
        language: c.language,
        imageUrl: c.imageUrl,
        scormCloudCourseId: c.scormCloudCourseId,
        isActive: c.isActive,
      },
      create: {
        slug,
        title: c.title,
        description: c.description,
        durationMinutes: c.durationMinutes,
        price: c.price,
        language: c.language,
        imageUrl: c.imageUrl,
        scormCloudCourseId: c.scormCloudCourseId,
        isActive: c.isActive,
      },
    });
  }
}

main()
  .then(async () => {
    console.log('✅ Cursos de prueba cargados correctamente');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
