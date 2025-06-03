jQuery(document).ready(function($){
	$('body').loadingModal({text: 'Buscando Atenciones...'});
  	$('atenciones').hide();
	
	var numero_gestion = $('#numero_gestion').val()
	var ben_nrodoc = $('#ben_nrodoc').val()
	var session_id = $('#session_id').val()
	
	if ( session_id == ''){
		$.ajax({
			type: 'POST',
			url: 'https://test.odoo.visitar.com.ar/autogestion/auth/v1/login',
			data: {'numero_gestion': numero_gestion, 'ben_nrodoc':ben_nrodoc}
  		})
  		.done(function(res){
			$('#session_id').html(res.session_id);
			$('body').loadingModal('destroy');
		})
	}
	
	$.ajax({
		type: 'POST',
		url: 'https://test.odoo.visitar.com.ar/autogestion/atenciones/v1/consultar/atencion/json',
		data: {'numero_gestion': numero_gestion, 'ben_nrodoc': ben_nrodoc, 'session_id': session_id}
  	})
  	.done(function(res){
		console.log(res);
		$('body').loadingModal('destroy');
  	})
  	.fail(function(){
		alert('Hubo un errror al cargar las atenciones')
		$('body').loadingModal('destroy');
  	})

});
