// VARIÁVEIS GLOBAIS DE USUÁRIO
let currentUser = { name: '', role: '' };

// SISTEMA DE LOGIN
function doLogin() {
    const name = document.getElementById('userName').value.trim();
    const role = document.getElementById('userRole').value;
    if(name === "") return alert("Por favor, digite o seu nome.");
    
    currentUser = { name: name, role: role };
    localStorage.setItem('interalab_user', JSON.stringify(currentUser));
    
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    setupInterfaceBasedOnRole();
}

function doLogout() {
    localStorage.removeItem('interalab_user');
    window.location.reload(); 
}

function setupInterfaceBasedOnRole() {
    document.getElementById('display-username').innerText = currentUser.name;
    const welcomeMsg = document.getElementById('welcome-msg');
    
    if(currentUser.role === 'aluno') {
        welcomeMsg.innerText = `Bem-vindo(a) estudante, ${currentUser.name}!`;
        document.getElementById('nav-teacher').style.display = 'none'; 
        showSection('dashboard');
    } else {
        welcomeMsg.innerText = `Bem-vindo(a) educador(a), ${currentUser.name}!`;
        document.getElementById('nav-teacher').style.display = 'inline-block'; 
        showSection('dashboard');
    }
}

// SISTEMA DE NAVEGAÇÃO
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    const termoNav = document.getElementById('termo-nav');
    if(id.startsWith('modulo')) {
        termoNav.style.display = 'flex'; 
        document.querySelectorAll('#termo-nav a').forEach(a => a.classList.remove('active-sub'));
        if(id === 'modulo1') document.getElementById('nav-mod1').classList.add('active-sub');
        if(id === 'modulo2') document.getElementById('nav-mod2').classList.add('active-sub');
    } else {
        termoNav.style.display = 'none'; 
    }
    
    if(id === 'professor' && typeof updateReport === 'function') updateReport();
}

// CLASSE BASE DE PARTÍCULAS (MUITO IMPORTANTE!)
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = 4;
    }

    updateAndDraw(ctx, temp, baseColor) {
        const speedMult = (temp / 25) + 0.1;
        this.x += this.vx * speedMult;
        this.y += this.vy * speedMult;

        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.fill();
    }
}

// INICIALIZAÇÃO QUANDO A PÁGINA CARREGA
window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('interalab_user');
    if(savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        setupInterfaceBasedOnRole();
    }

    // Dispara as animações de todos os módulos (se as funções existirem)
    setTimeout(() => {
        if(typeof animateMod1 === 'function') animateMod1();
        if(typeof animateEnergySim === 'function') animateEnergySim();
        if(typeof drawZeroSim === 'function') drawZeroSim();
        if(typeof updateVisualsExp === 'function') updateVisualsExp();
        if(typeof atualizarVisualForno === 'function') atualizarVisualForno();
        if(typeof atualizarVisualOptico === 'function') atualizarVisualOptico();
    }, 200);
});