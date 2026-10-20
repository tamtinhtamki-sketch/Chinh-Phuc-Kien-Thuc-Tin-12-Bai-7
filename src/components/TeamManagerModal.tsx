import React from 'react';
import { X, Users, Plus, Minus, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { TeamScore } from '../types/game';
import { sounds } from '../utils/sound';

interface TeamManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: TeamScore[];
  onAdjustScore: (teamId: string, delta: number, reason: string) => void;
  onResetTeams: () => void;
}

export const TeamManagerModal: React.FC<TeamManagerModalProps> = ({
  isOpen,
  onClose,
  teams,
  onAdjustScore,
  onResetTeams
}) => {
  if (!isOpen) return null;

  // Find leading team
  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const leadingTeamId = sorted[0]?.score > 0 ? sorted[0].id : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Bảng Tổng Sắp Thi Đấu Nhóm (4 Tổ Lớp Học)
              </h3>
              <p className="text-xs text-slate-400">
                Hiển thị trực quan trên máy chiếu, cộng điểm thi đua tức thì khi học sinh trả lời
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
        <div className="p-5 sm:p-6 space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {teams.map((team) => {
              const isLeader = team.id === leadingTeamId;
              return (
                <div
                  key={team.id}
                  className={`p-4 rounded-xl border relative transition-all ${
                    isLeader
                      ? 'bg-slate-950 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  {isLeader && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-[11px] font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                      <Trophy className="w-3 h-3" />
                      Dẫn đầu
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${team.color}`} />
                    <h4 className="font-bold text-white text-base">{team.name}</h4>
                  </div>

                  <div className="text-3xl font-black text-amber-400 my-2">
                    {team.score} <span className="text-xs font-normal text-slate-400">Điểm</span>
                  </div>

                  <div className="text-[11px] text-slate-400 mb-3 line-clamp-1">
                    Thành viên: {team.members.join(', ')}
                  </div>

                  {/* Quick scoring buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        sounds.playCorrect();
                        onAdjustScore(team.id, 10, 'Phát biểu đúng câu hỏi');
                      }}
                      className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => {
                        sounds.playCorrect();
                        onAdjustScore(team.id, 20, 'Hoàn thành xuất sắc nhiệm vụ');
                      }}
                      className="flex-1 py-1 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                    >
                      +20
                    </button>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onAdjustScore(team.id, -5, 'Trừ điểm vi phạm');
                      }}
                      className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs"
                      title="Trừ 5 điểm"
                    >
                      -5
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950">
          <button
            onClick={() => {
              if (confirm('Em có chắc chắn muốn đặt lại điểm số của tất cả các nhóm về 0 không?')) {
                sounds.playClick();
                onResetTeams();
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Đặt lại điểm các nhóm
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
