import sql from "@/app/api/utils/sql";

// POST /api/lesson-progress - Atualizar progresso de uma aula
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      lessonId,
      watchedDurationMinutes,
      isCompleted = false
    } = body;

    if (!userId || !lessonId) {
      return Response.json({
        success: false,
        error: 'User ID and Lesson ID are required'
      }, { status: 400 });
    }

    // Verificar se a aula existe
    const lessonExists = await sql`
      SELECT id, duration_minutes FROM lessons WHERE id = ${lessonId} AND is_published = true
    `;

    if (lessonExists.length === 0) {
      return Response.json({
        success: false,
        error: 'Lesson not found or not published'
      }, { status: 404 });
    }

    const lesson = lessonExists[0];

    // Verificar se já existe progresso para esta aula
    const existingProgress = await sql`
      SELECT id FROM lesson_progress WHERE user_id = ${userId} AND lesson_id = ${lessonId}
    `;

    let result;

    if (existingProgress.length > 0) {
      // Atualizar progresso existente
      const completedAt = isCompleted ? 'CURRENT_TIMESTAMP' : null;
      
      result = await sql`
        UPDATE lesson_progress 
        SET 
          watched_duration_minutes = ${watchedDurationMinutes || 0},
          is_completed = ${isCompleted},
          completed_at = ${completedAt ? sql`CURRENT_TIMESTAMP` : null},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId} AND lesson_id = ${lessonId}
        RETURNING *
      `;
    } else {
      // Criar novo progresso
      const completedAt = isCompleted ? sql`CURRENT_TIMESTAMP` : null;
      
      result = await sql`
        INSERT INTO lesson_progress (
          user_id, lesson_id, watched_duration_minutes, is_completed, completed_at
        ) VALUES (
          ${userId}, ${lessonId}, ${watchedDurationMinutes || 0}, ${isCompleted}, ${completedAt}
        ) RETURNING *
      `;
    }

    // Se a aula foi marcada como completa, verificar se o curso foi finalizado
    if (isCompleted) {
      const courseProgress = await sql`
        SELECT 
          c.id as course_id,
          COUNT(l.id) as total_lessons,
          COUNT(CASE WHEN lp.is_completed THEN 1 END) as completed_lessons
        FROM lessons l
        JOIN courses c ON l.course_id = c.id
        LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = ${userId}
        WHERE l.id = ${lessonId}
        GROUP BY c.id
      `;

      if (courseProgress.length > 0) {
        const { course_id, total_lessons, completed_lessons } = courseProgress[0];
        
        // Se todas as aulas foram completadas, marcar o curso como finalizado
        if (parseInt(total_lessons) === parseInt(completed_lessons)) {
          await sql`
            UPDATE enrollments 
            SET completed_at = CURRENT_TIMESTAMP 
            WHERE user_id = ${userId} AND course_id = ${course_id} AND completed_at IS NULL
          `;

          // Gerar certificado se não existe
          const existingCertificate = await sql`
            SELECT id FROM certificates WHERE user_id = ${userId} AND course_id = ${course_id}
          `;

          if (existingCertificate.length === 0) {
            await sql`
              INSERT INTO certificates (user_id, course_id, certificate_url)
              VALUES (${userId}, ${course_id}, ${`https://certificates.example.com/user-${userId}-course-${course_id}.pdf`})
            `;
          }
        }
      }
    }

    return Response.json({
      success: true,
      data: result[0],
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return Response.json({
      success: false,
      error: 'Failed to update progress'
    }, { status: 500 });
  }
}

// GET /api/lesson-progress - Buscar progresso de aulas do usuário
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');

    if (!userId) {
      return Response.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    let query = `
      SELECT 
        lp.*,
        l.title as lesson_title,
        l.duration_minutes as lesson_duration,
        l.lesson_order,
        c.id as course_id,
        c.title as course_title
      FROM lesson_progress lp
      JOIN lessons l ON lp.lesson_id = l.id
      JOIN courses c ON l.course_id = c.id
      WHERE lp.user_id = $1
    `;
    
    const params = [userId];

    if (courseId) {
      query += ` AND c.id = $2`;
      params.push(courseId);
    }

    query += ` ORDER BY c.id, l.lesson_order`;

    const progress = await sql(query, params);

    return Response.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    return Response.json({
      success: false,
      error: 'Failed to fetch progress'
    }, { status: 500 });
  }
}