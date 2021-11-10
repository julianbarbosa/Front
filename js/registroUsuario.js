/* 
 * Script para manejar los eventos necesarios en el Formulario del registro de usuario con certificado vigente.
 */
$(document).ready(function()
{
  //$('select[name="sfApplyApply[idtipodocidentificacion]"]').click(function(){
  $('#lblidtipodocidentificacion').click(function(){
        //$(this).attr('disabled', 'disabled');
        //$('input[name="sfApplyApply[razonsocial]"]').val('');
        $('#lblrazonsocial').val('');
        
        if($(this).val() == '2'){
            
           // $('input[name="sfApplyApply[username]"]').attr('placeholder','NIT');
            $('#lblusername').html('NIT (Sin Dígito de Verificación) ');
            //$('input[name="sfApplyApply[first_name]"]').attr('placeholder','Nombre Representante Legal');
            $('#lblfirst_name').html('Nombre Representante Legal');
            //$('input[name="sfApplyApply[last_name]"]').attr('placeholder','Apellido Representante Legal');
            $('#lbllast_name').html('Apellido Representante Legal');
            $('input[name="sfApplyApply[razonsocial]"]').attr('readonly', false);
            $('input[name="sfApplyApply[numidentificacion]"]').attr('readonly', false);
            $('input[name="sfApplyApply[numidentificacion]"]').parent().show();
           // $('input[name="sfApplyApply[numidentificacion]"]').attr('placeholder','Cedula Representante Legal');
            $('#lblnumidentificacion').parent().parent().parent().show();
            $('#lblnumidentificacion').html('Cédula Representante Legal');
            $('input[name="sfApplyApply[first_name]"]').unbind("keyup onblur click change");
            $('input[name="sfApplyApply[last_name]"]').unbind("keyup onblur click change");
            $('input[name="sfApplyApply[username]"]').unbind("keyup onblur click change");
            //$('input[name="sfApplyApply[numidentificacion]"]').unbind("keyup onblur click change");
        }
        else if($(this).val() == '1'){
           // $('input[name="sfApplyApply[username]"]').attr('placeholder','Cedula de Ciudadania');
            $('#lblusername').html('Cédula de Ciudadania');
            //$('input[name="sfApplyApply[first_name]"]').attr('placeholder','Nombre');
            $('#lblfirst_name').html('Nombre');
            //$('input[name="sfApplyApply[last_name]"]').attr('placeholder','Apellido');
            $('#lbllast_name').html('Apellido');
            $('input[name="sfApplyApply[razonsocial]"]').attr('readonly', true);
            $('input[name="sfApplyApply[numidentificacion]"]').attr('readonly', true);
            $('input[name="sfApplyApply[numidentificacion]"]').parent().hide();
            //$('input[name="sfApplyApply[numidentificacion]"]').attr('placeholder','Cedula de Ciudadania');
            $('#lblnumidentificacion').parent().parent().parent().hide();
            $('#lblnumidentificacion').html('Cédula de Ciudadania');
            
            $('input[name="sfApplyApply[username]"]').bind("keyup onblur click change", function(){
                $('input[name="sfApplyApply[numidentificacion]"]').val($(this).val());
            });
            $('input[name="sfApplyApply[first_name]"]').bind("keyup onblur click change", function(){
                $('input[name="sfApplyApply[razonsocial]"]').val($(this).val());
            });
            $('input[name="sfApplyApply[last_name]"]').bind("keyup onblur click change", function(){
                currentVal = $('input[name="sfApplyApply[first_name]"]').val();
                $('input[name="sfApplyApply[razonsocial]"]').val(currentVal + ' ' + $(this).val());
            });
        }
    });
});

