import React from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Dices, 
  Trophy, 
  Users, 
  BookOpen, 
  Edit3, 
  Download,
  Code2
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { SectionId, GameMode } from '../types/game';

interface HeaderProps {
  activeSection: SectionId;
  setActiveSection: (sec: SectionId) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenPicker: () => void;
  onOpenLeaderboard: () => void;
  onOpenTeamManager: () => void;
  onOpenGuide: () => void;
  onOpenQuestionBank: () => void;
  onExportSingleHtml: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  gameMode,
  setGameMode,
  soundEnabled,
  setSoundEnabled,
  onOpenPicker,
  onOpenLeaderboard,
  onOpenTeamManager,
  onOpenGuide,
  onOpenQuestionBank,
  onExportSingleHtml,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
    if (next) sounds.playClick();
  };

  const navItems = [
    { id: 'summary', label: '📖 Tổng Hợp Toàn Bộ Kiến Thức', sub: 'Tóm tắt chuẩn SGK Tr.39-45' },
    { id: 'section1', label: '1. Trang Web & HTML', sub: 'Thẻ & Phần tử HTML' },
    { id: 'section2', label: '2. Cấu Trúc Cơ Bản', sub: 'Cây Thông Tin DOM' },
    { id: 'section3', label: '3. Phần Mềm Soạn Thảo', sub: 'Công Cụ & Thực Hành Live' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-extrabold text-xl tracking-tight">
            &lt;/&gt;
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-white bg-clip-text text-transparent">
                Đấu Trí Tin Học 12: HTML & Cấu Trúc Trang Web
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Bài 7 KNTT
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Ứng dụng trò chơi học tập tương tác - Sách giáo khoa Tin học 12 (Trang 39 - 45)
            </p>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {/* Game Mode switch */}
          <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex items-center text-xs">
            <button
              onClick={() => { sounds.playClick(); setGameMode('individual'); }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                gameMode === 'individual' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cá nhân
            </button>
            <button
              onClick={() => { sounds.playClick(); setGameMode('team'); }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                gameMode === 'team' 
                  ? 'bg-indigo-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Đấu Nhóm
            </button>
          </div>

          {/* Random Picker */}
          <button
            onClick={() => { sounds.playClick(); onOpenPicker(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-semibold transition-all"
            title="Bốc thăm ngẫu nhiên học sinh hoặc nhóm trả lời"
          >
            <Dices className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="hidden md:inline">Bốc Thăm</span>
          </button>

          {/* Teams Manager */}
          <button
            onClick={() => { sounds.playClick(); onOpenTeamManager(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs sm:text-sm font-semibold transition-all"
            title="Xem và quản lý điểm số 4 Nhóm thi đua"
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Điểm Nhóm</span>
          </button>

          {/* Leaderboard SQLite */}
          <button
            onClick={() => { sounds.playClick(); onOpenLeaderboard(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-semibold transition-all"
            title="Bảng xếp hạng & Cơ sở dữ liệu SQLite"
          >
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Bảng Điểm</span>
          </button>

          {/* Questions Bank */}
          <button
            onClick={() => { sounds.playClick(); onOpenQuestionBank(); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs sm:text-sm font-semibold transition-all"
            title="Ngân hàng câu hỏi (Xem & Chỉnh sửa)"
          >
            <Edit3 className="w-4 h-4 text-cyan-400" />
            <span className="hidden lg:inline">Sửa Câu Hỏi</span>
          </button>

          {/* Teacher Guide */}
          <button
            onClick={() => { sounds.playClick(); onOpenGuide(); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs sm:text-sm font-semibold transition-all"
            title="Hướng dẫn giáo viên & Kịch bản sư phạm"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="hidden lg:inline">Giáo Án</span>
          </button>

          {/* Export Single-file HTML */}
          <button
            onClick={() => { sounds.playClick(); onExportSingleHtml(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
            title="Tải về file HTML đơn nhất (chạy offline trên máy chiếu, không cần internet)"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Xuất File HTML</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-400" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs for the 3 Textbook Sections */}
      <nav className="bg-slate-950/80 border-t border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar gap-1 sm:gap-3 py-1.5">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveSection(item.id);
                }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Code2 className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <div className="text-left">
                  <div>{item.label}</div>
                  <div className="text-[10px] font-normal text-slate-500 hidden sm:block">
                    {item.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
