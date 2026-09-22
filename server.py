#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Server Realtime Game Trung Thu - Đoán Chữ (Word Scramble)
Tối ưu đa luồng cho 30-50 thiết bị di động (iPhone / Android) kết nối qua mã QR
Hỗ trợ mạng Wi-Fi LAN nội bộ, Hotspot và Public Tunnel (4G/5G).
"""

import http.server
import socketserver
import json
import urllib.parse
import socket
import subprocess
import re
import time
import threading
import os
import sys
import webbrowser
import unicodedata

# 1. TỰ ĐỘNG TÌM PORT TRỐNG (8080 - 8100)
def find_available_port(start_port=8080):
    port = start_port
    while port < 8100:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            s.bind(("0.0.0.0", port))
            s.close()
            return port
        except OSError:
            port += 1
    return start_port

PORT = find_available_port(8080)

# 2. TỰ ĐỘNG PHÁT HIỆN IP MẠNG LAN (WI-FI / HOTSPOT)
def get_real_lan_ip():
    # Cách 1: Quét card mạng macOS / Linux qua ifconfig
    try:
        out = subprocess.check_output(['ifconfig']).decode('utf-8', errors='ignore')
        for block in out.split('\n\n'):
            if 'status: active' in block or 'en0' in block or 'wlan0' in block or 'eth0' in block or 'bridge' in block:
                ips = re.findall(r'inet\s+(\d+\.\d+\.\d+\.\d+)', block)
                for ip in ips:
                    if not ip.startswith('127.'):
                        return ip
    except Exception:
        pass

    # Cách 2: UDP Socket probe
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        if not ip.startswith('127.'):
            return ip
    except Exception:
        pass

    # Cách 3: Hostname
    try:
        host_ip = socket.gethostbyname(socket.gethostname())
        if not host_ip.startswith('127.'):
            return host_ip
    except Exception:
        pass

    return "127.0.0.1"

LOCAL_IP = get_real_lan_ip()
PUBLIC_URL = None

# 3. NẠP NGÂN HÀNG CÂU HỎI TỪ questions.json
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTIONS_FILE = os.path.join(SCRIPT_DIR, "questions.json")

def load_questions():
    if os.path.exists(QUESTIONS_FILE):
        try:
            with open(QUESTIONS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"⚠️ Lỗi đọc questions.json: {e}")
    # Fallback mặc định nếu file lỗi
    return [
        {"id": 1, "answer": "ĐÈN ÔNG SAO", "words": 3, "scrambled": "g / o / n / đ / s / è / n / ô / a", "hint": "Món đồ chơi Trung Thu truyền thống 5 cánh.", "time": 30}
    ]

QUESTIONS = load_questions()

# 4. TRẠNG THÁI GAME THỜI GIAN THỰC (THREAD-SAFE)
game_state = {
    "status": "LOBBY",                 # LOBBY, RULES, QUESTION, REVEAL, LEADERBOARD, FINALE
    "current_q_idx": 0,
    "q_start_time": 0,
    "players": {},                      # player_id -> dict
    "submissions_count": 0,
    "correct_submissions_count": 0,
    "recent_submits": [],               # list of {name, avatar, is_correct, time} for live ticker
    "sse_clients": []
}

lock = threading.Lock()

# Chuẩn hóa chuỗi tiếng Việt chống lệch bộ gõ
def normalize_vn(text):
    if not text:
        return ""
    text = unicodedata.normalize('NFC', text.strip().upper())
    # Gộp khoảng trắng thừa
    text = " ".join(text.split())
    return text

def broadcast_event(event_type, payload):
    data = f"event: {event_type}\ndata: {json.dumps(payload, ensure_ascii=False)}\n\n".encode('utf-8')
    with lock:
        to_remove = []
        for client in game_state["sse_clients"]:
            try:
                client.wfile.write(data)
                client.wfile.flush()
            except Exception:
                to_remove.append(client)
        for client in to_remove:
            if client in game_state["sse_clients"]:
                game_state["sse_clients"].remove(client)

def get_top_leaderboard(limit=10):
    with lock:
        players_list = list(game_state["players"].values())
    # Sắp xếp theo: điểm cao nhất -> tổng câu đúng -> thời gian trả lời trung bình
    players_list.sort(key=lambda p: (p.get("score", 0), p.get("total_correct", 0)), reverse=True)
    return players_list[:limit]

# 5. TIẾN TRÌNH TẠO TUNNEL PUBLIC TỰ ĐỘNG (4G/5G CHO ĐIỆN THOẠI)
def start_public_tunnel():
    global PUBLIC_URL
    try:
        proc = subprocess.Popen(
            ['ssh', '-o', 'StrictHostKeyChecking=no', '-o', 'ServerAliveInterval=30', '-R', f'80:localhost:{PORT}', 'nokey@localhost.run'],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        for line in proc.stdout:
            match = re.search(r'https://[a-zA-Z0-9\-]+\.lhr\.life', line)
            if match:
                PUBLIC_URL = f"{match.group(0)}/player.html"
                print(f"==================================================")
                print(f"🌍 PUBLIC 4G/5G URL ĐÃ SẴN SÀNG: {PUBLIC_URL}")
                print(f"==================================================")
                broadcast_event("ip_update", {
                    "player_url": PUBLIC_URL,
                    "lan_url": f"http://{LOCAL_IP}:{PORT}/player.html",
                    "public_url": PUBLIC_URL
                })
                break
    except Exception as e:
        print(f"Tunnel notice: {e}")

threading.Thread(target=start_public_tunnel, daemon=True).start()

# 6. HTTP REQUEST HANDLER
class RealtimeGameHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Tắt bớt log rác để console nhẹ và nhanh
        if '/api/stream' in args[0] or '/api/health' in args[0]:
            return
        super().log_message(format, *args)

    def send_json_response(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Max-Age', '86400')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
        self.wfile.write(body)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Max-Age', '86400')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Max-Age', '86400')
        self.send_header('Content-Length', '0')
        super().end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path in ["/host", "/"]:
            self.path = "/host.html"
            return super().do_GET()

        elif parsed.path == "/player":
            self.path = "/player.html"
            return super().do_GET()

        elif parsed.path == "/api/health":
            self.send_json_response({"ok": True, "server": "online", "port": PORT})
            return

        elif parsed.path == "/api/ip":
            v_tag = int(time.time())
            lan_url = f"http://{LOCAL_IP}:{PORT}/player.html?v={v_tag}"
            pub_url = f"{PUBLIC_URL}?v={v_tag}" if PUBLIC_URL else None
            resp = {
                "ip": LOCAL_IP,
                "port": PORT,
                "lan_url": lan_url,
                "public_url": pub_url,
                "player_url": lan_url,
                "raw_lan_url": f"http://{LOCAL_IP}:{PORT}/player.html"
            }
            self.send_json_response(resp)
            return

        elif parsed.path == "/api/state":
            with lock:
                q_idx = game_state["current_q_idx"]
                current_q = QUESTIONS[q_idx] if q_idx < len(QUESTIONS) else None
                # Không gửi đáp án lộ liễu nếu chưa ở trạng thái REVEAL/FINALE
                safe_q = None
                if current_q:
                    safe_q = {
                        "id": current_q.get("id"),
                        "words": current_q.get("words"),
                        "scrambled": current_q.get("scrambled"),
                        "hint": current_q.get("hint"),
                        "time": current_q.get("time")
                    }
                    if game_state["status"] in ["REVEAL", "LEADERBOARD", "FINALE"]:
                        safe_q["answer"] = current_q.get("answer")

                state_data = {
                    "status": game_state["status"],
                    "current_q_idx": q_idx,
                    "total_questions": len(QUESTIONS),
                    "question": safe_q,
                    "q_start_time": game_state["q_start_time"],
                    "total_players": len(game_state["players"]),
                    "submissions_count": game_state["submissions_count"],
                    "correct_submissions_count": game_state["correct_submissions_count"],
                    "players": list(game_state["players"].values()),
                    "top5": get_top_leaderboard(5),
                    "top10": get_top_leaderboard(10),
                    "recent_submits": game_state["recent_submits"][-5:],
                    "ip": LOCAL_IP,
                    "port": PORT,
                    "lan_url": f"http://{LOCAL_IP}:{PORT}/player.html",
                    "public_url": PUBLIC_URL
                }
            self.send_json_response(state_data)
            return

        elif parsed.path == "/api/stream":
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.end_headers()

            with lock:
                game_state["sse_clients"].append(self)

            q_idx = game_state["current_q_idx"]
            current_q = QUESTIONS[q_idx] if q_idx < len(QUESTIONS) else None
            safe_q = None
            if current_q:
                safe_q = {
                    "id": current_q.get("id"),
                    "words": current_q.get("words"),
                    "scrambled": current_q.get("scrambled"),
                    "hint": current_q.get("hint"),
                    "time": current_q.get("time")
                }
                if game_state["status"] in ["REVEAL", "LEADERBOARD", "FINALE"]:
                    safe_q["answer"] = current_q.get("answer")

            init_data = {
                "status": game_state["status"],
                "current_q_idx": q_idx,
                "total_questions": len(QUESTIONS),
                "question": safe_q,
                "q_start_time": game_state["q_start_time"],
                "total_players": len(game_state["players"]),
                "submissions_count": game_state["submissions_count"],
                "correct_submissions_count": game_state["correct_submissions_count"],
                "players": list(game_state["players"].values()),
                "top5": get_top_leaderboard(5)
            }
            self.wfile.write(f"event: init\ndata: {json.dumps(init_data, ensure_ascii=False)}\n\n".encode('utf-8'))
            self.wfile.flush()

            # Giữ kết nối SSE và ping định kỳ 15s để chống timeout router
            try:
                while True:
                    time.sleep(15)
                    self.wfile.write(b": ping\n\n")
                    self.wfile.flush()
            except Exception:
                with lock:
                    if self in game_state["sse_clients"]:
                        game_state["sse_clients"].remove(self)
        elif parsed.path == "/api/join":
            params = urllib.parse.parse_qs(parsed.query)
            data = {k: v[0] for k, v in params.items()}
            return self.process_join(data)

        elif parsed.path == "/api/submit":
            params = urllib.parse.parse_qs(parsed.query)
            data = {k: v[0] for k, v in params.items()}
            return self.process_submit(data)

        elif parsed.path == "/api/host_action":
            params = urllib.parse.parse_qs(parsed.query)
            data = {k: v[0] for k, v in params.items()}
            return self.process_host_action(data)

        return super().do_GET()

    def process_join(self, data):
        name = data.get("name", "").strip()
        avatar = data.get("avatar", "🐰")
        client_id = data.get("client_id")

        if not name:
            name = f"Người chơi {len(game_state['players']) + 1}"

        with lock:
            existing_player = None
            if client_id:
                for p in game_state["players"].values():
                    if p.get("client_id") == client_id:
                        existing_player = p
                        break

            if existing_player:
                player_obj = existing_player
                player_obj["name"] = name
                player_obj["avatar"] = avatar
            else:
                player_id = f"p_{int(time.time()*1000)}_{len(game_state['players']) + 1}"
                player_obj = {
                    "id": player_id,
                    "client_id": client_id or player_id,
                    "name": name,
                    "avatar": avatar,
                    "score": 0,
                    "total_correct": 0,
                    "answers": {}
                }
                game_state["players"][player_id] = player_obj

        print(f"👥 [JOIN] {avatar} {name} đã vào phòng! Tổng: {len(game_state['players'])} người chơi")

        broadcast_event("player_joined", {
            "player": player_obj,
            "total_players": len(game_state["players"]),
            "players": list(game_state["players"].values())
        })

        resp_data = {
            "success": True,
            "player": player_obj,
            "total_players": len(game_state["players"]),
            "players": list(game_state["players"].values())
        }
        self.send_json_response(resp_data)

    def process_submit(self, data):
        player_id = data.get("player_id")
        raw_answer = data.get("answer", "")
        answer_text = normalize_vn(raw_answer)

        with lock:
            target_player = None
            if player_id in game_state["players"]:
                target_player = game_state["players"][player_id]
            else:
                for p in game_state["players"].values():
                    if p.get("client_id") == player_id or p.get("id") == player_id:
                        target_player = p
                        break

            if not target_player:
                self.send_json_response({"error": "Player not found"}, 400)
                return

            player = target_player
            q_idx = game_state["current_q_idx"]
            correct_ans = normalize_vn(QUESTIONS[q_idx]["answer"])

            if str(q_idx) in player["answers"] or q_idx in player["answers"]:
                self.send_json_response({"success": True, "already": True})
                return

            now = time.time()
            time_taken = round(now - game_state["q_start_time"], 2) if game_state["q_start_time"] > 0 else 0
            is_correct = (answer_text == correct_ans)

            game_state["submissions_count"] += 1
            points = 0
            order = 0

            if is_correct:
                game_state["correct_submissions_count"] += 1
                order = game_state["correct_submissions_count"]
                speed_bonus = max(2, 52 - (order * 2))
                points = 100 + speed_bonus
                player["score"] += points
                player["total_correct"] += 1

            answer_record = {
                "text": answer_text,
                "is_correct": is_correct,
                "time_sec": time_taken,
                "points": points,
                "order": order
            }
            player["answers"][str(q_idx)] = answer_record

            game_state["recent_submits"].append({
                "name": player["name"],
                "avatar": player["avatar"],
                "is_correct": is_correct,
                "order": order
            })

        print(f"📩 [SUBMIT] {player['avatar']} {player['name']}: \"{raw_answer}\" -> {'✅ ĐÚNG' if is_correct else '❌ SAI'}")

        broadcast_event("submission_update", {
            "submissions_count": game_state["submissions_count"],
            "correct_submissions_count": game_state["correct_submissions_count"],
            "total_players": len(game_state["players"]),
            "player_id": player["id"],
            "player_name": player["name"],
            "player_avatar": player["avatar"],
            "is_correct": is_correct,
            "order": order
        })

        resp = {
            "success": True,
            "is_correct": is_correct,
            "points": points,
            "total_score": player["score"],
            "order": order
        }
        self.send_json_response(resp)

    def process_host_action(self, data):
        action = data.get("action")

        with lock:
            if action == "START_GAME":
                game_state["status"] = "RULES"
            elif action == "START_QUESTIONS":
                game_state["status"] = "QUESTION"
                game_state["current_q_idx"] = 0
                game_state["q_start_time"] = time.time()
                game_state["submissions_count"] = 0
                game_state["correct_submissions_count"] = 0
                game_state["recent_submits"] = []
            elif action == "NEXT_QUESTION":
                if game_state["current_q_idx"] < len(QUESTIONS) - 1:
                    game_state["current_q_idx"] += 1
                    game_state["status"] = "QUESTION"
                    game_state["q_start_time"] = time.time()
                    game_state["submissions_count"] = 0
                    game_state["correct_submissions_count"] = 0
                    game_state["recent_submits"] = []
                else:
                    game_state["status"] = "FINALE"
            elif action == "REVEAL_ANSWER":
                game_state["status"] = "REVEAL"
            elif action == "SHOW_LEADERBOARD":
                game_state["status"] = "LEADERBOARD"
            elif action == "FINALE":
                game_state["status"] = "FINALE"
            elif action == "RESET_GAME":
                game_state["status"] = "LOBBY"
                game_state["current_q_idx"] = 0
                game_state["q_start_time"] = 0
                game_state["submissions_count"] = 0
                game_state["correct_submissions_count"] = 0
                game_state["recent_submits"] = []
                for p in game_state["players"].values():
                    p["score"] = 0
                    p["total_correct"] = 0
                    p["answers"] = {}

            current_q = QUESTIONS[game_state["current_q_idx"]] if game_state["current_q_idx"] < len(QUESTIONS) else None
            safe_q = None
            if current_q:
                safe_q = {
                    "id": current_q.get("id"),
                    "words": current_q.get("words"),
                    "scrambled": current_q.get("scrambled"),
                    "hint": current_q.get("hint"),
                    "time": current_q.get("time")
                }
                if game_state["status"] in ["REVEAL", "LEADERBOARD", "FINALE"]:
                    safe_q["answer"] = current_q.get("answer")

        print(f"🎮 [MC ACTION] {action} -> Trạng thái: {game_state['status']}")

        broadcast_event("state_change", {
            "status": game_state["status"],
            "current_q_idx": game_state["current_q_idx"],
            "total_questions": len(QUESTIONS),
            "question": safe_q,
            "top5": get_top_leaderboard(5),
            "top10": get_top_leaderboard(10),
            "submissions_count": game_state["submissions_count"],
            "correct_submissions_count": game_state["correct_submissions_count"],
            "total_players": len(game_state["players"])
        })

        self.send_json_response({"success": True, "status": game_state["status"]})

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        data = {}
        try:
            self.connection.settimeout(3.0)
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                raw_body = self.rfile.read(min(content_length, 65536)).decode('utf-8', errors='ignore')
                if raw_body:
                    data = json.loads(raw_body)
        except Exception:
            data = {}
        finally:
            try:
                self.connection.settimeout(None)
            except Exception:
                pass

        if parsed.path == "/api/join":
            return self.process_join(data)

        elif parsed.path == "/api/submit":
            return self.process_submit(data)

        elif parsed.path == "/api/host_action":
            return self.process_host_action(data)

        elif parsed.path == "/api/update_ip":
            custom_url = data.get("url", "").strip()
            if custom_url:
                global PUBLIC_URL
                PUBLIC_URL = custom_url
                broadcast_event("ip_update", {
                    "player_url": PUBLIC_URL,
                    "lan_url": f"http://{LOCAL_IP}:{PORT}/player.html",
                    "public_url": PUBLIC_URL
                })
                self.send_json_response({"success": True, "url": PUBLIC_URL})
                return

        self.send_json_response({"error": "Not Found"}, 404)

class ThreadingServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

def open_host_browser():
    for _ in range(50):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(0.1)
            if s.connect_ex(("127.0.0.1", PORT)) == 0:
                s.close()
                break
            s.close()
        except Exception:
            pass
        time.sleep(0.1)
    time.sleep(0.3)
    try:
        webbrowser.open(f"http://127.0.0.1:{PORT}/host.html")
    except Exception:
        pass

if __name__ == "__main__":
    print(f"================================================================")
    print(f"🌕 GAME TRUNG THU: ĐOÁN CHỮ (WORD SCRAMBLE) - SERVER KHỞI CHẠY")
    print(f"📍 Màn hình MC / Máy chiếu: http://localhost:{PORT}/host.html")
    print(f"📱 Màn hình Người chơi     : http://{LOCAL_IP}:{PORT}/player.html")
    print(f"================================================================")

    threading.Thread(target=open_host_browser, daemon=True).start()

    os.chdir(SCRIPT_DIR)
    with ThreadingServer(("0.0.0.0", PORT), RealtimeGameHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nĐang tắt máy chủ...")
            httpd.server_close()
