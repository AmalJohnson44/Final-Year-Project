import db from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = {
  async create({ name, email, dob, password, idProofPath }) {
    const [result] = await db.query(
      `INSERT INTO users (name, email, dob, password, idProofPath) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, dob, password, idProofPath] // use password as-is (already hashed)
    );
    return { id: result.insertId, email };
  },

  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }
};
export default User;
