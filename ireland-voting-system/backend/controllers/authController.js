// backend/controllers/authController.js

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Face from '../models/Face.js';
import FaceRecognition from '../services/faceRecognition.js';

// Required for path operations in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AuthController {
  // 🔐 Login
  static async login(req, res) {
    console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET);
    console.log("🚀 Login route hit");
    console.log("📥 Request body:", req.body);

    const { email, password, image } = req.body;

    try {
      const user = await User.findByEmail(email);
      if (!user) {
        console.log("❌ Email not found:", email);
        return res.status(401).json({ msg: 'Invalid email or password' });
      }
      console.log("✅ Email found:", user.email);


      console.log("🔑 Login - entered password:", password);
      console.log("🗄️ Login - stored password hash:", user.password);
      
     // const isPasswordMatch = await bcrypt.compare(password, user.password);
      
      




      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        console.log("❌ Incorrect password");
        return res.status(401).json({ msg: 'Invalid email or password' });
      }
      console.log("✅ Password match");
      console.log("✅ Password match result:", isPasswordMatch);

      const faceData = await Face.findByUserId(user.id);
      if (!faceData?.face_descriptor) {
        console.log("❌ No face data");
        return res.status(401).json({ msg: 'No face data found' });
      }

      if (!image) {
        console.log("❌ No face image");
        return res.status(400).json({ msg: 'Face image required' });
      }

      const currentDescriptor = await FaceRecognition.detectFace(image);
      if (!currentDescriptor || currentDescriptor.length !== 128) {
        return res.status(400).json({ msg: 'Face not clearly detected. Try again.' });
      }

      let storedDescriptor;
      try {
        const parsed = JSON.parse(faceData.face_descriptor);
        storedDescriptor = Array.isArray(parsed)
          ? parsed
          : Object.keys(parsed).sort((a, b) => parseInt(a) - parseInt(b)).map(k => parsed[k]);
      } catch {
        return res.status(500).json({ msg: 'Stored face data is corrupted.' });
      }

      if (!storedDescriptor || storedDescriptor.length !== 128) {
        return res.status(500).json({ msg: 'Stored face data is corrupted.' });
      }

      const isFaceMatch = await FaceRecognition.compareFaces(currentDescriptor, storedDescriptor);
      if (!isFaceMatch) {
        console.log("❌ Face mismatch");
        return res.status(401).json({ msg: 'Face authentication failed' });
      }

      console.log("✅ Face match successful");
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      // ✅ Add fixed voter details to return payload
      const userDetails = {
        name: user.name,
        voterID: "12345ABC",               // Fixed ID (you can randomize later if needed)
        constituency: "Dublin Central"     // Fixed constituency
      };
      
      console.log("✅ Login successful - Sending voter details:", userDetails);
      
      return res.status(200).json({
        token,
        user: userDetails
      });
    } catch (err) {
      console.error("❌ Login error:", err.message, err.stack);
      return res.status(500).json({ msg: 'Server error during login' });
    }
    
  }

  // 📝 Register
  static async register(req, res) {
    const { name, email, dob, password, photo } = req.body;

    try {
      const existing = await User.findByEmail(email);
      if (existing) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      const idProofFile = req.file;
      if (!idProofFile) {
        return res.status(400).json({ msg: 'ID Proof is required' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        dob,
        password: hashedPassword,
        idProofPath: idProofFile.path,
      });

      const descriptor = await FaceRecognition.detectFace(photo);
      await Face.create(user.id, JSON.stringify(descriptor));

      return res.status(201).json({
        msg: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          idProof: idProofFile.filename
        }
      });
    } catch (err) {
      console.error("❌ Registration error:", err.message, err.stack);
      return res.status(500).json({ msg: 'Server error during registration' });
    }
  }
}

export default AuthController;
