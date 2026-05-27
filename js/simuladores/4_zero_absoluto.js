// ==============================================================================
// SIMULADOR 4: ZERO ABSOLUTO
// ==============================================================================
let currentK = 300;

function coolDown() { 
    if(currentK > 0) currentK -= 10; 
    document.getElementById('currentK').innerText = currentK; 
}

function resetCool() { 
    currentK = 300; 
    document.getElementById('currentK').innerText = currentK; 
}

function drawZeroSim() {
    const canvasZero = document.getElementById('canvasZero');
    if(!canvasZero) return;
    const ctxZ = canvasZero.getContext('2d');
    
    ctxZ.clearRect(0, 0, 400, 200); 
    ctxZ.fillStyle = "#06b6d4";
    
    for(let i=0; i<15; i++) {
        let offset = (Math.random()-0.5) * (currentK/15);
        ctxZ.beginPath(); 
        ctxZ.arc(45 + i*22, 100 + offset, 8, 0, Math.PI*2); 
        ctxZ.fill();
    }
    requestAnimationFrame(drawZeroSim);
}