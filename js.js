// js.js - Three.js fonctionnel immédiatement

let scenes = [];

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

// إنشاء نموذج ثلاثي الأبعاد
function create3DModel(modelType, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // تنظيف الحاوية
  container.innerHTML = '';
  
  // إنشاء المشهد
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a12);
  
  // الكاميرا
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / 300, 0.1, 1000);
  camera.position.z = 5;
  
  // العارض
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, 300);
  container.appendChild(renderer.domElement);
  
  // عناصر التحكم
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // الإضاءة
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0x7c4dff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  const directionalLight2 = new THREE.DirectionalLight(0x00e5ff, 0.4);
  directionalLight2.position.set(-5, -5, -5);
  scene.add(directionalLight2);
  
  // إنشاء النموذج
  let geometry, material, mesh;
  
  switch(modelType) {
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
        shininess: 100
      });
      break;
      
    case 'cone':
      geometry = new THREE.ConeGeometry(1.5, 3, 32);
      material = new THREE.MeshPhongMaterial({ 
        color: 0xff6b6b,
        shininess: 100 
      });
      break;
      
    case 'torus':
      geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
      material = new THREE.MeshPhongMaterial({ 
        color: 0x4dff7c,
        shininess: 100 
      });
      break;
      
    case 'monkey':
      geometry = new THREE.IcosahedronGeometry(1.5, 1);
      material = new THREE.MeshPhongMaterial({ 
        color: 0xffeb3b,
        flatShading: true 
      });
      break;
  }
  
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  
  // شبكة مساعدة
  const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
  scene.add(gridHelper);
  
  // محاور مساعدة
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);
  
  // دورة الرسوم المتحركة
  function animate() {
    requestAnimationFrame(animate);
    
    // دوران تلقائي بسيط
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
  
  // التعامل مع تغيير الحجم
  function handleResize() {
    const newWidth = container.clientWidth;
    camera.aspect = newWidth / 300;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, 300);
  }
  
  window.addEventListener('resize', handleResize);
  
  // حفظ المرجع للمستقبل
  scenes.push({
    scene: scene,
    camera: camera,
    renderer: renderer,
    controls: controls,
    animate: animate,
    handleResize: handleResize
  });
}

// إنشاء بطاقة مشروع ثلاثي الأبعاد
function create3DProjectCard(project, index) {
  const cardId = `project-3d-${index}`;
  
  return `
    <div class="project-card" id="${cardId}">
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.desc)}</p>
      <div class="model-info">
        <span class="model-type">🎮 ${project.modelType}</span>
        <span class="model-help">💡 Utilise la souris pour tourner et zoomer</span>
      </div>
      <div id="viewer-${index}" class="blender-viewer-3d" style="height: 300px; width: 100%;"></div>
      <div class="project-actions">
        <button class="btn ghost" onclick="resetCamera(${index})">🔄 Reset Vue</button>
        <button class="btn ghost" onclick="toggleRotation(${index})">⚡ Rotation</button>
      </div>
    </div>
  `;
}

// إعادة ضبط الكاميرا
function resetCamera(index) {
  if (scenes[index]) {
    scenes[index].controls.reset();
  }
}

// تبديل الدوران
function toggleRotation(index) {
  // يمكن إضافة منطق لإيقاف/تشغيل الدوران
  alert('Rotation activée/désactivée');
}

// تحميل وعرض المشاريع ثلاثية الأبعاد
function load3DProjects() {
  try {
    const projects = JSON.parse(localStorage.getItem('projects3d')) || [];
    const container = document.getElementById('project-list');
    
    if (!container || projects.length === 0) return;
    
    // إضافة عنوان قسم المشاريع ثلاثية الأبعاد
    let html = `
      <div style="margin: 30px 0 20px 0;">
        <h2 class="section-title">🎮 Projets 3D Interactifs</h2>
        <p style="color: var(--muted); font-size: 0.9rem;">Modèles 3D manipulables en temps réel</p>
      </div>
    `;
    
    // إضافة كل مشروع
    projects.forEach((project, index) => {
      html += create3DProjectCard(project, index);
    });
    
    // إدراج قبل المشاريع الثابتة الأصلية
    const staticProjects = container.innerHTML;
    container.innerHTML = html + staticProjects;
    
    // تهيئة المشاهد ثلاثية الأبعاد بعد إضافةها إلى DOM
    setTimeout(() => {
      projects.forEach((project, index) => {
        create3DModel(project.modelType, `viewer-${index}`);
      });
    }, 100);
    
  } catch(e) {
    console.error('Erreur chargement projets 3D:', e);
  }
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  load3DProjects();
  setupActions();
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});

// تنظيف الذاكرة عند مغادرة الصفحة
window.addEventListener('beforeunload', function() {
  scenes.forEach(scene => {
    if (scene.renderer) {
      scene.renderer.dispose();
    }
  });
  scenes = [];
});
