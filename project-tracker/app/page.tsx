'use client';

import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  progress: number;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Modernize company website with new UI/UX',
      progress: 65,
      tasks: [
        { id: '1-1', title: 'Design mockups', status: 'done', priority: 'high', assignee: 'Alice', dueDate: '2025-11-10' },
        { id: '1-2', title: 'Frontend development', status: 'in-progress', priority: 'high', assignee: 'Bob', dueDate: '2025-11-15' },
        { id: '1-3', title: 'Backend API', status: 'todo', priority: 'medium', assignee: 'Charlie', dueDate: '2025-11-20' },
      ]
    },
    {
      id: '2',
      name: 'Mobile App Launch',
      description: 'Release iOS and Android applications',
      progress: 40,
      tasks: [
        { id: '2-1', title: 'UI implementation', status: 'in-progress', priority: 'high', assignee: 'Diana', dueDate: '2025-11-12' },
        { id: '2-2', title: 'Testing', status: 'todo', priority: 'medium', assignee: 'Eve', dueDate: '2025-11-18' },
        { id: '2-3', title: 'App store submission', status: 'todo', priority: 'low', assignee: 'Frank', dueDate: '2025-11-25' },
      ]
    },
    {
      id: '3',
      name: 'Marketing Campaign',
      description: 'Q4 digital marketing initiatives',
      progress: 80,
      tasks: [
        { id: '3-1', title: 'Content creation', status: 'done', priority: 'medium', assignee: 'Grace', dueDate: '2025-11-08' },
        { id: '3-2', title: 'Social media posts', status: 'done', priority: 'medium', assignee: 'Henry', dueDate: '2025-11-09' },
        { id: '3-3', title: 'Analytics review', status: 'in-progress', priority: 'low', assignee: 'Ivy', dueDate: '2025-11-14' },
      ]
    },
  ]);

  const [showAddProject, setShowAddProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newTask, setNewTask] = useState<{ title: string; priority: Task['priority']; assignee: string; dueDate: string }>({ title: '', priority: 'medium', assignee: '', dueDate: '' });
  const [showAddTask, setShowAddTask] = useState(false);

  const addProject = () => {
    if (!newProject.name) return;
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      tasks: [],
      progress: 0,
    };
    setProjects([...projects, project]);
    setNewProject({ name: '', description: '' });
    setShowAddProject(false);
  };

  const addTask = (projectId: string) => {
    if (!newTask.title) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      status: 'todo',
      priority: newTask.priority,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
    };
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const updatedTasks = [...p.tasks, task];
        return { ...p, tasks: updatedTasks, progress: calculateProgress(updatedTasks) };
      }
      return p;
    }));
    setNewTask({ title: '', priority: 'medium', assignee: '', dueDate: '' });
    setShowAddTask(false);
  };

  const updateTaskStatus = (projectId: string, taskId: string, status: Task['status']) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const updatedTasks = p.tasks.map(t => t.id === taskId ? { ...t, status } : t);
        return { ...p, tasks: updatedTasks, progress: calculateProgress(updatedTasks) };
      }
      return p;
    }));
  };

  const calculateProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'done').length;
    return Math.round((completed / tasks.length) * 100);
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject === projectId) setSelectedProject(null);
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const updatedTasks = p.tasks.filter(t => t.id !== taskId);
        return { ...p, tasks: updatedTasks, progress: calculateProgress(updatedTasks) };
      }
      return p;
    }));
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-gray-200 text-gray-700';
      case 'in-progress': return 'bg-blue-200 text-blue-700';
      case 'done': return 'bg-green-200 text-green-700';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
    }
  };

  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = projects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'done').length, 0);
  const inProgressTasks = projects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'in-progress').length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Project Tracker</h1>
              <p className="text-slate-600 mt-1">Manage your projects and tasks efficiently</p>
            </div>
            <button
              onClick={() => setShowAddProject(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              + New Project
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="text-sm font-medium text-slate-600">Total Projects</div>
            <div className="text-3xl font-bold text-slate-900 mt-2">{projects.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="text-sm font-medium text-slate-600">Total Tasks</div>
            <div className="text-3xl font-bold text-slate-900 mt-2">{totalTasks}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="text-sm font-medium text-slate-600">In Progress</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{inProgressTasks}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="text-sm font-medium text-slate-600">Completed</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{completedTasks}</div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                    <p className="text-slate-600 text-sm mt-1">{project.description}</p>
                  </div>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-semibold text-slate-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-semibold text-slate-700 uppercase">Tasks ({project.tasks.length})</h4>
                  <button
                    onClick={() => {
                      setSelectedProject(project.id);
                      setShowAddTask(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Task
                  </button>
                </div>
                <div className="space-y-3">
                  {project.tasks.map(task => (
                    <div key={task.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium text-slate-900">{task.title}</h5>
                            <span className={`text-xs font-bold ${getPriorityColor(task.priority)}`}>
                              {task.priority.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex gap-4 mt-2 text-sm text-slate-600">
                            <span>👤 {task.assignee}</span>
                            <span>📅 {task.dueDate}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTask(project.id, task.id)}
                          className="text-red-400 hover:text-red-600 ml-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {(['todo', 'in-progress', 'done'] as const).map(status => (
                          <button
                            key={status}
                            onClick={() => updateTaskStatus(project.id, task.id, status)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              task.status === status ? getStatusColor(status) : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {project.tasks.length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-4">No tasks yet. Add one to get started!</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddProject(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={addProject}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  placeholder="Enter assignee name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setSelectedProject(null);
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => addTask(selectedProject)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
