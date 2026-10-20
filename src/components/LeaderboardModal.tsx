import React, { useState } from 'react';
import { X, Trophy, Database, Download, Trash2, Users, User, Medal } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';
import { DatabaseManager } from '../utils/dbManager';
import { sounds } from '../utils/sound';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  onClear: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  onClear
}) => {
  const [activeTab, setActiveTab] = useState<'individual' | 'team' | 'sqlite'>('individual');

  if (!isOpen) return null;

  const individualEntries = entries.filter(e => e.playerType === 'student');
  const teamEntries = entries.filter(e => e.playerType === 'team');

  const handleExportSqlite = () => {
    sounds.playClick();
    const sql = DatabaseManager.generateSQLiteExport();
    const blob = new Blob([sql], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tin12_bai7_sqlite_database_${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    sounds.playClick();
    let csv = 'Xep_hang,Ten_nguoi_choi,Loai,Nhom,Phan_choi,Diem,So_cau_dung,Tong_so_cau,Thoi_gian_giay,Ngay_choi\n';
    entries.forEach((e, idx) => {
      csv += `${idx + 1},"${e.playerName}","${e.playerType}","${e.teamName || ''}","${e.section}",${e.score},${e.correctCount},${e.totalQuestions},${e.timeSpentSec},"${e.playedAt}"\n`;
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bang_diem_tin12_bai7_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Bảng Điểm & Quản Trị CSDL SQLite
              </h3>
              <p className="text-xs text-slate-400">
                Lưu trữ thành tích, xếp hạng người chơi & kết xuất tệp cơ sở dữ liệu quan hệ
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

        {/* Tab Selector */}
        <div className="px-5 pt-3 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex gap-2 text-xs font-semibold">
            <button
              onClick={() => { sounds.playClick(); setActiveTab('individual'); }}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'individual'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Cá Nhân ({individualEntries.length})
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTab('team'); }}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'team'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Thi Đấu Nhóm ({teamEntries.length})
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTab('sqlite'); }}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'sqlite'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Cấu Trúc SQLite & Xuất File
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleExportCsv}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Xuất CSV (Excel)
            </button>
            <button
              onClick={handleExportSqlite}
              className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" />
              Xuất SQLite (.sql)
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab !== 'sqlite' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Hạng</th>
                    <th className="py-2.5 px-3">Người Chơi / Nhóm</th>
                    <th className="py-2.5 px-3">Phần Bài Học</th>
                    <th className="py-2.5 px-3 text-right">Điểm Số</th>
                    <th className="py-2.5 px-3 text-right">Đúng</th>
                    <th className="py-2.5 px-3 text-right">Thời Gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {(activeTab === 'individual' ? individualEntries : teamEntries).map((item, index) => {
                    let rankBadge = <span className="text-slate-400">#{index + 1}</span>;
                    if (index === 0) rankBadge = <span className="text-amber-400 font-bold text-base">🥇 1</span>;
                    if (index === 1) rankBadge = <span className="text-slate-300 font-bold text-base">🥈 2</span>;
                    if (index === 2) rankBadge = <span className="text-amber-600 font-bold text-base">🥉 3</span>;

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3">{rankBadge}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{item.playerName}</div>
                          {item.teamName && (
                            <div className="text-[10px] text-slate-400">{item.teamName}</div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-300">{item.section}</td>
                        <td className="py-3 px-3 text-right font-bold text-amber-400 text-sm">
                          {item.score}
                        </td>
                        <td className="py-3 px-3 text-right text-emerald-400">
                          {item.correctCount}/{item.totalQuestions}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-400 text-xs">
                          {item.playedAt}
                        </td>
                      </tr>
                    );
                  })}
                  {(activeTab === 'individual' ? individualEntries : teamEntries).length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        Chưa có lượt chơi nào được ghi nhận. Hãy bắt đầu chinh phục các câu hỏi!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* SQLite Architecture view */
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Sơ Đồ 4 Bảng Quan Hệ Trong Cơ Sở Dữ Liệu SQLite:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300 pt-1">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-amber-400">TABLE questions</strong>
                    <div>(id, section, title, question, options_json, correct_answer_index, explanation, points)</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-emerald-400">TABLE leaderboard</strong>
                    <div>(id, player_name, player_type, team_name, section, score, correct_count, time_spent_sec, played_at)</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-indigo-400">TABLE teams</strong>
                    <div>(id, name, color, score)</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <strong className="text-purple-400">TABLE students</strong>
                    <div>(id, name, group_name, score)</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-[220px]">
                <pre>{DatabaseManager.generateSQLiteExport()}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950">
          <button
            onClick={() => {
              if (confirm('Em có chắc chắn muốn xóa toàn bộ lịch sử điểm số không?')) {
                onClear();
                sounds.playClick();
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Xóa dữ liệu điểm số
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
