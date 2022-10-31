$(document).ready(function ()
{
    $('#direccion').parent().parent().hide();
    $('#ubicacionrural').hide();
    $('#nuevaubicacion').hide();

    // Contador de caracteres para el campo de texto Observación de tipo urbano
    $("#observacion").on('keyup', function () {
        var este = $(this);
        maxlength = este.attr('maxlength');
        maxlengthint = parseInt(maxlength);
        textoActual = este.val();
        currentCharacters = este.val().length;
        remainingCharacters = maxlengthint - currentCharacters;
        espan = $('#contador').find('span');
        // Detectamos si es IE9 y si hemos llegado al final, convertir el -1 en 0 - bug ie9 porq. no coge directamente el atributo 'maxlength' de HTML5
        if (document.addEventListener && !window.requestAnimationFrame) {
            if (remainingCharacters <= -1) {
                remainingCharacters = 0;
            }
        }
        espan.html(remainingCharacters);
    });

    // Contador de caracteres para el campo de texto Observación de tipo rural 
    $("#observacion_rural").on('keyup', function () {
        var este = $(this);
        maxlength = este.attr('maxlength');
        maxlengthint = parseInt(maxlength);
        textoActual = este.val();
        currentCharacters = este.val().length;
        remainingCharacters = maxlengthint - currentCharacters;
        espan = $('#contador_rural').find('span');
        // Detectamos si es IE9 y si hemos llegado al final, convertir el -1 en 0 - bug ie9 porq. no coge directamente el atributo 'maxlength' de HTML5
        if (document.addEventListener && !window.requestAnimationFrame) {
            if (remainingCharacters <= -1) {
                remainingCharacters = 0;
            }
        }
        espan.html(remainingCharacters);
    });

    // Valida por NPN si el predio tiene una solicitud en proceso
    $('#numeropre').on("select2-selecting", function (e) {
        $.ajax({
            url: '../../../estratificacion/VerificarSolicitudExistente',
            dataType: 'json',
            data: {
                codigotiposolicitud: $('#codigotiposolicitud').val(),
                datospredio: e.val
            },
            success: function (data) {
                if (data)
                {
                    bootbox.alert('<div class="note note-danger">El predio tiene una solicitud vigente</div>');
                    $('#numeropre').select2('data', null);
                }
            }
        })
    });

    // Valida por direccion si el predio tiene una solicitud en proceso
    $('#direccion').on("select2-selecting", function (e) {
        $.ajax({
            url: '../../../estratificacion/VerificarSolicitudExistente',
            dataType: 'json',
            data: {
                codigotiposolicitud: $('#codigotiposolicitud').val(),
                datospredio: e.val
            },
            success: function (data) {
                if (data)
                {
                    bootbox.alert('<div class="note note-danger">El predio tiene una solicitud vigente</div>');
                    $('#direccion').select2('data', null);
                }
            }
        })
    });

    // Valida por NPN si el predio existe
    $("input[name=numeroprenuevo_rural]").change(function () {
        $.ajax({
            url: '../../../estratificacion/VerificarNpnExistente',
            dataType: 'json',
            data: {
                npn: $('#numeroprenuevo_rural').val()
            },
            success: function (data) {
                if (data)
                {
                    bootbox.alert('<div class="note note-danger">El Número predial nacional ya existe</div>');
                    $('#numeroprenuevo_rural').val('');
                }
            }
        })
    });

    // Se define comportamiento de acuerdo a la selección del check box tipozona
    $('input[name="tipozona"]').click(function ()
    {
        if ($(this).val() == 'urbano')
        {
            $('input[name=consistencia][value=si]').attr('checked', true);
            $('#latitud').val('');
            $('#longitud').val('');
            $(".select2-chosen").text('');
            $('#ubicacionurbana').show();
            $('#ubicacionrural').hide();
            $('[name=existe_npn]').val(['si']);
            $('[name=tipobusqueda]').val(['numeropre']);
            $('[name=consistencia]').val(['si']);
            $('#documento_archivopredial').replaceWith($('#documento_archivopredial').val('').clone(true));
            $('#documento_archivoservicios').replaceWith($('#documento_archivoservicios').val('').clone(true));
        } else if ($(this).val() == 'rural')
        {
            $('#nuevaubicacion').hide();
            $('#ubicacionurbana').hide();
            $('#ubicacionrural').show();
            $('#numeroprenuevo_rural').parent().parent().hide();
            $('#documento_archivopredial').replaceWith($('#documento_archivopredial').val('').clone(true));
            $('#documento_archivoservicios').replaceWith($('#documento_archivoservicios').val('').clone(true));
            displayMap();
        }
    });
    // Se define comportamiento de acuerdo a la selección del check box consistencia
    $('input[name="consistencia"]').click(function ()
    {
        if ($(this).val() == 'si')
        {
            $('#direccionnueva').val('');
            $('#numeroprenuevo').val('');
            $('#direccionadicional').val('');
            $('#nuevaubicacion').hide();
            $('#tipobusqueda').parent().parent().parent().parent().show();
            $('#numeropre').parent().parent().show();
        } else if ($(this).val() == 'no')
        {
            $('#numeropre').select2('data', null);
            $('#tipobusqueda').parent().parent().parent().parent().hide();
            $('#numeropre').parent().parent().hide();
            $('#direccion').parent().parent().hide();
            $('#nuevaubicacion').show();
            obtenerModalIngresoDireccion();
        }
    });
    // Se define comportamiento de acuerdo a la selección del check box existe_npn
    $('input[name="existe_npn"]').click(function ()
    {
        if ($(this).val() == 'si')
        {
            $('#numprenuevorural').hide();
            $('#numeropre_rural').parent().parent().show();
        } else if ($(this).val() == 'no')
        {
            $('#numeropre_rural').parent().parent().hide();
            $('#numprenuevorural').show();
        }
    });
    // Se define comportamiento de acuerdo a la selección del check box tipobusqueda
    $('input[name="tipobusqueda"]').click(function ()
    {
        if ($(this).val() == 'numeropre')
        {
            $('#direccion').select2('data', null);
            $('#direccion').parent().parent().hide();
            $('#numeropre').parent().parent().show();
            $('#numeropre_sin_dir').parent().parent().show();
        } else if ($(this).val() == 'direccion')
        {
            $('#numeropre').select2('data', null);
            $('#numeropre').parent().parent().hide();
            $('#numeropre_sin_dir').select2('data', null);
            $('#numeropre_sin_dir').parent().parent().hide();
            $('#direccion').parent().parent().show();
        }
    });
    // Personalización de mensajes del validate
    jQuery.extend(jQuery.validator.messages, {
        required: "Este campo es obligatorio.",
        extension: "El documento debe estar en formato pdf o jpg",
        maxlength: jQuery.validator.format("Por favor, no escribas más de {0} caracteres."),
        minlength: jQuery.validator.format("Por favor, no escribas menos de {0} caracteres.")
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

    // Configuración del validate del formulario
    $("#form_solicitud").validate({
        rules: {
            'numidentificacion': {
                required: true
            },
            'archivo': {
                required: true
            },
            'direccion': {
                required: {
                    depends: function () {
                        var tipozona_direccion = $('input:radio[name=tipozona]:checked').val();
                        var consistencia_direccion = $('input:radio[name=consistencia]:checked').val();
                        var tipobusqueda_direccion = $('input:radio[name=tipobusqueda]:checked').val();
                        if (tipozona_direccion == 'urbano' && consistencia_direccion == 'si' && tipobusqueda_direccion == 'direccion')
                        {
                            return true;
                        } else
                        {
                            return false;
                        }
                    }
                }
            },
            'numeropre': {
                required: {
                    depends: function () {
                        var tipozona_numeropre = $('input:radio[name=tipozona]:checked').val();
                        var consistencia_numeropre = $('input:radio[name=consistencia]:checked').val();
                        var tipobusqueda_numeropre = $('input:radio[name=tipobusqueda]:checked').val();
                        if (tipozona_numeropre == 'urbano' && consistencia_numeropre == 'si' && tipobusqueda_numeropre == 'numeropre')
                        {
                            return true;
                        } else
                        {
                            return false;
                        }
                    }
                },
            },
            'observacion': {
                required: {
                    depends: function () {
                        var tipozona = $('input:radio[name=tipozona]:checked').val();
                        var tipo_solicitud = $('#codigotiposolicitud').val();
                        if (((tipozona == 'urbano') && (tipo_solicitud == 'revisionestrato')) || (tipo_solicitud == 'apelacionestrato'))
                        {
                            return true;
                        } else
                        {
                            false;
                        }
                    }
                },
            },
            'observacion_rural': {
                required: {
                    depends: function () {
                        var tipozona = $('input:radio[name=tipozona]:checked').val();
                        var tipo_solicitud = $('#codigotiposolicitud').val();
                        if ((tipozona == 'rural') && (tipo_solicitud == 'revisionestrato'))
                        {
                            return true;
                        } else
                        {
                            false;
                        }
                    }
                },
            },
            'numeropre_rural': {
                required: {
                    depends: function () {
                        var tipozona_numeropre = $('input:radio[name=tipozona]:checked').val();
                        var existe_npn_numeroprenuevo_rural = $('input:radio[name=existe_npn]:checked').val();
                        if ((tipozona_numeropre == 'rural') && (existe_npn_numeroprenuevo_rural == 'si'))
                        {
                            return true;
                        } else
                        {
                            return false;
                        }
                    }
                }
            },
            'numeroprenuevo_rural': {
                required: {
                    depends: function () {
                        var existe_npn_numeroprenuevo_rural = $('input:radio[name=existe_npn]:checked').val();
                        if (existe_npn_numeroprenuevo_rural == 'si')
                        {
                            return false;
                        } else
                        {
                            return true;
                        }
                    }
                },
                maxlength: 30,
                minlength: 30,
            },
            'latitud': {
                required: {
                    depends: function () {
                        var tipozona_latitud = $('input:radio[name=tipozona]:checked').val();
                        if (tipozona_latitud == 'urbano')
                        {
                            return false;
                        } else
                        {
                            return true;
                        }
                    }
                }
            },
            'longitud': {
                required: {
                    depends: function () {
                        var tipozona_longitud = $('input:radio[name=tipozona]:checked').val();
                        if (tipozona_longitud == 'urbano')
                        {
                            return false;
                        } else
                        {
                            return true;
                        }
                    }
                }
            },
            'direccionnueva': {
                required: {
                    depends: function () {
                        var consistencia_direccionnueva = $('input:radio[name=consistencia]:checked').val();
                        if (consistencia_direccionnueva == 'si')
                        {
                            return false;
                        } else if ($('#numeroprenuevo').val() != "")
                        {
                            return false;
                        } else
                        {
                            return true;
                        }
                    }
                }
            },
            'numeroprenuevo': {
                required: {
                    depends: function () {
                        var consistencia_numeroprenuevo = $('input:radio[name=consistencia]:checked').val();
                        if (consistencia_numeroprenuevo == 'si')
                        {
                            return false;
                        } else if ($('#direccionnueva').val() != "")
                        {
                            return false;
                        } else
                        {
                            return true;
                        }
                    }
                }
            },
            'direccionadicional': {
                required: false
            },
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
            'documento[archivoapelacion]': {
                extension: 'pdf',
                filesize: 2097152,
                required: true
            },
            'radicado_hijo_apelacion': {
                required: true
            },
        },
        messages: {
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

    // Configuración del validate del formulario
    $("#busqueda_numero_predial").validate({
        ignore: '.ignore, .select2-input',
        focusInvalid: false,
        rules: {
            'direccion': {
                required: {
                    depends: function () {
                        var tipozona_direccion = $('input:radio[name=tipozona]:checked').val();
                        var tipobusqueda_direccion = $('input:radio[name=tipobusqueda]:checked').val();
                        if (tipozona_direccion == 'urbano' && tipobusqueda_direccion == 'direccion')
                        {
                            return true;
                        } else
                        {
                            return false;
                        }
                    }
                }
            },
            'numeropre_sin_dir': {
                required: {
                    depends: function () {
                        var tipozona_numeropre = $('input:radio[name=tipozona]:checked').val();
                        var tipobusqueda_numeropre = $('input:radio[name=tipobusqueda]:checked').val();
                        if (tipozona_numeropre == 'urbano' && tipobusqueda_numeropre == 'numeropre')
                        {
                            return true;
                        } else
                        {
                            return false;
                        }
                    }
                }
            },
            'numeropre_rural': {
                required: {
                    depends: function () {
                        var tipozona_numeropre = $('input:radio[name=tipozona]:checked').val();
                        if ((tipozona_numeropre == 'rural'))
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
            $('.overlap_espera').fadeIn(500, 'linear');
            $('.overlap_espera_1').fadeIn(500, 'linear');
            $(this).find('input[type="submit"]').attr('disabled', true);
            $(this).find('input[type="button"]').attr('disabled', true);
            $(this).find('input[type="submit"]').val('Enviando...');
            $(this).find('input[type="button"]').val('Enviando...');
            form.submit();
        }
    });
    window.jQuery || document.write('<script src="../../../../../../web/js/pixeladmin/libs/jquery.flot-0.8.2">' + "<" + "/script>");
    init.push(function () {
        // Javascript code here
    });

    // Autocompletar de busqueda por dirección
    $('#direccion').select2({
        minimumInputLength: 3,
        allowClear: true,
        ajax: {
            url: $('.dir_select').attr('url'),
            dataType: 'json',
            data: function (term, page) {
                return {
                    q: term
                };
            },
            results: function (data, page) {
                return {results: data};
            }
        }
    });

    // Autocompletar de busqueda por predio urbano
    $('#numeropre').select2({
        minimumInputLength: 4,
        allowClear: true,
        ajax: {
            url: $('.npn_prefix_urbano').attr('url'),
            dataType: 'json',
            data: function (term, page) {
                return {
                    q: '760010100' + term,
                    tipozona: 'urbano'
                };
            },
            results: function (data, page) {
                return {results: data};
            }
        }
    });

    // Autocompletar de busqueda por predio rural
    $('#numeropre_rural').select2({
        minimumInputLength: 8,
        allowClear: true,
        ajax: {
            url: $('.npn_prefix_rural').attr('url'),
            param: "",
            dataType: 'json',
            data: function (term, page) {
                return {
                    q: '76001' + term,
                    tipozona: 'rural'
                };
            },
            results: function (data, page) {
                return {results: data};
            }
        }
    });


    $('#numeropre_sin_dir').select2({
        minimumInputLength: 4,
        allowClear: true,
        ajax: {
            url: $('.npn_prefix_sin_dir').attr('url'),
            param: "",
            dataType: 'json',
            data: function (term, page) {
                return {
                    q: '760010100' + term,
                    tipozona: 'urbano'
                };
            },
            results: function (data, page) {
                return {results: data};
            }
        }
    });

    // Autocompletar de busqueda por radicado hijo o radicado respuesta
    $('#radicado_hijo_apelacion').select2({
        minimumInputLength: 3,
        allowClear: true,
        ajax: {
            url: $('.radicado_prefix_hijo').attr('url'),
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

    // Autocompletar de busqueda por radicado
    $('#radicado').select2({
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

    $('#Direccion').select2('enable', false);
    $('#NumeroPredio').select2('enable', true);
    $('#NumeroPreRural').select2('enable', true);
    /*** Asignar clase a input de consulta predio ***/
    $('.npn_prefix_rural .select2-search').addClass("npn_prefix_search_rural");
    $('.npn_prefix_urbano .select2-search').addClass("npn_prefix_search_urbano");
    $('.npn_prefix_sin_dir .select2-search').addClass("npn_prefix_search_urbano");

    // MODAL INGRESO NUEVA NOMENCLATURA
    function obtenerModalIngresoDireccion() {
        $.ajax({
            url: "../../../nomenclatura",
            data: {
                fieldNamecallbackFunction: "cerrarModal",
                fieldNameNPNrequerido: true,
                fieldNameDiv: "modalIngresoDireccion",
                fieldNameNumeroUnico: "numeroprenuevo",
                fieldNameDireccion: "direccionnueva",
                fieldNameDireccionAdicional: "direccionadicional",
                fieldNameIdPredio: "idpredio",
                fieldNameIdNomenclatura: "idnomenclatura",
                activarBusqueda: false
            },
            success: function (data) {
                $('#modalIngresoDireccion').empty();
                $('#modalIngresoDireccion').append(data);
                $('#modalIngresoDireccion').modal('show');
            }
        });
    }
});