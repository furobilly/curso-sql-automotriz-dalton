// ============================================
// NEXUS SQL v2.0 — PROTOCOLO DE EMERGENCIA
// NexCorp Industries / AXIOM Motors
// ============================================

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
  unlockedItems: [],
  equippedItems: {},
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
  triviaAnswered: false,
  rank: 'Analista JR'
};

// ============================================
// KITS DE INICIO — Beneficios reales en el juego
// ============================================
const starterKits = [
  {
    id: 0, name: 'Kit Gamer', sub: 'RGB Master', icon: 'kit_gamer',
    desc: 'Modo agresivo. Más XP por ejercicio, empieza con monedas extra.',
    benefits: { xpBonus: 1.25, coinsStart: 200, coinBonus: 1.0, hintsBonus: 0, extraAttempts: 0,
      label: '+25% XP · 200 VC iniciales' },
    accentColor: '#ff6d00'
  },
  {
    id: 1, name: 'Kit Ejecutivo', sub: 'The Boss', icon: 'kit_ejecutivo',
    desc: 'Modo estratégico. Más monedas por ejercicio y 1 pista gratis.',
    benefits: { xpBonus: 1.0, coinsStart: 500, coinBonus: 1.5, hintsBonus: 1, extraAttempts: 0,
      label: '+50% VC · 500 VC iniciales · 1 pista gratis' },
    accentColor: '#ffa000'
  },
  {
    id: 2, name: 'Kit Zen', sub: 'Minimalista', icon: 'kit_zen',
    desc: 'Modo meditación. 3 pistas extra y más intentos antes de bloqueo.',
    benefits: { xpBonus: 1.0, coinsStart: 100, coinBonus: 1.0, hintsBonus: 3, extraAttempts: 2,
      label: '3 pistas gratis · +2 intentos extra' },
    accentColor: '#00e676'
  }
];

// ============================================
// SISTEMA DE RANGOS — Avatar evoluciona con XP
// ============================================
const rankSystem = [
  {
    id: 'jr',       name: 'Analista JR',    minXP: 0,    maxXP: 199,
    color: '#546e7a', glow: 'rgba(84,110,122,0.5)',
    avatarSVG: `<svg viewBox="0 0 60 60" width="60" height="60" fill="none">
      <circle cx="30" cy="30" r="28" stroke="#546e7a" stroke-width="2" fill="#0d1117"/>
      <circle cx="30" cy="22" r="9" fill="#546e7a" opacity="0.8"/>
      <path d="M14 48c0-8.8 7.2-16 16-16s16 7.2 16 16" fill="#546e7a" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'sr',       name: 'Analista SR',    minXP: 200,  maxXP: 499,
    color: '#ffa000', glow: 'rgba(255,160,0,0.5)',
    avatarSVG: `<svg viewBox="0 0 60 60" width="60" height="60" fill="none">
      <circle cx="30" cy="30" r="28" stroke="#ffa000" stroke-width="2" fill="#0d1117"/>
      <circle cx="30" cy="22" r="9" fill="#ffa000" opacity="0.9"/>
      <path d="M14 48c0-8.8 7.2-16 16-16s16 7.2 16 16" fill="#ffa000" opacity="0.7"/>
      <polygon points="30,4 32,10 38,10 33,14 35,20 30,16 25,20 27,14 22,10 28,10" fill="#ffa000" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'especialista', name: 'Especialista', minXP: 500, maxXP: 999,
    color: '#ff6d00', glow: 'rgba(255,109,0,0.6)',
    avatarSVG: `<svg viewBox="0 0 60 60" width="60" height="60" fill="none">
      <circle cx="30" cy="30" r="28" stroke="#ff6d00" stroke-width="2.5" fill="#0d1117"/>
      <circle cx="30" cy="30" r="24" stroke="#ff6d00" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.4"/>
      <circle cx="30" cy="22" r="9" fill="#ff6d00" opacity="0.9"/>
      <path d="M14 48c0-8.8 7.2-16 16-16s16 7.2 16 16" fill="#ff6d00" opacity="0.8"/>
      <polygon points="30,2 32.5,9 40,9 34,13.5 36.5,21 30,16.5 23.5,21 26,13.5 20,9 27.5,9" fill="#ff6d00"/>
    </svg>`
  },
  {
    id: 'arquitecto',  name: 'Arquitecto SQL', minXP: 1000, maxXP: 1999,
    color: '#00e676', glow: 'rgba(0,230,118,0.6)',
    avatarSVG: `<svg viewBox="0 0 60 60" width="60" height="60" fill="none">
      <circle cx="30" cy="30" r="28" stroke="#00e676" stroke-width="2.5" fill="#0d1117"/>
      <circle cx="30" cy="30" r="22" stroke="#00e676" stroke-width="1" opacity="0.3"/>
      <circle cx="30" cy="22" r="9" fill="#00e676" opacity="0.9"/>
      <path d="M14 48c0-8.8 7.2-16 16-16s16 7.2 16 16" fill="#00e676" opacity="0.8"/>
      <path d="M20 8 L30 2 L40 8 L40 20 L30 26 L20 20Z" stroke="#00e676" stroke-width="1.5" fill="none" opacity="0.7"/>
      <circle cx="30" cy="14" r="3" fill="#00e676"/>
    </svg>`
  },
  {
    id: 'maestro',     name: 'Maestro NEXUS', minXP: 2000, maxXP: Infinity,
    color: '#e040fb', glow: 'rgba(224,64,251,0.7)',
    avatarSVG: `<svg viewBox="0 0 60 60" width="60" height="60" fill="none">
      <circle cx="30" cy="30" r="28" stroke="#e040fb" stroke-width="3" fill="#0d1117"/>
      <circle cx="30" cy="30" r="22" stroke="#e040fb" stroke-width="1" opacity="0.4"/>
      <circle cx="30" cy="30" r="16" stroke="#e040fb" stroke-width="0.5" opacity="0.2"/>
      <circle cx="30" cy="22" r="9" fill="#e040fb" opacity="0.9"/>
      <path d="M14 48c0-8.8 7.2-16 16-16s16 7.2 16 16" fill="#e040fb" opacity="0.8"/>
      <polygon points="30,1 33,10 42,10 35,16 38,25 30,19 22,25 25,16 18,10 27,10" fill="#e040fb"/>
      <circle cx="30" cy="30" r="4" fill="#e040fb" opacity="0.5"/>
    </svg>`
  }
];

function getRank(xp) {
  return rankSystem.find(r => xp >= r.minXP && xp <= r.maxXP) || rankSystem[0];
}

function getNextRank(xp) {
  const idx = rankSystem.findIndex(r => xp >= r.minXP && xp <= r.maxXP);
  return rankSystem[idx + 1] || null;
}

function checkRankUp(oldXP, newXP) {
  const oldRank = getRank(oldXP);
  const newRank = getRank(newXP);
  if (oldRank.id !== newRank.id) {
    window.gameState.rank = newRank.name;
    showRankUpAnimation(newRank);
  }
}

// ============================================
// SISTEMA DE TIENDA Y SKINS
// ============================================
const shopItems = [
  // AVATARES / SKINS
  { id: 'skin_hacker', name: 'Hoodie de Hacker', icon: '🥷', type: 'avatar', price: 500, desc: 'El look del que hackea el sistema... legalmente.' },
  { id: 'skin_ejecutivo', name: 'Traje Ejecutivo', icon: '🤵', type: 'avatar', price: 800, desc: 'Para cuando Roberto te invite a su oficina.' },
  { id: 'skin_astronauta', name: 'Casco Espacial', icon: '👨‍🚀', type: 'avatar', price: 1200, desc: 'Tus queries viajan a velocidad orbital.' },
  { id: 'skin_mago', name: 'Capa de Mago SQL', icon: '🧙', type: 'avatar', price: 2000, desc: 'SELECT * FROM magia WHERE existe = TRUE.' },
  // OFICINA / ENTORNO
  { id: 'monitor_dual', name: 'Monitor Dual', icon: '🖥️', type: 'office', price: 300, desc: 'Dobla tu pantalla, dobla tu productividad.' },
  { id: 'silla_gamer', name: 'Silla Gamer RGB', icon: '🪑', type: 'office', price: 600, desc: 'Lumbar support para queries de 3 horas.' },
  { id: 'cafe_infinito', name: 'Café Infinito ☕', icon: '☕', type: 'office', price: 200, desc: 'Nunca más vas a tener error de timeout.' },
  // POWER-UPS
  { id: 'pista_gratis', name: 'Kit de Pistas x3', icon: '💡', type: 'powerup', price: 150, desc: '3 pistas extra para cuando el WHERE no cede.' },
  { id: 'xp_boost', name: 'Boost XP x2', icon: '⚡', type: 'powerup', price: 400, desc: 'Duplica tu XP por 5 ejercicios.' },
];

const allBadges = [
  { id: 'primera', name: 'Primera Consulta', icon: '🛡️', desc: 'Completar ejercicio 1.1' },
  { id: 'glitch', name: 'Cazador de Duplicados', icon: '⚡', desc: 'Completar GLITCH 1.4' },
  { id: 'domador', name: 'Domador de WHERE', icon: '⚔️', desc: 'Completar ejercicio 1.7' },
  { id: 'between', name: 'Maestro del Rango', icon: '📊', desc: 'Completar ERROR DE NODO 1.8' },
  { id: 'boss1', name: 'Vencedor de Roberto', icon: '👑', desc: 'Completar Boss Final Módulo 1' },
  { id: 'mundo1', name: 'Salvador de GDL', icon: '🏆', desc: '100% Módulo 1' }
];

// ============================================
// BASE DE DATOS — AXIOM MOTORS / NEXCORP
// Esquema simple para Módulo 1 — AXIOM Motors GDL
// ============================================
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
  ('AX001TY', 'Toyota', 'Hilux', 2024, 'Gris', 650000, 5),
  ('AX002TY', 'Toyota', 'Corolla', 2024, 'Blanco', 450000, 8),
  ('AX003BYD', 'BYD', 'Seal', 2024, 'Azul', 550000, 3),
  ('AX004TY', 'Toyota', 'RAV4', 2024, 'Negro', 700000, 2),
  ('AX005BYD', 'BYD', 'Han', 2024, 'Rojo', 580000, 4),
  ('AX006TY', 'Toyota', 'Camry', 2024, 'Plata', 520000, 6),
  ('AX007BYD', 'BYD', 'Dolphin', 2024, 'Verde', 380000, 10),
  ('AX008TY', 'Toyota', 'Tacoma', 2024, 'Azul', 720000, 3),
  ('AX009BYD', 'BYD', 'Atto3', 2024, 'Blanco', 490000, 7),
  ('AX010TY', 'Toyota', 'Highlander', 2024, 'Negro', 850000, 2),
  ('AX011TY', 'Toyota', 'Hiloader', 2024, 'Gris', 420000, 4);

  CREATE TABLE T_Clientes_GDL (
    C_ID_Cliente INTEGER PRIMARY KEY,
    C_Nombre_Completo TEXT,
    C_Correo TEXT,
    C_Telefono TEXT,
    C_Ciudad_Registro TEXT
  );

  INSERT INTO T_Clientes_GDL VALUES
  (1, 'Roberto Mendoza', 'roberto@nexcorp.mx', '3331234567', 'Guadalajara'),
  (2, 'María González', 'maria@gmail.com', '3339876543', 'Guadalajara'),
  (3, 'Carlos López', 'carlos@hotmail.com', '3335555555', 'Zapopan'),
  (4, 'Ana Rodríguez', 'ana.r@outlook.com', '3338888888', 'Guadalajara'),
  (5, 'Luis Hernández', 'luis.h@yahoo.com', '3337777777', 'Tlaquepaque'),
  (6, 'Sofía Vargas', 'sofia@nexcorp.mx', '3332222222', 'Guadalajara'),
  (7, 'Diego Ruiz', 'diego@gmail.com', '3336666666', 'Zapopan'),
  (8, 'Fernanda Castro', 'fer.castro@hotmail.com', '3339999999', 'Guadalajara');

  CREATE TABLE T_Ventas_GDL (
    C_ID_Venta INTEGER PRIMARY KEY,
    C_VIN TEXT,
    C_ID_Cliente INTEGER,
    C_Fecha DATE,
    C_Metodo_Pago TEXT,
    C_Monto INTEGER
  );

  INSERT INTO T_Ventas_GDL VALUES
  (1, 'AX001TY', 1, '2024-01-15', 'Efectivo', 650000),
  (2, 'AX003BYD', 2, '2024-01-20', NULL, 550000),
  (3, 'AX005BYD', 3, '2024-01-22', 'Crédito', 580000),
  (4, 'AX007BYD', 4, '2024-01-25', NULL, 380000),
  (5, 'AX002TY', 5, '2024-02-01', 'Contado', 450000),
  (6, 'AX006TY', 6, '2024-02-10', 'Crédito', 520000),
  (7, 'AX004TY', 7, '2024-02-15', 'Efectivo', 700000),
  (8, 'AX010TY', 8, '2024-02-20', NULL, 850000);
`;

// ============================================
// NARRATIVA INMERSIVA — Módulo 1
// NexCorp Industries / AXIOM Motors GDL
// ============================================
const narrativeDialogues = {
  1: {
    // Ejercicio 1 — El primer contacto
    1: () => `
      <div class="npc-scene">
        <div class="npc-location">📍 Servidor Regional GDL — Puerto 8080 — 06:47 AM</div>
        <div class="npc-message">
          <span class="npc-avatar">👨‍💼</span>
          <div class="npc-bubble">
            <div class="npc-name">ROBERTO — Gerente AXIOM Motors GDL</div>
            <p>"${window.gameState.playerName}, ¿me escuchas? El virus bloqueó el módulo de clientes.
            Tengo a 15 asesores en el piso sin poder ver a <strong>UN SOLO cliente</strong>.
            Necesito los NOMBRES de todos los registros en el servidor. Ahora."</p>
            <p class="npc-whisper">🔒 <em>La pantalla de Roberto parpadea. The Void está borrando registros en tiempo real.</em></p>
          </div>
        </div>
      </div>`,

    // Ejercicio 2 — Escalando el problema
    2: () => `
      <div class="npc-scene">
        <div class="npc-location">📍 07:03 AM — Alerta de sistema: 47 unidades sin despachar</div>
        <div class="npc-message">
          <span class="npc-avatar">👨‍💼</span>
          <div class="npc-bubble">
            <div class="npc-name">ROBERTO — Gerente AXIOM Motors GDL</div>
            <p>"¡Bien! Ya veo los nombres. Pero ahora necesito validar los números de serie
            de las unidades. Dame el <strong>MODELO y el VIN</strong> de todo el inventario.
            Toyota ya me está llamando para cancelar el embarque si no confirmo."</p>
            <p class="npc-whisper">⚠️ <em>14 minutos para el deadline de Toyota.</em></p>
          </div>
        </div>
      </div>`,

    // Ejercicio 3 — El reporte ejecutivo
    3: () => `
      <div class="npc-scene">
        <div class="npc-location">📍 07:18 AM — Llamada entrante: Ing. Ana (NEXUS)</div>
        <div class="npc-message">
          <span class="npc-avatar">👩‍💻</span>
          <div class="npc-bubble">
            <div class="npc-name">ING. ANA — Arquitecta NEXUS</div>
            <p>"${window.gameState.playerName}, escucha. Roberto está bien pero el Director Regional
            va a pedir un reporte formal en 20 minutos. Necesitan ver el precio del inventario
            pero con nomenclatura ejecutiva. Muestra <strong>C_Precio como M_Precio_Lista</strong>.
            Los directores odian los nombres técnicos."</p>
            <p class="npc-whisper">💡 <em>Tip: En SQL puedes renombrar columnas con la palabra AS.</em></p>
          </div>
        </div>
      </div>`,

    // Ejercicio 4 — GLITCH
    4: () => `
      <div class="npc-scene">
        <div class="npc-location">📍 07:31 AM — ⚠️ ALERTA: Corrupción de datos detectada</div>
        <div class="npc-message">
          <span class="npc-avatar">👨‍💼</span>
          <div class="npc-bubble">
            <div class="npc-name">ROBERTO — Gerente AXIOM Motors GDL</div>
            <p>"¡ESPERA! El sistema está devolviendo marcas duplicadas como loco.
            The Void inyectó registros falsos. Necesito ver <strong>solo las marcas únicas</strong>
            para saber con qué realmente contamos. ¡Sin duplicados!"</p>
            <p class="npc-whisper">🔴 <em>GLITCH ACTIVO: El servidor está multiplicando marcas.</em></p>
          </div>
        </div>
      </div>`,

    // Ejercicio 5 — Filtro BYD
    5: () => `
      <div class="npc-scene">
        <div class="npc-location">📍 07:44 AM — Llamada: Cliente flotilla eléctrica</div>
        <div class="npc-message">
          <span class="npc-avatar">👨‍💼</span>
          <div class="npc-bubble">
            <div class="npc-name">ROBERTO — Gerente AXIOM Motors GDL</div>
            <p>"Tengo a Logística Nacional en la línea. Quieren comprar FLOTA completa de eléctricos.
            Solo les interesan las unidades <strong>BYD</strong>. Dame todos los registros
            de esa marca. Nada de Toyota por ahora."</p>
            <p class="npc-whisper">💰 <em>Venta potencial: $2,980,000 MXN si cerramos hoy.</em></p>
          </div>
        </div>
      </div>`,

    // Ejercicio 6 — VIP
    6: () => `
      <div class="npc-scene">
        <div class="npc-location">📍 08:02 AM — Segmento VIP activado</div>
        <div class="npc-message">
          <span class="npc-avatar">👩‍💻</span>
          <div class="npc-bubble">
            <div class="npc-name">ING. ANA — Arquitecta NEXUS</div>
            <p>"Nuevo objetivo. El Director de NexCorp quiere ver las unidades de alto valor
            para la junta del mediodía. Solo unidades con precio <strong>mayor a $600,000</strong>.
            Los clientes VIP no quieren ver el catálogo completo."</p>
            <p class="npc-whisper">🏆 <em>Ana está monitoreando tu velocidad de respuesta.</em></p>
          </div>
        </div>
      </div>`,

    // Ejercicio 7 — Doble filtro
    7: () => `
      <div class="npc-scene">
        <div class="npc-location">📍 08:19 AM — Solicitud específica de cliente</div>
        <div class="npc-message">
          <span class="npc-avatar">👨‍💼</span>
          <div class="npc-bubble">
            <div class="npc-name">ROBERTO — Gerente AXIOM Motors GDL</div>
            <p>"Tengo un cliente muy específico. Quiere exactamente:
            <strong>Toyota Y color Gris</strong>. Ni otro color, ni otra marca.
            Búscame esa combinación exacta en el inventario."</p>
            <p class="npc-whisper">🎯 <em>Necesitas combinar DOS condiciones con AND.</em></p>
          </div>
        </div>
      </div>`,

    // Ejercicio 8 — BETWEEN
    8: () => `
      <div class="npc-scene">
        <div class="npc-location">📍 08:33 AM — ⚠️ ERROR DE NODO: Precios inestables</div>
        <div class="npc-message">
          <span class="npc-avatar">👩‍💻</span>
          <div class="npc-bubble">
            <div class="npc-name">ING. ANA — Arquitecta NEXUS</div>
            <p>"The Void atacó el módulo de precios. Algunos datos están corruptos arriba y abajo.
            Necesito que aisles el rango CONFIABLE: unidades entre
            <strong>$350,000 y $550,000</strong>. Usa BETWEEN para capturar el rango exacto."</p>
            <p class="npc-whisper">🔧 <em>ERROR DE NODO activo. Trabaja rápido.</em></p>
          </div>
        </div>
      </div>`,

    // Ejercicio 9 — LIKE
    9: () => `
      <div class="npc-scene">
        <div class="npc-location">📍 08:47 AM — Registro con error tipográfico</div>
        <div class="npc-message">
          <span class="npc-avatar">👨‍💼</span>
          <div class="npc-bubble">
            <div class="npc-name">ROBERTO — Gerente AXIOM Motors GDL</div>
            <p>"The Void corrompió nombres de modelos. Alguien capturó 'Hiloader' en lugar
            de 'Hilux'. Necesito encontrar TODO lo que empiece con <strong>'Hi'</strong>
            para no perder ningún registro. Usa búsqueda por patrón."</p>
            <p class="npc-whisper">🔍 <em>El símbolo % significa "cualquier cosa después de esto".</em></p>
          </div>
        </div>
      </div>`,

    // Ejercicio 10 — IS NULL
    10: () => `
      <div class="npc-scene">
        <div class="npc-location">📍 09:01 AM — Auditoría de datos críticos</div>
        <div class="npc-message">
          <span class="npc-avatar">👩‍💻</span>
          <div class="npc-bubble">
            <div class="npc-name">ING. ANA — Arquitecta NEXUS</div>
            <p>"Última misión antes del Boss. The Void borró métodos de pago en algunas ventas.
            Contabilidad necesita saber cuáles ventas tienen el campo
            <strong>C_Metodo_Pago vacío (NULL)</strong>. Esos registros necesitan auditoría urgente."</p>
            <p class="npc-whisper">🕵️ <em>NULL no es cero ni texto vacío. Es ausencia total de dato.</em></p>
          </div>
        </div>
      </div>`
  }
};

// ============================================
// DEFINICIÓN DE EJERCICIOS — MÓDULO 1
// Tablas: T_Inventario_GDL, T_Clientes_GDL, T_Ventas_GDL
// ============================================
const challenges = {
  1: {
    title: 'Restauración de Nodo GDL',
    concept: `<strong>📜 Comandos de este ejercicio</strong><br><br>
      <code>SELECT</code> — elige QUÉ columnas ver<br>
      <code>FROM</code> — de QUÉ tabla sacar datos<br><br>
      <em>Tip: usa * para ver TODAS las columnas</em>`,
    subExercises: [
      {
        id: 1, desc: '📋 Listado de Clientes',
        expected: 'SELECT C_Nombre_Completo FROM T_Clientes_GDL',
        hint: 'SELECT C_Nombre_Completo FROM T_Clientes_GDL;',
        example: 'SELECT C_Correo FROM T_Clientes_GDL;'
      },
      {
        id: 2, desc: '🚗 Identificación de Unidades',
        expected: 'SELECT C_Modelo, C_VIN FROM T_Inventario_GDL',
        hint: 'SELECT C_Modelo, C_VIN FROM T_Inventario_GDL;',
        example: 'SELECT C_Marca, C_Color FROM T_Inventario_GDL;'
      },
      {
        id: 3, desc: '💰 Etiquetado Profesional (AS)',
        expected: 'SELECT C_Precio AS M_Precio_Lista FROM T_Inventario_GDL',
        hint: 'SELECT C_Precio AS M_Precio_Lista FROM T_Inventario_GDL;',
        example: 'SELECT C_Marca AS Fabricante FROM T_Inventario_GDL;'
      },
      {
        id: 4, desc: '⚠️ GLITCH: Marcas Únicas (DISTINCT)',
        expected: 'SELECT DISTINCT C_Marca FROM T_Inventario_GDL',
        hint: 'SELECT DISTINCT C_Marca FROM T_Inventario_GDL;',
        example: 'SELECT DISTINCT C_Color FROM T_Inventario_GDL;'
      },
      {
        id: 5, desc: '🔋 Filtro BYD (WHERE)',
        expected: "SELECT * FROM T_Inventario_GDL WHERE C_Marca = 'BYD'",
        hint: "SELECT * FROM T_Inventario_GDL WHERE C_Marca = 'BYD';",
        example: "SELECT * FROM T_Inventario_GDL WHERE C_Marca = 'Toyota';"
      },
      {
        id: 6, desc: '💎 Unidades VIP (> $600,000)',
        expected: 'SELECT * FROM T_Inventario_GDL WHERE C_Precio > 600000',
        hint: 'SELECT * FROM T_Inventario_GDL WHERE C_Precio > 600000;',
        example: 'SELECT * FROM T_Inventario_GDL WHERE C_Precio > 500000;'
      },
      {
        id: 7, desc: '🎯 Doble Filtro (AND)',
        expected: "SELECT * FROM T_Inventario_GDL WHERE C_Marca = 'Toyota' AND C_Color = 'Gris'",
        hint: "SELECT * FROM T_Inventario_GDL WHERE C_Marca = 'Toyota' AND C_Color = 'Gris';",
        example: "SELECT * FROM T_Inventario_GDL WHERE C_Marca = 'BYD' AND C_Stock > 5;"
      },
      {
        id: 8, desc: '⚠️ ERROR DE NODO: BETWEEN',
        expected: 'SELECT * FROM T_Inventario_GDL WHERE C_Precio BETWEEN 350000 AND 550000',
        hint: 'SELECT * FROM T_Inventario_GDL WHERE C_Precio BETWEEN 350000 AND 550000;',
        example: 'SELECT * FROM T_Inventario_GDL WHERE C_Precio BETWEEN 400000 AND 600000;'
      },
      {
        id: 9, desc: '🔍 Patrón LIKE (Hi%)',
        expected: "SELECT * FROM T_Inventario_GDL WHERE C_Modelo LIKE 'Hi%'",
        hint: "SELECT * FROM T_Inventario_GDL WHERE C_Modelo LIKE 'Hi%';",
        example: "SELECT * FROM T_Inventario_GDL WHERE C_Modelo LIKE 'C%';"
      },
      {
        id: 10, desc: '🕳️ Auditoría IS NULL',
        expected: 'SELECT * FROM T_Ventas_GDL WHERE C_Metodo_Pago IS NULL',
        hint: 'SELECT * FROM T_Ventas_GDL WHERE C_Metodo_Pago IS NULL;',
        example: 'SELECT * FROM T_Clientes_GDL WHERE C_Telefono IS NULL;'
      }
    ],
    xp: 100, coins: 1000, difficulty: 1, skill: 'SELECT',
    diaryEntry: 'Día 1: Restauré el nodo GDL. Roberto pudo despachar las unidades. Ana dice que tengo potencial.',
    hasTutorial: true,
    hasTrivia: true,
    hasBoss: true
  }
};

// ============================================
// TUTORIALES INMERSIVOS (integrados en historia)
// ============================================
const sqlTutorials = {
  1: {
    title: 'SELECT y FROM',
    slides: [
      // SLIDE 1 — Contexto / Ana habla
      {
        icon: '📡',
        tag: 'NEXUS SQL — TRANSMISIÓN ENTRANTE',
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:56px;margin-bottom:8px;filter:drop-shadow(0 0 20px var(--primary));">📡</div>
            <div style="font-family:var(--font-display);font-size:11px;letter-spacing:3px;color:var(--primary);text-transform:uppercase;">NEXUS SQL — Transmisión entrante</div>
          </div>
          <div style="background:rgba(255,160,0,0.06);border:1px solid rgba(255,160,0,0.3);border-radius:12px;padding:20px;">
            <div style="font-family:var(--font-display);font-size:12px;letter-spacing:1px;color:var(--primary);margin-bottom:12px;">👩‍💻 ING. ANA — Canal encriptado</div>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;">
              "Escucha bien, <strong style="color:var(--primary);">${window.gameState.playerName}</strong>. 
              El servidor de AXIOM Motors responde a un idioma muy específico. 
              No es inglés ni español — es <strong>SQL</strong>."
            </p>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;margin-top:10px;">
              "Si lo hablas correctamente, el servidor te da lo que pides. 
              Si cometes un error de sintaxis, te rechaza. 
              <strong style="color:var(--accent);">Sin excepciones.</strong>"
            </p>
          </div>
          <div style="text-align:center;margin-top:16px;color:var(--muted);font-size:13px;">
            Slide 1 de 3 — El lenguaje del servidor
          </div>`
      },
      // SLIDE 2 — SELECT + FROM + Reglas
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">⚡</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">El hechizo básico</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:12px;font-size:15px;">
              <strong style="color:var(--primary);">SELECT</strong> = "Quiero ver <em>estas columnas</em>"<br>
              <strong style="color:var(--primary);">FROM</strong> = "De <em>esta tabla</em>"
            </p>
            <pre style="background:#050709;color:#00e676;padding:14px;border-radius:8px;border:1px solid rgba(0,230,118,0.2);font-size:14px;line-height:1.8;">SELECT columna1, columna2
FROM nombre_tabla;</pre>
          </div>
          <div style="background:rgba(255,160,0,0.05);border:1px solid rgba(255,160,0,0.2);border-radius:12px;padding:18px;">
            <div style="font-family:var(--font-display);font-size:11px;letter-spacing:1px;color:var(--primary);margin-bottom:12px;">🔑 REGLAS DEL SERVIDOR</div>
            <p style="line-height:2;font-size:14px;">
              1️⃣ Las columnas se separan con <strong>comas (,)</strong><br>
              2️⃣ Termina siempre con <strong>punto y coma (;)</strong><br>
              3️⃣ Usa <strong>*</strong> para ver TODAS las columnas<br>
              4️⃣ SQL no distingue mayúsculas/minúsculas
            </p>
          </div>
          <div style="text-align:center;margin-top:16px;color:var(--muted);font-size:13px;">
            Slide 2 de 3 — Estructura del comando
          </div>`
      },
      // SLIDE 3 — Ejemplos reales
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">✏️</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">Ejemplos reales del sistema</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div>
              <div style="font-size:12px;color:var(--muted);margin-bottom:6px;font-family:var(--font-mono);">// Solo los modelos:</div>
              <pre style="background:#050709;color:#00e676;padding:12px;border-radius:8px;border:1px solid rgba(0,230,118,0.15);font-size:13px;margin:0;">SELECT C_Modelo
FROM T_Inventario_GDL;</pre>
            </div>
            <div>
              <div style="font-size:12px;color:var(--muted);margin-bottom:6px;font-family:var(--font-mono);">// Modelo Y marca (nota la coma):</div>
              <pre style="background:#050709;color:#00e676;padding:12px;border-radius:8px;border:1px solid rgba(0,230,118,0.15);font-size:13px;margin:0;">SELECT C_Modelo, C_Marca
FROM T_Inventario_GDL;</pre>
            </div>
            <div>
              <div style="font-size:12px;color:var(--muted);margin-bottom:6px;font-family:var(--font-mono);">// TODO el inventario con *:</div>
              <pre style="background:#050709;color:#00e676;padding:12px;border-radius:8px;border:1px solid rgba(0,230,118,0.15);font-size:13px;margin:0;">SELECT *
FROM T_Inventario_GDL;</pre>
            </div>
          </div>
          <div style="background:rgba(0,230,118,0.06);border:1px solid rgba(0,230,118,0.2);border-radius:10px;padding:12px;margin-top:14px;text-align:center;">
            <p style="color:var(--muted);font-size:13px;font-style:italic;">💬 "Roberto está esperando. El reloj corre." — Ing. Ana</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 3 de 3 — Practica con datos reales
          </div>`
      }
    ]
  }
};

// ============================================
// SONIDOS
// ============================================
const sounds = {
  click: () => {
    if (!window.gameState.soundEnabled) return;
    try {
      const audio = new AudioContext();
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.connect(gain); gain.connect(audio.destination);
      osc.frequency.value = 800; osc.type = 'sine';
      gain.gain.setValueAtTime(0.1, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.1);
      osc.start(audio.currentTime); osc.stop(audio.currentTime + 0.1);
    } catch(e) {}
  },
  success: () => {
    if (!window.gameState.soundEnabled) return;
    try {
      const audio = new AudioContext();
      [523, 659, 784].forEach((freq, i) => {
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.connect(gain); gain.connect(audio.destination);
        osc.frequency.value = freq; osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, audio.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + i * 0.1 + 0.2);
        osc.start(audio.currentTime + i * 0.1);
        osc.stop(audio.currentTime + i * 0.1 + 0.2);
      });
    } catch(e) {}
  },
  error: () => {
    if (!window.gameState.soundEnabled) return;
    try {
      const audio = new AudioContext();
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.connect(gain); gain.connect(audio.destination);
      osc.frequency.value = 200; osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.15, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.3);
      osc.start(audio.currentTime); osc.stop(audio.currentTime + 0.3);
    } catch(e) {}
  },
  coin: () => {
    if (!window.gameState.soundEnabled) return;
    try {
      const audio = new AudioContext();
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.connect(gain); gain.connect(audio.destination);
      osc.frequency.value = 1200; osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.15);
      osc.start(audio.currentTime); osc.stop(audio.currentTime + 0.15);
    } catch(e) {}
  }
};

// Animación de monedas
function createCoinRain(amount) {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(container);
  for (let i = 0; i < 25; i++) {
    const coin = document.createElement('div');
    coin.textContent = '🪙';
    coin.style.cssText = `position:absolute;font-size:28px;left:${Math.random()*100}%;top:-50px;animation:coinFall ${2+Math.random()*2}s ease-in forwards;animation-delay:${Math.random()*0.5}s;`;
    container.appendChild(coin);
    setTimeout(() => sounds.coin(), i * 50);
  }
  const msg = document.createElement('div');
  msg.textContent = `💰 +${amount} VC`;
  msg.style.cssText = `position:absolute;top:30%;left:50%;transform:translateX(-50%);font-size:48px;font-weight:bold;color:var(--accent);text-shadow:0 0 20px var(--accent);animation:floatUp 2s ease-out forwards;`;
  container.appendChild(msg);
  setTimeout(() => container.remove(), 4000);
}

// ============================================
// NOTIFICACIONES FLOTANTES XP / VC
// ============================================
function showFloatingReward(xp, coins) {
  const container = document.getElementById('floatingRewards') || createFloatingContainer();

  if (xp > 0) {
    const el = document.createElement('div');
    el.className = 'floating-reward xp-reward';
    el.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" fill="#ffa000"/>
      </svg>
      +${xp} XP`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }

  if (coins > 0) {
    const el = document.createElement('div');
    el.className = 'floating-reward vc-reward';
    el.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#00e676" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="#00e676" opacity="0.5"/>
      </svg>
      +${coins} VC`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }
}

function createFloatingContainer() {
  const div = document.createElement('div');
  div.id = 'floatingRewards';
  div.style.cssText = 'position:fixed;top:80px;right:20px;z-index:9998;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
  document.body.appendChild(div);
  return div;
}

// ============================================
// ANIMACIÓN DE RANK UP
// ============================================
function showRankUpAnimation(rank) {
  sounds.success();
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(7,10,15,0.95);z-index:9999;
    display:flex;align-items:center;justify-content:center;
    animation:fadeIn 0.3s ease;`;
  overlay.innerHTML = `
    <div style="text-align:center;animation:rankUpIn 0.5s cubic-bezier(0.16,1,0.3,1);">
      <div style="margin-bottom:20px;filter:drop-shadow(0 0 30px ${rank.color});">
        ${rank.avatarSVG.replace('width="60"','width="120"').replace('height="60"','height="120"')}
      </div>
      <div style="font-family:var(--font-display);font-size:12px;letter-spacing:3px;
                  color:var(--muted);text-transform:uppercase;margin-bottom:8px;">
        ASCENSO DE RANGO
      </div>
      <div style="font-family:var(--font-display);font-size:28px;font-weight:900;
                  color:${rank.color};text-shadow:0 0 30px ${rank.color};
                  letter-spacing:2px;margin-bottom:20px;">
        ${rank.name.toUpperCase()}
      </div>
      <p style="color:var(--muted);max-width:320px;margin:0 auto 24px;font-size:14px;line-height:1.6;">
        Tu avatar ha evolucionado. NexCorp reconoce tu nivel.
      </p>
      <button class="btn" onclick="this.closest('div[style*=fixed]').remove()" style="letter-spacing:2px;">
        CONTINUAR MISIÓN →
      </button>
    </div>`;
  document.body.appendChild(overlay);
  setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 6000);
}

// ============================================
// ANIMACIÓN DE INSIGNIA DESBLOQUEADA
// ============================================
function showBadgeUnlock(badge) {
  sounds.success();
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;bottom:30px;left:50%;transform:translateX(-50%);
    background:var(--card);border:2px solid var(--primary);
    border-radius:14px;padding:16px 24px;z-index:9997;
    display:flex;align-items:center;gap:14px;
    box-shadow:0 0 40px rgba(255,160,0,0.3);
    animation:badgeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1);
    min-width:280px;`;
  el.innerHTML = `
    <div style="font-size:36px;filter:drop-shadow(0 0 10px var(--primary));">${badge.icon}</div>
    <div>
      <div style="font-size:10px;letter-spacing:2px;color:var(--primary);
                  font-family:var(--font-display);text-transform:uppercase;margin-bottom:3px;">
        INSIGNIA DESBLOQUEADA
      </div>
      <div style="font-weight:700;color:var(--text-hi);font-size:15px;">${badge.name}</div>
      <div style="font-size:12px;color:var(--muted);">${badge.desc}</div>
    </div>`;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'badgeSlideDown 0.3s ease forwards';
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

// Inyectar estilos de animaciones
const rewardStyles = document.createElement('style');
rewardStyles.textContent = `
  .floating-reward {
    display:flex;align-items:center;gap:6px;
    padding:8px 14px;border-radius:8px;
    font-family:var(--font-display);font-size:13px;font-weight:700;
    letter-spacing:1px;animation:rewardFloat 2s ease forwards;
    pointer-events:none;white-space:nowrap;
  }
  .xp-reward { background:rgba(255,160,0,0.15);border:1px solid rgba(255,160,0,0.4);color:#ffa000; }
  .vc-reward { background:rgba(0,230,118,0.1);border:1px solid rgba(0,230,118,0.3);color:#00e676; }
  @keyframes rewardFloat {
    0%   { opacity:0; transform:translateY(10px) scale(0.8); }
    20%  { opacity:1; transform:translateY(0) scale(1); }
    70%  { opacity:1; transform:translateY(-20px); }
    100% { opacity:0; transform:translateY(-40px); }
  }
  @keyframes rankUpIn {
    from { opacity:0; transform:scale(0.8) translateY(30px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  @keyframes badgeSlideUp {
    from { opacity:0; transform:translateX(-50%) translateY(20px); }
    to   { opacity:1; transform:translateX(-50%) translateY(0); }
  }
  @keyframes badgeSlideDown {
    from { opacity:1; transform:translateX(-50%) translateY(0); }
    to   { opacity:0; transform:translateX(-50%) translateY(20px); }
  }
`;
document.head.appendChild(rewardStyles);

// ============================================
// TEMA Y SONIDO
// ============================================
window.toggleTheme = function() {
  sounds.click();
  const newTheme = window.gameState.theme === 'light' ? 'dark' : 'light';
  window.gameState.theme = newTheme;
  document.documentElement.setAttribute('data-theme', newTheme);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.innerHTML = newTheme === 'light'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="var(--primary)" stroke-width="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="var(--primary)" stroke-width="2" stroke-linecap="round"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="var(--primary)" stroke-width="2" fill="none"/></svg>`;
  }
  saveGameState();
};

window.toggleSound = function() {
  window.gameState.soundEnabled = !window.gameState.soundEnabled;
  const btn = document.getElementById('soundToggle');
  if (btn) {
    btn.innerHTML = window.gameState.soundEnabled
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke="var(--primary)" stroke-width="2" fill="none"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="var(--primary)" stroke-width="2" stroke-linecap="round"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke="var(--muted)" stroke-width="2" fill="none"/><line x1="23" y1="9" x2="17" y2="15" stroke="var(--danger)" stroke-width="2"/><line x1="17" y1="9" x2="23" y2="15" stroke="var(--danger)" stroke-width="2"/></svg>`;
  }
  if (window.gameState.soundEnabled) sounds.click();
  saveGameState();
};

window.logoutUser = function() {
  sounds.click();
  if (confirm('¿Deseas cambiar de operador? Tu progreso está guardado en la nube.')) {
    window.currentUserIndex = -1;
    localStorage.setItem('nexusSQL_currentUser', '-1');
    document.getElementById('mainApp').classList.add('hidden');
    if (typeof window.showAuthScreen === 'function') {
      window.showAuthScreen();
    } else {
      location.reload();
    }
  }
};

// ============================================
// GESTIÓN DE USUARIOS
// ============================================
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
  if (confirm('¿Eliminar este operador? Esta acción no se puede deshacer.')) {
    window.userProfiles.splice(index, 1);
    localStorage.setItem('nexusSQL_users', JSON.stringify(window.userProfiles));
    showUserSelection();
  }
};

function getAvatarIcon(avatarIndex, equipped) {
  if (equipped && equipped.avatar) {
    const item = shopItems.find(i => i.id === equipped.avatar);
    if (item) return item.icon;
  }
  const defaults = ['🎮', '💼', '🧘'];
  return defaults[avatarIndex] || '🎮';
}

function showUserSelection() {
  if (window.userProfiles.length === 0) { startOnboarding(); return; }
  const content = document.getElementById('modalGenericContent');
  let html = '<h2>👥 Selecciona Operador</h2><div style="margin:20px 0;">';
  window.userProfiles.forEach((user, index) => {
    const icon = getAvatarIcon(user.avatar, user.equippedItems);
    html += `
      <div style="background:var(--card);padding:20px;margin:15px 0;border-radius:12px;border:2px solid var(--primary);display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:15px;">
          <span style="font-size:48px;">${icon}</span>
          <div>
            <div style="font-size:20px;font-weight:bold;">${user.playerName}</div>
            <div style="font-size:12px;color:var(--muted);">${user.rank || 'Analista JR'}</div>
            <div style="font-size:14px;color:var(--muted);">⭐ ${user.xp} XP | 🪙 ${user.coins} VC</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn" onclick="switchUser(${index})">▶️ Jugar</button>
          <button class="btn btn-ghost" onclick="deleteUser(${index})" style="background:var(--danger);">🗑️</button>
        </div>
      </div>`;
  });
  if (window.userProfiles.length < 3) {
    html += `<button class="btn btn-secondary" onclick="closeModal('modalGeneric');startOnboarding();" style="width:100%;margin-top:20px;">➕ Nuevo Operador</button>`;
  }
  html += '</div>';
  content.innerHTML = html;
  document.getElementById('modalGeneric').classList.add('active');
}

function loadUserProfile(index) {
  const u = window.userProfiles[index];
  Object.assign(window.gameState, {
    id: u.id || null,
    pinHash: u.pinHash || null,    // ← necesario para que Firebase lo guarde
    playerName: u.playerName, avatar: u.avatar, xp: u.xp, coins: u.coins,
    streak: u.streak || 0, currentChallenge: u.currentChallenge || 1,
    currentSubExercise: u.currentSubExercise || 1, currentDay: u.currentDay || 1,
    completedChallenges: u.completedChallenges || [],
    completedSubExercises: u.completedSubExercises || {},
    unlockedBadges: u.unlockedBadges || [],
    unlockedItems: u.unlockedItems || [],
    equippedItems: u.equippedItems || {},
    kitBenefits: u.kitBenefits || starterKits[u.avatar || 0].benefits,
    hintsRemaining: u.hintsRemaining || 0,
    attemptLimit: u.attemptLimit || 3,
    reputation: u.reputation || { ana: 0, roberto: 0 },
    diary: u.diary || [],
    skills: u.skills || { SELECT: 0, WHERE: 0, ORDER: 0, ADVANCED: 0 },
    expandedChallenges: u.expandedChallenges || [],
    tutorialsSeen: u.tutorialsSeen || [],
    theme: u.theme || 'dark',
    soundEnabled: u.soundEnabled !== false,
    triviaAnswered: u.triviaAnswered || false,
    rank: u.rank || 'Analista JR',
    lastVisit: u.lastVisit || null
  });

  // Sistema de streak — bonus por días consecutivos
  checkAndUpdateStreak();

  if (window.SQL_CONSTRUCTOR) {
    window.gameState.db = new window.SQL_CONSTRUCTOR.Database();
    window.gameState.db.run(dbSeed);
  }
  document.documentElement.setAttribute('data-theme', window.gameState.theme);
}

function checkAndUpdateStreak() {
  const gs = window.gameState;
  const today = new Date().toDateString();
  const lastVisit = gs.lastVisit ? new Date(gs.lastVisit).toDateString() : null;
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastVisit === today) return; // Ya entró hoy, no cambia

  if (lastVisit === yesterday) {
    // Día consecutivo — aumenta streak
    gs.streak += 1;
    gs.lastVisit = new Date().toISOString();

    // Bonus por racha
    const bonusCoins = gs.streak >= 7 ? 100 : gs.streak >= 3 ? 50 : 20;
    const bonusXP = gs.streak >= 7 ? 30 : gs.streak >= 3 ? 15 : 5;
    gs.coins += bonusCoins;
    gs.xp += bonusXP;

    // Notificación de racha (se muestra después de render)
    setTimeout(() => {
      showStreakNotification(gs.streak, bonusCoins, bonusXP);
    }, 1500);

  } else if (!lastVisit) {
    // Primera vez
    gs.streak = 1;
    gs.lastVisit = new Date().toISOString();
  } else {
    // Se rompió la racha
    if (gs.streak > 1) {
      setTimeout(() => showStreakBroken(gs.streak), 1500);
    }
    gs.streak = 1;
    gs.lastVisit = new Date().toISOString();
  }
  saveUserProfile();
}

function showStreakNotification(streak, coins, xp) {
  const el = document.createElement('div');
  const medal = streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '✅';
  el.style.cssText = `
    position:fixed;top:100px;left:50%;transform:translateX(-50%);
    background:var(--card);border:2px solid var(--primary);
    border-radius:14px;padding:16px 28px;z-index:9997;text-align:center;
    box-shadow:0 0 40px rgba(255,160,0,0.3);
    animation:badgeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1);`;
  el.innerHTML = `
    <div style="font-size:32px;margin-bottom:6px;">${medal}</div>
    <div style="font-family:var(--font-display);font-size:12px;letter-spacing:2px;
                color:var(--primary);text-transform:uppercase;margin-bottom:4px;">
      RACHA DE ${streak} DÍA${streak > 1 ? 'S' : ''}
    </div>
    <div style="font-size:13px;color:var(--muted);">
      Bonus: <span style="color:#ffa000;">+${xp} XP</span> · 
      <span style="color:#00e676;">+${coins} VC</span>
    </div>`;
  document.body.appendChild(el);
  setTimeout(() => { el.style.animation='badgeSlideDown 0.3s ease forwards'; setTimeout(()=>el.remove(),300); }, 3500);
}

function showStreakBroken(oldStreak) {
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;top:100px;left:50%;transform:translateX(-50%);
    background:var(--card);border:2px solid var(--danger);
    border-radius:14px;padding:16px 28px;z-index:9997;text-align:center;
    box-shadow:0 0 40px rgba(255,23,68,0.3);
    animation:badgeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1);`;
  el.innerHTML = `
    <div style="font-size:32px;margin-bottom:6px;">💔</div>
    <div style="font-family:var(--font-display);font-size:12px;letter-spacing:2px;
                color:var(--danger);text-transform:uppercase;margin-bottom:4px;">
      RACHA ROTA
    </div>
    <div style="font-size:13px;color:var(--muted);">
      Tu racha de ${oldStreak} días se perdió. ¡Nueva oportunidad hoy!
    </div>`;
  document.body.appendChild(el);
  setTimeout(() => { el.style.animation='badgeSlideDown 0.3s ease forwards'; setTimeout(()=>el.remove(),300); }, 3000);
}

function saveUserProfile() {
  if (window.currentUserIndex >= 0) {
    const snapshot = Object.assign({}, window.gameState);
    delete snapshot.db;
    window.userProfiles[window.currentUserIndex] = snapshot;
    localStorage.setItem('nexusSQL_users', JSON.stringify(window.userProfiles));
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================
async function init() {
  const texts = [
    'Detectando virus The Void...',
    'Restaurando nodos de NexCorp...',
    'Inicializando terminal NEXUS SQL...',
    'Preparando protocolo de emergencia...'
  ];
  let ti = 0;
  const interval = setInterval(() => {
    const el = document.getElementById('loadingText');
    if (el) el.textContent = texts[ti];
    ti = (ti + 1) % texts.length;
  }, 800);

  try {
    await initSqlJs({ locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${f}` })
      .then(SQL => {
        window.SQL_CONSTRUCTOR = SQL;
        window.gameState.db = new SQL.Database();
        window.gameState.db.run(dbSeed);
        clearInterval(interval);
        setTimeout(async () => {
          document.getElementById('loadingScreen').classList.add('hidden');
          if (window.currentUserIndex >= 0 && window.userProfiles[window.currentUserIndex]) {
            // Cargar local inmediatamente para no bloquear
            loadUserProfile(window.currentUserIndex);
            document.getElementById('mainApp').classList.remove('hidden');
            renderGame(); createParticles(); updateAvatars();

            // En paralelo: verificar si Firebase tiene datos más recientes
            const localUser = window.userProfiles[window.currentUserIndex];
            if (localUser?.id && typeof window._loadUserById === 'function') {
              await waitForFirebase(3000);
              const cloudState = await window._loadUserById(localUser.id);
              if (cloudState) {
                const cloudTime = cloudState.lastVisit ? new Date(cloudState.lastVisit).getTime() : 0;
                const localTime = localUser.lastVisit ? new Date(localUser.lastVisit).getTime() : 0;
                if (cloudTime > localTime) {
                  // Nube tiene datos más recientes — actualizar sin recargar
                  const merged = Object.assign({}, cloudState, { pinHash: localUser.pinHash });
                  window.userProfiles[window.currentUserIndex] = merged;
                  localStorage.setItem('nexusSQL_users', JSON.stringify(window.userProfiles));
                  loadUserProfile(window.currentUserIndex);
                  renderGame(); updateAvatars(); updateStats();
                  renderChallenges(); updateProgressBar(); updateSkillBars();
                }
              }
            }
          } else {
            if (typeof window.showAuthScreen === 'function') {
              window.showAuthScreen();
            } else {
              showUserSelection();
            }
          }
        }, 3000);
      });
  } catch(e) {
    clearInterval(interval);
    alert('Error cargando SQL: ' + e.message);
  }
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();

function saveGameState() {
  saveUserProfile();
  // Guardar en Firebase cada vez que hay cambio importante
  if (typeof window.saveProgressToCloud === 'function') {
    window.saveProgressToCloud();
  }
}

// ============================================
// ONBOARDING — Historia inmersiva
// ============================================
function startOnboarding() {
  if (window.userProfiles.length >= 3) { alert('Máximo 3 operadores.'); showUserSelection(); return; }
  document.getElementById('onboarding').classList.remove('hidden');
  showOnboardingStep(1);
}

function showOnboardingStep(step) {
  const content = document.getElementById('onboardingContent');
  if (step === 1) {
    content.innerHTML = `
      <div class="logo-animation">
        <svg viewBox="0 0 200 200" style="width:100%;height:100%;">
          <circle cx="100" cy="100" r="80" fill="none" stroke="var(--primary)" stroke-width="3"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="var(--secondary)" stroke-width="1" stroke-dasharray="5,5"/>
          <text x="100" y="115" text-anchor="middle" font-size="52" fill="var(--primary)">⚡</text>
        </svg>
      </div>
      <h1 style="font-size:32px;color:var(--primary);margin-bottom:10px;letter-spacing:3px;">NEXUS SQL</h1>
      <p style="color:var(--muted);font-size:13px;margin-bottom:5px;text-transform:uppercase;letter-spacing:2px;">Protocolo de Emergencia</p>
      <p style="font-size:13px;color:var(--muted);margin-bottom:30px;">NexCorp Industries · AXIOM Motors</p>
      <button class="btn" onclick="showOnboardingStep(2)" style="font-size:18px;padding:16px 32px;">⚡ Iniciar Protocolo</button>`;
  } else if (step === 2) {
    content.innerHTML = `
      <div style="text-align:left;margin-bottom:20px;">
        <div style="background:rgba(239,68,68,0.15);border:2px solid var(--danger);border-radius:12px;padding:20px;margin-bottom:20px;">
          <h3 style="color:var(--danger);margin-bottom:12px;">⚡ ALERTA CRÍTICA — NexCorp Industries</h3>
          <p style="font-style:italic;line-height:1.7;font-size:15px;">
            "El virus <strong>'The Void'</strong> ha penetrado todos los nodos visuales de
            <strong>AXIOM Motors</strong>. Los datos están ahí — inventarios, clientes, ventas —
            pero están completamente ciegos. Sin acceso al servidor,
            <strong>NexCorp declarará quiebra técnica en 24 horas</strong>.
            No hay tiempo para inducción. O aprendes SQL hoy,
            o mañana ninguno de los dos tiene trabajo."
          </p>
          <p style="color:var(--primary);font-weight:bold;margin-top:10px;">— Ing. Ana, Arquitecta NEXUS</p>
        </div>
      </div>
      <h2 style="color:var(--primary);margin-bottom:20px;text-align:center;">Identificación de Operador</h2>
      <input type="text" id="nameInput" class="input-name" placeholder="Tu nombre (3-15 caracteres)" maxlength="15">
      <button class="btn" onclick="saveName()" style="width:100%;margin-top:15px;">Continuar →</button>`;
    setTimeout(() => document.getElementById('nameInput')?.focus(), 100);
  } else if (step === 3) {
    const kitIcons = {
      0: `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="14" width="40" height="28" rx="4" fill="#1a0a00" stroke="#ff6d00" stroke-width="2"/>
        <rect x="10" y="20" width="28" height="16" rx="2" fill="#ff6d00" opacity="0.15"/>
        <circle cx="24" cy="28" r="5" fill="none" stroke="#ff6d00" stroke-width="2"/>
        <circle cx="24" cy="28" r="2" fill="#ff6d00"/>
        <path d="M14 8h20l2 6H12z" fill="#ff6d00" opacity="0.6"/>
        <rect x="8" y="40" width="6" height="3" rx="1" fill="#ff6d00" opacity="0.5"/>
        <rect x="34" y="40" width="6" height="3" rx="1" fill="#ff6d00" opacity="0.5"/>
      </svg>`,
      1: `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="6" width="28" height="36" rx="3" fill="#1a1000" stroke="#ffa000" stroke-width="2"/>
        <rect x="14" y="12" width="20" height="3" rx="1" fill="#ffa000" opacity="0.7"/>
        <rect x="14" y="18" width="14" height="2" rx="1" fill="#ffa000" opacity="0.4"/>
        <rect x="14" y="23" width="16" height="2" rx="1" fill="#ffa000" opacity="0.4"/>
        <rect x="14" y="28" width="12" height="2" rx="1" fill="#ffa000" opacity="0.4"/>
        <circle cx="33" cy="34" r="7" fill="#1a1000" stroke="#ffa000" stroke-width="2"/>
        <path d="M30 34l2 2 4-4" stroke="#ffa000" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
      2: `<svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="20" r="12" fill="#001a0d" stroke="#00e676" stroke-width="2"/>
        <circle cx="24" cy="20" r="6" fill="none" stroke="#00e676" stroke-width="1" opacity="0.5"/>
        <circle cx="24" cy="20" r="2" fill="#00e676"/>
        <path d="M24 8v-3M24 35v3M36 20h3M9 20H6" stroke="#00e676" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
        <path d="M16 32 C12 38 8 42 6 44" stroke="#00e676" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <path d="M32 32 C36 38 40 42 42 44" stroke="#00e676" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <rect x="14" y="43" width="20" height="3" rx="1.5" fill="#00e676" opacity="0.4"/>
      </svg>`
    };

    content.innerHTML = `
      <h2 style="font-family:var(--font-display);color:var(--primary);margin-bottom:6px;text-align:center;letter-spacing:2px;">ELIGE TU KIT DE INICIO</h2>
      <p style="color:var(--muted);text-align:center;font-size:13px;margin-bottom:24px;">Define tu estilo de juego — los beneficios son reales</p>
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:24px;">
        ${starterKits.map(kit => `
          <div class="kit-option ${kit.id === 0 ? 'kit-selected' : ''}" data-kit="${kit.id}"
               onclick="selectKit(${kit.id})"
               style="background:var(--bg2);border:2px solid ${kit.id === 0 ? kit.accentColor : 'var(--border)'};
                      border-radius:12px;padding:16px;cursor:pointer;transition:all 0.2s;
                      display:flex;align-items:center;gap:16px;">
            <div style="width:56px;height:56px;flex-shrink:0;display:flex;align-items:center;justify-content:center;
                        background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid ${kit.accentColor}33;">
              ${kitIcons[kit.id]}
            </div>
            <div style="flex:1;text-align:left;">
              <div style="font-family:var(--font-display);font-size:14px;font-weight:700;color:${kit.accentColor};
                          letter-spacing:1px;margin-bottom:3px;">${kit.name} <span style="font-size:11px;opacity:0.7;">— ${kit.sub}</span></div>
              <div style="font-size:12px;color:var(--muted);margin-bottom:6px;">${kit.desc}</div>
              <div style="font-size:11px;font-family:var(--font-mono);color:${kit.accentColor};
                          background:${kit.accentColor}15;padding:4px 10px;border-radius:4px;
                          display:inline-block;letter-spacing:1px;">${kit.benefits.label}</div>
            </div>
          </div>`).join('')}
      </div>
      <button class="btn" onclick="showOnboardingStep(4)" style="width:100%;">Continuar →</button>`;

    // Marcar el primero como seleccionado por defecto
    window.gameState.avatar = 0;
  } else if (step === 4) {
    const name = window.gameState.playerName;
    content.innerHTML = `
      <div style="text-align:left;">
        <h2 style="color:var(--primary);text-align:center;margin-bottom:20px;">📋 Tu Misión, ${name}</h2>
        <div style="background:rgba(0,217,255,0.08);border:1px solid var(--primary);border-radius:12px;padding:20px;margin-bottom:15px;">
          <p style="line-height:1.8;">
            Eres el nuevo <strong>Analista JR de Sistemas</strong> en NexCorp Industries.
            Tu primera semana debería ser inducción, café y presentaciones.
          </p>
          <p style="line-height:1.8;margin-top:10px;">
            Pero The Void llegó primero.
          </p>
          <p style="line-height:1.8;margin-top:10px;">
            Tienes acceso al servidor de <strong>AXIOM Motors GDL</strong>.
            Roberto, el Gerente Regional, lleva 3 horas sin poder ver un solo dato.
            La Ing. Ana te guiará con los comandos.
          </p>
          <p style="line-height:1.8;margin-top:10px;color:var(--accent);font-weight:bold;">
            Cada consulta que escribas correctamente restaura un nodo del sistema.
          </p>
        </div>
        <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:15px;margin-bottom:20px;">
          <p style="font-size:13px;color:var(--muted);">
            💡 <strong>Reglas del protocolo:</strong> No puedes avanzar sin completar el ejercicio anterior.
            Si te atascas, tienes pistas y ejemplos. Nadie aprende SQL leyendo — lo aprenden haciendo.
          </p>
        </div>
        <button class="btn" onclick="startAdventure()" style="width:100%;font-size:18px;">⚡ ¡Acepto la Misión!</button>
      </div>`;
  }
}

window.saveName = function() {
  sounds.click();
  const name = document.getElementById('nameInput').value.trim();
  if (name.length < 3 || name.length > 15) { sounds.error(); alert('El nombre debe tener entre 3 y 15 caracteres'); return; }
  window.gameState.playerName = name;
  showOnboardingStep(3);
};

window.selectKit = function(index) {
  sounds.click();
  window.gameState.avatar = index;
  document.querySelectorAll('.kit-option').forEach(el => {
    const kitId = parseInt(el.dataset.kit);
    const kit = starterKits[kitId];
    el.style.borderColor = kitId === index ? kit.accentColor : 'var(--border)';
    el.style.background = kitId === index ? `${kit.accentColor}10` : 'var(--bg2)';
  });
};

// Mantener selectAvatar como alias
window.selectAvatar = window.selectKit;

window.startAdventure = function() {
  sounds.success();
  window.gameState.lastVisit = new Date().toISOString();
  window.gameState.currentDay = 1;

  // Aplicar beneficios del Kit elegido
  const kit = starterKits[window.gameState.avatar] || starterKits[0];
  window.gameState.coins = kit.benefits.coinsStart;
  window.gameState.kitBenefits = kit.benefits;
  window.gameState.hintsRemaining = kit.benefits.hintsBonus;
  window.gameState.attemptLimit = 3 + (kit.benefits.extraAttempts || 0);
  window.gameState.diary.push({ day: 0, entry: `Primer día en NexCorp. Elegí el ${kit.name}. The Void no sabe con quién se metió.` });
  for (let i = 1; i <= 10; i++) window.gameState.completedSubExercises[i] = [];

  const snapshot = Object.assign({}, window.gameState);
  delete snapshot.db;

  // Asegurar que pinHash del usuario local se conserva en el snapshot
  const localUsers = JSON.parse(localStorage.getItem('nexusSQL_users') || '[]');
  const currentUser = localUsers[window.currentUserIndex];
  if (currentUser?.pinHash && !snapshot.pinHash) {
    snapshot.pinHash = currentUser.pinHash;
  }

  // Si el usuario ya existe en userProfiles (viene de Firebase), actualizar — no duplicar
  const existingIdx = window.userProfiles.findIndex(u =>
    u.playerName === snapshot.playerName || u.id === snapshot.id
  );

  if (existingIdx >= 0) {
    // Actualizar el usuario existente con los datos del Kit
    window.userProfiles[existingIdx] = Object.assign(window.userProfiles[existingIdx], snapshot);
    window.currentUserIndex = existingIdx;
  } else {
    // Usuario completamente nuevo (flujo original sin Firebase)
    window.userProfiles.push(snapshot);
    window.currentUserIndex = window.userProfiles.length - 1;
  }

  localStorage.setItem('nexusSQL_users', JSON.stringify(window.userProfiles));
  localStorage.setItem('nexusSQL_currentUser', window.currentUserIndex);

  // Guardar en Firebase si está disponible
  if (typeof window.saveProgressToCloud === 'function') {
    window.saveProgressToCloud();
  }

  document.getElementById('onboarding').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
  renderGame(); createParticles(); updateAvatars();
};

// ============================================
// PARTÍCULAS Y AVATARES
// ============================================
function createParticles() {
  const container = document.getElementById('particles');
  container.innerHTML = '';
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 15 + 's';
    p.style.animationDuration = (15 + Math.random() * 10) + 's';
    container.appendChild(p);
  }
}

function updateAvatars() {
  const icon = getAvatarIcon(window.gameState.avatar, window.gameState.equippedItems);
  const h = document.getElementById('headerAvatar');
  const p = document.getElementById('panelAvatar');
  if (h) h.textContent = icon;
  if (p) p.textContent = icon;
}

// ============================================
// RENDER PRINCIPAL
// ============================================
function renderGame() {
  updateStats();
  renderChallenges();
  loadChallenge(window.gameState.currentChallenge, window.gameState.currentSubExercise);
  updateProgressBar();
  updateSkillBars();
}

function updateStats() {
  const gs = window.gameState;
  const rank = getRank(gs.xp);
  const nextRank = getNextRank(gs.xp);
  const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setTxt('playerName', gs.playerName || 'Operador');
  setTxt('playerNamePanel', gs.playerName || 'Operador');
  setTxt('playerRank', rank.name);

  // Avatar SVG dinámico según rango
  const panelAvatar = document.getElementById('panelAvatar');
  if (panelAvatar) {
    panelAvatar.innerHTML = rank.avatarSVG;
    panelAvatar.style.cssText = `display:block;filter:drop-shadow(0 0 16px ${rank.color});`;
  }
  const rankPanel = document.getElementById('playerRankPanel');
  if (rankPanel) rankPanel.innerHTML = `<span style="color:${rank.color};font-family:var(--font-display);font-size:11px;letter-spacing:2px;">${rank.name}</span>`;

  // Barra de progreso al siguiente rango
  const rankBar = document.getElementById('rankProgressBar');
  const rankLabel = document.getElementById('rankProgressLabel');
  if (rankBar) {
    const pct = nextRank ? Math.round(((gs.xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100) : 100;
    rankBar.style.width = pct + '%';
    rankBar.style.background = nextRank ? `linear-gradient(90deg,${rank.color},${nextRank.color})` : rank.color;
    rankBar.style.boxShadow = `0 0 12px ${rank.color}80`;
  }
  if (rankLabel) rankLabel.textContent = nextRank ? `${gs.xp} / ${nextRank.minXP} XP → ${nextRank.name}` : `RANGO MÁXIMO — ${gs.xp} XP`;

  // Stats SVG
  const xpEl = document.getElementById('statXP');
  const vcEl = document.getElementById('statVC');
  const strEl = document.getElementById('statStreak');
  if (xpEl) xpEl.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" style="flex-shrink:0"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" fill="${rank.color}"/></svg><span>${gs.xp} XP</span>`;
  if (vcEl) vcEl.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" style="flex-shrink:0"><circle cx="12" cy="12" r="9" stroke="#ffa000" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="#ffa000" opacity="0.3"/><path d="M10 9h4M10 12h3M10 15h2" stroke="#ffa000" stroke-width="1.5" stroke-linecap="round"/></svg><span>${gs.coins} VC</span>`;
  if (strEl) strEl.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" style="flex-shrink:0"><path d="M12 2C8 7 6 10 6 14a6 6 0 0012 0c0-4-2-7-6-12z" fill="#ff6d00"/><path d="M12 8C10.5 11 10 13 10 15a2 2 0 004 0c0-2-.5-4-2-7z" fill="#ffcc80"/></svg><span>${gs.streak} días</span>`;
}

function renderChallenges() {
  const list = document.getElementById('challengeList');
  list.innerHTML = '';
  for (let i = 1; i <= 1; i++) {
    const ch = challenges[i];
    const completed = window.gameState.completedSubExercises[i] || [];
    const isCurrent = window.gameState.currentChallenge === i;
    const isExpanded = window.gameState.expandedChallenges.includes(i);
    const isFullDone = completed.length === 10;
    const div = document.createElement('div');
    div.className = `challenge-item ${isCurrent?'active':''} ${isFullDone?'completed':''} ${isExpanded?'expanded':''}`;
    let subsHTML = '';
    if (isExpanded) {
      subsHTML = '<div class="sub-exercises">';
      ch.subExercises.forEach(sub => {
        const subDone = completed.includes(sub.id);
        const subCurrent = isCurrent && window.gameState.currentSubExercise === sub.id;
        subsHTML += `<div class="sub-exercise ${subDone?'completed':''} ${subCurrent?'active':''}" onclick="loadSubExercise(${i},${sub.id});event.stopPropagation();">${i}.${sub.id} ${sub.desc} ${subDone?'✓':''}</div>`;
      });
      subsHTML += '</div>';
    }
    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;">
        <div style="font-weight:bold;">${isExpanded?'▼':'▶'} ${i}. ${ch.title}</div>
        <div style="font-size:11px;">[${completed.length}/10]</div>
      </div>
      <div style="font-size:12px;margin-top:4px;">${'⭐'.repeat(ch.difficulty)}</div>
      ${subsHTML}`;
    div.onclick = e => { if (e.target.classList.contains('sub-exercise')) return; sounds.click(); toggleChallengeExpansion(i); };
    list.appendChild(div);
  }
}

function toggleChallengeExpansion(id) {
  const idx = window.gameState.expandedChallenges.indexOf(id);
  idx > -1 ? window.gameState.expandedChallenges.splice(idx, 1) : window.gameState.expandedChallenges.push(id);
  saveGameState(); renderChallenges();
}

window.loadSubExercise = function(cId, sId) {
  sounds.click();
  window.gameState.currentChallenge = cId;
  window.gameState.currentSubExercise = sId;
  const done = window.gameState.completedSubExercises[cId] || [];
  window.gameState.practiceMode = done.includes(sId);
  saveGameState(); renderChallenges(); loadChallenge(cId, sId);
};

function loadChallenge(cId, sId) {
  const ch = challenges[cId];
  if (ch.hasTutorial && sId === 1 && !window.gameState.tutorialsSeen.includes(cId)) showTutorial(cId);
  const sub = ch.subExercises.find(s => s.id === sId);
  const narr = narrativeDialogues[cId] && narrativeDialogues[cId][sId] ? narrativeDialogues[cId][sId]() : null;
  const banner = document.getElementById('practiceBanner');
  const dayCounter = `<div style="text-align:center;padding:8px;background:linear-gradient(90deg,var(--primary) 0%,var(--secondary) 100%);color:white;font-weight:bold;border-radius:8px;margin-bottom:10px;border:2px solid var(--primary);">⏰ DÍA ${window.gameState.currentDay}/40 — Nodo GDL</div>`;
  banner.innerHTML = window.gameState.practiceMode ? dayCounter + '<div class="practice-mode-banner">🎯 MODO PRÁCTICA</div>' : dayCounter;
  const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setTxt('challengeTitle', `${cId}. ${ch.title}`);
  document.getElementById('challengeDesc').textContent = `Ejercicio ${cId}.${sId}: ${sub.desc}`;
  document.getElementById('npcDialogue').innerHTML = narr ? `<div class="npc-dialogue">${narr}</div>` : '';
  document.getElementById('conceptBox').innerHTML = ch.concept;
  document.getElementById('sqlEditor').value = '-- Escribe tu consulta SQL aquí\n';
  document.getElementById('results').innerHTML = '<strong>📊 Resultados</strong><p style="color:var(--muted);margin-top:10px;">Ejecuta tu consulta...</p>';
  window.gameState.attempts = 0;
  window.gameState.exampleUnlocked = false;
  updateAttemptCounter();
}

function updateProgressBar() {
  let total = 0;
  for (let i = 1; i <= 1; i++) total += (window.gameState.completedSubExercises[i] || []).length;
  const pct = Math.round((total / 10) * 100);
  const el = document.getElementById('worldProgress');
  const bar = document.getElementById('worldProgressBar');
  if (el) el.textContent = `${total}/10`;
  if (bar) { bar.style.width = pct + '%'; bar.textContent = pct + '%'; }
  const stars = document.getElementById('lorenzoRep');
  if (stars) {
    const rep = Math.floor(window.gameState.reputation.ana);
    stars.innerHTML = '';
    for (let i = 0; i < 3; i++) stars.innerHTML += `<span class="star ${i<rep?'':'empty'}">★</span>`;
  }
}

function updateSkillBars() {
  ['SELECT','WHERE','ORDER','ADVANCED'].forEach(s => {
    const el = document.getElementById(`skill${s}`);
    if (el) { const pct = Math.min(100, window.gameState.skills[s]); el.style.width = pct+'%'; el.textContent = pct+'%'; }
  });
}

// ============================================
// EJECUCIÓN DE QUERIES
// ============================================
window.executeQuery = function() {
  sounds.click();
  const query = document.getElementById('sqlEditor').value.trim();
  if (!query || query === '-- Escribe tu consulta SQL aquí' || query === '-- Escribe tu consulta BOSS aquí') {
    sounds.error(); alert('Escribe una consulta primero'); return;
  }
  if (window.gameState.currentSubExercise === 'BOSS') {
    try { const r = window.gameState.db.exec(query); displayResults(r, query); checkBossSolution(query, r); }
    catch(e) { sounds.error(); displayError(e.message, query); window.gameState.attempts++; updateAttemptCounter(); }
    return;
  }
  try { const r = window.gameState.db.exec(query); displayResults(r, query); checkSolution(query, r); }
  catch(e) { sounds.error(); displayError(e.message, query); window.gameState.attempts++; updateAttemptCounter(); }
};

function displayResults(results, query) {
  const c = document.getElementById('results');
  c.innerHTML = `<strong>📊 Resultados de tu consulta</strong><div style="background:#0d1117;color:#00ff41;padding:10px;border-radius:8px;margin:10px 0;font-family:monospace;font-size:13px;border:1px solid var(--primary);">${query}</div>`;
  if (!results || results.length === 0) { c.innerHTML += '<p style="color:var(--muted);margin-top:10px;">✅ Ejecutada. 0 filas.</p>'; return; }
  const res = results[0];
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const trH = document.createElement('tr');
  res.columns.forEach(col => { const th = document.createElement('th'); th.textContent = col; trH.appendChild(th); });
  thead.appendChild(trH); table.appendChild(thead);
  const tbody = document.createElement('tbody');
  res.values.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => { const td = document.createElement('td'); td.textContent = cell === null ? 'NULL' : cell; tr.appendChild(td); });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  c.appendChild(table);
  const count = document.createElement('div');
  count.style.cssText = 'margin-top:10px;font-size:14px;color:var(--muted);';
  count.textContent = `📋 ${res.values.length} fila(s) encontrada(s)`;
  c.appendChild(count);
}

function displayError(message, query) {
  const c = document.getElementById('results');
  c.innerHTML = `<strong style="color:var(--danger);">❌ Error en tu consulta</strong>
    <div style="background:#0d1117;color:#ff4444;padding:10px;border-radius:8px;margin:10px 0;font-family:monospace;font-size:13px;border:1px solid var(--danger);">${query}</div>`;
  const box = document.createElement('div');
  box.style.cssText = 'background:rgba(239,68,68,0.1);padding:15px;border-radius:8px;margin:10px 0;border:2px solid var(--danger);';
  let exp = '';
  if (message.includes('no such column')) {
    const col = message.split(':')[1]?.trim() || '?';
    exp = `<h3 style="color:var(--danger);margin-bottom:10px;">🔍 Columna no encontrada: "${col}"</h3>
      <p>1️⃣ ¿Olvidaste comillas? El texto va entre 'comillas simples'<br>
      2️⃣ ¿Nombre correcto? Columnas: <code>C_VIN, C_Marca, C_Modelo, C_Anio, C_Color, C_Precio, C_Stock</code></p>`;
  } else if (message.includes('syntax error')) {
    exp = `<h3 style="color:var(--danger);margin-bottom:10px;">🔍 Error de sintaxis</h3>
      <pre style="background:#0d1117;color:#00ff41;padding:10px;border-radius:4px;border:1px solid var(--primary);">SELECT columnas\nFROM tabla\nWHERE condición;</pre>
      <p style="margin-top:10px;">¿Separaste columnas con comas? ¿El texto va entre 'comillas'?</p>`;
  } else {
    exp = `<pre style="color:var(--danger);">${message}</pre>`;
  }
  box.innerHTML = exp;
  c.appendChild(box);
}

function normalize(q) {
  return q.toLowerCase().replace(/\s+/g,' ').replace(/;+/g,'').replace(/\t|\n|\r/g,' ')
    .replace(/\(/g,' ( ').replace(/\)/g,' ) ').replace(/,/g,' , ').replace(/\s+/g,' ').trim();
}

function checkSolution(userQuery, results) {
  const cId = window.gameState.currentChallenge;
  const sId = window.gameState.currentSubExercise;
  const sub = challenges[cId].subExercises.find(s => s.id === sId);
  const uNorm = normalize(userQuery);
  const eNorm = normalize(sub.expected);
  if (uNorm === eNorm || uNorm.includes(eNorm)) {
    completeSubExercise(cId, sId, results);
  } else {
    sounds.error();
    window.gameState.attempts++;
    updateAttemptCounter();
  }
}

function completeSubExercise(cId, sId, results) {
  const ch = challenges[cId];
  const done = window.gameState.completedSubExercises[cId] || [];
  let xpG = 0, coinsG = 0;
  if (!window.gameState.practiceMode && !done.includes(sId)) {
    done.push(sId);
    window.gameState.completedSubExercises[cId] = done;
    xpG = Math.ceil(ch.xp / 10);
    coinsG = Math.ceil(ch.coins / 10);

    // Aplicar multiplicadores del Kit
    const kb = window.gameState.kitBenefits || {};
    xpG = Math.round(xpG * (kb.xpBonus || 1));
    coinsG = Math.round(coinsG * (kb.coinBonus || 1));

    const oldXP = window.gameState.xp;
    window.gameState.xp += xpG;
    window.gameState.coins += coinsG;
    window.gameState.skills[ch.skill] = Math.min(100, window.gameState.skills[ch.skill] + 10);
    window.gameState.reputation.ana = Math.min(3, window.gameState.reputation.ana + 0.3);

    // Verificar rank up
    checkRankUp(oldXP, window.gameState.xp);

    // Insignias con animación
    const badgesToUnlock = [];
    if (sId === 1 && !window.gameState.unlockedBadges.includes('primera')) badgesToUnlock.push('primera');
    if (sId === 4 && !window.gameState.unlockedBadges.includes('glitch'))  badgesToUnlock.push('glitch');
    if (sId === 7 && !window.gameState.unlockedBadges.includes('domador')) badgesToUnlock.push('domador');
    if (sId === 8 && !window.gameState.unlockedBadges.includes('between')) badgesToUnlock.push('between');
    badgesToUnlock.forEach((bid, i) => {
      window.gameState.unlockedBadges.push(bid);
      const badge = allBadges.find(b => b.id === bid);
      if (badge) setTimeout(() => showBadgeUnlock(badge), 500 + i * 1000);
    });

    if (sId === 5 && ch.hasTrivia && !window.gameState.triviaAnswered) { saveGameState(); showTrivia(cId); return; }
    if (done.length === 10 && ch.hasBoss) {
      window.gameState.currentDay++;
      if (ch.diaryEntry) window.gameState.diary.push({ day: cId, entry: ch.diaryEntry });
      saveGameState(); showBossFight(cId); return;
    }
    saveGameState();
  }
  sounds.success();
  // Mostrar flotantes de recompensa
  if (!window.gameState.practiceMode) showFloatingReward(xpG, coinsG);
  showRewardModal(xpG, coinsG, cId, sId, results);
}

// ============================================
// TRIVIA
// ============================================
window.showTrivia = function(cId) {
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = `
    <div style="text-align:center;">
      <div style="font-size:48px;margin-bottom:15px;">⚡</div>
      <h2 style="color:var(--accent);margin-bottom:5px;">TRIVIA DE VELOCIDAD</h2>
      <p style="color:var(--muted);margin-bottom:20px;">La Ing. Ana te evalúa en tiempo real</p>
      <div style="background:rgba(245,158,11,0.1);padding:20px;border-radius:12px;border:2px solid var(--accent);margin:20px 0;text-align:left;">
        <p style="font-size:16px;margin-bottom:20px;font-style:italic;">"Si Roberto te pide ver los autos que NO son de color 'Rojo', ¿qué operador de comparación usarías en el WHERE?"</p>
        <button class="btn btn-secondary" onclick="answerTrivia('A')" style="width:100%;margin:8px 0;font-size:15px;">A) ==</button>
        <button class="btn btn-secondary" onclick="answerTrivia('B')" style="width:100%;margin:8px 0;font-size:15px;">B) &lt;&gt; o !=</button>
        <button class="btn btn-secondary" onclick="answerTrivia('C')" style="width:100%;margin:8px 0;font-size:15px;">C) NOT LIKE</button>
      </div>
      <p style="font-size:14px;color:var(--accent);">💰 Premio: +200 VC si aciertas a la primera</p>
    </div>`;
  document.getElementById('modalGeneric').classList.add('active');
};

window.answerTrivia = function(ans) {
  window.gameState.triviaAnswered = true;
  const content = document.getElementById('modalGenericContent');
  if (ans === 'B') {
    sounds.success();
    window.gameState.coins += 200; window.gameState.xp += 20;
    createCoinRain(200); saveGameState();
    content.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:64px;margin-bottom:20px;">✅</div>
        <h2 style="color:var(--primary);">¡CORRECTO!</h2>
        <p style="margin:20px 0;font-size:16px;"><strong>&lt;&gt;</strong> o <strong>!=</strong> significa "diferente de".</p>
        <div style="background:linear-gradient(135deg,rgba(0,217,255,0.2),rgba(124,58,237,0.2));padding:25px;border-radius:12px;margin:20px 0;border:2px solid var(--accent);">
          <div style="font-size:32px;margin:10px 0;">🪙 +200 VC</div>
          <div style="font-size:32px;margin:10px 0;">⭐ +20 XP</div>
        </div>
        <button class="btn" onclick="closeModal('modalGeneric');loadChallenge(1,6);" style="width:100%;margin-top:20px;">Continuar →</button>
      </div>`;
  } else {
    sounds.error();
    content.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:64px;margin-bottom:20px;">❌</div>
        <h2 style="color:var(--danger);">Incorrecto</h2>
        <p style="margin:20px 0;">Respuesta: <strong>B) &lt;&gt; o !=</strong></p>
        <p style="color:var(--muted);">Sin recompensa esta vez. Sigue adelante.</p>
        <button class="btn btn-secondary" onclick="closeModal('modalGeneric');loadChallenge(1,6);" style="width:100%;margin-top:20px;">Continuar →</button>
      </div>`;
  }
};

// ============================================
// BOSS FINAL
// ============================================
window.showBossFight = function(cId) {
  const name = window.gameState.playerName;
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = `
    <div style="text-align:center;">
      <div style="font-size:64px;margin-bottom:15px;">👹</div>
      <h2 style="color:var(--danger);margin-bottom:15px;">BOSS FINAL — El Ultimátum</h2>
      <div style="background:rgba(239,68,68,0.1);padding:20px;border-radius:12px;border:2px solid var(--danger);margin:20px 0;text-align:left;">
        <div style="font-size:12px;color:var(--muted);margin-bottom:10px;">📍 09:47 AM — Llamada directa de Roberto</div>
        <p style="font-size:16px;font-style:italic;line-height:1.7;">
          "¡${name}! La planta cierra el sistema en 5 minutos.
          Necesito el <strong>Top 5 de los autos más caros</strong>
          que sean marca 'Toyota', que <strong>NO sean de color 'Blanco'</strong>
          y ordenados de <strong>mayor a menor precio</strong>. ¡YA!"
        </p>
      </div>
      <p style="font-size:13px;color:var(--muted);margin:15px 0;">Combina: SELECT con LIMIT 5, WHERE, AND, condición de color, ORDER BY DESC</p>
      <button class="btn" onclick="closeModal('modalGeneric');startBoss();" style="width:100%;font-size:18px;">⚔️ Aceptar Desafío Final</button>
    </div>`;
  document.getElementById('modalGeneric').classList.add('active');
};

window.startBoss = function() {
  window.gameState.currentSubExercise = 'BOSS';
  document.getElementById('challengeTitle').textContent = '👹 BOSS FINAL — El Ultimátum de Roberto';
  document.getElementById('challengeDesc').textContent = 'Top 5 Toyota más caros, NO blancos, ORDER BY DESC';
  document.getElementById('npcDialogue').innerHTML = `
    <div class="npc-dialogue">
      <div class="npc-scene">
        <div class="npc-location">📍 09:51 AM — Sistema en cuenta regresiva</div>
        <div class="npc-message">
          <span class="npc-avatar" style="font-size:48px;">👹</span>
          <div class="npc-bubble" style="border-color:rgba(239,68,68,0.5);">
            <div class="npc-name" style="color:var(--danger);">BOSS FINAL — ROBERTO</div>
            <p>Top 5 Toyota más caros. NO blancos. Mayor a menor. ¡AHORA!</p>
          </div>
        </div>
      </div>
    </div>`;
  document.getElementById('sqlEditor').value = '-- Escribe tu consulta BOSS aquí\n';
  document.getElementById('results').innerHTML = '<strong>📊 Resultados</strong><p style="color:var(--muted);margin-top:10px;">Ejecuta tu consulta...</p>';
  window.gameState.attempts = 0; updateAttemptCounter();
};

function checkBossSolution(userQuery, results) {
  const u = normalize(userQuery);
  const hasLimit = u.includes('limit 5') || u.includes('top 5');
  const hasToyota = u.includes("'toyota'");
  const hasNotWhite = u.includes("!= 'blanco'") || u.includes("<> 'blanco'") || (u.includes('not') && u.includes("'blanco'"));
  const hasOrderDesc = u.includes('order by') && u.includes('desc');
  const hasPrice = u.includes('c_precio');
  if (hasLimit && hasToyota && hasNotWhite && hasOrderDesc && hasPrice && results && results[0] && results[0].values.length <= 5) {
    completeBoss();
  } else {
    sounds.error(); window.gameState.attempts++; updateAttemptCounter();
    let hint = 'Verifica: ';
    if (!hasLimit) hint += 'LIMIT 5, ';
    if (!hasToyota) hint += "marca='Toyota', ";
    if (!hasNotWhite) hint += "color != 'Blanco', ";
    if (!hasOrderDesc) hint += 'ORDER BY ... DESC, ';
    alert(hint.slice(0, -2));
  }
}

function completeBoss() {
  sounds.success();
  window.gameState.xp += 50; window.gameState.coins += 1500;
  window.gameState.unlockedBadges.push('boss1'); window.gameState.unlockedBadges.push('mundo1');
  window.gameState.rank = 'Analista SR';
  createCoinRain(1500); saveGameState();
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = `
    <div style="text-align:center;">
      <div style="font-size:80px;margin-bottom:20px;">👑</div>
      <h2 style="color:var(--accent);margin-bottom:15px;">¡NODO GDL RESTAURADO!</h2>
      <div style="background:rgba(0,217,255,0.08);border:1px solid var(--primary);border-radius:12px;padding:20px;margin:15px 0;text-align:left;">
        <p style="font-style:italic;line-height:1.7;font-size:15px;">
          "Lo lograste. Roberto puede despachar las unidades.
          NexCorp Industries sobrevive otro día.
          Acabas de demostrar que aprendes SQL más rápido de lo que
          The Void destruye sistemas."
        </p>
        <p style="color:var(--primary);font-weight:bold;margin-top:10px;">— Ing. Ana</p>
      </div>
      <div style="background:linear-gradient(135deg,rgba(0,217,255,0.2),rgba(124,58,237,0.2));padding:25px;border-radius:12px;margin:20px 0;border:2px solid var(--accent);">
        <div style="font-size:20px;font-weight:bold;margin-bottom:15px;">🏆 RECOMPENSAS DEL MÓDULO 1</div>
        <div style="font-size:28px;margin:10px 0;">⭐ +50 XP</div>
        <div style="font-size:28px;margin:10px 0;">🪙 +1,500 VC</div>
        <div style="font-size:18px;margin:10px 0;">👑 Insignia: Vencedor de Roberto</div>
        <div style="font-size:18px;margin:10px 0;">🏆 Insignia: Salvador de GDL</div>
        <div style="font-size:16px;margin:15px 0;color:var(--accent);">📈 Ascenso de Rango: Analista SR</div>
      </div>
      <p style="color:var(--muted);margin:15px 0;">Módulo 1 — COMPLETO 100%</p>
      <button class="btn" onclick="closeModal('modalGeneric');location.reload();" style="width:100%;margin-top:20px;font-size:18px;">🎊 Continuar Misión</button>
    </div>`;
  document.getElementById('modalGeneric').classList.add('active');
  updateStats(); updateProgressBar(); updateSkillBars();
}

// ============================================
// MODALES DE RECOMPENSA
// ============================================
function showRewardModal(xp, coins, cId, sId, results) {
  const content = document.getElementById('modalGenericContent');
  let summary = '';
  if (results && results.length > 0) summary = `<p style="margin-top:15px;font-size:16px;">📋 Filas obtenidas: <strong>${results[0].values.length}</strong></p>`;
  if (window.gameState.practiceMode) {
    content.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:64px;margin-bottom:20px;">✅</div>
        <h2 style="color:var(--primary);">¡Correcto!</h2>
        <p style="color:var(--muted);">Modo Práctica — sin recompensas adicionales</p>
        ${summary}
        <button class="btn btn-secondary" onclick="closeModal('modalGeneric')" style="width:100%;margin-top:30px;">Cerrar</button>
      </div>`;
  } else {
    content.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:64px;margin-bottom:20px;">🎉</div>
        <h2 style="color:var(--primary);margin-bottom:15px;">¡Ejercicio ${cId}.${sId} completado!</h2>
        <div style="background:linear-gradient(135deg,rgba(0,217,255,0.2),rgba(124,58,237,0.2));padding:25px;border-radius:12px;margin:20px 0;border:2px solid var(--primary);">
          <div style="font-size:20px;font-weight:bold;margin-bottom:10px;">Recompensas</div>
          <div style="font-size:32px;margin:10px 0;">⭐ +${xp} XP</div>
          <div style="font-size:32px;margin:10px 0;">🪙 +${coins} VC</div>
        </div>
        ${summary}
        ${sId < 10 ? `<button class="btn" onclick="nextExercise(${cId},${sId})" style="width:100%;margin-top:20px;font-size:18px;">➡️ Siguiente</button>` : ''}
      </div>`;
    createCoinRain(coins);
  }
  document.getElementById('modalGeneric').classList.add('active');
}

window.nextExercise = function(cId, sId) {
  closeModal('modalGeneric');
  window.gameState.currentSubExercise = sId + 1;
  loadChallenge(cId, sId + 1);
  renderChallenges(); updateStats(); updateProgressBar(); updateSkillBars();
};

// ============================================
// TUTORIAL
// ============================================
function showTutorial(cId) {
  const tut = sqlTutorials[cId];
  if (!tut || window.gameState.tutorialsSeen.includes(cId)) return;
  showTutorialSlide(cId, 0);
  document.getElementById('modalGeneric').classList.add('active');
  sounds.click();
}

window.showTutorialSlide = function(cId, slideIndex) {
  const tut = sqlTutorials[cId];
  const slides = tut.slides;
  const isLast = slideIndex === slides.length - 1;
  const slide = slides[slideIndex];
  const content = document.getElementById('modalGenericContent');

  // Indicadores de progreso
  const dots = slides.map((_, i) => `
    <div style="width:${i === slideIndex ? '24px' : '8px'};height:8px;border-radius:4px;
                background:${i === slideIndex ? 'var(--primary)' : 'rgba(255,160,0,0.2)'};
                transition:all 0.3s;"></div>`).join('');

  content.innerHTML = `
    <div style="animation:fadeIn 0.25s ease;">
      ${slide.content}
      <div style="display:flex;justify-content:center;gap:8px;align-items:center;margin:20px 0 16px;">
        ${dots}
      </div>
      <div style="display:flex;gap:10px;">
        ${slideIndex > 0
          ? `<button class="btn btn-ghost" onclick="showTutorialSlide(${cId},${slideIndex-1})" style="flex:1;">← Anterior</button>`
          : ''}
        ${isLast
          ? `<button class="btn" onclick="closeTutorial(${cId})" style="flex:2;font-size:15px;letter-spacing:1px;">⚡ ¡Entendido! Comenzar Misión</button>`
          : `<button class="btn" onclick="showTutorialSlide(${cId},${slideIndex+1})" style="flex:2;font-size:15px;">Siguiente →</button>`}
      </div>
    </div>`;
}

window.closeTutorial = function(cId) {
  window.gameState.tutorialsSeen.push(cId);
  saveGameState(); closeModal('modalGeneric');
};

// ============================================
// CONTROLES DE EDITOR
// ============================================
function updateAttemptCounter() {
  const counter = document.getElementById('attemptCounter');
  const btn = document.getElementById('exampleBtn');
  if (window.gameState.attempts === 0) {
    if (counter) counter.style.display = 'none';
    if (btn) { btn.disabled = true; btn.innerHTML = '🔒 Ver Ejemplo'; }
  } else if (window.gameState.attempts < 3) {
    if (counter) { counter.style.display = 'flex'; document.getElementById('attemptText').textContent = `Intento ${window.gameState.attempts}/3`; }
    if (btn) { btn.disabled = true; btn.innerHTML = `🔒 (${3 - window.gameState.attempts} más)`; }
  } else {
    if (counter) { counter.style.display = 'flex'; document.getElementById('attemptText').textContent = '💡 Desbloqueado'; }
    if (btn) { btn.disabled = false; btn.innerHTML = '💡 Ver Ejemplo'; window.gameState.exampleUnlocked = true; }
  }
}

window.showExample = function() {
  if (!window.gameState.exampleUnlocked) { sounds.error(); alert('Necesitas 3 intentos'); return; }
  sounds.click();
  if (window.gameState.currentSubExercise === 'BOSS') { alert('💡 PISTA BOSS:\n\nSELECT * FROM tabla\nWHERE condicion1 AND condicion2\nORDER BY columna DESC\nLIMIT 5;'); return; }
  const sub = challenges[window.gameState.currentChallenge].subExercises.find(s => s.id === window.gameState.currentSubExercise);
  alert(`💡 EJEMPLO:\n\n${sub.example}\n\nAdáptalo a lo que pide Roberto.`);
};

window.clearEditor = function() {
  sounds.click();
  document.getElementById('sqlEditor').value = '-- Escribe tu consulta SQL aquí\n';
};

window.showHints = function() {
  sounds.click();
  const content = document.getElementById('modalGenericContent');
  if (window.gameState.currentSubExercise === 'BOSS') {
    content.innerHTML = `<h2>💡 Pista BOSS</h2>
      <div style="padding:15px;background:rgba(245,158,11,0.1);border-radius:8px;margin-top:20px;border:2px solid var(--accent);">
        <p>1️⃣ SELECT * FROM T_Inventario_GDL<br>
        2️⃣ WHERE C_Marca = 'Toyota'<br>
        3️⃣ AND C_Color != 'Blanco' (o &lt;&gt;)<br>
        4️⃣ ORDER BY C_Precio DESC<br>
        5️⃣ LIMIT 5;</p>
      </div>
      <button class="btn" onclick="closeModal('modalGeneric')" style="margin-top:20px;width:100%;">Cerrar</button>`;
  } else {
    const sub = challenges[window.gameState.currentChallenge].subExercises.find(s => s.id === window.gameState.currentSubExercise);
    content.innerHTML = `<h2>💡 Pista del Sistema</h2>
      <div style="padding:15px;background:rgba(245,158,11,0.1);border-radius:8px;margin-top:20px;border:2px solid var(--accent);">
        <code style="font-size:14px;color:#00ff41;">${sub.hint}</code>
      </div>
      <button class="btn" onclick="closeModal('modalGeneric')" style="margin-top:20px;width:100%;">Cerrar</button>`;
  }
  document.getElementById('modalGeneric').classList.add('active');
};

// ============================================
// TIENDA
// ============================================
window.showShop = function() {
  sounds.click();
  const content = document.getElementById('modalGenericContent');
  const gs = window.gameState;
  let html = `<h2>🛍️ Tienda NEXUS — ${gs.coins} VC disponibles</h2>`;
  const types = [
    { key: 'avatar', label: '🥷 Skins de Operador' },
    { key: 'office', label: '🏢 Mejoras de Oficina' },
    { key: 'powerup', label: '⚡ Power-Ups' }
  ];
  types.forEach(({ key, label }) => {
    html += `<h3 style="color:var(--primary);margin:20px 0 10px;">${label}</h3><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;">`;
    shopItems.filter(item => item.type === key).forEach(item => {
      const owned = gs.unlockedItems.includes(item.id);
      const equipped = gs.equippedItems[item.type] === item.id;
      html += `
        <div style="background:var(--card);border:2px solid ${equipped?'var(--accent)':owned?'var(--primary)':'rgba(0,217,255,0.2)'};border-radius:12px;padding:15px;text-align:center;">
          <div style="font-size:36px;margin-bottom:8px;">${item.icon}</div>
          <div style="font-weight:bold;font-size:13px;margin-bottom:5px;">${item.name}</div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:10px;">${item.desc}</div>
          ${equipped
            ? `<button class="btn" style="width:100%;font-size:12px;opacity:0.7;" disabled>✅ Equipado</button>`
            : owned
            ? `<button class="btn btn-ghost" onclick="equipItem('${item.id}','${item.type}')" style="width:100%;font-size:12px;">Equipar</button>`
            : `<button class="btn btn-secondary" onclick="buyItem('${item.id}')" style="width:100%;font-size:12px;" ${gs.coins < item.price ? 'disabled' : ''}>🪙 ${item.price} VC</button>`}
        </div>`;
    });
    html += '</div>';
  });
  html += `<button class="btn" onclick="closeModal('modalGeneric')" style="margin-top:25px;width:100%;">Cerrar</button>`;
  content.innerHTML = html;
  document.getElementById('modalGeneric').classList.add('active');
};

window.buyItem = function(itemId) {
  const item = shopItems.find(i => i.id === itemId);
  if (!item || window.gameState.coins < item.price) { sounds.error(); alert('No tienes suficientes VC.'); return; }
  sounds.success();
  window.gameState.coins -= item.price;
  window.gameState.unlockedItems.push(itemId);
  saveGameState(); updateStats();
  alert(`✅ ¡${item.name} desbloqueado! Ve a "Equipar" para usarlo.`);
  showShop();
};

window.equipItem = function(itemId, type) {
  sounds.click();
  window.gameState.equippedItems[type] = itemId;
  saveGameState(); updateAvatars(); updateStats();
  showShop();
};

// ============================================
// INSIGNIAS, TABLAS, DIARIO
// ============================================
window.toggleTables = function() {
  sounds.click();
  const panel = document.getElementById('tablesPanel');
  const toggle = document.getElementById('tablesToggle');
  if (panel && toggle) {
    const show = panel.style.display === 'none' || panel.style.display === '';
    panel.style.display = show ? 'block' : 'none';
    toggle.textContent = show ? '▲' : '▼';
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
    div.innerHTML = `<div class="badge-icon">${badge.icon}</div><div style="font-weight:bold;font-size:14px;">${badge.name}</div><div style="font-size:12px;color:var(--muted);margin-top:5px;">${badge.desc}</div>`;
    grid.appendChild(div);
  });
  content.appendChild(grid);
  const btn = document.createElement('button');
  btn.className = 'btn'; btn.textContent = 'Cerrar';
  btn.style.cssText = 'margin-top:20px;width:100%;';
  btn.onclick = () => closeModal('modalGeneric');
  content.appendChild(btn);
  document.getElementById('modalGeneric').classList.add('active');
};

window.closeModal = function(id) {
  sounds.click();
  document.getElementById(id).classList.remove('active');
};
