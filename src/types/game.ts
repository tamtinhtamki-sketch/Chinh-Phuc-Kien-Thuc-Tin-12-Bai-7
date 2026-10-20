export type SectionId = 'section1' | 'section2' | 'section3' | 'summary' | 'all';

export type GameMode = 'individual' | 'team';

export interface Question {
  id: string;
  section: SectionId;
  title: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  points: number;
  badge?: string;
}

export interface DragItem {
  id: string;
  text: string;
  category: string;
  description?: string;
  icon?: string;
}

export interface TreeChallengeNode {
  id: string;
  tag: string;
  parentId: string | null;
  description: string;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  playerType: 'student' | 'team';
  teamName?: string;
  section: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeSpentSec: number;
  playedAt: string;
}

export interface TeamScore {
  id: string;
  name: string;
  color: string;
  score: number;
  members: string[];
  history: {
    questionId?: string;
    points: number;
    reason: string;
    timestamp: string;
  }[];
}

export interface Student {
  id: string;
  name: string;
  group: string;
  score: number;
}
