<script>
var page_num = parseInt(${page_num});
if (page_num <= 1){
    document.getElementById("LastPageButton").style.background = "#cccccc";
    document.getElementById("LastPageButton").disabled = "true";
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
