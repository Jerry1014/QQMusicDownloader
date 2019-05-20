import java.io.IOException;
import java.net.URLEncoder;
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
        if (keyword != null && keyword.length() > 0) {
            // 请求qq音乐，得到json结果
            String selected_api = request.getParameter("SelectedApi");
            GetSongInfoJson song_list_json;
            switch (selected_api) {
                case "QQMusic":
                    song_list_json = new GetSongInfoJsonByQQAPI();
                    break;
                default:
                    song_list_json = new GetSongInfoJsonByQQAPI();
                    break;
            }
            // url补全
            String keyword_utf8 = URLEncoder.encode(keyword.replaceAll(" ", "+"), "utf-8");

            // 将歌曲jsonarray转变为SongInfo List
            List song_list = song_list_json.getSongList(keyword_utf8, page_num, request.getHeader("user_agent"));

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
