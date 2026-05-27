// ==============================================================================
// SIMULADOR 6: TERMÓMETRO BIMETÁLICO (FORNO INDUSTRIAL)
// ==============================================================================

// Variáveis de estado isoladas para este simulador
let tempForno = 20.0;
let fornoAtivo = false;
let furnaceInterval = null;

/**
 * Função principal chamada pelo botão no HTML
 */
function toggleForno() {
    console.log("Botão do Forno clicado. Estado atual ativo:", fornoAtivo);
    
    fornoAtivo = !fornoAtivo;
    const btn = document.getElementById('btn-forno');
    
    if (fornoAtivo) {
        // Lógica para LIGAR
        if (btn) {
            btn.innerText = "DESLIGAR FORNO";
            btn.classList.add('off'); // Adiciona estilo de botão ligado/perigo
        }
        iniciarProcessoForno(1.8); // Sobe a temperatura
    } else {
        // Lógica para DESLIGAR
        if (btn) {
            btn.innerText = "LIGAR AQUECEDOR";
            btn.classList.remove('off');
        }
        iniciarProcessoForno(-0.6); // Arrefece gradualmente
    }
}

/**
 * Controla o aumento ou diminuição gradual da temperatura
 */
function iniciarProcessoForno(passo) {
    clearInterval(furnaceInterval);
    
    furnaceInterval = setInterval(() => {
        if (passo > 0 && tempForno < 300) {
            tempForno += passo;
        } else if (passo < 0 && tempForno > 20) {
            tempForno += passo;
        } else {
            // Para o intervalo se atingir os limites
            clearInterval(furnaceInterval);
            if(tempForno < 20) tempForno = 20;
            if(tempForno > 300) tempForno = 300;
        }
        atualizarVisualForno();
    }, 50);
}

/**
 * Atualiza toda a parte visual (Ponteiro, Espiral, Resistências e Texto)
 */
function atualizarVisualForno() {
    const elTempForno = document.getElementById('temp-forno');
    if (!elTempForno) return;

    // 1. Atualiza o número no visor
    elTempForno.innerText = tempForno.toFixed(1);
    
    // Percentagem de progresso (0 a 1) entre 20°C e 300°C
    const pct = (tempForno - 20) / 280;

    // 2. Animação do Ponteiro (Rotação de -120deg a +120deg)
    const ponteiro = document.getElementById('ponteiro');
    if (ponteiro) {
        const rotPonteiro = -120 + (pct * 240);
        ponteiro.style.transform = `translateX(-50%) rotate(${rotPonteiro}deg)`;
    }

    // 3. Animação da Espiral (Simula a dilatação bimetálica)
    const espiral = document.getElementById('espiral-svg');
    if (espiral) {
        const rotEspiral = pct * 80; 
        const aumentoTamanho = 1 + (pct * 0.20); 
        espiral.style.transform = `rotate(${rotEspiral}deg) scale(${aumentoTamanho})`;
    }

    // 4. Cor das Resistências (Cinzento -> Vermelho incandescente)
    const corR = 30 + (pct * 225);
    const corG = 41 - (pct * 31);
    const corB = 59 - (pct * 49);
    const corFinal = `rgb(${corR}, ${corG}, ${corB})`;
    
    document.querySelectorAll('.resistencia-filamento').forEach(res => {
        res.style.backgroundColor = corFinal;
        // Adiciona um brilho (glow) quando está quente
        res.style.boxShadow = pct > 0.1 ? `0 0 ${pct * 15}px #ef4444` : 'none';
    });
}

// Diagnóstico automático ao carregar o ficheiro
(function verificarElementos() {
    setTimeout(() => {
        const btn = document.getElementById('btn-forno');
        const display = document.getElementById('temp-forno');
        console.log("--- Check-up do Simulador de Forno ---");
        console.log("Botão encontrado:", btn ? "SIM" : "NÃO (Erro de ID)");
        console.log("Display encontrado:", display ? "SIM" : "NÃO (Erro de ID)");
        if (display) atualizarVisualForno(); // Garante o estado inicial visual
    }, 500);
})();