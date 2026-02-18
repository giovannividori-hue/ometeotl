'use client'

import { useEffect, useRef } from 'react'

type SectionRef = React.RefObject<HTMLElement | null>

export default function HeroScene({ aiRef, govRef, evalRef }:{ aiRef: SectionRef, govRef: SectionRef, evalRef: SectionRef }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let alive = true
    let rafId: number | null = null
    let startRaf: number | null = null
    if (typeof window === 'undefined') return

    // Initialize only after the canvas DOM node is mounted. Sometimes the dynamic
    // import resolves before the ref is assigned causing an early return —
    // poll via requestAnimationFrame until canvas exists, then init once.
    const tryStart = () => {
      if (!alive) return
      const canvas = canvasRef.current
      if (!canvas) {
        startRaf = requestAnimationFrame(tryStart)
        return
      }

      import('three').then((THREE) => {
        if (!alive) return

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 5

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)

      const TWEAKS = {
        ETH_RIGOR: "#11707A",
        TECHNEUTRAL: "#176E76",
        PURE_CYAN: "#00B8D4",
        WIREFRAME_COLOR_DEFAULT: "#11707A",
        WIREFRAME_OPACITY: 0.85,
        ROT_OSC_SPEED_Y: 0.18,
        ROT_OSC_AMP_Y: 0.6,
        ROT_OSC_SPEED_X: 0.12,
        ROT_OSC_AMP_X: 0.15,
        ROTATION_SPEED: 0.18,
        RECONSTRUCT_DURATION: 8.0,
        DISPERSE_STRENGTH: 0.45,
        DEFORM_STRENGTH: 0.08,
        BREATH_AMPLITUDE: 0.004,
        BREATH_SPEED: 0.22,
        FOG_DENSITY: 0.012,
        PARTICLE_COUNT: 800,
        DISPERSE_SMOOTHING: 2.2,
        DPR_CLAMP: 2,
        LIGHT_INTENSITY: 2.04
      } as const

      function derivedParams(t: typeof TWEAKS) {
        const DPR = Math.min(window.devicePixelRatio || 1, t.DPR_CLAMP)
        const isSmall = window.innerWidth < 768
        return {
          DPR,
          ROUGHNESS: 0.45,
          CLEARCOAT: 0.22,
          BEAD_COUNT: isSmall ? 700 : 1800,
          BEAD_SIZE: isSmall ? 0.045 : 0.034,
        }
      }

      const DERIVED = derivedParams(TWEAKS)
      renderer.setPixelRatio(DERIVED.DPR)
      renderer.setClearColor(0x000000, 1)

      let targetDisperse = 0

      const Phase = {
        HERO: 'HERO',
        FRAGMENT: 'FRAGMENT',
        RESEARCH: 'RESEARCH',
        SERVICES: 'SERVICES',
        OUTRO: 'OUTRO'
      } as const

      type PhaseType = typeof Phase[keyof typeof Phase]

      const heroState: {
        phase: PhaseType
        showHero: boolean
        showBeads: boolean
        showFragments: boolean
      } = { phase: Phase.HERO, showHero: true, showBeads: false, showFragments: false }

      scene.fog = new THREE.FogExp2(0x000000, TWEAKS.FOG_DENSITY)

      const clock = new THREE.Clock()

      function mulberry32(a: number) {
        return function() {
          let t = (a += 0x6D2B79F5)
          t = Math.imul(t ^ (t >>> 15), t | 1)
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296
        }
      }

      const seeded = mulberry32(123456)

      const spot = new THREE.SpotLight(0xffffff, TWEAKS.LIGHT_INTENSITY, 0, Math.PI / 6, 0.9)
      spot.position.set(0, 6, 2)
      spot.penumbra = 0.85
      spot.decay = 2
      spot.distance = 20
      spot.castShadow = false
      scene.add(spot)

      const fill = new THREE.DirectionalLight(0xffffff, 0.06)
      fill.position.set(0, -1, -1)
      scene.add(fill)

      const sharedUniforms = {
        time: { value: 0 },
        cycleProgress: { value: 0 },
        disperseStrength: { value: 0 },
        deformStrength: { value: TWEAKS.DEFORM_STRENGTH },
        breathSpeed: { value: TWEAKS.BREATH_SPEED }
      }

      const groupHero = new THREE.Group()
      scene.add(groupHero)

      const sphereGeo = new THREE.IcosahedronGeometry(1.5, 4)
      const posAttr = sphereGeo.attributes.position as any
      const basePos = new Float32Array((posAttr.count as number) * 3)
      for (let i = 0; i < (posAttr.count as number); i++) {
        basePos[i * 3] = posAttr.getX(i)
        basePos[i * 3 + 1] = posAttr.getY(i)
        basePos[i * 3 + 2] = posAttr.getZ(i)
      }
      sphereGeo.setAttribute('aBasePos', new THREE.BufferAttribute(basePos, 3))

      const simplexGLSL = `
    float hash(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453123); }
    float snoise(vec3 p){
      vec3 i = floor(p);
      vec3 f = fract(p);
      // trilinear interpolation of hashed corners (cheap value-noise)
      float n000 = hash(i + vec3(0.0,0.0,0.0));
      float n100 = hash(i + vec3(1.0,0.0,0.0));
      float n010 = hash(i + vec3(0.0,1.0,0.0));
      float n110 = hash(i + vec3(1.0,1.0,0.0));
      float n001 = hash(i + vec3(0.0,0.0,1.0));
      float n101 = hash(i + vec3(1.0,0.0,1.0));
      float n011 = hash(i + vec3(0.0,1.0,1.0));
      float n111 = hash(i + vec3(1.0,1.0,1.0));
      vec3 u = f * f * (3.0 - 2.0 * f);
      float nx00 = mix(n000, n100, u.x);
      float nx10 = mix(n010, n110, u.x);
      float nx01 = mix(n001, n101, u.x);
      float nx11 = mix(n011, n111, u.x);
      float nxy0 = mix(nx00, nx10, u.y);
      float nxy1 = mix(nx01, nx11, u.y);
      float nxyz = mix(nxy0, nxy1, u.z);
      return nxyz * 2.0 - 1.0;
    }
      `

      function injectDisplacement(material: any) {
        material.onBeforeCompile = (shader: any) => {
          shader.uniforms.time = sharedUniforms.time
          shader.uniforms.disperseStrength = sharedUniforms.disperseStrength
          shader.uniforms.deformStrength = sharedUniforms.deformStrength
          shader.uniforms.breathSpeed = sharedUniforms.breathSpeed

          shader.vertexShader = 'attribute vec3 aBasePos; uniform float time; uniform float deformStrength; uniform float breathSpeed; uniform float disperseStrength;\n' + simplexGLSL + '\n' + shader.vertexShader

          shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>\n\n            float n = snoise((position + aBasePos) * 1.6 + vec3(time * 0.02));\n            float breath = sin(time * breathSpeed + position.y * 0.7) * 0.5 + 0.5;\n            float deform = deformStrength * (0.5 * n + 0.5) * (1.0 - disperseStrength);\n            transformed += normal * deform * 0.6;\n            transformed += normal * disperseStrength * 0.7 * (0.6 + 0.4 * snoise(position * 3.1));\n          `)
        }
      }

      const physMat = new THREE.MeshPhysicalMaterial({
        color: 0x00b8d4,
        roughness: Math.max(0.18, DERIVED.ROUGHNESS - 0.08),
        metalness: 0.06,
        clearcoat: 0.18,
        clearcoatRoughness: 0.28,
        reflectivity: 0.35,
        flatShading: false,
        dithering: true,
        transparent: true,
        opacity: 0.92,
      })
      ;(physMat as any).uniforms = sharedUniforms
      injectDisplacement(physMat)
      const physMatClone = physMat.clone()
      ;(physMatClone as any).uniforms = sharedUniforms
      injectDisplacement(physMatClone)

      const wireframeMat: any = physMat
      const facesMat: any = physMatClone

      const wireframeSphere = new THREE.Mesh(sphereGeo, wireframeMat)
      wireframeSphere.castShadow = false
      wireframeSphere.receiveShadow = false

      const facesSphere = new THREE.Mesh(sphereGeo, facesMat)
      facesSphere.scale.set(1.001, 1.001, 1.001)
      try { facesSphere.visible = false } catch (e) {}

      const edgesGeo = new THREE.EdgesGeometry(sphereGeo)
      const WIRE_COLOR = parseInt(String(TWEAKS.WIREFRAME_COLOR_DEFAULT).slice(1), 16)

      const wireShaderMat = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: `...`,
        fragmentShader: `uniform vec3 uColor;\nvoid main(){ gl_FragColor = vec4(uColor, 1.0); }`,
        transparent: true,
        blending: THREE.NormalBlending,
        depthTest: true
      })

      wireShaderMat.uniforms = {
        time: sharedUniforms.time,
        cycleProgress: sharedUniforms.cycleProgress,
        disperseStrength: sharedUniforms.disperseStrength,
        deformStrength: sharedUniforms.deformStrength,
        breathSpeed: sharedUniforms.breathSpeed,
        uColor: { value: new (THREE as any).Color(WIRE_COLOR) }
      }

      const edgePos = (edgesGeo.attributes.position as any).array as Float32Array
      const aBase = new Float32Array(edgePos.length)
      for (let i = 0; i < edgePos.length; i++) aBase[i] = edgePos[i]
      edgesGeo.setAttribute('aBasePos', new THREE.BufferAttribute(aBase, 3))
      const wireLines = new THREE.LineSegments(edgesGeo, wireShaderMat)
      wireLines.renderOrder = 999
      groupHero.add(wireLines)

      // --- Minimal nodes (bright points) sampled from the base geometry ---
      const totalVerts = (posAttr.count as number)
      const NODE_COUNT = Math.min(140, Math.floor(totalVerts / 4))
      const step = Math.max(1, Math.floor(totalVerts / NODE_COUNT))
      const nodeIndices: number[] = []
      for (let i = 0; i < totalVerts; i += step) nodeIndices.push(i)

      const nodesPos = new Float32Array(nodeIndices.length * 3)
      for (let i = 0; i < nodeIndices.length; i++) {
        const idx = nodeIndices[i]
        nodesPos[i * 3] = basePos[idx * 3]
        nodesPos[i * 3 + 1] = basePos[idx * 3 + 1]
        nodesPos[i * 3 + 2] = basePos[idx * 3 + 2]
      }

      const nodesGeo = new THREE.BufferGeometry()
      nodesGeo.setAttribute('position', new THREE.BufferAttribute(nodesPos, 3))
      const NODE_COLOR = 0x00b3a8
      // Smaller pixel size to avoid giant blocks; will appear as subtle points
      const NODE_BASE_SIZE = 2.0
      const nodesMat = new THREE.PointsMaterial({ color: NODE_COLOR, size: Math.max(0.6, NODE_BASE_SIZE * 0.5), sizeAttenuation: true, transparent: true, opacity: 0.75, blending: THREE.NormalBlending })
      nodesMat.depthTest = true
      const nodes = new THREE.Points(nodesGeo, nodesMat)
      nodes.renderOrder = 1000
      groupHero.add(nodes)

      // --- Instanced beads (glassy beads that disperse) ---
      const disposables: any[] = []

      const BEAD_COUNT = Math.min(DERIVED.BEAD_COUNT, 900)
      const beadGeo = new THREE.SphereGeometry(DERIVED.BEAD_SIZE, 8, 8)
      const beadMat = new THREE.MeshPhysicalMaterial({ color: 0x00dfe7, roughness: 0.14, metalness: 0.05, clearcoat: 0.5, transparent: true, opacity: 0.86, reflectivity: 0.5 })
      beadMat.depthTest = true
      disposables.push(beadGeo, beadMat)

      const beads = new (THREE as any).InstancedMesh(beadGeo, beadMat, BEAD_COUNT)
      beads.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      beads.frustumCulled = false
      groupHero.add(beads)

      // sample base positions for beads from sphere vertices with slight jitter
      const beadBasePos: Float32Array = new Float32Array(BEAD_COUNT * 3)
      for (let i = 0; i < BEAD_COUNT; i++) {
        const vi = Math.floor(seeded() * (posAttr.count as number))
        beadBasePos[i * 3] = basePos[vi * 3] + (seeded() - 0.5) * 0.02
        beadBasePos[i * 3 + 1] = basePos[vi * 3 + 1] + (seeded() - 0.5) * 0.02
        beadBasePos[i * 3 + 2] = basePos[vi * 3 + 2] + (seeded() - 0.5) * 0.02
      }

      // store per-instance random factor
      const beadRandom: Float32Array = new Float32Array(BEAD_COUNT)
      for (let i = 0; i < BEAD_COUNT; i++) beadRandom[i] = seeded()

      // helper temp objects
      const tmpMat = new THREE.Matrix4()
      const tmpPos = new THREE.Vector3()
      const tmpQuat = new THREE.Quaternion()
      const tmpScale = new THREE.Vector3()

      // --- Particle points for fragments/deposition ---
      const PARTICLE_COUNT = Math.max(200, Math.min(TWEAKS.PARTICLE_COUNT, 1200))
      const partPos = new Float32Array(PARTICLE_COUNT * 3)
      const partVel = new Float32Array(PARTICLE_COUNT * 3)
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const vi = Math.floor(seeded() * (posAttr.count as number))
        partPos[i * 3] = basePos[vi * 3]
        partPos[i * 3 + 1] = basePos[vi * 3 + 1]
        partPos[i * 3 + 2] = basePos[vi * 3 + 2]
        partVel[i * 3] = (seeded() - 0.5) * 0.02
        partVel[i * 3 + 1] = (seeded() - 0.5) * 0.02
        partVel[i * 3 + 2] = (seeded() - 0.5) * 0.02
      }

      const particlesGeo = new THREE.BufferGeometry()
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3))
      const particlesMat = new THREE.PointsMaterial({ color: 0x00e0d8, size: 0.9, transparent: true, opacity: 0.45, blending: THREE.NormalBlending })
      particlesMat.depthTest = true
      disposables.push(particlesGeo, particlesMat)
      const particles = new THREE.Points(particlesGeo, particlesMat)
      particles.renderOrder = 1001
      groupHero.add(particles)

      // show a subtle filled surface behind the wire to restore sculptural presence
      try { facesSphere.visible = true; facesMat.transparent = true; facesMat.opacity = 0.14; facesMat.depthWrite = false } catch (e) {}

      // ResizeObserver caching
      const cachedRects: Record<string, DOMRect | null> = { ai: null, gov: null, eval: null }
      let ro: ResizeObserver | null = null
      try {
        if (typeof window !== 'undefined' && typeof ResizeObserver !== 'undefined') {
          ro = new ResizeObserver(() => {
            try {
              cachedRects.ai = aiRef.current ? aiRef.current.getBoundingClientRect() : null
              cachedRects.gov = govRef.current ? govRef.current.getBoundingClientRect() : null
              cachedRects.eval = evalRef.current ? evalRef.current.getBoundingClientRect() : null
            } catch (e) {}
          })
          if (aiRef.current) ro.observe(aiRef.current)
          if (govRef.current) ro.observe(govRef.current)
          if (evalRef.current) ro.observe(evalRef.current)
          cachedRects.ai = aiRef.current ? aiRef.current.getBoundingClientRect() : null
          cachedRects.gov = govRef.current ? govRef.current.getBoundingClientRect() : null
          cachedRects.eval = evalRef.current ? evalRef.current.getBoundingClientRect() : null
        }
      } catch (e) {}

      // Scroll handling -> progressRef
      let progressRef = { value: 0 }
      let pending = false
      const handleScroll = () => {
        const scrolled = window.scrollY
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const progress = Math.min(scrolled / maxScroll, 1)
        if (!pending) {
          pending = true
          requestAnimationFrame(() => { pending = false })
        }
        progressRef.value = progress
      }

      window.addEventListener('scroll', handleScroll)
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      })

      let time = 0
      const CYCLE_DURATION = 12
      const BUILD_DURATION = TWEAKS.RECONSTRUCT_DURATION
      function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }
      function easeInOutCubic(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 }

      // reduced-motion handling
      const prefersReduced = (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      if (prefersReduced) {
        ;(TWEAKS as any).BREATH_AMPLITUDE = 0
        ;(TWEAKS as any).ROT_OSC_AMP_X = 0
        ;(TWEAKS as any).ROT_OSC_AMP_Y = 0
      }

      const animate = () => {
        if (!alive) return
        let delta = clock.getDelta()
        delta = Math.min(delta, 0.033)
        time += delta

        const rawCycle = (time % CYCLE_DURATION) / CYCLE_DURATION
        if (time < BUILD_DURATION) {
          const tNorm = Math.min(Math.max(time / BUILD_DURATION, 0), 1)
          const val = 1 - easeInOutCubic(tNorm)
          targetDisperse = val
        }
        const cycleProgress = rawCycle < 0.5 ? rawCycle * 2 : 2 - rawCycle * 2

        // update material uniforms
        try {
          wireframeMat.uniforms.time.value = time
          wireframeMat.uniforms.cycleProgress.value = cycleProgress
          facesMat.uniforms.time.value = time
          facesMat.uniforms.cycleProgress.value = cycleProgress
        } catch (e) {}

        try {
          const progress = progressRef.value || 0
          const phase = progress < 0.35 ? Phase.HERO : (progress < 0.5 ? Phase.FRAGMENT : (progress < 0.7 ? Phase.RESEARCH : (progress < 0.85 ? Phase.SERVICES : Phase.OUTRO)))
          // applyPhase simplified here: set targets/booleans
          switch (phase) {
            case Phase.HERO:
              targetDisperse = 0
              heroState.showHero = true
              heroState.showBeads = false
              heroState.showFragments = false
              break
            case Phase.FRAGMENT: {
              const fragmentStart = 0.35
              const fragmentEnd = 0.5
              const fragmentProgress = (progress - fragmentStart) / (fragmentEnd - fragmentStart)
              targetDisperse = fragmentProgress
              heroState.showHero = true
              heroState.showFragments = true
              heroState.showBeads = false
            } break
            case Phase.RESEARCH:
              targetDisperse = 1
              heroState.showHero = false
              heroState.showFragments = true
              heroState.showBeads = true
              break
            case Phase.SERVICES:
              targetDisperse = 1
              heroState.showHero = false
              heroState.showFragments = true
              heroState.showBeads = true
              break
            case Phase.OUTRO:
              targetDisperse = 1
              heroState.showHero = false
              heroState.showFragments = false
              heroState.showBeads = false
              break
          }
        } catch (e) {}

        try {
          const smoothing = TWEAKS.DISPERSE_SMOOTHING
          const alpha = Math.min(1, delta * smoothing)
          sharedUniforms.disperseStrength.value = THREE.MathUtils.lerp(sharedUniforms.disperseStrength.value, targetDisperse, alpha)
        } catch (e) {}

        // update instanced beads positions based on disperseStrength
        try {
          const d = sharedUniforms.disperseStrength.value
          for (let i = 0; i < BEAD_COUNT; i++) {
            tmpPos.set(
              beadBasePos[i * 3],
              beadBasePos[i * 3 + 1],
              beadBasePos[i * 3 + 2]
            )
            // push outward along rough normal by scaling from center
            tmpPos.multiplyScalar(1 + d * (0.8 + beadRandom[i] * 1.6))
            tmpQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), beadRandom[i] * Math.PI * 2)
            const s = 1 + d * 0.25
            tmpScale.setScalar(s)
            tmpMat.compose(tmpPos, tmpQuat, tmpScale)
            beads.setMatrixAt(i, tmpMat)
          }
          beads.instanceMatrix.needsUpdate = true
        } catch (e) {}

        // update particles positions
        try {
          const d = sharedUniforms.disperseStrength.value
          const posAttrP = particlesGeo.attributes.position as any
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3
            partVel[ix] += (seeded() - 0.5) * 0.002 * d
            partVel[ix + 1] += (seeded() - 0.5) * 0.002 * d
            partVel[ix + 2] += (seeded() - 0.5) * 0.002 * d
            partPos[ix] += partVel[ix] * (1 + d * 2)
            partPos[ix + 1] += partVel[ix + 1] * (1 + d * 2)
            partPos[ix + 2] += partVel[ix + 2] * (1 + d * 2)
            partVel[ix] *= 0.995
            partVel[ix + 1] *= 0.995
            partVel[ix + 2] *= 0.995
            posAttrP.setXYZ(i, partPos[ix], partPos[ix + 1], partPos[ix + 2])
          }
          posAttrP.needsUpdate = true
        } catch (e) {}

        // Simple animated rotation + breathing so sphere is visible
        try {
          const breathScale = 1 + (TWEAKS.BREATH_AMPLITUDE || 0) * Math.sin(time * (TWEAKS.BREATH_SPEED || 1))
          groupHero.scale.setScalar(breathScale)
          groupHero.rotation.x = time * (TWEAKS.ROTATION_SPEED || 0.12) * 0.6
          groupHero.rotation.y = time * (TWEAKS.ROTATION_SPEED || 0.12)
        } catch (e) {}

        try { renderer.render(scene, camera) } catch (e) {}
        if (alive) rafId = requestAnimationFrame(animate)
      }

      rafId = requestAnimationFrame(animate)

      return () => {
        alive = false
        try { if (typeof rafId === 'number') cancelAnimationFrame(rafId) } catch (e) {}
        try { if (typeof startRaf === 'number') cancelAnimationFrame(startRaf) } catch (e) {}
        window.removeEventListener('scroll', handleScroll)
        try { if (ro && typeof ro.disconnect === 'function') ro.disconnect() } catch (e) {}

        // dispose common objects and materials/geometries created
        try {
          // dispose instanced mesh resources
          try { if (beads) { beads.parent && beads.parent.remove(beads); beads.geometry && beads.geometry.dispose(); beads.material && beads.material.dispose(); } } catch (e) {}
          try { if (particles) { particles.parent && particles.parent.remove(particles); particles.geometry && particles.geometry.dispose(); particles.material && particles.material.dispose(); } } catch (e) {}
          try { if (nodes) { nodes.parent && nodes.parent.remove(nodes); nodes.geometry && nodes.geometry.dispose(); nodes.material && nodes.material.dispose(); } } catch (e) {}

          // generic traverse disposal for any remaining geometries/materials
          scene.traverse((obj: any) => {
            try {
              if (obj.geometry) { obj.geometry.dispose && obj.geometry.dispose() }
              if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach((m: any) => { try { m.dispose && m.dispose() } catch (e) {} })
                else try { obj.material.dispose && obj.material.dispose() } catch (e) {}
              }
            } catch (e) {}
          })

        } catch (e) {}

        try {
          // try to force WebGL context loss
          const gl = (renderer as any).getContext && (renderer as any).getContext()
          try { const lose = gl && gl.getExtension && gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext(); } catch (e) {}
        } catch (e) {}

        try { renderer.dispose() } catch (e) {}
      }
    }).catch(() => {
      // noop - graceful failure if import fails
    })
    }

    // start polling for canvas and initialization
    tryStart()
    return () => {
      alive = false
      try { if (typeof startRaf === 'number') cancelAnimationFrame(startRaf) } catch (e) {}
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" style={{ background: '#000000', pointerEvents: 'none' }} />
}
