'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FiHome, FiCode, FiBarChart2, FiClock, FiTerminal, FiUser, FiInfo } from 'react-icons/fi'

export type NavScreen = 'dashboard' | 'interview' | 'progress' | 'history' | 'about'

interface SidebarProps {
  activeScreen: NavScreen
  onNavigate: (screen: NavScreen) => void
  activeAgentId: string | null
}

const NAV_ITEMS: { id: NavScreen; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
  { id: 'interview', label: 'Mock Interview', icon: <FiCode className="w-5 h-5" /> },
  { id: 'progress', label: 'Progress & Insights', icon: <FiBarChart2 className="w-5 h-5" /> },
  { id: 'history', label: 'Session History', icon: <FiClock className="w-5 h-5" /> },
  { id: 'about', label: 'About', icon: <FiInfo className="w-5 h-5" /> },
]

const AGENTS = [
  { id: '69a27f71ad98307a3fb27935', name: 'Study Plan Agent', purpose: 'Syllabus-aware study roadmaps' },
  { id: '69a27afb96ed232cfb0c7c52', name: 'Mock Interview Agent', purpose: 'Conducts coding interviews' },
  { id: '69a27afb71a7effa8577c00b', name: 'Progress Analyzer', purpose: 'Analyzes performance trends' },
]

export default function Sidebar({ activeScreen, onNavigate, activeAgentId }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col shrink-0">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
            <FiTerminal className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground">CodePrep AI</h1>
            <p className="text-xs text-muted-foreground">Interview & Study Planner</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                activeScreen === item.id
                  ? 'bg-primary/15 text-primary shadow-md shadow-primary/10'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 px-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">AI Agents</p>
          <div className="space-y-2">
            {AGENTS.map((agent) => (
              <div key={agent.id} className="flex items-start gap-2 p-2 rounded-lg">
                <div className={cn(
                  'w-2 h-2 rounded-full mt-1.5 shrink-0 transition-colors',
                  activeAgentId === agent.id ? 'bg-accent animate-pulse' : 'bg-muted-foreground/40'
                )} />
                <div>
                  <p className="text-xs font-medium text-foreground">{agent.name}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{agent.purpose}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <FiUser className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Student</p>
            <p className="text-xs text-muted-foreground">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  )
}
