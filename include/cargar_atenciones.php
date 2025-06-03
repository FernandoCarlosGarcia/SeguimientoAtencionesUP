<?php
function getAtenciones(){
	$url = 'https://test.odoo.visitar.com.ar';
	$atenciones = $_POST['atenciones'];
	$numero_gestion = $_POST['numero_gestion'];

	$html = '<div class="container clearfix">
				<input type="hidden" id="sector" name="sector" value="'.$atenciones[0]['cabecera']['motivo'] .'"/>
				<p>
					<div class="chat">
							<div class="chat-history">
								<ul class="chat-ul">';
					foreach ($atenciones as $atencion) {
						$t = strtotime($atencion['create_date']);
						$titulo = ($atencion['origen'] == 'afiliado' ? 'Usted' : 'Visitar') . ' el día ' . date('d/m/Y H:i', $t - 10800);

//https://img.icons8.com/plasticine/50/000000/gender-neutral-user-group.png
//https://www.pikpng.com/pngl/m/265-2659520_this-icon-for-gender-neutral-user-is-an.png
						$mensaje = nl2br($atencion['mensaje']);
							$html .=	'<li class="clearfix">
											<div class="message-data align-'.($atencion['origen'] == 'afiliado' ? 'left' : 'right').'">
												<span class="message-data-name"><img class="avatar" src="'.($atencion['origen'] == 'afiliado' ? 'https://img.icons8.com/plasticine/50/000000/gender-neutral-user-group.png' : 'https://odoo.visitar.com.ar/logo.png').'">'.$titulo.'</span>
											</div>
											<div class="message '.($atencion['origen'] == 'afiliado' ? 'you-message' : 'me-message float-right').'">'.$mensaje;
											if (!empty($atencion['adjuntos'])) {
												foreach ($atencion['adjuntos'] as $adjunto) {
													$file = $url . $adjunto['path'];

													$html .= '<div class="align-right">
																<a style="color: black;" href="'.$file.'" target="_blank"><i class="fa fa-file-image-o" aria-hidden="true"></i> '.$adjunto['filename'].'</a>
															  </div>';
												}
											}
											if (isset($array['links']) && !empty($atencion['link_ids'])) {
												foreach ($atencion['links'] as $link) {
													$html .= '<div class="align-right">
																<a style="color: black;" href="'.$link['url'].'" target="_blank"><i class="fa fa-link" aria-hidden="true"></i> '.$link['name'].'</a>
															</div>';
												}
											}												

							$html .=		'</div>
										</li>';
								}
	$html .='					</ul>
							</div> 			
					</div>
				</p>
			</div>';

	return $html;
}

echo getAtenciones();
