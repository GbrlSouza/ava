import sql from "@/app/api/utils/sql";

// GET /api/courses - Lista todos os cursos com filtros opcionais
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;

    let query = `
      SELECT 
        c.*,
        cat.name as category_name,
        cat.color as category_color,
        COUNT(e.id) as enrolled_count,
        COUNT(l.id) as lesson_count
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN lessons l ON c.id = l.course_id
      WHERE c.is_published = true
    `;
    
    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND cat.name = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      query += ` AND (LOWER(c.title) LIKE LOWER($${paramIndex}) OR LOWER(c.description) LIKE LOWER($${paramIndex}))`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` GROUP BY c.id, cat.name, cat.color ORDER BY c.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const courses = await sql(query, params);

    return Response.json({
      success: true,
      data: courses,
      total: courses.length
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return Response.json({
      success: false,
      error: 'Failed to fetch courses'
    }, { status: 500 });
  }
}

// POST /api/courses - Cria um novo curso
export async function POST(request) {
  try {
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
      is_published = false
    } = body;

    if (!title || !instructor) {
      return Response.json({
        success: false,
        error: 'Title and instructor are required'
      }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO courses (
        title, description, instructor, thumbnail_url, 
        category_id, duration_hours, difficulty_level, price, is_published
      ) VALUES (
        ${title}, ${description}, ${instructor}, ${thumbnail_url},
        ${category_id}, ${duration_hours}, ${difficulty_level}, ${price}, ${is_published}
      ) RETURNING *
    `;

    return Response.json({
      success: true,
      data: result[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return Response.json({
      success: false,
      error: 'Failed to create course'
    }, { status: 500 });
  }
}