(function ($, root, undefined) {

	$(function () {

		'use strict';
		// DOM ready, take it away
		// Mobile Menu
		$('.mobile-menu').on('click', function () {
			if (!$(this).hasClass('open')) {
				$(this).addClass('open');
				$('header nav').slideDown('2000');
			} else {
				$(this).removeClass('open');
				$('header nav').slideUp('2000');
			}
		});

		// Open Sub Menu

		$('.menu-item-has-children a').on('click', function () {
			$(this).next('ul').toggle();
		});

		// Atencion al Beneficiario
		jQuery('.wpcf7-form textarea').closest('p').wrap("<div class='column-2'></div>");
		jQuery('.wpcf7-form .wpcf7-submit').closest('p').wrap("<div class='submit'></div>");
		jQuery('.wpcf7-form > p').wrapAll("<div class='column-1'></div>");

		// Preguntas Frecuentes
		$('.pregunta').on('click', function () {
			event.preventDefault();
			$('.pregunta').removeClass('active');
			$(this).addClass('active')
			$('.respuesta').css('display', 'none');
			$(this).next().slideDown();
		});

		// Clientes: popup
		$(".popup-open").click(function () {
			var box = $(this).next();
			$(box).show();
			$('.mask').fadeIn();
			return false;
		});
		$(".popup .close").click(function () {
			$('.mask').fadeOut();
			$(this).parent().hide();
			return false;
		});

		$('.mask').click(function (event) {
			event.preventDefault();
			$('.popup').hide();
			$('.mask').fadeOut();
		});


		//--- VALIDAMOS LOS ARCHIVOS ADJUNTOS //--------------------
		var max_upload = 14;	 //nro maximo de megas de subida
		var max_mb = max_upload * 1024 * 1024;
		var max_cant_adjuntos = 5;	// cantidad de adjuntos permitidos
		var temp_mb_subido = 0;

		var tamanio_1 = 0;
		var tamanio_2 = 0;
		var tamanio_3 = 0;
		var tamanio_4 = 0;
		var tamanio_5 = 0;
		var cant_adjuntos = 0;
		var indexAdjuntos = 0;

		$("#btnAdjuntarOdoo").change(function (event) {
			subir_archivoOdoo($(this));
		});

		var subir_archivoOdoo = async function (el) {
			var ext_permitido = ["jpg", "jpeg", "gif", "png", "pdf", "doc", "docx", "xls", "xlsx", "tif", "tiff"];
			var files = el.get(0).files; // input FILE 

			var extension = files[0].name.substr((files[0].name.lastIndexOf('.') + 1));
			if ($.inArray(extension.toLowerCase(), ext_permitido) != -1) {
				//subir=true	// formato permitido
			} else {
				alert("Algunos archivos seleccionados no tienen un Formato Permitido");
				el.val("");
				return false;
			}


			//CONTRALAMOS EL TAMAÑO DEL ARCHIVO QUE NO SUPERE EL MAXIMO
			var tamanio_file = 0;
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				tamanio_file = files[0].size;
			} else {
				// IE
				var Fs = new ActiveXObject("Scripting.FileSystemObject");
				var ruta = document.getElementById("foto1").value;
				var archivo = Fs.getFile(ruta);
				tamanio_file = archivo.size;
			}
			if (tamanio_file > max_mb) {
				alert("El archivo es muy grande. Maximo: " + max_upload + "MB por adjunto");
				el.val("");
				return false;
			}

			var v_session_id = jQuery("#session_id").val();
			var v_dni = jQuery("#dni").val();

			indexAdjuntos++;

			var nombreArchivo = files[0].name;
			var barrita = "progressBar_" + indexAdjuntos;
			var repositorio = "<div class='adjunto'><span>" + nombreArchivo + "</span><a href='#' class='del_adjunto' p=''></a><div class='progressBar' id='" + barrita + "'></div></div>";
			$(".cont_adjuntos_odoo").append(repositorio);

			var objBarrita = $("#" + barrita);

			objBarrita.css("width", "0");

			try {
				var v_res = await odooUploadFile(v_session_id, v_dni, files, objBarrita);
				objBarrita.css("width", 100 + "%");
				objBarrita.addClass("progressComplete");
				var listado =$("#lista_adjuntos").val();
				if (listado == ""){
					listado = [v_res['attachment']]
				}else{
					listado = JSON.parse(listado);
					listado.push(v_res['attachment']);
				}
				$("#lista_adjuntos").val(JSON.stringify(listado));
				objBarrita.parent().children("a").attr("p",  v_res['attachment']);

			} catch (error) {
				console.log('btnAdjuntarOdoo fail ' + error);
			}
		}

		$(".cont_adjuntos_odoo").on("click", ".del_adjunto", function (e) {
			eliminar_archivoOdoo($(this), e);
		});
		var eliminar_archivoOdoo = async function (el, e) {
			e.preventDefault();
			var attachment_id = $(this).attr("p");
			var b_tit = $(el).parent().children("span").text();
			var confirmacion = confirm("¿Desea quitar " + b_tit + " ?");
			var parent = $(el).parent();
			var v_session_id = jQuery("#session_id").val();

			if (confirmacion) {
				$(el).parent().children("span").text("quitando-" + b_tit);
				try {
					var res = await odooUnlinkFile(v_session_id, attachment_id, parent);
					console.log('Eliminado OK:' + res);
				} catch (error) {
					console.log('Eliminado Error' + error);
				}
			}
		}

		$("#btn_adjuntar").change(function (event) {
			subir_archivo($(this));

		}); //- fin del evento change
		$("#btn_adjuntar").click(function (event) {
			cant_adjuntos = $(".adjunto").length;
			if (cant_adjuntos >= max_cant_adjuntos) {
				event.preventDefault();
				alert("Alcanzo el limite de archivos subidos. Maximo " + max_cant_adjuntos + " adjuntos");
			}
		}); //- fin del evento change

		//--- FIN - VALIDAMOS LOS ARCHIVOS ADJUNTOS //--------------------------

		var subir_archivo = function (el) {

			var ext_permitido = ["jpg", "jpeg", "gif", "png", "pdf", "doc", "docx", "xls", "xlsx", "tif", "tiff"];
			var input_file = el; // input file type="file"
			var input_name = input_file.attr("id");

			var files = input_file.get(0).files; // input FILE 
			var t_nombreARchivo = "";
			var data = new FormData();
			for (var i = 0; i < files.length; i++) {
				//- verificamos si es un formato permitido
				var extension = files[i].name.substr((files[i].name.lastIndexOf('.') + 1));
				if ($.inArray(extension.toLowerCase(), ext_permitido) != -1) {
					//subir=true	// formato permitido
				} else {
					alert("Algunos archivos seleccionados no tienen un Formato Permitido");
					input_file.val("");
					return false;
				}
				//CONTRALAMOS EL TAMAÑO DEL ARCHIVO QUE NO SUPERE EL MAXIMO
				var tamanio_file = 0;
				if (window.File && window.FileReader && window.FileList && window.Blob) {
					tamanio_file = files[i].size;
				} else {
					// IE
					var Fs = new ActiveXObject("Scripting.FileSystemObject");
					var ruta = document.getElementById("foto1").value;
					var archivo = Fs.getFile(ruta);
					tamanio_file = archivo.size;
					//alert(size + " bytes");
				}
				if (tamanio_file > max_mb) {
					alert("El archivo es muy grande. Maximo: " + max_upload + "MB por adjunto");
					input_file.val("");
					return false;
				} else if ((tamanio_1 + tamanio_2 + tamanio_3 + tamanio_4 + tamanio_5 + tamanio_file) > max_mb) {
					alert("El total es muy grande. Maximo: " + max_upload + "MB");
					input_file.val("");
					return false;

				}

				tamanio_1 = tamanio_1 + tamanio_file

				// FIN CONTROLAMOS EL TAMAÑO DEL ARCHIVO 

				data.append("file" + i, files[i]); // creamos las variables input del formulario

			}

			//-- llevamos un contador de objetos creados, para que no pise algun existente
			indexAdjuntos++;

			// SABER NOMBRE DE ARCHIVO
			var valor = input_file.val();

			valor = valor.split("\\")
			var fileName = valor[valor.length - 1];
			var t_nombreARchivo = fileName
			cant_adjuntos = $(".adjunto").length;

			var barrita = "progressBar_" + indexAdjuntos;
			var repositorio = "<div class='adjunto'><span>" + t_nombreARchivo + "</span><a href='#' class='del_adjunto' p=''></a><div class='progressBar' id='" + barrita + "'></div></div>";
			$(".cont_adjuntos").append(repositorio);

			var objBarrita = $("#" + barrita);

			objBarrita.css("width", "0");

			$.ajax({
				xhr: function () {
					var xhr = new window.XMLHttpRequest();
					//Upload progress
					xhr.upload.addEventListener("progress", function (evt) {
						if (evt.lengthComputable) {
							var percentComplete1 = parseInt((evt.loaded / evt.total) * 100);
							//Do something with upload progress

							objBarrita.css("width", percentComplete1 + "%");
							// $("#text_porcentaje1").text("  "+percentComplete1+"%");

							console.log(percentComplete1);
						}
					}, false);

					return xhr;
				},

				type: 'POST',
				url: ajaxurl_2,
				data: data,
				cache: false,
				contentType: false,
				dataType: "json",
				processData: false,
				success: function (res) {
					if (res.estado == "OK") {
						objBarrita.addClass("progressComplete");
						//alert(res.archivo);
						var nombreArchivo = res.archivo;
						var listado = $("#lista_adjuntos").val();
						$("#lista_adjuntos").val(listado + nombreArchivo + "||");

						objBarrita.parent().children("a").attr("p", nombreArchivo);

						// //alert(t_nombreARchivo);
						// var nombreArchivoOriginal = t_nombreARchivo;
						// var listadoNombres = $("#lista_adjuntosNombres").val();
						// $("#lista_adjuntosNombres").val(listadoNombres + nombreArchivoOriginal+"||");


					} else {
						alert(res.desc);
						return;
					}
				}
			}); 	// FIN ajax

			//} //- fin IF SUBIR

			input_file.val("");
			if (cant_adjuntos >= max_cant_adjuntos) {
				//$("#btn_adjuntar").attr("disabled",true);
			}

		}	// FIN function subir archvios


		$(".cont_adjuntos").on("click", ".del_adjunto", function (e) {
			e.preventDefault();
			var b_name = $(this).attr("p");
			var b_tit = $(this).parent().children("span").text();
			var R = confirm("¿Desea quitar " + b_tit + " ?");
			var parent = $(this).parent();

			var listado_new = $("#lista_adjuntos").val().replace(b_name + "||", "");

			if (R) {
				$(this).parent().children("span").text("quitando-" + b_tit);
				//				alert( parent );
				$.ajax({
					url: ajaxurl,
					data: "accion=del_adjunto&adjunto=" + b_name,
					type: "post",
					dataType: "json",
					success: function (res) {
						//						alert(res.file_size)	
						if (res.res == "ok") {
							parent.hide(500, function () {
								parent.remove();
							});
							tamanio_1 = tamanio_1 - res.file_size
							$("#lista_adjuntos").val(listado_new);
						} else {
							alert(res.res);
						}
					}
				});
			}
		});
	});

})(jQuery, this);


        let users = {} ;
        let currentUser = null;

        // Funciones para recordar sesión
        function saveSession(username, rememberMe) {
            if (rememberMe) {
                // Guardar en localStorage para que persista entre sesiones del navegador
                localStorage.setItem('rememberedUser', username);
                localStorage.setItem('loginTime', Date.now().toString());
                localStorage.setItem('sessionDuration', '30'); // días
            } else {
                // Guardar solo en sessionStorage (se elimina al cerrar el navegador)
                sessionStorage.setItem('currentUser', username);
                sessionStorage.setItem('loginTime', Date.now().toString());
            }
        }

        function redirectAfterLogin(username) {
            // Configurar redirecciones por usuario
            const redirectUrls = {
                'admin': '/SeguimientoAtencionesUP/index.php',
                'usuario1': '/user/profile.php',
                'gerente': '/manager/reports.php',
                'default': '/dashboard.php'
            } ;

            // Obtener URL de redirección o usar default
            const redirectUrl = redirectUrls[username] || redirectUrls['default'];

            // Opcional: Mostrar mensaje antes de redirigir
            showMessage(`Redirigiendo a ${redirectUrl} ...`, 'success');

            // Redirigir después de un breve delay para mostrar el mensaje
            setTimeout(() => {
                window.location.href = redirectUrl;
            } , 1500);
        }

        function redirectToExternalSite(username) {
            // Para redirigir a sitios externos completos
            const externalUrls = {
                'admin': 'https://admin.miempresa.com',
                'cliente': 'https://portal.miempresa.com',
                'vendedor': 'https://crm.miempresa.com',
                'default': 'https://www.miempresa.com/dashboard'
            } ;

            const redirectUrl = externalUrls[username] || externalUrls['default'];

            showMessage(`Redirigiendo a ${redirectUrl} ...`, 'success');

            setTimeout(() => {
                window.location.replace(redirectUrl); // replace no permite volver atrás
            } , 1500);
        }

        function checkSavedSession() {
            // Verificar si hay una sesión recordada
            const rememberedUser = localStorage.getItem('rememberedUser');
            const loginTime = localStorage.getItem('loginTime');
            const sessionDuration = parseInt(localStorage.getItem('sessionDuration') || '30');

            if (rememberedUser && loginTime) {
                const currentTime = Date.now();
                const timeDiff = currentTime - parseInt(loginTime);
                const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

                if (daysDiff < sessionDuration) {
                    return rememberedUser;
                } else {
                    // Sesión expirada, limpiar datos
                    clearSavedSession();
                }
            }

            // Verificar sesión temporal
            const currentUser = sessionStorage.getItem('currentUser');
            if (currentUser) {
                return currentUser;
            }

            return null;
        }

        function clearSavedSession() {
            localStorage.removeItem('rememberedUser');
            localStorage.removeItem('loginTime');
            localStorage.removeItem('sessionDuration');
            sessionStorage.removeItem('currentUser');
            sessionStorage.removeItem('loginTime');
        }

        function autoLogin() {
            const savedUser = checkSavedSession();
            if (savedUser) {
                currentUser = savedUser;
                saveSession(savedUser, true); // Renovar sesión

                // Opción 1: Mostrar dashboard brevemente y luego redirigir
                showDashboard();
                showMessage(`Bienvenido de nuevo, ${savedUser} ! Redirigiendo...`, 'success');
                //setTimeout(() => {
                //    redirectAfterLogin(savedUser);
                //} , 2000);

                // Opción 2: Redirigir inmediatamente (descomenta para usar)
                // redirectAfterLogin(savedUser);

                return true;
            }
            return false;
        }

        function initializeSession() {
            // Verificar si hay una sesión guardada al cargar la página
            if (!autoLogin()) {
                console.log('No hay sesión guardada');
            }
        }
 
        function login() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            if (!username || !password) {
                showMessage('Por favor, completa todos los campos.', 'error');
                return;
            }
            /*
            if (Object.keys(users).length === 0) {
                showMessage('Por favor, carga primero un archivo de usuarios.', 'error');
                return;
            }
            */
            let users = {
                "admin": "admin",
            } ;
            if (users[username] && users[username] === password) {
                currentUser = username;
                saveSession(username, rememberMe);

                // Opción 1: Mostrar dashboard y luego redirigir
                showDashboard();

                // showMessage(`¡Bienvenido ${username} ! Redirigiendo...`, 'success');
                // setTimeout(() => {
                //    redirectAfterLogin(username);
                // } , 2000);

                // Opción 2: Redirigir inmediatamente (descomenta para usar)
                // redirectAfterLogin(username);

                // Opción 3: Redirigir a sitio externo (descomenta para usar)
                // redirectToExternalSite(username);
            } else {
                showMessage('Usuario o contraseña incorrectos.', 'error');
            }
        }

        function showDashboard() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('dashboard').classList.add('show');
            document.getElementById('userWelcome').textContent = `Usuario: ${currentUser}`;
        }

        function logout() {
            clearSavedSession();
            currentUser = null;
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('dashboard').classList.remove('show');
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('rememberMe').checked = false;
            showMessage('Sesión cerrada correctamente.', 'success');
        }

        function showMessage(message, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = message;
            messageDiv.className = type;
        }

        // Permitir login con Enter
        document.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && !document.getElementById('loginForm').classList.contains('hidden')) {
                login();
            }
        } );

        // Inicializar sesión al cargar la página
        document.addEventListener('DOMContentLoaded', function () {
            // Verificar si viene de un parámetro de URL para redirección
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUrl = urlParams.get('redirect');

            if (redirectUrl) {
                // Guardar URL de redirección para después del login
                sessionStorage.setItem('redirectAfterLogin', redirectUrl);
            }

            initializeSession();
        } );

        // Función alternativa para usar URL de redirección guardada
        function redirectToSavedUrl(username) {
            const savedRedirectUrl = sessionStorage.getItem('redirectAfterLogin');

            if (savedRedirectUrl) {
                sessionStorage.removeItem('redirectAfterLogin');
                showMessage(`Redirigiendo a ${savedRedirectUrl} ...`, 'success');
                setTimeout(() => {
                    window.location.href = savedRedirectUrl;
                } , 1500);
            } else {
                // Si no hay URL guardada, usar redirección por defecto
                redirectAfterLogin(username);
            }
        }


function validar() {
	var v_dni = jQuery("#dni").val();
	var v_sector = jQuery("#sector").val();
	var v_alerta = "Debe adjuntar archivos (por ej.: foto de orden medica) ";

	// Valida que se esten cargando los medicamentos en los que son de tipo receta_electronica
	if (v_sector == "receta_electronica") {
		var v_alerta = "Debe adjuntar Imagenes/Recetas ";
		var v_lista_medicamentos = jQuery("#lista_medicamentos").val();
		if (v_lista_medicamentos == "") {
			alert("Debe detallar los medicamentos ");
			return false;
		}
		var v_list = jQuery("ol#medicamentos li");

		if (v_list.length == 0) {
			alert("Debe detallar los medicamentos ");
			return false;
		}
	} else {
		/// mod validacion de adjunto //-

		var v_listaAdjuntos = jQuery("#lista_adjuntos").val();

		if (v_sector != "consultas") {
			if (v_listaAdjuntos == "") {
				alert(v_alerta);
				return false;
			}
		}
	}


	jQuery("#btn_enviar_autorizacion").attr("disabled", true);
	abrirLoader();

	//alert("enviando");
	//return false;
	/// mod validacion de adjunto //-
	console.log(ajaxurl);

	jQuery.ajax({
		url: ajaxurl,
		type: "POST",
		data: { accion: "verificar", dni: v_dni, "sector": v_sector },
		dataType: "json",
		success: function (res) {
			console.log(res);
			if (res.res == "ok") {
				var delegacion = res.delegacion;
				var nombre_delegacion = res.nombre_delegacion;
				jQuery("#delegacion").val(delegacion);
				jQuery("#nombre_delegacion").val(nombre_delegacion);

				document.frm_afiliado.submit();
				return;
			} else {
				var mensaje = "<span style='color:red;font-size: 1.5em;'>" + res.res + "</span>";
				jQuery("#str_mensaje").html(mensaje);
				jQuery("html,body").animate({ scrollTop: (jQuery("#str_mensaje").offset().top - 100) }, 500);
			}
			jQuery("#btn_enviar_autorizacion").attr("disabled", false);
			cerrarLoader()
		}

	});
	return false;
}
async function changeDni() {
	jQuery("#session_id").val("")
	jQuery("#nombre_afiliado").val("")
	jQuery("#atenciones_odoo").hide();
	jQuery("#div_nombre_afiliado").hide();
	jQuery("#div_grupo_familiar").hide();
	var v_dni = jQuery("#dni").val();
	try {
		await odooGetAuth(v_dni);
	} catch (error) {
		console.log('fail');
	}
	await consultarAtenciones();	

}

async function changeNG() {
	jQuery("#str_mensaje").html("");
	consultarAtencion();	
}



async function consultarAtencionToken() {
	var v_token = jQuery("#token").val();
	try {
		var res = await odooGetAtencion(false, false, v_token);
	} catch {
		console.log('error');
	}
	if (res.atenciones.length > 0) {
		odooMostrarAtencion(res.atenciones, res.numero_gestion, res.estado);

		jQuery("#session_id").val(res.session_id);
		jQuery("#nombre_afiliado").val(res.ben_nombre);
		jQuery("#dni").val(res.ben_nrodoc);
		jQuery("#numero_gestion").val(res.numero_gestion);
		jQuery("#email").val(res.atenciones[ res.atenciones.length - 1].cabecera.email);
		jQuery("#atenciones_odoo").show();
		jQuery("#div_nombre_afiliado").show();
	}	
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Consultar las atenciones de un afiliado en Odoo, si el afiliado no existe
 * muestra un mensaje de error y limpia el combo de atenciones.
 * Si el afiliado existe, llena el combo de atenciones con las atenciones del
 * afiliado.
 */
/*******  52506959-b551-4acb-8fa6-c66da38b0373  *******/async function consultarAtenciones() {
	jQuery("#atenciones_odoo").hide();
	abrirLoader();
	jQuery("#str_mensaje").html("");

	var v_session_id = jQuery("#session_id").val();


	if (v_session_id =="") {
		var mensaje = "<span style='color:red;font-size: 1.5em;'>Afiliado no encontrado</span>";
		jQuery("#str_mensaje").html(mensaje);
		let select = jQuery("#numero_gestion")
		select.empty(); // Limpiar opciones previas
		select.append(new Option('Seleccione una atención','Seleccione una atención'));

	} else {
		if (v_session_id == "") {
			try {
				var v_session_id = await odooGetAuth(v_dni);
				
			} catch (error) {
				console.log('fail');
			}
		}


		if (v_session_id != "") {
			try {
				var res = await odooGetAtenciones(v_session_id);
			} catch {
				console.log('error');
				var mensaje = "<span style='color:red;font-size: 1.5em;'>" + res + "</span>";
				jQuery("#str_mensaje").html(mensaje);

			}

			    // Llenar el combo con las atenciones
			    let select = jQuery("#numero_gestion");
			    select.empty(); // Limpiar opciones previas

				select.append(new Option('Seleccione una atención','Seleccione una atención'));
			    res.forEach(atencion => {
					var value = atencion.numero_gestion + ' ' + atencion.create_date;
			        select.append(new Option(value, atencion.numero_gestion ));
			    });
				jQuery("#div_nombre_afiliado").show();

		}
	}
	cerrarLoader();
}



async function consultarAtencion() {
	jQuery("#atenciones_odoo").hide();
	abrirLoader();

	var v_session_id = jQuery("#session_id").val();

	var v_dni = jQuery("#dni").val();
	var v_numero_gestion = jQuery("#numero_gestion").val();
	
	if( numero_gestion == "Seleccione una atención"){
		var mensaje = "<span style='color:red;font-size: 1.5em;'>" + v_numero_gestion + "</span>";
		jQuery("#str_mensaje").html(mensaje);

	}
	else if (v_numero_gestion == "" || v_dni == "" ) {
		var mensaje = "<span style='color:red;font-size: 1.5em;'>" + v_numero_gestion + "</span>";
		jQuery("#str_mensaje").html(mensaje);
	} else {
		if (v_session_id == "") {
			try {
				var v_session_id = await odooGetAuth(v_dni);
			} catch (error) {
				console.log('fail');
			}
		}


		if (v_session_id != "") {
			try {
				var res = await odooGetAtencion(v_session_id, v_numero_gestion);
			} catch {
				console.log('error');
			}
			if (res.atenciones.length > 0) {
				odooMostrarAtencion(res.atenciones, v_numero_gestion, res.estado);
				jQuery("#atenciones_odoo").show();
				jQuery("#div_nombre_afiliado").show();
			}
		}
	}
	cerrarLoader();
}

function validarEmail(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}



async function enviarAtencion() {

	var v_alerta = "Faltan datos";
	var v_session_id = jQuery("#session_id").val();
	var v_comentario = jQuery("#comentario").val();
	var v_email = jQuery("#email").val();
	
	if (!validarEmail(v_email)) {
		return;
    }


	if (v_comentario == "") {
		alert(v_alerta);
		return;
	} else {
		jQuery("#atenciones_odoo").hide();
		abrirLoader();
		try {
			var v_res = await odooSetAtencion();
			jQuery("#comentario").val("");
			jQuery("#lista_adjuntos").val("");
			jQuery(".cont_adjuntos_odoo .adjunto").remove();
		} catch (error) {
			console.log('fail' + error);
		}
		consultarAtencion();
	}
	cerrarLoader();
}



function odooGetAuth(v_dni) {
	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();

		const data = JSON.stringify({
			params: {
				ben_nrodoc: v_dni,
				version: 1.0
			}
		});

		xhr.addEventListener('readystatechange', function () {
			if (this.readyState === this.DONE) {
				var res = JSON.parse(this.responseText)
				if (res.result.code == 200) {
					jQuery("#session_id").val(res.result.session_id);
					jQuery("#nombre_afiliado").val(res.result.ben_nombre);

					if (res.result.grupo.gpf) {					
						let tabla = crearTabla(res.result.grupo.gpf)
						jQuery("#div_grupo_familiar").html(tabla);
						jQuery("#div_grupo_familiar").show();
					}
					resolve(res.result.session_id);
				} else {
					jQuery("statusbar").val(res.result.message);
					reject(false);
				}
			}
		});

		xhr.open('POST', 'https://odoo.visitar.com.ar/autogestion/up/auth/v1/login');
		xhr.setRequestHeader('content-type', 'application/json');
		xhr.send(data);
	});
}

function odooSetAtencion() {
	//Subir archivos -> OK
	//mismo sector que el inicial ->OK
	//registrar atencion en el mismo thread -> OK
	//refrescar consulta ->OK 
	return new Promise(function (resolve, reject) {
		var v_session_id = jQuery("#session_id").val();
		var v_numero_gestion = jQuery("#numero_gestion").val();

		const email = jQuery("#email").val();
		const nombre_afiliado = jQuery("#nombre_afiliado").val();
		const dni = jQuery("#dni").val();
		const sector = jQuery("#sector").val();
		const comentario = jQuery("#comentario").val();

		var attachments = jQuery("#lista_adjuntos").val();
		var attachment_ids = (attachments == "") ? [] : JSON.parse(attachments);
	
		const data = JSON.stringify({
			params: {
				session_id: v_session_id,
				values: {
					numero_gestion: v_numero_gestion,
					canal: 'WEB',
					nombre_afiliado: nombre_afiliado,
					affiliate_vat: dni,
					sector: sector,
					attachments: attachment_ids,
					comentario: comentario,
					affiliate_email: email,
					mail_mail: email,
					affiliate_phone: 'S/D',
				}
			}
		});

		const xhr = new XMLHttpRequest();

		xhr.addEventListener('readystatechange', function () {
			if (this.readyState === this.DONE) {
				var status = xhr.status;
				if (status == 200) {
					var res = JSON.parse(this.responseText)
					resolve(res.result);
				} else {
					reject(false);
				}
			}
		});

		xhr.open('POST', 'https://odoo.visitar.com.ar/autogestion/up/atenciones/v1/atencion/create');
		xhr.setRequestHeader('content-type', 'application/json');
		xhr.send(data);
	});
}


function odooGetAtenciones(v_session_id) {
	return new Promise(function (resolve, reject) {
		console.log("GetAtenciones")
		const data = JSON.stringify({
			params: {
				session_id: v_session_id
			}
		});
		const xhr = new XMLHttpRequest();

		xhr.addEventListener('readystatechange', function () {
			if (this.readyState === this.DONE) {
				var status = xhr.status;
				if (status == 200) {
					var res = JSON.parse(this.responseText)
					resolve(res.result);
				} else {
					console.log(xhr.statusText)
					reject(false);
				}
			}
		});

		xhr.open('POST', 'https://odoo.visitar.com.ar/autogestion/up/atenciones/v1/atenciones/consultar');
		xhr.setRequestHeader('content-type', 'application/json');
		xhr.send(data);
	});
}

function odooGetAtencion(v_session_id, v_numero_gestion, token=false) {
	return new Promise(function (resolve, reject) {
		console.log("GetAtencion")
		const data = JSON.stringify({
			params: {
				session_id: v_session_id,
				numero_gestion: v_numero_gestion,
				token: token
			}
		});
		const xhr = new XMLHttpRequest();

		xhr.addEventListener('readystatechange', function () {
			if (this.readyState === this.DONE) {
				var status = xhr.status;
				if (status == 200) {
					var res = JSON.parse(this.responseText)
					resolve(res.result);
				} else {
					console.log(xhr.statusText)
					reject(false);
				}
			}
		});

		xhr.open('POST', 'https://odoo.visitar.com.ar/autogestion/up/atenciones/v1/atencion/consultar');
		xhr.setRequestHeader('content-type', 'application/json');
		xhr.send(data);
	});
}

function odooMostrarAtencion(res, v_numero_gestion, estado) {
	jQuery.ajax({
		type: 'POST',
		url: 'include/cargar_atenciones.php',
		data: { 'atenciones': res, 'numero_gestion': v_numero_gestion }
	})
		.done(function (atenciones) {
			jQuery('#atenciones').html(atenciones)
			jQuery('#atenciones').show();
			console.log(estado);
			/* permite responder en cerrado, par la version v4 va a tener tambien una nueva propioedad de no permitir mensajes que reemplaza a esta*/
			
			if (estado === 'Cerrado') {
				jQuery('#agregar_atencion').hide();				
				jQuery('#str_mensaje').html('<h2>ESTE CASO SE ENCUENTRA CONCLUIDO, SI TIENE NUEVAS CONSULTAS DEBE GENERAR UN NUEVO REQUERIMIENTO</h2>');
			}else{
				jQuery('#agregar_atencion').show();				
			}
			

		})
		.fail(function () {
			alert('Hubo un errror la atencion')
		})

}

function odooUnlinkFile(v_session_id, attachment_id, parent) {
	return new Promise(function (resolve, reject) {
		console.log("Unlinking file...");

		const formData = JSON.stringify({
			params: {
				session: v_session_id,
				attachment_id: attachment_id
			}
		});

		const API_ENDPOINT = "https://odoo.visitar.com.ar/autogestion/up/atenciones/v1/adjuntos/unlink";
		const request = new XMLHttpRequest();

		request.open("POST", API_ENDPOINT, true);

		request.onreadystatechange = () => {
			if (request.readyState === 4 && request.status === 200) {
				parent.hide(500, function () {
					parent.remove();
					resolve(request.responseText);
				});
			}
		};
		request.setRequestHeader('content-type', 'application/json');
		request.send(formData);


	});
}

function odooUploadFile(v_session_id, v_dni, attachment, objBarrita) {
	return new Promise(function (resolve, reject) {
		const file = attachment[0];

		console.log("Uploading file...");
		const API_ENDPOINT = "https://odoo.visitar.com.ar/autogestion/up/atenciones/v1/adjuntos/upload";
		const request = new XMLHttpRequest();
		const formData = new FormData();

		request.open("POST", API_ENDPOINT, true);

		request.upload.addEventListener("progress", function (evt) {
			if (evt.lengthComputable) {
				var percentComplete1 = parseInt((evt.loaded / evt.total) * 100);
				objBarrita.css("width", percentComplete1 + "%");
			}
		}, false);

		request.onreadystatechange = () => {
			if (request.readyState === 4 && request.status === 200) {
				resolve(JSON.parse(request.responseText));
			}
		};
		formData.append("attachment", file);
		formData.append("session", v_session_id);
		formData.append("ben_nrodoc", v_dni);

		request.send(formData);

	});
}

function abrirLoader() {
	jQuery("#capa_negra").show();
	jQuery("#loader_gif").show();
}
function cerrarLoader() {
	jQuery("#capa_negra").hide();
	jQuery("#loader_gif").hide();
	//jQuery('body').css("position","");
}

function crearTabla(datos) {

	const mapeoTitulos = {
    	ben_nombre: "Afiliado",
    	estado: "Estado de Cobertura",
    	fechanac: "Fecha de Nacimiento",
    	ben_nrodoc: "Número de Documento"
	};


    // Crear la tabla y elementos dentro
    let tabla = document.createElement("table");
	tabla.classList.add("tabla_gpf"); // Agregar clase a la tabla

    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    // Crear encabezado
    let encabezado = document.createElement("tr");
    Object.keys(datos[0]).forEach(key => {
        let th = document.createElement("th");
        th.textContent =  mapeoTitulos[key];
        encabezado.appendChild(th);
    });
    thead.appendChild(encabezado);

    // Crear filas con datos
    datos.forEach(item => {
        let fila = document.createElement("tr");
        Object.values(item).forEach(valor => {
            let td = document.createElement("td");
            td.textContent = valor;
            fila.appendChild(td);
        });
        tbody.appendChild(fila);
    });

    // Agregar elementos a la tabla
    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    tabla.setAttribute("border", "1");

	return tabla
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("table tbody tr").forEach(row => {
        row.addEventListener("click", () => {
            let documento = row.querySelector("td:nth-child(4)").textContent; // Get the value from the 4th column
            let nuevaUrl = window.location.href + "?dni=" + encodeURIComponent(documento);
            window.location.href = nuevaUrl; // Redirect to the new URL
        });
    });
});


function filtrarOpciones() {
    let input = document.getElementById("busqueda").value.toLowerCase();
    let select = document.getElementById("numero_gestion");
    let opciones = select.getElementsByTagName("option");

    for (let i = 0; i < opciones.length; i++) {
        let texto = opciones[i].text.toLowerCase();
        opciones[i].style.display = texto.includes(input) ? "" : "none";
    }
}
