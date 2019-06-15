<%--
  Created by IntelliJ IDEA.
  User: Jerry
  Date: 2019/4/18
  Time: 19:53
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%--version记录了最后一次对css文件作修改的时间，用于刷新浏览器的css缓存--%>
<% String version = "1906160037";
    application.setAttribute("version", version);%>
<html>
<head>
    <title>来搜吧，我这里什么歌都有</title>

    <link rel="stylesheet" type="text/css" href="css/indexCSS.css?version=<%=version%>"/>
    <link rel="stylesheet" type="text/css" href="assets/live2dCSS.css?version=<%=version%>"/>

    <% String webApp_page = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/";%>
    <script>
        function show_msg() {
            var msg = "<%=request.getParameter("msg")%>";
            if (msg!=='null') alert(msg);
        }
    </script>
</head>
<body onload="show_msg()">
<div id="main">
    <div id="main_pic">
        <img src="img/music.png" alt="假装有一张图片">
    </div>
    <form id="searchinputform" action="${pageContext.request.contextPath}/S" method="post">
        <label><select name="SelectedApi" id="selectedApi">
            <option value="QQMusic">QQ音乐</option>
        </select>
        </label>

        <label for="searchinput"><input id="searchinput" type="search" name="key_word"></label>
        <input id="searchinputbutton" type="submit" value="搜索">
        <input type="hidden" name="page_num" value="1">
        <input type="hidden" id="if_recommend" name="if_recommend" value="false">
        <input type="image" id="if_recommend_img" src="img/recommend.png" alt="推荐" onclick="
        document.getElementById('if_recommend').value = 'true';">
    </form>
</div>

<div class="live2d_div">
<%--    <canvas id="live2d" width="280" height="250" class="live2d"></canvas>--%>
    <canvas id="live2d" width="308" height="275" class="live2d"></canvas>
</div>
<script src="assets/live2d_ini.js?version=<%=version%>"></script>
<script src="assets/live2d.js?version=<%=version%>"></script>
<script type="text/javascript">initModel("<%=webApp_page%>")</script>
</body>
</html>