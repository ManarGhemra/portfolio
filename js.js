// js.js - comportement de la page index (reveal, print, ajout dynamique des projets si présents)

function escapeHtml(s){
  if(!s) return '';
  return s.replace(/[&<>"']/g, m => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[m]));
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

// Initialiser IndexedDB
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PortfolioDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains('projects')) {
        const store = database.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
        store.createIndex('title', 'title', { unique: false });
      }
    };
  });
}

// Obtenir tous les projets
function getAllProjects() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PortfolioDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
}

// دوال تحميل ملفات TP 1 - باستخدام روابط GitHub RAW
function downloadTP1Blender() {
  // استبدل 'username' و 'repository' باسم المستخدم والمستودع الحقيقي
  const githubRawUrl = 'https://raw.githubusercontent.com/username/repository/main/tp%2001.blend';
  
  // فتح الرابط في نافذة جديدة للتحميل
  window.open(githubRawUrl, '_blank');
  
  // عرض رسالة للمستخدم
  alert('Le fichier Blender va être téléchargé. Si le téléchargement ne commence pas automatiquement, cliquez sur "View raw" ou "Download" dans la page qui s\'ouvre.');
}

function downloadTP1Image() {
  // استبدل 'username' و 'repository' باسم المستخدم والمستودع الحقيقي
  const githubRawUrl = 'https://raw.githubusercontent.com/username/repository/main/tp1.jpg';
  
  // فتح الرابط في نافذة جديدة للتحميل
  window.open(githubRawUrl, '_blank');
  
  // عرض رسالة للمستخدم
  alert('L\'image va être téléchargée. Si le téléchargement ne commence pas automatiquement, cliquez sur "View raw" ou "Download" dans la page qui s\'ouvre.');
}

// طريقة بديلة باستخدام إنشاء رابط تحميل
function downloadTP1BlenderAlternative() {
  // استبدل بمعلوماتك الحقيقية
  const username = 'ton-username';
  const repository = 'ton-repository';
  const fileName = 'tp%2001.blend'; // %20 هو مسافة مشفرة
  
  const downloadUrl = `https://github.com/${username}/${repository}/raw/main/${fileName}`;
  
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadTP1ImageAlternative() {
  // استبدل بمعلوماتك الحقيقية
  const username = 'ton-username';
  const repository = 'ton-repository';
  const fileName = 'tp1.jpg';
  
  const downloadUrl = `https://github.com/${username}/${repository}/raw/main/${fileName}`;
  
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// إضافة المشاريع المخزنة
async function appendStoredProjects(){
  try {
    await initDB();
    const stored = await getAllProjects();
    const container = document.getElementById('project-list');
    
    if(!container || stored.length === 0) {
      return;
    }

    const existingTitles = Array.from(container.querySelectorAll('.project-card h3'))
                               .map(h=>h.textContent.trim());

    stored.forEach((p)=>{
      if (existingTitles.includes(p.title.trim())) {
        return;
      }

      const div = document.createElement('div');
      div.className = 'project-card';
      
      let buttonsHtml = '';
      
      if (p.files && p.files.blend) {
        buttonsHtml += `
          <button onclick="downloadFile('${p.files.blend.data}', '${p.files.blend.name}')" 
                  class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            📁 Télécharger Blender
          </button>
        `;
      }
      
      if (p.files && p.files.image) {
        buttonsHtml += `
          <button onclick="downloadFile('${p.files.image.data}', '${p.files.image.name}')" 
                  class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            🖼 Télécharger Image
          </button>
        `;
      }
      
      if (p.files && p.files.video) {
        buttonsHtml += `
          <button onclick="downloadFile('${p.files.video.data}', '${p.files.video.name}')" 
                  class="btn ghost" style="margin-right:8px;margin-bottom:8px">
            🎬 Télécharger Vidéo
          </button>
        `;
      }
      
      if (!buttonsHtml) {
        buttonsHtml = '<p class="muted" style="font-size:0.9rem">Aucun fichier disponible</p>';
      }
      
      div.innerHTML = `
        <h3 style="color:var(--accent1);margin-bottom:8px">${escapeHtml(p.title)}</h3>
        <p style="margin-bottom:12px;color:var(--muted)">${escapeHtml(p.desc)}</p>
        <div style="margin-top:12px">
          ${buttonsHtml}
        </div>
      `;
      container.appendChild(div);
    });
  } catch(e){
    console.error('Erreur lors du chargement des projets depuis IndexedDB', e);
  }
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', ()=>{
  appendStoredProjects();
  setupActions();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
