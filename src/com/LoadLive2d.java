package com;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.*;

@WebServlet(name = "com.LoadLive2d")
public class LoadLive2d extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String default_model_textures = "ShizukuTalk/shizuku-48";
        String default_model_path = "assets/model/" + default_model_textures + '/';

        String model_name = request.getParameter("model_name");
        String texture_name = request.getParameter("texture_name");
        if (model_name != null) {
            String model_json_str;
            String model_path;
            JSONObject model_json = new JSONObject();
            int status_code = 0;

            try {
                if (model_name.equals("random")) {
                    File[] model_file_list = new File(this.getServletContext().getRealPath("") + "assets/model/").listFiles();
                    model_name = model_file_list != null ? model_file_list[(int) (Math.random() * model_file_list.length)].getName() : null;

                    if (model_name != null) {
                        File[] texture_file_list = new File(this.getServletContext().getRealPath("") + "assets/model/" + model_name + '/').listFiles();
                        texture_name = texture_file_list != null ? texture_file_list[(int) (Math.random() * texture_file_list.length)].getName() : null;
                    }
                }
                if (model_name != null && texture_name != null) {
                    model_path = "assets/model/" + model_name + '/' + texture_name + '/';
                } else model_path = default_model_path;


                File model_json_file = new File(this.getServletContext().getRealPath("") + model_path + "index.json");
                if (!model_json_file.exists()) {
                    model_json_file = new File(this.getServletContext().getRealPath("") + default_model_path + "index.json");
                    status_code = 1;
                }
                BufferedReader br = new BufferedReader(new FileReader(model_json_file));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line);
                }
                br.close();
                model_json_str = sb.toString();

                model_json = JSONObject.parseObject(model_json_str);
                String new_textures_str = model_json.getString("textures");
                new_textures_str = new_textures_str.replaceAll("texture", model_path + "texture");
                model_json.put("textures", JSONArray.parseArray(new_textures_str));

                model_json.put("model", model_path + model_json.getString("model"));

                if (model_json.getString("physics") != null) {
                    model_json.put("physics", model_path + model_json.getString("physics"));
                }

                if (model_json.getString("pose") != null) {
                    model_json.put("pose", model_path + model_json.getString("pose"));
                }

                String new_motions_str = model_json.getString("motions");
                if (new_motions_str != null) {
                    new_motions_str = new_motions_str.replaceAll("motions", model_path + "motions").replaceAll("sounds", model_path + "sounds");
                    model_json.put("motions", JSONObject.parseObject(new_motions_str));
                }

                String new_expressions_str = model_json.getString("expressions");
                if (new_expressions_str != null) {
                    new_expressions_str = new_expressions_str.replaceAll("expressions", model_path + "expressions");
                    model_json.put("expressions", JSONArray.parseArray(new_expressions_str));
                }
                model_json.put("status_code", status_code);
                model_json.put("status_str", model_path);
            } catch (Exception e) {
                status_code = 2;
                model_json.put("status_code", status_code);
                model_json.put("status_str", e.toString());
            } finally { response.getWriter().println(model_json.toString());
            }
        }
    }
}
