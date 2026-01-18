import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';
import TaskDialog from './components/TaskDialog';
import { todoApi, teamMemberApi } from './services/api';
import { Todo, TodoCreate, TodoUpdate, TeamMember } from './types';

function App() {
  // State
  const [currentView, setCurrentView] = useState<'overview' | 'team-mates' | 'todo-list'>('todo-list');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | undefined>();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    fetchTeamMembers();
    fetchTodos();
  }, []);

  // Fetch todos when filters change
  useEffect(() => {
    fetchTodos();
  }, [selectedDate, selectedMemberId, searchQuery]);

  const fetchTeamMembers = async () => {
    try {
      const response = await teamMemberApi.getAll();
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoApi.getAll({
        date: selectedDate,
        assigned_to_id: selectedMemberId,
        search: searchQuery || undefined,
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (data: TodoCreate) => {
    try {
      await todoApi.create(data);
      fetchTodos();
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleUpdateTodo = async (id: number, data: TodoUpdate) => {
    try {
      await todoApi.update(id, data);
      fetchTodos();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await todoApi.delete(id);
      fetchTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    await handleUpdateTodo(id, { completed });
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = async (data: TodoCreate) => {
    if (editingTodo) {
      await handleUpdateTodo(editingTodo.id, data);
    } else {
      await handleCreateTodo(data);
    }
    setIsDialogOpen(false);
    setEditingTodo(undefined);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTodo(undefined);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        teamMembers={teamMembers}
        selectedMemberId={selectedMemberId}
        onMemberSelect={setSelectedMemberId}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddNew={() => setIsDialogOpen(true)}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {currentView === 'todo-list' && (
            <TaskBoard
              todos={todos}
              onToggle={handleToggleTodo}
              onEdit={handleEdit}
              onDelete={handleDeleteTodo}
            />
          )}

          {currentView === 'overview' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              <p className="text-gray-600 mt-2">Overview content coming soon...</p>
            </div>
          )}

          {currentView === 'team-mates' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900">Team Mates</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">Team Member</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading...</div>
            </div>
          )}
        </div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        todo={editingTodo}
        teamMembers={teamMembers}
      />
    </div>
  );
}

export default App;
