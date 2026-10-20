import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Trophy, 
  Users, 
  Dices, 
  Download, 
  HelpCircle, 
  BookOpen, 
  Code2, 
  CheckCircle,
  FileCode,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Header } from './components/Header';
import { Section1Game } from './components/Section1Game';
import { Section2Game } from './components/Section2Game';
import { Section3Game } from './components/Section3Game';
import { KnowledgeSummaryTab } from './components/KnowledgeSummaryTab';
import { RandomPickerModal } from './components/RandomPickerModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { TeamManagerModal } from './components/TeamManagerModal';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { QuestionBankModal } from './components/QuestionBankModal';
import { DatabaseManager } from './utils/dbManager';
import { generateSingleFileHtml } from './utils/exportHtml';
import { SectionId, GameMode, Question, LeaderboardEntry, TeamScore, Student } from './types/game';
import { sounds } from './utils/sound';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('section1');
  const [gameMode, setGameMode] = useState<GameMode>('individual');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Data states backed by DatabaseManager / LocalStorage (initialized synchronously)
  const [questions, setQuestions] = useState<Question[]>(() => DatabaseManager.getQuestions());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => DatabaseManager.getLeaderboard());
  const [teams, setTeams] = useState<TeamScore[]>(() => DatabaseManager.getTeams());
  const [students, setStudents] = useState<Student[]>(() => DatabaseManager.getStudents());

  // Current session stats
  const [playerName, setPlayerName] = useState<string>('Học Sinh 12A');
  const [currentTeamId, setCurrentTeamId] = useState<string>('team1');
  const [totalSessionScore, setTotalSessionScore] = useState<number>(0);

  // Modals state
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isTeamManagerOpen, setIsTeamManagerOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(false);

  // Sync / reload on mount if needed
  useEffect(() => {
    setQuestions(DatabaseManager.getQuestions());
    setLeaderboard(DatabaseManager.getLeaderboard());
    setTeams(DatabaseManager.getTeams());
    setStudents(DatabaseManager.getStudents());
  }, []);

  // Score earn handler
  const handleScoreEarned = (points: number, reason: string) => {
    setTotalSessionScore(prev => prev + points);

    if (gameMode === 'team') {
      const updatedTeams = DatabaseManager.adjustTeamScore(currentTeamId, points, reason);
      setTeams(updatedTeams);
    }
  };

  // Team score adjustments from modal
  const handleAdjustTeamScore = (teamId: string, delta: number, reason: string) => {
    const updated = DatabaseManager.adjustTeamScore(teamId, delta, reason);
    setTeams(updated);
  };

  const handleResetTeams = () => {
    const reset = DatabaseManager.resetTeamScores();
    setTeams(reset);
  };

  // Clear leaderboard
  const handleClearLeaderboard = () => {
    DatabaseManager.clearLeaderboard();
    setLeaderboard([]);
  };

  // Save modified questions
  const handleSaveQuestions = (updated: Question[]) => {
    DatabaseManager.saveQuestions(updated);
    setQuestions(updated);
  };

  const handleResetQuestions = () => {
    const reset = DatabaseManager.resetQuestions();
    setQuestions(reset);
  };

  // Save modified students
  const handleSaveStudents = (updated: Student[]) => {
    DatabaseManager.saveStudents(updated);
    setStudents(updated);
  };

  // Export Single HTML Standalone File
  const handleExportSingleHtml = () => {
    sounds.playFanfare();
    const htmlString = generateSingleFileHtml();
    const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Bai7_Tin12_HTML_Game_Offline.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeTeamObj = teams.find(t => t.id === currentTeamId) || teams[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* App Header */}
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        gameMode={gameMode}
        setGameMode={setGameMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenPicker={() => setIsPickerOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenTeamManager={() => setIsTeamManagerOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
        onExportSingleHtml={handleExportSingleHtml}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Status & Context Bar */}
        <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
              {gameMode === 'team' ? '👥' : '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">
                  {gameMode === 'team' ? 'Nhóm Đang Thi Đấu:' : 'Học Sinh Chơi:'}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {gameMode === 'team' ? 'Đấu Đội Lớp Học' : 'Cá Nhân'}
                </span>
              </div>

              {gameMode === 'team' ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <select
                    value={currentTeamId}
                    onChange={(e) => { sounds.playClick(); setCurrentTeamId(e.target.value); }}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-bold text-amber-400 focus:outline-none focus:border-indigo-500"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.score} điểm)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-0.5">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="bg-transparent border-b border-dashed border-slate-600 px-1 py-0.5 text-base font-bold text-white focus:outline-none focus:border-blue-400"
                    placeholder="Nhập họ tên học sinh..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Score Counter & Quick Triggers */}
          <div className="flex items-center flex-wrap gap-4 sm:gap-6">
            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {gameMode === 'team' ? `Điểm ${activeTeamObj?.name}` : 'Điểm Phiên Chơi'}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center gap-1 justify-end">
                <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
                <span>{gameMode === 'team' ? activeTeamObj?.score : totalSessionScore}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { sounds.playClick(); setIsPickerOpen(true); }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <Dices className="w-4 h-4" />
                <span>Bốc Thăm</span>
              </button>
              <button
                onClick={() => { sounds.playClick(); setIsLeaderboardOpen(true); }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-slate-700 transition-all"
              >
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>Bảng Điểm</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Game Section / Knowledge Summary */}
        {activeSection === 'summary' && (
          <KnowledgeSummaryTab onNavigateSection={(sec) => setActiveSection(sec)} />
        )}

        {activeSection === 'section1' && (
          <Section1Game
            questions={questions}
            gameMode={gameMode}
            currentTeamId={activeTeamObj?.name || 'Nhóm 1'}
            onScoreEarned={handleScoreEarned}
          />
        )}

        {activeSection === 'section2' && (
          <Section2Game
            questions={questions}
            gameMode={gameMode}
            currentTeamId={activeTeamObj?.name || 'Nhóm 1'}
            onScoreEarned={handleScoreEarned}
          />
        )}

        {activeSection === 'section3' && (
          <Section3Game
            questions={questions}
            gameMode={gameMode}
            currentTeamId={activeTeamObj?.name || 'Nhóm 1'}
            onScoreEarned={handleScoreEarned}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
          <span>Tin học 12 - Bộ sách Kết nối tri thức với cuộc sống</span>
          <span>•</span>
          <span>Chủ đề 4: Giải quyết vấn đề với sự trợ giúp của máy tính</span>
          <span>•</span>
          <span className="text-blue-400 font-semibold">Bài 7: HTML và Cấu Trúc Trang Web</span>
        </div>
        <div className="flex items-center justify-center gap-4 text-slate-400 pt-1">
          <button 
            onClick={handleExportSingleHtml} 
            className="hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Tải về tệp HTML đơn nhất (Offline Standalone)
          </button>
          <span>•</span>
          <button 
            onClick={() => setIsGuideOpen(true)} 
            className="hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Sổ tay hướng dẫn tổ chức tiết học
          </button>
        </div>
      </footer>

      {/* Modals */}
      <RandomPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        students={students}
        onSaveStudents={handleSaveStudents}
        onSelectTarget={(name, isGroup) => {
          if (isGroup) {
            const matched = teams.find(t => t.name.includes(name));
            if (matched) setCurrentTeamId(matched.id);
          } else {
            setPlayerName(name);
          }
        }}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={leaderboard}
        onClear={handleClearLeaderboard}
      />

      <TeamManagerModal
        isOpen={isTeamManagerOpen}
        onClose={() => setIsTeamManagerOpen(false)}
        teams={teams}
        onAdjustScore={handleAdjustTeamScore}
        onResetTeams={handleResetTeams}
      />

      <TeacherGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onExportSingleHtml={handleExportSingleHtml}
      />

      <QuestionBankModal
        isOpen={isQuestionBankOpen}
        onClose={() => setIsQuestionBankOpen(false)}
        questions={questions}
        onSaveQuestions={handleSaveQuestions}
        onResetQuestions={handleResetQuestions}
      />
    </div>
  );
}
