// js.js - comportement de la page index (reveal, print, ajout dynamique des projets si présents)

function escapeHtml(s){
  if(!s) return '';
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function revealOnScroll(){
  document.querySelectorAll('.reveal').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight - 80) el.classList.add('visible');
  });
}

function setupActions(){
  const printBtn = document.getElementById('printBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  if(printBtn) printBtn.addEventListener('click', ()=> window.print());
  if(downloadBtn) downloadBtn.addEventListener('click', ()=> window.print());
}

// ====== JSONBin config (هنا تم وضع BIN و MASTER KEY اللي عطيتِهم) ======
const BIN_URL = "https://api.jsonbin.io/v3/b/6907b238d0ea881f40cf61d7";
const API_KEY = "$2a$10$dW1U1AU6.KE748DHNfw/FeP0M2dDg7q2EeJQCC13NDruzPhmnkWOa"; // master key - للاختبار فقط

async function fetchProjects() {
  try {
    const res = await fetch(BIN_URL + "/latest", {
      headers: { "X-Master-Key": API_KEY }
    });
    const j = await res.json();
    return j.record || [];
  } catch (e) {
    console.error('Erreur fetch projects', e);
    return [];
  }
}

// يُنشئ بطاقة مشروع DOM من كائن المشروع p
function createProjectCard(p){
  const card = document.createElement('div');
  card.className = 'project-card';
  // عنوان ووصف
  const htmlParts = [];
  htmlParts.push(`<h3>${escapeHtml(p.title)}</h3>`);
  htmlParts.push(`<p>${escapeHtml(p.desc)}</p>`);

  // إذا هناك نموذج 3D مُضمّن (base64) أو رابط
  if(p.model){
    // model may be a data URL (base64) or an http(s) url
    const src = p.model;
    htmlParts.push(`<div style="margin:8px 0">`);
    htmlParts.push(`<model-viewer src="${src}" alt="${escapeHtml(p.title)}" camera-controls auto-rotate style="width:100%;height:320px;"></model-viewer>`);
    htmlParts.push(`</div>`);
  }

  // معاينات الوسائط الصغيرة (صورة/فيديو) إذا وجدت
  if(p.image){
    htmlParts.push(`<div style="margin:8px 0"><img src="${p.image}" alt="${escapeHtml(p.imageName || p.title)}" style="max-width:100%;border-radius:8px;border:1px solid rgba(255,255,255,0.04)"></div>`);
  }
  if(p.video){
    htmlParts.push(`<div style="margin:8px 0"><video controls style="width:100%;border-radius:8px;border:1px solid rgba(255,255,255,0.04)"><source src="${p.video}" type="video/mp4">Votre navigateur ne supporte pas la vidéo.</video></div>`);
  }

  // أزرار التحميل الثلاثة (تظهر لو الملف موجود)
  const buttons = [];
  if(p.model) buttons.push(`<a class="btn ghost" href="${p.model}" download="${p.modelName || 'model.glb'}">Télécharger 3D</a>`);
  if(p.image) buttons.push(`<a class="btn ghost" href="${p.image}" download="${p.imageName || 'image.png'}">Télécharger Image</a>`);
  if(p.video) buttons.push(`<a class="btn ghost" href="${p.video}" download="${p.videoName || 'video.mp4'}">Télécharger Vidéo</a>`);
  // si projet link simple
  if(p.link && !p.model && !p.image && !p.video) buttons.push(`<a class="btn ghost" href="${p.link}" target="_blank">Voir le projet</a>`);

  const btnHtml = `<div style="margin-top:10px">${buttons.join(' ')}</div>`;

  card.innerHTML = htmlParts.join('') + btnHtml;
  return card;
}

// يضيف المشاريع المأخوذة من BIN إلى الحاوية #project-list
async function appendStoredProjects(){
  try {
    const stored = await fetchProjects();
    const container = document.getElementById('project-list');
    if(!container) return;
    // نحتفظ بالعناوين الموجودة حتى لا نكرر
    const existingTitles = Array.from(container.querySelectorAll('.project-card h3')).map(h=>h.textContent.trim());

    // نعرض الأحدث أولا (JSONBin قد يحتوي ترتيب)
    stored.forEach(p=>{
      if(existingTitles.includes((p.title||'').trim())) return;
      const card = createProjectCard(p);
      container.appendChild(card);
    });
  } catch(e){
    console.error('Erreur lors de l\'ajout des projets', e);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  appendStoredProjects();
  setupActions();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
