// ============================================
// DALTON: EL CÓDICE DEL ANALISTA v1.0
// Motor de Juego - Restauración Enero 2026
// ============================================

window.gameState = {
  playerName: '',
  xp: 0,
  coins: 0,
  currentChallenge: 1,
  currentSubExercise: 1,
  completedSubExercises: {},
  unlockedBadges: [],
  db: null,
  theme: 'dark',
  attempts: 0
};

// EL SEMILLERO DE DATOS (Lo que Ana rescató del servidor)
const dbSeed = `
  CREATE TABLE Dim_Modelos (ModeloID INT, Nombre_Modelo TEXT, Marca TEXT, Precio_Lista REAL);
  CREATE TABLE Dim_Agencias (AgenciaID INT, Nombre_Agencia TEXT, Ciudad TEXT);
  CREATE TABLE Dim_Clientes (ClienteID INT, Nombre_Empresa TEXT, Tipo_Persona TEXT);
  CREATE TABLE Fact_Ventas (VentaID INT, Fecha TEXT, ClienteID INT, ModeloID INT, AgenciaID INT, Monto_Final REAL);

  INSERT INTO Dim_Modelos VALUES (1, 'Hilux', 'Toyota', 550000), (2, 'CR-V', 'Honda', 720000), (3, 'Corolla', 'Toyota', 410000);
  INSERT INTO Dim_Agencias VALUES (1, 'Dalton Toyota GDL', 'Guadalajara'), (2, 'Dalton Honda SLP', 'San Luis Potosí');
  INSERT INTO Dim_Clientes VALUES (501, 'Logística Global SA', 'Moral'), (502, 'Constructora Bajío', 'Moral');
  INSERT INTO Fact_Ventas VALUES (1001, '2026-01-05', 501, 1, 1, 550000), (1002, '2026-01-20', 502, 2, 2, 720000);
`;

const challenges = {
  1: {
    title: 'El Gran Apagón: Primeros Pasos',
    concept: '<strong>Ana:</strong> "Toño, las tablas están corruptas. Usa <code>SELECT</code> para ver qué queda en el catálogo."',
    subExercises: [
      { id: 1, desc: 'Ver todos los modelos', expected: 'SELECT * FROM Dim_Modelos', hint: 'Usa SELECT * FROM Dim_Modelos;' },
      { id: 2, desc: 'Ver solo nombres de modelos', expected: 'SELECT Nombre_Modelo FROM Dim_Modelos', hint: 'SELECT Nombre_Modelo FROM ...' }
    ],
    xp: 50, coins: 100
  }
};

// INICIALIZACIÓN DEL MOTOR
async function initGame() {
  const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` });
  window.gameState.db = new SQL.Database();
  window.gameState.db.run(dbSeed);
  console.log("Servidor Dalton en línea. Esperando órdenes...");
}

// EJECUTAR SQL CON VALIDACIÓN DE COMENTARIOS
window.executeQuery = function() {
  const query = document.getElementById('sqlEditor').value.trim();
  
  // Regla de Ana: Comentarios obligatorios
  if (!query.includes('--')) {
    alert("Ana dice: 'Toño, un buen analista siempre documenta con -- sus consultas'");
    return;
  }

  try {
    const results = window.gameState.db.exec(query);
    renderResults(results);
    checkMission(query);
  } catch (e) {
    alert("Virus 404 detectado: " + e.message);
  }
};

function renderResults(res) {
  const container = document.getElementById('results');
  if (!res || res.length === 0) {
    container.innerHTML = "Consulta ejecutada. Sin datos.";
    return;
  }
  let html = "<table><thead><tr>";
  res[0].columns.forEach(col => html += `<th>${col}</th>`);
  html += "</tr></thead><tbody>";
  res[0].values.forEach(row => {
    html += "<tr>" + row.map(v => `<td>${v}</td>`).join('') + "</tr>";
  });
  container.innerHTML = html + "</tbody></table>";
}

function checkMission(query) {
  // Aquí irá la lógica para comparar con el "expected" del reto
  console.log("Validando misión...");
}

initGame();
