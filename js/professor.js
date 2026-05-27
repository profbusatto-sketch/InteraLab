function updateReport() {
    const reportArea = document.getElementById('reportArea');
    if(!reportArea) return;

    const allKeys = Object.keys(localStorage);
    const studentData = {};

    allKeys.forEach(key => {
        if(key.includes('_mod')) {
            const parts = key.split('_mod');
            const name = parts[0];
            if(!studentData[name]) studentData[name] = {};
            studentData[name][key] = localStorage.getItem(key);
        }
    });

    if(Object.keys(studentData).length === 0) {
        reportArea.innerHTML = "Nenhum dado encontrado.";
        return;
    }

    reportArea.innerHTML = "";
    Object.keys(studentData).forEach(name => {
        reportArea.innerHTML += `ALUNO: ${name.toUpperCase()}\n`;
        const prefix = name + "_";
        
        reportArea.innerHTML += `--- Módulo 1 (Equilíbrio e Energia) ---\n`;
        reportArea.innerHTML += `Q1: ${localStorage.getItem(prefix+'mod1_q1') || "-"}\n`;
        reportArea.innerHTML += `Q2: ${localStorage.getItem(prefix+'mod1_q2') || "-"}\n\n`;
        
        reportArea.innerHTML += `--- Módulo 2 (Escalas e Expansão) ---\n`;
        reportArea.innerHTML += `Q1: ${localStorage.getItem(prefix+'mod2_q1') || "-"}\n`;
        reportArea.innerHTML += `Q2: ${localStorage.getItem(prefix+'mod2_q2') || "-"}\n`;
        reportArea.innerHTML += `=================================================\n`;
    });
}

function clearData() {
    if(confirm("Deseja apagar todos os dados registrados?")) {
        localStorage.clear();
        window.location.reload();
    }
}