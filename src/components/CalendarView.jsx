import React, { useState } from 'react';

export default function CalendarView({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 11)); // Junho 2026 (index 5)
  const [selectedDayTasks, setSelectedDayTasks] = useState([]);
  const [selectedDateString, setSelectedDateString] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Obtém o primeiro dia da semana do mês atual
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Quantidade de dias no mês atual
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Quantidade de dias no mês anterior
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Preenche os dias do mês anterior
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false,
    });
  }

  // Preenche os dias do mês atual
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true,
    });
  }

  // Preenche os dias do próximo mês para completar a grade de 6 semanas (42 células)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false,
    });
  }

  // Filtra as tarefas de um dia específico
  const getTasksForDate = (d, m, y) => {
    const monthStr = String(m + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    const dateStr = `${y}-${monthStr}-${dayStr}`;
    return tasks.filter((t) => t.dueDate === dateStr);
  };

  // Navegação
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayTasks([]);
    setSelectedDateString('');
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayTasks([]);
    setSelectedDateString('');
  };

  const isToday = (d, m, y) => {
    const today = new Date(); // 11 de Junho de 2026
    return today.getDate() === d && today.getMonth() === m && today.getFullYear() === y;
  };

  const handleDayClick = (d, m, y) => {
    const dayTasks = getTasksForDate(d, m, y);
    setSelectedDayTasks(dayTasks);
    setSelectedDateString(`${d} de ${monthNames[m]} de ${y}`);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header-panel">
        <div>
          <h2>Calendário de Tarefas</h2>
          <p>Gerencie seus prazos de forma visual</p>
        </div>
        <div className="calendar-nav-buttons">
          <button onClick={handlePrevMonth} className="btn-cal-nav" title="Mês anterior">
            ◀
          </button>
          <span className="current-month-display">
            {monthNames[month]} {year}
          </span>
          <button onClick={handleNextMonth} className="btn-cal-nav" title="Próximo mês">
            ▶
          </button>
        </div>
      </div>

      <div className="calendar-layout-grid">
        {/* Grade do Calendário */}
        <div className="calendar-card">
          <div className="calendar-week-days">
            {daysOfWeek.map((day) => (
              <div key={day} className="week-day-label">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days-grid">
            {calendarDays.map((cell, idx) => {
              const dayTasks = getTasksForDate(cell.day, cell.month, cell.year);
              const hasTasks = dayTasks.length > 0;
              const hasPending = dayTasks.some((t) => !t.completed);
              
              return (
                <button
                  key={idx}
                  onClick={() => handleDayClick(cell.day, cell.month, cell.year)}
                  className={`calendar-day-cell ${!cell.isCurrentMonth ? 'inactive-month' : ''} ${
                    isToday(cell.day, cell.month, cell.year) ? 'today-cell' : ''
                  } ${hasTasks ? 'has-tasks' : ''}`}
                >
                  <span className="day-number">{cell.day}</span>
                  
                  {/* Indicadores de tarefas */}
                  {hasTasks && (
                    <div className="day-task-indicators">
                      {/* Pontinho colorido para cada tarefa */}
                      {dayTasks.slice(0, 3).map((task) => (
                        <span
                          key={task.id}
                          className={`task-indicator-dot dot-cat-${task.category.toLowerCase()}`}
                          title={`${task.title} (${task.category})`}
                        ></span>
                      ))}
                      {dayTasks.length > 3 && (
                        <span className="task-indicator-more">+{dayTasks.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalhes do Dia Selecionado */}
        <div className="calendar-details-card">
          {selectedDateString ? (
            <div className="day-details-content">
              <h4>Tarefas para {selectedDateString}</h4>
              {selectedDayTasks.length > 0 ? (
                <div className="day-details-list">
                  {selectedDayTasks.map((task) => (
                    <div key={task.id} className={`day-details-item ${task.completed ? 'completed' : ''}`}>
                      <div className="day-details-item-left">
                        <span className={`task-badge cat-${task.category.toLowerCase()}`}>
                          {task.category}
                        </span>
                        <span className="day-details-item-title">{task.title}</span>
                      </div>
                      <span className={`priority-badge-dot prio-dot-${task.priority.toLowerCase()}`} title={`Prioridade ${task.priority}`}></span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="day-details-empty">
                  <span className="relax-icon">☕</span>
                  <p>Sem compromissos agendados para este dia.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="calendar-details-placeholder">
              <span className="cal-icon">📅</span>
              <p>Selecione um dia no calendário para visualizar as tarefas correspondentes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
