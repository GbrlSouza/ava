import sql from "@/app/api/utils/sql";

// POST /api/enrollments - Matricular usuário em curso
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, courseId } = body;

    if (!userId || !courseId) {
      return Response.json({
        success: false,
        error: 'User ID and Course ID are required'
      }, { status: 400 });
    }

    // Verificar se o curso existe
    const courseExists = await sql`
      SELECT id FROM courses WHERE id = ${courseId} AND is_published = true
    `;

    if (courseExists.length === 0) {
      return Response.json({
        success: false,
        error: 'Course not found or not published'
      }, { status: 404 });
    }

    // Verificar se já está matriculado
    const existingEnrollment = await sql`
      SELECT id FROM enrollments WHERE user_id = ${userId} AND course_id = ${courseId}
    `;

    if (existingEnrollment.length > 0) {
      return Response.json({
        success: false,
        error: 'User already enrolled in this course'
      }, { status: 409 });
    }

    // Criar matrícula
    const enrollment = await sql`
      INSERT INTO enrollments (user_id, course_id)
      VALUES (${userId}, ${courseId})
      RETURNING *
    `;

    return Response.json({
      success: true,
      data: enrollment[0],
      message: 'Successfully enrolled in course'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return Response.json({
      success: false,
      error: 'Failed to enroll in course'
    }, { status: 500 });
  }
}

// GET /api/enrollments - Listar matrículas do usuário
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    const enrollments = await sql`
      SELECT 
        e.*,
        c.title as course_title,
        c.instructor,
        c.thumbnail_url,
        c.duration_hours,
        cat.name as category_name,
        cat.color as category_color,
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
      GROUP BY e.id, c.id, cat.name, cat.color
      ORDER BY e.enrolled_at DESC
    `;

    return Response.json({
      success: true,
      data: enrollments.map(enrollment => ({
        ...enrollment,
        progress: parseInt(enrollment.progress_percentage) || 0
      }))
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return Response.json({
      success: false,
      error: 'Failed to fetch enrollments'
    }, { status: 500 });
  }
}