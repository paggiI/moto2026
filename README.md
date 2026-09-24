Moto 2026
Benvenuto nel repository di MotoMondiale 2026, un portale web moderno, veloce e completo dedicato alla stagione del Motomondiale.

Il sito raccoglie informazioni su MotoGP, Moto2 e Moto3, offrendo un'interfaccia semplice, intuitiva e ricca di contenuti. Il progetto nasce dalla passione per il motorsport e dalla volontà di mettere in pratica competenze di sviluppo web, coniugando le performance di un sito statico con la potenza di un backend cloud (Supabase) per la gestione degli account.

🌐 Versione online: https://paggii.github.io/moto2026/

📖 Descrizione del progetto
MotoMondiale 2026 è un'applicazione web che unisce un frontend statico (ospitato su GitHub Pages) a un Backend-as-a-Service (Supabase).
L'obiettivo è creare un punto di riferimento dove consultare rapidamente classifiche, risultati, schede piloti e statistiche. Gran parte dei dati informativi è "embedded" nel frontend per garantire tempi di caricamento inferiori a 2 secondi, mentre l'autenticazione e i dati personali (preferiti) sono gestiti in modo sicuro e persistente sul database cloud, accessibili da qualsiasi dispositivo.

✨ Funzionalità
Il sito comprende numerose sezioni dedicate al campionato mondiale. Attualmente sono disponibili:
    🏁 Home page con notizie, countdown al prossimo GP e classifiche
    ⚰️ Piloti deceduti nei vari weekend di gara
    🏍️ Pagine dedicate a MotoGP, Moto2 e Moto3
    👤 Schede piloti complete con palmarès, statistiche e grafici
    🏢 Schede dei Team
    📅 Calendario completo della stagione
    📊 Classifiche piloti e costruttori con confronto Head-to-Head
    📊 Classifiche Red Bull MotoGP Rookies Cup e FIM MotoJunior World Championship
    📰 Notizie con filtri per categoria
    📈 Statistiche avanzate e Indice di Dominanza
    🏟️ Circuiti con schede dettagliate, mappe e record
    🏆 Albo d'oro dal 1949 a oggi
    🎯 Prediction per i prossimi GP
    📖 Guida e Relazione tecnica

🔐 Sistema di Account Cloud (Supabase):
    Registrazione e login tramite Email o Username.
    - ⭐ Piloti Preferiti: salvataggio sicuro sui database cloud, accessibile da qualsiasi browser o dispositivo.
    - 📲 PWA (Progressive Web App): installabile su smartphone e desktop, navigabile anche offline.
💻 Tecnologie utilizzate:
    - Il progetto è stato sviluppato con tecnologie web standard, senza l'uso di framework frontend pesanti per mantenere le prestazioni al massimo.

Tecnologie utilizzate nel progetto:
    - HTML5 / CSS3	Struttura semantica e stili (Custom Properties, Grid, Flexbox)
    - JavaScript (ES2022)	Vanilla JS per il rendering dinamico, DOM e interazioni
    - Supabase (BaaS)	Autenticazione utenti, Database PostgreSQL e Storage
    - Service Worker (PWA)	Cache offline, installazione come app nativa
    - GitHub Pages	Hosting statico del frontend

🔒 Architettura e Sicurezza
Il sito adotta un'architettura ibrida che garantisce sicurezza elevata per i dati utente:
    Supabase Auth: Le password non sono mai salvate nel browser. La registrazione e il login sfruttano il sistema di autenticazione sicura di Supabase (hashing bcrypt).
    Row Level Security (RLS): La tabella PostgreSQL che memorizza i piloti preferiti è protetta da policy RLS. Un utente può leggere e modificare esclusivamente le proprie righe nel database, impedendo qualsiasi accesso non autorizzato ai dati altrui.
    Login tramite Username: Poiché Supabase usa nativamente l'email per il login, è stata creata una funzione RPC (Remote Procedure Call) sicura in PostgreSQL che mappa lo username nell'email dell'utente solo dopo aver verificato la password.
    Nessuna chiave segreta nel frontend: Il sito utilizza solo la Publishable Key di Supabase, progettata per essere esposta pubblicamente.

🎯 Obiettivi
Lo scopo principale del progetto è creare un portale che offra una panoramica completa della stagione del Motomondiale. Durante lo sviluppo sono stati perseguiti diversi obiettivi:
    Unire le performance di un sito statico a un database reale.
    Gestire in modo sicuro le sessioni utente (JWT token).
    Realizzare un'interfaccia moderna e perfettamente responsive.
    Organizzare grandi quantità di informazioni in modo chiaro.
    Creare un progetto facilmente espandibile con nuove funzionalità.

📂 Struttura del sito
Il portale è organizzato in 43 pagine HTML principali:
    Home & Notizie
    Pagine Categorie: MotoGP, Moto2, Moto3
    Calendario & Risultati
    Piloti & Team
    Classifiche & Classifiche Minorì
    Statistiche & Prediction
    Circuiti & Albo d'oro
    Guida al sito & Relazione tecnica

📱 Compatibilità
Il sito è progettato per funzionare sui principali browser moderni:
    Google Chrome
    Microsoft Edge
    Mozilla Firefox
    Safari
Il layout, inoltre, è perfettamente ottimizzato per smartphone, tablet e desktop.

📌 Aggiornamenti futuri
Tra le funzionalità previste per i prossimi sviluppi:
    Integrazione API per dati in tempo reale.
    Notifiche push per i risultati delle gare tramite le Web Push API.
    Ulteriori contenuti statistici e miglioramenti dell'accessibilità.

⚠️ Disclaimer
Questo progetto è stato realizzato esclusivamente a scopo personale, didattico e dimostrativo.
MotoGP™, Moto2™, Moto3™ e tutti i marchi collegati appartengono ai rispettivi proprietari. Questo sito non è affiliato, sponsorizzato né approvato da Dorna Sports o da altre organizzazioni ufficiali del Motomondiale.

👨‍💻 Autore
Progetto sviluppato da Matteo Paggi.

Grazie per aver visitato il repository!