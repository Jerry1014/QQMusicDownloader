<c:forEach items="${list}" var="a_song">
    <li class="song_list">
        <div class="song_info">
            <img class="song_icon" src="${a_song.album_pic}" onerror="this.src='img/album_none.png'" alt="假装这里有一张专辑图片"/>
        </div>
        <div id="song_text_info" class="song_info">
            <span class="song_name">${a_song.song_name}</span>
            <sup class="song_quality">${a_song.best_quality}</sup>
            <spanp class="singer_name">${a_song.singer}</spanp>
        </div>
        <div id="play_download" class="song_info">
            <audio style="overflow:hidden" src="${a_song.best_quality_file}" controls></audio>
            <input type="button" class="icon_download" onclick="window.open('${a_song.best_quality_file}')"/>
        </div>
    </li>
    <%-- 注意！这里可能有style的优先级问题--%>
    <link rel="stylesheet" type="text/css" href="css/ShowOfEachSongCSS.css?version=1905201114">
</c:forEach>