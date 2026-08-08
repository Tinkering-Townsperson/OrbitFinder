import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface PlanetConfig {
  size: number;              // Planet scale (0.6 to 2.2)
  terrainRoughness: number;  // Perlin terrain frequency/roughness (0 to 1)
  waterLevel: number;        // Threshold below which terrain is water (0 to 1)
  landColor: string;         // Primary land/surface color
  waterColor: string;        // Ocean/water color
  atmosphereColor: string;   // Atmosphere glow color
  showAtmosphere: boolean;
  atmosphereGlow: number;   // 0.2 to 2.0
  rotationSpeed: number;    // Continuous slow rotation speed
}

interface PlanetCanvasProps {
  config: PlanetConfig;
}

// Generate procedural noise planet surface texture
function createPlanetTexture(
  landColorHex: string,
  waterColorHex: string,
  waterLevel: number,
  roughness: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const landColor = new THREE.Color(landColorHex);
  const waterColor = new THREE.Color(waterColorHex);

  const imgData = ctx.createImageData(canvas.width, canvas.height);
  const data = imgData.data;

  const baseFreq = 0.003 + roughness * 0.015;
  const octaves = Math.floor(3 + roughness * 4);

  const noise = (x: number, y: number) => {
    let val = 0;
    let freq = baseFreq;
    let amp = 1;
    let maxAmp = 0;
    for (let i = 0; i < octaves; i++) {
      val += (Math.sin(x * freq + y * freq * 0.7) +
              Math.cos(x * freq * 1.3 - y * freq * 0.9) +
              Math.sin((x + y) * freq * 0.8)) * amp;
      maxAmp += amp;
      freq *= 2.1;
      amp *= 0.5;
    }
    return (val / (maxAmp * 3)) + 0.5;
  };

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;
      const heightVal = noise(x, y);

      let r: number, g: number, b: number;

      if (heightVal < waterLevel) {
        const depth = (waterLevel - heightVal) / Math.max(waterLevel, 0.01);
        const deepShade = Math.max(0.7, 1 - depth * 0.4);
        r = waterColor.r * deepShade;
        g = waterColor.g * deepShade;
        b = waterColor.b * deepShade;
      } else {
        const elevation = (heightVal - waterLevel) / Math.max(1 - waterLevel, 0.01);
        const landShade = 0.85 + elevation * 0.3;
        r = Math.min(1, landColor.r * landShade);
        g = Math.min(1, landColor.g * landShade);
        b = Math.min(1, landColor.b * landShade);
      }

      data[idx] = Math.floor(r * 255);
      data[idx + 1] = Math.floor(g * 255);
      data[idx + 2] = Math.floor(b * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function PlanetCanvas({ config }: PlanetCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const planetMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);

  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Background Stars
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 100;
      starPositions[i + 1] = (Math.random() - 0.5) * 100;
      starPositions[i + 2] = (Math.random() - 0.5) * 100;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(6, 3, 5);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x445577, 0.5);
    fillLight.position.set(-6, -3, -5);
    scene.add(fillLight);

    // Base Planet Mesh
    const planetGeo = new THREE.SphereGeometry(1.6, 64, 64);
    const planetTex = createPlanetTexture(
      config.landColor,
      config.waterColor,
      config.waterLevel,
      config.terrainRoughness
    );
    const planetMat = new THREE.MeshStandardMaterial({
      map: planetTex,
      roughness: 0.5,
      metalness: 0.1,
    });

    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetMesh.scale.setScalar(config.size);
    scene.add(planetMesh);
    planetMeshRef.current = planetMesh;

    // Atmosphere Mesh
    const atmosphereGeo = new THREE.SphereGeometry(1.72, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(config.atmosphereColor),
      transparent: true,
      opacity: config.showAtmosphere ? 0.25 * config.atmosphereGlow : 0,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    atmosphereMesh.scale.setScalar(config.size);
    scene.add(atmosphereMesh);
    atmosphereMeshRef.current = atmosphereMesh;

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Mouse / Touch Drag Events
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !planetMeshRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePositionRef.current.x;
      const deltaY = clientY - previousMousePositionRef.current.y;

      rotationVelocityRef.current = {
        x: deltaY * 0.005,
        y: deltaX * 0.005,
      };

      planetMeshRef.current.rotation.y += rotationVelocityRef.current.y;
      planetMeshRef.current.rotation.x += rotationVelocityRef.current.x;

      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    domElement.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domElement.addEventListener('touchstart', onPointerDown);
    domElement.addEventListener('touchmove', onPointerMove);
    window.addEventListener('touchend', onPointerUp);

    // Render & Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (planetMeshRef.current) {
        if (!isDraggingRef.current) {
          planetMeshRef.current.rotation.y += config.rotationSpeed || 0.002;
          planetMeshRef.current.rotation.x += rotationVelocityRef.current.x;
          planetMeshRef.current.rotation.y += rotationVelocityRef.current.y;
          rotationVelocityRef.current.x *= 0.92;
          rotationVelocityRef.current.y *= 0.92;
        }
      }

      starField.rotation.y += 0.0002;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);

      domElement.removeEventListener('mousedown', onPointerDown);
      domElement.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);

      domElement.removeEventListener('touchstart', onPointerDown);
      domElement.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      planetGeo.dispose();
      planetMat.dispose();
      planetTex.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      starsGeo.dispose();
      starsMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Mesh & Texture on Config Change
  useEffect(() => {
    if (planetMeshRef.current) {
      planetMeshRef.current.scale.setScalar(config.size);

      const mat = planetMeshRef.current.material as THREE.MeshStandardMaterial;
      if (mat.map) mat.map.dispose();
      mat.map = createPlanetTexture(
        config.landColor,
        config.waterColor,
        config.waterLevel,
        config.terrainRoughness
      );
      mat.needsUpdate = true;
    }

    if (atmosphereMeshRef.current) {
      atmosphereMeshRef.current.scale.setScalar(config.size);
      const mat = atmosphereMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.color.set(config.atmosphereColor);
      mat.opacity = config.showAtmosphere ? 0.25 * config.atmosphereGlow : 0;
      mat.needsUpdate = true;
    }
  }, [config]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
    />
  );
}
