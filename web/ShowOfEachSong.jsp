<c:forEach items="${list}" var="a_song">
    <li class="song_list">
        <div class="'a_song">
            <div class="song_info">
                <img class="song_icon" src="${a_song.album_pic}" onerror="this.src='img/album_none.png'"
                     alt="假装这里有一张专辑图片"/>
            </div>
            <div id="song_text_info" class="song_info">
                <div class="song_name_album_name">
                    <span id="song_name">${a_song.song_name}</span>
                    <span id="album_name">- ${a_song.album_name}</span>
                </div>
                <sup class="song_quality">${a_song.quality}</sup>
                <spanp class="singer_name">${a_song.singer}</spanp>
            </div>
            <div id="play_download" class="song_info">
                    <%--            <audio style="overflow:hidden" src="${a_song.song_url}" controls></audio>--%>
                <input type="button" class="icon_download"
                       onclick="play_music('${a_song.song_id}','${a_song.song_mid}','${a_song.album_name}','${a_song.song_name}','${a_song.singer}','${a_song.album_pic}')"/>
                    <%--            <input type="button" class="icon_download" onclick="window.open('${a_song.song_url}')"/>--%>
            </div>
        </div>
    </li>
    <%-- 注意！这里可能有style的优先级问题--%>
    <link rel="stylesheet" type="text/css" href="css/ShowOfEachSongCSS.css?version=<%=version%>">
</c:forEach>
<script type="text/javascript" src="js/play_music.js?version=<%=version%>"></script>