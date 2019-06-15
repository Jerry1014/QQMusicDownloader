package com;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class Util {
    static public String request(URL url, String ua, String request_method, String referer_url) throws IOException {
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod(request_method);
        // 全局设置
        int time_out = 5000;
        connection.setConnectTimeout(time_out);
        connection.setRequestProperty("User-Agent", ua);
        connection.setRequestProperty("Referer", referer_url);
        connection.connect();

        // 获取输入流
        BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8));
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
