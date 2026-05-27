// ==============================================================================
// SIMULADOR 5: TERMÓMETRO DE LÍQUIDO E MUDANÇAS DE ESTADO
// ==============================================================================
const TEMP_AMBIENTE = 20.0;
const TEMP_MAX = 100.0;
const TEMP_MIN = 0.0;

let tempExpAtual = TEMP_AMBIENTE;
let modoExpAtual = 'ambiente'; 
let simExpInterval = null;

const TAXA_AQUECIMENTO = 0.15; 
const TAXA_GELO = 0.3;         
const TAXA_AMBIENTE = 0.02;   

function setModo(modo) {
    modoExpAtual = modo;
    const elChama = document.getElementById('chama-exp');
    const elGelo1 = document.getElementById('gelo-1');
    const elGelo2 = document.getElementById('gelo-2');
    const elGelo3 = document.getElementById('gelo-3');
    
    document.querySelectorAll('.btn-exp').forEach(btn => btn.style.outline = 'none');
    if(modo === 'aquecer') document.querySelector('.btn-fogo').style.outline = '3px solid white';
    if(modo === 'arrefecer') document.querySelector('.btn-gelo').style.outline = '3px solid white';
    if(modo === 'ambiente') document.querySelector('.btn-parar').style.outline = '3px solid white';

    if(elChama) elChama.style.opacity = (modo === 'aquecer') ? 1 : 0;
    
    if(elGelo1 && elGelo2 && elGelo3) {
        elGelo1.style.opacity = elGelo2.style.opacity = elGelo3.style.opacity = (modo === 'arrefecer') ? 1 : 0;
        if(modo === 'arrefecer') {
            elGelo1.style.transform = 'translateY(0) rotate(15deg)';
            elGelo2.style.transform = 'translateY(-10px) rotate(-10deg)'; 
            elGelo3.style.transform = 'translateY(0) rotate(25deg)';
        } else {
            elGelo1.style.transform = 'translateY(-200px) rotate(15deg)';
            elGelo2.style.transform = 'translateY(-200px) rotate(-10deg)';
            elGelo3.style.transform = 'translateY(-200px) rotate(25deg)';
        }
    }

    if (!simExpInterval) {
        simExpInterval = setInterval(simulatePhysicsExp, 1000 / 60); 
    }
}

function simulatePhysicsExp() {
    let mudou = false;
    switch (modoExpAtual) {
        case 'aquecer':
            if (tempExpAtual < TEMP_MAX) { tempExpAtual = Math.min(TEMP_MAX, tempExpAtual + TAXA_AQUECIMENTO); mudou = true; }
            break;
        case 'arrefecer':
            if (tempExpAtual > TEMP_MIN) { tempExpAtual = Math.max(TEMP_MIN, tempExpAtual - TAXA_GELO); mudou = true; }
            break;
        case 'ambiente':
            if (Math.abs(tempExpAtual - TEMP_AMBIENTE) > 0.1) {
                tempExpAtual += (tempExpAtual > TEMP_AMBIENTE) ? -TAXA_AMBIENTE : TAXA_AMBIENTE;
                mudou = true;
            } else {
                tempExpAtual = TEMP_AMBIENTE; modoExpAtual = 'parado'; 
            }
            break;
    }
    if (mudou || modoExpAtual === 'parado') updateVisualsExp();
}

function updateVisualsExp() {
    const elTempDisplay = document.getElementById('temp-exp-display');
    const elLiquido = document.getElementById('liquido-exp');
    const elBulbo = document.getElementById('bulbo-exp');
    const elAgua = document.getElementById('agua-exp');
    const elBolhas = document.getElementById('bolhas-exp');

    if(!elTempDisplay) return;

    elTempDisplay.innerText = tempExpAtual.toFixed(1);
    elLiquido.style.height = tempExpAtual + '%';

    let hue = tempExpAtual <= TEMP_AMBIENTE 
        ? 200 - (tempExpAtual * (20/TEMP_AMBIENTE)) 
        : 180 - ((tempExpAtual - TEMP_AMBIENTE) * (180/(TEMP_MAX - TEMP_AMBIENTE)));
    
    let colorThermo = `hsl(${hue}, 80%, 50%)`;
    let colorThermoDark = `hsl(${hue}, 100%, 20%)`;
    
    elLiquido.style.background = `linear-gradient(to right, ${colorThermoDark}, ${colorThermo} 40%, ${colorThermo} 60%, ${colorThermoDark})`;
    elBulbo.style.background = `radial-gradient(circle at 10px 10px, ${colorThermo}, ${colorThermoDark} 80%)`;

    elAgua.style.backgroundColor = `hsla(${hue}, 70%, 60%, 0.3)`;
    elBolhas.style.opacity = (tempExpAtual > 95) ? (tempExpAtual - 95) / 5 : 0; 
}