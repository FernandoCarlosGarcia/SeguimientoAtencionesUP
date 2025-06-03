<?php
/* Template Name: Consulta Atenciones */
$res = isset($_REQUEST["res"]) ? $_REQUEST["res"] : "";
$msj = "";
$dni = (isset($_REQUEST["dni"])) ? $_REQUEST["dni"] : "";
$email = (isset($_REQUEST["email"])) ? $_REQUEST["email"] : "";
$numero_gestion = (isset($_REQUEST["numero_gestion"])) ? $_REQUEST["numero_gestion"] : "";
$nombre = (isset($_REQUEST["nombre"])) ? $_REQUEST["nombre"] : "";
$token = (isset($_REQUEST["token"])) ? $_REQUEST["token"] : "";
$auth = (isset($_REQUEST["auth"])) ? $_REQUEST["auth"] : "";
?>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script type="text/javascript">
	const ajaxurl = window.location.origin + "consultar_atencion.php";
	const ajaxurl_2 = window.location.origin + "subir.php";

	jQuery(document).ready(function ($) {
		var token = $('#token').val()
		if (token != "") {
			consultarAtencionToken();
		} else {
			var numero_gestion = $('#numero_gestion').val()
			var ben_nrodoc = $('#ben_nrodoc').val()
			if (numero_gestion != '' && ben_nrodoc != '') {
				consultarAtencion();
			}
		}


	});

	<?php if ($res == "envio_ok") { ?>

		function abrirMensaje() {
			jQuery("#capa_negra").show();
			jQuery("#mensaje_pop").show();
			jQuery("#mensaje_pop").addClass("animated zoomIn");
		}

		function cerrarMensaje() {
			jQuery("#mensaje_pop").addClass("animated zoomOut");
			jQuery("#mensaje_pop").one("webkitAnimationEnd animationend oAnimationEnd mozAnimationEnd transitionend",
				function (event) {
					jQuery("#capa_negra").hide();
					jQuery("#mensaje_pop").hide();
				}
			);
		}
		jQuery(function () {
			abrirMensaje();
			jQuery(".btn_cerrarMensaje").on("click", function (e) {
				e.preventDefault();
				cerrarMensaje();
			});
		})
	<?php } ?>
</script>


<div class="capa_negra" id="capa_negra"></div>
<div class="loader_gif" id="loader_gif"></div>

<?php if ($res == "envio_ok") { ?>
	<div id="mensaje_pop" class="mensaje_pop border_5 sombra50">
		<h2>SU MENSAJE HA SIDO ENVIADO CON &Eacute;XITO</h2>
		<span>
			<br>
			<a href="#" class="btn_cerrarMensaje border_5">Cerrar</a>
		</span>
	</div>
<?php } ?>


	<?php if (isset($auth)) { ?>

<main id="atencion-al-beneficiario" role="main">
	<link rel="stylesheet" href="css/custom.css">
	<link rel="stylesheet" href="css/chat.css">
	<script src="js\scripts.js"></script>
	
<!--
	<div class="pure-g">

		<div class="pure-u-1 titulo-full-width">
			<div class="wrapper">

			</div>
		</div>
	</div>
-->
	<div class="wrapper">
		<section>
			<div class="pure-g main">
				<div class="pure-u-1 pure-u-lg-2-3 content">
					<div class="pure-u-1">
						<form id="frm_atenciones" name="frm_atenciones" method="post" enctype="multipart/form-data"
							action="">
							<div id="div_grupo_familiar" class="col-1 grupo_familiar"></div>
							<div class="clearfix"></div>
							<div class="col-1" style="display: none" id="div_nombre_afiliado">
								<label for="nombre_afiliado">Apellido y nombre</label>
								<input type="text" name="nombre_afiliado" id="nombre_afiliado" value="" readonly />
							</div>
							<div class="clearfix"></div>
							<div class="col-1">
								<label for="dni">DNI *</label>
								<input type="number" name="dni" id="dni" onchange="changeDni()"
									value="<?php echo $dni; ?>" required />
							</div>
							<div class="clearfix"></div>
							<div class="col-1">
								<label for="numero_gestion">Número de Gestión *</label>
								<!--										
								<input type="text" name="numero_gestion" id="numero_gestion" value="<?php echo $numero_gestion; ?>" required /> -->
								<select id="numero_gestion" onchange="changeNG()">
									<option value="">Seleccione una atención</option>
								</select>

							</div>

							<input type="hidden" name="token" id="token" value="<?php echo $token; ?>" />
							<input type="hidden" name="session_id" id="session_id" value="" />
						</form>
						<div id="str_mensaje"></div>
						<?php include("atenciones_odoo_v1.php"); ?>
					</div>
				</div>
			</div>
		</section>
	</div>
</main>
<?php } ?>