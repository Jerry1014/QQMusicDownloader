import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

public class Search extends javax.servlet.http.HttpServlet {
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        doGet(request, response);
    }

    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");

        // 搜索设置，以后做统一处理
        String get_result_page_num = "1";
        String get_result_each_page_num = "10";
        String get_result_part_url = "https://c.y.qq.com/soso/fcgi-bin/client_search_cp?aggr=1&cr=1&flag_qc=0&p=" +
                get_result_page_num + "&n=" + get_result_each_page_num + "&w=";

        String key_word = request.getParameter("key_word");
        key_word = key_word.replaceAll(" ", "+");
        if (key_word.length() > 0) {
//            String get_result_all_url = get_result_part_url + key_word;
            String get_result_all_url = get_result_part_url + URLEncoder.encode(key_word, "utf-8");

            // 连接服务器，获的返回的结果，未来独立做一个访问类，结果在StringBuilder sb中
            URL url = new URL(get_result_all_url);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000);
            connection.setRequestProperty("User-Agent", request.getHeader("user-agent"));
            connection.setRequestProperty("Referer", "https://y.qq.com/portal/profile.html");
            connection.connect();
            // 获取输入流
            // 获取输入流
            InputStreamReader tem = new InputStreamReader(connection.getInputStream(), "UTF-8");
            BufferedReader br = new BufferedReader(tem);
            String line;
            StringBuilder sb = new StringBuilder();
            while ((line = br.readLine()) != null) {// 循环读取流
                sb.append(line);
            }
            br.close();// 关闭流
            connection.disconnect();// 断开连接

            String info = sb.toString();
            JSONObject object = JSONObject.parseObject(info.replaceAll("^callback\\(", "").replaceAll("\\)$", ""));
            JSONArray song_json_list = object.getJSONObject("data").getJSONObject("song").getJSONArray("list");

            List<SongInfo> song_list = new ArrayList<>();
            for (int time = 0; time < song_json_list.size(); time++) {
                JSONObject tem_song_info = (JSONObject) song_json_list.getJSONObject(time);
                if (tem_song_info.getString("songmid").length() > 0) song_list.add(new SongInfo(tem_song_info));
            }

            request.setAttribute("list", song_list);
            request.getRequestDispatcher("/ShowResult.jsp").forward(request, response);
        } else {
            // keyword为空的处理
            response.sendRedirect("./index.jsp");
        }
    }
}
