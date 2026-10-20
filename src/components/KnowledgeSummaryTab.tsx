import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  Layers, 
  Laptop, 
  Globe, 
  ArrowRight,
  Code2,
  Tag,
  GitFork,
  HelpCircle,
  Clock,
  Info
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { SectionId } from '../types/game';

interface KnowledgeSummaryTabProps {
  onNavigateSection: (section: SectionId) => void;
}

export const KnowledgeSummaryTab: React.FC<KnowledgeSummaryTabProps> = ({ onNavigateSection }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'part1' | 'part2' | 'part3' | 'tags' | 'rules'>('all');

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const tagTableData = [
    { tag: '<!DOCTYPE html>', type: 'Khai báo', place: 'Dòng đầu tiên', desc: 'Thông báo kiểu tệp html5 cho trình duyệt web. KHÔNG được xem là phần tử HTML.', example: '<!DOCTYPE html>' },
    { tag: '<html>', type: 'Thẻ đôi', place: 'Nút gốc (root)', desc: 'Phần tử bắt buộc và là phần tử gốc duy nhất, chứa tất cả các phần tử còn lại.', example: '<html> ... </html>' },
    { tag: '<head>', type: 'Thẻ đôi', place: 'Con của <html>', desc: 'Chứa các phần tử liên quan chung đến toàn bộ trang web (thông tin quản trị, tiêu đề tab, mã hoá).', example: '<head> ... </head>' },
    { tag: '<title>', type: 'Thẻ đôi', place: 'Trong <head>', desc: 'Tên trang web, xuất hiện trên thanh tab trình duyệt & kết quả tìm kiếm. Chỉ chứa văn bản thường, KHÔNG chứa thẻ con.', example: '<title>Tên trang</title>' },
    { tag: '<meta>', type: 'Thẻ đơn', place: 'Trong <head>', desc: 'Mô tả thông tin bổ sung. Ví dụ: <meta charset="utf-8"> khai báo bảng mã Unicode tiếng Việt.', example: '<meta charset="utf-8">' },
    { tag: '<style>', type: 'Thẻ đôi', place: 'Trong <head>', desc: 'Chứa các quy tắc định dạng kiểu dáng CSS cho trang web.', example: '<style>body { ... }</style>' },
    { tag: '<script>', type: 'Thẻ đôi', place: 'Trong <head>/<body>', desc: 'Chứa các mã kịch bản JavaScript để xử lý tương tác.', example: '<script> ... </script>' },
    { tag: '<body>', type: 'Thẻ đôi', place: 'Con của <html>', desc: 'Chứa toàn bộ thông tin nội dung của trang web hiển thị cho người xem (văn bản, ảnh, bảng...).', example: '<body> ... </body>' },
    { tag: '<h1> .. <h6>', type: 'Thẻ đôi', place: 'Trong <body>', desc: 'Nhóm thẻ tiêu đề văn bản theo thứ tự giảm cấp dần từ lớn nhất <h1> đến nhỏ nhất <h6>.', example: '<h1>Tiêu đề lớn</h1>' },
    { tag: '<p>', type: 'Thẻ đôi', place: 'Trong <body>', desc: 'Định dạng một đoạn văn bản hoàn chỉnh.', example: '<p>Nội dung đoạn văn</p>' },
    { tag: '<hr/>', type: 'Thẻ đơn', place: 'Trong <body>', desc: 'Tạo một dòng kẻ ngang phân cách nội dung trên trang.', example: '<hr/> hoặc <hr>' },
    { tag: '<br/>', type: 'Thẻ đơn', place: 'Trong <body>', desc: 'Ngắt xuống dòng trong đoạn văn bản.', example: 'Dòng 1<br/>Dòng 2' },
    { tag: '<em>', type: 'Thẻ đôi', place: 'Trong văn bản', desc: 'Định dạng chữ in nghiêng nhấn mạnh (thường lồng trong <p>).', example: '<em>in nghiêng</em>' },
    { tag: '<b>', type: 'Thẻ đôi', place: 'Trong văn bản', desc: 'Định dạng chữ in đậm.', example: '<b>in đậm</b>' },
    { tag: '<u>', type: 'Thẻ đôi', place: 'Trong văn bản', desc: 'Định dạng chữ gạch chân dưới.', example: '<u>gạch dưới</u>' },
    { tag: '<div>', type: 'Thẻ đôi', place: 'Trong <body>', desc: 'Khối phân chia bố cục chứa nhiều phần tử con bên trong.', example: '<div> ... </div>' },
    { tag: '<!-- -->', type: 'Đặc biệt', place: 'Mọi vị trí', desc: 'Dòng chú thích cho người lập trình, trình duyệt không hiển thị nội dung chú thích.', example: '<!-- Đây là chú thích -->' },
  ];

  const filteredTags = tagTableData.filter(item => {
    const q = searchTerm.toLowerCase();
    return item.tag.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.place.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-purple-900/60 border border-blue-500/30 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Tổng Hợp Toàn Bộ Kiến Thức Bài 7 (Tin Học 12 KNTT)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                  Chuẩn SGK Trang 39 - 45
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Tài liệu ôn tập toàn diện: Khái niệm HTML, Cấu trúc cây DOM, Quy tắc thẻ, Bảng tra cứu & Công cụ soạn thảo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 shadow transition-all"
              title="In bản tóm tắt hoặc lưu PDF ôn thi"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>In / Lưu PDF</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm kiến thức (doctype, title, utf-8, thẻ đơn, cây DOM...)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => { sounds.playClick(); setActiveFilter('all'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFilter === 'all' ? 'bg-blue-600 text-white shadow' : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveFilter('part1'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFilter === 'part1' ? 'bg-blue-600 text-white shadow' : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Trang Web & Thẻ
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveFilter('part2'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFilter === 'part2' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Cấu Trúc Cây DOM
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveFilter('part3'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFilter === 'part3' ? 'bg-purple-600 text-white shadow' : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Phần Mềm & Công Cụ
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveFilter('tags'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFilter === 'tags' ? 'bg-teal-600 text-white shadow' : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              Tra Cứu Thẻ
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveFilter('rules'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFilter === 'rules' ? 'bg-amber-600 text-white shadow' : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              Lưu Ý Quan Trọng
            </button>
          </div>
        </div>
      </div>

      {/* ================= PHẦN 1: TRANG WEB VÀ HTML ================= */}
      {(activeFilter === 'all' || activeFilter === 'part1') && (
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-sm">
                1
              </span>
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg">
                  1. Trang Web Và Ngôn Ngữ HTML (SGK Trang 39 - 41)
                </h3>
                <span className="text-xs text-slate-400">Khái niệm, định dạng tệp, thẻ đánh dấu, phần tử HTML và các quy tắc</span>
              </div>
            </div>
            <button
              onClick={() => { sounds.playClick(); onNavigateSection('section1'); }}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <span>Vào Chơi Game Phần 1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {/* Box 1: Khái niệm & Tệp */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-blue-400 text-sm flex items-center gap-1.5">
                <FileCode className="w-4 h-4" />
                a) Khái niệm HTML & Tệp trang web
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                <li>
                  <strong className="text-white">HTML là gì:</strong> Viết tắt của <em className="text-cyan-300">Hypertext Markup Language</em> (ngôn ngữ đánh dấu siêu văn bản). Là bộ quy tắc dùng để thiết lập cấu trúc và hiển thị nội dung trang web.
                </li>
                <li>
                  <strong className="text-white">Phần mở rộng tệp:</strong> Trang web được tạo từ các tệp văn bản thường có đuôi mở rộng là <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono">.html</code> hoặc <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono">.htm</code>.
                </li>
                <li>
                  <strong className="text-white">Trình duyệt web:</strong> Phần mềm dùng để đọc tệp mã nguồn HTML và hiển thị trang web trực quan cho người xem (Chrome, Cốc Cốc, Firefox...).
                </li>
              </ul>
            </div>

            {/* Box 2: Thẻ đánh dấu */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-cyan-400 text-sm flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                b) Thẻ đánh dấu HTML (HTML Tag)
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                <li>
                  <strong className="text-white">Cú pháp thẻ:</strong> Đặt trong cặp dấu đặc biệt <code className="text-cyan-300 font-bold">&lt;</code> và <code className="text-cyan-300 font-bold">&gt;</code>.
                </li>
                <li>
                  <strong className="text-white">Thẻ đôi (Cặp thẻ):</strong> Gồm thẻ bắt đầu <code className="font-mono text-cyan-300">&lt;tag&gt;</code> và thẻ kết thúc có thêm dấu gạch chéo <code className="font-mono text-cyan-300">&lt;/tag&gt;</code>. Ví dụ: <code className="font-mono text-emerald-400">&lt;p&gt; ... &lt;/p&gt;</code>.
                </li>
                <li>
                  <strong className="text-white">Thẻ đơn (Empty/Void tags):</strong> Chỉ có thẻ bắt đầu, không có thẻ kết thúc riêng, có dạng <code className="font-mono text-amber-300">&lt;tên thẻ&gt;</code> hoặc <code className="font-mono text-amber-300">&lt;tên thẻ/&gt;</code>. Ví dụ: <code className="font-mono text-amber-300">&lt;hr/&gt;</code> (dòng kẻ ngang), <code className="font-mono text-amber-300">&lt;br/&gt;</code> (ngắt dòng), <code className="font-mono text-amber-300">&lt;img&gt;</code>.
                </li>
              </ul>
            </div>

            {/* Box 3: Phần tử HTML */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                c) Phần tử HTML (HTML Element)
              </h4>
              <p className="text-slate-300">
                Là khái niệm cơ bản của trang html. Một phần tử thông thường được định nghĩa bởi:
              </p>
              <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs text-center border border-slate-800 text-slate-300">
                <span className="text-cyan-400">&lt;tên thẻ&gt;</span> <span className="text-amber-300 font-sans">nội dung của phần tử</span> <span className="text-cyan-400">&lt;/tên thẻ&gt;</span>
              </div>
              <p className="text-xs text-slate-400">
                <em>*Lưu ý:</em> Thẻ đơn cùng với nội dung của nó cũng được xem là phần tử HTML.
              </p>
            </div>

            {/* Box 4: Các quy tắc vàng SGK */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                d) Các quy tắc quan trọng cần ghi nhớ
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>
                  <strong className="text-white">Chữ hoa / chữ thường:</strong> Tên thẻ HTML không phân biệt hoa thường nhưng mặc định tên thẻ nên viết chữ thường.
                </li>
                <li>
                  <strong className="text-white">Lồng nhau (Nesting):</strong> Các thẻ có thể lồng nhau, ví dụ: <code className="font-mono text-cyan-300">&lt;p&gt;...&lt;em&gt;nhóm bạn bè&lt;/em&gt;...&lt;/p&gt;</code>.
                </li>
                <li>
                  <strong className="text-white">Dấu cách & Phím Enter:</strong> Trình duyệt không nhận biết nhiều dấu cách (nhiều dấu cách = 1) và không nhận biết phím Enter xuống dòng. Cần dùng thẻ <code className="font-mono text-amber-300">&lt;br/&gt;</code> hoặc thẻ <code className="font-mono text-cyan-300">&lt;p&gt;</code>.
                </li>
                <li>
                  <strong className="text-rose-400 font-bold">LƯU Ý CỐT LÕI:</strong> Dòng <code className="font-mono text-rose-300">&lt;!DOCTYPE html&gt;</code> ở đầu tệp chỉ thông báo kiểu tệp html5 cho trình duyệt và <strong>KHÔNG ĐƯỢC XEM LÀ PHẦN TỬ HTML</strong>.
                </li>
                <li>
                  <strong className="text-purple-400">Dòng chú thích:</strong> Cú pháp <code className="font-mono text-purple-300">&lt;!-- đây là dòng chú thích --&gt;</code>.
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ================= PHẦN 2: CẤU TRÚC CƠ BẢN CỦA MỘT TỆP HTML ================= */}
      {(activeFilter === 'all' || activeFilter === 'part2') && (
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm">
                2
              </span>
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg">
                  2. Cấu Trúc Cơ Bản Của Một Tệp HTML (SGK Trang 41 - 43)
                </h3>
                <span className="text-xs text-slate-400">Phần tử gốc, 2 nhánh con, cây thông tin DOM và mối quan hệ cha - con</span>
              </div>
            </div>
            <button
              onClick={() => { sounds.playClick(); onNavigateSection('section2'); }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <span>Vào Chơi Game Phần 2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            {/* Branch Root & Head */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                1. Phần tử gốc &lt;html&gt;
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                <li>Là phần tử <strong>bắt buộc</strong> và là <strong>phần tử gốc (root) duy nhất</strong> của toàn trang.</li>
                <li>Chứa tất cả các phần tử HTML còn lại của trang web.</li>
                <li>Thường chứa đúng 2 phần tử con trực tiếp là <code className="font-mono text-cyan-300">&lt;head&gt;</code> và <code className="font-mono text-cyan-300">&lt;body&gt;</code>.</li>
              </ul>
            </div>

            {/* Branch Head */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-blue-400 text-sm flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                2. Nhánh thông tin &lt;head&gt;
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                <li>Chứa các phần tử có liên quan chung đến toàn bộ trang web (thông tin ẩn/quản trị).</li>
                <li>
                  <strong className="text-white">&lt;title&gt;:</strong> Tên trang web hiển thị trên thanh tab trình duyệt & kết quả tìm kiếm. <em>*Phải là văn bản thường, KHÔNG được chứa thẻ con.</em>
                </li>
                <li>
                  <strong className="text-white">&lt;meta charset="utf-8"&gt;:</strong> Mô tả cách mã hóa ký tự theo chuẩn Unicode UTF-8 (hiển thị tiếng Việt không lỗi font).
                </li>
                <li>Có thể chứa thêm thẻ <code className="font-mono text-purple-300">&lt;style&gt;</code> (CSS) và <code className="font-mono text-purple-300">&lt;script&gt;</code> (JS).</li>
              </ul>
            </div>

            {/* Branch Body */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-indigo-400 text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                3. Nhánh nội dung &lt;body&gt;
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                <li>Chứa tất cả các phần tử thông tin của trang web hiển thị trực tiếp cho người xem.</li>
                <li>
                  <strong className="text-white">Thẻ tiêu đề:</strong> Theo thứ tự giảm cấp dần là <code className="font-mono text-cyan-300">&lt;h1&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;h4&gt;, &lt;h5&gt;, &lt;h6&gt;</code>.
                </li>
                <li>
                  <strong className="text-white">Thẻ đoạn văn:</strong> <code className="font-mono text-cyan-300">&lt;p&gt;</code> mô tả một đoạn văn bản hoàn chỉnh.
                </li>
                <li>Các thẻ phân khối, đường kẻ, hình ảnh: <code className="font-mono text-amber-300">&lt;div&gt;, &lt;hr/&gt;, &lt;img&gt;</code>.</li>
              </ul>
            </div>
          </div>

          {/* Sơ đồ Cây Thông Tin DOM trực quan */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
              <GitFork className="w-4 h-4" />
              Sơ Đồ Cây Thông Tin HTML (Mô phỏng Hình 7.3 & Hình 7.4 SGK Trang 42)
            </h4>
            <div className="p-3.5 bg-slate-900 rounded-xl font-mono text-xs sm:text-sm text-slate-300 leading-relaxed border border-slate-800 overflow-x-auto">
              <div><span className="text-slate-500">&lt;!DOCTYPE html&gt;</span> <span className="text-slate-500 font-sans">(Khai báo kiểu tệp html5 cho trình duyệt, KHÔNG là phần tử)</span></div>
              <div className="text-amber-400 font-bold">└── &lt;html&gt; (Nút GỐC - root duy nhất của trang)</div>
              <div className="text-blue-400 ml-6">├── &lt;head&gt; (Nhánh thông tin chung của trang web)</div>
              <div className="text-cyan-300 ml-12">│   ├── &lt;meta charset="utf-8"&gt; (Mã hoá Unicode tiếng Việt)</div>
              <div className="text-cyan-300 ml-12">│   └── &lt;title&gt;Tên trang Web&lt;/title&gt; (Chỉ chứa văn bản thường)</div>
              <div className="text-emerald-400 ml-6">└── &lt;body&gt; (Nhánh thông tin hiển thị cho người xem)</div>
              <div className="text-teal-300 ml-12">    ├── &lt;h1&gt;Trang Web và HTML&lt;/h1&gt; (Tiêu đề cấp 1)</div>
              <div className="text-teal-300 ml-12">    ├── &lt;p&gt;Đoạn văn đầu tiên&lt;/p&gt;</div>
              <div className="text-teal-300 ml-12">    ├── &lt;hr/&gt; (Đường kẻ ngang)</div>
              <div className="text-teal-300 ml-12">    └── &lt;p&gt;Trang lập bởi &lt;em&gt;nhóm bạn bè&lt;/em&gt;&lt;/p&gt; <span className="text-slate-500 font-sans">(Thẻ lồng nhau: &lt;em&gt; con của &lt;p&gt;)</span></div>
            </div>

            {/* Bài tập SGK Trang 43 */}
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
              <strong className="text-teal-300">Phân tích bài tập SGK trang 43:</strong>
              <div>
                Đoạn văn: <code className="text-cyan-300 font-mono">&lt;p&gt;Thông tin này in &lt;b&gt;đậm&lt;/b&gt;, in &lt;i&gt;nghiêng&lt;/i&gt; in &lt;u&gt;gạch dưới&lt;/u&gt;, in bình thường.&lt;/p&gt;</code>
              </div>
              <div className="text-slate-400">
                ➜ <strong>Thẻ cha:</strong> <code className="text-amber-300 font-mono">&lt;p&gt;</code>. <strong>3 Thẻ con trực tiếp:</strong> <code className="text-cyan-300 font-mono">&lt;b&gt;</code> (in đậm), <code className="text-cyan-300 font-mono">&lt;i&gt;</code> (in nghiêng), <code className="text-cyan-300 font-mono">&lt;u&gt;</code> (gạch chân).
              </div>
              <div className="text-amber-400 font-semibold">
                ➜ Câu hỏi: Cây HTML có bao nhiêu phần tử gốc? Đáp án: <u>Duy nhất 1 phần tử gốc</u> chính là phần tử <code className="font-mono">&lt;html&gt;</code>!
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= PHẦN 3: PHẦN MỀM SOẠN THẢO HTML ================= */}
      {(activeFilter === 'all' || activeFilter === 'part3') && (
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-sm">
                3
              </span>
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg">
                  3. Phần Mềm Soạn Thảo HTML (SGK Trang 43 - 45)
                </h3>
                <span className="text-xs text-slate-400">Notepad, Notepad++, Sublime Text, soạn thảo trực tuyến & trình duyệt web</span>
              </div>
            </div>
            <button
              onClick={() => { sounds.playClick(); onNavigateSection('section3'); }}
              className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <span>Vào Chơi Game Phần 3</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Tool Groups */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
            {/* Group 1 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                <Laptop className="w-4 h-4" />
                a) Soạn Thảo Đơn Giản
              </div>
              <ul className="space-y-1 text-slate-300 text-xs">
                <li><strong className="text-white">Notepad:</strong> Có sẵn trên hệ điều hành Windows, soạn thảo văn bản đơn giản không định dạng.</li>
                <li><strong className="text-white">TextEdit:</strong> Ứng dụng tương tự trên hệ điều hành macOS.</li>
              </ul>
            </div>

            {/* Group 2 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-indigo-300 text-sm flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                b) Soạn Thảo Chuyên Nghiệp
              </div>
              <ul className="space-y-1.5 text-slate-300 text-xs">
                <li>
                  <strong className="text-cyan-300">Notepad++:</strong> Đa năng, miễn phí, mã nguồn mở. Lệnh chọn HTML: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300 font-mono">Language -&gt; H -&gt; HTML</code>.
                </li>
                <li>
                  <strong className="text-cyan-300">Sublime Text:</strong> Soạn thảo đa ngôn ngữ, có bản miễn phí. Lệnh chọn HTML: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300 font-mono">View -&gt; Syntax -&gt; HTML</code>.
                </li>
              </ul>
            </div>

            {/* Group 3 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-teal-300 text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                c) Soạn Thảo Trực Tuyến
              </div>
              <ul className="space-y-1 text-slate-300 text-xs">
                <li>Yêu cầu máy tính kết nối Internet.</li>
                <li>Giao diện 2 khung song song (Hình 7.6 SGK): Khung trái soạn mã, nháy nút <strong>Run</strong> để kiểm tra kết quả ngay ở khung phải.</li>
                <li>Các trang phổ biến: <span className="text-cyan-300">w3schools.com</span>, <span className="text-cyan-300">tutorialspoint.com</span>...</li>
              </ul>
            </div>

            {/* Group 4 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-rose-300 text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                d) Trình Duyệt Web (Browser)
              </div>
              <ul className="space-y-1 text-slate-300 text-xs">
                <li><strong className="text-white">Chức năng:</strong> Đọc mã nguồn HTML và hiển thị trang web (KHÔNG dùng để soạn thảo mã).</li>
                <li><strong className="text-white">Ví dụ:</strong> Google Chrome, Cốc Cốc, Mozilla Firefox, Microsoft Edge, Opera...</li>
              </ul>
            </div>
          </div>

          {/* Lịch sử HTML (Trang 45) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs sm:text-sm">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Lịch Sử Phát Triển HTML (SGK Trang 45)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-cyan-400">Năm 1990 (CERN)</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Nhà vật lí <strong>Tim Berners-Lee</strong> đưa ra ý tưởng và các chuẩn HTML đầu tiên tại Trung tâm Vật lí Hạt nhân CERN.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-indigo-400">Cuối năm 1991</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Phiên bản đầu tiên của HTML ra đời mang tên <strong>"Các thẻ HTML"</strong> do chính Tim Berners-Lee biên soạn.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-emerald-400">Năm 2014 (HTML5)</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Phiên bản tiêu chuẩn hiện tại là <strong>HTML5</strong> chính thức ra đời năm 2014 với nhiều cải tiến mạnh mẽ.
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= BẢNG TRA CỨU NHANH CÁC THẺ HTML TRONG BÀI 7 ================= */}
      {(activeFilter === 'all' || activeFilter === 'tags') && (
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
                <Tag className="w-5 h-5 text-teal-400" />
                Bảng Tra Cứu Toàn Bộ Thẻ HTML Trong Bài 7 (17 Thẻ & Khai Báo)
              </h3>
              <p className="text-xs text-slate-400">
                Tổng hợp đầy đủ tên thẻ, loại thẻ, ý nghĩa, vị trí chuẩn và cú pháp mẫu
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              {filteredTags.length} / {tagTableData.length} Thẻ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] tracking-wider">
                  <th className="py-2.5 px-3">Tên Thẻ</th>
                  <th className="py-2.5 px-3">Phân Loại</th>
                  <th className="py-2.5 px-3">Vị Trí Chuẩn</th>
                  <th className="py-2.5 px-3">Ý Nghĩa Theo SGK</th>
                  <th className="py-2.5 px-3">Ví Dụ Cú Pháp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTags.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">
                      {item.tag}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.type === 'Thẻ đơn'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          : item.type === 'Thẻ đôi'
                          ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                          : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-xs">{item.place}</td>
                    <td className="py-2.5 px-3 text-slate-200">{item.desc}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400 text-xs">{item.example}</td>
                  </tr>
                ))}
                {filteredTags.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      Không tìm thấy thẻ phù hợp với từ khóa "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= BẢNG LƯU Ý QUAN TRỌNG ĐỂ KHÔNG BỊ TRỪ ĐIỂM ================= */}
      {(activeFilter === 'all' || activeFilter === 'rules') && (
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
          <h3 className="font-extrabold text-amber-400 text-base sm:text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Các "Bẫy" Trắc Nghiệm Cần Lưu Ý Trong Bài 7 (Dễ Nhầm Lẫn)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm pt-1">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-rose-400 font-bold">1. &lt;!DOCTYPE html&gt; CÓ PHẢI LÀ PHẦN TỬ HTML KHÔNG?</strong>
              <p className="text-slate-300">
                <strong>KHÔNG!</strong> Dòng này chỉ có vai trò thông báo kiểu tệp là html cho trình duyệt web và <em>không được xem là phần tử HTML</em>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-rose-400 font-bold">2. THẺ &lt;title&gt; CÓ ĐƯỢC CHỨA CÁC THẺ CON KHÔNG?</strong>
              <p className="text-slate-300">
                <strong>KHÔNG!</strong> Phần tử &lt;title&gt; bắt buộc phải là văn bản thường (plain text) và <em>không được phép chứa các phần tử con</em>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-rose-400 font-bold">3. CÂY THÔNG TIN HTML CÓ BAO NHIÊU PHẦN TỬ GỐC?</strong>
              <p className="text-slate-300">
                <strong>DUY NHẤT 1!</strong> Phần tử gốc duy nhất chính là &lt;html&gt;. Hai phần tử &lt;head&gt; và &lt;body&gt; là nút con của &lt;html&gt;.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-rose-400 font-bold">4. TRÌNH DUYỆT WEB CÓ DÙNG ĐỂ SOẠN THẢO MÃ HTML ĐƯỢC KHÔNG?</strong>
              <p className="text-slate-300">
                <strong>KHÔNG!</strong> Trình duyệt web (Chrome, Cốc Cốc, Edge...) chỉ dùng để đọc và hiển thị nội dung trang. Muốn soạn mã nguồn phải dùng Notepad, Notepad++, Sublime Text...
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
