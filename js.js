// js.js - مع نماذج ثلاثية الأبعاد فورية

let activeViewers = new Map();

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

// إنشاء نموذج ثلاثي الأبعاد فوري
function createPresetModel(presetType, container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a12);
  
  const width = container.clientWidth;
  const height = Math.min(400, window.innerHeight * 0.6);
  
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // إضاءة
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0x7c4dff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  const directionalLight2 = new THREE.DirectionalLight(0x00e5ff, 0.4);
  directionalLight2.position.set(-5, -5, -5);
  scene.add(directionalLight2);
  
  // إنشاء النموذج بناءً على النوع
  let geometry, material, mesh;
  
  switch(presetType) {
    case 'cube':
      geometry = new THREE.BoxGeometry(2, 2, 2);
      material = new THREE.MeshPhongMaterial({ 
        color: 0x7c4dff,
        shininess: 100 
      });
      break;
      
    case 'sphere':
      geometry = new THREE.SphereGeometry(1.5, 32, 32);
      material = new THREE.MeshPhongMaterial({ 
        color: 0x00e5ff,
        shininess: 100,
        specular: 0x444444
      });
      break;
      
    case 'torus':
      geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
      material = new THREE.MeshPhongMaterial({ 
        color: 0xff6b6b,
        shininess: 100 
      });
      break;
      
    case 'monkey':
      geometry = new THREE.IcosahedronGeometry(1.5, 1);
      material = new THREE.MeshPhongMaterial({ 
        color: 0x4dff7c,
        flatShading: true 
      });
      break;
  }
  
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  
  // شبكة مساعدة
  const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
  scene.add(gridHelper);
  
  // محاور
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);
  
  function animate() {
    requestAnimationFrame(animate);
    
    // دوران بسيط
    if (mesh) {
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.01;
    }
    
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  
  function handleResize() {
    const newWidth = container.clientWidth;
    const newHeight = Math.min(400, window.innerHeight * 0.6);
    
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }
  
  window.addEventListener('resize', handleResize);
  
  const viewerId = 'viewer-' + Math.random().toString(36).substr(2, 9);
  activeViewers.set(viewerId, { scene, camera, renderer, controls, animate, handleResize });
  
  return viewerId;
}

// تحميل نموذج من ملف
function loadModelFromFile(modelUrl, fileType, container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a12);
  
  const width = container.clientWidth;
  const height = Math.min(400, window.innerHeight * 0.6);
  
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // إضاءة
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0x7c4dff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  const directionalLight2 = new THREE.DirectionalLight(0x00e5ff, 0.4);
  directionalLight2.position.set(-5, -5, -5);
  scene.add(directionalLight2);
  
  let loader;
  
  if (fileType === 'gltf' || fileType === 'glb') {
    loader = new THREE.GLTFLoader();
  } else if (fileType === 'obj') {
    loader = new THREE.OBJLoader();
  } else {
    container.innerHTML = '<p style="color: #ff4444; text-align: center; padding: 20px;">❌ Format non supporté: ' + fileType + '</p>';
    return;
  }
  
  const loadingElement = document.createElement('div');
  loadingElement.className = 'viewer-loading';
  loadingElement.innerHTML = `
    <div class="loading-spinner"></div>
    <p>Chargement du modèle 3D...</p>
  `;
  container.appendChild(loadingElement);
  
  loader.load(
    modelUrl,
    function (object) {
      const model = (fileType === 'gltf' || fileType === 'glb') ? object.scene : object;
      scene.add(model);
      
      // ضبط المقياس
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 4 / maxDim;
      model.scale.multiplyScalar(scale);
      
      model.position.x = -center.x * scale;
      model.position.y = -center.y * scale;
      model.position.z = -center.z * scale;
      
      loadingElement.remove();
      
      console.log('Modèle chargé avec succès');
    },
    function (xhr) {
      if (xhr.total > 0) {
        const percent = (xhr.loaded / xhr.total * 100);
        loadingElement.querySelector('p').textContent = `Chargement: ${Math.round(percent)}%`;
      }
    },
    function (error) {
      console.error('Erreur:', error);
      loadingElement.innerHTML = `
        <p style="color: #ff4444;">❌ Erreur de chargement</p>
        <p style="font-size:0.8rem;color:var(--muted);">Essayez un fichier .glb ou utilisez un modèle simple</p>
        <button class="viewer-btn" onclick="this.parentElement.remove()">Fermer</button>
      `;
    }
  );
  
  // شبكة مساعدة
  const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
  scene.add(gridHelper);
  
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  
  function handleResize() {
    const newWidth = container.clientWidth;
    const newHeight = Math.min(400, window.innerHeight * 0.6);
    
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }
  
  window.addEventListener('resize', handleResize);
  
  const viewerId = 'viewer-' + Math.random().toString(36).substr(2, 9);
  activeViewers.set(viewerId, { scene, camera, renderer, controls, animate, handleResize });
  
  return viewerId;
}

// إنشاء عارض ثلاثي الأبعاد
function create3DViewer(project, container) {
  const viewerHTML = `
    <div class="blender-viewer-container">
      <div class="viewer-controls">
        <button class="viewer-btn" onclick="resetViewer('${project.title}')">🔄 Reset</button>
        <button class="viewer-btn" onclick="toggleAutoRotate('${project.title}')">⚡ Rotation Auto</button>
        <span class="viewer-help">🎮 Souris: Rotation | Molette: Zoom</span>
      </div>
      <div id="viewer-${project.title.replace(/\s+/g, '-')}" class="blender-viewer-3d"></div>
      <div class="viewer-info">
        <span>${project.presetModel ? 'Modèle Simple: ' + project.presetModel : 'Fichier: ' + (project.modelFileType || '3D')}</span>
        <span>•</span>
        <span>Contrôles Actifs</span>
      </div>
    </div>
  `;
  
  container.innerHTML = viewerHTML;
  
  setTimeout(() => {
    const viewerElement = document.getElementById(`viewer-${project.title.replace(/\s+/g, '-')}`);
    if (viewerElement) {
      if (project.presetModel) {
        createPresetModel(project.presetModel, viewerElement);
      } else if (project.modelFile) {
        loadModelFromFile(project.modelFile, project.modelFileType, viewerElement);
      }
    }
  }, 100);
}

// عناصر التحكم
function resetViewer(title) {
  const viewerId = `viewer-${title.replace(/\s+/g, '-')}`;
  // إعادة تحميل العارض
  const container = document.getElementById(viewerId);
  if (container) {
    container.innerHTML = '';
    // إعادة التهيئة
    const project = getProjectByTitle(title);
    if (project) {
      if (project.presetModel) {
        createPresetModel(project.presetModel, container);
      } else if (project.modelFile) {
        loadModelFromFile(project.modelFile, project.modelFileType, container);
      }
    }
  }
}

function toggleAutoRotate(title) {
  // يمكن إضافة دوران تلقائي إذا needed
  alert('Rotation automatique activée/désactivée');
}

function getProjectByTitle(title) {
  try {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    return projects.find(p => p.title === title);
  } catch(e) {
    return null;
  }
}

// معرض الوسائط
function createMediaGallery(project, container) {
  let mediaHTML = '<div class="media-gallery">';
  
  if (project.imageFile) {
    mediaHTML += `
      <div class="media-item">
        <h4>🖼️ Image du Projet</h4>
        <img src="${project.imageFile}" alt="${project.title}" class="media-image">
        <div class="media-actions">
          <a href="${project.imageFile}" download="${project.imageName || 'image.png'}" class="btn ghost">
            📥 Télécharger Image
          </a>
        </div>
      </div>
    `;
  }
  
  if (project.videoFile) {
    mediaHTML += `
      <div class="media-item">
        <h4>🎥 Vidéo du Projet</h4>
        <video controls class="media-video">
          <source src="${project.videoFile}" type="video/mp4">
        </video>
        <div class="media-actions">
          <a href="${project.videoFile}" download="${project.videoName || 'video.mp4'}" class="btn ghost">
            📥 Télécharger Vidéo
          </a>
        </div>
      </div>
    `;
  }
  
  mediaHTML += '</div>';
  container.innerHTML = mediaHTML;
}

// ✅ الدالة الرئيسية
function appendStoredProjects(){
  try {
    const stored = JSON.parse(localStorage.getItem('projects')) || [];
    const container = document.getElementById('project-list');
    if(!container || stored.length === 0) return;

    stored.forEach(p => {
      if (p.type === 'blender' || p.presetModel) {
        const div = document.createElement('div');
        div.className = 'project-card';
        
        div.innerHTML = `
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.desc)}</p>
          <p style="font-size:0.9rem;color:#7c4dff">
            🎮 ${p.presetModel ? 'Modèle 3D Simple - ' + p.presetModel : 'Modèle 3D Interactif'}
          </p>
          <div id="viewer-content-${p.title.replace(/\s+/g, '-')}" class="blender-viewer-content"></div>
        `;
        
        container.appendChild(div);
        
        setTimeout(() => {
          const viewerContainer = document.getElementById(`viewer-content-${p.title.replace(/\s+/g, '-')}`);
          if (viewerContainer) {
            create3DViewer(p, viewerContainer);
          }
        }, 100);
      }
    });
  } catch(e){
    console.error('Erreur:', e);
  }
}

// التنظيف
function cleanupViewers() {
  activeViewers.forEach((viewer, id) => {
    if (viewer.renderer) {
      viewer.renderer.dispose();
    }
  });
  activeViewers.clear();
}

// التهيئة
document.addEventListener('DOMContentLoaded', ()=>{
  appendStoredProjects();
  setupActions();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('beforeunload', cleanupViewers);
});
