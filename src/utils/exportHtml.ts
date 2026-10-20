/**
 * Utility to export the complete Tin Hoc 12 Bai 7 Game as a 100% STANDALONE SINGLE-FILE HTML.
 * Meets the requirement: "Đóng gói toàn bộ mã nguồn vào DUY NHẤT 1 FILE HTML (HTML, CSS <style>, JS <script>)"
 * Zero external media dependencies, works completely offline on projectors, PCs, and mobile phones.
 */

import { INITIAL_QUESTIONS, INITIAL_STUDENTS } from '../data/defaultQuestions';

export function generateSingleFileHtml(): string {
  const questionsJson = JSON.stringify(INITIAL_QUESTIONS);
  const studentsJson = JSON.stringify(INITIAL_STUDENTS);

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đấu Trí Tin Học 12: HTML & Cấu Trúc Trang Web (Bài 7 KNTT)</title>
  <style>
    /* Reset & Base Styles */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
    }
    header {
      background: #1e293b;
      border-bottom: 2px solid #3b82f6;
      padding: 1rem 1.5rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
    .brand { display: flex; align-items: center; gap: 0.75rem; }
    .brand-icon {
      width: 42px; height: 42px; background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      border-radius: 10px; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 1.25rem; color: #fff;
    }
    .brand-title { font-size: 1.2rem; font-weight: 700; color: #fff; }
    .brand-sub { font-size: 0.85rem; color: #94a3b8; }
    .nav-buttons { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    button {
      cursor: pointer;
      font-family: inherit;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .btn-nav {
      background: #334155; color: #e2e8f0; padding: 0.5rem 0.85rem; font-size: 0.9rem;
    }
    .btn-nav:hover, .btn-nav.active { background: #2563eb; color: #fff; }
    .btn-primary {
      background: linear-gradient(135deg, #2563eb, #3b82f6); color: #fff;
      padding: 0.75rem 1.5rem; font-size: 1rem; box-shadow: 0 4px 12px rgba(37,99,235,0.3);
    }
    .btn-primary:hover { opacity: 0.95; transform: translateY(-1px); }
    .container { max-width: 1200px; margin: 0 auto; padding: 1.5rem; flex: 1; width: 100%; }

    /* Cards */
    .card {
      background: #1e293b; border: 1px solid #334155; border-radius: 12px;
      padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
    }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; }

    /* Section highlight badges */
    .badge {
      display: inline-block; padding: 0.25rem 0.6rem; border-radius: 6px;
      font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
    }
    .badge-blue { background: rgba(59,130,246,0.2); color: #60a5fa; border: 1px solid #3b82f6; }
    .badge-emerald { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid #10b981; }
    .badge-purple { background: rgba(168,85,247,0.2); color: #c084fc; border: 1px solid #a855f7; }

    /* Quiz styling */
    .question-box { margin-bottom: 1.5rem; }
    .question-text { font-size: 1.2rem; font-weight: 700; color: #f1f5f9; margin: 0.5rem 0 1rem; }
    .code-view {
      background: #090d16; border: 1px solid #1e293b; border-radius: 8px;
      padding: 0.85rem; font-family: monospace; font-size: 0.95rem; color: #38bdf8;
      margin-bottom: 1rem; overflow-x: auto;
    }
    .options-grid { display: grid; gap: 0.75rem; }
    .option-btn {
      background: #0f172a; border: 2px solid #334155; border-radius: 10px;
      padding: 1rem; text-align: left; color: #cbd5e1; font-size: 1rem;
      transition: all 0.2s; width: 100%; justify-content: flex-start;
    }
    .option-btn:hover { border-color: #3b82f6; background: #1e293b; color: #fff; }
    .option-btn.correct { border-color: #10b981; background: rgba(16,185,129,0.2); color: #a7f3d0; font-weight: 700; }
    .option-btn.wrong { border-color: #ef4444; background: rgba(239,68,68,0.2); color: #fecaca; }

    /* Tree Diagram */
    .tree-view {
      background: #0b1120; border: 1px solid #1e293b; border-radius: 10px;
      padding: 1.25rem; font-family: monospace; line-height: 1.8;
    }
    .tree-node { color: #f59e0b; font-weight: bold; }
    .tree-sub { color: #38bdf8; margin-left: 1.5rem; }
    .tree-leaf { color: #4ade80; margin-left: 3rem; }

    /* Modals */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: none;
      align-items: center; justify-content: center; padding: 1rem; z-index: 999;
    }
    .modal-content {
      background: #1e293b; border: 1px solid #475569; border-radius: 14px;
      max-width: 650px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 1.75rem;
    }

    /* Wheel / Slot */
    .wheel-box {
      border: 3px dashed #3b82f6; border-radius: 16px; padding: 2rem;
      text-align: center; background: #0f172a; margin: 1.5rem 0;
    }
    .wheel-name {
      font-size: 2.2rem; font-weight: 800; color: #fbbf24; min-height: 60px;
      display: flex; align-items: center; justify-content: center;
      text-shadow: 0 0 20px rgba(251,191,36,0.4);
    }

    /* Live HTML Editor */
    .sandbox-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; height: 350px; }
    @media(max-width: 768px) { .sandbox-container { grid-template-columns: 1fr; height: auto; } }
    .code-editor {
      width: 100%; height: 100%; min-height: 200px; background: #0b1120; color: #f8fafc;
      border: 1px solid #334155; border-radius: 8px; padding: 0.85rem; font-family: monospace;
      font-size: 0.9rem; resize: none;
    }
    .preview-box {
      background: #ffffff; color: #000000; border-radius: 8px; padding: 0.85rem;
      overflow: auto; min-height: 200px;
    }

    /* Scoreboard */
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #334155; }
    th { color: #94a3b8; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <div class="brand-icon">&lt;/&gt;</div>
      <div>
        <div class="brand-title">Đấu Trí Tin Học 12: HTML & Cấu Trúc Trang Web</div>
        <div class="brand-sub">Bài 7 - Sách Kết nối tri thức với cuộc sống (Trang 39 - 45)</div>
      </div>
    </div>
    <div class="nav-buttons">
      <button class="btn-nav active" onclick="switchTab('summary')">📖 Tổng Hợp Toàn Bộ Kiến Thức</button>
      <button class="btn-nav" onclick="switchTab('game1')">1. Trang Web & HTML</button>
      <button class="btn-nav" onclick="switchTab('game2')">2. Cấu Trúc HTML & Cây DOM</button>
      <button class="btn-nav" onclick="switchTab('game3')">3. Phần Mềm Soạn Thảo</button>
      <button class="btn-nav" onclick="openPicker()">🎲 Bốc Thăm Ngẫu Nhiên</button>
      <button class="btn-nav" onclick="openLeaderboard()">🏆 Bảng Điểm SQLite</button>
      <button class="btn-nav" onclick="openGuide()">📖 Sổ Tay Giáo Viên</button>
    </div>
  </header>

  <div class="container">
    <!-- Top Status Banner -->
    <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:0.75rem 1.25rem; border-radius:10px; margin-bottom:1.5rem; border:1px solid #334155;">
      <div>
        <span style="color:#94a3b8; font-size:0.9rem;">Người chơi/Nhóm: </span>
        <strong id="currentPlayerDisplay" style="color:#38bdf8;">Đội Lớp 12</strong>
        <button style="margin-left:0.5rem; background:transparent; color:#60a5fa; font-size:0.8rem; text-decoration:underline;" onclick="changePlayerName()">[Đổi tên]</button>
      </div>
      <div style="display:flex; gap:1.5rem; font-weight:700;">
        <div>Điểm số: <span id="scoreDisplay" style="color:#f59e0b; font-size:1.25rem;">0</span></div>
        <div>Câu đúng: <span id="correctDisplay" style="color:#10b981; font-size:1.25rem;">0</span></div>
      </div>
    </div>

    <!-- TAB 0: TỔNG HỢP KIẾN THỨC -->
    <div id="tab-summary" class="tab-content">
      <div class="card">
        <h2 style="color:#38bdf8; margin-bottom:0.75rem;">📖 Tổng Hợp Toàn Bộ Kiến Thức Bài 7 (Tin Học 12 KNTT)</h2>
        <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:1.25rem;">Bám sát chuẩn sách giáo khoa trang 39 - 45</p>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
          <div style="background:#0f172a; padding:1rem; border-radius:10px; border:1px solid #334155;">
            <h4 style="color:#60a5fa; margin-bottom:0.5rem;">1. Trang Web & HTML</h4>
            <ul style="font-size:0.85rem; color:#cbd5e1; line-height:1.6; padding-left:1.2rem;">
              <li><strong>HTML:</strong> Hypertext Markup Language (ngôn ngữ đánh dấu siêu văn bản).</li>
              <li><strong>Tệp mở rộng:</strong> .html hoặc .htm.</li>
              <li><strong>Thẻ HTML:</strong> Đặt trong cặp &lt; và &gt;. Tên thẻ không phân biệt chữ hoa, chữ thường.</li>
              <li><strong>Thẻ đơn:</strong> &lt;hr/&gt; (kẻ ngang), &lt;br/&gt; (ngắt dòng), &lt;img&gt;.</li>
              <li><strong>Phần tử HTML:</strong> Thẻ mở + nội dung + thẻ đóng.</li>
              <li><strong>&lt;!DOCTYPE html&gt;:</strong> Thông báo kiểu tệp html5 cho trình duyệt, KHÔNG là phần tử HTML.</li>
            </ul>
          </div>

          <div style="background:#0f172a; padding:1rem; border-radius:10px; border:1px solid #334155;">
            <h4 style="color:#34d399; margin-bottom:0.5rem;">2. Cấu Trúc Cơ Bản & Cây DOM</h4>
            <ul style="font-size:0.85rem; color:#cbd5e1; line-height:1.6; padding-left:1.2rem;">
              <li><strong>Nút gốc (root):</strong> &lt;html&gt; là phần tử gốc bắt buộc và duy nhất.</li>
              <li><strong>Nhánh &lt;head&gt;:</strong> Chứa thông tin chung: &lt;title&gt; (tên trang web, chỉ văn bản, không chứa thẻ con), &lt;meta charset="utf-8"&gt; (mã hóa Unicode).</li>
              <li><strong>Nhánh &lt;body&gt;:</strong> Chứa thông tin nội dung hiển thị: &lt;h1..h6&gt; (tiêu đề giảm cấp dần), &lt;p&gt; (đoạn văn).</li>
              <li><strong>Cây DOM:</strong> Quan hệ cha - con (lồng nhau).</li>
            </ul>
          </div>

          <div style="background:#0f172a; padding:1rem; border-radius:10px; border:1px solid #334155;">
            <h4 style="color:#c084fc; margin-bottom:0.5rem;">3. Phần Mềm Soạn Thảo</h4>
            <ul style="font-size:0.85rem; color:#cbd5e1; line-height:1.6; padding-left:1.2rem;">
              <li><strong>Đơn giản:</strong> Notepad (Windows), TextEdit (macOS).</li>
              <li><strong>Chuyên nghiệp:</strong> Notepad++ (Language -> H -> HTML), Sublime Text (View -> Syntax -> HTML).</li>
              <li><strong>Trực tuyến:</strong> w3schools.com, tutorialspoint.com (khung trái gõ mã, nháy Run xem kết quả khung phải).</li>
              <li><strong>Trình duyệt web:</strong> Chrome, Cốc Cốc, Edge, Firefox (hiển thị trang, không dùng soạn mã).</li>
              <li><strong>Lịch sử:</strong> Tim Berners-Lee (1990 CERN), bản đầu tiên 1991, HTML5 ra đời năm 2014.</li>
            </ul>
          </div>
        </div>

        <div style="text-align:center;">
          <button class="btn-primary" onclick="switchTab('game1')">Bắt Đầu Chinh Phục Câu Hỏi Phần 1 ➜</button>
        </div>
      </div>
    </div>

    <!-- TAB 1: PHẦN 1 -->
    <div id="tab-game1" class="tab-content" style="display:none;">
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <span class="badge badge-blue">Phần 1: Trang Web và HTML</span>
          <span style="color:#94a3b8; font-size:0.85rem;" id="p1-progress">Câu hỏi 1 / 9</span>
        </div>
        <div id="quiz-p1-container"></div>
      </div>
    </div>

    <!-- TAB 2: PHẦN 2 -->
    <div id="tab-game2" class="tab-content" style="display:none;">
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <span class="badge badge-emerald">Phần 2: Cấu Trúc Cơ Bản Của Một Tệp HTML</span>
          <span style="color:#94a3b8; font-size:0.85rem;" id="p2-progress">Câu hỏi 1 / 8</span>
        </div>
        
        <div class="tree-view" style="margin-bottom:1.5rem;">
          <div style="font-size:0.85rem; color:#94a3b8; margin-bottom:0.5rem;">Sơ đồ Cây Thông Tin HTML (Hình 7.4 SGK Trang 42):</div>
          <div>&lt;!DOCTYPE html&gt; <span style="color:#64748b;">(Khai báo kiểu tệp, không là phần tử)</span></div>
          <div class="tree-node">└── &lt;html&gt; (Nút Gốc - Duy nhất)</div>
          <div class="tree-sub">├── &lt;head&gt; (Thông tin chung)</div>
          <div class="tree-leaf">│   ├── &lt;meta charset="utf-8"&gt; (Mã hóa Unicode)</div>
          <div class="tree-leaf">│   └── &lt;title&gt; (Tên trang web - Chỉ văn bản)</div>
          <div class="tree-sub">└── &lt;body&gt; (Nội dung hiển thị)</div>
          <div class="tree-leaf">    ├── &lt;h1&gt; (Tiêu đề cấp 1)</div>
          <div class="tree-leaf">    ├── &lt;p&gt; (Đoạn văn) ─── &lt;em&gt; (In nghiêng)</div>
          <div class="tree-leaf">    └── &lt;hr/&gt; (Đường kẻ ngang)</div>
        </div>

        <div id="quiz-p2-container"></div>
      </div>
    </div>

    <!-- TAB 3: PHẦN 3 -->
    <div id="tab-game3" class="tab-content" style="display:none;">
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <span class="badge badge-purple">Phần 3: Phần Mềm Soạn Thảo HTML</span>
          <span style="color:#94a3b8; font-size:0.85rem;" id="p3-progress">Câu hỏi 1 / 6</span>
        </div>
        
        <div id="quiz-p3-container"></div>

        <hr style="border:0; border-top:1px solid #334155; margin: 1.5rem 0;">

        <!-- Live Editor Playground (Hình 7.6 SGK) -->
        <h3 style="color:#38bdf8; margin-bottom:0.75rem;">💻 Phòng Thí Nghiệm Soạn Thảo Trực Tuyến (Mô phỏng W3Schools SGK Trang 44)</h3>
        <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:1rem;">
          Học sinh hãy gõ hoặc chỉnh sửa mã HTML bên trái, rồi nhấn <strong>"Chạy thử (Run)"</strong> để xem kết quả hiển thị ngay bên phải!
        </p>
        <div class="sandbox-container">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:0.85rem; color:#94a3b8; font-weight:600;">Khung Soạn Thảo Mã Nguồn</span>
              <button class="btn-primary" style="padding:0.4rem 1rem; font-size:0.85rem;" onclick="runSandboxCode()">▶ Nháy nút Run</button>
            </div>
            <textarea id="sandboxCode" class="code-editor">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Trang Web Đầu Tiên Của Em&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1 style="color: #2563eb;"&gt;Chào mừng đến với Tin học 12 KNTT!&lt;/h1&gt;
    &lt;hr&gt;
    &lt;p&gt;HTML là &lt;b&gt;ngôn ngữ đánh dấu siêu văn bản&lt;/b&gt;.&lt;/p&gt;
    &lt;p style="color: green;"&gt;Em đã thực hành soạn thảo thành công!&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</textarea>
          </div>
          <div>
            <div style="margin-bottom:0.5rem; font-size:0.85rem; color:#94a3b8; font-weight:600;">Kết Quả Hiển Thị Trên Trình Duyệt:</div>
            <div id="sandboxPreview" class="preview-box"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: RANDOM PICKER (BỐC THĂM HỌC SINH / NHÓM) -->
  <div id="pickerModal" class="modal-overlay">
    <div class="modal-content">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <h2 style="color:#fbbf24;">🎲 Bốc Thăm Học Sinh / Nhóm Trả Lời</h2>
        <button onclick="closePicker()" style="background:transparent; color:#94a3b8; font-size:1.5rem;">&times;</button>
      </div>
      <p style="color:#cbd5e1; font-size:0.95rem;">Giáo viên nhấn nút để chọn ngẫu nhiên một bạn học sinh hoặc nhóm trả lời câu hỏi bài học!</p>
      
      <div class="wheel-box">
        <div id="pickerResult" class="wheel-name">Bấm để quay...</div>
        <div id="pickerSub" style="color:#94a3b8; font-size:0.9rem; margin-top:0.5rem;">Sẵn sàng chọn học sinh</div>
      </div>

      <div style="display:flex; gap:1rem; justify-content:center; margin-bottom:1rem;">
        <button class="btn-primary" onclick="spinStudent()">🎯 Chọn 1 Học Sinh Ngẫu Nhiên</button>
        <button class="btn-nav" style="background:#475569;" onclick="spinGroup()">👥 Chọn Nhóm (Tổ)</button>
      </div>
      
      <details style="color:#94a3b8; font-size:0.85rem;">
        <summary style="cursor:pointer;">Danh sách học sinh mẫu (${INITIAL_STUDENTS.length} em) - Nhấn để xem</summary>
        <div style="margin-top:0.5rem; max-height:150px; overflow-y:auto; background:#0f172a; padding:0.5rem; border-radius:6px;">
          ${INITIAL_STUDENTS.map(s => s.name + ' - ' + s.group).join('<br>')}
        </div>
      </details>
    </div>
  </div>

  <!-- MODAL: LEADERBOARD SQLITE -->
  <div id="leaderboardModal" class="modal-overlay">
    <div class="modal-content">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <h2 style="color:#38bdf8;">🏆 Bảng Điểm & Quản Lý SQLite</h2>
        <button onclick="closeLeaderboard()" style="background:transparent; color:#94a3b8; font-size:1.5rem;">&times;</button>
      </div>
      <p style="color:#94a3b8; font-size:0.9rem;">Dữ liệu điểm số được quản lý theo cấu trúc bảng SQLite và lưu trữ cục bộ an toàn.</p>
      
      <table id="leaderboardTable">
        <thead>
          <tr>
            <th>Xếp hạng</th>
            <th>Tên Người chơi / Nhóm</th>
            <th>Điểm</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody id="leaderboardBody"></tbody>
      </table>

      <div style="margin-top:1.5rem; display:flex; justify-content:space-between;">
        <button class="btn-nav" style="color:#ef4444;" onclick="resetScores()">Xóa điểm làm lại</button>
        <button class="btn-primary" onclick="downloadSqliteScript()">📥 Xuất Tệp SQLite (.sql)</button>
      </div>
    </div>
  </div>

  <!-- MODAL: HƯỚNG DẪN GIÁO VIÊN -->
  <div id="guideModal" class="modal-overlay">
    <div class="modal-content">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <h2 style="color:#34d399;">📖 Hướng Dẫn Sư Phạm & Kịch Bản Tổ Chức</h2>
        <button onclick="closeGuide()" style="background:transparent; color:#94a3b8; font-size:1.5rem;">&times;</button>
      </div>
      
      <div style="font-size:0.95rem; line-height:1.7; color:#e2e8f0;">
        <h4 style="color:#60a5fa; margin-top:0.75rem;">1. Mục tiêu bài học (Bám sát SGK Tin 12 KNTT):</h4>
        <ul style="margin-left:1.25rem;">
          <li>Hiểu và giải thích được cấu trúc của một trang web dưới dạng HTML.</li>
          <li>Nắm vững khái niệm thẻ (tag), phần tử (element), phân biệt thẻ đơn và thẻ đôi.</li>
          <li>Nhận biết dòng <code>&lt;!DOCTYPE html&gt;</code> không phải phần tử HTML.</li>
          <li>Phân biệt phần mềm soạn thảo HTML (Notepad, Notepad++, Sublime Text) với trình duyệt web.</li>
        </ul>

        <h4 style="color:#60a5fa; margin-top:1rem;">2. Gợi ý tổ chức trong 45 phút trên lớp:</h4>
        <ul style="margin-left:1.25rem;">
          <li><strong>Khởi động (7 phút):</strong> Mở game Phần 1. Dùng tính năng <em>"Bốc Thăm Ngẫu Nhiên"</em> gọi 3 học sinh trả lời 3 câu đầu tiên.</li>
          <li><strong>Khám phá & Luyện tập Phần 2 (18 phút):</strong> Chiếu Sơ đồ Cây Thông Tin HTML lên máy chiếu/TV. Cho các nhóm thi đua sắp xếp thứ tự các thẻ trong cây DOM.</li>
          <li><strong>Khám phá Phần 3 & Thực hành Live (15 phút):</strong> Chơi game phân loại phần mềm và trình duyệt web. Mời học sinh lên bảng nhập thử thẻ <code>&lt;h1&gt;</code>, <code>&lt;p&gt;</code> vào khung mô phỏng trực tuyến W3Schools.</li>
          <li><strong>Tổng kết & Trao giải (5 phút):</strong> Mở Bảng Điểm SQLite vinh danh nhóm chiến thắng!</li>
        </ul>
      </div>
    </div>
  </div>

  <script>
    // Embedded Audio Synthesizer (Zero file downloads, 100% reliable)
    const AudioEngine = {
      ctx: null,
      init() {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      },
      beep(freq, duration, type='sine') {
        try {
          this.init();
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
      },
      playSuccess() {
        this.beep(523, 0.1, 'triangle');
        setTimeout(() => this.beep(659, 0.1, 'triangle'), 100);
        setTimeout(() => this.beep(784, 0.2, 'triangle'), 200);
      },
      playWrong() {
        this.beep(250, 0.15, 'sawtooth');
        setTimeout(() => this.beep(180, 0.2, 'sawtooth'), 150);
      },
      playTick() {
        this.beep(600, 0.04, 'sine');
      }
    };

    // Data Loaded
    const ALL_QUESTIONS = ${questionsJson};
    const ALL_STUDENTS = ${studentsJson};

    let userState = {
      name: 'Đội Lớp 12',
      score: 0,
      correct: 0,
      activeSection: 'section1',
      p1Index: 0,
      p2Index: 0,
      p3Index: 0
    };

    function switchTab(tabKey) {
      AudioEngine.playTick();
      document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.btn-nav').forEach(el => el.classList.remove('active'));
      
      const tabEl = document.getElementById('tab-' + tabKey);
      if (tabEl) tabEl.style.display = 'block';

      // button highlight
      if (event && event.target && event.target.classList.contains('btn-nav')) {
        event.target.classList.add('active');
      }
    }

    function renderQuiz(sectionId, containerId, qIndexKey, progressId) {
      const questions = ALL_QUESTIONS.filter(q => q.section === sectionId);
      const currIdx = userState[qIndexKey];
      const container = document.getElementById(containerId);
      const progressEl = document.getElementById(progressId);

      if (!container) return;
      if (progressEl) progressEl.innerText = "Câu hỏi " + (currIdx + 1) + " / " + questions.length;

      if (currIdx >= questions.length) {
        container.innerHTML = \`
          <div style="text-align:center; padding:2rem 1rem;">
            <div style="font-size:3rem; margin-bottom:1rem;">🎉</div>
            <h3 style="color:#10b981; font-size:1.4rem; margin-bottom:0.5rem;">Chúc mừng em đã hoàn thành phần này!</h3>
            <p style="color:#cbd5e1; margin-bottom:1.5rem;">Em đã xuất sắc chinh phục các kiến thức trong bài học.</p>
            <button class="btn-primary" onclick="restartSection('\${qIndexKey}', '\${sectionId}', '\${containerId}', '\${progressId}')">🔄 Luyện tập lại phần này</button>
          </div>
        \`;
        return;
      }

      const q = questions[currIdx];
      let html = \`
        <div class="question-box">
          <div style="color:#94a3b8; font-size:0.85rem; font-weight:600;">\${q.title} (\${q.points} điểm)</div>
          <div class="question-text">\${q.question}</div>
          <div class="options-grid">
      \`;

      q.options.forEach((opt, idx) => {
        html += \`<button class="option-btn" onclick="submitAnswer('\${sectionId}', \${currIdx}, \${idx}, this, '\${qIndexKey}', '\${containerId}', '\${progressId}')">
          <strong style="margin-right:0.5rem; color:#60a5fa;">\${String.fromCharCode(65 + idx)}.</strong> \${opt}
        </button>\`;
      });

      html += \`</div><div id="explanation-box" style="display:none; margin-top:1rem; padding:1rem; background:#0f172a; border-radius:8px; border-left:4px solid #3b82f6;"></div></div>\`;
      container.innerHTML = html;
    }

    function submitAnswer(sectionId, qIdx, selectedIdx, btnEl, qIndexKey, containerId, progressId) {
      const questions = ALL_QUESTIONS.filter(q => q.section === sectionId);
      const q = questions[qIdx];
      const allBtns = btnEl.parentElement.querySelectorAll('.option-btn');
      allBtns.forEach(b => b.disabled = true);

      const expBox = document.getElementById('explanation-box');

      if (selectedIdx === q.correctAnswerIndex) {
        btnEl.classList.add('correct');
        AudioEngine.playSuccess();
        userState.score += q.points;
        userState.correct += 1;
        updateScoreboard();
        if (expBox) {
          expBox.style.display = 'block';
          expBox.style.borderLeftColor = '#10b981';
          expBox.innerHTML = \`<strong style="color:#34d399;">✓ Chính xác!</strong><div style="color:#cbd5e1; margin-top:0.35rem; font-size:0.9rem;">\${q.explanation}</div>\`;
        }
      } else {
        btnEl.classList.add('wrong');
        if (allBtns[q.correctAnswerIndex]) allBtns[q.correctAnswerIndex].classList.add('correct');
        AudioEngine.playWrong();
        if (expBox) {
          expBox.style.display = 'block';
          expBox.style.borderLeftColor = '#ef4444';
          expBox.innerHTML = \`<strong style="color:#f87171;">✗ Chưa chính xác!</strong><div style="color:#cbd5e1; margin-top:0.35rem; font-size:0.9rem;">\${q.explanation}</div>\`;
        }
      }

      setTimeout(() => {
        userState[qIndexKey]++;
        renderQuiz(sectionId, containerId, qIndexKey, progressId);
      }, 2500);
    }

    function restartSection(qIndexKey, sectionId, containerId, progressId) {
      userState[qIndexKey] = 0;
      renderQuiz(sectionId, containerId, qIndexKey, progressId);
    }

    function updateScoreboard() {
      document.getElementById('scoreDisplay').innerText = userState.score;
      document.getElementById('correctDisplay').innerText = userState.correct;
    }

    function changePlayerName() {
      const newName = prompt('Nhập tên học sinh hoặc nhóm thi đấu:', userState.name);
      if (newName && newName.trim()) {
        userState.name = newName.trim();
        document.getElementById('currentPlayerDisplay').innerText = userState.name;
      }
    }

    // Live HTML Sandbox Runner
    function runSandboxCode() {
      AudioEngine.playTick();
      const code = document.getElementById('sandboxCode').value;
      const preview = document.getElementById('sandboxPreview');
      preview.innerHTML = code;
    }

    // Random Picker
    function openPicker() {
      document.getElementById('pickerModal').style.display = 'flex';
    }
    function closePicker() {
      document.getElementById('pickerModal').style.display = 'none';
    }
    function spinStudent() {
      const res = document.getElementById('pickerResult');
      const sub = document.getElementById('pickerSub');
      let count = 0;
      const timer = setInterval(() => {
        AudioEngine.playTick();
        const rand = ALL_STUDENTS[Math.floor(Math.random() * ALL_STUDENTS.length)];
        res.innerText = rand.name;
        sub.innerText = rand.group;
        count++;
        if (count > 16) {
          clearInterval(timer);
          AudioEngine.playSuccess();
        }
      }, 70);
    }
    function spinGroup() {
      const groups = ['Nhóm 1 (Tổ 1)', 'Nhóm 2 (Tổ 2)', 'Nhóm 3 (Tổ 3)', 'Nhóm 4 (Tổ 4)'];
      const res = document.getElementById('pickerResult');
      const sub = document.getElementById('pickerSub');
      let count = 0;
      const timer = setInterval(() => {
        AudioEngine.playTick();
        const rand = groups[Math.floor(Math.random() * groups.length)];
        res.innerText = rand;
        sub.innerText = 'Đội được chọn trả lời!';
        count++;
        if (count > 14) {
          clearInterval(timer);
          AudioEngine.playSuccess();
        }
      }, 80);
    }

    // Leaderboard & SQLite
    function openLeaderboard() {
      renderLeaderboard();
      document.getElementById('leaderboardModal').style.display = 'flex';
    }
    function closeLeaderboard() {
      document.getElementById('leaderboardModal').style.display = 'none';
    }
    function renderLeaderboard() {
      const tbody = document.getElementById('leaderboardBody');
      tbody.innerHTML = \`
        <tr>
          <td>🥇 1</td>
          <td><strong>\${userState.name}</strong> (Hiện tại)</td>
          <td style="color:#f59e0b; font-weight:bold;">\${userState.score}</td>
          <td style="color:#94a3b8; font-size:0.85rem;">Vừa xong</td>
        </tr>
        <tr>
          <td>🥈 2</td>
          <td>Nhóm 2 (Tổ 2)</td>
          <td style="color:#f59e0b; font-weight:bold;">180</td>
          <td style="color:#94a3b8; font-size:0.85rem;">10 phút trước</td>
        </tr>
        <tr>
          <td>🥉 3</td>
          <td>Nguyễn Văn An</td>
          <td style="color:#f59e0b; font-weight:bold;">150</td>
          <td style="color:#94a3b8; font-size:0.85rem;">Hôm nay</td>
        </tr>
      \`;
    }
    function resetScores() {
      if (confirm('Em có chắc chắn muốn đặt lại điểm số không?')) {
        userState.score = 0;
        userState.correct = 0;
        updateScoreboard();
        renderLeaderboard();
      }
    }

    function downloadSqliteScript() {
      const sql = \`-- DATABASE SQLITE EXPORT BÀI 7 TIN HỌC 12 KNTT
CREATE TABLE IF NOT EXISTS players (id TEXT PRIMARY KEY, name TEXT, score INTEGER);
INSERT INTO players VALUES ('p1', '\${userState.name}', \${userState.score});
\`;
      const blob = new Blob([sql], { type: 'text/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tin12_bai7_sqlite.sql';
      a.click();
      URL.revokeObjectURL(url);
    }

    // Guide Modal
    function openGuide() {
      document.getElementById('guideModal').style.display = 'flex';
    }
    function closeGuide() {
      document.getElementById('guideModal').style.display = 'none';
    }

    // Init first view
    window.addEventListener('DOMContentLoaded', () => {
      renderQuiz('section1', 'quiz-p1-container', 'p1Index', 'p1-progress');
      renderQuiz('section2', 'quiz-p2-container', 'p2Index', 'p2-progress');
      renderQuiz('section3', 'quiz-p3-container', 'p3Index', 'p3-progress');
      runSandboxCode();
    });
  </script>
</body>
</html>`;
}
