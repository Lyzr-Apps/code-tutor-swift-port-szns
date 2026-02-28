'use client'

import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FiSearch, FiEye, FiClock, FiX, FiMessageSquare } from 'react-icons/fi'

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

interface SessionHistoryProps {
  sessions: SessionRecord[]
  useSample: boolean
}

const SAMPLE_SESSIONS: SessionRecord[] = [
  { id: '1', date: '2025-02-25', topic: 'Arrays & Strings', score: 85, difficulty: 'Medium', duration: 45, transcript: [{ role: 'agent', content: 'Given an array of integers, find two numbers that add up to a specific target.' }, { role: 'user', content: 'I would use a hash map approach. Iterate through the array, for each number check if target - num exists in the map.' }, { role: 'agent', content: 'Excellent approach! That gives you O(n) time complexity. Can you code it up?' }], summary: { overall_score: 85, strengths: ['Good problem decomposition', 'Optimal time complexity'], weaknesses: ['Could improve variable naming'], recommendations: ['Practice more edge case handling'] } },
  { id: '2', date: '2025-02-23', topic: 'Dynamic Programming', score: 62, difficulty: 'Hard', duration: 60, transcript: [{ role: 'agent', content: 'Find the longest increasing subsequence in an array.' }, { role: 'user', content: 'I think we can use dynamic programming with a dp array tracking the length at each index.' }], summary: { overall_score: 62, strengths: ['Identified DP approach'], weaknesses: ['Missed O(n log n) optimization', 'Struggled with recurrence relation'], recommendations: ['Review DP patterns', 'Practice more subsequence problems'] } },
  { id: '3', date: '2025-02-20', topic: 'Trees & Graphs', score: 78, difficulty: 'Medium', duration: 50, transcript: [{ role: 'agent', content: 'Implement a function to check if a binary tree is balanced.' }], summary: { overall_score: 78, strengths: ['Good recursive thinking'], weaknesses: ['Initial solution was O(n^2)'], recommendations: ['Learn bottom-up approach'] } },
  { id: '4', date: '2025-02-18', topic: 'Hash Tables', score: 92, difficulty: 'Easy', duration: 30, transcript: [], summary: { overall_score: 92, strengths: ['Fast implementation', 'Clean code'], weaknesses: [], recommendations: ['Move to medium difficulty'] } },
  { id: '5', date: '2025-02-15', topic: 'Sorting & Searching', score: 71, difficulty: 'Medium', duration: 55, transcript: [], summary: { overall_score: 71, strengths: ['Good binary search intuition'], weaknesses: ['Off-by-one errors'], recommendations: ['Practice boundary conditions'] } },
]

export default function SessionHistorySection({ sessions, useSample }: SessionHistoryProps) {
  const [topicFilter, setTopicFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null)

  const displaySessions = useSample ? SAMPLE_SESSIONS : sessions

  const filteredSessions = useMemo(() => {
    return displaySessions.filter(s => {
      if (topicFilter !== 'all' && s.topic !== topicFilter) return false
      if (difficultyFilter !== 'all' && s.difficulty !== difficultyFilter) return false
      if (searchQuery && !s.topic.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [displaySessions, topicFilter, difficultyFilter, searchQuery])

  const uniqueTopics = useMemo(() => {
    const topics = new Set(displaySessions.map(s => s.topic))
    return Array.from(topics)
  }, [displaySessions])

  const totalDuration = filteredSessions.reduce((a, s) => a + s.duration, 0)
  const avgScore = filteredSessions.length > 0 ? Math.round(filteredSessions.reduce((a, s) => a + s.score, 0) / filteredSessions.length) : 0

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="border-b border-border px-6 py-4 shrink-0">
          <h2 className="text-xl font-bold text-foreground">Session History</h2>
          <p className="text-sm text-muted-foreground">Review past interview sessions and transcripts</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-card border-border shadow-lg shadow-black/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{filteredSessions.length}</p>
                  <p className="text-xs text-muted-foreground">Total Sessions</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-lg shadow-black/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-accent">{avgScore}%</p>
                  <p className="text-xs text-muted-foreground">Average Score</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-lg shadow-black/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold" style={{ color: 'hsl(191, 97%, 70%)' }}>{totalDuration}m</p>
                  <p className="text-xs text-muted-foreground">Total Practice Time</p>
                </CardContent>
              </Card>
            </div>

            {/* Filter Bar */}
            <Card className="bg-card border-border shadow-lg shadow-black/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search by topic..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-input border-border" />
                  </div>
                  <Select value={topicFilter} onValueChange={setTopicFilter}>
                    <SelectTrigger className="w-48 bg-input border-border"><SelectValue placeholder="Topic" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      {uniqueTopics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-40 bg-input border-border"><SelectValue placeholder="Difficulty" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  {(topicFilter !== 'all' || difficultyFilter !== 'all' || searchQuery) && (
                    <Button variant="ghost" size="sm" onClick={() => { setTopicFilter('all'); setDifficultyFilter('all'); setSearchQuery('') }}>
                      <FiX className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sessions Table */}
            <Card className="bg-card border-border shadow-xl shadow-black/20">
              <CardContent className="p-0">
                {filteredSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <FiClock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-base font-medium text-muted-foreground">No sessions found</p>
                    <p className="text-sm text-muted-foreground mt-1">Complete a mock interview to see your history</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">Topic</TableHead>
                        <TableHead className="text-muted-foreground">Difficulty</TableHead>
                        <TableHead className="text-muted-foreground">Score</TableHead>
                        <TableHead className="text-muted-foreground">Duration</TableHead>
                        <TableHead className="text-muted-foreground text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSessions.map((session) => (
                        <TableRow key={session.id} className="border-border hover:bg-secondary/30 transition-colors">
                          <TableCell className="text-sm">{session.date}</TableCell>
                          <TableCell><Badge variant="outline" className="border-primary/30 text-primary text-xs">{session.topic}</Badge></TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn('text-xs', session.difficulty === 'Hard' ? 'border-destructive/30 text-destructive' : session.difficulty === 'Medium' ? 'border-chart-5/30 text-foreground' : 'border-accent/30 text-accent')}>{session.difficulty}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className={cn('font-bold text-sm', session.score >= 80 ? 'text-accent' : session.score >= 60 ? 'text-foreground' : 'text-destructive')}>{session.score}%</span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{session.duration}m</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedSession(session)} className="hover:bg-primary/10 hover:text-primary">
                              <FiEye className="w-4 h-4 mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* Transcript Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={(open) => { if (!open) setSelectedSession(null) }}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FiMessageSquare className="w-5 h-5 text-primary" />
              Session Transcript - {selectedSession?.topic ?? 'Session'}
            </DialogTitle>
            <DialogDescription>
              {selectedSession?.date} | {selectedSession?.difficulty} | Score: {selectedSession?.score}%
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Transcript Messages */}
            {Array.isArray(selectedSession?.transcript) && selectedSession.transcript.length > 0 ? (
              <div className="space-y-3">
                {selectedSession.transcript.map((msg: any, i: number) => (
                  <div key={i} className={cn('p-3 rounded-xl text-sm', msg?.role === 'agent' ? 'bg-primary/10 border border-primary/20 ml-0 mr-8' : 'bg-secondary border border-border ml-8 mr-0')}>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">{msg?.role === 'agent' ? 'Interviewer' : 'You'}</p>
                    <p className="text-foreground">{msg?.content ?? ''}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No transcript available for this session</p>
            )}

            {/* Summary */}
            {selectedSession?.summary && (
              <Card className="bg-secondary/50 border-border">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Session Summary</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Overall Score:</span>
                    <span className="font-bold text-primary">{selectedSession.summary?.overall_score ?? selectedSession.score}%</span>
                  </div>
                  {Array.isArray(selectedSession.summary?.strengths) && selectedSession.summary.strengths.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-accent mb-1">Strengths</p>
                      {selectedSession.summary.strengths.map((s: string, i: number) => (
                        <p key={i} className="text-xs text-foreground ml-2">+ {s}</p>
                      ))}
                    </div>
                  )}
                  {Array.isArray(selectedSession.summary?.weaknesses) && selectedSession.summary.weaknesses.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-destructive mb-1">Areas to Improve</p>
                      {selectedSession.summary.weaknesses.map((w: string, i: number) => (
                        <p key={i} className="text-xs text-foreground ml-2">- {w}</p>
                      ))}
                    </div>
                  )}
                  {Array.isArray(selectedSession.summary?.recommendations) && selectedSession.summary.recommendations.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Recommendations</p>
                      {selectedSession.summary.recommendations.map((r: string, i: number) => (
                        <p key={i} className="text-xs text-foreground ml-2">{r}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
