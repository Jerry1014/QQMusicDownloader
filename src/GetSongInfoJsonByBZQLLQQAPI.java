import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class GetSongInfoJsonByBZQLLQQAPI extends GetSongInfoJson {

    String request_url = " https://api.itooi.cn/music/tencent/search?key=579621905&s=%s&limit=%s&offset=%s&type=song";
    String request_method = "GET";
    String referer_url = "";

    @Override
    List getSongList(String keyword, String page_num, String ua) throws IOException {
        String all_url = String.format(this.request_url, keyword, this.each_page_num, page_num);
        String connection_response = get_connection(new URL(all_url), ua, request_method, referer_url);

        JSONArray song_json_list = JSONObject.parseObject(connection_response).getJSONArray("data");
        return getList(song_json_list);
    }

    static List getList(JSONArray song_json_list) throws IOException {
        List<SongInfoByBZQLLAPI> song_list = new ArrayList<>();
        for (int time = 0; time < song_json_list.size(); time++) {
            song_list.add(new SongInfoByBZQLLAPI((JSONObject) song_json_list.getJSONObject(time)));
        }
        return song_list;
    }

    JSONObject getVkey(String song_id) throws IOException {
        return null;
    }
}

class SongInfoByBZQLLAPI extends SongInfo {
    SongInfoByBZQLLAPI(JSONObject song_info) {
        this.album_pic = song_info.getString("pic");
        this.best_quality = "flac";
        this.best_quality_file = song_info.getString("url");
        this.singer = song_info.getString("singer");
        this.song_name = song_info.getString("name");
        this.lrc = song_info.getString("lrc");
    }
}