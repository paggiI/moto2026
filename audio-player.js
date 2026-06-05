// Audio Player Injector - Aggiungi questo script a tutte le pagine
document.addEventListener('DOMContentLoaded', function() {
  // Se il player esiste già, esci
  if (document.getElementById('bg-audio')) return;
  
  // Crea il player HTML
  const playerHTML = `
    <div style="position:fixed;bottom:20px;right:20px;z-index:100;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:1rem;width:180px;">
      <div style="display:flex;gap:.5rem;margin-bottom:.8rem;">
        <button id="play-btn" onclick="var a=document.getElementById('bg-audio');a.paused?a.play():a.pause();this.textContent=a.paused?'▶':'⏸';" style="flex:1;background:#e8001d;color:#f5f5f5;border:0;border-radius:4px;cursor:pointer;padding:.5rem;font-weight:600;">⏸</button>
        <button onclick="var a=document.getElementById('bg-audio');a.loop=!a.loop;this.style.color=a.loop?'#e8001d':'#888';" style="flex:1;background:0;border:1px solid #2a2a2a;color:#e8001d;border-radius:4px;cursor:pointer;">🔁</button>
      </div>
      <input id="vol-slider" type="range" min="0" max="100" value="30" oninput="document.getElementById('bg-audio').volume=this.value/100;" style="width:100%;cursor:pointer;">
      <audio id="bg-audio" autoplay loop style="display:none;">
        <source src="motogp_intro_26.mp3" type="audio/mpeg">
      </audio>
    </div>
  `;
  
  // Inserisci all'inizio del body
  document.body.insertAdjacentHTML('beforeend', playerHTML);
  
  // Assicurati che l'audio sia a volume 30%
  setTimeout(() => {
    const audio = document.getElementById('bg-audio');
    if (audio) {
      audio.volume = 0.3;
    }
  }, 500);
});
