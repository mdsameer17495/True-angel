import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, initDB } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const DEFAULT_USER_ID = '11111111-1111-1111-1111-111111111111';

// ── Helper: snake_case DB rows → camelCase JS objects ────────
function toCamel(row) {
  if (!row) return null;
  const mapped = {};
  for (const [key, value] of Object.entries(row)) {
    const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    
    // SQLite stores JSON as string; parse it back to array/object for the frontend
    if ((camel === 'times' || camel === 'details') && typeof value === 'string') {
      try {
        mapped[camel] = JSON.parse(value);
      } catch (e) {
        mapped[camel] = value;
      }
    } 
    // SQLite stores booleans as 1/0; convert them to true/false for the frontend
    else if (camel === 'takenToday' || camel === 'enabled' || camel === 'completed') {
      mapped[camel] = value === 1 || value === true;
    } 
    else {
      mapped[camel] = value;
    }
  }
  return mapped;
}

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==========================================
// MEDICINES
// ==========================================

app.get('/api/medicines', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT * FROM medicines WHERE user_id = $1 ORDER BY created_at DESC',
      [DEFAULT_USER_ID]
    );
    res.json(rows.map(toCamel));
  } catch (err) {
    console.error('GET /api/medicines error:', err);
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

app.post('/api/medicines', async (req, res) => {
  const { name, dosage, dosageUnit, frequency, times, takenToday, notes } = req.body;
  try {
    const { rows } = await query(
      `INSERT INTO medicines (user_id, name, dosage, dosage_unit, frequency, times, taken_today, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [DEFAULT_USER_ID, name, dosage || '', dosageUnit || 'mg', frequency || 'daily',
       JSON.stringify(times || ['08:00']), takenToday || false, notes || '']
    );
    const med = toCamel(rows[0]);
    // Log to history
    await query(
      `INSERT INTO history (user_id, entity_type, entity_id, entity_name, action)
       VALUES ($1, 'medicine', $2, $3, 'created')`,
      [DEFAULT_USER_ID, med.id, name]
    );
    res.status(201).json(med);
  } catch (err) {
    console.error('POST /api/medicines error:', err);
    res.status(500).json({ error: 'Failed to create medicine' });
  }
});

app.put('/api/medicines/:id', async (req, res) => {
  const { name, dosage, dosageUnit, frequency, times, notes } = req.body;
  try {
    const { rows } = await query(
      `UPDATE medicines SET name=$1, dosage=$2, dosage_unit=$3, frequency=$4, times=$5, notes=$6
       WHERE id=$7 AND user_id=$8 RETURNING *`,
      [name, dosage, dosageUnit, frequency, JSON.stringify(times), notes, req.params.id, DEFAULT_USER_ID]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Medicine not found' });
    res.json(toCamel(rows[0]));
  } catch (err) {
    console.error('PUT /api/medicines error:', err);
    res.status(500).json({ error: 'Failed to update medicine' });
  }
});

app.put('/api/medicines/:id/take', async (req, res) => {
  try {
    const { rows } = await query(
      'UPDATE medicines SET taken_today = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, DEFAULT_USER_ID]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Medicine not found' });
    const med = toCamel(rows[0]);
    // Log to history
    await query(
      `INSERT INTO history (user_id, entity_type, entity_id, entity_name, action)
       VALUES ($1, 'medicine', $2, $3, 'taken')`,
      [DEFAULT_USER_ID, med.id, med.name]
    );
    res.json(med);
  } catch (err) {
    console.error('PUT /api/medicines/:id/take error:', err);
    res.status(500).json({ error: 'Failed to mark medicine as taken' });
  }
});

app.delete('/api/medicines/:id', async (req, res) => {
  try {
    const { rows } = await query(
      'DELETE FROM medicines WHERE id = $1 AND user_id = $2 RETURNING name',
      [req.params.id, DEFAULT_USER_ID]
    );
    if (rows.length > 0) {
      await query(
        `INSERT INTO history (user_id, entity_type, entity_id, entity_name, action)
         VALUES ($1, 'medicine', $2, $3, 'deleted')`,
        [DEFAULT_USER_ID, req.params.id, rows[0].name]
      );
    }
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /api/medicines error:', err);
    res.status(500).json({ error: 'Failed to delete medicine' });
  }
});

// ==========================================
// ALARMS
// ==========================================

app.get('/api/alarms', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT * FROM alarms WHERE user_id = $1 ORDER BY time ASC',
      [DEFAULT_USER_ID]
    );
    res.json(rows.map(toCamel));
  } catch (err) {
    console.error('GET /api/alarms error:', err);
    res.status(500).json({ error: 'Failed to fetch alarms' });
  }
});

app.post('/api/alarms', async (req, res) => {
  const { time, label, type, enabled } = req.body;
  try {
    const { rows } = await query(
      `INSERT INTO alarms (user_id, time, label, type, enabled)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [DEFAULT_USER_ID, time, label || 'Alarm', type || 'daily', enabled !== false]
    );
    const alarm = toCamel(rows[0]);
    await query(
      `INSERT INTO history (user_id, entity_type, entity_id, entity_name, action)
       VALUES ($1, 'alarm', $2, $3, 'created')`,
      [DEFAULT_USER_ID, alarm.id, label]
    );
    res.status(201).json(alarm);
  } catch (err) {
    console.error('POST /api/alarms error:', err);
    res.status(500).json({ error: 'Failed to create alarm' });
  }
});

app.put('/api/alarms/:id', async (req, res) => {
  const { time, label, type, enabled } = req.body;
  try {
    const { rows } = await query(
      `UPDATE alarms SET time=$1, label=$2, type=$3, enabled=$4
       WHERE id=$5 AND user_id=$6 RETURNING *`,
      [time, label, type, enabled, req.params.id, DEFAULT_USER_ID]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Alarm not found' });
    res.json(toCamel(rows[0]));
  } catch (err) {
    console.error('PUT /api/alarms error:', err);
    res.status(500).json({ error: 'Failed to update alarm' });
  }
});

app.put('/api/alarms/:id/toggle', async (req, res) => {
  try {
    const { rows } = await query(
      'UPDATE alarms SET enabled = NOT enabled WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, DEFAULT_USER_ID]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Alarm not found' });
    res.json(toCamel(rows[0]));
  } catch (err) {
    console.error('PUT /api/alarms/:id/toggle error:', err);
    res.status(500).json({ error: 'Failed to toggle alarm' });
  }
});

app.delete('/api/alarms/:id', async (req, res) => {
  try {
    const { rows } = await query(
      'DELETE FROM alarms WHERE id = $1 AND user_id = $2 RETURNING label',
      [req.params.id, DEFAULT_USER_ID]
    );
    if (rows.length > 0) {
      await query(
        `INSERT INTO history (user_id, entity_type, entity_id, entity_name, action)
         VALUES ($1, 'alarm', $2, $3, 'deleted')`,
        [DEFAULT_USER_ID, req.params.id, rows[0].label]
      );
    }
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /api/alarms error:', err);
    res.status(500).json({ error: 'Failed to delete alarm' });
  }
});

// ==========================================
// REMINDERS
// ==========================================

app.get('/api/reminders', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT * FROM reminders WHERE user_id = $1 ORDER BY created_at DESC',
      [DEFAULT_USER_ID]
    );
    res.json(rows.map(toCamel));
  } catch (err) {
    console.error('GET /api/reminders error:', err);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

app.post('/api/reminders', async (req, res) => {
  const { text, category, priority, date, completed } = req.body;
  try {
    const { rows } = await query(
      `INSERT INTO reminders (user_id, text, category, priority, date, completed)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [DEFAULT_USER_ID, text, category || 'task', priority || 'medium', date || null, completed || false]
    );
    const rem = toCamel(rows[0]);
    await query(
      `INSERT INTO history (user_id, entity_type, entity_id, entity_name, action)
       VALUES ($1, 'reminder', $2, $3, 'created')`,
      [DEFAULT_USER_ID, rem.id, text]
    );
    res.status(201).json(rem);
  } catch (err) {
    console.error('POST /api/reminders error:', err);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

app.put('/api/reminders/:id', async (req, res) => {
  const { text, category, priority, date } = req.body;
  try {
    const { rows } = await query(
      `UPDATE reminders SET text=$1, category=$2, priority=$3, date=$4
       WHERE id=$5 AND user_id=$6 RETURNING *`,
      [text, category, priority, date, req.params.id, DEFAULT_USER_ID]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Reminder not found' });
    res.json(toCamel(rows[0]));
  } catch (err) {
    console.error('PUT /api/reminders error:', err);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
});

app.put('/api/reminders/:id/toggle', async (req, res) => {
  try {
    const { rows } = await query(
      'UPDATE reminders SET completed = NOT completed WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, DEFAULT_USER_ID]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Reminder not found' });
    const rem = toCamel(rows[0]);
    await query(
      `INSERT INTO history (user_id, entity_type, entity_id, entity_name, action)
       VALUES ($1, 'reminder', $2, $3, $4)`,
      [DEFAULT_USER_ID, rem.id, rem.text, rem.completed ? 'completed' : 'reopened']
    );
    res.json(rem);
  } catch (err) {
    console.error('PUT /api/reminders/:id/toggle error:', err);
    res.status(500).json({ error: 'Failed to toggle reminder' });
  }
});

app.delete('/api/reminders/:id', async (req, res) => {
  try {
    const { rows } = await query(
      'DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING text',
      [req.params.id, DEFAULT_USER_ID]
    );
    if (rows.length > 0) {
      await query(
        `INSERT INTO history (user_id, entity_type, entity_id, entity_name, action)
         VALUES ($1, 'reminder', $2, $3, 'deleted')`,
        [DEFAULT_USER_ID, req.params.id, rows[0].text]
      );
    }
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /api/reminders error:', err);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
});

// ==========================================
// EMERGENCY CONTACTS
// ==========================================

app.get('/api/contacts', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT * FROM emergency_contacts WHERE user_id = $1 ORDER BY created_at DESC',
      [DEFAULT_USER_ID]
    );
    res.json(rows.map(toCamel));
  } catch (err) {
    console.error('GET /api/contacts error:', err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/api/contacts', async (req, res) => {
  const { name, relationship, phone } = req.body;
  try {
    const { rows } = await query(
      `INSERT INTO emergency_contacts (user_id, name, relationship, phone)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [DEFAULT_USER_ID, name, relationship || '', phone]
    );
    res.status(201).json(toCamel(rows[0]));
  } catch (err) {
    console.error('POST /api/contacts error:', err);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  const { name, relationship, phone } = req.body;
  try {
    const { rows } = await query(
      'UPDATE emergency_contacts SET name=$1, relationship=$2, phone=$3 WHERE id=$4 AND user_id=$5 RETURNING *',
      [name, relationship, phone, req.params.id, DEFAULT_USER_ID]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Contact not found' });
    res.json(toCamel(rows[0]));
  } catch (err) {
    console.error('PUT /api/contacts error:', err);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await query('DELETE FROM emergency_contacts WHERE id = $1 AND user_id = $2', [req.params.id, DEFAULT_USER_ID]);
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /api/contacts error:', err);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// ==========================================
// HISTORY
// ==========================================

app.get('/api/history', async (req, res) => {
  try {
    const { type } = req.query;
    let sql = 'SELECT * FROM history WHERE user_id = $1';
    const params = [DEFAULT_USER_ID];
    if (type) {
      sql += ' AND entity_type = $2';
      params.push(type);
    }
    sql += ' ORDER BY created_at DESC LIMIT 100';
    const { rows } = await query(sql, params);
    res.json(rows.map(toCamel));
  } catch (err) {
    console.error('GET /api/history error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ==========================================
// STATIC FILES & SPA FALLBACK
// ==========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

app.use(express.static(distPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ==========================================
// START SERVER
// ==========================================

async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`🚀 True Angel API server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
