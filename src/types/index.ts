export type UserRole = 'student' | 'super_admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  targetExam: string;
  streak: number;
  xp: number;
  badges: string[];
  joinedDate: string;
}

export type ResourceDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type ResourceVisibility = 'published' | 'draft' | 'archived';
export type ResourceFileType = 'pdf' | 'docx' | 'pptx' | 'image';

export interface ResourceVersion {
  versionNumber: number;
  uploadedAt: string;
  fileName: string;
  fileSize: string;
  changeLog: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  examCategory: string;
  tags: string[];
  difficulty: ResourceDifficulty;
  fileType: ResourceFileType;
  fileSize: string;
  fileUrl: string;
  thumbnail: string;
  publishedAt: string;
  visibility: ResourceVisibility;
  downloadCount: number;
  viewCount: number;
  upvotes: number;
  downvotes: number;
  versions: ResourceVersion[];
  isFeatured?: boolean;
}

export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  subject: string;
  topic: string;
  examCategory: string;
  difficulty: QuestionDifficulty;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  marks: number;
  negativeMarks: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  topic: string;
  difficulty: QuestionDifficulty;
  totalQuestions: number;
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarking: number;
  questionIds: string[];
  passingScore: number;
  attemptsCount: number;
  avgScore: number;
  isLive: boolean;
  endsAt?: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string;
  startedAt: string;
  completedAt: string;
  answers: Record<string, string>; // questionId -> selectedOptionId
  markedForReview: string[];
  score: number;
  totalPossibleMarks: number;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  timeSpentSeconds: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
  isMultiChoice: boolean;
  isAnonymous: boolean;
  startsAt: string;
  endsAt: string;
  visibility: 'public' | 'voters_only' | 'after_end';
  status: 'active' | 'archived';
  category: string;
  userVotedOptionIds?: string[];
}

export interface CurrentAffairsItem {
  id: string;
  title: string;
  category: 'National' | 'Global' | 'Economy' | 'Science & Tech' | 'Sports' | 'Governance';
  summary: string;
  fullContent: string;
  date: string;
  readTimeMinutes: number;
  tags: string[];
  quizQuestion?: Question;
}

export interface MistakeBookItem {
  id: string;
  userId: string;
  questionId: string;
  question: Question;
  addedAt: string;
  userNotes: string;
  mastered: boolean;
}

export interface BookmarkItem {
  id: string;
  userId: string;
  targetType: 'resource' | 'question' | 'quiz' | 'current_affair';
  targetId: string;
  targetTitle: string;
  category: string;
  savedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar: string;
  targetExam: string;
  xp: number;
  accuracy: number;
  quizzesCompleted: number;
  streakDays: number;
  badge: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorName: string;
  actorRole: string;
  timestamp: string;
  details: string;
}
