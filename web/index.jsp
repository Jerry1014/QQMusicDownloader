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
    <title>年轻人，你这个想法很危险</title>
    <style>
        body {
            text-align: center;
        }

        #main {
            position: relative;
            top: 10%;
            margin-left: auto;
            margin-right: auto;
        }

        #main_pic {
            transform: scale(0.7);
        }

        #searchinputform {
            position: relative;
            top: 20px;
        }

        #searchinput {
            height: 30px;
            width: 400px;
            border: 1px solid #ccc;
            border-radius: 3px; /*css3属性IE不支持*/
        }

        #searchinputbutton {
            position: relative;
            height: 30px;
            width: 80px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 3px; /*css3属性IE不支持*/
            box-shadow: 0 4px #999;
            background-color: lightskyblue;
            color: white;
        }

        #searchinputbutton:hover {
            background-color: deepskyblue;

        }

        #searchinputbutton:active {
            background-color: dodgerblue;
            box-shadow: 0 2px #666;
            transform: translateY(2px);
        }
    </style>
</head>
<body>
<div id="main">
    <div id="main_pic"><img src="img/eason_body_pic.jpg" alt="假装有一张图片">
    </div>
    <form id="searchinputform" action="${pageContext.request.contextPath}/S" method="post">
        <label for="searchinput"><input id="searchinput" type="search" name="key_word"></label>
        <input id="searchinputbutton" type="submit" value="搜索">
        <input type="hidden" name="page_num" value="1">
    </form>
</div>
</body>
</html>
