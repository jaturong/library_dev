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

// หน้าแรก (Home) - API Documentation สำหรับทีม Front-end
// หน้านี้จะถูกอัพเดททุกครั้งที่มีการขอคู่มือ endpoint ใหม่
app.get('/', (req, res) => {
  const baseUrl = 'http://10.0.20.96:3000';
  
  res.send(`
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>📚 Library API Documentation</title>
      <!-- Noto Sans Thai font -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        body { 
          font-family: 'Noto Sans Thai', sans-serif; 
          line-height: 1.6; 
          max-width: 1000px; 
          margin: 0 auto; 
          padding: 20px; 
          background: #f8f9fa; 
          color: #333; 
        }
        h1, h2, h3 { 
          font-family: 'Noto Sans Thai', sans-serif; 
          font-weight: 700; 
          color: #2c3e50; 
        }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .endpoint { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .method { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; color: white; font-size: 14px; }
        .post { background: #f39c12; }
        .get { background: #27ae60; }
        .put { background: #3498db; }
        .delete { background: #e74c3c; }
        
        /* Inline code - light background, dark text for good contrast */
        code { 
          background: #f1f1f1; 
          color: #2c3e50; 
          padding: 2px 6px; 
          border-radius: 3px; 
          font-family: 'Noto Sans Thai', monospace; 
        }
        
        /* Code blocks inside pre - dark background, light text */
        pre { 
          background: #2c3e50; 
          color: #ecf0f1; 
          padding: 15px; 
          border-radius: 6px; 
          overflow-x: auto; 
          margin: 10px 0;
          font-family: 'Noto Sans Thai', monospace;
        }
        pre code { 
          background: transparent; 
          color: #ecf0f1; 
          padding: 0; 
          border-radius: 0;
          font-family: 'Noto Sans Thai', monospace;
        }
        
        .note { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px 15px; margin: 15px 0; color: #333; font-family: 'Noto Sans Thai', sans-serif; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; background: white; }
        th, td { 
          border: 1px solid #ddd; 
          padding: 8px 12px; 
          text-align: left; 
          font-family: 'Noto Sans Thai', sans-serif;
        }
        th { background: #f1f1f1; color: #2c3e50; }
        .warning { color: #c0392b; font-weight: bold; }
        .section { margin-top: 40px; }
        
        /* Apply Noto Sans Thai to text elements */
        body, h1, h2, h3, p, ul, li, small, .note, table, th, td, .endpoint {
          font-family: 'Noto Sans Thai', sans-serif;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📚 ระบบห้องสมุด API</h1>
        <p><strong>Base URL ปัจจุบัน:</strong> <code>http://10.0.20.96:3000</code></p>
        <p>หน้านี้คือคู่มือการใช้งาน API สำหรับทีม Front-end (อัพเดทตามที่ขอ)</p>
      </div>

      <h2>📋 รายการ API ทั้งหมด</h2>
      <ul>
        <li><strong>GET</strong> <a href="/api/books">/api/books</a> - ดึงหนังสือทั้งหมด</li>
        <li><strong>GET</strong> /api/books/:bookId - ดึงหนังสือตามรหัส</li>
        <li><strong>POST</strong> <a href="#post-books">/api/books</a> - <strong>เพิ่มหนังสือใหม่</strong> (ดูคู่มือด้านล่าง)</li>
        <li><strong>PUT</strong> /api/books/:bookId - แก้ไขหนังสือ</li>
        <li><strong>DELETE</strong> /api/books/:bookId - ลบหนังสือ</li>
        <li><strong>POST</strong> /api/books/:bookId/borrow - ยืมหนังสือ</li>
        <li><strong>POST</strong> /api/books/:bookId/return - คืนหนังสือ</li>
      </ul>

      <hr>

      <!-- คู่มือ POST /api/books -->
      <div id="post-books" class="endpoint">
        <h2>📘 คู่มือการใช้งาน: การเพิ่มหนังสือ</h2>
        <p><span class="method post">POST</span> <code>/api/books</code></p>
        
        <h3>วัตถุประสงค์</h3>
        <p>เพิ่มหนังสือใหม่เข้าไปในระบบห้องสมุด</p>

        <h3>Request Body (JSON)</h3>
        <pre><code>{
  "bookId": "B006",           // จำเป็น - รหัสหนังสือ (ห้ามซ้ำ)
  "bookName": "ชื่อหนังสือ",   // จำเป็น
  "quantity": 5,              // ไม่จำเป็น (default = 1)
  "position": "ชั้น 3 B",     // ไม่จำเป็น (default = "ยังไม่ระบุ")
  "status": "AVAILABLE"       // ไม่จำเป็น (default = "AVAILABLE")
}</code></pre>

        <h3>ฟิลด์ที่จำเป็น</h3>
        <table>
          <tr><th>ฟิลด์</th><th>จำเป็น</th><th>ค่าเริ่มต้น</th><th>หมายเหตุ</th></tr>
          <tr><td>bookId</td><td>ใช่</td><td>-</td><td>ต้องไม่ซ้ำกับที่มีอยู่</td></tr>
          <tr><td>bookName</td><td>ใช่</td><td>-</td><td>ชื่อหนังสือ</td></tr>
          <tr><td>quantity</td><td>ไม่</td><td>1</td><td>จำนวนเล่ม</td></tr>
          <tr><td>position</td><td>ไม่</td><td>"ยังไม่ระบุ"</td><td>ชั้นที่เก็บ</td></tr>
          <tr><td>status</td><td>ไม่</td><td>"AVAILABLE"</td><td>"AVAILABLE" หรือ "BORROWED"</td></tr>
        </table>

        <h3>ตัวอย่างการเรียก (JavaScript - Fetch)</h3>
        <pre><code>fetch('${baseUrl}/api/books', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    bookId: "B006",
    bookName: "คิดเหมือนเศรษฐี",
    quantity: 5,
    position: "ชั้น 3 B",
    status: "AVAILABLE"
  })
})
.then(res => res.json())
.then(data => console.log(data));</code></pre>

        <h3>Response สำเร็จ (HTTP 201)</h3>
        <pre><code>{
  "success": true,
  "message": "เพิ่มหนังสือสำเร็จ",
  "data": {
    "bookId": "B006",
    "bookName": "คิดเหมือนเศรษฐี",
    "quantity": 5,
    "position": "ชั้น 3 B",
    "status": "AVAILABLE"
  }
}</code></pre>

        <h3>Response ล้มเหลว</h3>
        <ul>
          <li><strong>400</strong> - ไม่ได้ส่ง <code>bookId</code> หรือ <code>bookName</code></li>
          <li><strong>400</strong> - <code>bookId</code> ซ้ำกับที่มีอยู่แล้ว</li>
        </ul>

        <div class="note">
          <strong>หมายเหตุสำหรับทีม:</strong> ข้อมูลยังเป็นแบบ in-memory (หายเมื่อปิดเซิร์ฟเวอร์)
        </div>
      </div>

      <hr>
      <p><small>หน้านี้จะถูกอัพเดทเพิ่มเติมเมื่อคุณขอคู่มือของ API เส้นอื่น ๆ</small></p>
      <p><small>Base URL ปัจจุบัน: <strong>http://10.0.20.96:3000</strong></small></p>
    </body>
    </html>
  `);
});

// ================================================
// 9. เริ่มต้นเซิร์ฟเวอร์ (หรือ export สำหรับ serverless / Netlify Functions)
// ================================================

if (require.main === module) {
  // รันตรง ๆ ด้วย node server.js (local หรือบาง deployment)
  // ใช้ '0.0.0.0' เพื่อให้เครื่องอื่นในเครือข่ายเดียวกัน (LAN) เข้าถึงได้ผ่าน IP
  app.listen(PORT, '0.0.0.0', () => {
    console.log('========================================');
    console.log(`🚀 Server เริ่มทำงานที่:`);
    console.log(`   - Localhost: http://localhost:${PORT}`);
    console.log(`   - เครือข่าย (LAN): http://<your-ip>:${PORT}`);
    console.log(`📚 ตัวอย่าง API หนังสือ: http://<your-ip>:${PORT}/api/books`);
    console.log('========================================');
    console.log('💡 กด Ctrl + C เพื่อหยุดเซิร์ฟเวอร์');
    console.log('');
    console.log('📋 ตัวอย่างข้อมูลหนังสือเริ่มต้น:');
    console.log(JSON.stringify(books, null, 2));
    console.log('');
    console.log('💡 หากต้องการรู้ IP ของเครื่องนี้ ให้รันคำสั่ง: ipconfig (Windows) หรือ ifconfig/ip addr (Linux/Mac)');
  });
} else {
  // Export app สำหรับ serverless (Netlify Functions, Vercel ฯลฯ)
  module.exports = app;
}