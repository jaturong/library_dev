# 📚 ระบบห้องสมุดอย่างง่าย (Simple Library System)

**API สำหรับทีม Front-end**  
ใช้ Node.js + Express  
ข้อมูลเก็บในตัวแปร (In-memory) → ยังไม่ใช้ฐานข้อมูล  
ข้อมูลเป็น JSON

> **วิธีดึงโค้ดจาก GitHub (แนะนำสำหรับทีม)**
> ```bash
> git clone https://github.com/jaturong/library_dev.git
> cd library_dev
> npm install
> npm start
> ```
>
> **Repo URL:** https://github.com/jaturong/library_dev

---

## 🚀 วิธีเริ่มต้นใช้งาน (สำหรับผู้เริ่มต้น)

## 🚀 วิธีเริ่มต้นใช้งาน (สำหรับผู้เริ่มต้น)

### 1. ติดตั้งครั้งแรก
```bash
# อยู่ในโฟลเดอร์ library แล้ว
npm install
```

### 2. เริ่มรันเซิร์ฟเวอร์
```bash
npm start
```

หรือรันตรง ๆ
```bash
node server.js
```

### 3. ตรวจสอบว่าเซิร์ฟเวอร์ทำงาน
เปิดเบราว์เซอร์ไปที่: **http://localhost:3000**

จะเห็นข้อความและลิงก์ทดสอบ

เรียก API หนังสือทั้งหมด: **http://localhost:3000/api/books**

---

## 📋 รายการ API ทั้งหมด (API Documentation)

### Base URL
```
http://localhost:3000
```

---

### 1. GET /api/books
**วัตถุประสงค์**: ดึงรายการหนังสือ **ทั้งหมด** (ตาม requirement หลัก)

**Method**: `GET`  
**URL**: `/api/books`

#### Response ตัวอย่าง (สำเร็จ)
```json
{
  "success": true,
  "message": "ดึงรายการหนังสือสำเร็จ",
  "data": [
    {
      "bookId": "B001",
      "bookName": "แฮร์รี่ พอตเตอร์ กับศิลาอาถรรพ์",
      "quantity": 5,
      "position": "ชั้น 1 A",
      "status": "AVAILABLE"
    },
    {
      "bookId": "B002",
      "bookName": "โค้ดลับ The Da Vinci Code",
      "quantity": 2,
      "position": "ชั้น 2 B",
      "status": "BORROWED"
    }
  ]
}
```

#### ฟิลด์ของหนังสือ
| Field      | Type   | คำอธิบาย                     | ตัวอย่าง          |
|------------|--------|------------------------------|-------------------|
| bookId     | string | รหัสหนังสือ (ไม่ซ้ำ)         | "B001"            |
| bookName   | string | ชื่อหนังสือ                  | "แฮร์รี่ พอตเตอร์..." |
| quantity   | number | จำนวนที่เหลือ (ยืมได้)       | 5                 |
| position   | string | ชั้นที่เก็บหนังสือ            | "ชั้น 1 A"        |
| status     | string | สถานะยืม/คืน                 | "AVAILABLE" หรือ "BORROWED" |

---

### 2. GET /api/books/:bookId
**วัตถุประสงค์**: ดึงหนังสือ 1 เล่ม ตามรหัส

**Method**: `GET`  
**URL**: `/api/books/B001`

#### Response (สำเร็จ)
```json
{
  "success": true,
  "message": "ดึงข้อมูลหนังสือสำเร็จ",
  "data": {
    "bookId": "B001",
    "bookName": "แฮร์รี่ พอตเตอร์ กับศิลาอาถรรพ์",
    "quantity": 5,
    "position": "ชั้น 1 A",
    "status": "AVAILABLE"
  }
}
```

#### Response (ไม่พบ)
```json
{
  "success": false,
  "message": "ไม่พบหนังสือรหัส B999"
}
```

---

### 3. POST /api/books
**วัตถุประสงค์**: เพิ่มหนังสือใหม่

**Method**: `POST`  
**URL**: `/api/books`  
**Content-Type**: `application/json`

#### Request Body ตัวอย่าง
```json
{
  "bookId": "B006",
  "bookName": "หนังสือเล่มใหม่",
  "quantity": 3,
  "position": "ชั้น 5 A",
  "status": "AVAILABLE"
}
```

> **หมายเหตุ**: `quantity`, `position`, `status` สามารถไม่ส่งได้ (มีค่าเริ่มต้น)

#### Response (สำเร็จ)
```json
{
  "success": true,
  "message": "เพิ่มหนังสือสำเร็จ",
  "data": { ...หนังสือที่เพิ่ม... }
}
```

---

### 4. PUT /api/books/:bookId
**วัตถุประสงค์**: แก้ไขข้อมูลหนังสือ (อัปเดตบางฟิลด์หรือทั้งหมด)

**Method**: `PUT`  
**URL**: `/api/books/B001`

#### Request Body ตัวอย่าง (แก้ไขเฉพาะบางอย่าง)
```json
{
  "quantity": 4,
  "position": "ชั้น 1 B",
  "status": "AVAILABLE"
}
```

#### Response
เหมือนกับ GET รายการเดียว

---

### 5. DELETE /api/books/:bookId
**วัตถุประสงค์**: ลบหนังสือ

**Method**: `DELETE`  
**URL**: `/api/books/B001`

#### Response
```json
{
  "success": true,
  "message": "ลบหนังสือสำเร็จ",
  "data": { ...หนังสือที่ถูกลบ... }
}
```

---

### 6. POST /api/books/:bookId/borrow
**วัตถุประสงค์**: **ยืมหนังสือ** (สำคัญสำหรับระบบห้องสมุด)

**Method**: `POST`  
**URL**: `/api/books/B001/borrow`

- ลด `quantity` ลง 1
- ถ้า `quantity` เหลือ 0 → เปลี่ยน `status` เป็น `"BORROWED"` อัตโนมัติ

#### Response
```json
{
  "success": true,
  "message": "ยืมหนังสือสำเร็จ",
  "data": {
    "bookId": "B001",
    "bookName": "...",
    "quantity": 4,
    "position": "...",
    "status": "AVAILABLE"
  }
}
```

#### กรณีผิดพลาด
- หนังสือหมด (`quantity` = 0 หรือ status = "BORROWED")
```json
{
  "success": false,
  "message": "หนังสือหมดหรือถูกยืมไปแล้ว ไม่สามารถยืมได้"
}
```

---

### 7. POST /api/books/:bookId/return
**วัตถุประสงค์**: **คืนหนังสือ**

**Method**: `POST`  
**URL**: `/api/books/B001/return`

- เพิ่ม `quantity` ขึ้น 1
- เปลี่ยน `status` เป็น `"AVAILABLE"` อัตโนมัติ

---

## 🧪 วิธีทดสอบ API (แนะนำสำหรับผู้เริ่มต้น)

### วิธีที่ 1: ใช้เบราว์เซอร์ (เฉพาะ GET)
- เปิด http://localhost:3000/api/books

### วิธีที่ 2: ใช้ Postman (แนะนำที่สุด)
1. ติดตั้ง Postman
2. สร้าง Request ใหม่
3. เลือก Method + ใส่ URL
4. กด Send

### วิธีที่ 3: ใช้ curl (ใน Terminal / PowerShell)
```powershell
# ดึงหนังสือทั้งหมด
curl http://localhost:3000/api/books

# ดึงหนังสือรหัส B001
curl http://localhost:3000/api/books/B001

# ยืมหนังสือ
curl -X POST http://localhost:3000/api/books/B001/borrow

# คืนหนังสือ
curl -X POST http://localhost:3000/api/books/B001/return
```

### วิธีที่ 4: ใช้ JavaScript (Fetch) - สำหรับ Front-end
```js
// ดึงหนังสือทั้งหมด
fetch('http://localhost:3000/api/books')
  .then(res => res.json())
  .then(data => {
    console.log(data.data); // array ของหนังสือ
  });

// ยืมหนังสือ
fetch('http://localhost:3000/api/books/B001/borrow', {
  method: 'POST'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 💡 คำอธิบายสำหรับผู้เรียน (Beginner Tips)

1. **ข้อมูลอยู่ในตัวแปร `books`**  
   ทุกครั้งที่รีสตาร์ทเซิร์ฟเวอร์ ข้อมูลจะกลับไปเป็นค่าเริ่มต้น  
   (ภายหลังจะเปลี่ยนเป็นฐานข้อมูลจริง เช่น MongoDB / MySQL)

2. **Response มีโครงสร้างมาตรฐาน**
   ```js
   {
     success: true/false,
     message: "ข้อความอธิบาย",
     data: ...           // ข้อมูลจริง (หนังสือ)
   }
   ```
   Front-end ควรเช็ค `success` ก่อนใช้ `data` เสมอ

3. **Status ที่ใช้**
   - `"AVAILABLE"` = ยืมได้
   - `"BORROWED"` = ถูกยืม (หรือหมด)

4. **CORS เปิดไว้แล้ว**  
   Front-end จากพอร์ตอื่น (เช่น React ที่พอร์ต 5173) สามารถเรียก API ได้เลย

---

## 📌 หมายเหตุสำคัญ

- ระบบนี้ทำขึ้นเพื่อฝึกเขียน API และส่งให้ทีม Front-end ทดลองก่อน
- ต่อไปสามารถ:
  - เพิ่มฐานข้อมูลจริง
  - เพิ่มระบบผู้ใช้ (login)
  - เพิ่มประวัติการยืม-คืน
  - เพิ่มการ validate ข้อมูลมากขึ้น

---

**พร้อมส่งให้ทีม Front-end แล้ว!**  
หากต้องการปรับ API (เช่น เปลี่ยนชื่อ endpoint, เพิ่มฟิลด์) บอกได้เลย

---

## 🌐 แชร์ API ให้ทีม Front-end เข้าถึงจากอินเทอร์เน็ต (ใช้ ngrok)

เมื่อคุณรันเซิร์ฟเวอร์บน `localhost:3000` ทีม Front-end ที่อยู่คนละเครื่องหรือต่างสถานที่**จะเรียกไม่ได้**โดยตรง

**วิธีแก้**: ใช้ **ngrok** สร้าง URL สาธารณะ (Public URL) ชั่วคราวให้ทุกคนเข้าถึงได้

### ขั้นตอนการติดตั้งและใช้งาน ngrok (Windows)

#### ขั้นตอนที่ 1: ติดตั้ง ngrok (ทำครั้งเดียว) — สำคัญ!

**⚠️ คำเตือน**: การติดตั้งผ่าน `winget` ปัจจุบันจะได้เวอร์ชันเก่า (3.3.1) ซึ่งใช้ไม่ได้แล้ว

**วิธีแนะนำ**: ดาวน์โหลดจากเว็บทางการของ ngrok โดยตรง

1. เปิดเบราว์เซอร์ไปที่: https://ngrok.com/download
2. คลิก **Download for Windows** (เลือกเวอร์ชัน 64-bit)
3. ดาวน์โหลดไฟล์ ZIP
4. แตกไฟล์ จะได้ไฟล์ `ngrok.exe`

**วิธีวางและใช้งานง่ายที่สุด**:
- สร้างโฟลเดอร์ใหม่: `C:\ngrok`
- ย้าย `ngrok.exe` ไปใส่ในโฟลเดอร์นี้
- เพิ่มโฟลเดอร์ `C:\ngrok` เข้าไปใน **Environment Variables (PATH)**

**วิธีเพิ่ม PATH แบบเร็ว (PowerShell แบบชั่วคราวสำหรับเซสชันนี้)**:
```powershell
$env:Path += ";C:\ngrok"
ngrok --version
```

**วิธีเพิ่ม PATH แบบถาวร** (แนะนำ):
1. กดปุ่ม Windows + พิมพ์ "Environment Variables" → เลือก "Edit the system environment variables"
2. คลิกปุ่ม **Environment Variables**
3. ในส่วน "User variables" → เลือก **Path** → Edit
4. คลิก **New** → พิมพ์ `C:\ngrok`
5. OK → OK → OK
6. **ปิด PowerShell แล้วเปิดใหม่**

ตรวจสอบ:
```powershell
ngrok --version
```

#### ขั้นตอนที่ 2: สมัคร ngrok และรับ Authtoken (ฟรี)
1. ไปที่เว็บ https://ngrok.com
2. สมัครสมาชิกฟรี (Sign up with Google/GitHub/Email ก็ได้)
3. หลังล็อกอินแล้ว ไปที่หน้านี้เพื่อคัดลอก Authtoken:  
   https://dashboard.ngrok.com/get-started/your-authtoken
4. คัดลอกโทเค็น (จะมีลักษณะคล้าย `2abcD3efgH4ijkl...`)

#### ขั้นตอนที่ 3: กำหนดค่า Authtoken ครั้งเดียว
```powershell
ngrok config add-authtoken <วางโทเค็นของคุณที่นี่>
```

ตัวอย่าง:
```powershell
ngrok config add-authtoken 2abcD3efgH4ijkl5mnopQ6rstu7vwx
```

#### ขั้นตอนที่ 4: เปิดใช้งาน (สำคัญ - ต้องเปิด 2 หน้าต่าง)

**หน้าต่างที่ 1**: เริ่มเซิร์ฟเวอร์ห้องสมุดก่อน
```powershell
cd D:\Jaturong\library
npm start
```

**หน้าต่างที่ 2**: เปิด ngrok เพื่อสร้าง URL สาธารณะ
```powershell
ngrok http 3000
```

เมื่อ ngrok ทำงาน คุณจะเห็นหน้าจอแบบนี้:

```
Session Status                online
Account                       yourname@example.com
Version                       3.x.x
Region                        Asia Pacific (ap)
Forwarding                    https://abc123-xxx-xxx.ngrok-free.app -> http://localhost:3000
```

**คัดลอก URL** ที่ขึ้นต้นด้วย `https://` (เช่น `https://abc123-xxx-xxx.ngrok-free.app`)

#### ขั้นตอนที่ 5: ส่งให้ทีม Front-end
บอกทีมให้ใช้ **Base URL** ใหม่แทน `http://localhost:3000`

ตัวอย่าง:
- เดิม: `http://localhost:3000/api/books`
- ใหม่: `https://abc123-xxx-xxx.ngrok-free.app/api/books`

Front-end สามารถเรียก API ทุกตัวได้ปกติผ่าน ngrok URL นี้

---

### ⚠️ ข้อควรระวังของ ngrok (Free Plan)

- URL จะ**เปลี่ยนใหม่ทุกครั้ง**ที่คุณปิด ngrok แล้วเปิดใหม่ (เช่น `https://abc123...` → `https://xyz789...`)
- ต้องส่ง URL ใหม่ให้ทีม Front-end ทุกครั้งที่รีสตาร์ท ngrok
- ถ้าต้องการ URL ถาวร (เช่น `my-library.ngrok.io`) ต้องอัพเกรดเป็นแผนจ่ายเงิน
- ทุกคนที่รู้ URL สามารถเข้าถึงได้ในขณะที่ ngrok เปิดอยู่ (อย่าแชร์ publicly นาน ๆ)

### เคล็ดลับ
- ต้องการให้ ngrok แสดง traffic ที่เข้ามาแบบละเอียด (ดีสำหรับ debug):
  ```powershell
  ngrok http 3000 --log=stdout
  ```
- ถ้าต้องการรันแบบ background สามารถใช้หลายเทอร์มินอล หรือใช้ `ngrok start` กับ config file

---

### 🔧 แก้ปัญหา "ngrok-agent version too old" (ERR_NGROK_121)

ถ้าเจอ error แบบนี้:

> Your ngrok-agent version "3.3.1" is too old. The minimum supported agent version for your account is "3.20.0"

**สาเหตุ**: winget ติดตั้ง ngrok เวอร์ชันเก่าเกินไป (ngrok เปลี่ยนกฎบังคับเวอร์ชันขั้นต่ำ)

**วิธีแก้ (ทำตามลำดับ)**

**ขั้นตอนที่ 1**: ถอนการติดตั้งเวอร์ชันเก่า
```powershell
winget uninstall ngrok.ngrok
```

**ขั้นตอนที่ 2**: ติดตั้งเวอร์ชันใหม่จากเว็บทางการ (ดูวิธีติดตั้งด้านบนใน "ขั้นตอนที่ 1")

**ขั้นตอนที่ 3**: หลังได้เวอร์ชันใหม่แล้ว ตั้งค่า token อีกครั้ง
```powershell
ngrok config add-authtoken <วางโทเค็นของคุณ>
```

**วิธีลองอัพเดทด่วน** (ถ้า ngrok ยังเรียกได้):
```powershell
ngrok update
```

หลังอัพเดทเสร็จ ให้ปิด ngrok แล้วเปิดใหม่ด้วยคำสั่ง:
```powershell
ngrok http 3000
```

---

### สรุปขั้นตอนสั้น ๆ ที่ใช้บ่อย

```powershell
# 1. เปิดเทอร์มินอล 1
cd D:\Jaturong\library
npm start

# 2. เปิดเทอร์มินอล 2
ngrok http 3000
# → คัดลอก https://... แล้วส่งให้ทีม
```

---

Made with ❤️ for learning Node.js + Express