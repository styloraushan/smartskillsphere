import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { AuthModal } from './components/AuthModal';
import { 
  authService, 
  resourceService, 
  quizService, 
  questionService, 
  pollService, 
  currentAffairsService, 
  mistakeService, 
  bookmarkService, 
  leaderboardService, 
  auditService,
  initializeDataStore 
} from './services/api';
import { 
  User, 
  Resource, 
  Quiz, 
  Question, 
  QuizAttempt, 
  Poll, 
  CurrentAffairsItem, 
  MistakeBookItem, 
  BookmarkItem, 
  LeaderboardEntry, 
  AuditLog 
} from './types';

// Views
import { HomeView } from './views/HomeView';
import { ResourcesView } from './views/ResourcesView';
import { ResourceDetailView } from './views/ResourceDetailView';
import { QuizArenaView } from './views/QuizArenaView';
import { QuizInstructionsView } from './views/QuizInstructionsView';
import { LiveQuizView } from './views/LiveQuizView';
import { QuizResultsView } from './views/QuizResultsView';
import { PollsView } from './views/PollsView';
import { AptitudePracticeView } from './views/AptitudePracticeView';
import { LogicalReasoningView } from './views/LogicalReasoningView';
import { VerbalPracticeView } from './views/VerbalPracticeView';
import { TechnicalPracticeView } from './views/TechnicalPracticeView';
import { CurrentAffairsView } from './views/CurrentAffairsView';
import { DailyChallengeView } from './views/DailyChallengeView';
import { LeaderboardView } from './views/LeaderboardView';
import { DashboardView } from './views/DashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { MistakeBookView } from './views/MistakeBookView';
import { BookmarksView } from './views/BookmarksView';
import { ProfileView } from './views/ProfileView';
import { AboutLegalView } from './views/AboutLegalView';

export default function App() {
  // Initialize store
  useEffect(() => {
    initializeDataStore();
  }, []);

  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getStoredUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'admin_login'>('login');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchParam, setSearchParam] = useState<string>('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const effectiveUser: User = currentUser || authService.getAllUsers()[0];

  // Active resource for detail / preview
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [previewModalResource, setPreviewModalResource] = useState<Resource | null>(null);

  // Active quiz state
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [activeTestQuestions, setActiveTestQuestions] = useState<Question[]>([]);
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);

  // Cached state for rendering
  const [resources, setResources] = useState<Resource[]>(() => resourceService.getAll());
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => quizService.getAll());
  const [polls, setPolls] = useState<Poll[]>(() => pollService.getAll());
  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffairsItem[]>(() => currentAffairsService.getAll());
  const [mistakes, setMistakes] = useState<MistakeBookItem[]>(() => mistakeService.getAll());
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => bookmarkService.getAll());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => leaderboardService.getAll());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => auditService.getAll());
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() =>
    currentUser ? quizService.getAttemptsForUser(currentUser.id) : []
  );

  const refreshAllData = () => {
    setResources(resourceService.getAll());
    setQuizzes(quizService.getAll());
    setPolls(pollService.getAll());
    setCurrentAffairs(currentAffairsService.getAll());
    setMistakes(mistakeService.getAll());
    setBookmarks(bookmarkService.getAll());
    setLeaderboard(leaderboardService.getAll());
    setAuditLogs(auditService.getAll());
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setAttempts(quizService.getAttemptsForUser(user.id));
    } else {
      setAttempts([]);
    }
  };

  const handleRoleSwitch = (newRole: 'student' | 'super_admin') => {
    const user = authService.switchRole(newRole);
    setCurrentUser(user);
    refreshAllData();
  };

  const handleOpenAuth = (mode: 'login' | 'signup' | 'admin_login' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    refreshAllData();
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    refreshAllData();
  };

  const handleNavigate = (tab: string, param?: string) => {
    if ((tab === 'dashboard' || tab === 'profile') && !currentUser) {
      handleOpenAuth('login');
      return;
    }
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    if (param) setSearchParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launching Quizzes & Drills
  const handleSelectQuizForInstructions = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setActiveTab('quiz_instructions');
  };

  const handleStartLiveQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    const questions = quizService.getQuestionsForQuiz(quiz, true);
    setActiveTestQuestions(questions);
    setActiveTab('live_quiz');
  };

  const handleStartCustomDrill = (questions: Question[], title: string) => {
    const customQuiz: Quiz = {
      id: `custom_${Date.now()}`,
      title,
      description: 'Personalized practice drill',
      category: questions[0]?.subject || 'Practice',
      topic: questions[0]?.topic || 'Custom',
      difficulty: 'Medium',
      totalQuestions: questions.length,
      durationMinutes: Math.max(5, questions.length * 1.5),
      marksPerQuestion: 2,
      negativeMarking: 0.5,
      questionIds: questions.map((q) => q.id),
      passingScore: Math.round(questions.length * 1.2),
      attemptsCount: 1,
      avgScore: 2,
      isLive: true,
    };
    setSelectedQuiz(customQuiz);
    setActiveTestQuestions(questions);
    setActiveTab('live_quiz');
  };

  const handleQuizCompleted = (attempt: QuizAttempt) => {
    setLatestAttempt(attempt);
    refreshAllData();
    setActiveTab('quiz_results');
  };

  const handleResetData = () => {
    localStorage.clear();
    initializeDataStore();
    refreshAllData();
    setActiveTab('home');
  };

  const isLandingPage = activeTab === 'home';

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#25344A] flex flex-col font-sans antialiased">
      {isLandingPage ? (
        /* Full-Width Landing Page Experience (Screen 1) */
        <div className="flex flex-col min-h-screen">
          <Navbar
            currentUser={currentUser}
            activeTab={activeTab}
            onNavigate={handleNavigate}
            onRoleSwitch={handleRoleSwitch}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
          />

          <main className="flex-1 w-full">
            <HomeView
              onNavigate={handleNavigate}
              onOpenResource={(res) => {
                setSelectedResource(res);
                setActiveTab('resource_detail');
              }}
              onStartQuiz={(qId) => {
                const target = quizzes.find((q) => q.id === qId) || quizzes[0];
                handleSelectQuizForInstructions(target);
              }}
              onStartCustomDrill={handleStartCustomDrill}
              featuredResources={resources.filter((r) => r.isFeatured || r.viewCount > 8000)}
              activeQuizzes={quizzes}
              activePolls={polls}
              sampleQuestions={questionService.getAll()}
            />
          </main>

          <Footer onNavigate={handleNavigate} />
        </div>
      ) : (
        /* Inner Learning Portal Experience with Sidebar (Screens 2-20) */
        <div className="flex-1 flex w-full min-w-0">
          {/* The persistent navigation is reserved for desktop widths. */}
          <div className="hidden lg:flex shrink-0">
            <Sidebar
              activeTab={activeTab}
              onNavigate={handleNavigate}
              currentUser={effectiveUser}
              onRoleSwitch={handleRoleSwitch}
            />
          </div>

          {/* On phones and tablets, navigation becomes an overlay so it never squeezes the lesson content. */}
          {mobileSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <button
                type="button"
                aria-label="Close navigation menu"
                className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <div className="relative z-10 h-full w-[min(18rem,86vw)] shadow-2xl">
                <Sidebar
                  activeTab={activeTab}
                  onNavigate={handleNavigate}
                  currentUser={effectiveUser}
                  onRoleSwitch={handleRoleSwitch}
                />
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col min-w-0 bg-[#F5F7FA]">
            <TopHeader
              currentUser={effectiveUser}
              onNavigate={handleNavigate}
              onSearch={(query) => handleNavigate('resources', query)}
              onRoleSwitch={handleRoleSwitch}
              onMenuToggle={() => setMobileSidebarOpen(true)}
            />

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 overflow-x-hidden">
              {/* Screen 2: Notes & Resources */}
              {activeTab === 'resources' && (
                <ResourcesView
                  resources={resources}
                  onSelectResource={(res) => {
                    setSelectedResource(res);
                    setActiveTab('resource_detail');
                  }}
                  onOpenPreviewModal={(res) => setPreviewModalResource(res)}
                  initialSearch={searchParam}
                />
              )}

            {/* Screen 3: Resource Detail & Preview */}
            {activeTab === 'resource_detail' && selectedResource && (
              <ResourceDetailView
                resource={selectedResource}
                allResources={resources}
                onBack={() => setActiveTab('resources')}
                onSelectResource={(res) => setSelectedResource(res)}
                onOpenPreviewModal={(res) => setPreviewModalResource(res)}
              />
            )}

            {/* Screen 4: Quiz Arena */}
            {activeTab === 'quizzes' && (
              <QuizArenaView
                quizzes={quizzes}
                onSelectQuizForInstructions={handleSelectQuizForInstructions}
              />
            )}

            {/* Screen 5: Quiz Instructions */}
            {activeTab === 'quiz_instructions' && selectedQuiz && (
              <QuizInstructionsView
                quiz={selectedQuiz}
                onBack={() => setActiveTab('quizzes')}
                onStart={() => handleStartLiveQuiz(selectedQuiz)}
              />
            )}

            {/* Screen 6: Live Quiz */}
            {activeTab === 'live_quiz' && selectedQuiz && (
              <LiveQuizView
                quiz={selectedQuiz}
                questions={activeTestQuestions}
                onComplete={handleQuizCompleted}
                onExit={() => setActiveTab('quizzes')}
              />
            )}

            {/* Screen 7: Quiz Results and Explanations */}
            {activeTab === 'quiz_results' && latestAttempt && (
              <QuizResultsView
                attempt={latestAttempt}
                questions={questionService.getAll().filter((q) => latestAttempt.answers[q.id] !== undefined || (selectedQuiz && selectedQuiz.questionIds.includes(q.id)))}
                onRetryIncorrect={(incorrectQs) => handleStartCustomDrill(incorrectQs, `Retest: ${latestAttempt.quizTitle} Missed Items`)}
                onBackToArena={() => setActiveTab('quizzes')}
              />
            )}

            {/* Screen 8 & 9: Polls and Voting & Results */}
            {activeTab === 'polls' && (
              <PollsView
                polls={polls}
                onPollVoted={refreshAllData}
                isAdmin={effectiveUser.role === 'super_admin'}
              />
            )}

            {/* Screen 10: Aptitude Practice */}
            {activeTab === 'practice_aptitude' && (
              <AptitudePracticeView
                onStartCustomDrill={handleStartCustomDrill}
              />
            )}

            {/* Screen 11: Logical Reasoning Practice */}
            {activeTab === 'practice_reasoning' && (
              <LogicalReasoningView
                onStartCustomDrill={handleStartCustomDrill}
              />
            )}

            {/* Practice: Verbal Ability */}
            {activeTab === 'practice_verbal' && (
              <VerbalPracticeView
                onStartCustomDrill={handleStartCustomDrill}
              />
            )}

            {/* Practice: Technical Practice */}
            {activeTab === 'practice_technical' && (
              <TechnicalPracticeView
                onStartCustomDrill={handleStartCustomDrill}
              />
            )}

            {/* Practice Master Router */}
            {activeTab === 'practice' && (
              <AptitudePracticeView
                onStartCustomDrill={handleStartCustomDrill}
              />
            )}

            {/* Screen 12: Current Affairs */}
            {activeTab === 'current_affairs' && (
              <CurrentAffairsView
                items={currentAffairs}
              />
            )}

            {/* Screen 13: Daily Challenge */}
            {activeTab === 'daily_challenge' && (
              <DailyChallengeView
                currentUser={effectiveUser}
                onStartChallenge={handleStartCustomDrill}
              />
            )}

            {/* Screen 14: Leaderboard */}
            {activeTab === 'leaderboard' && (
              <LeaderboardView
                entries={leaderboard}
                currentUser={effectiveUser}
              />
            )}

            {/* Screen 15: My Learning Dashboard */}
            {activeTab === 'dashboard' && (
              <DashboardView
                currentUser={effectiveUser}
                recentAttempts={attempts}
                onNavigate={handleNavigate}
                onResumePractice={(topic) => {
                  const qPool = questionService.getAll();
                  handleStartCustomDrill(qPool.slice(0, 5), `Resume: ${topic}`);
                }}
              />
            )}

            {/* Screen 18: Mistake Book */}
            {activeTab === 'mistakes' && (
              <MistakeBookView
                mistakes={mistakes}
                onStartRetest={(qs) => handleStartCustomDrill(qs, 'Mistake Book Retest Drill')}
                onRefresh={refreshAllData}
              />
            )}

            {/* Screen 18: Bookmarks */}
            {activeTab === 'bookmarks' && (
              <BookmarksView
                bookmarks={bookmarks}
                resources={resources}
                onOpenResource={(res) => {
                  setSelectedResource(res);
                  setActiveTab('resource_detail');
                }}
                onRefresh={refreshAllData}
              />
            )}

            {/* Screen 19: Profile and Settings */}
            {(activeTab === 'profile' || activeTab === 'settings') && (
              <ProfileView
                currentUser={effectiveUser}
                onUpdateUser={(updated) => {
                  setCurrentUser(updated);
                  refreshAllData();
                }}
                onResetData={handleResetData}
              />
            )}

            {/* Screen 20: Admin Dashboard */}
            {activeTab === 'admin' && (
              <AdminDashboardView
                resources={resources}
                quizzes={quizzes}
                polls={polls}
                auditLogs={auditLogs}
                onRefresh={refreshAllData}
              />
            )}

            {/* Screen 20 (Public): About, Contact, Privacy, Terms */}
            {(activeTab === 'about' || activeTab === 'contact' || activeTab === 'privacy' || activeTab === 'terms') && (
              <AboutLegalView
                initialTab={activeTab as any}
              />
            )}
          </main>

          {/* Footer Component */}
          <Footer onNavigate={handleNavigate} />
        </div>
      </div>
      )}

      {/* PDF / Manuscript Preview Modal */}
      {previewModalResource && (
        <PdfPreviewModal
          resource={previewModalResource}
          onClose={() => setPreviewModalResource(null)}
          onUpdate={refreshAllData}
        />
      )}

      {/* Authentication Modal for Login / Sign Up */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}
