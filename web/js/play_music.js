function play_music(song_id, song_mid, album, song_name, artist, albumCovers) {
    var song_src,lrc;
    $.ajax({
        type: 'GET',
        dataType: 'JSON',
        url: 'http://localhost:8080/QQMusicDownloader_war_exploded/P',
        data: {
            'song_id': song_id,
            'song_mid': song_mid
        },
        success: function (data) {
            song_src = data.src;
            lrc = data.lrc;
            add_song_to_player(album,song_name,artist,song_src,albumCovers,lrc)
        }
    });
}