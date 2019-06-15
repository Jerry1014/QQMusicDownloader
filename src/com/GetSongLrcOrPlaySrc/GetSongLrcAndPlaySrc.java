package com.GetSongLrcOrPlaySrc;

import com.Util;
import com.alibaba.fastjson.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URL;

@WebServlet(name = "GetSongLrcAndPlaySrc")
public class GetSongLrcAndPlaySrc extends HttpServlet {
    // 联网设置
    String referer_url = "https://y.qq.com/portal/profile.html";
    String request_method = "GET";
    String request_vkey_url = "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json205361747&platform=yqq&cid=205361747&songmid=%s&filename=C400%s.m4a&guid=126548448";

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 编码设置
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");

        JSONObject response_json = new JSONObject();
        String song_id = request.getParameter("song_id");
        if (song_id != null) {
            response_json.put("result_song_id", "success");

            // 获得播放链接
            String best_quality_file_url = String.format(request_vkey_url, song_id, song_id);
            String connection_response = Util.request(new URL(best_quality_file_url), "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36", request_method, referer_url);
            JSONObject songinfoJson = JSONObject.parseObject(connection_response);
            String song_play_src = null;
            try {
                String vkey = songinfoJson.getJSONObject("data").getJSONArray("items").getJSONObject(0).getString("vkey");
                if (!vkey.equals("")) {
                    song_play_src = String.format("http://ws.stream.qqmusic.qq.com/C400%s.m4a?fromtag=0&guid=126548448&vkey=%s", song_id, vkey);
                    response_json.put("result_vkey", "success");
                }
            } catch (IndexOutOfBoundsException e) {
                e.printStackTrace();
                response_json.put("result_vkey", "error");
            }
            response_json.put("src", song_play_src);

            //获得歌词
            response_json.put("result_lrc", "error");
            response_json.put("lrc", "");

        } else response_json.put("result_song_id", "error");
        response.getWriter().println(response_json.toString());
    }
}
