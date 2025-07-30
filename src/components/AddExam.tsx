import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { BookOpen, ArrowLeft, Plus, Trash2, Clock, Target } from 'lucide-react';

interface AddExamProps {
  onBackToDashboard: () => void;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

interface ExamForm {
  title: string;
  description: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  questions: Question[];
}

export default function AddExam({ onBackToDashboard }: AddExamProps) {
  const [examForm, setExamForm] = useState<ExamForm>({
    title: '',
    description: '',
    duration: 30,
    difficulty: 'Easy',
    category: '',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    category: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const validateExamForm = () => {
    if (!examForm.title.trim()) {
      toast({ title: "Error", description: "Exam title is required", variant: "destructive" });
      return false;
    }
    if (!examForm.description.trim()) {
      toast({ title: "Error", description: "Exam description is required", variant: "destructive" });
      return false;
    }
    if (!examForm.category.trim()) {
      toast({ title: "Error", description: "Exam category is required", variant: "destructive" });
      return false;
    }
    if (examForm.questions.length < 5) {
      toast({ title: "Error", description: "Exam must have at least 5 questions", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateQuestion = () => {
    if (!currentQuestion.text.trim()) {
      toast({ title: "Error", description: "Question text is required", variant: "destructive" });
      return false;
    }
    if (!currentQuestion.category.trim()) {
      toast({ title: "Error", description: "Question category is required", variant: "destructive" });
      return false;
    }
    if (currentQuestion.options.some(option => !option.trim())) {
      toast({ title: "Error", description: "All answer options must be filled", variant: "destructive" });
      return false;
    }
    return true;
  };

  const addQuestion = () => {
    if (!validateQuestion()) return;

    const newQuestion: Question = {
      id: Date.now().toString(),
      text: currentQuestion.text,
      options: [...currentQuestion.options],
      correctAnswer: currentQuestion.correctAnswer,
      category: currentQuestion.category
    };

    setExamForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    // Reset current question form
    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      category: ''
    });

    toast({ title: "Success", description: "Question added successfully!" });
  };

  const removeQuestion = (questionId: string) => {
    setExamForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    toast({ title: "Question Removed", description: "Question has been deleted" });
  };

  const handleSubmitExam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateExamForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({ 
      title: "Success", 
      description: `Exam "${examForm.title}" has been created successfully!` 
    });

    setIsLoading(false);
    onBackToDashboard();
  };

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
              <Button variant="ghost" size="sm" onClick={onBackToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold">Create New Exam</h1>
                <p className="text-sm text-muted-foreground">Design and configure a new examination</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exam Configuration */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Exam Details
                </CardTitle>
                <CardDescription>
                  Configure the basic exam information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., JavaScript Fundamentals"
                    value={examForm.title}
                    onChange={(e) => setExamForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the exam content"
                    value={examForm.description}
                    onChange={(e) => setExamForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Programming, Frontend, Backend"
                    value={examForm.category}
                    onChange={(e) => setExamForm(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="10"
                      max="180"
                      value={examForm.duration}
                      onChange={(e) => setExamForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={examForm.difficulty} onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setExamForm(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Exam Summary */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-3">Exam Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span className="font-medium">{examForm.questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{examForm.duration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <Badge variant={getDifficultyColor(examForm.difficulty) as any}>
                        {examForm.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmitExam}
                  className="w-full" 
                  disabled={isLoading || examForm.questions.length < 5}
                  size="lg"
                >
                  {isLoading ? 'Creating Exam...' : 'Create Exam'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Question Builder */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Add Question Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Question
                  </CardTitle>
                  <CardDescription>
                    Create multiple choice questions for your exam
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="questionText">Question Text</Label>
                    <Textarea
                      id="questionText"
                      placeholder="Enter your question here..."
                      value={currentQuestion.text}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="questionCategory">Question Category</Label>
                    <Input
                      id="questionCategory"
                      placeholder="e.g., Variables, Functions, Arrays"
                      value={currentQuestion.category}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Answer Options</Label>
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={currentQuestion.correctAnswer === index}
                            onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                            className="text-primary"
                          />
                          <Label className="text-sm">Option {index + 1}</Label>
                        </div>
                        <Input
                          placeholder={`Enter option ${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options];
                            newOptions[index] = e.target.value;
                            setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                          }}
                          className="flex-1"
                        />
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground">
                      Select the radio button next to the correct answer
                    </p>
                  </div>

                  <Button onClick={addQuestion} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </CardContent>
              </Card>

              {/* Questions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Questions ({examForm.questions.length})</CardTitle>
                  <CardDescription>
                    Review and manage your exam questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {examForm.questions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No questions added yet</p>
                      <p className="text-sm">Add at least 5 questions to create the exam</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {examForm.questions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">Q{index + 1}</Badge>
                              <Badge variant="secondary">{question.category}</Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeQuestion(question.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="font-medium mb-3">{question.text}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`p-2 rounded text-sm ${
                                  optionIndex === question.correctAnswer
                                    ? 'bg-success-light text-success-foreground font-medium'
                                    : 'bg-muted'
                                }`}
                              >
                                {optionIndex + 1}. {option}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}