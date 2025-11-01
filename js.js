// =========================================
// ADMIN FUNCTIONS
// =========================================
const PASSWORD = 'manar2025';

function login(){
  const v = document.getElementById('pwd')?.value;
  if(v === PASSWORD){
    document.getElementById('loginBlock').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    renderAdminList();
  } else alert('Mot de passe incorrect !');
}

function logout(){
  document.getElementById('pwd').value = '';
  document.getElementById('loginBlock').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
}

function toggleProjectType() {
  const projectType = document.querySelector('input[name="projectType"]:checked')?.value;
  const linkInput = document.getElementById('link');
  const fileInputContainer = document.getElementById('fileInputContainer');
  
  if (projectType === 'link') {
    linkInput.style.display = 'block';
    fileInputContainer.style.display = 'none';
  } else {
    linkInput.style.display = 'none';
    fileInputContainer.style.display = 'block';
  }
}

function addProject(){
  const title = document.getElementById('title')?.value.trim();
  const desc = document.getElementById('desc')?.value.trim();
  const projectType = document.querySelector('input[name="projectType"]:checked')?.value;
  
  if(!title || !desc){ 
    alert('Remplis le titre et la description !'); 
    return; 
  }

  let projectData = { title, desc };

  if (projectType === 'link') {
    const link = document.getElementById('link').value.trim();
    if(!link || !isValidUrl(link)){ 
      alert('Ajoute un lien valide (https://...) pour ton projet !'); 
      return; 
    }
    projectData.link = link;
    projectData.type = 'link';
    
    saveProject(projectData);
  } else {
    const fileInput = document.getElementById('blendFile');
    if(!fileInput.files.length){ 
      alert('Veuillez sélectionner un fichier Blender !'); 
      return; 
    }
    
    const file = fileInput.files[0];
    if (file.size > 900 * 1024 * 1024) { // <-- limite 900MB
      alert('Le fichier est trop volumineux (max 900MB) !');
      return;
    }
    
    if (!file.name.toLowerCase().endsWith('.blend')) {
      alert('Veuillez sélectionner un fichier Blender (.blend) !');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      projectData.fileData = e.target.result;
      projectData.fileName = file.name;
      projectData.type = 'blender';
      
      saveProject(projectData);
    };
    reader.readAsDataURL(file);
    return;
  }
}

function saveProject(projectData) {
  let arr = [];
  try {
    arr = JSON.parse(localStorage.getItem('projects')) || [];
  } catch(e){
    arr = [];
  }

  arr.unshift(projectData);
  localStorage.setItem('projects', JSON.stringify(arr));

  document.getElementById('title').value = '';
  document.getElementById('desc').value = '';
  document.getElementById('link').value = '';
  document.getElementById('blendFile').value = '';
  document.querySelector('input[name="projectType"][value="link"]').checked = true;
  toggleProjectType();

  renderAdminList();
  alert('Projet ajouté ✅');
}

function renderAdminList(){
  const list = document.getElementById('currentList');
  if(!list) return;

  let arr = [];
  try { arr = JSON.parse(localStorage.getItem('projects')) || []; } catch(e){ arr = []; }

  if(arr.length === 0){
    list.innerHTML = '<p class="muted">Aucun projet enregistré.</p>';
    return;
  }

  list.innerHTML = arr.map((p,idx)=>`
    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 6px;border-radius:8px;background:rgba(255,255,255,0.02);margin-bottom:8px">
      <div style="flex:1">
        <strong>${escapeHtml(p.title)}</strong>
        <div class="muted" style="font-size:0.9rem">${escapeHtml(p.desc)}</div>
        ${p.type === 'blender' ? '<div style="font-size:0.8rem;color:#7c4dff">📁 Modèle 3D</div>' : ''}
      </div>
      <div style="display:flex;gap:8px;margin-left:12px">
        <button class="btn ghost" onclick="removeAt(${idx})">Supprimer</button>
      </div>
    </div>
  `).join('');
}

function removeAt(i){
  let arr = [];
  try { arr = JSON.parse(localStorage.getItem('projects')) || []; } catch(e){ arr = []; }
  if(!arr[i]) return;
  if(!confirm('Supprimer ce projet ?')) return;
  
  arr.splice(i,1);
  localStorage.setItem('projects', JSON.stringify(arr));
  renderAdminList();
}

function clearAll(){
  if(!confirm('Supprimer tous les projets ?')) return;
  localStorage.removeItem('projects');
  renderAdminList();
  alert('Tous les projets supprimés.');
}

// =========================================
// HELPER FUNCTIONS
// =========================================
function escapeHtml(s){ 
  if(!s) return ''; 
  return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); 
}

function isValidUrl(s){
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch(e){
    return false;
  }
}

// =========================================
// INDEX PAGE PROJECT RENDERING
// =========================================
function renderProjects() {
  const projectList = document.getElementById('project-list');
  if (!projectList) return; // إذا ماكانش موجود (يعني صفحة index)

  let arr = [];
  try {
    arr = JSON.parse(localStorage.getItem('projects')) || [];
  } catch (e) {
    arr = [];
  }

  if (arr.length === 0) {
    projectList.innerHTML = '<p class="muted">ما كاش مشاريع مخزنة.</p>';
    return;
  }

  projectList.innerHTML = arr.map(p => {
    const link = p.type === 'link' ? p.link : '#';
    const btnText = p.type === 'blender' ? 'تحميل .blend' : 'شوف المشروع';
    return `
      <div class="project-card">
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        <a href="${link}" target="_blank" class="btn ghost">${btnText}</a>
      </div>
    `;
  }).join('');
}

// =========================================
// INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', ()=>{
  toggleProjectType(); // Admin
  renderProjects();    // Index
});
