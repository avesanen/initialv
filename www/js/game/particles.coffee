###
# Particle controller. Creates to the game view animated particles like
# rocket engine exhaust or an explosion.
#
# Usage:
# var particles = require('./particles');
# particles.init('#particlecanvas');
###

define ["jquery", "exports"], ($, exports) ->
  canvas = null
  ctx = null

  ###
  # Initialize canvas with the given ID.
  # @param canvasid ID of the canvas to init.
  ###
  exports.init = (canvasid) ->
    canvas = $(canvasid)[0]
    ctx = canvas.getContext("2d")

  ###
  # Calculate CSS color string
  # @param A
  ###
  toCss = (A) ->
    i = 0

    while i < 3
      A[i] = Math.round(A[i])
      i++
    A[3] /= 255
    "rgba(" + A.join() + ")"

  ###
  # Helper math function
  ###
  lerp = (p, a, b) ->
    Number(a) + (b - a) * p

  ###
  # Helper math function
  ###
  lerpA = (p, A, B) ->
    res = []
    i = 0

    while i < A.length
      res[i] = lerp(p, A[i], B[i])
      i++
    res

  particles = []
  ###
  # Create new particle object instance
  # @param x
  # @param y
  # @param angle
  # @param speed
  # @param life How long the particle exists
  ###
  Particle = (x, y, angle, speed, life) ->
    @x = x
    @y = y
    @startspeed = speed
    @endspeed = speed / 10
    @startangle = angle
    @endangle = angle + Math.random() * 360 - 180
    @life = life
    @startlife = @life
    @size = 1
    @startsize = @size
    @endsize = @size + 40
    @color = [255, 255, 255, 128]
    @startcolor = @color
    @endcolor = [0, 0, 0, 0.1]

  ###
  # Move particle
  # @param dt time delta
  ###
  Particle::refresh = (dt) ->
    @life -= dt
    speed = lerp(@life / @startlife, @endspeed, @startspeed)
    angle = lerp(@life / @startlife, @endangle, @startangle)
    @x += speed * Math.sin(angle * Math.PI / 180) * dt / 1000
    @y += -speed * Math.cos(angle * Math.PI / 180) * dt / 1000
    @size = lerp(@life / @startlife, @endsize, @startsize)
    @color = lerpA(@life / @startlife, @endcolor, @startcolor)

  ###
  # Draw particle
  ###
  Particle::draw = ->
    ctx.fillStyle = toCss(@color)
    ctx.beginPath()
    ctx.arc @x, @y, @size, 0, Math.PI * 2, true
    ctx.closePath()
    ctx.fill()


  ###
  # Particle emitter.
  # @param x X coordinate
  # @param y Y coordinate
  # @param amount Amount of particles to be emitted
  ###
  exports.emitter = (x, y, amount) ->
    exports.emit x, y, Math.random() * 360, 40, 1000
    setTimeout (->
      if @attached
        console.log "Attached!"
        @x = @attached.x
        @y = @attached.y
      if amount > 0
        amount -= 1
        exports.emitter x, y, amount
    ), 1000 / 30

  exports.emitter::attachTo = (spr) ->
    @attached = spr


  ###
  # Emit a particle.
  # @param x X-coordinate
  # @param y Y-coordinate
  # @param angle Angle
  # @param speed Speed in pixels/ms
  # @param life Life duration in ms
  ###
  exports.emit = (x, y, angle, speed, life) ->
    particles.push new Particle(x, y, angle, speed, life)


  ###
  # Refresh particle positions and life with delta time.
  # @param dt Delta time
  ###
  exports.refresh = (dt) ->
    if particles.length > 0
      for i in [0 .. particles.length-1]
        if particles[i].life > 0
          particles[i].refresh dt
        else
          particles.splice i, 1


  ###
  # Draw particles.
  ###
  exports.reDraw = ->
    canvas.width = canvas.width
    if particles.length > 0
      for i in [0 .. particles.length-1]
        if particles[i].life > 0
          particles[i].draw()
        else
          particles.splice i, 1


  return
