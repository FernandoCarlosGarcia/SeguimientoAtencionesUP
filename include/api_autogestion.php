<?php
function APIOdooAuth($url, $ben_nrodoc){
	$ip = $_SERVER['REMOTE_ADDR'];
	$details = json_decode(file_get_contents("http://ipinfo.io/{$ip}/json"));

	$data = array(
  		"version" => "1.0 (1)",
  		"ben_nrodoc" => $ben_nrodoc,
  		"system" => $details
		);

	$content = json_encode(array("params" => $data));

	try {
  		$response = APIOdooGET($url, '/autogestion/auth/v1/login', $content);
  		$session_id = json_decode($response, true)["result"]["session_id"];
	} catch (Exception $e) {
		echo "<script>console.log('" . $e->getMessage() . "');</script>";
		$session_id = false;
	}
	return($session_id);
}

function APIOdooGET($url, $endpoint, $data){  
 
	$opciones = array(
  		'http'=>array(
    		'method'=>"GET",
    		'header'=>"Content-Type: application/json\r\n",
	    	'content'=> $data
  		)
	);

	$contexto = stream_context_create($opciones);
	$response = file_get_contents($url.$endpoint , false, $contexto);

	return($response);

   }
?>