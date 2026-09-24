// ── SISTEMA LOGIN / REGISTRAZIONE (SUPABASE) ──
(function() {
  // Configurazione Supabase
  const SUPABASE_URL = 'https://aysknebyyzljysxpsxdv.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_M1dPlowaVyeMJ1PXYl0uNw_Ha4GR_wZ';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  var MODE = 'login'; // 'login' | 'register'
  var currentUser = null;

  // ── Helpers ────────────────────────────────────────────────
  function getDisplayName(user) {
    if(!user) return 'Utente';
    return user.user_metadata?.username || user.email.split('@')[0];
  }

  // ── Inizializzazione UI ─────────────────────────────────────
  async function updateAuthUI() {
    var headerRight = document.querySelector('.header-right');
    if (!headerRight) return;

    // 1. RECUPERA I PREFERITI PRIMA DI TOCCARE IL DOM (RISOLVE IL BUG DEI DUPLICATI)
    var favs = currentUser ? await getFavs() : [];

    // 2. PULIZIA: Rimuoviamo TUTTI i vecchi bottoni e menu
    var oldElements = headerRight.querySelectorAll('.auth-btn, .user-menu-wrap');
    oldElements.forEach(function(el) { el.remove(); });

    if (currentUser) {
      var username = getDisplayName(currentUser);
      var initials = username.slice(0,2).toUpperCase();
      var wrap = document.createElement('div');
      wrap.className = 'user-menu-wrap';
      wrap.id = 'user-menu-wrap';
      
      // Costruisci lista preferiti
      var favsHTML = '';
      if (favs.length > 0) {
        favsHTML += '<div class="user-menu-divider"></div>';
        favsHTML += '<div class="user-menu-section">★ PREFERITI</div>';
        for (var fi = 0; fi < favs.length; fi++) {
          var fav = favs[fi];
          var favId   = (typeof fav === 'object') ? fav.id   : fav;
          var favName = (typeof fav === 'object') ? fav.name : fav.replace(/_/g,' ').replace(/\b\w/g, function(c){return c.toUpperCase();});
          favsHTML += '<a href="pilota.html?id=' + favId + '" class="user-menu-item user-menu-fav">' + favName + '</a>';
        }
      }
      
      wrap.innerHTML =
        '<button class="user-avatar-btn" id="user-avatar-btn" onclick="toggleUserMenu()" title="' + username + '">' + initials + '</button>' +
        '<div class="user-menu" id="user-menu">' +
          '<div class="user-menu-header">' +
            '<div class="user-menu-name">👋 ' + username + '</div>' +
            '<div class="user-menu-sub">' + favs.length + ' piloti preferiti</div>' +
          '</div>' +
          favsHTML +
          '<div class="user-menu-divider"></div>' +
          '<a href="piloti.html" class="user-menu-item">👤 Tutti i piloti</a>' +
          '<div class="user-menu-divider"></div>' +
          '<div class="user-menu-item logout" onclick="logoutUser()">⊘ Esci</div>' +
        '</div>';
        
      var themeBtn = headerRight.querySelector('#theme-toggle');
      if (themeBtn) headerRight.insertBefore(wrap, themeBtn);
      else headerRight.prepend(wrap);

      initFavStars(favs);
      showFavsSection(favs);

    } else {
      // Non loggato: mostra bottone "Accedi"
      var btn = document.createElement('button');
      btn.className = 'auth-btn';
      btn.textContent = '👤 Accedi';
      btn.onclick = openAuthModal;
      var themeBtn2 = headerRight.querySelector('#theme-toggle');
      if (themeBtn2) headerRight.insertBefore(btn, themeBtn2);
      else headerRight.prepend(btn);
      
      // Se non loggato, assicuriamoci che le stelle siano spente
      document.querySelectorAll('.fav-star').forEach(function(star) {
        star.classList.remove('active');
        star.title = 'Aggiungi ai preferiti';
      });
    }
  }

  // ── Modal Auth ──────────────────────────────────────────────
  window.openAuthModal = function() {
    MODE = 'login';
    var titleEl = document.getElementById('auth-title');
    if (titleEl) titleEl.innerHTML = 'Accedi a <span style="color:var(--red)">Moto2026</span>';
    document.getElementById('auth-submit-btn').textContent = 'Accedi';
    document.getElementById('auth-switch').innerHTML = 'Non hai un account? <a onclick="switchAuthMode()">Registrati</a>';
    
    document.getElementById('auth-confirm-wrap').style.display = 'none';
    var usernameWrap = document.getElementById('auth-username-wrap');
    if (usernameWrap) usernameWrap.style.display = 'none';
    
    document.getElementById('auth-error').style.display = 'none';
    document.getElementById('auth-email').value = '';
    document.getElementById('auth-password').value = '';
    document.getElementById('auth-overlay').classList.add('open');
    setTimeout(function(){ document.getElementById('auth-email').focus(); }, 100);
  };

  window.closeAuthModal = function() {
    document.getElementById('auth-overlay').classList.remove('open');
  };

  window.switchAuthMode = function() {
    MODE = MODE === 'login' ? 'register' : 'login';
    var isReg = MODE === 'register';
    document.getElementById('auth-title').innerHTML =
      (isReg ? 'Crea account <span style="color:var(--red)">Moto2026</span>'
             : 'Accedi a <span style="color:var(--red)">Moto2026</span>');
    document.getElementById('auth-submit-btn').textContent = isReg ? 'Crea account' : 'Accedi';
    document.getElementById('auth-switch').innerHTML = isReg
      ? 'Hai già un account? <a onclick="switchAuthMode()">Accedi</a>'
      : 'Non hai un account? <a onclick="switchAuthMode()">Registrati</a>';
      
    document.getElementById('auth-confirm-wrap').style.display = isReg ? 'block' : 'none';
    var usernameWrap = document.getElementById('auth-username-wrap');
    if (usernameWrap) usernameWrap.style.display = isReg ? 'block' : 'none';
    
    document.getElementById('auth-error').style.display = 'none';
  };

  function showError(msg) {
    var el = document.getElementById('auth-error');
    el.textContent = msg; el.style.display = 'block';
  }

    window.submitAuth = async function() {
    var email = document.getElementById('auth-email').value.trim();
    var password = document.getElementById('auth-password').value;
    if (!email || !password) { showError('Compila tutti i campi.'); return; }

    // ── CONTROLLO SICUREZZA PASSWORD ──
    // Richiede: almeno 8 caratteri, una maiuscola, un numero
    var passRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (MODE === 'register') {
      var username = document.getElementById('auth-username').value.trim();
      if (!username || username.length < 3) { showError('Inserisci un username di almeno 3 caratteri.'); return; }
      
      var confirm = document.getElementById('auth-confirm').value;
      if (password !== confirm) { showError('Le password non coincidono.'); return; }
      
      // Controllo regex della password
      if (!passRegex.test(password)) { 
        showError('La password deve avere almeno 8 caratteri, una maiuscola e un numero.'); 
        return; 
      }
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { username: username } } 
      });
      
      if (error) { 
        showError(traduciErroreSupabase(error.message)); 
        return; 
      }
      
      // Se non arriva una sessione, significa che Supabase richiede conferma email
      if (!data.session) {
        closeAuthModal();
        showToast('✅ Account creato! Controlla la tua email per confermare.');
        return;
      }
      
      closeAuthModal();
      showToast('✅ Account creato! Benvenuto, ' + username + '!');
    } else {
      // ── GESTIONE LOGIN CON EMAIL O USERNAME ──
      var isEmail = email.includes('@');
      var loginEmail = email;

      if (!isEmail) {
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_email_by_credentials', { 
              p_identifier: email, 
              p_password: password 
          });

        if (rpcError || !rpcData) {
          showError('Username o password errati.');
          return;
        }
        loginEmail = rpcData; 
      }

      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: loginEmail, 
        password: password 
      });
      
      if (error) { 
        showError(traduciErroreSupabase(error.message)); 
        return; 
      }
      
      closeAuthModal();
      showToast('✅ Bentornato, ' + getDisplayName(data.user) + '!');
    }
  };

  // ── FUNZIONE DI TRADUZIONE ──────────────────────────
  function traduciErroreSupabase(msg) {
    if (!msg) return 'Si è verificato un errore sconosciuto.';
    var m = msg.toLowerCase();
    
    if (m.includes('user already registered')) {
      return 'Esiste già un account registrato con questa email.';
    }
    if (m.includes('invalid login credentials')) {
      return 'Credenziali errate. Controlla email/username e password.';
    }
    if (m.includes('password should be at least')) {
      return 'La password deve essere di almeno 6 caratteri.';
    }
    if (m.includes('unable to validate email') || m.includes('invalid format')) {
      return 'Indirizzo email non valido.';
    }
    if (m.includes('email rate limit exceeded') || m.includes('rate limit')) {
      return 'Troppi tentativi. Attendi qualche minuto prima di riprovare.';
    }
    if (m.includes('email not confirmed')) {
      return 'Devi confermare la tua email tramite il link ricevuto prima di accedere.';
    }
    if (m.includes('network') || m.includes('failed to fetch')) {
      return 'Errore di connessione al server. Controlla la tua rete.';
    }
    
    return 'Si è verificato un errore. Riprova tra poco.';
  }

  window.logoutUser = async function() {
    await supabase.auth.signOut();
    showToast('👋 Uscito con successo.');
  };

  window.toggleUserMenu = function() {
    var m = document.getElementById('user-menu');
    if (m) m.classList.toggle('open');
  };
  // ── CONTROLLO SESSIONE: Verifica se l'utente esiste ancora nel DB ──
  async function checkUserValidity() {
    if (!currentUser) return; // Se non è loggato, non fare nulla
    
    console.log("Controllo in corso se l'utente esiste ancora nel DB...");
    
    // Forza il server a riconvalidare l'utente usando getUser()
    const { data, error } = await supabase.auth.getUser();
    
    console.log("Risposta server:", { data, error });

    // Se c'è un errore o l'utente risulta vuoto, significa che è stato cancellato!
    if (error || !data.user) {
      console.log("Utente non più valido! Forzo il logout...");
      await supabase.auth.signOut(); // Distrugge il token locale
      currentUser = null;
      updateAuthUI(); // Forza l'aggiornamento dell'header, mostrando "Accedi"
      showToast('⚠️ Sessione non valida o account non più presente.');
    } else {
      console.log("Utente valido, tutto ok.");
    }
  }

  // Esegui al caricamento della pagina
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkUserValidity);
  } else {
    checkUserValidity();
  }

  // Esegui il controllo ogni 15 secondi
  setInterval(checkUserValidity, 15000);
  
  // ── Preferiti (Database) ───────────────────────────────────
  async function getFavs() {
    if (!currentUser) return [];
    const { data, error } = await supabase
      .from('favorites')
      .select('rider_id, rider_name')
      .eq('user_id', currentUser.id);
    if (error) return [];
    return data.map(f => ({ id: f.rider_id, name: f.rider_name }));
  }
  window.getFavs = getFavs;
  
  window.toggleFav = async function(riderId, riderName) {
    if (!currentUser) { openAuthModal(); return; }
    
    var favs = await getFavs();
    var idx = favs.findIndex(function(f){ return f.id === riderId; });
    
    if (idx >= 0) {
      await supabase.from('favorites').delete().match({ user_id: currentUser.id, rider_id: riderId });
      showToast('⭐ ' + riderName + ' rimosso dai preferiti.');
    } else {
      await supabase.from('favorites').insert({ 
        user_id: currentUser.id, 
        rider_id: riderId, 
        rider_name: riderName 
      });
      showToast('⭐ ' + riderName + ' aggiunto ai preferiti!');
    }
    
    document.querySelectorAll('.fav-star[data-id="' + riderId + '"]').forEach(function(star) {
      star.classList.toggle('active', idx < 0);
      star.title = idx < 0 ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti';
    });
    
    // Aggiorna UI menu
    updateAuthUI();
  };

  function initFavStars(favs) {
    var favIds = new Set(favs.map(function(f){ return f.id; }));
    document.querySelectorAll('.fav-star').forEach(function(star) {
      var id = star.getAttribute('data-id');
      star.classList.toggle('active', favIds.has(id));
      star.title = favIds.has(id) ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti';
    });
  }

  function showFavsSection(favs) {
    var container = document.getElementById('favs-section-container');
    if (!container) return;
    if (favs.length === 0) {
      container.innerHTML = '';
      return;
    }
    var chips = favs.map(function(f) {
      return '<a href="pilota.html?id=' + f.id + '" class="fav-chip">' + f.name + '</a>';
    }).join('');
    container.innerHTML =
      '<div class="favs-section">' +
        '<div class="favs-title">⭐ I miei piloti preferiti</div>' +
        '<div class="favs-grid">' + chips + '</div>' +
      '</div>';
  }

  window.showFavs = function() {
    var m = document.getElementById('user-menu');
    if (m) m.classList.remove('open');
    window.location.href = 'piloti.html#favs';
  };

  // ── Toast ────────────────────────────────────────────────────
  function showToast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:5rem;left:50%;transform:translateX(-50%);' +
      'background:#222;color:#fff;padding:.5rem 1.2rem;border-radius:20px;' +
      'font-family:"Barlow Condensed",sans-serif;font-weight:700;font-size:.88rem;' +
      'letter-spacing:.04em;z-index:9999;pointer-events:none;' +
      'animation:fadeInUp .2s ease;white-space:nowrap;';
    document.body.appendChild(t);
    setTimeout(function(){ t.style.opacity='0';t.style.transition='opacity .3s'; }, 2200);
    setTimeout(function(){ t.remove(); }, 2600);
  }

  // Chiudi menu cliccando fuori (attaccato una sola volta al documento)
  document.addEventListener('click', function(e) {
    var w = document.getElementById('user-menu-wrap');
    if (w && !w.contains(e.target)) {
      var m = document.getElementById('user-menu');
      if (m) m.classList.remove('open');
    }
  });

  // UNICA fonte di verità per l'aggiornamento della UI
  // Supabase lancia questo evento all'avvio e ad ogni login/logout
  supabase.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    updateAuthUI();
  });

})();
// ── MOSTRA / NASCONDI PASSWORD (Inietta l'occhietto automaticamente) ──────
(function() {
  function setupToggles() {
    var inputs = document.querySelectorAll('.auth-field input[type="password"]');
    inputs.forEach(function(input) {
      // Se ha già il bottone, salto
      if (input.dataset.toggleAdded) return; 
      input.dataset.toggleAdded = 'true';
      
      // Aggiungo un po' di spazio a destra nell'input per non far sovrapporre il testo all'icona
      input.style.paddingRight = '2.2rem'; 
      
      // Il contenitore deve essere posizionato relativamente
      input.parentElement.style.position = 'relative';
      
      // Creo il bottone occhietto
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.innerHTML = '👁️';
      btn.style.cssText = 'position:absolute;right:.7rem;bottom:.55rem;background:none;border:none;cursor:pointer;font-size:1rem;padding:0;line-height:1;color:var(--muted);z-index:10;';
      
      // Logica click: cambio il tipo di input e l'icona
      btn.addEventListener('click', function() {
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = '🙈';
        } else {
          input.type = 'password';
          btn.innerHTML = '👁️';
        }
      });
      
      // Aggiungo l'occhietto nel campo password
      input.parentElement.appendChild(btn);
    });
  }
  
  // Attivo la funzione quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupToggles);
  } else {
    setupToggles();
  }
})();

