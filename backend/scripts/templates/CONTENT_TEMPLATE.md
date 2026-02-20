# Portfolio Content Template

Use this template to structure new content for Claude to review and improve.

---

## 🎯 For Adding a New Project

### Template:
```json
{
  "id": "p6",
  "title": "Project Name",
  "github_url": "https://github.com/yourusername/project",
  "featured": true,
  "star": {
    "situation": "Describe the problem or opportunity that led to this project. What was the business context or challenge?",
    "task": "What specific objective did you need to achieve? What were the requirements?",
    "action": "What did YOU specifically do? List the technical decisions, implementations, and approaches you took.",
    "result": "What was the outcome? Include specific metrics, improvements, or achievements.",
    "impact": "How did this benefit users, the business, or your learning? What was the broader significance?",
    "architecture": "Describe the technical architecture, design patterns, and key technologies used."
  },
  "technologies": ["Python", "FastAPI", "React", "Docker", "AWS"]
}
```

### Example for Claude Prompt:
```
I'm building my portfolio. Here's a project I want to add:

Project: Real-time Weather Dashboard
Technologies: Python, FastAPI, React, OpenWeatherMap API, Redis

Can you help me write compelling STAR method descriptions that will impress recruiters?
Focus on:
- Clear problem statement
- Quantifiable results
- Technical depth
- Business impact

Please format the response as JSON matching this structure:
{
  "situation": "...",
  "task": "...",
  "action": "...",
  "result": "...",
  "impact": "...",
  "architecture": "..."
}
```

---

## 💼 For Adding a New Experience

### Template:
```json
{
  "id": 4,
  "role": "Position Title",
  "company": "Company Name",
  "duration": "Month YYYY - Present",
  "location": "City, State/Country",
  "star": {
    "situation": "Describe the company context, team size, and business challenges you were addressing.",
    "task": "What were your primary responsibilities? What problems were you hired to solve?",
    "action": "What did you specifically do? Include technologies, methodologies, and leadership actions.",
    "result": "What were the measurable outcomes? Include metrics like performance improvements, cost savings, user growth.",
    "impact": "How did your work affect the business, team, or product? What was the long-term value?",
    "architecture": "Describe the technical systems, architecture decisions, and infrastructure you worked with."
  },
  "technologies": ["List", "of", "technologies", "used"],
  "competencies": ["Leadership", "System Design", "Problem Solving"],
  "soft_skills": ["Communication", "Mentoring", "Cross-functional Collaboration"]
}
```

### Example for Claude Prompt:
```
I need to add my latest work experience to my portfolio:

Role: Senior ML Engineer at TechCorp
Duration: Jan 2024 - Present
Key achievements:
- Built ML pipeline that processes 1M events/day
- Reduced model inference time by 60%
- Led team of 3 junior engineers
- Deployed to AWS with 99.9% uptime

Technologies: Python, TensorFlow, AWS SageMaker, Docker, Kubernetes

Can you write this using the STAR method to make it compelling for recruiters?
Please emphasize:
- Technical leadership
- Measurable impact
- System design skills
- Business value

Format as JSON with the structure above.
```

---

## 📚 For Adding a Publication

### Template:
```json
{
  "id": 3,
  "title": "Publication Title",
  "outlet": "Conference/Journal Name",
  "date": "YYYY-MM",
  "related_project_id": "p1"
}
```

### Example for Claude Prompt:
```
I published a paper and need a concise, professional title and description:

Topic: Using transformers for code summarization
Venue: ACM Conference on Software Engineering
Date: March 2024

Can you suggest:
1. A professional publication title
2. Related project ID (if applicable: p1, p2, etc.)
```

---

## 🎓 For Updating Education

### Template:
```json
{
  "degree": "Degree Name",
  "university": "University Name",
  "graduation": "Month YYYY",
  "gpa": "X.XX",
  "coursework": [
    "Course 1",
    "Course 2",
    "Course 3"
  ]
}
```

---

## 💡 Tips for Working with Claude

### 1. **Provide Context**
```
Context: I'm a [role] with [X] years experience applying for [type of roles].
My portfolio is technical and aimed at hiring managers at [type of companies].
```

### 2. **Request Specific Tone**
```
Tone: Professional but conversational, technical but accessible.
Emphasize: Innovation, problem-solving, measurable impact.
Avoid: Jargon, buzzwords, vague statements.
```

### 3. **Ask for Multiple Options**
```
Please provide 3 different versions:
1. Concise (for quick scanners)
2. Detailed (for technical reviewers)
3. Business-focused (for non-technical managers)
```

### 4. **Iterate Based on Feedback**
```
That's good, but can you:
- Add more technical depth to the "action" section
- Make the impact more quantifiable
- Emphasize the architecture decisions more
```

---

## 📊 STAR Method Guide

### **Situation** (Context)
- Set the scene
- Describe the challenge/opportunity
- Include business context
- 2-3 sentences

### **Task** (Objective)
- What needed to be done?
- What were the goals/requirements?
- What constraints existed?
- 1-2 sentences

### **Action** (Your Contribution)
- What YOU specifically did
- Technologies and approaches used
- Decisions made and why
- Most detailed section (3-4 sentences)

### **Result** (Outcomes)
- Quantifiable achievements
- Before/after comparisons
- Success metrics
- 2-3 sentences

### **Impact** (Value)
- Business value delivered
- User benefit
- Learning gained
- Long-term significance
- 1-2 sentences

### **Architecture** (Technical Details)
- System design
- Technologies used
- Design patterns applied
- Scalability considerations
- 2-3 sentences

---

## 🎨 Claude Prompts Cheat Sheet

### For Projects:
```
"Write a compelling STAR method description for a [project type] project 
that demonstrates my [skills] for [target audience]. 
Focus on [key aspects]."
```

### For Experience:
```
"Transform this work experience into recruiter-friendly STAR format:
[paste raw notes]
Target: [job titles you're applying for]
Emphasize: [key skills]"
```

### For Profile Summary:
```
"Create a 3-sentence professional summary that highlights:
- [X years] experience in [field]
- Key strengths: [list]
- Career goal: [goal]
Make it compelling for [target companies]."
```

### For Improving Existing Content:
```
"Review this portfolio content and suggest improvements:
[paste content]

Make it more:
- Specific (add metrics)
- Impactful (emphasize value)
- Technical (add depth)
- Readable (improve clarity)"
```

---

## 🚀 Workflow: From Claude to Database

1. **Export Current Data**
   ```bash
   python scripts/view_portfolio.py --export-for-claude review.txt
   ```

2. **Get Claude's Improvements**
   - Copy content from `review.txt`
   - Paste into Claude chat
   - Ask for improvements
   - Save Claude's response

3. **Format for Import**
   - Copy Claude's JSON response
   - Save to `scripts/imports/new_content.json`

4. **Import to Database**
   ```bash
   python scripts/import_from_claude.py imports/new_content.json
   ```

5. **Verify Changes**
   ```bash
   python scripts/view_portfolio.py projects
   ```

---

## 📝 Example Complete Workflow

### Step 1: Create draft in template
```json
{
  "id": "p6",
  "title": "E-commerce Recommendation Engine",
  "technologies": ["Python", "TensorFlow", "Redis", "FastAPI"]
}
```

### Step 2: Ask Claude
```
I built an e-commerce recommendation engine. Help me write the STAR description:

Key facts:
- Increased product discovery by 40%
- Processes 100K recommendations/day
- Uses collaborative filtering + content-based
- Deployed on AWS with <100ms latency

Please format as JSON with situation, task, action, result, impact, architecture.
```

### Step 3: Get Response
Claude provides complete JSON with compelling descriptions.

### Step 4: Review & Import
```bash
# Save Claude's response to file
# Then import:
python scripts/import_from_claude.py imports/new_project.json --type project
```

### Step 5: Verify
```bash
python scripts/view_portfolio.py projects
# Or visit your portfolio site to see the new project!
```

---

## 🎯 Pro Tips

1. **Be Specific**: More details = better Claude responses
2. **Iterate**: First draft from Claude is good, but refine it
3. **Use Metrics**: Always include numbers (%, time, users, etc.)
4. **Stay Truthful**: Claude should enhance, not fabricate
5. **Match Your Voice**: Adjust Claude's output to sound like you
6. **Test with Recruiters**: Show to friends in recruiting/hiring
7. **A/B Test**: Try different versions on your portfolio

---

Need help? Check:
- `scripts/view_portfolio.py --help`
- `scripts/import_from_claude.py --help`
- `CLAUDE_EXAMPLES.md` for more prompts
