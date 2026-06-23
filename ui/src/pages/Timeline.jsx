import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Code, TestTube, FileText, Database, Shield, ChevronDown } from 'lucide-react';

const timelineItems = [
  {
    phase: 'Phase 1',
    title: 'Research & Information Gathering',
    date: 'Project Start',
    icon: BookOpen,
    color: 'primary',
    tasks: [
      'Research on SAST tools and static analysis',
      'Learning Python\'s AST module (parse, walk, visit)',
      'Understanding common vulnerabilities (OWASP Top 10)',
      'Research: SQL Injection, Path Traversal, Eval Injection',
    ],
    assignee: 'Zohar & Or',
  },
  {
    phase: 'Phase 2',
    title: 'Building the Vulnerable App',
    date: 'Development',
    icon: Database,
    color: 'destructive',
    tasks: [
      'Developing a Flask app with intentional vulnerabilities',
      'Creating vulnerable code examples per vulnerability type',
      'Adding SQL Injection, eval, path traversal bugs',
      'Documenting each vulnerability',
    ],
    assignee: 'Or',
  },
  {
    phase: 'Phase 3',
    title: 'Developing the Scanner',
    date: 'Development',
    icon: Code,
    color: 'secondary',
    tasks: [
      'Writing Python parser using ast module',
      'Detecting dangerous calls (eval, exec, open)',
      'Implementing taint analysis for data flow tracking',
      'Exporting results in SARIF format',
    ],
    assignee: 'Zohar',
  },
  {
    phase: 'Phase 4',
    title: 'Testing & Validation',
    date: 'Testing',
    icon: TestTube,
    color: 'chart-4',
    tasks: [
      'Running scanner against the vulnerable Flask app',
      'Measuring accuracy (false positives / negatives)',
      'Comparing results with existing tools (Bandit, Semgrep)',
      'Bug fixes and improvements',
    ],
    assignee: 'Zohar & Or',
  },
  {
    phase: 'Phase 5',
    title: 'Writing & Submission',
    date: 'Final Stage',
    icon: FileText,
    color: 'chart-5',
    tasks: [
      'Writing the full research paper',
      'Preparing the presentation slides',
      'Building this showcase application',
      'Final submission',
    ],
    assignee: 'Zohar & Or',
  },
];

const colorMap = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/25', dot: 'bg-primary', badge: 'bg-primary/10 text-primary border-primary/20' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/25', dot: 'bg-secondary', badge: 'bg-secondary/10 text-secondary border-secondary/20' },
  destructive: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/25', dot: 'bg-destructive', badge: 'bg-destructive/10 text-destructive border-destructive/20' },
  'chart-4': { bg: 'bg-chart-4/10', text: 'text-chart-4', border: 'border-chart-4/25', dot: 'bg-chart-4', badge: 'bg-chart-4/10 text-chart-4 border-chart-4/20' },
  'chart-5': { bg: 'bg-chart-5/10', text: 'text-chart-5', border: 'border-chart-5/25', dot: 'bg-chart-5', badge: 'bg-chart-5/10 text-chart-5 border-chart-5/20' },
};

function TimelineItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const c = colorMap[item.color];
  return (
    <div className="relative flex gap-4">
      {/* Icon */}
      <div className="relative z-10 shrink-0 flex flex-col items-center">
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <item.icon className={`w-4 h-4 ${c.text}`} />
        </div>
        {index < timelineItems.length - 1 && (
          <div className="flex-1 w-px bg-border/40 mt-2" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 bg-card border ${c.border} rounded-xl mb-4 overflow-hidden`}>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors text-left"
          onClick={() => setOpen(!open)}
        >
          <Badge className={`${c.badge} border text-[10px] shrink-0`}>{item.phase}</Badge>
          <span className="font-semibold text-sm flex-1">{item.title}</span>
          <span className="text-[11px] text-muted-foreground hidden sm:block">{item.date}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-border/30"
            >
              <div className="px-4 py-3">
                <ul className="space-y-1.5 mb-3">
                  {item.tasks.map((task, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-1.5 shrink-0`} />
                      {task}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  <span>{item.assignee}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Timeline() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="mb-8">
            <Badge className="bg-secondary/10 text-secondary border border-secondary/20 mb-3 text-xs gap-1">
              <Clock className="w-3 h-3" />Timeline
            </Badge>
            <h1 className="text-3xl font-bold mb-1">Project Workflow</h1>
            <p className="text-sm text-muted-foreground">Key phases from initial research to final submission</p>
          </div>
          <div>
            {timelineItems.map((item, i) => (
              <TimelineItem key={item.phase} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}