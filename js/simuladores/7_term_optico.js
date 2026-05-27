// ==============================================================================
// SIMULADOR 7: PIRÓMETRO ÓPTICO (RADIAÇÃO TÉRMICA)
// ==============================================================================
let tempOptico = 20.0;
let queimadorAtivo = false;
let opticoInterval = null;

function toggleQueimador() {
    queimadorAtivo = !queimadorAtivo;
    const btn = document.getElementById('btn-queimador');
    const chama = document.getElementById('chama');
    
    if (queimadorAtivo) {
        btn.innerText = "DESLIGAR MAÇARICO";
        btn.classList.add('off'); 
        chama.classList.add('ativa');
        iniciarAquecimentoOptico(4.5);
    } else {
        btn.innerText = "LIGAR MAÇARICO";
        btn.classList.remove('off'); 
        chama.classList.remove('ativa');
        iniciarAquecimentoOptico(-2.0); 
    }
}

function iniciarAquecimentoOptico(passo) {
    clearInterval(opticoInterval);
    opticoInterval = setInterval(() => {
        if (passo > 0 && tempOptico < 1000) tempOptico += passo;
        else if (passo < 0 && tempOptico > 20) tempOptico += passo;
        else {
            clearInterval(opticoInterval);
            if(tempOptico < 20) tempOptico = 20;
            if(tempOptico > 1000) tempOptico = 1000;
        }
        atualizarVisualOptico();
    }, 50);
}

function atualizarVisualOptico() {
    const elTempOptico = document.getElementById('temp-optico');
    if(!elTempOptico) return;

    elTempOptico.innerText = Math.round(tempOptico).toFixed(1);
    const pct = (tempOptico - 20) / 980; 

    // 1. Cor do Bloco de Metal
    let r = 148, g = 163, b = 184;
    if (pct > 0.2) {
        let subPct = (pct - 0.2) / 0.8;
        r = 148 + (107 * subPct);
        g = 163 - (163 * subPct);
        b = 184 - (184 * subPct);
        if (pct > 0.6) g = 160 * ((pct-0.6)/0.4); 
    }
    const bloco = document.getElementById('bloco-metal');
    if(bloco) {
        bloco.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        bloco.style.boxShadow = pct > 0.3 ? `0 0 ${pct * 30}px rgba(255, 69, 0, ${pct})` : 'none';
    }

    // 2. Lógica das Ondas Simétricas
    const ondas = document.querySelectorAll('.onda');
    const speedOnda = 4 - (pct * 3.6); 
    const centro = 2; 

    ondas.forEach((onda, index) => {
        let dist = Math.abs(index - centro); 
        let threshold = dist * 0.3;

        if (pct >= threshold) {
            onda.style.opacity = 0.2 + (pct * 0.8);
            onda.style.strokeWidth = 1.5 + (pct * 4);
            onda.style.animationDuration = `${speedOnda}s`;
            onda.style.stroke = pct > 0.5 ? '#fbbf24' : '#ef4444'; 
        } else {
            if(dist === 0) {
                onda.style.opacity = 0.15;
                onda.style.strokeWidth = 1;
                onda.style.animationDuration = "4s";
                onda.style.stroke = '#ef4444';
            } else {
                onda.style.opacity = 0;
            }
        }
    });
}