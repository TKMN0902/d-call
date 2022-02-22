(function() {

  $(function() {
    var Sinario, l, s, sinario_no;
    l = Location.parse(location.href);
    sinario_no = l.params('sinario');
    if (!sinario_no) {
      alert('不正なアクセスです');
      location.href = 'top.html';
    }
    Sinario = (function() {
      Sinario.prototype.sinario = null;

      Sinario.prototype.current = null;

      Sinario.prototype.count = 0;

        Sinario.prototype.status = 'stop';

        function Sinario(url) {
        $.ajax({
          url: url,
          dataType: 'json'
        }).done((function (_this) {
            return function (data) {
            var filtered;
            $('.title').text(data.title);
            _this.sinario = data.sinario;
                filtered = _.filter(_this.sinario, function (s) {
                    return s.type === 'C';
                });
                if (filtered.length === 0) {
                    $('#voice-user-c').hide();
                }
                _this.count = _this.sinario.length;
                _this.showText();
            if (!_this.current) {
              _this.current = 0;
            }
            $('#link-description').attr({
              href: 'description/' + sinario_no + '.html'
            });
			
			  $('#link-voca').attr({
              href: 'description/voca' + sinario_no + '.pdf'
            });
            _this.showImage();
          };
        })(this));
        return;
      }

        var flags = new Array();

        Sinario.prototype.play = function() {   //再生ボタンが押された
        var id;
        if (!this.checkCurrent()) {
          this.status = 'stop';
          this.current = 0;
          return false;
        }
            if (this.status === 'unloaded') {
                return;
            }
            if (this.status == 'play') {
                var aud = document.getElementById('aud' + this.current);
                aud.currentTime = 0;
            }
        this.status = 'play';
        this.showImage();
        this.showText();
        id = this.sinario[this.current].id;
          var aud = document.getElementById('aud' + this.current);
          aud.play();
          var nextPlay = (event) => {
              this.current++;
              aud = document.getElementById('aud' + this.current);
              if (this.status === 'play') {
                  this.play();
              }
          }
            if (flags[this.current] == null) {
                flags[this.current] = true;
                aud.addEventListener('ended', nextPlay);
            }
        };

      Sinario.prototype.pause = function() {
        var id;
        this.status = 'pause';
        id = this.sinario[this.current].id;
        //global.soundManager.pause(id);
          var aud = document.getElementById('aud' + this.current);
          aud.pause();
      };

      Sinario.prototype.stop = function() {
        var id;
        this.status = 'stop';
        id = this.sinario[this.current].id;
          var aud = document.getElementById('aud' + this.current);
          aud.pause();
          aud.currentTime = 0;
        this.current = 0;
      };

      Sinario.prototype.next = function() {
        var id;
        id = this.sinario[this.current].id;
          var aud = document.getElementById('aud' + this.current);
          aud.pause();
          aud.currentTime = 0;
        this.current++;
        this.play();
      };

      Sinario.prototype.prev = function() {
        var id;
        id = this.sinario[this.current].id;
          var aud = document.getElementById('aud' + this.current);
          aud.pause();
          aud.currentTime = 0;
        this.current--;
        this.play();
      };

        Sinario.prototype.showImage = function () {
        var image;
        image = './img/sinario/' + sinario_no + '/' + this.sinario[this.current].image;
        $('#sinario-image').attr({
          src: image
        });
      };

        Sinario.prototype.showText = function () {
            var sinario;
            sinario = this.sinario;
            $('#sinario-de').html($('#templateSinario').render({
                voices: sinario,
                language: 'de',
                current: this.current
            }));
            $('#sinario-ja').html($('#templateSinario').render({
                voices: sinario,
                language: 'ja',
                current: this.current
            }));
            $('#sinario-de .voice-box').each(function (i, e) {
                var $de, $ja;
                $de = $(this);
                $ja = $('#sinario-ja .voice-box').eq(i);
                if ($de.height() > $ja.height()) {
                    $ja.height($de.height());
                } else {
                    $de.height($ja.height());
                }
            });
            //字幕自動スクロール
            var german = document.getElementById('sinario-de');
            var german2 = document.getElementsByClassName('current-text');
            var japan = document.getElementById('sinario-ja');
            var japan2 = document.getElementsByClassName('current-text');
            if (german2[0] != null && japan2[0] != null) {       //german(japan)が定義されている
                var r = german.getBoundingClientRect();
                var r2 = german2[0].getBoundingClientRect();
                var r3 = japan.getBoundingClientRect();
                var r4 = japan2[0].getBoundingClientRect();
                german.scrollTo(0, r2.top - r.top - 100);       //スクロール
                japan.scrollTo(0, r4.top - r3.top - 100);
            }
        };

      Sinario.prototype.checkCurrent = function() { //currentが異常な値を示しているか
        if (this.current < 0) {
          return false;
        }
        return this.current < this.count;
      };

      return Sinario;

    })();
    s = new Sinario('data/' + sinario_no + '.json');
    $('#play').on('click', function() {
      s.play();
    });
    $('#stop').on('click', function() {
      s.stop();
    });
    $('#pause').on('click', function() {
      s.pause();
    });
    $('#next').on('click', function() {
      s.next();
    });
    $('#prev').on('click', function() {
      s.prev();
    });
    $('#hidden-ja').on('click', function() {
      $('#sinario-ja').addClass('hidden');
    });
    $('#hidden-de').on('click', function() {
      $('#sinario-de').addClass('hidden');
    });
    $('#show-ja').on('click', function() {
      $('#sinario-ja').removeClass('hidden');
    });
    $('#show-de').on('click', function() {
      $('#sinario-de').removeClass('hidden');
    });
    $('.voice-user-btn').on('click', function() {
      var $self, hidden;
      $self = $(this);
      if ($self.hasClass('btn-hidden')) {
        $self.removeClass('btn-hidden');
      } else {
        $self.addClass('btn-hidden');
      }
      hidden = $self.attr('id') + '-hidden';
      if ($('.sinario').hasClass(hidden)) {
        $('.sinario').removeClass(hidden);
      } else {
        $('.sinario').addClass(hidden);
      }
    });
      $('.size-user-btn').on('click', function () { //文字サイズのボタン
          var $self;
          var partner;
          $self = $(this);
          if ($self.attr('id') == 'size-user-a') {  //クリックされたボタンが大
              partner = document.getElementById('size-user-b');
              if (!$self.hasClass('btn-hidden')) {
                  $self.addClass('btn-hidden');
                  $(partner).removeClass('btn-hidden');
                  $('.sinario').css('font-size', '18px');
                  $('.sinario').css('line-height', '150%');
                  $('.sinario').css('width', '95%');
                  $('.sinario').css('overflow-y', 'scroll');
                  $('.sinario').css('height', '385px');
                  $('.sinario').css('overflow-wrap', 'break-word');
              }
          } 
          else {
              partner = document.getElementById('size-user-a');
              if (!$self.hasClass('btn-hidden')) {
                  $self.addClass('btn-hidden');
                  $(partner).removeClass('btn-hidden');
                  $('.sinario').css('font-size', '0.8rem');
                  $('.sinario').css('line-height', '100%');
                  $('.sinario').css('width', '95%');
                  $('.sinario').css('overflow-y', 'scroll');
                  $('.sinario').css('height', '385px');
                  $('.sinario').css('overflow-wrap', 'break-word');
              }
          }
      });

    var nav = $('.scroll');                      //スマホ用コントローラの処理
      var navTop = nav.offset().top;
      var cover = document.getElementsByClassName('cover')[0];
    $(window).scroll(function () {
        var winTop = $(this).scrollTop();
        if (winTop >= navTop) {
            nav.addClass('fixed');
            cover.setAttribute("id", "fixed");
        }
        else {
            nav.removeClass('fixed');
            cover.setAttribute("id", "notFixed");
        }
    }
    )
  });

}).call(this);

document.documentElement.addEventListener('touchstart', function (e) {  //ピンチ防止
    if (e.touches.length >= 2) { e.preventDefault(); }
}, { passive: false });

window.onload = function () {   //audioファイルをhtmlに記述
    var url = new URL(window.location.href);
    var params = url.searchParams;
    var no = params.get('sinario');
    var aud = document.getElementById('aud');
    $.getJSON('data/' + no + '.json', (data) => {
        for (var i = 0; i < data['sinario'].length; i++) {
            url = './audio/sinario/' + no + '/' + data['sinario'][i].audio;
            aud.insertAdjacentHTML('beforeend', '<audio id=' + "aud" + i + ' src=' + url + '></audio>');
        }
    });
}