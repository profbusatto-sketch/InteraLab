const canvas = document.getElementById('canvasMolecules');
const ctx = canvas.getContext('2d');

let targetTemp = 300; // Temperatura controlada pelos botões
let molecules = [];
const numMolecules = 18;
const dt = 0.2; // Passo de tempo

// Constantes físicas
const mass = 1.0;
const inertia = 20.0; 
const bondDist = 10;  
const hAngle = 104.5 * Math.PI / 180; 

function initMolecules() {
    molecules = [];
    for (let i = 0; i < numMolecules; i++) {
        molecules.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20,
            vx: 0, vy: 0, va: 0, 
            angle: Math.random() * Math.PI * 2,
            fx: 0, fy: 0, torque: 0,
            radius: 12
        });
    }
}

function getHPositions(m) {
    return [
        { x: m.x + Math.cos(m.angle - hAngle/2) * bondDist, y: m.y + Math.sin(m.angle - hAngle/2) * bondDist },
        { x: m.x + Math.cos(m.angle + hAngle/2) * bondDist, y: m.y + Math.sin(m.angle + hAngle/2) * bondDist }
    ];
}

function computeForces() {
    molecules.forEach(m => { m.fx = 0; m.fy = 0; m.torque = 0; });

    for (let i = 0; i < molecules.length; i++) {
        let m1 = molecules[i];

        // Gravidade atua se não for Gás (Abaixo de 373K)
        if (targetTemp < 373) {
            m1.fy += 0.5;
        }

        for (let j = i + 1; j < molecules.length; j++) {
            let m2 = molecules[j];
            let dx = m2.x - m1.x;
            let dy = m2.y - m1.y;
            let distSq = dx*dx + dy*dy;
            let dist = Math.sqrt(distSq);

            // Evita a "Explosão Numérica" limitando a distância mínima nos cálculos
            if (dist < 5) dist = 5; 

            // Potencial de Lennard-Jones (Atração/Repulsão)
            let sigma = 25; 
            let r6 = Math.pow(sigma / dist, 6);
            let forceLJ = 24 * 1.5 * (2 * r6 * r6 - r6) / dist; 
            
            // Limita a força máxima de repulsão para as moléculas não voarem para fora
            if (forceLJ < -50) forceLJ = -50;
            if (dist > 80) forceLJ = 0; // Raio de corte da atração

            let fx = (dx / dist) * forceLJ;
            let fy = (dy / dist) * forceLJ;
            
            m1.fx -= fx; m1.fy -= fy;
            m2.fx += fx; m2.fy += fy;

            // Pontes de Hidrogênio
            let hPos1 = getHPositions(m1);
            let hPos2 = getHPositions(m2);

            [...hPos1, ...hPos2].forEach((h, idx) => {
                let targetO = idx < 2 ? m2 : m1;
                let hdx = targetO.x - h.x;
                let hdy = targetO.y - h.y;
                let hDist = Math.sqrt(hdx*hdx + hdy*hdy);
                
                if (hDist < 5) hDist = 5; // Prevenção de explosão
                
                if (hDist < 30) {
                    let fHB = 1.0; 
                    let hfx = (hdx / hDist) * fHB;
                    let hfy = (hdy / hDist) * fHB;
                    
                    if (idx < 2) {
                        m1.fx += hfx; m1.fy += hfy;
                        m2.fx -= hfx; m2.fy -= hfy;
                        m1.torque += (h.x - m1.x) * hfy - (h.y - m1.y) * hfx;
                    } else {
                        m2.fx += hfx; m2.fy += hfy;
                        m1.fx -= hfx; m1.fy -= hfy;
                        m2.torque += (h.x - m2.x) * hfy - (h.y - m2.y) * hfx;
                    }
                }
            });
        }
    }
}

function updatePhysics() {
    computeForces();

    molecules.forEach(m => {
        // Controle Térmico (Termostato)
        let damping = 0.05;
        let noise = Math.sqrt(targetTemp) * 0.2;
        
        m.vx += (m.fx / mass) * dt - damping * m.vx + (Math.random() - 0.5) * noise;
        m.vy += (m.fy / mass) * dt - damping * m.vy + (Math.random() - 0.5) * noise;
        m.va += (m.torque / inertia) * dt - damping * m.va + (Math.random() - 0.5) * noise * 0.1;

        // Limite de velocidade máxima de segurança
        let speed = Math.hypot(m.vx, m.vy);
        if (speed > 20) {
            m.vx = (m.vx / speed) * 20;
            m.vy = (m.vy / speed) * 20;
        }

        // Parada total no Zero Absoluto
        if (targetTemp === 0) {
            m.vx *= 0.8; m.vy *= 0.8; m.va *= 0.8;
            if (Math.abs(m.vx) < 0.1) m.vx = 0;
            if (Math.abs(m.vy) < 0.1) m.vy = 0;
            if (Math.abs(m.va) < 0.1) m.va = 0;
        }

        // Aplica o movimento
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.angle += m.va * dt;

        // COLISÃO COM AS PAREDES (Impede que saiam da tela)
        if (m.x < m.radius) { m.x = m.radius; m.vx *= -1; }
        if (m.x > canvas.width - m.radius) { m.x = canvas.width - m.radius; m.vx *= -1; }
        if (m.y < m.radius) { m.y = m.radius; m.vy *= -1; }
        if (m.y > canvas.height - m.radius) { m.y = canvas.height - m.radius; m.vy *= -1; }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePhysics();

    molecules.forEach(m => {
        let hPos = getHPositions(m);
        
        // Oxigênio
        ctx.beginPath();
        ctx.arc(m.x, m.y, 10, 0, Math.PI*2);
        ctx.fillStyle = "#ef4444"; // Vermelho
        ctx.fill();
        ctx.strokeStyle = "#991b1b";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Hidrogênios
        ctx.fillStyle = "#ffffff";
        hPos.forEach(h => {
            ctx.beginPath();
            ctx.arc(h.x, h.y, 5, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
        });
    });

    // Atualização da Interface
    document.getElementById('tempDisplay').innerText = targetTemp + " K";
    
    let state = "";
    if (targetTemp >= 373) state = "Estado: Gasoso";
    else if (targetTemp > 273) state = "Estado: Líquido";
    else if (targetTemp > 0) state = "Estado: Sólido";
    else state = "Estado: Zero Absoluto";
    
    document.getElementById('stateLabel').innerText = state;

    requestAnimationFrame(draw);
}

// ==========================================
// FUNÇÕES DOS BOTÕES (AQUECER / ARREFECER)
// ==========================================
function changeTemp(delta) {
    targetTemp += delta;
    if (targetTemp < 0) targetTemp = 0; // Impede temperatura negativa (Kelvin)
}

function resetTemp() {
    targetTemp = 300;
}

// Inicia o simulador
initMolecules();
draw();