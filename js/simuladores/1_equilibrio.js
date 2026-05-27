// ==============================================================================
// SIMULADOR 1: EQUILÍBRIO TÉRMICO
// ==============================================================================
let isSimRunning = false;
let tA = 70; let tB = 10;
let waveTime = 0; 
let particlesA = [];
let particlesB = [];

function startSim() { isSimRunning = true; }
function pauseSim() { isSimRunning = false; }
function resetSim() { 
    isSimRunning = false; tA = 70; tB = 10; 
    const rangeA = document.getElementById('range-a');
    const rangeB = document.getElementById('range-b');
    if(rangeA) rangeA.value = tA; 
    if(rangeB) rangeB.value = tB; 
}

function updateSlidersManually() { 
    if (!isSimRunning) { 
        tA = parseFloat(document.getElementById('range-a').value); 
        tB = parseFloat(document.getElementById('range-b').value); 
    } 
}

function animateMod1() {
    const canvasA = document.getElementById('canvasA');
    const canvasB = document.getElementById('canvasB');
    if(!canvasA || !canvasB) return;
    
    const ctxA = canvasA.getContext('2d');
    const ctxB = canvasB.getContext('2d');
    
    // Inicializa as partículas se ainda não existirem
    if(particlesA.length === 0) {
        particlesA = Array.from({ length: 40 }, () => new Particle(canvasA));
        particlesB = Array.from({ length: 40 }, () => new Particle(canvasB));
    }
    
    if (isSimRunning) {
        let diff = tA - tB;
        if (Math.abs(diff) > 0.5) {
            let heatFlowRate = 0.08; 
            tA -= diff * heatFlowRate * 0.05;
            tB += diff * heatFlowRate * 0.05;
            document.getElementById('range-a').value = tA; 
            document.getElementById('range-b').value = tB;
        } else { tA = tB; isSimRunning = false; }
    }

    document.getElementById('val-a').innerText = Math.round(tA); 
    document.getElementById('val-b').innerText = Math.round(tB);
    ctxA.clearRect(0, 0, canvasA.width, canvasA.height); 
    ctxB.clearRect(0, 0, canvasB.width, canvasB.height);

    const colorA = `hsl(${240 - (tA * 2.4)}, 80%, 60%)`;
    const colorB = `hsl(${240 - (tB * 2.4)}, 80%, 60%)`;

    particlesA.forEach(p => p.updateAndDraw(ctxA, tA, colorA));
    particlesB.forEach(p => p.updateAndDraw(ctxB, tB, colorB));

    const diff = tA - tB;
    waveTime += 0.15;
    let dir = diff > 0 ? 1 : -1; 

    const textTop = document.getElementById('flow-text-top');
    const textBottom = document.getElementById('flow-text-bottom');
    if(textTop && textBottom) {
        if (Math.abs(diff) < 1) {
            textTop.innerText = "Equilíbrio Térmico"; textTop.style.color = "#94a3b8";
            textBottom.innerText = "Ausência de fluxo"; textBottom.style.color = "#94a3b8";
        } else {
            textTop.innerText = "Fluxo de calor"; textTop.style.color = diff > 0 ? "#ef4444" : "#3b82f6";
            textBottom.innerText = "";
        }
    }

    const heatArrows = document.querySelectorAll('.heat-arrow');
    heatArrows.forEach((arrow, index) => {
        let xOffset = 5 + index * 16; 
        if (Math.abs(diff) < 1) {
            arrow.setAttribute('points', `${xOffset},24 ${xOffset+10},24 ${xOffset+10},26 ${xOffset},26`);
            arrow.setAttribute('fill', '#475569'); arrow.style.opacity = 0.4;
        } else {
            if (dir > 0) { arrow.setAttribute('points', `${xOffset},15 ${xOffset+10},25 ${xOffset},35 ${xOffset+4},25`); } 
            else { arrow.setAttribute('points', `${xOffset+10},15 ${xOffset},25 ${xOffset+10},35 ${xOffset+6},25`); }
            let phase = waveTime - (dir * index * 1.2); 
            let intensity = (Math.sin(phase) + 1) / 2; 
            let brightness = 0.1 + (0.9 * intensity);
            arrow.setAttribute('fill', diff > 0 ? '#ef4444' : '#3b82f6'); arrow.style.opacity = brightness;
        }
    });
    requestAnimationFrame(animateMod1);
}

// Salvar respostas deste módulo
function saveAnswersMod1() {
    if(!currentUser.name) return alert('Faça login primeiro!');
    const prefix = `interalab_${currentUser.name}_`;
    localStorage.setItem(prefix + 'q1_m1', document.getElementById('q1_m1_ans').value);
    localStorage.setItem(prefix + 'q2_m1', document.getElementById('q2_m1_ans').value);
    localStorage.setItem(prefix + 'q3_m1', document.getElementById('q3_m1_ans').value);
    localStorage.setItem(prefix + 'q4_m1', document.getElementById('q4_m1_ans').value);
    document.getElementById('msg_modulo1').style.display = 'block';
    setTimeout(() => { document.getElementById('msg_modulo1').style.display = 'none'; }, 3000);
}