<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core_1_1" %>
<%@ page import="java.util.List" %><%--
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
</head>
<body>
<header>
    <form action="${pageContext.request.contextPath}/S" method="post">
        <label>
            <input type="search" name="key_word">
        </label><input type="submit" value="搜索">
    </form>
</header>
<div>
    <c:choose>
        <c:when test="${list==null}">
            <p>暂无结果</p>
        </c:when>
        <c:otherwise>
            <ul>
                <jsp:useBean id="list" scope="request" type="java.util.List"/>
                <c:forEach items="${list}" var="a_song">
                    <li>
                        <img src="${a_song.album_pic}" alt="假装有一张专辑图片">
                        <p>${a_song.song_name}</p>
                        <c:choose>
                            <c:when test="${a_song.best_quality_file!=null}">
                                <a href="${a_song.best_quality_file}">${a_song.best_quality}</a>
                            </c:when>
                            <c:otherwise>
                                <p>人家不给下载，我也没有办法</p>
                            </c:otherwise>
                        </c:choose>
                    </li>
                </c:forEach>
            </ul>
        </c:otherwise>
    </c:choose>
</div>
</body>
</html>
