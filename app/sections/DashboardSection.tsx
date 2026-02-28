'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { FiTarget, FiCalendar, FiAward, FiAlertTriangle, FiBookOpen, FiChevronDown, FiChevronUp, FiCode } from 'react-icons/fi'
import { Loader2 } from 'lucide-react'

interface StudyPlanWeekTopic {
  name?: string
  priority?: string
  estimated_hours?: number
  description?: string
  resources?: string[]
}

interface StudyPlanWeek {
  week_number?: number
  theme?: string
  topics?: StudyPlanWeekTopic[]
  milestones?: string[]
}

interface StudyPlan {
  plan_title?: string
  target_role?: string
  total_weeks?: number
  hours_per_week?: number
  weeks?: StudyPlanWeek[]
  key_focus_areas?: string[]
  summary?: string
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

interface DashboardProps {
  studyPlan: StudyPlan | null
  sessions: SessionRecord[]
  loading: boolean
  error: string | null
  onGeneratePlan: (profile: any) => void
  useSample: boolean
}

const TOPIC_OPTIONS = [
  'Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Dynamic Programming',
  'Sorting & Searching', 'Hash Tables', 'Stacks & Queues', 'Recursion',
  'Greedy Algorithms', 'Backtracking', 'Bit Manipulation', 'System Design'
]

const SAMPLE_PLAN: StudyPlan = {
  plan_title: 'Full Stack Software Engineer Interview Prep',
  target_role: 'Senior Software Engineer',
  total_weeks: 8,
  hours_per_week: 10,
  weeks: [
    { week_number: 1, theme: 'Foundations & Arrays', topics: [{ name: 'Arrays & Strings', priority: 'high', estimated_hours: 5, description: 'Master two-pointer, sliding window patterns', resources: ['LeetCode Array Problems', 'NeetCode 150'] }, { name: 'Hash Tables', priority: 'high', estimated_hours: 5, description: 'Hash map patterns and collision handling', resources: ['Hash Table Deep Dive'] }], milestones: ['Complete 15 array problems', 'Solve 10 hash table problems'] },
    { week_number: 2, theme: 'Linked Lists & Stacks', topics: [{ name: 'Linked Lists', priority: 'high', estimated_hours: 5, description: 'Reversal, merge, cycle detection', resources: ['Linked List Masterclass'] }, { name: 'Stacks & Queues', priority: 'medium', estimated_hours: 5, description: 'Monotonic stack, queue using stacks', resources: ['Stack Problems Collection'] }], milestones: ['Complete linked list reversal patterns', 'Implement monotonic stack'] },
    { week_number: 3, theme: 'Trees & Recursion', topics: [{ name: 'Binary Trees', priority: 'high', estimated_hours: 6, description: 'Traversals, BST operations, tree DP', resources: ['Tree Problem Set'] }, { name: 'Recursion', priority: 'medium', estimated_hours: 4, description: 'Recursive thinking and backtracking', resources: ['Recursion Patterns Guide'] }], milestones: ['Solve 20 tree problems'] },
  ],
  key_focus_areas: ['Data Structures', 'Algorithm Design', 'Time Complexity Analysis', 'System Design Basics'],
  summary: 'This 8-week plan covers core DSA topics with increasing difficulty, focusing on pattern recognition and problem-solving speed.'
}

const SAMPLE_SESSIONS: SessionRecord[] = [
  { id: '1', date: '2025-02-25', topic: 'Arrays & Strings', score: 85, difficulty: 'Medium', duration: 45, transcript: [] },
  { id: '2', date: '2025-02-23', topic: 'Dynamic Programming', score: 62, difficulty: 'Hard', duration: 60, transcript: [] },
  { id: '3', date: '2025-02-20', topic: 'Trees & Graphs', score: 78, difficulty: 'Medium', duration: 50, transcript: [] },
]

export default function DashboardSection({ studyPlan, sessions, loading, error, onGeneratePlan, useSample }: DashboardProps) {
  const [profile, setProfile] = useState({
    experience: '',
    targetRole: '',
    hoursPerWeek: 10,
    knownTopics: [] as string[],
    timeline: ''
  })
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null)
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem('codeprep_profile')
      if (saved) setProfile(JSON.parse(saved))
      const savedCompleted = localStorage.getItem('codeprep_completed')
      if (savedCompleted) setCompletedTopics(JSON.parse(savedCompleted))
    } catch {}
  }, [])

  const toggleTopic = (topic: string) => {
    setProfile(prev => {
      const next = prev.knownTopics.includes(topic)
        ? { ...prev, knownTopics: prev.knownTopics.filter(t => t !== topic) }
        : { ...prev, knownTopics: [...prev.knownTopics, topic] }
      return next
    })
  }

  const handleGenerate = () => {
    localStorage.setItem('codeprep_profile', JSON.stringify(profile))
    onGeneratePlan(profile)
  }

  const toggleCompleted = (key: string) => {
    setCompletedTopics(prev => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem('codeprep_completed', JSON.stringify(next))
      return next
    })
  }

  const displayPlan = useSample ? SAMPLE_PLAN : studyPlan
  const displaySessions = useSample ? SAMPLE_SESSIONS : sessions
  const avgScore = displaySessions.length > 0 ? Math.round(displaySessions.reduce((a, s) => a + s.score, 0) / displaySessions.length) : 0
  const priorityColor = (p?: string) => {
    if (p === 'high') return 'bg-destructive/20 text-destructive border-destructive/30'
    if (p === 'medium') return 'bg-chart-5/20 text-foreground border-chart-5/30'
    return 'bg-accent/20 text-accent-foreground border-accent/30'
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Plan your coding interview preparation</p>
          </div>
          {displayPlan && (
            <Badge variant="outline" className="text-primary border-primary/30">{displayPlan.target_role ?? 'Engineer'}</Badge>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-card border-border shadow-lg shadow-black/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center"><FiTarget className="w-5 h-5 text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground">Sessions</p><p className="text-xl font-bold">{displaySessions.length}</p></div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-lg shadow-black/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center"><FiAward className="w-5 h-5 text-accent" /></div>
                  <div><p className="text-xs text-muted-foreground">Avg Score</p><p className="text-xl font-bold">{avgScore}%</p></div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-lg shadow-black/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-chart-3/15 flex items-center justify-center"><FiCalendar className="w-5 h-5" style={{ color: 'hsl(191, 97%, 70%)' }} /></div>
                  <div><p className="text-xs text-muted-foreground">Plan Weeks</p><p className="text-xl font-bold">{displayPlan?.total_weeks ?? 0}</p></div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-lg shadow-black/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center"><FiAlertTriangle className="w-5 h-5 text-destructive" /></div>
                  <div><p className="text-xs text-muted-foreground">Focus Areas</p><p className="text-xl font-bold">{Array.isArray(displayPlan?.key_focus_areas) ? displayPlan.key_focus_areas.length : 0}</p></div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-5 gap-6">
              {/* Left: Roadmap or Profile Form */}
              <div className="col-span-3 space-y-4">
                {!displayPlan ? (
                  <Card className="bg-card border-border shadow-xl shadow-black/20">
                    <CardHeader><CardTitle className="flex items-center gap-2"><FiBookOpen className="w-5 h-5 text-primary" /> Setup Your Profile</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1.5 block">Experience Level</Label>
                          <Select value={profile.experience} onValueChange={(v) => setProfile(prev => ({ ...prev, experience: v }))}>
                            <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Select level" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                              <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                              <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                              <SelectItem value="expert">Expert (5+ years)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1.5 block">Target Role</Label>
                          <Input placeholder="e.g. Senior Software Engineer" value={profile.targetRole} onChange={(e) => setProfile(prev => ({ ...prev, targetRole: e.target.value }))} className="bg-input border-border" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Hours Per Week: {profile.hoursPerWeek}</Label>
                        <Slider value={[profile.hoursPerWeek]} onValueChange={(v) => setProfile(prev => ({ ...prev, hoursPerWeek: v[0] }))} min={5} max={40} step={1} className="mt-2" />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">Timeline</Label>
                        <Select value={profile.timeline} onValueChange={(v) => setProfile(prev => ({ ...prev, timeline: v }))}>
                          <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Select timeline" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4weeks">4 Weeks</SelectItem>
                            <SelectItem value="8weeks">8 Weeks</SelectItem>
                            <SelectItem value="12weeks">12 Weeks</SelectItem>
                            <SelectItem value="16weeks">16 Weeks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Known Topics</Label>
                        <div className="flex flex-wrap gap-2">
                          {TOPIC_OPTIONS.map((t) => (
                            <button key={t} onClick={() => toggleTopic(t)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all border', profile.knownTopics.includes(t) ? 'bg-primary/20 text-primary border-primary/30' : 'bg-secondary text-muted-foreground border-border hover:border-primary/30')}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      {error && <p className="text-sm text-destructive">{error}</p>}
                      <Button onClick={handleGenerate} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Plan...</> : 'Generate Study Plan'}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <Card className="bg-card border-border shadow-xl shadow-black/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{displayPlan.plan_title ?? 'Study Plan'}</CardTitle>
                        <p className="text-sm text-muted-foreground">{displayPlan.summary ?? ''}</p>
                      </CardHeader>
                      <CardContent>
                        {Array.isArray(displayPlan.key_focus_areas) && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {displayPlan.key_focus_areas.map((area, i) => (
                              <Badge key={i} variant="outline" className="text-xs border-primary/30 text-primary">{area}</Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {loading ? (
                      <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
                    ) : (
                      Array.isArray(displayPlan.weeks) && displayPlan.weeks.map((week) => {
                        const wn = week.week_number ?? 0
                        const isExpanded = expandedWeek === wn
                        return (
                          <Card key={wn} className="bg-card border-border shadow-lg shadow-black/20 transition-all hover:shadow-xl hover:shadow-black/25">
                            <button onClick={() => setExpandedWeek(isExpanded ? null : wn)} className="w-full text-left">
                              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">W{wn}</div>
                                  <div>
                                    <CardTitle className="text-sm">{week.theme ?? `Week ${wn}`}</CardTitle>
                                    <p className="text-xs text-muted-foreground">{Array.isArray(week.topics) ? week.topics.length : 0} topics</p>
                                  </div>
                                </div>
                                {isExpanded ? <FiChevronUp className="w-4 h-4 text-muted-foreground" /> : <FiChevronDown className="w-4 h-4 text-muted-foreground" />}
                              </CardHeader>
                            </button>
                            {isExpanded && (
                              <CardContent className="pt-0 space-y-3">
                                {Array.isArray(week.topics) && week.topics.map((topic, ti) => {
                                  const key = `w${wn}-t${ti}`
                                  return (
                                    <div key={ti} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                                      <Checkbox checked={!!completedTopics[key]} onCheckedChange={() => toggleCompleted(key)} className="mt-0.5" />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className={cn('text-sm font-medium', completedTopics[key] ? 'line-through text-muted-foreground' : '')}>{topic.name ?? 'Topic'}</span>
                                          <Badge variant="outline" className={cn('text-xs', priorityColor(topic.priority))}>{topic.priority ?? 'normal'}</Badge>
                                          <span className="text-xs text-muted-foreground ml-auto">{topic.estimated_hours ?? 0}h</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{topic.description ?? ''}</p>
                                        {Array.isArray(topic.resources) && topic.resources.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mt-2">
                                            {topic.resources.map((r, ri) => (
                                              <span key={ri} className="text-xs bg-muted px-2 py-0.5 rounded">{r}</span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                                {Array.isArray(week.milestones) && week.milestones.length > 0 && (
                                  <div className="border-t border-border pt-2 mt-2">
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">Milestones</p>
                                    {week.milestones.map((m, mi) => (
                                      <p key={mi} className="text-xs text-foreground flex items-center gap-1.5"><FiTarget className="w-3 h-3 text-accent shrink-0" />{m}</p>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            )}
                          </Card>
                        )
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Right column: Recent Sessions */}
              <div className="col-span-2 space-y-4">
                {displayPlan && (
                  <Card className="bg-card border-border shadow-lg shadow-black/20">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Plan Progress</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Completed</span>
                        <span>{Object.values(completedTopics).filter(Boolean).length} topics</span>
                      </div>
                      <Progress value={displayPlan.weeks && displayPlan.weeks.length > 0 ? (Object.values(completedTopics).filter(Boolean).length / (displayPlan.weeks.reduce((a, w) => a + (Array.isArray(w.topics) ? w.topics.length : 0), 0) || 1)) * 100 : 0} className="h-2" />
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-card border-border shadow-lg shadow-black/20">
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Recent Sessions</CardTitle></CardHeader>
                  <CardContent>
                    {displaySessions.length === 0 ? (
                      <div className="text-center py-6">
                        <FiCode className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No sessions yet</p>
                        <p className="text-xs text-muted-foreground">Start a mock interview to begin</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {displaySessions.slice(0, 5).map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                            <div>
                              <p className="text-sm font-medium">{session.topic}</p>
                              <p className="text-xs text-muted-foreground">{session.date} - {session.difficulty}</p>
                            </div>
                            <Badge className={cn('text-xs', session.score >= 80 ? 'bg-accent/20 text-accent' : session.score >= 60 ? 'bg-chart-5/20 text-foreground' : 'bg-destructive/20 text-destructive')}>{session.score}%</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {displayPlan && (
                  <Button variant="outline" onClick={() => { onGeneratePlan(profile) }} disabled={loading} className="w-full border-border hover:bg-primary/10 hover:text-primary">
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Regenerate Plan
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
