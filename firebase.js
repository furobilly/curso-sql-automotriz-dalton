// ============================================
// NEXUS SQL — Firebase Integration v1.0
// NexCorp Industries / AXIOM Motors
// ============================================

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCfjXpcAhhVy47Pz1VRM5pImuunqq4WZtI",
  authDomain: "nexus-sql-nexcorp.firebaseapp.com",
  projectId: "nexus-sql-nexcorp",
  storageBucket: "nexus-sql-nexcorp.firebasestorage.app",
  messagingSenderId: "104357504380",
  appId: "1:104357504380:web:fb29dd4410a82314d630f9"
};

// ============================================
// PIN DE 4 IMÁGENES — Iconos del mundo NEXUS
// ============================================
const pinIcons = [
  { id: 'bolt',    emoji: '⚡', label: 'Rayo' },
  { id: 'shield',  emoji: '🛡️', label: 'Escudo' },
  { id: 'rocket',  emoji: '🚀', label: 'Cohete' },
  { id: 'eye',     emoji: '👁️', label: 'Ojo' },
  { id: 'key',     emoji: '🔑', label: 'Llave' },
  { id: 'flame',   emoji: '🔥', label: 'Fuego' },
  { id: 'star',    emoji: '⭐', label: 'Estrella' },
  { id: 'lock',    emoji: '🔒', label: 'Candado' },
  { id: 'cpu',     emoji: '💻', label: 'PC' },
  { id: 'data',    emoji: '📊', label: 'Datos' },
  { id: 'signal',  emoji: '📡', label: 'Señal' },
  { id: 'chip',    emoji: '🔮', label: 'Cristal' }
];

// ============================================
// INICIALIZACIÓN FIREBASE (module)
// ============================================
(function() {
  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = `
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import {
      getFirestore, doc, setDoc, getDoc, getDocs, collection
    } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

    const app = initializeApp(${JSON.stringify(firebaseConfig)});
    const db  = getFirestore(app);

    // ── Guardar progreso del usuario ──
    window._saveProgress = async (userId, gameState) => {
      try {
        const ref = doc(db, 'nexus_usuarios', userId);
        const payload = {
          gameState: JSON.stringify(gameState),
          nick: gameState.playerName,
          updatedAt: Date.now()
        };
        await setDoc(ref, payload, { merge: true });
        return true;
      } catch(e) { console.warn('Firebase save error:', e); return false; }
    };

    // ── Cargar progreso del usuario ──
    window._loadProgress = async (userId) => {
      try {
        const snap = await getDoc(doc(db, 'nexus_usuarios', userId));
        if (snap.exists() && snap.data().gameState)
          return JSON.parse(snap.data().gameState);
        return null;
      } catch(e) { console.warn('Firebase load error:', e); return null; }
    };

    // ── Guardar lista de usuarios (para login en otro dispositivo) ──
    window._saveUserList = async (users) => {
      try {
        await setDoc(doc(db, 'nexus_meta', 'users'), {
          list: JSON.stringify(users.map(u => ({
            id: u.id, nick: u.playerName, pinHash: u.pinHash, avatar: u.avatar
          })))
        }, { merge: true });
      } catch(e) { console.warn('Firebase userlist error:', e); }
    };

    // ── Buscar usuario por nick (dispositivo nuevo) ──
    window._findUserByNick = async (nick) => {
      try {
        const snap = await getDoc(doc(db, 'nexus_meta', 'users'));
        if (!snap.exists()) return null;
        const list = JSON.parse(snap.data().list || '[]');
        return list.find(u => u.nick?.toLowerCase() === nick.toLowerCase()) || null;
      } catch(e) { return null; }
    };

    // ── Cargar perfil completo por ID ──
    window._loadUserById = async (userId) => {
      try {
        const snap = await getDoc(doc(db, 'nexus_usuarios', userId));
        if (snap.exists() && snap.data().gameState)
          return JSON.parse(snap.data().gameState);
        return null;
      } catch(e) { return null; }
    };

    // Señal: Firebase listo
    window._firebaseReady = true;
    document.dispatchEvent(new Event('firebaseReady'));
    console.log('✅ Firebase NEXUS conectado');
  `;
  document.head.appendChild(script);
})();

// ============================================
// ESPERAR FIREBASE
// ============================================
window.waitForFirebase = function(ms = 5000) {
  if (window._firebaseReady) return Promise.resolve(true);
  return new Promise(resolve => {
    const start = Date.now();
    const check = setInterval(() => {
      if (window._firebaseReady) { clearInterval(check); resolve(true); }
      else if (Date.now() - start > ms) { clearInterval(check); resolve(false); }
    }, 100);
  });
};

// ============================================
// HASH DEL PIN (seguridad)
// ============================================
window.hashPin = async function(pinArray) {
  const pinStr = pinArray.join('-') + '_nexus_salt_2024';
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pinStr));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 20);
};

// ============================================
// PANTALLA DE LOGIN / REGISTRO
// ============================================
window.showAuthScreen = function() {
  const existing = document.getElementById('authScreen');
  if (existing) existing.remove();

  const screen = document.createElement('div');
  screen.id = 'authScreen';
  screen.style.cssText = `
    position:fixed;inset:0;background:var(--bg);z-index:2000;
    display:flex;align-items:center;justify-content:center;padding:20px;`;

  screen.innerHTML = `
    <div style="background:var(--card);border:1px solid var(--border-hi);border-radius:16px;
                padding:36px;max-width:480px;width:100%;text-align:center;
                box-shadow:0 0 60px rgba(255,160,0,0.15);position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;height:2px;
                  background:linear-gradient(90deg,transparent,var(--primary),var(--secondary),transparent);"></div>

      <div style="font-size:48px;margin-bottom:12px;filter:drop-shadow(0 0 16px var(--primary));">⚡</div>
      <h2 style="font-family:var(--font-display);font-size:20px;letter-spacing:3px;
                 color:var(--primary);margin-bottom:6px;">NEXUS SQL</h2>
      <p style="font-size:11px;letter-spacing:2px;color:var(--muted);margin-bottom:28px;text-transform:uppercase;">
        Identificación de Operador
      </p>

      <!-- Tabs -->
      <div style="display:flex;gap:0;margin-bottom:24px;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
        <button id="tabLogin" onclick="showLoginTab()" style="flex:1;padding:10px;font-family:var(--font-display);
          font-size:11px;letter-spacing:1px;background:var(--primary);color:var(--bg);border:none;cursor:pointer;">
          ENTRAR
        </button>
        <button id="tabRegister" onclick="showRegisterTab()" style="flex:1;padding:10px;font-family:var(--font-display);
          font-size:11px;letter-spacing:1px;background:transparent;color:var(--muted);border:none;cursor:pointer;">
          NUEVO OPERADOR
        </button>
      </div>

      <div id="authContent"></div>
    </div>`;

  document.body.appendChild(screen);

  // Ver si hay usuarios locales
  const localUsers = JSON.parse(localStorage.getItem('nexusSQL_users') || '[]');
  if (localUsers.length > 0) {
    showLocalUsers(localUsers);
  } else {
    showLoginTab();
  }
};

// ── Mostrar usuarios guardados localmente ──
window.showLocalUsers = function(users) {
  const content = document.getElementById('authContent');
  const avatarIcons = ['🎮', '💼', '🧘'];
  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <p style="font-size:13px;color:var(--muted);">Selecciona tu operador:</p>
      <button onclick="confirmClearAll()"
        style="font-size:11px;padding:4px 10px;background:rgba(255,23,68,0.1);
               border:1px solid rgba(255,23,68,0.3);border-radius:6px;color:var(--danger);cursor:pointer;">
        🗑️ Limpiar todo
      </button>
    </div>`;

  users.forEach((u, i) => {
    html += `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;margin:6px 0;
                  background:var(--bg2);border:1px solid var(--border);border-radius:10px;">
        <div onclick="selectLocalUser(${i})" style="display:flex;align-items:center;gap:12px;flex:1;cursor:pointer;"
             onmouseover="this.parentNode.style.borderColor='var(--primary)'"
             onmouseout="this.parentNode.style.borderColor='var(--border)'">
          <span style="font-size:32px;">${avatarIcons[u.avatar || 0]}</span>
          <div style="text-align:left;">
            <div style="font-family:var(--font-display);font-size:13px;color:var(--text-hi);">${u.playerName}</div>
            <div style="font-size:11px;color:var(--muted);">⭐ ${u.xp || 0} XP · 🪙 ${u.coins || 0} VC</div>
          </div>
        </div>
        <button onclick="deleteLocalUser(${i})"
          style="padding:6px 8px;background:rgba(255,23,68,0.1);border:1px solid rgba(255,23,68,0.2);
                 border-radius:6px;color:var(--danger);cursor:pointer;font-size:14px;flex-shrink:0;"
          title="Eliminar usuario">🗑️</button>
      </div>`;
  });

  html += `
    <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border);">
      <button onclick="showLoginTab()" style="width:100%;padding:10px;background:transparent;
        border:1px solid var(--border);border-radius:8px;color:var(--muted);font-size:13px;cursor:pointer;">
        🔍 Buscar operador por nombre →
      </button>
    </div>`;

  content.innerHTML = html;
};

// ── Borrar usuario local ──
window.deleteLocalUser = function(index) {
  if (!confirm('¿Eliminar este operador localmente? Su progreso en la nube se mantiene.')) return;
  const localUsers = JSON.parse(localStorage.getItem('nexusSQL_users') || '[]');
  localUsers.splice(index, 1);
  localStorage.setItem('nexusSQL_users', JSON.stringify(localUsers));
  if (localUsers.length > 0) {
    showLocalUsers(localUsers);
  } else {
    showLoginTab();
  }
};

// ── Borrar todos los usuarios locales ──
window.confirmClearAll = function() {
  if (!confirm('¿Limpiar TODOS los operadores locales?\n\nSu progreso en Firebase se mantiene.\nPodrás recuperarlos con tu nombre.')) return;
  localStorage.removeItem('nexusSQL_users');
  localStorage.removeItem('nexusSQL_currentUser');
  window.userProfiles = [];
  window.currentUserIndex = -1;
  showLoginTab();
};

// ── Tab: Entrar ──
window.showLoginTab = function() {
  document.getElementById('tabLogin').style.background = 'var(--primary)';
  document.getElementById('tabLogin').style.color = 'var(--bg)';
  document.getElementById('tabRegister').style.background = 'transparent';
  document.getElementById('tabRegister').style.color = 'var(--muted)';

  document.getElementById('authContent').innerHTML = `
    <div>
      <input id="loginNick" type="text" placeholder="Tu nombre de operador"
             style="width:100%;padding:13px 16px;background:var(--bg2);
                    border:1px solid var(--border);border-radius:8px;
                    color:var(--text-hi);font-family:var(--font-body);font-size:15px;
                    outline:none;margin-bottom:12px;"
             onkeypress="if(event.key==='Enter') doLogin()"
             onfocus="this.style.borderColor='var(--primary)'"
             onblur="this.style.borderColor='var(--border)'"/>
      <button onclick="doLogin()" style="width:100%;padding:13px;background:var(--primary);
        border:none;border-radius:8px;font-family:var(--font-display);font-size:13px;
        letter-spacing:2px;color:var(--bg);cursor:pointer;font-weight:700;">
        BUSCAR OPERADOR
      </button>
      <p style="font-size:12px;color:var(--muted);margin-top:12px;">
        ¿Primera vez aquí? → <span onclick="showRegisterTab()" style="color:var(--primary);cursor:pointer;">Crear cuenta</span>
      </p>
    </div>`;
};

// ── Tab: Registro ──
window.showRegisterTab = function() {
  document.getElementById('tabRegister').style.background = 'var(--primary)';
  document.getElementById('tabRegister').style.color = 'var(--bg)';
  document.getElementById('tabLogin').style.background = 'transparent';
  document.getElementById('tabLogin').style.color = 'var(--muted)';

  document.getElementById('authContent').innerHTML = `
    <div>
      <input id="regName" type="text" placeholder="Tu nombre (3-15 caracteres)" maxlength="15"
             style="width:100%;padding:13px 16px;background:var(--bg2);
                    border:1px solid var(--border);border-radius:8px;
                    color:var(--text-hi);font-family:var(--font-body);font-size:15px;
                    outline:none;margin-bottom:12px;"
             onfocus="this.style.borderColor='var(--primary)'"
             onblur="this.style.borderColor='var(--border)'"/>
      <button onclick="startPinSetup('register')" style="width:100%;padding:13px;background:var(--primary);
        border:none;border-radius:8px;font-family:var(--font-display);font-size:13px;
        letter-spacing:2px;color:var(--bg);cursor:pointer;font-weight:700;">
        CONTINUAR → CREAR PIN
      </button>
    </div>`;
};

// ── Login: buscar usuario ──
window.doLogin = async function() {
  const nick = document.getElementById('loginNick')?.value?.trim();
  if (!nick) return;

  const content = document.getElementById('authContent');
  content.innerHTML = `<p style="color:var(--muted);text-align:center;padding:20px;">🔍 Buscando operador...</p>`;

  // Buscar local primero
  const localUsers = JSON.parse(localStorage.getItem('nexusSQL_users') || '[]');
  const localMatch = localUsers.findIndex(u => u.playerName?.toLowerCase() === nick.toLowerCase());

  if (localMatch >= 0) {
    showPinEntry(localMatch, 'local');
    return;
  }

  // Buscar en Firebase
  await waitForFirebase();
  const cloudUser = await window._findUserByNick(nick);
  if (cloudUser) {
    showPinEntry(null, 'cloud', cloudUser);
  } else {
    content.innerHTML = `
      <div style="text-align:center;padding:10px;">
        <p style="color:var(--danger);margin-bottom:16px;">Operador "${nick}" no encontrado.</p>
        <button onclick="showLoginTab()" style="padding:10px 20px;background:var(--primary);
          border:none;border-radius:8px;font-family:var(--font-display);font-size:12px;
          color:var(--bg);cursor:pointer;">Intentar de nuevo</button>
        <p style="font-size:12px;color:var(--muted);margin-top:12px;">
          ¿Eres nuevo? <span onclick="showRegisterTab()" style="color:var(--primary);cursor:pointer;">Crear cuenta</span>
        </p>
      </div>`;
  }
};

// ── Seleccionar usuario local ──
window.selectLocalUser = function(index) {
  showPinEntry(index, 'local');
};

// ── Mostrar PIN de entrada ──
window.showPinEntry = function(localIndex, source, cloudUser) {
  const content = document.getElementById('authContent');
  window._pendingAuth = { localIndex, source, cloudUser, enteredPin: [] };

  const name = source === 'local'
    ? JSON.parse(localStorage.getItem('nexusSQL_users') || '[]')[localIndex]?.playerName
    : cloudUser?.nick;

  content.innerHTML = `
    <div>
      <p style="font-size:13px;color:var(--muted);margin-bottom:6px;">Bienvenido, <strong style="color:var(--primary)">${name}</strong></p>
      <p style="font-size:12px;color:var(--muted);margin-bottom:16px;">Selecciona tus 4 iconos PIN en orden:</p>

      <div id="pinDisplay" style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;">
        ${[0,1,2,3].map(i => `
          <div style="width:44px;height:44px;border-radius:8px;border:1px solid var(--border);
                      background:var(--bg2);display:flex;align-items:center;justify-content:center;
                      font-size:22px;" id="pinSlot${i}">·</div>`).join('')}
      </div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;">
        ${pinIcons.map(icon => `
          <button onclick="enterPinIcon('${icon.id}')"
                  style="padding:10px 6px;background:var(--bg2);border:1px solid var(--border);
                         border-radius:8px;cursor:pointer;font-size:24px;transition:all 0.15s;"
                  onmouseover="this.style.borderColor='var(--primary)';this.style.transform='scale(1.1)'"
                  onmouseout="this.style.borderColor='var(--border)';this.style.transform='scale(1)'"
                  title="${icon.label}">
            ${icon.emoji}
          </button>`).join('')}
      </div>

      <button onclick="clearPin()" style="width:100%;padding:8px;background:transparent;
        border:1px solid var(--border);border-radius:8px;color:var(--muted);font-size:12px;cursor:pointer;margin-bottom:8px;">
        ← Borrar PIN
      </button>
      <button onclick="window.showAuthScreen()" style="width:100%;padding:8px;background:transparent;
        border:none;border-radius:8px;color:var(--muted);font-size:12px;cursor:pointer;opacity:0.6;">
        ↩ Regresar a usuarios
      </button>
    </div>`;
};

// ── Ingresar icono al PIN ──
window.enterPinIcon = async function(iconId) {
  const auth = window._pendingAuth;
  if (!auth || auth.enteredPin.length >= 4) return;

  auth.enteredPin.push(iconId);
  const icon = pinIcons.find(i => i.id === iconId);
  const slot = document.getElementById('pinSlot' + (auth.enteredPin.length - 1));
  if (slot) slot.textContent = icon.emoji;

  if (auth.enteredPin.length === 4) {
    await verifyPin();
  }
};

// ── Limpiar PIN ──
window.clearPin = function() {
  const auth = window._pendingAuth;
  if (!auth) return;
  auth.enteredPin = [];
  [0,1,2,3].forEach(i => {
    const slot = document.getElementById('pinSlot' + i);
    if (slot) slot.textContent = '·';
  });
};

// ── Verificar PIN ──
window.verifyPin = async function() {
  const auth = window._pendingAuth;
  const enteredHash = await window.hashPin(auth.enteredPin);

  let user = null;
  let localIndex = auth.localIndex;

  if (auth.source === 'local') {
    const localUsers = JSON.parse(localStorage.getItem('nexusSQL_users') || '[]');
    user = localUsers[localIndex];
  } else {
    user = auth.cloudUser;
  }

  if (!user.pinHash) {
    // Usuario antiguo sin PIN — configurar PIN ahora
    await setPinForUser(auth, enteredHash, user);
    return;
  }

  if (enteredHash === user.pinHash) {
    // ✅ PIN correcto
    await loginSuccess(auth, user, localIndex);
  } else {
    // ❌ PIN incorrecto
    clearPin();
    const content = document.getElementById('authContent');
    const errMsg = document.createElement('p');
    errMsg.style.cssText = 'color:var(--danger);font-size:13px;text-align:center;margin-bottom:8px;';
    errMsg.textContent = '❌ PIN incorrecto. Intenta de nuevo.';
    const pinDisplay = document.getElementById('pinDisplay');
    if (pinDisplay) pinDisplay.parentNode.insertBefore(errMsg, pinDisplay);
    setTimeout(() => errMsg.remove(), 2000);
  }
};

// ── Configurar PIN para usuario existente sin PIN ──
async function setPinForUser(auth, hash, user) {
  const localUsers = JSON.parse(localStorage.getItem('nexusSQL_users') || '[]');
  if (auth.localIndex >= 0) {
    localUsers[auth.localIndex].pinHash = hash;
    localStorage.setItem('nexusSQL_users', JSON.stringify(localUsers));
  }
  await loginSuccess(auth, user, auth.localIndex);
}

// ── Login exitoso ──
window.loginSuccess = async function(auth, user, localIndex) {
  const content = document.getElementById('authContent');
  content.innerHTML = `<p style="color:var(--secondary);text-align:center;padding:20px;">✅ Verificando...</p>`;

  await waitForFirebase();

  // Si viene de la nube, guardar localmente
  if (auth.source === 'cloud' && auth.cloudUser) {
    const cloudState = await window._loadUserById(auth.cloudUser.id);
    if (cloudState) {
      const localUsers = JSON.parse(localStorage.getItem('nexusSQL_users') || '[]');
      const existingIdx = localUsers.findIndex(u => u.id === auth.cloudUser.id);
      if (existingIdx >= 0) {
        localUsers[existingIdx] = Object.assign(localUsers[existingIdx], cloudState, { pinHash: auth.cloudUser.pinHash });
        localStorage.setItem('nexusSQL_users', JSON.stringify(localUsers));
        localIndex = existingIdx;
      } else {
        cloudState.pinHash = auth.cloudUser.pinHash;
        localUsers.push(cloudState);
        localStorage.setItem('nexusSQL_users', JSON.stringify(localUsers));
        localIndex = localUsers.length - 1;
      }
      window.currentUserIndex = localIndex;
      localStorage.setItem('nexusSQL_currentUser', localIndex);
    }
  } else {
    window.currentUserIndex = localIndex;
    localStorage.setItem('nexusSQL_currentUser', localIndex);
  }

  document.getElementById('authScreen')?.remove();
  window.switchUser(window.currentUserIndex);
};

// ── Setup PIN para nuevo usuario ──
window.startPinSetup = function(mode) {
  const nameInput = document.getElementById('regName');
  const name = nameInput?.value?.trim();

  if (!name || name.length < 3) {
    nameInput.style.borderColor = 'var(--danger)';
    return;
  }

  window._newUserName = name;
  window._pinSetupPin = [];

  const content = document.getElementById('authContent');
  content.innerHTML = `
    <div>
      <p style="font-size:13px;color:var(--muted);margin-bottom:6px;">Crea tu PIN visual, <strong style="color:var(--primary)">${name}</strong></p>
      <p style="font-size:12px;color:var(--muted);margin-bottom:16px;">Elige 4 iconos en orden — los necesitarás para entrar:</p>

      <div id="pinSetupDisplay" style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;">
        ${[0,1,2,3].map(i => `
          <div style="width:44px;height:44px;border-radius:8px;border:1px solid var(--border);
                      background:var(--bg2);display:flex;align-items:center;justify-content:center;
                      font-size:22px;" id="setupSlot${i}">·</div>`).join('')}
      </div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;">
        ${pinIcons.map(icon => `
          <button onclick="addSetupPin('${icon.id}')"
                  style="padding:10px 6px;background:var(--bg2);border:1px solid var(--border);
                         border-radius:8px;cursor:pointer;font-size:24px;transition:all 0.15s;"
                  onmouseover="this.style.borderColor='var(--primary)';this.style.transform='scale(1.1)'"
                  onmouseout="this.style.borderColor='var(--border)';this.style.transform='scale(1)'"
                  title="${icon.label}">
            ${icon.emoji}
          </button>`).join('')}
      </div>

      <button onclick="clearSetupPin()" style="width:100%;padding:8px;background:transparent;
        border:1px solid var(--border);border-radius:8px;color:var(--muted);font-size:12px;cursor:pointer;">
        ← Borrar
      </button>
    </div>`;
};

window.addSetupPin = async function(iconId) {
  if (window._pinSetupPin.length >= 4) return;
  window._pinSetupPin.push(iconId);
  const icon = pinIcons.find(i => i.id === iconId);
  const slot = document.getElementById('setupSlot' + (window._pinSetupPin.length - 1));
  if (slot) slot.textContent = icon.emoji;

  if (window._pinSetupPin.length === 4) {
    const hash = await window.hashPin(window._pinSetupPin);
    await createNewUser(window._newUserName, hash);
  }
};

window.clearSetupPin = function() {
  window._pinSetupPin = [];
  [0,1,2,3].forEach(i => {
    const slot = document.getElementById('setupSlot' + i);
    if (slot) slot.textContent = '·';
  });
};

// ── Crear nuevo usuario ──
window.createNewUser = async function(name, pinHash) {
  const content = document.getElementById('authContent');
  content.innerHTML = `<p style="color:var(--secondary);text-align:center;padding:20px;">⚡ Creando operador...</p>`;

  const newId = 'nx_' + Date.now();
  const localUsers = JSON.parse(localStorage.getItem('nexusSQL_users') || '[]');

  // Gamestate inicial (el onboarding seguirá después)
  const newUser = {
    id: newId,
    playerName: name,
    pinHash: pinHash,
    avatar: 0,
    xp: 0, coins: 0, streak: 0,
    lastVisit: new Date().toISOString(),
    currentChallenge: 1, currentSubExercise: 1, currentDay: 1,
    completedChallenges: [], completedSubExercises: {},
    unlockedBadges: [], unlockedItems: [], equippedItems: {},
    reputation: { ana: 0, roberto: 0 },
    diary: [], skills: { SELECT: 0, WHERE: 0, ORDER: 0, ADVANCED: 0 },
    expandedChallenges: [], tutorialsSeen: [],
    theme: 'dark', soundEnabled: true, triviaAnswered: false,
    rank: 'Analista JR', kitBenefits: null, hintsRemaining: 0, attemptLimit: 3,
    isNewUser: true
  };

  localUsers.push(newUser);
  localStorage.setItem('nexusSQL_users', JSON.stringify(localUsers));
  window.currentUserIndex = localUsers.length - 1;
  localStorage.setItem('nexusSQL_currentUser', window.currentUserIndex);

  // Guardar en Firebase
  await waitForFirebase();
  await window._saveProgress(newId, newUser);
  await window._saveUserList(localUsers);

  document.getElementById('authScreen')?.remove();

  // Iniciar onboarding desde el Kit (paso 3) — el nombre ya está capturado
  window.userProfiles = localUsers;
  window.gameState.playerName = name;
  window.currentUserIndex = localUsers.length - 1;
  document.getElementById('onboarding').classList.remove('hidden');
  if (typeof window.showOnboardingStep === 'function') {
    window.showOnboardingStep(3); // Directo al Kit de inicio
  }
};

// ============================================
// GUARDAR PROGRESO CON FIREBASE (hook)
// ============================================
window.saveProgressToCloud = async function() {
  const gs = window.gameState;
  if (!gs.playerName) return;

  const localUsers = JSON.parse(localStorage.getItem('nexusSQL_users') || '[]');
  const idx = window.currentUserIndex;
  if (idx < 0 || !localUsers[idx]) return;

  const userId = localUsers[idx].id || ('nx_' + idx);
  await waitForFirebase(2000);
  if (window._saveProgress) {
    window._saveProgress(userId, Object.assign({}, gs, { db: null }));
  }
  if (window._saveUserList) {
    window._saveUserList(localUsers);
  }
};
