/* 
 * Captura el evento click del checkbox cuando la solicitud es No Aprobada
 */
$(document).ready(function()
{
    $('input[name="solicitud[estado]"]').click(function(){
        $(this).attr('disabled', 'disabled');
        if($('div.textarea_area').is (':hidden')){
            $('div.textarea_area').slideDown(1000,function(){
                $('input[name="solicitud[estado]"]').removeAttr('disabled');
            });
            $('div.textarea_area textarea').removeAttr('disabled');
            $('.submitEstado1').hide();
            $('.submitEstado2').show();
            $('div.error').html('');
        }
        else{
            $('.textarea_area').slideUp('slow', function(){
                $('input[name="solicitud[estado]"]').removeAttr('disabled');
            });
            $('div.textarea_area textarea').attr('disabled', 'disabled');
            $('div.textarea_area textarea').val('');
            $('.submitEstado2').hide();
            $('.submitEstado1').show();
        }
    });
});

