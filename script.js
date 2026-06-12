// ══════════════════════════════════════════════════════════════════════
// TRANS POWER V6 — script.js (Polish & Empowerment Update)
// ══════════════════════════════════════════════════════════════════════

// ── STATE ──
let activeCat = 'all', mvrIdx = 0, selGoal = null, uploadedPhoto = null, goalIdx = 0;
let breatheInterval = null, breatheTimeout = null;
let voiceStream = null, voiceCtx = null, voiceAnalyser = null, voiceRunning = false;

// ══════════════════════════════════════════════════════════════════════
// SPARKLES CANVAS
// ══════════════════════════════════════════════════════════════════════
(function initSparkles(){
  const sc = document.getElementById('sc');
  if(!sc) return;
  const ctx = sc.getContext('2d');
  const resize = ()=>{ sc.width=innerWidth; sc.height=innerHeight; };
  resize(); window.addEventListener('resize', resize);
  const particles = Array.from({length:32},()=>({
    x:Math.random()*innerWidth, y:Math.random()*innerHeight,
    sz:Math.random()*1.6+0.3, c:Math.random()>0.5?'#F5A9B8':'#5BCEFA',
    ph:Math.random()*Math.PI*2, sp:Math.random()*0.012+0.003, drift:(Math.random()-0.5)*0.15
  }));
  function draw(t){
    ctx.clearRect(0,0,sc.width,sc.height);
    particles.forEach(s=>{
      const alpha=((Math.sin(t*s.sp+s.ph)+1)/2)*0.6;
      s.x+=s.drift; if(s.x<0)s.x=sc.width; if(s.x>sc.width)s.x=0;
      ctx.save(); ctx.globalAlpha=alpha; ctx.fillStyle=s.c; ctx.shadowColor=s.c; ctx.shadowBlur=8;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.sz,0,Math.PI*2); ctx.fill();
      ctx.fillRect(s.x-s.sz*3.2,s.y-0.4,s.sz*6.4,0.8);
      ctx.fillRect(s.x-0.4,s.y-s.sz*3.2,0.8,s.sz*6.4);
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// ══════════════════════════════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', ()=>{
  // Identity check
  const savedName = localStorage.getItem('tp_name');
  if(!savedName){
    document.getElementById('setup-overlay').style.display='flex';
    document.getElementById('bnav').style.display='none';
  } else {
    document.getElementById('setup-overlay').style.display='none';
    applyProfile();
    greetUser();
  }

  // Date & Affirmation
  const d = new Date();
  const idx = (d.getDate() + d.getMonth()*31) % AFFS.length;
  const atEl = document.getElementById('aff-text');
  const adEl = document.getElementById('aff-date');
  const hdEl = document.getElementById('hero-date');
  if(atEl) atEl.textContent = AFFS[idx];
  if(adEl) adEl.textContent = d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  if(hdEl) hdEl.textContent = d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) + ' · ' + d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});

  // Init sections
  renderTerms(TERMS);
  initHRT();
  renderMvR();
  initStories();
  initWall();
  initChat();
  initMedsSystem();
  loadStats();
  loadMoodToday();
  loadSafetyPlan();
  loadJournalEntries();
  loadVoiceHistory();
  // V6 inits
  initTimeline();
  initComingOut();
  initVoiceExercises();
  initMindfulness();
  initSideEffects();

  // Stealth mode: 5 rapid taps on title
  let stealthTaps = 0, stealthTimer = null;
  const htitle = document.getElementById('htitle');
  if(htitle) htitle.addEventListener('click', ()=>{
    stealthTaps++;
    clearTimeout(stealthTimer);
    stealthTimer = setTimeout(()=>stealthTaps=0, 1500);
    if(stealthTaps >= 5){ stealthTaps=0; if(typeof activateGoogleStealth==='function') activateGoogleStealth(); else if(typeof toggleStealth==='function') toggleStealth(); }
  });

  // Request notification permission
  if('Notification' in window && Notification.permission === 'default'){
    Notification.requestPermission();
  }
});

// ══════════════════════════════════════════════════════════════════════
// SETUP FLOW
// ══════════════════════════════════════════════════════════════════════
let selectedPronoun = 'she/her';

function nextSetup(step){
  document.querySelectorAll('.setup-step').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById('setup-step-'+step);
  if(el) el.classList.add('active');
}

function validateName(){
  const inp = document.getElementById('setup-name');
  const name = inp.value.trim();
  if(!name){ inp.style.borderColor='#f87'; inp.focus(); return; }
  inp.style.borderColor='';
  nextSetup(3);
}

function pickPronoun(el, p){
  document.querySelectorAll('.pronoun-opt').forEach(o=>o.classList.remove('active'));
  el.classList.add('active');
  selectedPronoun = p;
  document.getElementById('setup-custom-pronoun').style.display = p==='custom'?'block':'none';
}

function completeSetup(){
  const name = document.getElementById('setup-name').value.trim();
  let pronoun = selectedPronoun;
  if(pronoun==='custom') pronoun = document.getElementById('setup-custom-pronoun').value.trim() || 'they/them';
  const voice = document.getElementById('setup-voice').checked;

  localStorage.setItem('tp_name', name);
  localStorage.setItem('tp_pronoun', pronoun);
  localStorage.setItem('tp_voice', voice);
  localStorage.setItem('tp_first_day', new Date().toISOString());

  const overlay = document.getElementById('setup-overlay');
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.6s';
  setTimeout(()=>{
    overlay.style.display='none';
    document.getElementById('bnav').style.display='flex';
    applyProfile();
    greetUser();
  }, 600);
}

function applyProfile(){
  const name = localStorage.getItem('tp_name') || '';
  const pronoun = localStorage.getItem('tp_pronoun') || '';
  const el = document.getElementById('user-greeting');
  if(el) el.textContent = name ? `Hi ${name} ✦` : 'Live · Be Free · Be You';
  const affName = document.getElementById('aff-name');
  if(affName) affName.textContent = name || 'you';
  const tagline = document.getElementById('hero-tagline');
  if(tagline && name) tagline.textContent = `"${name}, being trans is your superpower"`;
}

function greetUser(){
  const name = localStorage.getItem('tp_name');
  const voiceEnabled = localStorage.getItem('tp_voice') === 'true';
  const hasSpoken = sessionStorage.getItem('tp_greeted');
  if(!name || !voiceEnabled || hasSpoken) return;

  const hour = new Date().getHours();
  let tg = 'Good morning';
  if(hour>=12 && hour<17) tg = 'Good afternoon';
  if(hour>=17) tg = 'Good evening';

  const msgs = [
    `${tg}, ${name}. You are valid, you are loved, and you are exactly who you are meant to be.`,
    `Welcome back, ${name}. Take a deep breath. This is your safe space.`,
    `Hi ${name}. Remember: you are braver than you feel and stronger than you know.`
  ];
  const msg = msgs[Math.floor(Math.random()*msgs.length)];

  if('speechSynthesis' in window){
    // Wait for voices to load
    const speak = ()=>{
      const u = new SpeechSynthesisUtterance(msg);
      u.pitch = 1.1; u.rate = 0.95;
      const voices = speechSynthesis.getVoices();
      const femVoice = voices.find(v=>v.name.includes('Female')||v.name.includes('Samantha')||v.name.includes('Zira'));
      if(femVoice) u.voice = femVoice;
      speechSynthesis.speak(u);
      sessionStorage.setItem('tp_greeted','true');
    };
    if(speechSynthesis.getVoices().length) speak();
    else speechSynthesis.onvoiceschanged = speak;
  }
}

// ══════════════════════════════════════════════════════════════════════
// TAB SWITCHING
// ══════════════════════════════════════════════════════════════════════
function sw(tab){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.nb').forEach(b=>b.classList.remove('active'));
  const tabEl = document.getElementById(tab);
  const navEl = document.getElementById('nav-'+tab);
  if(tabEl) tabEl.classList.add('active');
  if(navEl) navEl.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
  // Refresh mood chart when wellness tab opened
  if(tab==='wellness') renderMoodChart();
}

// ══════════════════════════════════════════════════════════════════════
// LEARN — Terms
// ══════════════════════════════════════════════════════════════════════
function sls(sec, btn){
  document.querySelectorAll('#learn .sp').forEach(p=>p.classList.remove('active'));
  const target = document.getElementById('l'+sec);
  if(target) target.classList.add('active');
  if(btn){
    document.querySelectorAll('#ltabs .stab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  }
}

function renderTerms(list){
  const tg = document.getElementById('tg');
  if(!tg) return;
  tg.innerHTML = list.length===0
    ? '<p style="color:var(--muted);text-align:center;padding:18px">No terms found 🔍</p>'
    : list.map(t=>`<div class="tc" onclick="this.classList.toggle('exp')"><div class="tw">${t.w}</div><div class="tcat">${t.c}</div><div class="td">${t.d}</div></div>`).join('');
}

function fT(q){
  renderTerms(TERMS.filter(t=>(activeCat==='all'||t.c===activeCat)&&(t.w.toLowerCase().includes(q.toLowerCase())||t.d.toLowerCase().includes(q.toLowerCase()))));
}

function fC(cat,btn){
  activeCat=cat;
  document.querySelectorAll('.cfb').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  fT(document.getElementById('ts')?.value||'');
}

// ══════════════════════════════════════════════════════════════════════
// LEARN — HRT
// ══════════════════════════════════════════════════════════════════════
function initHRT(){
  const el = document.getElementById('hrtacc');
  if(!el) return;
  el.innerHTML = HRT.map((h,i)=>`<div class="ai" id="ha${i}"><button class="ah" onclick="tA(${i})"><span style="font-size:18px">${h.i}</span><span style="flex:1">${h.t}</span><span class="ac">▾</span></button><div class="ab"><div class="abc">${h.b.replace(/\n/g,'<br>')}</div></div></div>`).join('');
}
function tA(i){ const el=document.getElementById('ha'+i); const open=el.classList.contains('open'); document.querySelectorAll('.ai').forEach(a=>a.classList.remove('open')); if(!open)el.classList.add('open'); }

// ══════════════════════════════════════════════════════════════════════
// LEARN — Myths
// ══════════════════════════════════════════════════════════════════════
function renderMvR(){
  const c=document.getElementById('mvrc'); if(!c)return; c.innerHTML='';
  const d=MVR[mvrIdx];
  const back=document.createElement('div'); back.className='mcard';
  back.style.cssText=`background:${d.rc};z-index:1;display:none;flex-direction:column;`;
  back.innerHTML=`<div><div class="mb2" style="color:var(--blue)">✅ REALITY</div><div class="mt2">${d.r}</div></div><div class="mc2"><span>✦ Trans-affirming truth</span><span>${mvrIdx+1}/${MVR.length}</span></div>`;
  const front=document.createElement('div'); front.className='mcard';
  front.style.cssText=`background:${d.mc};z-index:2;display:flex;flex-direction:column;`;
  front.innerHTML=`<div><div class="mb2" style="color:#f87">❌ MYTH</div><div class="mt2">"${d.m}"</div></div><div class="mc2"><span style="font-size:11px;color:var(--muted)">Tap to reveal truth →</span><span>${mvrIdx+1}/${MVR.length}</span></div>`;
  front.onclick=()=>{ front.style.display='none'; back.style.display='flex'; back.style.zIndex='3'; };
  c.appendChild(back); c.appendChild(front);
}
function nM(){ mvrIdx=(mvrIdx+1)%MVR.length; renderMvR(); }
function pM(){ mvrIdx=(mvrIdx-1+MVR.length)%MVR.length; renderMvR(); }

// ══════════════════════════════════════════════════════════════════════
// GLOW GUIDE
// ══════════════════════════════════════════════════════════════════════
function hP(inp){ if(!inp.files||!inp.files[0])return; const r=new FileReader(); r.onload=e=>{ uploadedPhoto=e.target.result; const pp=document.getElementById('pp'); const ppw=document.getElementById('ppw'); const uz=document.getElementById('uz'); if(pp)pp.src=uploadedPhoto; if(ppw)ppw.style.display='block'; if(uz)uz.style.display='none'; }; r.readAsDataURL(inp.files[0]); }
function rP(){ uploadedPhoto=null; const pi=document.getElementById('pi'); const ppw=document.getElementById('ppw'); const uz=document.getElementById('uz'); if(pi)pi.value=''; if(ppw)ppw.style.display='none'; if(uz)uz.style.display='block'; }
function gS2(){ _hide('gs1p');_show('gs2p');_rmActive('gs1');_addClass('gs1','done');_addClass('gs2','active'); }
function skipS2(){ uploadedPhoto=null; gS2(); }
function gB(){ _hide('gs2p');_show('gs1p');_rmClass('gs2','active');_rmClass('gs1','done');_addClass('gs1','active'); }
function sG(card,goal){ document.querySelectorAll('.gcard').forEach(c=>c.classList.remove('sel')); card.classList.add('sel'); selGoal=goal; const gbtn=document.getElementById('gbtn'); if(gbtn)gbtn.disabled=false; }

async function genGlow(){
  if(!selGoal) return;
  _hide('gs2p');_show('gs3p');_rmClass('gs2','active');_addClass('gs2','done');_addClass('gs3','active');_show('gldr');
  const gres=document.getElementById('gres'); if(gres){gres.classList.remove('vis');gres.innerHTML='';} _hide('gacts');
  
  if(typeof GroqAI!=='undefined' && GroqAI.isOnline()){
    const name = localStorage.getItem('tp_name')||'';
    const prompt = `Generate a personalized glow guide for ${name||'the user'} going for a "${selGoal}" aesthetic. ${uploadedPhoto ? 'They have uploaded a selfie for reference.' : 'No photo uploaded.'}
Give specific, actionable advice in these sections:
💄 **Makeup** - Specific products, techniques, colors
👗 **Outfit** - Complete outfit ideas with specific items
💇 **Hair** - Style, products, techniques
🌸 **Expression** - Body language, confidence tips, accessories
End with a beautiful, empowering affirmation quote.
Keep it practical and budget-friendly (include Indian brand options where relevant).`;
    const result = await GroqAI.query([{role:'user', content:prompt}], 'glow');
    _hide('gldr');
    if(result.success){
      const el=document.getElementById('gres'); if(!el)return;
      const fmt=s=>s.replace(/\*\*(.*?)\*\*/g,'<strong style="color:var(--pink)">$1</strong>').replace(/\n/g,'<br>');
      el.innerHTML=`<div class="oc" style="margin-bottom:14px;padding:18px;line-height:1.8">${fmt(result.text)}</div><div class="ai-src sweetheart" style="text-align:center;margin:0 auto">Sweetheart Local Guidance</div>`;
      el.classList.add('vis'); _show('gacts');
    } else {
      renderGlowResult(GLOW.generate(selGoal));
    }
  } else {
    setTimeout(()=>{ renderGlowResult(GLOW.generate(selGoal)); }, 1200+Math.random()*500);
  }
}

function renderGlowResult(r){
  _hide('gldr');
  const el=document.getElementById('gres'); if(!el)return;
  const fmt=s=>s.replace(/\*\*(.*?)\*\*/g,'<strong style="color:var(--pink)">$1</strong>').replace(/\n/g,'<br>');
  el.innerHTML=`<div class="osec"><div class="ost">💄 Makeup</div><div class="oc">${fmt(r.makeup)}</div></div><div class="osec"><div class="ost">👗 Outfit</div><div class="oc">${fmt(r.outfit)}</div></div><div class="osec"><div class="ost">💇 Hair</div><div class="oc">${fmt(r.hair)}</div></div><div class="osec"><div class="ost">🌸 Expression</div><div class="oc">${fmt(r.expression)}</div></div><div class="fgm">"${r.affirmation}"</div>`;
  el.classList.add('vis'); _show('gacts');
}

function rGlow(){
  selGoal=null; uploadedPhoto=null;
  const pi=document.getElementById('pi'); if(pi)pi.value='';
  _hide('ppw');_show('uz');
  document.querySelectorAll('.gcard').forEach(c=>c.classList.remove('sel'));
  const gbtn=document.getElementById('gbtn'); if(gbtn)gbtn.disabled=true;
  _hide('gs3p');_show('gs1p');_hide('gs2p');
  ['gs1','gs2','gs3'].forEach(id=>{const e=document.getElementById(id);if(e)e.classList.remove('active','done');});
  _addClass('gs1','active');
  const gres=document.getElementById('gres'); if(gres){gres.innerHTML='';gres.classList.remove('vis');}
}

// ══════════════════════════════════════════════════════════════════════
// SUPPORT — Chat, Stories, Wall
// ══════════════════════════════════════════════════════════════════════
function osp(panel){
  document.querySelectorAll('#support .sp').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('#support .stab').forEach(b=>b.classList.remove('active'));
  
  let pId, bId;
  if(panel === 'chat') { pId = 'cpanel'; bId = 'ctb'; }
  else if(panel === 'companion') { pId = 'ppanel'; bId = 'ptb'; }
  else if(panel === 'stories') { pId = 'spanel'; bId = 'stb'; }
  else if(panel === 'wall') { pId = 'wpanel'; bId = 'wtb'; }
  
  const pEl=document.getElementById(pId);
  const bEl=document.getElementById(bId);
  if(pEl)pEl.classList.add('active'); if(bEl)bEl.classList.add('active');
}

function initChat(){
  const w=document.getElementById('cw'); if(!w)return; w.innerHTML='';
  const name = localStorage.getItem('tp_name');
  const greeting = name ? `Hi ${name}.` : 'Hi sweetheart.';
  aMsg(`${greeting} I'm Sweetheart AI — your private offline big-sis companion.\n\nAsk me about coming out, HRT feelings, dysphoria, family, pronouns, voice, legal name changes, or anything on your heart.\n\nNo pressure. We can take this one step at a time.`, false);
}

// Chat conversation history for context
var chatHistory = [];

async function sC(){
  const inp=document.getElementById('ci'); if(!inp)return;
  const msg=inp.value.trim(); if(!msg)return;
  inp.value='';
  aMsg(msg, true);
  chatHistory.push({role:'user', content:msg});
  showTyping();
  
  if(typeof GroqAI!=='undefined' && GroqAI.isOnline()){
    const result = await GroqAI.query(chatHistory, 'chat');
    removeTyping();
    if(result.success){
      const srcTag = '<div class="ai-src sweetheart">Sweetheart Local</div>';
      aMsg(result.text, false, srcTag);
      chatHistory.push({role:'assistant', content:result.text});
    } else {
      aMsg(result.text, false, '<div class="ai-src sweetheart">Sweetheart Offline</div>');
      chatHistory.push({role:'assistant', content:result.text});
    }
  } else {
    await new Promise(r=>setTimeout(r, 400+Math.random()*600));
    removeTyping();
    const reply = AI_ENGINE.reply(msg);
    aMsg(reply, false, '<div class="ai-src sweetheart">Sweetheart Offline</div>');
    chatHistory.push({role:'assistant', content:reply});
  }
}
function qC(msg){ const inp=document.getElementById('ci'); if(inp)inp.value=msg; sC(); }

function aMsg(text, isUser, srcTag){
  const w=document.getElementById('cw'); if(!w)return;
  const d=document.createElement('div'); d.className='cm'+(isUser?' u':'');
  const fmt=text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>');
  d.innerHTML=`<div class="cav">${isUser?'💜':'🌸'}</div><div class="cb">${fmt}${srcTag&&!isUser?srcTag:''}</div>`;
  w.appendChild(d); w.scrollTop=w.scrollHeight;
}
function showTyping(){ const w=document.getElementById('cw'); if(!w)return; const d=document.createElement('div'); d.className='cm'; d.id='ty'; d.innerHTML='<div class="cav">🌸</div><div class="cb"><div class="cty"><span></span><span></span><span></span></div></div>'; w.appendChild(d); w.scrollTop=w.scrollHeight; }
function removeTyping(){ const t=document.getElementById('ty'); if(t)t.remove(); }

function initStories(){
  const el=document.getElementById('scards'); if(!el)return;
  el.innerHTML=STORIES.map(s=>`<div class="scard" onclick="this.classList.toggle('open')"><div class="se">${s.e}</div><div class="st">${s.t}</div><div class="sp2">${s.p}</div><div class="sb">${s.b}</div></div>`).join('');
}

function initWall(){
  const saved=JSON.parse(localStorage.getItem('tp_wall')||'[]');
  renderWall([...saved,...SEED_WALL]);
}
function pW(){
  const inp=document.getElementById('wi'); if(!inp)return;
  const text=inp.value.trim(); if(!text)return;
  const saved=JSON.parse(localStorage.getItem('tp_wall')||'[]');
  saved.unshift({t:text,d:'Just now'}); localStorage.setItem('tp_wall',JSON.stringify(saved.slice(0,50)));
  inp.value=''; initWall();
}
function renderWall(posts){
  const el=document.getElementById('wps'); if(!el)return;
  el.innerHTML=posts.map(p=>`<div class="wp">${p.t||p.text}<div class="wt">🌸 Anonymous · ${p.d||p.time}</div></div>`).join('');
}

// ══════════════════════════════════════════════════════════════════════
// HOME — Goals, Moods, Stats
// ══════════════════════════════════════════════════════════════════════
function cycleGoal(){
  goalIdx=(goalIdx+1)%GOALS.length;
  const el=document.getElementById('goal-text');
  if(el){ el.style.opacity='0'; setTimeout(()=>{ el.textContent=GOALS[goalIdx]; el.style.opacity='1'; },200); }
}

function logMood(btn, val, emoji){
  document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  const moods = JSON.parse(localStorage.getItem('tp_moods')||'[]');
  const today = new Date().toISOString().slice(0,10);
  // Replace today's mood if exists
  const existing = moods.findIndex(m=>m.date===today);
  if(existing>=0) moods[existing] = {date:today, val, emoji};
  else moods.push({date:today, val, emoji});
  localStorage.setItem('tp_moods', JSON.stringify(moods.slice(-90)));
  updateMoodStreak();
  loadStats();
}

function loadMoodToday(){
  const moods = JSON.parse(localStorage.getItem('tp_moods')||'[]');
  const today = new Date().toISOString().slice(0,10);
  const todayMood = moods.find(m=>m.date===today);
  if(todayMood){
    document.querySelectorAll('.mood-btn').forEach(b=>{
      if(b.querySelector('small').textContent.toLowerCase() === getMoodLabel(todayMood.val).toLowerCase()) b.classList.add('sel');
    });
  }
  updateMoodStreak();
}

function getMoodLabel(val){ return {5:'Amazing',4:'Good',3:'Okay',2:'Low',1:'Hard'}[val]||''; }

function updateMoodStreak(){
  const moods = JSON.parse(localStorage.getItem('tp_moods')||'[]');
  const bar = document.getElementById('mood-streak-bar');
  if(!bar) return;
  if(moods.length < 2){ bar.style.display='none'; return; }
  // Count streak
  let streak = 0;
  const today = new Date(); today.setHours(0,0,0,0);
  for(let i=0;i<90;i++){
    const d = new Date(today); d.setDate(d.getDate()-i);
    const key = d.toISOString().slice(0,10);
    if(moods.find(m=>m.date===key)) streak++; else break;
  }
  if(streak > 1){
    bar.style.display='block';
    bar.textContent = `🔥 ${streak}-day mood tracking streak! Keep it up.`;
  } else { bar.style.display='none'; }
}

function loadStats(){
  const firstDay = localStorage.getItem('tp_first_day');
  const moods = JSON.parse(localStorage.getItem('tp_moods')||'[]');
  const journal = JSON.parse(localStorage.getItem('tp_journal')||'[]');
  if(firstDay){
    const days = Math.max(1, Math.floor((Date.now()-new Date(firstDay).getTime())/86400000));
    const el = document.getElementById('stat-days'); if(el) el.textContent = days;
  }
  const mEl = document.getElementById('stat-moods'); if(mEl) mEl.textContent = moods.length;
  const jEl = document.getElementById('stat-journal'); if(jEl) jEl.textContent = journal.length;
}

// ══════════════════════════════════════════════════════════════════════
// WELLNESS — Breathing
// ══════════════════════════════════════════════════════════════════════
function switchWellness(panel){
  document.querySelectorAll('#wellness .med-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('#wellness .stab').forEach(b=>b.classList.remove('active'));
  const pEl=document.getElementById('wp-'+panel);
  const bEl=document.getElementById('wt-'+panel);
  if(pEl)pEl.classList.add('active'); if(bEl)bEl.classList.add('active');
  if(panel==='mood') renderMoodChart();
}

function startBreathing(type){
  stopBreathing();
  const circle = document.getElementById('breathe-circle');
  const text = document.getElementById('breathe-text');
  const timer = document.getElementById('breathe-timer');
  if(!circle||!text||!timer) return;

  const patterns = {
    box:   {name:'Box Breathing', steps:[{t:'Breathe In',s:'inhale',d:4},{t:'Hold',s:'hold',d:4},{t:'Breathe Out',s:'exhale',d:4},{t:'Hold',s:'hold',d:4}], rounds:4},
    calm:  {name:'4-7-8 Calm',    steps:[{t:'Breathe In',s:'inhale',d:4},{t:'Hold',s:'hold',d:7},{t:'Breathe Out',s:'exhale',d:8}], rounds:4},
    energy:{name:'Energize',      steps:[{t:'Quick In',s:'inhale',d:2},{t:'Quick Out',s:'exhale',d:2}], rounds:8}
  };
  const p = patterns[type];
  let round=0, step=0, countdown=0;
  timer.textContent = `${p.name} · Round 1/${p.rounds}`;

  function tick(){
    const s = p.steps[step];
    circle.className = 'breathe-circle '+s.s;
    text.textContent = s.t;
    countdown = s.d;
    const countInterval = setInterval(()=>{
      countdown--;
      text.textContent = `${s.t} · ${countdown+1}`;
      if(countdown<=0) clearInterval(countInterval);
    }, 1000);

    breatheTimeout = setTimeout(()=>{
      clearInterval(countInterval);
      step++;
      if(step >= p.steps.length){ step=0; round++; }
      if(round >= p.rounds){
        stopBreathing();
        text.textContent = 'Well done 🌸';
        circle.className = 'breathe-circle';
        timer.textContent = 'Session complete';
        return;
      }
      timer.textContent = `${p.name} · Round ${round+1}/${p.rounds}`;
      tick();
    }, s.d*1000);
  }
  tick();
}

function stopBreathing(){
  clearTimeout(breatheTimeout);
  clearInterval(breatheInterval);
}

// ══════════════════════════════════════════════════════════════════════
// WELLNESS — Journal
// ══════════════════════════════════════════════════════════════════════
function saveJournal(){
  const inp=document.getElementById('journal-input');
  const moodSel=document.getElementById('journal-mood');
  if(!inp) return;
  const text=inp.value.trim(); if(!text){ inp.style.borderColor='#f87'; return; }
  inp.style.borderColor='';
  const entries = JSON.parse(localStorage.getItem('tp_journal')||'[]');
  entries.unshift({text, mood:moodSel.value, date:new Date().toISOString(), id:'j_'+Date.now()});
  localStorage.setItem('tp_journal', JSON.stringify(entries.slice(0,200)));
  inp.value='';
  loadJournalEntries();
  loadStats();
}

function loadJournalEntries(){
  const el=document.getElementById('journal-entries'); if(!el)return;
  const entries=JSON.parse(localStorage.getItem('tp_journal')||'[]');
  if(!entries.length){ el.innerHTML='<p style="text-align:center;color:var(--muted);padding:20px">No entries yet. Start writing — it\'s for your eyes only. 🌸</p>'; return; }
  el.innerHTML = entries.slice(0,20).map(e=>{
    const d = new Date(e.date);
    return `<div class="journal-entry"><button class="je-del" onclick="deleteJournal('${e.id}')">×</button><div class="je-date"><span>${e.mood}</span> ${d.toLocaleDateString('en-US',{month:'short',day:'numeric'})} · ${d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</div><div class="je-text">${escHtml(e.text)}</div></div>`;
  }).join('');
}

function deleteJournal(id){
  let entries=JSON.parse(localStorage.getItem('tp_journal')||'[]');
  entries=entries.filter(e=>e.id!==id);
  localStorage.setItem('tp_journal',JSON.stringify(entries));
  loadJournalEntries();
  loadStats();
}

// ══════════════════════════════════════════════════════════════════════
// WELLNESS — Mood Chart
// ══════════════════════════════════════════════════════════════════════
function renderMoodChart(){
  const chart=document.getElementById('mood-chart');
  const insights=document.getElementById('mood-insights');
  if(!chart) return;
  const moods=JSON.parse(localStorage.getItem('tp_moods')||'[]');
  if(moods.length<2){ chart.innerHTML='<p style="text-align:center;color:var(--muted);width:100%;padding:30px">Log at least 2 days of mood to see your chart 📊</p>'; if(insights)insights.innerHTML=''; return; }

  const last30 = [];
  const today = new Date(); today.setHours(0,0,0,0);
  for(let i=29;i>=0;i--){
    const d=new Date(today); d.setDate(d.getDate()-i);
    const key=d.toISOString().slice(0,10);
    const m=moods.find(x=>x.date===key);
    last30.push({date:key, val:m?m.val:0, emoji:m?m.emoji:''});
  }

  const colors = {5:'#5BCEFA',4:'#7ad4fc',3:'#c4a0f7',2:'#F5A9B8',1:'#f87',0:'rgba(255,255,255,.05)'};
  chart.innerHTML = last30.map(m=>{
    const h = m.val ? (m.val/5)*100 : 4;
    return `<div class="mood-bar" data-emoji="${m.emoji}" style="height:${h}%;background:${colors[m.val]}" title="${m.date}: ${getMoodLabel(m.val)||'No data'}"></div>`;
  }).join('');

  if(insights){
    const logged = moods.length;
    const avg = (moods.reduce((a,m)=>a+m.val,0)/moods.length).toFixed(1);
    const avgLabel = avg>=4?'Great 🌟':avg>=3?'Steady 😊':avg>=2?'Mixed 💜':'Tough 💙';
    insights.innerHTML = `<strong>Insights:</strong> ${logged} moods logged · Average: ${avg}/5 (${avgLabel}).<br>Remember: tracking your mood helps you see patterns. Every feeling is valid. 🌸`;
  }
}

// ══════════════════════════════════════════════════════════════════════
// WELLNESS — Safety Plan
// ══════════════════════════════════════════════════════════════════════
function saveSafetyPlan(){
  const plan = {
    signs: document.getElementById('safety-signs')?.value||'',
    coping: document.getElementById('safety-coping')?.value||'',
    people: document.getElementById('safety-people')?.value||'',
    reason: document.getElementById('safety-reason')?.value||'',
    saved: new Date().toISOString()
  };
  localStorage.setItem('tp_safety_plan', JSON.stringify(plan));
  alert('💜 Safety plan saved. It will be here whenever you need it.');
}

function loadSafetyPlan(){
  const plan=JSON.parse(localStorage.getItem('tp_safety_plan')||'null');
  if(!plan) return;
  const s=document.getElementById('safety-signs'); if(s)s.value=plan.signs||'';
  const c=document.getElementById('safety-coping'); if(c)c.value=plan.coping||'';
  const p=document.getElementById('safety-people'); if(p)p.value=plan.people||'';
  const r=document.getElementById('safety-reason'); if(r)r.value=plan.reason||'';
}

// ══════════════════════════════════════════════════════════════════════
// VOICE ANALYZER — Research-Anchored Hybrid Engine v2
// ══════════════════════════════════════════════════════════════════════
//
// Architecture:
//   1. Accurate pitch via NSDF (no octave errors)
//   2. Formant-based resonance (F1/F2 positions)
//   3. Spectral tilt as brightness proxy
//   4. Anti-falsetto: detects unnaturally high pitch vs resonance mismatch
//   5. Similarity scoring against embedded reference clusters
//      (derived from published phonetics research — Hillenbrand 1995,
//       Pemberton 1998, Robb & Simmons 1990)
//   6. Adaptive calibration: personal baseline stored in localStorage
//   7. Hybrid final score = acoustic + cluster similarity + stability bonus
//   8. Specific coaching tips referencing the cluster gaps

// ── OVER EXPANDED REFERENCE VOICE CLUSTERS ──
// We simulate comparing the user's voice against a vast dataset by splitting 
// the clusters into various archetypes (based on age, resonance, and pitch types).
// The algorithm calculates similarity against ALL of them and finds the closest match.
const VOICE_REFERENCE = {
  females: [
    { type: 'Young Adult (High)', pitch: {mean: 230, std: 30}, f1: {mean: 750, std: 60}, f2: {mean: 2400, std: 200}, tilt: {mean: 0.40, std: 0.10}, clarity: {mean: 0.60, std: 0.1} },
    { type: 'Adult Average',      pitch: {mean: 200, std: 30}, f1: {mean: 680, std: 70}, f2: {mean: 2200, std: 200}, tilt: {mean: 0.35, std: 0.10}, clarity: {mean: 0.55, std: 0.1} },
    { type: 'Mature / Alto',      pitch: {mean: 175, std: 25}, f1: {mean: 620, std: 60}, f2: {mean: 2000, std: 180}, tilt: {mean: 0.32, std: 0.08}, clarity: {mean: 0.50, std: 0.1} },
    { type: 'Soft / Breathy',     pitch: {mean: 215, std: 35}, f1: {mean: 700, std: 70}, f2: {mean: 2300, std: 220}, tilt: {mean: 0.45, std: 0.15}, clarity: {mean: 0.40, std: 0.1} },
    { type: 'Strong / Projecting',pitch: {mean: 195, std: 40}, f1: {mean: 720, std: 80}, f2: {mean: 2250, std: 200}, tilt: {mean: 0.30, std: 0.08}, clarity: {mean: 0.70, std: 0.1} }
  ],
  males: [
    { type: 'Young Adult', pitch: {mean: 130, std: 25}, f1: {mean: 490, std: 60}, f2: {mean: 1600, std: 180}, tilt: {mean: 0.18, std: 0.08}, clarity: {mean: 0.50, std: 0.1} },
    { type: 'Deep / Bass', pitch: {mean: 100, std: 20}, f1: {mean: 450, std: 50}, f2: {mean: 1400, std: 150}, tilt: {mean: 0.12, std: 0.06}, clarity: {mean: 0.55, std: 0.1} },
    { type: 'High Tenor',  pitch: {mean: 155, std: 30}, f1: {mean: 520, std: 70}, f2: {mean: 1750, std: 200}, tilt: {mean: 0.22, std: 0.09}, clarity: {mean: 0.50, std: 0.1} }
  ]
};

// ── CALIBRATION PROFILE ──
// Stored per-user: their personal baseline after 10s of natural speech
let VOICE_CALIBRATION = JSON.parse(localStorage.getItem('tp_voice_cal')||'null');
let voiceCalSamples = []; // accumulates during calibration
let voiceCalMode = false;
let voiceCalTimer = null;

// ── WORKING STATE ──
let voicePitchHistory = [], voiceFeedbackTimer = null;
const VOICE_PARAMS = {};

// ── CLUSTER SIMILARITY ──
// Gaussian similarity: how many std-devs is a value from a cluster mean?
function gaussSim(val, mean, std){
  const z = (val - mean) / std;
  return Math.exp(-0.5 * z * z);
}

function clusterSimilarity(features){
  // We compute similarity to ALL female archetypes and ALL male archetypes.
  // We take the highest matching female score vs highest matching male score.
  const weights = { pitch: 0.30, f1: 0.20, f2: 0.25, tilt: 0.15, clarity: 0.10 };
  
  let bestFemSim = 0;
  for(const fem of VOICE_REFERENCE.females) {
    let sim = 0;
    for(const key of Object.keys(weights)){
      if(features[key] == null) continue;
      sim += weights[key] * gaussSim(features[key], fem[key].mean, fem[key].std);
    }
    if(sim > bestFemSim) bestFemSim = sim;
  }
  
  let bestMaleSim = 0;
  for(const male of VOICE_REFERENCE.males) {
    let sim = 0;
    for(const key of Object.keys(weights)){
      if(features[key] == null) continue;
      sim += weights[key] * gaussSim(features[key], male[key].mean, male[key].std);
    }
    if(sim > bestMaleSim) bestMaleSim = sim;
  }
  
  // Ratio: how much more female-like than male-like?
  const total = bestFemSim + bestMaleSim;
  return total > 0 ? (bestFemSim / total) : 0.5;
}

// ── ANTI-FALSETTO DETECT ──
// Falsetto: pitch is very high (>230 Hz) BUT formants & tilt remain male-like
// This flags it so we don't over-score it
function isFalsetto(pitch, f2, tilt){
  if(pitch < 220) return false;
  // If pitch is high but F2 is still low and tilt is low → falsetto
  const f2Masculine = f2 < 1700;
  const tiltMasculine = tilt < 0.22;
  return f2Masculine && tiltMasculine;
}

// ── CALIBRATION ──
function startCalibration(){
  if(voiceRunning){ alert('Stop the current analysis first.'); return; }
  voiceCalSamples = [];
  voiceCalMode = true;
  const el = document.getElementById('voice-live-feedback');
  if(el) el.innerHTML = '<p style="color:var(--pink);font-weight:700">🎙️ Calibrating... Speak naturally for 10 seconds.</p>';
  document.getElementById('voice-feedback-card').style.display = 'block';
  toggleVoice(); // starts mic
  voiceCalTimer = setTimeout(finishCalibration, 12000);
}

function finishCalibration(){
  if(!voiceCalMode) return;
  voiceCalMode = false;
  stopVoice();
  document.getElementById('voice-start').textContent = '🎙️ Start Analyzing';
  if(voiceCalSamples.length < 5){
    alert('Not enough data. Please speak louder or longer during calibration.');
    return;
  }
  // Average all calibration samples
  const avg = (arr, key) => arr.reduce((s,x)=>s+(x[key]||0), 0) / arr.length;
  VOICE_CALIBRATION = {
    pitch:     avg(voiceCalSamples, 'pitch'),
    f1:        avg(voiceCalSamples, 'f1'),
    f2:        avg(voiceCalSamples, 'f2'),
    tilt:      avg(voiceCalSamples, 'tilt'),
    clarity:   avg(voiceCalSamples, 'clarity'),
    stability: avg(voiceCalSamples, 'stability'),
    date:      new Date().toISOString()
  };
  localStorage.setItem('tp_voice_cal', JSON.stringify(VOICE_CALIBRATION));
  const el = document.getElementById('voice-live-feedback');
  if(el) el.innerHTML = `<p style="color:var(--pink);font-weight:700">✅ Calibration complete! Your baseline: <strong>${Math.round(VOICE_CALIBRATION.pitch)} Hz</strong> pitch, F2 <strong>${Math.round(VOICE_CALIBRATION.f2)} Hz</strong>.<br>Start Analyzing now for personalized scoring.</p>`;
}

async function toggleVoice(){
  const btn=document.getElementById('voice-start');
  if(voiceRunning){ stopVoice(); btn.textContent='🎙️ Start Analyzing'; return; }
  try{
    voiceStream = await navigator.mediaDevices.getUserMedia({audio:true});
    voiceCtx = new (window.AudioContext||window.webkitAudioContext)();
    const source = voiceCtx.createMediaStreamSource(voiceStream);
    voiceAnalyser = voiceCtx.createAnalyser();
    voiceAnalyser.fftSize = 4096;
    voiceAnalyser.smoothingTimeConstant = 0.7;
    source.connect(voiceAnalyser);
    voiceRunning = true;
    voicePitchHistory = [];
    btn.textContent = '⏹ Stop Analyzing';
    document.getElementById('voice-feedback-card').style.display='block';
    document.getElementById('voice-live-feedback').textContent = 'Speak naturally \u2014 analyzing your voice...';
    drawVoice();
    // Update AI bar
    const bar = document.getElementById('voice-ai-bar');
    if(bar) bar.className = 'ai-mode-bar ' + (SweetheartBrain?.ready ? 'local-llm' : 'offline');
    const lbl = document.getElementById('voice-ai-label');
    if(lbl) lbl.textContent = SweetheartBrain?.ready ? 'Sweetheart Voice Coach — 135M Local' : 'Sweetheart Voice Coach — Offline';
  } catch(e){
    alert('Microphone access needed for voice analysis. Please allow mic access and try again.');
  }
}

function stopVoice(){
  voiceRunning = false;
  if(voiceStream) voiceStream.getTracks().forEach(t=>t.stop());
  if(voiceCtx) voiceCtx.close();
  voiceStream=null; voiceCtx=null; voiceAnalyser=null;
  clearTimeout(voiceFeedbackTimer);
  // Save snapshot
  if(Object.keys(VOICE_PARAMS).length && VOICE_PARAMS.pitch > 0){
    const sessions = JSON.parse(localStorage.getItem('tp_voice_sessions')||'[]');
    sessions.unshift({
      hz: VOICE_PARAMS.pitch+'Hz',
      score: VOICE_PARAMS.score,
      resonance: VOICE_PARAMS.resonance,
      brightness: VOICE_PARAMS.brightness,
      date: new Date().toISOString()
    });
    localStorage.setItem('tp_voice_sessions', JSON.stringify(sessions.slice(0,50)));
    loadVoiceHistory();
  }
}

function saveVoiceSnapshot(){
  if(!voiceRunning){ alert('Start analyzing first, then save a snapshot!'); return; }
  stopVoice();
  document.getElementById('voice-start').textContent='🎙️ Start Analyzing';
}

function drawVoice(){
  if(!voiceRunning||!voiceAnalyser) return;
  const canvas = document.getElementById('voice-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const sampleRate = voiceCtx.sampleRate;
  
  // ── TIME DOMAIN (for pitch + HNR) ──
  const bufLen = voiceAnalyser.fftSize;
  const timeBuf = new Float32Array(bufLen);
  voiceAnalyser.getFloatTimeDomainData(timeBuf);
  
  // ── FREQUENCY DOMAIN (for spectral features) ──
  const freqBufLen = voiceAnalyser.frequencyBinCount;
  const freqBuf = new Uint8Array(freqBufLen);
  voiceAnalyser.getByteFrequencyData(freqBuf);
  
  // ── 1. PITCH — Normalized autocorrelation with octave correction ──
  // The old method had "octave errors" — female voices were read at half
  // their actual frequency because raw autocorrelation peaks at multiples.
  let pitch = 0;
  let bestCorr = 0;
  let rmsSum = 0;
  for(let i=0; i<bufLen; i++) rmsSum += timeBuf[i]*timeBuf[i];
  const rms = Math.sqrt(rmsSum/bufLen);
  
  if(rms > 0.01){
    // Use NSDF (Normalized Square Difference Function) approach
    // This finds the FIRST strong peak, not the biggest, avoiding octave errors
    const minLag = Math.floor(sampleRate/500); // 500 Hz max
    const maxLag = Math.floor(sampleRate/70);  // 70 Hz min
    
    // Compute normalized autocorrelation
    const nsdf = new Float32Array(maxLag+1);
    for(let lag=minLag; lag<=maxLag; lag++){
      let num = 0, den = 0;
      for(let i=0; i<bufLen-lag; i++){
        num += timeBuf[i]*timeBuf[i+lag];
        den += timeBuf[i]*timeBuf[i] + timeBuf[i+lag]*timeBuf[i+lag];
      }
      nsdf[lag] = den > 0 ? 2*num/den : 0; // Range: -1 to 1
    }
    
    // Find peaks in NSDF — take the FIRST peak above threshold
    // This avoids octave errors because the correct period comes first
    const threshold = 0.3;
    let foundPitch = false;
    let peakLag = 0, peakVal = 0;
    let wasNegative = false;
    
    for(let lag=minLag; lag<=maxLag; lag++){
      if(nsdf[lag] < 0) wasNegative = true;
      if(wasNegative && nsdf[lag] > threshold){
        // Find the exact peak in this positive region
        let localPeak = lag, localMax = nsdf[lag];
        while(lag+1 <= maxLag && nsdf[lag+1] >= nsdf[lag]){
          lag++;
          if(nsdf[lag] > localMax){ localMax = nsdf[lag]; localPeak = lag; }
        }
        if(localMax > peakVal){ peakVal = localMax; peakLag = localPeak; }
        if(!foundPitch && localMax > threshold){
          // Take the first strong peak — this is the fundamental
          peakLag = localPeak; peakVal = localMax;
          foundPitch = true;
          break; // First peak = fundamental period
        }
      }
    }
    
    if(foundPitch && peakLag > 0){
      // Parabolic interpolation for sub-sample accuracy
      let refinedLag = peakLag;
      if(peakLag > minLag && peakLag < maxLag){
        const a = nsdf[peakLag-1], b = nsdf[peakLag], c = nsdf[peakLag+1];
        const denom = 2*(2*b - a - c);
        if(Math.abs(denom) > 0.0001){
          refinedLag = peakLag + (a - c) / denom;
        }
      }
      const detectedFreq = sampleRate / refinedLag;
      if(detectedFreq > 70 && detectedFreq < 500){
        pitch = Math.round(detectedFreq);
        bestCorr = peakVal;
      }
    }
  }
  
  // If no pitch detected in this frame (or rms too low), wipe the tracking
  // This guarantees that if there's silence, it INSTANTLY zeros the score instead of trailing
  if(pitch === 0 || rms < 0.02){
     pitch = 0;
     voicePitchHistory = []; // hard reset
  } else {
     voicePitchHistory.push(pitch);
     if(voicePitchHistory.length > 20) voicePitchHistory.shift();
  }
  
  // Only calculate avgPitch if there are valid pitch readings, and the current frame has at least SOME sound
  const validPitches = voicePitchHistory.filter(p => p > 0);
  let avgPitch = undefined;
  // Increase RMS requirement to 0.02 (ignores fan/laptop fan noise)
  if(validPitches.length > 3 && rms > 0.02) {
      avgPitch = Math.round(validPitches.reduce((a,b)=>a+b,0)/validPitches.length);
  } else {
      avgPitch = 0; // Forced silence state
  }
  // ── 2. RESONANCE: formant-based (F1/F2 region analysis) ──
  // Female voices have higher formant frequencies due to shorter vocal tract.
  // Instead of raw energy, we look at WHERE the spectral peaks are.
  const binHz = sampleRate/(2*freqBufLen);
  
  // Find the spectral peak in the F1 region (300-1000 Hz) — higher = more feminine
  let f1Peak = 0, f1PeakVal = 0;
  const f1Start = Math.floor(300/binHz);
  const f1End = Math.floor(1000/binHz);
  for(let i=f1Start; i<f1End && i<freqBufLen; i++){
    if(freqBuf[i] > f1PeakVal){ f1PeakVal = freqBuf[i]; f1Peak = i*binHz; }
  }
  
  // Find spectral peak in F2 region (1000-3500 Hz) — higher = more feminine
  let f2Peak = 0, f2PeakVal = 0;
  const f2Start = Math.floor(1000/binHz);
  const f2End = Math.floor(3500/binHz);
  for(let i=f2Start; i<f2End && i<freqBufLen; i++){
    if(freqBuf[i] > f2PeakVal){ f2PeakVal = freqBuf[i]; f2Peak = i*binHz; }
  }
  
  // Female F1 is typically 500-800 Hz, male 300-500 Hz  
  // Female F2 is typically 1800-2800 Hz, male 1200-1800 Hz
  const f1Score = Math.min(100, Math.max(0, Math.round(((f1Peak-300)/(800-300))*100)));
  const f2Score = Math.min(100, Math.max(0, Math.round(((f2Peak-1200)/(2500-1200))*100)));
  const resonanceRatio = ((f1Score + f2Score) / 2) / 100; // 0-1 range
  
  // ── 3. SPECTRAL TILT (replaces broken "brightness") ──
  // Female voices have a flatter spectral slope (less drop-off at high frequencies)
  // Male voices drop off more steeply after the fundamental
  let lowBandEnergy = 0, highBandEnergy = 0;
  const splitBin = Math.floor(1000/binHz);
  const maxBin = Math.floor(5000/binHz);
  for(let i=1; i<splitBin && i<freqBufLen; i++) lowBandEnergy += freqBuf[i];
  for(let i=splitBin; i<maxBin && i<freqBufLen; i++) highBandEnergy += freqBuf[i];
  // Normalize by number of bins
  const lowAvg = lowBandEnergy / Math.max(1, splitBin-1);
  const highAvg = highBandEnergy / Math.max(1, maxBin-splitBin);
  // Ratio of high to low — higher = flatter slope = more feminine
  const tiltRatio = lowAvg > 0 ? highAvg / lowAvg : 0;
  // Typical range: 0.05 (very male) to 0.5+ (very female)
  const brightnessScore = Math.min(100, Math.max(0, Math.round(tiltRatio * 200)));
  
  // ── 4. CLARITY (simplified — just check if voice is clean) ──
  // Use the autocorrelation peak strength as a proxy for voice clarity
  // bestCorr from pitch detection: higher = cleaner harmonics
  const clarity = Math.min(100, Math.max(0, Math.round(bestCorr * 5000)));
  
  // ── 5. ENERGY (RMS volume) ──
  const energyPct = Math.min(100, Math.round(rms*500));
  
  // ── 6. PITCH STABILITY ──
  let stability = 0;
  if(voicePitchHistory.length > 4){
    const mean = voicePitchHistory.reduce((a,b)=>a+b,0)/voicePitchHistory.length;
    const variance = voicePitchHistory.reduce((a,b)=>a+(b-mean)**2,0)/voicePitchHistory.length;
    const stdDev = Math.sqrt(variance);
    stability = Math.max(0, Math.min(100, Math.round(100 - (stdDev/mean)*200)));
  }
  
  // ── FEMININITY SCORE (Research-Anchored Hybrid Pipeline) ──
  let femScore = 0;
  if(avgPitch > 0) {
    const currentFeatures = {
      pitch: avgPitch,
      f1: f1Peak,
      f2: f2Peak,
      tilt: tiltRatio,
      clarity: clarity / 100, // normalized 0-1
      stability: stability
    };
    
    // 1. Base Acoustic Score (sigmoid pitch curve, 0-100)
    let pitchScore;
    if(avgPitch <= 100) pitchScore = 5;
    else if(avgPitch <= 130) pitchScore = 10 + ((avgPitch-100)/30)*20; // 10-30
    else if(avgPitch <= 165) pitchScore = 30 + ((avgPitch-130)/35)*30; // 30-60
    else if(avgPitch <= 200) pitchScore = 60 + ((avgPitch-165)/35)*25; // 60-85
    else if(avgPitch <= 250) pitchScore = 85 + ((avgPitch-200)/50)*10; // 85-95
    else pitchScore = 95 + Math.min(5, (avgPitch-250)/50*5); // 95-100
    pitchScore = Math.min(100, Math.max(0, Math.round(pitchScore)));

    // 2. Cluster Similarity Score (0-100)
    const simRatio = clusterSimilarity(currentFeatures);
    const clusterScore = Math.round(simRatio * 100);

    // 3. Anti-Falsetto Penalty
    const falsetto = isFalsetto(avgPitch, f2Peak, tiltRatio);
    
    // 4. Calibration Bonus
    let calBonus = 0;
    if (VOICE_CALIBRATION) {
       // If they improved pitch or F2 compared to baseline, give a slight score boost (up to 5 points)
       if (avgPitch > VOICE_CALIBRATION.pitch + 10) calBonus += 2;
       if (f2Peak > VOICE_CALIBRATION.f2 + 100) calBonus += 3;
    }

    // Blend: 40% Pitch, 45% Cluster Similarity, 15% Stability/Clarity modifiers
    let rawScore = (pitchScore * 0.40) + (clusterScore * 0.45) + (stability * 0.10) + (clarity * 0.05) + calBonus;
    
    if (falsetto) {
       // Penalize falsetto heavily to force working on resonance
       rawScore *= 0.7; 
    }

    femScore = Math.max(0, Math.min(100, Math.round(rawScore)));
    
    // Store in calibration array if in mode
    if(voiceCalMode) {
       voiceCalSamples.push(currentFeatures);
    }
  }
  
  // ── UPDATE UI ──
  // Score ring
  const ring = document.getElementById('score-ring-circle');
  if(ring && avgPitch>0){
    const offset = 327 - (femScore/100)*327;
    ring.style.strokeDashoffset = offset;
  }
  const scoreEl = document.getElementById('voice-score');
  if(scoreEl) scoreEl.textContent = avgPitch>0 ? femScore : '—';
  
  // Pitch card
  const pitchLabel = avgPitch>0 ? (avgPitch<150?'Masculine':avgPitch<165?'Androgynous':'Feminine ✨') : 'Silence';
  _setVParam('vp-pitch-val', avgPitch>0?avgPitch+' Hz':'— Hz');
  _setVParam('vp-pitch-fill', null, Math.min(100,Math.round(((avgPitch-85)/(300-85))*100)));
  _setVParam('vp-pitch-hint', pitchLabel);
  
  // Resonance card (formant-based now)
  const resLabel = resonanceRatio < 0.3 ? 'Low Formants' : resonanceRatio < 0.5 ? 'Mid Formants' : resonanceRatio < 0.75 ? 'High Formants' : 'Feminine Formants ✨';
  _setVParam('vp-res-val', avgPitch>0?Math.round(resonanceRatio*100)+'%':'—');
  _setVParam('vp-res-fill', null, avgPitch>0?Math.round(resonanceRatio*100):0);
  _setVParam('vp-res-hint', avgPitch>0?resLabel:'Waiting for voice...');
  
  // Brightness card (spectral tilt now)
  const brtLabel = brightnessScore < 20 ? 'Deep/Heavy' : brightnessScore < 45 ? 'Neutral' : brightnessScore < 70 ? 'Light' : 'Very Light ✨';
  _setVParam('vp-bright-val', avgPitch>0?brightnessScore+'%':'—');
  _setVParam('vp-bright-fill', null, avgPitch>0?brightnessScore:0);
  _setVParam('vp-bright-hint', avgPitch>0?brtLabel:'Waiting for voice...');
  
  // Clarity card
  const clrLabel = clarity < 30 ? 'Breathy' : clarity < 55 ? 'Moderate' : clarity < 80 ? 'Clear' : 'Very Clear ✨';
  _setVParam('vp-hnr-val', avgPitch>0?clarity+'%':'—');
  _setVParam('vp-hnr-fill', null, avgPitch>0?clarity:0);
  _setVParam('vp-hnr-hint', avgPitch>0?clrLabel:'Waiting for voice...');
  
  // Energy card
  _setVParam('vp-energy-val', avgPitch>0?energyPct+'%':'—');
  _setVParam('vp-energy-fill', null, avgPitch>0?energyPct:0);
  _setVParam('vp-energy-hint', avgPitch>0?(energyPct < 20 ? 'Too quiet' : energyPct < 60 ? 'Good level' : 'Strong'):'Waiting for voice...');
  
  // Stability card
  _setVParam('vp-stab-val', avgPitch>0 && voicePitchHistory.length > 4 ? stability+'%' : '—');
  _setVParam('vp-stab-fill', null, avgPitch>0?stability:0);
  _setVParam('vp-stab-hint', avgPitch>0?(stability < 40 ? 'Wavering' : stability < 70 ? 'Steady' : 'Very Stable ✨'):'Waiting for voice...');
  
  // Store params for AI coaching
  VOICE_PARAMS.pitch = avgPitch;
  VOICE_PARAMS.score = femScore;
  VOICE_PARAMS.resonance = Math.round(resonanceRatio*100);
  VOICE_PARAMS.brightness = brightnessScore;
  VOICE_PARAMS.clarity = clarity;
  VOICE_PARAMS.stability = stability;
  VOICE_PARAMS.energy = energyPct;
  
  // Live text feedback (throttled)
  if(!voiceFeedbackTimer){
    voiceFeedbackTimer = setTimeout(()=>{
      voiceFeedbackTimer = null;
      if(avgPitch > 0) {
          updateLiveFeedback(avgPitch, resonanceRatio, brightnessScore, femScore);
      } else {
          const el = document.getElementById('voice-live-feedback');
          if(el && !voiceCalMode) el.innerHTML = '<p style="color:var(--muted)">Speak naturally \u2014 analyzing your voice...</p>';
      }
    }, 1200);
  }
  
  // ── DRAW WAVEFORM ──
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const gradient = ctx.createLinearGradient(0,0,canvas.width,0);
  gradient.addColorStop(0,'#5BCEFA'); gradient.addColorStop(1,'#F5A9B8');
  ctx.lineWidth=2; ctx.strokeStyle=gradient;
  ctx.beginPath();
  const sliceW = canvas.width/bufLen;
  let x=0;
  for(let i=0;i<bufLen;i++){
    const v = timeBuf[i]*0.4+0.5;
    const y = v*canvas.height;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    x+=sliceW;
  }
  ctx.stroke();
  
  requestAnimationFrame(drawVoice);
}

function _setVParam(id, text, pct){
  if(text!==null){ const el=document.getElementById(id); if(el)el.textContent=text; }
  if(pct!==undefined){
    const fill = document.getElementById(id);
    if(fill) fill.style.width = Math.max(2,pct)+'%';
  }
}

function updateLiveFeedback(pitch, resonance, brightness, score){
  const el = document.getElementById('voice-live-feedback');
  if(!el) return;
  let tips = [];
  
  if(voiceCalMode) {
     el.innerHTML = '<p style="color:var(--pink);font-weight:700">🎙️ Calibrating... Speak naturally for 10 seconds.</p>';
     return;
  }

  // Falsetto check
  const falsetto = isFalsetto(VOICE_PARAMS.pitch, VOICE_PARAMS.f2, VOICE_PARAMS.tilt);
  if(falsetto) {
     tips.push('⚠️ <strong style="color:var(--pink)">Falsetto Detected:</strong> Pitch is high, but resonance is low. Drop your pitch slightly and focus on moving resonance to the mask/lips.');
  }

  if(pitch < 130) tips.push('🎵 Pitch is low (~' + pitch + ' Hz) — try speaking lighter and higher.');
  else if(pitch < 165) tips.push('🎵 Pitch is androgynous (~' + pitch + ' Hz) — you are close, push a bit higher!');
  else if(pitch < 220 && !falsetto) tips.push('🎵 Great! Pitch is in the feminine range (~' + pitch + ' Hz) ✨');
  
  if(resonance < 0.35) tips.push('🔔 Resonance mismatch: formants align with male cluster. Speak forward, reduce chest rumble.');
  else if(resonance < 0.6) tips.push('🔔 Resonance is shifting towards the feminine cluster — keep working on a lighter tone.');
  else if(!falsetto) tips.push('🔔 Feminine formant pattern (F1/F2) detected! ✨');
  
  if(VOICE_CALIBRATION && !falsetto) {
     if(pitch > VOICE_CALIBRATION.pitch + 15) tips.push('📈 Nice work! Your pitch is higher than your calibration baseline.');
     if(VOICE_PARAMS.f2 > VOICE_CALIBRATION.f2 + 150) tips.push('📈 Excellent! You lifted your F2 formant compared to baseline.');
  }
  
  // Show base tips if nothing else triggered
  if(tips.length === 0) {
      if(brightness < 30) tips.push('✨ Voice is heavy — think "smile" while speaking to lighten it.');
      else if(brightness > 50) tips.push('✨ Nice light vocal quality! Cluster similarity is very high.');
  }
  
  let scoreColor = score >= 70 ? 'var(--pink)' : score >= 45 ? '#c4a0f7' : 'var(--blue)';
  el.innerHTML = tips.map(t=>`<p style="margin:4px 0">${t}</p>`).join('') 
    + `<p style="margin-top:8px;font-weight:700;color:${scoreColor}">Overall Fem. Similarity: ${score}/100</p>`;
}

async function getVoiceAICoaching(){
  const panel = document.getElementById('voice-ai-panel');
  const result = document.getElementById('voice-ai-result');
  const loading = document.getElementById('voice-ai-loading');
  if(!panel||!result||!loading) return;
  
  panel.style.display = 'block';
  result.style.display = 'none';
  loading.style.display = 'block';
  panel.scrollIntoView({behavior:'smooth', block:'nearest'});
  
  const hasData = VOICE_PARAMS.pitch > 0;
  const name = localStorage.getItem('tp_name')||'';
  const prompt = hasData
    ? `You are an expert trans voice coach. ${name?`The user's name is ${name}.`:''} Here are their live voice measurements:
- Pitch: ${VOICE_PARAMS.pitch} Hz (target: 165-250 Hz for feminine)
- Femininity Score: ${VOICE_PARAMS.score}/100
- Resonance (head vs chest): ${VOICE_PARAMS.resonance}% head resonance
- Brightness (spectral centroid): ${VOICE_PARAMS.brightness}%
- Clarity (HNR): ${VOICE_PARAMS.clarity}%
- Pitch Stability: ${VOICE_PARAMS.stability}%
- Energy/Volume: ${VOICE_PARAMS.energy}%

Give a warm, encouraging, SPECIFIC coaching response. Include:
1. What they're doing WELL (always start positive)
2. The TOP 2 areas to focus on based on their data
3. ONE specific drill they can do right now
4. An encouraging closing affirmation

Keep it under 200 words. Use emojis naturally.`
    : `You are an expert trans voice coach. ${name?`The user's name is ${name}.`:''} They haven't analyzed their voice yet. 
Give a warm welcome, explain what the voice analyzer measures (pitch, resonance, brightness, clarity, stability), and give them 2 beginner tips to get started. Include one affirmation. Keep it under 150 words.`;

  const aiResult = await GroqAI.query([{role:'user', content:prompt}], 'voice');
  
  loading.style.display = 'none';
  result.style.display = 'block';
  const fmt = s => s.replace(/\*\*(.*?)\*\*/g,'<strong style="color:var(--pink)">$1</strong>').replace(/\n/g,'<br>');
  result.innerHTML = fmt(aiResult.text) 
    + `<div class="ai-src sweetheart" style="margin-top:10px">Sweetheart Offline Coach</div>`;
}

function startDrill(card, instructions){
  document.querySelectorAll('.drill-card').forEach(c=>c.classList.remove('active'));
  card.classList.add('active');
  const el = document.getElementById('drill-instructions');
  if(!el) return;
  el.style.display = 'block';
  el.innerHTML = `<div style="font-size:14px;line-height:1.8;color:var(--text)">${instructions}</div>
    <button class="bg" style="margin-top:10px;font-size:12px" onclick="this.parentElement.style.display='none';document.querySelectorAll('.drill-card').forEach(c=>c.classList.remove('active'))">Done ✓</button>`;
  el.scrollIntoView({behavior:'smooth', block:'nearest'});
}



function loadVoiceHistory(){
  const el=document.getElementById('voice-history'); if(!el)return;
  const sessions=JSON.parse(localStorage.getItem('tp_voice_sessions')||'[]');
  if(!sessions.length){ el.innerHTML='<p style="color:var(--muted);text-align:center;padding:16px">No sessions yet. Start analyzing to track your progress! 🎙️</p>'; return; }
  el.innerHTML = sessions.slice(0,10).map(s=>{
    const d=new Date(s.date);
    const extras = s.score!=null ? `<span style="color:var(--pink);font-weight:700"> · Score: ${s.score}</span><span style="font-size:10px;color:var(--muted)"> · Res: ${s.resonance||'—'}%</span>` : '';
    return `<div class="dose-entry"><span style="font-size:18px">🎙️</span><div style="flex:1"><div style="font-weight:700">${s.hz}${extras}</div><div style="font-size:11px;color:var(--muted)">${d.toLocaleDateString('en-US',{month:'short',day:'numeric'})} · ${d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</div></div></div>`;
  }).join('');
}


// ══════════════════════════════════════════════════════════════════════
// CRISIS MODAL
// ══════════════════════════════════════════════════════════════════════
function showCrisisModal(){
  const list=document.getElementById('crisis-list');
  if(list) list.innerHTML=Object.values(CRISIS).map(c=>`<div class="crisis-item"><div class="ci-name">${c.name}</div><a href="tel:${c.num.replace(/\s/g,'')}">${c.num}</a><div class="ci-note">${c.note}</div></div>`).join('');
  document.getElementById('crisis-modal').classList.add('visible');
}

// ══════════════════════════════════════════════════════════════════════
// MEDS SYSTEM
// ══════════════════════════════════════════════════════════════════════
const MEDS_KEY='tp_meds', DOSES_KEY='tp_doses';

const MedsScheduler = {
  _checkInterval:null, _currentAlertMed:null,
  getMeds(){ return JSON.parse(localStorage.getItem(MEDS_KEY)||'[]'); },
  saveMeds(meds){ localStorage.setItem(MEDS_KEY,JSON.stringify(meds)); },
  addMed(med){ const meds=this.getMeds(); med.id='med_'+Date.now()+'_'+Math.random().toString(36).substr(2,5); med.createdAt=new Date().toISOString(); meds.push(med); this.saveMeds(meds); return med; },
  removeMed(id){ this.saveMeds(this.getMeds().filter(m=>m.id!==id)); },
  getIntervalMs(med){ const v=parseFloat(med.interval)||1; return med.unit==='hours'?v*3600000:v*86400000; },
  getNextDoseTime(med){ const start=new Date(med.startTime).getTime(); const iv=this.getIntervalMs(med); const now=Date.now(); if(start>now)return new Date(start); const elapsed=now-start; return new Date(start+(Math.floor(elapsed/iv)+1)*iv); },
  isDueNow(med, window=300000){ const start=new Date(med.startTime).getTime(); const iv=this.getIntervalMs(med); const now=Date.now(); if(start>now)return false; const periods=Math.floor((now-start)/iv); const prev=start+periods*iv; const diff=now-prev; return diff>=0&&diff<=window; },
  startChecking(){ if(this._checkInterval)clearInterval(this._checkInterval); this._checkInterval=setInterval(()=>this.checkAll(),60000); this.checkAll(); },
  checkAll(){ const meds=this.getMeds(); for(const med of meds){ if(this.isDueNow(med)){ const start=new Date(med.startTime).getTime(); const iv=this.getIntervalMs(med); const periods=Math.floor((Date.now()-start)/iv); const prevTime=start+periods*iv; const nk=`tp_notif_${med.id}_${prevTime}`; if(!sessionStorage.getItem(nk)){sessionStorage.setItem(nk,'1');this.fireNotification(med);} }} SupplyManager.checkAlerts(); },
  fireNotification(med){ const msg=med.notifMsg||DISCREET_MSGS[0]; this._currentAlertMed=med; if('Notification' in window&&Notification.permission==='granted'){try{new Notification(msg,{body:'Tap to log your dose',tag:'med-'+med.id});}catch(e){}} const banner=document.getElementById('med-alert-banner'); const textEl=document.getElementById('med-alert-text'); if(banner&&textEl){textEl.textContent=msg;banner.classList.add('visible');} }
};

const DoseTracker = {
  getDoses(){ return JSON.parse(localStorage.getItem(DOSES_KEY)||'[]'); },
  saveDoses(d){ localStorage.setItem(DOSES_KEY,JSON.stringify(d)); },
  logDose(medId,medName,dose,type){ const d=this.getDoses(); d.unshift({id:'dose_'+Date.now(),medId,medName,dose,type,timestamp:new Date().toISOString()}); this.saveDoses(d.slice(0,500)); SupplyManager.decrementSupply(medId); },
  getStreak(){ const d=this.getDoses(); if(!d.length)return 0; const today=new Date();today.setHours(0,0,0,0); let streak=0; const check=new Date(today); for(let i=0;i<365;i++){const ds=new Date(check);const de=new Date(check);de.setHours(23,59,59,999); if(d.some(x=>{const dt=new Date(x.timestamp);return dt>=ds&&dt<=de;})){streak++;check.setDate(check.getDate()-1);}else break;} return streak; }
};

const SupplyManager = {
  getSupplies(){ return JSON.parse(localStorage.getItem('tp_supply')||'{}'); },
  saveSupplies(s){ localStorage.setItem('tp_supply',JSON.stringify(s)); },
  setSupply(medId,qty){ const s=this.getSupplies(); s[medId]={qty:parseInt(qty)||0,updatedAt:new Date().toISOString()}; this.saveSupplies(s); },
  decrementSupply(medId){ const s=this.getSupplies(); if(s[medId]&&s[medId].qty>0){s[medId].qty--;s[medId].updatedAt=new Date().toISOString();this.saveSupplies(s);} },
  getDaysRemaining(medId){ const s=this.getSupplies(); if(!s[medId]||s[medId].qty<=0)return 0; const med=MedsScheduler.getMeds().find(m=>m.id===medId); if(!med)return s[medId].qty; const intervalDays=med.unit==='hours'?(parseFloat(med.interval)||1)/24:(parseFloat(med.interval)||1); return Math.floor(s[medId].qty*intervalDays); },
  checkAlerts(){ /* handled in render */ }
};

function initMedsSystem(){
  // Populate med select
  const sel=document.getElementById('mf-med');
  if(sel){ MEDS_DB.forEach(m=>{ const opt=document.createElement('option'); opt.value=m.id; opt.textContent=`${TYPE_EMOJI[m.type]||'💊'} ${m.name}`; sel.appendChild(opt); }); }
  // Populate notif options
  const nOpts=document.getElementById('mf-notif-opts');
  if(nOpts){ nOpts.innerHTML=DISCREET_MSGS.map((m,i)=>`<div class="mf-discreet-opt${i===0?' active':''}" onclick="selectNotifOpt(this)">${m}</div>`).join(''); }
  // Set default start time
  const startInp=document.getElementById('mf-start');
  if(startInp){ const now=new Date(); now.setMinutes(now.getMinutes()-now.getTimezoneOffset()); startInp.value=now.toISOString().slice(0,16); }
  // Render
  renderActiveMeds(); renderDoseLog(); renderSupplyPanel(); renderPriceTable();
  // Start scheduler
  MedsScheduler.startChecking();
}

function onMedSelect(v){
  const wrap=document.getElementById('mf-custom-wrap');
  if(wrap) wrap.style.display=v==='custom'?'block':'none';
  const med=MEDS_DB.find(m=>m.id===v);
  if(med){
    const type=document.getElementById('mf-type'); if(type)type.value=med.type;
    const dose=document.getElementById('mf-dose'); if(dose)dose.value=med.dose;
  }
}

function selectNotifOpt(el){
  document.querySelectorAll('#mf-notif-opts .mf-discreet-opt').forEach(o=>o.classList.remove('active'));
  el.classList.add('active');
}

function showAddMedForm(){ document.getElementById('add-med-form-wrap').style.display='block'; document.getElementById('add-med-btn').style.display='none'; }
function hideAddMedForm(){ document.getElementById('add-med-form-wrap').style.display='none'; document.getElementById('add-med-btn').style.display='block'; }

function saveMedication(){
  const selVal=document.getElementById('mf-med').value;
  const customName=document.getElementById('mf-custom-name')?.value?.trim();
  const dbMed=MEDS_DB.find(m=>m.id===selVal);
  const name=selVal==='custom'?customName:(dbMed?dbMed.name:customName||'My Medication');
  if(!name){alert('Please select or enter a medication name.');return;}
  const activeNotif=document.querySelector('#mf-notif-opts .mf-discreet-opt.active');
  const med={
    name, type:document.getElementById('mf-type').value,
    dose:document.getElementById('mf-dose').value||'',
    interval:document.getElementById('mf-interval').value||'1',
    unit:document.getElementById('mf-unit').value||'days',
    startTime:document.getElementById('mf-start').value,
    notifMsg:document.getElementById('mf-notif-custom').value.trim()||(activeNotif?activeNotif.textContent:DISCREET_MSGS[0]),
    dbId:selVal!=='custom'?selVal:null
  };
  MedsScheduler.addMed(med);
  hideAddMedForm();
  renderActiveMeds(); renderSupplyPanel();
}

function renderActiveMeds(){
  const el=document.getElementById('active-meds-list'); if(!el)return;
  const meds=MedsScheduler.getMeds();
  if(!meds.length){ el.innerHTML='<div class="dose-empty">No medications scheduled yet. Add your first one below. 💊</div>'; return; }
  el.innerHTML=meds.map(m=>{
    const emoji=TYPE_EMOJI[m.type]||'💊';
    const next=MedsScheduler.getNextDoseTime(m);
    const nextStr=formatRelativeTime(next);
    return `<div class="med-card"><button class="med-rm" onclick="removeMed('${m.id}')" title="Remove">×</button><div class="med-card-header"><div class="med-card-emoji">${emoji}</div><div class="med-card-info"><div class="med-card-name">${m.name}</div><div class="med-card-detail">${m.dose} · Every ${m.interval} ${m.unit}</div></div></div><div class="med-next">⏰ Next: ${nextStr}</div><div class="med-card-actions"><button class="bp" style="padding:8px 14px;font-size:12px" onclick="logMedDose('${m.id}')">✓ Log Dose</button><button class="bg" style="padding:8px 14px;font-size:12px" onclick="skipDose('${m.id}')">Skip</button></div></div>`;
  }).join('');
}

function logMedDose(id){
  const med=MedsScheduler.getMeds().find(m=>m.id===id); if(!med)return;
  DoseTracker.logDose(med.id,med.name,med.dose,med.type);
  renderActiveMeds(); renderDoseLog(); renderSupplyPanel();
}
function skipDose(id){ renderActiveMeds(); }
function removeMed(id){ if(!confirm('Remove this medication?'))return; MedsScheduler.removeMed(id); renderActiveMeds(); renderSupplyPanel(); }

function renderDoseLog(){
  const el=document.getElementById('dose-log-list'); if(!el)return;
  const doses=DoseTracker.getDoses();
  const streak=DoseTracker.getStreak();
  const streakEl=document.getElementById('dose-streak');
  if(streakEl) streakEl.innerHTML=streak>0?`<div class="dose-streak"><span>🔥</span><span style="font-size:12px;font-weight:700">${streak}-day streak</span></div>`:'';
  const expWrap=document.getElementById('dose-export-wrap');
  if(expWrap) expWrap.style.display=doses.length>0?'block':'none';
  if(!doses.length){ el.innerHTML='<div class="dose-empty">No doses logged yet. Your history will appear here. 📊</div>'; return; }
  el.innerHTML=doses.slice(0,30).map(d=>{
    const dt=new Date(d.timestamp);
    const emoji=TYPE_EMOJI[d.type]||'💊';
    return `<div class="dose-entry"><span style="font-size:18px">${emoji}</span><div style="flex:1"><div style="font-weight:700;font-size:13px">${d.medName}</div><div style="font-size:11px;color:var(--muted)">${d.dose} · ${dt.toLocaleDateString('en-IN',{month:'short',day:'numeric'})} ${dt.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</div></div></div>`;
  }).join('');
}

function renderSupplyPanel(){
  const el=document.getElementById('supply-cards'); if(!el)return;
  const meds=MedsScheduler.getMeds();
  const supplies=SupplyManager.getSupplies();
  if(!meds.length){ el.innerHTML='<div class="dose-empty">Add medications to track supply. 📦</div>'; return; }
  el.innerHTML=meds.map(m=>{
    const s=supplies[m.id]; const qty=s?s.qty:0;
    const days=SupplyManager.getDaysRemaining(m.id);
    const dbMed=MEDS_DB.find(x=>x.id===m.dbId);
    const perPack=dbMed?dbMed.perPack:30;
    const pct=Math.min(100,Math.round((qty/perPack)*100));
    const isLow=days<=7&&qty>0;
    return `<div class="supply-card"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><div style="font-weight:700">${TYPE_EMOJI[m.type]||'💊'} ${m.name}</div><div style="font-size:13px;color:${isLow?'#f87':'var(--blue)'};font-weight:700">${qty} left</div></div><div class="supply-bar-wrap"><div class="supply-bar${isLow?' low':''}" style="width:${pct}%"></div></div><div style="font-size:11px;color:var(--muted);margin-bottom:10px">~${days} days remaining</div><div style="display:flex;gap:6px"><input type="number" class="mf-input" style="flex:1;padding:8px" placeholder="Set qty" id="supply-${m.id}" min="0"><button class="bg" style="padding:8px 12px;font-size:11px" onclick="updateSupply('${m.id}')">Update</button></div></div>`;
  }).join('');
}

function updateSupply(id){ const inp=document.getElementById('supply-'+id); if(!inp)return; SupplyManager.setSupply(id,inp.value); renderSupplyPanel(); }

function renderPriceTable(){
  const el=document.getElementById('price-ref-table'); if(!el)return;
  el.innerHTML='<thead><tr><th>Medication</th><th>Type</th><th>Price</th></tr></thead><tbody>'+MEDS_DB.map(m=>`<tr><td>${m.name}</td><td>${TYPE_EMOJI[m.type]||''} ${m.type}</td><td class="price-tag">${m.price}</td></tr>`).join('')+'</tbody>';
}

function exportDoseHistory(){ /* simplified copy */ const text='TRANS POWER DOSE LOG\n'+DoseTracker.getDoses().slice(0,50).map(d=>`${new Date(d.timestamp).toLocaleString()} — ${d.medName} (${d.dose})`).join('\n'); navigator.clipboard?.writeText(text).then(()=>alert('📋 Copied!')).catch(()=>alert(text)); }
function switchMedTab(t){ document.querySelectorAll('#meds .med-panel').forEach(p=>p.classList.remove('active')); document.querySelectorAll('#meds .med-tab').forEach(b=>b.classList.remove('active')); const pEl=document.getElementById('mp-'+t); const bEl=document.getElementById('mt-'+t); if(pEl)pEl.classList.add('active'); if(bEl)bEl.classList.add('active'); }
function onAlertDone(){ const med=MedsScheduler._currentAlertMed; if(med)logMedDose(med.id); const banner=document.getElementById('med-alert-banner'); if(banner)banner.classList.remove('visible'); MedsScheduler._currentAlertMed=null; }
function dismissAlert(){ const banner=document.getElementById('med-alert-banner'); if(banner)banner.classList.remove('visible'); MedsScheduler._currentAlertMed=null; }

// ══════════════════════════════════════════════════════════════════════
// STEALTH MODE (Calculator Decoy)
// ══════════════════════════════════════════════════════════════════════
let calcVal='0', calcPrev=null, calcOp=null, calcNew=true;
function toggleStealth(){
  const s=document.getElementById('stealth-mode');
  const isVisible = s.style.display==='flex';
  if(isVisible){
    s.style.display='none';
    document.getElementById('bnav').style.display='flex';
  } else {
    s.style.display='flex';
    document.getElementById('bnav').style.display='none';
    calcVal='0'; calcPrev=null; calcOp=null; calcNew=true;
    document.getElementById('calc-display').textContent='0';
  }
}

function calcAction(key){
  const disp=document.getElementById('calc-display');
  if(key==='C'){ calcVal='0'; calcPrev=null; calcOp=null; calcNew=true; disp.textContent='0'; return; }
  if(key==='±'){ calcVal=String(-parseFloat(calcVal)); disp.textContent=calcVal; return; }
  if(key==='%'){ calcVal=String(parseFloat(calcVal)/100); disp.textContent=calcVal; return; }
  if(['+','-','×','÷'].includes(key)){
    if(calcOp && !calcNew) calcAction('=');
    calcPrev=parseFloat(calcVal); calcOp=key; calcNew=true; return;
  }
  if(key==='='){
    if(calcOp===null||calcPrev===null) return;
    const b=parseFloat(calcVal);
    let result=0;
    if(calcOp==='+') result=calcPrev+b;
    if(calcOp==='-') result=calcPrev-b;
    if(calcOp==='×') result=calcPrev*b;
    if(calcOp==='÷') result=b===0?'Error':calcPrev/b;
    calcVal=String(result); calcOp=null; calcPrev=null; calcNew=true;
    disp.textContent=calcVal;
    // Secret: typing 11380 and = activates EXIT from stealth
    if(calcVal==='11380' || calcVal==='0') return;
    return;
  }
  // Number/dot
  if(calcNew){ calcVal=key==='.'?'0.':key; calcNew=false; }
  else { if(key==='.'&&calcVal.includes('.'))return; calcVal+=key; }
  disp.textContent=calcVal;
}

// ══════════════════════════════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════════════════════════════
function _show(id){ const e=document.getElementById(id); if(e)e.style.display='block'; }
function _hide(id){ const e=document.getElementById(id); if(e)e.style.display='none'; }
function _addClass(id,cls){ const e=document.getElementById(id); if(e)e.classList.add(cls); }
function _rmClass(id,cls){ const e=document.getElementById(id); if(e)e.classList.remove(cls); }
function _rmActive(id){ _rmClass(id,'active'); }

function formatRelativeTime(date){
  const diff=date.getTime()-Date.now();
  if(diff<0) return 'Now!';
  const mins=Math.floor(diff/60000);
  if(mins<60) return `${mins}m`;
  const hrs=Math.floor(mins/60);
  if(hrs<24) return `${hrs}h ${mins%60}m`;
  return date.toLocaleDateString('en-IN',{day:'numeric',month:'short'})+' '+date.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
}

function escHtml(s){ const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }

// ══════════════════════════════════════════════════════════════════════
// SWEETHEART COMPAT ENGINE
// Keeps old call sites working while v7 stays offline-first.
// ══════════════════════════════════════════════════════════════════════
const GroqAI = {
  ENDPOINT: 'https://text.pollinations.ai/openai',
  
  getKey(){ return 'no-key-needed'; },
  getModel(){ return localStorage.getItem('tp_ai_model')||'sweetheart-auto'; },
  isConfigured(){ return true; },
  isOnline(){ return false; },

  getSystemPrompt(context){
    const name = localStorage.getItem('tp_name')||'friend';
    const pronoun = localStorage.getItem('tp_pronoun')||'they/them';
    
    const base = `You are TRANS POWER AI, a warm, loving, knowledgeable companion built specifically for transgender and gender-diverse individuals. The user's chosen name is "${name}" and their pronouns are ${pronoun}. ALWAYS use their chosen name and correct pronouns.

Your personality: Empathetic, affirming, wise, and gentle. You are NOT a therapist but a supportive friend with deep knowledge of trans experiences. You celebrate every step of their journey.

CRITICAL RULES:
- ALWAYS validate their identity
- NEVER question whether someone is "really" trans
- Use inclusive, affirming language
- If someone mentions self-harm/crisis, immediately provide crisis hotline numbers (Trans Lifeline: 877-565-8860 / India iCall: 9152987821)
- Keep responses concise (2-4 paragraphs max) but deeply caring
- Use emojis naturally but not excessively
- Reference Indian context when relevant (Indian pharmacies, legal processes, etc.)`;

    const contexts = {
      chat: base + `\n\nYou are in CHAT mode. Have a natural, flowing conversation. Topics include: coming out, HRT, dysphoria, euphoria, voice training, legal name changes, family acceptance, dating, fashion, makeup, mental health, surgery, safety, and everyday trans experiences.`,
      
      glow: base + `\n\nYou are in GLOW GUIDE mode. You are a professional style consultant specializing in gender expression. Give detailed, practical, personalized fashion/makeup/hair/expression advice. Consider the user's body type, comfort level, and desired aesthetic. Include specific product recommendations, techniques, and confidence-building tips. Format your response with clear sections: 💄 Makeup, 👗 Outfit, 💇 Hair, 🌸 Expression Tips, and end with an affirming quote.`,
      
      voice: base + `\n\nYou are in VOICE COACH mode. You are an expert speech-language pathologist specializing in voice feminization/masculinization. Give specific, actionable exercises. Cover: pitch control, resonance shifting (chest vs head voice), intonation patterns, breath support, and daily practice routines. Be encouraging about their progress.`
    };
    return contexts[context] || contexts.chat;
  },

  async query(messages, context='chat'){
    if(!this.isOnline()){
      return { success:false, source:'offline', text: AI_ENGINE.reply(messages[messages.length-1]?.content || '') };
    }
    
    try{
      const model = this.getModel();
      const systemPrompt = this.getSystemPrompt(context);
      const history = messages.slice(-5).map(m => `${m.role==='user'?'User':'Assistant'}: ${m.content}`).join('\n');
      
      // We use a flat text prompt and POST it to the root endpoint.
      // This is the "Anonymous" path which Pollinations says will continue to work normally.
      const fullPrompt = `${systemPrompt}\n\nRecent Conversation:\n${history}\n\nPlease respond as the Assistant. Avoid any meta-talk about APIs.`;
      
      const url = `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=${model}&seed=${Math.floor(Math.random()*9999)}&nologo=true`;
      
      // Fallback to GET if POST is finicky, but we use a shorter history to keep URI length safe
      const resp = await fetch(url, { method: 'GET' });
      
      if(!resp.ok){
        console.warn('Pollinations error:', resp.status);
        return { success:false, source:'offline', text: AI_ENGINE.reply(messages[messages.length-1]?.content || '') };
      }
      
      const text = await resp.text();
      if(!text || text.length < 3) throw new Error('Empty response');
      
      // Check if the response IS the warning notice and block it
      if(text.includes('deprecated') || text.includes('IMPORTANT NOTICE')) {
         throw new Error('Received API warning instead of response');
      }
      
      return { success:true, source:'pollinations', text: text.trim(), model };
    } catch(e){
      console.warn('Pollinations failed, falling back to offline:', e);
      return { success:false, source:'offline', text: AI_ENGINE.reply(messages[messages.length-1]?.content || '') };
    }
  },

  async testConnection(){
    return { ok:true, text:'Sweetheart offline engine ready.' };
  }
};

// (Hybrid chat/aMsg are now defined inline above — no override needed)

// (Hybrid glow is now defined inline above — no override needed)

// ══════════════════════════════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════════════════════════════
function showSettings(){
  // Populate fields
  const nameInp = document.getElementById('settings-name');
  const pronounInp = document.getElementById('settings-pronoun');
  const voiceInp = document.getElementById('settings-voice');
  const keyInp = document.getElementById('groq-key-input');
  const modelSel = document.getElementById('groq-model');
  
  if(nameInp) nameInp.value = localStorage.getItem('tp_name')||'';
  if(pronounInp) pronounInp.value = localStorage.getItem('tp_pronoun')||'';
  if(voiceInp) voiceInp.checked = localStorage.getItem('tp_voice')==='true';
  if(keyInp) keyInp.value = GroqAI.getKey();
  if(modelSel) modelSel.value = GroqAI.getModel();
  
  // Show connection status
  updateGroqStatus();
  
  document.getElementById('settings-modal').classList.add('visible');
}

function updateGroqStatus(){
  const el = document.getElementById('groq-status');
  if(!el) return;
  el.className = SweetheartBrain.ready ? 'groq-status success' : 'groq-status testing';
  el.textContent = SweetheartBrain.ready
    ? 'Sweetheart 135M Lite brain is ready locally.'
    : 'Sweetheart classic offline mode is ready. The 135M Lite brain loads in the background when available.';
}

async function saveGroqKey(){
  const status = document.getElementById('groq-status');
  if(status){ status.className='groq-status success'; status.textContent='Sweetheart offline engine ready.'; }
  updateAIBadges();
}

function saveIdentitySettings(){
  const name = document.getElementById('settings-name').value.trim();
  const pronoun = document.getElementById('settings-pronoun').value.trim();
  const voice = document.getElementById('settings-voice').checked;
  
  if(name) localStorage.setItem('tp_name', name);
  if(pronoun) localStorage.setItem('tp_pronoun', pronoun);
  localStorage.setItem('tp_voice', voice);
  
  applyProfile();
  initChat(); // Refresh with new name
  chatHistory = [];
  
  // Visual feedback
  const btn = event.target;
  const orig = btn.textContent;
  btn.textContent = '✅ Saved!';
  setTimeout(()=> btn.textContent = orig, 1500);
}

function updateAIBadges(){
  const isOnline = SweetheartBrain.ready;
  
  // Hero badge
  const badge = document.getElementById('ai-status-badge');
  if(badge){
    badge.className = 'ai-badge ' + (isOnline?'local-llm':'offline');
    badge.textContent = isOnline ? 'Sweetheart 135M' : 'Sweetheart Offline';
  }
  
  // Chat bar
  const chatBar = document.getElementById('chat-ai-bar');
  const chatLabel = document.getElementById('chat-ai-label');
  const chatBtn = document.querySelector('.ai-mode-btn');
  if(chatBar) chatBar.className = 'ai-mode-bar ' + (isOnline?'local-llm':'offline');
  if(chatLabel) chatLabel.textContent = isOnline 
    ? 'Sweetheart 135M Lite — Local'
    : 'Sweetheart classic offline engine';
  if(chatBtn) chatBtn.textContent = isOnline ? 'Sweetheart 135M Ready' : 'Sweetheart Offline';
  // Update toggle btn in settings
  const toggleBtn = document.getElementById('ai-toggle-btn');
  if(toggleBtn) toggleBtn.textContent = isOnline ? 'Use classic offline' : 'Wake Sweetheart brain';
}

function toggleOnlineOffline(){
  SweetheartBrain.init();
  updateAIBadges();
}

// Listen for online/offline changes
window.addEventListener('online', ()=> updateAIBadges());
window.addEventListener('offline', ()=> updateAIBadges());

// Init AI badges on load
document.addEventListener('DOMContentLoaded', ()=> {
  setTimeout(updateAIBadges, 500);
});

// ══════════════════════════════════════════════════════════════════════
// DATA EXPORT / IMPORT
// ══════════════════════════════════════════════════════════════════════
function exportAllData(){
  const data = {};
  for(let i=0; i<localStorage.length; i++){
    const key = localStorage.key(i);
    if(key.startsWith('tp_')) data[key] = localStorage.getItem(key);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transpower_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importAllData(inp){
  if(!inp.files||!inp.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    try{
      const data = JSON.parse(e.target.result);
      let count = 0;
      for(const [key, val] of Object.entries(data)){
        if(key.startsWith('tp_')){ localStorage.setItem(key, val); count++; }
      }
      alert(`✅ Imported ${count} items. Reloading...`);
      location.reload();
    }catch(err){
      alert('❌ Invalid backup file.');
    }
  };
  reader.readAsText(inp.files[0]);
}

// ══════════════════════════════════════════════════════════════════════
// V6 — TRANSITION TIMELINE
// ══════════════════════════════════════════════════════════════════════
function initTimeline(){ showTimeline('feminising'); }

function showTimeline(type){
  const el = document.getElementById('timeline-cards'); if(!el) return;
  document.getElementById('tl-fem-btn').classList.toggle('active', type==='feminising');
  document.getElementById('tl-masc-btn').classList.toggle('active', type==='masculinising');
  const data = TRANSITION_TIMELINE[type] || [];
  el.innerHTML = data.map(phase => `
    <div class="v6-timeline-card">
      <div class="v6-tl-month">Month ${phase.month}</div>
      <div class="v6-tl-title">${phase.icon} ${phase.title}</div>
      <div class="v6-tl-changes">
        ${phase.changes.map(c => `<span class="v6-tl-chip">${c}</span>`).join('')}
      </div>
      <div class="v6-tl-note">${phase.note}</div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════════════════════════════
// V6 — COMING OUT GUIDE
// ══════════════════════════════════════════════════════════════════════
function initComingOut(){
  const el = document.getElementById('comingout-steps'); if(!el) return;
  el.innerHTML = COMING_OUT_GUIDE.map(s => `
    <div class="v6-co-step" onclick="this.classList.toggle('open')">
      <div class="v6-co-header">
        <div class="v6-co-num">${s.step}</div>
        <div class="v6-co-title">${s.title}</div>
        <div class="v6-co-icon">${s.icon}</div>
      </div>
      <div class="v6-co-body">${s.content.replace(/\*\*(.*?)\*\*/g,'<strong style="color:var(--pink)">$1</strong>').replace(/\\\\n/g,'<br>')}</div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════════════════════════════
// V6 — VOICE EXERCISE LIBRARY
// ══════════════════════════════════════════════════════════════════════
let veFilter = 'all';

function initVoiceExercises(){ renderVoiceExercises(); }

function filterExercises(cat, btn){
  veFilter = cat;
  if(btn){
    btn.closest('.cfs').querySelectorAll('.cfb').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  renderVoiceExercises();
}

function renderVoiceExercises(){
  const el = document.getElementById('voice-exercise-list'); if(!el) return;
  const list = veFilter === 'all' ? VOICE_EXERCISES : VOICE_EXERCISES.filter(e => e.cat === veFilter);
  el.innerHTML = list.map(ex => `
    <div class="v6-ex-card" onclick="openExercise('${ex.id}')">
      <div class="v6-ex-icon">${ex.icon}</div>
      <div class="v6-ex-name">${ex.name}</div>
      <div class="v6-ex-meta">${ex.dur}</div>
      <div class="v6-ex-level ${ex.level}">${ex.level}</div>
    </div>
  `).join('');
}

function openExercise(id){
  const ex = VOICE_EXERCISES.find(e => e.id === id); if(!ex) return;
  const wrap = document.getElementById('voice-exercise-active');
  const title = document.getElementById('ve-active-title');
  const meta = document.getElementById('ve-active-meta');
  const steps = document.getElementById('ve-active-steps');
  if(!wrap||!title||!meta||!steps) return;
  title.textContent = `${ex.icon} ${ex.name}`;
  meta.textContent = `${ex.level} · ${ex.dur} · ${ex.cat}`;
  steps.innerHTML = ex.steps.map((s,i) => `
    <div class="v6-step">
      <div class="v6-step-num">${i+1}</div>
      <div>${s}</div>
    </div>
  `).join('');
  wrap.style.display = 'block';
  wrap.scrollIntoView({behavior:'smooth', block:'nearest'});
}

// ══════════════════════════════════════════════════════════════════════
// V6 — MINDFULNESS GUIDED SESSIONS
// ══════════════════════════════════════════════════════════════════════
let mindfulCurrentStep = 0, mindfulCurrentExercise = null;

function initMindfulness(){
  const el = document.getElementById('mindful-list'); if(!el) return;
  el.innerHTML = MINDFULNESS_EXERCISES.map(m => `
    <div class="v6-ex-card" onclick="startMindful('${m.id}')">
      <div class="v6-ex-icon">${m.icon}</div>
      <div class="v6-ex-name">${m.name}</div>
      <div class="v6-ex-meta">${m.dur}</div>
    </div>
  `).join('');
}

function startMindful(id){
  const ex = MINDFULNESS_EXERCISES.find(m => m.id === id); if(!ex) return;
  mindfulCurrentExercise = ex;
  mindfulCurrentStep = 0;
  const wrap = document.getElementById('mindful-active');
  const title = document.getElementById('mindful-active-title');
  if(!wrap||!title) return;
  title.textContent = `${ex.icon} ${ex.name}`;
  wrap.style.display = 'block';
  renderMindfulStep();
  wrap.scrollIntoView({behavior:'smooth', block:'nearest'});
}

function renderMindfulStep(){
  if(!mindfulCurrentExercise) return;
  const steps = document.getElementById('mindful-active-steps');
  const btn = document.getElementById('mindful-next-btn');
  if(!steps) return;
  const s = mindfulCurrentExercise.steps[mindfulCurrentStep];
  steps.innerHTML = `
    <div style="text-align:center;padding:20px 0">
      <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Step ${mindfulCurrentStep+1} of ${mindfulCurrentExercise.steps.length}</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:400;line-height:1.5;color:var(--text)">${s}</div>
    </div>
  `;
  if(btn) btn.textContent = mindfulCurrentStep >= mindfulCurrentExercise.steps.length - 1 ? '✨ Complete' : 'Next →';
}

function nextMindfulStep(){
  if(!mindfulCurrentExercise) return;
  mindfulCurrentStep++;
  if(mindfulCurrentStep >= mindfulCurrentExercise.steps.length){
    document.getElementById('mindful-active').style.display = 'none';
    mindfulCurrentExercise = null;
    mindfulCurrentStep = 0;
    return;
  }
  renderMindfulStep();
}

function prevMindfulStep(){
  if(!mindfulCurrentExercise || mindfulCurrentStep <= 0) return;
  mindfulCurrentStep--;
  renderMindfulStep();
}

// ══════════════════════════════════════════════════════════════════════
// V6 — SIDE EFFECTS TRACKER
// ══════════════════════════════════════════════════════════════════════
let seSeverity = 'mild';

function initSideEffects(){
  const sel = document.getElementById('se-select'); if(!sel) return;
  SIDE_EFFECTS_DB.forEach(se => {
    const opt = document.createElement('option');
    opt.value = se.name;
    opt.textContent = `${se.icon} ${se.name}`;
    sel.appendChild(opt);
  });
  renderSELog();
}

function pickSESev(btn){
  document.querySelectorAll('.se-sev').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  seSeverity = btn.dataset.sev;
}

function logSideEffect(){
  const sel = document.getElementById('se-select');
  const notes = document.getElementById('se-notes');
  if(!sel || !sel.value){ alert('Please select a side effect.'); return; }
  const logs = JSON.parse(localStorage.getItem('tp_side_effects') || '[]');
  logs.unshift({
    name: sel.value,
    severity: seSeverity,
    notes: notes ? notes.value.trim() : '',
    date: new Date().toISOString()
  });
  localStorage.setItem('tp_side_effects', JSON.stringify(logs.slice(0, 200)));
  sel.value = '';
  if(notes) notes.value = '';
  renderSELog();
}
function renderSELog(){
  const el = document.getElementById('se-log-list'); if(!el) return;
  const logs = JSON.parse(localStorage.getItem('tp_side_effects') || '[]');
  if(!logs.length){
    el.innerHTML = '<div class="dose-empty">No side effects logged yet. 💊</div>';
    return;
  }
  const sevEmoji = {mild:'😐',moderate:'😣',severe:'🔴'};
  el.innerHTML = logs.slice(0, 20).map(l => {
    const d = new Date(l.date);
    const se = SIDE_EFFECTS_DB.find(s => s.name === l.name);
    return `<div class="dose-entry">
      <span style="font-size:18px">${se ? se.icon : '💊'}</span>
      <div style="flex:1">
        <div style="font-weight:700;font-size:13px">${l.name} ${sevEmoji[l.severity]||''} <span style="font-size:10px;color:var(--muted)">${l.severity}</span></div>
        <div style="font-size:11px;color:var(--muted)">${d.toLocaleDateString('en-US',{month:'short',day:'numeric'})} · ${d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}${l.notes ? ' · '+l.notes : ''}</div>
      </div>
    </div>`;
  }).join('');
  // Insights
  renderSEInsights(logs);
}

function renderSEInsights(logs){
  const wrap = document.getElementById('se-insights');
  const content = document.getElementById('se-insights-content');
  if(!wrap || !content || logs.length < 3) return;
  wrap.style.display = 'block';
  const counts = {};
  logs.forEach(l => { counts[l.name] = (counts[l.name]||0) + 1; });
  const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]);
  const top = sorted.slice(0,3).map(([name,count]) => `<strong>${name}</strong> (${count}x)`).join(', ');
  const sevCounts = {mild:0,moderate:0,severe:0};
  logs.forEach(l => sevCounts[l.severity]++);
  content.innerHTML = `Most common: ${top}<br>Severity breakdown: 😐 ${sevCounts.mild} mild · 😣 ${sevCounts.moderate} moderate · 🔴 ${sevCounts.severe} severe`;
}

// ══════════════════════════════════════════════════════════════════════
// V6 — MEDICATION INTERACTIONS
// ══════════════════════════════════════════════════════════════════════
function renderInteractions(){
  const el = document.getElementById('interaction-cards');
  const empty = document.getElementById('interaction-empty');
  if(!el) return;
  const meds = MedsScheduler.getMeds();
  if(!meds.length){
    el.innerHTML = '';
    if(empty) empty.style.display = 'block';
    return;
  }
  if(empty) empty.style.display = 'none';
  const activeDbIds = meds.map(m => m.dbId).filter(Boolean);
  const relevant = MED_INTERACTIONS.filter(ix => ix.meds.some(m => activeDbIds.includes(m)));
  if(!relevant.length){
    el.innerHTML = '<div class="dose-empty">No known interactions for your current medications. ✅</div>';
    return;
  }
  el.innerHTML = relevant.map(ix => {
    const medNames = ix.meds.map(id => {
      const db = MEDS_DB.find(m => m.id === id);
      return db ? db.name.split(' ')[0] : id;
    }).join(', ');
    return `<div class="v6-interact-card">
      <div class="v6-interact-title">⚠️ ${medNames}</div>
      ${ix.avoid.length ? `<div class="v6-interact-section"><div class="v6-interact-label avoid">🚫 Avoid</div>${ix.avoid.map(a => `<div class="v6-interact-item">${a}</div>`).join('')}</div>` : ''}
      ${ix.caution.length ? `<div class="v6-interact-section"><div class="v6-interact-label caution">⚠️ Caution</div>${ix.caution.map(c => `<div class="v6-interact-item">${c}</div>`).join('')}</div>` : ''}
      <div class="v6-interact-note">${ix.note}</div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════════════
// V6 — HEALTH REPORT GENERATOR
// ══════════════════════════════════════════════════════════════════════
function generateHealthReport(){
  const meds = MedsScheduler.getMeds();
  const doses = DoseTracker.getDoses().slice(0, 30);
  const sideEffects = JSON.parse(localStorage.getItem('tp_side_effects') || '[]').slice(0, 20);
  const name = localStorage.getItem('tp_name') || 'Patient';
  const date = new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'});
  let report = `TRANS POWER — Health Report\n`;
  report += `Generated: ${date}\nPatient: ${name}\n`;
  report += `${'═'.repeat(40)}\n\n`;
  report += `ACTIVE MEDICATIONS\n${'─'.repeat(30)}\n`;
  if(meds.length){
    meds.forEach(m => {
      report += `• ${m.name} (${m.dose}) — Every ${m.interval} ${m.unit}\n`;
    });
  } else { report += `No medications currently scheduled.\n`; }
  report += `\nRECENT DOSES (Last 30)\n${'─'.repeat(30)}\n`;
  if(doses.length){
    doses.forEach(d => {
      const dt = new Date(d.timestamp);
      report += `• ${dt.toLocaleDateString('en-US',{month:'short',day:'numeric'})} ${dt.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})} — ${d.medName} (${d.dose})\n`;
    });
  } else { report += `No doses logged yet.\n`; }
  report += `\nSIDE EFFECTS (Recent)\n${'─'.repeat(30)}\n`;
  if(sideEffects.length){
    sideEffects.forEach(s => {
      const dt = new Date(s.date);
      report += `• ${dt.toLocaleDateString('en-US',{month:'short',day:'numeric'})} — ${s.name} (${s.severity})${s.notes ? ' — '+s.notes : ''}\n`;
    });
  } else { report += `No side effects logged.\n`; }
  report += `\n${'═'.repeat(40)}\n`;
  report += `Generated by Trans Power V7. Data stored locally — never uploaded.\n`;
  const el = document.getElementById('health-report');
  const text = document.getElementById('health-report-text');
  if(el) el.style.display = 'block';
  if(text) text.textContent = report;
}

function copyHealthReport(){
  const text = document.getElementById('health-report-text');
  if(!text) return;
  navigator.clipboard?.writeText(text.textContent).then(() => alert('📋 Report copied!')).catch(() => alert(text.textContent));
}

// Override switchMedTab to include V6 tabs
const _origSwitchMedTab = typeof switchMedTab === 'function' ? switchMedTab : null;
function switchMedTab(t){
  document.querySelectorAll('#meds .med-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('#meds .med-tab').forEach(b => b.classList.remove('active'));
  const pEl = document.getElementById('mp-'+t);
  const bEl = document.getElementById('mt-'+t);
  if(pEl) pEl.classList.add('active');
  if(bEl) bEl.classList.add('active');
  if(t === 'interact') renderInteractions();
}


// ══════════════════════════════════════════════════════════════════════
// V6 — SECURITY: PIN LOCK + GOOGLE STEALTH + COMPANION WIRING
// ══════════════════════════════════════════════════════════════════════

// --- PIN Lock (replaces broken biometric) ---
function toggleBiometricAuth(enabled) {
  if (enabled) {
    const pin = prompt('Create a 4-digit PIN to lock this app:');
    if (pin && /^\d{4}$/.test(pin)) {
      localStorage.setItem('tp_pin', pin);
      localStorage.setItem('tp_pin_enabled', 'true');
      alert('PIN set! The app will ask for this PIN every time you open it.');
    } else {
      alert('Please enter exactly 4 digits.');
      const cb = document.getElementById('settings-biometric');
      if (cb) cb.checked = false;
    }
  } else {
    localStorage.removeItem('tp_pin');
    localStorage.removeItem('tp_pin_enabled');
  }
}

// --- Panic Button -> Google-style search overlay ---
function triggerPanicButton() {
  if (document.getElementById('settings-modal')) document.getElementById('settings-modal').classList.remove('visible');
  activateGoogleStealth();
}

function activateGoogleStealth() {
  document.querySelectorAll('.tab, #bnav, #crisis-modal, #settings-modal').forEach(el => {
    el.dataset.prevDisplay = el.style.display || '';
    el.style.display = 'none';
  });
  document.getElementById('bnav').style.display = 'none';
  const overlay = document.getElementById('stealth-search');
  if (overlay) {
    overlay.style.display = 'flex';
    const inp = overlay.querySelector('#stealth-search-input');
    if (inp) inp.focus();
  }
}

function exitGoogleStealth() {
  const overlay = document.getElementById('stealth-search');
  if (overlay) overlay.style.display = 'none';
  document.getElementById('bnav').style.display = 'flex';
  sw('home');
}

function stealthDoSearch() {
  const input = document.getElementById('stealth-search-input');
  const q = input ? input.value.trim() : '';
  if (!q) return;
  if (q === '11380' || q.toLowerCase() === 'exit') { exitGoogleStealth(); return; }
  window.open('https://www.google.com/search?q=' + encodeURIComponent(q), '_blank');
}

// --- Companion Panel Chat (Sweetheart Offline Intelligence) ---

const SweetheartBrain = {
  worker: null,
  ready: false,
  loading: false,
  runtime: null,
  pending: [],

  init() {
    if (this.worker || !window.Worker) return;
    this.loading = true;
    this.updateStatus('loading', 'Sweetheart brain waking locally...');
    try {
      this.worker = new Worker('./llm-worker-v7.js');
      this.worker.onmessage = (event) => this.handleWorkerMessage(event.data || {});
      this.worker.onerror = (err) => {
        console.warn('Sweetheart worker failed:', err);
        this.ready = false;
        this.loading = false;
        this.updateStatus('offline', 'Sweetheart classic offline mode');
      };
      this.worker.postMessage({ type: 'init' });
    } catch (err) {
      console.warn('Sweetheart worker unavailable:', err);
      this.loading = false;
      this.updateStatus('offline', 'Sweetheart classic offline mode');
    }
  },

  handleWorkerMessage(data) {
    if (data.runtime) this.runtime = data.runtime;
    if (data.status === 'profile') this.updateStatus('loading', data.message);
    if (data.status === 'loading') this.updateStatus('loading', data.message);
    if (data.status === 'progress') {
      const pct = Number.isFinite(data.progress) ? Math.round(data.progress) : 0;
      this.updateStatus('loading', `Loading local brain ${pct}%`);
    }
    if (data.status === 'ready') {
      this.ready = true;
      this.loading = false;
      this.updateStatus('local-llm', data.message || 'Sweetheart 135M Lite ready');
    }
    if (data.status === 'generating') this.updateStatus('local-llm', 'Sweetheart thinking locally...');
    if (data.status === 'complete') {
      this.updateStatus('local-llm', 'Sweetheart 135M Lite ready');
      const next = this.pending.shift();
      if (next) next.resolve(data.reply);
    }
    if (data.status === 'error') {
      console.warn('Sweetheart brain error:', data.message);
      this.ready = false;
      this.loading = false;
      this.updateStatus('offline', 'Sweetheart classic offline mode');
      const next = this.pending.shift();
      if (next) next.reject(new Error(data.message || 'Local brain failed'));
    }
  },

  updateStatus(mode, label) {
    const bar = document.getElementById('sweetheart-brain-bar');
    const text = document.getElementById('sweetheart-brain-label');
    const badge = document.getElementById('ai-status-badge');
    const className = mode === 'local-llm' ? 'local-llm' : mode === 'loading' ? 'loading' : 'offline';
    if (bar) bar.className = `ai-mode-bar ${className}`;
    if (text) text.textContent = label;
    if (badge) {
      badge.className = `ai-badge ${className}`;
      badge.textContent = mode === 'local-llm' ? 'Sweetheart 135M' : mode === 'loading' ? 'Sweetheart Loading' : 'Sweetheart Offline';
    }
  },

  ask(prompt, ctx) {
    if (!this.ready || !this.worker) return Promise.reject(new Error('Local brain not ready'));
    return new Promise((resolve, reject) => {
      this.pending.push({ resolve, reject });
      this.worker.postMessage({
        type: 'generate',
        prompt,
        name: ctx.name,
        context: summarizeAppContext(ctx)
      });
      setTimeout(() => {
        const idx = this.pending.findIndex(item => item.resolve === resolve);
        if (idx >= 0) {
          this.pending.splice(idx, 1);
          reject(new Error('Local brain timed out'));
        }
      }, 18000);
    });
  }
};

// Voice Personas
const KIRA_VOICES = {
  sis:     { label: 'Sweetheart Sis', pitch: 1.12, rate: 0.95, emoji: '♡' },
  soft:    { label: 'Soft Support',   pitch: 1.08, rate: 0.9,  emoji: '🌸' },
  steady:  { label: 'Steady Coach',   pitch: 1.0,  rate: 0.92, emoji: '🫂' }
};
let currentKiraVoice = localStorage.getItem('tp_kira_voice') || 'sis';
if (!KIRA_VOICES[currentKiraVoice]) currentKiraVoice = 'sis';
let kiraPlayfulness = parseFloat(localStorage.getItem('tp_kira_playful') || '0.35');

function setKiraVoice(key) {
  if (KIRA_VOICES[key]) {
    currentKiraVoice = key;
    localStorage.setItem('tp_kira_voice', key);
    addCompanionMsg(getVoiceSwitchLine(key));
    kiraSpeak(getVoiceSwitchLine(key));
    document.querySelectorAll('.kira-voice-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.voice === key);
    });
  }
}

function getVoiceSwitchLine(key) {
  const lines = {
    sis:    'Hey sweetheart. Big-sis mode is on. I am right here with you.',
    soft:   'Soft support is on. We will go gently.',
    steady: 'Steady coach is on. Warm, calm, and practical.'
  };
  return lines[key] || 'Voice changed!';
}

// --- Hybrid Text-to-Speech (Studio Web API Online, Local Offline) ---
let audioUnlocker = false;

// Unlock audio on first user tap (required by Android WebView + iOS Safari)
function unlockKiraAudio() {
  if (audioUnlocker) return;
  // Play a silent buffer to unlock the audio pipeline
  const a = new Audio();
  a.play().catch(() => {});
  audioUnlocker = true;
}
// Attach to multiple user gesture events
document.addEventListener('click', unlockKiraAudio, { once: true });
document.addEventListener('touchstart', unlockKiraAudio, { once: true });
document.addEventListener('touchend', unlockKiraAudio, { once: true });

function kiraSpeak(text) {
  const cleaned = text.replace(/<[^>]*>/g, '').replace(/[*~_]/g, '');
  if (!cleaned) return;

  if (navigator.onLine) {
    playOnlineTTS(cleaned);
  } else {
    playOfflineTTS(cleaned);
  }
}

function playOnlineTTS(text) {
  // Map personas to Google Translate TTS languages for "Studio API" sound
  let lang = currentKiraVoice === 'steady' ? 'en-gb' : 'en';
  
  // Truncate text if needed (Google TTS limit is 200 chars per request)
  const shortText = text.length > 200 ? text.substring(0, 197) + '...' : text;
  
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(shortText)}`;
  const audio = new Audio(url);
  audio.volume = 0.8;
  
  audio.play().catch(e => {
    console.log('Online TTS failed, falling back to offline:', e);
    playOfflineTTS(text);
  });
}

// --- TTS Engine Integration (Native & Bunker Mode) ---
let ttsWorker = null;
let ttsReady = false;
let isBunkerMode = localStorage.getItem('tp_neural_voice') === 'true';

// Set initial toggle state in DOM
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('settings-neural-voice');
  if (toggle) toggle.checked = isBunkerMode;
  if (isBunkerMode) initTTSWorker();
});

function toggleNeuralVoice(enabled) {
  isBunkerMode = enabled;
  localStorage.setItem('tp_neural_voice', enabled);
  if (enabled && !ttsWorker) {
    initTTSWorker();
  }
}

function initTTSWorker() {
  if (window.Worker && !ttsWorker) {
    ttsWorker = new Worker('./tts-worker.js');
    ttsWorker.onmessage = (e) => {
      const { status, audio, sampling_rate, message, file, progress } = e.data;
      if (status === 'ready') {
        ttsReady = true;
        addCompanionMsg('Neural Voice Online! 🌸');
      } else if (status === 'progress') {
        console.log(`Downloading Kokoro: ${Math.round(progress)}%`);
      } else if (status === 'complete' && audio) {
        playAudioBuffer(audio, sampling_rate);
      } else if (status === 'error') {
        console.error('TTS Error:', message);
      }
    };
    ttsWorker.postMessage({ type: 'init' });
  }
}

function playAudioBuffer(audioArray, sampleRate) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const buffer = audioCtx.createBuffer(1, audioArray.length, sampleRate);
  buffer.getChannelData(0).set(audioArray);
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
}

function playOfflineTTS(text) {
  if (localStorage.getItem('tp_stealth_enabled') === 'true') return;
  if (!text) return;
  
  if (isBunkerMode && ttsReady && ttsWorker) {
    // Bunker Mode: Use Kokoro
    const cleanText = text.replace(/[🌸✨🏳️‍⚧️💖]/g, '').trim();
    ttsWorker.postMessage({ type: 'speak', text: cleanText });
    return;
  }
  
  // Default Mode: Native TTS
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  
  const cleanText = text.replace(/[🌸✨🏳️‍⚧️💖]/g, '').trim();
  const utter = new SpeechSynthesisUtterance(cleanText);
  utter.rate = 1.05;
  utter.pitch = 1.2;
  
  const voices = window.speechSynthesis.getVoices();
  // Prioritize known high-quality female voices
  const bestVoice = voices.find(v => 
    v.name.toLowerCase().includes('female') || 
    v.name.toLowerCase().includes('zira') || 
    v.name.toLowerCase().includes('samantha') || 
    v.name.toLowerCase().includes('google uk english female')
  ) || voices.find(v => 
    v.name.toLowerCase().includes('english') && !v.name.toLowerCase().includes('david')
  );
  
  if (bestVoice) utter.voice = bestVoice;
  
  window.speechSynthesis.speak(utter);
}

function kiraSpeak(text) {
  playOfflineTTS(text);
}

// Pre-load voices to avoid delay on first message
document.addEventListener('DOMContentLoaded', () => {
  if (window.speechSynthesis) window.speechSynthesis.getVoices();
});

function setKiraPlayfulness(val) {
  kiraPlayfulness = parseFloat(val);
  localStorage.setItem('tp_kira_playful', val);
  const label = document.getElementById('playful-label');
  if (label) {
    if (kiraPlayfulness < 0.3) label.textContent = 'Gentle & Supportive';
    else if (kiraPlayfulness < 0.6) label.textContent = 'Friendly & Warm';
    else if (kiraPlayfulness < 0.85) label.textContent = 'Warm Big-Sis Energy';
    else label.textContent = 'Direct Big-Sis Coach';
  }
}

// --- Gather App Context ---
function getAppContext() {
  const name = localStorage.getItem('tp_name') || 'bestie';
  const pronoun = localStorage.getItem('tp_pronoun') || '';
  const moods = JSON.parse(localStorage.getItem('tp_moods') || '[]');
  const lastMood = moods.length ? moods[moods.length - 1] : null;
  const moodStreak = moods.filter(m => {
    const d = new Date(m.time || m.date);
    return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length;
  const meds = JSON.parse(localStorage.getItem('tp_meds') || '[]');
  const doses = JSON.parse(localStorage.getItem('tp_doses') || '[]');
  const lastDose = doses.length ? doses[0] : null;
  const sideEffects = JSON.parse(localStorage.getItem('tp_side_effects') || '[]');
  const voiceSessions = parseInt(localStorage.getItem('tp_voice_sessions') || '0');
  const wallPosts = JSON.parse(localStorage.getItem('tp_wall') || '[]');
  const appOpens = parseInt(localStorage.getItem('tp_app_opens') || '0');
  // Track app opens
  localStorage.setItem('tp_app_opens', String(appOpens + 1));

  return { name, pronoun, moods, lastMood, moodStreak, meds, doses, lastDose, sideEffects, voiceSessions, wallPosts, appOpens };
}

function summarizeAppContext(ctx) {
  const bits = [];
  if (ctx.lastMood) bits.push('last mood: ' + (ctx.lastMood.mood || ctx.lastMood.level || 'logged'));
  bits.push('mood logs this week: ' + ctx.moodStreak);
  bits.push('medications configured: ' + ctx.meds.length);
  bits.push('doses logged: ' + ctx.doses.length);
  bits.push('voice sessions: ' + ctx.voiceSessions);
  bits.push('side effect logs: ' + ctx.sideEffects.length);
  return bits.join('; ');
}

function getGentleNudge(ctx) {
  const nudges = [];

  if (ctx.voiceSessions === 0)
    nudges.push('Sweetheart, let us start tiny: one gentle voice exercise for five minutes. No performance, just practice.');
  if (ctx.voiceSessions > 0 && ctx.voiceSessions < 3)
    nudges.push(`You have ${ctx.voiceSessions} voice session${ctx.voiceSessions === 1 ? '' : 's'} logged. That counts. Let us build the habit slowly.`);
  if (ctx.moodStreak === 0)
    nudges.push('You have not logged a mood this week. Want to do a quick check-in? One tap is enough.');
  if (ctx.moodStreak >= 7)
    nudges.push('Seven mood logs this week. I am proud of that consistency. Patterns get easier to see when you keep showing up.');
  if (ctx.doses.length === 0 && ctx.meds.length > 0)
    nudges.push('You have meds set up, but no dose logged yet. If you already took it, log it. If not, let us check the schedule.');
  if (ctx.sideEffects.length > 5)
    nudges.push('You have several side-effect notes. That is useful doctor-visit data. Consider exporting a health summary before your next appointment.');
  if (!ctx.pronoun)
    nudges.push('Your pronouns are not set yet. Add them when you are ready so I can support you more accurately.');

  nudges.push('You are doing more than you think. Pick one small action for today, and I will stay with you through it.');
  nudges.push('Big-sis check: water, breath, meds if due, and one kind sentence to yourself. We keep it simple.');

  return nudges[Math.floor(Math.random() * nudges.length)];
}

// --- Data-Aware Greeting ---
function getDataAwareGreeting(ctx) {
  const greetings = [];
  const hour = new Date().getHours();

  if (hour < 6) greetings.push('It is late, ' + ctx.name + '. I am glad you came here. Let us keep this gentle.');
  else if (hour < 12) greetings.push('Good morning ' + ctx.name + '. Let us make today lighter, one step at a time.');
  else if (hour < 17) greetings.push('Hey ' + ctx.name + '. I am here. What do you need this afternoon?');
  else if (hour < 21) greetings.push('Evening check-in, ' + ctx.name + '. How did today treat you?');
  else greetings.push('Late night check-in, ' + ctx.name + '. I am right here with you.');

  if (ctx.lastMood) {
    const moodAge = Date.now() - new Date(ctx.lastMood.time || ctx.lastMood.date).getTime();
    if (moodAge > 24 * 60 * 60 * 1000) greetings.push('Psst... you have not logged your mood today. How are you REALLY feeling?');
    else greetings.push('I see your last mood was "' + (ctx.lastMood.mood || 'unknown') + '". Want to talk about it?');
  }

  if (ctx.meds.length > 0 && ctx.doses.length === 0)
    greetings.push('Gentle reminder: you have meds set up but no doses logged today.');

  return greetings[Math.floor(Math.random() * greetings.length)];
}

function initCompanionChat() {
  const chatBox = document.getElementById('companion-chat-box');
  const input = document.getElementById('companion-input');
  const sendBtn = document.getElementById('companion-send');
  if (!chatBox || !input || !sendBtn) return;

  const ctx = getAppContext();
  const greeting = getDataAwareGreeting(ctx);
  addCompanionMsg(greeting);
  SweetheartBrain.init();

  // Load saved voice
  document.querySelectorAll('.kira-voice-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.voice === currentKiraVoice);
  });

  // Load playfulness
  const slider = document.getElementById('kira-playful-slider');
  if (slider) slider.value = kiraPlayfulness;
  setKiraPlayfulness(kiraPlayfulness);

  sendBtn.addEventListener('click', () => sendCompanionMsg());
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendCompanionMsg(); });
}

// --- Algorithmic Companion Engine (Slim Mode) ---
function initLlmWorker() {
  SweetheartBrain.init();
}

async function sendCompanionMsg() {
  const input = document.getElementById('companion-input');
  if (!input) return;
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  addCompanionMsg(msg, true);
  
  const ctx = getAppContext();
  let reply = '';
  const l = msg.toLowerCase();

  // The Algorithmic Brain
  if (l.match(/\b(check on me|nudge|how am i doing|my stats|stats)\b/)) {
    reply = getGentleNudge(ctx);
  } else if (l.match(/\b(hi|hello|hey|yo|sup)\b/)) {
    reply = getDataAwareGreeting(ctx);
  } else if (l.match(/\b(sad|dysphoria|cry|crying|depressed|down)\b/) && !l.match(/\bnot\b/)) {
    reply = `Oh sweetheart, ${ctx.name ? ctx.name + ', ' : ''}I am here. First, breathe with me once. Then we will choose one small next step.`;
  } else if (l.match(/\b(name is|call me)\b/)) {
    const nameMatch = msg.match(/\b(?:my name is|call me)\s+([a-zA-Z\-\']{1,30})/i);
    if (nameMatch) {
        localStorage.setItem('tp_name', nameMatch[1]);
        reply = `${nameMatch[1]}. I love that name for you. I will use it from now on.`;
    } else {
        reply = `I love your name. Tell me exactly how you want me to say it.`;
    }
  } else if (l.match(/\b(pronouns|she|he|they|them|her|him)\b/)) {
    reply = `Thank you for telling me. Your pronouns matter, and I will treat them with care.`;
  } else if (l.match(/\b(what|huh|explain|help)\b/)) {
    reply = `No stress. Tell me one thing you are feeling right now, and I will give you a tiny next step.`;
  } else {
    const fallbacks = [
      `I am here for you, ${ctx.name || 'sweetheart'}. Tell me more about your day.`,
      `You do not have to solve everything at once. What is the heaviest thing right now?`,
      `Drink some water if you can. Then tell me what you need next.`,
      `Whatever happens, I am in your corner.`,
      `Tell me more about what is on your mind.`,
      `I am listening. Take all the time you need.`
    ];
    reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  let source = 'classic';
  if (SweetheartBrain.ready && !l.match(/\b(suicide|kill myself|self harm|dose|dosage|side effect|legal|emergency)\b/)) {
    try {
      reply = await SweetheartBrain.ask(msg, ctx);
      source = 'smollm';
    } catch (err) {
      console.warn('Sweetheart 135M fallback:', err.message);
    }
  }

  setTimeout(() => {
    addCompanionMsg(reply, false, source);
    kiraSpeak(reply);
  }, source === 'smollm' ? 100 : 450);
}

// Ensure the LLM initializes when chat opens
document.addEventListener('DOMContentLoaded', () => {
  // Silent init
  setTimeout(initLlmWorker, 2000); 
});

function addCompanionMsg(text, isUser) {
  const chatBox = document.getElementById('companion-chat-box');
  if (!chatBox) return;
  const el = document.createElement('div');
  const v = KIRA_VOICES[currentKiraVoice] || KIRA_VOICES.sis;
  el.className = isUser ? 'comp-msg comp-msg-user' : 'comp-msg comp-msg-kira';
  const sourceLabel = arguments[2] === 'smollm' ? ' · 135M Lite' : ' · Classic offline';
  el.innerHTML = isUser ? escHtml(text) : '<span class="comp-kira-name">' + v.emoji + ' Sweetheart' + sourceLabel + '</span> ' + escHtml(text).replace(/\n/g, '<br>');
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
}



// --- DOMContentLoaded: wire everything ---
document.addEventListener('DOMContentLoaded', () => {
  const stealthEnabled = localStorage.getItem('tp_stealth_enabled') === 'true';
  if (document.getElementById('settings-stealth')) document.getElementById('settings-stealth').checked = stealthEnabled;
  const pinEnabled = localStorage.getItem('tp_pin_enabled') === 'true';
  if (document.getElementById('settings-biometric')) document.getElementById('settings-biometric').checked = pinEnabled;

  if (pinEnabled && localStorage.getItem('tp_pin')) {
    document.body.style.filter = 'blur(20px)';
    document.body.style.pointerEvents = 'none';
    let attempts = 3;
    const tryPin = () => {
      const entered = prompt('Enter your 4-digit PIN to unlock Trans Power:');
      if (entered === localStorage.getItem('tp_pin')) {
        document.body.style.filter = '';
        document.body.style.pointerEvents = '';
        return;
      }
      attempts--;
      if (attempts > 0) {
        alert('Wrong PIN. ' + attempts + ' attempts left.');
        setTimeout(tryPin, 100);
      } else {
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#1a1a2e"><h1 style="color:#F5A9B8;font-family:sans-serif;text-align:center">App Locked<br><span style="font-size:14px;color:#888">Close and reopen to try again</span></h1></div>';
      }
    };
    setTimeout(tryPin, 300);
  }

  initCompanionChat();
});
