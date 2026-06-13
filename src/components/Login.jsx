import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [name, setName] = useState('Samara');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe seu nome para continuar.');
      return;
    }
    setError('');
    onLogin({ name: name.trim(), email: email.trim() || 'usuario@exemplo.com' });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-badge">✓</div>
          <h2>TaskPremium</h2>
          <p>Organize suas tarefas com elegância e eficiência</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="login-name">Seu Nome</label>
            <input
              type="text"
              id="login-name"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={error && !name ? 'input-error' : ''}
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-email">E-mail (opcional)</label>
            <input
              type="email"
              id="login-email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
          </div>

          <button type="submit" className="btn-submit">
            Acessar Minha Lista
          </button>
        </form>
        
        <div className="login-footer">
          <p>Seus dados serão salvos localmente neste navegador.</p>
        </div>
      </div>
    </div>
  );
}
