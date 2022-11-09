$(document).ready(function ()
{
    $('#estrato_cum').hide();
    $('#estrato_especial_div').hide();
    $('#opcion_expansion').hide();
    $('#idcorregimiento').parent().hide();
    $('.cambiar_estrato').attr('disabled', true);

    $('#numidentificacion').change(function () {
        $(this).valid();
        var usuario = $('#numidentificacion').val();

        $.ajax({
            url: "Buscarusuariounico?q=" + usuario + " ",
            dataType: 'json',
            success: function (data) {
                $('.overlap_espera_1').hide();
                $('.overlap_espera').hide();

                $("#first_name").val(data['name']);
                $("#last_name").val(data['last_name']);
                $("#idtipodocidentificacion").val(data['tipod']);
                $("#email_address").val(data['email']);
                $("#email2").val(data['email']);
                $("#numidentificacion").val(data['num']);
                $("#telefono").val(data['telefono']);
                $("#modalUsuario").modal('show');
            }
        });
    })
    $('#numidentificacion').select2({
        minimumInputLength: 4,
        allowClear: true,
        ajax: {
            url: "BuscarUsuario",
            dataType: 'json',
            data: function (term, page) {
                $('#numidentificacion').select2('data', null);
                return {
                    q: term
                };
            },
            results: function (data) {
                $('.overlap_espera').fadeIn(500, 'linear');
                $('.overlap_espera_1').fadeIn(500, 'linear');
                if (data == '') {
                    $('#numidentificacion').select2('close');
                    borrar();
                    $("#modalUsuarioInexistente").modal('show');
                    $('.overlap_espera_1').hide();
                    $('.overlap_espera').hide();
                }
                return {results: data};
            }
        }
    });

    $('input[type="button"].asociar_radicado_respuesta').click(function () {
        var nombretiposolicitud = $('#nombretiposolicitud').val();
        bootbox.confirm("Confirma que desea asociar un radicado de respuesta para esta solicitud de " + nombretiposolicitud + " ?",
                function (result) {
                    if (result)
                    {
                        asociarRadicadoRespuesta();
                    }
                });
    });

    /** generar_solicitud_revision  para los request desde formularios, se debe tener en cuenta que los input type=submit deben ser type=button
     *  y tener el atributo forma="#id_del_formulario_contenedor"
     */
    $('input[type="button"].generar_solicitud_revision').click(function () {
        // Valida si la solicitud tiene respuesta asociada
        if ($('#numradicadohijo').val() == "")
        {
            bootbox.confirm("Confirma que desea generar una solicitud de revisión para esta solicitud de certificado de estrato?",
                    function (result) {
                        if (result)
                        {
                            generarsolicitudrevision();
                        }
                    });
        } else
        {
            bootbox.alert("La solicitud ya tiene una respuesta asociada");
        }
    });

    $('input[type="button"].cambiar_radicado').click(function () {
        bootbox.confirm("Confirma que desea cambiar el radicado de respuesta de la solicitud de revisión?",
                function (result) {
                    if (result)
                    {
                    }
                });
    });

    // Se define comportamiento de acuerdo a la selección del check box disperso
    $('input[name="disperso"]').click(function ()
    {
        if ($('#disperso').is(":checked"))
        {
            $('#nuevo-cum').editable('setValue', null).editable('option', 'data-emptytext', null).removeClass('editable-unsaved');
            $('#cumnuevo').val('');
            $('#direccion1').val('');
            $('#direccion2').val('');
            $('#sector').val('');
            $('#proyecto').val('');
            $('#opcion_expansion').hide();
            $('#estrato_cum').hide();
            $('input[name=expansion]').attr('checked', false);
            $('.generar_solicitud_revision').attr('disabled', true);

            if ($('#estrato').text() == "")
            {
                $('#idcorregimiento').parent().show();
            } else
            {
                $('input[name=disperso][value=disperso]').attr('checked', false);
                $('.generar_solicitud_revision').attr('disabled', false);
                bootbox.alert("El predio tiene un estrato asociado");
            }
        } else
        {
            $('#idcorregimiento').prop('selectedIndex', 0);
            $('#idcorregimiento').parent().hide();
        }
    });

    // Se define comportamiento de acuerdo a la selección del check box expansion
    $('input[name="expansion"]').click(function ()
    {
        if ($('#expansion').is(":checked"))
        {
            $('.generar_solicitud_revision').attr('disabled', true);
            $('#idcorregimiento').prop('selectedIndex', 0);
            $('#idcorregimiento').parent().hide();
            $('input[name=disperso]').attr('checked', false);

            bootbox.confirm("Confirma que desea asociar un estrato diferente a esta solicitud de certificado de estrato ?",
                    function (result) {
                        if (result)
                        {
                            $('#opcion_expansion').show();
                        } else
                        {
                            $('input[name=expansion]').attr('checked', false);
                        }
                    });
        } else
        {
            $('#nuevo-cum').editable('setValue', null).editable('option', 'data-emptytext', null).removeClass('editable-unsaved');
            $('#cumnuevo').val('');
            $('#direccion1').val('');
            $('#direccion2').val('');
            $('#sector').val('');
            $('#proyecto').val('');
            $('#opcion_expansion').hide();
            $('#estrato_cum').hide();
            $('.generar_solicitud_revision').attr('disabled', false);
        }
    });

    // Formulario modal para ingresar el CUM en el proceso de recalculo de estrato para predios en zona de expansión
    $('#nuevo-cum').editable({
        display: function (value) {
            if (value)
            {
                $('.overlap_espera').fadeIn(500, 'linear');
                $('.overlap_espera_1').fadeIn(500, 'linear');
            }
        },
        validate: function (value) {
            if ($.trim(value) == '')
            {
                return 'Este campo es obligatorio.';
            }
            if (value.length != 9)
            {
                return 'El código CUM debe tener 9 caracteres';
            }
        },
        success: function (newValue, value) {
            if (!newValue) {
                $.ajax({
                    url: $('#nuevo-cum').attr('url'),
                    data: {
                        cum: value
                    },
                    success: function (data) {
                        if (data.estrato)
                        {
                            $('#estrato_cum').show();
                            $('#nuevo_estrato').empty();
                            $('#nuevo_estrato').append('Estrato: <font color="red">' + data.estrato + ' - NUEVO ESTRATO</font>');
                            $('#cumnuevo').val(data.cum);
                            $('#estratonuevo').val(data.estrato);
                            $('.overlap_espera').hide();
                            $('.overlap_espera_1').hide();
                        } else
                        {
                            $('.overlap_espera').hide();
                            $('.overlap_espera_1').hide();
                            bootbox.alert("El CUM indicado no tiene un estrato asociado");
                        }
                    }
                });
            }
        }
    });

    // Formulario modal para ingresar el estrato especial para los predios que hacen parte de la metodología tipo 3 y la metodología especial
    $('#nuevo-estrato').editable({
        validate: function (value) {
            var arr = ['1', '2', '3', '4', '5', '6'];
            if ($.trim(value) == '')
            {
                return 'Este campo es obligatorio.';
            }
            if (value.length != 1)
            {
                return 'El estrato especial solo puede tener 1 caracter';
            }
            if ($.inArray(value, arr) == -1)
            {
                return 'El estrato solo puede ser 1, 2, 3, 4, 5 o 6';
            }
        },
        success: function (newValue, value) {
            if (!newValue) {
                $('#estrato_especial_div').show();
                $('#nuevo_estrato_especial').empty();
                $('#nuevo_estrato_especial').append('Estrato: <font color="red">' + value + ' - NUEVO ESTRATO</font>');
                $('#estratonuevoespecial').val(value);
                $('.cambiar_estrato').attr('disabled', false);
            }
        }
    });

    // Personalización de mensajes del validate
    jQuery.extend(jQuery.validator.messages, {
        required: "Este campo es obligatorio.",
        extension: "El documento debe estar en formato pdf o jpg",
//        maxlength: jQuery.validator.format("Por favor, no escribas más de {0} caracteres."),
//        minlength: jQuery.validator.format("Por favor, no escribas menos de {0} caracteres."),
//        remote: "Por favor, rellena este campo.",
//        email: "Por favor, escribe una dirección de correo válida",
//        url: "Por favor, escribe una URL válida.",
//        date: "Por favor, escribe una fecha válida.",
//        dateISO: "Por favor, escribe una fecha (ISO) válida.",
//        number: "Por favor, escribe un número entero válido.",
//        digits: "Por favor, escribe sólo dígitos.",
//        creditcard: "Por favor, escribe un número de tarjeta válido.",
//        equalTo: "Por favor, escribe el mismo valor de nuevo.",
//        accept: "Por favor, escribe un valor con una extensión aceptada.",
//        rangelength: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1} caracteres."),
//        range: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1}."),
//        max: jQuery.validator.format("Por favor, escribe un valor menor o igual a {0}."),
//        min: jQuery.validator.format("Por favor, escribe un valor mayor o igual a {0}.")
    });
    // Se adiciona metodo en el validate que controla el tamaño del archivo 
    $.validator.addMethod('filesize', function (value, element, param) {
        // param = size (in bytes) 
        // element = element to validate (<input>)
        // value = value of the element (file name)
        return this.optional(element) || (element.files[0].size <= param)
    }, 'El documento debe tener un tamaño no superior a 2 MB o {0} bytes');

    // Configuración del validate del formulario mostrarMensajeRadicado
    $("#registro_de_solicitudes").validate({
        focusInvalid: false,
        rules: {
            'idcorregimiento': {
                required: {
                    depends: function () {
                        if ($('#disperso').is(":checked"))
                        {
                            return true;
                        } else
                        {
                            return false;
                        }
                    }
                }
            },
            'cumnuevo': {
                required: {
                    depends: function () {
                        if ($('#expansion').is(":checked"))
                        {
                            return true;
                        } else
                        {
                            return false;
                        }
                    }
                }
            },
            'direccion1': {
                required: {
                    depends: function () {
                        if ($('#expansion').is(":checked"))
                        {
                            return true;
                        } else
                        {
                            return false;
                        }
                    }
                }
            },
            'proyecto': {
                required: {
                    depends: function () {
                        if ($('#expansion').is(":checked"))
                        {
                            return true;
                        } else
                        {
                            return false;
                        }
                    }
                }
            },
        },
        submitHandler: function () {
            // Valida si la solicitud tiene respuesta asociada
            if ($('#numradicadohijo').val() == "")
            {
                $('.overlap_espera').fadeIn(500, 'linear');
                $('.overlap_espera_1').fadeIn(500, 'linear');
                $(this).find('input[type="submit"]').attr('disabled', true);
                $(this).find('input[type="button"]').attr('disabled', true);
                $(this).find('input[type="submit"]').val('Enviando...');
                $(this).find('input[type="button"]').val('Enviando...');
                form.submit();
            } else
            {
                bootbox.alert("La solicitud ya tiene una respuesta asociada");
                event.preventDefault();
            }
        }
    });

    // Configuración del validate del formulario subirDocumento
    $("#form_adjuntos").validate({
        rules: {

            'documento[archivoservicios]': {
                extension: 'jpg|pdf',
                filesize: 2097152,
                required: true
            },
            'documento[archivopredial]': {
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

    // Configuración del validate del formulario form_consultar_radicado
    $("#form_consultar_radicado").validate({
        rules: {
            'radicado': {
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

    // Configuración del validate del formulario form_editar_radicado_hijo
    $("#form_editar_radicado_hijo").validate({
        rules: {
            'radicado_hijo': {
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
});