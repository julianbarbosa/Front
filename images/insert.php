<?php
ini_set('max_execution_time', 5000);
$conexion = mysql_connect('localhost', 'saulUser', 'saul2014');
$database = "saul";
$archivo = fopen("sf_guard_group.sql", "r");
mysql_select_db($database, $conexion);

while(!feof($archivo)) {
		$insertSQL = fgets($archivo);
		$Result = mysql_query($insertSQL, $conexion) or die(mysql_error());  
		if($Result){
		   echo $insertSQL . "<br />";
		   }
		}
fclose($archivo);
?>