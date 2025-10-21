import sql from "@/app/api/utils/sql";

// GET /api/courses/[id] - Busca um curso específico com suas aulas
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const courseQuery = await sql`
      SELECT 
        c.*,
        cat.name as category_name,
        cat.color as category_color,
        COUNT(e.id) as enrolled_count
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.id = ${id} AND c.is_published = true
      GROUP BY c.id, cat.name, cat.color
    `;

    if (courseQuery.length === 0) {
      return Response.json({
        success: false,
        error: 'Course not found'
      }, { status: 404 });
    }

    const course = courseQuery[0];

    // Buscar aulas do curso
    const lessons = await sql`
      SELECT * FROM lessons 
      WHERE course_id = ${id} AND is_published = true 
      ORDER BY lesson_order ASC
    `;

    return Response.json({
      success: true,
      data: {
        ...course,
        lessons
      }
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return Response.json({
      success: false,
      error: 'Failed to fetch course'
    }, { status: 500 });
  }
}

// PUT /api/courses/[id] - Atualiza um curso
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const {
      title,
      description,
      instructor,
      thumbnail_url,
      category_id,
      duration_hours,
      difficulty_level,
      price,
      is_published
    } = body;

    // Construir query de update dinamicamente
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramIndex}`);
      updateValues.push(title);
      paramIndex++;
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      updateValues.push(description);
      paramIndex++;
    }
    if (instructor !== undefined) {
      updateFields.push(`instructor = $${paramIndex}`);
      updateValues.push(instructor);
      paramIndex++;
    }
    if (thumbnail_url !== undefined) {
      updateFields.push(`thumbnail_url = $${paramIndex}`);
      updateValues.push(thumbnail_url);
      paramIndex++;
    }
    if (category_id !== undefined) {
      updateFields.push(`category_id = $${paramIndex}`);
      updateValues.push(category_id);
      paramIndex++;
    }
    if (duration_hours !== undefined) {
      updateFields.push(`duration_hours = $${paramIndex}`);
      updateValues.push(duration_hours);
      paramIndex++;
    }
    if (difficulty_level !== undefined) {
      updateFields.push(`difficulty_level = $${paramIndex}`);
      updateValues.push(difficulty_level);
      paramIndex++;
    }
    if (price !== undefined) {
      updateFields.push(`price = $${paramIndex}`);
      updateValues.push(price);
      paramIndex++;
    }
    if (is_published !== undefined) {
      updateFields.push(`is_published = $${paramIndex}`);
      updateValues.push(is_published);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return Response.json({
        success: false,
        error: 'No fields to update'
      }, { status: 400 });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(id);

    const query = `
      UPDATE courses 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await sql(query, updateValues);

    if (result.length === 0) {
      return Response.json({
        success: false,
        error: 'Course not found'
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return Response.json({
      success: false,
      error: 'Failed to update course'
    }, { status: 500 });
  }
}

// DELETE /api/courses/[id] - Deleta um curso
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await sql`
      DELETE FROM courses 
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({
        success: false,
        error: 'Course not found'
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return Response.json({
      success: false,
      error: 'Failed to delete course'
    }, { status: 500 });
  }
}