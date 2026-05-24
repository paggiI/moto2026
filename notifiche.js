/**
 * notifiche.js — Sistema notifiche Moto2026
 * Incluso in tutte le pagine. Mostra un toast banner una sola volta per GP.
 * Per aggiungere una nuova notifica, aggiungi un oggetto a GP_NOTIFICATIONS.
 */

const GP_NOTIFICATIONS = [
  { id: 'gp-cat-2026',  msg: '🏁 GP Catalunya aggiunto al calendario — Barcellona 15-17 Maggio 2026', link: 'calendario.html' },
  { id: 'gp-mug-2026',  msg: '🏁 GP d\'Italia al Mugello — 29-31 Maggio 2026', link: 'calendario.html' },
  { id: 'gp-hun-2026',  msg: '🏁 Nuovo GP: Gran Premio d\'Ungheria — Budapest, 12-14 Giugno 2026', link: 'calendario.html' },
  { id: 'gp-team-new',  msg: '🏢 Nuova pagina TEAM disponibile — schede di tutte le scuderie!', link: 'team.html' },
];

function moto2026_closeNotif() {
  const banner = document.getElementById('m2026-notif');
  if (!banner) return;
  banner.style.animation = 'notifSlideDown .3s ease forwards';
  setTimeout(() => { banner.style.display = 'none'; }, 320);
  try { localStorage.setItem('notif-dismissed-' + banner.dataset.notifId, '1'); } catch(e) {}
}

function moto2026_checkNotifications() {
  for (const n of GP_NOTIFICATIONS) {
    let dismissed = false;
    try { dismissed = localStorage.getItem('notif-dismissed-' + n.id) === '1'; } catch(e) {}
    if (!dismissed) {
      const banner = document.getElementById('m2026-notif');
      if (!banner) return;
      banner.querySelector('.m2026-notif-text').textContent = n.msg;
      banner.querySelector('.m2026-notif-link').href = n.link;
      banner.dataset.notifId = n.id;
      banner.style.display = 'flex';
      // auto-dismiss after 9s
      setTimeout(() => {
        if (banner && banner.style.display !== 'none') moto2026_closeNotif();
      }, 9000);
      break; // show only one at a time
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(moto2026_checkNotifications, 700);
});
