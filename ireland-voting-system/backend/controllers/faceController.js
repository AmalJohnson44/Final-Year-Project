import FaceRecognition from '../services/faceRecognition.js';

const FaceController = {
  // 🧠 Handle face detection
  detect: async (req, res) => {
    try {
      const { image } = req.body;

      if (!image) {
        return res.status(400).json({ success: false, msg: 'No image provided' });
      }

      const descriptor = await FaceRecognition.detectFace(image);

      res.json({
        success: true,
        message: 'Face detected successfully',
        descriptor
      });
    } catch (err) {
      console.error('❌ Face detection error:', err.message);
      res.status(500).json({ success: false, msg: err.message });
    }
  },

  // 🧠 Handle face login
  loginWithFace: async (req, res) => {
    try {
      const { image } = req.body;

      if (!image) {
        return res.status(400).json({ msg: "No image provided" });
      }

      // Simulate face detection
      console.log("✅ Face image received (base64 length):", image.length);

      // Simulate success
      return res.json({ token: "face-login-token" });
    } catch (err) {
      console.error("❌ Face login failed:", err);
      return res.status(500).json({ msg: "Face login failed" });
    }
  }
};

export default FaceController;
