// Recupera estado salvo
let playerName = sessionStorage.getItem('playerName') || 'Jogador';
let score = parseInt(sessionStorage.getItem('score') || '0', 10);
let currentRound = parseInt(sessionStorage.getItem('currentRound') || '1', 10);
let hasScored = score > 0;
let currentMistakes = 0;
let currentType = '';

let timerInterval = null;
let timeLeft = 0;

// Elementos da UI
const playerNameDisplay = document.querySelector('#player-display span');
const scoreDisplay = document.getElementById('score');
const roundDisplay = document.getElementById('round');
const timerDisplayContainer = document.getElementById('timer-display');
const timerDisplay = document.getElementById('timer');
const trashSpawner = document.getElementById('trash-spawner');
const hintDisplay = document.getElementById('hint-display');

// Initialize UI
playerNameDisplay.textContent = playerName;
scoreDisplay.textContent = score;
roundDisplay.textContent = currentRound;

// Dados dos Lixos
const trashTypes = [
    { type: 'paper', src: 'assets/paper_trash_pixel.png', name: 'Bola de Papel' },
    { type: 'plastic', src: 'assets/plastic_trash_pixel.png', name: 'Garrafa de Plástico' },
    { type: 'glass', src: 'assets/glass_trash_pixel.svg', name: 'Pote de Vidro' },
    { type: 'metal', src: 'assets/metal_trash_pixel.svg', name: 'Lata de Metal' }
];

const typeWords = {
    'paper': 'papel',
    'plastic': 'plástico',
    'glass': 'vidro',
    'metal': 'metal'
};

function saveState() {
    sessionStorage.setItem('score', score);
    sessionStorage.setItem('currentRound', currentRound);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function startTimerForRound() {
    stopTimer();
    if (currentRound >= 30) {
        timeLeft = 5;
        timerDisplayContainer.style.display = 'block';
    } else if (currentRound >= 10) {
        timeLeft = 10;
        timerDisplayContainer.style.display = 'block';
    } else {
        timerDisplayContainer.style.display = 'none';
        return;
    }

    timerDisplay.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            stopTimer();
            handleTimeOut();
        }
    }, 1000);
}

function triggerGameOver(reason) {
    stopTimer();
    saveState();
    sessionStorage.setItem('gameOverReason', reason);
    window.location.href = 'game-over.html';
}

function handleTimeOut() {
    triggerGameOver("O tempo esgotou!");
}

function updateHintDisplay() {
    if (currentMistakes === 0) {
        hintDisplay.textContent = '';
        return;
    }

    const word = typeWords[currentType];
    const charsToShow = currentMistakes - 1;
    let hint = '';

    for (let i = 0; i < word.length; i++) {
        if (i < charsToShow) {
            hint += word[i] + ' ';
        } else {
            hint += '_ ';
        }
    }
    hintDisplay.textContent = `Dica: ${hint.trim()}`;
}

function updateScore(points) {
    score += points;
    if (score > 0) hasScored = true;
    saveState();

    if (hasScored && score <= 0) {
        score = 0;
        saveState();
        scoreDisplay.textContent = score;
        scoreDisplay.style.color = '#f00';

        setTimeout(() => {
            triggerGameOver("Seus pontos foram zerados!");
        }, 50);

        return true;
    } else {
        scoreDisplay.textContent = score;
        scoreDisplay.style.color = points > 0 ? '#0f0' : '#f00';
        setTimeout(() => { scoreDisplay.style.color = '#0f0'; }, 400);
        return false;
    }
}

function spawnTrash() {
    trashSpawner.innerHTML = '';
    currentMistakes = 0;
    updateHintDisplay();
    startTimerForRound();

    const randomIndex = Math.floor(Math.random() * trashTypes.length);
    const trashData = trashTypes[randomIndex];
    currentType = trashData.type;

    const img = document.createElement('img');
    img.src = trashData.src;
    img.alt = trashData.name;
    img.className = 'trash-item';
    img.draggable = false;
    img.dataset.type = trashData.type;

    trashSpawner.appendChild(img);

    img.style.transform = 'scale(0)';
    setTimeout(() => { img.style.transform = 'scale(1)'; }, 50);

    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;

    img.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        img.classList.add('dragged-manual');
        img.setPointerCapture(e.pointerId);
        img.style.transition = 'none';
    });

    img.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        img.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.6) rotate(5deg)`;
    });

    img.addEventListener('pointerup', (e) => {
        if (!isDragging) return;
        if (!img.isConnected) return;
        isDragging = false;
        img.classList.remove('dragged-manual');
        img.releasePointerCapture(e.pointerId);

        img.style.display = 'none';
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        img.style.display = 'block';

        const bin = elements ? elements.find(el => el.closest('.bin'))?.closest('.bin') : null;

        if (bin) {
            const binType = bin.dataset.type;

            if (img.dataset.type === binType) {
                updateScore(10);
                bin.classList.add('success');
                setTimeout(() => bin.classList.remove('success'), 600);

                currentRound++;
                roundDisplay.textContent = currentRound;
                saveState();
                stopTimer();

                img.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                img.style.transform = `translate(${currentX}px, ${currentY}px) scale(0)`;
                img.style.opacity = '0';

                setTimeout(spawnTrash, 400);
            } else {
                // Se for rodada com tempo (rodadas >= 10), erro leva direto a Game Over
                if (currentRound >= 10) {
                    triggerGameOver("Você errou a lixeira na rodada com tempo mortal!");
                } else {
                    currentMistakes++;
                    const isGameOver = updateScore(-5);

                    if (!isGameOver) {
                        updateHintDisplay();

                        img.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        currentX = 0;
                        currentY = 0;
                        img.style.transform = `translate(0px, 0px) scale(1)`;
                        setTimeout(() => { img.style.transition = 'none'; }, 450);
                    }
                }
            }
        } else {
            img.style.transition = 'transform 0.3s ease';
            currentX = 0;
            currentY = 0;
            img.style.transform = `translate(0px, 0px) scale(1)`;
            setTimeout(() => { img.style.transition = 'none'; }, 350);
        }
    });
}

// Inicia o jogo
spawnTrash();
