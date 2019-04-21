import com.alibaba.fastjson.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class SongInfo {
    private String album_pic = null;
    private String best_quality_file = null;
    private String best_quality = null;
    private String song_name = null;

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
        }
        String best_quality_file_url = String.format("https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json205361747&platform=yqq&cid=205361747&songmid=%s&filename=C400%s.m4a&guid=126548448", song_id, song_id);

        // get_key
        // 调用网络连接欸，未来单独作为一个类
        URL url = new URL(best_quality_file_url);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(5000);
        //connection.setRequestProperty("User-Agent", request.getHeader("user-agent"));
        //connection.setRequestProperty("Referer", "https://y.qq.com/portal/profile.html");
        connection.connect();
        // 获取输入流
        // 获取输入流
        BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
        String line;
        StringBuilder sb = new StringBuilder();
        while ((line = br.readLine()) != null) {// 循环读取流
            sb.append(line);
        }
        br.close();// 关闭流
        connection.disconnect();// 断开连接

        JSONObject test = JSONObject.parseObject(sb.toString());
        try {
            String vkey = JSONObject.parseObject(sb.toString()).getJSONObject("data").getJSONArray("items").getJSONObject(0).getString("vkey");
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
}
