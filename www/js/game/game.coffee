###
# Main browser side program and most of the highest level game logic.
###
define (require) ->

  # Import exports
  keyboard = require("./keyboard")
  network = require("./network")
  sfx = require("./sfx")
  map = require("./map")
  particles = require("./particles")
  sprites = require("./sprites")
  physics = require("./physics")

  ###
  # onCollision event that does nothing (null).
  ###
  @nullOnCollision = (source, target, dt) ->


  ###
  # onCollision event for plasma clouds
  ###
  @plasmaOnCollision = (source, target, dt) ->
    if target.tag is "bullet"
      # damage ships that are near the cloud
      cloudSprites = sprites.getNearbySprites(source.x, source.y, 120)
      for cloudSprite in cloudSprites
        if cloudSprite.tag is "player"
          cloudSprite.hp -= 50
          sfx.playSfx "ship_hit"

      sfx.playSfx "explosion"
      particles.emitter source.x, source.y, 50
      map.createCrater source.x, source.y, 70
      sprites.removeSprite target # remove bullet
      sprites.removeSprite source # remove cloud


  ###
  # onCollision event for bullets
  ###
  @bulletOnCollision = (source, target, dt) ->
    if target.tag is "map"
      map.createCrater source.x, source.y, 16

      #TODO: bullet removal event to server instead
      sprites.removeSprite source # remove bullet
      sfx.playSfx "ground_hit"


  ###
  # onCollision event for special bombs
  ###
  @bombOnCollision = (source, target, dt) ->
    if target.tag is "map" or target.tag is "player"
      map.createCrater source.x, source.y, 64
      sprites.removeSprite source
      sfx.playSfx "bomb_explode"

      # Create new smaller projectiles to all directions
      for i in [0..359] by 36
        physics.createBullet source.x, source.y, source.dx, source.dy, i, 0, sprites


  ###
  # onCollision event for docks
  ###
  @dockOnCollision = (source, target, dt) ->

    #console.log("docked");
    target.docked = true  if target.tag is "player"


  ###
  # onCollision event for player's ship
  ###
  @playerOnCollision = (source, target, dt) ->
    doDamage = 0

    # Collided with another ship or the map
    if (target.tag is "player") or (target.tag is "map")
      source.x -= source.dx * dt / 1000
      source.y -= source.dy * dt / 1000
      source.dx = 0
      source.dy = 0
      source.ddx = 0
      source.ddy = 0
      unless source.docked
        particles.emitter source.x, source.y, 10

        #TODO: particle event to others
        sfx.playSfx "ship_hit"
        doDamage = 5

      # Collided with a bullet
    else if target.tag is "bullet"

      #TODO: bullet removal event to server instead
      sprites.removeSprite target # remove bullet that hit the ship
      particles.emitter source.x, source.y, 10

      #TODO: particle event to server
      sfx.playSfx "ship_hit"
      doDamage = 20

    # Damage
    source.hp -= doDamage

    # Died
    if source.hp <= 0 and source.hp > -1000 and doDamage > 0
      particles.emitter source.x, source.y, 100
      source.imgfile = "/img/small_ship_broken.png"
      sfx.playSfx "explosion"
      sfx.stopSfx "thruster"
      map.createCrater source.x, source.y, 100
      source.dy += 0.001 # allow dead ship to "fall down" if it died staying still
      source.hp = -1000 # very dead, don't do explosions and falling down ever again ;)


  # Initialize imports
  sprites.init "#spritecanvas"
  map.init "#mapcanvas", sprites
  particles.init "#particlecanvas"
  sfx.init()
  scrolldiv = $("#scrolldiv")[0]
  network.init sprites.localSprites, sprites.remoteSprites, map

  # Every tag type must have some collision handler
  physics.collisionEvents["plasma"] = @plasmaOnCollision
  physics.collisionEvents["hide"] = @nullOnCollision
  physics.collisionEvents["bullet"] = @bulletOnCollision
  physics.collisionEvents["dock"] = @dockOnCollision
  physics.collisionEvents["bomb"] = @bombOnCollision
  physics.collisionEvents["player"] = @playerOnCollision
  physics.collisionEvents[""] = @nullOnCollision

  # Some local variables needed for game logic
  shootTime = 0 # Time since last bullet shot
  bombShootTime = 0
  thrusting = false
  fps = 60
  lastrefresh = new Date().getTime()
  that = this

  # Main "loop" as interval function
  setInterval (->
    now = new Date().getTime()
    dt = now - lastrefresh
    lastrefresh = now
    player = sprites.localSprites[network.playerUuid]

    # Turn only if player has been created and is alive
    if typeof player isnt "undefined" and player.hp > 0

      # Left arrow (turn left)
      if keyboard.keyDown(37)
        player.da = -220

        # Right arrow (turn right)
      else if keyboard.keyDown(39)
        player.da = 220

        # No turning
      else
        player.da = 0

    # Up arrow (thruster)
    if typeof player isnt "undefined" and keyboard.keyDown(38) and player.hp > 0
      physics.accelerateSprite player, 350

      #TODO: particle network event
      particles.emit player.x, player.y, player.a - 185 + Math.random() * 10, 100, Math.random() * 100 + 1000
      unless thrusting
        sfx.playSfx "thruster"
        thrusting = true
    else
      if thrusting
        physics.accelerateSprite player, 0
        thrusting = false
        sfx.stopSfx "thruster"

    # Screen Scroll
    unless typeof player is "undefined"
      if player.x + 320 > 1280
        scrolldiv.style.left = "-" + (1280 - 640) + "px"
      else
        scrolldiv.style.left = "-" + (player.x - 320) + "px"
      if player.y + 240 > 1440
        scrolldiv.style.top = "-" + (1440 - 480) + "px"
      else
        scrolldiv.style.top = "-" + (player.y - 240) + "px"

    # Spacebar (shoot)
    if typeof player isnt "undefined" and keyboard.keyDown(32) and (shootTime >= 500) and (player.hp > 0)
      shootTime = 0
      sfx.playSfx "laser"
      physics.createBullet player.x, player.y, player.dx, player.dy, player.a, player.height, sprites
    shootTime += dt

    # Down arrow (shoot bomb)
    if typeof player isnt "undefined" and keyboard.keyDown(40) and (bombShootTime >= 3000) and (player.hp > 0)
      # Shoot the bomb
      sfx.playSfx "bomb_shoot"
      bombCoords = physics.coordFromAngleDistance(player.x, player.y, player.a, player.height + 8)
      bomb = sprites.newSprite("img/bomb.png", 16, 16, bombCoords[0], bombCoords[1], player.a, 150, "bomb", 0)
      bomb.dx += player.dx
      bomb.dy += player.dy

      # Kick player backwards, because the bomb is so powerful
      kick = physics.coordFromAngleDistance(0, 0, -player.a, 200)
      player.dx += kick[0]
      player.dy -= kick[1]
      bombShootTime = 0

    bombShootTime += dt
    physics.doGravity map, sprites, dt
    particles.refresh dt
    particles.reDraw()
    sprites.refresh dt
    physics.checkMapCollision map, sprites, dt

    # docking information not needed after map collision check - allow for new check
    player.docked = false  unless typeof player is "undefined"
    physics.checkSpriteCollision sprites, dt
    sprites.reDraw()

    # Increase player's health, if docked, not dead and not at max
    player.hp += dt * 0.005  if typeof player isnt "undefined" and player.docked and player.hp > 0 and player.hp < 100

    # Update status bar
    unless typeof player is "undefined"
      statusHealth = Math.round(player.hp)
      statusHealth = 0  if statusHealth < 0
      $("div#statusdiv").text "Integrity: " + statusHealth + "%"

  # End of main interval function
  ), 1000 / fps
