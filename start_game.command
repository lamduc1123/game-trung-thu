#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"
echo "========================================================="
echo "🌕 Đang khởi động Game Trung Thu Đoán Chữ (Word Scramble)"
echo "========================================================="
# Dọn dẹp tiến trình cũ nếu còn kẹt cổng 8080 / 8081
lsof -ti :8080,8081 | xargs kill -9 2>/dev/null || true
sleep 0.5
python3 server.py
