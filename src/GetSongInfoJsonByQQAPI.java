import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class GetSongInfoJsonByQQAPI extends GetSongInfoJson {
    // 歌曲信息请求设置
    private String request_url = "https://c.y.qq.com/soso/fcgi-bin/client_search_cp?aggr=1&cr=1&flag_qc=0&p=%s&n=%s&w=%s";
    private String referer_url = "https://y.qq.com/portal/profile.html";
    private String request_method = "GET";

    private String request_vkey_url = "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json205361747&platform=yqq&cid=205361747&songmid=%s&filename=C400%s.m4a&guid=126548448";

    List getSongList(String keyword, String page_num, String ua) throws IOException {
        String all_url = String.format(this.request_url, page_num, this.each_page_num, keyword);
        String connection_response = get_connection(new URL(all_url), ua, request_method, referer_url);

        JSONArray song_json_list = JSONObject.parseObject(connection_response.replaceAll("^callback\\(", "").replaceAll("\\)$", "")).getJSONObject("data").getJSONObject("song").getJSONArray("list");

        return getList(song_json_list);
    }

    static List getList(JSONArray song_json_list) throws IOException {
        List<SongInfoByQQAPI> song_list = new ArrayList<>();
        for (int time = 0; time < song_json_list.size(); time++) {
            song_list.add(new SongInfoByQQAPI((JSONObject) song_json_list.getJSONObject(time)));
        }
        return song_list;
    }


    JSONObject getVkey(String song_id) throws IOException {
        String best_quality_file_url = String.format(this.request_vkey_url, song_id, song_id);
        String connection_response = get_connection(new URL(best_quality_file_url), "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36", request_method, referer_url);

        return JSONObject.parseObject(connection_response);
    }
}

class SongInfoByQQAPI extends SongInfo {
    SongInfoByQQAPI(JSONObject song_info) throws IOException {
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
        } else this.best_quality = "无法获取";

        JSONArray singer_json_list = song_info.getJSONArray("singer");
        StringBuilder tem_singer_name_list = new StringBuilder();

        tem_singer_name_list.append(((JSONObject) singer_json_list.getJSONObject(0)).getString("name"));
        for (int time = 1; time < singer_json_list.size(); time++) {
            tem_singer_name_list.append(' ');
            tem_singer_name_list.append(((JSONObject) singer_json_list.getJSONObject(time)).getString("name"));
        }
        this.singer = tem_singer_name_list.toString();


        GetSongInfoJsonByQQAPI songinfo = new GetSongInfoJsonByQQAPI();
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
}
