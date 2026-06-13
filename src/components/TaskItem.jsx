import React from 'react';

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const isOverdue = () => {
    if (task.completed || !task.dueDate) return false;
    
    // Obtém a data de hoje (sem hora)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Obtém a data de vencimento (sem hora, considerando fuso local)
    const [year, month, day] = task.dueDate.split('-');
    const due = new Date(year, month - 1, day);
    due.setHours(0, 0, 0, 0);

    return due < today;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const categoryClass = task.category.toLowerCase().replace(/\s+/g, '-');
  const priorityClass = task.priority.toLowerCase();

  return (
    <div className={`task-item-card ${task.completed ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''}`}>
      <div className="task-item-left">
        {/* Checkbox Customizado */}
        <label className="checkbox-container" title={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />
          <span className="checkmark">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="checkmark-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </span>
        </label>
        
        {/* Título e Meta Infos */}
        <div className="task-item-content" onClick={() => onToggle(task.id)} style={{ cursor: 'pointer' }}>
          <span className="task-title-text">{task.title}</span>
          
          <div className="task-meta-row">
            {/* Tag de Categoria */}
            <span className={`task-badge badge-category cat-${categoryClass}`}>
              {task.category.toUpperCase()}
            </span>
            
            {/* Tag de Prioridade */}
            <span className={`task-badge badge-priority prio-${priorityClass}`}>
              {task.priority.toUpperCase()}
            </span>
            
            {/* Data com ícone de Calendário */}
            {task.dueDate && (
              <span className={`task-due-date ${isOverdue() ? 'text-overdue' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="calendar-meta-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                {isOverdue() ? `Atrasada: ${formatDate(task.dueDate)}` : formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-item-actions">
        {/* Botão de Editar */}
        <button
          onClick={() => onEdit(task)}
          className="btn-action-edit"
          title="Editar tarefa"
          disabled={task.completed}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="action-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.013a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
        </button>
        
        {/* Botão de Excluir */}
        <button
          onClick={() => onDelete(task.id)}
          className="btn-action-delete"
          title="Excluir tarefa"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="action-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.72 0-.34-9m9.96-3.243a1.8 1.8 0 0 0-1.8-1.175H8.228a1.8 1.8 0 0 0-1.8 1.17H2.25m3.75 0V19.5a2.25 2.25 0 0 0 2.25 2.25h7.84a2.25 2.25 0 0 0 2.25-2.25V6.25m-12 0h12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
