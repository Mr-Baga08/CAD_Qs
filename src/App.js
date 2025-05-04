// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Updated API paths for Vercel deployment
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

    // ... rest of LoginForm component remains the same
    return (
      // Previous LoginForm JSX with same structure
      <div className="auth-container">
        {/* ... existing JSX ... */}
      </div>
    );
  };

  // Quiz Component  
  const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(30 * 60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startTime] = useState(Date.now());

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
    }, []);

    // ... rest of Quiz component remains the same
    
    const submitQuiz = async () => {
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
    };

    // ... rest of Quiz component JSX
  };

  // Results Component
  const Results = () => {
    // ... similar pattern with updated API routes

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

    // ... rest of Results component
  };

  // AdminDashboard Component
  const AdminDashboard = () => {
    const [results, setResults] = useState([]);
    const [feedback, setFeedback] = useState([]);
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
    }, []);

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

    // Question management functions
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

    // ... rest of AdminDashboard component
  };

  // ... rest of the App component remains the same

  return (
    <div className="app-container">
      {/* ... existing JSX structure ... */}
    </div>
  );
};

export default App;