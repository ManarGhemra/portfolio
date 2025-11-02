// js.js - مع دعم كامل للنماذج ثلاثية الأبعاد

let blenderViewers = new Map();

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

// دالة لتحميل النماذج ثلاثية الأبعاد
function load3DModel(modelUrl, fileType, container, loadingElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a12);
  
  const width = container.clientWidth;
  const height = Math.min(400, window.innerHeight * 0.6);
  
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // إضاءة
  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  scene.add(ambientLight);
  
  const directionalLight1 = new THREE.DirectionalLight(0x7c4dff, 0.8);
  directionalLight1.position.set(5, 5, 5);
  scene.add(directionalLight1);
  
  const directionalLight2 = new THREE.DirectionalLight(0x00e5ff, 0.5);
  directionalLight2.position.set(-5, -5, -5);
  scene.add(directionalLight2);
  
  // شبكة مساعدة
  const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
  scene.add(gridHelper);
  
  let loader;
  let model;
  
  switch(fileType) {
    case 'gltf':
    case 'glb':
      loader = new THREE.GLTFLoader();
      break;
    case 'obj':
      loader = new THREE.OBJLoader();
      break;
    case 'fbx':
      loader = new THREE.FBXLoader();
      break;
    default:
      console.error('Format non supporté:', fileType);
      if (loadingElement) {
        loadingElement.innerHTML = '<p style="color: #ff4444;">❌ Format de fichier non supporté</p>';
      }
      return;
  }
  
  loader.load(
    modelUrl,
    function (object) {
      if (fileType === 'gltf' || fileType === 'glb') {
        model = object.scene;
      } else {
        model = object;
      }
      
      scene.add(model);
      
      // ضبط المقياس والموقع
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 4 / maxDim;
      model.scale.multiplyScalar(scale);
      
      model.position.x = -center.x * scale;
      model.position.y = -center.y * scale;
      model.position.z = -center.z * scale;
      
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
      
      console.log('Modèle 3D chargé avec succès:', fileType);
    },
    function (xhr) {
      const percent = (xhr.loaded / xhr.total * 100);
      if (loadingElement && xhr.total) {
        loadingElement.querySelector('p').textContent = `Chargement: ${Math.round(percent)}%`;
      }
    },
    function (error) {
      console.error('Erreur de chargement:', error);
      if (loadingElement) {
        loadingElement.innerHTML = `
          <p style="color: #ff4444;">❌ Erreur de chargement</p>
          <p style="font-size:0.8rem;color:var(--muted);">Format: ${fileType}</p>
          <button class="viewer-btn" onclick="retryLoad('${modelUrl}', '${fileType}', this.parentElement)">Réessayer</button>
        `;
      }
    }
  );
  
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
  blenderViewers.set(viewerId, {
    scene,
    camera,
    renderer,
    controls,
    animate,
    handleResize
  });
  
  return viewerId;
}

function retryLoad(modelUrl, fileType, loadingElement) {
  const container = loadingElement.parentElement.querySelector('.blender-viewer-3d');
  if (container) {
    loadingElement.style.display = 'flex';
    loadingElement.innerHTML = `
      <div class="loading-spinner"></div>
      <p>Nouvelle tentative de chargement...</p>
    `;
    setTimeout(() => load3DModel(modelUrl, fileType, container, loadingElement), 500);
  }
}

// إنشاء عارض ثلاثي الأبعاد تفاعلي
function createInteractiveBlenderViewer(modelFileUrl, fileType, container) {
  const viewerId = 'viewer-' + Math.random().toString(36).substr(2, 9);
  
  const viewerHTML = `
    <div class="blender-viewer-container">
      <div class="viewer-controls">
        <button class="viewer-btn" onclick="resetCamera('${viewerId}')">🔄 Reset</button>
        <button class="viewer-btn" onclick="toggleAutoRotate('${viewerId}')">⚡ Auto-rotation</button>
        <button class="viewer-btn" onclick="toggleGrid('${viewerId}')">🔲 Grille</button>
        <span class="viewer-help">🎮 Souris: Rotation | Molette: Zoom | Clic droit: Déplacer</span>
      </div>
      <div id="${viewerId}-container" class="blender-viewer-3d"></div>
      <div class="viewer-loading" id="loading-${viewerId}">
        <div class="loading-spinner"></div>
        <p>Chargement du modèle 3D...</p>
      </div>
      <div class="viewer-info">
        <span>Format: ${fileType.toUpperCase()}</span>
        <span>•</span>
        <span>Contrôles actifs</span>
      </div>
    </div>
  `;
  
  container.innerHTML = viewerHTML;
  
  setTimeout(() => {
    const viewerContainer = document.getElementById(`${viewerId}-container`);
    const loadingElement = document.getElementById(`loading-${viewerId}`);
    
    if (viewerContainer && loadingElement) {
      load3DModel(modelFileUrl, fileType, viewerContainer, loadingElement);
    }
  }, 100);
}

// عناصر التحكم
function resetCamera(viewerId) {
  const viewer = blenderViewers.get(viewerId);
  if (viewer) {
    viewer.controls.reset();
  }
}

function toggleAutoRotate(viewerId) {
  const viewer = blenderViewers.get(viewerId);
  if (viewer) {
    viewer.controls.autoRotate = !viewer.controls.autoRotate;
  }
}

function toggleGrid(viewerId) {
  const viewer = blenderViewers.get(viewerId);
  if (viewer && viewer.scene) {
    const grid = viewer.scene.getObjectByName('gridHelper');
    if (grid) {
      grid.visible = !grid.visible;
    }
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
          Votre navigateur ne supporte pas la lecture vidéo.
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

// ✅ الدالة الرئيسية لإضافة المشاريع
function appendStoredProjects(){
  try {
    const stored = JSON.parse(localStorage.getItem('projects')) || [];
    const container = document.getElementById('project-list');
    if(!container || stored.length === 0) return;

    const existingTitles = Array.from(container.querySelectorAll('.project-card h3'))
                               .map(h=>h.textContent.trim());

    stored.forEach(p=>{
      if (existingTitles.includes(p.title.trim())) return;

      const div = document.createElement('div');
      div.className = 'project-card';
      
      let buttonsHTML = '';
      let extraContent = '';
      
      if (p.type === 'blender' && p.modelFile) {
        buttonsHTML = `
          <a href="${p.blendFile}" download="${p.blendFileName || 'modele_3d.blend'}" class="btn ghost">
            📥 Télécharger .blend
          </a>
          <a href="${p.modelFile}" download="${p.modelFileName}" class="btn ghost">
            📥 Télécharger .${p.modelFileType}
          </a>
        `;
        extraContent = `<div id="viewer-container-${p.title.replace(/\s+/g, '-')}" class="blender-viewer-content"></div>`;
      } 
      else if (p.type === 'media') {
        buttonsHTML = '';
        if (p.imageFile) {
          buttonsHTML += `
            <a href="${p.imageFile}" download="${p.imageName || 'image.png'}" class="btn ghost">
              📥 Télécharger Image
            </a>
          `;
        }
        if (p.videoFile) {
          buttonsHTML += `
            <a href="${p.videoFile}" download="${p.videoName || 'video.mp4'}" class="btn ghost">
              📥 Télécharger Vidéo
            </a>
          `;
        }
        extraContent = `<div id="media-${p.title.replace(/\s+/g, '-')}" class="media-gallery-container"></div>`;
      }
      else {
        buttonsHTML = `
          <a href="${p.link}" target="_blank" class="btn ghost">
            Voir le projet
          </a>
        `;
      }

      div.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        ${p.type === 'blender' ? `
          <p style="font-size:0.9rem;color:#7c4dff">
            🎮 Modèle 3D Interactif - Format: ${p.modelFileType.toUpperCase()}
          </p>
          <p style="font-size:0.8rem;color:var(--muted)">
            Utilisez la souris pour tourner, zoomer et déplacer le modèle
          </p>
        ` : ''}
        ${p.type === 'media' ? '<p style="font-size:0.9rem;color:#00e5ff">🖼️ Projet avec Médias</p>' : ''}
        <div class="project-actions">
          ${buttonsHTML}
        </div>
        ${extraContent}
      `;
      
      container.appendChild(div);
      
      // تهيئة العارض ثلاثي الأبعاد
      setTimeout(() => {
        if (p.type === 'blender' && p.modelFile) {
          const viewerContainer = document.getElementById(`viewer-container-${p.title.replace(/\s+/g, '-')}`);
          if (viewerContainer) {
            createInteractiveBlenderViewer(p.modelFile, p.modelFileType, viewerContainer);
          }
        }
        else if (p.type === 'media') {
          const mediaContainer = document.getElementById(`media-${p.title.replace(/\s+/g, '-')}`);
          if (mediaContainer) {
            createMediaGallery(p, mediaContainer);
          }
        }
      }, 500);
    });
  } catch(e){
    console.error('Erreur lors du chargement des projets', e);
  }
}

// التنظيف
function cleanupViewers() {
  blenderViewers.forEach((viewer, id) => {
    if (viewer.renderer) {
      viewer.renderer.dispose();
    }
  });
  blenderViewers.clear();
}

// التهيئة
document.addEventListener('DOMContentLoaded', ()=>{
  appendStoredProjects();
  setupActions();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('beforeunload', cleanupViewers);
});
