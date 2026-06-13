import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import TaskList from './components/TaskList';
import Analytics from './components/Analytics';
import CalendarView from './components/CalendarView';
import { supabase } from './supabaseClient';
import './App.css';

// Tarefas iniciais de demonstração (Onboarding)
const initialDemoTasks = [
  {
    title: 'Explorar o TaskPremium e suas abas de Análises e Calendário',
    category: 'Trabalho',
    priority: 'Alta',
    dueDate: '2026-06-11', // Hoje
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 horas atrás
  },
  {
    title: 'Revisar os estudos sobre React e animações CSS',
    category: 'Estudos',
    priority: 'Média',
    dueDate: '2026-06-12', // Amanhã
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 horas atrás
  },
  {
    title: 'Criar uma lista de compras para o final de semana',
    category: 'Pessoal',
    priority: 'Baixa',
    dueDate: '2026-06-13', // Depois de amanhã
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Ontem
  }
];

const mapDbTaskToReact = (dbTask) => ({
  id: dbTask.id,
  title: dbTask.title,
  category: dbTask.category,
  priority: dbTask.priority,
  dueDate: dbTask.due_date,
  completed: dbTask.completed,
  createdAt: dbTask.created_at,
});

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('taskpremium_user');
    if (savedUser) return JSON.parse(savedUser);
    const defaultUser = { name: 'Samara', email: 'samara@exemplo.com' };
    localStorage.setItem('taskpremium_user', JSON.stringify(defaultUser));
    return defaultUser;
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [editingTask, setEditingTask] = useState(null);

  // Busca tarefas do Supabase
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    if (!supabase) {
      console.warn('Supabase não configurado. Usando tarefas demo locais.');
      setTasks(initialDemoTasks.map((task, i) => ({ ...task, id: `demo-${i}` })));
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_email', user.email)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length === 0) {
          // Se for o primeiro acesso deste usuário no Supabase, criamos as tarefas demo no banco
          const demoTasksWithUser = initialDemoTasks.map(task => ({
            title: task.title,
            category: task.category,
            priority: task.priority,
            due_date: task.dueDate,
            completed: task.completed,
            user_email: user.email,
            created_at: task.createdAt,
          }));

          const { data: insertedData, error: insertError } = await supabase
            .from('tasks')
            .insert(demoTasksWithUser)
            .select();

          if (insertError) throw insertError;

          const mappedDemo = insertedData.map(mapDbTaskToReact);
          setTasks(mappedDemo);
        } else if (data) {
          const mapped = data.map(mapDbTaskToReact);
          setTasks(mapped);
        }
      } catch (err) {
        console.error('Erro ao buscar tarefas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  // Sincroniza usuário com LocalStorage
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('taskpremium_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('taskpremium_user');
    setActiveTab('tasks');
    setEditingTask(null);
  };

  // CRUD Actions com Supabase
  const handleToggleTask = async (id) => {
    const taskToToggle = tasks.find(task => task.id === id);
    if (!taskToToggle) return;

    const newCompletedState = !taskToToggle.completed;

    // Atualização otimista
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: newCompletedState } : task
      )
    );

    try {
      if (!supabase) return;
      const { error } = await supabase
        .from('tasks')
        .update({ completed: newCompletedState })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao atualizar conclusão no Supabase:', err);
      // Reverte
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, completed: !newCompletedState } : task
        )
      );
    }
  };

  const handleDeleteTask = async (id) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (!taskToDelete) return;

    // Atualização otimista
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    if (editingTask && editingTask.id === id) {
      setEditingTask(null);
    }

    try {
      if (!supabase) return;
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao deletar tarefa no Supabase:', err);
      // Reverte
      setTasks(prevTasks => [taskToDelete, ...prevTasks]);
    }
  };

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      // Editar (Otimista)
      const originalTask = tasks.find(task => task.id === editingTask.id);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === editingTask.id
            ? { ...task, ...taskData }
            : task
        )
      );
      setEditingTask(null);

      try {
        if (!supabase) return;
        const { error } = await supabase
          .from('tasks')
          .update({
            title: taskData.title,
            category: taskData.category,
            priority: taskData.priority,
            due_date: taskData.dueDate || null,
          })
          .eq('id', editingTask.id);

        if (error) throw error;
      } catch (err) {
        console.error('Erro ao salvar edição no Supabase:', err);
        // Reverte
        if (originalTask) {
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task.id === originalTask.id ? originalTask : task
            )
          );
        }
      }
    } else {
      // Criar nova
      try {
        if (!supabase) {
          const localTask = { ...taskData, id: `demo-${Date.now()}`, completed: false, createdAt: new Date().toISOString() };
          setTasks(prevTasks => [localTask, ...prevTasks]);
          return;
        }
        const newTaskDb = {
          title: taskData.title,
          category: taskData.category,
          priority: taskData.priority,
          due_date: taskData.dueDate || null,
          completed: false,
          user_email: user.email,
        };

        const { data, error } = await supabase
          .from('tasks')
          .insert(newTaskDb)
          .select()
          .single();

        if (error) throw error;

        const newTask = mapDbTaskToReact(data);
        setTasks(prevTasks => [newTask, ...prevTasks]);
      } catch (err) {
        console.error('Erro ao criar tarefa no Supabase:', err);
      }
    }
  };

  // Renderização condicional por aba
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="tasks-loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando suas tarefas...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'analytics':
        return <Analytics tasks={tasks} />;
      case 'calendar':
        return <CalendarView tasks={tasks} />;
      case 'tasks':
      default:
        return (
          <TaskList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onSaveTask={handleSaveTask}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
          />
        );
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        <div className="content-container animate-fade-in">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}

export default App;

