import {
  User,
  Resource,
  Question,
  Quiz,
  QuizAttempt,
  Poll,
  CurrentAffairsItem,
  MistakeBookItem,
  BookmarkItem,
  LeaderboardEntry,
  AuditLog,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_QUESTIONS,
  INITIAL_QUIZZES,
  INITIAL_RESOURCES,
  INITIAL_POLLS,
  INITIAL_CURRENT_AFFAIRS,
  INITIAL_LEADERBOARD,
  INITIAL_AUDIT_LOGS,
} from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'sss_users_v1',
  CURRENT_USER: 'sss_current_user_v1',
  QUESTIONS: 'sss_questions_v1',
  QUIZZES: 'sss_quizzes_v1',
  RESOURCES: 'sss_resources_v1',
  POLLS: 'sss_polls_v1',
  CURRENT_AFFAIRS: 'sss_current_affairs_v1',
  ATTEMPTS: 'sss_attempts_v1',
  MISTAKES: 'sss_mistakes_v1',
  BOOKMARKS: 'sss_bookmarks_v1',
  LEADERBOARD: 'sss_leaderboard_v1',
  AUDIT_LOGS: 'sss_audit_logs_v1',
};

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage quota or serialization error:', e);
  }
}

// Initialize seed data if not present
export function initializeDataStore(): void {
  getStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  getStorage(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  getStorage(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  getStorage(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  getStorage(STORAGE_KEYS.POLLS, INITIAL_POLLS);
  getStorage(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS);
  getStorage(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
  getStorage(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  getStorage(STORAGE_KEYS.ATTEMPTS, []);
  getStorage(STORAGE_KEYS.MISTAKES, []);
  getStorage(STORAGE_KEYS.BOOKMARKS, []);

  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
  }
}

// Authentication & Users
export const authService = {
  getCurrentUser(): User {
    return getStorage<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },

  getStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  isLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER) !== null;
  },

  setCurrentUser(user: User | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      setStorage(STORAGE_KEYS.CURRENT_USER, user);
    }
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getAllUsers(): User[] {
    return getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  switchRole(role: 'student' | 'super_admin'): User {
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const target = users.find((u) => u.role === role) || users[0];
    setStorage(STORAGE_KEYS.CURRENT_USER, target);
    return target;
  },

  login(email: string): { success: boolean; user?: User; error?: string } {
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      setStorage(STORAGE_KEYS.CURRENT_USER, found);
      return { success: true, user: found };
    }
    return { success: false, error: 'No user registered with this email. Try quick demo logins below.' };
  },

  loginSuperAdmin(email: string): { success: boolean; user?: User; error?: string } {
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { success: false, error: 'No administrative account found with this email.' };
    }
    if (found.role !== 'super_admin') {
      return { success: false, error: '403 Access Denied: This account does not possess super_admin privileges.' };
    }
    setStorage(STORAGE_KEYS.CURRENT_USER, found);
    return { success: true, user: found };
  },

  loginGuest(): User {
    const guestUser: User = {
      id: 'user_guest',
      name: 'Guest Scholar',
      email: 'guest@smartskillsphere.local',
      role: 'guest',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      targetExam: 'Self-Paced Practice',
      streak: 0,
      xp: 0,
      badges: ['Guest Explorer'],
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setStorage(STORAGE_KEYS.CURRENT_USER, guestUser);
    return guestUser;
  },

  // Security: Public registration strictly provisions 'student' role. Super admins can only be created via seeder.
  signUp(name: string, email: string, targetExam: string = 'Campus Placements'): { success: boolean; user: User } {
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      setStorage(STORAGE_KEYS.CURRENT_USER, existing);
      return { success: true, user: existing };
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim() || 'New Scholar',
      email: email.trim(),
      role: 'student', // strictly enforced student role
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      targetExam: targetExam || 'Campus Placements & GATE CS',
      streak: 1,
      xp: 150,
      badges: ['New Scholar', 'Welcome Badge'],
      joinedDate: new Date().toISOString().split('T')[0],
    };
    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);
    setStorage(STORAGE_KEYS.CURRENT_USER, newUser);
    return { success: true, user: newUser };
  },

  isSuperAdmin(user?: User | null): boolean {
    const u = user || this.getStoredUser();
    return u?.role === 'super_admin';
  },

  isStudent(user?: User | null): boolean {
    const u = user || this.getStoredUser();
    return u?.role === 'student';
  },

  isGuest(user?: User | null): boolean {
    const u = user || this.getStoredUser();
    return u?.role === 'guest' || !u;
  },

  updateProfile(updates: Partial<User>): User {
    const current = this.getCurrentUser() || INITIAL_USERS[0];
    const updated = { ...current, ...updates };
    setStorage(STORAGE_KEYS.CURRENT_USER, updated);

    const users = getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const index = users.findIndex((u) => u.id === current.id);
    if (index >= 0) {
      users[index] = updated;
      setStorage(STORAGE_KEYS.USERS, users);
    }
    return updated;
  },
};

// Resources / Notes
export const resourceService = {
  getAll(filter?: { subject?: string; difficulty?: string; search?: string }): Resource[] {
    const resources = getStorage<Resource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    let list = resources.filter((r) => r.visibility !== 'archived');

    if (filter?.subject && filter.subject !== 'All') {
      list = list.filter((r) => r.subject.toLowerCase() === filter.subject?.toLowerCase());
    }
    if (filter?.difficulty && filter.difficulty !== 'All') {
      list = list.filter((r) => r.difficulty.toLowerCase() === filter.difficulty?.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getById(id: string): Resource | undefined {
    const resources = getStorage<Resource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    const resource = resources.find((r) => r.id === id);
    if (resource) {
      // Increment view count quietly
      resource.viewCount += 1;
      setStorage(STORAGE_KEYS.RESOURCES, resources);
    }
    return resource;
  },

  download(id: string): { success: boolean; message: string; downloadUrl?: string } {
    const resources = getStorage<Resource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    const resource = resources.find((r) => r.id === id);
    if (!resource) return { success: false, message: 'Resource not found' };

    resource.downloadCount += 1;
    setStorage(STORAGE_KEYS.RESOURCES, resources);
    return {
      success: true,
      message: 'Download authorized via secure streaming channel.',
      downloadUrl: resource.fileUrl,
    };
  },

  voteFeedback(id: string, isUseful: boolean): Resource {
    const resources = getStorage<Resource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    const item = resources.find((r) => r.id === id);
    if (item) {
      if (isUseful) item.upvotes += 1;
      else item.downvotes += 1;
      setStorage(STORAGE_KEYS.RESOURCES, resources);
      return item;
    }
    throw new Error('Not found');
  },

  create(resourceData: Omit<Resource, 'id' | 'viewCount' | 'downloadCount' | 'upvotes' | 'downvotes' | 'versions'>): Resource {
    const resources = getStorage<Resource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    const newResource: Resource = {
      ...resourceData,
      id: `res_${Date.now()}`,
      viewCount: 0,
      downloadCount: 0,
      upvotes: 0,
      downvotes: 0,
      versions: [
        {
          versionNumber: 1,
          uploadedAt: new Date().toISOString().split('T')[0],
          fileName: `${resourceData.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
          fileSize: resourceData.fileSize,
          changeLog: 'Initial publication',
        },
      ],
    };
    resources.unshift(newResource);
    setStorage(STORAGE_KEYS.RESOURCES, resources);

    auditService.log('RESOURCE_UPLOADED', 'Resource', newResource.id, `Uploaded new resource: ${newResource.title}`);
    return newResource;
  },

  addVersion(id: string, fileName: string, fileSize: string, changeLog: string): Resource {
    const resources = getStorage<Resource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    const item = resources.find((r) => r.id === id);
    if (!item) throw new Error('Resource not found');

    const nextVer = (item.versions[0]?.versionNumber || 1) + 1;
    item.versions.unshift({
      versionNumber: nextVer,
      uploadedAt: new Date().toISOString().split('T')[0],
      fileName,
      fileSize,
      changeLog,
    });
    item.fileSize = fileSize;
    setStorage(STORAGE_KEYS.RESOURCES, resources);

    auditService.log('RESOURCE_VERSION_UPDATED', 'Resource', id, `Updated to version ${nextVer}: ${changeLog}`);
    return item;
  },

  delete(id: string): void {
    const resources = getStorage<Resource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    const filtered = resources.filter((r) => r.id !== id);
    setStorage(STORAGE_KEYS.RESOURCES, filtered);
    auditService.log('RESOURCE_DELETED', 'Resource', id, `Removed resource with ID ${id}`);
  },
};

// Quiz Engine
export const quizService = {
  getAll(): Quiz[] {
    return getStorage<Quiz[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  },

  getById(id: string): Quiz | undefined {
    return this.getAll().find((q) => q.id === id);
  },

  getQuestionsForQuiz(quiz: Quiz, hideAnswers = false): Question[] {
    const allQuestions = getStorage<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    const filtered = allQuestions.filter((q) => quiz.questionIds.includes(q.id));

    if (hideAnswers) {
      // Strip answers and explanations so students cannot read them in browser console before submission
      return filtered.map((q) => ({
        ...q,
        correctOptionId: '',
        explanation: '',
      }));
    }
    return filtered;
  },

  submitAttempt(
    quizId: string,
    answers: Record<string, string>,
    markedForReview: string[],
    timeSpentSeconds: number
  ): QuizAttempt {
    const quiz = this.getById(quizId);
    if (!quiz) throw new Error('Quiz not found');

    const questions = getStorage<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS).filter((q) =>
      quiz.questionIds.includes(q.id)
    );

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;

    questions.forEach((q) => {
      const selected = answers[q.id];
      if (!selected) {
        unattemptedCount += 1;
      } else if (selected === q.correctOptionId) {
        correctCount += 1;
        totalScore += q.marks;
      } else {
        incorrectCount += 1;
        totalScore = Math.max(0, totalScore - q.negativeMarks);
      }
    });

    const totalPossible = questions.reduce((sum, q) => sum + q.marks, 0);
    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

    const user = authService.getCurrentUser();
    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      userId: user.id,
      startedAt: new Date(Date.now() - timeSpentSeconds * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      answers,
      markedForReview,
      score: Number(totalScore.toFixed(2)),
      totalPossibleMarks: totalPossible,
      accuracy,
      correctCount,
      incorrectCount,
      unattemptedCount,
      timeSpentSeconds,
    };

    // Store attempt
    const attempts = getStorage<QuizAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
    attempts.unshift(attempt);
    setStorage(STORAGE_KEYS.ATTEMPTS, attempts);

    // Update user XP & streak
    const gainedXp = Math.round(correctCount * 50 + (accuracy > 80 ? 100 : 25));
    authService.updateProfile({
      xp: user.xp + gainedXp,
      streak: user.streak + 1,
    });

    // Auto-catalog incorrect questions into Mistake Book candidate
    const mistakeQuestions = questions.filter((q) => answers[q.id] && answers[q.id] !== q.correctOptionId);
    mistakeQuestions.forEach((mq) => {
      mistakeService.add(mq.id, 'Missed in live assessment attempt');
    });

    return attempt;
  },

  getAttemptsForUser(userId: string): QuizAttempt[] {
    const attempts = getStorage<QuizAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
    return attempts.filter((a) => a.userId === userId);
  },

  getAttemptById(attemptId: string): QuizAttempt | undefined {
    const attempts = getStorage<QuizAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
    return attempts.find((a) => a.id === attemptId);
  },
};

// Question Bank & Practice
export const questionService = {
  getAll(): Question[] {
    return getStorage<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  },

  getBySubject(subject: string): Question[] {
    return this.getAll().filter((q) => q.subject.toLowerCase() === subject.toLowerCase());
  },

  add(question: Omit<Question, 'id'>): Question {
    const questions = this.getAll();
    const newQ: Question = {
      ...question,
      id: `q_${Date.now()}`,
    };
    questions.push(newQ);
    setStorage(STORAGE_KEYS.QUESTIONS, questions);
    auditService.log('QUESTION_CREATED', 'Question', newQ.id, `Created question in ${newQ.subject}`);
    return newQ;
  },

  bulkImport(csvText: string): { importedCount: number; errors: string[] } {
    const lines = csvText.trim().split('\n');
    let imported = 0;
    const errors: string[] = [];

    // Format expected: Subject | Topic | Difficulty | QuestionText | Opt1,Opt2,Opt3,Opt4 | CorrectIndex (1-4) | Explanation
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;

      const parts = line.split('|').map((s) => s.trim());
      if (parts.length < 7) {
        errors.push(`Row ${i + 1}: Expected 7 pipe-separated fields, got ${parts.length}`);
        continue;
      }

      const [subject, topic, difficulty, qText, rawOpts, correctIdxStr, explanation] = parts;
      const optsList = rawOpts.split(',').map((o, idx) => ({
        id: `opt_${idx + 1}`,
        text: o.trim(),
      }));

      const correctIndex = parseInt(correctIdxStr, 10);
      if (isNaN(correctIndex) || correctIndex < 1 || correctIndex > optsList.length) {
        errors.push(`Row ${i + 1}: Invalid correct index ${correctIdxStr}`);
        continue;
      }

      this.add({
        subject,
        topic,
        examCategory: 'General Competitive',
        difficulty: (['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium') as any,
        text: qText,
        options: optsList,
        correctOptionId: optsList[correctIndex - 1].id,
        explanation,
        marks: 2,
        negativeMarks: 0.5,
      });
      imported += 1;
    }

    return { importedCount: imported, errors };
  },
};

// Polls Service
export const pollService = {
  getAll(): Poll[] {
    return getStorage<Poll[]>(STORAGE_KEYS.POLLS, INITIAL_POLLS);
  },

  vote(pollId: string, optionIds: string[]): Poll {
    const polls = this.getAll();
    const poll = polls.find((p) => p.id === pollId);
    if (!poll) throw new Error('Poll not found');

    if (poll.status !== 'active') throw new Error('This poll is archived');

    // Prevent duplicate voting for currently active session
    if (poll.userVotedOptionIds && poll.userVotedOptionIds.length > 0) {
      throw new Error('You have already cast your vote in this poll.');
    }

    optionIds.forEach((optId) => {
      const opt = poll.options.find((o) => o.id === optId);
      if (opt) {
        opt.votes += 1;
      }
    });

    poll.totalVotes += optionIds.length;
    poll.userVotedOptionIds = optionIds;

    setStorage(STORAGE_KEYS.POLLS, polls);
    return poll;
  },

  create(newPollData: Omit<Poll, 'id' | 'totalVotes' | 'userVotedOptionIds'>): Poll {
    const polls = this.getAll();
    const newPoll: Poll = {
      ...newPollData,
      id: `poll_${Date.now()}`,
      totalVotes: newPollData.options.reduce((sum, o) => sum + o.votes, 0),
    };
    polls.unshift(newPoll);
    setStorage(STORAGE_KEYS.POLLS, polls);
    auditService.log('POLL_CREATED', 'Poll', newPoll.id, `Created poll: ${newPoll.question}`);
    return newPoll;
  },
};

// Mistake Book
export const mistakeService = {
  getAll(): MistakeBookItem[] {
    return getStorage<MistakeBookItem[]>(STORAGE_KEYS.MISTAKES, []);
  },

  add(questionId: string, notes = ''): void {
    const list = this.getAll();
    const exists = list.some((m) => m.questionId === questionId);
    if (exists) return;

    const allQuestions = questionService.getAll();
    const question = allQuestions.find((q) => q.id === questionId);
    if (!question) return;

    const user = authService.getCurrentUser();
    list.unshift({
      id: `mb_${Date.now()}`,
      userId: user.id,
      questionId,
      question,
      addedAt: new Date().toISOString(),
      userNotes: notes,
      mastered: false,
    });
    setStorage(STORAGE_KEYS.MISTAKES, list);
  },

  updateNotes(id: string, notes: string): void {
    const list = this.getAll();
    const item = list.find((m) => m.id === id);
    if (item) {
      item.userNotes = notes;
      setStorage(STORAGE_KEYS.MISTAKES, list);
    }
  },

  toggleMastered(id: string): void {
    const list = this.getAll();
    const item = list.find((m) => m.id === id);
    if (item) {
      item.mastered = !item.mastered;
      setStorage(STORAGE_KEYS.MISTAKES, list);
    }
  },

  remove(id: string): void {
    const list = this.getAll().filter((m) => m.id !== id);
    setStorage(STORAGE_KEYS.MISTAKES, list);
  },
};

// Bookmarks
export const bookmarkService = {
  getAll(): BookmarkItem[] {
    return getStorage<BookmarkItem[]>(STORAGE_KEYS.BOOKMARKS, []);
  },

  toggle(targetType: BookmarkItem['targetType'], targetId: string, title: string, category: string): boolean {
    const list = this.getAll();
    const user = authService.getCurrentUser();
    const index = list.findIndex((b) => b.targetType === targetType && b.targetId === targetId);

    if (index >= 0) {
      list.splice(index, 1);
      setStorage(STORAGE_KEYS.BOOKMARKS, list);
      return false; // unbookmarked
    } else {
      list.unshift({
        id: `bm_${Date.now()}`,
        userId: user.id,
        targetType,
        targetId,
        targetTitle: title,
        category,
        savedAt: new Date().toISOString(),
      });
      setStorage(STORAGE_KEYS.BOOKMARKS, list);
      return true; // bookmarked
    }
  },

  isBookmarked(targetType: BookmarkItem['targetType'], targetId: string): boolean {
    return this.getAll().some((b) => b.targetType === targetType && b.targetId === targetId);
  },
};

// Current Affairs
export const currentAffairsService = {
  getAll(): CurrentAffairsItem[] {
    return getStorage<CurrentAffairsItem[]>(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS);
  },

  create(item: Omit<CurrentAffairsItem, 'id'>): CurrentAffairsItem {
    const list = this.getAll();
    const newItem: CurrentAffairsItem = {
      ...item,
      id: `ca_${Date.now()}`,
    };
    list.unshift(newItem);
    setStorage(STORAGE_KEYS.CURRENT_AFFAIRS, list);
    auditService.log('CURRENT_AFFAIRS_PUBLISHED', 'CurrentAffairs', newItem.id, `Published article: ${newItem.title}`);
    return newItem;
  },
};

// Leaderboard
export const leaderboardService = {
  getAll(): LeaderboardEntry[] {
    return getStorage<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
  },
};

// Audit Logs
export const auditService = {
  getAll(): AuditLog[] {
    return getStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  log(action: string, entityType: string, entityId: string, details: string): void {
    const logs = this.getAll();
    const user = authService.getCurrentUser();
    logs.unshift({
      id: `log_${Date.now()}`,
      action,
      entityType,
      entityId,
      actorName: user.name,
      actorRole: user.role,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details,
    });
    setStorage(STORAGE_KEYS.AUDIT_LOGS, logs);
  },
};
