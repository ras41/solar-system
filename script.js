// Enhanced Solar System 3D Simulation with Cinematic Effects
const THREE = window.THREE

class EnhancedSolarSystem {
  constructor() {
    // Core Three.js components
    this.scene = null
    this.camera = null
    this.renderer = null
    this.composer = null
    this.clock = new THREE.Clock()
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    // Animation state
    this.isPaused = false
    this.globalSpeed = 1.0
    this.cameraDistance = 100
    this.qualityLevel = "high"

    // Solar system objects
    this.sun = null
    this.planets = []
    this.moons = []
    this.asteroids = []
    this.comets = []
    this.planetData = []
    this.moonData = []

    // Visual effects
    this.stars = null
    this.spaceDust = null
    this.atmospheres = []
    this.lensFlares = []

    // UI elements
    this.tooltip = document.getElementById("planet-tooltip")
    this.loadingScreen = document.getElementById("loading-screen")
    this.progressFill = document.getElementById("progress-fill")
    this.loadingProgress = document.getElementById("loading-progress")

    // Controls and settings
    this.controls = null
    this.isDarkTheme = true
    this.showMoons = true
    this.showAsteroids = true
    this.showComets = true
    this.showAtmosphere = true
    this.showParticles = true

    // Performance tracking
    this.frameCount = 0
    this.lastTime = performance.now()
    this.fps = 60

    this.init()
  }

  async init() {
    await this.loadingSequence()
  }

  async loadingSequence() {
    const steps = [
      { text: "Initializing 3D Engine...", duration: 500 },
      { text: "Setting up cosmic environment...", duration: 600 },
      { text: "Creating celestial bodies...", duration: 800 },
      { text: "Calculating orbital mechanics...", duration: 700 },
      { text: "Adding atmospheric effects...", duration: 600 },
      { text: "Generating asteroid belt...", duration: 500 },
      { text: "Spawning comets...", duration: 400 },
      { text: "Finalizing solar system...", duration: 300 },
    ]

    let progress = 0
    for (let i = 0; i < steps.length; i++) {
      this.loadingProgress.textContent = steps[i].text
      progress = ((i + 1) / steps.length) * 100
      this.progressFill.style.width = progress + "%"

      await new Promise((resolve) => setTimeout(resolve, steps[i].duration))

      // Execute actual initialization steps
      switch (i) {
        case 0:
          this.setupScene()
          break
        case 1:
          this.setupCamera()
          this.setupRenderer()
          break
        case 2:
          this.setupLights()
          this.createStarField()
          break
        case 3:
          this.createSolarSystem()
          break
        case 4:
          this.createAtmosphericEffects()
          break
        case 5:
          this.createAsteroidBelt()
          break
        case 6:
          this.createComets()
          break
        case 7:
          this.setupControls()
          this.setupEventListeners()
          this.setupUI()
          break
      }
    }

    // Start animation
    this.animate()

    // Hide loading screen
    setTimeout(() => {
      this.loadingScreen.style.opacity = "0"
      setTimeout(() => {
        this.loadingScreen.style.display = "none"
      }, 800)
    }, 500)
  }

  setupScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000011)
    this.scene.fog = new THREE.Fog(0x000011, 100, 1000)
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    this.camera.position.set(0, 50, this.cameraDistance)
    this.camera.lookAt(0, 0, 0)
  }

  setupRenderer() {
    const canvas = document.getElementById("solar-system-canvas")
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })

    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2

    // Setup post-processing
    this.setupPostProcessing()
  }

  setupPostProcessing() {
    // Note: In a real implementation, you'd need to properly import these
    // For now, we'll skip post-processing to avoid dependency issues
    // this.composer = new THREE.EffectComposer(this.renderer);
    // const renderPass = new THREE.RenderPass(this.scene, this.camera);
    // this.composer.addPass(renderPass);
    // const bloomPass = new THREE.UnrealBloomPass(
    //     new THREE.Vector2(window.innerWidth, window.innerHeight),
    //     1.5, 0.4, 0.85
    // );
    // this.composer.addPass(bloomPass);
  }

  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.05)
    this.scene.add(ambientLight)

    // Sun light (point light)
    const sunLight = new THREE.PointLight(0xffffff, 3, 500)
    sunLight.position.set(0, 0, 0)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 4096
    sunLight.shadow.mapSize.height = 4096
    sunLight.shadow.camera.near = 0.1
    sunLight.shadow.camera.far = 500
    this.scene.add(sunLight)

    // Additional rim lighting
    const rimLight1 = new THREE.DirectionalLight(0x4444ff, 0.3)
    rimLight1.position.set(100, 100, 100)
    this.scene.add(rimLight1)

    const rimLight2 = new THREE.DirectionalLight(0xff4444, 0.2)
    rimLight2.position.set(-100, -100, -100)
    this.scene.add(rimLight2)
  }

  createStarField() {
    // Enhanced starfield with multiple layers
    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 15000
    const positions = new Float32Array(starsCount * 3)
    const colors = new Float32Array(starsCount * 3)
    const sizes = new Float32Array(starsCount)

    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3

      // Position
      positions[i3] = (Math.random() - 0.5) * 3000
      positions[i3 + 1] = (Math.random() - 0.5) * 3000
      positions[i3 + 2] = (Math.random() - 0.5) * 3000

      // Color variation
      const starType = Math.random()
      if (starType < 0.7) {
        // White stars
        colors[i3] = 1
        colors[i3 + 1] = 1
        colors[i3 + 2] = 1
      } else if (starType < 0.85) {
        // Blue stars
        colors[i3] = 0.7
        colors[i3 + 1] = 0.8
        colors[i3 + 2] = 1
      } else {
        // Red stars
        colors[i3] = 1
        colors[i3 + 1] = 0.7
        colors[i3 + 2] = 0.6
      }

      // Size variation
      sizes[i] = Math.random() * 3 + 1
    }

    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    starsGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    const starsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + 0.3 * sin(time + position.x * 0.01));
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
      fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float r = distance(gl_PointCoord, vec2(0.5, 0.5));
                    if (r > 0.5) discard;
                    
                    float alpha = 1.0 - smoothstep(0.0, 0.5, r);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
      transparent: true,
      vertexColors: true,
    })

    this.stars = new THREE.Points(starsGeometry, starsMaterial)
    this.scene.add(this.stars)

    // Create nebula background
    this.createNebula()
  }

  createNebula() {
    const nebulaGeometry = new THREE.PlaneGeometry(2000, 2000)
    const nebulaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x1a0033) },
        color2: { value: new THREE.Color(0x000011) },
      },
      vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                
                float noise(vec2 p) {
                    return sin(p.x * 10.0 + time * 0.5) * sin(p.y * 10.0 + time * 0.3) * 0.5 + 0.5;
                }
                
                void main() {
                    vec2 uv = vUv * 2.0 - 1.0;
                    float n = noise(uv * 0.5) * noise(uv * 1.0) * noise(uv * 2.0);
                    vec3 color = mix(color2, color1, n * 0.3);
                    gl_FragColor = vec4(color, 0.1);
                }
            `,
      transparent: true,
      side: THREE.DoubleSide,
    })

    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial)
    nebula.position.z = -1000
    this.scene.add(nebula)
  }

  createSolarSystem() {
    // Enhanced planet data with moons
    this.planetData = [
      {
        name: "Mercury",
        size: 0.8,
        distance: 12,
        speed: 4.74,
        color: 0x8c7853,
        info: "Closest planet to the Sun, with extreme temperature variations",
        moons: [],
      },
      {
        name: "Venus",
        size: 1.2,
        distance: 16,
        speed: 3.5,
        color: 0xffc649,
        info: "Hottest planet with a thick, toxic atmosphere",
        moons: [],
      },
      {
        name: "Earth",
        size: 1.3,
        distance: 22,
        speed: 2.98,
        color: 0x6b93d6,
        info: "Our home planet, the only known world with life",
        moons: [{ name: "Moon", size: 0.35, distance: 3, speed: 13.2, color: 0xaaaaaa }],
      },
      {
        name: "Mars",
        size: 1.0,
        distance: 28,
        speed: 2.41,
        color: 0xc1440e,
        info: "The Red Planet, with the largest volcano in the solar system",
        moons: [
          { name: "Phobos", size: 0.1, distance: 2, speed: 7.6, color: 0x8b7355 },
          { name: "Deimos", size: 0.08, distance: 2.8, speed: 1.35, color: 0x8b7355 },
        ],
      },
      {
        name: "Jupiter",
        size: 4.5,
        distance: 40,
        speed: 1.31,
        color: 0xd8ca9d,
        info: "Largest planet, a gas giant with a Great Red Spot",
        moons: [
          { name: "Io", size: 0.4, distance: 8, speed: 17.3, color: 0xffff99 },
          { name: "Europa", size: 0.35, distance: 10, speed: 13.7, color: 0xaaccff },
          { name: "Ganymede", size: 0.5, distance: 12, speed: 10.9, color: 0x888888 },
          { name: "Callisto", size: 0.45, distance: 15, speed: 8.2, color: 0x444444 },
        ],
      },
      {
        name: "Saturn",
        size: 4.0,
        distance: 55,
        speed: 0.97,
        color: 0xfad5a5,
        info: "Famous for its spectacular ring system",
        moons: [
          { name: "Titan", size: 0.5, distance: 12, speed: 6.8, color: 0xcc9966 },
          { name: "Enceladus", size: 0.2, distance: 8, speed: 12.6, color: 0xffffff },
          { name: "Mimas", size: 0.15, distance: 6, speed: 14.3, color: 0xcccccc },
        ],
      },
      {
        name: "Uranus",
        size: 2.8,
        distance: 70,
        speed: 0.68,
        color: 0x4fd0e7,
        info: "Ice giant tilted on its side with faint rings",
        moons: [
          { name: "Titania", size: 0.3, distance: 8, speed: 8.7, color: 0x999999 },
          { name: "Oberon", size: 0.28, distance: 10, speed: 7.1, color: 0x888888 },
        ],
      },
      {
        name: "Neptune",
        size: 2.6,
        distance: 85,
        speed: 0.54,
        color: 0x4b70dd,
        info: "Windiest planet with supersonic winds",
        moons: [{ name: "Triton", size: 0.35, distance: 7, speed: 6.1, color: 0xaabbcc }],
      },
    ]

    // Create the Sun with enhanced effects
    this.createSun()

    // Create planets with moons
    this.planetData.forEach((data, index) => {
      this.createPlanet(data, index)
    })
  }

  createSun() {
    const sunGeometry = new THREE.SphereGeometry(4, 64, 64)

    // Enhanced sun material with shader
    const sunMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0xffaa00) },
        color2: { value: new THREE.Color(0xff4400) },
      },
      vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                void main() {
                    vUv = uv;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                varying vec3 vNormal;
                
                float noise(vec2 p) {
                    return sin(p.x * 10.0 + time) * sin(p.y * 10.0 + time * 0.8) * 0.5 + 0.5;
                }
                
                void main() {
                    vec2 uv = vUv * 3.0;
                    float n = noise(uv) * noise(uv * 2.0) * noise(uv * 4.0);
                    vec3 color = mix(color1, color2, n);
                    
                    // Add rim lighting
                    float rim = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
                    color += rim * 0.5;
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
    })

    this.sun = new THREE.Mesh(sunGeometry, sunMaterial)
    this.scene.add(this.sun)

    // Add sun corona effect
    this.createSunCorona()
  }

  createSunCorona() {
    const coronaGeometry = new THREE.SphereGeometry(6, 32, 32)
    const coronaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform float time;
                varying vec3 vNormal;
                
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    vec3 color = vec3(1.0, 0.6, 0.0) * intensity;
                    gl_FragColor = vec4(color, intensity * 0.3);
                }
            `,
      transparent: true,
      side: THREE.BackSide,
    })

    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial)
    this.scene.add(corona)
  }

  createPlanet(data, index) {
    const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32)
    const planetMaterial = new THREE.MeshPhongMaterial({
      color: data.color,
      shininess: 30,
      specular: 0x222222,
    })

    const planet = new THREE.Mesh(planetGeometry, planetMaterial)

    // Create enhanced orbit line
    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 128)
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x444444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    })
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial)
    orbit.rotation.x = -Math.PI / 2
    this.scene.add(orbit)

    // Position planet
    planet.position.x = data.distance
    planet.castShadow = true
    planet.receiveShadow = true

    // Add planet data
    planet.userData = {
      ...data,
      angle: Math.random() * Math.PI * 2,
      originalSpeed: data.speed,
      currentSpeed: data.speed,
      orbit: orbit,
      moons: [],
    }

    this.scene.add(planet)
    this.planets.push(planet)

    // Create moons
    if (data.moons && data.moons.length > 0) {
      data.moons.forEach((moonData) => {
        this.createMoon(moonData, planet)
      })
    }

    // Create atmospheric glow for gas giants
    if (data.size > 2) {
      this.createAtmosphere(planet)
    }

    // Add rings for Saturn
    if (data.name === "Saturn") {
      this.createRings(planet)
    }
  }

  createMoon(moonData, parentPlanet) {
    const moonGeometry = new THREE.SphereGeometry(moonData.size, 16, 16)
    const moonMaterial = new THREE.MeshLambertMaterial({
      color: moonData.color,
    })

    const moon = new THREE.Mesh(moonGeometry, moonMaterial)
    moon.castShadow = true
    moon.receiveShadow = true

    // Position moon relative to planet
    moon.position.x = parentPlanet.position.x + moonData.distance

    moon.userData = {
      ...moonData,
      angle: Math.random() * Math.PI * 2,
      originalSpeed: moonData.speed,
      currentSpeed: moonData.speed,
      parent: parentPlanet,
    }

    this.scene.add(moon)
    this.moons.push(moon)
    parentPlanet.userData.moons.push(moon)
  }

  createRings(planet) {
    const ringGeometry = new THREE.RingGeometry(planet.userData.size + 1, planet.userData.size + 3, 64)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xccaa88,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    })

    const rings = new THREE.Mesh(ringGeometry, ringMaterial)
    rings.rotation.x = -Math.PI / 2
    rings.rotation.z = Math.PI / 6 // Tilt the rings

    planet.add(rings)
  }

  createAtmosphere(planet) {
    const atmosphereGeometry = new THREE.SphereGeometry(planet.userData.size + 0.3, 32, 32)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(planet.userData.color) },
      },
      vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec3 vNormal;
                
                void main() {
                    float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(color, intensity * 0.3);
                }
            `,
      transparent: true,
      side: THREE.BackSide,
    })

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    planet.add(atmosphere)
    this.atmospheres.push(atmosphere)
  }

  createAsteroidBelt() {
    const asteroidCount = 2000
    const asteroidGeometry = new THREE.SphereGeometry(0.1, 8, 8)

    for (let i = 0; i < asteroidCount; i++) {
      const asteroidMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color().setHSL(0.1, 0.3, Math.random() * 0.5 + 0.2),
      })

      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial)

      // Position in belt between Mars and Jupiter
      const angle = Math.random() * Math.PI * 2
      const distance = 32 + Math.random() * 6 // Between Mars (28) and Jupiter (40)
      const height = (Math.random() - 0.5) * 2

      asteroid.position.x = Math.cos(angle) * distance
      asteroid.position.z = Math.sin(angle) * distance
      asteroid.position.y = height

      asteroid.userData = {
        angle: angle,
        distance: distance,
        speed: Math.random() * 0.5 + 0.2,
        rotationSpeed: Math.random() * 0.1,
      }

      asteroid.castShadow = true
      asteroid.receiveShadow = true

      this.scene.add(asteroid)
      this.asteroids.push(asteroid)
    }
  }

  createComets() {
    const cometCount = 5

    for (let i = 0; i < cometCount; i++) {
      // Comet nucleus
      const cometGeometry = new THREE.SphereGeometry(0.3, 16, 16)
      const cometMaterial = new THREE.MeshLambertMaterial({
        color: 0x666666,
      })

      const comet = new THREE.Mesh(cometGeometry, cometMaterial)

      // Highly elliptical orbit
      const angle = Math.random() * Math.PI * 2
      const distance = 100 + Math.random() * 100

      comet.position.x = Math.cos(angle) * distance
      comet.position.z = Math.sin(angle) * distance
      comet.position.y = (Math.random() - 0.5) * 50

      comet.userData = {
        angle: angle,
        distance: distance,
        speed: Math.random() * 0.1 + 0.05,
        elliptical: true,
        eccentricity: 0.8,
      }

      this.scene.add(comet)
      this.comets.push(comet)

      // Create comet tail
      this.createCometTail(comet)
    }
  }

  createCometTail(comet) {
    const tailGeometry = new THREE.BufferGeometry()
    const tailCount = 100
    const positions = new Float32Array(tailCount * 3)
    const colors = new Float32Array(tailCount * 3)

    for (let i = 0; i < tailCount; i++) {
      const i3 = i * 3
      positions[i3] = 0
      positions[i3 + 1] = 0
      positions[i3 + 2] = -i * 0.5

      const alpha = 1 - i / tailCount
      colors[i3] = 0.8 * alpha
      colors[i3 + 1] = 0.9 * alpha
      colors[i3 + 2] = 1.0 * alpha
    }

    tailGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    tailGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const tailMaterial = new THREE.PointsMaterial({
      size: 2,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
    })

    const tail = new THREE.Points(tailGeometry, tailMaterial)
    comet.add(tail)
  }

  createAtmosphericEffects() {
    // Space dust particles
    const dustGeometry = new THREE.BufferGeometry()
    const dustCount = 5000
    const dustPositions = new Float32Array(dustCount * 3)

    for (let i = 0; i < dustCount * 3; i++) {
      dustPositions[i] = (Math.random() - 0.5) * 1000
    }

    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3))

    const dustMaterial = new THREE.PointsMaterial({
      color: 0x888888,
      size: 1,
      transparent: true,
      opacity: 0.3,
    })

    this.spaceDust = new THREE.Points(dustGeometry, dustMaterial)
    this.scene.add(this.spaceDust)
  }

  setupControls() {
    // Enhanced camera controls with keyboard support
    let isMouseDown = false
    let mouseX = 0
    let mouseY = 0
    let targetRotationX = 0
    let targetRotationY = 0
    let rotationX = 0
    let rotationY = 0

    const canvas = this.renderer.domElement
    const keys = {}

    // Mouse controls
    canvas.addEventListener("mousedown", (event) => {
      isMouseDown = true
      mouseX = event.clientX
      mouseY = event.clientY
    })

    canvas.addEventListener("mousemove", (event) => {
      if (!isMouseDown) return

      const deltaX = event.clientX - mouseX
      const deltaY = event.clientY - mouseY

      targetRotationY += deltaX * 0.01
      targetRotationX += deltaY * 0.01

      mouseX = event.clientX
      mouseY = event.clientY
    })

    canvas.addEventListener("mouseup", () => {
      isMouseDown = false
    })

    canvas.addEventListener("wheel", (event) => {
      event.preventDefault()
      this.cameraDistance += event.deltaY * 0.1
      this.cameraDistance = Math.max(20, Math.min(300, this.cameraDistance))
      document.getElementById("camera-distance").value = this.cameraDistance
      document.getElementById("camera-distance-value").textContent = Math.round(this.cameraDistance)
    })

    // Keyboard controls
    document.addEventListener("keydown", (event) => {
      keys[event.code] = true

      switch (event.code) {
        case "Space":
          event.preventDefault()
          this.togglePause()
          break
        case "KeyR":
          this.resetCamera()
          break
      }
    })

    document.addEventListener("keyup", (event) => {
      keys[event.code] = false
    })

    // Camera update loop
    const updateCamera = () => {
      // Keyboard movement
      if (keys["KeyW"]) targetRotationX -= 0.02
      if (keys["KeyS"]) targetRotationX += 0.02
      if (keys["KeyA"]) targetRotationY -= 0.02
      if (keys["KeyD"]) targetRotationY += 0.02

      // Smooth camera movement
      rotationX += (targetRotationX - rotationX) * 0.05
      rotationY += (targetRotationY - rotationY) * 0.05

      const x = Math.sin(rotationY) * this.cameraDistance
      const z = Math.cos(rotationY) * this.cameraDistance
      const y = Math.sin(rotationX) * this.cameraDistance * 0.5

      this.camera.position.set(x, y, z)
      this.camera.lookAt(0, 0, 0)

      requestAnimationFrame(updateCamera)
    }
    updateCamera()
  }

  setupEventListeners() {
    // Window resize
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      if (this.composer) {
        this.composer.setSize(window.innerWidth, window.innerHeight)
      }
    })

    // Mouse events for planet interaction
    this.renderer.domElement.addEventListener("click", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      this.raycaster.setFromCamera(this.mouse, this.camera)
      const intersects = this.raycaster.intersectObjects([
        this.sun,
        ...this.planets,
        ...this.moons,
        ...this.asteroids.slice(0, 100), // Only check first 100 asteroids for performance
      ])

      if (intersects.length > 0) {
        const object = intersects[0].object
        this.focusOnObject(object)
      }
    })

    // Mouse move for tooltip
    this.renderer.domElement.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      this.raycaster.setFromCamera(this.mouse, this.camera)
      const intersects = this.raycaster.intersectObjects([this.sun, ...this.planets, ...this.moons])

      if (intersects.length > 0) {
        const object = intersects[0].object
        this.showTooltip(event.clientX, event.clientY, object)
      } else {
        this.hideTooltip()
      }
    })
  }

  setupUI() {
    // Global controls
    document.getElementById("pause-resume").addEventListener("click", () => {
      this.togglePause()
    })

    document.getElementById("reset-view").addEventListener("click", () => {
      this.resetCamera()
    })

    document.getElementById("theme-toggle").addEventListener("click", () => {
      this.toggleTheme()
    })

    document.getElementById("quality-toggle").addEventListener("click", () => {
      document.getElementById("quality-modal").classList.add("visible")
    })

    document.getElementById("global-speed").addEventListener("input", (e) => {
      this.globalSpeed = Number.parseFloat(e.target.value)
      document.getElementById("global-speed-value").textContent = this.globalSpeed.toFixed(1) + "x"
    })

    document.getElementById("camera-distance").addEventListener("input", (e) => {
      this.cameraDistance = Number.parseFloat(e.target.value)
      document.getElementById("camera-distance-value").textContent = Math.round(this.cameraDistance)
    })

    // Visual effects toggles
    document.getElementById("show-moons").addEventListener("change", (e) => {
      this.showMoons = e.target.checked
      this.moons.forEach((moon) => {
        moon.visible = this.showMoons
      })
    })

    document.getElementById("show-asteroids").addEventListener("change", (e) => {
      this.showAsteroids = e.target.checked
      this.asteroids.forEach((asteroid) => {
        asteroid.visible = this.showAsteroids
      })
    })

    document.getElementById("show-comets").addEventListener("change", (e) => {
      this.showComets = e.target.checked
      this.comets.forEach((comet) => {
        comet.visible = this.showComets
      })
    })

    document.getElementById("show-atmosphere").addEventListener("change", (e) => {
      this.showAtmosphere = e.target.checked
      this.atmospheres.forEach((atmosphere) => {
        atmosphere.visible = this.showAtmosphere
      })
    })

    document.getElementById("show-particles").addEventListener("change", (e) => {
      this.showParticles = e.target.checked
      if (this.spaceDust) {
        this.spaceDust.visible = this.showParticles
      }
    })

    // Panel toggle
    document.getElementById("toggle-panel").addEventListener("click", () => {
      const panel = document.getElementById("ui-panel")
      const btn = document.getElementById("toggle-panel")
      panel.classList.toggle("collapsed")
      btn.textContent = panel.classList.contains("collapsed") ? "+" : "−"
    })

    // Close instructions
    document.getElementById("close-instructions").addEventListener("click", () => {
      document.getElementById("instructions").style.display = "none"
    })

    // Quality modal
    document.getElementById("close-quality-modal").addEventListener("click", () => {
      document.getElementById("quality-modal").classList.remove("visible")
    })

    document.querySelectorAll(".quality-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".quality-btn").forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")
        this.setQuality(btn.dataset.quality)
        document.getElementById("quality-modal").classList.remove("visible")
      })
    })

    // Create planet controls
    this.createPlanetControls()
    this.updateStats()
  }

  createPlanetControls() {
    const container = document.getElementById("planet-controls")

    this.planets.forEach((planet, index) => {
      const controlDiv = document.createElement("div")
      controlDiv.className = "planet-control"

      const moonCount = planet.userData.moons.length
      const moonText = moonCount > 0 ? ` (${moonCount} moon${moonCount > 1 ? "s" : ""})` : ""

      controlDiv.innerHTML = `
                <h4>
                    <span class="planet-color" style="background-color: #${planet.material.color.getHexString()}"></span>
                    ${planet.userData.name}${moonText}
                </h4>
                <div class="control-group">
                    <label>Speed: <span id="speed-value-${index}">${planet.userData.currentSpeed.toFixed(2)}x</span></label>
                    <input type="range" id="speed-${index}" min="0" max="10" step="0.1" value="${planet.userData.currentSpeed}">
                </div>
            `

      container.appendChild(controlDiv)

      // Add event listener
      document.getElementById(`speed-${index}`).addEventListener("input", (e) => {
        const speed = Number.parseFloat(e.target.value)
        planet.userData.currentSpeed = speed
        document.getElementById(`speed-value-${index}`).textContent = speed.toFixed(2) + "x"
      })
    })
  }

  setQuality(quality) {
    this.qualityLevel = quality

    switch (quality) {
      case "low":
        this.renderer.setPixelRatio(1)
        this.renderer.shadowMap.enabled = false
        break
      case "medium":
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.BasicShadowMap
        break
      case "high":
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFShadowMap
        break
      case "ultra":
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        break
    }

    document.getElementById("quality-toggle").textContent = `✨ ${quality.charAt(0).toUpperCase() + quality.slice(1)}`
  }

  togglePause() {
    this.isPaused = !this.isPaused
    const btn = document.getElementById("pause-resume")
    btn.textContent = this.isPaused ? "▶️ Resume" : "⏸️ Pause"
  }

  resetCamera() {
    this.cameraDistance = 100
    document.getElementById("camera-distance").value = this.cameraDistance
    document.getElementById("camera-distance-value").textContent = Math.round(this.cameraDistance)
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme
    document.body.classList.toggle("light-theme")

    const btn = document.getElementById("theme-toggle")
    btn.textContent = this.isDarkTheme ? "🌙 Dark" : "☀️ Light"

    // Update scene background
    this.scene.background = new THREE.Color(this.isDarkTheme ? 0x000011 : 0x87ceeb)
  }

  focusOnObject(object) {
    let distance, name, info

    if (object === this.sun) {
      distance = 15
      name = "Sun"
      info = "The center of our solar system, a G-type main-sequence star"
    } else if (this.planets.includes(object)) {
      distance = object.userData.distance + object.userData.size + 5
      name = object.userData.name
      info = object.userData.info
    } else if (this.moons.includes(object)) {
      distance = object.userData.parent.userData.distance + 8
      name = object.userData.name
      info = `Moon of ${object.userData.parent.userData.name}`
    } else {
      distance = 50
      name = "Asteroid"
      info = "A rocky object in the asteroid belt"
    }

    this.cameraDistance = distance
    document.getElementById("camera-distance").value = distance
    document.getElementById("camera-distance-value").textContent = Math.round(distance)

    // Update info panel
    this.updateInfoPanel(object, name, info)
  }

  updateInfoPanel(object, name, info) {
    const infoDiv = document.getElementById("planet-info")

    if (object === this.sun) {
      infoDiv.innerHTML = `
                <h4>☀️ ${name}</h4>
                <p><strong>Type:</strong> G-type main-sequence star</p>
                <p><strong>Temperature:</strong> ~5,778 K surface</p>
                <p><strong>Mass:</strong> 1.989 × 10³⁰ kg</p>
                <p><strong>Info:</strong> ${info}</p>
            `
    } else if (this.planets.includes(object)) {
      const userData = object.userData
      infoDiv.innerHTML = `
                <h4>🪐 ${name}</h4>
                <p><strong>Distance from Sun:</strong> ${userData.distance} AU</p>
                <p><strong>Size:</strong> ${userData.size} Earth radii</p>
                <p><strong>Orbital Speed:</strong> ${userData.originalSpeed} km/s</p>
                <p><strong>Moons:</strong> ${userData.moons.length}</p>
                <p><strong>Info:</strong> ${info}</p>
            `
    } else if (this.moons.includes(object)) {
      const userData = object.userData
      infoDiv.innerHTML = `
                <h4>🌙 ${name}</h4>
                <p><strong>Parent Planet:</strong> ${userData.parent.userData.name}</p>
                <p><strong>Distance from Planet:</strong> ${userData.distance} planetary radii</p>
                <p><strong>Size:</strong> ${userData.size} relative units</p>
                <p><strong>Orbital Speed:</strong> ${userData.originalSpeed} km/s</p>
                <p><strong>Info:</strong> ${info}</p>
            `
    }
  }

  showTooltip(x, y, object) {
    let name,
      info,
      stats = ""

    if (object === this.sun) {
      name = "Sun"
      info = "The center of our solar system"
      stats = `
                <div class="tooltip-stats">
                    <div class="tooltip-stat">Type: G-type star</div>
                    <div class="tooltip-stat">Age: 4.6 billion years</div>
                </div>
            `
    } else if (this.planets.includes(object)) {
      name = object.userData.name
      info = object.userData.info
      stats = `
                <div class="tooltip-stats">
                    <div class="tooltip-stat">Distance: ${object.userData.distance} AU</div>
                    <div class="tooltip-stat">Moons: ${object.userData.moons.length}</div>
                </div>
            `
    } else if (this.moons.includes(object)) {
      name = object.userData.name
      info = `Moon of ${object.userData.parent.userData.name}`
      stats = `
                <div class="tooltip-stats">
                    <div class="tooltip-stat">Size: ${object.userData.size} units</div>
                    <div class="tooltip-stat">Distance: ${object.userData.distance} radii</div>
                </div>
            `
    }

    this.tooltip.innerHTML = `
            <h4>${name}</h4>
            <p>${info}</p>
            ${stats}
        `
    this.tooltip.style.left = x + 15 + "px"
    this.tooltip.style.top = y - 10 + "px"
    this.tooltip.classList.add("visible")
  }

  hideTooltip() {
    this.tooltip.classList.remove("visible")
  }

  updateStats() {
    const totalObjects = 1 + this.planets.length + this.moons.length + this.asteroids.length + this.comets.length
    const totalParticles = 15000 + 5000 + this.asteroids.length * 100 // stars + dust + comet tails

    document.getElementById("object-count").textContent = totalObjects
    document.getElementById("particle-count").textContent = totalParticles.toLocaleString()

    // Update FPS counter
    setInterval(() => {
      document.getElementById("fps-counter").textContent = Math.round(this.fps)
    }, 1000)
  }

  animate() {
    requestAnimationFrame(() => this.animate())

    // Calculate FPS
    this.frameCount++
    const currentTime = performance.now()
    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastTime = currentTime
    }

    if (!this.isPaused) {
      const deltaTime = this.clock.getDelta()
      const elapsedTime = this.clock.getElapsedTime()

      // Update shader uniforms
      if (this.sun && this.sun.material.uniforms) {
        this.sun.material.uniforms.time.value = elapsedTime
      }

      if (this.stars && this.stars.material.uniforms) {
        this.stars.material.uniforms.time.value = elapsedTime
      }

      // Rotate sun
      if (this.sun) {
        this.sun.rotation.y += deltaTime * 0.5
      }

      // Animate planets
      this.planets.forEach((planet) => {
        const userData = planet.userData

        // Update orbit angle
        userData.angle += deltaTime * userData.currentSpeed * this.globalSpeed * 0.1

        // Update position
        planet.position.x = Math.cos(userData.angle) * userData.distance
        planet.position.z = Math.sin(userData.angle) * userData.distance

        // Rotate planet
        planet.rotation.y += deltaTime * 2

        // Animate moons
        userData.moons.forEach((moon) => {
          const moonData = moon.userData
          moonData.angle += deltaTime * moonData.currentSpeed * this.globalSpeed * 0.5

          // Position relative to parent planet
          const moonX = planet.position.x + Math.cos(moonData.angle) * moonData.distance
          const moonZ = planet.position.z + Math.sin(moonData.angle) * moonData.distance

          moon.position.x = moonX
          moon.position.z = moonZ
          moon.rotation.y += deltaTime * 3
        })
      })

      // Animate asteroids
      this.asteroids.forEach((asteroid) => {
        const userData = asteroid.userData
        userData.angle += deltaTime * userData.speed * this.globalSpeed * 0.05

        asteroid.position.x = Math.cos(userData.angle) * userData.distance
        asteroid.position.z = Math.sin(userData.angle) * userData.distance

        asteroid.rotation.x += deltaTime * userData.rotationSpeed
        asteroid.rotation.y += deltaTime * userData.rotationSpeed
      })

      // Animate comets
      this.comets.forEach((comet) => {
        const userData = comet.userData
        userData.angle += deltaTime * userData.speed * this.globalSpeed * 0.02

        // Elliptical orbit
        const a = userData.distance // Semi-major axis
        const e = userData.eccentricity // Eccentricity
        const r = (a * (1 - e * e)) / (1 + e * Math.cos(userData.angle))

        comet.position.x = Math.cos(userData.angle) * r
        comet.position.z = Math.sin(userData.angle) * r

        comet.rotation.y += deltaTime * 0.5
      })

      // Rotate stars slowly
      if (this.stars) {
        this.stars.rotation.y += deltaTime * 0.005
      }

      // Animate space dust
      if (this.spaceDust) {
        this.spaceDust.rotation.y += deltaTime * 0.002
      }

      // Update atmospheric effects
      this.atmospheres.forEach((atmosphere) => {
        if (atmosphere.material.uniforms) {
          atmosphere.material.uniforms.time.value = elapsedTime
        }
      })
    }

    // Render scene
    if (this.composer) {
      this.composer.render()
    } else {
      this.renderer.render(this.scene, this.camera)
    }
  }
}

// Initialize the enhanced solar system when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new EnhancedSolarSystem()
})
