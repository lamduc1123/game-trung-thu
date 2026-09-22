# 🌕 HƯỚNG DẪN TỔ CHỨC GAME TRUNG THU ĐOÁN CHỮ (WORD SCRAMBLE REALTIME)

Hệ thống Game Đoán Chữ Tương Tác Đa Người Chơi Realtime dành cho sự kiện Trung Thu công ty.
- **Laptop Host / Máy Chiếu**: Hiển thị QR Code, đồng hồ đếm ngược, số người nộp bài trực tiếp, mở đáp án, bảng xếp hạng Top 5 và vinh danh trao giải.
- **Điện Thoại Người Chơi (30 - 40 người)**: Quét QR Code tham gia tức thì trên trình duyệt (iPhone Safari, Android Chrome), chọn Avatar Trung Thu, gõ câu trả lời và tranh tài tốc độ!

---

## 🚀 1. CÁCH MỞ GAME NHANH TRÊN MÁY TÍNH MC

### Cách 1: Nhấp đúp chuột (Dễ nhất - Khuyên Dùng)
Mở thư mục:
`/Users/lamduc/.gemini/antigravity/scratch/trung-thu-word-scramble`
Và **nhấp đúp vào file `start_game.command`**.
Trình duyệt sẽ tự động mở trang MC `http://localhost:8080/host.html`.

### Cách 2: Mở qua Terminal
```bash
cd /Users/lamduc/.gemini/antigravity/scratch/trung-thu-word-scramble
python3 server.py
```

---

## 📡 2. BA PHƯƠNG ÁN KẾT NỐI MẠNG CHO 30 - 40 ĐIỆN THOẠI

> [!TIP]
> **Phương án 1: Cùng Mạng Wi-Fi (Văn phòng / Địa điểm tổ chức)**
> - Máy tính MC và điện thoại người chơi cùng bắt chung 1 tên mạng Wi-Fi.
> - Server tự nhận diện IP (VD: `http://192.168.1.50:8080/player.html`) và biến thành mã QR trên màn hình lớn.
> - Người chơi chỉ cần bật Camera quét mã QR là vào thẳng phòng chơi.

> [!IMPORTANT]
> **Phương án 2: Bật Hotspot Wi-Fi (Tối ưu nhất nếu Wi-Fi công ty chặn kết nối nội bộ / AP Isolation)**
> - Dùng 1 điện thoại (hoặc chính laptop Mac) bật **Điểm phát sóng cá nhân (Personal Hotspot)**.
> - Kết nối máy tính và các điện thoại vào mạng Hotspot này. Tốc độ sẽ đạt mức mili-giây, cực kỳ mượt mà và không bao giờ bị nghẽn mạng!

> [!NOTE]
> **Phương án 3: Chơi Qua Mạng 4G/5G Di Động (Dùng Tunnel Public)**
> - Server tự động kích hoạt đường hầm bảo mật SSH Tunnel (`nokey@localhost.run`) và cấp đường link Public dạng `https://xxx.lhr.life/player.html`.
> - Người chơi dùng 4G/5G Viettel, VinaPhone, MobiFone quét QR tham gia bình thường mà không cần bật Wi-Fi.

---

## 🎮 3. KỊCH BẢN DẪN DẮT CHO MC TRONG SỰ KIỆN

### 🔹 BƯỚC 1: LOBBY ĐÓN NGƯỜI CHƠI (MÃ QR)
1. Chiếu màn hình máy tính lên máy chiếu / màn LED hội trường.
2. MC mời mọi người mở Camera điện thoại quét mã QR.
3. Người chơi nhập Tên và chọn 1 trong 8 Avatar Trung Thu đặc trưng:
   - 🐰 Thỏ Ngọc, 👨‍🌾 Chú Cuội, 🧚‍♀️ Chị Hằng, 🦁 Đầu Lân, 🏮 Đèn Lồng, 🥮 Bánh Nướng, 🌕 Trăng Tròn, 🥁 Trống Trung Thu.
4. Màn hình lớn hiển thị số người tham gia và danh sách avatar nhảy vào phòng theo thời gian thực.

### 🔹 BƯỚC 2: CÔNG BỐ THỂ LỆ & CƠ CẤU GIẢI THƯỞNG
- MC bấm nút **[📜 XEM THỂ LỆ & BẮT ĐẦU]**.
- Công bố giải thưởng: **Top 5 người chơi xuất sắc nhất nhận thưởng 100.000 VNĐ / người**.
- Trả lời ĐÚNG nhận **100 điểm gốc**.
- Người nộp đúng nhanh nhất nhận thêm điểm thưởng tốc độ (Top 1 +50đ, Top 2 +48đ, Top 3 +46đ...).

### 🔹 BƯỚC 3: TIẾN HÀNH 15 CÂU HỎI
- MC bấm **[🔥 BẮT ĐẦU CÂU HỎI 1]**:
  - Câu 1 đến Câu 11: 30 giây đếm ngược.
  - Câu 12 đến Câu 15: 60 giây đếm ngược (các câu ghép từ khó).
- Người chơi gõ đáp án tiếng Việt trên điện thoại và bấm **[GỬI ĐÁP ÁN]**.
- Màn hình lớn hiện tiến độ nộp bài: `⚡ ĐÃ CÓ X / Y NGƯỜI NỘP BÀI`.
- Hết giờ hoặc MC bấm **[🔓 MỞ ĐÁP ÁN]**: Hiệu ứng chữ vàng rực rỡ xuất hiện kèm âm thanh pháo hoa chúc mừng.
- MC bấm **[📊 BẢNG XẾP HẠNG TOP 5]** để xem sự thay đổi điểm số và thứ hạng của các tuyển thủ.

### 🔹 BƯỚC 4: VINH DANH CHUNG CUỘC
- Sau câu 15, MC bấm **[🏆 VINH DANH CHUNG CUỘC]**:
  - Màn hình bùng nổ pháo giấy confetti rực rỡ cùng âm nhạc hào hùng.
  - Bục vinh quang 3 vị trí dẫn đầu (Hạng 1 👑, Hạng 2 🥈, Hạng 3 🥉) và vị trí Top 4, Top 5.
  - Ban tổ chức trao giải thưởng nóng 100.000 VNĐ / người cho Top 5!

---

## 📝 4. CÁCH TÙY BIẾN HOẶC THÊM CÂU HỎI

Toàn bộ câu hỏi được lưu tại file JSON độc lập:
📂 `questions.json`

Cấu trúc mỗi câu hỏi:
```json
{
  "id": 1,
  "answer": "ĐÈN ÔNG SAO",
  "words": 3,
  "scrambled": "g / o / n / đ / s / è / n / ô / a",
  "hint": "Món đồ chơi Trung Thu truyền thống 5 cánh bằng giấy bóng kính màu đỏ tươi rực rỡ.",
  "time": 30
}
```
Bạn có thể dễ dàng sửa đáp án, thêm câu hỏi văn hóa riêng của công ty hoặc thay đổi thời gian đếm ngược.

---

## 📁 5. CẤU TRÚC DỰ ÁN
```
/Users/lamduc/.gemini/antigravity/scratch/trung-thu-word-scramble/
├── start_game.command     # Phím tắt mở nhanh trên macOS
├── server.py              # Máy chủ Python đa luồng + SSE Realtime
├── host.html              # Màn hình MC & Máy chiếu hội trường
├── player.html            # Web App điện thoại cho người chơi
├── audio.js               # Sound Engine thuần Web Audio API
├── questions.json         # Ngân hàng 15 câu hỏi Trung Thu
└── README.md              # Tài liệu hướng dẫn A-Z
```
