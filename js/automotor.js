/* 
 * Script para manejar los eventos necesarios en el Formulario para la solicitud del permiso para automotor.
 * 
 */
$(document).ready(function()
{
    $('#lbldimension').parent().parent().parent().hide();
    $('input[name="solicitud[Automotor][dimension]"]').parent().hide();
    $('select[name="solicitud[Automotor][idtipovehiculo]"]').change(function(){
        
        if($(this).val() == "5"){
            
            $('input[name="solicitud[Automotor][dimension]"]').attr('readonly', false);
            
            $('input[name="solicitud[Automotor][dimension]"]').parent().show();
            $('#lbldimension').parent().parent().parent().show();
        }
        else{
             
            $('input[name="solicitud[Automotor][dimension]"]').attr('readonly', true);
            
            $('input[name="solicitud[Automotor][dimension]"]').parent().hide();
            $('#lbldimension').parent().parent().parent().hide();
            
        }
    });
});