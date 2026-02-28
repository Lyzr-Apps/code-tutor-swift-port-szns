'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { FiTrendingUp, FiAlertCircle, FiBookOpen, FiLink, FiChevronDown, FiTarget, FiBarChart2 } from 'react-icons/fi'
import { Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface TopicAssessment {
  topic?: string
  strength_score?: number
  trend?: string
  sessions_count?: number
}

interface WeakArea {
  topic?: string
  severity?: string
  specific_gaps?: string[]
}

interface PracticeProblem {
  title?: string
  difficulty?: string
  topic?: string
  problem_statement?: string
  expected_approach?: string
  key_concepts?: string[]
}

interface ResourceRecommendation {
  title?: string
  type?: string
  url?: string
  description?: string
  target_topic?: string
}

interface AdjustedRoadmapWeek {
  week_number?: number
  theme?: string
  topics?: { name?: string; priority?: string; estimated_hours?: number; description?: string }[]
  milestones?: string[]
}

interface AdjustedRoadmap {
  total_weeks?: number
  weeks?: AdjustedRoadmapWeek[]
}

interface ProgressAnalysis {
  topic_assessment?: TopicAssessment[]
  weak_areas?: WeakArea[]
  practice_problems?: PracticeProblem[]
  resource_recommendations?: ResourceRecommendation[]
  adjusted_roadmap?: AdjustedRoadmap
  analysis_summary?: string
}

interface SessionRecord {
  id: string
  date: string
  topic: string
  score: number
  difficulty: string
  duration: number
}

interface ProgressProps {
  analysis: ProgressAnalysis | null
  sessions: SessionRecord[]
  loading: boolean
  error: string | null
  onAnalyze: () => void
  useSample: boolean
}

const SAMPLE_ANALYSIS: ProgressAnalysis = {
  topic_assessment: [
    { topic: 'Arrays & Strings', strength_score: 85, trend: 'improving', sessions_count: 5 },
    { topic: 'Hash Tables', strength_score: 90, trend: 'stable', sessions_count: 3 },
    { topic: 'Dynamic Programming', strength_score: 45, trend: 'needs_work', sessions_count: 2 },
    { topic: 'Trees & Graphs', strength_score: 72, trend: 'improving', sessions_count: 4 },
    { topic: 'Linked Lists', strength_score: 68, trend: 'stable', sessions_count: 2 },
    { topic: 'Sorting & Searching', strength_score: 78, trend: 'improving', sessions_count: 3 },
    { topic: 'Stacks & Queues', strength_score: 55, trend: 'needs_work', sessions_count: 1 },
    { topic: 'Recursion', strength_score: 60, trend: 'stable', sessions_count: 2 },
  ],
  weak_areas: [
    { topic: 'Dynamic Programming', severity: 'high', specific_gaps: ['Memoization patterns', 'State transition identification', 'Bottom-up vs top-down trade-offs'] },
    { topic: 'Stacks & Queues', severity: 'medium', specific_gaps: ['Monotonic stack applications', 'BFS/queue-based solutions'] },
    { topic: 'Recursion', severity: 'medium', specific_gaps: ['Backtracking optimization', 'Recursive tree traversals'] },
  ],
  practice_problems: [
    { title: 'Longest Common Subsequence', difficulty: 'Medium', topic: 'Dynamic Programming', problem_statement: 'Given two strings, find the length of their longest common subsequence.', expected_approach: 'Use a 2D DP table where dp[i][j] represents LCS of first i chars and first j chars.', key_concepts: ['2D DP', 'String comparison', 'Subsequence'] },
    { title: 'Implement Queue using Stacks', difficulty: 'Easy', topic: 'Stacks & Queues', problem_statement: 'Implement a FIFO queue using only two stacks.', expected_approach: 'Use two stacks: one for push, one for pop. Transfer elements when needed.', key_concepts: ['Stack operations', 'Amortized analysis'] },
    { title: 'Generate Parentheses', difficulty: 'Medium', topic: 'Recursion', problem_statement: 'Generate all combinations of well-formed parentheses for n pairs.', expected_approach: 'Backtracking with open/close count tracking.', key_concepts: ['Backtracking', 'Pruning', 'String building'] },
  ],
  resource_recommendations: [
    { title: 'Dynamic Programming Patterns', type: 'Course', url: 'https://example.com/dp-patterns', description: 'Comprehensive guide to DP problem patterns', target_topic: 'Dynamic Programming' },
    { title: 'NeetCode 150 - Stack Problems', type: 'Problem Set', url: 'https://example.com/neetcode-stacks', description: 'Curated stack and queue problems', target_topic: 'Stacks & Queues' },
  ],
  adjusted_roadmap: {
    total_weeks: 6,
    weeks: [
      { week_number: 1, theme: 'DP Foundations', topics: [{ name: 'Basic DP Patterns', priority: 'high', estimated_hours: 8, description: 'Fibonacci, climbing stairs, coin change' }], milestones: ['Solve 10 basic DP problems'] },
      { week_number: 2, theme: 'Advanced DP', topics: [{ name: '2D DP & String DP', priority: 'high', estimated_hours: 10, description: 'LCS, edit distance, regular expression matching' }], milestones: ['Complete 2D DP problem set'] },
    ]
  },
  analysis_summary: 'You show strong fundamentals in array manipulation and hash table usage. Your main weakness is in Dynamic Programming, particularly in identifying state transitions and choosing between top-down and bottom-up approaches. Focus the next 2-3 weeks on DP patterns before moving to advanced topics.'
}

const SAMPLE_CHART_DATA = [
  { name: 'Week 1', score: 55 },
  { name: 'Week 2', score: 62 },
  { name: 'Week 3', score: 68 },
  { name: 'Week 4', score: 72 },
  { name: 'Week 5', score: 78 },
  { name: 'Week 6', score: 82 },
]

export default function ProgressSection({ analysis, sessions, loading, error, onAnalyze, useSample }: ProgressProps) {
  const [expandedProblem, setExpandedProblem] = useState<number | null>(null)

  const displayAnalysis = useSample ? SAMPLE_ANALYSIS : analysis
  const chartData = useSample ? SAMPLE_CHART_DATA : sessions.map((s, i) => ({ name: `S${i + 1}`, score: s.score }))

  const strengthColor = (score?: number) => {
    if (!score) return 'bg-muted'
    if (score >= 80) return 'bg-accent/60'
    if (score >= 60) return 'bg-chart-5/60'
    return 'bg-destructive/60'
  }

  const trendIcon = (t?: string) => {
    if (t === 'improving') return <FiTrendingUp className="w-3 h-3 text-accent" />
    if (t === 'needs_work') return <FiAlertCircle className="w-3 h-3 text-destructive" />
    return <span className="text-xs text-muted-foreground">--</span>
  }

  function renderMarkdown(text: string) {
    if (!text) return null
    return (
      <div className="space-y-1.5">
        {text.split('\n').map((line, i) => {
          if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sm mt-2">{line.slice(4)}</h4>
          if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-base mt-2">{line.slice(3)}</h3>
          if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-sm">{line.slice(2)}</li>
          if (!line.trim()) return <div key={i} className="h-1" />
          const parts = line.split(/\*\*(.*?)\*\*/g)
          return <p key={i} className="text-sm">{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}</p>
        })}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">Progress & Insights</h2>
            <p className="text-sm text-muted-foreground">Analyze performance and get personalized recommendations</p>
          </div>
          <Button onClick={onAnalyze} disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><FiBarChart2 className="w-4 h-4 mr-2" /> Analyze & Adjust</>}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {error && <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>}

            {!displayAnalysis ? (
              <div className="text-center py-16">
                <FiBarChart2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Analysis Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">Complete some mock interviews, then click &quot;Analyze &amp; Adjust&quot; to get personalized insights and recommendations.</p>
              </div>
            ) : (
              <>
                {/* Summary */}
                {displayAnalysis.analysis_summary && (
                  <Card className="bg-card border-border shadow-xl shadow-black/20">
                    <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FiTarget className="w-4 h-4 text-primary" /> Analysis Summary</CardTitle></CardHeader>
                    <CardContent>{renderMarkdown(displayAnalysis.analysis_summary)}</CardContent>
                  </Card>
                )}

                {/* Performance Chart + Topic Heatmap */}
                <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-card border-border shadow-lg shadow-black/20">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Performance Over Time</CardTitle></CardHeader>
                    <CardContent>
                      {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(232, 16%, 28%)" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(228, 10%, 62%)' }} stroke="hsl(232, 16%, 28%)" />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(228, 10%, 62%)' }} stroke="hsl(232, 16%, 28%)" />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(232, 16%, 18%)', border: '1px solid hsl(232, 16%, 28%)', borderRadius: '8px', color: 'hsl(60, 30%, 96%)' }} />
                            <Line type="monotone" dataKey="score" stroke="hsl(265, 89%, 72%)" strokeWidth={2} dot={{ fill: 'hsl(265, 89%, 72%)', r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No data to display yet</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border shadow-lg shadow-black/20">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Topic Strength Heatmap</CardTitle></CardHeader>
                    <CardContent>
                      {Array.isArray(displayAnalysis.topic_assessment) && displayAnalysis.topic_assessment.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {displayAnalysis.topic_assessment.map((t, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                              <div className={cn('w-3 h-3 rounded-sm shrink-0', strengthColor(t.strength_score))} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{t.topic ?? 'Topic'}</p>
                                <div className="flex items-center gap-1.5">
                                  <Progress value={t.strength_score ?? 0} className="h-1.5 flex-1" />
                                  <span className="text-xs text-muted-foreground w-8 text-right">{t.strength_score ?? 0}%</span>
                                  {trendIcon(t.trend)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No assessment data</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Weak Areas */}
                {Array.isArray(displayAnalysis.weak_areas) && displayAnalysis.weak_areas.length > 0 && (
                  <Card className="bg-card border-border shadow-lg shadow-black/20">
                    <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FiAlertCircle className="w-4 h-4 text-destructive" /> Weak Areas</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-3">
                        {displayAnalysis.weak_areas.map((area, i) => (
                          <div key={i} className="p-3 rounded-xl bg-secondary/50 border border-border">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium">{area.topic ?? 'Topic'}</p>
                              <Badge variant="outline" className={cn('text-xs', area.severity === 'high' ? 'border-destructive/30 text-destructive' : 'border-chart-5/30 text-foreground')}>{area.severity ?? 'medium'}</Badge>
                            </div>
                            {Array.isArray(area.specific_gaps) && area.specific_gaps.map((gap, gi) => (
                              <p key={gi} className="text-xs text-muted-foreground ml-2">- {gap}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Practice Problems */}
                {Array.isArray(displayAnalysis.practice_problems) && displayAnalysis.practice_problems.length > 0 && (
                  <Card className="bg-card border-border shadow-lg shadow-black/20">
                    <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FiBookOpen className="w-4 h-4 text-primary" /> Recommended Practice Problems</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {displayAnalysis.practice_problems.map((prob, i) => (
                        <Collapsible key={i} open={expandedProblem === i} onOpenChange={() => setExpandedProblem(expandedProblem === i ? null : i)}>
                          <CollapsibleTrigger className="w-full text-left p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cn('text-xs', prob.difficulty === 'Hard' ? 'border-destructive/30 text-destructive' : prob.difficulty === 'Medium' ? 'border-chart-5/30 text-foreground' : 'border-accent/30 text-accent')}>{prob.difficulty ?? 'Medium'}</Badge>
                              <span className="text-sm font-medium">{prob.title ?? 'Problem'}</span>
                              <span className="text-xs text-muted-foreground">({prob.topic ?? ''})</span>
                            </div>
                            <FiChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', expandedProblem === i ? 'rotate-180' : '')} />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-3 py-3 space-y-2">
                            <p className="text-sm text-foreground">{prob.problem_statement ?? ''}</p>
                            {prob.expected_approach && (
                              <div className="bg-muted/50 rounded-lg p-2">
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Expected Approach</p>
                                <p className="text-xs text-foreground">{prob.expected_approach}</p>
                              </div>
                            )}
                            {Array.isArray(prob.key_concepts) && prob.key_concepts.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {prob.key_concepts.map((c, ci) => <Badge key={ci} variant="outline" className="text-xs border-primary/30 text-primary">{c}</Badge>)}
                              </div>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Resources */}
                {Array.isArray(displayAnalysis.resource_recommendations) && displayAnalysis.resource_recommendations.length > 0 && (
                  <Card className="bg-card border-border shadow-lg shadow-black/20">
                    <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FiLink className="w-4 h-4 text-accent" /> Recommended Resources</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {displayAnalysis.resource_recommendations.map((res, i) => (
                          <div key={i} className="p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium">{res.title ?? 'Resource'}</p>
                              <Badge variant="outline" className="text-xs">{res.type ?? 'Link'}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{res.description ?? ''}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-primary">{res.target_topic ?? ''}</span>
                              {res.url && <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">Open</a>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Adjusted Roadmap */}
                {displayAnalysis.adjusted_roadmap && Array.isArray(displayAnalysis.adjusted_roadmap.weeks) && displayAnalysis.adjusted_roadmap.weeks.length > 0 && (
                  <Card className="bg-card border-border shadow-lg shadow-black/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FiTarget className="w-4 h-4 text-accent" /> Adjusted Roadmap
                        <Badge variant="outline" className="text-xs border-accent/30 text-accent ml-auto">{displayAnalysis.adjusted_roadmap.total_weeks ?? '?'} weeks</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {displayAnalysis.adjusted_roadmap.weeks.map((week, wi) => (
                        <div key={wi} className="p-3 rounded-xl bg-secondary/50 border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center text-xs font-bold text-accent">W{week.week_number ?? wi + 1}</div>
                            <p className="text-sm font-medium">{week.theme ?? `Week ${wi + 1}`}</p>
                          </div>
                          {Array.isArray(week.topics) && week.topics.map((t, ti) => (
                            <div key={ti} className="ml-9 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">{t.name ?? 'Topic'}</span>
                                <Badge variant="outline" className={cn('text-xs', t.priority === 'high' ? 'border-destructive/30 text-destructive' : 'border-chart-5/30 text-foreground')}>{t.priority ?? 'normal'}</Badge>
                                <span className="text-xs text-muted-foreground ml-auto">{t.estimated_hours ?? 0}h</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{t.description ?? ''}</p>
                            </div>
                          ))}
                          {Array.isArray(week.milestones) && week.milestones.map((m, mi) => (
                            <p key={mi} className="text-xs text-accent ml-9 mt-1"><FiTarget className="w-3 h-3 inline mr-1" />{m}</p>
                          ))}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
