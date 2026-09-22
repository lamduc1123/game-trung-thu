// ====================================================================
// CẤU HÌNH GOOGLE FIREBASE REALTIME DATABASE - DỰ ÁN GAME TRUNG THU
// ====================================================================

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAAIn783b05zrywIODUCDcgWzGdPV2-FBQ",
  authDomain: "game-trung-thu-doan-tu.firebaseapp.com",
  databaseURL: "https://game-trung-thu-doan-tu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "game-trung-thu-doan-tu",
  storageBucket: "game-trung-thu-doan-tu.firebasestorage.app",
  messagingSenderId: "1098101131592",
  appId: "1:1098101131592:web:7fe303f461ae40199ecb7d",
  measurementId: "G-4TK6H1230F"
};

// Khởi tạo Firebase an toàn cho toàn bộ ứng dụng
window.getFirebaseDB = function() {
  if (!window.firebase) {
    console.error("Firebase SDK chưa được tải!");
    return null;
  }
  if (!firebase.apps.length) {
    try {
      firebase.initializeApp(window.FIREBASE_CONFIG);
    } catch (e) {
      console.warn("Lỗi khởi tạo Firebase config:", e);
    }
  }
  try {
    return firebase.database();
  } catch (e) {
    console.error("Không thể kết nối Realtime Database:", e);
    return null;
  }
};
