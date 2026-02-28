'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { uploadAndTrainDocument, getDocuments, deleteDocuments, type RAGDocument } from '@/lib/ragKnowledgeBase'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import Sidebar, { type NavScreen } from './sections/Sidebar'
import DashboardSection from './sections/DashboardSection'
import MockInterviewSection from './sections/MockInterviewSection'
import ProgressSection from './sections/ProgressSection'
import SessionHistorySection from './sections/SessionHistorySection'

// Agent IDs
const STUDY_PLAN_AGENT = '69a27f71ad98307a3fb27935'
const MOCK_INTERVIEW_AGENT = '69a27afb96ed232cfb0c7c52'
const PROGRESS_AGENT = '69a27afb71a7effa8577c00b'

// Knowledge Base
const RAG_ID = '69a27f4f00c2d274880f6c7b'

// Session record type
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

// ErrorBoundary class component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: '' })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function Page() {
  // Navigation
  const [activeScreen, setActiveScreen] = useState<NavScreen>('dashboard')
  const [useSample, setUseSample] = useState(false)

  // Agent state
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)

  // Study Plan state
  const [studyPlan, setStudyPlan] = useState<any>(null)
  const [planLoading, setPlanLoading] = useState(false)
  const [planError, setPlanError] = useState<string | null>(null)

  // Mock Interview state
  const [interviewSessionId, setInterviewSessionId] = useState<string | null>(null)
  const [interviewLoading, setInterviewLoading] = useState(false)
  const [interviewError, setInterviewError] = useState<string | null>(null)

  // Progress state
  const [progressAnalysis, setProgressAnalysis] = useState<any>(null)
  const [progressLoading, setProgressLoading] = useState(false)
  const [progressError, setProgressError] = useState<string | null>(null)

  // Sessions state
  const [sessions, setSessions] = useState<SessionRecord[]>([])

  // Syllabus upload state
  const [syllabusUploading, setSyllabusUploading] = useState(false)
  const [syllabusError, setSyllabusError] = useState<string | null>(null)
  const [syllabusDocuments, setSyllabusDocuments] = useState<RAGDocument[]>([])
  const [syllabusLoaded, setSyllabusLoaded] = useState(false)

  // Load persisted state
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem('codeprep_study_plan')
      if (savedPlan) setStudyPlan(JSON.parse(savedPlan))
      const savedSessions = localStorage.getItem('codeprep_sessions')
      if (savedSessions) setSessions(JSON.parse(savedSessions))
      const savedProgress = localStorage.getItem('codeprep_progress')
      if (savedProgress) setProgressAnalysis(JSON.parse(savedProgress))
    } catch {}
    // Load syllabus documents
    loadSyllabusDocuments()
  }, [])

  // Load syllabus documents from KB
  const loadSyllabusDocuments = async () => {
    try {
      const result = await getDocuments(RAG_ID)
      if (result.success && Array.isArray(result.documents)) {
        setSyllabusDocuments(result.documents)
        setSyllabusLoaded(true)
      }
    } catch {}
  }

  // Upload syllabus document
  const handleSyllabusUpload = useCallback(async (file: File) => {
    setSyllabusUploading(true)
    setSyllabusError(null)
    try {
      const result = await uploadAndTrainDocument(RAG_ID, file)
      if (result.success) {
        await loadSyllabusDocuments()
      } else {
        setSyllabusError(result.error || 'Failed to upload syllabus')
      }
    } catch {
      setSyllabusError('An error occurred during upload')
    }
    setSyllabusUploading(false)
  }, [])

  // Delete syllabus document
  const handleSyllabusDelete = useCallback(async (fileName: string) => {
    setSyllabusUploading(true)
    setSyllabusError(null)
    try {
      const result = await deleteDocuments(RAG_ID, [fileName])
      if (result.success) {
        setSyllabusDocuments(prev => prev.filter(d => d.fileName !== fileName))
      } else {
        setSyllabusError(result.error || 'Failed to delete document')
      }
    } catch {
      setSyllabusError('An error occurred')
    }
    setSyllabusUploading(false)
  }, [])

  // Generate Study Plan
  const handleGeneratePlan = useCallback(async (profile: any) => {
    setPlanLoading(true)
    setPlanError(null)
    setActiveAgentId(STUDY_PLAN_AGENT)
    try {
      const result = await callAIAgent(
        JSON.stringify({
          experience_level: profile.experience,
          target_role: profile.targetRole,
          hours_per_week: profile.hoursPerWeek,
          known_topics: profile.knownTopics,
          timeline: profile.timeline
        }),
        STUDY_PLAN_AGENT
      )
      if (result.success && result.response?.result) {
        const data = result.response.result
        setStudyPlan(data)
        localStorage.setItem('codeprep_study_plan', JSON.stringify(data))
      } else {
        setPlanError(result.error || 'Failed to generate plan')
      }
    } catch {
      setPlanError('An error occurred while generating the plan')
    }
    setPlanLoading(false)
    setActiveAgentId(null)
  }, [])

  // Start Interview
  const handleStartInterview = useCallback(async (topic: string, difficulty: string) => {
    setInterviewLoading(true)
    setInterviewError(null)
    setActiveAgentId(MOCK_INTERVIEW_AGENT)
    try {
      const result = await callAIAgent(
        `Start a mock coding interview. Topic: ${topic}, Difficulty: ${difficulty}`,
        MOCK_INTERVIEW_AGENT
      )
      if (result.success) {
        if (result.session_id) setInterviewSessionId(result.session_id)
        setInterviewLoading(false)
        setActiveAgentId(null)
        return result
      } else {
        setInterviewError(result.error || 'Failed to start interview')
      }
    } catch {
      setInterviewError('An error occurred')
    }
    setInterviewLoading(false)
    setActiveAgentId(null)
    return null
  }, [])

  // Send Interview Response
  const handleSendResponse = useCallback(async (message: string, code: string) => {
    setInterviewLoading(true)
    setInterviewError(null)
    setActiveAgentId(MOCK_INTERVIEW_AGENT)
    try {
      const result = await callAIAgent(
        message,
        MOCK_INTERVIEW_AGENT,
        { session_id: interviewSessionId || undefined }
      )
      if (result.success) {
        if (result.session_id) setInterviewSessionId(result.session_id)
        setInterviewLoading(false)
        setActiveAgentId(null)
        return result
      } else {
        setInterviewError(result.error || 'Failed to send response')
      }
    } catch {
      setInterviewError('An error occurred')
    }
    setInterviewLoading(false)
    setActiveAgentId(null)
    return null
  }, [interviewSessionId])

  // End Interview
  const handleEndInterview = useCallback(() => {
    setInterviewSessionId(null)
  }, [])

  // Save Session
  const handleSaveSession = useCallback((session: SessionRecord) => {
    setSessions(prev => {
      const next = [session, ...prev]
      localStorage.setItem('codeprep_sessions', JSON.stringify(next))
      return next
    })
  }, [])

  // Analyze Progress
  const handleAnalyze = useCallback(async () => {
    setProgressLoading(true)
    setProgressError(null)
    setActiveAgentId(PROGRESS_AGENT)
    try {
      const currentSessions = JSON.parse(localStorage.getItem('codeprep_sessions') || '[]')
      const currentPlan = JSON.parse(localStorage.getItem('codeprep_study_plan') || 'null')
      const result = await callAIAgent(
        JSON.stringify({ sessions: currentSessions, current_plan: currentPlan }),
        PROGRESS_AGENT
      )
      if (result.success && result.response?.result) {
        const data = result.response.result
        setProgressAnalysis(data)
        localStorage.setItem('codeprep_progress', JSON.stringify(data))
      } else {
        setProgressError(result.error || 'Failed to analyze progress')
      }
    } catch {
      setProgressError('An error occurred during analysis')
    }
    setProgressLoading(false)
    setActiveAgentId(null)
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex">
        <Sidebar
          activeScreen={activeScreen}
          onNavigate={setActiveScreen}
          activeAgentId={activeAgentId}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="h-12 border-b border-border flex items-center justify-end px-6 shrink-0 bg-card/50">
            <div className="flex items-center gap-2">
              <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground">Sample Data</Label>
              <Switch
                id="sample-toggle"
                checked={useSample}
                onCheckedChange={setUseSample}
              />
            </div>
          </div>

          {/* Content */}
          {activeScreen === 'dashboard' && (
            <DashboardSection
              studyPlan={studyPlan}
              sessions={sessions}
              loading={planLoading}
              error={planError}
              onGeneratePlan={handleGeneratePlan}
              useSample={useSample}
              syllabusDocuments={syllabusDocuments}
              syllabusUploading={syllabusUploading}
              syllabusError={syllabusError}
              onSyllabusUpload={handleSyllabusUpload}
              onSyllabusDelete={handleSyllabusDelete}
            />
          )}
          {activeScreen === 'interview' && (
            <MockInterviewSection
              onStartInterview={handleStartInterview}
              onSendResponse={handleSendResponse}
              onEndInterview={handleEndInterview}
              onSaveSession={handleSaveSession}
              loading={interviewLoading}
              error={interviewError}
              useSample={useSample}
            />
          )}
          {activeScreen === 'progress' && (
            <ProgressSection
              analysis={progressAnalysis}
              sessions={sessions}
              loading={progressLoading}
              error={progressError}
              onAnalyze={handleAnalyze}
              useSample={useSample}
            />
          )}
          {activeScreen === 'history' && (
            <SessionHistorySection
              sessions={sessions}
              useSample={useSample}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
