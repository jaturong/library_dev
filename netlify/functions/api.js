// netlify/functions/api.js
// Wrapper สำหรับ Express app ให้ทำงานบน Netlify Functions (serverless)

const serverless = require('serverless-http');
const app = require('../../server');   // โหลด Express app จาก server.js

// Netlify Functions ต้อง export handler แบบนี้
exports.handler = serverless(app);