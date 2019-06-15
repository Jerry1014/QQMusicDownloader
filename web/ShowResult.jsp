<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core_1_1" %>
<jsp:useBean id="page_num" scope="request" type="java.lang.String"/>
<jsp:useBean id="keyword" scope="request" type="java.lang.String"/>
<jsp:useBean id="list" scope="request" type="java.util.List"/>
<jsp:useBean id="selectedApi" scope="request" type="java.lang.String"/>
<jsp:useBean id="total_page_num" scope="request" type="java.lang.String"/>
<%--
  Created by IntelliJ IDEA.
  User: Jerry
  Date: 2019/4/18
  Time: 22:58
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%--version记录了最后一次对css文件作修改的时间，用于刷新浏览器的css缓存--%>
<% String version = (String)application.getAttribute("version"); %>
<html>
<head>
    <title>我把这世间的一切都放在这了</title>

    <link rel="stylesheet" type="text/css" href="assets/live2dCSS.css?version=<%=version%>"/>
    <link rel="stylesheet" type="text/css" href="css/ShowResultCSS.css?version=<%=version%>"/>
    <% String webApp_page = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/";%>
</head>
<body>
<header>
    <form id="SearchForm" action="${pageContext.request.contextPath}/S" method="post">
        <label>
            <input id="SearchKeyWord" type="search" name="key_word" value="${keyword}">
            <input id="PageNumInput" type="hidden" name="page_num" value="1">
            <input name="SelectedApi" type="hidden" value="${selectedApi}">
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

<div class="live2d_div">
    <canvas id="live2d" width="280" height="250" class="live2d"></canvas>
</div>
<script src="assets/live2d_ini.js?version=<%=version%>"></script>
<script src="assets/live2d.js?version=<%=version%>"></script>
<script type="text/javascript">initModel("./")</script>

<footer id="Footer">
    <input id="LastPageButton" class="LastNextButton" onclick="lastPage()" type="button" value="上一页">
    <span id="NowPage">${page_num} / ${total_page_num}</span>
    <input id="NextPageButton" class="LastNextButton" onclick="nextPage()" type="button" value="下一页">
</footer>

<script>
    var page_num = parseInt(${page_num});
    var total_page_num = parseInt(${total_page_num});
    if (page_num <= 1) {
        document.getElementById("LastPageButton").style.background = "#cccccc";
        document.getElementById("LastPageButton").disabled = "true";
    }
    if (page_num === total_page_num) {
        document.getElementById("NextPageButton").style.background = "#cccccc";
        document.getElementById("NextPageButton").disabled = "true";
    }
    var key_word = document.getElementById("SearchKeyWord").value;

    function lastPage() {
        document.getElementById("PageNumInput").value = page_num - 1;
        document.getElementById("SearchKeyWord").value = key_word;
        document.getElementById("SearchForm").submit();
    }

    function nextPage() {
        document.getElementById("PageNumInput").value = page_num + 1;
        document.getElementById("SearchKeyWord").value = key_word;
        document.getElementById("SearchForm").submit();
    }
</script>


<script src="js/jquery-3.4.1.min.js"></script>
<!-- 以下三个插件，我也不知道是干嘛用的。。。 -->
<script src="js/mousewheel_plugin.js"></script>
<script src="js/scrollbar_plugin.js"></script>
<script src="js/cookie_plugin.js"></script>
<script src="js/player.js?version=<%=version%>"></script>
<script type="text/javascript">PlayerInit("<%=webApp_page%>");</script>
</body>
</html>
