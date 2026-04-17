const nameInput = document.getElementById('player-name');
const startBtn = document.getElementById('start-btn');
const knightPrompt = document.getElementById('knight-prompt');

// Resgata o nome do cavaleiro e insere no parágrafo
const savedKnightName = sessionStorage.getItem('knightName') || 'Cavaleiro';
knightPrompt.textContent = `Qual o seu verdadeiro nome ${savedKnightName}? `;

startBtn.addEventListener('click', startGame);

function startGame() {
    const name = nameInput.value.trim();
    if (name.length === 0) {
        alert("Por favor, insira o seu nome antes de começar!");
        nameInput.focus();
        return;
    }

    sessionStorage.setItem('playerName', name);
    // Reset round and score for new player
    sessionStorage.setItem('score', '0');
    sessionStorage.setItem('currentRound', '1');

    window.location.href = 'round.html';
}

nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startBtn.click();
});

// Lógica de "Trocar Cavaleiro"
const changeKnightBtn = document.getElementById('change-knight-btn');
if (changeKnightBtn) {
    changeKnightBtn.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = 'index.html';
    });
}
