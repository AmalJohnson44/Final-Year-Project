import db from '../config/db.js';

const Face = {
  async create(userId, descriptor) {
    const [result] = await db.query(
      `INSERT INTO face_data (user_id, face_descriptor) VALUES (?, ?)`,
      [userId, descriptor]
    );
    return result;
  },

  async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT face_descriptor FROM face_data WHERE user_id = ?`,
      [userId]
    );
    return rows[0];
  }
};

export default Face;
