import React, { useState } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

export default function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onSaveTask,
  editingTask,
  setEditingTask,
}) {
  const [filterStatus, setFilterStatus] = useState('Todas');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt'); // 'dueDate', 'priority', 'createdAt'
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Mapeamento de prioridades para ordenação numérica
  const priorityWeight = {
    'Alta': 3,
    'Média': 2,
    'Baixa': 1
  };

  // Filtragem e busca
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filterStatus === 'Todas' ||
      (filterStatus === 'Pendentes' && !task.completed) ||
      (filterStatus === 'Concluídas' && task.completed);

    const matchesCategory =
      filterCategory === 'Todas' || task.category === filterCategory;

    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Ordenação
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority') {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    // Padrão: createdAt (Mais recentes criadas primeiro)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleFormSave = (taskData) => {
    onSaveTask(taskData);
    setIsFormOpen(false); // Fecha o formulário após salvar
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsFormOpen(true); // Abre o formulário para edição
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setIsFormOpen(false);
  };

  return (
    <div className="task-list-container">
      {/* Seção Superior: Título & Botão Nova Tarefa */}
      <div className="task-list-header">
        <div>
          <h2>Minhas Tarefas</h2>
          <p className="task-count-subtitle">
            {tasks.filter(t => !t.completed).length} tarefas pendentes
          </p>
        </div>
        <button
          onClick={() => {
            if (isFormOpen && editingTask) {
              setEditingTask(null);
            } else {
              setIsFormOpen(!isFormOpen);
            }
          }}
          className={`btn-toggle-form ${isFormOpen ? 'active' : ''}`}
        >
          {isFormOpen && !editingTask ? 'Fechar Painel' : 'Nova Tarefa'}
        </button>
      </div>

      {/* Formulário Expansível */}
      {isFormOpen && (
        <div className="expandable-form-container">
          <TaskForm
            onSave={handleFormSave}
            editingTask={editingTask}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      {/* Painel de Filtros e Busca */}
      <div className="filters-panel">
        <div className="search-bar-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="search-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.636Z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="btn-clear-search" title="Limpar busca">
              ✕
            </button>
          )}
        </div>

        <div className="filters-selectors-row">
          {/* Filtros de Status (Todas, Pendentes, Concluídas) */}
          <div className="status-filters">
            {['Todas', 'Pendentes', 'Concluídas'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="dropdown-filters">
            {/* Filtro de Categoria */}
            <div className="filter-dropdown-group">
              <label htmlFor="filter-cat">Categoria:</label>
              <select
                id="filter-cat"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="Todas">Todas</option>
                <option value="Trabalho">Trabalho</option>
                <option value="Pessoal">Pessoal</option>
                <option value="Estudos">Estudos</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* Ordenação */}
            <div className="filter-dropdown-group">
              <label htmlFor="sort-select">Ordenar por:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Criadas recentes</option>
                <option value="dueDate">Prazo de Vencimento</option>
                <option value="priority">Prioridade Alta</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista Real de Tarefas */}
      <div className="task-items-wrapper">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onEdit={handleEditClick}
            />
          ))
        ) : (
          <div className="empty-state-card">
            <div className="empty-state-icon">⚡</div>
            <h4>Nenhuma tarefa encontrada</h4>
            <p>
              {tasks.length === 0
                ? 'Comece criando sua primeira tarefa no botão "Nova Tarefa" no topo.'
                : 'Experimente alterar os termos de busca ou filtros selecionados.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
