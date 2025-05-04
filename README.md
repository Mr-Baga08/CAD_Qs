# CAD Medical Quiz Portal - Vercel Deployment

A responsive web application designed for medical students to take a timed multiple-choice test on Coronary Artery Disease (CAD).

## 🚀 Deploying to Vercel

### Prerequisites

1. MongoDB Atlas account and cluster
2. GitHub repository
3. Vercel account

### Deployment Steps

#### 1. Prepare Your Repository

1. Clone this repository to your GitHub account
2. Make sure all files are structured as shown in the project structure below

#### 2. Deploy to Vercel

1. Visit [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the following settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`

6. Click "Deploy"

#### 3. Configure MongoDB Atlas

1. In MongoDB Atlas, add Vercel's IP range to your network access list
2. Or better yet, use `0.0.0.0/0` for testing (restrict in production)

## 📁 Project Structure

```
cad-medical-quiz-portal/
├── api/                      # Serverless functions
│   ├── auth/
│   │   ├── login.js
│   │   └── register.js
│   ├── quiz/
│   │   ├── questions.js
│   │   └── submit.js
│   ├── feedback/
│   │   └── submit.js
│   └── admin/
│       ├── results.js
│       ├── feedback.js
│       ├── export-results.js
│       └── questions/
│           ├── get.js
│           ├── import.js
│           ├── update.js
│           └── delete.js
├── lib/                      # Shared utilities
│   ├── db.js
│   ├── middleware.js
│   ├── models/
│   │   ├── user.js
│   │   ├── question.js
│   │   ├── quiz-result.js
│   │   └── feedback.js
│   └── questions-data.js
├── src/                      # React frontend
│   ├── App.js
│   ├── App.css
│   └── index.js
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── vercel.json
└── next.config.js
```

## 🔧 Local Development

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd cad-medical-quiz-portal
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create `.env.local` file
   ```bash
   cp .env.example .env.local
   ```
   
4. Update environment variables in `.env.local`

5. Run development server
   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3000`

## 🛠️ Technologies

- **Frontend**: React.js
- **Backend**: Node.js with Vercel Serverless Functions
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Deployment**: Vercel

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Quiz
- `GET /api/quiz/questions` - Get random questions
- `POST /api/quiz/submit` - Submit quiz answers

### Feedback
- `POST /api/feedback/submit` - Submit feedback

### Admin
- `GET /api/admin/results` - Get all quiz results
- `GET /api/admin/feedback` - Get all feedback
- `GET /api/admin/export-results` - Export results as CSV
- `GET /api/admin/questions/get` - Get all questions
- `POST /api/admin/questions/import` - Import questions
- `PUT /api/admin/questions/update` - Update question
- `DELETE /api/admin/questions/delete` - Delete question

## 🔒 Security Considerations

1. Use strong JWT secret
2. Implement rate limiting
3. Validate all inputs
4. Use HTTPS in production
5. Restrict MongoDB access

## 📮 Support

For support, please open an issue in the GitHub repository.

## 📜 License

This project is licensed under the MIT License.