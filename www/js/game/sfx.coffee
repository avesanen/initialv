###
# Sound effects
###
define ["jquery", "exports"], ($, exports) ->

  ###
  # Constructor
  ###
  exports.init = ->

    # Figure out which extension (codec) to use for the browser
    # also create empty bgm object since we don't initially play music
    @bgm = new Audio()
    if @bgm.canPlayType("audio/ogg; codecs=vorbis")
      @useExt = ".ogg"
    else
      @useExt = ".mp3"
    @sfx = Array()
    @sfxCount = 0
    @loadedSfxCount = 0
    that = this

    # Load all sound effects listed on JSON data
    $.getJSON "sfx.json", (data) ->
      $.each data, (key, val) ->

        #console.log(key + ": " + val);
        that.sfx[key] = new Audio(val + that.useExt)
        that.sfxCount++

        # Count sound effects that finished loading so that we can know when
        # all sounds are ready.
        that.sfx[key].addEventListener "canplaythrough", (->
          that.loadedSfxCount++
          console.log "sfx count: " + that.loadedSfxCount + "/" + that.sfxCount
        ), false


  ###
  # Begin playing a background music forever
  # @param basename Base name of the file (no extension or path)
  ###
  exports.playBgm = (basename) ->

    # End old music
    @bgm.pause()

    # Load music reusing old Audio object
    @bgm.src = "audio/" + basename + @useExt

    # Loop the music in FireFox compatible way
    @bgm.addEventListener "ended", (->
      @currentTime = 0
      @play()
    ), false

    # Play the music
    @bgm.play()


  ###
  #Q Stop playing the background music
  ###
  exports.stopBgm = ->
    @bgm.stop()


  ###
  # Play a preloaded sound effect
  # @param number Index of the sound effect
  ###
  exports.playSfx = (number) ->

    #console.log("playing sfx: "+number);
    if @sfx[number].currentTime > 0
      @sfx[number].pause()
      @sfx[number].currentTime = 0
    @sfx[number].play()


  ###
  # Stop playing a preloaded sound effect
  # @param number
  ###
  exports.stopSfx = (number) ->
    @sfx[number].pause()

  return
