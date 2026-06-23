import React from 'react';
import { motion } from 'framer-motion';
import { Code, TreePine, ShieldAlert, FileSearch, Zap, BookOpen } from 'lucide-react';

const highlights = [
  {
    icon: Code,
    title: 'ניתוח קוד סטטי (SAST)',
    description: 'בדיקת קוד מקור לזיהוי חולשות אבטחה ללא הרצת הקוד',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    icon: TreePine,
    title: 'עצי תחביר (AST)',
    description: 'המרת קוד Python למבנה עץ לניתוח מעמיק של זרימת הנתונים',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'border-secondary/20',
  },
  {
    icon: ShieldAlert,
    title: 'חקירת חולשות',
    description: 'SQL Injection, Path Traversal, Eval Injection ועוד',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
  },
  {
    icon: FileSearch,
    title: 'פורמט SARIF',
    description: 'ייצוא תוצאות הסריקה בפורמט סטנדרטי לכלי אבטחה',
    color: 'text-chart-4',
    bg: 'bg-chart-4/10',
    border: 'border-chart-4/20',
  },
  {
    icon: Zap,
    title: 'אפליקציה פגיעה',
    description: 'בניית אפליקציית Flask עם חולשות מכוונות לבדיקה',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
  },
  {
    icon: BookOpen,
    title: 'מחקר ותיעוד',
    description: 'מחקר מעמיק על שיטות הגנה ומניעת חולשות',
    color: 'text-chart-5',
    bg: 'bg-chart-5/10',
    border: 'border-chart-5/20',
  },
];

export default function ProjectHighlights() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold mb-3">מה כולל הפרויקט?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            סקירה של הנושאים והטכנולוגיות המרכזיות בפרויקט
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative p-6 rounded-xl bg-card border ${item.border} hover:border-opacity-60 transition-all duration-300`}
            >
              <div className={`inline-flex p-3 rounded-xl ${item.bg} mb-4`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}