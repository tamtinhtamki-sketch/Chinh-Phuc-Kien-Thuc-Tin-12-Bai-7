import React from 'react';
import { X, BookOpen, Clock, Users, CheckCircle2, Lightbulb, Sparkles, Download } from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportSingleHtml: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({
  isOpen,
  onClose,
  onExportSingleHtml
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Sổ Tay Giáo Viên: Kế Hoạch Bài Dạy & Kịch Bản Tổ Chức
              </h3>
              <p className="text-xs text-slate-400">
                Bài 7: HTML và Cấu Trúc Trang Web (Chủ đề 4 - Tin học 12 KNTT)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed flex-1">
          {/* Section 1: Objectives */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2 text-blue-400">
              <CheckCircle2 className="w-5 h-5" />
              1. Mục Tiêu Cần Đạt Sau Tiết Học (Chuẩn SGK Trang 39)
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              <li><strong>Kiến thức:</strong> Hiểu và giải thích được cấu trúc của một trang web dưới dạng HTML. Phân biệt được thẻ HTML (tag) và phần tử HTML (element). Biết ý nghĩa các thẻ thông dụng (&lt;p&gt;, &lt;h1..h6&gt;, &lt;hr/&gt;, &lt;br/&gt;).</li>
              <li><strong>Kỹ năng:</strong> Nhận diện cấu trúc cơ bản tệp HTML (phần tử gốc &lt;html&gt;, hai nhánh con trực tiếp &lt;head&gt; và &lt;body&gt;). Vẽ và đọc được sơ đồ cây thông tin (DOM Tree). Phân biệt được phần mềm soạn thảo HTML (Notepad, Notepad++, Sublime Text) với các trình duyệt web.</li>
              <li><strong>Thái độ:</strong> Hứng thú tìm hiểu lập trình web, rèn luyện tư duy phân cấp thông tin có cấu trúc khoa học.</li>
            </ul>
          </div>

          {/* Section 2: Detailed 45-min Classroom Script */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2 text-amber-400">
              <Clock className="w-5 h-5" />
              2. Kịch Bản Tổ Chức Trò Chơi Trong 45 Phút (Máy Chiếu / TV)
            </h4>

            {/* Step 1 */}
            <div className="border-l-2 border-blue-500 pl-3 space-y-1">
              <div className="font-bold text-blue-300 text-sm">
                Bước 1: Khởi động & Khám phá Phần 1 (12 phút)
              </div>
              <p>
                - Giáo viên mở <strong>"1. Trang Web & HTML"</strong>. Sử dụng công cụ <em>"Bốc Thăm Ngẫu Nhiên"</em> để gọi 2-3 học sinh trả lời các câu hỏi: HTML là gì? tệp mở rộng .html/.htm.
              </p>
              <p>
                - Cho cả lớp tham gia chế độ <em>"Thám Tử Phân Loại Thẻ"</em> và <em>"Bác Sĩ Cú Pháp"</em> để nhấn mạnh: &lt;!DOCTYPE html&gt; không phải là phần tử HTML; thẻ đơn &lt;hr/&gt;, &lt;br/&gt; không có thẻ đóng riêng; quy tắc không tự nhận Enter và dấu cách trong HTML.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border-l-2 border-emerald-500 pl-3 space-y-1">
              <div className="font-bold text-emerald-300 text-sm">
                Bước 2: Khám phá Phần 2 & Ghép Cây Thông Tin HTML (15 phút)
              </div>
              <p>
                - Chiếu màn hình <strong>"2. Cấu Trúc Cơ Bản"</strong>. Giáo viên chia lớp thành 4 Tổ (Nhóm 1 đến Nhóm 4) và mở tính năng <em>"Bảng Tổng Sắp Thi Đấu Nhóm"</em>.
              </p>
              <p>
                - Đại diện các nhóm lần lượt lên bảng hoàn thành trò chơi <em>"Kiến Trúc Sư Cây HTML"</em>: Xác định phần tử gốc &lt;html&gt; (duy nhất 1 gốc), nhánh thông tin quản trị &lt;head&gt; (title, meta charset utf-8) và nhánh nội dung hiển thị &lt;body&gt;.
              </p>
              <p>
                - Cả lớp cùng giải bài tập vẽ cây SGK trang 43 (phần tử cha &lt;p&gt; chứa 3 phần tử con &lt;b&gt;, &lt;i&gt;, &lt;u&gt;). Nhóm giải nhanh và đúng nhất được cộng +20 điểm thi đua!
              </p>
            </div>

            {/* Step 3 */}
            <div className="border-l-2 border-purple-500 pl-3 space-y-1">
              <div className="font-bold text-purple-300 text-sm">
                Bước 3: Khám phá Phần 3 & Phòng Thí Nghiệm Soạn Thảo (13 phút)
              </div>
              <p>
                - Mở màn <strong>"3. Phần Mềm Soạn Thảo"</strong>. Học sinh chơi trò chơi <em>"Phân Loại Thần Tốc"</em> để giải bài tập 1 SGK trang 44: Phân biệt rõ Notepad, Notepad++, Sublime Text (soạn mã) với Chrome, Cốc Cốc, Firefox, Edge, Opera (trình duyệt).
              </p>
              <p>
                - Bật <em>"Live HTML Playground (Hình 7.6 SGK)"</em>: Giáo viên hoặc học sinh gõ trực tiếp các thẻ &lt;h1&gt;, &lt;p&gt;, &lt;hr/&gt; và bấm <strong>Run</strong> để tận mắt quan sát kết quả hiển thị trên trình duyệt.
              </p>
            </div>

            {/* Step 4 */}
            <div className="border-l-2 border-amber-500 pl-3 space-y-1">
              <div className="font-bold text-amber-300 text-sm">
                Bước 4: Tổng kết, Trao Giải & Xuất Bảng Điểm (5 phút)
              </div>
              <p>
                - Mở <strong>"Bảng Điểm & CSDL SQLite"</strong> để tuyên dương nhóm đạt điểm cao nhất tiết học.
              </p>
              <p>
                - Bấm nút <em>"Xuất CSV (Excel)"</em> hoặc <em>"Xuất SQLite (.sql)"</em> để lưu điểm số vào hồ sơ đánh giá của giáo viên.
              </p>
            </div>
          </div>

          {/* Section 3: Technical Deployment Guide */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2 text-cyan-400">
              <Lightbulb className="w-5 h-5" />
              3. Hướng Dẫn Sử Dụng Offline (Không Cần Internet)
            </h4>
            <p className="text-slate-300">
              Ứng dụng có chức năng <strong>"Xuất File HTML Đơn Nhất"</strong>. Thầy cô chỉ cần tải file <code>.html</code> về máy tính hoặc chép vào USB, sau đó nhấp đúp để mở trên bất kỳ trình duyệt nào (Chrome, Cốc Cốc, Edge). Ứng dụng tích hợp trọn vẹn HTML, CSS, Javascript và bộ tạo âm thanh bằng Web Audio API, hoàn toàn không phụ thuộc mạng hay tài nguyên ngoài!
            </p>
            <div className="pt-2">
              <button
                onClick={onExportSingleHtml}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Tải về File HTML Đơn Nhất Ngay (.html)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
