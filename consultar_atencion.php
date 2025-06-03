<?php
//header('Access-Control-Allow-Origin: *');
ini_set('max_execution_time', 300);		//300 seconds = 5 minutes
include("include/api_autogestion.php");
$url = 'https://test.odoo.visitar.com.ar';


date_default_timezone_set('America/Argentina/Buenos_Aires');

include("include/logtofile.php");


$accion = ( isset( $_REQUEST["accion"] ) ) ? $_REQUEST["accion"] : "" ;



$dni = ( isset( $_REQUEST["dni"] ) ) ? $_REQUEST["dni"] : die( '{"res":"ERROR(0002): se esperaba un valor"}' ) ;
$numero_gestion = ( isset( $_REQUEST["numero_gestion"] ) ) ? $_REQUEST["numero_gestion"] : die( '{"res":"ERROR(0003): se esperaba un valor"}' ) ;	


if ( $accion == "verificar") {
	if (strlen($numero_gestion) == 8 && ( $dni > 1000000 && $dni < 99999999) ? true : false ){

		$session_id = (isset($_REQUEST["session_id"])) ? $_REQUEST["session_id"] : APIOdooAuth($url,$dni);
		
		$res = array(
			"res"=>"ok",
			"dni"=> (int)$dni,
			"numero_gestion"=> $numero_gestion,
			"session_id"=> $session_id,
		);
	}else{
		$res = array(
			"res"=>"Datos invalidos."
		);
	}
	die( json_encode($res));
	exit();
		
}


	$adjuntos = array();
	
	$nombreServidor = ( isset( $_REQUEST["lista_adjuntos"] ) ) ? $_REQUEST["lista_adjuntos"] : "" ;
	$nombreServidor = explode("||", $nombreServidor);
	for( $i = 0 ; $i < count($nombreServidor) ; $i++  ){
		if($nombreServidor[$i] != "" ){
			$adjuntos[] = $ruta."/".$nombreServidor[$i];
		}
	}
	for ($j=0 ; $j < count($adjuntos) ; $j++ ){	
		if(  file_exists($adjuntos[$j]) ){	
			unlink( $adjuntos[$j] );
		}
	}

	echo "<form name='frm' action='https://www.visitar.com.ar/consulta_atenciones/' method='post'>
			<input type='hidden' name='numero_gestion' value=".json_encode($numero_gestion)."/>
			<input type='hidden' name='session_id' value=".json_encode($session_id)."/>
		  </form>
	<script>document.frm.submit();</script>";

