import { LeaderboardEntry, Question, TeamScore, Student } from '../types/game';
import { INITIAL_QUESTIONS, INITIAL_STUDENTS } from '../data/defaultQuestions';

const STORAGE_KEYS = {
  LEADERBOARD: 'tin12_b7_leaderboard',
  QUESTIONS: 'tin12_b7_questions',
  TEAMS: 'tin12_b7_teams',
  STUDENTS: 'tin12_b7_students',
};

export const INITIAL_TEAMS: TeamScore[] = [
  { id: 'team1', name: 'Nhóm 1 (Tổ 1)', color: 'from-amber-500 to-orange-600', score: 0, members: ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường'], history: [] },
  { id: 'team2', name: 'Nhóm 2 (Tổ 2)', color: 'from-emerald-500 to-teal-600', score: 0, members: ['Phạm Minh Đức', 'Hoàng Thu Giang', 'Đỗ Hải Hà'], history: [] },
  { id: 'team3', name: 'Nhóm 3 (Tổ 3)', color: 'from-blue-500 to-indigo-600', score: 0, members: ['Vũ Quốc Hưng', 'Đặng Mai Lan', 'Bùi Tuấn Nam'], history: [] },
  { id: 'team4', name: 'Nhóm 4 (Tổ 4)', color: 'from-purple-500 to-pink-600', score: 0, members: ['Ngô Phương Oanh', 'Lý Trọng Quân', 'Trịnh Thanh Thảo'], history: [] },
];

export class DatabaseManager {
  // Questions
  static getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return INITIAL_QUESTIONS;
  }

  static saveQuestions(questions: Question[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }

  static resetQuestions(): Question[] {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    return INITIAL_QUESTIONS;
  }

  // Leaderboard
  static getLeaderboard(): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'rec_01',
        playerName: 'Nguyễn Văn An',
        playerType: 'student',
        teamName: 'Nhóm 1 (Tổ 1)',
        section: 'Trọn vẹn 3 phần',
        score: 280,
        totalQuestions: 23,
        correctCount: 23,
        timeSpentSec: 145,
        playedAt: new Date(Date.now() - 3600000).toLocaleString('vi-VN')
      },
      {
        id: 'rec_02',
        playerName: 'Nhóm 2 (Tổ 2)',
        playerType: 'team',
        teamName: 'Nhóm 2 (Tổ 2)',
        section: 'Phần 2: Cấu trúc HTML',
        score: 110,
        totalQuestions: 8,
        correctCount: 8,
        timeSpentSec: 72,
        playedAt: new Date(Date.now() - 7200000).toLocaleString('vi-VN')
      }
    ];
  }

  static addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'playedAt'>): LeaderboardEntry {
    const list = this.getLeaderboard();
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: 'score_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      playedAt: new Date().toLocaleString('vi-VN')
    };
    list.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(list));
    return newEntry;
  }

  static clearLeaderboard(): void {
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
  }

  // Teams
  static getTeams(): TeamScore[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEAMS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return INITIAL_TEAMS;
  }

  static saveTeams(teams: TeamScore[]): void {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  }

  static adjustTeamScore(teamId: string, delta: number, reason: string): TeamScore[] {
    const teams = this.getTeams();
    const updated = teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          score: Math.max(0, t.score + delta),
          history: [
            {
              points: delta,
              reason,
              timestamp: new Date().toLocaleTimeString('vi-VN')
            },
            ...t.history
          ]
        };
      }
      return t;
    });
    this.saveTeams(updated);
    return updated;
  }

  static resetTeamScores(): TeamScore[] {
    const fresh = INITIAL_TEAMS.map(t => ({ ...t, score: 0, history: [] }));
    this.saveTeams(fresh);
    return fresh;
  }

  // Students list for picker
  static getStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return INITIAL_STUDENTS;
  }

  static saveStudents(students: Student[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }

  // Export SQLite script (SQL DDL + INSERT statements)
  static generateSQLiteExport(): string {
    const leaderboard = this.getLeaderboard();
    const questions = this.getQuestions();
    const teams = this.getTeams();
    const students = this.getStudents();

    let sql = `-- ========================================================\n`;
    sql += `-- CƠ SỞ DỮ LIỆU SQLITE: BÀI 7 TIN HỌC 12 KẾT NỐI TRI THỨC\n`;
    sql += `-- Ứng dụng: Đấu Trí Tin Học 12 (HTML & Cấu Trúc Trang Web)\n`;
    sql += `-- Ngày xuất: ${new Date().toLocaleString('vi-VN')}\n`;
    sql += `-- ========================================================\n\n`;

    sql += `PRAGMA foreign_keys = ON;\n\n`;

    // Table questions
    sql += `-- Bảng 1: questions (Ngân hàng câu hỏi Bài 7 SGK)\n`;
    sql += `CREATE TABLE IF NOT EXISTS questions (\n`;
    sql += `    id TEXT PRIMARY KEY,\n`;
    sql += `    section TEXT NOT NULL,\n`;
    sql += `    title TEXT NOT NULL,\n`;
    sql += `    question TEXT NOT NULL,\n`;
    sql += `    options_json TEXT NOT NULL,\n`;
    sql += `    correct_answer_index INTEGER NOT NULL,\n`;
    sql += `    explanation TEXT,\n`;
    sql += `    points INTEGER DEFAULT 10,\n`;
    sql += `    badge TEXT\n`;
    sql += `);\n\n`;

    questions.forEach(q => {
      const safeTitle = q.title.replace(/'/g, "''");
      const safeQ = q.question.replace(/'/g, "''");
      const safeExp = (q.explanation || '').replace(/'/g, "''");
      const safeOptions = JSON.stringify(q.options).replace(/'/g, "''");
      sql += `INSERT OR REPLACE INTO questions (id, section, title, question, options_json, correct_answer_index, explanation, points, badge) VALUES ('${q.id}', '${q.section}', '${safeTitle}', '${safeQ}', '${safeOptions}', ${q.correctAnswerIndex}, '${safeExp}', ${q.points}, '${q.badge || ''}');\n`;
    });

    // Table teams
    sql += `\n-- Bảng 2: teams (Đội thi đấu / Tổ học tập)\n`;
    sql += `CREATE TABLE IF NOT EXISTS teams (\n`;
    sql += `    id TEXT PRIMARY KEY,\n`;
    sql += `    name TEXT NOT NULL,\n`;
    sql += `    color TEXT,\n`;
    sql += `    score INTEGER DEFAULT 0\n`;
    sql += `);\n\n`;

    teams.forEach(t => {
      sql += `INSERT OR REPLACE INTO teams (id, name, color, score) VALUES ('${t.id}', '${t.name.replace(/'/g, "''")}', '${t.color}', ${t.score});\n`;
    });

    // Table students
    sql += `\n-- Bảng 3: students (Học sinh tham gia & Vòng quay ngẫu nhiên)\n`;
    sql += `CREATE TABLE IF NOT EXISTS students (\n`;
    sql += `    id TEXT PRIMARY KEY,\n`;
    sql += `    name TEXT NOT NULL,\n`;
    sql += `    group_name TEXT,\n`;
    sql += `    score INTEGER DEFAULT 0\n`;
    sql += `);\n\n`;

    students.forEach(s => {
      sql += `INSERT OR REPLACE INTO students (id, name, group_name, score) VALUES ('${s.id}', '${s.name.replace(/'/g, "''")}', '${s.group.replace(/'/g, "''")}', ${s.score});\n`;
    });

    // Table leaderboard
    sql += `\n-- Bảng 4: leaderboard (Lịch sử điểm số & Thành tích)\n`;
    sql += `CREATE TABLE IF NOT EXISTS leaderboard (\n`;
    sql += `    id TEXT PRIMARY KEY,\n`;
    sql += `    player_name TEXT NOT NULL,\n`;
    sql += `    player_type TEXT NOT NULL,\n`;
    sql += `    team_name TEXT,\n`;
    sql += `    section TEXT NOT NULL,\n`;
    sql += `    score INTEGER NOT NULL,\n`;
    sql += `    correct_count INTEGER,\n`;
    sql += `    total_questions INTEGER,\n`;
    sql += `    time_spent_sec INTEGER,\n`;
    sql += `    played_at TEXT\n`;
    sql += `);\n\n`;

    leaderboard.forEach(l => {
      sql += `INSERT INTO leaderboard (id, player_name, player_type, team_name, section, score, correct_count, total_questions, time_spent_sec, played_at) VALUES ('${l.id}', '${l.playerName.replace(/'/g, "''")}', '${l.playerType}', '${(l.teamName || '').replace(/'/g, "''")}', '${l.section.replace(/'/g, "''")}', ${l.score}, ${l.correctCount}, ${l.totalQuestions}, ${l.timeSpentSec}, '${l.playedAt}');\n`;
    });

    return sql;
  }
}
