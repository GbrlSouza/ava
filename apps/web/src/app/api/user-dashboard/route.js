import sql from "@/app/api/utils/sql";

// GET /api/user-dashboard - Dados do dashboard do usuário
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 1; // Por enquanto usar usuário fixo

    // Buscar estatísticas do usuário
    const [statsResult] = await sql.transaction([
      // Total de cursos matriculados
      sql`
        SELECT COUNT(*) as total_courses
        FROM enrollments 
        WHERE user_id = ${userId}
      `,
      
      // Cursos concluídos (todos com progresso 100%)
      sql`
        SELECT COUNT(DISTINCT e.course_id) as completed_courses
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        JOIN lessons l ON c.id = l.course_id
        LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = ${userId}
        WHERE e.user_id = ${userId}
        GROUP BY e.course_id
        HAVING COUNT(l.id) = COUNT(CASE WHEN lp.is_completed THEN 1 END)
      `,
      
      // Certificados obtidos
      sql`
        SELECT COUNT(*) as total_certificates
        FROM certificates 
        WHERE user_id = ${userId}
      `,
      
      // Média de quiz (simulado por enquanto)
      sql`
        SELECT 8 as quiz_average, 10 as quiz_total
      `
    ]);

    const totalCourses = statsResult[0]?.[0]?.total_courses || 0;
    const completedCourses = statsResult[1]?.length || 0;
    const totalCertificates = statsResult[2]?.[0]?.total_certificates || 0;
    const quizData = statsResult[3]?.[0] || { quiz_average: 8, quiz_total: 10 };

    // Buscar cursos matriculados recentes com progresso
    const enrolledCourses = await sql`
      SELECT 
        c.*,
        cat.name as category_name,
        cat.color as category_color,
        e.enrolled_at,
        COUNT(l.id) as total_lessons,
        COUNT(CASE WHEN lp.is_completed THEN 1 END) as completed_lessons,
        CASE 
          WHEN COUNT(l.id) > 0 
          THEN ROUND((COUNT(CASE WHEN lp.is_completed THEN 1 END) * 100.0) / COUNT(l.id))
          ELSE 0 
        END as progress_percentage
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN lessons l ON c.id = l.course_id
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = ${userId}
      WHERE e.user_id = ${userId} AND c.is_published = true
      GROUP BY c.id, cat.name, cat.color, e.enrolled_at
      ORDER BY e.enrolled_at DESC
      LIMIT 12
    `;

    // Buscar webinars matriculados
    const enrolledWebinars = await sql`
      SELECT 
        w.*,
        we.enrolled_at,
        CASE 
          WHEN w.scheduled_date = CURRENT_DATE AND CURRENT_TIME BETWEEN w.start_time AND w.end_time
          THEN true
          ELSE false
        END as can_join_now,
        CASE
          WHEN w.scheduled_date > CURRENT_DATE
          THEN EXTRACT(EPOCH FROM (w.scheduled_date + w.start_time - CURRENT_TIMESTAMP)) / 3600
          WHEN w.scheduled_date = CURRENT_DATE AND CURRENT_TIME < w.start_time
          THEN EXTRACT(EPOCH FROM (CURRENT_DATE + w.start_time - CURRENT_TIMESTAMP)) / 3600
          ELSE 0
        END as hours_until_start
      FROM webinar_enrollments we
      JOIN webinars w ON we.webinar_id = w.id
      WHERE we.user_id = ${userId}
      ORDER BY w.scheduled_date ASC, w.start_time ASC
      LIMIT 8
    `;

    return Response.json({
      success: true,
      data: {
        stats: {
          totalCourses,
          completedCourses,
          totalCertificates,
          quizAverage: quizData.quiz_average,
          quizTotal: quizData.quiz_total
        },
        enrolledCourses: enrolledCourses.map(course => ({
          ...course,
          progress: parseInt(course.progress_percentage) || 0
        })),
        enrolledWebinars: enrolledWebinars.map(webinar => {
          const hoursUntil = parseFloat(webinar.hours_until_start) || 0;
          return {
            ...webinar,
            hasJoinButton: webinar.can_join_now,
            countdown: hoursUntil > 0 ? {
              hours: Math.floor(hoursUntil),
              minutes: Math.floor((hoursUntil % 1) * 60),
              seconds: Math.floor(((hoursUntil % 1) * 60 % 1) * 60)
            } : null
          };
        })
      }
    });
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    return Response.json({
      success: false,
      error: 'Failed to fetch dashboard data'
    }, { status: 500 });
  }
}