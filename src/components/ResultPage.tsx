import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, CheckCircle, XCircle, Home, RotateCcw } from 'lucide-react';

interface ResultPageProps {
  examResult: {
    examId: string;
    answers: Record<string, number>;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
  };
  onBackToDashboard: () => void;
  onRetakeExam: () => void;
}

export default function ResultPage({ examResult, onBackToDashboard, onRetakeExam }: ResultPageProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const { score, totalQuestions, correctAnswers, timeSpent } = examResult;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const isPassed = score >= 60;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  useEffect(() => {
    // Animate score counter
    const duration = 2000; // 2 seconds
    const increment = score / (duration / 50);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
        setTimeout(() => setShowDetails(true), 500);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [score]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'success' };
    if (score >= 80) return { level: 'Good', color: 'success' };
    if (score >= 70) return { level: 'Average', color: 'warning' };
    if (score >= 60) return { level: 'Pass', color: 'warning' };
    return { level: 'Needs Improvement', color: 'destructive' };
  };

  const performance = getPerformanceLevel(score);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${isPassed ? 'bg-success/20' : 'bg-destructive/20'}`}>
              <Trophy className={`h-12 w-12 ${isPassed ? 'text-success' : 'text-destructive'}`} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isPassed ? 'Congratulations!' : 'Keep Learning!'}
          </h1>
          <p className="text-white/80">
            JavaScript Fundamentals Exam Results
          </p>
        </div>

        {/* Score Card */}
        <Card className="mb-8 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Final Score</CardTitle>
            <CardDescription>
              Here's how you performed on the exam
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
                {animatedScore}%
              </div>
              <Badge 
                variant={performance.color as any}
                className="text-lg px-4 py-1"
              >
                {performance.level}
              </Badge>
            </div>

            <div className="mb-6">
              <div className="flex justify-center mb-2">
                <span className="text-sm text-muted-foreground">
                  {isPassed ? 'Passed' : 'Failed'} • Passing score: 60%
                </span>
              </div>
              <Progress value={animatedScore} className="h-3" />
            </div>

            {showDetails && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <div className="text-2xl font-bold text-success">{correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <div className="text-2xl font-bold text-destructive">{incorrectAnswers}</div>
                  <div className="text-sm text-muted-foreground">Incorrect Answers</div>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Clock className="h-8 w-8 text-warning" />
                  </div>
                  <div className="text-2xl font-bold text-warning">{formatTime(timeSpent)}</div>
                  <div className="text-sm text-muted-foreground">Time Spent</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Results */}
        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Questions</span>
                  <span className="font-semibold">{totalQuestions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Correct Answers</span>
                  <span className="font-semibold text-success">{correctAnswers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Accuracy Rate</span>
                  <span className="font-semibold">{accuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status</span>
                  <Badge variant={isPassed ? 'success' : 'destructive'}>
                    {isPassed ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isPassed ? (
                  <>
                    <p className="text-sm text-success">
                      Great job! You've demonstrated a solid understanding of JavaScript fundamentals.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Consider taking more advanced exams to further improve your skills.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-destructive">
                      You need to improve your understanding of JavaScript concepts.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We recommend reviewing the study materials and retaking the exam.
                    </p>
                  </>
                )}
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    Focus on areas where you struggled and practice more examples.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        {showDetails && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onBackToDashboard}
              variant="outline"
              size="lg"
              className="bg-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button
              onClick={onRetakeExam}
              variant="default"
              size="lg"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Exam
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}