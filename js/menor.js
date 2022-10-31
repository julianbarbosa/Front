/* 
 * Script para manejar los eventos necesarios en el Formulario para la solicitud del permiso para la publicidad menor
 * 
 */
$(document).ready(function()
{
    $('#lblnumeropendones').parent().parent().parent().hide();
    $('input[name="solicitud[Menor][numeroPendones]"]').parent().hide();
    $('select[name="solicitud[Menor][idtipopublicidad]"]').change(function(){
        //$(this).attr('disabled', 'disabled');
        
       // $('input[name="solicitud[Menor][numeroPendones]"]').val('');
        
        if($(this).val() == "1"){
            
            //$('#lbltipopublicidad').html('Tipo de la publicidad');
  
            $('input[name="solicitud[Menor][numeroPendones]"]').attr('readonly', true);
            
            $('input[name="solicitud[Menor][numeroPendones]"]').parent().hide();
            $('#lblnumeropendones').parent().parent().parent().hide();
            //$('input[name="Menor[numeroPendones]"]').unbind("keyup onblur click change");
          /*  $('input[name="sfApplyApply[first_name]"]').unbind("keyup onblur click change");
            $('input[name="sfApplyApply[last_name]"]').unbind("keyup onblur click change");
            $('input[name="sfApplyApply[username]"]').unbind("keyup onblur click change");*/
            //$('input[name="sfApplyApply[numidentificacion]"]').unbind("keyup onblur click change");
        }
        else if($(this).val() == "2"){
           // $('input[name="sfApplyApply[username]"]').attr('placeholder','Cedula de Ciudadania');
            //$('#lbltipopublicidad').html('Tipo de la publicidad');
  
            $('input[name="solicitud[Menor][numeroPendones]"]').attr('readonly', false);
            
            $('input[name="solicitud[Menor][numeroPendones]"]').parent().show();
            $('#lblnumeropendones').parent().parent().parent().show();
            //$('input[name="Menor[numeroPendones]"]').unbind("keyup onblur click change");
            //$('input[name="sfApplyApply[numidentificacion]"]').attr('placeholder','Cedula de Ciudadania');
            
            /*$('input[name="sfApplyApply[username]"]').bind("keyup onblur click change", function(){
                $('input[name="sfApplyApply[numidentificacion]"]').val($(this).val());
            });
            $('input[name="sfApplyApply[first_name]"]').bind("keyup onblur click change", function(){
                $('input[name="sfApplyApply[razonsocial]"]').val($(this).val());
            });
            $('input[name="sfApplyApply[last_name]"]').bind("keyup onblur click change", function(){
                currentVal = $('input[name="sfApplyApply[first_name]"]').val();
                $('input[name="sfApplyApply[razonsocial]"]').val(currentVal + ' ' + $(this).val());
            });*/
        }
    });
});