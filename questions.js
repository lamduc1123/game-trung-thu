// Ngân hàng câu hỏi Trung Thu Đoán Chữ (Word Scramble)
// Bao gồm 15 câu hỏi từ dễ đến khó
window.GAME_QUESTIONS = [
  {
    "id": 1,
    "answer": "ĐÈN ÔNG SAO",
    "words": 3,
    "scrambled": "g / o / n / đ / s / è / n / ô / a",
    "hint": "Món đồ chơi Trung Thu truyền thống 5 cánh bằng giấy bóng kính màu đỏ tươi rực rỡ.",
    "time": 30
  },
  {
    "id": 2,
    "answer": "BÁNH DẺO",
    "words": 2,
    "scrambled": "n / ẻ / b / h / á / o / d",
    "hint": "Món bánh Trung Thu vỏ màu trắng mịn làm từ bột nếp thơm nức hương hoa bưởi.",
    "time": 30
  },
  {
    "id": 3,
    "answer": "THỎ NGỌC",
    "words": 2,
    "scrambled": "g / h / c / n / ọ / t / ỏ",
    "hint": "Linh vật nhỏ nhắn tinh nghịch, cần mẫn giã thuốc tiên trên Cung Trăng.",
    "time": 30
  },
  {
    "id": 4,
    "answer": "CHỊ HẰNG",
    "words": 2,
    "scrambled": "ằ / g / ị / n / h / h / c",
    "hint": "Tiên nữ xinh đẹp sống trên Cung Trăng, người bạn thân thiết của thiếu nhi mỗi dịp Rằm tháng Tám.",
    "time": 30
  },
  {
    "id": 5,
    "answer": "LỒNG ĐÈN",
    "words": 2,
    "scrambled": "g / è / l / n / đ / ồ / n",
    "hint": "Món đồ chơi thắp nến lung linh các bé cầm đi rước khắp xóm làng đêm Trung Thu.",
    "time": 30
  },
  {
    "id": 6,
    "answer": "ÔNG ĐỊA",
    "words": 2,
    "scrambled": "đ / g / ị / a / ô / n",
    "hint": "Nhân vật bụng phệ cầm quạt giấy vui nhộn luôn đi cùng đoàn Múa Lân.",
    "time": 30
  },
  {
    "id": 7,
    "answer": "TÙNG RINH RINH",
    "words": 3,
    "scrambled": "h / i / n / r / g / ù / t / n / h / r / i / n",
    "hint": "Từ mô phỏng tiếng trống rước đèn quen thuộc thiếu nhi nào cũng thuộc bài hát.",
    "time": 30
  },
  {
    "id": 8,
    "answer": "BÁNH NƯỚNG",
    "words": 2,
    "scrambled": "ư / n / á / g / h / ớ / b / n / n",
    "hint": "Món bánh Trung Thu truyền thống vỏ màu vàng óng, nhân thập cẩm hoặc đậu xanh thơm ngon.",
    "time": 30
  },
  {
    "id": 9,
    "answer": "MÚA LÂN",
    "words": 2,
    "scrambled": "â / l / m / ú / n / a",
    "hint": "Màn biểu diễn rộn ràng tiếng trống mang lại may mắn tưng bừng khắp phố phường.",
    "time": 30
  },
  {
    "id": 10,
    "answer": "TRĂNG TRÒN",
    "words": 2,
    "scrambled": "ò / n / r / ă / g / t / n / r / t",
    "hint": "Đĩa bạc lung linh tỏa sáng rạng rỡ khắp làng xóm đêm Trung Thu.",
    "time": 30
  },
  {
    "id": 11,
    "answer": "PHÁ CỖ",
    "words": 2,
    "scrambled": "ỗ / p / á / c / h",
    "hint": "Hoạt động vui nhất khi trăng lên đỉnh đầu, cả nhà cùng vây quanh ăn bánh trái.",
    "time": 30
  },
  {
    "id": 12,
    "answer": "ĐÊM HỘI TRĂNG RẰM",
    "words": 4,
    "scrambled": "r / ê / m / ộ / i / đ / ă / h / g / t / n / m / r / ằ",
    "hint": "Tên gọi rực rỡ của đêm tiệc Trung Thu dành cho thiếu nhi khi ánh trăng sáng vạch đỉnh trời.",
    "time": 60
  },
  {
    "id": 13,
    "answer": "BÁNH THẬP CẨM TRỨNG MUỐI",
    "words": 5,
    "scrambled": "m / ứ / b / ẩ / t / ố / n / h / r / p / g / á / m / c / ậ / i / u / t / h / n",
    "hint": "Món bánh nướng truyền thống ngon đậm đà với lạp xưởng, mứt bí, hạt dưa và lòng đỏ trứng muối béo ngậy.",
    "time": 60
  },
  {
    "id": 14,
    "answer": "CHÚ CUỘI NGỒI GỐC CÂY ĐA",
    "words": 6,
    "scrambled": "y / ộ / c / g / i / ú / ồ / c / đ / h / u / c / i / ố / â / n / g / a / c",
    "hint": "Câu hát dân gian quen thuộc về hình ảnh chàng tiều phu ôm cây thần bay lên Cung Trăng.",
    "time": 60
  },
  {
    "id": 15,
    "answer": "TẾT TRUNG THU TẾT ĐOÀN VIÊN",
    "words": 6,
    "scrambled": "u / ế / v / t / à / n / t / h / i / t / ê / r / n / đ / t / o / u / g / ế / t / n / t",
    "hint": "Cụm từ thể hiện ý nghĩa cốt lõi của ngày Rằm tháng Tám - thời điểm gia đình sum họp bên nhau.",
    "time": 60
  }
];
