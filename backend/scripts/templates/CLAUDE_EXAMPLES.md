# Claude Prompt Examples for Portfolio Content

Ready-to-use prompts for generating attractive, recruiter-friendly content with Claude.

---

## 🚀 Quick Start Prompts

### 1. Improve Existing Project Description
```
I have a project in my portfolio that needs better descriptions for recruiters.

Current data:
- Project: [Name]
- Technologies: [List]
- Current STAR descriptions: [Paste current text]

Please rewrite the STAR method sections to be more:
1. Compelling - grab attention
2. Specific - include technical details
3. Quantifiable - add metrics where possible
4. Professional - appropriate for senior engineers/managers

Format your response as JSON:
{
  "situation": "...",
  "task": "...",
  "action": "...",
  "result": "...",
  "impact": "...",
  "architecture": "..."
}
```

### 2. Create New Project from Scratch
```
I need to add a new project to my portfolio for [target role].

Project details:
- Name: [Project name]
- What it does: [Brief description]
- Technologies used: [List]
- Key achievements:
  - [Achievement 1]
  - [Achievement 2]
  - [Achievement 3]
- Users/scale: [If applicable]
- GitHub: [URL]

Please write complete STAR method descriptions that will impress recruiters hiring for [target role].
Focus on: [skills you want to highlight]

Return as JSON format.
```

### 3. Polish Work Experience
```
I'm applying for [target role] and need to improve my work experience description.

Role: [Your role]
Company: [Company name]
Duration: [Time period]

What I did:
[List your responsibilities and achievements]

Technologies: [List]

Please transform this into compelling STAR format that highlights:
- [Skill 1]
- [Skill 2]
- [Skill 3]

Make it quantifiable and impressive. Return as JSON.
```

---

## 📊 Advanced Prompts

### For Technical Leadership Roles
```
I'm targeting Principal Engineer / Tech Lead positions.

[Paste your project/experience]

Rewrite this to emphasize:
1. Technical decision-making
2. System architecture at scale
3. Team leadership and mentorship
4. Business impact of technical choices
5. Trade-off analysis

Be specific about:
- Why I made architectural decisions
- How I influenced technical direction
- Measurable improvements to system/team
- Technical complexity managed

Return as JSON in STAR format.
```

### For ML/AI Roles
```
I'm applying for ML Engineer positions at [company type].

[Paste your project/experience]

Enhance this to showcase:
1. ML model selection and justification
2. Data pipeline design
3. Model performance metrics
4. Production ML best practices
5. Experimentation methodology

Include specifics about:
- Algorithms used and why
- Dataset characteristics
- Performance improvements (accuracy, latency, etc.)
- MLOps practices

Return as JSON.
```

### For Startup/Growth Roles
```
I'm targeting fast-growing startups that value velocity and impact.

[Paste your project/experience]

Rewrite to emphasize:
1. Speed of execution
2. Rapid iteration and learning
3. Wearing multiple hats
4. 0-to-1 product building
5. Direct user/business impact

Highlight:
- How fast you shipped
- User adoption metrics
- Pivots and learnings
- Scrappy solutions that worked

Return as JSON.
```

---

## 🎯 Specific Scenario Prompts

### Scenario 1: Quantifying Vague Results
```
I have this result description that's too vague:
"Improved system performance significantly"

Context:
- System: [Description]
- What I did: [Actions]
- Approximate improvements: [Your estimates]

Please rewrite this with specific, believable metrics.
If exact numbers aren't possible, use realistic ranges or comparisons.
Make it quantifiable and impressive but truthful.
```

### Scenario 2: Adding Technical Depth
```
My "action" section is too high-level:
"[Current action text]"

Please expand this with more technical depth:
- Specific technologies and why you chose them
- Technical challenges encountered
- How you solved complex problems
- Design patterns or architectures used

Technologies available: [List]
Keep it readable but showcase technical expertise.
```

### Scenario 3: Highlighting Business Impact
```
My descriptions are too technical. Need more business value.

Current text:
"[Your technical description]"

Context:
- Company size/stage: [Details]
- Users affected: [Number/type]
- Business goals: [What company cared about]

Please rewrite to show:
1. How technical work drove business results
2. User/customer benefit
3. Revenue/growth/efficiency impact
4. Stakeholder value

Keep technical details but lead with business impact.
```

---

## 🎨 Tone & Style Prompts

### Professional but Approachable
```
My portfolio sounds too stiff. Make it more conversational while staying professional.

[Paste content]

Rewrite to be:
- Confident but not arrogant
- Technical but accessible
- Specific but concise
- Engaging but professional

Target audience: Senior engineers and engineering managers.
```

### For International Applications
```
I'm applying to [country/region]. Adjust my portfolio content for this market.

[Paste content]

Adapt for [region]:
- Use appropriate terminology
- Emphasize values important in this market
- Adjust metrics/units if needed
- Match communication style

Keep technical accuracy but culturally adapt.
```

---

## 📝 Complete Workflow Example

### Step 1: Export Current Data
```bash
cd backend
python scripts/view_portfolio.py --export-for-claude exports/current_portfolio.txt
```

### Step 2: Ask Claude for Overall Review
```
I'm applying for Senior Software Engineer roles at FAANG companies.

Here's my current portfolio content:
[Paste from current_portfolio.txt]

Please analyze and provide:
1. Overall strengths
2. Weaknesses/gaps
3. Which projects to feature
4. Which experiences to highlight
5. Specific improvements needed

Then, for the top 3 items, provide improved STAR descriptions.
```

### Step 3: Iterate on Specific Items
```
Thanks! Let's improve the [Project Name] description.

Current version:
[Paste]

Make it more compelling by:
- Adding specific metrics
- Highlighting unique challenges
- Emphasizing scale/complexity
- Showing problem-solving skills

Return as JSON.
```

### Step 4: Import Improved Content
```bash
# Save Claude's JSON response to file
echo '[Claude response]' > imports/improved_project.json

# Import to database
python scripts/import_from_claude.py imports/improved_project.json --type project

# Verify
python scripts/view_portfolio.py projects
```

---

## 🎓 Learning from Claude

### Ask for Multiple Versions
```
Please provide 3 versions of this description:

[Paste content]

Version A: Concise (2-3 sentences per STAR element)
Version B: Detailed (4-5 sentences, very specific)
Version C: Executive summary (business-focused)

Then explain which is best for which audience.
```

### Get Improvement Suggestions
```
Here's my improved version based on your suggestions:
[Paste]

Rate it on:
1. Clarity (1-10)
2. Impact (1-10)
3. Technical depth (1-10)
4. Specificity (1-10)

Provide specific suggestions for each category under 8/10.
```

---

## 🚫 What NOT to Ask Claude

### Don't Ask for Fabrication
❌ "Make up impressive metrics for this project"
✅ "Help me identify and quantify the real impact"

### Don't Ask for Generic Content
❌ "Write a generic software engineer portfolio"
✅ "Improve MY specific project with MY actual work"

### Don't Accept First Draft
❌ Use Claude's first response as-is
✅ Iterate 2-3 times for best results

---

## 📊 Evaluating Claude's Output

### Quality Checklist
- [ ] Sounds like something I would say
- [ ] Technically accurate
- [ ] Metrics are realistic
- [ ] Emphasizes right skills
- [ ] Appropriate length
- [ ] No buzzwords/jargon
- [ ] Clear value proposition
- [ ] Specific, not vague

### Red Flags
- ⚠️ Uses metrics I didn't provide
- ⚠️ Claims I don't recognize
- ⚠️ Overly buzzword-heavy
- ⚠️ Too salesy/marketing-like
- ⚠️ Technically imprecise
- ⚠️ Doesn't match my voice

---

## 🎯 Pro Tips

1. **Provide Context**: Tell Claude your target role, company type, experience level
2. **Be Specific**: More details = better output
3. **Iterate**: First draft is good, third draft is great
4. **Stay Truthful**: Claude enhances, you verify accuracy
5. **Match Your Voice**: Adjust output to sound like you
6. **Test with Others**: Show to friends/colleagues
7. **A/B Test**: Try different versions on your portfolio

---

## 📚 Additional Resources

- Save your best prompts for reuse
- Build a prompt library for different scenarios
- Document what works for your use case
- Share effective prompts with others

---

Need more examples? Check out:
- `CONTENT_TEMPLATE.md` for structure guides
- `view_portfolio.py --help` for viewing current data
- `import_from_claude.py --help` for importing new content
