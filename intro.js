// Limpa qualquer progresso ou tema de histórias anteriores
sessionStorage.clear();

const knights = [
    { name: "Cavaleiro A4", color: "#2882FF", sprite: "files/Walk_blue.png" },
    { name: "Cavaleiro Tampinha", color: "#DC1E1E", sprite: "files/Walk_red.png" },
    { name: "Cavaleiro Cristalino", color: "#00C43C", sprite: "files/Walk_green.png" },
    { name: "Cavaleiro Coca Cola", color: "#FFD700", sprite: "files/Walk_yellow.png" }
];

// Sortear o cavaleiro
const selectedKnight = knights[Math.floor(Math.random() * knights.length)];

// Salvar no estado global
sessionStorage.setItem('themeColor', selectedKnight.color);
sessionStorage.setItem('knightName', selectedKnight.name);
sessionStorage.setItem('knightSprite', selectedKnight.sprite);

// Slides de história
const slides = [
    {
        text: "Em um planeta cheio de vida, tudo era limpo, bonito e colorido…",
        image: "<img id='intro-image' src='assets/intro/imagem_planeta_normal.png' alt='Planeta Normal' onerror=\"this.style.display='none'\">"
    },
    {
        text: "Mas um dia… algo deu muito errado.",
        image: ""
    },
    {
        text: "Uma grande explosão espalhou lixo por todo o planeta!",
        image: "<img id='intro-image' src='assets/intro/imagem_planeta_normal.png' alt='Planeta Normal' onerror=\"this.style.display='none'\">"
    },
    {
        text: "",
        image: "<img id='intro-image' src='assets/intro/imagem_planeta_lixo.png' alt='Planeta com Lixo' onerror=\"this.style.display='none'\">"
    }, {
        text: "O lixo ficou todo misturado… e ninguém sabe mais onde colocar cada coisa.",
        image: "<img id='intro-image' src='assets/intro/imagem_planeta_lixo.png' alt='Planeta com Lixo' onerror=\"this.style.display='none'\">"
    },
    {
        text: `Para ajudar o mundo, você será nomeado como: <br><br><strong style="color:${selectedKnight.color}; font-size:18px;">${selectedKnight.name}</strong>`,
        image: `<div class="knight-preview" style="background: url('${selectedKnight.sprite}') left center;"></div>`
    },
    {
        text: `Agora como <strong style="color:${selectedKnight.color}">${selectedKnight.name}</strong>, você deverá fazer a separação dos lixos em seus devidos locais.`,
        image: `<div class="knight-preview" style="background: url('${selectedKnight.sprite}') left center;"></div>`
    },
    {
        text: "Arraste cada item para a lixeira certa e ajude a limpar tudo!",
        image: `<div class="knight-preview" style="background: url('${selectedKnight.sprite}') left center;"></div>`
    }
];

let currentSlideIndex = 0;
let typingInterval;
let isTyping = false;
let currentFullText = "";

const introImageContainer = document.getElementById('intro-image-container');
const introText = document.getElementById('intro-text');
const nextBtn = document.getElementById('next-btn');

function renderSlide(index) {
    const slide = slides[index];
    introImageContainer.innerHTML = slide.image;

    if (slide.image === "") {
        introImageContainer.style.display = "none";
    } else {
        introImageContainer.style.display = "flex";
    }

    // Configura o texto e botões
    nextBtn.style.visibility = 'hidden';
    introText.innerHTML = '';
    currentFullText = slide.text;

    if (index === slides.length - 1) {
        nextBtn.textContent = 'Começar!';
    } else {
        nextBtn.textContent = '▶';
    }

    // Aplica Animação Fade-In no texto e imagem container
    introImageContainer.classList.remove('fade-out');
    introText.parentElement.classList.remove('fade-out');
    introImageContainer.classList.add('fade-in');
    introText.parentElement.classList.add('fade-in');

    typeWriterEffect();
}

function typeWriterEffect() {
    isTyping = true;
    let charIndex = 0;
    introText.innerHTML = '';

    // Suporte para HTML tags basico no typeWriter
    let tempText = "";

    typingInterval = setInterval(() => {
        // Se encontramos uma Tag HTML, pulamos até fechar a tag para formatar instantâneo
        if (currentFullText.charAt(charIndex) === '<') {
            let tag = "";
            while (currentFullText.charAt(charIndex) !== '>' && charIndex < currentFullText.length) {
                tag += currentFullText.charAt(charIndex);
                charIndex++;
            }
            tag += '>';
            tempText += tag;
            charIndex++; // avança o char depois do >
        }

        if (charIndex <= currentFullText.length) {
            tempText += currentFullText.charAt(charIndex) || '';
            introText.innerHTML = tempText;
            charIndex++;
        } else {
            finishTyping();
        }

    }, 40); // Velocidade da digitação
}

function finishTyping() {
    clearInterval(typingInterval);
    isTyping = false;
    introText.innerHTML = currentFullText; // Garante o texto final inteiro com as tags de formatação
    nextBtn.style.visibility = 'visible';
}

nextBtn.addEventListener('click', () => {
    if (isTyping) {
        finishTyping(); // Completa se clickar no meio
    } else {
        // Avançar pra próximo
        advanceSlide();
    }
});

// Suporte pra clicar em qualquer lugar da tela
document.addEventListener('pointerup', (e) => {
    if (e.target !== nextBtn && isTyping) {
        finishTyping();
    }
});

function advanceSlide() {
    introImageContainer.classList.remove('fade-in');
    introText.parentElement.classList.remove('fade-in');

    introImageContainer.classList.add('fade-out');
    introText.parentElement.classList.add('fade-out');

    setTimeout(() => {
        currentSlideIndex++;
        if (currentSlideIndex < slides.length) {
            renderSlide(currentSlideIndex);
        } else {
            // Fim da intro
            window.location.href = 'login.html';
        }
    }, 500); // Tempo da transição antes de preencher
}

// Inicia a renderização
setTimeout(() => {
    renderSlide(0);
}, 200);
