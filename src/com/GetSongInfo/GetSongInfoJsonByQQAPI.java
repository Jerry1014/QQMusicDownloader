package com.GetSongInfo;

import com.SongInfo;
import com.Util;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class GetSongInfoJsonByQQAPI extends GetSongInfo {
    // 歌曲信息请求设置
    private String each_page_song_num = "10";

    private String request_url = "https://c.y.qq.com/soso/fcgi-bin/client_search_cp?aggr=1&cr=1&flag_qc=0&p=%s&n=%s&w=%s";
    private String recommend_request_url = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8%C2%ACice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=35&_=1520777874472";
    private String referer_url = "https://y.qq.com/portal/profile.html";
    private String request_method = "GET";

    private String request_vkey_url = "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json205361747&platform=yqq&cid=205361747&songmid=%s&filename=C400%s.m4a&guid=126548448";

    // 25 巅峰榜·中国新歌声 26 巅峰榜·热歌一周 27 巅峰榜·热歌30天 28 巅峰榜·网络歌曲 29 巅峰榜·影视金曲 30 巅峰榜·梦想的声音 32 巅峰榜·音乐人 33 全军出击·巅峰榜·歌手2018 34 巅峰榜·人气
    // 35 QQ音乐巅峰分享榜 36 巅峰榜·K歌金曲
    public List getSongList(String keyword, String page_num, String ua, boolean if_recommend) throws IOException {
        String all_url;
        // 推荐暂时没有找到更好的，先写死
        if (if_recommend) all_url = recommend_request_url;
        else all_url = String.format(this.request_url, page_num, this.each_page_song_num, keyword);
        String connection_response = Util.request(new URL(all_url), ua, request_method, referer_url);

        JSONObject song_list_with_info = JSONObject.parseObject(connection_response.replaceAll
                ("^callback\\(", "").replaceAll("\\)$", ""));
        if (if_recommend)
            this.total_page_num = "1";
        else {
            song_list_with_info = song_list_with_info.getJSONObject("data").getJSONObject("song");
            this.total_page_num = String.valueOf((int) Math.ceil(song_list_with_info.getInteger("totalnum") / Float.parseFloat(each_page_song_num)));
        }
        JSONArray song_json_list;
        if (if_recommend) song_json_list = song_list_with_info.getJSONArray("songlist");
        else song_json_list = song_list_with_info.getJSONArray("list");

        return getList(song_json_list, if_recommend);
    }

    private static List getList(JSONArray song_json_list, boolean if_recommend) throws IOException {
        List<SongInfoByQQAPI> song_list = new ArrayList<>();
        for (int time = 0; time < song_json_list.size(); time++) {
            if (if_recommend)
                song_list.add(new SongInfoByQQAPI((JSONObject) song_json_list.getJSONObject(time).getJSONObject("data")));
            else song_list.add(new SongInfoByQQAPI((JSONObject) song_json_list.getJSONObject(time)));
        }
        return song_list;
    }


    JSONObject getVkey(String song_id) throws IOException {
        String best_quality_file_url = String.format(this.request_vkey_url, song_id, song_id);
        String connection_response = Util.request(new URL(best_quality_file_url), "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36", request_method, referer_url);

        return JSONObject.parseObject(connection_response);
    }

    public String getTotal_page_num() {
        return total_page_num;
    }
}

class SongInfoByQQAPI extends SongInfo {
    SongInfoByQQAPI(JSONObject song_info) throws IOException {
        this.album_name = song_info.getString("albumname");
        this.song_name = song_info.getString("songname");
        Integer albumid = song_info.getInteger("albumid");
        this.album_pic = String.format("http://imgcache.qq.com/music/photo/album_300/%s/300_albumpic_%s_0.jpg", String.valueOf(albumid % 100), String.valueOf(albumid));

        if (song_info.getInteger("sizeflac") != 0) {
            this.quality = "flac";
        } else if (song_info.getInteger("sizeape") != 0) {
            this.quality = "ape";
        } else if (song_info.getInteger("size320") != 0) {
            this.quality = "320";
        } else if (song_info.getInteger("size128") != 0) {
            this.quality = "128";
        } else this.quality = "无法获取";

        JSONArray singer_json_list = song_info.getJSONArray("singer");
        StringBuilder tem_singer_name_list = new StringBuilder();
        tem_singer_name_list.append(((JSONObject) singer_json_list.getJSONObject(0)).getString("name"));
        for (int time = 1; time < singer_json_list.size(); time++) {
            tem_singer_name_list.append(' ');
            tem_singer_name_list.append(((JSONObject) singer_json_list.getJSONObject(time)).getString("name"));
        }
        this.singer = tem_singer_name_list.toString();

        this.song_mid = song_info.getString("songmid");
        this.song_id = song_info.getString("songid");
        //以下部分用于获取播放vkey，已被我单独拎出来做servlet了，且SongInfo中的Vkey也被删除
//        GetSongInfoJsonByQQAPI songinfo = new GetSongInfoJsonByQQAPI();
//        JSONObject songinfoJson = songinfo.getVkey(song_id);
//        try {
//            String vkey = songinfoJson.getJSONObject("data").getJSONArray("items").getJSONObject(0).getString("vkey");
//            if (!vkey.equals("")) {
//                this.song_url = String.format("http://ws.stream.qqmusic.qq.com/C400%s.m4a?fromtag=0&guid=126548448&vkey=%s", song_id, vkey);
//            }
//        } catch (IndexOutOfBoundsException e) {
//            e.printStackTrace();
//        }
    }
}
