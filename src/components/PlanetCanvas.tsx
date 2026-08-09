import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Planet } from "../planet";
interface PlanetCanvasProps {
  config: Planet;
}

function createPlanetTexture(
  landColorHex: string,
  waterLevel: number,
  roughness: number,
  planetType: string,
  cratersConfig: number,
): { colorMap: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const canvas = document.createElement("canvas");
  const bumpCanvas = document.createElement("canvas");
  canvas.width = bumpCanvas.width = 1024;
  canvas.height = bumpCanvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const bumpCtx = bumpCanvas.getContext("2d")!;

  const landColor = new THREE.Color(landColorHex);
  const waterColor = new THREE.Color("#10437a");

  const imgData = ctx.createImageData(canvas.width, canvas.height);
  const data = imgData.data;

  const bumpImgData = bumpCtx.createImageData(
    bumpCanvas.width,
    bumpCanvas.height,
  );
  const bumpData = bumpImgData.data;

  const baseFreq = 1.5 + roughness * 4;
  const octaves = Math.floor(3 + roughness * 4);

  const hash = (x: number, y: number, z: number) => {
    const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
    return h - Math.floor(h);
  };

  const lerp = (a: number, b: number, t: number) => a + t * (b - a);
  const smooth = (t: number) => t * t * (3 - 2 * t);

  const valueNoise = (x: number, y: number, z: number) => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const iz = Math.floor(z);
    const fx = x - ix;
    const fy = y - iy;
    const fz = z - iz;

    const sx = smooth(fx);
    const sy = smooth(fy);
    const sz = smooth(fz);

    const n000 = hash(ix, iy, iz);
    const n100 = hash(ix + 1, iy, iz);
    const n010 = hash(ix, iy + 1, iz);
    const n110 = hash(ix + 1, iy + 1, iz);
    const n001 = hash(ix, iy, iz + 1);
    const n101 = hash(ix + 1, iy, iz + 1);
    const n011 = hash(ix, iy + 1, iz + 1);
    const n111 = hash(ix + 1, iy + 1, iz + 1);

    const nx00 = lerp(n000, n100, sx);
    const nx01 = lerp(n001, n101, sx);
    const nx10 = lerp(n010, n110, sx);
    const nx11 = lerp(n011, n111, sx);

    const nxy0 = lerp(nx00, nx10, sy);
    const nxy1 = lerp(nx01, nx11, sy);

    return lerp(nxy0, nxy1, sz);
  };

  const noise3D = (nx: number, ny: number, nz: number) => {
    let val = 0;
    let freq = baseFreq;
    let amp = 1;
    let maxAmp = 0;
    for (let i = 0; i < octaves; i++) {
      val += valueNoise(nx * freq, ny * freq, nz * freq) * amp;
      maxAmp += amp;
      freq *= 2.0;
      amp *= 0.5;
    }
    return val / maxAmp;
  };

  const craters: {
    cx: number;
    cy: number;
    cz: number;
    radius: number;
    depth: number;
  }[] = [];
  if (planetType === "terrestrial" && cratersConfig > 0) {
    for (let i = 0; i < cratersConfig; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      craters.push({
        cx: Math.sin(phi) * Math.cos(theta),
        cy: Math.cos(phi),
        cz: Math.sin(phi) * Math.sin(theta),
        radius: 0.02 + Math.random() * 0.08,
        depth: 0.1 + Math.random() * 0.3,
      });
    }
  }

  for (let y = 0; y < canvas.height; y++) {
    // Map y to phi [0, PI]
    const phi = (y / canvas.height) * Math.PI;
    const ny = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    for (let x = 0; x < canvas.width; x++) {
      // Map x to theta [0, 2PI]
      const theta = (x / canvas.width) * Math.PI * 2;
      const nx = sinPhi * Math.cos(theta);
      const nz = sinPhi * Math.sin(theta);

      const idx = (y * canvas.width + x) * 4;
      let r: number = 0;
      let b: number = 0;
      let g: number = 0;
      let bumpVal: number = 0;

      if (planetType === "gas" || planetType === "ice") {
        // Banded noise for giants
        // Distort latitude (ny) with some noise
        const distortion =
          valueNoise(nx * 2, ny * 2, nz * 2) * (1.5 + roughness * 2);
        const lat = ny * (10 + roughness * 10) + distortion;
        // Create bands using sine and noise for Gas Giants
        const bandVal =
          (Math.sin(lat) * 0.5 + 0.5) * 0.5 + noise3D(nx, ny * 2, nz) * 0.5;

        if (planetType === "ice") {
          const iceDistortion =
            valueNoise(nx * 2, ny * 2, nz * 2) * (0.5 + roughness);
          const iceLat = ny * (4 + roughness * 5) + iceDistortion;
          const iceBandVal =
            (Math.sin(iceLat) * 0.5 + 0.5) * 0.7 +
            noise3D(nx, ny * 2, nz) * 0.3;

          const iceColor = new THREE.Color("#48a3e6").lerp(
            new THREE.Color("#1f4b8e"),
            iceBandVal,
          );
          iceColor.lerp(landColor, 0.3);
          r = iceColor.r;
          g = iceColor.g;
          b = iceColor.b;
          bumpVal = 0.5 + noise3D(nx * 4, ny * 4, nz * 4) * 0.05 * roughness;
        } else if (planetType === "gas") {
          // Gas giant uses landColor directly modulated by bands
          const darkColor = landColor.clone().multiplyScalar(0.4);
          const lightColor = landColor.clone().multiplyScalar(1.2);
          const finalColor = darkColor.lerp(lightColor, bandVal);

          r = finalColor.r;
          g = finalColor.g;
          b = finalColor.b;
          bumpVal = 0.5 + noise3D(nx * 3, ny * 3, nz * 3) * 0.1 * roughness;
        }
      } else {
        let heightVal = noise3D(nx, ny, nz);

        for (let i = 0; i < craters.length; i++) {
          const crater = craters[i];
          const dot = nx * crater.cx + ny * crater.cy + nz * crater.cz;
          const dist = Math.acos(Math.max(-1, Math.min(1, dot)));

          if (dist < crater.radius) {
            const cr = dist / crater.radius;
            let craterEffect = 0;
            if (cr < 0.8) {
              const normalizedR = cr / 0.8;
              craterEffect = -crater.depth * (1 - normalizedR * normalizedR);
            } else {
              const normalizedR = (cr - 0.8) / 0.2;
              craterEffect =
                crater.depth * 0.5 * Math.sin(normalizedR * Math.PI);
            }
            heightVal += craterEffect * (1.0 - waterLevel * 0.5);
          }
        }

        heightVal = Math.max(0, heightVal);

        if (heightVal < waterLevel) {
          const depth = (waterLevel - heightVal) / Math.max(waterLevel, 0.01);
          const deepShade = Math.max(0.4, 1 - depth * 0.8);
          r = waterColor.r * deepShade;
          g = waterColor.g * deepShade;
          b = waterColor.b * deepShade;
          bumpVal = 0.5;
        } else {
          const elevation =
            (heightVal - waterLevel) / Math.max(1 - waterLevel, 0.01);
          const landShade = Math.max(0.4, 1.2 - elevation * 0.8);
          r = Math.min(1, landColor.r * landShade);
          g = Math.min(1, landColor.g * landShade);
          b = Math.min(1, landColor.b * landShade);
          bumpVal = 0.5 + elevation * 0.5;
        }
      }

      data[idx] = Math.floor(r * 255);
      data[idx + 1] = Math.floor(g * 255);
      data[idx + 2] = Math.floor(b * 255);
      data[idx + 3] = 255;

      const bumpByte = Math.max(0, Math.min(255, Math.floor(bumpVal * 255)));
      bumpData[idx] = bumpData[idx + 1] = bumpData[idx + 2] = bumpByte;
      bumpData[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  bumpCtx.putImageData(bumpImgData, 0, 0);

  const colorMap = new THREE.CanvasTexture(canvas);
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.ClampToEdgeWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;

  return { colorMap, bumpMap };
}

export function PlanetCanvas({ config }: PlanetCanvasProps) {
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const [isGenerating, setIsGenerating] = useState(true);

  const mountRef = useRef<HTMLDivElement>(null);
  const planetMeshRef = useRef<THREE.Mesh | null>(null);
  const moonsGroupRef = useRef<THREE.Group | null>(null);
  const systemGroupRef = useRef<THREE.Group | null>(null);
  const cameraRigRef = useRef<THREE.Group | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const moonDataRef = useRef<
    { mesh: THREE.Mesh; distance: number; speed: number; angle: number }[]
  >([]);

  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0 });
  const userRotationOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
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
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      // Spawn stars on a massive distant sphere so they don't clip through the solar system
      const radius = 400 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);
    }
    starsGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // Lighting & Star
    const starGeo = new THREE.SphereGeometry(2, 32, 32);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xfff4d6 });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    scene.add(starMesh);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    scene.add(sunLight.target);
    sunLightRef.current = sunLight;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05); // Very dim
    scene.add(ambientLight);

    // Camera Fill Light (Illuminates the dark side relative to view)
    const cameraFillLight = new THREE.DirectionalLight(0x445577, 1.2);
    cameraFillLight.position.set(0, 0, 1); // Emits from camera forward
    camera.add(cameraFillLight);

    // Planet System Group (orbits the star)
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);
    systemGroupRef.current = systemGroup;

    // Camera Rig (rotates independently of planet to maintain view angle)
    const cameraRig = new THREE.Group();
    systemGroup.add(cameraRig);
    cameraRigRef.current = cameraRig;
    cameraRig.add(camera); // Camera tracks the planet system via the rig

    // Base Planet Mesh (High resolution for displacement)
    const planetGeo = new THREE.SphereGeometry(1.6, 256, 128);
    const planetTextures = createPlanetTexture(
      config.colour,
      config.water * 0.9,
      config.terrain,
      config.type,
      Math.round(config.craters * 100),
    );
    const planetMat = new THREE.MeshStandardMaterial({
      map: planetTextures.colorMap,
      displacementMap: planetTextures.bumpMap,
      displacementScale: 0.15,
      roughness: 0.7,
      metalness: 0.1,
    });

    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetMesh.scale.setScalar(0.6 + config.size * 1.6);
    systemGroup.add(planetMesh);
    planetMeshRef.current = planetMesh;

    // Moons Group
    const moonsGroup = new THREE.Group();
    systemGroup.add(moonsGroup);
    moonsGroupRef.current = moonsGroup;

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Mouse / Touch Drag Events
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !planetMeshRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePositionRef.current.x;
      const deltaY = clientY - previousMousePositionRef.current.y;

      rotationVelocityRef.current = {
        x: deltaY * 0.005,
        y: deltaX * 0.005,
      };

      userRotationOffsetRef.current.y -= rotationVelocityRef.current.y;
      userRotationOffsetRef.current.x -= rotationVelocityRef.current.x;

      // Clamp vertical camera rotation to prevent flipping upside down
      userRotationOffsetRef.current.x = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, userRotationOffsetRef.current.x),
      );

      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onPointerDown);
    domElement.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    domElement.addEventListener("touchstart", onPointerDown);
    domElement.addEventListener("touchmove", onPointerMove);
    window.addEventListener("touchend", onPointerUp);

    // Zoom on wheel
    const onWheel = (e: WheelEvent) => {
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(2.5, Math.min(camera.position.z, 20)); // Limit zoom
    };
    domElement.addEventListener("wheel", onWheel, { passive: true });

    // Render & Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (planetMeshRef.current) {
        // Natural planet spin on its axis
        planetMeshRef.current.rotation.y += 0.002;

        if (!isDraggingRef.current) {
          // Apply momentum to camera orbit (inverted so dragging feels natural)
          userRotationOffsetRef.current.y -= rotationVelocityRef.current.y;
          userRotationOffsetRef.current.x -= rotationVelocityRef.current.x;
          userRotationOffsetRef.current.x = Math.max(
            -Math.PI / 2 + 0.1,
            Math.min(Math.PI / 2 - 0.1, userRotationOffsetRef.current.x),
          );

          rotationVelocityRef.current.x *= 0.92;
          rotationVelocityRef.current.y *= 0.92;
        }
      }

      if (systemGroupRef.current) {
        const orbitAngle = Date.now() * 0.0001; // Orbit speed
        const px = Math.cos(orbitAngle) * 35;
        const pz = Math.sin(orbitAngle) * 35;

        systemGroupRef.current.position.x = px;
        systemGroupRef.current.position.z = pz;

        if (sunLightRef.current) {
          sunLightRef.current.target.position.set(px, 0, pz);
        }

        // Keep camera looking at the lit side of the planet, plus user's custom rotation offset
        if (cameraRigRef.current) {
          cameraRigRef.current.rotation.y =
            orbitAngle + Math.PI * 0.75 + userRotationOffsetRef.current.y;
          cameraRigRef.current.rotation.x = userRotationOffsetRef.current.x;
        }
      }

      moonDataRef.current.forEach((moon) => {
        moon.angle += moon.speed;
        moon.mesh.position.x =
          Math.cos(moon.angle) *
          moon.distance *
          Math.cos(moon.mesh.userData.inclination);
        moon.mesh.position.z = Math.sin(moon.angle) * moon.distance;
        moon.mesh.position.y =
          Math.cos(moon.angle) *
          moon.distance *
          Math.sin(moon.mesh.userData.inclination);
        moon.mesh.rotation.y += 0.01;
      });

      starField.rotation.y += 0.0002;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);

      domElement.removeEventListener("mousedown", onPointerDown);
      domElement.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);

      domElement.removeEventListener("touchstart", onPointerDown);
      domElement.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      domElement.removeEventListener("wheel", onWheel);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (planetGeo) planetGeo.dispose();
      if (planetMat) {
        if (planetMat.map) planetMat.map.dispose();
        if (planetMat.displacementMap) planetMat.displacementMap.dispose();
        planetMat.dispose();
      }
      starGeo.dispose();
      starMat.dispose();
      starsGeo.dispose();
      starsMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Mesh & Texture on Config Change (Debounced to prevent lag)
  useEffect(() => {
    setIsGenerating(true);
    const timeoutId = window.setTimeout(() => {
      if (planetMeshRef.current) {
        planetMeshRef.current.scale.setScalar(0.6 + config.size * 1.6);

        const mat = planetMeshRef.current
          .material as THREE.MeshStandardMaterial;
        if (mat.map) mat.map.dispose();
        if (mat.displacementMap) mat.displacementMap.dispose();
        const newTextures = createPlanetTexture(
          config.colour,
          config.water * 0.9,
          config.terrain,
          config.type,
          Math.round(config.craters * 100),
        );
        mat.map = newTextures.colorMap;
        mat.displacementMap = newTextures.bumpMap;
        mat.needsUpdate = true;
      }

      if (
        moonsGroupRef.current &&
        moonDataRef.current.length !== config.moons
      ) {
        const moonsGroup = moonsGroupRef.current;
        // Clear old moons
        moonsGroup.clear();
        moonDataRef.current = [];

        const moonGeo = new THREE.SphereGeometry(1, 32, 32);
        const moonMat = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          roughness: 0.8,
          metalness: 0.1,
        });

        for (let i = 0; i < config.moons; i++) {
          const mesh = new THREE.Mesh(moonGeo, moonMat);
          const moonSize = 0.05 + Math.random() * 0.1;
          mesh.scale.setScalar(moonSize);

          const visualRadius = 0.6 + config.size * 1.6;
          const distance = visualRadius + 2 + Math.random() * 2;
          const speed =
            (0.005 + Math.random() * 0.015) * (Math.random() > 0.5 ? 1 : -1);
          const angle = Math.random() * Math.PI * 2;
          mesh.userData.inclination = (Math.random() - 0.5) * Math.PI * 0.5;

          moonsGroup.add(mesh);
          moonDataRef.current.push({ mesh, distance, speed, angle });
        }
      }
      setIsGenerating(false);
    }, 150); // Debounce 150ms

    return () => window.clearTimeout(timeoutId);
  }, [config]);


  return (
    <div className="absolute inset-0 w-full h-full">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 bg-[#0d0f12]/60 backdrop-blur-md z-50 flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="w-12 h-12 border-4 border-[#f5b1eb]/20 border-t-[#f5b1eb] rounded-full animate-spin mb-6"></div>
        </div>
      )}
    </div>
  );
}
