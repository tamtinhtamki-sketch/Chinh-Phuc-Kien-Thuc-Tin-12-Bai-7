import React, { useState } from 'react';
import { 
  Play, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Code2, 
  Globe, 
  FileText,
  Clock,
  Compass,
  Laptop
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, GameMode } from '../types/game';
import { sounds } from '../utils/sound';
import { DatabaseManager } from '../utils/dbManager';
import { INITIAL_QUESTIONS } from '../data/defaultQuestions';

interface Section3GameProps {
  questions: Question[];
  gameMode: GameMode;
  currentTeamId: string;
  onScoreEarned: (points: number, reason: string) => void;
}

export const Section3Game: React.FC<Section3GameProps> = ({
  questions,
  gameMode,
  currentTeamId,
  onScoreEarned
}) => {
  const allQs = questions && questions.length > 0 ? questions : INITIAL_QUESTIONS;
  const p3Questions = allQs.filter(q => q.section === 'section3');
  const [activeSubTab, setActiveSubTab] = useState<'categorizer' | 'quiz' | 'liveLab'>('categorizer');

  // --- Sub-mode 1: Categorizer State (Bài tập 1 SGK Trang 44) ---
  const initialTools = [
    { id: 't1', name: 'Notepad', type: 'editor', note: 'Soạn thảo đơn giản, có sẵn trên Windows' },
    { id: 't2', name: 'Chrome', type: 'browser', note: 'Trình duyệt web phổ biến của Google' },
    { id: 't3', name: 'Sublime Text', type: 'editor', note: 'Soạn thảo mã chuyên nghiệp đa nền tảng' },
    { id: 't4', name: 'Cốc Cốc', type: 'browser', note: 'Trình duyệt web phổ biến tại Việt Nam' },
    { id: 't5', name: 'Notepad++', type: 'editor', note: 'Soạn thảo mã nguồn mở, đa năng' },
    { id: 't6', name: 'FireFox', type: 'browser', note: 'Trình duyệt web mã nguồn mở của Mozilla' },
    { id: 't7', name: 'Microsoft Edge', type: 'browser', note: 'Trình duyệt web mặc định trên Windows' },
    { id: 't8', name: 'Opera', type: 'browser', note: 'Trình duyệt web' },
    { id: 't9', name: 'TextEdit', type: 'editor', note: 'Soạn thảo văn bản đơn giản trên macOS' },
    { id: 't10', name: 'W3Schools Online', type: 'editor', note: 'Trang web hỗ trợ soạn thảo HTML trực tuyến' },
  ];

  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [toolResults, setToolResults] = useState<{ [id: string]: 'editor' | 'browser' }>({});
  const [categorizerDone, setCategorizerDone] = useState(false);

  // --- Sub-mode 2: Quiz ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // --- Sub-mode 3: Live Lab Sandbox ---
  const initialLabCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Trang web thử nghiệm</title>
</head>
<body>
  <h1>Trang Web và HTML</h1>
  <p>Đây là dòng đầu tiên</p>
  <hr>
  <p style="color: blue;">Đây là dòng chữ màu xanh!</p>
</body>
</html>`;

  const [labCode, setLabCode] = useState(initialLabCode);
  const [labPreviewHtml, setLabPreviewHtml] = useState(initialLabCode);
  const [labFeedback, setLabFeedback] = useState<string>('');

  // Categorizer Handlers
  const handleAssignCategory = (category: 'editor' | 'browser') => {
    if (!selectedToolId) return;
    const tool = initialTools.find(t => t.id === selectedToolId);
    if (!tool) return;

    sounds.playClick();
    const isCorrect = tool.type === category;
    setToolResults(prev => ({ ...prev, [tool.id]: category }));

    if (isCorrect) {
      sounds.playCorrect();
      onScoreEarned(10, `Phân loại đúng: ${tool.name}`);
    } else {
      sounds.playIncorrect();
    }

    // Check if all answered
    const totalAnswered = Object.keys({ ...toolResults, [tool.id]: category }).length;
    if (totalAnswered >= initialTools.length) {
      setCategorizerDone(true);
      sounds.playFanfare();
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  const handleResetCategorizer = () => {
    sounds.playClick();
    setSelectedToolId(null);
    setToolResults({});
    setCategorizerDone(false);
  };

  // Quiz Handlers
  const currentQ = p3Questions[currentIndex] || p3Questions[0] || allQs[0];

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
    if (currentIndex < p3Questions.length - 1) {
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
        section: 'Phần 3: Phần mềm soạn thảo',
        score: quizScore,
        totalQuestions: p3Questions.length,
        correctCount: Math.round(quizScore / 10),
        timeSpentSec: 65
      });
    }
  };

  // Live Lab Handlers
  const handleRunCode = () => {
    sounds.playClick();
    setLabPreviewHtml(labCode);

    // Validate simple criteria
    const hasH1 = /<h1>.*<\/h1>/i.test(labCode);
    const hasP = /<p.*>.*<\/p>/i.test(labCode);
    const hasHr = /<hr\s*\/?>/i.test(labCode);
    const hasDoctype = /<!DOCTYPE\s+html>/i.test(labCode);

    if (hasH1 && hasP && hasHr && hasDoctype) {
      sounds.playCorrect();
      setLabFeedback('🎉 Xuất sắc! Mã HTML có đầy đủ <!DOCTYPE html>, thẻ tiêu đề <h1>, thẻ đoạn văn <p> và đường kẻ ngang <hr/>.');
      onScoreEarned(25, 'Thực hành viết mã HTML chuẩn trong Live Lab');
    } else {
      setLabFeedback('💡 Gợi ý: Hãy thử thêm đủ <!DOCTYPE html>, thẻ tiêu đề <h1>, đoạn văn <p> và đường kẻ <hr> nhé!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <h2 className="font-bold text-white text-base sm:text-lg">
              Phần 3: Phần Mềm Soạn Thảo HTML (SGK Trang 43 - 45)
            </h2>
            <p className="text-xs text-slate-400">
              Notepad, Notepad++, Sublime Text, trang web soạn thảo trực tuyến và trình duyệt web
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => { sounds.playClick(); setActiveSubTab('categorizer'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'categorizer' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Phân Loại Thần Tốc (SGK Tr.44)
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveSubTab('quiz'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'quiz' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Đấu Trường Công Cụ
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveSubTab('liveLab'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'liveLab' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Live HTML Playground (Hình 7.6)
          </button>
        </div>
      </div>

      {/* ================= SUB-MODE 1: CATEGORIZER (Bài tập 1 SGK trang 44) ================= */}
      {activeSubTab === 'categorizer' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <Compass className="w-5 h-5 text-purple-400" />
                Bài Tập 1 SGK Trang 44: Phân Loại Soạn Thảo & Trình Duyệt
              </h3>
              <p className="text-xs text-slate-400">
                Nhấp chọn một phần mềm bên dưới, sau đó xếp vào đúng giỏ tương ứng!
              </p>
            </div>
            <button
              onClick={handleResetCategorizer}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm lại
            </button>
          </div>

          {/* Software Tiles to Pick */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {initialTools.map((tool) => {
              const isSelected = selectedToolId === tool.id;
              const result = toolResults[tool.id];
              const isCorrect = result === tool.type;

              let style = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-purple-500/50';
              if (isSelected) style = 'bg-purple-600/20 border-purple-500 text-purple-200 ring-2 ring-purple-500/40';
              if (result) {
                style = isCorrect 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500 text-rose-300';
              }

              return (
                <button
                  key={tool.id}
                  onClick={() => { sounds.playClick(); setSelectedToolId(tool.id); }}
                  className={`p-3 rounded-xl border text-center font-medium transition-all ${style}`}
                >
                  <div className="font-bold text-sm sm:text-base">{tool.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {result ? (isCorrect ? '✓ Đúng' : '✗ Sai') : 'Bấm chọn'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Two Classification Buckets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Bucket 1: Editors */}
            <div className="p-4 rounded-xl bg-slate-950 border-2 border-dashed border-indigo-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-bold text-indigo-300 text-sm sm:text-base">
                    Nhóm A: Phần Mềm Soạn Thảo HTML
                  </h4>
                </div>
                <button
                  disabled={!selectedToolId}
                  onClick={() => handleAssignCategory('editor')}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-40 transition-all"
                >
                  + Đưa vào nhóm này
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Dùng để gõ và chỉnh sửa mã nguồn HTML (Ví dụ: Notepad, Notepad++, Sublime Text, TextEdit, W3Schools...)
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Object.entries(toolResults)
                  .filter(([_, cat]) => cat === 'editor')
                  .map(([id]) => {
                    const t = initialTools.find(i => i.id === id);
                    const isRight = t?.type === 'editor';
                    return (
                      <span key={id} className={`px-2.5 py-1 rounded-md text-xs font-semibold ${isRight ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                        {t?.name} {isRight ? '✓' : '✗'}
                      </span>
                    );
                  })}
              </div>
            </div>

            {/* Bucket 2: Web Browsers */}
            <div className="p-4 rounded-xl bg-slate-950 border-2 border-dashed border-blue-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <h4 className="font-bold text-blue-300 text-sm sm:text-base">
                    Nhóm B: Trình Duyệt Web (Browser)
                  </h4>
                </div>
                <button
                  disabled={!selectedToolId}
                  onClick={() => handleAssignCategory('browser')}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-40 transition-all"
                >
                  + Đưa vào nhóm này
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Dùng để đọc tệp mã nguồn và hiển thị nội dung trang web cho người dùng (Chrome, Cốc Cốc, Firefox, Edge, Opera...)
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Object.entries(toolResults)
                  .filter(([_, cat]) => cat === 'browser')
                  .map(([id]) => {
                    const t = initialTools.find(i => i.id === id);
                    const isRight = t?.type === 'browser';
                    return (
                      <span key={id} className={`px-2.5 py-1 rounded-md text-xs font-semibold ${isRight ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                        {t?.name} {isRight ? '✓' : '✗'}
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>

          {categorizerDone && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>Chúc mừng!</strong> Em đã hoàn thành việc phân loại bài tập 1 SGK trang 44, phân biệt rạch ròi giữa công cụ soạn thảo mã và trình duyệt hiển thị.
              </span>
            </div>
          )}
        </div>
      )}

      {/* ================= SUB-MODE 2: QUIZ ================= */}
      {activeSubTab === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
          {!isFinished ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold">
                  Câu {currentIndex + 1} / {p3Questions.length}
                </span>
                <span className="text-amber-400 text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  +{currentQ?.points ?? 10} Điểm
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-6 leading-snug">
                {currentQ?.question}
              </h3>

              <div className="grid grid-cols-1 gap-3 mb-6">
                {currentQ?.options?.map((opt, idx) => {
                  let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-purple-500/60';
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

              {isAnswered && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Căn cứ kiến thức SGK Tin học 12 KNTT (Trang 43 - 45):
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuiz}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all"
                    >
                      <span>{currentIndex < p3Questions.length - 1 ? 'Câu tiếp theo' : 'Xem tổng kết Phần 3'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 px-4 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-4xl shadow-xl shadow-purple-500/20">
                🏆
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Chúc Mừng! Hoàn Thành Phần 3: Phần Mềm Soạn Thảo HTML
              </h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                Em đã am hiểu các phần mềm chuyên nghiệp (Notepad++, Sublime Text), cách chuyển syntax HTML và lịch sử ra đời của HTML từ Tim Berners-Lee.
              </p>
              <div className="inline-block p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 uppercase font-semibold">Tổng điểm đạt được</div>
                <div className="text-3xl font-extrabold text-amber-400 mt-1">{quizScore} Điểm</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= SUB-MODE 3: LIVE HTML PLAYGROUND ================= */}
      {activeSubTab === 'liveLab' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-400" />
                Mô Phỏng Trình Soạn Thảo Trực Tuyến (Hình 7.6 SGK Trang 44)
              </h3>
              <p className="text-xs text-slate-400">
                Gõ mã HTML tại khung bên trái, nháy nút <strong>"Run (Chạy thử)"</strong> để xem kết quả tức thì ở khung bên phải!
              </p>
            </div>
            <button
              onClick={handleRunCode}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
            >
              <Play className="w-4 h-4" />
              <span>Chạy Thử (Run)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Code Editor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
                <span>Khung Soạn Thảo Mã Nguồn:</span>
                <span className="text-[11px] text-cyan-400">HTML5</span>
              </div>
              <textarea
                value={labCode}
                onChange={(e) => setLabCode(e.target.value)}
                rows={14}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs sm:text-sm text-cyan-300 focus:outline-none focus:border-emerald-500 leading-relaxed shadow-inner"
                spellCheck={false}
              />
            </div>

            {/* Right: Preview Output */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-400 font-semibold px-1">
                Khung Hiển Thị Trình Duyệt:
              </div>
              <div 
                className="w-full h-[335px] bg-white rounded-xl p-4 overflow-y-auto text-slate-900 border border-slate-300 shadow-inner"
                dangerouslySetInnerHTML={{ __html: labPreviewHtml }}
              />
            </div>
          </div>

          {labFeedback && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200">
              {labFeedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
