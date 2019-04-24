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
    <style>
        #SearchForm {
            position: relative;
            left: 20px;
            margin: 0 auto
        }

        #SearchKeyWord {
            height: 30px;
            width: 400px;
            border: 1px solid #ccc;
            border-radius: 3px; /*css3属性IE不支持*/
        }

        #SearchInputButton {
            position: relative;
            top: 1px;
            height: 30px;
            width: 50px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 3px; /*css3属性IE不支持*/
        }

        #LastPageButton {
            display: inline-block;
            width: 100px; /* 宽度 */
            height: 40px; /* 高度 */
            border-width: 0; /* 边框宽度 */
            border-radius: 3px; /* 边框半径 */
            background: #cccccc; /* 背景颜色 */
            outline: none; /* 不显示轮廓线 */
            color: white; /* 字体颜色 */
            font-size: 17px; /* 字体大小 */
        }

        #NowPage {
            display: inline-block;
            width: 80px; /* 宽度 */
            height: 40px; /* 高度 */
            color: black; /* 字体颜色 */
            font-size: 17px; /* 字体大小 */
            text-align: center
        }

        #NextPageButton {
            display: inline-block;
            width: 100px; /* 宽度 */
            height: 40px; /* 高度 */
            border-width: 0; /* 边框宽度 */
            border-radius: 3px; /* 边框半径 */
            background: #cccccc; /* 背景颜色 */
            outline: none; /* 不显示轮廓线 */
            color: white; /* 字体颜色 */
            font-size: 17px; /* 字体大小 */
        }
    </style>
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
        <c:when test="${list==null}">
            <p>暂无结果</p>
        </c:when>
        <c:otherwise>
            <ul>
                <%@include file="ShowASongInfoFromBZQLL.jsp" %>
            </ul>
        </c:otherwise>
    </c:choose>
</div>
<footer style="padding-inline-start: 50px;">
    <input id="LastPageButton" onclick="lastPage()" type="button" value="上一页">
    <span id="NowPage">${page_num}</span>
    <input id="NextPageButton" onclick="nextPage()" type="button" value="下一页">
</footer>
<script>
    var page_num = parseInt(${page_num});
    if (page_num > 1)
        document.getElementById("LastPageButton").style.background = "#1E90FF";
    document.getElementById("NextPageButton").style.background = "#1E90FF";
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
</body>
</html>
