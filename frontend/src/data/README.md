# Portfolio Data Management

This directory contains all the data for your portfolio website, organized into modular TypeScript files.

## 📁 File Structure

```
data/
├── activities.ts      ← Activity timeline (GitHub commits, papers, courses)
├── profile.ts         ← Bio, contact info, education
├── projects.ts        ← All project data with STAR format
├── experience.ts      ← Work experience with STAR format
├── publications.ts    ← Research papers and publications
├── skills.ts          ← Technical skills and tools
└── index.ts          ← Combines all exports
```

## ✏️ How to Update Your Portfolio

### Adding a New Activity

Edit `activities.ts` and add a new entry at the **top** of the array:

```typescript
{
  time: '16:45 UTC',
  category: 'GitHub',
  title: 'Released v3.0 of Wafer Detection System',
  description: 'Improved accuracy to 99.2% with new ensemble model',
  type: 'milestone'
}
```

**Categories:** `GitHub`, `ArXiv`, `Course`, `Deploy`, `Research`, `Learning`  
**Types:** `milestone`, `research`, `learning`, `past`

### Adding a New Project

Edit `projects.ts` and add a new project object:

```typescript
{
  id: "p6",
  title: "Your New Project",
  github_url: "https://github.com/yourusername/project",
  star: {
    situation: "...",
    task: "...",
    action: "...",
    result: "...",
    impact: "...",
    architecture: "..."
  },
  technologies: ["Python", "React", "AWS"],
  featured: false  // Set to true to feature on homepage
}
```

### Updating Profile Info

Edit `profile.ts` to update:
- Contact information
- Bio summary
- Highlights
- Social links

### Adding Work Experience

Edit `experience.ts` and add a new experience object with full STAR format.

## 🚀 Deployment Workflow

```bash
# 1. Edit any data file
vim activities.ts

# 2. Commit and push
git add .
git commit -m "Added new project deployment activity"
git push origin main

# 3. Vercel auto-deploys in ~60 seconds
# ✅ Done!
```

## 🎯 Featured Projects

To change which project appears as the hero/featured project:

1. Open `projects.ts`
2. Set `featured: true` on the project you want featured
3. Set `featured: false` on others (or remove the property)
4. The first project with `featured: true` will be the hero

## 📊 Data Size & Performance

- **Total data size:** ~50KB (minified)
- **Load time:** Instant (bundled with JS)
- **No network requests:** Data is compiled into the app
- **No backend needed:** Pure static deployment

## 🔧 Type Safety

All data files are fully typed with TypeScript interfaces. Your IDE will:
- Auto-complete field names
- Catch typos and missing fields
- Validate data structure before build

## 📝 Best Practices

1. **Keep activities recent:** Show last 4-6 activities
2. **Use clear descriptions:** Write for recruiters, not developers
3. **Update regularly:** Commit updates as you complete work
4. **Test locally first:** Run `npm run dev` before pushing
5. **Keep STAR format:** Situation, Task, Action, Result for projects/experience

## 🆘 Troubleshooting

**Build fails after editing?**
- Check for TypeScript errors in your IDE
- Ensure all required fields are present
- Validate JSON-like syntax (commas, quotes)

**Changes not showing?**
- Clear browser cache (Ctrl+Shift+R)
- Check Vercel deployment logs
- Verify git push succeeded

## 🎨 Customization

Want to add new data types? 
1. Create a new `.ts` file in this directory
2. Export your data and types
3. Import and add to `index.ts`
4. Use in components via `import { YOUR_DATA } from '../data'`
