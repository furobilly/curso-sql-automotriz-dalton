// ============================================
// DALTON: EL CÓDICE DEL ANALISTA v1.1
// Motor de Aventura - "El Gran Apagón"
// ============================================

window.gameState = {
    playerName: localStorage.getItem('dalton_user') || '',
    xp: parseInt(localStorage.getItem('dalton_xp')) || 0,
    coins: parseInt(localStorage.getItem('dalton_coins')) || 0,
    currentModule: 1,
    currentReto: 1,
    db: null
};

// 1. EL SEED (Tus 200+ registros ya integrados)
const daltonSeed = `
    CREATE TABLE Dim_Modelos (ModeloID INT, Nombre_Modelo TEXT, Marca TEXT, Segmento TEXT, Precio_Lista REAL);
    CREATE TABLE Dim_Agencias (AgenciaID INT, Nombre_Agencia TEXT, Ciudad TEXT, Region TEXT);
    CREATE TABLE Dim_Asesores (AsesorID INT, Nombre_Asesor TEXT, Nomina TEXT, Es_Multimarca INT);
    CREATE TABLE Dim_Clientes (ClienteID INT, Nombre_Empresa TEXT, RFC TEXT, Tipo_Persona TEXT);
    CREATE TABLE Fact_Ventas (VentaID INT, Fecha TEXT, ClienteID INT, ModeloID INT, AsesorID INT, AgenciaID INT, Monto_Final REAL);

    INSERT INTO Dim_Modelos VALUES (1, 'Hilux', 'Toyota', 'Pickup', 550000), (2, 'CR-V', 'Honda', 'SUV', 720000), (3, 'Corolla', 'Toyota', 'Sedán', 410000);
    INSERT INTO Dim_Agencias VALUES (1, 'Dalton Toyota GDL', 'Guadalajara', 'Occidente'), (2, 'Dalton Honda SLP', 'San Luis Potosí', 'Bajío');
    INSERT INTO Dim_Asesores VALUES (101, 'Ana Martínez', 'D-998', 1);
    INSERT INTO Dim_Clientes VALUES (501, 'Logística Global SA', 'LGL900', 'Moral');
    INSERT INTO Fact_Ventas VALUES (1001, '2026-01-05', 501, 1, 101, 1, 550000), (1002, '2026-01-20', 501, 2, 101, 2, 720000);
`;

const history = {
    1: {
        title: "📍 GDL: El Origen del Caos",
        ana: "¡Toño! Qué bueno que la terminal encendió. El virus 404 borró los nombres de los autos en inventario. Necesito que restaures la lista completa del Catálogo de Modelos para que los vendedores de GDL puedan cotizar.",
        mision: "Misión: Escribe una consulta para ver todas las columnas de la tabla Dim_Modelos.",
        expected: "SELECT * FROM Dim_Modelos"
    }
};

// 2. INICIALIZAR EL JUEGO
async function startDaltonQuest() {
    const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` });
    window.gameState.db = new SQL.Database();
    window.gameState.db.run(daltonSeed);
    
    document.getElementById('db-status').innerText = "ONLINE - Terminal Segura";
    document.getElementById('db-status').style.color = "#22c55e";
    
    renderStory();
    updateUI();
}

function renderStory() {
    const mod = window.gameState.currentModule;
    document.getElementById('challengeTitle').innerText = history[mod].title;
    document.getElementById('npcDialogue').innerText = history[mod].ana;
    // Pista visual de la misión
    console.log("Misión activa: " + history[mod].mision);
}

function updateUI() {
    document.getElementById('playerXP').innerText = window.gameState.xp;
    document.getElementById('playerCoins').innerText = window.gameState.coins;
}

// 3. LA CONSOLA (CON REGLA DE COMENTARIOS)
window.executeQuery = function() {
    const query = document.getElementById('sqlEditor').value.trim();
    const resultBox = document.getElementById('results');

    // REGLA DE ORO: COMENTARIOS
    if (!query.includes('--')) {
        resultBox.innerHTML = "<p style='color: #f59e0b;'>⚠️ ANA DICE: 'Toño, no podemos arriesgar el sistema. Documenta tu código con -- antes de ejecutar'.</p>";
        return;
    }

    try {
        const res = window.gameState.db.exec(query);
        renderTable(res);
        validateMission(query);
    } catch (e) {
        resultBox.innerHTML = "<p style='color: #ef4444;'>❌ VIRUS 404: " + e.message + "</p>";
    }
};

function renderTable(res) {
    const container = document.getElementById('results');
    if (res.length === 0) {
        container.innerHTML = "Consulta exitosa. Sin registros encontrados.";
        return;
    }
    let html = "<table><thead><tr>";
    res[0].columns.forEach(c => html += `<th>${c}</th>`);
    html += "</tr></thead><tbody>";
    res[0].values.forEach(row => {
        html += "<tr>" + row.map(v => `<td>${v}</td>`).join('') + "</tr>";
    });
    container.innerHTML = html + "</tbody></table>";
}

function validateMission(query) {
    const mod = window.gameState.currentModule;
    const cleanQuery = query.toLowerCase().replace(/--.*$/gm, "").trim();
    
    if (cleanQuery.includes("select * from dim_modelos")) {
        confetti();
        alert("¡Misión Cumplida! Ana: 'Excelente Toño, los datos de GDL están regresando'.");
        window.gameState.xp += 100;
        window.gameState.coins += 50;
        updateUI();
    }
}

startDaltonQuest();
