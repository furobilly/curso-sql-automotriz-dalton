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
  { id: 'mundo1', name: 'Salvador de GDL', icon: '🏆', desc: '100% Módulo 1' },
  { id: 'boss2', name: 'Precisión Quirúrgica', icon: '🎯', desc: 'Completar Boss Final Módulo 2' },
  { id: 'mundo2', name: 'Salvador de SLP', icon: '🚚', desc: '100% Módulo 2' },
  { id: 'boss3', name: 'Rey de los Rankings', icon: '⛰️', desc: 'Completar Boss Final Módulo 3' },
  { id: 'mundo3', name: 'Salvador de MTY', icon: '👑', desc: '100% Módulo 3' },
  { id: 'boss4', name: 'Ábaco de Agregación', icon: '🧮', desc: 'Completar Boss Final Módulo 4' },
  { id: 'mundo4', name: 'Salvador de CDMX', icon: '🏦', desc: '100% Módulo 4' },
  { id: 'boss5', name: 'Separador de Trigo y Paja', icon: '🌾', desc: 'Completar Boss Final Módulo 5' },
  { id: 'mundo5', name: 'Consolidador Nacional', icon: '🇲🇽', desc: '100% Módulo 5' },
  { id: 'boss6', name: 'Tejedor de Vínculos', icon: '🔗', desc: 'Completar Boss Final Módulo 6' },
  { id: 'mundo6', name: 'Héroe de Marketing', icon: '🎨', desc: '100% Módulo 6' },
  { id: 'boss7', name: 'Cazador de Fantasmas', icon: '🌑', desc: 'Completar Boss Final Módulo 7' },
  { id: 'mundo7', name: 'Revelador del Vacío', icon: '🔦', desc: '100% Módulo 7' },
  { id: 'boss8', name: 'Pulso de Cirujano', icon: '🛡️', desc: 'Completar Boss Final Módulo 8' },
  { id: 'mundo8', name: 'Purgador del Void', icon: '⚔️', desc: '100% Módulo 8' },
  { id: 'boss9', name: 'Arquitecto del Núcleo', icon: '🏗️', desc: 'Completar Boss Final Módulo 9' },
  { id: 'mundo9', name: 'Señor de las Vistas', icon: '🪟', desc: '100% Módulo 9' },
  { id: 'boss10', name: 'Vencedor del CEO', icon: '👑', desc: 'Derrotar a THE BOSS del Módulo 10' },
  { id: 'mundo10', name: 'Liberador del NEXUS', icon: '💠', desc: 'Completar la aventura principal' },
  { id: 'boss11', name: 'El Oráculo', icon: '🔮', desc: 'Completar la Ceremonia de Dalton' },
  { id: 'mundo11', name: 'Consultor Legendario', icon: '🎓', desc: '100% del juego (Aventura + Bonus)' }
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

  -- ============ MÓDULO 2: SAN LUIS POTOSÍ (Honda/Kia) ============
  CREATE TABLE T_Inventario_SLP (
    C_VIN TEXT PRIMARY KEY,          -- VIN único de la unidad
    C_Marca TEXT,                    -- Honda, Kia, Toyota (distractor)
    C_Modelo TEXT,                   -- Modelos para practicar LIKE
    C_Anio INTEGER,
    C_Color TEXT,                    -- Algunos NULL (borrados por The Void)
    C_Precio INTEGER,                -- Algunos NULL (para IS NOT NULL del Boss)
    C_Numero_Motor TEXT,             -- Algunos NULL (reto de validación)
    C_ID_Lote INTEGER                -- Para BETWEEN 500-750
  );

  INSERT INTO T_Inventario_SLP VALUES
  ('SL7001X', 'Honda', 'CR-V',     2024, 'Gris',   720000, 'NM-8891', 510),
  ('SL7002X', 'Honda', 'City',     2024, 'Azul',   380000, 'NM-8892', 505),
  ('SLP003A', 'Honda', 'Civic',    2024, 'Gris',   NULL,   'NM-8893', 600),
  ('SLP004B', 'Honda', 'Pilot',    2024, 'Blanco', 890000, NULL,      701),
  ('SLP005C', 'Honda', 'Accord',   2024, 'Plata',  640000, 'NM-8895', 480),
  ('SLP006D', 'Kia',   'Korte',    2024, 'Rojo',   350000, 'NM-8896', 520),
  ('SLP007E', 'Kia',   'Kicks',    2024, 'Negro',  330000, 'NM-8897', 760),
  ('SLP008F', 'Kia',   'Sportage', 2024, 'Azul',   560000, NULL,      730),
  ('SLP009G', 'Kia',   'Rio',      2024, NULL,     290000, 'NM-8899', 540),
  ('SLP010H', 'Kia',   'K5',       2024, 'Blanco', 495000, 'NM-8900', 495),
  ('SLP011J', 'Toyota','Yaris',    2024, NULL,     310000, 'NM-8901', 610),
  ('SLP012K', 'Toyota','Corolla',  2024, 'Negro',  450000, 'NM-8902', 655);

  CREATE TABLE T_Clientes_SLP (
    C_ID_Cliente INTEGER PRIMARY KEY,
    C_Nombre_Completo TEXT,          -- Incluye cuentas 'Admin' fantasma (reto LIKE)
    C_Correo TEXT,
    C_Telefono TEXT,
    C_Ciudad_Registro TEXT
  );

  INSERT INTO T_Clientes_SLP VALUES
  (1, 'Patricia Salinas',    'paty@slp.mx',        '4441112233', 'San Luis Potosí'),
  (2, 'Admin_Fantasma01',    'void@nexus.err',     '0000000000', 'Desconocida'),
  (3, 'Jorge Admin Torres',  'jadmin@nexcorp.mx',  '4442223344', 'San Luis Potosí'),
  (4, 'Lucía Ramos',         'lucia@gmail.com',    '4443334455', 'Soledad'),
  (5, 'Sofía Delgado',       'sofia.d@nexcorp.mx', '4444445566', 'San Luis Potosí');

  -- ============ MÓDULO 3: MONTERREY (Don Víctor - Alta Gama) ============
  CREATE TABLE T_Inventario_MTY (
    C_VIN TEXT PRIMARY KEY,
    C_Marca TEXT,                    -- Algunas NULL (borradas por The Void, reto CASE)
    C_Modelo TEXT,
    C_Anio INTEGER,                  -- Mezcla <2024 y 2024 (reto de descuentos)
    C_Color TEXT,
    C_Precio INTEGER,                -- >800k y <800k (reto Premium/Comercial)
    C_Stock INTEGER,                 -- 0, <3 y >=3 (reto semáforo)
    C_Kilometraje INTEGER            -- Para Top 5 VIP (km más bajo)
  );

  INSERT INTO T_Inventario_MTY VALUES
  ('MT001LX', 'Lexus',  'LX600',       2024, 'Negro',  2100000, 1, 5),
  ('MT002LX', 'Lexus',  'RX500',       2024, 'Blanco', 1450000, 0, 12),
  ('MT003LX', 'Lexus',  'NX350',       2023, 'Gris',    980000, 3, 8000),
  ('MT004LX', 'Lexus',  'ES300',       2022, 'Plata',   890000, 2, 15000),
  ('MT005LX', 'Lexus',  'UX250',       2021, 'Azul',    720000, 4, 22000),
  ('MT006TY', 'Toyota', 'LandCruiser', 2024, 'Negro',  1890000, 0, 10),
  ('MT007TY', 'Toyota', 'Sequoia',     2024, 'Blanco', 1350000, 1, 20),
  ('MT008TY', 'Toyota', 'Tundra',      2023, 'Rojo',   1100000, 2, 9000),
  ('MT009TY', 'Toyota', 'Sienna',      2024, 'Gris',    860000, 5, 15),
  ('MT010TY', 'Toyota', 'Prado',       2022, 'Verde',   790000, 0, 18000),
  ('MT011TY', 'Toyota', 'Crown',       2024, 'Azul',    750000, 3, 25),
  ('MT012BD', 'BYD',    'Tang',        2024, 'Negro',   820000, 2, 30),
  ('MT013BD', 'BYD',    'Han',         2023, 'Blanco',  640000, 6, 7000),
  ('MT014BD', 'BYD',    'Seal',        2024, 'Azul',    560000, 0, 40),
  ('MT015BD', 'BYD',    'Yuan',        2024, 'Rojo',    430000, 8, 12),
  ('MT016KA', 'Kia',    'EV9',         2024, 'Gris',   1050000, 1, 18),
  ('MT017KA', 'Kia',    'Carnival',    2023, 'Blanco',  780000, 4, 11000),
  ('MT018KA', 'Kia',    'Stinger',     2022, 'Rojo',    690000, 0, 19000),
  ('MT019XX', NULL,     'Fantasma-01', 2024, NULL,      500000, 1, 0),
  ('MT020XX', NULL,     'Fantasma-02', 2023, 'Gris',    470000, 2, 5000);

  CREATE TABLE T_Clientes_MTY (
    C_ID_Cliente INTEGER PRIMARY KEY,
    C_Nombre_Completo TEXT,          -- Para ordenar A-Z
    C_Correo TEXT,
    C_Telefono TEXT,
    C_Ciudad_Registro TEXT
  );

  INSERT INTO T_Clientes_MTY VALUES
  (1, 'Ricardo Elizondo',  'relizondo@acero.mx',   '8181112233', 'Monterrey'),
  (2, 'Alejandra Garza',   'agarza@vip.mx',        '8182223344', 'San Pedro'),
  (3, 'Mauricio Treviño',  'mtrevino@norte.mx',    '8183334455', 'Monterrey'),
  (4, 'Bárbara Villarreal','bvilla@gmail.com',     '8184445566', 'Apodaca'),
  (5, 'Gerardo Cantú',     'gcantu@outlook.com',   '8185556677', 'Monterrey'),
  (6, 'Daniela Sada',      'dsada@nexcorp.mx',     '8186667788', 'San Pedro');

  -- ============ MÓDULO 4: CDMX (Don Carlos - Agregaciones) ============
  CREATE TABLE T_Inventario_CDMX (
    C_VIN TEXT PRIMARY KEY,
    C_Marca TEXT,                    -- 5 marcas distintas (reto COUNT DISTINCT)
    C_Modelo TEXT,
    C_Anio INTEGER,                  -- Mezcla 2024/2025 (reto AVG filtrado)
    C_Color TEXT,                    -- 3 NULL (reto conteo de vacíos)
    C_Precio INTEGER
  );

  INSERT INTO T_Inventario_CDMX VALUES
  ('CX001TY', 'Toyota', 'Corolla',  2025, 'Blanco', 480000),
  ('CX002TY', 'Toyota', 'RAV4',     2025, 'Negro',  740000),
  ('CX003TY', 'Toyota', 'Hilux',    2024, NULL,     670000),
  ('CX004TY', 'Toyota', 'Camry',    2024, 'Gris',   540000),
  ('CX005KA', 'Kia',    'Rio',      2024, 'Rojo',   350000),
  ('CX006KA', 'Kia',    'EV9',      2025, 'Gris',   980000),
  ('CX007KA', 'Kia',    'Sportage', 2025, NULL,     590000),
  ('CX008BD', 'BYD',    'Seal',     2025, 'Azul',   560000),
  ('CX009BD', 'BYD',    'Dolphin',  2024, 'Verde',  390000),
  ('CX010BD', 'BYD',    'Tang',     2025, 'Negro',  830000),
  ('CX011HN', 'Honda',  'CR-V',     2024, 'Gris',   710000),
  ('CX012HN', 'Honda',  'City',     2025, NULL,     395000),
  ('CX013LX', 'Lexus',  'RX500',    2025, 'Blanco', 1450000),
  ('CX014LX', 'Lexus',  'NX350',    2024, 'Negro',  990000);

  CREATE TABLE T_Ventas_CDMX (
    C_ID_Venta INTEGER PRIMARY KEY,
    C_VIN TEXT,
    C_Marca TEXT,                    -- Denormalizada a propósito: los JOINs llegan en el siguiente módulo
    C_Vendedor TEXT,                 -- 3 vendedores (reto ventas por vendedor)
    C_Sucursal TEXT,                 -- 3 sucursales (reto resumen de región)
    C_Fecha DATE,
    C_Monto INTEGER
  );

  INSERT INTO T_Ventas_CDMX VALUES
  (1,  'CX002TY', 'Toyota', 'Laura Ortiz',    'Santa Fe', '2025-03-02',  850000),
  (2,  'CX003TY', 'Toyota', 'Miguel Paredes', 'Polanco',  '2025-03-05',  780000),
  (3,  'CX004TY', 'Toyota', 'Julio Ramos',    'Coyoacan', '2025-03-09',  650000),
  (4,  'CX013LX', 'Lexus',  'Laura Ortiz',    'Santa Fe', '2025-03-11', 1450000),
  (5,  'CX014LX', 'Lexus',  'Miguel Paredes', 'Polanco',  '2025-03-14',  980000),
  (6,  'CX006KA', 'Kia',    'Julio Ramos',    'Coyoacan', '2025-03-16',  495000),
  (7,  'CX005KA', 'Kia',    'Laura Ortiz',    'Santa Fe', '2025-03-18',  430000),
  (8,  'CX008BD', 'BYD',    'Miguel Paredes', 'Polanco',  '2025-03-20',  560000),
  (9,  'CX009BD', 'BYD',    'Julio Ramos',    'Coyoacan', '2025-03-22',  520000),
  (10, 'CX010BD', 'BYD',    'Laura Ortiz',    'Santa Fe', '2025-03-25',  330000),
  (11, 'CX011HN', 'Honda',  'Miguel Paredes', 'Polanco',  '2025-03-27',  380000),
  (12, 'CX012HN', 'Honda',  'Julio Ramos',    'Coyoacan', '2025-03-29',  420000);
  -- ============ MÓDULOS 5-6: NACIONAL (agregaciones + JOINs) ============
  CREATE TABLE T_Inventario (
    C_VIN TEXT PRIMARY KEY,
    C_Marca TEXT, C_Sucursal TEXT, C_Modelo TEXT,
    C_Anio INTEGER, C_Color TEXT, C_Precio INTEGER, C_Stock INTEGER
  );
  INSERT INTO T_Inventario VALUES
  ('NX001', 'Toyota', 'CDMX', 'Corolla', 2024, 'Blanco', 850000, 2),
  ('NX002', 'Toyota', 'CDMX', 'RAV4', 2025, 'Negro', 800000, 3),
  ('NX003', 'Toyota', 'CDMX', 'Hilux', 2023, 'Gris', 760000, 1),
  ('NX004', 'Toyota', 'CDMX', 'Camry', 2024, 'Rojo', 720000, 4),
  ('NX005', 'Toyota', 'CDMX', 'Corolla', 2025, 'Azul', 700000, 2),
  ('NX006', 'Toyota', 'CDMX', 'RAV4', 2023, 'Blanco', 680000, 3),
  ('NX007', 'Toyota', 'CDMX', 'Hilux', 2024, 'Negro', 620000, 1),
  ('NX008', 'Toyota', 'CDMX', 'Camry', 2025, 'Gris', 580000, 4),
  ('NX009', 'Toyota', 'CDMX', 'Corolla', 2023, 'Rojo', 490000, 2),
  ('NX010', 'Toyota', 'CDMX', 'RAV4', 2024, 'Azul', 300000, 3),
  ('NX011', 'Toyota', 'GDL', 'Corolla', 2024, 'Blanco', 820000, 2),
  ('NX012', 'Toyota', 'GDL', 'RAV4', 2025, 'Negro', 780000, 3),
  ('NX013', 'Toyota', 'GDL', 'Hilux', 2023, 'Gris', 740000, 1),
  ('NX014', 'Toyota', 'GDL', 'Camry', 2024, 'Rojo', 690000, 4),
  ('NX015', 'Toyota', 'GDL', 'Corolla', 2025, 'Azul', 650000, 2),
  ('NX016', 'Toyota', 'GDL', 'RAV4', 2023, 'Blanco', 600000, 3),
  ('NX017', 'Toyota', 'GDL', 'Hilux', 2024, 'Negro', 560000, 1),
  ('NX018', 'Toyota', 'GDL', 'Camry', 2025, 'Gris', 520000, 4),
  ('NX019', 'Toyota', 'GDL', 'Corolla', 2023, 'Rojo', 450000, 2),
  ('NX020', 'Toyota', 'GDL', 'RAV4', 2024, 'Azul', 380000, 3),
  ('NX021', 'Toyota', 'MTY', 'Corolla', 2024, 'Blanco', 750000, 2),
  ('NX022', 'Toyota', 'MTY', 'RAV4', 2025, 'Negro', 700000, 3),
  ('NX023', 'Toyota', 'MTY', 'Corolla', 2023, 'Gris', 640000, 1),
  ('NX024', 'Toyota', 'MTY', 'RAV4', 2024, 'Rojo', 540000, 4),
  ('NX025', 'Toyota', 'SLP', 'Corolla', 2024, 'Blanco', 520000, 2),
  ('NX026', 'Toyota', 'SLP', 'Corolla', 2025, 'Negro', 480000, 3),
  ('NX027', 'Toyota', 'SLP', 'Corolla', 2023, 'Gris', 430000, 1),
  ('NX028', 'Toyota', 'SLP', 'Corolla', 2024, 'Rojo', 390000, 4),
  ('NX029', 'Honda', 'CDMX', 'CR-V', 2024, 'Blanco', 710000, 2),
  ('NX030', 'Honda', 'CDMX', 'City', 2025, 'Negro', 650000, 3),
  ('NX031', 'Honda', 'CDMX', 'Civic', 2023, 'Gris', 600000, 1),
  ('NX032', 'Honda', 'CDMX', 'CR-V', 2024, 'Rojo', 560000, 4),
  ('NX033', 'Honda', 'CDMX', 'City', 2025, 'Azul', 520000, 2),
  ('NX034', 'Honda', 'CDMX', 'Civic', 2023, 'Blanco', 480000, 3),
  ('NX035', 'Honda', 'CDMX', 'CR-V', 2024, 'Negro', 430000, 1),
  ('NX036', 'Honda', 'CDMX', 'City', 2025, 'Gris', 395000, 4),
  ('NX037', 'Honda', 'GDL', 'CR-V', 2024, 'Blanco', 700000, 2),
  ('NX038', 'Honda', 'GDL', 'City', 2025, 'Negro', 640000, 3),
  ('NX039', 'Honda', 'GDL', 'Civic', 2023, 'Gris', 590000, 1),
  ('NX040', 'Honda', 'GDL', 'CR-V', 2024, 'Rojo', 550000, 4),
  ('NX041', 'Honda', 'GDL', 'City', 2025, 'Azul', 510000, 2),
  ('NX042', 'Honda', 'GDL', 'Civic', 2023, 'Blanco', 470000, 3),
  ('NX043', 'Honda', 'GDL', 'CR-V', 2024, 'Negro', 420000, 1),
  ('NX044', 'Honda', 'GDL', 'City', 2025, 'Gris', 380000, 4),
  ('NX045', 'Honda', 'SLP', 'CR-V', 2024, 'Blanco', 720000, 2),
  ('NX046', 'Honda', 'SLP', 'City', 2025, 'Negro', 640000, 3),
  ('NX047', 'Honda', 'SLP', 'CR-V', 2023, 'Gris', 560000, 1),
  ('NX048', 'Honda', 'SLP', 'City', 2024, 'Rojo', 520000, 4),
  ('NX049', 'Honda', 'SLP', 'CR-V', 2025, 'Azul', 480000, 2),
  ('NX050', 'Honda', 'SLP', 'City', 2023, 'Blanco', 440000, 3),
  ('NX051', 'Honda', 'SLP', 'CR-V', 2024, 'Negro', 400000, 1),
  ('NX052', 'Honda', 'SLP', 'City', 2025, 'Gris', 360000, 4),
  ('NX053', 'Kia', 'MTY', 'EV9', 2024, 'Blanco', 980000, 2),
  ('NX054', 'Kia', 'MTY', 'Sportage', 2025, 'Negro', 690000, 3),
  ('NX055', 'Kia', 'MTY', 'Rio', 2023, 'Gris', 590000, 1),
  ('NX056', 'Kia', 'MTY', 'EV9', 2024, 'Rojo', 560000, 4),
  ('NX057', 'Kia', 'MTY', 'Sportage', 2025, 'Azul', 495000, 2),
  ('NX058', 'Kia', 'MTY', 'Rio', 2023, 'Blanco', 460000, 3),
  ('NX059', 'Kia', 'MTY', 'EV9', 2024, 'Negro', 430000, 1),
  ('NX060', 'Kia', 'MTY', 'Sportage', 2025, 'Gris', 400000, 4),
  ('NX061', 'Kia', 'MTY', 'Rio', 2023, 'Rojo', 350000, 2),
  ('NX062', 'Kia', 'SLP', 'Rio', 2024, 'Blanco', 430000, 2),
  ('NX063', 'Kia', 'SLP', 'Rio', 2025, 'Negro', 410000, 3),
  ('NX064', 'Kia', 'SLP', 'Rio', 2023, 'Gris', 390000, 1),
  ('NX065', 'Kia', 'SLP', 'Rio', 2024, 'Rojo', 370000, 4),
  ('NX066', 'Kia', 'SLP', 'Rio', 2025, 'Azul', 350000, 2),
  ('NX067', 'Kia', 'SLP', 'Rio', 2023, 'Blanco', 340000, 3),
  ('NX068', 'Kia', 'SLP', 'Rio', 2024, 'Negro', 330000, 1),
  ('NX069', 'Kia', 'SLP', 'Rio', 2025, 'Gris', 320000, 4),
  ('NX070', 'Kia', 'SLP', 'Rio', 2023, 'Rojo', 310000, 2),
  ('NX071', 'BYD', 'GDL', 'Seal', 2024, 'Blanco', 830000, 2),
  ('NX072', 'BYD', 'GDL', 'Dolphin', 2025, 'Negro', 700000, 3),
  ('NX073', 'BYD', 'GDL', 'Seal', 2023, 'Gris', 640000, 1),
  ('NX074', 'BYD', 'GDL', 'Dolphin', 2024, 'Rojo', 560000, 4),
  ('NX075', 'BYD', 'GDL', 'Seal', 2025, 'Azul', 520000, 2),
  ('NX076', 'BYD', 'GDL', 'Dolphin', 2023, 'Blanco', 470000, 3),
  ('NX077', 'BYD', 'GDL', 'Seal', 2024, 'Negro', 390000, 1),
  ('NX078', 'BYD', 'GDL', 'Dolphin', 2025, 'Gris', 330000, 4),
  ('NX079', 'BYD', 'CDMX', 'Tang', 2024, 'Blanco', 820000, 2),
  ('NX080', 'BYD', 'CDMX', 'Han', 2025, 'Negro', 760000, 3),
  ('NX081', 'BYD', 'CDMX', 'Tang', 2023, 'Gris', 690000, 1),
  ('NX082', 'BYD', 'CDMX', 'Han', 2024, 'Rojo', 560000, 4),
  ('NX083', 'BYD', 'CDMX', 'Tang', 2025, 'Azul', 520000, 2),
  ('NX084', 'BYD', 'CDMX', 'Han', 2023, 'Blanco', 430000, 3),
  ('NX085', 'BYD', 'CDMX', 'Tang', 2024, 'Negro', 380000, 1),
  ('NX086', 'Lexus', 'CDMX', 'RX500', 2024, 'Blanco', 1800000, 1),
  ('NX087', 'Lexus', 'CDMX', 'NX350', 2025, 'Negro', 1450000, 0),
  ('NX088', 'Lexus', 'CDMX', 'RX500', 2023, 'Gris', 990000, 0),
  ('NX089', 'Lexus', 'CDMX', 'NX350', 2024, 'Rojo', 890000, 0),
  ('NX090', 'Lexus', 'MTY', 'LX600', 2024, 'Blanco', 2100000, 1),
  ('NX091', 'Lexus', 'MTY', 'RX500', 2025, 'Negro', 1500000, 0),
  ('NX092', 'Lexus', 'MTY', 'LX600', 2023, 'Gris', 1200000, 0),
  ('NX093', 'Lexus', 'MTY', 'RX500', 2024, 'Rojo', 980000, 0),
  ('NX094', 'Chirey', 'SLP', 'Tiggo2', 2024, 'Blanco', 280000, 2),
  ('NX095', 'Chirey', 'SLP', 'Tiggo2', 2025, 'Negro', 270000, 3),
  ('NX096', 'Chirey', 'SLP', 'Tiggo2', 2023, 'Gris', 260000, 1),
  ('NX097', 'Chirey', 'SLP', 'Tiggo2', 2024, 'Rojo', 250000, 4),
  ('NX098', 'Chirey', 'SLP', 'Tiggo2', 2025, 'Azul', 240000, 2),
  ('NX099', 'Chirey', 'SLP', 'Tiggo2', 2023, 'Blanco', 230000, 3);

  CREATE TABLE T_Ventas (
    C_ID_Venta INTEGER PRIMARY KEY,
    C_Marca TEXT, C_Sucursal TEXT, C_Vendedor TEXT,
    C_Anio INTEGER, C_Color TEXT, C_Monto INTEGER,
    C_VIN TEXT,                      -- FK a T_Inventario (el "cable" que cortó The Void)
    C_ID_Cliente INTEGER,            -- FK a T_Clientes (2 NULL: vínculos borrados)
    C_Fecha DATE
  );
  INSERT INTO T_Ventas VALUES
  (1, 'Toyota', 'CDMX', 'Laura Ortiz', 2024, 'Blanco', 850000, 'NX001', 1, '2024-01-15'),
  (2, 'Toyota', 'CDMX', 'Laura Ortiz', 2025, 'Blanco', 780000, 'NX002', 2, '2025-02-15'),
  (3, 'Toyota', 'CDMX', 'Laura Ortiz', 2024, 'Rojo', 760000, 'NX003', 3, '2024-03-15'),
  (4, 'Toyota', 'CDMX', 'Laura Ortiz', 2025, 'Azul', 720000, 'NX004', 4, '2025-04-15'),
  (5, 'Toyota', 'CDMX', 'Laura Ortiz', 2024, 'Negro', 700000, 'NX005', 5, '2024-05-15'),
  (6, 'Toyota', 'CDMX', 'Laura Ortiz', 2025, 'Gris', 680000, 'NX006', 6, '2025-06-15'),
  (7, 'Toyota', 'CDMX', 'Laura Ortiz', 2024, 'Rojo', 620000, 'NX007', 7, '2024-07-15'),
  (8, 'Toyota', 'CDMX', 'Laura Ortiz', 2025, 'Azul', 490000, 'NX008', 8, '2025-08-15'),
  (9, 'Lexus', 'MTY', 'Miguel Paredes', 2024, 'Negro', 2100000, 'NX090', 9, '2024-01-15'),
  (10, 'Lexus', 'MTY', 'Miguel Paredes', 2025, 'Blanco', 1800000, 'NX091', 10, '2025-02-15'),
  (11, 'Lexus', 'MTY', 'Miguel Paredes', 2024, 'Rojo', 1450000, 'NX092', 11, '2024-03-15'),
  (12, 'Lexus', 'MTY', 'Miguel Paredes', 2025, 'Azul', 850000, 'NX093', 12, '2025-04-15'),
  (13, 'Toyota', 'GDL', 'Pedro Nava', 2024, 'Negro', 800000, 'NX011', 1, '2024-01-15'),
  (14, 'Toyota', 'GDL', 'Pedro Nava', 2025, 'Gris', 750000, 'NX012', 2, '2025-02-15'),
  (15, 'Toyota', 'GDL', 'Pedro Nava', 2024, 'Rojo', 700000, 'NX013', 3, '2024-03-15'),
  (16, 'Toyota', 'GDL', 'Pedro Nava', 2025, 'Azul', 650000, 'NX014', 4, '2025-04-15'),
  (17, 'Toyota', 'GDL', 'Pedro Nava', 2024, 'Negro', 600000, 'NX015', 5, '2024-05-15'),
  (18, 'Toyota', 'GDL', 'Pedro Nava', 2025, 'Gris', 580000, 'NX016', 6, '2025-06-15'),
  (19, 'Toyota', 'GDL', 'Pedro Nava', 2024, 'Blanco', 420000, 'NX017', 7, '2024-07-15'),
  (20, 'Toyota', 'GDL', 'Pedro Nava', 2025, 'Blanco', 300000, 'NX018', 8, '2025-08-15'),
  (21, 'Toyota', 'GDL', 'Pedro Nava', 2023, 'Negro', 500000, 'NX019', 9, '2023-09-15'),
  (22, 'Honda', 'SLP', 'Karina Soto', 2024, 'Negro', 720000, 'NX045', 10, '2024-01-15'),
  (23, 'Honda', 'SLP', 'Karina Soto', 2025, 'Gris', 640000, 'NX046', 11, '2025-02-15'),
  (24, 'Honda', 'SLP', 'Karina Soto', 2024, 'Rojo', 520000, 'NX047', 12, '2024-03-15'),
  (25, 'Honda', 'SLP', 'Karina Soto', 2025, 'Blanco', 380000, 'NX048', 1, '2025-04-15'),
  (26, 'Honda', 'CDMX', 'Julio Ramos', 2024, 'Negro', 710000, 'NX029', 2, '2024-01-15'),
  (27, 'Honda', 'CDMX', 'Julio Ramos', 2025, 'Gris', 540000, 'NX030', 3, '2025-02-15'),
  (28, 'Honda', 'CDMX', 'Julio Ramos', 2024, 'Rojo', 420000, 'NX031', 4, '2024-03-15'),
  (29, 'BYD', 'GDL', 'Laura Ortiz', 2024, 'Negro', 560000, 'NX071', 5, '2024-01-15'),
  (30, 'BYD', 'GDL', 'Laura Ortiz', 2025, 'Gris', 520000, 'NX072', 6, '2025-02-15'),
  (31, 'BYD', 'GDL', 'Laura Ortiz', 2024, 'Rojo', 430000, 'NX073', 7, '2024-03-15'),
  (32, 'BYD', 'GDL', 'Laura Ortiz', 2025, 'Azul', 390000, 'NX074', 8, '2025-04-15'),
  (33, 'BYD', 'GDL', 'Laura Ortiz', 2024, 'Negro', 330000, 'NX075', 9, '2024-05-15'),
  (34, 'Kia', 'MTY', 'Miguel Paredes', 2024, 'Negro', 980000, 'NX053', 10, '2024-01-15'),
  (35, 'Kia', 'MTY', 'Miguel Paredes', 2025, 'Gris', 690000, 'NX054', 11, '2025-02-15'),
  (36, 'Kia', 'MTY', 'Miguel Paredes', 2024, 'Rojo', 560000, 'NX055', 12, '2024-03-15'),
  (37, 'Kia', 'MTY', 'Miguel Paredes', 2025, 'Azul', 495000, 'NX056', 1, '2025-04-15'),
  (38, 'Kia', 'MTY', 'Miguel Paredes', 2024, 'Negro', 430000, 'NX057', 2, '2024-05-15'),
  (39, 'Chirey', 'SLP', 'Julio Ramos', 2024, 'Negro', 260000, 'NX094', 3, '2024-01-15'),
  (40, 'Chirey', 'SLP', 'Julio Ramos', 2025, 'Gris', 240000, 'NX095', 4, '2025-02-15'),
  (41, 'Chirey', 'SLP', 'Julio Ramos', 2024, 'Rojo', 220000, 'NX096', NULL, '2024-03-15'),
  (42, 'Chirey', 'SLP', 'Julio Ramos', 2025, 'Azul', 210000, 'NX097', NULL, '2025-04-15');

  CREATE TABLE T_Clientes (
    C_ID_Cliente INTEGER PRIMARY KEY,
    C_Nombre_Completo TEXT,
    C_Correo TEXT,
    C_Telefono TEXT,
    C_Ciudad_Registro TEXT           -- CDMX/GDL/MTY/SLP
  );
  INSERT INTO T_Clientes VALUES
  (1, 'Valeria Montes', 'valeria.m@gmail.com', '5501112233', 'CDMX'),
  (2, 'Héctor Bravo', 'hbravo@outlook.com', '5502112233', 'GDL'),
  (3, 'Renata Ochoa', 'renata.o@nexcorp.mx', '5503112233', 'MTY'),
  (4, 'Iván Solís', 'ivan.solis@yahoo.com', '5504112233', 'SLP'),
  (5, 'Camila Duarte', 'cduarte@gmail.com', '5505112233', 'CDMX'),
  (6, 'Óscar Peña', 'opena@hotmail.com', '5506112233', 'GDL'),
  (7, 'Ximena Rangel', 'xrangel@nexcorp.mx', '5507112233', 'MTY'),
  (8, 'Tomás Iglesias', 'tiglesias@gmail.com', '5508112233', 'SLP'),
  (9, 'Regina Fuentes', 'rfuentes@outlook.com', '5509112233', 'CDMX'),
  (10, 'Bruno Cervantes', 'bcervantes@gmail.com', '5510112233', 'GDL'),
  (11, 'Paola Zúñiga', 'pzuniga@yahoo.com', '5511112233', 'MTY'),
  (12, 'Emilio Navarrete', 'enavarrete@nexcorp.mx', '5512112233', 'SLP'),
  (13, 'Silvia Arredondo', 'sarredondo@gmail.com', '5513998877', 'GDL'),
  (14, 'Marco Beltrán', 'mbeltran@outlook.com', NULL, 'CDMX'),
  (15, 'Julieta Osorio', 'josorio@yahoo.com', '5515998877', 'GDL'),
  (16, 'Rodrigo Palma', 'rpalma@gmail.com', NULL, 'MTY');

  CREATE TABLE T_Sucursales (
    C_ID_Sucursal INTEGER PRIMARY KEY,
    C_Nombre_Sucursal TEXT,
    C_Ciudad TEXT
  );
  INSERT INTO T_Sucursales VALUES
  (1, 'AXIOM Centro', 'Ciudad de México'),
  (2, 'AXIOM Occidente', 'Guadalajara'),
  (3, 'AXIOM Norte', 'Monterrey'),
  (4, 'AXIOM Bajío', 'San Luis Potosí');

  CREATE TABLE T_Vendedores (
    C_ID_Vendedor INTEGER PRIMARY KEY,
    C_Nombre_Vendedor TEXT,
    C_ID_Sucursal INTEGER            -- FK a T_Sucursales
  );
  INSERT INTO T_Vendedores VALUES
  (1, 'Laura Ortiz', 1),
  (2, 'Miguel Paredes', 3),
  (3, 'Pedro Nava', 2),
  (4, 'Karina Soto', 4),
  (5, 'Julio Ramos', 1),
  (6, 'Andrés Leal', 3);          -- Sin ventas este mes (reto LEFT JOIN)

  -- ============ MÓDULO 7: catálogo y pagos (huecos intencionales) ============
  CREATE TABLE T_Modelos (
    C_ID_Modelo INTEGER PRIMARY KEY,
    C_Modelo TEXT,                   -- 2 modelos de catálogo SIN stock (Supra, Telluride)
    C_Marca TEXT
  );
  INSERT INTO T_Modelos VALUES
  (1, 'Corolla', 'Toyota'), (2, 'RAV4', 'Toyota'), (3, 'Hilux', 'Toyota'),
  (4, 'CR-V', 'Honda'), (5, 'City', 'Honda'), (6, 'Rio', 'Kia'),
  (7, 'Seal', 'BYD'), (8, 'RX500', 'Lexus'), (9, 'Tiggo2', 'Chirey'),
  (10, 'Supra', 'Toyota'), (11, 'Telluride', 'Kia');

  CREATE TABLE T_Pagos (
    C_ID_Pago INTEGER PRIMARY KEY,
    C_ID_Venta INTEGER,              -- FK a T_Ventas; las ventas 36-40 NO tienen pago
    C_Metodo_Pago TEXT
  );
  INSERT INTO T_Pagos VALUES
  (1, 1, 'Contado'),
  (2, 2, 'Transferencia'),
  (3, 3, 'Credito'),
  (4, 4, 'Contado'),
  (5, 5, 'Transferencia'),
  (6, 6, 'Credito'),
  (7, 7, 'Contado'),
  (8, 8, 'Transferencia'),
  (9, 9, 'Credito'),
  (10, 10, 'Contado'),
  (11, 11, 'Transferencia'),
  (12, 12, 'Credito'),
  (13, 13, 'Contado'),
  (14, 14, 'Transferencia'),
  (15, 15, 'Credito'),
  (16, 16, 'Contado'),
  (17, 17, 'Transferencia'),
  (18, 18, 'Credito'),
  (19, 19, 'Contado'),
  (20, 20, 'Transferencia'),
  (21, 21, 'Credito'),
  (22, 22, 'Contado'),
  (23, 23, 'Transferencia'),
  (24, 24, 'Credito'),
  (25, 25, 'Contado'),
  (26, 26, 'Transferencia'),
  (27, 27, 'Credito'),
  (28, 28, 'Contado'),
  (29, 29, 'Transferencia'),
  (30, 30, 'Credito'),
  (31, 31, 'Contado'),
  (32, 32, 'Transferencia'),
  (33, 33, 'Credito'),
  (34, 34, 'Contado'),
  (35, 35, 'Transferencia');

  -- ============ MÓDULO 8: EL AUDITOR (basura de The Void + tablas DML) ============
  INSERT INTO T_Inventario VALUES
  ('TR123',  'Toyota', 'GDL',  'Hilux', 2024, 'Rojo',   999999, 1),  -- Precio equivocado (reto UPDATE)
  ('VOID01', 'BYD',    'GDL',  'Seal',  2024, 'Negro',  1,      0),  -- Sabotaje: BYD a $1
  ('VOID02', 'BYD',    'CDMX', 'Seal',  2025, 'Blanco', 1,      0);

  ALTER TABLE T_Inventario ADD COLUMN C_Observaciones TEXT;          -- Para el reto 'Remate'

  INSERT INTO T_Vendedores VALUES (7, 'TheVoid_User', 1);            -- Empleado falso (reto DELETE)

  INSERT INTO T_Ventas VALUES                                        -- Ventas falsas a $1 (Boss)
  (43, 'BYD', 'GDL',  'Laura Ortiz',    2024, 'Negro',  1, 'VOID01', NULL, '2024-04-01'),
  (44, 'BYD', 'GDL',  'Laura Ortiz',    2024, 'Negro',  1, 'VOID01', NULL, '2024-04-02'),
  (45, 'BYD', 'CDMX', 'Miguel Paredes', 2025, 'Blanco', 1, 'VOID02', NULL, '2025-04-03');

  CREATE TABLE T_Logs_Temporales (
    C_ID_Log INTEGER PRIMARY KEY,
    C_Descripcion TEXT,
    C_Fecha_Evento DATE               -- 3 antiguos (< 2025) para el DELETE con filtro
  );
  INSERT INTO T_Logs_Temporales VALUES
  (1, 'Reinicio de nodo GDL',   '2024-06-10'),
  (2, 'Intrusion detectada',    '2024-09-22'),
  (3, 'Backup automatico',      '2024-12-30'),
  (4, 'Sync Firestore OK',      '2025-02-14'),
  (5, 'Parche de seguridad',    '2025-05-01');

  CREATE TABLE T_Pruebas_Errores (
    C_ID INTEGER PRIMARY KEY,
    C_Tipo_Error TEXT                 -- Tabla de pruebas: el Auditor ordena vaciarla
  );
  INSERT INTO T_Pruebas_Errores VALUES
  (1, 'Error de conexion simulado'),
  (2, 'Timeout de prueba'),
  (3, 'Registro basura QA');
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
  },
  2: {
    title: 'El Rastreo Quirúrgico (SLP)',
    concept: `<strong>📜 Comandos de este ejercicio</strong><br><br>
      <code>IN (a, b)</code> — busca en una lista (sustituye muchos OR)<br>
      <code>NOT</code> — excluye lo que estorba<br>
      <code>LIKE '%'</code> — % = cualquier cantidad de caracteres<br>
      <code>LIKE '_'</code> — _ = exactamente UN carácter<br>
      <code>IS NULL / IS NOT NULL</code> — datos vacíos o completos<br><br>
      <em>Tip: Sofía es perfeccionista. Filtros exactos, no aproximaciones.</em>`,
    subExercises: [
      {
        id: 1, desc: '📦 Filtro Selectivo (IN)',
        expected: "SELECT * FROM T_Inventario_SLP WHERE C_Marca IN ('Honda', 'Kia')",
        hint: "SELECT * FROM T_Inventario_SLP WHERE C_Marca IN ('Honda', 'Kia');",
        example: "SELECT * FROM T_Inventario_SLP WHERE C_Color IN ('Gris', 'Azul');"
      },
      {
        id: 2, desc: '🚫 Exclusión Crítica (NOT)',
        expected: "SELECT * FROM T_Inventario_SLP WHERE NOT C_Color = 'Negro'",
        hint: "SELECT * FROM T_Inventario_SLP WHERE NOT C_Color = 'Negro';",
        example: "SELECT * FROM T_Inventario_SLP WHERE NOT C_Marca = 'Toyota';"
      },
      {
        id: 3, desc: '🔤 El Carácter Perdido (LIKE K____)',
        expected: "SELECT * FROM T_Inventario_SLP WHERE C_Modelo LIKE 'K____'",
        hint: "SELECT * FROM T_Inventario_SLP WHERE C_Modelo LIKE 'K____';",
        example: "SELECT * FROM T_Inventario_SLP WHERE C_Modelo LIKE 'C%';"
      },
      {
        id: 4, desc: '⚠️ GLITCH: VIN Fantasma (posición 3 = 7, termina en X)',
        expected: "SELECT * FROM T_Inventario_SLP WHERE C_VIN LIKE '__7%X'",
        hint: "SELECT * FROM T_Inventario_SLP WHERE C_VIN LIKE '__7%X';",
        example: "SELECT * FROM T_Inventario_SLP WHERE C_VIN LIKE 'SL%';"
      },
      {
        id: 5, desc: '✅ Validación de Salida (motor registrado)',
        expected: 'SELECT * FROM T_Inventario_SLP WHERE C_Numero_Motor IS NOT NULL',
        hint: 'SELECT * FROM T_Inventario_SLP WHERE C_Numero_Motor IS NOT NULL;',
        example: 'SELECT * FROM T_Inventario_SLP WHERE C_Numero_Motor IS NULL;'
      },
      {
        id: 6, desc: '🎨 Multi-Filtro (Honda Blanco u Plata)',
        expected: "SELECT * FROM T_Inventario_SLP WHERE C_Marca = 'Honda' AND (C_Color = 'Blanco' OR C_Color = 'Plata')",
        hint: "SELECT * FROM T_Inventario_SLP WHERE C_Marca = 'Honda' AND (C_Color = 'Blanco' OR C_Color = 'Plata');",
        example: "SELECT * FROM T_Inventario_SLP WHERE C_Marca = 'Kia' AND (C_Color = 'Rojo' OR C_Color = 'Negro');"
      },
      {
        id: 7, desc: '🚛 Rango Logístico (Lote 500-750)',
        expected: 'SELECT * FROM T_Inventario_SLP WHERE C_ID_Lote BETWEEN 500 AND 750',
        hint: 'SELECT * FROM T_Inventario_SLP WHERE C_ID_Lote BETWEEN 500 AND 750;',
        example: 'SELECT * FROM T_Inventario_SLP WHERE C_Precio BETWEEN 300000 AND 500000;'
      },
      {
        id: 8, desc: "⚠️ ERROR DE NODO: Clientes 'Admin' encriptados",
        expected: "SELECT * FROM T_Clientes_SLP WHERE C_Nombre_Completo LIKE '%Admin%'",
        hint: "SELECT * FROM T_Clientes_SLP WHERE C_Nombre_Completo LIKE '%Admin%';",
        example: "SELECT * FROM T_Clientes_SLP WHERE C_Correo LIKE '%nexcorp%';"
      },
      {
        id: 9, desc: '🧹 Limpieza de Sofía (sin color registrado)',
        expected: 'SELECT * FROM T_Inventario_SLP WHERE C_Color IS NULL',
        hint: 'SELECT * FROM T_Inventario_SLP WHERE C_Color IS NULL;',
        example: 'SELECT * FROM T_Inventario_SLP WHERE C_Precio IS NULL;'
      },
      {
        id: 10, desc: '🔀 Doble Negación (no Honda, no más de 400k)',
        expected: "SELECT * FROM T_Inventario_SLP WHERE C_Marca != 'Honda' AND C_Precio <= 400000",
        hint: "SELECT * FROM T_Inventario_SLP WHERE C_Marca != 'Honda' AND C_Precio <= 400000;",
        example: "SELECT * FROM T_Inventario_SLP WHERE C_Marca != 'Kia' AND C_Precio >= 600000;"
      }
    ],
    xp: 150, coins: 1200, difficulty: 2, skill: 'WHERE',
    diaryEntry: 'Día 2: SLP restaurado. Sofía despachó los camiones a la frontera sin una sola multa. Los filtros quirúrgicos funcionan.',
    hasTutorial: true,
    hasTrivia: true,
    hasBoss: true
  },
  3: {
    title: 'El Altar de la Exclusividad (MTY)',
    concept: `<strong>📜 Comandos de este ejercicio</strong><br><br>
      <code>ORDER BY col ASC/DESC</code> — ordena (A-Z / mayor a menor)<br>
      <code>LIMIT n</code> — solo las primeras n filas (en SQL Server: TOP n)<br>
      <code>CASE WHEN ... THEN ... ELSE ... END</code> — crea columnas con lógica<br><br>
      <em>Tip: Don Víctor no quiere "todos los datos", quiere "los mejores".</em>`,
    subExercises: [
      {
        id: 1, desc: '💎 El Más Caro (ORDER BY DESC + LIMIT)',
        expected: 'SELECT C_Modelo, C_Precio FROM T_Inventario_MTY ORDER BY C_Precio DESC LIMIT 1',
        hint: 'SELECT C_Modelo, C_Precio FROM T_Inventario_MTY ORDER BY C_Precio DESC LIMIT 1;',
        example: 'SELECT C_Modelo, C_Precio FROM T_Inventario_MTY ORDER BY C_Precio ASC LIMIT 1;'
      },
      {
        id: 2, desc: '🔤 Alfabeto de Ventas (A-Z)',
        expected: 'SELECT * FROM T_Clientes_MTY ORDER BY C_Nombre_Completo ASC',
        hint: 'SELECT * FROM T_Clientes_MTY ORDER BY C_Nombre_Completo ASC;',
        example: 'SELECT * FROM T_Clientes_MTY ORDER BY C_Ciudad_Registro ASC;'
      },
      {
        id: 3, desc: '🏁 El Top 5 VIP (menor kilometraje)',
        expected: 'SELECT * FROM T_Inventario_MTY ORDER BY C_Kilometraje ASC LIMIT 5',
        hint: 'SELECT * FROM T_Inventario_MTY ORDER BY C_Kilometraje ASC LIMIT 5;',
        example: 'SELECT * FROM T_Inventario_MTY ORDER BY C_Kilometraje DESC LIMIT 5;'
      },
      {
        id: 4, desc: '⚠️ GLITCH: Doble Orden (Marca A-Z, Precio DESC)',
        expected: 'SELECT * FROM T_Inventario_MTY ORDER BY C_Marca ASC, C_Precio DESC',
        hint: 'SELECT * FROM T_Inventario_MTY ORDER BY C_Marca ASC, C_Precio DESC;',
        example: 'SELECT * FROM T_Inventario_MTY ORDER BY C_Anio DESC, C_Modelo ASC;'
      },
      {
        id: 5, desc: '🏷️ Categorización Simple (CASE Premium/Comercial)',
        expected: "SELECT C_Modelo, C_Precio, CASE WHEN C_Precio > 800000 THEN 'Premium' ELSE 'Comercial' END AS M_Segmento FROM T_Inventario_MTY",
        hint: "SELECT C_Modelo, C_Precio, CASE WHEN C_Precio > 800000 THEN 'Premium' ELSE 'Comercial' END AS M_Segmento FROM T_Inventario_MTY;",
        example: "SELECT C_Modelo, CASE WHEN C_Anio = 2024 THEN 'Nuevo' ELSE 'Anterior' END AS M_Tipo FROM T_Inventario_MTY;"
      },
      {
        id: 6, desc: '🚦 Semáforo de Stock (CASE de 3 niveles)',
        expected: "SELECT C_Modelo, C_Stock, CASE WHEN C_Stock = 0 THEN 'AGOTADO' WHEN C_Stock < 3 THEN 'CRITICO' ELSE 'OK' END AS M_Estado FROM T_Inventario_MTY",
        hint: "SELECT C_Modelo, C_Stock, CASE WHEN C_Stock = 0 THEN 'AGOTADO' WHEN C_Stock < 3 THEN 'CRITICO' ELSE 'OK' END AS M_Estado FROM T_Inventario_MTY;",
        example: "SELECT C_Modelo, CASE WHEN C_Kilometraje = 0 THEN 'CERO KM' WHEN C_Kilometraje < 100 THEN 'DEMO' ELSE 'USADO' END AS M_Uso FROM T_Inventario_MTY;"
      },
      {
        id: 7, desc: '👑 El 10% de Élite (2 de 20 autos)',
        expected: 'SELECT * FROM T_Inventario_MTY ORDER BY C_Precio DESC LIMIT 2',
        hint: 'SELECT * FROM T_Inventario_MTY ORDER BY C_Precio DESC LIMIT 2; -- En SQL Server: SELECT TOP 10 PERCENT',
        example: 'SELECT * FROM T_Inventario_MTY ORDER BY C_Precio ASC LIMIT 2;'
      },
      {
        id: 8, desc: '⚠️ ERROR DE NODO: Marcas borradas (CASE + IS NULL)',
        expected: "SELECT CASE WHEN C_Marca IS NULL THEN 'POR CLASIFICAR' ELSE C_Marca END AS M_Marca, C_Modelo FROM T_Inventario_MTY",
        hint: "SELECT CASE WHEN C_Marca IS NULL THEN 'POR CLASIFICAR' ELSE C_Marca END AS M_Marca, C_Modelo FROM T_Inventario_MTY;",
        example: "SELECT CASE WHEN C_Color IS NULL THEN 'SIN COLOR' ELSE C_Color END AS M_Color, C_Modelo FROM T_Inventario_MTY;"
      },
      {
        id: 9, desc: '📅 Ranking de Antigüedad (solo Lexus, recientes arriba)',
        expected: "SELECT * FROM T_Inventario_MTY WHERE C_Marca = 'Lexus' ORDER BY C_Anio DESC",
        hint: "SELECT * FROM T_Inventario_MTY WHERE C_Marca = 'Lexus' ORDER BY C_Anio DESC;",
        example: "SELECT * FROM T_Inventario_MTY WHERE C_Marca = 'Toyota' ORDER BY C_Anio DESC;"
      },
      {
        id: 10, desc: '💸 Lógica de Descuentos (CASE con cálculo)',
        expected: 'SELECT C_Modelo, C_Precio, CASE WHEN C_Anio < 2024 THEN C_Precio * 0.9 ELSE C_Precio END AS M_Precio_Final FROM T_Inventario_MTY',
        hint: 'SELECT C_Modelo, C_Precio, CASE WHEN C_Anio < 2024 THEN C_Precio * 0.9 ELSE C_Precio END AS M_Precio_Final FROM T_Inventario_MTY;',
        example: 'SELECT C_Modelo, CASE WHEN C_Stock = 0 THEN C_Precio * 1.05 ELSE C_Precio END AS M_Precio_Pedido FROM T_Inventario_MTY;'
      }
    ],
    xp: 200, coins: 1500, difficulty: 3, skill: 'ORDER',
    diaryEntry: 'Día 3: Monterrey en línea. Don Víctor tiene sus rankings y sus clientes VIP sus camionetas. "No estás tan mal, muchacho", dijo. Viniendo de él, es un trofeo.',
    hasTutorial: true,
    hasTrivia: true,
    hasBoss: true
  },
  4: {
    title: 'El Cálculo del Destino (CDMX)',
    concept: `<strong>📜 Comandos de este ejercicio</strong><br><br>
      <code>COUNT(*)</code> — cuenta registros<br>
      <code>SUM(col)</code> — suma valores<br>
      <code>AVG(col)</code> — promedio &nbsp;|&nbsp; <code>MIN/MAX</code> — extremos<br>
      <code>GROUP BY col</code> — agrupa por categoría<br>
      <code>HAVING</code> — filtra DESPUÉS de agrupar<br><br>
      <em>Tip: para Don Carlos los datos individuales son ruido. Él quiere una sola cifra.</em>`,
    subExercises: [
      {
        id: 1, desc: '🔢 Conteo de Inventario (COUNT)',
        expected: 'SELECT COUNT(*) FROM T_Inventario_CDMX',
        hint: 'SELECT COUNT(*) FROM T_Inventario_CDMX;',
        example: 'SELECT COUNT(*) FROM T_Ventas_CDMX;'
      },
      {
        id: 2, desc: '💰 El Tesoro Total (SUM + alias M_)',
        expected: 'SELECT SUM(C_Precio) AS M_Valor_Total FROM T_Inventario_CDMX',
        hint: 'SELECT SUM(C_Precio) AS M_Valor_Total FROM T_Inventario_CDMX;',
        example: 'SELECT SUM(C_Monto) AS M_Ingresos FROM T_Ventas_CDMX;'
      },
      {
        id: 3, desc: '🎫 Ticket Promedio (AVG)',
        expected: 'SELECT AVG(C_Monto) FROM T_Ventas_CDMX',
        hint: 'SELECT AVG(C_Monto) FROM T_Ventas_CDMX;',
        example: 'SELECT AVG(C_Precio) FROM T_Inventario_CDMX;'
      },
      {
        id: 4, desc: '⚠️ GLITCH: Marcas reales (COUNT DISTINCT)',
        expected: 'SELECT COUNT(DISTINCT C_Marca) FROM T_Inventario_CDMX',
        hint: 'SELECT COUNT(DISTINCT C_Marca) FROM T_Inventario_CDMX;',
        example: 'SELECT COUNT(DISTINCT C_Sucursal) FROM T_Ventas_CDMX;'
      },
      {
        id: 5, desc: '↕️ Extremos Kia (MIN y MAX)',
        expected: "SELECT MIN(C_Precio), MAX(C_Precio) FROM T_Inventario_CDMX WHERE C_Marca = 'Kia'",
        hint: "SELECT MIN(C_Precio), MAX(C_Precio) FROM T_Inventario_CDMX WHERE C_Marca = 'Kia';",
        example: "SELECT MIN(C_Precio), MAX(C_Precio) FROM T_Inventario_CDMX WHERE C_Marca = 'Toyota';"
      },
      {
        id: 6, desc: '📊 Agrupación Básica (autos por marca)',
        expected: 'SELECT C_Marca, COUNT(*) FROM T_Inventario_CDMX GROUP BY C_Marca',
        hint: 'SELECT C_Marca, COUNT(*) FROM T_Inventario_CDMX GROUP BY C_Marca;',
        example: 'SELECT C_Anio, COUNT(*) FROM T_Inventario_CDMX GROUP BY C_Anio;'
      },
      {
        id: 7, desc: '🧑‍💼 Ventas por Vendedor (GROUP BY + SUM)',
        expected: 'SELECT C_Vendedor, SUM(C_Monto) FROM T_Ventas_CDMX GROUP BY C_Vendedor',
        hint: 'SELECT C_Vendedor, SUM(C_Monto) FROM T_Ventas_CDMX GROUP BY C_Vendedor;',
        example: 'SELECT C_Vendedor, COUNT(*) FROM T_Ventas_CDMX GROUP BY C_Vendedor;'
      },
      {
        id: 8, desc: '⚠️ ERROR DE NODO: Promedio por marca, solo 2025',
        expected: 'SELECT C_Marca, AVG(C_Precio) FROM T_Inventario_CDMX WHERE C_Anio = 2025 GROUP BY C_Marca',
        hint: 'SELECT C_Marca, AVG(C_Precio) FROM T_Inventario_CDMX WHERE C_Anio = 2025 GROUP BY C_Marca;',
        example: 'SELECT C_Marca, AVG(C_Precio) FROM T_Inventario_CDMX WHERE C_Anio = 2024 GROUP BY C_Marca;'
      },
      {
        id: 9, desc: '🕳️ Conteo de Vacíos (COUNT + WHERE IS NULL)',
        expected: 'SELECT COUNT(*) FROM T_Inventario_CDMX WHERE C_Color IS NULL',
        hint: 'SELECT COUNT(*) FROM T_Inventario_CDMX WHERE C_Color IS NULL;',
        example: 'SELECT COUNT(*) FROM T_Inventario_CDMX WHERE C_Anio = 2025;'
      },
      {
        id: 10, desc: '🏢 Resumen de Región (SUM + COUNT por sucursal)',
        expected: 'SELECT C_Sucursal, SUM(C_Monto), COUNT(*) FROM T_Ventas_CDMX GROUP BY C_Sucursal',
        hint: 'SELECT C_Sucursal, SUM(C_Monto), COUNT(*) FROM T_Ventas_CDMX GROUP BY C_Sucursal;',
        example: 'SELECT C_Sucursal, AVG(C_Monto) FROM T_Ventas_CDMX GROUP BY C_Sucursal;'
      }
    ],
    xp: 250, coins: 1800, difficulty: 4, skill: 'ADVANCED',
    diaryEntry: 'Día 4: CDMX consolidada. Don Carlos vio sus totales cuadrar al centavo y solo asintió. Ana dice que ese gesto equivale a una ovación.',
    hasTutorial: true,
    hasTrivia: true,
    hasBoss: true
  },
  5: {
    title: 'El Filtro del Consejo (Nacional)',
    concept: `<strong>📜 Comandos de este ejercicio</strong><br><br>
      <code>GROUP BY col1, col2</code> — agrupa por DOS categorías a la vez<br>
      <code>WHERE</code> — filtra <strong>filas</strong> ANTES de agrupar<br>
      <code>HAVING</code> — filtra <strong>grupos</strong> DESPUÉS de agrupar<br>
      <code>ROUND(AVG(...))</code> — redondea el promedio<br><br>
      <em>Tip: Don Carlos quiere separar el trigo de la paja. Tablas nacionales: T_Inventario y T_Ventas.</em>`,
    subExercises: [
      {
        id: 1, desc: '🗺️ Agrupación Doble (marca y sucursal)',
        expected: 'SELECT C_Marca, C_Sucursal, COUNT(*) FROM T_Inventario GROUP BY C_Marca, C_Sucursal',
        hint: 'SELECT C_Marca, C_Sucursal, COUNT(*) FROM T_Inventario GROUP BY C_Marca, C_Sucursal;',
        example: 'SELECT C_Sucursal, C_Anio, COUNT(*) FROM T_Inventario GROUP BY C_Sucursal, C_Anio;'
      },
      {
        id: 2, desc: '📦 El Filtro de Volumen (más de 20 unidades)',
        expected: 'SELECT C_Marca, COUNT(*) FROM T_Inventario GROUP BY C_Marca HAVING COUNT(*) > 20',
        hint: 'SELECT C_Marca, COUNT(*) FROM T_Inventario GROUP BY C_Marca HAVING COUNT(*) > 20;',
        example: 'SELECT C_Sucursal, COUNT(*) FROM T_Inventario GROUP BY C_Sucursal HAVING COUNT(*) > 25;'
      },
      {
        id: 3, desc: '⭐ Vendedores Estrella (más de $3,000,000)',
        expected: 'SELECT C_Vendedor, SUM(C_Monto) FROM T_Ventas GROUP BY C_Vendedor HAVING SUM(C_Monto) > 3000000',
        hint: 'SELECT C_Vendedor, SUM(C_Monto) FROM T_Ventas GROUP BY C_Vendedor HAVING SUM(C_Monto) > 3000000;',
        example: 'SELECT C_Vendedor, COUNT(*) FROM T_Ventas GROUP BY C_Vendedor HAVING COUNT(*) > 5;'
      },
      {
        id: 4, desc: '⚠️ GLITCH: Promedio por marca > $400,000',
        expected: 'SELECT C_Marca, AVG(C_Monto) FROM T_Ventas GROUP BY C_Marca HAVING AVG(C_Monto) > 400000',
        hint: 'SELECT C_Marca, AVG(C_Monto) FROM T_Ventas GROUP BY C_Marca HAVING AVG(C_Monto) > 400000;',
        example: 'SELECT C_Sucursal, AVG(C_Monto) FROM T_Ventas GROUP BY C_Sucursal HAVING AVG(C_Monto) > 500000;'
      },
      {
        id: 5, desc: '💎 Sucursales de Élite (MAX > $1,500,000)',
        expected: 'SELECT C_Sucursal, MAX(C_Precio) FROM T_Inventario GROUP BY C_Sucursal HAVING MAX(C_Precio) > 1500000',
        hint: 'SELECT C_Sucursal, MAX(C_Precio) FROM T_Inventario GROUP BY C_Sucursal HAVING MAX(C_Precio) > 1500000;',
        example: 'SELECT C_Sucursal, MIN(C_Precio) FROM T_Inventario GROUP BY C_Sucursal HAVING MIN(C_Precio) < 300000;'
      },
      {
        id: 6, desc: '🚗 Marcas Económicas (promedio < $300,000)',
        expected: 'SELECT C_Marca, AVG(C_Precio) FROM T_Inventario GROUP BY C_Marca HAVING AVG(C_Precio) < 300000',
        hint: 'SELECT C_Marca, AVG(C_Precio) FROM T_Inventario GROUP BY C_Marca HAVING AVG(C_Precio) < 300000;',
        example: 'SELECT C_Marca, AVG(C_Precio) FROM T_Inventario GROUP BY C_Marca HAVING AVG(C_Precio) > 1000000;'
      },
      {
        id: 7, desc: '🔢 Conteo Regional (más de 5 modelos distintos)',
        expected: 'SELECT C_Sucursal, COUNT(DISTINCT C_Modelo) FROM T_Inventario GROUP BY C_Sucursal HAVING COUNT(DISTINCT C_Modelo) > 5',
        hint: 'SELECT C_Sucursal, COUNT(DISTINCT C_Modelo) FROM T_Inventario GROUP BY C_Sucursal HAVING COUNT(DISTINCT C_Modelo) > 5;',
        example: 'SELECT C_Sucursal, COUNT(DISTINCT C_Marca) FROM T_Inventario GROUP BY C_Sucursal HAVING COUNT(DISTINCT C_Marca) > 3;'
      },
      {
        id: 8, desc: "⚠️ ERROR DE NODO: WHERE Blanco → HAVING > $1,000,000",
        expected: "SELECT C_Marca, SUM(C_Monto) FROM T_Ventas WHERE C_Color = 'Blanco' GROUP BY C_Marca HAVING SUM(C_Monto) > 1000000",
        hint: "SELECT C_Marca, SUM(C_Monto) FROM T_Ventas WHERE C_Color = 'Blanco' GROUP BY C_Marca HAVING SUM(C_Monto) > 1000000;",
        example: "SELECT C_Marca, SUM(C_Monto) FROM T_Ventas WHERE C_Color = 'Negro' GROUP BY C_Marca HAVING SUM(C_Monto) > 500000;"
      },
      {
        id: 9, desc: '📉 Análisis de Inventario (stock total < 3, resurtir)',
        expected: 'SELECT C_Marca, SUM(C_Stock) FROM T_Inventario GROUP BY C_Marca HAVING SUM(C_Stock) < 3',
        hint: 'SELECT C_Marca, SUM(C_Stock) FROM T_Inventario GROUP BY C_Marca HAVING SUM(C_Stock) < 3;',
        example: 'SELECT C_Marca, SUM(C_Stock) FROM T_Inventario GROUP BY C_Marca HAVING SUM(C_Stock) > 20;'
      },
      {
        id: 10, desc: '🧹 La Gran Limpieza (ROUND, sin Toyota, prom > $500,000)',
        expected: "SELECT C_Marca, ROUND(AVG(C_Precio)) FROM T_Inventario WHERE C_Marca != 'Toyota' GROUP BY C_Marca HAVING AVG(C_Precio) > 500000",
        hint: "SELECT C_Marca, ROUND(AVG(C_Precio)) FROM T_Inventario WHERE C_Marca != 'Toyota' GROUP BY C_Marca HAVING AVG(C_Precio) > 500000;",
        example: "SELECT C_Marca, ROUND(AVG(C_Precio)) FROM T_Inventario WHERE C_Marca != 'Lexus' GROUP BY C_Marca HAVING AVG(C_Precio) < 500000;"
      }
    ],
    xp: 300, coins: 2000, difficulty: 4, skill: 'ADVANCED',
    diaryEntry: 'Día 5: El reporte nacional pasó el consejo. Don Carlos guardó el documento sin tachaduras rojas — primera vez en la historia de Grupo Velocity, según Ana.',
    hasTutorial: true,
    hasTrivia: true,
    hasBoss: true
  },
  6: {
    title: 'El Bosque de los Vínculos (Marketing)',
    concept: `<strong>📜 Comandos de este ejercicio</strong><br><br>
      <code>INNER JOIN tabla ON llave = llave</code> — une tablas por su "cable"<br>
      <code>FROM T_Ventas AS V</code> — alias corto de tabla<br>
      <code>V.C_Columna</code> — columna calificada (evita ambigüedad)<br><br>
      <em>Tip: solo trae registros que coinciden en AMBAS tablas. La llave (ON) suele ser un ID.</em>`,
    subExercises: [
      {
        id: 1, desc: '🔗 La Primera Unión (ventas + clientes GDL)',
        expected: 'SELECT C_Nombre_Completo, C_ID_Venta FROM T_Ventas_GDL INNER JOIN T_Clientes_GDL ON T_Ventas_GDL.C_ID_Cliente = T_Clientes_GDL.C_ID_Cliente',
        hint: 'SELECT C_Nombre_Completo, C_ID_Venta FROM T_Ventas_GDL INNER JOIN T_Clientes_GDL ON T_Ventas_GDL.C_ID_Cliente = T_Clientes_GDL.C_ID_Cliente;',
        example: 'SELECT C_Correo, C_ID_Venta FROM T_Ventas_GDL INNER JOIN T_Clientes_GDL ON T_Ventas_GDL.C_ID_Cliente = T_Clientes_GDL.C_ID_Cliente;'
      },
      {
        id: 2, desc: '🚗 Detalle de Compra (ventas + inventario nacional)',
        expected: 'SELECT C_ID_Venta, C_Modelo FROM T_Ventas INNER JOIN T_Inventario ON T_Ventas.C_VIN = T_Inventario.C_VIN',
        hint: 'SELECT C_ID_Venta, C_Modelo FROM T_Ventas INNER JOIN T_Inventario ON T_Ventas.C_VIN = T_Inventario.C_VIN;',
        example: 'SELECT C_ID_Venta, C_Modelo, C_Monto FROM T_Ventas INNER JOIN T_Inventario ON T_Ventas.C_VIN = T_Inventario.C_VIN;'
      },
      {
        id: 3, desc: '🎯 Triple Alianza (cliente + modelo + fecha)',
        expected: 'SELECT C_Nombre_Completo, C_Modelo, C_Fecha FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente INNER JOIN T_Inventario ON T_Ventas.C_VIN = T_Inventario.C_VIN',
        hint: 'SELECT C_Nombre_Completo, C_Modelo, C_Fecha FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente INNER JOIN T_Inventario ON T_Ventas.C_VIN = T_Inventario.C_VIN;',
        example: 'SELECT C_Nombre_Completo, C_Modelo, C_Monto FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente INNER JOIN T_Inventario ON T_Ventas.C_VIN = T_Inventario.C_VIN;'
      },
      {
        id: 4, desc: '⚠️ GLITCH: Ventas con cliente válido (COUNT + JOIN)',
        expected: 'SELECT COUNT(*) FROM T_Ventas INNER JOIN T_Clientes ON T_Ventas.C_ID_Cliente = T_Clientes.C_ID_Cliente',
        hint: 'SELECT COUNT(*) FROM T_Ventas INNER JOIN T_Clientes ON T_Ventas.C_ID_Cliente = T_Clientes.C_ID_Cliente;',
        example: 'SELECT COUNT(*) FROM T_Ventas INNER JOIN T_Inventario ON T_Ventas.C_VIN = T_Inventario.C_VIN;'
      },
      {
        id: 5, desc: '🔋 Filtro Combinado (clientes que compraron BYD)',
        expected: "SELECT C_Nombre_Completo FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente WHERE C_Marca = 'BYD'",
        hint: "SELECT C_Nombre_Completo FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente WHERE C_Marca = 'BYD';",
        example: "SELECT C_Nombre_Completo FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente WHERE C_Marca = 'Lexus';"
      },
      {
        id: 6, desc: '🏢 Vendedores y Sucursales (empleado + ciudad)',
        expected: 'SELECT C_Nombre_Vendedor, C_Ciudad FROM T_Vendedores INNER JOIN T_Sucursales ON T_Vendedores.C_ID_Sucursal = T_Sucursales.C_ID_Sucursal',
        hint: 'SELECT C_Nombre_Vendedor, C_Ciudad FROM T_Vendedores INNER JOIN T_Sucursales ON T_Vendedores.C_ID_Sucursal = T_Sucursales.C_ID_Sucursal;',
        example: 'SELECT C_Nombre_Vendedor, C_Nombre_Sucursal FROM T_Vendedores INNER JOIN T_Sucursales ON T_Vendedores.C_ID_Sucursal = T_Sucursales.C_ID_Sucursal;'
      },
      {
        id: 7, desc: '💳 Gasto por Cliente (JOIN + SUM + GROUP BY)',
        expected: 'SELECT C_Nombre_Completo, SUM(C_Monto) FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente GROUP BY C_Nombre_Completo',
        hint: 'SELECT C_Nombre_Completo, SUM(C_Monto) FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente GROUP BY C_Nombre_Completo;',
        example: 'SELECT C_Nombre_Completo, COUNT(*) FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente GROUP BY C_Nombre_Completo;'
      },
      {
        id: 8, desc: "⚠️ ERROR DE NODO: Modelos SLP color Blanco (alias V/I)",
        expected: "SELECT I.C_Modelo FROM T_Ventas AS V INNER JOIN T_Inventario AS I ON V.C_VIN = I.C_VIN WHERE V.C_Sucursal = 'SLP' AND V.C_Color = 'Blanco'",
        hint: "SELECT I.C_Modelo FROM T_Ventas AS V INNER JOIN T_Inventario AS I ON V.C_VIN = I.C_VIN WHERE V.C_Sucursal = 'SLP' AND V.C_Color = 'Blanco'; -- V.C_Color califica la columna: ambas tablas tienen C_Color",
        example: "SELECT I.C_Modelo FROM T_Ventas AS V INNER JOIN T_Inventario AS I ON V.C_VIN = I.C_VIN WHERE V.C_Sucursal = 'GDL' AND V.C_Color = 'Blanco';"
      },
      {
        id: 9, desc: '✂️ Alias Maestros (C para clientes, V para ventas)',
        expected: 'SELECT C.C_Nombre_Completo, V.C_Monto FROM T_Clientes AS C INNER JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente',
        hint: 'SELECT C.C_Nombre_Completo, V.C_Monto FROM T_Clientes AS C INNER JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente;',
        example: 'SELECT C.C_Correo, V.C_Fecha FROM T_Clientes AS C INNER JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente;'
      },
      {
        id: 10, desc: '📧 La Gran Lista de Marketing (compradores 2025)',
        expected: 'SELECT C_Nombre_Completo, C_Correo, C_Modelo FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente INNER JOIN T_Inventario ON T_Ventas.C_VIN = T_Inventario.C_VIN WHERE T_Ventas.C_Anio = 2025',
        hint: 'SELECT C_Nombre_Completo, C_Correo, C_Modelo FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente INNER JOIN T_Inventario ON T_Ventas.C_VIN = T_Inventario.C_VIN WHERE T_Ventas.C_Anio = 2025; -- T_Ventas.C_Anio: el año también existe en inventario',
        example: 'SELECT C_Nombre_Completo, C_Correo, C_Modelo FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente INNER JOIN T_Inventario ON T_Ventas.C_VIN = T_Inventario.C_VIN WHERE T_Ventas.C_Anio = 2024;'
      }
    ],
    xp: 350, coins: 2200, difficulty: 5, skill: 'ADVANCED',
    diaryEntry: 'Día 6: Reconecté los cables que The Void cortó. Mariana lanzó su campaña a tiempo y los clientes volvieron a tener nombre, correo y auto. Las tablas ya se hablan entre ellas.',
    hasTutorial: true,
    hasTrivia: true,
    hasBoss: true
  },
  7: {
    title: 'El Lado Oscuro de los Datos (Marketing II)',
    concept: `<strong>📜 Comandos de este ejercicio</strong><br><br>
      <code>LEFT JOIN</code> — trae TODO de la izquierda; sin coincidencia → NULL<br>
      <code>WHERE derecha.col IS NULL</code> — encuentra los "fantasmas"<br>
      <code>ON a = b AND condición</code> — condición extra en la unión<br><br>
      <em>Tip: a veces lo más valioso es lo que NO está en la otra tabla.</em>`,
    subExercises: [
      {
        id: 1, desc: '🌗 Inclusión de Clientes (LEFT JOIN completo)',
        expected: 'SELECT * FROM T_Clientes LEFT JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente',
        hint: 'SELECT * FROM T_Clientes LEFT JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente;',
        example: 'SELECT * FROM T_Vendedores LEFT JOIN T_Ventas ON T_Vendedores.C_Nombre_Vendedor = T_Ventas.C_Vendedor;'
      },
      {
        id: 2, desc: '👻 Detectar el Vacío (clientes que nunca compraron)',
        expected: 'SELECT * FROM T_Clientes AS C LEFT JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente WHERE V.C_ID_Venta IS NULL',
        hint: 'SELECT * FROM T_Clientes AS C LEFT JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente WHERE V.C_ID_Venta IS NULL;',
        example: 'SELECT C.C_Nombre_Completo FROM T_Clientes AS C LEFT JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente WHERE V.C_ID_Venta IS NULL;'
      },
      {
        id: 3, desc: '🚗 Inventario Estancado (todos los autos, vendidos o no)',
        expected: 'SELECT * FROM T_Inventario AS I LEFT JOIN T_Ventas AS V ON I.C_VIN = V.C_VIN',
        hint: 'SELECT * FROM T_Inventario AS I LEFT JOIN T_Ventas AS V ON I.C_VIN = V.C_VIN;',
        example: 'SELECT I.C_Modelo, V.C_Fecha FROM T_Inventario AS I LEFT JOIN T_Ventas AS V ON I.C_VIN = V.C_VIN;'
      },
      {
        id: 4, desc: '⚠️ GLITCH: ¿Cuántos autos sin vender? (COUNT + IS NULL)',
        expected: 'SELECT COUNT(*) FROM T_Inventario AS I LEFT JOIN T_Ventas AS V ON I.C_VIN = V.C_VIN WHERE V.C_ID_Venta IS NULL',
        hint: 'SELECT COUNT(*) FROM T_Inventario AS I LEFT JOIN T_Ventas AS V ON I.C_VIN = V.C_VIN WHERE V.C_ID_Venta IS NULL;',
        example: 'SELECT COUNT(*) FROM T_Clientes AS C LEFT JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente WHERE V.C_ID_Venta IS NULL;'
      },
      {
        id: 5, desc: '😔 Vendedores sin Suerte (sin ventas este mes)',
        expected: 'SELECT C_Nombre_Vendedor FROM T_Vendedores AS VE LEFT JOIN T_Ventas AS V ON VE.C_Nombre_Vendedor = V.C_Vendedor WHERE V.C_ID_Venta IS NULL',
        hint: 'SELECT C_Nombre_Vendedor FROM T_Vendedores AS VE LEFT JOIN T_Ventas AS V ON VE.C_Nombre_Vendedor = V.C_Vendedor WHERE V.C_ID_Venta IS NULL;',
        example: 'SELECT VE.C_Nombre_Vendedor, COUNT(V.C_ID_Venta) FROM T_Vendedores AS VE LEFT JOIN T_Ventas AS V ON VE.C_Nombre_Vendedor = V.C_Vendedor GROUP BY VE.C_Nombre_Vendedor;'
      },
      {
        id: 6, desc: '📞 Campaña de Reactivación (GDL sin compras 2025)',
        expected: "SELECT C_Nombre_Completo, C_Telefono FROM T_Clientes AS C LEFT JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente AND V.C_Anio = 2025 WHERE C.C_Ciudad_Registro = 'GDL' AND V.C_ID_Venta IS NULL",
        hint: "SELECT C_Nombre_Completo, C_Telefono FROM T_Clientes AS C LEFT JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente AND V.C_Anio = 2025 WHERE C.C_Ciudad_Registro = 'GDL' AND V.C_ID_Venta IS NULL; -- La condición del año va en el ON, no en el WHERE",
        example: "SELECT C_Nombre_Completo, C_Telefono FROM T_Clientes AS C LEFT JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente AND V.C_Anio = 2024 WHERE C.C_Ciudad_Registro = 'MTY' AND V.C_ID_Venta IS NULL;"
      },
      {
        id: 7, desc: '📖 Modelos Olvidados (en catálogo pero sin stock)',
        expected: 'SELECT M.C_Modelo FROM T_Modelos AS M LEFT JOIN T_Inventario AS I ON M.C_Modelo = I.C_Modelo WHERE I.C_VIN IS NULL',
        hint: 'SELECT M.C_Modelo FROM T_Modelos AS M LEFT JOIN T_Inventario AS I ON M.C_Modelo = I.C_Modelo WHERE I.C_VIN IS NULL;',
        example: 'SELECT M.C_Modelo, COUNT(I.C_VIN) FROM T_Modelos AS M LEFT JOIN T_Inventario AS I ON M.C_Modelo = I.C_Modelo GROUP BY M.C_Modelo;'
      },
      {
        id: 8, desc: '⚠️ ERROR DE NODO: Compraron pero no pagaron (3 tablas)',
        expected: 'SELECT C.C_Nombre_Completo FROM T_Clientes AS C INNER JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente LEFT JOIN T_Pagos AS P ON V.C_ID_Venta = P.C_ID_Venta WHERE P.C_ID_Pago IS NULL',
        hint: 'SELECT C.C_Nombre_Completo FROM T_Clientes AS C INNER JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente LEFT JOIN T_Pagos AS P ON V.C_ID_Venta = P.C_ID_Venta WHERE P.C_ID_Pago IS NULL;',
        example: 'SELECT C.C_Nombre_Completo, V.C_Monto FROM T_Clientes AS C INNER JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente LEFT JOIN T_Pagos AS P ON V.C_ID_Venta = P.C_ID_Venta WHERE P.C_ID_Pago IS NULL;'
      },
      {
        id: 9, desc: '🔢 Contar lo Inexistente (no vendidos por marca)',
        expected: 'SELECT I.C_Marca, COUNT(*) FROM T_Inventario AS I LEFT JOIN T_Ventas AS V ON I.C_VIN = V.C_VIN WHERE V.C_ID_Venta IS NULL GROUP BY I.C_Marca',
        hint: 'SELECT I.C_Marca, COUNT(*) FROM T_Inventario AS I LEFT JOIN T_Ventas AS V ON I.C_VIN = V.C_VIN WHERE V.C_ID_Venta IS NULL GROUP BY I.C_Marca;',
        example: 'SELECT I.C_Sucursal, COUNT(*) FROM T_Inventario AS I LEFT JOIN T_Ventas AS V ON I.C_VIN = V.C_VIN WHERE V.C_ID_Venta IS NULL GROUP BY I.C_Sucursal;'
      },
      {
        id: 10, desc: '🕵️ La Gran Auditoría (clientes sin compra por ciudad)',
        expected: 'SELECT C.C_Ciudad_Registro, COUNT(*) FROM T_Clientes AS C LEFT JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente WHERE V.C_ID_Venta IS NULL GROUP BY C.C_Ciudad_Registro',
        hint: 'SELECT C.C_Ciudad_Registro, COUNT(*) FROM T_Clientes AS C LEFT JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente WHERE V.C_ID_Venta IS NULL GROUP BY C.C_Ciudad_Registro;',
        example: 'SELECT C.C_Ciudad_Registro, COUNT(*) FROM T_Clientes AS C INNER JOIN T_Ventas AS V ON C.C_ID_Cliente = V.C_ID_Cliente GROUP BY C.C_Ciudad_Registro;'
      }
    ],
    xp: 400, coins: 2500, difficulty: 5, skill: 'ADVANCED',
    diaryEntry: 'Día 7: Encontré a los fantasmas — clientes sin compras, autos sin dueño, ventas sin pago. Mariana ya tiene su campaña de reconquista. Lo que The Void ocultó, un LEFT JOIN lo revela.',
    hasTutorial: true,
    hasTrivia: true,
    hasBoss: true
  },
  8: {
    title: 'La Purga de Datos (El Auditor)',
    concept: `<strong>📜 Comandos de este ejercicio (DML)</strong><br><br>
      <code>INSERT INTO tabla VALUES (...)</code> — crear registros<br>
      <code>UPDATE tabla SET col = valor WHERE ...</code> — corregir<br>
      <code>DELETE FROM tabla WHERE ...</code> — eliminar<br><br>
      <em>⚠️ Regla de oro del Auditor: un UPDATE o DELETE sin WHERE es el fin de tu carrera.</em>`,
    subExercises: [
      {
        id: 1, desc: "🆕 Nuevo Ingreso (cliente 17: 'Toño Nexus')",
        expected: "INSERT INTO T_Clientes VALUES (17, 'Toño Nexus', 'tono@nexcorp.mx', '3312345678', 'GDL')",
        hint: "INSERT INTO T_Clientes VALUES (17, 'Toño Nexus', 'tono@nexcorp.mx', '3312345678', 'GDL');",
        example: "INSERT INTO T_Clientes VALUES (18, 'Cliente Demo', 'demo@nexcorp.mx', '3300000000', 'CDMX');"
      },
      {
        id: 2, desc: "💲 Corrección de Precios (VIN 'TR123' → $450,000)",
        expected: "UPDATE T_Inventario SET C_Precio = 450000 WHERE C_VIN = 'TR123'",
        hint: "UPDATE T_Inventario SET C_Precio = 450000 WHERE C_VIN = 'TR123';",
        example: "UPDATE T_Inventario SET C_Color = 'Gris' WHERE C_VIN = 'TR123';"
      },
      {
        id: 3, desc: "🔥 El Gran Despido (borrar a 'TheVoid_User')",
        expected: "DELETE FROM T_Vendedores WHERE C_Nombre_Vendedor = 'TheVoid_User'",
        hint: "DELETE FROM T_Vendedores WHERE C_Nombre_Vendedor = 'TheVoid_User';",
        example: "DELETE FROM T_Pruebas_Errores WHERE C_ID = 99;"
      },
      {
        id: 4, desc: "⚠️ GLITCH: Kia 2023 → 'Remate' (UPDATE con doble filtro)",
        expected: "UPDATE T_Inventario SET C_Observaciones = 'Remate' WHERE C_Marca = 'Kia' AND C_Anio = 2023",
        hint: "UPDATE T_Inventario SET C_Observaciones = 'Remate' WHERE C_Marca = 'Kia' AND C_Anio = 2023;",
        example: "UPDATE T_Inventario SET C_Observaciones = 'Demo' WHERE C_Marca = 'Toyota' AND C_Anio = 2023;"
      },
      {
        id: 5, desc: '📦 Carga Masiva (3 registros en un solo INSERT)',
        expected: "INSERT INTO T_Pruebas_Errores VALUES (10, 'Prueba1'), (11, 'Prueba2'), (12, 'Prueba3')",
        hint: "INSERT INTO T_Pruebas_Errores VALUES (10, 'Prueba1'), (11, 'Prueba2'), (12, 'Prueba3');",
        example: "INSERT INTO T_Logs_Temporales VALUES (10, 'Log A', '2025-06-01'), (11, 'Log B', '2025-06-02');"
      },
      {
        id: 6, desc: "📞 Sincronización (teléfonos NULL → '000-000-0000')",
        expected: "UPDATE T_Clientes SET C_Telefono = '000-000-0000' WHERE C_Telefono IS NULL",
        hint: "UPDATE T_Clientes SET C_Telefono = '000-000-0000' WHERE C_Telefono IS NULL;",
        example: "UPDATE T_Inventario SET C_Color = 'Pendiente' WHERE C_Color IS NULL;"
      },
      {
        id: 7, desc: "🧹 Limpieza Regional (logs anteriores a 2025)",
        expected: "DELETE FROM T_Logs_Temporales WHERE C_Fecha_Evento < '2025-01-01'",
        hint: "DELETE FROM T_Logs_Temporales WHERE C_Fecha_Evento < '2025-01-01';",
        example: "DELETE FROM T_Logs_Temporales WHERE C_Fecha_Evento < '2024-01-01';"
      },
      {
        id: 8, desc: '⚠️ ERROR DE NODO: +5% a los Lexus (matemática en el SET)',
        expected: "UPDATE T_Inventario SET C_Precio = C_Precio * 1.05 WHERE C_Marca = 'Lexus'",
        hint: "UPDATE T_Inventario SET C_Precio = C_Precio * 1.05 WHERE C_Marca = 'Lexus';",
        example: "UPDATE T_Inventario SET C_Precio = C_Precio * 0.9 WHERE C_Marca = 'Chirey';"
      },
      {
        id: 9, desc: '☢️ Vaciado Seguro (limpiar T_Pruebas_Errores)',
        expected: 'DELETE FROM T_Pruebas_Errores',
        hint: 'DELETE FROM T_Pruebas_Errores; -- En SQL Server usarías: TRUNCATE TABLE T_Pruebas_Errores (más rápido, no registra fila por fila)',
        example: 'DELETE FROM T_Logs_Temporales;'
      },
      {
        id: 10, desc: '🔒 Seguridad Total (¿por qué la FK protegería al cliente 1?)',
        expected: 'SELECT COUNT(*) FROM T_Ventas WHERE C_ID_Cliente = 1',
        hint: 'SELECT COUNT(*) FROM T_Ventas WHERE C_ID_Cliente = 1; -- Estas ventas dependen del cliente: una Foreign Key bloquearía su DELETE para no dejar ventas huérfanas',
        example: 'SELECT COUNT(*) FROM T_Ventas WHERE C_ID_Cliente = 5;'
      }
    ],
    xp: 450, coins: 3000, difficulty: 5, skill: 'ADVANCED',
    diaryEntry: 'Día 8: Toqué la realidad por primera vez — inserté, corregí y purgué. El Auditor no sonríe, pero retiró las infracciones de mi expediente. La base vuelve a estar limpia.',
    hasTutorial: true,
    hasTrivia: true,
    hasBoss: true
  },
  9: {
    title: 'El Arquitecto del NEXUS (Infraestructura)',
    concept: `<strong>📜 Comandos de este ejercicio (DDL)</strong><br><br>
      <code>CREATE TABLE (col TIPO, ...)</code> — diseñar contenedores<br>
      <code>CREATE VIEW nombre AS SELECT ...</code> — tabla virtual con lógica guardada<br>
      <code>WHERE col > (SELECT AVG(...) ...)</code> — subconsulta como filtro<br><br>
      <em>Tip de Aranda: deja de ser usuario. Empieza a ser Creador.</em>`,
    subExercises: [
      {
        id: 1, desc: '🏗️ Fundación (tabla de las agencias de Cancún)',
        expected: 'CREATE TABLE T_Nuevas_Agencias_Movil (C_ID_Agencia INT, C_Ciudad VARCHAR(50), C_Apertura DATE)',
        hint: 'CREATE TABLE T_Nuevas_Agencias_Movil (C_ID_Agencia INT, C_Ciudad VARCHAR(50), C_Apertura DATE);',
        example: 'CREATE TABLE T_Demo (C_ID INT, C_Nombre VARCHAR(50));'
      },
      {
        id: 2, desc: '🪟 La Ventana de Roberto (vista con JOIN guardado)',
        expected: 'CREATE VIEW V_Inventario_Rapido AS SELECT I.C_VIN, I.C_Modelo, M.C_Marca FROM T_Inventario AS I INNER JOIN T_Modelos AS M ON I.C_Modelo = M.C_Modelo',
        hint: 'CREATE VIEW V_Inventario_Rapido AS SELECT I.C_VIN, I.C_Modelo, M.C_Marca FROM T_Inventario AS I INNER JOIN T_Modelos AS M ON I.C_Modelo = M.C_Modelo;',
        example: 'CREATE VIEW V_Ventas_Simple AS SELECT C_ID_Venta, C_Monto FROM T_Ventas;'
      },
      {
        id: 3, desc: '🎯 Subconsulta Simple (más caros que el promedio global)',
        expected: 'SELECT * FROM T_Inventario WHERE C_Precio > (SELECT AVG(C_Precio) FROM T_Inventario)',
        hint: 'SELECT * FROM T_Inventario WHERE C_Precio > (SELECT AVG(C_Precio) FROM T_Inventario);',
        example: 'SELECT * FROM T_Ventas WHERE C_Monto > (SELECT AVG(C_Monto) FROM T_Ventas);'
      },
      {
        id: 4, desc: "⚠️ GLITCH: Caché de Emergencia (CREATE TABLE ... AS SELECT)",
        expected: "CREATE TABLE T_Cache_Precios AS SELECT C_VIN, C_Precio FROM T_Inventario WHERE C_Marca = 'Lexus'",
        hint: "CREATE TABLE T_Cache_Precios AS SELECT C_VIN, C_Precio FROM T_Inventario WHERE C_Marca = 'Lexus'; -- En SQL Server: SELECT C_VIN, C_Precio INTO T_Cache_Precios FROM ...",
        example: "CREATE TABLE T_Cache_BYD AS SELECT C_VIN, C_Precio FROM T_Inventario WHERE C_Marca = 'BYD';"
      },
      {
        id: 5, desc: '🔐 Seguridad de Vista (VIP > $1,000,000 para Don Víctor)',
        expected: 'CREATE VIEW V_Clientes_VIP AS SELECT C_Nombre_Completo, SUM(C_Monto) AS M_Total FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente GROUP BY C_Nombre_Completo HAVING SUM(C_Monto) > 1000000',
        hint: 'CREATE VIEW V_Clientes_VIP AS SELECT C_Nombre_Completo, SUM(C_Monto) AS M_Total FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente GROUP BY C_Nombre_Completo HAVING SUM(C_Monto) > 1000000;',
        example: 'CREATE VIEW V_Compradores AS SELECT C_Nombre_Completo, COUNT(*) AS M_Compras FROM T_Clientes INNER JOIN T_Ventas ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente GROUP BY C_Nombre_Completo;'
      },
      {
        id: 6, desc: "👑 El Elegido (subconsulta IN: compradores de 'Hilux')",
        expected: "SELECT C_Nombre_Completo FROM T_Clientes WHERE C_ID_Cliente IN (SELECT C_ID_Cliente FROM T_Ventas WHERE C_VIN IN (SELECT C_VIN FROM T_Inventario WHERE C_Modelo = 'Hilux'))",
        hint: "SELECT C_Nombre_Completo FROM T_Clientes WHERE C_ID_Cliente IN (SELECT C_ID_Cliente FROM T_Ventas WHERE C_VIN IN (SELECT C_VIN FROM T_Inventario WHERE C_Modelo = 'Hilux')); -- Subconsulta dentro de subconsulta: de adentro hacia afuera",
        example: "SELECT C_Nombre_Completo FROM T_Clientes WHERE C_ID_Cliente IN (SELECT C_ID_Cliente FROM T_Ventas WHERE C_Marca = 'Lexus');"
      },
      {
        id: 7, desc: '🧱 Estructura de Ventas (columna NOT NULL)',
        expected: 'CREATE TABLE T_Metodos_Pago (C_ID_Metodo INTEGER PRIMARY KEY, C_Nombre_Metodo TEXT NOT NULL)',
        hint: 'CREATE TABLE T_Metodos_Pago (C_ID_Metodo INTEGER PRIMARY KEY, C_Nombre_Metodo TEXT NOT NULL);',
        example: 'CREATE TABLE T_Estados (C_ID_Estado INTEGER PRIMARY KEY, C_Nombre_Estado TEXT NOT NULL);'
      },
      {
        id: 8, desc: '⚠️ ERROR DE NODO: Vista de 4 tablas (sin ORDER BY)',
        expected: 'CREATE VIEW V_Reporte_Completo AS SELECT C.C_Nombre_Completo, I.C_Modelo, VE.C_Nombre_Vendedor, V.C_Monto FROM T_Ventas AS V INNER JOIN T_Clientes AS C ON V.C_ID_Cliente = C.C_ID_Cliente INNER JOIN T_Inventario AS I ON V.C_VIN = I.C_VIN INNER JOIN T_Vendedores AS VE ON V.C_Vendedor = VE.C_Nombre_Vendedor',
        hint: "CREATE VIEW V_Reporte_Completo AS SELECT C.C_Nombre_Completo, I.C_Modelo, VE.C_Nombre_Vendedor, V.C_Monto FROM T_Ventas AS V INNER JOIN T_Clientes AS C ON V.C_ID_Cliente = C.C_ID_Cliente INNER JOIN T_Inventario AS I ON V.C_VIN = I.C_VIN INNER JOIN T_Vendedores AS VE ON V.C_Vendedor = VE.C_Nombre_Vendedor; -- En SQL Server un ORDER BY dentro de una vista lanza error (salvo con TOP 100 PERCENT). El orden se pide al CONSULTAR la vista.",
        example: 'SELECT * FROM V_Reporte_Completo ORDER BY C_Monto DESC;'
      },
      {
        id: 9, desc: '🔄 Filtro Dinámico (correlacionada: ventas sobre el promedio de SU sucursal)',
        expected: 'SELECT C_Vendedor, C_Monto FROM T_Ventas AS V1 WHERE C_Monto > (SELECT AVG(C_Monto) FROM T_Ventas AS V2 WHERE V2.C_Sucursal = V1.C_Sucursal)',
        hint: 'SELECT C_Vendedor, C_Monto FROM T_Ventas AS V1 WHERE C_Monto > (SELECT AVG(C_Monto) FROM T_Ventas AS V2 WHERE V2.C_Sucursal = V1.C_Sucursal); -- La subconsulta se recalcula por cada fila usando SU sucursal: eso la hace "correlacionada"',
        example: 'SELECT C_Vendedor, C_Monto FROM T_Ventas AS V1 WHERE C_Monto > (SELECT AVG(C_Monto) FROM T_Ventas AS V2 WHERE V2.C_Marca = V1.C_Marca);'
      },
      {
        id: 10, desc: '⏰ La Gran Expansión (fecha automática con DEFAULT)',
        expected: 'CREATE TABLE T_Auditoria_Maestra (C_ID_Evento INTEGER PRIMARY KEY, C_Descripcion TEXT, C_Fecha DATE DEFAULT CURRENT_TIMESTAMP)',
        hint: 'CREATE TABLE T_Auditoria_Maestra (C_ID_Evento INTEGER PRIMARY KEY, C_Descripcion TEXT, C_Fecha DATE DEFAULT CURRENT_TIMESTAMP); -- En SQL Server: DEFAULT GETDATE()',
        example: 'CREATE TABLE T_Bitacora (C_ID INTEGER PRIMARY KEY, C_Nota TEXT, C_Registro DATE DEFAULT CURRENT_TIMESTAMP);'
      }
    ],
    xp: 500, coins: 4000, difficulty: 5, skill: 'ADVANCED',
    diaryEntry: 'Día 9: Dejé de ser usuario. Creé tablas, vistas y filtros que piensan solos. Aranda dice que el sistema NEXUS ya no es un laberinto: ahora tiene ventanas. Yo las construí.',
    hasTutorial: true,
    hasTrivia: true,
    hasBoss: true
  },
  10: {
    title: 'El Trono de Datos (El CEO)',
    concept: `<strong>📜 Armas legendarias de este ejercicio</strong><br><br>
      <code>WITH nombre AS (SELECT ...)</code> — CTE: bloques legibles<br>
      <code>RANK() / ROW_NUMBER() OVER (ORDER BY ...)</code> — rankings<br>
      <code>OVER (PARTITION BY col)</code> — comparar contra el grupo SIN GROUP BY<br>
      <code>SUM(...) OVER (ORDER BY fecha)</code> — acumulados<br><br>
      <em>El CEO no quiere tablas. Quiere inteligencia.</em>`,
    subExercises: [
      {
        id: 1, desc: '🥇 El Ranking de Oro (RANK sobre las 5 mayores ventas)',
        expected: 'SELECT C_Vendedor, C_Monto, RANK() OVER (ORDER BY C_Monto DESC) AS M_Ranking FROM T_Ventas LIMIT 5',
        hint: 'SELECT C_Vendedor, C_Monto, RANK() OVER (ORDER BY C_Monto DESC) AS M_Ranking FROM T_Ventas LIMIT 5;',
        example: 'SELECT C_Modelo, C_Precio, RANK() OVER (ORDER BY C_Precio DESC) AS M_Ranking FROM T_Inventario LIMIT 5;'
      },
      {
        id: 2, desc: '📐 Organización con CTE (ventas 2025, luego solo CDMX)',
        expected: "WITH CTE_Ventas_2025 AS (SELECT * FROM T_Ventas WHERE C_Anio = 2025) SELECT * FROM CTE_Ventas_2025 WHERE C_Sucursal = 'CDMX'",
        hint: "WITH CTE_Ventas_2025 AS (SELECT * FROM T_Ventas WHERE C_Anio = 2025) SELECT * FROM CTE_Ventas_2025 WHERE C_Sucursal = 'CDMX';",
        example: "WITH CTE_Caros AS (SELECT * FROM T_Inventario WHERE C_Precio > 800000) SELECT * FROM CTE_Caros WHERE C_Marca = 'Lexus';"
      },
      {
        id: 3, desc: '⚖️ Comparativa de Precios (promedio de SU marca al lado)',
        expected: 'SELECT C_Modelo, C_Precio, AVG(C_Precio) OVER (PARTITION BY C_Marca) AS M_Promedio_Marca FROM T_Inventario',
        hint: 'SELECT C_Modelo, C_Precio, AVG(C_Precio) OVER (PARTITION BY C_Marca) AS M_Promedio_Marca FROM T_Inventario;',
        example: 'SELECT C_Vendedor, C_Monto, AVG(C_Monto) OVER (PARTITION BY C_Vendedor) AS M_Promedio_Vendedor FROM T_Ventas;'
      },
      {
        id: 4, desc: '⚠️ GLITCH FINAL: Última venta de cada cliente (ROW_NUMBER)',
        expected: 'WITH CTE_Numeradas AS (SELECT C_ID_Cliente, C_Fecha, C_Monto, ROW_NUMBER() OVER (PARTITION BY C_ID_Cliente ORDER BY C_Fecha DESC) AS M_Num FROM T_Ventas) SELECT * FROM CTE_Numeradas WHERE M_Num = 1',
        hint: 'WITH CTE_Numeradas AS (SELECT C_ID_Cliente, C_Fecha, C_Monto, ROW_NUMBER() OVER (PARTITION BY C_ID_Cliente ORDER BY C_Fecha DESC) AS M_Num FROM T_Ventas) SELECT * FROM CTE_Numeradas WHERE M_Num = 1; -- El patrón deduplicador más usado en los SPs reales',
        example: 'WITH CTE_N AS (SELECT C_Marca, C_Precio, ROW_NUMBER() OVER (PARTITION BY C_Marca ORDER BY C_Precio DESC) AS M_Num FROM T_Inventario) SELECT * FROM CTE_N WHERE M_Num = 1;'
      },
      {
        id: 5, desc: '📈 Acumulado Histórico (SUM OVER por fecha)',
        expected: 'SELECT C_Fecha, C_Monto, SUM(C_Monto) OVER (ORDER BY C_Fecha) AS M_Acumulado FROM T_Ventas',
        hint: 'SELECT C_Fecha, C_Monto, SUM(C_Monto) OVER (ORDER BY C_Fecha) AS M_Acumulado FROM T_Ventas;',
        example: 'SELECT C_Fecha, C_Monto, COUNT(*) OVER (ORDER BY C_Fecha) AS M_Ventas_Acumuladas FROM T_Ventas;'
      },
      {
        id: 6, desc: '🥧 Análisis de Participación (% del total de su marca)',
        expected: 'SELECT C_Marca, C_Monto, C_Monto * 100.0 / SUM(C_Monto) OVER (PARTITION BY C_Marca) AS M_Porcentaje FROM T_Ventas',
        hint: 'SELECT C_Marca, C_Monto, C_Monto * 100.0 / SUM(C_Monto) OVER (PARTITION BY C_Marca) AS M_Porcentaje FROM T_Ventas; -- El 100.0 con decimal fuerza división real, no entera',
        example: 'SELECT C_Sucursal, C_Monto, C_Monto * 100.0 / SUM(C_Monto) OVER (PARTITION BY C_Sucursal) AS M_Porcentaje FROM T_Ventas;'
      },
      {
        id: 7, desc: '🕳️ Detección de Brechas (más de 6 meses sin comprar)',
        expected: "SELECT C_ID_Cliente, MAX(C_Fecha) AS M_Ultima_Compra FROM T_Ventas GROUP BY C_ID_Cliente HAVING MAX(C_Fecha) < date('2025-12-31', '-6 months')",
        hint: "SELECT C_ID_Cliente, MAX(C_Fecha) AS M_Ultima_Compra FROM T_Ventas GROUP BY C_ID_Cliente HAVING MAX(C_Fecha) < date('2025-12-31', '-6 months'); -- En SQL Server: DATEADD(MONTH, -6, GETDATE())",
        example: "SELECT C_ID_Cliente, MAX(C_Fecha) AS M_Ultima FROM T_Ventas GROUP BY C_ID_Cliente HAVING MAX(C_Fecha) < date('2025-12-31', '-12 months');"
      },
      {
        id: 8, desc: '⚠️ ERROR DE NODO: 3 CTEs en una salida (inventario+ventas+clientes)',
        expected: 'WITH CTE_Inventario AS (SELECT C_Marca, COUNT(*) AS M_Autos FROM T_Inventario GROUP BY C_Marca), CTE_Ventas AS (SELECT C_Marca, SUM(C_Monto) AS M_Total FROM T_Ventas GROUP BY C_Marca), CTE_Clientes AS (SELECT C_Marca, COUNT(DISTINCT C_ID_Cliente) AS M_Clientes FROM T_Ventas GROUP BY C_Marca) SELECT CTE_Inventario.C_Marca, M_Autos, M_Total, M_Clientes FROM CTE_Inventario INNER JOIN CTE_Ventas ON CTE_Inventario.C_Marca = CTE_Ventas.C_Marca INNER JOIN CTE_Clientes ON CTE_Inventario.C_Marca = CTE_Clientes.C_Marca',
        hint: 'WITH CTE_Inventario AS (SELECT C_Marca, COUNT(*) AS M_Autos FROM T_Inventario GROUP BY C_Marca), CTE_Ventas AS (SELECT C_Marca, SUM(C_Monto) AS M_Total FROM T_Ventas GROUP BY C_Marca), CTE_Clientes AS (SELECT C_Marca, COUNT(DISTINCT C_ID_Cliente) AS M_Clientes FROM T_Ventas GROUP BY C_Marca) SELECT CTE_Inventario.C_Marca, M_Autos, M_Total, M_Clientes FROM CTE_Inventario INNER JOIN CTE_Ventas ON CTE_Inventario.C_Marca = CTE_Ventas.C_Marca INNER JOIN CTE_Clientes ON CTE_Inventario.C_Marca = CTE_Clientes.C_Marca; -- Varias CTEs se separan con coma tras un solo WITH',
        example: 'WITH CTE_A AS (SELECT C_Marca, COUNT(*) AS M_N FROM T_Inventario GROUP BY C_Marca), CTE_B AS (SELECT C_Marca, AVG(C_Precio) AS M_P FROM T_Inventario GROUP BY C_Marca) SELECT CTE_A.C_Marca, M_N, M_P FROM CTE_A INNER JOIN CTE_B ON CTE_A.C_Marca = CTE_B.C_Marca;'
      },
      {
        id: 9, desc: '🎖️ Vendedores Consistentes (PARTITION BY sucursal)',
        expected: 'SELECT C_Vendedor, C_Sucursal, C_Monto, AVG(C_Monto) OVER (PARTITION BY C_Sucursal) AS M_Promedio_Sucursal FROM T_Ventas',
        hint: 'SELECT C_Vendedor, C_Sucursal, C_Monto, AVG(C_Monto) OVER (PARTITION BY C_Sucursal) AS M_Promedio_Sucursal FROM T_Ventas; -- Cada venta se compara con el promedio de SU sucursal, sin colapsar filas',
        example: 'SELECT C_Vendedor, C_Marca, C_Monto, MAX(C_Monto) OVER (PARTITION BY C_Marca) AS M_Maximo_Marca FROM T_Ventas;'
      },
      {
        id: 10, desc: "🔥 La Prueba de Fuego (CASE dentro de SUM, por mes)",
        expected: "SELECT strftime('%m', C_Fecha) AS M_Mes, SUM(CASE WHEN C_Monto > 800000 THEN 1 ELSE 0 END) AS M_Premium, SUM(CASE WHEN C_Monto <= 800000 THEN 1 ELSE 0 END) AS M_Economicas FROM T_Ventas GROUP BY strftime('%m', C_Fecha)",
        hint: "SELECT strftime('%m', C_Fecha) AS M_Mes, SUM(CASE WHEN C_Monto > 800000 THEN 1 ELSE 0 END) AS M_Premium, SUM(CASE WHEN C_Monto <= 800000 THEN 1 ELSE 0 END) AS M_Economicas FROM T_Ventas GROUP BY strftime('%m', C_Fecha); -- En SQL Server: MONTH(C_Fecha). El truco: CASE regresa 1/0 y SUM los cuenta",
        example: "SELECT C_Sucursal, SUM(CASE WHEN C_Anio = 2025 THEN 1 ELSE 0 END) AS M_2025, SUM(CASE WHEN C_Anio = 2024 THEN 1 ELSE 0 END) AS M_2024 FROM T_Ventas GROUP BY C_Sucursal;"
      }
    ],
    xp: 600, coins: 5000, difficulty: 5, skill: 'ADVANCED',
    diaryEntry: 'Día 10: Frente al CEO, en el piso 100, escribí consultas que analizan el tiempo y el espacio. Rankings, acumulados, particiones. Ya no leo datos: leo historias completas.',
    hasTutorial: true,
    hasTrivia: true,
    hasBoss: true
  },
  11: {
    title: '💎 BONUS: El Oráculo del NEXUS',
    concept: `<strong>📜 La Ciencia de la Velocidad</strong><br><br>
      <code>CREATE INDEX nombre ON tabla (col)</code> — búsqueda instantánea<br>
      <code>CREATE TRIGGER</code> — reglas que se disparan solas<br>
      <code>EXPLAIN QUERY PLAN</code> — ver cómo piensa el motor<br><br>
      <em>En SQL Server además existen STORED PROCEDURES (EXEC) — aquí los simulamos con vistas.</em>`,
    subExercises: [
      {
        id: 1, desc: '⚡ Turbo Cargado (índice en C_VIN)',
        expected: 'CREATE INDEX IX_Inventario_VIN ON T_Inventario (C_VIN)',
        hint: 'CREATE INDEX IX_Inventario_VIN ON T_Inventario (C_VIN); -- Sin índice, SQL lee el "libro" entero; con índice, va directo a la página',
        example: 'CREATE INDEX IX_Clientes_Nombre ON T_Clientes (C_Nombre_Completo);'
      },
      {
        id: 2, desc: '🔴 El Botón de Pánico (cierre diario guardado)',
        expected: 'CREATE VIEW V_Cierre_Diario AS SELECT C_Fecha, COUNT(*) AS M_Ventas, SUM(C_Monto) AS M_Total FROM T_Ventas GROUP BY C_Fecha',
        hint: "CREATE VIEW V_Cierre_Diario AS SELECT C_Fecha, COUNT(*) AS M_Ventas, SUM(C_Monto) AS M_Total FROM T_Ventas GROUP BY C_Fecha; -- En SQL Server sería un SP: CREATE PROCEDURE M_Cierre_Diario AS ... y lo ejecutas con EXEC M_Cierre_Diario",
        example: 'CREATE VIEW V_Cierre_Mensual AS SELECT C_Anio, SUM(C_Monto) AS M_Total FROM T_Ventas GROUP BY C_Anio;'
      },
      {
        id: 3, desc: '🛡️ Seguridad de Hierro (trigger anti-DELETE en pagos)',
        expected: "CREATE TRIGGER TR_Proteger_Pagos BEFORE DELETE ON T_Pagos BEGIN SELECT RAISE(ABORT, 'Bloqueado por el Auditor'); END",
        hint: "CREATE TRIGGER TR_Proteger_Pagos BEFORE DELETE ON T_Pagos BEGIN SELECT RAISE(ABORT, 'Bloqueado por el Auditor'); END; -- El disparador corre SOLO cuando alguien intenta el DELETE, y lo aborta",
        example: "CREATE TRIGGER TR_Demo BEFORE DELETE ON T_Modelos BEGIN SELECT RAISE(ABORT, 'Protegido'); END;"
      },
      {
        id: 4, desc: '📊 Integración Power BI (medidas M_ agregadas, sin SELECT *)',
        expected: 'SELECT C_Marca, C_Sucursal, SUM(C_Monto) AS M_Total_Ventas, COUNT(*) AS M_Unidades FROM T_Ventas GROUP BY C_Marca, C_Sucursal',
        hint: 'SELECT C_Marca, C_Sucursal, SUM(C_Monto) AS M_Total_Ventas, COUNT(*) AS M_Unidades FROM T_Ventas GROUP BY C_Marca, C_Sucursal; -- Power BI agradece: solo columnas necesarias + medidas pre-calculadas = tablero que no se traba',
        example: 'SELECT C_Vendedor, SUM(C_Monto) AS M_Total, AVG(C_Monto) AS M_Ticket FROM T_Ventas GROUP BY C_Vendedor;'
      },
      {
        id: 5, desc: '📖 Documentación del Maestro (crear el diccionario)',
        expected: 'CREATE TABLE T_Diccionario_Nexus (C_Prefijo TEXT, C_Significado TEXT)',
        hint: 'CREATE TABLE T_Diccionario_Nexus (C_Prefijo TEXT, C_Significado TEXT);',
        example: 'CREATE TABLE T_Notas_Equipo (C_Tema TEXT, C_Nota TEXT);'
      },
      {
        id: 6, desc: '✍️ El Legado Escrito (poblar la convención T_/C_/M_/V_)',
        expected: "INSERT INTO T_Diccionario_Nexus VALUES ('T_', 'Tabla'), ('C_', 'Columna'), ('M_', 'Medida calculada'), ('V_', 'Vista')",
        hint: "INSERT INTO T_Diccionario_Nexus VALUES ('T_', 'Tabla'), ('C_', 'Columna'), ('M_', 'Medida calculada'), ('V_', 'Vista');",
        example: "INSERT INTO T_Diccionario_Nexus VALUES ('IX_', 'Indice'), ('TR_', 'Trigger');"
      },
      {
        id: 7, desc: '🔬 Rayos X del Motor (EXPLAIN QUERY PLAN)',
        expected: "EXPLAIN QUERY PLAN SELECT * FROM T_Inventario WHERE C_VIN = 'NX001'",
        hint: "EXPLAIN QUERY PLAN SELECT * FROM T_Inventario WHERE C_VIN = 'NX001'; -- Verás 'USING INDEX': tu índice del reto 1 en acción. En SQL Server: el Execution Plan de SSMS",
        example: "EXPLAIN QUERY PLAN SELECT * FROM T_Ventas WHERE C_Marca = 'Toyota';"
      },
      {
        id: 8, desc: '🧬 Índice Compuesto (dos columnas que siempre viajan juntas)',
        expected: 'CREATE INDEX IX_Ventas_Marca_Anio ON T_Ventas (C_Marca, C_Anio)',
        hint: 'CREATE INDEX IX_Ventas_Marca_Anio ON T_Ventas (C_Marca, C_Anio); -- El orden importa: sirve para filtrar por marca, o por marca+año — pero NO por año solo',
        example: 'CREATE INDEX IX_Inv_Suc_Marca ON T_Inventario (C_Sucursal, C_Marca);'
      },
      {
        id: 9, desc: '🚫 Adiós SELECT * (solo lo que el tablero necesita)',
        expected: "SELECT C_VIN, C_Modelo, C_Precio FROM T_Inventario WHERE C_Sucursal = 'CDMX'",
        hint: "SELECT C_VIN, C_Modelo, C_Precio FROM T_Inventario WHERE C_Sucursal = 'CDMX'; -- SELECT * arrastra columnas que nadie usa: ancho de banda y memoria desperdiciados",
        example: "SELECT C_Vendedor, C_Monto FROM T_Ventas WHERE C_Sucursal = 'GDL';"
      },
      {
        id: 10, desc: '♻️ Ciclo de Vida (eliminar un índice que ya no aporta)',
        expected: 'DROP INDEX IX_Ventas_Marca_Anio',
        hint: 'DROP INDEX IX_Ventas_Marca_Anio; -- Un índice acelera lecturas pero encarece cada INSERT/UPDATE: si nadie lo usa, es puro costo',
        example: 'DROP INDEX IX_Inventario_VIN;'
      }
    ],
    xp: 800, coins: 6000, difficulty: 5, skill: 'ADVANCED',
    diaryEntry: 'Día 11: Optimicé mi propia obra — índices, triggers, consultas que vuelan. Y escribí el diccionario para los que vengan después. Un arquitecto construye; un maestro deja el mapa.',
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
  },
  2: {
    title: 'Filtros de Precisión: IN, NOT, LIKE, NULL',
    slides: [
      // SLIDE 1 — Contexto / Sofía habla
      {
        icon: '🚚',
        tag: 'NEXUS SQL — NODO SLP',
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:56px;margin-bottom:8px;filter:drop-shadow(0 0 20px var(--primary));">🚚</div>
            <div style="font-family:var(--font-display);font-size:11px;letter-spacing:3px;color:var(--primary);text-transform:uppercase;">Centro de Logística — San Luis Potosí</div>
          </div>
          <div style="background:rgba(255,160,0,0.06);border:1px solid rgba(255,160,0,0.3);border-radius:12px;padding:20px;">
            <div style="font-family:var(--font-display);font-size:12px;letter-spacing:1px;color:var(--primary);margin-bottom:12px;">👷‍♀️ SOFÍA — Jefa de Patio</div>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;">
              "El virus borró las etiquetas de los embarques de <strong>Honda</strong> y <strong>Kia</strong>.
              Tengo camiones listos para la frontera y no sé cuáles llevan equipo de lujo."
            </p>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;margin-top:10px;">
              "Si mando el cargamento equivocado, la multa de la aduana nos hunde.
              Necesito <strong style="color:var(--accent);">filtros perfectos, no aproximaciones.</strong>"
            </p>
          </div>
          <div style="text-align:center;margin-top:16px;color:var(--muted);font-size:13px;">
            Slide 1 de 3 — El laberinto de Sofía
          </div>`
      },
      // SLIDE 2 — IN y NOT
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">🎯</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">El lente de precisión</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:12px;"><code style="color:var(--primary);">IN ('Honda', 'Kia')</code> — busca en una <strong>lista</strong>. Sustituye escribir muchos OR.</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:13px;color:#00ff41;margin-bottom:12px;">SELECT * FROM T_Inventario_SLP<br>WHERE C_Marca IN ('Honda', 'Kia');</div>
            <p style="margin-bottom:12px;"><code style="color:var(--primary);">NOT</code> — <strong>excluye</strong> lo que estorba.</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:13px;color:#00ff41;">SELECT * FROM T_Inventario_SLP<br>WHERE NOT C_Color = 'Negro';</div>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 2 de 3 — Listas y exclusiones
          </div>`
      },
      // SLIDE 3 — LIKE con comodines + NULL
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">🔍</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">Comodines y datos vacíos</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:8px;"><code style="color:var(--primary);">%</code> — sustituye <strong>cualquier cantidad</strong> de caracteres → <code>LIKE 'K%'</code> = empieza con K</p>
            <p style="margin-bottom:8px;"><code style="color:var(--primary);">_</code> — sustituye <strong>exactamente UN</strong> carácter → <code>LIKE 'K____'</code> = 5 letras, empieza con K</p>
            <p style="margin-bottom:8px;"><code style="color:var(--primary);">IS NULL</code> — el dato está <strong>vacío</strong> (el virus lo borró)</p>
            <p><code style="color:var(--primary);">IS NOT NULL</code> — el dato <strong>sí existe</strong> (información completa)</p>
          </div>
          <div style="background:rgba(0,217,255,0.06);border:1px solid rgba(0,217,255,0.3);border-radius:10px;padding:12px;margin-top:14px;text-align:center;">
            <p style="color:var(--muted);font-size:13px;font-style:italic;">💬 "NULL no es cero ni texto vacío. Es ausencia total de dato." — Ing. Ana</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 3 de 3 — Los camiones esperan
          </div>`
      }
    ]
  },
  3: {
    title: 'Jerarquía y Lógica: ORDER BY, LIMIT, CASE',
    slides: [
      // SLIDE 1 — Contexto / Don Víctor habla
      {
        icon: '⛰️',
        tag: 'NEXUS SQL — NODO MTY',
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:56px;margin-bottom:8px;filter:drop-shadow(0 0 20px var(--primary));">⛰️</div>
            <div style="font-family:var(--font-display);font-size:11px;letter-spacing:3px;color:var(--primary);text-transform:uppercase;">Corporativo Norte — Monterrey</div>
          </div>
          <div style="background:rgba(255,160,0,0.06);border:1px solid rgba(255,160,0,0.3);border-radius:12px;padding:20px;">
            <div style="font-family:var(--font-display);font-size:12px;letter-spacing:1px;color:var(--primary);margin-bottom:12px;">🚬 DON VÍCTOR — Director del Norte</div>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;">
              "Escucha bien, muchacho. En Monterrey no perdemos el tiempo con minucias.
              El virus me revolvió los precios y las prioridades.
              No sé quién es mi cliente #1 ni cuál es el auto más caro que tengo en piso."
            </p>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;margin-top:10px;">
              "<strong style="color:var(--accent);">Arregla mis rankings</strong> o te enviaré de regreso a GDL a pie."
            </p>
          </div>
          <div style="text-align:center;margin-top:16px;color:var(--muted);font-size:13px;">
            Slide 1 de 3 — El orgullo de Monterrey
          </div>`
      },
      // SLIDE 2 — ORDER BY y LIMIT
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">📊</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">El arte del orden</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:8px;"><code style="color:var(--primary);">ORDER BY col ASC</code> — de menor a mayor / A-Z (es el <strong>default</strong>)</p>
            <p style="margin-bottom:12px;"><code style="color:var(--primary);">ORDER BY col DESC</code> — de mayor a menor / Z-A</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:13px;color:#00ff41;margin-bottom:12px;">SELECT * FROM T_Inventario_MTY<br>ORDER BY C_Precio DESC<br>LIMIT 5;</div>
            <p style="margin-bottom:8px;"><code style="color:var(--primary);">LIMIT n</code> — solo las primeras n filas del resultado ordenado.</p>
            <p style="color:var(--muted);font-size:13px;">⚠️ En SQL Server (tu trabajo real) se escribe <code>SELECT TOP 5 ...</code> — mismo concepto, otra sintaxis. Aquí practicamos con LIMIT.</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 2 de 3 — Solo la crema y nata
          </div>`
      },
      // SLIDE 3 — CASE WHEN
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">🧠</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">El cerebro de SQL</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:12px;"><code style="color:var(--primary);">CASE WHEN</code> crea <strong>columnas nuevas con lógica</strong>, sobre la marcha:</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:13px;color:#00ff41;margin-bottom:12px;">CASE<br>&nbsp;&nbsp;WHEN C_Precio > 800000 THEN 'Premium'<br>&nbsp;&nbsp;ELSE 'Comercial'<br>END AS M_Segmento</div>
            <p style="margin-bottom:8px;">Se evalúa <strong>de arriba hacia abajo</strong>: la primera condición que se cumpla, gana.</p>
            <p style="color:var(--muted);font-size:13px;">La columna calculada lleva prefijo <code>M_</code> — la convención NEXUS que ya conoces.</p>
          </div>
          <div style="background:rgba(0,217,255,0.06);border:1px solid rgba(0,217,255,0.3);border-radius:10px;padding:12px;margin-top:14px;text-align:center;">
            <p style="color:var(--muted);font-size:13px;font-style:italic;">💬 "Si el precio pasa de un millón, etiquétalo 'Lujo'. Si no, 'Estándar'. Así piensa un CASE." — Ing. Ana</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 3 de 3 — Don Víctor espera su Top 10
          </div>`
      }
    ]
  },
  4: {
    title: 'Agregaciones: COUNT, SUM, AVG, GROUP BY',
    slides: [
      // SLIDE 1 — Contexto / Don Carlos habla
      {
        icon: '📉',
        tag: 'NEXUS SQL — NODO CDMX',
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:56px;margin-bottom:8px;filter:drop-shadow(0 0 20px var(--primary));">📉</div>
            <div style="font-family:var(--font-display);font-size:11px;letter-spacing:3px;color:var(--primary);text-transform:uppercase;">Torre Velocity — Santa Fe, CDMX</div>
          </div>
          <div style="background:rgba(255,160,0,0.06);border:1px solid rgba(255,160,0,0.3);border-radius:12px;padding:20px;">
            <div style="font-family:var(--font-display);font-size:12px;letter-spacing:1px;color:var(--primary);margin-bottom:12px;">🕴️ DON CARLOS — CFO de Grupo Velocity</div>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;">
              "Analista... a mí no me impresionan los filtros. Tengo miles de registros de ventas,
              pero no sé <strong>cuánto dinero entró hoy</strong> a la caja de la CDMX."
            </p>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;margin-top:10px;">
              "Necesito totales, promedios y conteos exactos.
              <strong style="color:var(--accent);">Si no puedes resumir el caos en una sola cifra, no me sirves.</strong> Empieza a sumar."
            </p>
          </div>
          <div style="text-align:center;margin-top:16px;color:var(--muted);font-size:13px;">
            Slide 1 de 3 — La frialdad de los números
          </div>`
      },
      // SLIDE 2 — Funciones de agregación
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">🧮</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">El ábaco de agregación</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:8px;"><code style="color:var(--primary);">COUNT(*)</code> — ¿cuántos registros hay?</p>
            <p style="margin-bottom:8px;"><code style="color:var(--primary);">SUM(C_Monto)</code> — ¿cuánto dinero total?</p>
            <p style="margin-bottom:8px;"><code style="color:var(--primary);">AVG(C_Precio)</code> — ¿cuál es el promedio?</p>
            <p style="margin-bottom:12px;"><code style="color:var(--primary);">MIN / MAX</code> — el más barato y el más caro</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:13px;color:#00ff41;">SELECT SUM(C_Precio) AS M_Valor_Total<br>FROM T_Inventario_CDMX;</div>
            <p style="color:var(--muted);font-size:13px;margin-top:10px;">Miles de filas entran → <strong>una sola cifra sale</strong>. Eso es agregar.</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 2 de 3 — Una calculadora gigante
          </div>`
      },
      // SLIDE 3 — GROUP BY y HAVING
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">📊</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">Agrupar y filtrar grupos</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:12px;"><code style="color:var(--primary);">GROUP BY</code> parte la tabla en grupos y agrega <strong>por categoría</strong>:</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:13px;color:#00ff41;margin-bottom:12px;">SELECT C_Marca, SUM(C_Monto)<br>FROM T_Ventas_CDMX<br>GROUP BY C_Marca<br>HAVING SUM(C_Monto) > 2000000;</div>
            <p style="margin-bottom:8px;"><code style="color:var(--primary);">WHERE</code> filtra <strong>filas</strong> (antes de agrupar).</p>
            <p><code style="color:var(--primary);">HAVING</code> filtra <strong>grupos</strong> (después de agrupar). Regla de oro de este módulo.</p>
          </div>
          <div style="background:rgba(0,217,255,0.06);border:1px solid rgba(0,217,255,0.3);border-radius:10px;padding:12px;margin-top:14px;text-align:center;">
            <p style="color:var(--muted);font-size:13px;font-style:italic;">💬 "Toda columna del SELECT que no esté agregada, debe estar en el GROUP BY. Sin excepciones." — Ing. Ana</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 3 de 3 — La junta de accionistas espera
          </div>`
      }
    ]
  },
  5: {
    title: 'El Colador de Grupos: WHERE vs HAVING',
    slides: [
      // SLIDE 1 — Contexto / Don Carlos con el reporte tachado
      {
        icon: '📊',
        tag: 'NEXUS SQL — CONSOLIDACIÓN NACIONAL',
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:56px;margin-bottom:8px;filter:drop-shadow(0 0 20px var(--primary));">📊</div>
            <div style="font-family:var(--font-display);font-size:11px;letter-spacing:3px;color:var(--primary);text-transform:uppercase;">Sala de Juntas del Consejo — CDMX</div>
          </div>
          <div style="background:rgba(255,160,0,0.06);border:1px solid rgba(255,160,0,0.3);border-radius:12px;padding:20px;">
            <div style="font-family:var(--font-display);font-size:12px;letter-spacing:1px;color:var(--primary);margin-bottom:12px;">🕴️ DON CARLOS — reporte lleno de tachaduras rojas</div>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;">
              "El reporte nacional es un desastre. Tengo cientos de marcas y sucursales pequeñas
              que solo ensucian el análisis. No me interesan agencias que venden 2 autos al mes."
            </p>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;margin-top:10px;">
              "<strong style="color:var(--accent);">Separa el trigo de la paja.</strong>
              Demuéstrame que sabes dónde está el verdadero valor del grupo."
            </p>
          </div>
          <div style="text-align:center;margin-top:16px;color:var(--muted);font-size:13px;">
            Slide 1 de 3 — El ultimátum del CFO
          </div>`
      },
      // SLIDE 2 — WHERE vs HAVING
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">⚖️</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">La confusión que separa a JR de SR</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:8px;"><code style="color:var(--primary);">WHERE</code> filtra <strong>FILAS, antes</strong> de agrupar → "solo autos rojos"</p>
            <p style="margin-bottom:12px;"><code style="color:var(--primary);">HAVING</code> filtra <strong>GRUPOS, después</strong> de agrupar → "solo marcas que sumen más de 1 millón"</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:13px;color:#00ff41;">SELECT C_Marca, SUM(C_Monto)<br>FROM T_Ventas<br>WHERE C_Color = 'Blanco'&nbsp;&nbsp;<span style="color:#546e7a;">-- primero filas</span><br>GROUP BY C_Marca<br>HAVING SUM(C_Monto) > 1000000;&nbsp;<span style="color:#546e7a;">-- luego grupos</span></div>
            <p style="color:var(--muted);font-size:13px;margin-top:10px;">Orden real de ejecución: <strong>FROM → WHERE → GROUP BY → HAVING → SELECT</strong>.</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 2 de 3 — Filas primero, grupos después
          </div>`
      },
      // SLIDE 3 — Agrupación múltiple
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">🗺️</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">Agrupar por dos dimensiones</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:12px;"><code style="color:var(--primary);">GROUP BY C_Marca, C_Sucursal</code> crea un grupo por <strong>cada combinación</strong>: Toyota-GDL, Toyota-CDMX, Kia-MTY...</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:13px;color:#00ff41;margin-bottom:12px;">SELECT C_Sucursal, C_Marca, COUNT(*)<br>FROM T_Inventario<br>GROUP BY C_Sucursal, C_Marca;</div>
            <p style="margin-bottom:8px;">Este módulo usa las tablas <strong>nacionales</strong>: <code>T_Inventario</code> (99 autos) y <code>T_Ventas</code> (42 ventas) — datos a escala real.</p>
            <p style="color:var(--muted);font-size:13px;">Y recuerda la convención NEXUS: los resultados calculados llevan alias <code>M_</code>.</p>
          </div>
          <div style="background:rgba(0,217,255,0.06);border:1px solid rgba(0,217,255,0.3);border-radius:10px;padding:12px;margin-top:14px;text-align:center;">
            <p style="color:var(--muted);font-size:13px;font-style:italic;">💬 "El virus intenta camuflar pérdidas dentro de los grandes totales. HAVING es tu lupa." — Ing. Ana</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 3 de 3 — El consejo está sentado
          </div>`
      }
    ]
  },
  6: {
    title: 'El Pegamento Universal: INNER JOIN',
    slides: [
      // SLIDE 1 — Contexto / Mariana habla
      {
        icon: '🎨',
        tag: 'NEXUS SQL — INTELIGENCIA DE MERCADO',
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:56px;margin-bottom:8px;filter:drop-shadow(0 0 20px var(--primary));">🎨</div>
            <div style="font-family:var(--font-display);font-size:11px;letter-spacing:3px;color:var(--primary);text-transform:uppercase;">Departamento de Marketing — CDMX</div>
          </div>
          <div style="background:rgba(255,160,0,0.06);border:1px solid rgba(255,160,0,0.3);border-radius:12px;padding:20px;">
            <div style="font-family:var(--font-display);font-size:12px;letter-spacing:1px;color:var(--primary);margin-bottom:12px;">👩‍🎨 MARIANA — Directora de Marketing</div>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;">
              "El virus separó nuestra base de clientes de las unidades vendidas.
              Mis tablas de 'Clientes' no dicen qué auto compraron,
              y mis 'Ventas' solo tienen números de serie."
            </p>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;margin-top:10px;">
              "¡Es como tener los nombres de los invitados pero no sus direcciones!
              <strong style="color:var(--accent);">Vuelve a unir estos mundos</strong> o mi presupuesto se va a la basura."
            </p>
          </div>
          <div style="text-align:center;margin-top:16px;color:var(--muted);font-size:13px;">
            Slide 1 de 3 — El rompecabezas de Mariana
          </div>`
      },
      // SLIDE 2 — INNER JOIN + ON
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">🔗</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">La habilidad que separa aficionados de profesionales</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:8px;"><code style="color:var(--primary);">INNER JOIN</code> — el punto de encuentro: solo trae filas que coinciden en <strong>ambas</strong> tablas.</p>
            <p style="margin-bottom:12px;"><code style="color:var(--primary);">ON</code> — la <strong>llave</strong>, el cable que conecta. Normalmente un ID.</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:13px;color:#00ff41;">SELECT C_Nombre_Completo, C_Monto<br>FROM T_Clientes<br>INNER JOIN T_Ventas<br>&nbsp;&nbsp;ON T_Clientes.C_ID_Cliente = T_Ventas.C_ID_Cliente;</div>
            <p style="color:var(--muted);font-size:13px;margin-top:10px;">Por eso una base "relacional" se llama así: las tablas se <strong>relacionan</strong> mediante llaves. En tu trabajo real, los SPs de Dalton están llenos de estos JOINs.</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 2 de 3 — El cable que The Void cortó
          </div>`
      },
      // SLIDE 3 — Alias y ambigüedad
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">✂️</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">Alias: código limpio y sin ambigüedad</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:12px;"><code style="color:var(--primary);">FROM T_Ventas AS V</code> — abrevia el nombre. Luego escribes <code>V.C_Monto</code>.</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:13px;color:#00ff41;margin-bottom:12px;">SELECT I.C_Modelo, V.C_Monto<br>FROM T_Ventas AS V<br>INNER JOIN T_Inventario AS I<br>&nbsp;&nbsp;ON V.C_VIN = I.C_VIN<br>WHERE V.C_Color = 'Blanco';</div>
            <p style="margin-bottom:8px;">⚠️ Si <strong>ambas tablas</strong> tienen una columna (ej. <code>C_Color</code>, <code>C_Anio</code>), DEBES calificarla: <code>V.C_Color</code>. Si no, SQL lanza error de <em>ambigüedad</em>.</p>
            <p style="color:var(--muted);font-size:13px;">Un JOIN puede encadenarse: 3 tablas = 2 JOINs. Cliente → Venta → Auto.</p>
          </div>
          <div style="background:rgba(0,217,255,0.06);border:1px solid rgba(0,217,255,0.3);border-radius:10px;padding:12px;margin-top:14px;text-align:center;">
            <p style="color:var(--muted);font-size:13px;font-style:italic;">💬 "Dos ventas perdieron su cliente. El INNER JOIN las va a ignorar — y eso también es información." — Ing. Ana</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 3 de 3 — La campaña espera
          </div>`
      }
    ]
  },
  7: {
    title: 'La Inclusión Total: LEFT JOIN e IS NULL',
    slides: [
      // SLIDE 1 — Contexto / Mariana y los fantasmas
      {
        icon: '🌑',
        tag: 'NEXUS SQL — SERVIDORES DE FIDELIZACIÓN',
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:56px;margin-bottom:8px;filter:drop-shadow(0 0 20px var(--primary));">🌑</div>
            <div style="font-family:var(--font-display);font-size:11px;letter-spacing:3px;color:var(--primary);text-transform:uppercase;">Servidores de Fidelización de Clientes</div>
          </div>
          <div style="background:rgba(255,160,0,0.06);border:1px solid rgba(255,160,0,0.3);border-radius:12px;padding:20px;">
            <div style="font-family:var(--font-display);font-size:12px;letter-spacing:1px;color:var(--primary);margin-bottom:12px;">👩‍🎨 MARIANA — con la lista del Buen Fin en la mano</div>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;">
              "El INNER JOIN solo me muestra a los clientes que <strong>sí</strong> compraron.
              Para mi campaña de 'Recuperación' necesito lo contrario:
              los que están en mi base pero <strong>no tienen ninguna venta registrada</strong>."
            </p>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;margin-top:10px;">
              "Si no los encuentro, <strong style="color:var(--accent);">estamos perdiendo miles de clientes potenciales.</strong>"
            </p>
          </div>
          <div style="text-align:center;margin-top:16px;color:var(--muted);font-size:13px;">
            Slide 1 de 3 — Los clientes fantasma
          </div>`
      },
      // SLIDE 2 — LEFT JOIN
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">🌗</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">El lado oscuro de las relaciones</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:8px;"><code style="color:var(--primary);">LEFT JOIN</code> — trae <strong>TODO</strong> de la tabla izquierda y solo lo que coincida de la derecha.</p>
            <p style="margin-bottom:12px;">Sin coincidencia → las columnas de la derecha salen <strong>NULL</strong>. Ese NULL no es un error: <strong>es la pista</strong>.</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:13px;color:#00ff41;">SELECT C.C_Nombre_Completo<br>FROM T_Clientes AS C<br>LEFT JOIN T_Ventas AS V<br>&nbsp;&nbsp;ON C.C_ID_Cliente = V.C_ID_Cliente<br>WHERE V.C_ID_Venta IS NULL;&nbsp;<span style="color:#546e7a;">-- los fantasmas</span></div>
            <p style="color:var(--muted);font-size:13px;margin-top:10px;">RIGHT JOIN existe, pero casi nadie lo usa: basta con voltear las tablas del LEFT. (En SQLite ni siquiera está en versiones viejas.)</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 2 de 3 — El patrón LEFT + IS NULL
          </div>`
      },
      // SLIDE 3 — ON con condición extra
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">🎛️</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">Condiciones dentro del ON</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:12px;">Detalle de nivel Arquitecto: en un LEFT JOIN, filtrar la tabla derecha <strong>en el ON</strong> no es lo mismo que en el WHERE:</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:13px;color:#00ff41;margin-bottom:12px;">LEFT JOIN T_Ventas AS V<br>&nbsp;&nbsp;ON C.C_ID_Cliente = V.C_ID_Cliente<br>&nbsp;&nbsp;<strong>AND V.C_Anio = 2025</strong>&nbsp;<span style="color:#546e7a;">-- filtra ANTES de unir</span><br>WHERE V.C_ID_Venta IS NULL;</div>
            <p style="margin-bottom:8px;">• En el <code>ON</code>: "únelo solo con sus ventas 2025" → los clientes sin ventas 2025 sobreviven con NULL.</p>
            <p>• En el <code>WHERE</code>: mataría las filas NULL y el LEFT se convertiría en un INNER disfrazado. Error clásico en los SPs de Dalton.</p>
          </div>
          <div style="background:rgba(0,217,255,0.06);border:1px solid rgba(0,217,255,0.3);border-radius:10px;padding:12px;margin-top:14px;text-align:center;">
            <p style="color:var(--muted);font-size:13px;font-style:italic;">💬 "Lo que no está en la otra tabla también cuenta una historia." — Ing. Ana</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 3 de 3 — A cazar fantasmas
          </div>`
      }
    ]
  },
  8: {
    title: 'El Poder de la Creación y la Destrucción (DML)',
    slides: [
      // SLIDE 1 — Contexto / El Auditor
      {
        icon: '🛡️',
        tag: 'NEXUS SQL — BÚNKER DE SEGURIDAD',
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:56px;margin-bottom:8px;filter:drop-shadow(0 0 20px var(--danger));">🛡️</div>
            <div style="font-family:var(--font-display);font-size:11px;letter-spacing:3px;color:var(--danger);text-transform:uppercase;">Subsuelo de Velocity — acceso restringido</div>
          </div>
          <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:20px;">
            <div style="font-family:var(--font-display);font-size:12px;letter-spacing:1px;color:var(--danger);margin-bottom:12px;">👁️ EL AUDITOR — solo una lista de infracciones en pantalla</div>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;">
              "He visto tus consultas. Son elegantes, pero la base de datos es un chiquero.
              El virus inyectó ventas falsas, duplicó empleados y puso precios de $1
              a las camionetas blindadas."
            </p>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;margin-top:10px;">
              "Leer el desastre es fácil; <strong style="color:var(--danger);">arreglarlo es para maestros</strong>.
              ¿Tienes el pulso firme?"
            </p>
          </div>
          <div style="text-align:center;margin-top:16px;color:var(--muted);font-size:13px;">
            Slide 1 de 3 — La mirada del vigilante
          </div>`
      },
      // SLIDE 2 — INSERT, UPDATE, DELETE
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">⚡</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">DML: dejar de observar, empezar a tocar</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;color:#00ff41;margin-bottom:12px;">INSERT INTO T_Clientes VALUES (17, 'Ana', ...);&nbsp;<span style="color:#546e7a;">-- crear</span><br>UPDATE T_Inventario SET C_Precio = 450000<br>&nbsp;&nbsp;WHERE C_VIN = 'TR123';&nbsp;<span style="color:#546e7a;">-- corregir</span><br>DELETE FROM T_Vendedores<br>&nbsp;&nbsp;WHERE C_Nombre_Vendedor = 'TheVoid_User';&nbsp;<span style="color:#546e7a;">-- eliminar</span></div>
            <p style="margin-bottom:8px;">En el <code>SET</code> puedes hacer matemáticas: <code>SET C_Precio = C_Precio * 1.05</code> sube 5% de golpe.</p>
            <p style="color:var(--muted);font-size:13px;">Estos comandos no regresan filas: regresan <strong>consecuencias</strong>. Verifica siempre con un SELECT después.</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 2 de 3 — Crear, corregir, eliminar
          </div>`
      },
      // SLIDE 3 — La regla del WHERE + TRUNCATE
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">☢️</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--danger);text-transform:uppercase;">La regla que salva carreras</div>
          </div>
          <div style="background:rgba(239,68,68,0.08);border:2px solid var(--danger);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:12px;font-size:16px;"><strong>Un UPDATE o DELETE sin WHERE afecta TODAS las filas.</strong> No hay Ctrl+Z en producción.</p>
            <p style="margin-bottom:8px;">Ritual del profesional antes de ejecutar:</p>
            <p style="margin-bottom:4px;">1️⃣ Escribe primero el <code>SELECT ... WHERE</code> con el mismo filtro.</p>
            <p style="margin-bottom:4px;">2️⃣ Verifica que las filas que salen son EXACTAMENTE las que quieres tocar.</p>
            <p style="margin-bottom:12px;">3️⃣ Solo entonces cámbialo por UPDATE/DELETE.</p>
            <p style="color:var(--muted);font-size:13px;"><code>TRUNCATE TABLE</code> (SQL Server) vacía una tabla completa al instante — aquí practicamos su equivalente <code>DELETE FROM tabla</code>. El único DELETE sin WHERE que el Auditor permite... porque él lo ordenó.</p>
          </div>
          <div style="background:rgba(0,217,255,0.06);border:1px solid rgba(0,217,255,0.3);border-radius:10px;padding:12px;margin-top:14px;text-align:center;">
            <p style="color:var(--muted);font-size:13px;font-style:italic;">💬 "Hasta hoy fuiste observador. Desde hoy, cada comando tuyo cambia la realidad." — Ing. Ana</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 3 de 3 — El Auditor te observa
          </div>`
      }
    ]
  },
  9: {
    title: 'El Plano de la Realidad: DDL, Vistas y Subconsultas',
    slides: [
      // SLIDE 1 — Contexto / Ing. Aranda
      {
        icon: '🏗️',
        tag: 'NEXUS SQL — NÚCLEO DE DATOS',
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:56px;margin-bottom:8px;filter:drop-shadow(0 0 20px var(--primary));">🏗️</div>
            <div style="font-family:var(--font-display);font-size:11px;letter-spacing:3px;color:var(--primary);text-transform:uppercase;">Data Center de Grupo Velocity</div>
          </div>
          <div style="background:rgba(255,160,0,0.06);border:1px solid rgba(255,160,0,0.3);border-radius:12px;padding:20px;">
            <div style="font-family:var(--font-display);font-size:12px;letter-spacing:1px;color:var(--primary);margin-bottom:12px;">👷 ING. ARANDA — rodeado de planos digitales</div>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;">
              "Compramos tres agencias de lujo en Cancún y hay que integrarlas YA.
              No puedo pedirle a los gerentes que escriban JOINs de 20 líneas
              cada vez que quieran un reporte."
            </p>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;margin-top:10px;">
              "Necesito estructuras sólidas y ventanas mágicas.
              <strong style="color:var(--accent);">Es hora de dejar de ser usuario y empezar a ser Creador.</strong>"
            </p>
          </div>
          <div style="text-align:center;margin-top:16px;color:var(--muted);font-size:13px;">
            Slide 1 de 3 — La nueva era
          </div>`
      },
      // SLIDE 2 — CREATE TABLE y CREATE VIEW
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">🪟</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">DDL: definir la estructura</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:8px;"><code style="color:var(--primary);">CREATE TABLE</code> — diseña el contenedor: cada columna con su tipo (INT, VARCHAR, DATE) y reglas (<code>NOT NULL</code>, <code>DEFAULT</code>).</p>
            <p style="margin-bottom:12px;"><code style="color:var(--primary);">CREATE VIEW</code> — guarda una consulta compleja como "tabla virtual":</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;color:#00ff41;margin-bottom:12px;">CREATE VIEW V_Inventario_Rapido AS<br>SELECT I.C_VIN, I.C_Modelo, M.C_Marca<br>FROM T_Inventario AS I<br>INNER JOIN T_Modelos AS M<br>&nbsp;&nbsp;ON I.C_Modelo = M.C_Modelo;</div>
            <p style="margin-bottom:8px;">Roberto solo escribe <code>SELECT * FROM V_Inventario_Rapido</code> — y SQL corre el JOIN por detrás. La vista <strong>no guarda datos</strong>: es una ventana viva a las tablas.</p>
            <p style="color:var(--muted);font-size:13px;">Prefijo de la convención NEXUS para vistas: <code>V_</code>.</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 2 de 3 — Ventanas mágicas
          </div>`
      },
      // SLIDE 3 — Subconsultas
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">🎯</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">Consultas dentro de consultas</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:12px;">Una <strong>subconsulta</strong> usa el resultado de una query como filtro de otra:</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;color:#00ff41;margin-bottom:12px;">SELECT * FROM T_Inventario<br>WHERE C_Precio > (<br>&nbsp;&nbsp;SELECT AVG(C_Precio) FROM T_Inventario<br>);&nbsp;<span style="color:#546e7a;">-- "más caros que el promedio"</span></div>
            <p style="margin-bottom:8px;">• Con <code>IN (SELECT ...)</code> filtras contra una <strong>lista</strong> calculada.</p>
            <p style="margin-bottom:8px;">• Una subconsulta <strong>correlacionada</strong> se recalcula por cada fila (usa columnas de la consulta externa) — poderosa, pero costosa en tablas grandes.</p>
            <p style="color:var(--muted);font-size:13px;">SQL siempre resuelve de <strong>adentro hacia afuera</strong>: primero el paréntesis, luego el resto.</p>
          </div>
          <div style="background:rgba(0,217,255,0.06);border:1px solid rgba(0,217,255,0.3);border-radius:10px;padding:12px;margin-top:14px;text-align:center;">
            <p style="color:var(--muted);font-size:13px;font-style:italic;">💬 "Una vista bien diseñada es un regalo para el equipo entero. Un JOIN repetido 50 veces es deuda técnica." — Ing. Ana</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 3 de 3 — Los planos están listos
          </div>`
      }
    ]
  },
  10: {
    title: 'Las Armas Legendarias: CTEs y Window Functions',
    slides: [
      // SLIDE 1 — Contexto / El CEO
      {
        icon: '👑',
        tag: 'NEXUS SQL — PISO 100',
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:56px;margin-bottom:8px;filter:drop-shadow(0 0 20px var(--accent));">👑</div>
            <div style="font-family:var(--font-display);font-size:11px;letter-spacing:3px;color:var(--accent);text-transform:uppercase;">Oficina del Director General — Torre Velocity</div>
          </div>
          <div style="background:rgba(255,160,0,0.06);border:1px solid rgba(255,160,0,0.3);border-radius:12px;padding:20px;">
            <div style="font-family:var(--font-display);font-size:12px;letter-spacing:1px;color:var(--accent);margin-bottom:12px;">🕴️ EL CEO — de espaldas, mirando la ciudad</div>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;">
              "El analista que salvó a mis gerentes, purificó mis datos y construyó mi arquitectura.
              Impresionante. Pero hoy es el día del listado en la Bolsa.
              Los inversores no quieren tablas simples. Quieren <strong>inteligencia</strong>."
            </p>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;margin-top:10px;">
              "Si el reporte tiene un solo error de lógica, el grupo caerá.
              <strong style="color:var(--accent);">El destino de miles de empleados está en tu última consulta.</strong>"
            </p>
          </div>
          <div style="text-align:center;margin-top:16px;color:var(--muted);font-size:13px;">
            Slide 1 de 3 — El juicio final
          </div>`
      },
      // SLIDE 2 — CTEs
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">📐</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">CTE: tablas temporales con estilo</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:12px;"><code style="color:var(--primary);">WITH</code> nombra bloques lógicos ANTES de la consulta principal — mini-planos antes del rascacielos:</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;color:#00ff41;margin-bottom:12px;">WITH CTE_Ventas_2025 AS (<br>&nbsp;&nbsp;SELECT * FROM T_Ventas WHERE C_Anio = 2025<br>)<br>SELECT * FROM CTE_Ventas_2025<br>WHERE C_Sucursal = 'CDMX';</div>
            <p style="margin-bottom:8px;">Varias CTEs se encadenan con coma tras un solo <code>WITH</code> — y luego se unen entre sí con JOINs, como tablas normales.</p>
            <p style="color:var(--muted);font-size:13px;">Los SPs de 500 líneas de Dalton se vuelven legibles con este patrón. Es la diferencia entre heredar código y heredar un mapa.</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 2 de 3 — Organizar antes de construir
          </div>`
      },
      // SLIDE 3 — Window Functions
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">🪄</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">Window Functions: mirar al grupo sin colapsarlo</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:8px;">Un GROUP BY <strong>colapsa</strong> filas. Una window function las <strong>conserva</strong> y agrega una columna que mira al grupo:</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;color:#00ff41;margin-bottom:12px;">RANK() OVER (ORDER BY C_Monto DESC)&nbsp;<span style="color:#546e7a;">-- posición</span><br>ROW_NUMBER() OVER (PARTITION BY C_ID_Cliente<br>&nbsp;&nbsp;ORDER BY C_Fecha DESC)&nbsp;<span style="color:#546e7a;">-- deduplicar</span><br>AVG(C_Precio) OVER (PARTITION BY C_Marca)&nbsp;<span style="color:#546e7a;">-- vs su marca</span><br>SUM(C_Monto) OVER (ORDER BY C_Fecha)&nbsp;<span style="color:#546e7a;">-- acumulado</span></div>
            <p style="margin-bottom:8px;"><code>PARTITION BY</code> = "reinicia el cálculo por cada grupo". <code>ORDER BY</code> dentro del OVER = "en este orden".</p>
            <p style="color:var(--muted);font-size:13px;">RANK() deja huecos ante empates (1,1,3); ROW_NUMBER() nunca (1,2,3). DENSE_RANK() no deja huecos (1,1,2).</p>
          </div>
          <div style="background:rgba(0,217,255,0.06);border:1px solid rgba(0,217,255,0.3);border-radius:10px;padding:12px;margin-top:14px;text-align:center;">
            <p style="color:var(--muted);font-size:13px;font-style:italic;">💬 "Ya no solo consultas, Toño. Ahora analizas el tiempo y el espacio." — Ing. Ana</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 3 de 3 — El último duelo
          </div>`
      }
    ]
  },
  11: {
    title: 'La Ciencia de la Velocidad: Índices, SPs y Triggers',
    slides: [
      // SLIDE 1 — Contexto / el CEO y la tarjeta de titanio
      {
        icon: '💎',
        tag: 'NEXUS SQL — EL SERVIDOR ESPEJO',
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:56px;margin-bottom:8px;filter:drop-shadow(0 0 20px var(--primary));">💎</div>
            <div style="font-family:var(--font-display);font-size:11px;letter-spacing:3px;color:var(--primary);text-transform:uppercase;">Sección oculta — solo maestría absoluta</div>
          </div>
          <div style="background:rgba(255,160,0,0.06);border:1px solid rgba(255,160,0,0.3);border-radius:12px;padding:20px;">
            <div style="font-family:var(--font-display);font-size:12px;letter-spacing:1px;color:var(--primary);margin-bottom:12px;">🕴️ EL CEO — te entrega una tarjeta de titanio</div>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;">
              "Has salvado la empresa. Pero un buen arquitecto no solo construye:
              asegura que su obra dure mil años. Con miles de millones de filas,
              hasta tus consultas del Módulo 1 podrían volverse lentas."
            </p>
            <p style="font-style:italic;line-height:1.9;color:var(--text);font-size:15px;margin-top:10px;">
              "<strong style="color:var(--accent);">Haz que este motor corra como un BYD Seal en pista.</strong>"
            </p>
          </div>
          <div style="text-align:center;margin-top:16px;color:var(--muted);font-size:13px;">
            Slide 1 de 3 — El legado del Arquitecto
          </div>`
      },
      // SLIDE 2 — Índices
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">⚡</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">El índice del libro</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:12px;">T_Ventas es un libro de 1,000 páginas. Sin índice, SQL <strong>lee todo</strong> para encontrar un VIN. Con índice, va directo a la página:</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:13px;color:#00ff41;margin-bottom:12px;">CREATE INDEX IX_Inventario_VIN<br>ON T_Inventario (C_VIN);<br><br>EXPLAIN QUERY PLAN<br>SELECT * FROM T_Inventario WHERE C_VIN = 'NX001';<br><span style="color:#546e7a;">-- resultado: SEARCH ... USING INDEX ✓</span></div>
            <p style="margin-bottom:8px;">⚖️ <strong>Trade-off:</strong> las lecturas vuelan, pero cada INSERT/UPDATE paga el costo de mantener el índice. Indexa lo que se busca, no todo.</p>
            <p style="color:var(--muted);font-size:13px;">Convención NEXUS: prefijo <code>IX_</code>. En un índice compuesto (marca, año), el <strong>orden de columnas importa</strong>.</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 2 de 3 — Leer sin leerlo todo
          </div>`
      },
      // SLIDE 3 — SPs y Triggers
      {
        content: `
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:42px;margin-bottom:8px;">🤖</div>
            <div style="font-family:var(--font-display);font-size:13px;letter-spacing:2px;color:var(--accent);text-transform:uppercase;">Automatizar y blindar</div>
          </div>
          <div style="background:rgba(255,109,0,0.08);border:2px solid var(--accent);border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin-bottom:8px;"><strong>Stored Procedure</strong> (SQL Server): una misión entera guardada en un botón — <code>EXEC M_Cierre_Diario</code> en vez de 50 líneas. Los SPs de Dalton que analizarás en el Modo Tutor son exactamente esto.</p>
            <p style="margin-bottom:12px;"><strong>Trigger</strong>: código que se dispara SOLO ante un evento (INSERT/UPDATE/DELETE):</p>
            <div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;color:#00ff41;margin-bottom:12px;">CREATE TRIGGER TR_Proteger_Pagos<br>BEFORE DELETE ON T_Pagos<br>BEGIN<br>&nbsp;&nbsp;SELECT RAISE(ABORT, 'Bloqueado por el Auditor');<br>END;</div>
            <p style="color:var(--muted);font-size:13px;">Y el estándar de oro: tu convención <code>T_ / C_ / M_ / V_ / IX_ / TR_</code> documentada es lo que permitirá que otros analistas no se pierdan. Ese es tu verdadero legado.</p>
          </div>
          <div style="background:rgba(0,217,255,0.06);border:1px solid rgba(0,217,255,0.3);border-radius:10px;padding:12px;margin-top:14px;text-align:center;">
            <p style="color:var(--muted);font-size:13px;font-style:italic;">💬 "Que SQL no tenga que leer todo el libro para encontrar una página." — Ing. Ana</p>
          </div>
          <div style="text-align:center;margin-top:12px;color:var(--muted);font-size:13px;">
            Slide 3 de 3 — Post-graduación
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
    isAdmin: u.isAdmin || false,   // ← conservar la marca de administrador
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
  const moduleIds = Object.keys(challenges).map(Number).sort((a, b) => a - b); // Todos los módulos definidos, en orden
  for (const i of moduleIds) {
    const ch = challenges[i];
    const completed = window.gameState.completedSubExercises[i] || [];
    // Candado: el módulo N se desbloquea al completar los 10 ejercicios del N-1
    const prevDone = (window.gameState.completedSubExercises[i - 1] || []).length === 10;
    const isLocked = i > 1 && !prevDone && !window.isAdminUser();
    if (isLocked) {
      const lockDiv = document.createElement('div');
      lockDiv.className = 'challenge-item';
      lockDiv.style.opacity = '0.45';
      lockDiv.style.cursor = 'not-allowed';
      lockDiv.innerHTML = `
        <div style="display:flex;justify-content:space-between;">
          <div style="font-weight:bold;">🔒 ${i}. ${ch.title}</div>
          <div style="font-size:11px;">[0/10]</div>
        </div>
        <div style="font-size:11px;margin-top:4px;color:var(--muted);">Completa el Módulo ${i - 1} para desbloquear</div>`;
      list.appendChild(lockDiv);
      continue;                                                       // Bloqueado: sin expansión ni clicks
    }
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
  const ids = Object.keys(challenges).map(Number);                    // Todos los módulos definidos
  for (const i of ids) total += (window.gameState.completedSubExercises[i] || []).length;
  const grandTotal = ids.length * 10;                                 // 10 ejercicios por módulo
  const pct = Math.round((total / grandTotal) * 100);
  const el = document.getElementById('worldProgress');
  const bar = document.getElementById('worldProgressBar');
  if (el) el.textContent = `${total}/${grandTotal}`;
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
// TRIVIA — DATA-DRIVEN (un objeto por módulo)
// Para agregar trivia de un módulo nuevo: solo agregar entrada aquí.
// ============================================
const triviaData = {
  1: {
    npc: 'La Ing. Ana te evalúa en tiempo real',                     // Quién pregunta
    question: "Si Roberto te pide ver los autos que NO son de color 'Rojo', ¿qué operador de comparación usarías en el WHERE?",
    options: { A: '==', B: '&lt;&gt; o !=', C: 'NOT LIKE' },          // Opciones mostradas
    correct: 'B',                                                     // Letra correcta
    explanation: '<strong>&lt;&gt;</strong> o <strong>!=</strong> significa "diferente de".',
    coins: 200, xp: 20                                                // Recompensa
  },
  2: {
    npc: 'Sofía te lanza la pregunta mientras sella un manifiesto',
    question: 'Si quieres buscar todos los modelos que terminen con la letra "o" (como "Civic\u200bo" o "Ri\u200bo"), ¿cuál es el patrón correcto en el LIKE?',
    options: { A: "'o%'", B: "'%o'", C: "'_o'" },
    correct: 'B',
    explanation: "<strong>'%o'</strong>: el % va ANTES porque sustituye todo lo que hay antes de la 'o' final.",
    coins: 300, xp: 30
  },
  3: {
    npc: 'Don Víctor te mide con la mirada desde su escritorio de mármol',
    question: 'Si usas ORDER BY C_Precio sin especificar ASC ni DESC, ¿cómo ordenará SQL los datos por defecto?',
    options: { A: 'De mayor a menor (DESC)', B: 'De menor a mayor (ASC)', C: 'De forma aleatoria' },
    correct: 'B',
    explanation: '<strong>ASC</strong> es el orden por defecto: si no dices nada, SQL ordena de menor a mayor (A-Z).',
    coins: 400, xp: 40
  },
  4: {
    npc: 'Don Carlos te observa sin parpadear desde su pantalla de alta resolución',
    question: 'Si quieres filtrar los resultados de un GROUP BY (por ejemplo, mostrar solo marcas que tengan más de 10 autos), ¿qué palabra clave usas en lugar de WHERE?',
    options: { A: 'HAVING', B: 'FILTER', C: 'LIMIT' },
    correct: 'A',
    explanation: '<strong>HAVING</strong> filtra DESPUÉS de agrupar. WHERE filtra filas antes del GROUP BY; HAVING filtra los grupos ya calculados.',
    coins: 500, xp: 50
  },
  5: {
    npc: 'Don Carlos desliza el reporte tachado en rojo sobre la mesa',
    question: '¿Cuál es el orden correcto de ejecución en una consulta SQL?',
    options: { A: 'SELECT → FROM → WHERE → GROUP BY → HAVING', B: 'FROM → WHERE → GROUP BY → HAVING → SELECT', C: 'SELECT → HAVING → GROUP BY → WHERE' },
    correct: 'B',
    explanation: 'SQL ejecuta <strong>FROM → WHERE → GROUP BY → HAVING → SELECT</strong>. Se escribe SELECT primero, pero se ejecuta casi al final. Por eso WHERE no puede usar alias del SELECT.',
    coins: 600, xp: 60
  },
  6: {
    npc: 'Mariana señala dos pantallas: clientes en una, ventas en la otra',
    question: 'Si quieres unir dos tablas y solo te interesan los registros que tienen coincidencia en AMBAS, ¿qué tipo de JOIN debes usar?',
    options: { A: 'LEFT JOIN', B: 'INNER JOIN', C: 'CROSS JOIN' },
    correct: 'B',
    explanation: '<strong>INNER JOIN</strong> es el punto de encuentro: solo trae filas que coinciden en las dos tablas. LEFT trae todo de la izquierda aunque no coincida; CROSS combina todo con todo.',
    coins: 700, xp: 70
  },
  7: {
    npc: 'Mariana señala una lista de 5,000 registros del Buen Fin que no compraron',
    question: 'Si en un LEFT JOIN la tabla de la izquierda tiene 10 filas y la de la derecha tiene 5 que coinciden, ¿cuántas filas verás en el resultado final?',
    options: { A: '5', B: '10', C: '15' },
    correct: 'B',
    explanation: '<strong>10</strong>: el LEFT JOIN conserva TODAS las filas de la izquierda. Las 5 sin coincidencia aparecen con NULL en las columnas de la derecha.',
    coins: 800, xp: 80
  },
  8: {
    npc: 'El Auditor proyecta tu expediente en la pared del Búnker',
    question: '¿Cuál es la diferencia principal entre DELETE y TRUNCATE?',
    options: { A: 'DELETE es más rápido', B: 'DELETE puede llevar WHERE para borrar filas específicas; TRUNCATE borra todo siempre', C: 'TRUNCATE solo borra las columnas, no las filas' },
    correct: 'B',
    explanation: '<strong>DELETE</strong> acepta WHERE y registra cada fila borrada (reversible en transacción). <strong>TRUNCATE</strong> vacía la tabla completa de golpe, más rápido, sin WHERE. La estructura sobrevive en ambos.',
    coins: 1000, xp: 100
  },
  9: {
    npc: 'El Ing. Aranda gira un plano holográfico del nuevo Data Center',
    question: 'Si borras datos a través de una Vista, ¿qué sucede con la tabla original?',
    options: { A: 'Nada, la vista es solo una copia', B: 'Los datos también se borran en la tabla original (si la vista es simple)', C: 'La vista se rompe y deja de funcionar' },
    correct: 'B',
    explanation: 'Una vista <strong>no guarda datos</strong>: es una ventana a la tabla real. Si la vista es simple (una tabla, sin agregaciones), un DELETE a través de ella <strong>borra en la tabla original</strong>. Por eso las vistas también son un tema de seguridad.',
    coins: 1500, xp: 150
  },
  10: {
    npc: 'El CEO habla sin voltearse, mirando la ciudad desde el piso 100',
    question: '¿Qué ventaja tiene usar una CTE (WITH) sobre una subconsulta tradicional?',
    options: { A: 'Es obligatoria para que el código funcione', B: 'Hace el código mucho más legible y fácil de mantener', C: 'SQL las procesa más rápido siempre' },
    correct: 'B',
    explanation: 'La CTE es <strong>organización</strong>: nombra bloques lógicos y los apila arriba, como mini-planos antes del rascacielos. El motor suele ejecutarlas igual que una subconsulta — la ganancia es para el humano que mantiene el código.',
    coins: 2000, xp: 200
  },
  11: {
    npc: 'La Ing. Ana, por primera vez en persona, te entrega un café',
    question: 'La tabla T_Ventas tiene millones de filas. ¿Qué hace exactamente un índice en C_VIN?',
    options: { A: 'Duplica la tabla para leer más rápido', B: 'Crea una estructura ordenada que apunta a las filas, como el índice de un libro', C: 'Comprime los datos para que ocupen menos' },
    correct: 'B',
    explanation: 'Un índice es <strong>el índice de un libro</strong>: una estructura ordenada aparte que apunta a la página exacta. SQL deja de leer las 1,000 páginas y va directo. El costo: cada INSERT/UPDATE también debe actualizar el índice.',
    coins: 2500, xp: 250
  }
};

window.showTrivia = function(cId) {
  const t = triviaData[cId];                                          // Datos del módulo actual
  if (!t) return;                                                     // Sin trivia definida → no romper
  const content = document.getElementById('modalGenericContent');
  // Botones generados desde las opciones (A/B/C) del objeto de datos
  const btns = Object.entries(t.options).map(([k, v]) =>
    `<button class="btn btn-secondary" onclick="answerTrivia('${k}',${cId})" style="width:100%;margin:8px 0;font-size:15px;">${k}) ${v}</button>`
  ).join('');
  content.innerHTML = `
    <div style="text-align:center;">
      <div style="font-size:48px;margin-bottom:15px;">⚡</div>
      <h2 style="color:var(--accent);margin-bottom:5px;">TRIVIA DE VELOCIDAD</h2>
      <p style="color:var(--muted);margin-bottom:20px;">${t.npc}</p>
      <div style="background:rgba(245,158,11,0.1);padding:20px;border-radius:12px;border:2px solid var(--accent);margin:20px 0;text-align:left;">
        <p style="font-size:16px;margin-bottom:20px;font-style:italic;">"${t.question}"</p>
        ${btns}
      </div>
      <p style="font-size:14px;color:var(--accent);">💰 Premio: +${t.coins} VC si aciertas a la primera</p>
    </div>`;
  document.getElementById('modalGeneric').classList.add('active');
};

window.answerTrivia = function(ans, cId) {
  const t = triviaData[cId];                                          // Datos del módulo (respuesta correcta, premios)
  window.gameState.triviaAnswered = true;
  const content = document.getElementById('modalGenericContent');
  if (ans === t.correct) {
    sounds.success();
    window.gameState.coins += t.coins; window.gameState.xp += t.xp;   // Recompensa según el módulo
    createCoinRain(t.coins); saveGameState();
    content.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:64px;margin-bottom:20px;">✅</div>
        <h2 style="color:var(--primary);">¡CORRECTO!</h2>
        <p style="margin:20px 0;font-size:16px;">${t.explanation}</p>
        <div style="background:linear-gradient(135deg,rgba(0,217,255,0.2),rgba(124,58,237,0.2));padding:25px;border-radius:12px;margin:20px 0;border:2px solid var(--accent);">
          <div style="font-size:32px;margin:10px 0;">🪙 +${t.coins} VC</div>
          <div style="font-size:32px;margin:10px 0;">⭐ +${t.xp} XP</div>
        </div>
        <button class="btn" onclick="closeModal('modalGeneric');loadChallenge(${cId},6);" style="width:100%;margin-top:20px;">Continuar →</button>
      </div>`;
  } else {
    sounds.error();
    content.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:64px;margin-bottom:20px;">❌</div>
        <h2 style="color:var(--danger);">Incorrecto</h2>
        <p style="margin:20px 0;">Respuesta: <strong>${t.correct}) ${t.options[t.correct]}</strong></p>
        <p style="color:var(--muted);">Sin recompensa esta vez. Sigue adelante.</p>
        <button class="btn btn-secondary" onclick="closeModal('modalGeneric');loadChallenge(${cId},6);" style="width:100%;margin-top:20px;">Continuar →</button>
      </div>`;
  }
};

// ============================================
// BOSS FINAL — DATA-DRIVEN (un objeto por módulo)
// checks: cada regla valida tokens en la query normalizada (any = al menos uno debe estar)
// ============================================
const bossData = {
  1: {
    bossName: 'BOSS FINAL — ROBERTO',
    introTime: '📍 09:47 AM — Llamada directa de Roberto',
    introText: `"¡{NAME}! La planta cierra el sistema en 5 minutos.
      Necesito el <strong>Top 5 de los autos más caros</strong>
      que sean marca 'Toyota', que <strong>NO sean de color 'Blanco'</strong>
      y ordenados de <strong>mayor a menor precio</strong>. ¡YA!"`,
    comboHint: 'Combina: SELECT con LIMIT 5, WHERE, AND, condición de color, ORDER BY DESC',
    title: '👹 BOSS FINAL — El Ultimátum de Roberto',
    descShort: 'Top 5 Toyota más caros, NO blancos, ORDER BY DESC',
    battleCry: 'Top 5 Toyota más caros. NO blancos. Mayor a menor. ¡AHORA!',
    checks: [
      { any: ['limit 5', 'top 5'], hint: 'LIMIT 5' },
      { any: ["'toyota'"], hint: "marca='Toyota'" },
      { any: ["!= 'blanco'", "<> 'blanco'", "not"], extra: "'blanco'", hint: "color != 'Blanco'" },
      { any: ['order by'], extra: 'desc', hint: 'ORDER BY ... DESC' },
      { any: ['c_precio'], hint: 'usar C_Precio' }
    ],
    maxRows: 5,                                                       // Máximo de filas esperadas en el resultado
    xp: 50, coins: 1500,
    badges: ['boss1', 'mundo1'],
    newRank: 'Analista SR',
    victoryTitle: '¡NODO GDL RESTAURADO!',
    victoryText: `"Lo lograste. Roberto puede despachar las unidades.
      NexCorp Industries sobrevive otro día.
      Acabas de demostrar que aprendes SQL más rápido de lo que
      The Void destruye sistemas."`,
    victoryNPC: '— Ing. Ana',
    victoryRewardsTitle: '🏆 RECOMPENSAS DEL MÓDULO 1',
    victoryBadgeLines: ['👑 Insignia: Vencedor de Roberto', '🏆 Insignia: Salvador de GDL'],
    moduleLabel: 'Módulo 1 — COMPLETO 100%'
  },
  2: {
    bossName: 'BOSS FINAL — SOFÍA',
    introTime: '📍 06:58 PM — Barrera de salida, último camión',
    introText: `"¡{NAME}, el último camión se va! Necesito la lista de todas las camionetas
      (<strong>modelos que empiecen con 'C'</strong>) de la marca <strong>'Honda'</strong>,
      que sean de color <strong>'Gris' o 'Azul'</strong>,
      y que tengan el <strong>C_Precio registrado</strong>.
      ¡Si el reporte es exacto, desbloqueamos el paso a SLP!"`,
    comboHint: "Combina: LIKE 'C%', marca Honda, IN ('Gris','Azul') u OR, y C_Precio IS NOT NULL",
    title: '👹 BOSS FINAL — El Despacho Fronterizo',
    descShort: "Honda, modelo LIKE 'C%', color Gris/Azul, precio registrado",
    battleCry: "Camionetas 'C%' Honda, Gris o Azul, con precio. ¡El camión no espera!",
    checks: [
      { any: ["'honda'"], hint: "marca = 'Honda'" },
      { any: ["like 'c%'"], hint: "C_Modelo LIKE 'C%'" },
      { any: ["'gris'"], hint: "color 'Gris'" },
      { any: ["'azul'"], hint: "color 'Azul'" },
      { any: ['is not null'], hint: 'C_Precio IS NOT NULL' }
    ],
    maxRows: 10,
    xp: 80, coins: 1800,
    badges: ['boss2', 'mundo2'],
    newRank: null,                                                    // El rango sube por XP, no forzado aquí
    victoryTitle: '¡NODO SLP RESTAURADO!',
    victoryText: `"El camión cruzó la barrera con el manifiesto perfecto. Ni una multa.
      Roberto tenía razón sobre ti: no apruebas aproximaciones, entregas precisión.
      El Nodo 3 (MTY) ya detecta tu firma digital... Don Víctor te espera."`,
    victoryNPC: '— Sofía, Jefa de Patio',
    victoryRewardsTitle: '🏆 RECOMPENSAS DEL MÓDULO 2',
    victoryBadgeLines: ['🎯 Insignia: Precisión Quirúrgica', '🚚 Insignia: Salvador de SLP'],
    moduleLabel: 'Módulo 2 — COMPLETO 100%'
  },
  3: {
    bossName: 'BOSS FINAL — DON VÍCTOR',
    introTime: '📍 08:12 PM — Oficina de mármol, el CEO de la acerera en la línea',
    introText: `"¡{NAME}! Necesito el <strong>Top 10 de los vehículos más caros</strong>
      que sean <strong>'Lexus' o 'Toyota'</strong>, pero escúchame bien:
      quiero una columna extra que diga <strong>'DISPONIBILIDAD INMEDIATA'</strong> si el auto tiene
      C_Stock mayor a 0, y <strong>'BAJO PEDIDO'</strong> si no tiene.
      ¡Y ordénalos por precio de forma descendente!"`,
    comboHint: "Combina: CASE WHEN C_Stock > 0, IN ('Lexus','Toyota'), ORDER BY C_Precio DESC, LIMIT 10",
    title: '👹 BOSS FINAL — La Gala VIP de Don Víctor',
    descShort: "Top 10 Lexus/Toyota más caros + columna CASE de disponibilidad, ORDER DESC",
    battleCry: 'Top 10 más caros. Lexus o Toyota. Columna de disponibilidad. ¡El CEO no espera!',
    checks: [
      { any: ['limit 10', 'top 10'], hint: 'LIMIT 10' },
      { any: ["'lexus'"], hint: "marca 'Lexus'" },
      { any: ["'toyota'"], hint: "marca 'Toyota'" },
      { any: ['case when'], hint: 'CASE WHEN para la disponibilidad' },
      { any: ["'disponibilidad inmediata'"], hint: "etiqueta 'DISPONIBILIDAD INMEDIATA'" },
      { any: ["'bajo pedido'"], hint: "etiqueta 'BAJO PEDIDO'" },
      { any: ['order by'], extra: 'desc', hint: 'ORDER BY ... DESC' }
    ],
    maxRows: 10,
    xp: 100, coins: 2000,
    badges: ['boss3', 'mundo3'],
    newRank: null,
    victoryTitle: '¡NODO MTY RESTAURADO!',
    victoryText: `"El CEO de la acerera firmó por tres blindadas y un LX600.
      En Monterrey no regalamos elogios, muchacho, pero esto...
      esto fue trabajo de Especialista. El Nodo 4 (CDMX) te espera.
      Cuidado con Don Carlos: el CFO no perdona un decimal."`,
    victoryNPC: '— Don Víctor, Director del Norte',
    victoryRewardsTitle: '🏆 RECOMPENSAS DEL MÓDULO 3',
    victoryBadgeLines: ['⛰️ Insignia: Rey de los Rankings', '👑 Insignia: Salvador de MTY'],
    moduleLabel: 'Módulo 3 — COMPLETO 100%'
  },
  4: {
    bossName: 'BOSS FINAL — DON CARLOS',
    introTime: '📍 11:55 AM — Torre Velocity, la junta de accionistas empieza en 5 minutos',
    introText: `"¡Basta de juegos, {NAME}! Necesito un reporte que muestre <strong>por cada marca</strong>:
      el <strong>total de ventas (SUM)</strong>, el <strong>precio promedio (AVG)</strong>
      y <strong>cuántas unidades se vendieron (COUNT)</strong>.
      Pero solo quiero ver las marcas cuyo total de ventas sea
      <strong>mayor a $2,000,000</strong>. ¡Si el reporte no es exacto, Grupo Velocity se detiene hoy!"`,
    comboHint: 'Combina: SUM, AVG, COUNT, GROUP BY C_Marca, HAVING SUM(C_Monto) > 2000000 — sobre T_Ventas_CDMX',
    title: '👹 BOSS FINAL — El Cierre Fiscal de Don Carlos',
    descShort: 'Por marca: SUM, AVG, COUNT — solo marcas con ventas > $2,000,000 (HAVING)',
    battleCry: 'Totales por marca. Solo las que pasen de 2 millones. ¡Los accionistas ya están sentados!',
    checks: [
      { any: ['sum ('], hint: 'SUM(C_Monto)' },
      { any: ['avg ('], hint: 'AVG(C_Monto)' },
      { any: ['count ('], hint: 'COUNT(*)' },
      { any: ['group by'], extra: 'c_marca', hint: 'GROUP BY C_Marca' },
      { any: ['having'], extra: '2000000', hint: 'HAVING SUM(...) > 2000000' }
    ],
    maxRows: 5,
    xp: 120, coins: 2500,
    badges: ['boss4', 'mundo4'],
    newRank: null,
    victoryTitle: '¡NODO CDMX CONSOLIDADO!',
    victoryText: `"Los números cuadraron. Los accionistas aplaudieron el reporte...
      yo no aplaudo, pero tampoco te desconecté. Eso, analista, es mi máximo elogio.
      Ana te espera en el siguiente nivel: ahí las tablas dejan de vivir solas
      y empiezan a hablarse entre ellas."`,
    victoryNPC: '— Don Carlos, CFO de Grupo Velocity',
    victoryRewardsTitle: '🏆 RECOMPENSAS DEL MÓDULO 4',
    victoryBadgeLines: ['🧮 Insignia: Ábaco de Agregación', '🏦 Insignia: Salvador de CDMX'],
    moduleLabel: 'Módulo 4 — COMPLETO 100%'
  },
  5: {
    bossName: 'BOSS FINAL — DON CARLOS (CONSEJO)',
    introTime: '📍 09:00 AM — Sala de Juntas del Consejo, la inversión pende de un hilo',
    introText: `"¡Es el momento, {NAME}! Quiero ver por cada <strong>Sucursal y Marca</strong>:
      el <strong>total de ventas (SUM)</strong> y <strong>cuántos autos se vendieron (COUNT)</strong>.
      Pero atención: solo incluye autos del <strong>año 2024 en adelante</strong>,
      y en el resultado final solo los grupos con más de
      <strong>$5,000,000</strong> en ventas. ¡Si el dato falla, la inversión se retira!"`,
    comboHint: 'Combina: WHERE C_Anio >= 2024, GROUP BY C_Sucursal, C_Marca, HAVING SUM(C_Monto) > 5000000 — sobre T_Ventas',
    title: '👹 BOSS FINAL — El Reporte Nacional de Accionistas',
    descShort: 'Por sucursal y marca: SUM + COUNT, solo 2024+, solo grupos > $5,000,000',
    battleCry: 'Sucursal y marca. Solo 2024 en adelante. Solo grupos de más de 5 millones. ¡La inversión se decide HOY!',
    checks: [
      { any: ['where'], extra: 'c_anio', hint: 'WHERE C_Anio >= 2024' },
      { any: ['group by'], extra: 'c_sucursal', hint: 'GROUP BY con C_Sucursal' },
      { any: ['c_marca'], hint: 'agrupar también por C_Marca' },
      { any: ['sum ('], hint: 'SUM(C_Monto)' },
      { any: ['count ('], hint: 'COUNT(*)' },
      { any: ['having'], extra: '5000000', hint: 'HAVING SUM(...) > 5000000' }
    ],
    maxRows: 4,
    xp: 150, coins: 3000,
    badges: ['boss5', 'mundo5'],
    newRank: null,
    victoryTitle: '¡CONSOLIDACIÓN NACIONAL COMPLETA!',
    victoryText: `"Los accionistas firmaron. La inversión se queda.
      ¿Notaste la trampa? GDL-Toyota parecía superar los 5 millones...
      hasta que tu WHERE excluyó la venta de 2023. Eso es criterio, no suerte.
      Ana tiene razón: estás listo para que las tablas empiecen a hablarse entre ellas."`,
    victoryNPC: '— Don Carlos, CFO de Grupo Velocity',
    victoryRewardsTitle: '🏆 RECOMPENSAS DEL MÓDULO 5',
    victoryBadgeLines: ['🌾 Insignia: Separador de Trigo y Paja', '🇲🇽 Insignia: Consolidador Nacional'],
    moduleLabel: 'Módulo 5 — COMPLETO 100%'
  },
  6: {
    bossName: 'BOSS FINAL — MARIANA',
    introTime: '📍 04:58 PM — La campaña sale en 2 minutos',
    introText: `"¡{NAME}, la campaña sale en 2 minutos! Necesito la lista de los
      <strong>10 clientes que más han gastado</strong> en la historia de la empresa.
      Quiero su <strong>Nombre Completo, su Correo y el Total de su compra (SUM)</strong>.
      Une T_Clientes con T_Ventas, <strong>agrupa por cliente</strong>
      y <strong>ordena de mayor a menor</strong>. ¡Corre!"`,
    comboHint: 'Combina: INNER JOIN ... ON, GROUP BY C_Nombre_Completo, C_Correo, ORDER BY SUM(C_Monto) DESC, LIMIT 10',
    title: '👹 BOSS FINAL — El Lanzamiento VIP de Mariana',
    descShort: 'Top 10 clientes por gasto total: nombre + correo + SUM, JOIN + GROUP BY + ORDER DESC',
    battleCry: 'Top 10 clientes VIP. Nombre, correo y total. ¡La campaña no espera a nadie!',
    checks: [
      { any: ['inner join'], hint: 'INNER JOIN entre T_Clientes y T_Ventas' },
      { any: [' on '], hint: 'ON con la llave C_ID_Cliente' },
      { any: ['sum ('], hint: 'SUM(C_Monto)' },
      { any: ['group by'], hint: 'GROUP BY por cliente' },
      { any: ['c_correo'], hint: 'incluir C_Correo' },
      { any: ['order by'], extra: 'desc', hint: 'ORDER BY ... DESC' },
      { any: ['limit 10', 'top 10'], hint: 'LIMIT 10' }
    ],
    maxRows: 10,
    xp: 180, coins: 3500,
    badges: ['boss6', 'mundo6'],
    newRank: null,
    victoryTitle: '¡LOS VÍNCULOS HAN SIDO RESTAURADOS!',
    victoryText: `"¡La campaña salió al aire con los 10 VIP correctos!
      Acabas de hacer lo que The Void creyó imposible: volver a unir los mundos.
      Clientes, ventas e inventario vuelven a ser una sola historia.
      Ana dice que lo que viene es territorio avanzado... yo digo que ya estás listo."`,
    victoryNPC: '— Mariana, Directora de Marketing',
    victoryRewardsTitle: '🏆 RECOMPENSAS DEL MÓDULO 6',
    victoryBadgeLines: ['🔗 Insignia: Tejedor de Vínculos', '🎨 Insignia: Héroe de Marketing'],
    moduleLabel: 'Módulo 6 — COMPLETO 100%'
  },
  7: {
    bossName: 'BOSS FINAL — MARIANA (RECONQUISTA)',
    introTime: '📍 10:30 AM — El Director General exige respuestas sobre Kia',
    introText: `"¡{NAME}, el Director quiere saber por qué el inventario <strong>'Kia'</strong> no se mueve!
      Necesito un reporte con <strong>todos los autos Kia</strong> del inventario;
      para los vendidos, muestra la <strong>fecha de venta</strong> y el <strong>nombre del cliente</strong>.
      Y lo más importante: los que NO se han vendido deben aparecer con la leyenda
      <strong>'DISPONIBLE'</strong> (usa un CASE)."`,
    comboHint: "Combina: LEFT JOIN inventario→ventas→clientes, CASE WHEN ... IS NULL THEN 'DISPONIBLE', WHERE marca 'Kia'",
    title: '👹 BOSS FINAL — La Reconquista de Mariana',
    descShort: "Todos los Kia: fecha y cliente si se vendió, 'DISPONIBLE' si no (LEFT JOIN + CASE)",
    battleCry: "Todos los Kia. Vendidos con cliente, libres con 'DISPONIBLE'. ¡El Director está en la sala!",
    checks: [
      { any: ['left join'], hint: 'LEFT JOIN (no INNER: deben salir TODOS los Kia)' },
      { any: ["'kia'"], hint: "WHERE marca = 'Kia'" },
      { any: ['case when'], hint: 'CASE WHEN para la leyenda' },
      { any: ["'disponible'"], hint: "etiqueta 'DISPONIBLE'" },
      { any: ['is null'], hint: 'detectar los no vendidos con IS NULL' }
    ],
    maxRows: 18,
    xp: 200, coins: 4000,
    badges: ['boss7', 'mundo7'],
    newRank: null,
    victoryTitle: '¡LOS FANTASMAS HAN SIDO REVELADOS!',
    victoryText: `"El Director vio los 13 Kia estancados con su leyenda 'DISPONIBLE'
      y aprobó la campaña de descuentos en el acto.
      Encontraste lo invisible: el INNER JOIN muestra lo que existe,
      pero tú aprendiste a ver lo que falta. Esa es la marca de un Arquitecto."`,
    victoryNPC: '— Mariana, Directora de Marketing',
    victoryRewardsTitle: '🏆 RECOMPENSAS DEL MÓDULO 7',
    victoryBadgeLines: ['🌑 Insignia: Cazador de Fantasmas', '🔦 Insignia: Revelador del Vacío'],
    moduleLabel: 'Módulo 7 — COMPLETO 100%'
  },
  8: {
    bossName: 'BOSS FINAL — EL AUDITOR',
    introTime: '📍 00:00 AM — Búnker de Seguridad, alerta roja activa',
    introText: `"¡Última oportunidad, {NAME}! The Void puso los precios de <strong>'BYD'</strong> en <strong>$1.00</strong>
      e inyectó ventas falsas. Harás dos cosas <strong>en una sola sesión</strong>:
      1) <strong>Elimina</strong> todas las ventas hechas a $1.00.
      2) <strong>Actualiza</strong> el inventario 'BYD' a <strong>$550,000</strong>,
      pero <strong>solo</strong> los modelos 'Seal'.
      ¡Si borras una venta real, estás fuera!"`,
    comboHint: "Dos sentencias juntas: DELETE FROM T_Ventas WHERE C_Monto = 1; y UPDATE T_Inventario SET ... WHERE C_Marca = 'BYD' AND C_Modelo = 'Seal';",
    title: '👹 BOSS FINAL — La Gran Purga del Auditor',
    descShort: "DELETE de ventas a $1 + UPDATE de BYD Seal a $550,000 — en una sola ejecución",
    battleCry: 'Purga las ventas falsas. Restaura los Seal. Un solo error y tu acceso desaparece.',
    checks: [
      { any: ['delete from'], extra: 't_ventas', hint: 'DELETE FROM T_Ventas' },
      { any: ['c_monto = 1 ', 'c_monto = 1;', 'c_monto=1'], hint: 'WHERE C_Monto = 1 (¡solo las falsas!)' },
      { any: ['update'], extra: 't_inventario', hint: 'UPDATE T_Inventario' },
      { any: ['550000'], hint: 'SET C_Precio = 550000' },
      { any: ["'byd'"], hint: "C_Marca = 'BYD'" },
      { any: ["'seal'"], hint: "AND C_Modelo = 'Seal'" }
    ],
    maxRows: 99,
    allowNoRows: true,
    xp: 250, coins: 5000,
    badges: ['boss8', 'mundo8'],
    newRank: null,
    victoryTitle: '¡LA PURGA HA SIDO EJECUTADA!',
    victoryText: `"Tres ventas falsas eliminadas. Ni una real tocada.
      Los Seal restaurados a su valor exacto.
      He auditado a cientos de analistas... casi todos destruyen algo en este nivel.
      Tú no. Tu expediente queda... limpio. No te acostumbres al elogio."`,
    victoryNPC: '— El Auditor, Control Interno',
    victoryRewardsTitle: '🏆 RECOMPENSAS DEL MÓDULO 8',
    victoryBadgeLines: ['🛡️ Insignia: Pulso de Cirujano', '⚔️ Insignia: Purgador del Void'],
    moduleLabel: 'Módulo 8 — COMPLETO 100%'
  },
  9: {
    bossName: 'BOSS FINAL — ING. ARANDA',
    introTime: '📍 06:45 PM — El CEO está entrando a la sala de juntas',
    introText: `"¡{NAME}, es el plano final! Crea una <strong>Vista Maestra</strong> llamada
      <strong>V_Master_Global</strong> que una <strong>Clientes, Ventas, Inventario y Sucursales</strong>
      (las sucursales se alcanzan a través de T_Vendedores).
      El truco: solo debe mostrar autos cuyo precio sea <strong>superior al precio promedio
      de la marca 'Toyota'</strong> (subconsulta en el WHERE).
      ¡Si encapsulas esa lógica, el sistema NEXUS será eterno!"`,
    comboHint: "CREATE VIEW V_Master_Global AS SELECT ... 4 INNER JOIN ... WHERE I.C_Precio > (SELECT AVG(C_Precio) FROM T_Inventario WHERE C_Marca = 'Toyota')",
    title: '👹 BOSS FINAL — El Nexus Core',
    descShort: "Vista V_Master_Global: 5 tablas unidas + subconsulta del promedio Toyota en el WHERE",
    battleCry: 'Una vista que lo une todo, filtrada por el promedio Toyota. El CEO ya está sentado.',
    checks: [
      { any: ['create view'], extra: 'v_master_global', hint: 'CREATE VIEW V_Master_Global AS ...' },
      { any: ['inner join', 'join'], hint: 'INNER JOINs entre las tablas' },
      { any: ['t_sucursales'], hint: 'incluir T_Sucursales (vía T_Vendedores)' },
      { any: ['t_clientes'], hint: 'incluir T_Clientes' },
      { any: ['select avg ('], extra: "'toyota'", hint: "subconsulta: (SELECT AVG(C_Precio) ... WHERE C_Marca = 'Toyota')" }
    ],
    maxRows: 99,
    allowNoRows: true,
    xp: 300, coins: 6000,
    badges: ['boss9', 'mundo9'],
    newRank: null,
    victoryTitle: '¡EL NEXUS CORE ESTÁ EN LÍNEA!',
    victoryText: `"El CEO consultó tu vista con un solo SELECT... y detrás corrieron
      cinco tablas y una subconsulta sin que él lo supiera. Eso es arquitectura:
      complejidad encapsulada, simplicidad entregada.
      Ya no arreglas sistemas, {NAME}. Ahora los diseñas.
      Queda una sola cita: el Trono de Datos. El CEO quiere verte... personalmente."`,
    victoryNPC: '— Ing. Aranda, Jefe de Infraestructura',
    victoryRewardsTitle: '🏆 RECOMPENSAS DEL MÓDULO 9',
    victoryBadgeLines: ['🏗️ Insignia: Arquitecto del Núcleo', '🪟 Insignia: Señor de las Vistas'],
    moduleLabel: 'Módulo 9 — COMPLETO 100%'
  },
  10: {
    bossName: 'THE BOSS — EL CEO',
    introTime: '📍 08:59 AM — Piso 100, día del listado en la Bolsa de Valores',
    introText: `"Es ahora, {NAME}. Genera el <strong>Dashboard Maestro</strong>:
      una sola consulta con una <strong>CTE</strong> que pre-calcule los totales por marca
      (uniendo Ventas, Inventario, Clientes y Vendedores),
      una <strong>Window Function RANK()</strong> que asigne posición por ganancias,
      y muestra solo el <strong>Top 3 de marcas</strong> con su total y su ranking nacional.
      Si el reporte tiene un solo error de lógica, el grupo caerá.
      <strong>El destino de miles de empleados está en tu última consulta.</strong>"`,
    comboHint: 'WITH CTE_Totales AS (SELECT I.C_Marca, SUM(V.C_Monto) ... 3 INNER JOIN ... GROUP BY) SELECT ..., RANK() OVER (ORDER BY M_Total DESC) ... LIMIT 3',
    title: '👹 THE BOSS — El Reporte NEXUS Supremo',
    descShort: 'CTE con 4 tablas unidas + RANK() OVER + Top 3 de marcas por ganancias',
    battleCry: 'Una consulta. Todo lo que aprendiste. El sistema NEXUS se libera hoy o cae para siempre.',
    checks: [
      { any: ['with '], hint: 'WITH nombre AS (...) — la CTE' },
      { any: ['inner join', 'join'], hint: 'JOINs entre las tablas dentro de la CTE' },
      { any: ['group by'], hint: 'GROUP BY C_Marca para los totales' },
      { any: ['rank ('], hint: 'RANK() para el ranking' },
      { any: ['over ('], hint: 'OVER (ORDER BY ... DESC)' },
      { any: ['limit 3', 'top 3'], hint: 'solo el Top 3' }
    ],
    maxRows: 3,
    xp: 1000, coins: 10000,
    badges: ['boss10', 'mundo10'],
    newRank: 'Arquitecto Maestro Nexus',
    victoryTitle: '🏆 ¡EL SISTEMA NEXUS HA SIDO LIBERADO!',
    victoryText: `"El reporte subió a la Bolsa sin un solo error. Las 8 marcas operan al 100%.
      'The Void' ha sido comprimido en un archivo de respaldo... para siempre.
      Empezaste restaurando un nodo en Guadalajara. Hoy salvaste al grupo entero.
      Ana tenía razón desde el Día 1: no contratamos un analista. Contratamos un Arquitecto.
      El título es tuyo: <strong>Arquitecto Maestro Nexus</strong>."`,
    victoryNPC: '— El CEO, Grupo Velocity',
    victoryRewardsTitle: '👑 RECOMPENSAS FINALES',
    victoryBadgeLines: ['👑 Insignia: Vencedor del CEO', '💠 Insignia: Liberador del NEXUS'],
    moduleLabel: '🎓 AVENTURA PRINCIPAL COMPLETADA — 10/10 módulos'
  },
  11: {
    bossName: 'LA ÚLTIMA CONSULTA — ING. ANA',
    introTime: '📍 Atardecer — Helipuerto de la Torre Velocity, la gala está por comenzar',
    introText: `"Roberto, Sofía, Don Víctor, Don Carlos y Mariana ya están arriba, {NAME}.
      Antes de subir, una última consulta — la más simple y la más importante de todas:
      <strong>lee tu propio diccionario</strong>. T_Diccionario_Nexus.
      Porque el código es solo una herramienta...
      pero el orden que dejaste es tu verdadero legado."`,
    comboHint: 'Una consulta simple sobre la tabla que documenta tu convención de nombres',
    title: '🎊 LA CEREMONIA DE DALTON — La Consulta de Despedida',
    descShort: 'Lee tu legado: consulta T_Diccionario_Nexus',
    battleCry: 'La consulta más simple del curso. Y la que más importa.',
    checks: [
      { any: ['select'], hint: 'un SELECT' },
      { any: ['t_diccionario_nexus'], hint: 'sobre T_Diccionario_Nexus' }
    ],
    maxRows: 10,
    xp: 500, coins: 9000,
    badges: ['boss11', 'mundo11'],
    newRank: 'Consultor Legendario',
    victoryTitle: '🎊 LA CEREMONIA DE DALTON',
    victoryText: `"T_ Tabla. C_ Columna. M_ Medida. V_ Vista. Cuatro filas... y todo un sistema de pensamiento.
      Toño, el código es solo una herramienta, pero la lógica que desarrollaste
      es lo que salvó a la empresa. Ahora, cada vez que veas un auto en la calle,
      sabrás que detrás hay una fila en una tabla, un precio filtrado
      y un Arquitecto que puso orden al caos. ¡Felicidades, Maestro!"
      <br><br>🏆 <strong>Resumen final:</strong> 11 nodos restaurados · The Void comprimido para siempre ·
      Habilidad especial desbloqueada: <strong>Arquitectura de Datos Relacionales Automotrices</strong>.`,
    victoryNPC: '— Ing. Ana, tu mentora',
    victoryRewardsTitle: '💎 RECOMPENSAS DE POST-GRADUACIÓN',
    victoryBadgeLines: ['🔮 Insignia: El Oráculo', '🎓 Insignia: Consultor Legendario'],
    moduleLabel: '💯 JUEGO COMPLETADO AL 100% — 11/11 módulos (Aventura + Bonus)'
  }
};

window.showBossFight = function(cId) {
  const b = bossData[cId];                                            // Datos del boss del módulo
  if (!b) return;
  const name = window.gameState.playerName;
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = `
    <div style="text-align:center;">
      <div style="font-size:64px;margin-bottom:15px;">👹</div>
      <h2 style="color:var(--danger);margin-bottom:15px;">${b.title}</h2>
      <div style="background:rgba(239,68,68,0.1);padding:20px;border-radius:12px;border:2px solid var(--danger);margin:20px 0;text-align:left;">
        <div style="font-size:12px;color:var(--muted);margin-bottom:10px;">${b.introTime}</div>
        <p style="font-size:16px;font-style:italic;line-height:1.7;">${b.introText.replace('{NAME}', name)}</p>
      </div>
      <p style="font-size:13px;color:var(--muted);margin:15px 0;">${b.comboHint}</p>
      <button class="btn" onclick="closeModal('modalGeneric');startBoss(${cId});" style="width:100%;font-size:18px;">⚔️ Aceptar Desafío Final</button>
    </div>`;
  document.getElementById('modalGeneric').classList.add('active');
};

window.startBoss = function(cId) {
  cId = cId || window.gameState.currentChallenge;                     // Compatibilidad con llamadas antiguas
  const b = bossData[cId];
  window.gameState.currentSubExercise = 'BOSS';
  document.getElementById('challengeTitle').textContent = b.title;
  document.getElementById('challengeDesc').textContent = b.descShort;
  document.getElementById('npcDialogue').innerHTML = `
    <div class="npc-dialogue">
      <div class="npc-scene">
        <div class="npc-location">${b.introTime}</div>
        <div class="npc-message">
          <span class="npc-avatar" style="font-size:48px;">👹</span>
          <div class="npc-bubble" style="border-color:rgba(239,68,68,0.5);">
            <div class="npc-name" style="color:var(--danger);">${b.bossName}</div>
            <p>${b.battleCry}</p>
          </div>
        </div>
      </div>
    </div>`;
  document.getElementById('sqlEditor').value = '-- Escribe tu consulta BOSS aquí\n';
  document.getElementById('results').innerHTML = '<strong>📊 Resultados</strong><p style="color:var(--muted);margin-top:10px;">Ejecuta tu consulta...</p>';
  window.gameState.attempts = 0; updateAttemptCounter();
};

function checkBossSolution(userQuery, results) {
  const cId = window.gameState.currentChallenge;
  const b = bossData[cId];
  const u = normalize(userQuery);
  // Evaluar cada regla: al menos un token de 'any' debe estar (y 'extra' si existe)
  const failed = b.checks.filter(c => {
    const anyOk = c.any.some(tok => u.includes(tok));
    const extraOk = !c.extra || u.includes(c.extra);
    return !(anyOk && extraOk);
  });
  const rowsOk = b.allowNoRows ? true : (results && results[0] && results[0].values.length > 0 && results[0].values.length <= b.maxRows);
  if (failed.length === 0 && rowsOk) {
    completeBoss(cId);
  } else {
    sounds.error(); window.gameState.attempts++; updateAttemptCounter();
    let hint = failed.length ? 'Verifica: ' + failed.map(c => c.hint).join(', ') : 'Revisa que la consulta regrese filas (y no más de ' + b.maxRows + ')';
    alert(hint);
  }
}

function completeBoss(cId) {
  const b = bossData[cId];
  sounds.success();
  window.gameState.xp += b.xp; window.gameState.coins += b.coins;     // Recompensas del módulo
  b.badges.forEach(bid => { if (!window.gameState.unlockedBadges.includes(bid)) window.gameState.unlockedBadges.push(bid); });
  if (b.newRank) window.gameState.rank = b.newRank;                    // Ascenso forzado solo si el módulo lo define
  createCoinRain(b.coins); saveGameState();
  const badgeLines = b.victoryBadgeLines.map(l => `<div style="font-size:18px;margin:10px 0;">${l}</div>`).join('');
  const content = document.getElementById('modalGenericContent');
  content.innerHTML = `
    <div style="text-align:center;">
      <div style="font-size:80px;margin-bottom:20px;">👑</div>
      <h2 style="color:var(--accent);margin-bottom:15px;">${b.victoryTitle}</h2>
      <div style="background:rgba(0,217,255,0.08);border:1px solid var(--primary);border-radius:12px;padding:20px;margin:15px 0;text-align:left;">
        <p style="font-style:italic;line-height:1.7;font-size:15px;">${b.victoryText}</p>
        <p style="color:var(--primary);font-weight:bold;margin-top:10px;">${b.victoryNPC}</p>
      </div>
      <div style="background:linear-gradient(135deg,rgba(0,217,255,0.2),rgba(124,58,237,0.2));padding:25px;border-radius:12px;margin:20px 0;border:2px solid var(--accent);">
        <div style="font-size:20px;font-weight:bold;margin-bottom:15px;">${b.victoryRewardsTitle}</div>
        <div style="font-size:28px;margin:10px 0;">⭐ +${b.xp} XP</div>
        <div style="font-size:28px;margin:10px 0;">🪙 +${b.coins.toLocaleString()} VC</div>
        ${badgeLines}
        ${b.newRank ? `<div style="font-size:16px;margin:15px 0;color:var(--accent);">📈 Ascenso de Rango: ${b.newRank}</div>` : ''}
      </div>
      <p style="color:var(--muted);margin:15px 0;">${b.moduleLabel}</p>
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

// ============================================
// PANEL ADMIN (solo usuario Admin — pruebas y gestión de usuarios)
// ============================================
window.isAdminUser = function() {
  try {
    const users = JSON.parse(localStorage.getItem('nexusSQL_users') || '[]');
    const u = users[window.currentUserIndex];
    if (!u) return false;
    return u.id === 'admin_master' || u.isAdmin === true || (u.playerName || '').toLowerCase() === 'admin';
  } catch(e) { return false; }
};

// Botón admin fijo en el header — se muestra solo si el admin está logueado
function ensureAdminFab() {
  const btn = document.getElementById('adminHeaderBtn');
  if (!btn) return;
  const should = window.isAdminUser() && !document.getElementById('authScreen');
  btn.style.display = should ? 'inline-flex' : 'none';
}
setInterval(ensureAdminFab, 800);
document.addEventListener('DOMContentLoaded', ensureAdminFab);

window.adminOpenPanel = function(tab) {
  if (!window.isAdminUser()) return;
  tab = tab || 'pruebas';
  const content = document.getElementById('modalGenericContent');
  const tabBtn = (id, label) => `<button onclick="adminOpenPanel('${id}')" style="flex:1;padding:10px;border:none;cursor:pointer;font-family:var(--font-display);font-size:12px;font-weight:700;border-radius:8px 8px 0 0;background:${tab===id?'var(--primary)':'transparent'};color:${tab===id?'var(--bg)':'var(--muted)'};">${label}</button>`;
  let body = '';
  if (tab === 'pruebas') {
    const btn = (fn, icon, label, desc) => `
      <button onclick="${fn}" style="display:block;width:100%;text-align:left;padding:12px 14px;margin-bottom:8px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;cursor:pointer;color:var(--text-hi);">
        <strong>${icon} ${label}</strong><br><span style="font-size:11px;color:var(--muted);">${desc}</span>
      </button>`;
    body = `
      ${btn('adminAddCoins(1000)', '🪙', '+1,000 monedas', 'Para probar la tienda sin jugar horas')}
      ${btn('adminAddXP(500)', '⚡', '+500 XP', 'Para probar rangos y avatares por nivel')}
      ${btn('adminCompleteModule()', '✅', 'Completar módulo actual', 'Marca los 10 ejercicios como hechos → prueba recompensas y desbloqueo')}
      ${btn('adminJumpBoss()', '👹', 'Ir al BOSS del módulo actual', 'Abre la pelea final directamente')}
      ${btn('adminForceTrivia()', '🎲', 'Forzar trivia del módulo actual', 'Reabre la trivia aunque ya se haya contestado')}
      ${btn('adminResetSelf()', '🧨', 'Resetear MI progreso (Admin)', 'Vuelve al Admin a cero — no toca a otros usuarios')}
    `;
  } else {
    body = `<div id="adminUserList" style="min-height:80px;"><p style="color:var(--muted);text-align:center;padding:20px;">📡 Cargando usuarios de la nube...</p></div>`;
    setTimeout(() => adminLoadUsers(), 50);
  }
  content.innerHTML = `
    <h2 style="margin-bottom:12px;">🛠️ Panel de Administración</h2>
    <div style="display:flex;gap:6px;border-bottom:1px solid var(--border);margin-bottom:14px;">
      ${tabBtn('pruebas', '🧪 PRUEBAS')}
      ${tabBtn('usuarios', '👥 USUARIOS')}
    </div>
    ${body}
    <button onclick="closeModal('modalGeneric')" style="width:100%;padding:10px;margin-top:6px;background:transparent;border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;">Cerrar</button>`;
  document.getElementById('modalGeneric').classList.add('active');
};

window.adminAddCoins = function(n) {
  window.gameState.coins += n;
  saveGameState(); updateStats();
  if (typeof confetti === 'function') confetti({ particleCount: 40, spread: 60 });
};

window.adminAddXP = function(n) {
  window.gameState.xp += n;
  saveGameState(); updateStats(); if (typeof updateProgressBar === 'function') updateProgressBar();
};

window.adminCompleteModule = function() {
  const cId = window.gameState.currentChallenge;
  const ch = challenges[cId];
  if (!ch) return;
  window.gameState.completedSubExercises[cId] = ch.subExercises.map(s => s.id);
  if (!window.gameState.completedChallenges.includes(cId)) window.gameState.completedChallenges.push(cId);
  window.gameState.xp += ch.xp; window.gameState.coins += ch.coins;
  saveGameState(); renderChallenges(); updateStats();
  if (typeof updateProgressBar === 'function') updateProgressBar();
  if (typeof updateSkillBars === 'function') updateSkillBars();
  closeModal('modalGeneric');
};

window.adminJumpBoss = function() {
  closeModal('modalGeneric');
  const cId = window.gameState.currentChallenge;
  if (challenges[cId]?.hasBoss && typeof window.showBossFight === 'function') window.showBossFight(cId);
};

window.adminForceTrivia = function() {
  closeModal('modalGeneric');
  window.gameState.triviaAnswered = false;
  const cId = window.gameState.currentChallenge;
  if (challenges[cId]?.hasTrivia && typeof showTrivia === 'function') showTrivia(cId);
};

window.adminResetSelf = function() {
  if (!confirm('¿Seguro? Esto borra TODO el progreso del usuario Admin.')) return;
  Object.assign(window.gameState, {
    xp: 0, coins: 0, streak: 0,
    currentChallenge: 1, currentSubExercise: 1, currentDay: 1,
    completedChallenges: [], completedSubExercises: {},
    unlockedBadges: [], unlockedItems: [], equippedItems: {},
    diary: [], skills: { SELECT: 0, WHERE: 0, ORDER: 0, ADVANCED: 0 },
    expandedChallenges: [], tutorialsSeen: [], triviaAnswered: false
  });
  saveGameState(); renderChallenges(); updateStats();
  if (typeof updateProgressBar === 'function') updateProgressBar();
  if (typeof updateSkillBars === 'function') updateSkillBars();
  closeModal('modalGeneric');
};

// ── Gestión de usuarios (nube) ──
window.adminLoadUsers = async function() {
  const box = document.getElementById('adminUserList');
  if (!box) return;
  await window.waitForFirebase(3000);
  if (!window._loadUserList) { box.innerHTML = '<p style="color:var(--danger);">Sin conexión a Firebase.</p>'; return; }
  const list = await window._loadUserList();
  if (!list.length) { box.innerHTML = '<p style="color:var(--muted);text-align:center;padding:20px;">No hay usuarios en la nube todavía.</p>'; return; }
  const rows = await Promise.all(list.map(async u => {
    const gs = window._loadUserById ? await window._loadUserById(u.id) : null;
    const mods = gs ? Object.keys(gs.completedSubExercises || {}).filter(k => (gs.completedSubExercises[k] || []).length === 10).length : 0;
    return `
      <div style="padding:10px 12px;margin-bottom:8px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="color:var(--primary);">${u.nick || '(sin nombre)'}</strong>
          <span style="font-size:11px;color:var(--muted);">${u.id}</span>
        </div>
        <div style="font-size:12px;color:var(--muted);margin:4px 0;">
          ⚡ ${gs?.xp ?? '?'} XP · 🪙 ${gs?.coins ?? '?'} · 📦 ${mods}/11 módulos · Última visita: ${gs?.lastVisit ? gs.lastVisit.slice(0,10) : '—'}
        </div>
        <div style="display:flex;gap:8px;">
          <button onclick="adminDoResetPin('${u.id}')" style="flex:1;padding:7px;background:transparent;border:1px solid var(--primary);border-radius:8px;color:var(--primary);cursor:pointer;font-size:11px;">🔑 Resetear PIN</button>
          <button onclick="adminDoDeleteUser('${u.id}','${(u.nick||'').replace(/'/g,'')}')" style="flex:1;padding:7px;background:transparent;border:1px solid var(--danger,#ff1744);border-radius:8px;color:var(--danger,#ff1744);cursor:pointer;font-size:11px;">🗑️ Borrar</button>
        </div>
      </div>`;
  }));
  box.innerHTML = rows.join('');
};

window.adminDoResetPin = async function(userId) {
  if (!confirm('El PIN quedará vacío: la próxima vez que ese usuario entre, creará un PIN nuevo. ¿Continuar?')) return;
  const ok = await window._adminResetPin(userId);
  alert(ok ? '✅ PIN reseteado.' : '❌ No se pudo resetear.');
  adminLoadUsers();
};

window.adminDoDeleteUser = async function(userId, nick) {
  if (!confirm('⚠️ Esto BORRA PERMANENTEMENTE a "' + nick + '" y todo su progreso de la nube. No se puede deshacer. ¿Continuar?')) return;
  if (!confirm('Última confirmación: ¿borrar a "' + nick + '"?')) return;
  const ok = await window._adminDeleteUser(userId);
  alert(ok ? '✅ Usuario borrado.' : '❌ No se pudo borrar.');
  adminLoadUsers();
};
