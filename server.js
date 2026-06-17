// ================================================
// ระบบห้องสมุดอย่างง่าย (Library System - Simple API)
// สำหรับผู้เริ่มต้นเรียนรู้ Node.js + Express
// ใช้ข้อมูลในตัวแปร (Array) ไม่ใช้ฐานข้อมูลจริง
// ข้อมูลเป็น JSON
// ================================================

// 1. นำเข้า (Import) โมดูลที่จำเป็น
const express = require('express');   // Framework สำหรับสร้าง Web Server และ API
const cors = require('cors');         // อนุญาตให้เว็บอื่น (Front-end) เรียก API ได้

// 2. สร้างแอปพลิเคชัน Express
const app = express();

// 3. กำหนดพอร์ตที่เซิร์ฟเวอร์จะรัน
// ใช้ process.env.PORT สำหรับ deployment (Render, Railway ฯลฯ)
// ถ้าไม่เจอ env ให้ใช้ 3000 (สำหรับรัน local)
const PORT = process.env.PORT || 3000;

// ================================================
// 4. Middleware (ตัวกลางที่ทำงานก่อนถึง Route)
// ================================================

// อนุญาตให้ Front-end จากโดเมนอื่นเรียก API ได้ (สำคัญมากถ้า Front-end แยกคนละพอร์ต)
app.use(cors());

// อ่านข้อมูล JSON ที่ส่งมาจาก Body ของ Request (เช่น POST, PUT)
app.use(express.json());

// ================================================
// 5. ข้อมูลหนังสือ (เก็บในหน่วยความจำ - In-memory)
// ใช้ Array ของ Object (รูปแบบ JSON)
// ================================================

// หมายเหตุ: 
// - bookId ต้องไม่ซ้ำกัน (ใช้เป็นตัวระบุ)
// - quantity = จำนวนหนังสือที่ "เหลือ" สำหรับยืม (simplified)
// - position = ชั้นที่เก็บหนังสือ (ใช้ภาษาไทยได้)
// - status = "AVAILABLE" (ยืมได้) หรือ "BORROWED" (ถูกยืม)

let books = [
  {
    bookId: "B001",
    bookName: "แฮร์รี่ พอตเตอร์ กับศิลาอาถรรพ์",
    quantity: 5,
    position: "ชั้น 1 A",
    status: "AVAILABLE"
  },
  {
    bookId: "B002",
    bookName: "โค้ดลับ The Da Vinci Code",
    quantity: 2,
    position: "ชั้น 2 B",
    status: "BORROWED"
  },
  {
    bookId: "B003",
    bookName: "คิดเหมือนเศรษฐี",
    quantity: 4,
    position: "ชั้น 1 C",
    status: "AVAILABLE"
  },
  {
    bookId: "B004",
    bookName: "สามก๊ก ฉบับคนไทยอ่าน",
    quantity: 1,
    position: "ชั้น 3 A",
    status: "AVAILABLE"
  },
  {
    bookId: "B005",
    bookName: "คัมภีร์ชีวิต",
    quantity: 0,
    position: "ชั้น 4 B",
    status: "BORROWED"
  }
];

// ================================================
// 6. ฟังก์ชันช่วยเหลือ (Helper Functions)
// ================================================

// ค้นหาหนังสือจาก bookId
function findBookById(bookId) {
  return books.find(book => book.bookId === bookId);
}

// สร้าง Response แบบมาตรฐาน (ดีสำหรับ Front-end)
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return response;
}

// ================================================
// 7. API Routes (เส้นทาง API)
// ================================================

// -----------------------------------------------
// GET /api/books
// วัตถุประสงค์: ส่งรายการหนังสือทั้งหมดกลับไปให้ Front-end
// ตามที่ผู้ใช้ต้องการหลัก
// -----------------------------------------------
app.get('/api/books', (req, res) => {
  // req = Request ที่เข้ามา (จาก Front-end)
  // res = Response ที่เราจะส่งกลับ
  
  console.log('📚 GET /api/books - ขอรายการหนังสือทั้งหมด');
  
  // ส่งข้อมูลกลับเป็น JSON
  res.json(createResponse(true, 'ดึงรายการหนังสือสำเร็จ', books));
});

// -----------------------------------------------
// GET /api/books/:bookId
// ดึงหนังสือ 1 เล่ม ตามรหัส
// -----------------------------------------------
app.get('/api/books/:bookId', (req, res) => {
  const bookId = req.params.bookId;           // รับค่า bookId จาก URL
  console.log(`📖 GET /api/books/${bookId} - ขอข้อมูลหนังสือรหัส ${bookId}`);
  
  const book = findBookById(bookId);
  
  if (!book) {
    // ไม่พบหนังสือ
    return res.status(404).json(
      createResponse(false, `ไม่พบหนังสือรหัส ${bookId}`)
    );
  }
  
  res.json(createResponse(true, 'ดึงข้อมูลหนังสือสำเร็จ', book));
});

// -----------------------------------------------
// POST /api/books
// เพิ่มหนังสือใหม่
// รับข้อมูลจาก Body (JSON)
// -----------------------------------------------
app.post('/api/books', (req, res) => {
  console.log('➕ POST /api/books - เพิ่มหนังสือใหม่');
  
  const { bookId, bookName, quantity, position, status } = req.body;
  
  // ตรวจสอบข้อมูลที่จำเป็น (Validation แบบง่าย)
  if (!bookId || !bookName) {
    return res.status(400).json(
      createResponse(false, 'กรุณาระบุ bookId และ bookName')
    );
  }
  
  // ตรวจสอบว่า bookId ซ้ำหรือไม่
  if (findBookById(bookId)) {
    return res.status(400).json(
      createResponse(false, `bookId ${bookId} มีอยู่แล้ว`)
    );
  }
  
  // สร้างหนังสือใหม่
  const newBook = {
    bookId: bookId,
    bookName: bookName,
    quantity: quantity !== undefined ? Number(quantity) : 1,
    position: position || 'ยังไม่ระบุ',
    status: status || 'AVAILABLE'
  };
  
  // เพิ่มเข้า Array
  books.push(newBook);
  
  console.log('✅ เพิ่มหนังสือสำเร็จ:', newBook);
  
  res.status(201).json(
    createResponse(true, 'เพิ่มหนังสือสำเร็จ', newBook)
  );
});

// -----------------------------------------------
// PUT /api/books/:bookId
// แก้ไขข้อมูลหนังสือ (อัปเดตทั้งหมด)
// -----------------------------------------------
app.put('/api/books/:bookId', (req, res) => {
  const bookId = req.params.bookId;
  console.log(`✏️ PUT /api/books/${bookId} - แก้ไขหนังสือ`);
  
  const bookIndex = books.findIndex(book => book.bookId === bookId);
  
  if (bookIndex === -1) {
    return res.status(404).json(
      createResponse(false, `ไม่พบหนังสือรหัส ${bookId}`)
    );
  }
  
  const { bookName, quantity, position, status } = req.body;
  
  // อัปเดตเฉพาะฟิลด์ที่ส่งมา
  const updatedBook = { ...books[bookIndex] };
  
  if (bookName !== undefined) updatedBook.bookName = bookName;
  if (quantity !== undefined) updatedBook.quantity = Number(quantity);
  if (position !== undefined) updatedBook.position = position;
  if (status !== undefined) updatedBook.status = status;
  
  books[bookIndex] = updatedBook;
  
  res.json(createResponse(true, 'แก้ไขข้อมูลหนังสือสำเร็จ', updatedBook));
});

// -----------------------------------------------
// DELETE /api/books/:bookId
// ลบหนังสือ
// -----------------------------------------------
app.delete('/api/books/:bookId', (req, res) => {
  const bookId = req.params.bookId;
  console.log(`🗑️ DELETE /api/books/${bookId} - ลบหนังสือ`);
  
  const bookIndex = books.findIndex(book => book.bookId === bookId);
  
  if (bookIndex === -1) {
    return res.status(404).json(
      createResponse(false, `ไม่พบหนังสือรหัส ${bookId}`)
    );
  }
  
  const deletedBook = books.splice(bookIndex, 1)[0];
  
  res.json(createResponse(true, 'ลบหนังสือสำเร็จ', deletedBook));
});

// -----------------------------------------------
// POST /api/books/:bookId/borrow
// ยืมหนังสือ (สถานะยืม)
// ลด quantity ลง 1 และปรับ status
// -----------------------------------------------
app.post('/api/books/:bookId/borrow', (req, res) => {
  const bookId = req.params.bookId;
  console.log(`📤 POST /api/books/${bookId}/borrow - ยืมหนังสือ`);
  
  const book = findBookById(bookId);
  
  if (!book) {
    return res.status(404).json(
      createResponse(false, `ไม่พบหนังสือรหัส ${bookId}`)
    );
  }
  
  if (book.quantity <= 0 || book.status === 'BORROWED') {
    return res.status(400).json(
      createResponse(false, 'หนังสือหมดหรือถูกยืมไปแล้ว ไม่สามารถยืมได้')
    );
  }
  
  // ดำเนินการยืม
  book.quantity = book.quantity - 1;
  
  // ถ้า quantity เหลือ 0 ให้เปลี่ยนสถานะเป็น BORROWED
  if (book.quantity === 0) {
    book.status = 'BORROWED';
  }
  
  console.log(`✅ ยืมหนังสือ ${bookId} สำเร็จ | quantity เหลือ: ${book.quantity}`);
  
  res.json(createResponse(true, 'ยืมหนังสือสำเร็จ', book));
});

// -----------------------------------------------
// POST /api/books/:bookId/return
// คืนหนังสือ (สถานะคืน)
// เพิ่ม quantity ขึ้น 1 และปรับ status เป็น AVAILABLE
// -----------------------------------------------
app.post('/api/books/:bookId/return', (req, res) => {
  const bookId = req.params.bookId;
  console.log(`📥 POST /api/books/${bookId}/return - คืนหนังสือ`);
  
  const book = findBookById(bookId);
  
  if (!book) {
    return res.status(404).json(
      createResponse(false, `ไม่พบหนังสือรหัส ${bookId}`)
    );
  }
  
  // ดำเนินการคืน
  book.quantity = book.quantity + 1;
  book.status = 'AVAILABLE';
  
  console.log(`✅ คืนหนังสือ ${bookId} สำเร็จ | quantity ปัจจุบัน: ${book.quantity}`);
  
  res.json(createResponse(true, 'คืนหนังสือสำเร็จ', book));
});

// ================================================
// 8. Route พิเศษสำหรับทดสอบ
// ================================================

// หน้าแรก (Home) - แสดงข้อความเมื่อเปิดเบราว์เซอร์ที่ http://localhost:3000
app.get('/', (req, res) => {
  res.send(`
    <h1>📚 ระบบห้องสมุด API (Simple Library API)</h1>
    <p>เซิร์ฟเวอร์ทำงานปกติ!</p>
    <p>ลองเรียก API ดู: <a href="/api/books">GET /api/books</a></p>
    <hr>
    <h3>API ที่พร้อมใช้งาน:</h3>
    <ul>
      <li>GET /api/books - รายการหนังสือทั้งหมด</li>
      <li>GET /api/books/:bookId</li>
      <li>POST /api/books - เพิ่มหนังสือ</li>
      <li>PUT /api/books/:bookId - แก้ไข</li>
      <li>DELETE /api/books/:bookId - ลบ</li>
      <li>POST /api/books/:bookId/borrow - ยืม</li>
      <li>POST /api/books/:bookId/return - คืน</li>
    </ul>
  `);
});

// ================================================
// 9. เริ่มต้นเซิร์ฟเวอร์ (หรือ export สำหรับ serverless / Netlify Functions)
// ================================================

if (require.main === module) {
  // รันตรง ๆ ด้วย node server.js (local หรือบาง deployment)
  app.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Server เริ่มทำงานที่: http://localhost:${PORT}`);
    console.log(`📚 API หนังสือ: http://localhost:${PORT}/api/books`);
    console.log('========================================');
    console.log('💡 กด Ctrl + C เพื่อหยุดเซิร์ฟเวอร์');
    console.log('');
    console.log('📋 ตัวอย่างข้อมูลหนังสือเริ่มต้น:');
    console.log(JSON.stringify(books, null, 2));
    console.log('');
  });
} else {
  // Export app สำหรับ serverless (Netlify Functions, Vercel ฯลฯ)
  module.exports = app;
}