import React, { useState, useEffect } from 'react';

export default function TaskForm({ onSave, editingTask, onCancel }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pessoal');
  const [priority, setPriority] = useState('Média');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  // Sincroniza com a tarefa sob edição
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate || '');
    } else {
      setTitle('');
      setCategory('Pessoal');
      setPriority('Média');
      // Define o dia de amanhã como padrão para nova tarefa
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }
    setError('');
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('O título da tarefa é obrigatório.');
      return;
    }
    setError('');
    
    const taskData = {
      title: title.trim(),
      category,
      priority,
      dueDate: dueDate || null,
    };

    onSave(taskData);
    
    // Reseta se for nova tarefa
    if (!editingTask) {
      setTitle('');
      setCategory('Pessoal');
      setPriority('Média');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form-card">
      <div className="task-form-header">
        <h4>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h4>
        {editingTask && (
          <button type="button" onClick={onCancel} className="btn-close-form" title="Cancelar edição">
            ✕
          </button>
        )}
      </div>

      <div className="task-form-body">
        {error && <div className="form-error-msg">{error}</div>}

        <div className="form-group flex-1">
          <label htmlFor="task-title">Título da Tarefa</label>
          <input
            type="text"
            id="task-title"
            placeholder="O que você precisa fazer?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={error && !title ? 'input-error' : ''}
            autoComplete="off"
            maxLength={100}
          />
        </div>

        <div className="form-row-grid">
          <div className="form-group">
            <label htmlFor="task-category">Categoria</label>
            <select
              id="task-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Trabalho">Trabalho</option>
              <option value="Pessoal">Pessoal</option>
              <option value="Estudos">Estudos</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div className="form-group">
            <label>Prioridade</label>
            <div className="priority-options">
              {['Baixa', 'Média', 'Alta'].map((p) => (
                <label
                  key={p}
                  className={`priority-option-label p-${p.toLowerCase()} ${priority === p ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={priority === p}
                    onChange={() => setPriority(p)}
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-duedate">Prazo de Conclusão</label>
            <div className="date-input-wrapper">
              <input
                type="date"
                id="task-duedate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="task-form-footer">
        {editingTask && (
          <button type="button" onClick={onCancel} className="btn-secondary-action">
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-primary-action">
          {editingTask ? 'Salvar Alterações' : 'Adicionar Tarefa'}
        </button>
      </div>
    </form>
  );
}
