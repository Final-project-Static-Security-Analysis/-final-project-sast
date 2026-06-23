import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

const defaults = (type, epics, stories) => ({
  title: '',
  description: '',
  type,
  assigned_to: 'both',
  status: 'todo',
  priority: 'medium',
  category: 'development',
  due_date: '',
  epic_id: epics?.[0]?.id || '',
  story_id: stories?.[0]?.id || '',
});

export default function CreateItemDialog({ onAdd, type = 'task', epics = [], stories = [], trigger }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => defaults(type, epics, stories));
  const [loading, setLoading] = useState(false);

  const handleOpen = (val) => {
    if (val) setForm(defaults(type, epics, stories));
    setOpen(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    const payload = { ...form, type };
    if (type === 'epic') { delete payload.epic_id; delete payload.story_id; }
    if (type === 'story') { delete payload.story_id; }
    await onAdd(payload);
    setOpen(false);
    setLoading(false);
  };

  const typeLabel = type === 'epic' ? 'Epic' : type === 'story' ? 'User Story' : 'Task';

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 h-8 text-xs">
            <Plus className="w-3.5 h-3.5" /> Create {typeLabel}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-card border-border/60 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Create {typeLabel}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-1">
          <div>
            <Label className="text-xs">Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={`${typeLabel} title`} className="mt-1 bg-background h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" className="mt-1 bg-background h-16 text-sm resize-none" />
          </div>

          {type === 'story' && epics.length > 0 && (
            <div>
              <Label className="text-xs">Epic</Label>
              <Select value={form.epic_id} onValueChange={(v) => setForm({ ...form, epic_id: v })}>
                <SelectTrigger className="mt-1 bg-background h-8 text-sm"><SelectValue placeholder="Select epic" /></SelectTrigger>
                <SelectContent>
                  {epics.map(e => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {type === 'task' && stories.length > 0 && (
            <div>
              <Label className="text-xs">User Story</Label>
              <Select value={form.story_id} onValueChange={(v) => setForm({ ...form, story_id: v })}>
                <SelectTrigger className="mt-1 bg-background h-8 text-sm"><SelectValue placeholder="Select story (optional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>— None —</SelectItem>
                  {stories.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Assignee</Label>
              <Select value={form.assigned_to} onValueChange={(v) => setForm({ ...form, assigned_to: v })}>
                <SelectTrigger className="mt-1 bg-background h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="zohar">Zohar</SelectItem>
                  <SelectItem value="or">Or</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger className="mt-1 bg-background h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="mt-1 bg-background h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Due Date</Label>
              <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="mt-1 bg-background h-8 text-sm" />
            </div>
          </div>
          <Button type="submit" disabled={loading || !form.title.trim()} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-sm">
            {loading ? 'Creating...' : `Create ${typeLabel}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}