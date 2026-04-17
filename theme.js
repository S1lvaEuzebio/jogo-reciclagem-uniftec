// Recupera a cor do cavaleiro sorteado
const themeColor = sessionStorage.getItem('themeColor');

if (themeColor) {
    // Altera a variável global Root
    document.documentElement.style.setProperty('--theme-color', themeColor);
}
