/**
 * 明月浩空免费版 -》 曹杰峰音乐播放器 -》 Jerry本地播放器
 * Jerry1014 于2019/06/13 二次开发 主要工作为
 * 将播放器修改为本地播放器，歌曲的播放地址，图片，歌词等由本地提供
*/

// 检查jQuery插件是否安装
if (typeof jQuery === 'undefined') {
    throw new Error('请先加载jQuery插件！');
}

//载入播放器，音乐地址等
var lzxPlayerInit = function () {
    //判断是否为移动客户端，影响歌词的展示
    var isPhone = false;
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|Nokia|Black Berry|MIDP|Phone)/i)) {
        isPhone = true
    }

    //载入css
    if (!(typeof PlayerStyleLoaded !== "undefined" && PlayerStyleLoaded)) {
        var head = $("head"), PlayerStyleLoaded = true;
        head.append('<link rel="stylesheet" type="text/css" href="../css/player.css">');
        head.append('<link rel="stylesheet" type="text/css" href="../css/font-awesome.css">');
    }

    // 判断是否已经加载
    var isLoad = localStorage.getItem("isLoad");
    var lastFeed = localStorage.getItem("lastFeed");
    isLoad = typeof isLoad === "undefined" ? false : isLoad === "true";
    isLoad = isLoad && typeof lastFeed !== "undefined" && new Date().getTime() - parseInt(lastFeed) < 2000;

    //禁止iframe嵌套 || 是否已加载
    if (top.location !== self.location || isLoad) {
        return
    }
    localStorage.setItem("isLoad", "true");

    //！为保证分步精简中每一步的正确性，故先不删除此段，待所有使用到的地方删除完毕后再行删除
    //播放地址和播放key
    //webURL为域名
    var jsUrl = "https://music.caojiefeng.com/";
    var webURL = jsUrl.startsWith("http") ? jsUrl.substring(0, jsUrl.indexOf("/", 8)) : window.location.origin;
    var keyId = "29ae13009b6142b489f48b38e6a26d33";


    //添加向html中添加播放器的标签
    $("body").append('' +
        '<div id="lzxPlayer">\n' +
        '    <div class="player">\n' +
        '        <canvas class="blur-img" width="365" height="155" id="canvas">您的浏览器不支持canvas，请更换高级版的浏览器！</canvas>\n' +
        '        <div class="blur-img">\n' +
        '            <img src="#" class="blur" style="top: 0; display: inline;"></div>\n' +
        '        <div class="infos">\n' +
        '            <div class="songstyle">\n' +
        '                <span>\n' +
        '                    <i class="fa fa-music"></i>\n' +
        '                    <span class="song"></span>\n' +
        '                </span>\n' +
        '                <span style="float: right;">\n' +
        '                    <i class="fa fa-clock-o"></i>\n' +
        '                    <span class="time">00:00 / 00:00</span></span>\n' +
        '            </div>\n' +
        '            <div class="artiststyle">\n' +
        '                <i class="fa fa-user"></i>\n' +
        '                <span class="artist"></span>\n' +
        '                <span class="moshi">\n' +
        '                    <i class="loop fa fa-random current"></i> 随机播放</span>\n' +
        '            </div>\n' +
        '            <div class="artiststyle">\n' +
        '                <i class="fa fa-folder"></i>\n' +
        '                <span class="artist1"></span>\n' +
        '                <span class="geci"></span>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="control">\n' +
        '            <span style="float:left">\n' +
        '                <i class="loop fa fa-retweet" title="顺序播放"></i>\n' +
        '                <i class="prev fa fa-backward" title="上一首"></i>\n' +
        '            </span>\n' +
        '            <span style="float:right">\n' +
        '                <i class="next fa fa-forward" title="下一首"></i>\n' +
        '                <i class="random fa fa-random current" title="随机播放"></i>\n' +
        '            </span>\n' +
        '        </div>\n' +
        '        <div class="status">\n' +
        '            <b>\n' +
        '                <i class="play fa fa-play" title="播放"></i>\n' +
        '                <i class="pause fa fa-pause" title="暂停"></i>\n' +
        '            </b>\n' +
        '            <div id="div1" class="note">\n' +
        '                <i class="fa fa-music" aria-hidden="true"></i>\n' +
        '            </div>\n' +
        '            <div id="div2" class="note">\n' +
        '                <i class="fa fa-music" aria-hidden="true"></i>\n' +
        '            </div>\n' +
        '            <div id="div3" class="note">\n' +
        '                <i class="fa fa-music" aria-hidden="true"></i>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="musicbottom">\n' +
        '            <div class="rate">\n' +
        '                <div class="progress">\n' +
        '                    <div class="rate-buffered"></div>' +
        '                    <div class="rate-on" style="width: 0;">\n' +
        '                        <div class="drag"></div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="icons">\n' +
        '                <div class="switch-playlist">\n' +
        '                    <i class="fa fa-bars" title="播放列表"></i>\n' +
        '                </div>\n' +
        '                <div class="switch-ksclrc">\n' +
        '                    <i class="fa fa-toggle-on" title="关闭歌词"></i>\n' +
        '                </div>\n' +
        '                <div class="switch-down">\n' +
        '                    <a class="down">\n' +
        '                        <i class="fa fa-cloud-download" title="歌曲下载"></i>\n' +
        '                    </a>\n' +
        '                </div>\n' +
        '                <div class="new-volume">\n' +
        '                    <i class="volumeup fa fa-volume-up" title="音量"></i>\n' +
        '                    <div class="volume-controls" style="">\n' +
        '                        <div class="slider" data-direction="vertical">\n' +
        '                            <div class="progress2" style="height: 66%;">\n' +
        '                                <div class="drag" id="volume-drag"></div>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="cover"></div>\n' +
        '    </div>\n' +
        '    <div class="playlist">\n' +
        '        <div class="playlist-bd">\n' +
        '            <div class="album-list">\n' +
        '                <div class="musicheader"></div>\n' +
        '                <div class="list"></div>\n' +
        '            </div>\n' +
        '            <div class="song-list">\n' +
        '                <div class="musicheader">\n' +
        '                    <i class="fa fa-angle-right"></i>\n' +
        '                    <span></span>\n' +
        '                </div>\n' +
        '                <div class="list">\n' +
        '                    <ul></ul>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="switch-player">\n' +
        '        <i class="fa fa-angle-right" style="margin-top: 20px;"></i>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<div id="lzxTips"></div>\n' +
        '<div id="lzxLrc"></div>');

    // 全局主色
    mainColor = '0,0,0';

    var audio = new Audio(),
        $player = $('#lzxPlayer'),
        $tips = $('#lzxTips'),
        $lk = $('#lzxKsc,#lzxLrc'),
        $switchPlayer = $('.switch-player', $player),
        $btns = $('.status', $player),
        $songName = $('.song', $player),
        $cover = $('.cover', $player),
        $songTime = $('.time', $player),
        $songList = $('.song-list .list', $player),
        $albumList = $('.album-list', $player),
        $player_infos_artist = $('.player .artist', $player),
        $player_infos_album = $('.player .artist1', $player),
        $player_infos_play_mode = $('.player .moshi', $player),
        $player_infos_lyric = $('.player .geci', $player),
        $player_controls_switch_of_lrc = $('.player .switch-ksclrc', $player),
        $volumeSlider = $('.volume-controls .slider', $player);
    $rateBuffered = $('.musicbottom .rate-buffered', $player);
    $rateSlider = $('.rate .progress', $player);
    songFrom33 = '开启',
        songFrom44 = '',
        songFrom55 = '',
        roundcolor = '#6c6971',
        lightcolor = '#81c300',
        cur = 'current',
        ycgeci = true,
        first = 1,
        volume = $.cookie('lzx_player_volume') ? $.cookie('lzx_player_volume') : '0.666',
        albumId = 0,
        songId = 0,
        songTotal = 0,
        random = true,
        rateIsDown = false,
        rateMouse = {},
        rateTouch = {},
        hasgeci = true,
        cicleTime = null,
        hasLrc = false,
        lrcTimeLine = [],
        lrcHeight = 40,
        lrcTime = null,
        lrcCont = '',
        dogInterval = null,
        songFroms = {
            "wy": "网易音乐",
            "kg": "酷狗音乐",
            "qq": "QQ音乐",
            "xm": "虾米音乐",
            "local": "本地音乐"
        };

    if (isPhone) {
        $('#lzxLrc').addClass('phone');
        $player.addClass('phone');
        $(".new-volume", $player).hide();
    }

    //将秒数转换为分钟:秒钟的形式 如 100 -》 01:40
    function formatSecond(t) {
        return ('00' + Math.floor(t / 60)).substr(-2) + ':' + ('00' + Math.floor(t % 60)).substr(-2)
    }

    $cover.html('<img src="" onerror="this.src=\'img/album_none.png\'">');
    $songName.html('<a style="color:#f00">等待播放</a>');
    $player_infos_artist.html('<a style="color:#f00">Jerry</a>');
    $player_infos_album.html('<a style="color:#f00">音乐播放器</a>');
    $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 歌词未载入');

    // 播放器重载前的清理
    window.lzxPlayerReload = function () {
        try {
            clearInterval(cicleTime);
        } catch (e) {
        }
        try {
            clearInterval(lrcTime);
        } catch (e) {
        }
        try {
            clearInterval(dogInterval);
        } catch (e) {
        }
        $("#lzxPlayer").remove();
        $("#lzxLrc").remove();
        $("#lzxTips").remove();
        audio.pause();
    };

    //音乐播放控制
    var lzxMedia = {
        play: function () {
            $cover.addClass('coverplay');
            $player.addClass('playing');
            $rateBuffered.width(0);
            // 播放进度更新秒表
            cicleTime = setInterval(function () {
                if (!rateMouse.isDown && !rateTouch.isTouchDown) {
                    $songTime.text(formatSecond(audio.currentTime) + ' / ' + formatSecond(audio.duration));
                    $(".rate-on", $rateSlider).width(audio.currentTime / audio.duration * 100 + "%");
                }

                if (audio.currentTime < audio.duration / 2) {
                    $btns.css('background-image', 'linear-gradient(90deg, ' + roundcolor
                        + ' 50%, transparent 50%, transparent), linear-gradient('
                        + (90 + (270 - 90) / (audio.duration / 2) * audio.currentTime) + 'deg, ' + lightcolor + ' 50%, '
                        + roundcolor + ' 50%, ' + roundcolor + ')')
                } else {
                    $btns.css('background-image', 'linear-gradient('
                        + (90 + (270 - 90) / (audio.duration / 2) * audio.currentTime) + 'deg, ' + lightcolor
                        + ' 50%, transparent 50%, transparent), linear-gradient(270deg, ' + lightcolor + ' 50%, '
                        + roundcolor + ' 50%, ' + roundcolor + ')')
                }

                var timeRanges = audio.buffered;
                // 获取已缓存的时间  timeRanges.end(timeRanges.length - 1)

                // 计算百分比 展示进度
                if (timeRanges.length !== 0) {
                    $rateBuffered.width(parseInt(timeRanges.end(timeRanges.length - 1) * 100 / audio.duration * 100) / 100 + '%')
                }
            }, 800);
            if (hasLrc) {
                lrcTime = setInterval(lzxLrc.lrc.play, 500);
                $('#lzxLrc').addClass('show');
                $('.switch-down').css('right', '65px');
                $('.switch-ksclrc').show()
            }
        },
        pause: function () {
            clearInterval(cicleTime);
            $player.removeClass('playing');
            $('.switch-ksclrc').hide();
            $('.switch-down').css('right', '35px');
            if (hasLrc) {
                lzxLrc.lrc.hide()
            }
        },
        error: function () {
            clearInterval(cicleTime);
            $player.removeClass('playing');
            lzxTips.show(songSheetList[albumId].songNames[songId] + ' - 资源获取失败！尝试获取下一首...');
            lzxMedia.next();
        },
        seeking: function () {
            lzxTips.show('加载中...')
        },
        volumechange: function () {
            var vol = window.parseInt(audio.volume * 100);
            $('.progress2', $volumeSlider).height(vol + '%');
            lzxTips.show('音量：' + vol + '%');
            $.cookie("lzx_player_volume", audio.volume);
        },
        getInfos: function (id) {
            $cover.removeClass('coverplay');
            songId = id;
            allmusic();
            songFrom55 = songFroms[songSheetList[albumId].songTypes[songId]];
            musictype = songSheetList[albumId].songTypes[songId];
            netmusic();
        },
        getSongId: function (n) {
            return n >= songTotal ? 0 : n < 0 ? songTotal - 1 : n
        },
        next: function () {
            clearInterval(cicleTime);
            random ? lzxMedia.getInfos(window.parseInt(Math.random() * songTotal))
                : lzxMedia.getInfos(lzxMedia.getSongId(songId + 1));
        },
        prev: function () {
            clearInterval(cicleTime);
            random ? lzxMedia.getInfos(window.parseInt(Math.random() * songTotal))
                : lzxMedia.getInfos(lzxMedia.getSongId(songId - 1));
        }
    };
    var lzxTipsTime = null;
    var lzxTips = {
        show: function (cont) {
            clearTimeout(lzxTipsTime);
            $('#lzxTips').text(cont).addClass('show');
            this.hide()
        },
        hide: function () {
            lzxTipsTime = setTimeout(function () {
                $('#lzxTips').removeClass('show');
            }, 3000)
        }
    };
    //给audio添加监听事件  执行相应的函数
    audio.addEventListener('play', lzxMedia.play, false);
    audio.addEventListener('pause', lzxMedia.pause, false);
    audio.addEventListener('ended', lzxMedia.next, false);
    audio.addEventListener('playing', lzxMedia.playing, false);
    audio.addEventListener('volumechange', lzxMedia.volumechange, false);
    audio.addEventListener('error', lzxMedia.error, false);
    audio.addEventListener('seeking', lzxMedia.seeking, false);

    //侧边按钮点击事件
    $switchPlayer.click(function () {
        $player.toggleClass('show')
    });
    //音乐暂停事件
    $('.pause', $player).click(function () {
        hasgeci = false;
        $("li", $albumList).eq(albumId).addClass(cur).find(".artist").html("暂停播放 > ").parent().siblings()
            .removeClass(cur).find(".artist").html("").parent();
        lzxTips.show('暂停播放 - ' + songSheetList[albumId].songNames[songId]);
        $cover.removeClass('coverplay');
        audio.pause();
        setTimeout(function () {
            lzxTips.show("播放器下次访问将自动暂停");
        }, 4000);
        $.cookie("auto_playre", "no");
    });
    //音乐播放事件
    $('.play', $player).click(function () {
        hasgeci = true;
        $('#lzxLrc,#lzxKsc').show();
        $("li", $albumList).eq(albumId).addClass(cur).find(".artist").html("当前播放 > ").parent().siblings()
            .removeClass(cur).find(".artist").html("").parent();
        startPlay();
        setTimeout(function () {
            lzxTips.show("播放器下次访问将自动播放");
        }, 4000);
        $.cookie("auto_playre", "yes");
    });
    //上一首事件
    $('.prev', $player).click(function () {
        hasgeci = true;
        $('#lzxLrc,#lzxKsc').show();
        lzxMedia.prev();
        $.cookie("auto_playre", "yes");
    });
    //下一首事件
    $('.next', $player).click(function () {
        hasgeci = true;
        $('#lzxLrc,#lzxKsc').show();
        lzxMedia.next();
        $.cookie("auto_playre", "yes");
    });
    //随机播放按钮事件
    $('.random', $player).click(function () {
        $(this).addClass(cur);
        $('.loop', $player).removeClass(cur);
        random = true;
        lzxTips.show('随机播放');
        $player_infos_play_mode.html('<i class="random fa fa-random current"></i> 随机播放');
        $.cookie("random_play", true)
    });
    //顺序播放按钮事件
    $('.loop', $player).click(function () {
        $(this).addClass(cur);
        $('.random', $player).removeClass(cur);
        random = false;
        lzxTips.show('顺序播放');
        $player_infos_play_mode.html('<i class="loop fa fa-retweet"></i> 顺序播放');
        $.cookie("random_play", false)
    });
    //音量组件拖动事件
    $volumeSlider.click(function (e) {
        var documentTop = $(document).scrollTop();
        var progressHeight = $volumeSlider.height(),
            progressOffsetTop = $volumeSlider.offset().top - documentTop;
        var calcVolume = (1 - (e.clientY - progressOffsetTop) / progressHeight).toFixed(2);
        audio.volume = calcVolume > 1 ? 1 : calcVolume;
    });
    //播放进度条点击事件
    $rateSlider.click(function (e) {
        var progressWidth = $rateSlider.width(),
            progressOffsetLeft = $rateSlider.offset().left,
            eClientX = e.clientX;

        audio.currentTime = audio.duration * ((eClientX - progressOffsetLeft) / progressWidth)
    });
    //播放进度音量大小拖动圆点
    var isDown = false;
    $('.drag', $volumeSlider).mousedown(function () {
        isDown = true;
    });

    $('.drag', $rateSlider).on("touchstart", (function (e) {
        rateTouch.progressWidth = $rateSlider.width();
        rateTouch.isTouchDown = true;
        rateTouch.startX = e.originalEvent.touches[0].clientX;
        rateTouch.rateOnWidth = parseFloat(($(".rate-on", $rateSlider).width() / rateTouch.progressWidth).toFixed(2));
    }));

    $('.drag', $rateSlider).mousedown(function (e) {
        rateMouse.progressWidth = $rateSlider.width();
        rateMouse.isDown = true;
        rateMouse.startX = e.clientX;
        rateMouse.rateOnWidth = parseFloat(($(".rate-on", $rateSlider).width() / rateMouse.progressWidth).toFixed(2));
    });

    //touchmove 当手指在屏幕上滑动的时候连续地触发
    window.addEventListener("touchmove", function (e) {
        if (rateTouch.isTouchDown) {
            var rate = parseFloat(((e.touches[0].clientX - rateTouch.startX) / rateTouch.progressWidth)
                .toFixed(2)) + rateTouch.rateOnWidth;
            if (rate >= 0 && rate <= 1) {
                $(".rate-on", $rateSlider).width(rate * 100 + '%');
                rateTouch.currentTime = audio.duration * rate;
                $songTime.text(formatSecond(rateTouch.currentTime) + ' / ' + formatSecond(audio.duration));
            }
        }
        return false;
    }, {passive: false});
    //鼠标相关
    $(window).on({
        mousemove: function (e) {
            if (isDown) {
                var documentTop = $(document).scrollTop();
                var progressHeight = $volumeSlider.height(),
                    progressOffsetTop = $volumeSlider.offset().top - documentTop,
                    eClientY = e.clientY;
                if (eClientY >= progressOffsetTop && eClientY <= progressOffsetTop + progressHeight) {
                    audio.volume = (1 - (eClientY - progressOffsetTop) / progressHeight).toFixed(2);
                }
            } else if (rateMouse.isDown) {
                var rate = parseFloat(((e.clientX - rateMouse.startX) / rateMouse.progressWidth)
                    .toFixed(2)) + rateMouse.rateOnWidth;
                if (rate >= 0 && rate <= 1) {
                    $(".rate-on", $rateSlider).width(rate * 100 + '%');
                    rateMouse.currentTime = audio.duration * rate;
                    $songTime.text(formatSecond(rateMouse.currentTime) + ' / ' + formatSecond(audio.duration));
                }
            }
        },
        mouseup: function () {
            isDown = false;
            if (rateMouse.isDown) {
                audio.currentTime = rateMouse.currentTime;
                rateMouse.isDown = false;
            }
        },
        touchend: function (e) {
            if (rateTouch.isTouchDown) {
                audio.currentTime = rateTouch.currentTime;
                rateTouch.isTouchDown = false;
            }
        }
    });
    //播放列表按钮点击事件
    $('.switch-playlist').click(function () {
        $player.toggleClass('showAlbumList')
    });
    //返回专辑列表事件
    $songList.mCustomScrollbar();
    $('.song-list .musicheader,.song-list .fa-angle-right', $player).click(function () {
        $player.removeClass('showSongList')
    });
    //打开关闭歌词显示
    $('.switch-ksclrc').click(function () {
        $player.toggleClass('ksclrc');
        $('#lzxLrc').toggleClass('hide');
        $('#lzxKsc').toggleClass('hidePlayer');
        if (!$('#lzxLrc').hasClass('hide')) {
            ycgeci = true;
            if (hasLrc) {
                $player_infos_lyric.html('<i class="fa fa-check-circle"></i> 歌词开启')
            }
            lzxTips.show('开启歌词显示');
            songFrom33 = '开启';
            $player_controls_switch_of_lrc.html('<i class="fa fa-toggle-on" title="关闭歌词"></i>');
        } else {
            ycgeci = false;
            if (hasLrc) {
                $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 歌词关闭');
            }
            lzxTips.show('歌词显示已关闭');
            songFrom33 = '关闭';
            $player_controls_switch_of_lrc.html('<i class="fa fa-toggle-off" title="打开歌词"></i>')
        }
        musicTooltip();
    });
    //播放列表设置
    lzxPlayer.playList = {
        creat: {
            album: function () {
                $('.musicheader', $albumList).html('播放列表');
                var albumTotal = songSheetList.length,
                    albumList = '';
                for (var c = 0; c < albumTotal; c++) {
                    albumList += '<li><i class="fa fa-angle-right"></i><span class="index">' + (c + 1)
                        + '</span><span class="artist"></span>《' + songSheetList[c].songSheetName + "》 - "
                        + songSheetList[c].author + "</li>";
                }
                $('.list', $albumList).html('<ul>' + albumList + '</ul>').mCustomScrollbar();

                $("li", $albumList).click(function () {
                    var a = $(this).index();
                    $(this).hasClass(cur) ? lzxPlayer.playList.creat.song(a, true)
                        : lzxPlayer.playList.creat.song(a, false);
                    $player.addClass("showSongList")
                });
                songTotal = songSheetList[albumId].songIds.length;

                random ? lzxMedia.getInfos(window.parseInt(Math.random() * songTotal))
                    : lzxMedia.getInfos(lzxMedia.getSongId(0));

            },
            song: function (id, isThisAlbum) {
                songTotal = songSheetList[id].songIds.length;
                $(".song-list .musicheader span", $player)
                    .text(songSheetList[id].songSheetName + "(" + songTotal + ")");
                var songList = '';

                for (var i = 0; i < songTotal; i++) {
                    songList += '<li><span class="index">' + (i + 1) + '</span><span class="artist"></span>'
                        + songSheetList[id].songNames[i] + '</li>'
                }
                $('ul', $songList).html(songList);
                $songList.mCustomScrollbar('update');
                if (isThisAlbum) {
                    $("li", $songList).eq(songId).addClass(cur).siblings().removeClass(cur);
                    $songList.mCustomScrollbar("scrollTo", $("li.current", $songList).position().top - 120);
                } else {
                    $songList.mCustomScrollbar("scrollTo", "top");
                }
                $('li', $songList).click(function () {
                    hasgeci = true;
                    $('#lzxLrc,#lzxKsc').show();
                    albumId = id;
                    if ($(this).hasClass(cur)) {
                        lzxTips.show('正在播放 - '
                            + songSheetList[albumId].songNames[songId].replace(songId + 1 + '#', ''))
                    } else {
                        $.cookie("auto_playre", "yes");
                        songId = $(this).index();
                        lzxMedia.getInfos(songId);
                    }
                })
            }
        }
    };
    var lzxLrc = {
        load: function () {
            lzxLrc.lrc.hide();
            hasLrc = false;
            $('#lzxLrc,#lzxKsc').html('');
            setTimeout(function () {
                if (hasgeci) {
                    $player_infos_lyric.html('<i class="fa fa-check-circle"></i> 歌词' + songFrom33)
                } else {
                    $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 歌词' + songFrom33)
                }
                $('.switch-down').css('right', '65px');
                $('.switch-ksclrc').show();
                $.ajax({
                    url: webURL + "/api/musicLyric?songId=" + songSheetList[albumId].songIds[songId] + "&type="
                        + songSheetList[albumId].songTypes[songId],
                    type: 'GET',
                    dataType: 'script',
                    success: function () {
                        if (lrcstr == '') {
                            songFrom44 = ' - 暂无歌词!';
                            $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 暂无歌词');
                            $('.switch-ksclrc').hide();
                            $('.switch-down').css('right', '35px');
                        } else {
                            if (lrcstr.indexOf('[00') >= 0) {
                                setTimeout(function () {
                                        if (!$('#lzxLrc').hasClass('hide')) {
                                            songFrom44 = ' - 歌词获取成功!'
                                        } else {
                                            songFrom44 = ' - 歌词已关闭！'
                                        }
                                        lzxLrc.lrc.format(lrcstr)
                                    },
                                    500)
                            } else {
                                songFrom44 = ' - 暂无歌词!';
                                $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 暂无歌词');
                                $('.switch-ksclrc').hide();
                                $('.switch-down').css('right', '35px');
                            }
                        }
                    },
                    error: function () {
                        songFrom44 = ' - 暂无歌词!';
                        $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 暂无歌词');
                        $('.switch-ksclrc').hide();
                        $('.switch-down').css('right', '35px');
                    }
                })
            }, 50)
        },
        lrc: {
            format: function (cont) {
                hasLrc = true;

                function formatTime(t) {
                    var sp = t.split(':'),
                        min = +sp[0],
                        sec = +sp[1].split('.')[0],
                        ksec = +sp[1].split('.')[1];
                    return min * 60 + sec + Math.round(ksec / 1000)
                }

                var lrcCont = cont.replace(/\[[A-Za-z]+:(.*?)]/g, '').split(/[\]\[]/g),
                    lrcLine = '';
                lrcTimeLine = [];
                for (var i = 1; i < lrcCont.length; i += 2) {
                    var timer = formatTime(lrcCont[i]);
                    lrcTimeLine.push(timer);
                    if (i == 1) {
                        lrcLine += '<li class="lzxLrc' + timer + ' current" style="color:rgba(' + mainColor + ',1)">' + lrcCont[i + 1] + '</li>'
                    } else {
                        lrcLine += '<li class="lzxLrc' + timer + '">' + lrcCont[i + 1] + '</li>'
                    }
                }
                $('#lzxLrc').html('<ul>' + lrcLine + '</ul>');
                setTimeout(function () {
                        if (audio.paused) {
                            $('.switch-ksclrc').hide();
                            $('.switch-down').css('right', '35px');
                        } else {
                            $('#lzxLrc').addClass('show')
                        }
                    },
                    500);
                lrcTime = setInterval(lzxLrc.lrc.play, 500)
            },
            play: function () {
                var timeNow = Math.round(audio.currentTime);
                if ($.inArray(timeNow, lrcTimeLine) > 0) {
                    var $lineNow = $('.lzxLrc' + timeNow);
                    if (!$lineNow.hasClass(cur)) {
                        $lineNow.css('color', 'rgba(' + mainColor + ',1)');
                        $lineNow.addClass(cur).siblings().removeClass(cur).css('color', '');
                        $('#lzxLrc').animate({
                            scrollTop: lrcHeight * $lineNow.index()
                        });
                    }
                } else {
                    lrcCont = ''
                }
            },
            hide: function () {
                clearInterval(lrcTime);
                $('#lzxLrc').removeClass('show')
            }
        }
    };
    //设置默认音量
    audio.volume = volume;
    if (volume == 1) {
        $('.volume-on', $player).width('100%');
    }

    //获取歌单列表数据
    //自改测试
    var autoPlayer = 0, randomPlayer = 0, defaultVolume = 75, showLrc = 1, greeting = '来啦，老弟',
        showGreeting = 0, defaultAlbum = 1, siteName = 'Jerry', background = 1, playerWidth = -1, coverWidth = -1,
        showNotes = 1, autoPopupPlayer = -1;
    var songSheetList = [];
    function startmusic(){
        //此处的push为设置用，实际使用时应当由参数传入
        songSheetList.push({
            "songSheetName": "test",
            "author": "test",
            "songSrcs": ['http://ws.stream.qqmusic.qq.com/C400004EzHKM2jXY9i.m4a?fromtag=0&guid=126548448&vkey=E376F4C8AB20BC8116C3FA51BA94150FBE0F794A1F0B59022254A59B2CA75472099C73477359D972B211D0116601C5869CC910132C564915'],
            "songIds": ['108242'],
            "songNames": ['红玫瑰'],
            "songTypes": ['wy'],
            "albumNames": ['认了吧'],
            "artistNames": ['陈奕迅'],
            "albumCovers": ['http://imgcache.qq.com/music/photo/album_300/26/300_albumpic_31526_0.jpg'],
            "lrc": ['']
        });
        lzxPlayer.playList.creat.album()
    }
    startmusic();
    if (playerWidth !== -1) {
        document.body.style.setProperty('--player-width', playerWidth + 'px');
    }
    if (coverWidth !== -1) {
        document.body.style.setProperty('--cover-width', coverWidth + 'px');
    }
    if (showNotes !== 1) {
        $(".status .note", $player).hide()
    }
    if (autoPopupPlayer !== -1) {
        setTimeout(function () {
            $player.addClass('show')
        }, autoPopupPlayer * 1000)
    }
    if ($.cookie("random_play") != null) {
        if ($.cookie("random_play") == "true") {
            $('.loop', $player).removeClass(cur);
            $('.random', $player).addClass(cur);
            $player_infos_play_mode.html('<i class="random fa fa-random"></i> 随机播放');
            random = true;
        } else {
            $('.loop', $player).addClass(cur);
            $('.random', $player).removeClass(cur);
            $player_infos_play_mode.html('<i class="loop fa fa-retweet"></i> 顺序播放');
            random = false;
        }
    } else {
        if (randomPlayer != 1) {
            $('.loop', $player).addClass(cur);
            $('.random', $player).removeClass(cur);
            random = false;
            $player_infos_play_mode.html('<i class="loop fa fa-retweet"></i> 顺序播放');
        }
    }
    if ($.cookie("lzx_player_volume") == '0.666') {
        volume = (defaultVolume / 100);
        audio.volume = volume;
    }
    // 防止百分百音量无触发事件
    lzxMedia.volumechange();
    albumId = defaultAlbum - 1;
    if (showLrc == 0) {
        //隐藏歌词
        $('#lzxLrc').addClass('hide');
        ycgeci = false;
        if (hasLrc) {
            $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 歌词关闭');
        }
        lzxTips.show('歌词显示已关闭');
        songFrom33 = '关闭';
        $player_controls_switch_of_lrc.html('<i class="fa fa-toggle-off" title="打开歌词"></i>')
    }
    if (showGreeting == 1) {
        lzxTips.show(greeting);
    }

    // 喂狗
    dogInterval = setInterval(function () {
        localStorage.setItem("lastFeed", new Date().getTime().toString());
        // 检查css变量
        var currPlayerWidth = document.body.style.getPropertyValue('--player-width');
        if (typeof playerWidth != "undefined" && playerWidth !== -1 && currPlayerWidth != (playerWidth + 'px')) {
            document.body.style.setProperty('--player-width', playerWidth + 'px');
        }
        var currCoverWidth = document.body.style.getPropertyValue('--cover-width');
        if (typeof coverWidth != "undefined" && coverWidth !== -1 && currCoverWidth != (coverWidth + 'px')) {
            document.body.style.setProperty('--cover-width', coverWidth + 'px');
        }
    }, 1000);

    // 浏览器关闭事件监听器
    window.addEventListener('beforeunload', function (event) {
        localStorage.setItem("isLoad", "false");
    }, true);

    //一脸懵逼，不知道啥意思，我猜是防止歌名等过长的
    function LimitStr(str, num, t) {
        num = num || 6;
        t = t || '...';
        var re = '';
        var leg = str.length;
        var h = 0;
        for (var i = 0; h < num * 2 && i < leg; i++) {
            h += str.charCodeAt(i) > 128 ? 2 : 1;
            re += str.charAt(i)
        }
        if (i < leg) re += t;
        return re
    }

    //通过网易云的api获取歌曲，我要修改的也是这部分
    function netmusic() {
        audio.src = songSheetList[albumId].songSrcs[songId];
        $('.switch-down').show();
        $('.switch-down').html('<a class="down"><i class="fa fa-cloud-download" title="下载"></i></a>');
        $('.down').click(function () {
            window.open(audio.src, 'newwindow')
        });
        //lrcurl = songSheetList[albumId].lyrics[songId];
        $songName.html('<span title="' + songSheetList[albumId].songNames[songId] + '">'
            + LimitStr(songSheetList[albumId].songNames[songId]) + '</span>');
        window.console.log(name + ' - 当前播放：' + songSheetList[albumId].songNames[songId] + ' - '
            + songSheetList[albumId].artistNames[songId]);
        $player_infos_artist.html('<span title="' + songSheetList[albumId].artistNames[songId] + '">'
            + LimitStr(songSheetList[albumId].artistNames[songId]) + '</span>');
        $player_infos_album.html('<span title="' + songSheetList[albumId].albumNames[songId] + '">'
            + LimitStr(songSheetList[albumId].albumNames[songId]) + '</span>');
        var coverImg = new Image();
        coverImg.src = songSheetList[albumId].albumCovers[songId];
        $cover.addClass('changing');
        coverImg.onload = function () {
            $cover.removeClass('changing');
            $.ajax({
                // 这个url存在的意义未知
                url: webURL + '/api/mainColor',
                type: 'GET',
                dataType: 'script',
                data: {
                    url: coverImg.src
                },
                success: function () {
                    playerColor()
                },
                error: function () {
                    playerColor()
                }
            })
        };
        coverImg.error = function () {
            coverImg.src = '../img/album_none.png';
            setTimeout(function () {
                    lzxTips.show(songSheetList[albumId].songNames[songId] + ' - 专辑图片获取失败！')
                },
                4000)
        };
        $cover.html(coverImg);
        if (background == 1) {
            $('.blur-img .blur', $player).attr("src", songSheetList[albumId].albumCovers[songId]); //虚化背景
        } else {
            if ($(".blur-img").length > 0) {
                $(".blur-img").remove();
            }
        }
        lzxLrc.load(); //加载歌词

        //通过修改此处和startPlay()实现播放的控制
        if (first == 1) {
            first = 2;
            if (autoPlayer == 1 && ($.cookie("auto_playre") == null || $.cookie("auto_playre") === "yes")) {
                startPlay()
            } else {
                lzxTips.show('播放器自动暂停');
                $cover.removeClass('coverplay');
                audio.pause();
            }
        } else {
            startPlay()
        }
        // 歌词自动隐藏
        $(window).scroll(function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(window.document).height();
            var windowHeight = $(this).height();
            if (scrollTop + windowHeight == scrollHeight) {
                if (hasgeci && ycgeci) {
                    $player.addClass('ksclrc');
                    $('#lzxLrc').addClass('hide');
                    $('#lzxKsc').addClass('hidePlayer');
                    $player_infos_lyric.html('<i class="fa fa-times-circle"></i> 歌词隐藏');
                    $player_controls_switch_of_lrc.html('<i class="fa fa-toggle-off" title="歌词隐藏"></i>');
                    if (hasLrc) {
                        lzxTips.show('歌词自动隐藏')
                    }
                }
            } else {
                if (hasgeci && ycgeci) {
                    $player.removeClass('ksclrc');
                    $('#lzxLrc').removeClass('hide');
                    $('#lzxKsc').removeClass('hidePlayer');
                    if (hasLrc) {
                        $player_infos_lyric.html('<i class="fa fa-check-circle"></i> 歌词开启')
                    }
                    $player_controls_switch_of_lrc.html('<i class="fa fa-toggle-on" title="关闭歌词"></i>')
                }
            }
        });
        musicTooltip();
    }

    function startPlay() {
        lzxTips.show('开始从' + songFrom55 + '播放 - ' + songSheetList[albumId].songNames[songId]);
        audio.play();
    }

    function allmusic() {
        $("li", $albumList).eq(albumId).addClass(cur).find(".artist").html("当前播放 > ").parent().siblings()
            .removeClass(cur).find(".artist").html("").parent();
        $songList.find("li").eq(songId).addClass(cur).siblings().removeClass(cur);
        if ($('ul', $songList).html() != '') $songList.mCustomScrollbar("scrollTo", $("li.current", $songList)
            .position().top - 120);
    }

    function playerColor() {
        $player.css({
            background: 'rgba(' + mainColor + ',.8)'
        });
        $switchPlayer.css({
            background: 'rgba(' + mainColor + ',.3)'
        });
        $tips.css({
            background: 'rgba(' + mainColor + ',.6)'
        });
        $lk.css({
            background: 'rgba(' + mainColor + ',.3)'
        });
        $(".infos,.control,.status .note", $player).css({
            color: 'rgb(' + font_color + ')'
        });
    }

    function musicTooltip() {
        if (isPhone) {
            return;
        }
        $('#lzxPlayer span,#lzxPlayer i').each(function () {
            $('#tooltip').remove();
            if (this.title) {
                var a = this.title;
                $(this).unbind("mouseover mouseout");
                $(this).mouseover(function (b) {
                    this.title = '';
                    $('body').append('<div id="tooltip">' + a + '</div>');
                    $('#tooltip').css({
                        left: b.pageX - 15 + 'px',
                        top: b.pageY + 30 + 'px',
                        opacity: '0.8'
                    }).fadeIn(250)
                }).mouseout(function () {
                    this.title = a;
                    $('#tooltip').remove()
                }).mousemove(function (b) {
                    $('#tooltip').css({
                        left: b.pageX - 15 + 'px',
                        top: b.pageY + 30 + 'px'
                    });
                });
            }
        });
    }
};
lzxPlayerInit();