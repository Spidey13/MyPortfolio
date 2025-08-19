import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAI } from '../utils/backendConnection';
import { getEnhancedFallbackResponse } from '../data/aiFallbackResponses';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Projects' | 'Experience' | 'Publications' | 'Skills' | 'Assistant';
  action: () => void;
  icon: string;
  keywords?: string[];
  priority?: number;
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  portfolioData: any
  onNavigate?: (sectionId: string) => void
  isAIReady?: boolean
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, portfolioData, onNavigate, isAIReady = false }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isProcessingAI, setIsProcessingAI] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [showAIResponse, setShowAIResponse] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if query is an AI question (not a navigation command)
  const isAIQuestion = (query: string): boolean => {
    const aiKeywords = [
      'tell me about', 'what is', 'how', 'why', 'explain', 'describe', 'show me',
      'analyze', 'compare', 'discuss', 'elaborate', 'provide', 'give me',
      'can you', 'could you', 'would you', 'please', 'help me', 'i want to know'
    ]
    
    const queryLower = query.toLowerCase()
    return aiKeywords.some(keyword => queryLower.includes(keyword)) || 
           queryLower.includes('?') ||
           queryLower.length > 20 // Long queries are likely AI questions
  }

  // Handle AI chat with smart fallbacks during cold start
  const handleAIChat = async (question: string) => {
    setShowAIResponse(false)
    setAiResponse('')
    
    // Check if AI is ready - if not, use fallback response immediately
    if (!isAIReady) {
      const fallbackResponse = getEnhancedFallbackResponse(question);
      setAiResponse(fallbackResponse);
      setShowAIResponse(true);
      return;
    }
    
    setIsProcessingAI(true)
    
    try {
      const result = await chatWithAI(question, portfolioData)
      setAiResponse(result.response)
      setShowAIResponse(true)
      
    } catch (error) {
      console.error('AI chat error:', error)
      
      // If AI was supposed to be ready but failed, try fallback
      const fallbackResponse = getEnhancedFallbackResponse(question);
      setAiResponse(fallbackResponse + '\n\n*Note: Experiencing technical difficulties. The above is based on static data.*');
      setShowAIResponse(true)
    } finally {
      setIsProcessingAI(false)
    }
  }

  // Generate command items from portfolio data
  const generateCommands = (): CommandItem[] => {
    const commands: CommandItem[] = []

    // Navigation commands
    const navigationItems = [
      { id: 'about', title: 'About Me', subtitle: 'View profile and background', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      { id: 'projects', title: 'Projects', subtitle: 'View featured projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { id: 'experience', title: 'Experience', subtitle: 'View work history', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6' },

      { id: 'publications', title: 'Publications', subtitle: 'View research publications', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
      { id: 'contact', title: 'Contact', subtitle: 'Get in touch', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
    ]

    navigationItems.forEach(item => {
      commands.push({
        id: `nav-${item.id}`,
        title: item.title,
        subtitle: item.subtitle,
        category: 'Navigation',
        icon: item.icon,
        action: () => {
          if (onNavigate) {
            onNavigate(item.id)
          } else {
            const element = document.getElementById(item.id)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }
          onClose()
        }
      })
    })

    // Project commands
    if (portfolioData?.projects) {
      portfolioData.projects.forEach((project: any) => {
        // Create keywords from title, situation, and technologies
        const keywords = [
          ...project.title.toLowerCase().split(' '),
          ...project.star.situation.toLowerCase().split(' '),
          ...(project.technologies || []).map((tech: string) => tech.toLowerCase()),
          ...project.title.toLowerCase().split(' ').map((word: string) => word.replace(/[^a-z]/g, '')), // Remove special chars
          ...project.star.situation.toLowerCase().split(' ').map((word: string) => word.replace(/[^a-z]/g, ''))
        ].filter((word: string) => word.length > 2) // Only keep words longer than 2 chars

        commands.push({
          id: `project-${project.id}`,
          title: project.title,
          subtitle: project.star.situation.substring(0, 60) + '...',
          category: 'Projects',
          icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
          keywords: keywords,
          action: () => {
            const element = document.getElementById('projects')
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              // TODO: Highlight specific project
              onClose()
            }
          }
        })
      })
    }

    // Experience commands
    if (portfolioData?.experience) {
      portfolioData.experience.forEach((exp: any) => {
        const keywords = [
          ...(exp.role || exp.position || '').toLowerCase().split(' '),
          ...exp.company.toLowerCase().split(' '),
          ...exp.star.situation.toLowerCase().split(' '),
          ...(exp.technologies || []).map((tech: string) => tech.toLowerCase())
        ].filter((word: string) => word.length > 2)

        commands.push({
          id: `exp-${exp.id}`,
          title: `${exp.role || exp.position} at ${exp.company}`,
          subtitle: exp.duration,
          category: 'Experience',
          icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6',
          keywords: keywords,
          action: () => {
            const element = document.getElementById('experience')
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              onClose()
            }
          }
        })
      })
    }

    // Publications commands
    if (portfolioData?.publications) {
      portfolioData.publications.forEach((pub: any) => {
        const keywords = [
          ...pub.title.toLowerCase().split(' '),
          ...pub.outlet.toLowerCase().split(' '),
          ...pub.date.toLowerCase().split(' ')
        ].filter((word: string) => word.length > 2)

        commands.push({
          id: `pub-${pub.id}`,
          title: pub.title,
          subtitle: `${pub.date} • ${pub.outlet}`,
          category: 'Publications',
          icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
          keywords: keywords,
          action: () => {
            const element = document.getElementById('publications')
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              onClose()
            }
          }
        })
      })
    }



    // Skills commands (from projects)
    const skills = new Set<string>()
    if (portfolioData?.projects) {
      portfolioData.projects.forEach((project: any) => {
        project.technologies?.forEach((tech: string) => skills.add(tech))
      })
    }

    Array.from(skills).forEach(skill => {
      commands.push({
        id: `skill-${skill}`,
        title: skill,
        subtitle: 'Filter projects by this technology',
        category: 'Skills',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        keywords: [skill.toLowerCase(), ...skill.toLowerCase().split(' ')],
        action: () => {
          // TODO: Implement skill filtering
          const element = document.getElementById('projects')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            onClose()
          }
        }
      })
    })

    return commands
  }

  const commands = generateCommands()
  
  // Enhanced filtering with fuzzy matching and keywords
  const filteredCommands = commands.filter(command => {
    const queryLower = query.toLowerCase()
    
    // Direct matches
    const titleMatch = command.title.toLowerCase().includes(queryLower)
    const subtitleMatch = command.subtitle?.toLowerCase().includes(queryLower) || false
    const categoryMatch = command.category.toLowerCase().includes(queryLower)
    
    // Keyword matches
    const keywordMatch = command.keywords?.some(keyword => 
      keyword.includes(queryLower) || queryLower.includes(keyword)
    ) || false
    
    // Fuzzy matching for partial words
    const fuzzyMatch = command.title.toLowerCase().split(' ').some(word =>
      queryLower.split(' ').some(queryWord => 
        word.includes(queryWord) || queryWord.includes(word)
      )
    )
    
    return titleMatch || subtitleMatch || categoryMatch || keywordMatch || fuzzyMatch
  })

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = []
    }
    acc[command.category].push(command)
    return acc
  }, {} as Record<string, CommandItem[]>)

  // Handle keyboard navigation and AI chat
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (isAIQuestion(query)) {
            // Handle AI question
            handleAIChat(query)
          } else if (filteredCommands[selectedIndex]) {
            // Handle navigation command
            filteredCommands[selectedIndex].action()
          }
          break
        case 'Escape':
          e.preventDefault()
          if (showAIResponse) {
            setShowAIResponse(false)
            setAiResponse('')
            setQuery('')
          } else {
            onClose()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, onClose, query, showAIResponse])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setShowAIResponse(false)
      setAiResponse('')
      setIsProcessingAI(false)
    }
  }, [isOpen])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Navigation': return 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
      case 'Projects': return 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
      case 'Experience': return 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6'
      case 'Publications': return 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
      case 'Skills': return 'M13 10V3L4 14h7v7l9-11h-7z'
      case 'Assistant': return 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
      default: return 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Command Palette */}
          <motion.div
            className="relative w-full max-w-2xl bg-surface/90 backdrop-blur-md rounded-2xl border border-accent/20 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Search Input */}
            <div className="flex items-center px-6 py-4 border-b border-accent/10">
              <svg className="w-5 h-5 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isAIQuestion(query) ? "Ask AI a question..." : "Search portfolio... (type to filter)"}
                className="flex-1 bg-transparent text-primary placeholder-secondary/60 text-lg outline-none font-mono"
              />
              <div className="flex items-center space-x-2 text-xs text-secondary/60">
                <kbd className="px-2 py-1 bg-accent/10 text-accent rounded border border-accent/20">↑↓</kbd>
                <span>navigate</span>
                <kbd className="px-2 py-1 bg-accent/10 text-accent rounded border border-accent/20">↵</kbd>
                <span>{isAIQuestion(query) ? 'ask AI' : 'select'}</span>
                <kbd className="px-2 py-1 bg-accent/10 text-accent rounded border border-accent/20">esc</kbd>
                <span>close</span>
              </div>
            </div>

            {/* AI Response Display */}
            {showAIResponse && (
              <motion.div
                className="px-6 py-4 border-b border-accent/10 bg-accent/5"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-primary text-sm leading-relaxed">{aiResponse}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {isProcessingAI ? (
                <div className="px-6 py-8 text-center text-secondary/60">
                  <motion.div
                    className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-lg font-medium mb-2">Processing AI request...</p>
                  <p className="text-sm">Please wait while I analyze your question</p>
                </div>
              ) : filteredCommands.length === 0 && !isAIQuestion(query) ? (
                <div className="px-6 py-8 text-center text-secondary/60">
                  <svg className="w-12 h-12 mx-auto mb-4 text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">No results found</p>
                  <p className="text-sm">Try searching for projects, skills, or sections</p>
                </div>
              ) : isAIQuestion(query) && !showAIResponse ? (
                <div className="px-6 py-8 text-center text-secondary/60">
                  <div className="w-12 h-12 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-2">AI Question Detected</p>
                  <p className="text-sm">Press Enter to ask the AI about: "{query}"</p>
                </div>
              ) : (
                <div className="py-2">
                  {Object.entries(groupedCommands).map(([category, items]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      <div className="flex items-center px-6 py-2 text-xs font-semibold text-accent uppercase tracking-wider">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getCategoryIcon(category)} />
                        </svg>
                        {category}
                      </div>
                      {items.map((command) => {
                        const globalIndex = filteredCommands.indexOf(command)
                        const isSelected = globalIndex === selectedIndex
                        
                        return (
                          <motion.button
                            key={command.id}
                            onClick={command.action}
                            className={`w-full flex items-center px-6 py-3 text-left transition-all duration-150 ${
                              isSelected 
                                ? 'bg-accent/10 border-r-2 border-accent' 
                                : 'hover:bg-accent/5'
                            }`}
                            whileHover={{ x: isSelected ? 0 : 4 }}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                              isSelected ? 'bg-accent/20 text-accent' : 'bg-secondary/10 text-secondary'
                            }`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={command.icon} />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium truncate ${
                                isSelected ? 'text-primary' : 'text-primary/90'
                              }`}>
                                {command.title}
                              </div>
                              {command.subtitle && (
                                <div className={`text-sm truncate ${
                                  isSelected ? 'text-secondary' : 'text-secondary/70'
                                }`}>
                                  {command.subtitle}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <svg className="w-4 h-4 text-accent ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette
