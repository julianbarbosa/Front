$(document).ready(function ()
{
    // Autocompletar de busqueda por radicado
    $('#radicado_notificacion').select2({
        minimumInputLength: 3,
        allowClear: true,
        ajax: {
            url: $('.radicado_prefix').attr('url'),
            param: "",
            dataType: 'json',
            data: function (term) {
                return {
                    q: term
                };
            },
            results: function (data) {
                return {results: data};
            }
        }
    });

    // Configuración del validate del formulario form_notificacion
    $("#form_notificacion").validate({
        rules: {
            'radicado_notificacion': {
                required: true
            },
            'dapm': {
                required: true
            },
            'fechanotificacion': {
                required: true
            },
            'documento[archivonotificacion]': {
                extension: 'jpg|pdf',
                filesize: 2097152,
                required: true
            },
        },
        submitHandler: function () {
            $('.overlap_espera').fadeIn(500, 'linear');
            $('.overlap_espera_1').fadeIn(500, 'linear');
            $(this).find('input[type="submit"]').attr('disabled', true);
            $(this).find('input[type="button"]').attr('disabled', true);
            $(this).find('input[type="submit"]').val('Enviando...');
            $(this).find('input[type="button"]').val('Enviando...');
            form.submit();
        }
    });
    
    // Valida por radicado si la solicitud tiene una notificación asociada
    $('#radicado_notificacion').on("select2-selecting", function (e) {
        $.ajax({
            url: '../../estratificacion/VerificarNotificacionExistente',
            dataType: 'json',
            data: {
                radicadonotificacion: e.val
            },
            success: function (data) {
                if (data)
                {
                    bootbox.alert('<div class="note note-danger">El radicado ya tiene una notificación asociada en Orfeo</div>');
                    $('#radicado_notificacion').select2('data', null);
                }
            }
        })
    });
});