<!-- Shared Fantasy Styles Component -->
<!-- Import this in each component that needs fantasy styling -->
<style>
/* Reusable Fantasy Classes */
.fantasy-card {
  background: 
    linear-gradient(135deg, rgba(45, 24, 16, 0.8) 0%, rgba(26, 15, 10, 0.9) 100%);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(251, 191, 36, 0.1);
  position: relative;
  backdrop-filter: blur(10px);
}

.fantasy-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(251, 191, 36, 0.02) 2px, rgba(251, 191, 36, 0.02) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(251, 191, 36, 0.02) 2px, rgba(251, 191, 36, 0.02) 4px);
  border-radius: 12px;
  pointer-events: none;
}

.card-corner-tl, .card-corner-tr, .card-corner-bl, .card-corner-br {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: rgba(251, 191, 36, 0.4);
  border-style: solid;
  border-width: 0;
  z-index: 10;
}

.card-corner-tl {
  top: -1px;
  left: -1px;
  border-top-width: 2px;
  border-left-width: 2px;
  border-top-left-radius: 12px;
}

.card-corner-tr {
  top: -1px;
  right: -1px;
  border-top-width: 2px;
  border-right-width: 2px;
  border-top-right-radius: 12px;
}

.card-corner-bl {
  bottom: -1px;
  left: -1px;
  border-bottom-width: 2px;
  border-left-width: 2px;
  border-bottom-left-radius: 12px;
}

.card-corner-br {
  bottom: -1px;
  right: -1px;
  border-bottom-width: 2px;
  border-right-width: 2px;
  border-bottom-right-radius: 12px;
}

.fantasy-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(180deg, rgba(26, 15, 10, 0.6) 0%, rgba(45, 24, 16, 0.4) 100%);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 6px;
  color: #fef3c7;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3);
  font-family: Georgia, serif;
}

.fantasy-input:focus {
  outline: none;
  border-color: rgba(251, 191, 36, 0.4);
  box-shadow: 
    inset 0 2px 6px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(251, 191, 36, 0.2);
}

.fantasy-input::placeholder {
  color: rgba(251, 191, 36, 0.3);
  font-style: italic;
}

.fantasy-input-transparent {
  background: transparent;
  padding: 0.375rem 0.5rem;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.fantasy-input-transparent:hover {
  background: rgba(45, 24, 16, 0.4);
  border-color: rgba(251, 191, 36, 0.2);
}

.fantasy-input-transparent:focus {
  background: linear-gradient(180deg, rgba(26, 15, 10, 0.6) 0%, rgba(45, 24, 16, 0.4) 100%);
  border-color: rgba(251, 191, 36, 0.4);
}

.fantasy-button-icon {
  padding: 0.375rem;
  background: rgba(120, 53, 15, 0.3);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 6px;
  transition: all 0.3s ease;
  color: rgba(251, 191, 36, 0.7);
}

.fantasy-button-icon:hover {
  background: rgba(120, 53, 15, 0.5);
  border-color: rgba(251, 191, 36, 0.4);
  color: rgba(251, 191, 36, 1);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);
}

.stat-box {
  background: linear-gradient(180deg, rgba(26, 15, 10, 0.6) 0%, rgba(45, 24, 16, 0.4) 100%);
  border: 1px solid rgba(251, 191, 36, 0.15);
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3);
}

.health-bar-bg {
  height: 0.5rem;
  background: rgba(26, 15, 10, 0.8);
  border: 1px solid rgba(251, 191, 36, 0.15);
  border-radius: 9999px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
}

.health-bar-fill {
  height: 100%;
  transition: all 0.5s ease;
  border-radius: 9999px;
  box-shadow: 0 0 10px currentColor;
}

.condition-badge {
  padding: 0.25rem 0.5rem;
  background: linear-gradient(135deg, rgba(248, 113, 113, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: #f87171;
  text-shadow: 0 0 8px rgba(248, 113, 113, 0.4);
  font-size: 0.75rem;
  border-radius: 6px;
}

.text-shadow-glow {
  text-shadow: 
    0 0 20px rgba(251, 191, 36, 0.5),
    0 0 40px rgba(251, 191, 36, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.8);
}

.fantasy-title {
  font-family: 'Cinzel', Georgia, serif;
  letter-spacing: 0.05em;
}

@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
</style>
