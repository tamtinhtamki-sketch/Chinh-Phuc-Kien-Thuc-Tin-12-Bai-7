import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  FileCode,
  Tag,
  Stethoscope,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, GameMode } from '../types/game';
import { sounds } from '../utils/sound';
import { DatabaseManager } from '../utils/dbManager';
import { INITIAL_QUESTIONS } from '../data/defaultQuestions';

interface Section1GameProps {
  questions: Question[];
  gameMode: GameMode;
  currentTeamId: string;
  onScoreEarned: (points: number, reason: string) => void;
}

export const Section1Game: React.FC<Section1GameProps> = ({
  questions,
  gameMode,
  currentTeamId,
  onScoreEarned
}) => {
  const allQs = questions && questions.length > 0 ? questions : INITIAL_QUESTIONS;
  const p1Questions = allQs.filter(q => q.section === 'section1');
  const [activeSubTab, setActiveSubTab] = useState<'quiz' | 'classifier' | 'syntaxDoctor'>('quiz');

  // --- Sub-mode 1: Quiz State ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // --- Sub-mode 2: Tag Classifier State ---
  const initialClassifierItems = [
    { id: 'c1', text: '<hr/>', type: 'single', desc: 'Thẻ tạo đường kẻ ngang, chỉ có thẻ bắt đầu' },
    { id: 'c2', text: '<p>...</p>', type: 'pair', desc: 'Thẻ đoạn văn bản, có thẻ mở và thẻ đóng </p>' },
    { id: 'c3', text: '<!DOCTYPE html>', type: 'not_element', desc: 'Khai báo kiểu tệp html5 cho trình duyệt, KHÔNG phải phần tử HTML' },
    { id: 'c4', text: '<br/>', type: 'single', desc: 'Thẻ ngắt xuống dòng, là thẻ đơn' },
    { id: 'c5', text: '<h1>...</h1>', type: 'pair', desc: 'Thẻ tiêu đề cấp 1, có thẻ mở và thẻ đóng </h1>' },
    { id: 'c6', text: '<!-- ghi chú -->', type: 'comment', desc: 'Phần tử chú thích đặc biệt trong HTML' },
    { id: 'c7', text: '<img src="...">', type: 'single', desc: 'Thẻ chèn hình ảnh, không có thẻ đóng riêng' },
    { id: 'c8', text: '<em>...</em>', type: 'pair', desc: 'Thẻ in nghiêng nhấn mạnh văn bản' },
  ];
  const [classifierItems, setClassifierItems] = useState(initialClassifierItems);
  const [classifierSelected, setClassifierSelected] = useState<string | null>(null);
  const [classifierResults, setClassifierResults] = useState<{ [id: string]: boolean }>({});
  const [classifierExplanation, setClassifierExplanation] = useState<string>('');

  // --- Sub-mode 3: Syntax Doctor State ---
  const syntaxChallenges = [
    {
      id: 'syn1',
      title: 'Bệnh án 1: Thiếu dấu đóng thẻ',
      brokenCode: '<p>Lớp 12A1 thân mến<p>',
      fixedOptions: [
        '<p>Lớp 12A1 thân mến</p>',
        '</p>Lớp 12A1 thân mến<p>',
        '<p>Lớp 12A1 thân mến<br>',
      ],
      correctOption: 0,
      symptom: 'Thẻ kết thúc thiếu dấu gạch chéo "/" (closing tag)',
      cureRule: 'Theo SGK trang 40: Vị trí kết thúc có thêm dấu "/" chẳng hạn </p>.'
    },
    {
      id: 'syn2',
      title: 'Bệnh án 2: Sai quy tắc lồng thẻ',
      brokenCode: '<p>Trang này bởi <em>nhóm bạn</p> thân</em>',
      fixedOptions: [
        '<p>Trang này bởi <em>nhóm bạn thân</em></p>',
        '<p>Trang này bởi <em>nhóm bạn</em> thân</p>',
        '<p>Trang này bởi <em>nhóm bạn thân</p></em>',
      ],
      correctOption: 1,
      symptom: 'Thẻ <em> mở trong thẻ <p> nhưng thẻ <p> lại đóng trước',
      cureRule: 'SGK trang 40: Các thẻ có thể lồng nhau. Thẻ mở sau phải đóng trước: <p>...<em>...</em>...</p>.'
    },
    {
      id: 'syn3',
      title: 'Bệnh án 3: Nhầm lẫn dấu ngoặc thẻ',
      brokenCode: '{h1}Trang web và HTML{/h1}',
      fixedOptions: [
        '[h1]Trang web và HTML[/h1]',
        '<h1>Trang web và HTML</h1>',
        '(h1)Trang web và HTML(/h1)',
      ],
      correctOption: 1,
      symptom: 'Thẻ HTML sử dụng sai cặp dấu ngoặc nhọn { }',
      cureRule: 'SGK trang 40: Các kí tự đánh dấu đặc biệt của thẻ HTML nằm trong cặp hai dấu "<", ">".'
    }
  ];
  const [currentSyntaxIdx, setCurrentSyntaxIdx] = useState(0);
  const [syntaxAnswered, setSyntaxAnswered] = useState(false);
  const [syntaxChoice, setSyntaxChoice] = useState<number | null>(null);

  // --- Handlers for Quiz ---
  const currentQ = p1Questions[currentIndex] || p1Questions[0] || allQs[0];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswerIndex;
    if (isCorrect) {
      sounds.playCorrect();
      setCorrectStreak(prev => prev + 1);
      const points = currentQ.points;
      setQuizScore(prev => prev + points);
      onScoreEarned(points, `Đúng câu hỏi: ${currentQ.title}`);
    } else {
      sounds.playIncorrect();
      setCorrectStreak(0);
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentIndex < p1Questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      sounds.playFanfare();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      DatabaseManager.addLeaderboardEntry({
        playerName: gameMode === 'team' ? currentTeamId : 'Học sinh cá nhân',
        playerType: gameMode === 'team' ? 'team' : 'student',
        teamName: currentTeamId,
        section: 'Phần 1: Trang web & HTML',
        score: quizScore,
        totalQuestions: p1Questions.length,
        correctCount: Math.round(quizScore / 10),
        timeSpentSec: 60
      });
    }
  };

  const handleRestartQuiz = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectStreak(0);
    setQuizScore(0);
    setIsFinished(false);
  };

  // --- Handlers for Classifier ---
  const handleClassify = (category: 'single' | 'pair' | 'not_element' | 'comment') => {
    if (!classifierSelected) return;
    const item = classifierItems.find(i => i.id === classifierSelected);
    if (!item) return;

    sounds.playClick();
    const isCorrect = item.type === category;
    setClassifierResults(prev => ({ ...prev, [item.id]: isCorrect }));

    if (isCorrect) {
      sounds.playCorrect();
      onScoreEarned(10, `Phân loại đúng thẻ: ${item.text}`);
      setClassifierExplanation(`✓ Đúng rồi! ${item.desc}`);
    } else {
      sounds.playIncorrect();
      setClassifierExplanation(`✗ Chưa chính xác! Lưu ý: ${item.desc}`);
    }
  };

  // --- Handlers for Syntax Doctor ---
  const currSyn = syntaxChallenges[currentSyntaxIdx];

  const handleSyntaxSelect = (idx: number) => {
    if (syntaxAnswered) return;
    setSyntaxChoice(idx);
    setSyntaxAnswered(true);

    if (idx === currSyn.correctOption) {
      sounds.playCorrect();
      onScoreEarned(15, `Chẩn đoán và sửa đúng lỗi cú pháp: ${currSyn.title}`);
    } else {
      sounds.playIncorrect();
    }
  };

  const handleNextSyntax = () => {
    sounds.playClick();
    if (currentSyntaxIdx < syntaxChallenges.length - 1) {
      setCurrentSyntaxIdx(prev => prev + 1);
      setSyntaxAnswered(false);
      setSyntaxChoice(null);
    } else {
      confetti({ particleCount: 70, spread: 60 });
      sounds.playFanfare();
      setCurrentSyntaxIdx(0);
      setSyntaxAnswered(false);
      setSyntaxChoice(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h2 className="font-bold text-white text-base sm:text-lg">
              Phần 1: Trang Web và HTML (SGK Trang 39 - 41)
            </h2>
            <p className="text-xs text-slate-400">
              Khái niệm HTML, phần mở rộng tệp, thẻ đơn/đôi, phần tử HTML và chú thích
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => { sounds.playClick(); setActiveSubTab('quiz'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'quiz' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Đấu Trường Kiến Thức
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveSubTab('classifier'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'classifier' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Thám Tử Phân Loại Thẻ
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveSubTab('syntaxDoctor'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'syntaxDoctor' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Bác Sĩ Cú Pháp HTML
          </button>
        </div>
      </div>

      {/* ================= SUB-MODE 1: QUIZ ================= */}
      {activeSubTab === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
          {!isFinished ? (
            <div>
              {/* Progress & Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold">
                    Câu {currentIndex + 1} / {p1Questions.length}
                  </span>
                  {currentQ?.badge && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-medium">
                      {currentQ.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    +{currentQ?.points ?? 10} Điểm
                  </div>
                  {correctStreak > 1 && (
                    <div className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-bounce">
                      🔥 Chuỗi đúng x{correctStreak}
                    </div>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug">
                  {currentQ?.question}
                </h3>
                {currentQ?.codeSnippet && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-sm text-cyan-300 overflow-x-auto">
                    {currentQ.codeSnippet}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                {currentQ?.options?.map((opt, idx) => {
                  let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-blue-500/60 hover:bg-slate-800/80';
                  const isCorrect = idx === currentQ.correctAnswerIndex;
                  const isSelected = selectedOption === idx;

                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-200';
                    } else {
                      btnStyle = 'border-slate-800/40 bg-slate-950/20 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm sm:text-base font-medium transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isAnswered && isCorrect
                          ? 'bg-emerald-500 text-white'
                          : isAnswered && isSelected
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 pt-0.5">{opt}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Button */}
              {isAnswered && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                        Căn cứ kiến thức SGK Tin học 12 KNTT:
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all"
                    >
                      <span>{currentIndex < p1Questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả Phần 1'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Finished Section 1 Screen */
            <div className="text-center py-8 px-4 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-4xl shadow-xl shadow-blue-500/20 animate-bounce">
                🎯
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Xuất Sắc! Hoàn Thành Phần 1: Trang Web & HTML
              </h3>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                Em đã làm chủ các kiến thức nền tảng: bản chất ngôn ngữ đánh dấu siêu văn bản, cú pháp thẻ, phần tử HTML và thẻ đơn/đôi.
              </p>
              <div className="inline-block p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 uppercase font-semibold">Tổng điểm đạt được</div>
                <div className="text-3xl font-extrabold text-amber-400 mt-1">{quizScore} Điểm</div>
              </div>

              <div className="flex justify-center gap-3 pt-3">
                <button
                  onClick={handleRestartQuiz}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Luyện tập lại
                </button>
                <button
                  onClick={() => setActiveSubTab('classifier')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                >
                  <Tag className="w-4 h-4" />
                  Chơi Mini-game Phân Loại Thẻ
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= SUB-MODE 2: TAG CLASSIFIER ================= */}
      {activeSubTab === 'classifier' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-400" />
                Thám Tử Thẻ: Phân Loại Cấu Trúc Đánh Dấu
              </h3>
              <p className="text-xs text-slate-400">
                Nhấp chọn một thẻ bên dưới, sau đó bấm vào đúng nhóm phân loại! (Bám sát SGK trang 40 - 41)
              </p>
            </div>
          </div>

          {/* Cards to classify */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {classifierItems.map((item) => {
              const isSelected = classifierSelected === item.id;
              const hasResult = classifierResults[item.id] !== undefined;
              const isCorrect = classifierResults[item.id];

              let borderStyle = 'border-slate-800 bg-slate-950/70 hover:border-indigo-500/50';
              if (isSelected) borderStyle = 'border-indigo-500 bg-indigo-500/20 ring-2 ring-indigo-500/40';
              if (hasResult) {
                borderStyle = isCorrect 
                  ? 'border-emerald-500 bg-emerald-500/10' 
                  : 'border-rose-500 bg-rose-500/10';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => { sounds.playClick(); setClassifierSelected(item.id); }}
                  className={`p-3.5 rounded-xl border text-center transition-all ${borderStyle}`}
                >
                  <div className="font-mono font-bold text-base sm:text-lg text-cyan-300">
                    {item.text}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {hasResult ? (isCorrect ? '✓ Đã đúng' : '✗ Thử lại') : 'Bấm để phân loại'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Category Drop Targets */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => handleClassify('single')}
              className="p-4 rounded-xl bg-slate-950 border-2 border-dashed border-amber-500/50 hover:bg-amber-500/10 text-left transition-all"
            >
              <div className="font-bold text-amber-300 text-sm mb-1 flex items-center justify-between">
                <span>1. Thẻ Đơn (Empty/Void)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">&lt;tag/&gt;</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Chỉ có thẻ bắt đầu, không có thẻ kết thúc riêng (ví dụ: &lt;hr/&gt;, &lt;br/&gt;, &lt;img&gt;).
              </p>
            </button>

            <button
              onClick={() => handleClassify('pair')}
              className="p-4 rounded-xl bg-slate-950 border-2 border-dashed border-blue-500/50 hover:bg-blue-500/10 text-left transition-all"
            >
              <div className="font-bold text-blue-300 text-sm mb-1 flex items-center justify-between">
                <span>2. Thẻ Đôi (Cặp Thẻ)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">&lt;tag&gt;...&lt;/tag&gt;</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Gồm thẻ bắt đầu và thẻ kết thúc có dấu "/" (ví dụ: &lt;p&gt;, &lt;h1&gt;, &lt;em&gt;).
              </p>
            </button>

            <button
              onClick={() => handleClassify('not_element')}
              className="p-4 rounded-xl bg-slate-950 border-2 border-dashed border-rose-500/50 hover:bg-rose-500/10 text-left transition-all"
            >
              <div className="font-bold text-rose-300 text-sm mb-1 flex items-center justify-between">
                <span>3. KHÔNG Là Phần Tử</span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">Khai báo</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Thông báo kiểu tệp cho trình duyệt, không được xem là phần tử HTML (&lt;!DOCTYPE html&gt;).
              </p>
            </button>

            <button
              onClick={() => handleClassify('comment')}
              className="p-4 rounded-xl bg-slate-950 border-2 border-dashed border-purple-500/50 hover:bg-purple-500/10 text-left transition-all"
            >
              <div className="font-bold text-purple-300 text-sm mb-1 flex items-center justify-between">
                <span>4. Thẻ Chú Thích</span>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">&lt;!-- --&gt;</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Phần tử HTML đặc biệt dùng để giải thích mã nguồn, trình duyệt không hiển thị nội dung.
              </p>
            </button>
          </div>

          {/* Feedback Explanation */}
          {classifierExplanation && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{classifierExplanation}</span>
            </div>
          )}
        </div>
      )}

      {/* ================= SUB-MODE 3: SYNTAX DOCTOR ================= */}
      {activeSubTab === 'syntaxDoctor' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-400" />
                Bác Sĩ Cú Pháp: Khám & Sửa Lỗi Thẻ HTML
              </h3>
              <p className="text-xs text-slate-400">
                Tìm bệnh của đoạn mã sai cú pháp và chọn đơn thuốc (cú pháp sửa đúng) theo chuẩn SGK!
              </p>
            </div>
            <span className="text-xs font-bold text-teal-400 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30">
              Ca bệnh {currentSyntaxIdx + 1} / {syntaxChallenges.length}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>Mã Nguồn Đang Bị Lỗi:</span>
            </div>
            <div className="font-mono text-base sm:text-lg text-rose-300 bg-rose-500/10 p-3 rounded-lg border border-rose-500/30">
              {currSyn.brokenCode}
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Triệu chứng lỗi: {currSyn.symptom}</span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-300 uppercase">
              Chọn đoạn mã đã được sửa đúng cú pháp:
            </div>
            {currSyn.fixedOptions.map((opt, idx) => {
              const isSelected = syntaxChoice === idx;
              const isCorrect = idx === currSyn.correctOption;
              let style = 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-teal-500/50';

              if (syntaxAnswered) {
                if (isCorrect) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                else if (isSelected) style = 'bg-rose-500/20 border-rose-500 text-rose-200';
                else style = 'bg-slate-950/20 border-slate-800/40 text-slate-500 opacity-60';
              }

              return (
                <button
                  key={idx}
                  disabled={syntaxAnswered}
                  onClick={() => handleSyntaxSelect(idx)}
                  className={`w-full p-3.5 rounded-xl border text-left font-mono text-sm sm:text-base transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {syntaxAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {syntaxAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {syntaxAnswered && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs text-slate-300">
                <strong className="text-teal-400">Quy tắc chuẩn SGK:</strong> {currSyn.cureRule}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleNextSyntax}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20"
                >
                  <span>{currentSyntaxIdx < syntaxChallenges.length - 1 ? 'Khám ca tiếp theo' : 'Hoàn thành ca bệnh'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
