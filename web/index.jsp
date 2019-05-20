<%--
  Created by IntelliJ IDEA.
  User: Jerry
  Date: 2019/4/18
  Time: 19:53
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>来搜吧，我这里什么歌都有</title>

    <%--version记录了最后一次对css文件作修改的时间，用于刷新浏览器的css缓存--%>
    <link rel="stylesheet" type="text/css" href="css/indexCSS.css?version=1905201912"/>
    <link rel="stylesheet" type="text/css" href="assets/waifu.css?version=1905201912"/>
</head>
<body>
<div id="main">
    <div id="main_pic">
        <img src="img/music.png" alt="假装有一张图片">
    </div>
    <form id="searchinputform" action="${pageContext.request.contextPath}/S" method="post">
        <label>
            <select name="SelectedApi">
                <option value="QQMusic">QQ音乐</option>
                <option value="Test">测试用,还没做</option>
            </select>
        </label>

        <label for="searchinput"><input id="searchinput" type="search" name="key_word"></label>
        <input id="searchinputbutton" type="submit" value="搜索">
        <input type="hidden" name="page_num" value="1">
    </form>
</div>

<div class="waifu">
    <div class="waifu-tips"></div>
    <canvas id="live2d" width="280" height="250" class="live2d"></canvas>
    <div class="waifu-tool">
        <span class="fui-home"></span>
        <span class="fui-chat"></span>
        <span class="fui-eye"></span>
        <span class="fui-user"></span>
        <span class="fui-photo"></span>
        <span class="fui-info-circle"></span>
        <span class="fui-cross"></span>
    </div>
</div>
<script src="assets/waifu-tips.js"></script>
<script src="assets/live2d.js"></script>
<script type="text/javascript">initModel("assets/")</script>

</body>
</html>