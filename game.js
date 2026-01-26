// CONFIGURACIÓN DE HISTORIA Y RETOS
const gameContent = {
    1: {
        ana: "¡Toño! El virus 404 borró los registros de GDL. Necesito que restaures el Catálogo de Modelos. No sabemos qué autos tenemos para vender.",
        teoria: "El comando SELECT es tu linterna. Úsalo para ver columnas. Ejemplo: SELECT nombre FROM tabla;",
        mision: "Selecciona todas las columnas de la tabla Dim_Modelos para identificar el inventario.",
        expected: "select * from dim_modelos",
        schema: "TABLA: Dim_Modelos<br>COLUMNAS: ModeloID, Nombre_Modelo, Marca, Precio_Lista"
    }
};

window.gameState = {
    xp: 0, coins: 0, module: 1, db: null
};

// INICIAR MOTOR
async function init() {
    const SQL = await initSqlJs({ locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${f}` });
    window.gameState.db = new SQL.Database();
    
    // Inyectar datos de Dalton (Semillero)
    window.gameState.db.run(`
        CREATE TABLE Dim_Modelos (ModeloID INT, Nombre_Modelo TEXT, Marca TEXT, Precio_Lista REAL);
        INSERT INTO Dim_Modelos VALUES (1, 'Hilux', 'Toyota', 550000), (2, 'CR-V', 'Honda', 720000);
    `);
    
    renderCurrentStep();
}

function renderCurrentStep() {
    const content = gameContent[window.gameState.module];
    document.getElementById('npcStory').innerText = content.ana;
    document.getElementById('sqlTheory').innerText = content.teoria;
    document.getElementById('table-schema').innerHTML = content.schema;
}

window.executeQuery = function() {
    const query = document.getElementById('sqlEditor').value.trim();
    
    if(!query.includes('--')) {
        alert("Ana: '¡Toño! Documenta tu código con -- o el virus nos detectará'.");
        return;
    }

    try {
        const res = window.gameState.db.exec(query);
        showResults(res);
        validate(query);
    } catch (e) {
        document.getElementById('results').innerHTML = `<p style="color:red">ERROR VIRUS 404: ${e.message}</p>`;
    }
}

function showResults(res) {
    const container = document.getElementById('results');
    if (res.length === 0) { container.innerHTML = "Sin datos."; return; }
    let html = "<table><thead><tr>";
    res[0].columns.forEach(c => html += `<th>${c}</th>`);
    html += "</tr></thead><tbody>";
    res[0].values.forEach(row => {
        html += "<tr>" + row.map(v => `<td>${v}</td>`).join('') + "</tr>";
    });
    container.innerHTML = html + "</tbody></table>";
}

function validate(query) {
    const goal = gameContent[window.gameState.module].expected;
    if (query.toLowerCase().includes(goal)) {
        confetti();
        alert("¡SISTEMA RESTAURADO! +100 XP");
        window.gameState.xp += 100;
        document.getElementById('playerXP').innerText = window.gameState.xp;
    }
}

init();
