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
  </head>
  <body>
  <div class="body">
    <div class="body_pic"><img src="img/eason_body_pic.jpg" alt="假装有一张图片">
    </div>
      <form action="${pageContext.request.contextPath}/S" method="post">
        <label>
          <input type="search" name="key_word">
        </label>
        <input type="submit" value="搜索">
  </form>
  </div>
  </body>
</html>
