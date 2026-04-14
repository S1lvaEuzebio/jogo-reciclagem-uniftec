// Estado do Jogo
let score = 0;
let hasScored = false;
let playerName = '';
let currentMistakes = 0;
let currentType = '';

// Elementos da UI
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const nameInput = document.getElementById('player-name');
const startBtn = document.getElementById('start-btn');
const playerNameDisplay = document.querySelector('#player-display span');
const scoreDisplay = document.getElementById('score');
const trashSpawner = document.getElementById('trash-spawner');
const hintDisplay = document.getElementById('hint-display');

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

// Iniciar Jogo
startBtn.addEventListener('click', startGame);

function startGame() {
    const name = nameInput.value.trim();
    if (name.length === 0) {
        alert("Por favor, insira o seu nome antes de começar!");
        nameInput.focus();
        return;
    }

    playerName = name;
    playerNameDisplay.textContent = playerName;

    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    resetGameState();
    spawnTrash();
}

function resetGameState() {
    score = 0;
    hasScored = false;
    currentMistakes = 0;
    scoreDisplay.textContent = score;
    hintDisplay.textContent = '';
}

// Suporte para Enter no input
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startBtn.click();
});

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

function spawnTrash() {
    trashSpawner.innerHTML = ''; // Limpar o atual
    currentMistakes = 0;
    updateHintDisplay();

    // Escolher lixo aleatório
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

    // Efeito sutil de aparecimento
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
        img.style.transition = 'none'; // Desabilita smooth css para arrastar de forma 1:1 ao mouse
    });

    img.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        // O drag image seguindo o cursor e 60% MAIOR (scale 1.6) como requisitado
        img.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.6) rotate(5deg)`;
    });

    img.addEventListener('pointerup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        img.classList.remove('dragged-manual');
        img.releasePointerCapture(e.pointerId);

        // Obter elemento exato onde foi solto
        img.style.display = 'none';
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        img.style.display = 'block';

        const bin = elements ? elements.find(el => el.closest('.bin'))?.closest('.bin') : null;

        if (bin) {
            const binType = bin.dataset.type;

            if (img.dataset.type === binType) {
                // Acerto
                updateScore(10);
                bin.classList.add('success');
                setTimeout(() => bin.classList.remove('success'), 600);

                // Anima o lixo sumindo caindo na lixeira
                img.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                img.style.transform = `translate(${currentX}px, ${currentY}px) scale(0)`;
                img.style.opacity = '0';

                setTimeout(spawnTrash, 400); // Traz o novo lixo
            } else {
                // Erro: Lixeira incorreta!
                currentMistakes++;
                const isGameOver = updateScore(-5);

                if (!isGameOver) {
                    updateHintDisplay(); // Atualiza a dica _ _ _

                    // Voltar a imagem exatamente pra posição original
                    img.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    currentX = 0;
                    currentY = 0;
                    img.style.transform = `translate(0px, 0px) scale(1)`;
                    setTimeout(() => { img.style.transition = 'none'; }, 450);
                }
            }
        } else {
            // Dropado fora do alvo (Volta pro lugar, sem penalidade)
            img.style.transition = 'transform 0.3s ease';
            currentX = 0;
            currentY = 0;
            img.style.transform = `translate(0px, 0px) scale(1)`;
            setTimeout(() => { img.style.transition = 'none'; }, 350);
        }
    });
}

function updateScore(points) {
    score += points;
    if (score > 0) hasScored = true;

    // Regra de Derrota: Se já obteve pontos alguma vez, e zera ou fica negativo errando
    if (hasScored && score <= 0) {
        score = 0;
        scoreDisplay.textContent = score;
        scoreDisplay.style.color = '#f00';

        setTimeout(() => {
            alert("Seus pontos foram zerados! O jogo vai recomeçar do 0.");
            resetGameState();
            spawnTrash();
        }, 50); // Timeout rápido para a renderização terminar primeiro

        return true; // Retorna flag dizendo se deu Game Over
    } else {
        scoreDisplay.textContent = score;
        scoreDisplay.style.color = points > 0 ? '#0f0' : '#f00';
        setTimeout(() => { scoreDisplay.style.color = '#0f0'; }, 400);
        return false;
    }
}
