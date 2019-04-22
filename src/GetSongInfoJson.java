import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

public class GetSongInfoJson {
    // 全局设置
    private URL myurl = null;
    private int time_out = 5000;

    // 歌曲信息请求设置
    private String each_page_num = "10";
    private String request_url = "https://c.y.qq.com/soso/fcgi-bin/client_search_cp?aggr=1&cr=1&flag_qc=0&p=%s&n=%s&w=%s";
    private String referer_url = "https://y.qq.com/portal/profile.html";
    private String request_method = "GET";

    private String request_vkey_url = "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json205361747&platform=yqq&cid=205361747&songmid=%s&filename=C400%s.m4a&guid=126548448";

    public JSONArray getSongList(String keyword, String page_num, String ua) throws IOException {
        // url补全
        keyword = URLEncoder.encode(keyword.replaceAll(" ", "+"), "utf-8");
        String all_url = String.format(this.request_url, page_num, this.each_page_num, keyword);
        String connection_response = get_connection(all_url, ua);

        return JSONObject.parseObject(connection_response.replaceAll("^callback\\(", "").replaceAll("\\)$", "")).getJSONObject("data").getJSONObject("song").getJSONArray("list");
    }

    public JSONObject getVkey(String song_id) throws IOException {
        String best_quality_file_url = String.format(this.request_vkey_url, song_id, song_id);
        String connection_response = get_connection(best_quality_file_url, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36");

        return JSONObject.parseObject(connection_response);
    }

    private String get_connection(String url, String ua) throws IOException {
        this.myurl = new URL(url);
        HttpURLConnection connection = (HttpURLConnection) myurl.openConnection();
        connection.setRequestMethod(this.request_method);
        connection.setConnectTimeout(time_out);
        connection.setRequestProperty("User-Agent", ua);
        connection.setRequestProperty("Referer", this.referer_url);
        connection.connect();

        // 获取输入流
        BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
        String line;
        StringBuilder sb = new StringBuilder();
        while ((line = br.readLine()) != null) {// 循环读取流
            sb.append(line);
        }
        br.close();// 关闭流
        connection.disconnect();// 断开连接

        return sb.toString();
    }
}
