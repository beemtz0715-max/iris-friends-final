export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return corsResponse(new Response(null, { status: 204 }));
    }

    try {
      // Auth routes (no token required)
      if (pathname === '/api/auth/register' && request.method === 'POST') {
        return corsResponse(await registerUser(request, env));
      }
      if (pathname === '/api/auth/login' && request.method === 'POST') {
        return corsResponse(await loginUser(request, env));
      }

      // All other routes require auth
      const user = await getUserFromAuth(request, env);
      if (!user) {
        return corsResponse(
          jsonResponse({ error: 'Unauthorized' }, 401)
        );
      }

      // Cats
      if (pathname === '/api/cats' && request.method === 'GET') {
        return corsResponse(await getCats(env));
      }

      // Tasks today: /api/cats/:id/tasks/today
      const tasksTodayMatch = pathname.match(/^\/api\/cats\/(\d+)\/tasks\/today$/);
      if (tasksTodayMatch && request.method === 'GET') {
        const catId = parseInt(tasksTodayMatch[1], 10);
        return corsResponse(await getTasksToday(env, user.id, catId));
      }

      // Complete task: POST /api/cats/:id/tasks/:taskId/complete
      const completeMatch = pathname.match(/^\/api\/cats\/(\d+)\/tasks\/(\d+)\/complete$/);
      if (completeMatch && request.method === 'POST') {
        const catId = parseInt(completeMatch[1], 10);
        const taskId = parseInt(completeMatch[2], 10);
        return corsResponse(await completeTask(env, user.id, catId, taskId));
      }

      // Uncomplete task: DELETE /api/cats/:id/tasks/:taskId/complete
      if (completeMatch && request.method === 'DELETE') {
        const catId = parseInt(completeMatch[1], 10);
        const taskId = parseInt(completeMatch[2], 10);
        return corsResponse(await uncompleteTask(env, user.id, catId, taskId));
      }

      // Vet records: GET /api/cats/:id/vet
      const vetListMatch = pathname.match(/^\/api\/cats\/(\d+)\/vet$/);
      if (vetListMatch && request.method === 'GET') {
        const catId = parseInt(vetListMatch[1], 10);
        return corsResponse(await getVetRecords(env, user.id, catId));
      }

      // Vet records: POST /api/cats/:id/vet
      if (vetListMatch && request.method === 'POST') {
        const catId = parseInt(vetListMatch[1], 10);
        return corsResponse(await createVetRecord(request, env, user.id, catId));
      }

      // Vet record by id: PATCH /api/vet/:id
      const vetIdMatch = pathname.match(/^\/api\/vet\/(\d+)$/);
      if (vetIdMatch && request.method === 'PATCH') {
        const vetId = parseInt(vetIdMatch[1], 10);
        return corsResponse(await updateVetRecord(request, env, user.id, vetId));
      }

      // Vet record by id: DELETE /api/vet/:id
      if (vetIdMatch && request.method === 'DELETE') {
        const vetId = parseInt(vetIdMatch[1], 10);
        return corsResponse(await deleteVetRecord(env, user.id, vetId));
      }

      return corsResponse(jsonResponse({ error: 'Not found' }, 404));
    } catch (err) {
      console.error(err);
      return corsResponse(jsonResponse({ error: 'Internal Server Error' }, 500));
    }
  }
};

// ---------- Helpers ----------

function corsResponse(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function parseJson(request) {
  const text = await request.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function todayString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ---------- Auth (simple token) ----------

// For this project, we’ll keep auth simple:
// - Password stored as plain text (OK for class demo, not production)
// - Token is just the user id

async function registerUser(request, env) {
  const body = await parseJson(request);
  const { email, password } = body;

  if (!email || !password) {
    return jsonResponse({ error: 'Email and password required' }, 400);
  }

  const id = crypto.randomUUID();
  const createdAt = Date.now();

  try {
    await env.DB.prepare(
      'INSERT INTO users (id, email, password, created_at) VALUES (?, ?, ?, ?)'
    ).bind(id, email, password, createdAt).run();
  } catch (e) {
    if (String(e).includes('UNIQUE')) {
      return jsonResponse({ error: 'Email already registered' }, 400);
    }
    throw e;
  }

  return jsonResponse({
    token: id,
    user: { id, email }
  }, 201);
}

async function loginUser(request, env) {
  const body = await parseJson(request);
  const { email, password } = body;

  if (!email || !password) {
    return jsonResponse({ error: 'Email and password required' }, 400);
  }

  const result = await env.DB.prepare(
    'SELECT id, email, password FROM users WHERE email = ?'
  ).bind(email).first();

  if (!result || result.password !== password) {
    return jsonResponse({ error: 'Invalid credentials' }, 401);
  }

  return jsonResponse({
    token: result.id,
    user: { id: result.id, email: result.email }
  });
}

async function getUserFromAuth(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) return null;
  const token = auth.slice('Bearer '.length).trim();
  if (!token) return null;

  const user = await env.DB.prepare(
    'SELECT id, email FROM users WHERE id = ?'
  ).bind(token).first();

  if (!user) return null;
  return user;
}

// ---------- Cats ----------

async function getCats(env) {
  const rows = await env.DB.prepare(
    'SELECT id, name, initial, color, notes FROM cats ORDER BY id'
  ).all();

  return jsonResponse(rows.results || []);
}

// ---------- Tasks (fixed list + daily completion) ----------

async function getTasksToday(env, userId, catId) {
  const date = todayString();

  const template = await env.DB.prepare(
    'SELECT id, name FROM tasks_template ORDER BY id'
  ).all();

  const completed = await env.DB.prepare(
    'SELECT task_id FROM tasks_completed WHERE user_id = ? AND cat_id = ? AND date = ?'
  ).bind(userId, catId, date).all();

  const completedIds = new Set((completed.results || []).map(r => r.task_id));

  const tasks = (template.results || []).map(t => ({
    id: t.id,
    name: t.name,
    completed: completedIds.has(t.id)
  }));

  return jsonResponse({
    date,
    catId,
    tasks
  });
}

async function completeTask(env, userId, catId, taskId) {
  const date = todayString();

  await env.DB.prepare(
    'INSERT OR IGNORE INTO tasks_completed (user_id, cat_id, task_id, date) VALUES (?, ?, ?, ?)'
  ).bind(userId, catId, taskId, date).run();

  return jsonResponse({ success: true });
}

async function uncompleteTask(env, userId, catId, taskId) {
  const date = todayString();

  await env.DB.prepare(
    'DELETE FROM tasks_completed WHERE user_id = ? AND cat_id = ? AND task_id = ? AND date = ?'
  ).bind(userId, catId, taskId, date).run();

  return jsonResponse({ success: true });
}

// ---------- Vet Records ----------

async function getVetRecords(env, userId, catId) {
  const rows = await env.DB.prepare(
    'SELECT id, title, notes, date FROM vet_records WHERE user_id = ? AND cat_id = ? ORDER BY date DESC'
  ).bind(userId, catId).all();

  return jsonResponse(rows.results || []);
}

async function createVetRecord(request, env, userId, catId) {
  const body = await parseJson(request);
  const { title, notes, date } = body;

  if (!title || !date) {
    return jsonResponse({ error: 'Title and date are required' }, 400);
  }

  await env.DB.prepare(
    'INSERT INTO vet_records (user_id, cat_id, title, notes, date) VALUES (?, ?, ?, ?, ?)'
  ).bind(userId, catId, title, notes || '', date).run();

  return jsonResponse({ success: true }, 201);
}

async function updateVetRecord(request, env, userId, vetId) {
  const body = await parseJson(request);
  const { title, notes, date } = body;

  const existing = await env.DB.prepare(
    'SELECT id FROM vet_records WHERE id = ? AND user_id = ?'
  ).bind(vetId, userId).first();

  if (!existing) {
    return jsonResponse({ error: 'Record not found' }, 404);
  }

  await env.DB.prepare(
    'UPDATE vet_records SET title = ?, notes = ?, date = ? WHERE id = ? AND user_id = ?'
  ).bind(title, notes || '', date, vetId, userId).run();

  return jsonResponse({ success: true });
}

async function deleteVetRecord(env, userId, vetId) {
  await env.DB.prepare(
    'DELETE FROM vet_records WHERE id = ? AND user_id = ?'
  ).bind(vetId, userId).run();

  return jsonResponse({ success: true });
}
