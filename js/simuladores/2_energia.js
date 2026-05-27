// ==============================================================================
// SIMULADOR 2: ENERGIA TÉRMICA
// ==============================================================================
let partsE1 = []; let partsE2 = [];

function updateParticleArray(array, targetCount, canvas) {
    while(array.length < targetCount) { array.push(new Particle(canvas)); }
    while(array.length > targetCount) { array.pop(); }
}

function animateEnergySim() {
    const cEnergy1 = document.getElementById('canvasEnergy1');
    const cEnergy2 = document.getElementById('canvasEnergy2');
    if(!cEnergy1 || !cEnergy2) return;

    const ctxE1 = cEnergy1.getContext('2d');
    const ctxE2 = cEnergy2.getContext('2d');

    let t1 = parseFloat(document.getElementById('range-t1').value);
    let m1 = parseInt(document.getElementById('range-m1').value);
    let t2 = parseFloat(document.getElementById('range-t2').value);
    let m2 = parseInt(document.getElementById('range-m2').value);

    document.getElementById('lbl-t1').innerText = t1; 
    document.getElementById('lbl-m1').innerText = m1;
    document.getElementById('lbl-t2').innerText = t2; 
    document.getElementById('lbl-m2').innerText = m2;

    updateParticleArray(partsE1, m1, cEnergy1); 
    updateParticleArray(partsE2, m2, cEnergy2);
    ctxE1.clearRect(0, 0, cEnergy1.width, cEnergy1.height); 
    ctxE2.clearRect(0, 0, cEnergy2.width, cEnergy2.height);

    let color1 = `hsl(${240 - (t1 * 2.4)}, 80%, 60%)`;
    let color2 = `hsl(${240 - (t2 * 2.4)}, 80%, 60%)`;

    partsE1.forEach(p => p.updateAndDraw(ctxE1, t1, color1));
    partsE2.forEach(p => p.updateAndDraw(ctxE2, t2, color2));

    let rawE1 = Math.round(t1 * m1); 
    let rawE2 = Math.round(t2 * m2);
    let maxEnergy = 100 * 200; 
    
    document.getElementById('bar-e1').style.width = ((rawE1 / maxEnergy) * 100) + '%';
    document.getElementById('bar-e1').style.backgroundColor = color1;
    document.getElementById('text-e1').innerText = rawE1 + ' J';
    
    document.getElementById('bar-e2').style.width = ((rawE2 / maxEnergy) * 100) + '%';
    document.getElementById('bar-e2').style.backgroundColor = color2;
    document.getElementById('text-e2').innerText = rawE2 + ' J';

    requestAnimationFrame(animateEnergySim);
}

function saveAnswersMod1Sim2() {
    if(!currentUser.name) return alert('Faça login primeiro!');
    const prefix = `interalab_${currentUser.name}_`;
    localStorage.setItem(prefix + 'q1_m1_sim2', document.getElementById('q1_m1_sim2_ans').value);
    localStorage.setItem(prefix + 'q2_m1_sim2', document.getElementById('q2_m1_sim2_ans').value);
    localStorage.setItem(prefix + 'q3_m1_sim2', document.getElementById('q3_m1_sim2_ans').value);
    document.getElementById('msg_modulo1_sim2').style.display = 'block';
    setTimeout(() => { document.getElementById('msg_modulo1_sim2').style.display = 'none'; }, 3000);
}