/* 
 * Script para las validaciones en el formulario de usos de suelos
 * 
 */
$(document).ready(function()
{
	$('#unassociated_usosuelo_ciiu_list').change(function(event) {
		if ($(this).val().length > 3) {
			alert("Solo puede seleccionar 3 Actividades Economicas");
			$(this).val(ultimo_valido);
		}else{
			ultimo_valido = $(this).val();
		}
	});
	
	$('#unassociated_usosuelo_ciiu_list').focus(function(event) {
	var i = $('#usosuelo_ciiu_list > option').length; 	
		if (i >= 3) {
			alert("Solo puede seleccionar 3 Actividades Economicas");
			$("#unassociated_usosuelo_ciiu_list").attr('disabled', 'disabled');
		}else{
			$("#unassociated_usosuelo_ciiu_list").removeAttr('disabled');
		}
	});	
	
	$('#usosuelo_ciiu_list').click(function(event) {
	var i = $('#usosuelo_ciiu_list > option').length; 	
		if (i < 3) {
			$("#unassociated_usosuelo_ciiu_list").removeAttr('disabled');
                        
		}
	});		
	
	
	

	
});