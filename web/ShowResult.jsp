<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core_1_1" %>
<jsp:useBean id="page_num" scope="request" type="java.lang.String"/>
<jsp:useBean id="keyword" scope="request" type="java.lang.String"/>
<jsp:useBean id="list" scope="request" type="java.util.List"/>
<%--
  Created by IntelliJ IDEA.
  User: Jerry
  Date: 2019/4/18
  Time: 22:58
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>我把这世间的一切都放在这了</title>

    <%--version记录了最后一次对css文件作修改的时间，用于刷新浏览器的css缓存--%>
    <link rel="stylesheet" type="text/css" href="assets/waifu.css?version=1905201114"/>
    <link rel="stylesheet" type="text/css" href="css/ShowResultCSS.css?version=1905201114"/>
</head>
<body>
<header>
    <form id="SearchForm" action="${pageContext.request.contextPath}/S" method="post">
        <label>
            <input id="SearchKeyWord" type="search" name="key_word" value="${keyword}">
            <input id="PageNumInput" type="hidden" name="page_num" value="1">
        </label><input id="SearchInputButton" type="submit" value="搜索">
    </form>
</header>
<div>
    <c:choose>
        <c:when test="${list.size()<1}">
            <p style="padding-inline-start: 40px;">暂无结果</p>
        </c:when>
        <c:otherwise>
            <ul>
                <%@include file="ShowOfEachSong.jsp" %>
            </ul>
        </c:otherwise>
    </c:choose>
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

<footer id="Footer">
    <input id="LastPageButton" class="LastNextButton" onclick="lastPage()" type="button" value="上一页">
    <span id="NowPage">${page_num}</span>
    <input id="NextPageButton" class="LastNextButton" onclick="nextPage()" type="button" value="下一页">
</footer>
<script type="text/javascript" src="js/ShowResultJS.js"></script>
</body>
</html>
