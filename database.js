const Database = require('better-sqlite3');

const db = new Database('warns.db');

db.prepare(`
    CREATE TABLE IF NOT EXISTS warns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      moderatorId TEXT NOT NULL,
      reason TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    )
  `).run();

  function addWarn(userId, moderatorId, reason) {
    const stmt = db.prepare('INSERT INTO warns (userId, moderatorId, reason, timestamp) VALUES (?, ?, ?, ?)');
    const result = stmt.run(userId, moderatorId, reason, Date.now());
    return result.lastInsertRowid;
  }

function getWarns(userId) {
  const stmt = db.prepare('SELECT * FROM warns WHERE userId = ?');
  return stmt.all(userId);
}

function clearWarns(userId) {
  const stmt = db.prepare('DELETE FROM warns WHERE userId = ?');
  stmt.run(userId);
}

function removeWarn(warnId) {
    const stmt = db.prepare('DELETE FROM warns WHERE id = ?');
    stmt.run(warnId);
  }

module.exports = { addWarn, getWarns, clearWarns, removeWarn };