# AI Agent Testing Guide

## Quick Test Scenarios

### Scenario 1: Basic Resume Analysis

**Step 1:** Navigate to `/agent` page
```
Expected: Welcome message with agent capabilities
```

**Step 2:** Send job description
```
User: I'm applying for a Full Stack Developer role. Here's the job description:
      
Position: Full Stack Developer
Requirements:
- 3+ years of experience with React and Node.js
- Strong knowledge of MongoDB
- Experience with REST APIs
- Knowledge of Git and Agile methodologies
```
```
Expected: Agent acknowledges and asks for resume
```

**Step 3:** Upload resume PDF
```
Action: Click paperclip icon and select resume PDF
```
```
Expected: Agent automatically analyzes and shows:
- Match Score
- Matching Skills
- Skills Gap
- Offer for interview questions (if score ≥ 70%)
```

### Scenario 2: Interview Questions

**Step 4:** Request interview questions
```
User: Yes, I'd like to practice with interview questions
```
```
Expected: Agent generates 5 tailored questions with tips
```

### Scenario 3: Natural Conversation

**Test:** Just chat without providing info
```
User: Hi, how can you help me?

Expected: Agent explains capabilities and asks what you need
```

## Expected Agent Behaviors

### ✅ Smart Context Tracking
- Remembers job description from earlier messages
- Extracts resume text from uploaded PDFs
- Doesn't ask for information already provided

### ✅ Automatic Tool Execution
- Analyzes resume when both JD and resume are available
- Generates questions when requested (with JD available)
- No manual tool selection needed

### ✅ Conversational
- Friendly and professional tone
- Guides user through the process
- Proactive in offering next steps

### ✅ Llama-Powered
- Uses Llama 3.1 8B for all responses
- Fast local inference
- Privacy-preserving

## Common Test Cases

### ✅ Test: Providing JD first, then resume
```
1. Send job description text
2. Upload resume
→ Should analyze automatically
```

### ✅ Test: Uploading resume first
```
1. Upload resume
2. Agent asks for job description
3. Send job description
→ Should analyze automatically
```

### ✅ Test: High match score (≥70%)
```
→ Agent offers interview questions
→ User accepts
→ Agent generates questions
```

### ✅ Test: Low match score (<70%)
```
→ Agent suggests improvements
→ Offers to analyze another resume
```

### ✅ Test: Multiple conversations
```
1. Complete one analysis
2. Start new one with different JD
→ Agent should handle new context correctly
```

## Verification Checklist

- [ ] Agent greets with capabilities
- [ ] "Powered by Llama 3.1" visible in UI
- [ ] Can upload PDF resumes
- [ ] PDF text extraction works
- [ ] Agent remembers conversation context
- [ ] Automatic analysis when both inputs present
- [ ] Match score displayed (0-100%)
- [ ] Skills clearly categorized (matching/missing)
- [ ] Interview questions generated (5 questions)
- [ ] Natural conversation when info missing
- [ ] Markdown formatting renders properly
- [ ] Loading states show during processing
- [ ] Error handling works (e.g., Ollama down)

## Debug Tips

### If agent doesn't respond:
```bash
# Check Ollama is running
curl http://127.0.0.1:11434/api/tags

# Check Llama model is available
# Should see "llama3.1:8b" in the list
```

### If PDF not extracted:
```
- Ensure PDF has selectable text (not scanned image)
- Check browser console for errors
- Verify pdfjs is loaded
```

### If analysis doesn't trigger:
```
- Check conversation context in browser DevTools Network tab
- Verify both JD and "Here is the resume text:" are in context
- Look at API request payload
```

## Performance Expectations

- **Initial greeting:** Instant
- **Conversational response:** 2-5 seconds (Llama inference)
- **Resume analysis:** 10-20 seconds (complex analysis)
- **Interview questions:** 5-10 seconds (generation)

## Success Metrics

✅ **User Experience:**
- No manual tool selection needed
- Smooth conversational flow
- Clear, actionable insights

✅ **Technical:**
- No compilation errors
- Proper type safety
- Error handling in place

✅ **AI Performance:**
- Contextually relevant responses
- Accurate skill extraction
- Meaningful interview questions
