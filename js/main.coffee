global = Function("return this")()
    
$ ->
  l = Location.parse location.href;
  sinario_no = l.params 'sinario';
  unless sinario_no
    alert '不正なアクセスです'
    location.href = 'top.html'

  class Sinario
    # シナリオデータ
    sinario: null
    # 現在のシナリオ
    current: null
    # シナリオ数
    count: 0
    # プレイヤのステータス
    status: 'unloaded'
    constructor: (url)->
      $.ajax(
        url: url
        dataType: 'json'
      ).done (data)=>
        $('.title').text data.title
        @sinario = data.sinario
        
        # ユーザCの存在チェック+ボタン非表示
        filtered = _.filter @sinario, (s)->
          return s.type == 'C'
        $('#voice-user-c').hide() if filtered.length == 0

        @count = @sinario.length

        @showText()

        unless @current
          @current = 0

        $('#link-description').attr
          href: 'description/' + sinario_no + '.html'
        
        @showImage()

        # soundManager
        global.soundManager.onready (oStatus)=>
          if !oStatus.success
            return false
          _.each @sinario, (data)=>
            console.log '## loading ' +  data.audio
            global.soundManager.createSound(
              id: data.id,
              url: './audio/sinario/' + sinario_no + '/' + data.audio,
              autoLoad: true
            )
            return
          @status = 'stop'
          return
        return
      return
    play: ()->
      unless @checkCurrent()
        @status = 'stop'
        @current = 0
        return false
        
      return if @status == 'unloaded'
      
      @status = 'play'
      @showImage()
      @showText()
      id = @sinario[@current].id
      # console.log '#play ' + id
      global.soundManager.play id,
        onfinish: ()=>
          # console.log '#finish ' + id
          @current++
          @play() if @status == 'play'
          return
      return
    pause: ()->
      @status == 'pause'
      id = @sinario[@current].id
      global.soundManager.pause id
      return
    stop: ()->
      @status == 'stop'
      id = @sinario[@current].id
      global.soundManager.stop id
      @current = 0
      return
    next: ()->
      id = @sinario[@current].id
      global.soundManager.stop id
      @current++
      @play()
      return
    prev: ()->
      id = @sinario[@current].id
      global.soundManager.stop id
      @current--
      @play()
      return
    showImage: ()->
      image = './img/sinario/' + sinario_no + '/' + @sinario[@current].image
      $('#sinario-image').attr
        src:image
      return
    showText: ()->
      sinario = @sinario
      $('#sinario-de').html($( '#templateSinario' ).render(
        voices: sinario
        language: 'de'
        current: @current
      ))
      $('#sinario-ja').html($( '#templateSinario' ).render(
        voices: sinario
        language: 'ja'
        current: @current
      ))
      $('#sinario-de .voice-box').each (i, e)->
        $de = $(@)
        $ja = $('#sinario-ja .voice-box').eq(i)
        if $de.height() > $ja.height()
          $ja.height($de.height())
        else
          $de.height($ja.height())
        return
      return
    checkCurrent: ()->
      return false unless @current >= 0 
      @current < @count

  s = new Sinario('data/' + sinario_no + '.json')
  
  $('#play').on 'click',()->
    s.play()
    return

  $('#stop').on 'click',()->
    s.stop()
    return
   
  $('#pause').on 'click',()->
    s.pause()
    return

  $('#next').on 'click',()->
    s.next()
    return
   
  $('#prev').on 'click',()->
    s.prev()
    return

  $('#hidden-ja').on 'click',()->
    $('#sinario-ja').addClass 'hidden'
    return

  $('#hidden-de').on 'click',()->
    $('#sinario-de').addClass 'hidden'
    return

  $('#show-ja').on 'click',()->
    $('#sinario-ja').removeClass 'hidden'
    return

  $('#show-de').on 'click',()->
    $('#sinario-de').removeClass 'hidden'
    return

  $('.voice-user-btn').on 'click',()->
    $self = $(this)
    if $self.hasClass('btn-hidden')
      $self.removeClass('btn-hidden')
    else
      $self.addClass('btn-hidden')

    hidden = $self.attr('id') + '-hidden'
    if $('.sinario').hasClass(hidden)
      $('.sinario').removeClass(hidden)
    else
      $('.sinario').addClass(hidden)
      
    return

      
  return
