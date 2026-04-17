const restartBtn = document.getElementById('restart-btn');
const finalStats = document.getElementById('final-stats');
const gameOverReason = document.getElementById('game-over-reason');

const playerName = sessionStorage.getItem('playerName') || 'Jogador';
const score = sessionStorage.getItem('score') || '0';
const currentRound = sessionStorage.getItem('currentRound') || '1';
const reason = sessionStorage.getItem('gameOverReason') || 'O tempo esgotou!';

gameOverReason.textContent = reason;
finalStats.innerHTML = `Jogador: ${playerName}<br><br>Chegou na rodada: ${currentRound}<br><br>Pontuação Final: <span style="color:#0f0">${score}</span>`;

restartBtn.addEventListener('click', () => {
    sessionStorage.setItem('score', '0');
    sessionStorage.setItem('currentRound', '1');
    window.location.href = 'round.html';
});
