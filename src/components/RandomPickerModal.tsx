import React, { useState } from 'react';
import { X, Dices, Users, Sparkles, UserCheck, Plus, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { Student } from '../types/game';

interface RandomPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onSaveStudents: (newStudents: Student[]) => void;
  onSelectTarget: (name: string, isGroup: boolean) => void;
}

export const RandomPickerModal: React.FC<RandomPickerModalProps> = ({
  isOpen,
  onClose,
  students,
  onSaveStudents,
  onSelectTarget
}) => {
  const [pickMode, setPickMode] = useState<'student' | 'group'>('student');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedResult, setSelectedResult] = useState<{ name: string; subtitle: string } | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [bulkText, setBulkText] = useState('');

  if (!isOpen) return null;

  const groups = [
    { name: 'Nhóm 1 (Tổ 1)', desc: 'Các thành viên Tổ 1' },
    { name: 'Nhóm 2 (Tổ 2)', desc: 'Các thành viên Tổ 2' },
    { name: 'Nhóm 3 (Tổ 3)', desc: 'Các thành viên Tổ 3' },
    { name: 'Nhóm 4 (Tổ 4)', desc: 'Các thành viên Tổ 4' },
  ];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedResult(null);

    let counter = 0;
    const totalTicks = 22;

    const interval = setInterval(() => {
      sounds.playSpinTick();
      if (pickMode === 'student') {
        const rand = students[Math.floor(Math.random() * students.length)];
        setSelectedResult({ name: rand.name, subtitle: rand.group });
      } else {
        const rand = groups[Math.floor(Math.random() * groups.length)];
        setSelectedResult({ name: rand.name, subtitle: 'Đội được chọn giành quyền trả lời!' });
      }
      counter++;

      if (counter >= totalTicks) {
        clearInterval(interval);
        setIsSpinning(false);
        sounds.playFanfare();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 80);
  };

  const handleApplyResult = () => {
    if (selectedResult) {
      onSelectTarget(selectedResult.name, pickMode === 'group');
      onClose();
    }
  };

  const handleSaveBulk = () => {
    const lines = bulkText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return;

    const newStudents: Student[] = lines.map((line, idx) => {
      const parts = line.split('-').map(p => p.trim());
      const name = parts[0];
      const group = parts[1] || `Nhóm ${(idx % 4) + 1} (Tổ ${(idx % 4) + 1})`;
      return {
        id: `hs_${Date.now()}_${idx}`,
        name,
        group,
        score: 0
      };
    });

    onSaveStudents(newStudents);
    setShowEditor(false);
    sounds.playCorrect();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Dices className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Vòng Quay Gọi Học Sinh / Nhóm Ngẫu Nhiên
              </h3>
              <p className="text-xs text-slate-400">
                Lựa chọn công bằng, tạo không khí hào hứng trong lớp học
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
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => { sounds.playClick(); setPickMode('student'); }}
              className={`flex-1 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                pickMode === 'student'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Bốc Thăm Cá Nhân ({students.length} Học sinh)
            </button>
            <button
              onClick={() => { sounds.playClick(); setPickMode('group'); }}
              className={`flex-1 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                pickMode === 'group'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Bốc Thăm Nhóm (4 Tổ)
            </button>
          </div>

          {/* Random Display Card */}
          <div className="bg-slate-950 border-2 border-dashed border-amber-500/40 rounded-2xl p-8 text-center space-y-2 relative overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isSpinning ? 'Đang quay số ngẫu nhiên...' : 'Kết quả lựa chọn:'}
            </div>

            <div className={`text-2xl sm:text-4xl font-black min-h-[50px] flex items-center justify-center transition-all ${
              isSpinning ? 'text-slate-400 scale-95' : 'text-amber-300 scale-100 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]'
            }`}>
              {selectedResult ? selectedResult.name : 'Bấm nút quay để bắt đầu!'}
            </div>

            <div className="text-xs sm:text-sm text-slate-400 min-h-[20px]">
              {selectedResult ? selectedResult.subtitle : 'Sẵn sàng chọn học sinh tham gia trả lời'}
            </div>
          </div>

          {/* Spin Trigger */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              disabled={isSpinning}
              onClick={handleSpin}
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95"
            >
              <Dices className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Đang quay...' : 'QUAY NGAY 🎲'}</span>
            </button>

            {selectedResult && !isSpinning && (
              <button
                onClick={handleApplyResult}
                className="py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Chỉ định người này</span>
              </button>
            )}
          </div>

          {/* Quick List Editor Toggle */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setShowEditor(!showEditor);
                setBulkText(students.map(s => `${s.name} - ${s.group}`).join('\n'));
              }}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showEditor ? 'Ẩn danh sách lớp' : 'Chỉnh sửa danh sách học sinh lớp học'}</span>
            </button>

            {showEditor && (
              <div className="mt-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                <div className="text-xs text-slate-400">
                  Dán hoặc gõ danh sách học sinh (mỗi dòng một em, định dạng: <em>Tên học sinh - Tên nhóm</em>):
                </div>
                <textarea
                  rows={6}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-amber-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowEditor(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveBulk}
                    className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    Lưu danh sách mới
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
