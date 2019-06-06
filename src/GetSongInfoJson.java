import com.alibaba.fastjson.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

abstract class GetSongInfoJson {
    // 全局设置
    String each_page_song_num = "10";
    String total_page_num = null;
    private int time_out = 5000;

    abstract List getSongList(String keyword, String page_num, String ua, boolean if_recommend) throws Exception;

    String request(URL url, String ua, String request_method, String referer_url) throws IOException {
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod(request_method);
        connection.setConnectTimeout(time_out);
        connection.setRequestProperty("User-Agent", ua);
        connection.setRequestProperty("Referer", referer_url);
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

    String getTotal_page_num() {
        return total_page_num;
    }
}
