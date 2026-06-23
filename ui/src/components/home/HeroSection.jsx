import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Terminal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const codeLines = [
{ text: 'import ast', type: 'import' },
{ text: 'tree = ast.parse(source_code)', type: 'assign' },
{ text: 'for node in ast.walk(tree):', type: 'for' },
{ text: '    if isinstance(node, ast.Call):', type: 'if' },
{ text: '        check_vulnerability(node)', type: 'call' },
{ text: '        report_sarif(node, severity="HIGH")', type: 'call' }];


export default function HeroSection() {
  return (
    <div className="h-full flex items-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-5">
              
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">Final Project 2026</span>
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] mb-5">
              <span className="text-foreground">Python</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Vulnerability
              </span>
              <br />
              <span className="text-foreground">Scanner</span>
            </h1>

            <p className="text-base text-muted-foreground max-w-md mb-7 leading-relaxed">
              Static source code analysis using AST to detect security vulnerabilities —
              SQL Injection, Path Traversal, Eval Injection & more.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/scanner">
                <Button size="default" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2">
                  <Terminal className="w-4 h-4" />
                  Try the Scanner
                </Button>
              </Link>
              <Link to="/vulnerabilities">
                <Button size="default" variant="outline" className="border-border/60 hover:bg-muted font-semibold gap-2">
                  View Vulnerabilities
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-5">
              <div>
                <div className="text-lg font-bold text-primary">Zohar</div>
                <div className="text-[11px] text-muted-foreground">Researcher</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <div className="text-lg font-bold text-secondary">Or</div>
                <div className="text-[11px] text-muted-foreground">Researcher</div>
              </div>
            </div>
          </motion.div>

          {/* Right — code preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block">
            
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-2xl blur-xl" />
              <div className="relative bg-card border border-border/60 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border/50">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-chart-4/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                  <span className="text-xs text-muted-foreground ml-2 font-mono">vulnerability_scanner.py</span>
                </div>
                <div className="p-5 font-mono text-sm">
                  {codeLines.map((line, i) =>
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.12 }}
                    className="flex items-start gap-4 py-0.5">
                    
                      <span className="text-muted-foreground/40 w-4 text-right select-none text-xs leading-6">{i + 1}</span>
                      <code className="leading-6">
                        {line.type === 'import' && <><span className="text-secondary">import </span><span className="text-primary">ast</span></>}
                        {line.type === 'assign' && <span className="text-foreground/75">{line.text}</span>}
                        {line.type === 'for' && <><span className="text-secondary">for </span><span className="text-foreground/75">node </span><span className="text-secondary">in </span><span className="text-foreground/75">ast.walk(tree):</span></>}
                        {line.type === 'if' && <><span className="text-foreground/40">{'    '}</span><span className="text-secondary">if </span><span className="text-foreground/75">isinstance(node, ast.Call):</span></>}
                        {line.type === 'call' && <span className="text-primary">{line.text}</span>}
                      </code>
                    </motion.div>
                  )}
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ delay: 1.5, duration: 1, repeat: Infinity }}
                    className="mt-1 flex items-center gap-4">
                    
                    <span className="text-muted-foreground/40 w-4 text-right text-xs">7</span>
                    <span className="w-2 h-5 bg-primary/70" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}