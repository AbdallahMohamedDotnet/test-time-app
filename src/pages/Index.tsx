import React, { useState } from 'react';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import ExamPage from '@/components/ExamPage';
import ResultPage from '@/components/ResultPage';
import AddUser from '@/components/AddUser';

type AppState = 'login' | 'dashboard' | 'exam' | 'result' | 'addUser';
type UserType = 'user' | 'admin';

interface ExamResult {
  examId: string;
  answers: Record<string, number>;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
}

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('login');
  const [userType, setUserType] = useState<UserType>('user');
  const [currentExamId, setCurrentExamId] = useState<string>('');
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  const handleLogin = (type: UserType) => {
    setUserType(type);
    setCurrentState('dashboard');
  };

  const handleStartExam = (examId: string) => {
    setCurrentExamId(examId);
    setCurrentState('exam');
  };

  const handleSubmitExam = (result: ExamResult) => {
    setExamResult(result);
    setCurrentState('result');
  };

  const handleBackToDashboard = () => {
    setCurrentState('dashboard');
  };

  const handleLogout = () => {
    setCurrentState('login');
    setUserType('user');
    setCurrentExamId('');
    setExamResult(null);
  };

  const handleAddUser = () => {
    setCurrentState('addUser');
  };

  const handleRetakeExam = () => {
    setCurrentState('exam');
  };

  switch (currentState) {
    case 'login':
      return <Login onLogin={handleLogin} />;
    
    case 'dashboard':
      return (
        <Dashboard
          userType={userType}
          onStartExam={handleStartExam}
          onLogout={handleLogout}
          onAddUser={handleAddUser}
        />
      );
    
    case 'exam':
      return (
        <ExamPage
          examId={currentExamId}
          onSubmitExam={handleSubmitExam}
          onBackToDashboard={handleBackToDashboard}
        />
      );
    
    case 'result':
      return examResult ? (
        <ResultPage
          examResult={examResult}
          onBackToDashboard={handleBackToDashboard}
          onRetakeExam={handleRetakeExam}
        />
      ) : null;
    
    case 'addUser':
      return <AddUser onBackToDashboard={handleBackToDashboard} />;
    
    default:
      return <Login onLogin={handleLogin} />;
  }
};

export default Index;