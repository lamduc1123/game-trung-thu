#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Stress Test Script: Mô phỏng 40 thiết bị di động tham gia và gửi đáp án cùng lúc.
"""

import urllib.request
import urllib.parse
import json
import time
import threading
import sys
import subprocess

PORT = 8080

def send_request(path, data=None):
    url = f"http://127.0.0.1:{PORT}{path}"
    req_data = json.dumps(data).encode('utf-8') if data else None
    headers = {'Content-Type': 'application/json'} if data else {}
    req = urllib.request.Request(url, data=req_data, headers=headers)
    with urllib.request.urlopen(req, timeout=5) as resp:
        return json.loads(resp.read().decode('utf-8'))

def test_full_flow():
    print("1. Kiểm tra Server Health...")
    health = send_request('/api/health')
    print("   Server online:", health)
    assert health.get('ok') is True

    print("\n2. Mô phỏng 40 người chơi đồng thời gia nhập (Join Room)...")
    players = []
    avatars = ['🐰', '👨‍🌾', '🧚‍♀️', '🦁', '🏮', '🥮', '🌕', '🥁']
    join_latencies = []

    def join_worker(idx):
        start = time.time()
        client_id = f"test_phone_{idx:02d}"
        avatar = avatars[idx % len(avatars)]
        name = f"Thành viên {idx:02d}"
        res = send_request('/api/join', {'client_id': client_id, 'name': name, 'avatar': avatar})
        dur = (time.time() - start) * 1000
        join_latencies.append(dur)
        if res.get('success'):
            players.append(res['player'])

    threads = []
    for i in range(1, 41):
        t = threading.Thread(target=join_worker, args=(i,))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    print(f"   => Đã kết nối thành công: {len(players)}/40 người chơi.")
    print(f"   => Độ trễ trung bình khi 40 máy cùng Join: {sum(join_latencies)/len(join_latencies):.2f} ms")
    assert len(players) == 40

    print("\n3. MC bắt đầu câu hỏi 1 (START_QUESTIONS)...")
    send_request('/api/host_action', {'action': 'START_QUESTIONS'})
    state = send_request('/api/state')
    print(f"   Trạng thái: {state['status']}, Câu hỏi: {state['question']['id']} ({state['question']['words']} từ)")
    assert state['status'] == 'QUESTION'

    print("\n4. 40 người chơi cùng lúc nộp bài (Concurrently submitting answers)...")
    submit_latencies = []
    correct_count = 0

    def submit_worker(player, idx):
        start = time.time()
        # 30 người nộp đúng "ĐÈN ÔNG SAO", 10 người nộp sai
        ans = "ĐÈN ÔNG SAO" if idx <= 30 else "BÁNH TRUNG THU"
        res = send_request('/api/submit', {'player_id': player['id'], 'answer': ans})
        dur = (time.time() - start) * 1000
        submit_latencies.append(dur)
        if res.get('is_correct'):
            nonlocal correct_count
            correct_count += 1

    sub_threads = []
    for idx, p in enumerate(players, 1):
        t = threading.Thread(target=submit_worker, args=(p, idx))
        sub_threads.append(t)
        t.start()

    for t in sub_threads:
        t.join()

    print(f"   => Đã nhận 40 bài nộp. Số người trả lời ĐÚNG: {correct_count}/40.")
    print(f"   => Độ trễ trung bình khi 40 máy cùng Nộp bài: {sum(submit_latencies)/len(submit_latencies):.2f} ms")

    print("\n5. Kiểm tra Bảng Xếp Hạng Top 5...")
    send_request('/api/host_action', {'action': 'SHOW_LEADERBOARD'})
    lb_state = send_request('/api/state')
    top5 = lb_state.get('top5', [])
    for rank, p in enumerate(top5, 1):
        print(f"   Top {rank}: {p['avatar']} {p['name']} - Điểm: {p['score']}đ (Đúng {p['total_correct']} câu)")

    assert len(top5) == 5
    # Người nộp đúng đầu tiên nhận: 100 + 50 = 150đ
    assert top5[0]['score'] == 150
    # Người nộp đúng thứ 2 nhận: 100 + 48 = 148đ
    assert top5[1]['score'] == 148
    print("\n✅ TẤT CẢ CÁC BƯỚC KIỂM THỬ TẢI 40 THIẾT BỊ ĐỒNG THỜI HOÀN TOÀN THÀNH CÔNG!")

if __name__ == '__main__':
    test_full_flow()
