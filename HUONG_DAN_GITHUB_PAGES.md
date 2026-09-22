# 🌕 HƯỚNG DẪN TRIỂN KHAI GAME TRUNG THU LÊN GITHUB PAGES + FIREBASE 🏮

Tài liệu này hướng dẫn chi tiết từng bước để đưa game lên mạng Internet thông qua **GitHub Pages** (hoàn toàn miễn phí, có chứng chỉ bảo mật HTTPS) kết hợp **Google Firebase Realtime Database** (miễn phí, tốc độ cao, hỗ trợ 100 người chơi đồng thời trên cả 4G/5G và Wi-Fi).

---

## 🚀 TẠI SAO PHƯƠNG ÁN NÀY KHẮC PHỤC TRIỆT ĐỂ MỌI LỖI MẠNG?

1. **Không bị chặn bởi Wi-Fi nội bộ**: Nhiều router gia đình hoặc cơ quan bật tính năng *AP Isolation (Client Isolation)* cấm các điện thoại kết nối tới laptop. Khi chạy qua GitHub Pages + Firebase Cloud, toàn bộ điện thoại và laptop kết nối qua Internet công cộng.
2. **Không bị Safari / Chrome / Zalo chặn IP riêng**: Trình duyệt iOS/Android luôn chặn hoặc cảnh báo khi quét mã IP số (như `172.16.x.x`). Link GitHub Pages là tên miền chuẩn HTTPS (`https://...`), mở ngay tức thì trên mọi camera, Zalo, Messenger, QR scanner.
3. **Không cần cài đặt Python hay mở Terminal trên máy tính**: MC chỉ cần mở trình duyệt vào link web là điều khiển được game.

---

## 📌 BƯỚC 1: TẠO CƠ SỞ DỮ LIỆU MIỄN PHÍ TRÊN GOOGLE FIREBASE (2 PHÚT)

1. Truy cập vào trang quản lý Firebase: [https://console.firebase.google.com/](https://console.firebase.google.com/) và đăng nhập bằng tài khoản Google của bạn.
2. Bấm vào nút **"Add project"** (Thêm dự án):
   - Đặt tên dự án (ví dụ: `trung-thu-game`).
   - Tắt mục "Enable Google Analytics for this project" (cho nhanh gọn) -> Bấm **Create project** -> Đợi 10 giây rồi bấm **Continue**.
3. Tại menu bên trái, tìm mục **Build** -> Chọn **Realtime Database**:
   - Bấm nút **Create Database**.
   - **Database location**: Chọn `Singapore (asia-southeast1)` (để máy chủ ở gần Việt Nam nhất, tốc độ phản hồi dưới 30ms). Bấm **Next**.
   - **Security rules**: Chọn **Start in test mode** (cho phép người chơi đọc/ghi dữ liệu thi đấu không cần đăng nhập tài khoản) -> Bấm **Enable**.
4. Lấy mã cấu hình kết nối:
   - Bấm vào biểu tượng **Bánh răng Cài đặt** (Project settings) ở góc trên bên trái (cạnh mục Project Overview).
   - Cuộn xuống dưới cùng mục **"Your apps"**, bấm vào biểu tượng Web `</>`.
   - Nhập tên App nickname (ví dụ: `trung-thu-web`) -> Bấm **Register app**.
   - Firebase sẽ hiển thị đoạn mã tương tự như sau:
     ```javascript
     const firebaseConfig = {
       apiKey: "AIzaSy...",
       authDomain: "trung-thu-game.firebaseapp.com",
       databaseURL: "https://trung-thu-game-default-rtdb.asia-southeast1.firebasedatabase.app",
       projectId: "trung-thu-game",
       storageBucket: "trung-thu-game.appspot.com",
       messagingSenderId: "123456789",
       appId: "1:123456789:web:abcdef..."
     };
     ```
5. Mở file `firebase-config.js` trong thư mục dự án và dán thông tin cấu hình vào:
   - Mở file: `/Users/lamduc/.gemini/antigravity/scratch/trung-thu-word-scramble/firebase-config.js`
   - Thay thế các giá trị trong `window.FIREBASE_CONFIG` bằng các khóa bạn vừa copy từ Firebase.
   - Lưu file lại.

---

## 📌 BƯỚC 2: ĐƯA DỰ ÁN LÊN GITHUB & BẬT GITHUB PAGES (3 PHÚT)

### Cách 1: Đẩy bằng Terminal (Nhanh nhất)
1. Truy cập [https://github.com/new](https://github.com/new), tạo một Repository mới:
   - Tên Repository: `trung-thu-word-scramble`
   - Chọn chế độ: **Public**
   - Bấm **Create repository**.
2. Mở ứng dụng **Terminal** trên máy Mac của bạn và chạy lần lượt các lệnh sau:
   ```bash
   cd /Users/lamduc/.gemini/antigravity/scratch/trung-thu-word-scramble
   git init
   git add .
   git commit -m "Khoi tao Game Trung Thu Firebase va GitHub Pages"
   git branch -M main
   git remote add origin https://github.com/<TEN-GITHUB-CUA-BAN>/trung-thu-word-scramble.git
   git push -u origin main
   ```
   *(Thay `<TEN-GITHUB-CUA-BAN>` bằng username GitHub của bạn).*

### Cách 2: Kéo thả trực tiếp trên giao diện web GitHub (Nếu không quen dùng Terminal)
1. Tạo Repo mới trên GitHub như trên.
2. Trên trang repo vừa tạo, bấm vào link **"uploading an existing file"**.
3. Kéo toàn bộ các file trong thư mục `/Users/lamduc/.gemini/antigravity/scratch/trung-thu-word-scramble` vào trình duyệt và bấm **Commit changes**.

---

## 📌 BƯỚC 3: KÍCH HOẠT GITHUB PAGES

1. Tại trang Repository trên GitHub của bạn, bấm vào tab **Settings** (ở thanh menu phía trên).
2. Ở cột menu bên trái, cuộn xuống và chọn **Pages**.
3. Tại phần **Build and deployment**:
   - **Source**: Chọn `Deploy from a branch`.
   - **Branch**: Chọn `main` (hoặc `master`), thư mục giữ nguyên là `/(root)`.
   - Bấm nút **Save**.
4. Đợi khoảng 1 đến 2 phút để GitHub kích hoạt máy chủ. Khi hoàn tất, GitHub sẽ hiển thị thông báo màu xanh kèm đường link chính thức của bạn:
   > 🌐 **`https://<username>.github.io/trung-thu-word-scramble/`**

---

## 🎮 BƯỚC 4: HƯỚNG DẪN TỔ CHỨC ĐÊM TRUNG THU

1. **Màn hình MC / Máy chiếu**:
   - Trên laptop kết nối máy chiếu, mở trình duyệt vào link:
     `https://<username>.github.io/trung-thu-word-scramble/host.html`
   - Bấm phím `F11` hoặc bấm biểu tượng **⛶ Toàn màn hình** ở góc phải để có trải nghiệm sân khấu đẹp nhất.
   - Bật nhạc nền Trung Thu rộn rã bằng nút **🎵**.

2. **Người chơi quét mã tham gia**:
   - Màn hình máy chiếu sẽ tự động hiển thị mã QR trỏ thẳng đến trang người chơi (`player.html`).
   - 30-40 người chơi dùng bất kỳ điện thoại nào (iPhone, Samsung, Xiaomi...), mở Camera hoặc Zalo quét mã QR.
   - Nhập tên và chọn Avatar linh vật (Thỏ Ngọc 🐰, Chú Cuội 👨‍🌾, Chị Hằng 🧚‍♀️, Đèn Lồng 🏮...).
   - Danh sách người chơi tham gia sẽ nhảy số theo thời gian thực trên màn hình máy chiếu!

3. **Bắt đầu cuộc thi**:
   - MC bấm **"📜 XEM THỂ LỆ & BẮT ĐẦU"** -> Phổ biến luật và giải thưởng (Top 5 nhận 100k VNĐ).
   - Bấm **"🔥 BẮT ĐẦU CÂU HỎI 1"** để đếm ngược.
   - Người chơi gõ đáp án trên điện thoại. Ai gõ đúng nhanh nhất sẽ nhận điểm thưởng tốc độ cao nhất.
   - Sau mỗi câu, MC bấm **"MỞ ĐÁP ÁN"** -> **"BẢNG XẾP HẠNG"** -> **"CÂU TIẾP THEO"**.
   - Kết thúc 15 câu, hệ thống tự động bắn pháo hoa vinh danh Top 5 trên bục vinh quang 🏆!
