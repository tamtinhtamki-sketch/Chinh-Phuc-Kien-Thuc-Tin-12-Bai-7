import React, { useState } from 'react';
import { 
  GitFork, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Info,
  Network,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, GameMode } from '../types/game';
import { sounds } from '../utils/sound';
import { DatabaseManager } from '../utils/dbManager';
import { INITIAL_QUESTIONS } from '../data/defaultQuestions';

interface Section2GameProps {
  questions: Question[];
  gameMode: GameMode;
  currentTeamId: string;
  onScoreEarned: (points: number, reason: string) => void;
}

export const Section2Game: React.FC<Section2GameProps> = ({
  questions,
  gameMode,
  currentTeamId,
  onScoreEarned
}) => {
  const allQs = questions && questions.length > 0 ? questions : INITIAL_QUESTIONS;
  const p2Questions = allQs.filter(q => q.section === 'section2');
  const [activeSubTab, setActiveSubTab] = useState<'treeBuilder' | 'quiz' | 'treeChallenge'>('treeBuilder');

  // --- Sub-mode 1: Tree Builder Slots ---
  // Students fill the blanks in the standard HTML structure
  interface SlotItem {
    id: string;
    label: string;
    correctTag: string;
    desc: string;
  }
  const treeSlots: SlotItem[] = [
    { id: 's1', label: '1. Khai báo kiểu tệp đầu tiên (Không phải phần tử)', correctTag: '<!DOCTYPE html>', desc: 'Thông báo kiểu tệp html5 cho trình duyệt' },
    { id: 's2', label: '2. Nút Gốc (Root) duy nhất của toàn trang', correctTag: '<html>', desc: 'Chứa tất cả phần tử còn lại của trang web' },
    { id: 's3', label: '3. Nhánh thông tin chung của trang web', correctTag: '<head>', desc: 'Chứa title, meta charset, style, script' },
    { id: 's4', label: '4. Thẻ khai báo bảng mã tiếng Việt Unicode', correctTag: '<meta charset="utf-8">', desc: 'Mô tả mã hóa văn bản theo UTF-8' },
    { id: 's5', label: '5. Tên trang web hiển thị trên thanh tab trình duyệt', correctTag: '<title>', desc: 'Chỉ chứa văn bản, KHÔNG chứa phần tử con' },
    { id: 's6', label: '6. Nhánh chứa nội dung hiển thị cho người xem', correctTag: '<body>', desc: 'Chứa tất cả phần tử nhìn thấy được như h1..h6, p, div' },
    { id: 's7', label: '7. Nhóm thẻ định dạng tiêu đề giảm cấp dần', correctTag: '<h1> .. <h6>', desc: 'Tiêu đề cấp độ từ lớn đến nhỏ' },
  ];

  const availableTags = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8">',
    '<title>',
    '<body>',
    '<h1> .. <h6>',
    '<script>',
    '<header>'
  ];

  const [slotAssignments, setSlotAssignments] = useState<{ [slotId: string]: string }>({});
  const [treeChecked, setTreeChecked] = useState(false);
  const [treeSuccess, setTreeSuccess] = useState(false);

  // --- Sub-mode 2: Quiz ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // --- Sub-mode 3: SGK Page 43 Exercise Challenge ---
  // <p>Thông tin này in <b>đậm</b>, in <i>nghiêng</i> in <u>gạch dưới</u>, in bình thường.</p>
  const [sgkAnswers, setSgkAnswers] = useState({
    rootTag: '',
    childrenCount: '',
    childrenTags: [] as string[]
  });
  const [sgkSubmitted, setSgkSubmitted] = useState(false);
  const [sgkIsCorrect, setSgkIsCorrect] = useState(false);

  // Tree Builder handlers
  const handleAssignTag = (slotId: string, tag: string) => {
    sounds.playClick();
    setSlotAssignments(prev => ({ ...prev, [slotId]: tag }));
    setTreeChecked(false);
  };

  const handleCheckTree = () => {
    sounds.playClick();
    let allCorrect = true;
    for (const slot of treeSlots) {
      if (slotAssignments[slot.id] !== slot.correctTag) {
        allCorrect = false;
        break;
      }
    }
    setTreeChecked(true);
    setTreeSuccess(allCorrect);

    if (allCorrect) {
      sounds.playFanfare();
      confetti({ particleCount: 90, spread: 80 });
      onScoreEarned(50, 'Xây dựng hoàn chỉnh Cây Thông Tin HTML');
    } else {
      sounds.playIncorrect();
    }
  };

  const handleResetTree = () => {
    sounds.playClick();
    setSlotAssignments({});
    setTreeChecked(false);
    setTreeSuccess(false);
  };

  // Quiz handlers
  const currentQ = p2Questions[currentIndex] || p2Questions[0] || allQs[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctAnswerIndex;
    if (isCorrect) {
      sounds.playCorrect();
      const pts = currentQ.points;
      setQuizScore(prev => prev + pts);
      onScoreEarned(pts, `Đúng câu hỏi: ${currentQ.title}`);
    } else {
      sounds.playIncorrect();
    }
  };

  const handleNextQuiz = () => {
    sounds.playClick();
    if (currentIndex < p2Questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      sounds.playFanfare();
      confetti({ particleCount: 80, spread: 70 });
      DatabaseManager.addLeaderboardEntry({
        playerName: gameMode === 'team' ? currentTeamId : 'Học sinh cá nhân',
        playerType: gameMode === 'team' ? 'team' : 'student',
        teamName: currentTeamId,
        section: 'Phần 2: Cấu trúc HTML',
        score: quizScore,
        totalQuestions: p2Questions.length,
        correctCount: Math.round(quizScore / 10),
        timeSpentSec: 75
      });
    }
  };

  // SGK Exercise handler
  const handleToggleChildTag = (tag: string) => {
    sounds.playClick();
    setSgkAnswers(prev => {
      const exists = prev.childrenTags.includes(tag);
      return {
        ...prev,
        childrenTags: exists 
          ? prev.childrenTags.filter(t => t !== tag) 
          : [...prev.childrenTags, tag]
      };
    });
  };

  const handleCheckSgkChallenge = () => {
    sounds.playClick();
    const correctChildren = ['b', 'i', 'u'];
    const hasAll = correctChildren.every(c => sgkAnswers.childrenTags.includes(c)) && sgkAnswers.childrenTags.length === 3;
    const isCorrect = 
      sgkAnswers.rootTag.toLowerCase() === 'p' && 
      (sgkAnswers.childrenCount === '3' || sgkAnswers.childrenCount === 'ba') &&
      hasAll;

    setSgkSubmitted(true);
    setSgkIsCorrect(isCorrect);

    if (isCorrect) {
      sounds.playFanfare();
      confetti({ particleCount: 80, spread: 70 });
      onScoreEarned(30, 'Giải xuất sắc bài tập Vẽ cây HTML SGK Trang 43');
    } else {
      sounds.playIncorrect();
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h2 className="font-bold text-white text-base sm:text-lg">
              Phần 2: Cấu Trúc Cơ Bản Của Một Tệp HTML (SGK Trang 41 - 43)
            </h2>
            <p className="text-xs text-slate-400">
              Phần tử gốc &lt;html&gt;, hai nhánh &lt;head&gt; & &lt;body&gt;, cây thông tin DOM và quan hệ cha-con
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => { sounds.playClick(); setActiveSubTab('treeBuilder'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'treeBuilder' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Kiến Trúc Sư Cây HTML
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveSubTab('quiz'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'quiz' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Đấu Trường Cấu Trúc
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveSubTab('treeChallenge'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'treeChallenge' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            Thử Thách Cây SGK Tr.43
          </button>
        </div>
      </div>

      {/* ================= SUB-MODE 1: TREE BUILDER ================= */}
      {activeSubTab === 'treeBuilder' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <Network className="w-5 h-5 text-emerald-400" />
                Kiến Tạo Cây Thông Tin HTML Chuẩn (Hình 7.3 & 7.4 SGK)
              </h3>
              <p className="text-xs text-slate-400">
                Gắn thẻ thích hợp vào từng vị trí trong cấu trúc chuẩn của trang web
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetTree}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Làm lại
              </button>
              <button
                onClick={handleCheckTree}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
              >
                Kiểm tra kết quả
              </button>
            </div>
          </div>

          {/* Palette of Available Tags */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Kho thẻ HTML (Bấm vào thẻ để chọn hoặc gán):
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs sm:text-sm font-bold text-cyan-300 select-all"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Slots Architecture */}
          <div className="space-y-3 font-mono text-xs sm:text-sm">
            {treeSlots.map((slot) => {
              const assigned = slotAssignments[slot.id];
              const isCorrect = assigned === slot.correctTag;

              let slotStyle = 'bg-slate-950/80 border-slate-800 text-slate-300';
              if (treeChecked) {
                slotStyle = isCorrect 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500 text-rose-300';
              }

              return (
                <div
                  key={slot.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${slotStyle}`}
                >
                  <div className="font-sans flex-1">
                    <div className="font-bold text-slate-200 text-xs sm:text-sm">
                      {slot.label}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {slot.desc}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={assigned || ''}
                      onChange={(e) => handleAssignTag(slot.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-cyan-300 font-mono focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">-- Chọn thẻ đúng --</option>
                      {availableTags.map((t, i) => (
                        <option key={i} value={t}>{t}</option>
                      ))}
                    </select>

                    {treeChecked && (
                      isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Success Banner */}
          {treeChecked && treeSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong>Chính xác tuyệt đối!</strong> Em đã dựng đúng cấu trúc chuẩn của tệp HTML với đầy đủ nút gốc &lt;html&gt;, hai nhánh &lt;head&gt;, &lt;body&gt; và các thẻ quy chuẩn.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= SUB-MODE 2: QUIZ ================= */}
      {activeSubTab === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
          {!isFinished ? (
            <div>
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  Câu {currentIndex + 1} / {p2Questions.length}
                </span>
                <span className="text-amber-400 text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  +{currentQ?.points ?? 10} Điểm
                </span>
              </div>

              {/* Question */}
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-6 leading-snug">
                {currentQ?.question}
              </h3>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                {currentQ?.options?.map((opt, idx) => {
                  let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-emerald-500/60';
                  const isCorrect = idx === currentQ.correctAnswerIndex;
                  const isSelected = selectedOption === idx;

                  if (isAnswered) {
                    if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold';
                    else if (isSelected) btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-200';
                    else btnStyle = 'border-slate-800/40 bg-slate-950/20 text-slate-500 opacity-60';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm sm:text-base font-medium transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isAnswered && isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 pt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {isAnswered && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                        Căn cứ kiến thức SGK Tin học 12 KNTT (Trang 41 - 43):
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuiz}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
                    >
                      <span>{currentIndex < p2Questions.length - 1 ? 'Câu tiếp theo' : 'Xem tổng kết Phần 2'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 px-4 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20">
                🌿
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Chúc Mừng! Hoàn Thành Phần 2: Cấu Trúc Cơ Bản HTML
              </h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                Em đã nắm chắc cấu trúc cây thông tin DOM, phân cấp cha - con và vai trò sống còn của &lt;html&gt;, &lt;head&gt;, &lt;body&gt;.
              </p>
              <div className="inline-block p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 uppercase font-semibold">Tổng điểm đạt được</div>
                <div className="text-3xl font-extrabold text-amber-400 mt-1">{quizScore} Điểm</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= SUB-MODE 3: SGK PAGE 43 CHALLENGE ================= */}
      {activeSubTab === 'treeChallenge' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
              <GitFork className="w-5 h-5 text-teal-400" />
              Bài Tập Vẽ Sơ Đồ Cây (Trích SGK Tin 12 KNTT Trang 43)
            </h3>
            <p className="text-xs text-slate-400">
              Nhiệm vụ 1 & 2 trang 43: Quan sát đoạn mã và phân tích các quan hệ cha - con trong cây thông tin!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Đoạn văn bản HTML trong SGK:</div>
            <div className="p-3 bg-slate-900 rounded-lg font-mono text-cyan-300 text-sm overflow-x-auto border border-slate-800">
              &lt;p&gt;Thông tin này in &lt;b&gt;đậm&lt;/b&gt;, in &lt;i&gt;nghiêng&lt;/i&gt; in &lt;u&gt;gạch dưới&lt;/u&gt;, in bình thường.&lt;/p&gt;
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Question A */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="font-bold text-slate-200 text-sm">
                1. Thẻ cha (nút bao bọc bên ngoài) của đoạn văn bản trên là thẻ gì?
              </div>
              <input
                type="text"
                placeholder="Nhập tên thẻ (ví dụ: p hoặc <p>)"
                value={sgkAnswers.rootTag}
                onChange={(e) => setSgkAnswers(prev => ({ ...prev, rootTag: e.target.value.replace(/[<>]/g, '').trim() }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-cyan-300 font-mono focus:border-teal-500 focus:outline-none"
              />
            </div>

            {/* Question B */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="font-bold text-slate-200 text-sm">
                2. Có bao nhiêu phần tử con được lồng bên trong thẻ cha này?
              </div>
              <input
                type="text"
                placeholder="Nhập số lượng phần tử con (ví dụ: 3)"
                value={sgkAnswers.childrenCount}
                onChange={(e) => setSgkAnswers(prev => ({ ...prev, childrenCount: e.target.value.trim() }))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-cyan-300 font-mono focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Question C: Pick the child tags */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="font-bold text-slate-200 text-sm">
              3. Hãy đánh dấu chọn TẤT CẢ các thẻ con trực tiếp nằm trong đoạn mã trên:
            </div>
            <div className="flex flex-wrap gap-2">
              {['b', 'i', 'u', 'em', 'strong', 'hr', 'h1'].map((tag) => {
                const isSelected = sgkAnswers.childrenTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleToggleChildTag(tag)}
                    className={`px-4 py-2 rounded-lg font-mono text-xs sm:text-sm font-bold transition-all border ${
                      isSelected
                        ? 'bg-teal-600 border-teal-400 text-white shadow'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    &lt;{tag}&gt;
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCheckSgkChallenge}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-500/20"
            >
              Kiểm tra & Vẽ Sơ Đồ Cây
            </button>
          </div>

          {sgkSubmitted && (
            <div className={`p-4 rounded-xl border ${sgkIsCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/10 border-rose-500/40 text-rose-300'}`}>
              {sgkIsCorrect ? (
                <div>
                  <div className="font-bold text-base mb-2">🎉 Hoàn toàn chính xác!</div>
                  <div className="font-mono text-xs bg-slate-950 p-3 rounded-lg text-slate-200 leading-relaxed border border-slate-800">
                    <div>Sơ đồ cây của đoạn mã:</div>
                    <div className="text-amber-400 font-bold">&lt;p&gt; (Nút cha)</div>
                    <div className="text-cyan-400 ml-4">├── &lt;b&gt;đậm&lt;/b&gt;</div>
                    <div className="text-cyan-400 ml-4">├── &lt;i&gt;nghiêng&lt;/i&gt;</div>
                    <div className="text-cyan-400 ml-4">└── &lt;u&gt;gạch dưới&lt;/u&gt;</div>
                  </div>
                  <p className="text-xs text-slate-300 mt-2">
                    Lưu ý câu hỏi 2 SGK trang 43: <em>"Cây HTML có bao nhiêu phần tử gốc?"</em> - Đáp án: <strong>Chỉ có duy nhất 1 phần tử gốc là &lt;html&gt;</strong>.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="font-bold text-base mb-1">Chưa chính xác, em hãy kiểm tra lại:</div>
                  <div className="text-xs text-slate-300">
                    Thẻ bao bọc ngoài cùng là &lt;p&gt;, có đúng 3 phần tử con được lồng là &lt;b&gt; (in đậm), &lt;i&gt; (in nghiêng) và &lt;u&gt; (gạch chân).
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
