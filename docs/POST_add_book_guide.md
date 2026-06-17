# คู่มือการใช้งาน API - การเพิ่มหนังสือ (POST /api/books)

**สำหรับทีม Front-end**

---

## ข้อมูลพื้นฐาน

- **Method**: `POST`
- **Endpoint**: `/api/books`
- **Base URL ปัจจุบัน (ทดสอบในเครือข่าย LAN)**: `http://10.0.20.96:3000`
- **Content-Type**: `application/json`

**URL เต็ม**:
```
POST http://10.0.20.96:3000/api/books
```

---

## วัตถุประสงค์
ใช้เพิ่มหนังสือใหม่เข้าไปในระบบห้องสมุด

---

## Request Body (JSON)

```json
{
  "bookId": "B006",
  "bookName": "ชื่อหนังสือ",
  "quantity": 3,
  "position": "ชั้น 2 A",
  "status": "AVAILABLE"
}
```

### รายละเอียดฟิลด์

| Field      | Type    | จำเป็น | คำอธิบาย                              | ค่าเริ่มต้น     |
|------------|---------|--------|---------------------------------------|-----------------|
| bookId     | string  | **ใช่** | รหัสหนังสือ (ต้องไม่ซ้ำกับที่มีอยู่)   | -               |
| bookName   | string  | **ใช่** | ชื่อหนังสือ                            | -               |
| quantity   | number  | ไม่    | จำนวนหนังสือ                          | 1               |
| position   | string  | ไม่    | ตำแหน่งจัดเก็บ (ชั้นที่เก็บ)           | "ยังไม่ระบุ"    |
| status     | string  | ไม่    | สถานะหนังสือ                          | "AVAILABLE"     |

**ค่าที่เป็นไปได้ของ status**:
- `"AVAILABLE"` (ยืมได้)
- `"BORROWED"` (ถูกยืม)

---

## ตัวอย่าง Request

### 1. JavaScript (Fetch)

```js
fetch('http://10.0.20.96:3000/api/books', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    bookId: "B006",
    bookName: "คิดเหมือนเศรษฐี",
    quantity: 5,
    position: "ชั้น 3 B",
    status: "AVAILABLE"
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('เพิ่มหนังสือสำเร็จ:', data);
  })
  .catch(error => {
    console.error('เกิดข้อผิดพลาด:', error);
  });
```

### 2. Axios (ถ้าใช้ในโปรเจกต์)

```js
import axios from 'axios';

const addBook = async (bookData) => {
  try {
    const response = await axios.post(
      'http://10.0.20.96:3000/api/books',
      bookData
    );
    console.log('เพิ่มหนังสือสำเร็จ:', response.data);
    return response.data;
  } catch (error) {
    console.error('เพิ่มหนังสือล้มเหลว:', error.response?.data || error.message);
    throw error;
  }
};

// เรียกใช้
addBook({
  bookId: "B007",
  bookName: "สามก๊ก ฉบับคนไทยอ่าน",
  quantity: 2,
  position: "ชั้น 1 A"
});
```

### 3. cURL (ทดสอบใน Terminal / PowerShell)

```bash
curl -X POST http://10.0.20.96:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "B006",
    "bookName": "คิดเหมือนเศรษฐี",
    "quantity": 5,
    "position": "ชั้น 3 B"
  }'
```

### 4. Postman
1. Method: `POST`
2. URL: `http://10.0.20.96:3000/api/books`
3. Headers: `Content-Type` = `application/json`
4. Body → raw → JSON → วาง JSON ข้างบน

---

## Response

### สำเร็จ (HTTP 201 Created)

```json
{
  "success": true,
  "message": "เพิ่มหนังสือสำเร็จ",
  "data": {
    "bookId": "B006",
    "bookName": "คิดเหมือนเศรษฐี",
    "quantity": 5,
    "position": "ชั้น 3 B",
    "status": "AVAILABLE"
  }
}
```

### ล้มเหลว - ข้อมูลไม่ครบ (HTTP 400)

```json
{
  "success": false,
  "message": "กรุณาระบุ bookId และ bookName"
}
```

### ล้มเหลว - bookId ซ้ำ (HTTP 400)

```json
{
  "success": false,
  "message": "bookId B006 มีอยู่แล้ว"
}
```

---

## หมายเหตุสำหรับทีม Front-end

- `bookId` ต้องไม่ซ้ำกับหนังสือที่มีอยู่แล้วในระบบ
- ถ้าไม่ส่ง `quantity` ระบบจะตั้งให้เป็น `1`
- ถ้าไม่ส่ง `position` ระบบจะตั้งให้เป็น `"ยังไม่ระบุ"`
- ถ้าไม่ส่ง `status` ระบบจะตั้งให้เป็น `"AVAILABLE"`
- ข้อมูลทั้งหมดเป็น **in-memory** (ยังไม่ใช้ฐานข้อมูล) → เมื่อปิดเซิร์ฟเวอร์ข้อมูลจะหาย

---

**อัพเดทล่าสุด**: 17 มิถุนายน 2569
**Base URL ปัจจุบัน**: `http://10.0.20.96:3000`

เมื่อเปลี่ยนไปใช้ URL จริง (เช่น หลัง deploy) ให้เปลี่ยน Base URL ในโค้ดทุกที่