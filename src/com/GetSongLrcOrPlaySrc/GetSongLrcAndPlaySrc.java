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
    String referer_vkey_url = "https://y.qq.com/portal/profile.html";
    String request_method = "GET";
    String request_vkey_url = "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json205361747&platform=yqq&cid=205361747&songmid=%s&filename=C400%s.m4a&guid=126548448";
    String song_url = "http://ws.stream.qqmusic.qq.com/C400%s.m4a?fromtag=0&guid=126548448&vkey=%s";
    String request_lrc_url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_yqq.fcg?nobase64=1&musicid=%s&-=jsonp1&g_tk=1469231362&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0";
    String referer_lrc_url = "https://y.qq.com/n/yqq/song/%s.html";
    String ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36";

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 编码设置
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");

        JSONObject response_json = new JSONObject();
        String song_id = request.getParameter("song_id");
        String song_mid = request.getParameter("song_mid");
        if (song_id != null) {
            response_json.put("result_song_id", "success");

            // 获得播放链接
            String request_url = String.format(request_vkey_url, song_mid, song_mid);
            String my_response = Util.request(new URL(request_url), ua, request_method, referer_vkey_url);
            JSONObject responseJson = JSONObject.parseObject(my_response);
            String song_play_src = null;
            try {
                String vkey = responseJson.getJSONObject("data").getJSONArray("items").getJSONObject(0).getString("vkey");
                if (!vkey.equals("")) {
                    song_play_src = String.format(song_url, song_mid, vkey);
                    response_json.put("result_vkey", "success");
                }
            } catch (IndexOutOfBoundsException e) {
                e.printStackTrace();
                response_json.put("result_vkey", "error");
            }
            response_json.put("src", song_play_src);

            //获得歌词
            String song_lrc = null;
            try {
                request_url = String.format(request_lrc_url, song_id);
                my_response = Util.request(new URL(request_url), ua, request_method, String.format(referer_lrc_url, song_mid));
                responseJson = JSONObject.parseObject(my_response);
                song_lrc = responseJson.getString("lyric");
                response_json.put("result_lrc", "success");
            }catch (IndexOutOfBoundsException e) {
                e.printStackTrace();
                response_json.put("result_lrc", "error");
            }
            response_json.put("lrc", song_lrc);
        } else response_json.put("result_song_id", "error");
        response.getWriter().println(response_json.toString());
    }
}
