'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FiTerminal, FiBookOpen, FiCode, FiBarChart2, FiUploadCloud, FiTarget, FiZap, FiArrowRight, FiCpu, FiTrendingUp, FiLayers, FiCheckCircle } from 'react-icons/fi'

interface AboutProps {
  onNavigate: (screen: string) => void
}

export default function AboutSection({ onNavigate }: AboutProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="border-b border-border px-6 py-4 shrink-0">
          <h2 className="text-xl font-bold text-foreground">About CodePrep AI</h2>
          <p className="text-sm text-muted-foreground">Your adaptive coding interview preparation platform</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6 max-w-4xl mx-auto">
            {/* Hero */}
            <Card className="bg-card border-border shadow-xl shadow-black/20 overflow-hidden">
              <div className="relative p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <FiTerminal className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground tracking-tight">CodePrep AI</h1>
                      <p className="text-sm text-muted-foreground">Adaptive Interview & Study Planner</p>
                    </div>
                  </div>
                  <p className="text-base text-foreground leading-relaxed max-w-2xl">
                    CodePrep AI combines personalized study planning with AI-powered mock coding interviews.
                    It dynamically tracks your progress, identifies weak topics through interview performance,
                    and continuously adjusts your study roadmap -- serving learners from beginners to advanced.
                  </p>
                  <div className="flex items-center gap-3 mt-6">
                    <Button onClick={() => onNavigate('dashboard')} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                      Get Started <FiArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Badge variant="outline" className="border-accent/30 text-accent text-xs py-1 px-3">Powered by AI Agents</Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* How It Works */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">How It Works</h3>
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-card border-border shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/25 transition-all">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-3">
                      <span className="text-lg font-bold text-primary">1</span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Set Up Your Profile</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Tell us your experience level, target role, available study time, and topics you already know.
                      Optionally upload your course syllabus for a curriculum-aligned plan.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/25 transition-all">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mb-3">
                      <span className="text-lg font-bold text-accent">2</span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Practice & Interview</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Take AI mock interviews that adapt difficulty in real-time. Write code,
                      get instant feedback, and receive per-question scoring and analysis.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/25 transition-all">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'hsla(191, 97%, 70%, 0.15)' }}>
                      <span className="text-lg font-bold" style={{ color: 'hsl(191, 97%, 70%)' }}>3</span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Analyze & Improve</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Review performance analytics, identify weak areas, get custom practice problems,
                      and receive an adjusted study roadmap that evolves with you.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Key Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card border-border shadow-lg shadow-black/20">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                      <FiBookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Adaptive Study Plans</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Week-by-week roadmaps that adjust based on your performance, covering DSA, system design, and behavioral prep.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-lg shadow-black/20">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                      <FiUploadCloud className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Syllabus Upload</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Upload your course syllabus (PDF, DOCX, TXT) and get a study plan aligned with your actual curriculum.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-lg shadow-black/20">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'hsla(191, 97%, 70%, 0.15)' }}>
                      <FiCode className="w-4 h-4" style={{ color: 'hsl(191, 97%, 70%)' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">AI Mock Interviews</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Interactive coding interviews with real-time difficulty adjustment, code evaluation, and follow-up questions.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-lg shadow-black/20">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'hsla(326, 100%, 68%, 0.15)' }}>
                      <FiBarChart2 className="w-4 h-4" style={{ color: 'hsl(326, 100%, 68%)' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Progress Analytics</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Topic heatmaps, performance charts, weak area identification, and targeted practice problem generation.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-lg shadow-black/20">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-destructive/15 flex items-center justify-center shrink-0">
                      <FiZap className="w-4 h-4 text-destructive" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Gap Analysis</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Identifies topics missing from your syllabus but critical for interviews, with specific improvement suggestions.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-lg shadow-black/20">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'hsla(31, 100%, 65%, 0.15)' }}>
                      <FiTrendingUp className="w-4 h-4" style={{ color: 'hsl(31, 100%, 65%)' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Session History</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Full transcript replay, per-question scores, filterable session list, and performance tracking over time.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI Agents */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Powered by 3 Specialized AI Agents</h3>
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-card border-border shadow-lg shadow-black/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <CardTitle className="text-sm">Study Plan Agent</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Creates personalized, adaptive study roadmaps. Analyzes your uploaded syllabus, aligns topics with interview requirements,
                      identifies gaps, and generates week-by-week plans with resources and milestones.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">Syllabus-Aware</Badge>
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground">Knowledge Base</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-lg shadow-black/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <CardTitle className="text-sm">Mock Interview Agent</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Conducts interactive coding interviews that adapt difficulty in real-time. Presents problems, evaluates solutions,
                      asks follow-up questions, and generates detailed transcripts with scoring.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      <Badge variant="outline" className="text-xs border-accent/30 text-accent">Conversational</Badge>
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground">Memory</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-lg shadow-black/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(191, 97%, 70%)' }} />
                      <CardTitle className="text-sm">Progress Analyzer</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Reviews all past interview transcripts and practice history. Identifies weak topics, generates custom practice problems,
                      recommends resources, and outputs an adjusted study roadmap.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground" style={{ borderColor: 'hsla(191, 97%, 70%, 0.3)', color: 'hsl(191, 97%, 70%)' }}>Analytics</Badge>
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground">Adaptive</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Start Checklist */}
            <Card className="bg-card border-border shadow-xl shadow-black/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FiCheckCircle className="w-5 h-5 text-accent" />
                  Quick Start Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer" onClick={() => onNavigate('dashboard')}>
                    <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">1</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Set up your profile</p>
                      <p className="text-xs text-muted-foreground">Choose experience level, target role, and study preferences</p>
                    </div>
                    <FiArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer" onClick={() => onNavigate('dashboard')}>
                    <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center text-xs font-bold text-accent">2</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Upload your syllabus (optional)</p>
                      <p className="text-xs text-muted-foreground">Get a study plan aligned with your actual coursework</p>
                    </div>
                    <FiArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer" onClick={() => onNavigate('dashboard')}>
                    <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">3</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Generate your study plan</p>
                      <p className="text-xs text-muted-foreground">AI creates a personalized week-by-week roadmap</p>
                    </div>
                    <FiArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer" onClick={() => onNavigate('interview')}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'hsla(191, 97%, 70%, 0.15)', color: 'hsl(191, 97%, 70%)' }}>4</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Take a mock interview</p>
                      <p className="text-xs text-muted-foreground">Practice with adaptive AI-powered coding interviews</p>
                    </div>
                    <FiArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer" onClick={() => onNavigate('progress')}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'hsla(326, 100%, 68%, 0.15)', color: 'hsl(326, 100%, 68%)' }}>5</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Analyze & adjust</p>
                      <p className="text-xs text-muted-foreground">Review performance, get targeted practice, update your plan</p>
                    </div>
                    <FiArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supported Topics */}
            <Card className="bg-card border-border shadow-lg shadow-black/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><FiLayers className="w-4 h-4 text-primary" /> Topics Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Dynamic Programming', 'Sorting & Searching',
                    'Hash Tables', 'Stacks & Queues', 'Recursion', 'Greedy Algorithms', 'Backtracking',
                    'Bit Manipulation', 'System Design', 'Behavioral Prep', 'Concurrency', 'OOP Principles',
                    'Database Design', 'API Design', 'Operating Systems'].map((topic, i) => (
                    <Badge key={i} variant="outline" className="text-xs border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
