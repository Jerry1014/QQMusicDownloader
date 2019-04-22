import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Search extends javax.servlet.http.HttpServlet {
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        doGet(request, response);
    }

    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        // 编码设置
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");

        String keyword = request.getParameter("key_word");
        String page_num = request.getParameter("page_num");
        if (keyword.length() > 0) {
            // 请求qq音乐，得到json结果
            GetSongInfoJson song_list_json = new GetSongInfoJson();
            JSONArray song_json_list = song_list_json.getSongList(keyword, page_num, request.getHeader("user_agent"));

            // 将歌曲jsonarray转变为SongInfo List
            List<SongInfo> song_list = new ArrayList<>();
            for (int time = 0; time < song_json_list.size(); time++) {
                JSONObject tem_song_info = (JSONObject) song_json_list.getJSONObject(time);
                if (tem_song_info.getString("songmid").length() > 0) song_list.add(new SongInfo(tem_song_info));
            }

            request.setAttribute("keyword", keyword);
            request.setAttribute("list", song_list);
            request.setAttribute("page_num", page_num);
            request.getRequestDispatcher("/ShowResult.jsp").forward(request, response);
        } else {
            // keyword为空的处理
            response.sendRedirect("./");
        }
    }
}
