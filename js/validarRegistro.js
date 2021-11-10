$(document).ready(function () {
    $('#idvereda').hide();
    $('#idmunicipio').hide();

    // Comportamiento al seleccionar el municipio
    $("#sfaa_municipio").change(function () {
        if ($('#sfaa_municipio').val().trim() == '132') {
            $(".select2-chosen").text('');
            $('#idmunicipio').hide();
            $('#sfaa_idbarrio').val('');
            $('#sfaa_idvereda').val('');
            $('#zonaresidencia').show();
        } else {
            $('#sfaa_idbarrio').val('');
            $('#sfaa_idvereda').val('');
            $('#zonaresidencia').hide();
            $('#idmunicipio').show();
        }
    });

    // Comportamiento al seleccioanr el tipo de zona
    $("#sfaa_idtipozona").change(function () {
        if ($('#sfaa_idtipozona').val().trim() == '1') {
            $('#barrio').show();
            $('#idvereda').hide();
            $('#sfaa_idvereda').val('');
        } else {
            $('#idvereda').show();
            $('#barrio').hide();
            $('#sfaa_idbarrio').val('');
        }
    });

    // Validación del campo "Razon Social" cuando se selecciona NIT
    $('input[name="sfApplyApply[first_name]"]').on("keyup onblur click change", function () {
        firstname = $('input[name="sfApplyApply[first_name]"]').val();
        lastname = $('input[name="sfApplyApply[last_name]"]').val();
        $('input[name="sfApplyApply[razonsocial]"]').val(firstname + ' ' + lastname);

    });
    $('input[name="sfApplyApply[last_name]"]').on("keyup onblur click change", function () {
        fistname = $('input[name="sfApplyApply[first_name]"]').val();
        lastname = $('input[name="sfApplyApply[last_name]"]').val();
        $('input[name="sfApplyApply[razonsocial]"]').val(firstname + ' ' + lastname);
    });
    $('input[name="sfApplyApply[razonsocial]"]').attr('readonly', true);

    $('#sfaa_idtipodocidentificacion').click(function () {
        $('#sfaa_razonsocial').val('');

        if ($(this).val() == '2') {
            $('#sfaa_first_name').siblings('label').html('Nombre Representante Legal');
            $('#sfaa_last_name').siblings('label').html('Apellido Representante Legal');
            $('input[name="sfApplyApply[razonsocial]"]').attr('readonly', false);
            $('input[name="sfApplyApply[first_name]"]').unbind("keyup onblur click change");
            $('input[name="sfApplyApply[last_name]"]').unbind("keyup onblur click change");
            $('input[name="sfApplyApply[username]"]').unbind("keyup onblur click change");
        } else if ($(this).val() == '1') {
            $('input[name="sfApplyApply[razonsocial]"]').attr('readonly', true);
            $('#sfaa_first_name').siblings('label').html('Nombre');
            $('#sfaa_last_name').siblings('label').html('Apellido');
        }
    });

    // Personalización de mensajes del validate
    jQuery.extend(jQuery.validator.messages, {
        required: "Este campo es obligatorio.",
        extension: "El documento debe estar en formato pdf o jpg",
        maxlength: jQuery.validator.format("Por favor, escriba hasta {0} caracteres."),
        minlength: jQuery.validator.format("Por favor, escriba al menos {0} caracteres."),
        //        remote: 'Ya existe una cuenta con esta dirección de correo electrónico. Si ha olvidado su contraseña, haga clic en "Cancelar" y luego en "Olvidaste tu contraseña ?".',
        email: "Por favor, escriba una dirección de correo válida",
        //        url: "Por favor, escribe una URL válida.",
        date: "Por favor, escribe una fecha válida (AAAA-MM-DD).",
        //        dateISO: "Por favor, escribe una fecha (ISO) válida.",
        //        number: "Por favor, escribe un número entero válido.",
        //        lettersonly: "Por favor, escribe solo letras",
        digits: "Por favor, escriba sólo dígitos.",
        //        creditcard: "Por favor, escribe un número de tarjeta válido.",
        //        equalTo: 'Por favor, escriba el mismo valor del campo. "' + $('#sfaa_email_address').parent().find('label').text() + '"',
        //        accept: "Por favor, escribe un valor con una extensión aceptada.",
        //        rangelength: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1} caracteres."),
        //        range: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1}."),
        //        max: jQuery.validator.format("Por favor, escribe un valor menor o igual a {0}."),
        //        min: jQuery.validator.format("Por favor, escribe un valor mayor o igual a {0}.")
    });

    // Activa la validación del campo "Numero de identificacion"
    $("#sfaa_idtipodocidentificacion").change(function () {
        $('#sfaa_numidentificacion').valid();
    });

    $("#sf_apply_apply_form").validate({
        rules: {
            'sfApplyApply[idtipodocidentificacion]': {
                required: true
            },
            'sfApplyApply[numidentificacion]': {
                required: true,
                maxlength: 16,
                minlength: 4,
                digits: {
                    depends: function () {
                        var idtipodocidentificacion = $('select[id=sfaa_idtipodocidentificacion]').val();

                        if (idtipodocidentificacion === '6') {
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                /*remote: {
                    url: 'sfApply/VerificarNumidentificacion',
                    type: "post",
                    data: {
                        numidentificacion: function () {
                            return $('#sfaa_numidentificacion').val();
                        }
                    }
                }*/
            },
            'sfApplyApply[first_name]': {
                required: true
            },
            'sfApplyApply[last_name]': {
                required: true
            },
            'sfApplyApply[fechanacimiento]': {
                date: true
            },
            'sfApplyApply[edad]': {
                maxlength: 2,
                minlength: 2
            },
            'sfApplyApply[razonsocial]': {
                required: true
            },
            'sfApplyApply[password]': {
                required: true,
                minlength: 6
            },
            'sfApplyApply[password2]': {
                required: true,
                equalTo: '#sfaa_password'
            },
            'sfApplyApply[email_address]': {
                required: true,
                email: true,
                remote: {
                    url: 'sfApply/VerificarEmail',
                    type: "post",
                    data: {
                        email_address: function () {
                            return $('#sfaa_email_address').val();
                        }
                    }
                }
            },
            'sfApplyApply[email2]': {
                required: true,
                email: true,
                equalTo: '#sfaa_email_address'
            },
            'sfApplyApply[telefono]': {
                required: true,
                digits: true,
                maxlength: 10
            },
            'sfApplyApply[celular]': {
                digits: true,
                maxlength: 10
            },
            'sfApplyApply[direccion]': {
                required: true
            },
            'sfApplyApply[municipio]': {
                required: true
            },
            'sfApplyApply[idbarrio]': {
                required: {
                    depends: function () {
                        if (($('#sfaa_municipio').val() == "132") && ($('#sfaa_idtipozona').val() == "1")) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            },
            'sfApplyApply[idvereda]': {
                required: {
                    depends: function () {
                        if (($('#sfaa_municipio').val() == "132") && ($('#sfaa_idtipozona').val() == "2")) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            },
            'sfApplyApply[idtipoempresa]': {
                required: true
            },
            'terminos': {
                required: true
            },
            'terminos1': {
                required: true
            }
        },
        // Personalización de mensajes del validate
        messages: {
            'sfApplyApply[numidentificacion]': {
                remote: jQuery.format('Ya existe una cuenta con el número de identificación: "{0}". Si ha olvidado su contraseña, haga clic en "Cancelar" y luego en "Olvidaste tu contraseña ?".')
            },
            'sfApplyApply[email_address]': {
                remote: jQuery.format('Ya existe una cuenta con la dirección de correo electrónico: "{0}". Si ha olvidado su contraseña, haga clic en "Cancelar" y luego en "Olvidaste tu contraseña ?".')
            },
            'sfApplyApply[password2]': {
                equalTo: 'Por favor, escriba el mismo valor del campo. "' + $('#sfaa_password').parent().find('label').text() + '"'
            },
            'sfApplyApply[email2]': {
                equalTo: 'Por favor, escriba el mismo valor del campo. "' + $('#sfaa_email_address').parent().find('label').text() + '"'
            }
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

    // Autocompletar de busqueda de municipio
    $('#sfaa_idmunicipio').select2({
        placeholder: 'Seleccione una opción',
        minimumInputLength: 2,
        allowClear: true,
        ajax: {
            url: $('.municipio_prefix').attr('url'),
            param: "",
            dataType: 'json',
            data: function (term, page) {
                return {
                    q: term
                };
            },
            results: function (data) {
                return { results: data };
            }
        }
    });
});