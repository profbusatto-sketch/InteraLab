// =====================================================================
// SIMULADOR 3: ESCALAS TERMOMÉTRICAS
// =====================================================================
let notificouMaximo = false; // Evita que o alerta fique travando a tela em cada clique se continuar subindo

function convertScales(c) {
    if (c === "" || c === "-") return;
    c = parseFloat(c);
    if (isNaN(c)) return;

    // Limite Físico Mínimo (Zero Absoluto)
    if (c < -273.15) {
        c = -273.15;
        document.getElementById('valcelsius').value = c;
    }

    // NOTIFICAÇÃO DE LIMITE MÁXIMO VISUAL
    if (c >= 100) {
        if (!notificouMaximo) {
            alert("Aviso: Embora o termômetro tenha atingido o limite máximo visual do simulador (100°C), existem valores de temperatura superiores na física!");
            notificouMaximo = true; // Marca que já notificou para não incomodar de novo seguidamente
        }
    } else {
        notificouMaximo = false; // Reseta a permissão de notificar caso ele desça de 100°C
    }

    let f = (c * 9/5) + 32;
    let k = c + 273.15;

    // Cálculo da altura visual (0 K é vazio, 373.15 K é cheio)
    let altura = (k / 373.15) * 100;
    let alturaStr = Math.min(100, Math.max(0, altura)) + '%';

    document.getElementById('mCelsius').style.height = alturaStr;
    document.getElementById('mFahr').style.height = alturaStr;
    document.getElementById('mKelvin').style.height = alturaStr;

    document.getElementById('resultsScales').innerText = `${c.toFixed(1)} °C = ${f.toFixed(1)} °F = ${k.toFixed(1)} K`;
}

// Isso força o termômetro a carregar sincronizado com o valor "25" ao abrir a página
window.addEventListener('DOMContentLoaded', () => {
    let input = document.getElementById('valcelsius');
    if(input) convertScales(input.value);
});