import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, TreePine, Code, Database, FileSearch, AlertTriangle, Globe, Lock, Terminal, Upload, Wifi, Eye, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ── Core concepts shown as tall hero cards ──────────────────────────────────
const concepts = [
  {
    icon: Shield,
    title: 'SAST',
    subtitle: 'Static Application Security Testing',
    content: 'Scans source code without running the app (white-box). Performed early in the SDLC, it can detect ~50% of vulnerabilities and automatically block CI/CD builds with critical flaws.',
    color: 'primary',
  },
  {
    icon: TreePine,
    title: 'AST',
    subtitle: 'Abstract Syntax Tree',
    content: 'Python parses source into a structured node tree. Using ast.parse() + ast.walk() we traverse every Statement and Expression to detect dangerous patterns before runtime.',
    color: 'secondary',
  },
  {
    icon: Code,
    title: 'Our Approach',
    subtitle: 'Code → Graph → Flag',
    content: 'Convert source text to an AST, traverse the graph, and flag risky nodes. E.g. a Call to eval() whose argument is an Identifier (variable) rather than a Literal triggers a finding.',
    color: 'accent',
  },
];

// ── Vulnerability topics shown as a grid of flip cards ──────────────────────
const vulnTopics = [
  { icon: Database,     title: 'SQL Injection',               tag: 'CWE-89',  color: 'chart-4',    content: 'String concatenation in SQL queries lets attackers inject commands like \' OR \'1\'=\'1\'. Fix: parameterized queries.' },
  { icon: FileSearch,   title: 'Path Traversal',              tag: 'CWE-22',  color: 'destructive', content: 'Using ../ in file paths reaches outside the allowed directory. Fix: os.path.basename() + realpath() validation.' },
  { icon: AlertTriangle,title: 'Eval / Code Injection',       tag: 'CWE-94',  color: 'chart-5',    content: 'eval() on user input executes arbitrary Python code. Fix: ast.literal_eval() or remove eval entirely.' },
  { icon: Globe,        title: 'XSS',                         tag: 'CWE-79',  color: 'chart-4',    content: 'User input reflected/stored in HTML without escaping runs scripts in victims\' browsers. Fix: markupsafe.escape(), Jinja2 auto-escape.' },
  { icon: Lock,         title: 'CSRF & Missing Authz',        tag: 'CWE-352', color: 'secondary',  content: 'CSRF forges authenticated requests; missing authz lets any user hit admin routes. Fix: CSRF tokens + role checks.' },
  { icon: Terminal,     title: 'OS Command Injection',        tag: 'CWE-78',  color: 'destructive', content: 'shell=True with user input lets attackers append ; rm -rf /. Fix: subprocess list args, shell=False.' },
  { icon: Upload,       title: 'Unrestricted File Upload',    tag: 'CWE-434', color: 'chart-5',    content: 'No extension/MIME check lets attackers upload web shells. Fix: allowlist + secure_filename + serve outside web root.' },
  { icon: Wifi,         title: 'SSRF',                        tag: 'CWE-918', color: 'accent',     content: 'Server fetches attacker-controlled URLs, reaching internal services. Fix: domain allowlist, block private IPs.' },
  { icon: Eye,          title: 'Sensitive Info Exposure',     tag: 'CWE-200', color: 'primary',    content: 'Hardcoded secrets and debug endpoints leak credentials. Fix: env vars, secrets manager, disable debug in prod.' },
  { icon: CheckCircle,  title: 'Improper Input Validation',   tag: 'CWE-20',  color: 'chart-4',    content: 'Unvalidated input in math, DB ops, or redirects causes fraud/crashes. Fix: type-cast, range checks, redirect allowlist.' },
];

const colorMap = {
  primary:    { icon: 'text-primary',     bg: 'bg-primary/10',     border: 'border-primary/30',     glow: 'hover:border-primary/60',     tag: 'bg-primary/10 text-primary'     },
  secondary:  { icon: 'text-secondary',   bg: 'bg-secondary/10',   border: 'border-secondary/30',   glow: 'hover:border-secondary/60',   tag: 'bg-secondary/10 text-secondary'  },
  accent:     { icon: 'text-accent',      bg: 'bg-accent/10',      border: 'border-accent/30',      glow: 'hover:border-accent/60',      tag: 'bg-accent/10 text-accent'        },
  'chart-4':  { icon: 'text-chart-4',     bg: 'bg-chart-4/10',     border: 'border-chart-4/30',     glow: 'hover:border-chart-4/60',     tag: 'bg-chart-4/10 text-chart-4'      },
  'chart-5':  { icon: 'text-chart-5',     bg: 'bg-chart-5/10',     border: 'border-chart-5/30',     glow: 'hover:border-chart-5/60',     tag: 'bg-chart-5/10 text-chart-5'      },
  destructive:{ icon: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', glow: 'hover:border-destructive/60', tag: 'bg-destructive/10 text-destructive'},
};

function ConceptCard({ concept, index }) {
  const c = colorMap[concept.color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className={`flex-1 bg-card border ${c.border} rounded-2xl p-5 flex flex-col gap-3`}
    >
      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
        <concept.icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div>
        <p className={`text-lg font-bold ${c.icon}`}>{concept.title}</p>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">{concept.subtitle}</p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{concept.content}</p>
    </motion.div>
  );
}

function VulnCard({ topic, index }) {
  const [flipped, setFlipped] = useState(false);
  const c = colorMap[topic.color];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 + index * 0.05, duration: 0.25 }}
      className="cursor-pointer"
      style={{ perspective: 900 }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', height: 160 }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-xl border ${c.border} ${c.glow} bg-card transition-colors p-3 flex flex-col gap-2`}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
              <topic.icon className={`w-3.5 h-3.5 ${c.icon}`} />
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${c.tag}`}>{topic.tag}</span>
          </div>
          <p className="text-xs font-semibold leading-snug">{topic.title}</p>
          <p className="text-[10px] text-muted-foreground/50 mt-auto">Click to learn more →</p>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-xl border ${c.border} ${c.bg} p-3 flex flex-col justify-between overflow-hidden`}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-[11px] text-foreground/90 leading-relaxed overflow-auto">{topic.content}</p>
          <p className={`text-[10px] font-semibold mt-1 shrink-0 ${c.icon}`}>↩ Flip back</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-3 py-4 space-y-6">

          {/* Header */}
          <div>
            <Badge className="bg-primary/10 text-primary border border-primary/20 mb-3 text-xs">About the Project</Badge>
            <h1 className="text-3xl font-bold mb-2">Python Vulnerability Research</h1>
            <p className="text-muted-foreground text-sm max-w-xl">
              A final project by Zohar &amp; Or — in-depth research into common security vulnerabilities
              and how to detect them through static source code analysis.
            </p>
          </div>

          {/* Core concepts — horizontal cards */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Core Concepts</p>
            <div className="flex flex-col sm:flex-row gap-3">
              {concepts.map((c, i) => <ConceptCard key={c.title} concept={c} index={i} />)}
            </div>
          </div>

          {/* Vulnerability topics — flip card grid */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Vulnerability Topics Covered</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {vulnTopics.map((t, i) => <VulnCard key={t.title} topic={t} index={i} />)}
            </div>
            <p className="text-[11px] text-muted-foreground/40 mt-3 text-center">Click any card to see details</p>
          </div>

        </div>
      </div>
    </div>
  );
}