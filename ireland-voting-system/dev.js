import { spawn } from 'child_process';
import open from 'open';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const HOME_PAGE = `http://localhost:${PORT}/index.html`; // This will load index.html

// Start the backend server with nodemon
const nodemon = spawn('npx', ['nodemon', 'backend/app.js'], {
  stdio: 'inherit',
  shell: true
});

// Wait 2 seconds, then open the browser to index.html
setTimeout(() => {
  open(HOME_PAGE)
    .then(() => console.log(`🌐 Opened browser at ${HOME_PAGE}`))
    .catch(err => console.error('❌ Failed to open browser:', err));
}, 2000);

// Handle server exit
nodemon.on('exit', (code) => {
  console.log(`🔁 Server process exited with code ${code}`);
});
