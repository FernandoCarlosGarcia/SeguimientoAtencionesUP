<!-- <button id="btn_consultar_atenciones" onclick="consultarAtencion();">Consultar</button> -->
<nav id="atenciones_odoo" style="display: none">
	
	<div>
		<p id="atenciones"></p>
	</div>
	<div id="agregar_atencion">
		<form id="frm_afiliado" name="frm_afiliado" method="post" enctype="multipart/form-data" action="" onsubmit="return false">
			<div>
				<label for="comentario">Comentario</label>
				<textarea name="comentario" id="comentario"></textarea>
			</div>

			<label>ADJUNTAR ARCHIVOS</label>
			<p>Archivos Permitidos: <strong>.jpg</strong> / <strong>.jpeg</strong> / <strong>.gif</strong> / <strong>.png</strong> / <strong>.pdf</strong> / <strong>.doc</strong> / <strong>.docx</strong> / <strong>.xls</strong> / <strong>.xlsx</strong> / <strong>.tif</strong> / <strong>.tiff</strong></p>

			<div class="col-1">
				<label for="btnAdjuntarOdoo" class="cont_btnAdjuntarOdoo">
					<span>Click para Adjuntar Archivo..</span>
					<input name="btnAdjuntarOdoo" id="btnAdjuntarOdoo" type="file"/>
				</label>
			</div>

			<div class="clearfix"></div>
			<div class="cont_adjuntos_odoo">
				<input type="hidden" id="lista_adjuntos" name="lista_adjuntos" value="" />
			</div>
			<div class="col-1">
			<label for="email" >Email</label>
			<input type="email" name="email" id="email"  value="<?php echo $email or ''; ?>" required />
		</div>
		<div class="col-2">
			<button id="btn_enviar_autorizacion" onclick="enviarAtencion();" >Enviar</button> 
		</div>			
			
		</form>
		
	</div>
	
</nav>


<link rel="stylesheet" href="css/jquery.loadingModal.css">
<script src="js/lib/jquery.loadingModal.js"></script>