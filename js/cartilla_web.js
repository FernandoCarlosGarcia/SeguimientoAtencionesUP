jQuery(document).ready(function($){
	$('body').loadingModal({text: 'Buscando Especialidades...'});
  	$('#zonas').hide();
	$('#localidades').hide();
	$('#cartilla').hide();
	
	var ben_nrodoc = $('#ben_nrodoc').val()
	var agreement_id = $('#os_id').val()
	var plan_id = $('#plan_id').val()
	console.log(agreement_id);
	console.log(plan_id);
	$.ajax({
		type: 'POST',
		url: 'wp-content/themes/visitar/include/cargar_especialidades.php',
		data: {'agreement_id': agreement_id, 'plan_id':plan_id}
  	})
  	.done(function(listas_especialidades){
		$('#especialidades').html(listas_especialidades);
		$('body').loadingModal('destroy');
  	})
  	.fail(function(){
		alert('Hubo un errror al cargar las especialidades')
  	})

	$('#especialidades').on('change', function(){
		var especialidad = $('#especialidades').val()
		if ( especialidad == 'VIDEOCONSULTA'){
			var texto = 'Buscando Prestadores...';
			var url = 'wp-content/themes/visitar/include/cargar_prestadores.php';
		}else{
			var texto = 'Buscando Zonas...';
			var url = 'wp-content/themes/visitar/include/cargar_zonas.php';
		}
		
		$('body').loadingModal({text: texto });
		$('#zonas').hide();
		$('#localidades').hide();
		$('#cartilla').hide();

    
		$.ajax({
			type: 'POST',
			url: url,
			data: {'agreement_id': agreement_id, 'plan_id':plan_id,'especialidad': especialidad}
		})
		.done(function(lista){
			console.log(url);
			if ( especialidad == 'VIDEOCONSULTA'){
				$('#cartilla').html(lista)
				$('#cartilla').show();
			}else{
				$('#zonas').html(lista)
				$('#zonas').show();
			}
			
			
			$('body').loadingModal('destroy');
		})
		.fail(function(){
			alert('Hubo un errror al cargar las zonas')
		})
	})

	$('#zonas').on('change', function(){
		$('body').loadingModal({text: 'Buscando Prestadores...'});
		$('#cartilla').hide();
		$('#localidades').hide();

    	var especialidad = $('#especialidades').val()
    	var zona = $('#zonas').val()


    	$.ajax({
      		type: 'POST',
      		url: 'wp-content/themes/visitar/include/cargar_localidades.php',
		data: {'agreement_id': agreement_id, 'plan_id':plan_id,'especialidad': especialidad, 'zona': zona}
    	})

    	.done(function(listas_localidades){
      		$('#localidades').html(listas_localidades)
//			$('#cartilla').hide();
//			$('#localidades').show();
			$('body').loadingModal('destroy');
    	})


    	$.ajax({
      		type: 'POST',
      		url: 'wp-content/themes/visitar/include/cargar_prestadores.php',
			data: {'agreement_id': agreement_id, 'plan_id':plan_id, 'ben_nrodoc': ben_nrodoc, 'especialidad': especialidad, 'zona': zona, 'localidad':""}
    	})

    	.done(function(listas_prestadores){
      		$('#cartilla').html(listas_prestadores)
			$('#localidades').show();
			$('#cartilla').show();
    	})


    .fail(function(){
      alert('Hubo un errror al cargar las localidades')
    })

  })


  $('#localidades').on('change', function(){
	$('body').loadingModal({text: 'Buscando Prestadores...'});
    	var especialidad = $('#especialidades').val()
    	var zona = $('#zonas').val()
    	var localidad = $('#localidades').val()  
    	$.ajax({
      		type: 'POST',
      		url: 'wp-content/themes/visitar/include/cargar_prestadores.php',
		data: {'agreement_id': agreement_id, 'plan_id':plan_id, 'ben_nrodoc': ben_nrodoc, 'especialidad': especialidad, 'zona': zona, 'localidad':localidad}
    	})
    	.done(function(listas_prestadores){
      		$('#cartilla').html(listas_prestadores)
		$('#cartilla').show();
		$('body').loadingModal('destroy');
    	})
    	.fail(function(){
      	alert('Hubo un errror al cargar los prestadores')
    	})
  })


});