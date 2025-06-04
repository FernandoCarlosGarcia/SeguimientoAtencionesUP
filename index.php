<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atenciones UP - Visitar</title>

    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/chat.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="js\scripts.js"></script>

    <?php
    /* Template Name: Consulta Atenciones */

    $dni = $_REQUEST["dni"] ?? "";
    $email = $_REQUEST["email"] ?? "";
    $msj = "";
    /*
        
        $res = isset($_REQUEST["res"]) ? $_REQUEST["res"] : "";
        $dni = isset($_REQUEST["dni"]) ? $_REQUEST["dni"] : "";
        $email = isset($_REQUEST["email"]) ? $_REQUEST["email"] : "";
        $numero_gestion = isset($_REQUEST["numero_gestion"]) ? $_REQUEST["numero_gestion"] : "";
        $nombre = isset($_REQUEST["nombre"]) ? $_REQUEST["nombre"] : "";
        $token = isset($_REQUEST["token"]) ? $_REQUEST["token"] : "";
        $auth = isset($_REQUEST["auth"]) ? $_REQUEST["auth"] : "";
    */

    ?>

    <script type="text/javascript">

        jQuery(document).ready(function ($) {
            var dni = $('#dni').val()
            if (dni != "") {
                changeDni();
            }
        });
    </script>

</head>

<body>
    <div class="loader_gif" id="loader_gif"></div>

    <div class="container">
        <!-- Formulario de Login -->
        <div id="loginForm" class="login-form">
            <h1>Iniciar Sesión</h1>
            <div class="form-group">
                <label for="username">Usuario:</label>
                <input type="text" id="username" placeholder="Ingresa tu usuario" required>
            </div>

            <div class="form-group">
                <label for="password">Contraseña:</label>
                <input type="password" id="password" placeholder="Ingresa tu contraseña" required>
            </div>

            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="rememberMe" name="rememberMe">
                    Recordar mi sesión por 30 días
                </label>
            </div>

            <button type="button" onclick="login()">Iniciar Sesión</button>

            <div id="message"></div>
        </div>

        <!-- Dashboard después del login -->
        <div id="dashboard" class="dashboard">
            <div id="userWelcome" class="user-welcome"></div>
            <main id="atencion-al-beneficiario" role="main">
                <div class="wrapper">
                    <section>
                        <div class="pure-g main">
                            <div class="pure-u-1 pure-u-lg-2-3 content">
                                <div class="pure-u-1">
                                    <form id="frm_atenciones" name="frm_atenciones" method="post"
                                        enctype="multipart/form-data" action="">
                                        <div class="clearfix"></div>
                                        <div id="div_grupo_familiar" class="col-0 grupo_familiar"></div>
                                        <div class="clearfix"></div>
                                        <div class="col-0" style="display: none" id="div_nombre_afiliado">
                                            <label for="nombre_afiliado">Apellido y nombre</label>
                                            <input type="text" name="nombre_afiliado" id="nombre_afiliado" value=""
                                                readonly />
                                        </div>
                                        <div class="clearfix"></div>
                                        <div class="col-0">
                                            <label for="dni">DNI *</label>
                                            <input type="number" name="dni" id="dni" onchange="changeDni()"
                                                value="<?php echo $dni; ?>" required />
                                        </div>
                                        <div class="clearfix"></div>
                                        <div class="col-0">
                                            <label for="numero_gestion">Número de Gestión *</label>

                                            <input type="text" id="busqueda" placeholder="Buscar Gestión.."
                                                onkeyup="filtrarOpciones()">
                                            <select id="numero_gestion" onchange="changeNG()">
                                                <option value="">Seleccione una atención</option>
                                            </select>
                                        </div>
                                        <input type="hidden" name="token" id="token" value="<?php echo $token; ?>" />
                                        <input type="hidden" name="session_id" id="session_id" value="" />
                                    </form>
                                    <div id="str_mensaje"></div>
                                    <nav id="atenciones_odoo" style="display: none">

                                        <div>
                                            <p id="atenciones"></p>
                                        </div>
                                        <div id="agregar_atencion">
                                            <form id="frm_afiliado" name="frm_afiliado" method="post"
                                                enctype="multipart/form-data" action="" onsubmit="return false">
                                                <div>
                                                    <label for="comentario">Comentario</label>
                                                    <textarea name="comentario" id="comentario"></textarea>
                                                </div>

                                                <label>ADJUNTAR ARCHIVOS</label>
                                                <p>Archivos Permitidos: <strong>.jpg</strong> / <strong>.jpeg</strong> /
                                                    <strong>.gif</strong> /
                                                    <strong>.png</strong> / <strong>.pdf</strong> /
                                                    <strong>.doc</strong> / <strong>.docx</strong> /
                                                    <strong>.xls</strong> / <strong>.xlsx</strong> /
                                                    <strong>.tif</strong> / <strong>.tiff</strong>
                                                </p>

                                                <div class="col-1">
                                                    <label for="btnAdjuntarOdoo" class="cont_btnAdjuntarOdoo">
                                                        <span>Click para Adjuntar Archivo..</span>
                                                        <input name="btnAdjuntarOdoo" id="btnAdjuntarOdoo"
                                                            type="file" />
                                                    </label>
                                                </div>

                                                <div class="clearfix"></div>
                                                <div class="cont_adjuntos_odoo">
                                                    <input type="hidden" id="lista_adjuntos" name="lista_adjuntos"
                                                        value="" />
                                                </div>
                                                <div class="col-1">
                                                    <label for="email">Email</label>
                                                    <input type="email" name="email" id="email"
                                                        value="<?php echo $email or ''; ?>" required />
                                                </div>
                                                <div class="col-2">
                                                    <button id="btn_enviar_autorizacion"
                                                        onclick="enviarAtencion();">Enviar</button>
                                                </div>

                                            </form>

                                        </div>

                                    </nav>

                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <div>
                <button class="logout-btn" onclick="logout()">Cerrar Sesión</button>
            </div>

        </div>
    </div>

</body>

</html>