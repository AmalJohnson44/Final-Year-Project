// backend/services/faceRecognition.js
import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';

// 🧠 Monkey patch face-api with node canvas
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// 📍 Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📦 Load models
const MODEL_PATH = path.join(__dirname, '..', 'models');
let modelsLoaded = false;

async function loadModels() {
  if (!modelsLoaded) {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    modelsLoaded = true;
    console.log("✅ Face-api models loaded.");
  }
}

// ✅ Export as default for ES module compatibility
const FaceRecognition = {
  async detectFace(base64Image) {
    await loadModels();

    const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const img = await canvas.loadImage(buffer);
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

    if (!detection) throw new Error('No face detected in the image');
    return detection.descriptor;
  },

  async compareFaces(queryDescriptor, storedDescriptor) {
    const distance = faceapi.euclideanDistance(queryDescriptor, storedDescriptor);
    return distance < 0.6; // adjust threshold if needed
  }
};

export default FaceRecognition;
