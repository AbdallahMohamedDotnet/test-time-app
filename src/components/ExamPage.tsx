import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExamPageProps {
  examId: string;
  onSubmitExam: (results: ExamResult) => void;
  onBackToDashboard: () => void;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

interface ExamResult {
  examId: string;
  answers: Record<string, number>;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
}

const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'What is the correct way to declare a variable in JavaScript ES6?',
    options: ['var myVar = 5;', 'let myVar = 5;', 'const myVar = 5;', 'All of the above'],
    correctAnswer: 3,
    category: 'Variables'
  },
  {
    id: '2',
    text: 'Which method is used to add an element to the end of an array?',
    options: ['push()', 'pop()', 'shift()', 'unshift()'],
    correctAnswer: 0,
    category: 'Arrays'
  },
  {
    id: '3',
    text: 'What does the "this" keyword refer to in JavaScript?',
    options: ['The global object', 'The current function', 'The object that calls the function', 'It depends on the context'],
    correctAnswer: 3,
    category: 'Functions'
  },
  {
    id: '4',
    text: 'Which of the following is NOT a primitive data type in JavaScript?',
    options: ['string', 'number', 'object', 'boolean'],
    correctAnswer: 2,
    category: 'Data Types'
  },
  {
    id: '5',
    text: 'What is the purpose of the useState hook in React?',
    options: ['To manage component state', 'To handle side effects', 'To create refs', 'To optimize performance'],
    correctAnswer: 0,
    category: 'React Hooks'
  }
];

export default function ExamPage({ examId, onSubmitExam, onBackToDashboard }: ExamPageProps) {
  const [questions] = useState<Question[]>(mockQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: parseInt(value)
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Calculate score
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const timeSpent = (30 * 60) - timeLeft;

    const result: ExamResult = {
      examId,
      answers,
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Exam Submitted",
      description: `Your exam has been submitted successfully. Score: ${score}%`
    });

    onSubmitExam(result);
  };

  const answeredQuestions = Object.keys(answers).length;
  const timeWarning = timeLeft < 300; // Less than 5 minutes

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onBackToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-bold">JavaScript Fundamentals</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className={`h-4 w-4 ${timeWarning ? 'text-destructive' : 'text-muted-foreground'}`} />
                <span className={`font-mono ${timeWarning ? 'text-destructive font-bold' : 'text-foreground'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{answeredQuestions}/{questions.length} answered</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">
                Question {currentQuestionIndex + 1}
              </CardTitle>
              <Badge variant="outline">{currentQuestion.category}</Badge>
            </div>
            <CardDescription className="text-base text-foreground mt-4">
              {currentQuestion.text}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion.id]?.toString() || ''}
              onValueChange={handleAnswerChange}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-3">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                variant="success"
                size="lg"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </Button>
            ) : (
              <Button
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-3">Quick Navigation</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={
                  index === currentQuestionIndex 
                    ? "default" 
                    : answers[questions[index].id] !== undefined 
                      ? "success" 
                      : "outline"
                }
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className="h-8 w-8 p-0"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}