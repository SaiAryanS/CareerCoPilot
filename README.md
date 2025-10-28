# CareerPilot AI: Resume Analyzer & Career Tool

CareerPilot AI is an intelligent web application powered by **Llama 3.1** that helps job seekers analyze their resumes, practice for interviews, and improve their candidacy. By leveraging local AI models through Ollama, it provides detailed resume analysis, mock interview simulations, and a full-featured admin dashboard—all while keeping your data private.

## 🌟 Core Features

### 🔐 **Multi-Role Authentication System** (NEW v2.1)
- **Three User Types**: Individual job seekers, Company/Recruiters, Career Coaches
- **Role-Based Access**: Automatic routing to appropriate dashboards
- **Company Accounts**: Extended registration with company details (name, size, industry)
- Complete registration and login system with password hashing (bcryptjs)
- Secure admin panel with separate authentication

### 🏢 **Company Dashboard & Bulk Analysis** (NEW v2.1)
- **Bulk Resume Upload**: Process up to 50 resumes at once against a job description
- **Private Job Postings**: Create company-specific job descriptions
- **AI-Powered Ranking**: Automatically rank candidates by match score
- **Batch Processing**: Track progress of bulk analysis in real-time
- **Analytics Dashboard**: View hiring insights and statistics
- **Candidate Management**: Filter, sort, and export top candidates

### 🤖 **Intelligent AI Career Agent** (Powered by Llama 3.1)
- **Natural Conversation Flow**: Engage in back-and-forth dialogue for resume analysis and interview prep
- **Smart Context Retention**: Remembers job descriptions and resumes throughout the conversation (no repeated questions!)
- **Autonomous Decision Making**: Intelligently determines when to analyze resumes or generate interview questions
- **Multi-Pattern Extraction**: Recognizes job descriptions in various formats (formal posts, natural language, etc.)
- **Unlimited Interview Questions**: Generate as many practice questions as you need
- **Priority-Based Workflow**: Always shows resume analysis first, then offers interview preparation

### 📊 **Advanced AI Resume Analysis**
- **Dynamic Job Selection**: Choose from admin-managed job descriptions
- **Deep Contextual Analysis** with skill mapping and equivalency:
  - `matchScore`: Percentage score (0-100) prioritizing core skills
  - `matchingSkills`: Skills that align with the job requirements
  - `missingSkills`: Gaps to address for better candidacy
  - `impliedSkills`: Inferred abilities from projects and experience
  - `status`: Qualitative assessment ("Approved", "Needs Improvement", "Not a Match")
- **Smart PDF Parsing**: Position-aware text extraction preserving document structure
  - Handles multi-column resumes
  - Preserves line breaks and formatting
  - Proper word spacing and section detection

### 🎯 **AI-Powered Mock Interview Simulation**
- **Eligibility-Based**: Unlocked for match scores ≥ 70%
- **Progressive Difficulty**: 5 AI-generated questions from basic to advanced
- **Flexible Input**: Speech-to-text or typing (with anti-cheating measures)
- **Detailed Evaluation**: Each answer scored (1-10) with constructive AI feedback
- **Continuous Practice**: Request more questions anytime for extended practice

### 📈 **Visual Results & Reports**
- Clean, markdown-formatted analysis displays
- Interview results with performance metrics
- Downloadable PDF reports
- Personalized analysis history (private to each user)

### 👨‍💼 **Admin Dashboard**
- **User Management**: View all registered users
- **Job Description CRUD**: Full Create, Read, Update, Delete functionality
- Secure admin-only access

## 🛠️ Technology Stack

-   **Frontend**: [Next.js](https://nextjs.org/) 15.3.3 with React 18 & TypeScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) components
-   **AI Framework**: [Genkit](https://firebase.google.com/docs/genkit) for AI flow orchestration
-   **LLM Provider**: [Ollama](https://ollama.com/) with **Llama 3.1 8B** model (local, private)
-   **PDF Parsing**: [pdf2json](https://www.npmjs.com/package/pdf2json) for reliable PDF text extraction in Node.js
-   **Database**: [MongoDB](https://www.mongodb.com/) for storing users, jobs, and analysis history
-   **Authentication**: Custom implementation with `bcryptjs` password hashing
-   **Speech Recognition**: Web Speech API for voice input

## 🚀 Key Technical Features

### Bulk Resume Processing
- **Parallel PDF Extraction**: Efficient processing of multiple resumes using pdf2json
- **Event-Based Parsing**: Handles various PDF formats and encoding issues gracefully
- **Fallback Decoding**: Automatically handles malformed URI encoding in PDFs
- **Batch Tracking**: Real-time progress monitoring with MongoDB-backed state management
- **Error Resilience**: Individual resume failures don't stop the entire batch

### Enhanced PDF Parsing
- **Position-Aware Extraction**: Reads text based on X/Y coordinates (top→bottom, left→right)
- **Line Detection**: Preserves structure by detecting Y-position changes
- **Multi-Column Support**: Correctly handles two-column resume layouts
- **Smart Spacing**: Prevents word merging with intelligent space insertion
- **Page Breaks**: Clear markers between pages for better context
- **Robust Error Handling**: Graceful fallback for encoding issues and malformed PDFs

### Intelligent Agent System
- **Multi-Pattern Job Description Extraction**: 4 different regex patterns to catch JDs in any format
- **Context Window**: 4096 tokens for Llama with 8-message history
- **Analysis Detection**: Tracks conversation state to prevent redundant operations
- **Explicit Intent Recognition**: Only generates questions when explicitly requested
- **Resume Content Marking**: Clear delimiters for robust content extraction

### AI Analysis Pipeline
- **Skill Equivalency Mapping**: Django ≈ FastAPI, Express.js → Node.js, etc.
- **Conceptual Skills Detection**: Jenkins + Docker + AWS → CI/CD experience
- **Project Quality Assessment**: Distinguishes meaningful usage from keyword listing
- **Weighted Scoring**: Core skills prioritized, penalties for missing requirements
- **Structured JSON Output**: Direct Ollama API calls with format enforcement

## 📋 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/en) (version 18 or higher)
-   npm or yarn
-   [Ollama](https://ollama.com/) installed and running locally
-   **Llama 3.1 8B** model (or compatible model) pulled in Ollama
-   MongoDB database (local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud instance)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd CareerPilot-AI-Resume-Analyzer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Ollama and Llama 3.1:**
    ```bash
    # Install Ollama from https://ollama.com/
    
    # Pull the Llama 3.1 8B model
    ollama pull llama3.1:8b
    
    # Start Ollama server (if not already running)
    ollama serve
    ```
    
    Ollama will run on `http://127.0.0.1:11434` by default.
    
    **Verify Ollama is running:**
    ```bash
    curl http://127.0.0.1:11434/api/tags
    ```
    You should see `llama3.1:8b` in the list of models.

4.  **Set up environment variables:**
    Create a `.env` file in the root of your project:

    ```env
    # MongoDB Connection
    MONGODB_URI=your_mongodb_connection_string_here

    # Admin Credentials
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=your_secure_admin_password
    ```
    
    #### Option A: MongoDB Atlas (Cloud - Recommended)
    1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
    2. Get your connection string from the dashboard
    3. Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/career-pilot?retryWrites=true&w=majority`

    #### Option B: Local MongoDB
    1. Install MongoDB locally
    2. Use: `mongodb://localhost:27017/career-pilot`

### Running the Application

1.  **Ensure Ollama is running with Llama 3.1:**
    ```bash
    ollama serve
    ```
    
    The Ollama server should be accessible at `http://127.0.0.1:11434`

2.  **Start the development server:**
    ```bash
    npm run dev
    ```

3.  **Access the application:**
    - Main App: `http://localhost:9002`
    - Admin Panel: `http://localhost:9002/admin/login`

4.  **First-time setup:**
    - Register a user account
    - Log in with admin credentials to add job descriptions
    - Users can then analyze resumes against these jobs

## 💡 Usage Guide

### For Job Seekers

1. **Register/Login** at `/register` or `/login`
2. **Navigate to AI Agent** (`/agent`) in the navbar
3. **Start a conversation:**
   ```
   You: "I want to apply for a Full Stack Developer position..."
   Agent: "Great! Please provide the full job description."
   
   You: [Paste job description]
   Agent: "Perfect! Now upload your resume using the attachment button."
   
   You: [Upload PDF resume]
   Agent: [Automatically analyzes] 📊 Shows match score, skills, gaps
   
   Agent: "Would you like interview practice questions?"
   You: "Yes please"
   Agent: 🎯 Generates 5 questions
   
   You: "Give me more questions"
   Agent: 🎯 Generates 5 more questions (unlimited!)
   ```

4. **Alternative Flow** - Use the main analyzer:
   - Go to homepage
   - Select a job from dropdown
   - Upload resume
   - Get instant analysis

5. **View History** at `/history` to see past analyses

### For Administrators

1. **Login** at `/admin/login` with admin credentials
2. **Manage Jobs**: Add, edit, or delete job descriptions
3. **View Users**: See all registered users
4. **Monitor Activity**: Track platform usage

### For Company/Recruiter Users (NEW v2.1)

1. **Register** as a company at `/register`:
   - Select "Company / Recruiter" role
   - Fill in company details (name, size, industry, website)
   - Complete registration

2. **Access Company Dashboard** at `/company/dashboard`:
   - View batch analysis statistics
   - Monitor active job postings
   - See average match scores

3. **Bulk Resume Analysis**:
   - Go to **Bulk Upload** (`/company/bulk-upload`)
   - Select or create a job description
   - Upload multiple resumes (up to 50 PDFs at once)
   - Click **Start Batch Analysis**
   - Track processing progress in real-time
   - View ranked candidates sorted by AI match score
   - **Supported PDF Formats**: Text-based PDFs (works with various encodings and formats)

4. **Manage Job Postings** at `/company/jobs`:
   - Create private company-specific job descriptions
   - Edit existing jobs
   - Use jobs for bulk analysis matching

5. **Review Candidates**:
   - See candidates ranked by match score (highest to lowest)
   - Filter by score thresholds using the slider
   - Export top candidates to CSV
   - Download original resumes
   - View detailed AI analysis for each candidate
   - See matching skills, missing skills, and recommendations

### For Career Coach Users (NEW v2.1)

Career coaches have access to all individual features and can:
- Help multiple clients analyze resumes
- Guide interview preparation
- Track client progress (coming soon)
- Generate coaching reports (coming soon)

## ⚙️ Configuration

### Using Different Ollama Models

The application uses **Llama 3.1 8B** by default. To use a different model:

1. **Pull the desired model:**
   ```bash
   ollama pull <model-name>
   # Examples:
   # ollama pull qwen2.5-coder:7b
   # ollama pull mistral:7b
   ```

2. **Update `src/ai/genkit.ts`:**
   ```typescript
   export const ai = genkit({
     plugins: [
       ollama({
         models: [
           {
             name: '<model-name>',
             type: 'chat',
           },
         ],
         serverAddress: 'http://127.0.0.1:11434',
       }),
     ],
     model: 'ollama/<model-name>',
   });
   ```

3. **Update model references in flow files:**
   - `src/ai/flows/skill-matching.ts` (line ~90)
   - `src/ai/flows/interview-flow.ts`
   - `src/ai/flows/agent-flow.ts` (line ~211)

### Adjusting Context Window

For better conversation memory, adjust the Llama context:

In `src/ai/flows/agent-flow.ts`:
```typescript
options: {
  temperature: 0.7,
  num_predict: 300,
  num_ctx: 4096,  // Default: 4096 tokens (adjust based on your needs)
}
```

### PDF Parsing Configuration

The enhanced PDF parser is pre-configured in:
- `src/app/agent/page.tsx`
- `src/components/career-pilot/career-pilot-client.tsx`

Key parameters:
- Y-position threshold: `5 pixels` (for line detection)
- Text filtering: Empty strings removed
- Position sorting: Top→bottom, then left→right

## 🎯 Benefits of Local LLM Setup

- 🚀 **Zero API Costs** - Everything runs locally on your machine
- 🔒 **Complete Privacy** - Resume data never leaves your computer
- ⚡ **Fast Inference** - Direct GPU acceleration (if available)
- 🛠️ **Fully Customizable** - Swap models anytime for different capabilities
- 📶 **Works Offline** - No internet required after initial setup
- 🎨 **Unlimited Usage** - No rate limits or quotas

## 📚 Project Structure

```
CareerPilot-AI-Resume-Analyzer/
├── src/
│   ├── ai/
│   │   ├── genkit.ts              # Genkit + Ollama configuration
│   │   ├── schemas.ts             # Zod schemas for AI flows
│   │   └── flows/
│   │       ├── agent-flow.ts      # Conversational agent logic
│   │       ├── skill-matching.ts  # Resume analysis flow
│   │       └── interview-flow.ts  # Interview question generation
│   ├── app/
│   │   ├── agent/                 # AI Career Agent page
│   │   ├── api/                   # API routes
│   │   ├── admin/                 # Admin dashboard
│   │   └── ...                    # Other pages
│   ├── components/
│   │   ├── career-pilot/          # Resume analyzer components
│   │   ├── admin/                 # Admin components
│   │   ├── layout/                # Layout components
│   │   └── ui/                    # ShadCN UI components
│   └── lib/
│       ├── mongodb.ts             # MongoDB connection
│       └── utils.ts               # Utility functions
├── docs/                          # Documentation
├── .env                           # Environment variables
└── README.md
```

## 🐛 Troubleshooting

### Ollama Connection Issues
```bash
# Check if Ollama is running
curl http://127.0.0.1:11434/api/tags

# Restart Ollama
ollama serve

# Verify model is available
ollama list
```

### PDF Parsing Issues
- Ensure PDF contains selectable text (not scanned images)
- The system uses pdf2json which handles most PDF formats
- Malformed encoding is automatically handled with fallback decoding
- Check server logs for specific PDF parsing errors
- If a specific PDF fails, try re-saving it from a PDF viewer

### Bulk Upload Issues
- Maximum 50 PDFs per batch
- Each PDF should be under 10MB
- Processing time depends on resume length and AI analysis complexity
- Check `/api/company/batch-results/[id]` for detailed error messages
- Failed individual resumes don't affect other resumes in the batch

### Agent Context Issues
- Check conversation history in browser DevTools Network tab
- Verify both job description and resume are in API request payload
- Increase context window if needed (`num_ctx` parameter)

### MongoDB Connection Issues
```bash
# Test MongoDB connection
mongosh "<your-connection-string>"

# Check environment variables are loaded
echo $MONGODB_URI
```

## 🔄 Recent Improvements

### v2.2 - Enhanced Bulk Processing (Latest)
- ✅ **Improved PDF Parsing**: Migrated from pdf-parse to pdf2json for better Next.js compatibility
- ✅ **Robust Error Handling**: Automatic fallback for malformed URI encoding in PDFs
- ✅ **Better Compatibility**: Handles various PDF formats and encodings gracefully
- ✅ **Event-Based Processing**: Reliable async parsing with proper error propagation
- ✅ **Production Ready**: Eliminates webpack bundling issues with PDF libraries

### v2.1 - Multi-Role System & Bulk Analysis
- ✅ **Multi-Role Authentication**: Support for Individual, Company/Recruiter, and Career Coach accounts
- ✅ **Company Dashboard**: Dedicated dashboard for recruiters with analytics and batch tracking
- ✅ **Bulk Resume Upload**: Process up to 50 resumes simultaneously against a job description
- ✅ **Private Job Postings**: Company-specific job descriptions not visible to other users
- ✅ **AI-Powered Candidate Ranking**: Automatic sorting by match score for efficient hiring
- ✅ **Role-Based Navigation**: Dynamic navbar showing relevant links based on user type
- ✅ **Enhanced Registration**: Company-specific fields (name, size, industry, website)
- ✅ **Smart Redirects**: Automatic routing to appropriate dashboard based on role
- ✅ **CSV Export**: Download candidate lists with scores and analysis
- ✅ **Resume Download**: Direct access to original uploaded PDFs

### v2.0 - Enhanced AI Agent System
- ✅ **Smart Context Retention**: Agent now remembers job descriptions and resumes throughout conversation
- ✅ **Multi-Pattern Extraction**: 4 different regex patterns to detect job descriptions in any format
- ✅ **Priority-Based Workflow**: Analysis always happens before interview questions
- ✅ **Explicit Intent Recognition**: Only generates questions when explicitly requested (prevents false triggers)
- ✅ **Unlimited Questions**: Users can request as many interview questions as they need
- ✅ **Increased Context Window**: 4096 tokens for better conversation memory

### v2.0 - Improved PDF Parsing
- ✅ **Position-Aware Extraction**: Reads text based on X/Y coordinates (top→bottom, left→right)
- ✅ **Line Detection**: Preserves document structure by detecting Y-position changes
- ✅ **Multi-Column Support**: Correctly handles two-column resume layouts
- ✅ **Smart Word Spacing**: Prevents words from merging together
- ✅ **Page Break Markers**: Clear separation between pages

### v2.0 - Better User Experience
- ✅ **Clearer Visual Indicators**: "Powered by Llama 3.1" branding
- ✅ **Enhanced Welcome Message**: Shows agent capabilities upfront
- ✅ **Markdown Formatting**: Professional-looking analysis results
- ✅ **Encouraging Prompts**: Invites users to continue practicing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Ollama](https://ollama.com/) for making local LLMs accessible
- [Meta AI](https://ai.meta.com/) for Llama 3.1
- [Firebase Genkit](https://firebase.google.com/docs/genkit) for AI orchestration
- [pdf2json](https://www.npmjs.com/package/pdf2json) for reliable PDF parsing
- [ShadCN UI](https://ui.shadcn.com/) for beautiful components

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Refer to documentation files in `/docs`

---

**Built with ❤️ using Llama 3.1 and Next.js**
