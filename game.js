// ============================================================
// MOTOR DE JUEGO: DALTON COMMAND CENTER v2.0
// Creado para: Analista Toño | Enero 2026
// ============================================================

window.gameState = {
    playerName: 'Toño',
    avatar: '👨‍💻', // Aquí puedes cambiar el emoji del avatar en el futuro
    rank: 'Practicante de TI',
    xp: 0,
    coins: 0,
    currentModule: 1,
    currentStep: 1,
    db: null,
    soundEnabled: true
};

// --- BASE DE DATOS DALTON (Semillero de Datos) ---
const daltonSeed = `
    CREATE TABLE Dim_Modelos (ModeloID INT PRIMARY KEY, Nombre_Modelo TEXT, Marca TEXT, Tipo TEXT, Precio REAL);
    CREATE TABLE Dim_Clientes (ClienteID INT PRIMARY KEY, Empresa TEXT, Tipo_Persona TEXT, Credito_Limite REAL);
    CREATE TABLE Fact_Ventas (VentaID INT PRIMARY KEY, Fecha TEXT, ClienteID INT, ModeloID INT, Monto REAL);

    INSERT INTO Dim_Modelos VALUES (1, 'Hilux', 'Toyota', 'Pickup', 550000), (2, 'CR-V', 'Honda', 'SUV', 720000);
    INSERT INTO Dim_Clientes VALUES (501, 'Logística GDL', 'Moral', 2000000), (502, 'Constructora SLP', 'Moral', 5000000);
    INSERT INTO Fact_Ventas VALUES (101, '2026-01-20', 501, 1, 550000);
`;

// --- CONTENIDO NARRATIVO Y RETOS ---
// Si quieres agregar más misiones en el futuro, solo añade objetos aquí.
const daltonMissions = {
    1: {
        title: "📍 MISIÓN 1: EL DESPERTAR EN GDL",
        anaStory: "Toño, el virus 404 bloqueó el acceso visual. Necesito que restaures el Catálogo de Modelos para que los gerentes de GDL vean qué autos sobrevivieron.",
        theory: "El comando SELECT es tu llave maestra. Usa '*' para ver todo o escribe los nombres de las columnas separados por comas.",
        mision: "Misión: Recupera todas las columnas de la tabla 'Dim_Modelos'.",
        expected: "select * from dim_modelos",
        hint: "Escribe: SELECT * FROM Dim_Modelos;"
    }
};

// --- MOTOR DE EJECUCIÓN ---
async function initEngine() {
    const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` });
    window.gameState.db = new SQL.Database();
    window.gameState.db.run(daltonSeed);
    
    console.log("Sistema Dalton inicializado...");
    renderMission();
}

function renderMission() {
    const mission = daltonMissions[window.gameState.currentModule];
    document.getElementById('missionTitle').innerText = mission.title;
    document.getElementById('anaSpeech').innerText = mission.anaStory;
    document.getElementById('theoryText').innerText = mission.theory;
    document.getElementById('challengeText').innerText = mission.mision;
}

// Botón de Ejecutar
window.executeSQL = function() {
    const query = document.getElementById('sqlEditor').value.trim();
    
    // REGLA DE ANA: Comentarios obligatorios
    if (!query.includes('--')) {
        alert("ANA: 'Toño, por seguridad, ¡documenta tu código con -- antes de ejecutar!'");
        return;
    }

    try {
        const results = window.gameState.db.exec(query);
        displayTable(results);
        validateMission(query);
    } catch (e) {
        document.getElementById('resultsTable').innerHTML = `<p style="color: #ef4444;">⚠️ ERROR DE SISTEMA: ${e.message}</p>`;
    }
};

function displayTable(res) {
    const container = document.getElementById('resultsTable');
    if (!res.length) { container.innerHTML = "Consulta ejecutada. Sin resultados."; return; }
    
    let html = "<table><thead><tr>";
    res[0].columns.forEach(col => html += `<th>${col}</th>`);
    html += "</tr></thead><tbody>";
    res[0].values.forEach(row => {
        html += "<tr>" + row.map(v => `<td>${v}</td>`).join('') + "</tr>";
    });
    container.innerHTML = html + "</tbody></table>";
}

function validateMission(query) {
    const mission = daltonMissions[window.gameState.currentModule];
    // Limpiamos el query de espacios y comentarios para comparar
    const cleanQuery = query.toLowerCase().replace(/--.*$/gm, "").trim();
    
    if (cleanQuery.includes(mission.expected)) {
        confetti();
        alert("¡SISTEMA RESTAURADO! Ana: 'Excelente trabajo, Toño. GDL vuelve a la vida'.");
        window.gameState.xp += 100;
        document.getElementById('xpValue').innerText = window.gameState.xp;
    }
}

initEngine();
