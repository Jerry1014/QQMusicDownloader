import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.IOException;

public class SongInfo {
    private String album_pic = null;
    private String best_quality_file = null;
    private String best_quality = null;
    private String song_name = null;
    private String singer = null;

    SongInfo(JSONObject song_info) throws IOException {
        this.song_name = song_info.getString("songname");
        Integer albumid = song_info.getInteger("albumid");
        this.album_pic = String.format("http://imgcache.qq.com/music/photo/album_300/%s/300_albumpic_%s_0.jpg", String.valueOf(albumid % 100), String.valueOf(albumid));
        String song_id = song_info.getString("songmid");
        if (song_info.getInteger("sizeflac") != 0) {
            this.best_quality = "flac";
        } else if (song_info.getInteger("sizeape") != 0) {
            this.best_quality = "ape";
        } else if (song_info.getInteger("size320") != 0) {
            this.best_quality = "320";
        } else if (song_info.getInteger("size128") != 0) {
            this.best_quality = "128";
        }else this.best_quality = "无法获取";

        JSONArray singer_json_list = song_info.getJSONArray("singer");
        StringBuilder tem_singer_name_list = new StringBuilder();

        tem_singer_name_list.append(((JSONObject) singer_json_list.getJSONObject(0)).getString("name"));
        for (int time = 1; time < singer_json_list.size(); time++) {
            tem_singer_name_list.append(' ');
            tem_singer_name_list.append(((JSONObject) singer_json_list.getJSONObject(time)).getString("name"));
        }
        this.singer = tem_singer_name_list.toString();


        GetSongInfoJson songinfo = new GetSongInfoJson();
        JSONObject songinfoJson = songinfo.getVkey(song_id);

        try {
            String vkey = songinfoJson.getJSONObject("data").getJSONArray("items").getJSONObject(0).getString("vkey");
            if (!vkey.equals("")) {
                this.best_quality_file = String.format("http://ws.stream.qqmusic.qq.com/C400%s.m4a?fromtag=0&guid=126548448&vkey=%s", song_id, vkey);
            }
        } catch (IndexOutOfBoundsException e) {
            e.printStackTrace();
        }
    }


    public String getAlbum_pic() {
        return album_pic;
    }

    public String getBest_quality_file() {
        return best_quality_file;
    }

    public String getBest_quality() {
        return best_quality;
    }

    public String getSong_name() {
        return song_name;
    }

    public String getSinger() {
        return singer;
    }
}
