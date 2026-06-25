"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"

export interface Shape3dProps {
  className?: string
  scanTrigger?: number
}

export function Shape3d({ className, scanTrigger }: Shape3dProps) {
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const laserLineRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [isInView, setIsInView] = useState(false)
  const isInViewRef = useRef(false)

  const scanOffsetRef = useRef(0.0)
  const scanTargetRef = useRef(2.0)
  const isScanningRef = useRef(true)

  useEffect(() => {
    if (scanTrigger && scanTrigger > 0) {
      scanTargetRef.current += 2.0
      isScanningRef.current = true
    }
  }, [scanTrigger])

  useEffect(() => {
    isInViewRef.current = isInView
  }, [isInView])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
        if (!entry.isIntersecting) {
          mouseRef.current = { x: 0, y: 0 }
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isInViewRef.current || !containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()

      const x = (e.clientX - rect.left - rect.width / 2) / rect.width
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height

      mouseRef.current = { x, y }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])


  useEffect(() => {
    if (!isClient || !containerRef.current || !canvasRef.current) return

    let isMounted = true
    const container = containerRef.current
    const canvas = canvasRef.current

    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 1, 3.2)
    camera.lookAt(0, 0.95, 0)

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    })
    renderer.setSize(width, height, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    let pointsMesh: THREE.Points | null = null
    let geometry: THREE.BufferGeometry | null = null
    let material: THREE.ShaderMaterial | null = null

    const loadGLB = (src: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader()
        loader.setMeshoptDecoder(MeshoptDecoder)
        loader.load(
          src,
          (gltf) => resolve(gltf),
          undefined,
          (error) => reject(error)
        )
      })
    }

    loadGLB("/me.glb")
      .then((gltf) => {
        if (!isMounted) return

        let headMesh: any = null
        gltf.scene.traverse((child: any) => {
          if (child.isMesh) {
            headMesh = child
          }
        })

        if (!headMesh) {
          throw new Error("No mesh found in the GLB model")
        }

        const headGeometry = headMesh.geometry
        const headMaterial = headMesh.material as any
        const texture = headMaterial ? headMaterial.map : null

        let hasTexture = false
        let texWidth = 1024
        let texHeight = 1024
        let texData: Uint8ClampedArray | null = null

        if (texture) {
          const img = texture.image as any
          if (img) {
            try {
              const texCanvas = document.createElement("canvas")
              const texCtx = texCanvas.getContext("2d")
              if (texCtx) {
                texWidth = img.width || 1024
                texHeight = img.height || 1024
                texCanvas.width = texWidth
                texCanvas.height = texHeight
                texCtx.drawImage(img, 0, 0, texWidth, texHeight)
                texData = texCtx.getImageData(0, 0, texWidth, texHeight).data
                hasTexture = true
              }
            } catch (e) {
              console.warn("Could not read texture data, falling back to procedural coloring:", e)
            }
          }
        }

        const positionAttr = headGeometry.attributes.position
        const uvAttr = headGeometry.attributes.uv
        const normalAttr = headGeometry.attributes.normal
        const indexAttr = headGeometry.index

        if (!positionAttr) {
          throw new Error("GLB geometry has no position attribute")
        }

        const positionsArray = positionAttr.array as Float32Array
        const uvsArray = uvAttr ? (uvAttr.array as Float32Array) : null
        const normalsArray = normalAttr ? (normalAttr.array as Float32Array) : null
        const indicesArray = indexAttr ? (indexAttr.array as Uint32Array | Uint16Array) : null

        const numTriangles = indicesArray ? indicesArray.length / 3 : positionAttr.count / 3

        const cumulativeAreas = new Float32Array(numTriangles)
        let totalArea = 0

        const vA = new THREE.Vector3()
        const vB = new THREE.Vector3()
        const vC = new THREE.Vector3()

        for (let i = 0; i < numTriangles; i++) {
          let i0 = i * 3
          let i1 = i * 3 + 1
          let i2 = i * 3 + 2

          if (indicesArray) {
            i0 = indicesArray[i0]
            i1 = indicesArray[i1]
            i2 = indicesArray[i2]
          }

          vA.fromArray(positionsArray, i0 * 3)
          vB.fromArray(positionsArray, i1 * 3)
          vC.fromArray(positionsArray, i2 * 3)

          const ab = new THREE.Vector3().subVectors(vB, vA)
          const ac = new THREE.Vector3().subVectors(vC, vA)
          const cross = new THREE.Vector3().crossVectors(ab, ac)
          const area = cross.length() * 0.5

          totalArea += area
          cumulativeAreas[i] = totalArea
        }

        const selectRandomTriangle = () => {
          const r = Math.random() * totalArea
          let low = 0
          let high = numTriangles - 1
          while (low < high) {
            const mid = (low + high) >> 1
            if (cumulativeAreas[mid] < r) {
              low = mid + 1
            } else {
              high = mid
            }
          }
          return low
        }

        headGeometry.computeBoundingBox()
        const bbox = headGeometry.boundingBox || new THREE.Box3()
        const minY = bbox.min.y
        const maxY = bbox.max.y
        const rangeY = maxY - minY || 1.0

        const sampleFromTriangle = (triIndex: number) => {
          let i0 = triIndex * 3
          let i1 = triIndex * 3 + 1
          let i2 = triIndex * 3 + 2

          if (indicesArray) {
            i0 = indicesArray[i0]
            i1 = indicesArray[i1]
            i2 = indicesArray[i2]
          }

          const p0 = new THREE.Vector3().fromArray(positionsArray, i0 * 3)
          const p1 = new THREE.Vector3().fromArray(positionsArray, i1 * 3)
          const p2 = new THREE.Vector3().fromArray(positionsArray, i2 * 3)

          const r1 = Math.random()
          const r2 = Math.random()
          const u = 1 - Math.sqrt(r1)
          const v = r2 * Math.sqrt(r1)
          const w = 1 - u - v

          const pos = new THREE.Vector3()
          pos.addScaledVector(p0, u)
          pos.addScaledVector(p1, v)
          pos.addScaledVector(p2, w)

          const uv = new THREE.Vector2()
          if (hasTexture && uvsArray && uvAttr) {
            const uv0 = new THREE.Vector2().fromArray(uvsArray, i0 * 2)
            const uv1 = new THREE.Vector2().fromArray(uvsArray, i1 * 2)
            const uv2 = new THREE.Vector2().fromArray(uvsArray, i2 * 2)
            uv.addScaledVector(uv0, u)
            uv.addScaledVector(uv1, v)
            uv.addScaledVector(uv2, w)
          }

          const normal = new THREE.Vector3()
          if (normalsArray) {
            const n0 = new THREE.Vector3().fromArray(normalsArray, i0 * 3)
            const n1 = new THREE.Vector3().fromArray(normalsArray, i1 * 3)
            const n2 = new THREE.Vector3().fromArray(normalsArray, i2 * 3)
            normal.addScaledVector(n0, u)
            normal.addScaledVector(n1, v)
            normal.addScaledVector(n2, w)
            normal.normalize()
          } else {
            const ab = new THREE.Vector3().subVectors(p1, p0)
            const ac = new THREE.Vector3().subVectors(p2, p0)
            normal.crossVectors(ab, ac).normalize()
          }

          return { pos, uv, normal }
        }

        const isFacePoint = (pos: THREE.Vector3) => {
          return pos.x > 0.05 && pos.y > -0.15 && Math.abs(pos.z - 0.094) < 0.18
        }

        const positionsOut: number[] = []
        const colorsOut: number[] = []
        const offsetsOut: number[] = []
        const brightnessesOut: number[] = []
        const normYOut: number[] = []
        const isSparkOut: number[] = []

        const baseSamples = 15000
        const scale = 2.5
        const scaleY = 2.5

        const addPoint = (p: THREE.Vector3, uv: THREE.Vector2, normal: THREE.Vector3) => {
          positionsOut.push(p.x * scale, p.y * scaleY, p.z * scale)

          let r = 1.0
          let g = 1.0
          let b = 1.0
          let brightness = 1.0

          if (hasTexture && texData) {
            const u = ((uv.x % 1) + 1) % 1
            const v = ((uv.y % 1) + 1) % 1
            const px = Math.floor(u * (texWidth - 1))
            const py = Math.floor((1 - v) * (texHeight - 1))
            const idx = (py * texWidth + px) * 4

            r = texData[idx] / 255
            g = texData[idx + 1] / 255
            b = texData[idx + 2] / 255
            brightness = 0.299 * r + 0.587 * g + 0.114 * b
          } else {
            const lightDir = new THREE.Vector3(0.5, 0.7, 1.0).normalize()
            const dot = normal.dot(lightDir)
            brightness = 0.15 + 0.85 * Math.max(0, dot)
            r = 0.8
            g = 0.95
            b = 1.0
          }

          colorsOut.push(r, g, b)

          offsetsOut.push(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
          )

          brightnessesOut.push(brightness)

          const ny = (p.y - minY) / rangeY
          normYOut.push(ny)

          isSparkOut.push(0.0)
        }

        for (let i = 0; i < baseSamples; i++) {
          const tri = selectRandomTriangle()
          const point = sampleFromTriangle(tri)

          addPoint(point.pos, point.uv, point.normal)

          if (isFacePoint(point.pos)) {
            for (let k = 0; k < 3; k++) {
              const extraPoint = sampleFromTriangle(tri)
              addPoint(extraPoint.pos, extraPoint.uv, extraPoint.normal)
            }
          }
        }

        const numSparks = 300
        for (let i = 0; i < numSparks; i++) {
          const theta = Math.random() * Math.PI * 2
          const r = Math.random() * 0.9
          const px = Math.cos(theta) * r
          const py = Math.random() * 3.0 - 1.5
          const pz = Math.sin(theta) * r

          positionsOut.push(px, py, pz)

          const rSpark = 1.0
          const gSpark = 0.45 + Math.random() * 0.45
          const bSpark = 0.0 + Math.random() * 0.1
          colorsOut.push(rSpark, gSpark, bSpark)

          offsetsOut.push(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
          )
          brightnessesOut.push(0.8 + Math.random() * 0.2)
          normYOut.push((py + 1.5) / 3.0)
          isSparkOut.push(1.0)
        }

        geometry = new THREE.BufferGeometry()
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positionsOut, 3))
        geometry.setAttribute("customColor", new THREE.Float32BufferAttribute(colorsOut, 3))
        geometry.setAttribute("randomOffset", new THREE.Float32BufferAttribute(offsetsOut, 3))
        geometry.setAttribute("brightness", new THREE.Float32BufferAttribute(brightnessesOut, 1))
        geometry.setAttribute("normY", new THREE.Float32BufferAttribute(normYOut, 1))
        geometry.setAttribute("isSpark", new THREE.Float32BufferAttribute(isSparkOut, 1))

        material = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uMouse3D: { value: new THREE.Vector3(0, 0, -9999) },
            uMouseRadius: { value: 2.2 },
            uMouseStrength: { value: 0.0 },
            uThemeColor: { value: new THREE.Color("#f97316") },
            uAccentColor: { value: new THREE.Color("#ff5100") },
            uScanProgress: { value: 999.0 },
            uScanWidth: { value: 0.08 }
          },
          vertexShader: `
            uniform float uTime;
            uniform vec3 uMouse3D;
            uniform float uMouseRadius;
            uniform float uMouseStrength;

            attribute vec3 customColor;
            attribute vec3 randomOffset;
            attribute float brightness;
            attribute float normY;
            attribute float isSpark;

            varying vec3 vColor;
            varying float vBrightness;
            varying vec3 vPosition;
            varying float vNormY;
            varying float vIsSpark;

            void main() {
              vColor = customColor;
              vBrightness = brightness;
              vNormY = normY;
              vIsSpark = isSpark;

              vec3 pos = position;

              if (isSpark > 0.5) {
                float yCycle = position.y + uTime * 0.25;
                pos.y = mod(yCycle + 1.8, 3.6) - 1.8;

                pos.x += sin(uTime * 1.5 + randomOffset.x * 6.28) * 0.18;
                pos.z += cos(uTime * 1.2 + randomOffset.z * 6.28) * 0.18;
              } else {
                pos.x += sin(uTime * 1.5 + randomOffset.x * 20.0) * 0.01;
                pos.y += cos(uTime * 1.2 + randomOffset.y * 20.0) * 0.01;
                pos.z += sin(uTime * 1.8 + randomOffset.z * 20.0) * 0.01;

                float glitchActive = step(0.96, sin(uTime * 2.5) * cos(uTime * 0.8 + 1.5));
                if (glitchActive > 0.5) {
                  float r = fract(sin(randomOffset.x * 12.9898) * 43758.5453);
                  if (r > 0.85) {
                    pos.x += sin(uTime * 50.0 + r * 10.0) * 0.03;
                    pos.y += cos(uTime * 40.0 + r * 10.0) * 0.01;
                  }
                }
              }

              vec3 dir = pos - uMouse3D;
              float dist = length(dir);
              if (dist < uMouseRadius) {
                float force = (1.0 - dist / uMouseRadius);
                force = pow(force, 2.0) * uMouseStrength * 0.06;
                vec3 pushDir = dist > 0.0001 ? normalize(dir) : vec3(0.0, 1.0, 0.0);
                pos += pushDir * force;
              }

              vPosition = pos;

              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

              float baseSize = isSpark > 0.5 ? 2.0 : (1.2 + brightness * 1.5);
              gl_PointSize = baseSize * (3.0 / -mvPosition.z);

              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform float uTime;
            uniform vec3 uThemeColor;
            uniform vec3 uAccentColor;
            uniform float uMouseStrength;
            uniform float uScanProgress;
            uniform float uScanWidth;
            uniform vec3 uMouse3D;

            varying vec3 vColor;
            varying float vBrightness;
            varying vec3 vPosition;
            varying float vNormY;
            varying float vIsSpark;

            void main() {
              vec2 temp = gl_PointCoord - vec2(0.5);
              float dist = length(temp);
              if (dist > 0.5) discard;

              float alpha = smoothstep(0.5, 0.35, dist);

              float scanline = sin(vNormY * 60.0 - uTime * 6.0) * 0.15 + 0.85;

              vec3 baseHoloColor = mix(uAccentColor, uThemeColor, vBrightness);

              vec3 finalColor = mix(baseHoloColor, vec3(1.0), pow(vBrightness, 3.5) * 0.6);

              if (vIsSpark > 0.5) {
                scanline = 1.2;
                finalColor = mix(uThemeColor, vec3(1.0), 0.55);
              }

              float fadeBottom = smoothstep(0.0, 0.22, vNormY);

              float distToMouse = length(vPosition.xy - uMouse3D.xy);
              float spotlight = smoothstep(0.48, 0.12, distToMouse) * uMouseStrength;

              float scanHighlight = smoothstep(uScanWidth, 0.0, abs(vNormY - uScanProgress));

              float particleVisibility = max(spotlight, scanHighlight);

              gl_FragColor = vec4(finalColor, alpha * scanline * fadeBottom * (vIsSpark > 0.5 ? 0.75 : 0.85) * particleVisibility);
            }
          `,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })

        pointsMesh = new THREE.Points(geometry, material)
        pointsMesh.position.set(0, 0.92, 0)
        pointsMesh.rotation.y = -Math.PI / 2
        scene.add(pointsMesh)

        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load volumetric hologram GLB:", err)
        setIsLoading(false)
      })

    const raycaster = new THREE.Raycaster()
    const smoothMouse = new THREE.Vector2(0, 0)
    const targetMouse3D = new THREE.Vector3(0, 0, -9999)
    const currentMouse3D = new THREE.Vector3(0, 0, -9999)
    let currentStrength = 0

    const handleResize = () => {
      if (!container || !isMounted) return
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener("resize", handleResize)

    const clock = new THREE.Clock()
    let animationFrameId: number

    const tick = () => {
      if (!isMounted) return

      const deltaTime = clock.getDelta()
      const elapsedTime = clock.elapsedTime

      if (material) {
        material.uniforms.uTime.value = elapsedTime
      }

      if (isScanningRef.current) {
        const SCAN_SPEED = 0.3
        scanOffsetRef.current += deltaTime * SCAN_SPEED
        if (scanOffsetRef.current >= scanTargetRef.current) {
          scanOffsetRef.current = scanTargetRef.current
          isScanningRef.current = false
        }
      }

      const currentOffset = scanOffsetRef.current
      const cycleNumber = Math.floor(currentOffset)
      const cycleFraction = currentOffset % 1
      let sweepProgress = 999.0

      if (isScanningRef.current) {
        if (cycleNumber % 2 === 0) {
          sweepProgress = 1.0 - cycleFraction
        } else {
          sweepProgress = cycleFraction
        }
      }

      if (material) {
        material.uniforms.uScanProgress.value = sweepProgress
      }

      if (laserLineRef.current) {
        if (isScanningRef.current) {
          const sweepY = sweepProgress * 660
          laserLineRef.current.style.bottom = `${sweepY}px`
          const edgeFade = Math.sin(sweepProgress * Math.PI)
          laserLineRef.current.style.opacity = (0.2 + 0.8 * edgeFade).toString()
        } else {
          laserLineRef.current.style.opacity = "0"
        }
      }

      const mx = mouseRef.current.x * 2
      const my = -mouseRef.current.y * 2
      smoothMouse.x += (mx - smoothMouse.x) * 0.25
      smoothMouse.y += (my - smoothMouse.y) * 0.25

      raycaster.setFromCamera(smoothMouse, camera)
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0.0)
      const target = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, target)

      const isMouseActive = Math.abs(mouseRef.current.x) < 0.5 && Math.abs(mouseRef.current.y) < 0.5 && isInViewRef.current

      if (isMouseActive && pointsMesh) {
        const localTarget = target.clone()
        pointsMesh.worldToLocal(localTarget)
        targetMouse3D.copy(localTarget)

        if (currentStrength < 0.01) {
          currentMouse3D.copy(localTarget)
        }
      }

      currentMouse3D.lerp(targetMouse3D, 0.25)
      if (material) {
        material.uniforms.uMouse3D.value.copy(currentMouse3D)
      }

      const targetStrength = isMouseActive ? 1.0 : 0.0
      currentStrength += (targetStrength - currentStrength) * 0.18
      if (material) {
        material.uniforms.uMouseStrength.value = currentStrength
      }

      if (isInViewRef.current) {
        renderer.render(scene, camera)
      }
      animationFrameId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      isMounted = false
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)

      if (geometry) geometry.dispose()
      if (material) material.dispose()
      if (pointsMesh) {
        scene.remove(pointsMesh)
      }
      renderer.dispose()
    }
  }, [isClient])

  return (
    <div
      ref={containerRef}
      className={className || "w-[450px] h-[450px] sm:w-[580px] sm:h-[580px] lg:w-[540px] lg:h-[680px] relative overflow-visible"}
      style={{
        perspective: "2000px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="text-center font-mono text-xs sm:text-sm tracking-widest animate-pulse uppercase"
              style={{ color: "var(--primary)" }}>
              Initializing...
            </div>
          </div>
        )}

        {isClient && (
          <>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
            />
            <div
              ref={laserLineRef}
              className="absolute left-0 w-full h-px pointer-events-none z-40 transition-opacity duration-200"
              style={{
                background: "linear-gradient(90deg, transparent 15%, var(--primary) 50%, transparent 85%)",
                boxShadow: "0 0 8px 1px var(--primary)",
                bottom: "0px",
                opacity: 0,
              }}
            />
          </>
        )}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div
            className="w-32 h-32 sm:w-44 sm:h-44 lg:w-56 lg:h-56 rounded-full"
            style={{
              background: "radial-gradient(circle, oklch(0.62 0.22 41.1 / 0.16) 0%, oklch(0.62 0.22 41.1 / 0.05) 55%, transparent 75%)",
              filter: "blur(28px)",
              animation: "pulse 4s ease-in-out infinite",
            }}
          />
        </div>

        <div
          className="absolute top-1/2 left-1/2 pointer-events-none rounded-full"
          style={{
            width: "min(320px, 58vw)",
            height: "min(320px, 58vw)",
            marginLeft: "calc(min(320px, 58vw) / -2)",
            marginTop: "calc(min(320px, 58vw) / -2)",
            border: "1px solid oklch(0.62 0.22 41.1 / 0.28)",
            transformStyle: "preserve-3d",
            animation: "shape3d-ring1 20s linear infinite",
          }}
        />

        <div
          className="absolute top-1/2 left-1/2 pointer-events-none rounded-full"
          style={{
            width: "min(400px, 72vw)",
            height: "min(400px, 72vw)",
            marginLeft: "calc(min(400px, 72vw) / -2)",
            marginTop: "calc(min(400px, 72vw) / -2)",
            border: "1px solid oklch(0.62 0.22 41.1 / 0.14)",
            transformStyle: "preserve-3d",
            animation: "shape3d-ring2 30s linear infinite",
          }}
        />

        <div
          className="absolute top-1/2 left-1/2 pointer-events-none rounded-full"
          style={{
            width: "min(480px, 88vw)",
            height: "min(480px, 88vw)",
            marginLeft: "calc(min(480px, 88vw) / -2)",
            marginTop: "calc(min(480px, 88vw) / -2)",
            border: "1px solid oklch(0.62 0.22 41.1 / 0.07)",
            transformStyle: "preserve-3d",
            animation: "shape3d-ring3 42s linear infinite",
          }}
        />

        {[
          { top: "14%", left: "72%", size: 3, delay: "0s", dur: "3.2s" },
          { top: "78%", left: "18%", size: 2, delay: "0.8s", dur: "4s" },
          { top: "22%", left: "12%", size: 2, delay: "1.4s", dur: "2.8s" },
          { top: "68%", left: "80%", size: 3, delay: "0.3s", dur: "3.6s" },
          { top: "42%", left: "88%", size: 2, delay: "1.8s", dur: "4.4s" },
          { top: "88%", left: "54%", size: 2, delay: "0.6s", dur: "3s" },
        ].map((dot, i) => (
          <div
            key={`dot-${i}`}
            className="absolute pointer-events-none rounded-full"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              background: "oklch(0.62 0.22 41.1 / 0.7)",
              boxShadow: `0 0 ${dot.size * 4}px ${dot.size + 1}px oklch(0.62 0.22 41.1 / 0.22)`,
              animation: `pulse ${dot.dur} ease-in-out infinite`,
              animationDelay: dot.delay,
            }}
          />
        ))}

        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "55%",
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, oklch(0.62 0.22 41.1 / 0.3) 50%, transparent 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "55%",
            height: "40px",
            background: "linear-gradient(to top, oklch(0.62 0.22 41.1 / 0.05), transparent)",
          }}
        />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shape3d-ring1 {
          from { transform: translate(-50%, -50%) rotateX(72deg) rotateZ(0deg); }
          to   { transform: translate(-50%, -50%) rotateX(72deg) rotateZ(360deg); }
        }
        @keyframes shape3d-ring2 {
          from { transform: translate(-50%, -50%) rotateY(68deg) rotateZ(0deg); }
          to   { transform: translate(-50%, -50%) rotateY(68deg) rotateZ(-360deg); }
        }
        @keyframes shape3d-ring3 {
          from { transform: translate(-50%, -50%) rotateX(55deg) rotateZ(30deg); }
          to   { transform: translate(-50%, -50%) rotateX(55deg) rotateZ(390deg); }
        }
      `}} />
    </div>
  )
}
