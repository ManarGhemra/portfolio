// js.js - عرض ملفات GLB ثلاثية الأبعاد

let activeScenes = [];

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

// تحميل وعرض نموذج GLB
function loadGLBModel(fileData, containerId, fileName) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // تنظيف الحاوية وإضافة مؤشر تحميل
  container.innerHTML = `
    <div class="model-loading">
      <div class="loading-spinner"></div>
      <p>Chargement de ${fileName}...</p>
    </div>
  `;
  
  setTimeout(() => {
    try {
      // تحويل Data URL إلى Blob
      const blob = dataURLToBlob(fileData);
      const url = URL.createObjectURL(blob);
      
      const loader = new THREE.GLTFLoader();
      
      loader.load(
        url,
        function(gltf) {
          // تنظيف الحاوية بعد التحميل
          container.innerHTML = '';
          
          // إنشاء المشهد
          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0x0a0a12);
          
          const width = container.clientWidth;
          const height = 400;
          
          const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
          camera.position.z = 5;
          
          const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
          });
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          container.appendChild(renderer.domElement);
          
          // إضافة النموذج إلى المشهد
          const model = gltf.scene;
          scene.add(model);
          
          // عناصر التحكم
          const controls = new THREE.OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.05;
          controls.minDistance = 1;
          controls.maxDistance = 50;
          
          // إضاءة متقدمة
          const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
          scene.add(ambientLight);
          
          const directionalLight1 = new THREE.DirectionalLight(0x7c4dff, 0.8);
          directionalLight1.position.set(5, 5, 5);
          scene.add(directionalLight1);
          
          const directionalLight2 = new THREE.DirectionalLight(0x00e5ff, 0.5);
          directionalLight2.position.set(-5, 5, -5);
          scene.add(directionalLight2);
          
          const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
          directionalLight3.position.set(0, -5, 0);
          scene.add(directionalLight3);
          
          // ضبط حجم وموقع النموذج
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 5 / maxDim;
          model.scale.multiplyScalar(scale);
          
          // مركزة النموذج
          model.position.x = -center.x * scale;
          model.position.y = -center.y * scale;
          model.position.z = -center.z * scale;
          
          // شبكة مساعدة
          const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
          gridHelper.position.y = box.min.y * scale;
          scene.add(gridHelper);
          
          // محاور مساعدة
          const axesHelper = new THREE.AxesHelper(5);
          scene.add(axesHelper);
          
          // دورة الرسوم المتحركة
          function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          }
          animate();
          
          // التعامل مع تغيير الحجم
          function handleResize() {
            const newWidth = container.clientWidth;
            camera.aspect = newWidth / height;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, height);
          }
          
          window.addEventListener('resize', handleResize);
          
          // حفظ المرجع
          const sceneId = containerId;
          activeScenes[sceneId] = {
            scene: scene,
            camera: camera,
            renderer: renderer,
            controls: controls,
            animate: animate,
            handleResize: handleResize
          };
          
          // تنظيف الذاكرة
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          
          console.log('Modèle GLB chargé avec succès:', fileName);
        },
        function(xhr) {
          // تقدم التحميل
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          const loadingElement = container.querySelector('.model-loading p');
          if (loadingElement && xhr.total > 0) {
            loadingElement.textContent = `Chargement de ${fileName}: ${percent}%`;
          }
        },
        function(error) {
          console.error('Erreur de chargement GLB:', error);
          container.innerHTML = `
            <div class="model-error">
              <div style="color: #ff4444; font-size: 2rem;">❌</div>
              <p style="color: #ff4444; margin: 10px 0;">Erreur de chargement du modèle</p>
              <p style="color: var(--muted); font-size: 0.9rem;">${fileName}</p>
              <button class="viewer-btn" onclick="retryLoad('${containerId}')">🔄 Réessayer</button>
            </div>
          `;
        }
      );
    } catch(error) {
      console.error('Erreur:', error);
      container.innerHTML = `
        <div class="model-error">
          <p style="color: #ff4444;">Erreur lors du traitement du fichier</p>
        </div>
      `;
    }
  }, 100);
}

// تحويل Data URL إلى Blob
function dataURLToBlob(dataURL) {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  
  return new Blob([uInt8Array], { type: contentType });
}

// إعادة المحاولة
function retryLoad(containerId) {
  const project = getProjectByContainerId(containerId);
  if (project) {
    loadGLBModel(project.fileData, containerId, project.fileName);
  }
}

// البحث عن المشروع بواسطة containerId
function getProjectByContainerId(containerId) {
  try {
    const projects = JSON.parse(localStorage.getItem('projects3d')) || [];
    const index = containerId.split('-')[2];
    return projects[index];
  } catch(e) {
    return null;
  }
}

// إنشاء بطاقة مشروع GLB
function createGLBProjectCard(project, index) {
  const containerId = `glb-viewer-${index}`;
  
  return `
    <div class="project-card glb-project">
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.desc)}</p>
      
      <div class="model-meta">
        <span class="file-info">
          📁 ${project.fileName} • ${(project.fileSize / 1024 / 1024).toFixed(2)} MB
        </span>
        <span class="model-help">
          🎮 Rotation: Souris • Zoom: Molette • Déplacement: Clic droit
        </span>
      </div>
      
      <div id="${containerId}" class="glb-viewer-container">
        <!-- سيتم تحميل النموذج هنا -->
      </div>
      
      <div class="model-controls">
        <button class="btn ghost" onclick="resetModelView('${containerId}')">
          🔄 Reset Vue
        </button>
        <button class="btn ghost" onclick="toggleHelpers('${containerId}')">
          🔲 Afficher/Masquer aides
        </button>
        <a href="${project.fileData}" download="${project.fileName}" class="btn ghost">
          📥 Télécharger GLB
        </a>
      </div>
    </div>
  `;
}

// إعادة تعيين عرض النموذج
function resetModelView(containerId) {
  if (activeScenes[containerId]) {
    activeScenes[containerId].controls.reset();
  }
}

// تبديل الأدوات المساعدة
function toggleHelpers(containerId) {
  if (activeScenes[containerId]) {
    const scene = activeScenes[containerId].scene;
    const grid = scene.getObjectByName('gridHelper');
    const axes = scene.getObjectByName('axesHelper');
    
    if (grid) grid.visible = !grid.visible;
    if (axes) axes.visible = !axes.visible;
  }
}

// تحميل وعرض مشاريع GLB
function loadGLBProjects() {
  try {
    const projects = JSON.parse(localStorage.getItem('projects3d')) || [];
    const container = document.getElementById('project-list');
    
    if (!container || projects.length === 0) return;
    
    // إضافة عنوان قسم النماذج ثلاثية الأبعاد
    let html = `
      <div style="margin: 40px 0 25px 0;">
        <h2 class="section-title">🎮 Modèles 3D Interactifs</h2>
        <p style="color: var(--muted); font-size: 0.9rem;">
          Modèles 3D exportés depuis Blender - Manipulables en temps réel
        </p>
      </div>
    `;
    
    // إضافة كل مشروع GLB
    projects.forEach((project, index) => {
      if (project.type === 'glb') {
        html += createGLBProjectCard(project, index);
      }
    });
    
    // إدراج قبل المشاريع الثابتة الأصلية
    const staticProjects = container.innerHTML;
    container.innerHTML = html + staticProjects;
    
    // تحميل النماذج بعد إضافتها إلى DOM
    setTimeout(() => {
      projects.forEach((project, index) => {
        if (project.type === 'glb') {
          loadGLBModel(project.fileData, `glb-viewer-${index}`, project.fileName);
        }
      });
    }, 500);
    
  } catch(e) {
    console.error('Erreur chargement projets GLB:', e);
  }
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  loadGLBProjects();
  setupActions();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});

// تنظيف الذاكرة
window.addEventListener('beforeunload', function() {
  Object.keys(activeScenes).forEach(key => {
    const scene = activeScenes[key];
    if (scene && scene.renderer) {
      scene.renderer.dispose();
    }
  });
  activeScenes = {};
});
