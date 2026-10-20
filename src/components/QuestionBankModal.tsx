import React, { useState } from 'react';
import { X, Edit3, Plus, Trash2, RotateCcw, Check, Download, Upload, Info } from 'lucide-react';
import { Question, SectionId } from '../types/game';
import { sounds } from '../utils/sound';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onSaveQuestions: (updated: Question[]) => void;
  onResetQuestions: () => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSaveQuestions,
  onResetQuestions
}) => {
  const [selectedSection, setSelectedSection] = useState<SectionId | 'all'>('all');
  const [editingQ, setEditingQ] = useState<Question | null>(null);

  if (!isOpen) return null;

  const filtered = selectedSection === 'all' 
    ? questions 
    : questions.filter(q => q.section === selectedSection);

  const handleStartEdit = (q: Question) => {
    sounds.playClick();
    setEditingQ({ ...q, options: [...q.options] });
  };

  const handleAddNew = () => {
    sounds.playClick();
    const newQ: Question = {
      id: 'custom_q_' + Date.now(),
      section: selectedSection === 'all' ? 'section1' : selectedSection,
      title: 'Câu hỏi mới',
      question: 'Nhập nội dung câu hỏi cho học sinh tại đây...',
      options: ['Phương án A', 'Phương án B', 'Phương án C', 'Phương án D'],
      correctAnswerIndex: 0,
      explanation: 'Giải thích chi tiết theo SGK...',
      points: 10,
      badge: 'Tùy chỉnh'
    };
    setEditingQ(newQ);
  };

  const handleSaveEdit = () => {
    if (!editingQ) return;
    sounds.playCorrect();
    const exists = questions.some(q => q.id === editingQ.id);
    let updated: Question[];
    if (exists) {
      updated = questions.map(q => q.id === editingQ.id ? editingQ : q);
    } else {
      updated = [editingQ, ...questions];
    }
    onSaveQuestions(updated);
    setEditingQ(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Em có chắc chắn muốn xóa câu hỏi này không?')) {
      sounds.playClick();
      const updated = questions.filter(q => q.id !== id);
      onSaveQuestions(updated);
      if (editingQ?.id === id) setEditingQ(null);
    }
  };

  const handleExportJson = () => {
    sounds.playClick();
    const json = JSON.stringify(questions, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ngan_hang_cau_hoi_tin12_bai7_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onSaveQuestions(parsed);
          sounds.playCorrect();
          alert(`Đã nhập thành công ${parsed.length} câu hỏi!`);
        }
      } catch {
        alert('Tệp JSON không hợp lệ!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Quản Lý & Chỉnh Sửa Ngân Hàng Câu Hỏi
              </h3>
              <p className="text-xs text-slate-400">
                Cho phép giáo viên linh hoạt thêm, sửa, xóa, xuất/nhập bộ câu hỏi Bài 7 SGK
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

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5 text-xs">
            <button
              onClick={() => setSelectedSection('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedSection === 'all' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tất cả ({questions.length})
            </button>
            <button
              onClick={() => setSelectedSection('section1')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedSection === 'section1' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Phần 1 ({questions.filter(q => q.section === 'section1').length})
            </button>
            <button
              onClick={() => setSelectedSection('section2')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedSection === 'section2' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Phần 2 ({questions.filter(q => q.section === 'section2').length})
            </button>
            <button
              onClick={() => setSelectedSection('section3')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedSection === 'section3' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Phần 3 ({questions.filter(q => q.section === 'section3').length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddNew}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm câu hỏi mới
            </button>
            <button
              onClick={handleExportJson}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Xuất JSON
            </button>
            <label className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              Nhập JSON
              <input type="file" accept=".json" className="hidden" onChange={handleImportJson} />
            </label>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* List */}
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filtered.map((q, idx) => (
              <div
                key={q.id}
                onClick={() => handleStartEdit(q)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  editingQ?.id === q.id
                    ? 'bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-bold text-cyan-400">#{idx + 1} - {q.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">
                    +{q.points}đ
                  </span>
                </div>
                <div className="text-xs text-slate-200 line-clamp-2">{q.question}</div>
              </div>
            ))}
          </div>

          {/* Edit Form */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            {editingQ ? (
              <div className="space-y-3 text-xs overflow-y-auto max-h-[400px] pr-1">
                <div className="font-bold text-white text-sm flex items-center justify-between">
                  <span>Chỉnh Sửa Câu Hỏi ({editingQ.id})</span>
                  <button
                    onClick={() => handleDelete(editingQ.id)}
                    className="text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Phần bài học:</label>
                  <select
                    value={editingQ.section}
                    onChange={(e) => setEditingQ({ ...editingQ, section: e.target.value as SectionId })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="section1">Phần 1: Trang web và HTML</option>
                    <option value="section2">Phần 2: Cấu trúc cơ bản tệp HTML</option>
                    <option value="section3">Phần 3: Phần mềm soạn thảo HTML</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Tiêu đề / Chủ đề:</label>
                  <input
                    type="text"
                    value={editingQ.title}
                    onChange={(e) => setEditingQ({ ...editingQ, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Nội dung câu hỏi:</label>
                  <textarea
                    rows={3}
                    value={editingQ.question}
                    onChange={(e) => setEditingQ({ ...editingQ, question: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">4 Phương án trả lời (chọn đáp án đúng):</label>
                  <div className="space-y-2">
                    {editingQ.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOpt"
                          checked={editingQ.correctAnswerIndex === i}
                          onChange={() => setEditingQ({ ...editingQ, correctAnswerIndex: i })}
                          className="accent-cyan-500"
                        />
                        <span className="font-bold text-slate-400">{String.fromCharCode(65 + i)}:</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...editingQ.options];
                            newOpts[i] = e.target.value;
                            setEditingQ({ ...editingQ, options: newOpts });
                          }}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-slate-200 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Lời giải thích chuẩn SGK:</label>
                  <textarea
                    rows={2}
                    value={editingQ.explanation}
                    onChange={(e) => setEditingQ({ ...editingQ, explanation: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingQ(null)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    Lưu câu hỏi
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs space-y-2">
                <Info className="w-8 h-8 mx-auto text-slate-600" />
                <p>Hãy chọn một câu hỏi bên trái để xem và chỉnh sửa nội dung, hoặc bấm "Thêm câu hỏi mới".</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950">
          <button
            onClick={() => {
              if (confirm('Khôi phục lại toàn bộ ngân hàng câu hỏi gốc theo SGK Bài 7 Tin 12?')) {
                sounds.playClick();
                onResetQuestions();
                setEditingQ(null);
              }
            }}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Khôi phục câu hỏi SGK gốc
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
