function play_music(song_id, album, song_name, artist, albumCovers) {
    var song_src,lrc;
    $.ajax({
        type: 'GET',
        dataType: 'JSON',
        url: 'http://localhost:8080/QQMusicDownloader_war_exploded/P',
        data: {
            'song_id': song_id
        },
        success: function (data) {
            song_src = data.src;
            lrc = data.lrc;
            add_song_to_player(album,song_name,artist,song_src,albumCovers,lrc)
        }
    });
}