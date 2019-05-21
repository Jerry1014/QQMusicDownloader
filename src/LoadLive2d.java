import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@WebServlet(name = "LoadLive2d")
public class LoadLive2d extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String model_name = request.getParameter("model_name");
        String texture_id = request.getParameter("texture_id");
        if (model_name != null && texture_id != null) {
//            String model_path = this.getServletContext().getRealPath("") + "assets/model/" + model_name + '/' + texture_id + '/';
            String model_path = "assets/model/" + model_name + '/' + texture_id + '/';
            String model_json_str;
            try {
                File model_json_file = new File(this.getServletContext().getRealPath("")+model_path + "index.json");
                BufferedReader br = new BufferedReader(new FileReader(model_json_file));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line);
                }
                br.close();
                model_json_str = sb.toString();

                JSONObject model_json = JSONObject.parseObject(model_json_str);
                String new_textures_str = model_json.getString("textures");
                new_textures_str = new_textures_str.replaceAll("textures", model_path + "textures");
                model_json.put("textures",JSONArray.parseArray(new_textures_str));

                model_json.put("model", model_path + model_json.getString("model"));

                if (model_json.getString("physics") != null) {
                    model_json.put("physics", model_path + model_json.getString("physics"));
                }

                if (model_json.getString("pose") != null) {
                    model_json.put("pose", model_path + model_json.getString("pose"));
                }

                String new_motions_str = model_json.getString("motions");
                if (new_motions_str != null) {
                    new_motions_str = new_motions_str.replaceAll("motions", model_path + "motions");
                    new_motions_str = new_motions_str.replaceAll("sounds", model_path + "sounds");
                    model_json.put("motions", JSONObject.parseObject(new_motions_str));
                }

                String new_expressions_str = model_json.getString("expressions");
                if (new_expressions_str != null) {
                    new_expressions_str = new_expressions_str.replaceAll("expressions", model_path + "expressions");
                    model_json.put("expressions", JSONArray.parseArray(new_expressions_str));
                }

                response.getWriter().println(model_json.toString());
            } catch (Exception e) {
                System.out.println(e.toString());
            }
        }
    }
}
