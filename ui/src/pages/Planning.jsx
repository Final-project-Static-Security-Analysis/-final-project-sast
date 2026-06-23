import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Progress } from '@/components/ui/progress';
import { Circle, Loader2, CheckCircle2, LayoutGrid, TrendingUp, Plus, Layers, BookOpen, CheckSquare, ChevronRight } from 'lucide-react';
import TaskCard from '../components/planning/TaskCard';
import CreateItemDialog from '../components/planning/CreateItemDialog';
import TaskDetailDialog from '../components/planning/TaskDetailDialog';
import ProgressView from '../components/planning/ProgressView';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const columns = [
  { id: 'todo',        label: 'To Do',       icon: Circle,       headerColor: 'text-muted-foreground', barColor: 'bg-muted-foreground' },
  { id: 'in_progress', label: 'In Progress',  icon: Loader2,      headerColor: 'text-chart-4',           barColor: 'bg-chart-4'          },
  { id: 'done',        label: 'Done',         icon: CheckCircle2, headerColor: 'text-primary',           barColor: 'bg-primary'          },
];

const assigneeFilters = [
  { value: 'all',   label: 'All'   },
  { value: 'zohar', label: 'Zohar' },
  { value: 'or',    label: 'Or'    },
  { value: 'both',  label: 'Both'  },
];

const typeFilters = [
  { value: 'all',   label: 'All',     icon: LayoutGrid  },
  { value: 'epic',  label: 'Epics',   icon: Layers      },
  { value: 'story', label: 'Stories', icon: BookOpen    },
  { value: 'task',  label: 'Tasks',   icon: CheckSquare },
];

const views = [
  { id: 'board',    label: 'Board',    icon: LayoutGrid },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
];

export default function Planning() {
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [typeFilter, setTypeFilter]         = useState('all');
  const [selectedTask, setSelectedTask]     = useState(null);
  const [view, setView]                     = useState('board');
  const [openEpics, setOpenEpics]           = useState({});
  const [openStories, setOpenStories]       = useState({});
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Task.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Task.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const epics   = tasks.filter(t => t.type === 'epic');
  const stories = tasks.filter(t => t.type === 'story');

  const filteredTasks = tasks.filter(t => {
    const matchAssignee = assigneeFilter === 'all' || t.assigned_to === assigneeFilter;
    const matchType     = typeFilter === 'all' || t.type === typeFilter || (!t.type && typeFilter === 'task');
    return matchAssignee && matchType;
  });

  const doneTasks       = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const progress        = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

  const toggleEpic  = (id) => setOpenEpics(p  => ({ ...p, [id]: !p[id] }));
  const toggleStory = (id) => setOpenStories(p => ({ ...p, [id]: !p[id] }));

  // Hierarchy view — shown when typeFilter is epic, story, or task
  const isHierarchyView = view === 'board' && typeFilter !== 'all';

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Top bar ── */}
      <div className="shrink-0 px-5 py-3 border-b border-border/50 bg-card/50 space-y-2">
        {/* Row 1 */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-sm font-bold">PyVulnScan Board</h1>
            <p className="text-[11px] text-muted-foreground">Zohar &amp; Or — Final Project</p>
          </div>

          <div className="flex items-center gap-1 bg-muted/40 rounded-lg p-0.5">
            {views.map(v => {
              const Icon = v.icon;
              return (
                <button key={v.id} onClick={() => setView(v.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    view === v.id ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}>
                  <Icon className="w-3 h-3" />{v.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <CreateItemDialog onAdd={createMutation.mutateAsync} type="epic"
              trigger={
                <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1 border-secondary/40 text-secondary hover:bg-secondary/10">
                  <Plus className="w-3 h-3" /><Layers className="w-3 h-3" /> Epic
                </Button>
              }
            />
            <CreateItemDialog onAdd={createMutation.mutateAsync} type="story" epics={epics}
              trigger={
                <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1 border-accent/40 text-accent hover:bg-accent/10">
                  <Plus className="w-3 h-3" /><BookOpen className="w-3 h-3" /> Story
                </Button>
              }
            />
            <CreateItemDialog onAdd={createMutation.mutateAsync} type="task" epics={epics} stories={stories}
              trigger={
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1 h-7 text-[11px]">
                  <Plus className="w-3 h-3" /><CheckSquare className="w-3 h-3" /> Task
                </Button>
              }
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Assignee filter */}
          <div className="flex items-center gap-0.5 bg-muted/30 rounded-md p-0.5">
            {assigneeFilters.map(f => (
              <button key={f.value} onClick={() => setAssigneeFilter(f.value)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  assigneeFilter === f.value ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}>{f.label}</button>
            ))}
          </div>

          {/* Type filter */}
          {view === 'board' && (
            <div className="flex items-center gap-0.5 bg-muted/30 rounded-md p-0.5">
              {typeFilters.map(f => {
                const Icon = f.icon;
                return (
                  <button key={f.value} onClick={() => setTypeFilter(f.value)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      typeFilter === f.value ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}><Icon className="w-2.5 h-2.5" />{f.label}</button>
                );
              })}
            </div>
          )}

          {/* Progress */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <div className="w-28"><Progress value={progress} className="h-1.5" /></div>
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">{doneTasks}/{tasks.length} done</span>
            <div className="flex items-center gap-1 text-[11px] text-chart-4">
              <div className="w-2 h-2 rounded-full bg-chart-4" />
              <span>{inProgressTasks} in progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {view === 'progress' ? (
        <ProgressView tasks={tasks} />
      ) : isHierarchyView ? (
        /* ── Hierarchy tree view (Epic / Story / Task filter) ── */
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {isLoading ? (
            [1,2,3].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)
          ) : (
            epics.filter(e => assigneeFilter === 'all' || e.assigned_to === assigneeFilter).map(epic => {
              const epicStories = stories.filter(s => s.epic_id === epic.id && (assigneeFilter === 'all' || s.assigned_to === assigneeFilter));
              const epicOpen = !!openEpics[epic.id];
              const statusDot = epic.status === 'done' ? 'bg-primary' : epic.status === 'in_progress' ? 'bg-chart-4' : 'bg-muted-foreground';
              return (
                <div key={epic.id} className="border border-secondary/30 rounded-xl overflow-hidden bg-secondary/5">
                  {/* Epic row */}
                  <div
                    className="flex items-center gap-2.5 px-4 py-3 cursor-pointer hover:bg-secondary/10 transition-colors"
                    onClick={() => toggleEpic(epic.id)}
                  >
                    <ChevronRight className={`w-4 h-4 text-secondary shrink-0 transition-transform ${epicOpen ? 'rotate-90' : ''}`} />
                    <Layers className="w-4 h-4 text-secondary shrink-0" />
                    <span className="text-sm font-bold text-secondary flex-1">{epic.title}</span>
                    <div className={`w-2 h-2 rounded-full ${statusDot}`} />
                    <span className="text-[10px] text-muted-foreground capitalize">{epic.status?.replace('_', ' ')}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">{epicStories.length} stories</span>
                    <button onClick={e => { e.stopPropagation(); setSelectedTask(epic); }} className="text-[10px] text-muted-foreground hover:text-foreground ml-1">⋯</button>
                  </div>

                  {/* Stories */}
                  {epicOpen && (
                    <div className="border-t border-secondary/20 pl-6 pr-2 py-2 space-y-1.5 bg-background/30">
                      {epicStories.length === 0 ? (
                        <p className="text-xs text-muted-foreground/40 py-2 px-2">No stories</p>
                      ) : epicStories.map(story => {
                        const storyTasks = tasks.filter(t => t.type === 'task' && t.story_id === story.id && (assigneeFilter === 'all' || t.assigned_to === assigneeFilter));
                        const storyOpen = !!openStories[story.id];
                        const sDot = story.status === 'done' ? 'bg-primary' : story.status === 'in_progress' ? 'bg-chart-4' : 'bg-muted-foreground';
                        return (
                          <div key={story.id} className="border border-accent/25 rounded-lg overflow-hidden bg-accent/5">
                            <div
                              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent/10 transition-colors"
                              onClick={() => toggleStory(story.id)}
                            >
                              <ChevronRight className={`w-3.5 h-3.5 text-accent shrink-0 transition-transform ${storyOpen ? 'rotate-90' : ''}`} />
                              <BookOpen className="w-3.5 h-3.5 text-accent shrink-0" />
                              <span className="text-xs font-semibold text-accent flex-1">{story.title}</span>
                              <div className={`w-1.5 h-1.5 rounded-full ${sDot}`} />
                              <span className="text-[10px] text-muted-foreground capitalize">{story.status?.replace('_', ' ')}</span>
                              <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">{storyTasks.length} tasks</span>
                              <button onClick={e => { e.stopPropagation(); setSelectedTask(story); }} className="text-[10px] text-muted-foreground hover:text-foreground ml-1">⋯</button>
                            </div>
                            {storyOpen && (
                              <div className="border-t border-accent/15 pl-6 pr-2 py-2 space-y-1.5 bg-background/20">
                                {storyTasks.length === 0 ? (
                                  <p className="text-xs text-muted-foreground/40 py-1 px-2">No tasks</p>
                                ) : storyTasks.map(task => (
                                  <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* ── Default Jira-style kanban board ── */
        <div className="flex-1 overflow-hidden px-4 py-4">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-4 h-full">
              {[1,2,3].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-8 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 h-full">
              {columns.map(col => {
                const colTasks = filteredTasks.filter(t => t.status === col.id);
                return (
                  <div key={col.id} className="flex flex-col min-h-0">
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <div className={`w-2.5 h-2.5 rounded-sm ${col.barColor}`} />
                      <span className={`text-xs font-bold uppercase tracking-wide ${col.headerColor}`}>{col.label}</span>
                      <span className="ml-auto text-[11px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">{colTasks.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto rounded-xl bg-muted/15 border border-border/30 p-2 space-y-2">
                      {colTasks.length === 0 ? (
                        <div className="flex items-center justify-center h-20 text-xs text-muted-foreground/40 border border-dashed border-border/30 rounded-lg">
                          No items
                        </div>
                      ) : colTasks.map(task => (
                        <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <TaskDetailDialog
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={(id, data) => updateMutation.mutate({ id, data })}
        onDelete={(id) => { deleteMutation.mutate(id); setSelectedTask(null); }}
      />
    </div>
  );
}