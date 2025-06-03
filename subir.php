<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Origin: https://autorizaciones.visitar.com.ar");

date_default_timezone_set('America/Argentina/Buenos_Aires');

//exit();

$ruta = 'temp_adjuntos/'; //Decalaramos una variable con la ruta en donde almacenaremos los archivos
$mensage = '';//Declaramos una variable mensaje quue almacenara el resultado de las operaciones.
$images="";


foreach ($_FILES as $key){ //Iteramos el arreglo de archivos

	if($key['error'] == UPLOAD_ERR_OK ){//Si el archivo se paso correctamente Ccontinuamos 
		$unico=date("h_i_s");	//guaramos hora, minuto, y segundos.. para agregar al nombre de la imagen.
		
		$NombreOriginal = str_replace(" ","_",$key['name']);//Obtenemos el nombre original del archivo
		$NombreOriginal = quitar_acentos($NombreOriginal);
		$ext = $key['type'];
		$tamanio = $key['size'];  //image/jpeg ,
		$temporal = $key['tmp_name']; //Obtenemos la ruta Original del archivo

		
//		$f = explode(".",$NombreOriginal);
//		$nombreFinal = $f[0] ."_".$unico.".".$f[1];	// al nombre original agregamos la hora, para salvar el cache de la imagen

		$f = pathinfo($NombreOriginal)['filename']; 
		$e = pathinfo($NombreOriginal)['extension'];
		$nombreFinal = $f."_".$unico.".".$e; // Con el metodo anterior , si tenia mas de un punto perdia la extension

		$Destino = $ruta. $nombreFinal;	//Creamos una ruta de destino con la variable ruta y el nombre original del archivo	
		
		//echo $Destino.",<br>";
		
		move_uploaded_file($temporal, $Destino); //Movemos el archivo temporal a la ruta especificada		
		
		//$archivo_permitido = true;
		if ($images != "" ) {
			$images .=","; 
		}
		$images .= '{"foto":"'.$nombreFinal.'"} ';
		
	}else{
		$nombreFinal ="Error";
		echo '{"estado":"ERROR" }';
	}
 
	//if ($key['error']==''){ //Si no existio ningun error, retornamos un mensaje por cada archivo subido
	//	$mensage .= '-> Archivo <b>'.$NombreOriginal.'</b> Subido correctamente. <br>';
	//}
	//if ($key['error']!=''){ //Si existio algún error retornamos un el error por cada archivo.
	//	$mensage .= '-> No se pudo subir el archivo <b>'.$NombreOriginal.'</b> debido al siguiente Error: n'.$key['error']; 
	//}
}
echo '{"estado":"OK" , "archivo": "'.$nombreFinal.'" }';


function quitar_acentos($s) {
	//$s = mb_convert_encoding($s, 'UTF-8','');
	$s = preg_replace("/á|à|â|ã|ª/","a",$s);
	$s = preg_replace("/Á|À|Â|Ã/","A",$s);
	$s = preg_replace("/é|è|ê/","e",$s);
	$s = preg_replace("/É|È|Ê/","E",$s);
	$s = preg_replace("/í|ì|î/","i",$s);
	$s = preg_replace("/Í|Ì|Î/","I",$s);
	$s = preg_replace("/ó|ò|ô|õ|º/","o",$s);
	$s = preg_replace("/Ó|Ò|Ô|Õ/","O",$s);
	$s = preg_replace("/ú|ù|û/","u",$s);
	$s = preg_replace("/Ú|Ù|Û/","U",$s);
	$s = str_replace(" ","_",$s);
	$s = str_replace("ñ","n",$s);
	$s = str_replace("Ñ","N",$s);
	
	$s = preg_replace('/[^a-zA-Z0-9_.-]/', '', $s);
	return $s;
}

//echo $mensage;// Regresamos los mensajes generados al cliente
?>