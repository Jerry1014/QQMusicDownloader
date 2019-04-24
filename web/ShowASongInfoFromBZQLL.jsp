<c:forEach items="${list}" var="a_song">
    <li class="song_list">
        <div class="song_info">
            <img class="song_icon" src="${a_song.album_pic}" onerror="this.src='img/album_none.png'" alt="假装这里有一张专辑图片"/>
        </div>
        <div id="song_text_info" class="song_info">
            <span class="song_name">${a_song.song_name}</span>
            <spanp class="singer_name">${a_song.singer}</spanp>
        </div>
        <div id="play_download" class="song_info" style="overflow:hidden">
            <audio style="width: 300px;height: 54px;" src="${a_song.best_quality_file}" controls></audio>
            <a href="${a_song.best_quality_file}&br=flac"
               download="${a_song.singer} - ${a_song.song_name}.${a_song.best_quality}"><input
                    type="button" class="icon_download"/></a>
        </div>
    </li>
</c:forEach>

<style>
    li {
        list-style: none;
    }

    .song_info {
        display: inline-block
    }

    .song_icon {
        height: 80px;
        width: auto;
    }

    #song_text_info {
        height: 80px;
        width: 30%;
        vertical-align: top;
    }

    .song_name {
        display: block;
        margin: 10px 0 10px;
        line-height: 18px;
        font-size: 20px;
        font-weight: 400;
        color: #000;
    }

    #play_download {
        display: inline-block;
        vertical-align: top;
        height: 80px;
        width: auto;
        position: absolute;
        left: 40%;
    }

    .icon_download {
        position: relative;
        top: -8px;
        height: 40px;
        width: 40px;
        border: 0;
        background-size: 40px auto;
        background-color: transparent;
        background-image: url("./img/download.png");
        transition-duration: 0.4s;
    }

    .icon_download:hover {
        background-image: url("./img/download_hover.png");
    }
</style>
