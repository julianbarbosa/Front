<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script>
$(document).ready(function(){
    $("button").click(function(){

		
		$.ajax({
    url: 'http://172.18.15.232/saul2/app_dev.php/controlpolicivo/comparendo/12345',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    type: "GET", /* or type:"GET" or type:"PUT" */
    dataType: "json",
    data: {
    },
    success: function (result) {
        console.log(result);    
    },
    error: function () {
        console.log("error");
    }
});
		
    });
});
</script>
</head>
<body>

<button>Send an HTTP GET request to a page and get the result back</button>

</body>
</html>
