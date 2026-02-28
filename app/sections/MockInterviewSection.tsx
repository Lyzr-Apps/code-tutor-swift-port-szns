'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { FiPlay, FiSend, FiStopCircle, FiCode, FiMessageSquare, FiZap, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { Loader2 } from 'lucide-react'

interface ChatMessage {
  role: 'agent' | 'user'
  content: string
  timestamp: string
}

interface CurrentQuestion {
  number?: number
  difficulty?: string
  problem_statement?: string
  topic?: string
  hints?: string[]
}

interface Evaluation {
  correctness_score?: number
  complexity_analysis?: string
  code_quality_score?: number
  communication_score?: number
  feedback?: string
  follow_up_question?: string
}

interface SessionSummary {
  overall_score?: number
  questions_asked?: number
  difficulty_progression?: string[]
  strengths?: string[]
  weaknesses?: string[]
  recommendations?: string[]
  detailed_feedback?: string
}

interface SessionRecord {
  id: string
  date: string
  topic: string
  score: number
  difficulty: string
  duration: number
  transcript?: any[]
  summary?: any
}

interface MockInterviewProps {
  onStartInterview: (topic: string, difficulty: string) => Promise<any>
  onSendResponse: (message: string, code: string) => Promise<any>
  onEndInterview: () => void
  onSaveSession: (session: SessionRecord) => void
  loading: boolean
  error: string | null
  useSample: boolean
}

const SAMPLE_MESSAGES: ChatMessage[] = [
  { role: 'agent', content: 'Welcome to your mock coding interview! Today we\'ll focus on Arrays & Strings at Medium difficulty.\n\n**Question 1 (Medium) - Two Sum Variant:**\n\nGiven an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. You may assume each input has exactly one solution, and you may not use the same element twice.', timestamp: '2:00 PM' },
  { role: 'user', content: 'I\'d approach this using a hash map. I\'ll iterate through the array once, storing each number and its index. For each number, I check if target - num exists in the map.', timestamp: '2:02 PM' },
  { role: 'agent', content: '**Evaluation:**\n- Correctness: 9/10\n- Code Quality: 8/10\n- Communication: 9/10\n\nExcellent approach! Using a hash map gives O(n) time complexity which is optimal. Your explanation was clear and well-structured.\n\n**Follow-up:** What would you do if the array could contain duplicate values?', timestamp: '2:03 PM' },
]

const SAMPLE_QUESTION: CurrentQuestion = {
  number: 2,
  difficulty: 'Medium',
  problem_statement: 'Given a string s, find the length of the longest substring without repeating characters.',
  topic: 'Arrays & Strings',
  hints: ['Consider using a sliding window approach', 'A Set can help track characters in the current window']
}

const SAMPLE_SUMMARY: SessionSummary = {
  overall_score: 82,
  questions_asked: 4,
  difficulty_progression: ['Easy', 'Medium', 'Medium', 'Hard'],
  strengths: ['Strong hash map intuition', 'Clear communication', 'Good time complexity analysis'],
  weaknesses: ['Edge case handling could improve', 'Missed some optimization opportunities'],
  recommendations: ['Practice sliding window patterns', 'Work on hard-level DP problems'],
  detailed_feedback: 'Overall a solid performance. You demonstrated strong fundamentals with arrays and string manipulation. Focus on edge cases and try to identify when a problem has an O(n) solution before coding.'
}

export default function MockInterviewSection({ onStartInterview, onSendResponse, onEndInterview, onSaveSession, loading, error, useSample }: MockInterviewProps) {
  const [topic, setTopic] = useState('Arrays & Strings')
  const [difficulty, setDifficulty] = useState('auto')
  const [isActive, setIsActive] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [userInput, setUserInput] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [language, setLanguage] = useState('python')
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion | null>(null)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null)
  const [showHints, setShowHints] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (useSample && !isActive) {
      setMessages(SAMPLE_MESSAGES)
      setCurrentQuestion(SAMPLE_QUESTION)
      setIsActive(true)
      setTimer(180)
    }
  }, [useSample, isActive])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isTimerActive])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const handleStart = async () => {
    if (useSample) return
    setMessages([])
    setSessionSummary(null)
    setEvaluation(null)
    setCurrentQuestion(null)
    setShowHints(false)
    setTimer(0)
    setIsTimerActive(true)
    setIsActive(true)

    const result = await onStartInterview(topic, difficulty)
    if (result) {
      const data = result?.response?.result
      if (data?.current_question) setCurrentQuestion(data.current_question)
      const agentMsg = data?.message || data?.current_question?.problem_statement || 'Interview started.'
      setMessages([{ role: 'agent', content: agentMsg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    }
  }

  const handleSend = async () => {
    if (!userInput.trim() && !codeInput.trim()) return
    if (useSample) {
      setSessionSummary(SAMPLE_SUMMARY)
      setIsActive(false)
      return
    }

    const fullMessage = codeInput.trim()
      ? `${userInput}\n\n\`\`\`${language}\n${codeInput}\n\`\`\``
      : userInput

    setMessages(prev => [...prev, { role: 'user', content: fullMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    setUserInput('')

    const result = await onSendResponse(fullMessage, codeInput)
    if (result) {
      const data = result?.response?.result
      if (data?.evaluation) setEvaluation(data.evaluation)
      if (data?.current_question) setCurrentQuestion(data.current_question)

      const agentContent = data?.message || data?.evaluation?.feedback || ''
      if (agentContent) {
        setMessages(prev => [...prev, { role: 'agent', content: agentContent, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
      }

      if (data?.is_complete && data?.session_summary) {
        setSessionSummary(data.session_summary)
        setIsActive(false)
        setIsTimerActive(false)
        onSaveSession({
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          topic,
          score: data.session_summary?.overall_score ?? 0,
          difficulty: data.session_summary?.difficulty_progression?.slice(-1)?.[0] ?? difficulty,
          duration: Math.round(timer / 60),
          transcript: messages,
          summary: data.session_summary
        })
      }
    }
  }

  const handleEnd = () => {
    setIsTimerActive(false)
    setIsActive(false)
    onEndInterview()
  }

  function renderMarkdownInline(text: string) {
    if (!text) return null
    return (
      <div className="space-y-1.5">
        {text.split('\n').map((line, i) => {
          if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sm mt-2 mb-0.5">{line.slice(4)}</h4>
          if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-base mt-2 mb-0.5">{line.slice(3)}</h3>
          if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-sm">{line.slice(2, -2)}</p>
          if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-sm">{formatBold(line.slice(2))}</li>
          if (line.startsWith('```')) return <div key={i} className="font-mono text-xs bg-muted p-1 rounded" />
          if (!line.trim()) return <div key={i} className="h-0.5" />
          return <p key={i} className="text-sm">{formatBold(line)}</p>
        })}
      </div>
    )
  }

  function formatBold(text: string) {
    const parts = text.split(/\*\*(.*?)\*\*/g)
    if (parts.length === 1) return text
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part)
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">Mock Interview</h2>
            <p className="text-sm text-muted-foreground">Practice coding interviews with AI</p>
          </div>
          <div className="flex items-center gap-3">
            {isActive && <Badge variant="outline" className="border-accent/30 text-accent font-mono">{formatTime(timer)}</Badge>}
            {isActive && <Button variant="outline" size="sm" onClick={handleEnd} className="border-destructive/30 text-destructive hover:bg-destructive/10"><FiStopCircle className="w-4 h-4 mr-1" /> End</Button>}
          </div>
        </div>

        {!isActive && !sessionSummary ? (
          /* Setup Screen */
          <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-md bg-card border-border shadow-xl shadow-black/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FiCode className="w-5 h-5 text-primary" /> Start Interview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Topic Focus</label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Dynamic Programming', 'Sorting & Searching', 'Hash Tables', 'Stacks & Queues', 'System Design'].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Difficulty</label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="bg-input border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (Adaptive)</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button onClick={handleStart} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Starting...</> : <><FiPlay className="w-4 h-4 mr-2" /> Start Interview</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : sessionSummary ? (
          /* Session Summary */
          <ScrollArea className="flex-1">
            <div className="p-6 max-w-2xl mx-auto space-y-4">
              <Card className="bg-card border-border shadow-xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FiZap className="w-5 h-5 text-accent" /> Interview Complete</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-5xl font-bold text-primary">{sessionSummary.overall_score ?? 0}%</p>
                    <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
                  </div>
                  <Separator className="bg-border" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Questions Asked:</span> <span className="font-medium">{sessionSummary.questions_asked ?? 0}</span></div>
                    <div>
                      <span className="text-muted-foreground">Difficulty:</span>
                      <div className="flex gap-1 mt-1">{Array.isArray(sessionSummary.difficulty_progression) && sessionSummary.difficulty_progression.map((d, i) => <Badge key={i} variant="outline" className="text-xs">{d}</Badge>)}</div>
                    </div>
                  </div>
                  {Array.isArray(sessionSummary.strengths) && sessionSummary.strengths.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-accent mb-1">Strengths</p>
                      {sessionSummary.strengths.map((s, i) => <p key={i} className="text-sm ml-2">+ {s}</p>)}
                    </div>
                  )}
                  {Array.isArray(sessionSummary.weaknesses) && sessionSummary.weaknesses.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-destructive mb-1">Areas to Improve</p>
                      {sessionSummary.weaknesses.map((w, i) => <p key={i} className="text-sm ml-2">- {w}</p>)}
                    </div>
                  )}
                  {Array.isArray(sessionSummary.recommendations) && sessionSummary.recommendations.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Recommendations</p>
                      {sessionSummary.recommendations.map((r, i) => <p key={i} className="text-sm ml-2">{r}</p>)}
                    </div>
                  )}
                  {sessionSummary.detailed_feedback && (
                    <div className="bg-secondary/50 rounded-xl p-4 mt-2">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Detailed Feedback</p>
                      {renderMarkdownInline(sessionSummary.detailed_feedback)}
                    </div>
                  )}
                  <Button onClick={() => { setSessionSummary(null); setMessages([]) }} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">Start New Interview</Button>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        ) : (
          /* Active Interview */
          <div className="flex-1 flex overflow-hidden">
            {/* Chat Panel */}
            <div className="flex-1 flex flex-col border-r border-border" style={{ flex: '55%' }}>
              {/* Current Question Badge */}
              {currentQuestion && (
                <div className="px-4 py-2 border-b border-border bg-secondary/30 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/20 text-primary text-xs">Q{currentQuestion.number ?? '?'}</Badge>
                    <Badge variant="outline" className="text-xs">{currentQuestion.difficulty ?? 'Medium'}</Badge>
                    <span className="text-xs text-muted-foreground">{currentQuestion.topic ?? ''}</span>
                  </div>
                  {Array.isArray(currentQuestion.hints) && currentQuestion.hints.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setShowHints(!showHints)} className="text-xs text-muted-foreground hover:text-primary">
                      {showHints ? <FiChevronUp className="w-3 h-3 mr-1" /> : <FiChevronDown className="w-3 h-3 mr-1" />}
                      Hints ({currentQuestion.hints.length})
                    </Button>
                  )}
                </div>
              )}
              {showHints && currentQuestion && Array.isArray(currentQuestion.hints) && (
                <div className="px-4 py-2 border-b border-border bg-chart-5/5">
                  {currentQuestion.hints.map((h, i) => <p key={i} className="text-xs text-muted-foreground">Hint {i + 1}: {h}</p>)}
                </div>
              )}
              {/* Evaluation Bar */}
              {evaluation && (
                <div className="px-4 py-2 border-b border-border bg-secondary/30 shrink-0">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">Correctness: <strong className="text-primary">{evaluation.correctness_score ?? '-'}/10</strong></span>
                    <span className="text-muted-foreground">Code Quality: <strong className="text-primary">{evaluation.code_quality_score ?? '-'}/10</strong></span>
                    <span className="text-muted-foreground">Communication: <strong className="text-primary">{evaluation.communication_score ?? '-'}/10</strong></span>
                  </div>
                </div>
              )}
              {/* Messages */}
              <ScrollArea className="flex-1 px-4 py-3">
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={cn('max-w-[85%]', msg.role === 'agent' ? 'mr-auto' : 'ml-auto')}>
                      <div className={cn('p-3 rounded-xl', msg.role === 'agent' ? 'bg-primary/10 border border-primary/20' : 'bg-secondary border border-border')}>
                        <p className="text-xs text-muted-foreground mb-1">{msg.role === 'agent' ? 'Interviewer' : 'You'} - {msg.timestamp}</p>
                        {renderMarkdownInline(msg.content)}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="mr-auto max-w-[85%]">
                      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>
              {/* Input */}
              <div className="p-3 border-t border-border shrink-0">
                <div className="flex gap-2">
                  <Textarea placeholder="Type your response..." value={userInput} onChange={(e) => setUserInput(e.target.value)} className="bg-input border-border resize-none min-h-[40px] max-h-[100px]" rows={2} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }} />
                  <Button onClick={handleSend} disabled={loading || (!userInput.trim() && !codeInput.trim())} className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 self-end">
                    <FiSend className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Code Editor Panel */}
            <div className="flex flex-col" style={{ flex: '45%' }}>
              <div className="px-4 py-2 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <FiCode className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Code Editor</span>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32 h-8 text-xs bg-input border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 relative">
                <Textarea value={codeInput} onChange={(e) => setCodeInput(e.target.value)} placeholder={`// Write your ${language} solution here...\n\ndef solution():\n    pass`} className="absolute inset-0 font-mono text-sm bg-background border-0 rounded-none resize-none focus-visible:ring-0 p-4 leading-6" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
