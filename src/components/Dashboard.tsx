import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Trophy, LogOut } from 'lucide-react';

interface DashboardProps {
  userType: 'user' | 'admin';
  onStartExam: (examId: string) => void;
  onLogout: () => void;
  onAddUser: () => void;
  onAddExam: () => void;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  completed?: boolean;
  score?: number;
}

const mockExams: Exam[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics, variables, functions, and ES6 features.',
    duration: 30,
    totalQuestions: 15,
    difficulty: 'Easy',
    category: 'Programming',
  },
  {
    id: '2',
    title: 'React Development',
    description: 'Advanced React concepts including hooks, context, and performance optimization.',
    duration: 45,
    totalQuestions: 20,
    difficulty: 'Medium',
    category: 'Frontend',
  },
  {
    id: '3',
    title: 'Database Design',
    description: 'SQL queries, database normalization, and relational database concepts.',
    duration: 60,
    totalQuestions: 25,
    difficulty: 'Hard',
    category: 'Backend',
    completed: true,
    score: 85,
  },
  {
    id: '4',
    title: 'CSS & Styling',
    description: 'Modern CSS, Flexbox, Grid, and responsive design principles.',
    duration: 40,
    totalQuestions: 18,
    difficulty: 'Medium',
    category: 'Frontend',
  },
];

export default function Dashboard({ userType, onStartExam, onLogout, onAddUser, onAddExam }: DashboardProps) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // Simulate API call
    const loadExams = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setExams(mockExams);
      
      setStats({
        totalExams: mockExams.length,
        totalUsers: 0
      });
    };

    loadExams();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ExamPro Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {userType === 'admin' ? 'Administrator Panel' : 'Student Portal'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {userType === 'admin' && (
                <>
                  <Button onClick={onAddUser} variant="outline">
                    Add User
                  </Button>
                  <Button onClick={onAddExam} variant="default">
                    Add Exam
                  </Button>
                </>
              )}
              <Button onClick={onLogout} variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Exams</p>
                  <p className="text-2xl font-bold">{stats.totalExams}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Exams</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalExams}</p>
                </div>
                <Trophy className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exams Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Exams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <Badge variant={getDifficultyColor(exam.difficulty) as any}>
                      {exam.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {exam.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {exam.duration} min
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {exam.totalQuestions} questions
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{exam.category}</Badge>
                      {exam.completed && (
                        <div className="text-sm text-success font-medium">
                          Score: {exam.score}%
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={() => onStartExam(exam.id)}
                      className="w-full"
                      variant={exam.completed ? "outline" : "default"}
                    >
                      {exam.completed ? 'Retake Exam' : 'Start Exam'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}