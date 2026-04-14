# Jogo da Reciclagem ♻️

Um jogo educativo desenvolvido inteiramente para navegadores web, criado com o propósito de conscientizar e ensinar crianças (de 6 a 10 anos) sobre o processo de coleta seletiva e a importância da reciclagem, através de uma interface interativa em *Pixel Art*.

## 🎯 Sobre o Jogo

O **Jogo da Reciclagem** possui um forte cunho educativo. Durante a partida, os alunos/jogadores são apresentados a diversos tipos de lixos gerados aleatoriamente na tela (potes de vidro, garrafas plásticas, folhas de papel e latas de metal) e têm como objetivo arrastar e soltar cada classe de lixo em sua respectiva lixeira de reciclagem.

Além de engajar e descontrair, o jogo fixa a memória acerca das cores oficiais da reciclagem:
- **Azul**: Papel
- **Vermelho**: Plástico
- **Verde**: Vidro
- **Amarelo**: Metal

### 🎮 Mecânicas
- **Movimento e Interação:** Arraste livre dos lixos no centro do mapa até as respectivas lixeiras, seja com o mouse ou com o dedo (touchscreen).
- **Sistema de Pontuação e Recompensas:** Acertos rendem `+10 pontos`. Erros debitam `-5 pontos`.
- **Dicas Visuais:** Errar repetidamente a lixeira de um item faz aparecer uma dica no topo da tela inspirada em jogos da forca (ex: `p _ p _ l`), ensinando como se escreve o material que deve ser descartado.
- **Game Over:** Se o jogador já obteve pontos alguma vez na sessão e sua pontuação zerar devido à sucessão constante de penalidades, o jogo emite um aviso e se reinicia.
- **Responsividade e Cross-Platform:** Interface que se adequa caso seja aberta num celular e inativa comportamentos padrão, oferecendo a experiência de aplicativo.

## ⚙️ Detalhes Técnicos

O projeto foi inteiramente construído com tecnologias puras e leves do ecossistema front-end (*Vanilla*), evitando quaisquer bibliotecas ou motores gráficos pesados a fim de simplificar o deploy.

- **Frontend:**
  - **HTML5:** Estruturamento das telas utilizando marcação simples e suporte à escalabilidade de janela em multi-dispositivos (`meta viewport`).
  - **CSS3:** Todo o styling foi implementado via Vanilla CSS. O uso de Flexbox foi feito para suportar as lixeiras, juntamente com o uso de **Keyframes** para animações interativas de acerto (`successDrop`) e falha numéricas (`errorShake`).
  - **JavaScript Nativo (Vanilla JS):** A magia do *Drag and Drop* ocorre totalmente customizada ouvindo a Pointer API nativa dos navegadores modernos (`pointerdown`, `pointermove`, `pointerup`). Isso garantiu que toques na tela (Mobile) funcionassem sincronamente aos movimentos do mouse, sem delays. Controle de fluxo e status mantidos em variáveis dinâmicas em tempo real.
- **Mídia:** Todo o suporte é feito com imagens no formato livre (SVG e PNG baseados em descrições e prompts de Pixel Art).

### 🚀 Hospedagem e Deploy

Levando em conta que o repositório é puramente visual (Client-side) e sem requisitos de servidores Backend (Node, PHP, bancos de dados), este projeto foi feito nativamente para ser hospedado no **GitHub Pages**, de onde poderá ser acessado ao vivo por qualquer criança a partir de link rápido.

## 🤖 Menção: Assistência por IA

Este projeto é fruto da união da tecnologia humana com agentes de inteligência artificial. Grande parte dos trechos lógicos deste código — desde a responsividade interativa pelo touch do usuário no eixo X e Y no *script.js*, o levantamento do design system *Light Green* no *style.css*, até a elaboração autônoma dos arquivos visuais de imagem dentro dos assets — foi iterada, projetada e codificada nativamente pelo modelo **Google Gemini** colaborando ativamente na área de trabalho durante sua construção.
