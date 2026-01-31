// ============================================
// NEXUS SQL v1.3 - MÓDULO 1 COMPLETO
// Nuevo: Ejercicios 1.5-1.10 + Boss Final + Trivia
// ============================================

// Sistema de usuarios múltiples
window.userProfiles = JSON.parse(localStorage.getItem('nexusSQL_users') || '[]');
window.currentUserIndex = parseInt(localStorage.getItem('nexusSQL_currentUser') || '-1');

window.gameState = {
  playerName: '',
  avatar: 0,
  xp: 0,
  coins: 0,
  streak: 0,
  lastVisit: null,
  currentChallenge: 1,
  currentSubExercise: 1,
  currentDay: 1,
  completedChallenges: [],
  completedSubExercises: {},
  unlockedBadges: [],
  reputation: { ana: 0, roberto: 0 },
  favorites: [],
  diary: [],
  usedContinuitySpell: false,
  attempts: 0,
  exampleUnlocked: false,
  practiceMode: false,
  soundEnabled: true,
  theme: 'dark',
  db: null,
  skills: { SELECT: 0, WHERE: 0, ORDER: 0, ADVANCED: 0 },
  expandedChallenges: [],
  tutorialsSeen: [],
  triviaAnswered: false
};

const allBadges = [
  { id: 'primera', name: 'Primera Consulta', icon: '🛡️', desc: 'Completar ejercicio 1.1' },
  { id: 'glitch', name: 'Cazador de Duplicados', icon: '⚡', desc: 'Completar GLITCH 1.4' },
  { id: 'domador', name: 'Domador de WHERE', icon: '⚔️', desc: 'Completar ejercicio 1.7' },
  { id: 'between', name: 'Maestro del Rango', icon: '📊', desc: 'Completar ERROR DE NODO 1.9' },
  { id: 'boss1', name: 'Vencedor de Roberto', icon: '👑', desc: 'Completar Boss Final Módulo 1' },
  { id: 'mundo1', name: 'Salvador de GDL', icon: '🏆', desc: '100% Módulo 1' }
];

const dbSeed = `
  CREATE TABLE T_Inventario_GDL (
    C_VIN TEXT PRIMARY KEY,
    C_Marca TEXT,
    C_Modelo TEXT,
    C_Anio INTEGER,
    C_Color TEXT,
    C_Precio INTEGER,
    C_Stock INTEGER
  );
  
  INSERT INTO T_Inventario_GDL VALUES
  ('VIN001TY', 'Toyota', 'Hilux', 2024, 'Gris', 650000, 5),
  ('VIN002TY', 'Toyota', 'Corolla', 2024, 'Blanco', 450000, 8),
  ('VIN003BY', 'BYD', 'Seal', 2024, 'Azul', 550000, 3),
  ('VIN004TY', 'Toyota', 'RAV4', 2024, 'Negro', 700000, 2),
  ('VIN005BY', 'BYD', 'Han', 2024, 'Rojo', 580000, 4),
  ('VIN006TY', 'Toyota', 'Camry', 2024, 'Plata', 520000, 6),
  ('VIN007BY', 'BYD', 'Dolphin', 2024, 'Verde', 380000, 10),
  ('VIN008TY', 'Toyota', 'Tacoma', 2024, 'Azul', 720000, 3),
  ('VIN009BY', 'BYD', 'Atto3', 2024, 'Blanco', 490000, 7),
  ('VIN010TY', 'Toyota', 'Highlander', 2024, 'Negro', 850000, 2),
  ('VIN011TY', 'Toyota', 'Hilander', 2024, 'Gris', 420000, 4);
  
  CREATE TABLE T_Clientes_GDL (
    C_ID_Cliente INTEGER PRIMARY KEY,
    C_Nombre_Completo TEXT,
    C_Correo TEXT,
    C_Telefono TEXT,
    C_Ciudad_Registro TEXT
  );
  
  INSERT INTO T_Clientes_GDL VALUES
  (1, 'Roberto Martínez', 'roberto@velocity.com', '3331234567', 'Guadalajara'),
  (2, 'María González', 'maria@gmail.com', '3339876543', 'Guadalajara'),
  (3, 'Carlos López', 'carlos@hotmail.com', '3335555555', 'Zapopan'),
  (4, 'Ana Rodríguez', 'ana.r@outlook.com', '3338888888', 'Guadalajara'),
  (5, 'Luis Hernández', 'luis.h@yahoo.com', '3337777777', 'Tlaquepaque');

  CREATE TABLE T_Ventas_GDL (
    C_ID_Venta INTEGER PRIMARY KEY,
    C_VIN TEXT,
    C_Fecha DATE,
    C_Metodo_Pago TEXT
  );

  INSERT INTO T_Ventas_GDL VALUES
  (1, 'VIN001TY', '2024-01-15', 'Efectivo'),
  (2, 'VIN003BY', '2024-01-20', NULL),
  (3, 'VIN005BY', '2024-01-22', 'Crédito'),
  (4, 'VIN007BY', '2024-01-25', NULL);
`;

const sqlTutorials = {
  1: {
    title: 'SELECT y FROM',
    content: `
<h2>📚 LECCIÓN: SELECT y FROM</h2>
<div style="background: rgba(0, 217, 255, 0.1); padding: 20px; border-radius: 8px; margin: 15px 0; border: 2px solid var(--primary);">
  <h3>🎯 ¿Qué hacen?</h3>
  <p><strong>SELECT</strong> elige QUÉ columnas quieres ver<br>
  <strong>FROM</strong> indica DE QUÉ tabla sacar los datos</p>
</div>
<div style="background: rgba(245, 158, 11, 0.1); padding: 20px; border-radius: 8px; margin: 15px 0; border: 2px solid var(--accent);">
  <h3>📖 ESTRUCTURA BÁSICA:</h3>
  <pre style="background: #0d1117; color: #00ff41; padding: 15px; border-radius: 8px; border: 1px solid var(--primary);">
SELECT columna1, columna2
FROM nombre_tabla;</pre>
</div>
<div style="background: rgba(0, 217, 255, 0.1); padding: 20px; border-radius: 8px; margin: 15px 0; border: 2px solid var(--primary);">
  <h3>🔑 REGLAS IMPORTANTES:</h3>
  <p>1️⃣ Las columnas se separan con <strong>comas (,)</strong><br>
  2️⃣ La consulta termina con <strong>punto y coma (;)</strong><br>
  3️⃣ Usa <strong>*</strong> para seleccionar TODAS las columnas<br>
  4️⃣ SQL no distingue mayúsculas/minúsculas</p>
</div>
<div style="background: rgba(245, 158, 11, 0.1); padding: 20px; border-radius: 8px; margin: 15px 0; border: 2px solid var(--accent);">
  <h3>✏️ EJEMPLOS:</h3>
  <p><strong>Ejemplo 1:</strong> Solo una columna</p>
  <pre style="background: #0d1117; color: #00ff41; padding: 15px; border-radius: 8px; border: 1px solid var(--primary);">
SELECT C_Modelo
FROM T_Inventario_GDL;</pre>
  
  <p style="margin-top: 15px;"><strong>Ejemplo 2:</strong> Dos columnas (nota la coma)</p>
  <pre style="background: #0d1117; color: #00ff41; padding: 15px; border-radius: 8px; border: 1px solid var(--primary);">
SELECT C_Modelo, C_Marca
FROM T_Inventario_GDL;
           ↑
      Coma separa columnas</pre>
  
  <p style="margin-top: 15px;"><strong>Ejemplo 3:</strong> Todas las columnas</p>
  <pre style="background: #0d1117; color: #00ff41; padding: 15px; border-radius: 8px; border: 1px solid var(--primary);">
SELECT *
FROM T_Inventario_GDL;</pre>
</div>
`
  }
};

const sounds = {
  click: () => {
    if (!window.gameState.soundEnabled) return;
    try {
      const audio = new AudioContext();
      const oscillator = audio.createOscillator();
      const gainNode = audio.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audio.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audio.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.1);
      oscillator.start(audio.currentTime);
      oscillator.stop(audio.currentTime + 0.1);
    } catch(e) {}
  },
  success: () => {
    if (!window.gameState.soundEnabled) return;
    try {
      const audio = new AudioContext();
      [523, 659, 784].forEach((freq, i) => {
        const oscillator = audio.createOscillator();
        const gainNode = audio.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audio.destination);
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audio.currentTime + i * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + i * 0.1 + 0.2);
        oscillator.start(audio.currentTime + i * 0.1);
        oscillator.stop(audio.currentTime + i * 0.1 + 0.2);
      });
    } catch(e) {}
  },
  error: () => {
    if (!window.gameState.soundEnabled) return;
    try {
      const audio = new AudioContext();
      const oscillator = audio.createOscillator();
      const gainNode = audio.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audio.destination);
      oscillator.frequency.value = 200;
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.15, audio.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.3);
      oscillator.start(audio.currentTime);
      oscillator.stop(audio.currentTime + 0.3);
    } catch(e) {}
  },
  coin: () => {
    if (!window.gameState.soundEnabled) return;
    try {
      const audio = new AudioContext();
      const oscillator = audio.createOscillator();
      const gainNode = audio.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audio.destination);
      oscillator.frequency.value = 1200;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audio.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.15);
      oscillator.start(audio.currentTime);
      oscillator.stop(audio.currentTime + 0.15);
    } catch(e) {}
  }
};

// Animación de monedas cayendo
function createCoinRain(amount) {
  const container = document.createElement('div');
  container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;';
  document.body.appendChild(container);
  
  for (let i = 0; i < 30; i++) {
    const coin = document.createElement('div');
    coin.textContent = '🪙';
    coin.style.cssText = `
      position: absolute;
      font-size: 32px;
      left: ${Math.random() * 100}%;
      top: -50px;
      animation: coinFall ${2 + Math.random() * 2}s ease-in forwards;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    container.appendChild(coin);
    
    setTimeout(() => sounds.coin(), i * 50);
  }
  
  const message = document.createElement('div');
  message.textContent = `💰 +${amount} VC`;
  message.style.cssText = `
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 48px;
    font-weight: bold;
    color: var(--accent);
    text-shadow: 0 0 20px var(--accent);
    animation: floatUp 2s ease-out forwards;
  `;
  container.appendChild(message);
  
  setTimeout(() => container.remove(), 4000);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes coinFall {
    to {
      top: 110%;
      transform: rotate(720deg);
    }
  }
  @keyframes floatUp {
    0% { opacity: 0; transform: translateX(-50%) translateY(0); }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; transform: translateX(-50%) translateY(-100px); }
  }
`;
document.head.appendChild(style);

window.toggleTheme = function() {
  sounds.click();
  const current = window.gameState.theme;
  const newTheme = current === 'light' ? 'dark' : 'light';
  window.gameState.theme = newTheme;
  document.documentElement.setAttribute('data-theme', newTheme);
  document.getElementById('themeToggle').textContent = newTheme === 'light' ? '☀️' : '🌙';
  saveGameState();
};

window.toggleSound = function() {
  window.gameState.soundEnabled = !window.gameState.soundEnabled;
  document.getElementById('soundToggle').textContent = window.gameState.soundEnabled ? '🔊' : '🔇';
  if (window.gameState.soundEnabled) sounds.click();
  saveGameState();
};

window.logoutUser = function() {
  sounds.click();
  if (confirm('¿Deseas cambiar de usuario? Tu progreso está guardado.')) {
    window.currentUserIndex = -1;
    localStorage.setItem('nexusSQL_currentUser', '-1');
    location.reload();
  }
};

window.switchUser = function(index) {
  sounds.click();
  window.currentUserIndex = index;
  localStorage.setItem('nexusSQL_currentUser', index);
  
  loadUserProfile(index);
  
  closeModal('modalGeneric');
  document.getElementById('onboarding').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
  
  renderGame();
  createParticles();
  updateAvatars();
  
  updateStats();
  renderChallenges();
  updateProgressBar();
  updateSkillBars();
};

window.deleteUser = function(index) {
  if (confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) {
    window.userProfiles.splice(index, 1);
    localStorage.setItem('nexusSQL_users', JSON.stringify(window.userProfiles));
    showUserSelection();
  }
};

function showUserSelection() {
  if (window.userProfiles.length === 0) {
    startOnboarding();
    return;
  }
  
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = '<h2>👥 Selecciona Usuario</h2><div style="margin: 20px 0;">';
  
  window.userProfiles.forEach((user, index) => {
    const avatars = ['🎮', '💼', '🧘'];
    content.innerHTML += `
      <div style="background: var(--card); padding: 20px; margin: 15px 0; border-radius: 12px; border: 2px solid var(--primary); display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <span style="font-size: 48px;">${avatars[user.avatar]}</span>
          <div>
            <div style="font-size: 20px; font-weight: bold;">${user.playerName}</div>
            <div style="font-size: 14px; color: var(--muted);">⭐ ${user.xp} XP | 🪙 ${user.coins} VC</div>
          </div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn" onclick="switchUser(${index})">▶️ Jugar</button>
          <button class="btn btn-ghost" onclick="deleteUser(${index})" style="background: var(--danger);">🗑️</button>
        </div>
      </div>
    `;
  });
  
  if (window.userProfiles.length < 3) {
    content.innerHTML += `<button class="btn btn-secondary" onclick="closeModal('modalGeneric'); startOnboarding();" style="width: 100%; margin-top: 20px;">➕ Crear Nuevo Usuario</button>`;
  } else {
    content.innerHTML += `<p style="color: var(--muted); text-align: center; margin-top: 20px;">Máximo 3 usuarios. Elimina uno para crear otro.</p>`;
  }
  
  content.innerHTML += '</div>';
  document.getElementById('modalGeneric').classList.add('active');
}

function loadUserProfile(index) {
  const user = window.userProfiles[index];
  
  window.gameState.playerName = user.playerName;
  window.gameState.avatar = user.avatar;
  window.gameState.xp = user.xp;
  window.gameState.coins = user.coins;
  window.gameState.streak = user.streak;
  window.gameState.currentChallenge = user.currentChallenge;
  window.gameState.currentSubExercise = user.currentSubExercise;
  window.gameState.currentDay = user.currentDay;
  window.gameState.completedChallenges = user.completedChallenges || [];
  window.gameState.completedSubExercises = user.completedSubExercises || {};
  window.gameState.unlockedBadges = user.unlockedBadges || [];
  window.gameState.reputation = user.reputation || { ana: 0, roberto: 0 };
  window.gameState.diary = user.diary || [];
  window.gameState.skills = user.skills || { SELECT: 0, WHERE: 0, ORDER: 0, ADVANCED: 0 };
  window.gameState.expandedChallenges = user.expandedChallenges || [];
  window.gameState.tutorialsSeen = user.tutorialsSeen || [];
  window.gameState.theme = user.theme || 'dark';
  window.gameState.soundEnabled = user.soundEnabled !== false;
  window.gameState.triviaAnswered = user.triviaAnswered || false;
  
  if (window.SQL_CONSTRUCTOR) {
    window.gameState.db = new window.SQL_CONSTRUCTOR.Database();
    window.gameState.db.run(dbSeed);
  }
  
  document.documentElement.setAttribute('data-theme', window.gameState.theme);
  document.getElementById('themeToggle').textContent = window.gameState.theme === 'light' ? '☀️' : '🌙';
  document.getElementById('soundToggle').textContent = window.gameState.soundEnabled ? '🔊' : '🔇';
}

function saveUserProfile() {
  if (window.currentUserIndex >= 0) {
    window.userProfiles[window.currentUserIndex] = Object.assign({}, window.gameState);
    delete window.userProfiles[window.currentUserIndex].db;
    localStorage.setItem('nexusSQL_users', JSON.stringify(window.userProfiles));
  }
}

async function init() {
  const loadingTexts = [
    'Detectando virus The Void...',
    'Restaurando nodos del sistema...',
    'Inicializando terminal NEXUS...',
    'Preparando misión de rescate...'
  ];
  
  let textIndex = 0;
  const textInterval = setInterval(() => {
    const elem = document.getElementById('loadingText');
    if (elem) elem.textContent = loadingTexts[textIndex];
    textIndex = (textIndex + 1) % loadingTexts.length;
  }, 800);

  try {
    await initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    }).then(SQL => {
      window.SQL_CONSTRUCTOR = SQL;
      window.gameState.db = new SQL.Database();
      window.gameState.db.run(dbSeed);
      
      clearInterval(textInterval);
      
      setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
        
        if (window.currentUserIndex >= 0 && window.userProfiles[window.currentUserIndex]) {
          loadUserProfile(window.currentUserIndex);
          document.getElementById('mainApp').classList.remove('hidden');
          renderGame();
          createParticles();
          updateAvatars();
          document.documentElement.setAttribute('data-theme', window.gameState.theme);
          document.getElementById('themeToggle').textContent = window.gameState.theme === 'light' ? '☀️' : '🌙';
          document.getElementById('soundToggle').textContent = window.gameState.soundEnabled ? '🔊' : '🔇';
        } else {
          showUserSelection();
        }
      }, 3000);
    });
  } catch (e) {
    clearInterval(textInterval);
    alert('Error cargando SQL: ' + e.message);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function saveGameState() {
  saveUserProfile();
}

const narrativeDialogues = {
  1: {
    1: () => `Roberto (GDL): "¡${window.gameState.playerName}! El virus bloqueó el sistema. Necesito los NOMBRES de todos los clientes. ¡RÁPIDO!"`,
    2: () => `Roberto: "Bien. Ahora dame MODELO y VIN. Tengo que validar los números de serie."`,
    3: () => `Roberto: "Perfecto. Ahora el PRECIO pero renombrado como M_Precio_Lista. Es para el reporte."`,
    4: () => `Roberto: "⚠️ GLITCH DETECTADO: El servidor duplica marcas. Usa DISTINCT para ver solo las únicas."`,
    5: () => `Roberto: "Necesito SOLO los autos BYD. Filtra por marca = 'BYD'."`,
    6: () => `Roberto: "Ahora trae autos con precio MAYOR a 600,000. Los clientes VIP están esperando."`,
    7: () => `Roberto: "Busco UN auto específico: Toyota Y color Gris. Usa AND."`,
    8: () => `Roberto: "⚠️ ERROR DE NODO: Precios inestables. Trae autos entre 350,000 y 550,000 con BETWEEN."`,
    9: () => `Roberto: "Alguien escribió mal 'Hilux'. Busca modelos que empiecen con 'Hi' usando LIKE 'Hi%'."`,
    10: () => `Roberto: "El virus borró datos de pagos. Encuentra ventas donde C_Metodo_Pago sea NULL."`
  }
};

const challenges = {
  1: {
    title: 'Restauración de Nodo GDL',
    concept: '<strong>📜 SELECT, WHERE, ORDER BY</strong><br><br>Extrae, filtra y ordena datos del servidor.<br><code>SELECT C_Modelo FROM T_Inventario_GDL WHERE C_Precio > 500000;</code>',
    subExercises: [
      { id: 1, desc: '📋 Listado de Clientes', expected: 'SELECT C_Nombre_Completo FROM T_Clientes_GDL', hint: 'SELECT C_Nombre_Completo FROM T_Clientes_GDL;', example: 'SELECT C_Correo FROM T_Clientes_GDL;' },
      { id: 2, desc: '🚗 Identificación de Unidades', expected: 'SELECT C_Modelo, C_VIN FROM T_Inventario_GDL', hint: 'SELECT C_Modelo, C_VIN FROM T_Inventario_GDL;', example: 'SELECT C_Marca, C_Color FROM T_Inventario_GDL;' },
      { id: 3, desc: '💰 Etiquetado Profesional', expected: 'SELECT C_Precio AS M_Precio_Lista FROM T_Inventario_GDL', hint: 'SELECT C_Precio AS M_Precio_Lista FROM T_Inventario_GDL;', example: 'SELECT C_Marca AS Fabricante FROM T_Inventario_GDL;' },
      { id: 4, desc: '⚠️ GLITCH: Marcas Únicas', expected: 'SELECT DISTINCT C_Marca FROM T_Inventario_GDL', hint: 'SELECT DISTINCT C_Marca FROM T_Inventario_GDL;', example: 'SELECT DISTINCT C_Color FROM T_Inventario_GDL;' },
      { id: 5, desc: '🔋 Filtro BYD', expected: "SELECT * FROM T_Inventario_GDL WHERE C_Marca = 'BYD'", hint: "SELECT * FROM T_Inventario_GDL WHERE C_Marca = 'BYD';", example: "SELECT * FROM T_Inventario_GDL WHERE C_Marca = 'Toyota';" },
      { id: 6, desc: '💎 Poder Adquisitivo', expected: 'SELECT * FROM T_Inventario_GDL WHERE C_Precio > 600000', hint: 'SELECT * FROM T_Inventario_GDL WHERE C_Precio > 600000;', example: 'SELECT * FROM T_Inventario_GDL WHERE C_Precio > 500000;' },
      { id: 7, desc: '🎯 Doble Validación', expected: "SELECT * FROM T_Inventario_GDL WHERE C_Marca = 'Toyota' AND C_Color = 'Gris'", hint: "SELECT * FROM T_Inventario_GDL WHERE C_Marca = 'Toyota' AND C_Color = 'Gris';", example: "SELECT * FROM T_Inventario_GDL WHERE C_Marca = 'BYD' AND C_Stock > 5;" },
      { id: 8, desc: '⚠️ ERROR: BETWEEN', expected: 'SELECT * FROM T_Inventario_GDL WHERE C_Precio BETWEEN 350000 AND 550000', hint: 'SELECT * FROM T_Inventario_GDL WHERE C_Precio BETWEEN 350000 AND 550000;', example: 'SELECT * FROM T_Inventario_GDL WHERE C_Precio BETWEEN 400000 AND 600000;' },
      { id: 9, desc: '🔍 Búsqueda por Patrón', expected: "SELECT * FROM T_Inventario_GDL WHERE C_Modelo LIKE 'Hi%'", hint: "SELECT * FROM T_Inventario_GDL WHERE C_Modelo LIKE 'Hi%';", example: "SELECT * FROM T_Inventario_GDL WHERE C_Modelo LIKE 'C%';" },
      { id: 10, desc: '🕳️ Auditoría de Vacíos', expected: 'SELECT * FROM T_Ventas_GDL WHERE C_Metodo_Pago IS NULL', hint: 'SELECT * FROM T_Ventas_GDL WHERE C_Metodo_Pago IS NULL;', example: 'SELECT * FROM T_Clientes_GDL WHERE C_Telefono IS NULL;' }
    ],
    xp: 100, coins: 1000, difficulty: 1, skill: 'SELECT',
    diaryEntry: 'Día 1: Salvé el nodo de GDL. Roberto puede despachar las unidades.',
    hasTutorial: true,
    hasTrivia: true,
    hasBoss: true
  }
};

function showTutorial(challengeId) {
  const tutorial = sqlTutorials[challengeId];
  if (!tutorial || window.gameState.tutorialsSeen.includes(challengeId)) return;
  
  const modal = document.getElementById('modalGeneric');
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = tutorial.content + `<button class="btn" onclick="closeTutorial(${challengeId})" style="width: 100%; margin-top: 20px; font-size: 18px;">¡Entendido! Comenzar ejercicios</button>`;
  modal.classList.add('active');
  sounds.click();
}

window.closeTutorial = function(challengeId) {
  window.gameState.tutorialsSeen.push(challengeId);
  saveGameState();
  closeModal('modalGeneric');
};

function startOnboarding() {
  if (window.userProfiles.length >= 3) {
    alert('Máximo 3 usuarios. Elimina uno primero.');
    showUserSelection();
    return;
  }
  document.getElementById('onboarding').classList.remove('hidden');
  showOnboardingStep(1);
}

function showOnboardingStep(step) {
  const content = document.getElementById('onboardingContent');
  
  if (step === 1) {
    content.innerHTML = `
      <div class="logo-animation">
        <svg viewBox="0 0 200 200" style="width: 100%; height: 100%;">
          <circle cx="100" cy="100" r="80" fill="none" stroke="var(--primary)" stroke-width="4"/>
          <text x="100" y="110" text-anchor="middle" font-size="48" fill="var(--primary)">⚡</text>
        </svg>
      </div>
      <h1 style="font-size: 32px; color: var(--primary); margin-bottom: 20px;">NEXUS SQL</h1>
      <p style="font-size: 18px; color: var(--text); margin-bottom: 10px;">Protocolo de Emergencia</p>
      <p style="font-size: 14px; color: var(--muted); margin-bottom: 30px;">v1.3 - Módulo 1 Completo</p>
      <button class="btn" onclick="showOnboardingStep(2)" style="font-size: 18px; padding: 16px 32px;">⚡ Iniciar Protocolo</button>
    `;
  } else if (step === 2) {
    content.innerHTML = `
      <h2 style="color: var(--primary); margin-bottom: 20px;">Identificación de Operador</h2>
      <input type="text" id="nameInput" class="input-name" placeholder="Ingresa tu nombre (3-15 caracteres)" maxlength="15">
      <button class="btn" onclick="saveName()" style="width: 100%; margin-top: 20px;">Continuar</button>
    `;
    setTimeout(() => document.getElementById('nameInput').focus(), 100);
  } else if (step === 3) {
    content.innerHTML = `
      <h2 style="color: var(--primary); margin-bottom: 20px;">Elige tu Kit de Inicio</h2>
      <div class="avatar-selector">
        <div class="avatar-card active" onclick="selectAvatar(0)">
          <div class="avatar-icon">🎮</div>
          <div style="font-size: 14px; font-weight: bold;">Kit Gamer</div>
          <div style="font-size: 11px; margin-top: 5px; opacity: 0.8;">RGB Master</div>
        </div>
        <div class="avatar-card" onclick="selectAvatar(1)">
          <div class="avatar-icon">💼</div>
          <div style="font-size: 14px; font-weight: bold;">Kit Ejecutivo</div>
          <div style="font-size: 11px; margin-top: 5px; opacity: 0.8;">The Boss</div>
        </div>
        <div class="avatar-card" onclick="selectAvatar(2)">
          <div class="avatar-icon">🧘</div>
          <div style="font-size: 14px; font-weight: bold;">Kit Zen</div>
          <div style="font-size: 11px; margin-top: 5px; opacity: 0.8;">Minimalista</div>
        </div>
      </div>
      <button class="btn" onclick="showOnboardingStep(4)" style="width: 100%; margin-top: 20px;">Continuar</button>
    `;
  } else if (step === 4) {
    content.innerHTML = `
      <div style="text-align: left;">
        <h2 style="color: var(--primary); text-align: center; margin-bottom: 20px;">⚡ ALERTA CRÍTICA</h2>
        <div style="background: rgba(239, 68, 68, 0.2); border-left: 4px solid var(--danger); padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 2px solid var(--danger);">
          <p style="font-size: 15px; line-height: 1.6; font-style: italic;">"El virus 'The Void' ha bloqueado todas las interfaces visuales. Los datos están ahí, pero están 'ciegos'. Si no los recuperamos usando consultas directas al servidor, Grupo Velocity declarará la quiebra mañana. No hay tiempo para manuales: o aprendes SQL hoy, o buscamos trabajo los dos mañana." - <strong>Ing. Ana</strong></p>
        </div>
        <button class="btn" onclick="startAdventure()" style="width: 100%; font-size: 18px;">⚡ ¡Acepto la Misión!</button>
      </div>
    `;
  }
}

window.saveName = function() {
  sounds.click();
  const name = document.getElementById('nameInput').value.trim();
  if (name.length < 3 || name.length > 15) {
    sounds.error();
    alert('El nombre debe tener entre 3 y 15 caracteres');
    return;
  }
  window.gameState.playerName = name;
  showOnboardingStep(3);
};

window.selectAvatar = function(index) {
  sounds.click();
  window.gameState.avatar = index;
  document.querySelectorAll('.avatar-card').forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });
};

window.startAdventure = function() {
  sounds.success();
  window.gameState.lastVisit = new Date().toISOString();
  window.gameState.currentDay = 1;
  window.gameState.diary.push({ day: 0, entry: 'Acepté la misión. Grupo Velocity depende de mí.' });
  
  for (let i = 1; i <= 10; i++) {
    window.gameState.completedSubExercises[i] = [];
  }
  
  window.userProfiles.push(Object.assign({}, window.gameState));
  window.currentUserIndex = window.userProfiles.length - 1;
  localStorage.setItem('nexusSQL_users', JSON.stringify(window.userProfiles));
  localStorage.setItem('nexusSQL_currentUser', window.currentUserIndex);
  
  document.getElementById('onboarding').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
  renderGame();
  createParticles();
  updateAvatars();
};

function createParticles() {
  const container = document.getElementById('particles');
  container.innerHTML = '';
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    container.appendChild(particle);
  }
}

function updateAvatars() {
  const avatars = ['🎮', '💼', '🧘'];
  const selected = avatars[window.gameState.avatar];
  const headerAvatar = document.getElementById('headerAvatar');
  const panelAvatar = document.getElementById('panelAvatar');
  if (headerAvatar) headerAvatar.textContent = selected;
  if (panelAvatar) panelAvatar.textContent = selected;
}

function renderGame() {
  updateStats();
  renderChallenges();
  loadChallenge(window.gameState.currentChallenge, window.gameState.currentSubExercise);
  updateProgressBar();
  updateSkillBars();
}

function updateStats() {
  document.getElementById('playerName').textContent = window.gameState.playerName || 'Operador';
  document.getElementById('playerNamePanel').textContent = window.gameState.playerName || 'Operador';
  document.getElementById('playerXP').textContent = window.gameState.xp;
  document.getElementById('playerCoins').textContent = window.gameState.coins;
  document.getElementById('playerStreak').textContent = window.gameState.streak;
}

function renderChallenges() {
  const list = document.getElementById('challengeList');
  list.innerHTML = '';
  
  for (let i = 1; i <= 1; i++) {
    const challenge = challenges[i];
    const completedSubs = window.gameState.completedSubExercises[i] || [];
    const isFullyCompleted = completedSubs.length === 10;
    const isCurrent = window.gameState.currentChallenge === i;
    const isExpanded = window.gameState.expandedChallenges.includes(i);
    
    const div = document.createElement('div');
    div.className = `challenge-item ${isCurrent ? 'active' : ''} ${isFullyCompleted ? 'completed' : ''} ${isExpanded ? 'expanded' : ''}`;
    
    let subExercisesHTML = '';
    if (isExpanded) {
      subExercisesHTML = '<div class="sub-exercises">';
      challenge.subExercises.forEach((sub) => {
        const subCompleted = completedSubs.includes(sub.id);
        const subCurrent = isCurrent && window.gameState.currentSubExercise === sub.id;
        subExercisesHTML += `<div class="sub-exercise ${subCompleted ? 'completed' : ''} ${subCurrent ? 'active' : ''}" onclick="loadSubExercise(${i}, ${sub.id}); event.stopPropagation();">${i}.${sub.id} ${sub.desc} ${subCompleted ? '✓' : ''}</div>`;
      });
      subExercisesHTML += '</div>';
    }
    
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between;">
        <div style="font-weight: bold;">${isExpanded ? '▼' : '▶'} ${i}. ${challenge.title}</div>
        <div style="font-size: 11px;">[${completedSubs.length}/10]</div>
      </div>
      <div style="font-size: 12px; margin-top: 4px;">${'⭐'.repeat(challenge.difficulty)}</div>
      ${subExercisesHTML}
    `;
    
    div.onclick = function(e) {
      if (e.target.classList.contains('sub-exercise')) return;
      sounds.click();
      toggleChallengeExpansion(i);
    };
    
    list.appendChild(div);
  }
}

function toggleChallengeExpansion(challengeId) {
  const index = window.gameState.expandedChallenges.indexOf(challengeId);
  if (index > -1) {
    window.gameState.expandedChallenges.splice(index, 1);
  } else {
    window.gameState.expandedChallenges.push(challengeId);
  }
  saveGameState();
  renderChallenges();
}

window.loadSubExercise = function(challengeId, subExerciseId) {
  sounds.click();
  window.gameState.currentChallenge = challengeId;
  window.gameState.currentSubExercise = subExerciseId;
  
  const completedSubs = window.gameState.completedSubExercises[challengeId] || [];
  window.gameState.practiceMode = completedSubs.includes(subExerciseId);
  
  saveGameState();
  renderChallenges();
  loadChallenge(challengeId, subExerciseId);
};

function loadChallenge(challengeId, subExerciseId) {
  const challenge = challenges[challengeId];
  
  if (challenge.hasTutorial && subExerciseId === 1 && !window.gameState.tutorialsSeen.includes(challengeId)) {
    showTutorial(challengeId);
  }
  
  const subExercise = challenge.subExercises.find(s => s.id === subExerciseId);
  const narrative = narrativeDialogues[challengeId] && narrativeDialogues[challengeId][subExerciseId] 
    ? narrativeDialogues[challengeId][subExerciseId]() 
    : null;
  
  const banner = document.getElementById('practiceBanner');
  const dayCounter = `<div style="text-align: center; padding: 8px; background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%); color: white; font-weight: bold; border-radius: 8px; margin-bottom: 10px; border: 2px solid var(--primary);">⏰ DÍA ${window.gameState.currentDay}/40</div>`;
  
  if (window.gameState.practiceMode) {
    banner.innerHTML = dayCounter + '<div class="practice-mode-banner">🎯 MODO PRÁCTICA</div>';
  } else {
    banner.innerHTML = dayCounter;
  }
  
  document.getElementById('challengeTitle').textContent = `${challengeId}. ${challenge.title}`;
  document.getElementById('challengeDesc').textContent = `Ejercicio ${challengeId}.${subExerciseId}: ${subExercise.desc}`;
  
  if (narrative) {
    document.getElementById('npcDialogue').innerHTML = `<div class="npc-dialogue"><span class="npc-avatar">👨‍💼</span><div style="display: inline-block; width: calc(100% - 80px); vertical-align: top;"><div class="npc-name">Roberto - Gerente GDL</div><div class="npc-text"><p>${narrative}</p></div></div></div>`;
  } else {
    document.getElementById('npcDialogue').innerHTML = '';
  }
  
  document.getElementById('conceptBox').innerHTML = challenge.concept;
  document.getElementById('sqlEditor').value = '-- Escribe tu consulta SQL aquí\n';
  document.getElementById('results').innerHTML = '<strong>📊 Resultados</strong><p style="color: var(--muted); margin-top: 10px;">Ejecuta tu consulta...</p>';
  
  window.gameState.attempts = 0;
  window.gameState.exampleUnlocked = false;
  updateAttemptCounter();
}

function updateProgressBar() {
  let totalCompleted = 0;
  for (let i = 1; i <= 1; i++) {
    const completed = window.gameState.completedSubExercises[i] || [];
    totalCompleted += completed.length;
  }
  
  const percentage = Math.round((totalCompleted / 10) * 100);
  document.getElementById('worldProgress').textContent = `${totalCompleted}/10`;
  document.getElementById('worldProgressBar').style.width = percentage + '%';
  document.getElementById('worldProgressBar').textContent = percentage + '%';
  
  const stars = document.getElementById('lorenzoRep');
  const rep = Math.floor(window.gameState.reputation.ana);
  stars.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    stars.innerHTML += `<span class="star ${i < rep ? '' : 'empty'}">★</span>`;
  }
}

function updateSkillBars() {
  const skills = window.gameState.skills;
  ['SELECT', 'WHERE', 'ORDER', 'ADVANCED'].forEach(skill => {
    const elem = document.getElementById(`skill${skill}`);
    if (elem) {
      const percent = Math.min(100, skills[skill]);
      elem.style.width = percent + '%';
      elem.textContent = percent + '%';
    }
  });
}

window.executeQuery = function() {
  sounds.click();
  const query = document.getElementById('sqlEditor').value.trim();
  if (!query || query === '-- Escribe tu consulta SQL aquí') {
    sounds.error();
    alert('Escribe una consulta');
    return;
  }
  
  try {
    const results = window.gameState.db.exec(query);
    displayResults(results, query);
    checkSolution(query, results);
  } catch (e) {
    sounds.error();
    displayError(e.message, query);
    window.gameState.attempts++;
    updateAttemptCounter();
  }
};

function displayResults(results, query) {
  const container = document.getElementById('results');
  container.innerHTML = `<strong>📊 Resultados de tu consulta</strong>
  <div style="background: #0d1117; color: #00ff41; padding: 10px; border-radius: 8px; margin: 10px 0; font-family: monospace; font-size: 13px; border: 1px solid var(--primary);">${query}</div>`;
  
  if (!results || results.length === 0) {
    container.innerHTML += '<p style="color: var(--muted); margin-top: 10px;">✅ Consulta ejecutada. Sin resultados (0 filas).</p>';
    return;
  }
  
  const result = results[0];
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  
  result.columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);
  
  const tbody = document.createElement('tbody');
  result.values.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell === null ? 'NULL' : cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  
  const resultCount = document.createElement('div');
  resultCount.style.cssText = 'margin-top: 10px; font-size: 14px; color: var(--muted);';
  resultCount.textContent = `📋 ${result.values.length} fila(s) encontrada(s)`;
  
  container.appendChild(table);
  container.appendChild(resultCount);
}

function displayError(message, query) {
  const container = document.getElementById('results');
  container.innerHTML = `<strong style="color: var(--danger);">❌ Error en tu consulta</strong>`;
  
  const queryDisplay = document.createElement('div');
  queryDisplay.style.cssText = 'background: #0d1117; color: #ff4444; padding: 10px; border-radius: 8px; margin: 10px 0; font-family: monospace; font-size: 13px; border: 1px solid var(--danger);';
  queryDisplay.textContent = query;
  container.appendChild(queryDisplay);
  
  const errorBox = document.createElement('div');
  errorBox.style.cssText = 'background: rgba(239, 68, 68, 0.1); padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid var(--danger); border: 2px solid var(--danger);';
  
  let explanation = '';
  if (message.includes('no such column')) {
    const columnName = message.split(':')[1]?.trim() || 'desconocido';
    explanation = `
      <h3 style="color: var(--danger); margin-bottom: 10px;">🔍 Problema detectado:</h3>
      <p><strong>"${columnName}"</strong> no es una columna válida.</p>
      <h3 style="color: var(--danger); margin: 15px 0 10px 0;">💡 Posibles causas:</h3>
      <p>1️⃣ <strong>Olvidaste comillas:</strong> Si es texto, debe ir entre 'comillas'<br>
      Ejemplo: <code>WHERE C_Marca = 'Toyota'</code></p>
      <p>2️⃣ <strong>Nombre incorrecto:</strong> Verifica que la columna exista<br>
      Columnas disponibles: <code>C_VIN, C_Marca, C_Modelo, C_Anio, C_Color, C_Precio, C_Stock</code></p>
    `;
  } else if (message.includes('syntax error')) {
    explanation = `
      <h3 style="color: var(--danger); margin-bottom: 10px;">🔍 Error de sintaxis:</h3>
      <p>Revisa que tu consulta tenga la estructura correcta:</p>
      <pre style="background: #0d1117; color: #00ff41; padding: 10px; border-radius: 4px; margin-top: 10px; border: 1px solid var(--primary);">SELECT columnas
FROM tabla
WHERE condición;</pre>
      <p style="margin-top: 10px;">🔑 Verifica:<br>
      - ¿Separaste las columnas con comas (,)?<br>
      - ¿Terminaste con punto y coma (;)?<br>
      - ¿El texto va entre 'comillas simples'?</p>
    `;
  } else {
    explanation = `<pre style="color: var(--danger); margin-top: 10px;">${message}</pre>`;
  }
  
  errorBox.innerHTML = explanation;
  container.appendChild(errorBox);
}

function checkSolution(userQuery, results) {
  const challengeId = window.gameState.currentChallenge;
  const subExerciseId = window.gameState.currentSubExercise;
  const challenge = challenges[challengeId];
  const subExercise = challenge.subExercises.find(s => s.id === subExerciseId);
  
  const normalize = q => {
    return q
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/;+/g, '')
      .replace(/\t/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .replace(/\(/g, ' ( ')
      .replace(/\)/g, ' ) ')
      .replace(/,/g, ' , ')
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  const userNorm = normalize(userQuery);
  const expectedNorm = normalize(subExercise.expected);
  
  console.log('USER:', userNorm);
  console.log('EXPECTED:', expectedNorm);
  
  if (userNorm === expectedNorm || userNorm.includes(expectedNorm)) {
    completeSubExercise(challengeId, subExerciseId, results);
  } else {
    sounds.error();
    window.gameState.attempts++;
    updateAttemptCounter();
  }
}

function completeSubExercise(challengeId, subExerciseId, results) {
  const challenge = challenges[challengeId];
  const completedSubs = window.gameState.completedSubExercises[challengeId] || [];
  
  let xpGained = 0;
  let coinsGained = 0;
  
  if (!window.gameState.practiceMode && !completedSubs.includes(subExerciseId)) {
    completedSubs.push(subExerciseId);
    window.gameState.completedSubExercises[challengeId] = completedSubs;
    
    const subXP = Math.ceil(challenge.xp / 10);
    const subCoins = Math.ceil(challenge.coins / 10);
    xpGained = subXP;
    coinsGained = subCoins;
    
    window.gameState.xp += subXP;
    window.gameState.coins += subCoins;
    
    window.gameState.skills[challenge.skill] = Math.min(100, window.gameState.skills[challenge.skill] + 10);
    window.gameState.reputation.ana = Math.min(3, window.gameState.reputation.ana + 0.3);
    
    // TRIVIA después del ejercicio 5
    if (subExerciseId === 5 && challenge.hasTrivia && !window.gameState.triviaAnswered) {
      saveGameState();
      showTrivia(challengeId);
      return;
    }
    
    // BOSS FINAL después del ejercicio 10
    if (completedSubs.length === 10 && challenge.hasBoss) {
      window.gameState.currentDay++;
      if (challenge.diaryEntry) {
        window.gameState.diary.push({ day: challengeId, entry: challenge.diaryEntry });
      }
      saveGameState();
      showBossFight(challengeId);
      return;
    }
    
    saveGameState();
  }
  
  sounds.success();
  showRewardModal(xpGained, coinsGained, challengeId, subExerciseId, results);
}

window.showTrivia = function(challengeId) {
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = `
    <div style="text-align: center;">
      <h2 style="color: var(--accent); margin-bottom: 20px;">⚡ TRIVIA DE VELOCIDAD</h2>
      <div style="background: rgba(245, 158, 11, 0.1); padding: 20px; border-radius: 12px; border: 2px solid var(--accent); margin: 20px 0;">
        <p style="font-size: 18px; margin-bottom: 20px;">La Ing. Ana pregunta:</p>
        <p style="font-size: 16px; font-style: italic; margin-bottom: 30px;">"Si Roberto te pide ver los autos que NO son de color 'Rojo', ¿qué operador de comparación usarías en el WHERE?"</p>
        <button class="btn btn-secondary" onclick="answerTrivia('A')" style="width: 100%; margin: 10px 0; font-size: 16px;">A) ==</button>
        <button class="btn btn-secondary" onclick="answerTrivia('B')" style="width: 100%; margin: 10px 0; font-size: 16px;">B) <> o !=</button>
        <button class="btn btn-secondary" onclick="answerTrivia('C')" style="width: 100%; margin: 10px 0; font-size: 16px;">C) NOT LIKE</button>
      </div>
      <p style="font-size: 14px; color: var(--accent);">💰 Premio: 200 VC</p>
    </div>
  `;
  document.getElementById('modalGeneric').classList.add('active');
};

window.answerTrivia = function(answer) {
  window.gameState.triviaAnswered = true;
  
  if (answer === 'B') {
    sounds.success();
    window.gameState.coins += 200;
    window.gameState.xp += 20;
    createCoinRain(200);
    saveGameState();
    
    const content = document.getElementById('modalGenericContent');
    content.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
        <h2 style="color: var(--primary);">¡CORRECTO!</h2>
        <p style="margin: 20px 0; font-size: 16px;">El operador <strong><></strong> o <strong>!=</strong> significa "diferente de".</p>
        <div style="background: linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%); padding: 25px; border-radius: 12px; margin: 20px 0; border: 2px solid var(--accent);">
          <div style="font-size: 32px; margin: 15px 0;">🪙 +200 VC</div>
          <div style="font-size: 32px; margin: 15px 0;">⭐ +20 XP</div>
        </div>
        <button class="btn" onclick="closeModal('modalGeneric'); loadChallenge(1, 6);" style="width: 100%; margin-top: 20px;">Continuar</button>
      </div>
    `;
  } else {
    sounds.error();
    const content = document.getElementById('modalGenericContent');
    content.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 64px; margin-bottom: 20px;">❌</div>
        <h2 style="color: var(--danger);">Incorrecto</h2>
        <p style="margin: 20px 0; font-size: 16px;">La respuesta correcta era: <strong>B) <> o !=</strong></p>
        <p style="color: var(--muted);">No hay recompensa, pero puedes continuar.</p>
        <button class="btn btn-secondary" onclick="closeModal('modalGeneric'); loadChallenge(1, 6);" style="width: 100%; margin-top: 20px;">Continuar</button>
      </div>
    `;
  }
};

window.showBossFight = function(challengeId) {
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = `
    <div style="text-align: center;">
      <h2 style="color: var(--danger); margin-bottom: 20px;">👹 BOSS FINAL</h2>
      <div style="background: rgba(239, 68, 68, 0.1); padding: 20px; border-radius: 12px; border: 2px solid var(--danger); margin: 20px 0;">
        <p style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">Roberto está gritando al teléfono:</p>
        <p style="font-size: 16px; font-style: italic; line-height: 1.6;">"¡${window.gameState.playerName}, la planta ya va a cerrar el sistema! Necesito que me des el <strong>Top 5 de los autos más caros</strong> que sean marca 'Toyota', que <strong>NO sean de color 'Blanco'</strong> y que el precio esté ordenado de <strong>mayor a menor</strong>. ¡Dámelo ya!"</p>
      </div>
      <p style="font-size: 14px; color: var(--muted); margin: 20px 0;">Combina: SELECT TOP 5, WHERE, AND, NOT, ORDER BY DESC</p>
      <button class="btn" onclick="closeModal('modalGeneric'); startBoss();" style="width: 100%; font-size: 18px;">⚔️ Aceptar Desafío</button>
    </div>
  `;
  document.getElementById('modalGeneric').classList.add('active');
};

window.startBoss = function() {
  window.gameState.currentChallenge = 1;
  window.gameState.currentSubExercise = 'BOSS';
  document.getElementById('challengeTitle').textContent = '👹 BOSS FINAL - El Ultimátum de Roberto';
  document.getElementById('challengeDesc').textContent = 'Top 5 autos Toyota más caros, NO blancos, ordenados DESC';
  document.getElementById('npcDialogue').innerHTML = `<div class="npc-dialogue"><span class="npc-avatar">👹</span><div style="display: inline-block; width: calc(100% - 80px); vertical-align: top;"><div class="npc-name" style="color: var(--danger);">BOSS FINAL</div><div class="npc-text"><p>¡La planta cierra en minutos! Top 5 Toyota más caros, NO blancos, DESC. ¡AHORA!</p></div></div></div>`;
  document.getElementById('sqlEditor').value = '-- Escribe tu consulta BOSS aquí\n';
  document.getElementById('results').innerHTML = '<strong>📊 Resultados</strong><p style="color: var(--muted); margin-top: 10px;">Ejecuta tu consulta...</p>';
  window.gameState.attempts = 0;
  updateAttemptCounter();
};

window.executeQuery = function() {
  sounds.click();
  const query = document.getElementById('sqlEditor').value.trim();
  if (!query || query === '-- Escribe tu consulta SQL aquí' || query === '-- Escribe tu consulta BOSS aquí') {
    sounds.error();
    alert('Escribe una consulta');
    return;
  }
  
  // BOSS CHECK
  if (window.gameState.currentSubExercise === 'BOSS') {
    try {
      const results = window.gameState.db.exec(query);
      displayResults(results, query);
      checkBossSolution(query, results);
    } catch (e) {
      sounds.error();
      displayError(e.message, query);
      window.gameState.attempts++;
      updateAttemptCounter();
    }
    return;
  }
  
  // EJERCICIO NORMAL
  try {
    const results = window.gameState.db.exec(query);
    displayResults(results, query);
    checkSolution(query, results);
  } catch (e) {
    sounds.error();
    displayError(e.message, query);
    window.gameState.attempts++;
    updateAttemptCounter();
  }
};

function checkBossSolution(userQuery, results) {
  const normalize = q => {
    return q
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/;+/g, '')
      .replace(/\t/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .replace(/\(/g, ' ( ')
      .replace(/\)/g, ' ) ')
      .replace(/,/g, ' , ')
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  const userNorm = normalize(userQuery);
  
  // Verificar componentes clave del BOSS
  const hasTop5 = userNorm.includes('top 5') || userNorm.includes('limit 5');
  const hasToyota = userNorm.includes("'toyota'");
  const hasNotWhite = (userNorm.includes("!= 'blanco'") || userNorm.includes("<> 'blanco'") || userNorm.includes("not") && userNorm.includes("'blanco'"));
  const hasOrderDesc = userNorm.includes('order by') && userNorm.includes('desc');
  const hasPrice = userNorm.includes('c_precio');
  
  if (hasTop5 && hasToyota && hasNotWhite && hasOrderDesc && hasPrice && results && results[0] && results[0].values.length <= 5) {
    completeBoss();
  } else {
    sounds.error();
    window.gameState.attempts++;
    updateAttemptCounter();
    
    let hint = 'Verifica: ';
    if (!hasTop5) hint += 'TOP 5, ';
    if (!hasToyota) hint += "marca='Toyota', ";
    if (!hasNotWhite) hint += "NOT color='Blanco', ";
    if (!hasOrderDesc) hint += 'ORDER BY DESC, ';
    alert(hint.slice(0, -2));
  }
}

function completeBoss() {
  sounds.success();
  window.gameState.xp += 50;
  window.gameState.coins += 1500;
  window.gameState.unlockedBadges.push('boss1');
  window.gameState.unlockedBadges.push('mundo1');
  saveGameState();
  
  createCoinRain(1500);
  
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 80px; margin-bottom: 20px;">👑</div>
      <h2 style="color: var(--accent); margin-bottom: 15px;">¡BOSS DERROTADO!</h2>
      <p style="font-size: 18px; margin: 20px 0;">Has salvado el Nodo GDL. Roberto puede despachar las unidades.</p>
      <div style="background: linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%); padding: 25px; border-radius: 12px; margin: 20px 0; border: 2px solid var(--accent);">
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 15px;">🏆 RECOMPENSAS FINALES</div>
        <div style="font-size: 32px; margin: 10px 0;">⭐ +50 XP</div>
        <div style="font-size: 32px; margin: 10px 0;">🪙 +1,500 VC</div>
        <div style="font-size: 20px; margin: 15px 0;">👑 Insignia: Vencedor de Roberto</div>
        <div style="font-size: 20px; margin: 15px 0;">🏆 Insignia: Salvador de GDL</div>
      </div>
      <p style="color: var(--muted); margin: 20px 0;">Módulo 1 - COMPLETO 100%</p>
      <button class="btn" onclick="closeModal('modalGeneric'); location.reload();" style="width: 100%; margin-top: 20px; font-size: 18px;">🎊 Finalizar Módulo</button>
    </div>
  `;
  document.getElementById('modalGeneric').classList.add('active');
}

function showRewardModal(xp, coins, challengeId, subExerciseId, results) {
  const content = document.getElementById('modalGenericContent');
  
  let resultSummary = '';
  if (results && results.length > 0) {
    resultSummary = `<p style="margin-top: 15px; font-size: 16px;">📋 Filas obtenidas: <strong>${results[0].values.length}</strong></p>`;
  }
  
  if (window.gameState.practiceMode) {
    content.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
        <h2 style="color: var(--primary); margin-bottom: 15px;">¡Correcto!</h2>
        <p style="font-size: 18px; color: var(--muted);">Modo Práctica</p>
        ${resultSummary}
        <button class="btn btn-secondary" onclick="closeModal('modalGeneric')" style="width: 100%; margin-top: 30px; font-size: 18px;">Cerrar</button>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
        <h2 style="color: var(--primary); margin-bottom: 15px;">¡Ejercicio Completado!</h2>
        <div style="background: linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%); padding: 25px; border-radius: 12px; margin: 20px 0; border: 2px solid var(--primary);">
          <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Recompensas Obtenidas</div>
          <div style="font-size: 32px; margin: 15px 0;">⭐ +${xp} XP</div>
          <div style="font-size: 32px; margin: 15px 0;">🪙 +${coins} VC</div>
        </div>
        ${resultSummary}
        ${subExerciseId < 10 ? `<button class="btn" onclick="nextExercise(${challengeId}, ${subExerciseId})" style="width: 100%; margin-top: 20px; font-size: 18px;">➡️ Siguiente Ejercicio</button>` : ''}
      </div>
    `;
    
    createCoinRain(coins);
  }
  
  document.getElementById('modalGeneric').classList.add('active');
}

window.nextExercise = function(challengeId, subExerciseId) {
  closeModal('modalGeneric');
  window.gameState.currentSubExercise = subExerciseId + 1;
  loadChallenge(challengeId, subExerciseId + 1);
  renderChallenges();
  updateStats();
  updateProgressBar();
  updateSkillBars();
};

function updateAttemptCounter() {
  const counter = document.getElementById('attemptCounter');
  const exampleBtn = document.getElementById('exampleBtn');
  
  if (window.gameState.attempts === 0) {
    counter.style.display = 'none';
    exampleBtn.disabled = true;
    exampleBtn.innerHTML = '🔒 Ver Ejemplo';
  } else if (window.gameState.attempts < 3) {
    counter.style.display = 'flex';
    document.getElementById('attemptText').textContent = `Intento ${window.gameState.attempts}/3`;
    exampleBtn.disabled = true;
    exampleBtn.innerHTML = `🔒 (${3 - window.gameState.attempts} más)`;
  } else {
    counter.style.display = 'flex';
    document.getElementById('attemptText').textContent = `💡 Desbloqueado`;
    exampleBtn.disabled = false;
    exampleBtn.innerHTML = '💡 Ver Ejemplo';
    window.gameState.exampleUnlocked = true;
  }
}

window.showExample = function() {
  if (!window.gameState.exampleUnlocked) {
    sounds.error();
    alert('Necesitas 3 intentos');
    return;
  }
  sounds.click();
  
  if (window.gameState.currentSubExercise === 'BOSS') {
    alert(`💡 PISTA BOSS:\n\nSELECT TOP 5 * FROM tabla\nWHERE condicion1 AND condicion2\nORDER BY columna DESC;`);
    return;
  }
  
  const challenge = challenges[window.gameState.currentChallenge];
  const subExercise = challenge.subExercises.find(s => s.id === window.gameState.currentSubExercise);
  alert(`💡 EJEMPLO:\n\n${subExercise.example}\n\nAdáptalo a lo que se pide.`);
};

window.clearEditor = function() {
  sounds.click();
  document.getElementById('sqlEditor').value = '-- Escribe tu consulta SQL aquí\n';
};

window.showHints = function() {
  sounds.click();
  
  if (window.gameState.currentSubExercise === 'BOSS') {
    const content = document.getElementById('modalGenericContent');
    content.innerHTML = `
      <h2>💡 Pista BOSS</h2>
      <div style="padding: 15px; background: rgba(245, 158, 11, 0.1); border-radius: 8px; margin-top: 20px; border: 2px solid var(--accent);">
        <p>Necesitas combinar:</p>
        <p>1️⃣ SELECT TOP 5 *<br>
        2️⃣ FROM T_Inventario_GDL<br>
        3️⃣ WHERE C_Marca = 'Toyota' AND C_Color <> 'Blanco'<br>
        4️⃣ ORDER BY C_Precio DESC;</p>
      </div>
      <button class="btn" onclick="closeModal('modalGeneric')" style="margin-top: 20px; width: 100%;">Cerrar</button>
    `;
    document.getElementById('modalGeneric').classList.add('active');
    return;
  }
  
  const challenge = challenges[window.gameState.currentChallenge];
  const subExercise = challenge.subExercises.find(s => s.id === window.gameState.currentSubExercise);
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = `
    <h2>💡 Pista</h2>
    <div style="padding: 15px; background: rgba(245, 158, 11, 0.1); border-radius: 8px; margin-top: 20px; border: 2px solid var(--accent);">
      <div style="margin-top: 10px;">${subExercise.hint}</div>
    </div>
    <button class="btn" onclick="closeModal('modalGeneric')" style="margin-top: 20px; width: 100%;">Cerrar</button>
  `;
  document.getElementById('modalGeneric').classList.add('active');
};

window.showTables = function() {
  sounds.click();
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = `
    <h2>📊 Mis Tablas</h2>
    <div style="margin: 20px 0;">
      <h3 style="color: var(--primary);">Tabla: T_Inventario_GDL</h3>
      <ul style="margin-left: 20px; margin-top: 10px;">
        <li><code>C_VIN</code> - TEXT (número de serie único)</li>
        <li><code>C_Marca</code> - TEXT (marca del vehículo)</li>
        <li><code>C_Modelo</code> - TEXT (modelo)</li>
        <li><code>C_Anio</code> - INTEGER (año)</li>
        <li><code>C_Color</code> - TEXT (color)</li>
        <li><code>C_Precio</code> - INTEGER (precio en pesos)</li>
        <li><code>C_Stock</code> - INTEGER (unidades disponibles)</li>
      </ul>
      <h3 style="color: var(--primary); margin-top: 20px;">Tabla: T_Clientes_GDL</h3>
      <ul style="margin-left: 20px; margin-top: 10px;">
        <li><code>C_ID_Cliente</code> - INTEGER</li>
        <li><code>C_Nombre_Completo</code> - TEXT</li>
        <li><code>C_Correo</code> - TEXT</li>
        <li><code>C_Telefono</code> - TEXT</li>
        <li><code>C_Ciudad_Registro</code> - TEXT</li>
      </ul>
      <h3 style="color: var(--primary); margin-top: 20px;">Tabla: T_Ventas_GDL</h3>
      <ul style="margin-left: 20px; margin-top: 10px;">
        <li><code>C_ID_Venta</code> - INTEGER</li>
        <li><code>C_VIN</code> - TEXT</li>
        <li><code>C_Fecha</code> - DATE</li>
        <li><code>C_Metodo_Pago</code> - TEXT (puede ser NULL)</li>
      </ul>
      <div style="background: rgba(245, 158, 11, 0.1); padding: 15px; border-radius: 8px; margin-top: 15px; border: 2px solid var(--accent);">
        <strong>💡 Recuerda:</strong><br>
        - TEXT (texto) va entre 'comillas simples'<br>
        - INTEGER (números) NO llevan comillas
      </div>
    </div>
    <button class="btn" onclick="closeModal('modalGeneric')" style="width: 100%;">Cerrar</button>
  `;
  document.getElementById('modalGeneric').classList.add('active');
};

window.toggleTables = function() {
  sounds.click();
  const panel = document.getElementById('tablesPanel');
  const toggle = document.getElementById('tablesToggle');
  
  if (panel && toggle) {
    if (panel.style.display === 'none' || panel.style.display === '') {
      panel.style.display = 'block';
      toggle.textContent = '▲';
    } else {
      panel.style.display = 'none';
      toggle.textContent = '▼';
    }
  }
};

window.showBadges = function() {
  sounds.click();
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = '<h2>🏆 Mis Insignias</h2>';
  const grid = document.createElement('div');
  grid.className = 'badge-grid';
  allBadges.forEach(badge => {
    const unlocked = window.gameState.unlockedBadges.includes(badge.id);
    const div = document.createElement('div');
    div.className = `badge-item ${unlocked ? 'unlocked' : 'locked'}`;
    div.innerHTML = `<div class="badge-icon">${badge.icon}</div><div style="font-weight: bold; font-size: 14px;">${badge.name}</div><div style="font-size: 12px; color: var(--muted); margin-top: 5px;">${badge.desc}</div>`;
    grid.appendChild(div);
  });
  content.appendChild(grid);
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Cerrar';
  btn.style.cssText = 'margin-top: 20px; width: 100%;';
  btn.onclick = () => closeModal('modalGeneric');
  content.appendChild(btn);
  document.getElementById('modalGeneric').classList.add('active');
};

window.showShop = function() {
  sounds.click();
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = `<h2>🛍️ Tienda VC</h2><p style="color: var(--muted); margin: 20px 0;">Próximamente: Avatares, Kits de Recuperación y más</p><button class="btn" onclick="closeModal('modalGeneric')" style="margin-top: 20px; width: 100%;">Cerrar</button>`;
  document.getElementById('modalGeneric').classList.add('active');
};

window.showDiary = function() {
  sounds.click();
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = '<h2>📖 Mi Diario</h2>';
  
  if (window.gameState.diary.length === 0) {
    content.innerHTML += '<p style="color: var(--muted); margin: 20px 0;">Tu misión comienza...</p>';
  } else {
    window.gameState.diary.forEach(entry => {
      const div = document.createElement('div');
      div.style.cssText = 'padding: 15px; margin-bottom: 15px; background: rgba(245, 158, 11, 0.1); border-left: 4px solid var(--accent); border-radius: 8px; border: 2px solid var(--accent);';
      div.innerHTML = `<strong>Día ${entry.day}:</strong><br><div style="margin-top: 8px;">${entry.entry}</div>`;
      content.appendChild(div);
    });
  }
  
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Cerrar';
  btn.style.cssText = 'margin-top: 20px; width: 100%;';
  btn.onclick = () => closeModal('modalGeneric');
  content.appendChild(btn);
  document.getElementById('modalGeneric').classList.add('active');
};

window.closeModal = function(id) {
  sounds.click();
  document.getElementById(id).classList.remove('active');
};
