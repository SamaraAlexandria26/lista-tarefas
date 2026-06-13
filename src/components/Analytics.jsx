import React from 'react';

export default function Analytics({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Estatísticas por categoria
  const categories = ['Trabalho', 'Pessoal', 'Estudos', 'Outros'];
  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat);
    const total = catTasks.length;
    const completed = catTasks.filter((t) => t.completed).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { name: cat, total, completed, rate };
  });

  // Estatísticas por prioridade
  const priorities = ['Alta', 'Média', 'Baixa'];
  const priorityStats = priorities.map((prio) => {
    const prioTasks = tasks.filter((t) => t.priority === prio);
    const total = prioTasks.length;
    const completed = prioTasks.filter((t) => t.completed).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { name: prio, total, completed, rate };
  });

  // Tarefas urgentes ou atrasadas (pendentes e com prazo passado ou hoje)
  const getUrgentTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter((t) => {
      if (t.completed || !t.dueDate) return false;
      const [year, month, day] = t.dueDate.split('-');
      const due = new Date(year, month - 1, day);
      due.setHours(0, 0, 0, 0);
      return due <= today;
    });
  };

  const urgentTasks = getUrgentTasks();

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Análise de Produtividade</h2>
        <p>Visão geral e desempenho das suas tarefas</p>
      </div>

      {/* Grid de Cartões de Resumo */}
      <div className="stats-summary-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper bg-sky">📋</div>
          <div className="stat-details">
            <span className="stat-label">Total de Tarefas</span>
            <span className="stat-value">{totalTasks}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-green">✓</div>
          <div className="stat-details">
            <span className="stat-label">Concluídas</span>
            <span className="stat-value">{completedTasks}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-amber">⚡</div>
          <div className="stat-details">
            <span className="stat-label">Pendentes</span>
            <span className="stat-value">{pendingTasks}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-purple">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="stat-svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg>
          </div>
          <div className="stat-details">
            <span className="stat-label">Taxa de Conclusão</span>
            <span className="stat-value">{completionRate}%</span>
          </div>
        </div>
      </div>

      {/* Seção de Análise Detalhada */}
      <div className="analytics-details-layout">
        {/* Progresso Geral */}
        <div className="details-card main-progress-card">
          <h4>Progresso de Produtividade</h4>
          
          <div className="circular-progress-section">
            <div className="progress-ring-wrapper">
              {/* Progresso Circular Simulado por SVG */}
              <svg className="progress-ring-svg" width="160" height="160">
                <circle
                  className="progress-ring-bg"
                  stroke="#E2E8F0"
                  strokeWidth="12"
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
                />
                <circle
                  className="progress-ring-fill"
                  stroke="hsl(var(--accent))"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - completionRate / 100)}`}
                  strokeLinecap="round"
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
                />
              </svg>
              <div className="progress-ring-text">
                <span className="progress-percent">{completionRate}%</span>
                <span className="progress-label">Concluído</span>
              </div>
            </div>
            <p className="progress-description-text">
              {completionRate === 100 
                ? 'Espetacular! Todas as tarefas concluídas!' 
                : completionRate >= 50 
                ? 'Excelente progresso! Você já passou da metade!' 
                : totalTasks > 0 
                ? 'Continue focado! Cada passo conta.'
                : 'Crie tarefas para visualizar seu progresso.'}
            </p>
          </div>
        </div>

        {/* Desempenho por Categoria */}
        <div className="details-card">
          <h4>Desempenho por Categoria</h4>
          <div className="bars-list">
            {categoryStats.map((cat) => (
              <div key={cat.name} className="progress-bar-group">
                <div className="bar-labels">
                  <span className="bar-name">{cat.name}</span>
                  <span className="bar-stats">
                    {cat.completed}/{cat.total} ({cat.rate}%)
                  </span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className={`progress-bar-fill fill-cat-${cat.name.toLowerCase()}`}
                    style={{ width: `${cat.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desempenho por Prioridade */}
        <div className="details-card">
          <h4>Foco por Prioridade</h4>
          <div className="bars-list">
            {priorityStats.map((prio) => (
              <div key={prio.name} className="progress-bar-group">
                <div className="bar-labels">
                  <span className="bar-name">Prioridade {prio.name}</span>
                  <span className="bar-stats">
                    {prio.completed}/{prio.total} ({prio.rate}%)
                  </span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className={`progress-bar-fill fill-prio-${prio.name.toLowerCase()}`}
                    style={{ width: `${prio.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarefas Críticas / Atrasadas */}
        <div className="details-card full-width-grid-col">
          <h4 className="text-red-title">Atenção Necessária (Atrasadas / Hoje)</h4>
          <div className="urgent-tasks-list">
            {urgentTasks.length > 0 ? (
              urgentTasks.map((task) => (
                <div key={task.id} className="urgent-task-item">
                  <div className="urgent-task-info">
                    <span className="urgent-task-dot"></span>
                    <span className="urgent-task-title">{task.title}</span>
                  </div>
                  <div className="urgent-task-meta">
                    <span className={`task-badge cat-${task.category.toLowerCase()}`}>
                      {task.category}
                    </span>
                    <span className="urgent-task-date">
                      Vence em: {task.dueDate.split('-').reverse().join('/')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-urgent-text">
                🎉 Muito bem! Não há tarefas pendentes atrasadas ou para hoje.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
