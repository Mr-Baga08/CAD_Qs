// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Load user from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(userData));
      setCurrentPage(JSON.parse(userData).role === 'admin' ? 'adminDashboard' : 'instructions');
    }
  }, []);

  // Login Component
  const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerData, setRegisterData] = useState({
      name: '',
      rollNumber: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });

    const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        const response = await axios.post('/api/auth/login', formData);
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        setCurrentPage(user.role === 'admin' ? 'adminDashboard' : 'instructions');
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      } finally {
        setIsLoading(false);
      }
    };

    const handleRegister = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      // Validate passwords match
      if (registerData.password !== registerData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post('/api/auth/register', registerData);
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        setCurrentPage('instructions');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${!isRegistering ? 'active' : ''}`}
              onClick={() => setIsRegistering(false)}
            >
              Login
            </button>
            <button 
              className={`auth-tab ${isRegistering ? 'active' : ''}`}
              onClick={() => setIsRegistering(true)}
            >
              Register
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {!isRegistering ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <h2>Login to Your Account</h2>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              
              <p className="demo-creds">
                <strong>Demo Credentials:</strong><br />
                Admin: admin@example.com / admin123<br />
              </p>
              
              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              <h2>Create New Account</h2>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="rollNumber">Roll Number</label>
                <input
                  type="text"
                  id="rollNumber"
                  value={registerData.rollNumber}
                  onChange={(e) => setRegisterData({...registerData, rollNumber: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="regEmail">Email</label>
                <input
                  type="email"
                  id="regEmail"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="regPassword">Password</label>
                <input
                  type="password"
                  id="regPassword"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                  required
                />
              </div>
              
              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  // Instructions Component
  const Instructions = () => {
    return (
      <div className="instructions-container">
        <h2>Test Instructions</h2>
        
        <div className="instruction-card">
          <h3>Coronary Artery Disease (CAD) Assessment</h3>
          
          <ul className="instruction-list">
            <li>This assessment contains 50 multiple-choice questions.</li>
            <li>You have 30 minutes to complete the test.</li>
            <li>Each question has 4 options, select the most appropriate answer.</li>
            <li>You can navigate between questions using the Previous and Next buttons.</li>
            <li>A progress bar will show how many questions you have answered.</li>
            <li>The test will automatically submit when the timer runs out.</li>
            <li>You can submit the test earlier if you finish before the time limit.</li>
          </ul>
          
          <p className="important-note">
            <strong>Important:</strong> Once you start the test, you cannot pause the timer. Make sure you have a stable internet connection.
          </p>
          
          <button onClick={() => setCurrentPage('test')} className="start-button">
            Start Test
          </button>
        </div>
      </div>
    );
  };

  // Quiz Component
  const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startTime] = useState(Date.now());

    const submitQuiz = useCallback(async () => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      try {
        const response = await axios.post('/api/quiz/submit', {
          answers: userAnswers,
          timeSpent
        });

        localStorage.setItem('quizResult', JSON.stringify(response.data));
        setCurrentPage('results');
      } catch (err) {
        setError('Failed to submit quiz');
        setIsSubmitting(false);
      }
    }, [isSubmitting, startTime, userAnswers, setError, setCurrentPage]);

    useEffect(() => {
      const fetchQuestions = async () => {
        try {
          const response = await axios.get('/api/quiz/questions');
          setQuestions(response.data.questions);
          setUserAnswers(Array(response.data.questions.length).fill(null));
        } catch (err) {
          setError('Failed to load questions');
        }
      };

      fetchQuestions();
    }, [setError]);

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, [submitQuiz]);

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const calculateProgress = () => {
      const answeredCount = userAnswers.filter(answer => answer !== null).length;
      return (answeredCount / questions.length) * 100;
    };

    const handleAnswerSelect = (questionIndex, optionIndex) => {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[questionIndex] = optionIndex;
      setUserAnswers(updatedAnswers);
    };

    const goToQuestion = (index) => {
      setCurrentQuestionIndex(index);
    };

    if (!questions.length) {
      return <div className="loading">Loading questions...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="test-container">
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${calculateProgress()}%` }}></div>
          </div>
          <div className="progress-stats">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(calculateProgress())}% Complete</span>
          </div>
        </div>
        
        <div className="question-card">
          <h3>Question {currentQuestionIndex + 1}</h3>
          <p className="question-text">{currentQuestion.question}</p>
          
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <div className="option" key={index}>
                <input
                  type="radio"
                  id={`option-${index}`}
                  name={`question-${currentQuestionIndex}`}
                  checked={userAnswers[currentQuestionIndex] === index}
                  onChange={() => handleAnswerSelect(currentQuestionIndex, index)}
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="navigation-buttons">
          <button 
            onClick={() => goToQuestion(currentQuestionIndex - 1)} 
            disabled={currentQuestionIndex === 0}
            className="nav-button"
          >
            Previous
          </button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <button onClick={() => goToQuestion(currentQuestionIndex + 1)} className="nav-button">
              Next
            </button>
          ) : (
            <button onClick={submitQuiz} className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </button>
          )}
        </div>
        
        <div className="question-navigator">
          <h4>Question Navigator</h4>
          <div className="navigator-grid">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`navigator-button ${index === currentQuestionIndex ? 'current' : ''} ${userAnswers[index] !== null ? 'answered' : ''}`}
                onClick={() => goToQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="timer">
            Time Remaining: {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    );
  };

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('quizResult');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCurrentPage('login');
  }, []);

  // Results Component
  const Results = () => {
    const [quizResult, setQuizResult] = useState(null);
    const [feedbackData, setFeedbackData] = useState({
      experience: 3,
      clarity: 3,
      suggestions: '',
      recommend: 'Yes'
    });
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    useEffect(() => {
      const result = localStorage.getItem('quizResult');
      if (result) {
        setQuizResult(JSON.parse(result));
      }
    }, []);

    const handleFeedbackSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        await axios.post('/api/feedback/submit', feedbackData);
        setFeedbackSubmitted(true);
        
        setTimeout(() => {
          handleLogout();
        }, 3000);
      } catch (err) {
        setError('Failed to submit feedback');
      } finally {
        setIsLoading(false);
      }
    };

    if (!quizResult) {
      return <div className="loading">Loading results...</div>;
    }

    return (
      <div className="results-container">
        <div className="results-card">
          <h2>Test Results</h2>
          
          <div className="score-display">
            <div className="score-circle">
              <span className="score-value">{Math.round(quizResult.score)}%</span>
            </div>
            <p className="score-text">
              You got {Math.round(quizResult.score / 2)} out of 50 questions correct
            </p>
          </div>
        </div>
        
        <div className="feedback-card">
          <h2>Feedback for Instructor: Dr. Barsa Priyadarshini</h2>
          
          {feedbackSubmitted ? (
            <div className="feedback-success">
              <h3>Thank you for your feedback!</h3>
              <p>Your feedback has been submitted successfully. You'll be redirected to the login page shortly.</p>
            </div>
          ) : (
            <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
              <div className="form-group">
                <label>Overall Experience</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(value => (
                    <label key={value} className="rating-label">
                      <input
                        type="radio"
                        name="experience"
                        value={value}
                        checked={feedbackData.experience === value}
                        onChange={() => setFeedbackData({...feedbackData, experience: value})}
                      />
                      <span>{value}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Clarity of Questions</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(value => (
                    <label key={value} className="rating-label">
                      <input
                        type="radio"
                        name="clarity"
                        value={value}
                        checked={feedbackData.clarity === value}
                        onChange={() => setFeedbackData({...feedbackData, clarity: value})}
                      />
                      <span>{value}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="suggestions">Suggestions for improvement</label>
                <textarea
                  id="suggestions"
                  value={feedbackData.suggestions}
                  onChange={(e) => setFeedbackData({...feedbackData, suggestions: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label>Would you recommend this quiz to peers?</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="recommend"
                      value="Yes"
                      checked={feedbackData.recommend === 'Yes'}
                      onChange={() => setFeedbackData({...feedbackData, recommend: 'Yes'})}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="recommend"
                      value="No"
                      checked={feedbackData.recommend === 'No'}
                      onChange={() => setFeedbackData({...feedbackData, recommend: 'No'})}
                    />
                    No
                  </label>
                </div>
              </div>
              
              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  // Admin Dashboard Component
  const AdminDashboard = () => {
    const [results, setResults] = useState([]);
    const [setFeedback] = useState([]);
    const [feedbackStats, setFeedbackStats] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [showQuestionManager, setShowQuestionManager] = useState(false);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
      const fetchAdminData = async () => {
        try {
          const [resultsRes, feedbackRes, questionsRes] = await Promise.all([
            axios.get('/api/admin/results'),
            axios.get('/api/admin/feedback'),
            axios.get('/api/admin/questions/get')
          ]);

          setResults(resultsRes.data.results);
          setFeedback(feedbackRes.data.feedback);
          setFeedbackStats(feedbackRes.data.stats);
          setQuestions(questionsRes.data.questions);
        } catch (err) {
          setError('Failed to load admin data');
        }
      };

      fetchAdminData();
    }, [setError]);

    const exportResults = async () => {
      setIsExporting(true);
      try {
        const response = await axios.get('/api/admin/export-results', {
          responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'quiz_results.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        setError('Failed to export results');
      } finally {
        setIsExporting(false);
      }
    };

    const importQuestions = async (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const questionsData = JSON.parse(event.target.result);
          await axios.post('/api/admin/questions/import', { questions: questionsData });
          setMessage('Questions imported successfully');
          // Refresh questions
          const response = await axios.get('/api/admin/questions/get');
          setQuestions(response.data.questions);
        } catch (err) {
          setError('Failed to import questions');
        }
      };
      
      reader.readAsText(file);
    };

    const exportQuestions = () => {
      const dataStr = JSON.stringify(questions, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'questions.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    return (
      <div className="admin-container">
        <h2>Administrator Dashboard</h2>
        
        <div className="admin-controls">
          <button onClick={() => setShowQuestionManager(!showQuestionManager)} className="nav-button">
            {showQuestionManager ? 'Hide Question Manager' : 'Show Question Manager'}
          </button>
          <button onClick={exportResults} className="export-button" disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export Results (CSV)'}
          </button>
        </div>

        {showQuestionManager && (
          <div className="question-manager">
            <h3>Question Management</h3>
            <div className="question-controls">
              <div className="import-section">
                <label className="import-button">
                  Import Questions (JSON)
                  <input
                    type="file"
                    accept=".json"
                    onChange={importQuestions}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <button onClick={exportQuestions} className="export-button">
                Export Questions (JSON)
              </button>
            </div>
            
            <div className="question-stats">
              <p>Total Questions: {questions.length}</p>
              <p>Easy: {questions.filter(q => q.difficulty === 'easy').length}</p>
              <p>Medium: {questions.filter(q => q.difficulty === 'medium').length}</p>
              <p>Hard: {questions.filter(q => q.difficulty === 'hard').length}</p>
            </div>
          </div>
        )}
        
        {feedbackStats && (
          <div className="feedback-stats">
            <h3>Feedback Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Average Experience Rating:</span>
                <span className="stat-value">{feedbackStats.avgExperience.toFixed(1)}/5</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Average Clarity Rating:</span>
                <span className="stat-value">{feedbackStats.avgClarity.toFixed(1)}/5</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Would Recommend:</span>
                <span className="stat-value">{feedbackStats.recommendPercentage.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="results-table-container">
          <h3>Student Results</h3>
          <table className="results-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Email</th>
                <th>Score</th>
                <th>Completion Date</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((result, index) => (
                  <tr key={index}>
                    <td>{result.userId.name}</td>
                    <td>{result.userId.rollNumber}</td>
                    <td>{result.userId.email}</td>
                    <td>{result.score}%</td>
                    <td>{new Date(result.completedAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">No results found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginForm />;
      case 'instructions':
        return <Instructions />;
      case 'test':
        return <Quiz />;
      case 'results':
        return <Results />;
      case 'adminDashboard':
        return <AdminDashboard />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>CAD Medical Quiz Portal</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            {currentPage === 'test' && (
              <div className="timer">
                Time Remaining: {formatTime(30 * 60)}
              </div>
            )}
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </header>
      <main className="app-main">
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        {renderCurrentPage()}
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} CAD Medical Quiz Portal</p>
      </footer>
    </div>
  );
};

export default App;
