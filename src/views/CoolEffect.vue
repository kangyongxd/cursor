<template>
  <div class="cool-effect" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <canvas ref="canvas"></canvas>
    <div class="overlay">
      <h1 class="title">Neon Particle Vortex</h1>
      <p class="hint">Move your mouse to bend the light trails</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CoolEffect',
  data() {
    return {
      ctx: null,
      animationId: null,
      particles: [],
      canvasSize: { width: 0, height: 0 },
      mouse: { x: null, y: null },
      frame: 0
    }
  },
  mounted() {
    const canvas = this.$refs.canvas
    this.ctx = canvas.getContext('2d')
    window.addEventListener('resize', this.handleResize, { passive: true })
    this.handleResize()
    this.initParticles()
    this.startAnimation()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  },
  methods: {
    handleResize() {
      const canvas = this.$refs.canvas
      if (!canvas || !this.ctx) return

      const dpr = window.devicePixelRatio || 1
      const { clientWidth, clientHeight } = this.$el
      canvas.width = clientWidth * dpr
      canvas.height = clientHeight * dpr
      canvas.style.width = clientWidth + 'px'
      canvas.style.height = clientHeight + 'px'

      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.ctx.scale(dpr, dpr)

      this.canvasSize.width = clientWidth
      this.canvasSize.height = clientHeight
      this.initParticles()
    },
    initParticles() {
      const { width, height } = this.canvasSize
      if (!width || !height) return

      const baseCount = 10
      this.particles = Array.from({ length: baseCount }, () => this.createParticle())
    },
    createParticle() {
      const { width, height } = this.canvasSize
      const angle = Math.random() * Math.PI * 2
      const trailLength = 14
      return {
        angle,
        orbit: 40 + Math.random() * Math.min(width, height) / 2,
        speed: 0.45 + Math.random() * 1,
        size: 0.8 + Math.random() * 2,
        hueOffset: Math.random() * 360,
        trail: new Float32Array(trailLength * 2),
        trailLength,
        trailCount: 0,
        trailIndex: 0
      }
    },
    handleMouseMove(event) {
      const rect = this.$el.getBoundingClientRect()
      this.mouse.x = event.clientX - rect.left
      this.mouse.y = event.clientY - rect.top
    },
    handleMouseLeave() {
      this.mouse.x = null
      this.mouse.y = null
    },
    startAnimation() {
      const loop = () => {
        this.frame += 1
        this.draw()
        this.animationId = requestAnimationFrame(loop)
      }
      loop()
    },
    draw() {
      if (!this.ctx) return
      const ctx = this.ctx
      const { width, height } = this.canvasSize
      if (!width || !height) return

      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(5, 6, 23, 0.25)'
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = 'lighter'
      const centerX = this.mouse.x !== null ? this.mouse.x : width / 2
      const centerY = this.mouse.y !== null ? this.mouse.y : height / 2

      this.particles.forEach((particle) => {
        particle.angle += particle.speed * 0.02
        const swing = Math.sin(this.frame * 0.02 + particle.hueOffset) * 12
        const targetX = centerX + Math.cos(particle.angle) * (particle.orbit + swing)
        const targetY = centerY + Math.sin(particle.angle) * (particle.orbit + swing)

        const bufferSize = particle.trail.length
        const prevIndex = (particle.trailIndex + bufferSize - 2) % bufferSize
        const prevX = particle.trailCount ? particle.trail[prevIndex] : targetX
        const prevY = particle.trailCount ? particle.trail[(prevIndex + 1) % bufferSize] : targetY

        const x = prevX + (targetX - prevX) * 0.18
        const y = prevY + (targetY - prevY) * 0.18

        particle.trail[particle.trailIndex] = x
        particle.trail[(particle.trailIndex + 1) % bufferSize] = y
        particle.trailIndex = (particle.trailIndex + 2) % bufferSize
        if (particle.trailCount < particle.trailLength) {
          particle.trailCount += 1
        }

        this.drawTrail(particle)
      })
    },
    drawTrail(particle) {
      const ctx = this.ctx
      if (!ctx || particle.trailCount < 2) return

      const { trail, trailCount } = particle
      const length = trail.length
      const lastIndex = (particle.trailIndex + length - 2) % length

      ctx.beginPath()
      for (let i = 0; i < trailCount - 1; i += 1) {
        const fromIndex = (lastIndex + (i * 2)) % length
        const toIndex = (lastIndex + ((i + 1) * 2)) % length
        const fromX = trail[fromIndex]
        const fromY = trail[(fromIndex + 1) % length]
        const toX = trail[toIndex]
        const toY = trail[(toIndex + 1) % length]
        ctx.moveTo(fromX, fromY)
        ctx.lineTo(toX, toY)
      }

      const hue = (this.frame * 0.6 + particle.hueOffset) % 360
      ctx.strokeStyle = `hsla(${hue}, 85%, 65%, 0.6)`
      ctx.lineWidth = particle.size
      ctx.stroke()

      const tailX = trail[lastIndex]
      const tailY = trail[(lastIndex + 1) % length]
      ctx.beginPath()
      ctx.fillStyle = `hsla(${hue}, 95%, 75%, 0.9)`
      ctx.shadowBlur = 8
      ctx.shadowColor = `hsla(${hue}, 95%, 75%, 1)`
      ctx.arc(tailX, tailY, particle.size * 1.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }
  }
}
</script>

<style scoped>
.cool-effect {
  position: relative;
  height: calc(100vh - 120px);
  min-height: 420px;
  border-radius: 24px;
  overflow: hidden;
  background: radial-gradient(circle at top, #1a1c4f, #05061c 60%, #010113);
  box-shadow: 0 24px 60px rgba(3, 5, 30, 0.45);
}

canvas {
  position: absolute;
  inset: 0;
}

.overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: linear-gradient(180deg, rgba(11, 12, 48, 0) 0%, rgba(5, 6, 23, 0.8) 100%);
  color: #d9dcff;
  text-align: center;
  backdrop-filter: blur(12px);
}

.title {
  font-size: 24px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0;
}

.hint {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}
</style>
