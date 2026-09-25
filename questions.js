// Ngân hàng câu hỏi Trung Thu Đoán Chữ (Word Scramble)
// Hỗ trợ 2 bộ câu hỏi (Bộ 1 & Bộ 2) có thể chuyển đổi linh hoạt trên màn hình MC

window.QUESTION_SETS = {
  set1: {
    id: "set1",
    name: "Bộ Câu Hỏi 1 (Kinh Điển)",
    questions: [
      {
        "id": 1,
        "answer": "ĐÈN ÔNG SAO",
        "words": 3,
        "scrambled": "g / o / n / đ / s / è / n / ô / a",
        "hint": "Món đồ chơi Trung Thu truyền thống 5 cánh bằng giấy bóng kính màu đỏ tươi rực rỡ.",
        "time": 60
      },
      {
        "id": 2,
        "answer": "BÁNH DẺO",
        "words": 2,
        "scrambled": "n / ẻ / b / h / á / o / d",
        "hint": "Món bánh Trung Thu vỏ màu trắng mịn làm từ bột nếp thơm nức hương hoa bưởi.",
        "time": 60
      },
      {
        "id": 3,
        "answer": "THỎ NGỌC",
        "words": 2,
        "scrambled": "g / h / c / n / ọ / t / ỏ",
        "hint": "Linh vật nhỏ nhắn tinh nghịch, cần mẫn giã thuốc tiên trên Cung Trăng.",
        "time": 60
      },
      {
        "id": 4,
        "answer": "CHỊ HẰNG",
        "words": 2,
        "scrambled": "ằ / g / ị / n / h / h / c",
        "hint": "Tiên nữ xinh đẹp sống trên Cung Trăng, người bạn thân thiết của thiếu nhi mỗi dịp Rằm tháng Tám.",
        "time": 60
      },
      {
        "id": 5,
        "answer": "LỒNG ĐÈN",
        "words": 2,
        "scrambled": "g / è / l / n / đ / ồ / n",
        "hint": "Món đồ chơi thắp nến lung linh các bé cầm đi rước khắp xóm làng đêm Trung Thu.",
        "time": 60
      },
      {
        "id": 6,
        "answer": "ÔNG ĐỊA",
        "words": 2,
        "scrambled": "đ / g / ị / a / ô / n",
        "hint": "Nhân vật bụng phệ cầm quạt giấy vui nhộn luôn đi cùng đoàn Múa Lân.",
        "time": 60
      },
      {
        "id": 7,
        "answer": "TÙNG RINH RINH",
        "words": 3,
        "scrambled": "h / i / n / r / g / ù / t / n / h / r / i / n",
        "hint": "Từ mô phỏng tiếng trống rước đèn quen thuộc thiếu nhi nào cũng thuộc bài hát.",
        "time": 60
      },
      {
        "id": 8,
        "answer": "BÁNH NƯỚNG",
        "words": 2,
        "scrambled": "ư / n / á / g / h / ớ / b / n / n",
        "hint": "Món bánh Trung Thu truyền thống vỏ màu vàng óng, nhân thập cẩm hoặc đậu xanh thơm ngon.",
        "time": 60
      },
      {
        "id": 9,
        "answer": "MÚA LÂN",
        "words": 2,
        "scrambled": "â / l / m / ú / n / a",
        "hint": "Màn biểu diễn rộn ràng tiếng trống mang lại may mắn tưng bừng khắp phố phường.",
        "time": 60
      },
      {
        "id": 10,
        "answer": "TRĂNG TRÒN",
        "words": 2,
        "scrambled": "ò / n / r / ă / g / t / n / r / t",
        "hint": "Đĩa bạc lung linh tỏa sáng rạng rỡ khắp làng xóm đêm Trung Thu.",
        "time": 60
      },
      {
        "id": 11,
        "answer": "PHÁ CỖ",
        "words": 2,
        "scrambled": "ỗ / p / á / c / h",
        "hint": "Hoạt động vui nhất khi trăng lên đỉnh đầu, cả nhà cùng vây quanh ăn bánh trái.",
        "time": 60
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
    ]
  },

  set2: {
    id: "set2",
    name: "Bộ Câu Hỏi 2 (Mới & Độc Đáo)",
    questions: [
      {
        "id": 1,
        "answer": "MẶT NẠ GIẤY",
        "words": 3,
        "scrambled": "ấ / n / m / y / ặ / t / g / i / a",
        "hint": "Món đồ chơi dân gian bồi bằng giấy vẽ hình chú Tễu, đầu Lân ngộ nghĩnh các bạn nhỏ đeo đi rước đèn.",
        "time": 60
      },
      {
        "id": 2,
        "answer": "CUNG TRĂNG",
        "words": 2,
        "scrambled": "g / u / r / n / c / ă / g / t / n",
        "hint": "Nơi chốn thần tiên huyền ảo trên bầu trời đêm trong các câu chuyện cổ tích dân gian.",
        "time": 60
      },
      {
        "id": 3,
        "answer": "MÂM NGŨ QUẢ",
        "words": 3,
        "scrambled": "m / ũ / g / â / ả / q / n / m / u",
        "hint": "Bàn quả gồm 5 loại trái cây mùa thu được bày biện trang trọng để dâng cúng tổ tiên và phá cỗ.",
        "time": 60
      },
      {
        "id": 4,
        "answer": "MÚA RỒNG",
        "words": 2,
        "scrambled": "g / ú / r / m / ồ / a / n",
        "hint": "Màn biểu diễn dân gian công phu với thân hình uốn lượn uyển chuyển, thường xuất hiện cùng múa lân.",
        "time": 60
      },
      {
        "id": 5,
        "answer": "ĐÈN KÉO QUÂN",
        "words": 3,
        "scrambled": "o / è / u / k / đ / â / n / n / é / q",
        "hint": "Chiếc đèn lồng cổ truyền kỳ diệu, khi thắp nến thì bóng các hình ảnh bên trong tự động quay tròn.",
        "time": 60
      },
      {
        "id": 6,
        "answer": "ĐÈN CÁ CHÉP",
        "words": 3,
        "scrambled": "é / c / đ / h / è / p / á / n / c",
        "hint": "Chiếc đèn mang hình ảnh loài vật vượt vũ môn hóa rồng, gửi gắm ước mơ học hành đỗ đạt.",
        "time": 60
      },
      {
        "id": 7,
        "answer": "TRỐNG ẾCH",
        "words": 2,
        "scrambled": "h / ố / t / c / r / ế / g / n",
        "hint": "Món đồ chơi âm nhạc gõ tay cầm nhỏ nhắn, tạo nên âm thanh cắc tùng rộn rã gắn liền với tuổi thơ.",
        "time": 60
      },
      {
        "id": 8,
        "answer": "ĐẦU SƯ TỬ",
        "words": 3,
        "scrambled": "ử / đ / u / s / ầ / t / ư",
        "hint": "Chiếc mũ hóa trang rực rỡ sắc màu có đôi mắt chớp chớp dùng trong các bài múa dân gian náo nhiệt.",
        "time": 60
      },
      {
        "id": 9,
        "answer": "NHÂN ĐẬU XANH",
        "words": 3,
        "scrambled": "u / h / n / đ / x / ậ / n / h / a / â / n",
        "hint": "Vị nhân bánh Trung Thu truyền thống thơm bùi, ngọt thanh và được nhiều thế hệ yêu thích nhất.",
        "time": 60
      },
      {
        "id": 10,
        "answer": "BÁNH CON HEO",
        "words": 3,
        "scrambled": "o / n / b / e / h / á / h / o / c / n",
        "hint": "Chiếc bánh nướng nhỏ xíu ngộ nghĩnh hình gia đình ủn ỉn, thường được đặt trong chiếc rọ tre xinh xắn.",
        "time": 60
      },
      {
        "id": 11,
        "answer": "RẰM THÁNG TÁM",
        "words": 3,
        "scrambled": "m / á / t / ằ / g / t / h / á / r / n / m",
        "hint": "Ngày trăng sáng và tròn nhất mùa thu theo âm lịch hàng năm.",
        "time": 60
      },
      {
        "id": 12,
        "answer": "RƯỚC ĐÈN THÁNG TÁM",
        "words": 4,
        "scrambled": "m / c / á / t / è / n / đ / h / á / r / ớ / g / t / ư / n",
        "hint": "Tên bài hát Trung Thu quốc dân: \"Tết Trung Thu rước đèn đi chơi, em rước đèn đi khắp phố phường...\".",
        "time": 60
      },
      {
        "id": 13,
        "answer": "SỰ TÍCH CHÚ CUỘI",
        "words": 4,
        "scrambled": "i / c / h / ộ / s / ú / c / t / ự / u / c / h / í",
        "hint": "Tên câu chuyện cổ tích dân gian gắn liền với gốc cây đa và chàng tiều phu trên mặt trăng.",
        "time": 60
      },
      {
        "id": 14,
        "answer": "CHỊ HẰNG NGA",
        "words": 3,
        "scrambled": "g / a / h / ằ / n / c / g / ị / n / h",
        "hint": "Tên người tiên nữ xinh đẹp nhân hậu cai quản Cung Trăng, người bạn thân thiết của thiếu nhi mỗi đêm rằm.",
        "time": 60
      },
      {
        "id": 15,
        "answer": "TẾT THIẾU NHI",
        "words": 3,
        "scrambled": "h / ế / t / i / n / t / u / i / ế / t / h",
        "hint": "Tên gọi thân thương khác của Tết Trung Thu - ngày hội rộn rã ngập tràn niềm vui dành riêng cho các em nhỏ.",
        "time": 60
      }
    ]
  }
};

// Mặc định ban đầu là Bộ 1
window.GAME_QUESTIONS = window.QUESTION_SETS.set1.questions;
