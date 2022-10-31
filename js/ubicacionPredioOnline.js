$(document).ready(function ()
{
    $('#direccionurbano').hide();
    $('#ubicacionrural1').hide();
    $('#ubicacionrural2').hide();
    $('#nuevaubicacion').hide();

    $('input[name="tipozona"]').click(function ()
    {
        if ($(this).val() == 'urbano')
        {
            $('#s2id_usosuelo_pot_ciiu_list').select2('data', null);

            $('#latitud').val('');
            $('#longitud').val('');
            $(".select2-chosen").text('');

            $('#tipobusqueda').parent().parent().parent().parent().show();
            $('#numeropre').parent().parent().show();
            $('#numeropre_rural').parent().parent().show();
            $('#consistencia').parent().parent().parent().parent().show();
            $('#ubicacionrural1').hide();

            $('#consistencia').hide();
            $('#consistencia').val('');

            $('#nuevaubicacion').hide();
            $('#direccionnueva').val('');
            $('#numeroprenuevo').val('');
            $('#direccionadicional').val('');
            $('#latitud').val('');
            $('#longitud').val('');

            $('#ubicacionrural2').hide();
            $('#mapCanvas').hide();

            $('#actividades').hide();
        }
        else if ($(this).val() == 'rural')
        {
            $('#s2id_usosuelo_pot_ciiu_list').select2('data', null);

            $('#tipobusqueda').parent().parent().parent().parent().hide();
            $('#numeropre').parent().parent().hide();
            $('#ubicacionrural1').show();

            $('#consistencia').hide();
            $('#consistencia').val('');

            $('#nuevaubicacion').hide();
            $('#direccionnueva').val('');
            $('#numeroprenuevo').val('');
            $('#direccionadicional').val('');

            $('#direccionurbano').hide();
            $('#actividades').hide();
        }
    });

    $('input[name="consistencia"]').click(function () {

        if ($('input:radio[name=tipozona]:checked').val() == 'urbano') {
            $('#s2id_usosuelo_pot_ciiu_list').select2('data', null);

            if ($(this).val() == 'si')
            {
                $('#direccionnueva').val('');
                $('#numeroprenuevo').val('');
                $('direccionadicional').val('');

                $('#nuevaubicacion').hide();
                $('#tipobusqueda').parent().parent().parent().parent().show();
                $('#numeropre').parent().parent().show();

                $('#ubicacionrural1').hide();
                $('#ubicacionrural2').hide();
                $('#latitud').val('');
                $('#longitud').val('');

                //
                $('#consistencia').hide();
                $('#consistencia').val('');

                $('#nuevaubicacion').hide();
                $('#direccionnueva').val('');
                $('#numeroprenuevo').val('');
                $('#direccionadicional').val('');
                $('#latitud').val('');
                $('#longitud').val('');

                $('#ubicacionrural2').hide();
                $('#mapCanvas').hide();

                $('#actividades').hide();

                if ($('input:radio[name=tipobusqueda]:checked').val() == "direccion") {
                    $('#numeroprenacional').hide();
                }
            }
            else if ($(this).val() == 'no')
            {
                $('#numeropre').select2('data', null);
                $('#s2id_numeropre_rural').select2('data', null);
                $('#tipobusqueda').parent().parent().parent().parent().hide();
                $('#numeropre').parent().parent().hide();
                $('#nuevaubicacion').show();

                $('#direccionnueva').prop('readonly', true);
                $('#numeroprenuevo').prop('readonly', true);
                obtenerModalIngresoDireccion();

                if ($('input:radio[name=tipozona]:checked').val() == 'rural') {
                    $('#ubicacionrural2').show();
                    $('#latitud').prop('readonly', true);
                    $('#longitud').prop('readonly', true);
                }

                $("#actividades").show();
                $("#botones_form").show();
            }

        }

        if ($('input:radio[name=tipozona]:checked').val() == 'rural') {
            $('#s2id_usosuelo_pot_ciiu_list').select2('data', null);

            if ($(this).val() == 'si')
            {
                $('#nuevaubicacion').hide();
                $('#ubicacionrural2').hide();
            }
            else if ($(this).val() == 'no')
            {
                $('#numeropre').select2('data', null);
                $('#s2id_numeropre_rural').select2('data', null);
                $('#tipobusqueda').parent().parent().parent().parent().hide();
                $('#numeropre').parent().parent().hide();
                $('#nuevaubicacion').show();
                $('#ubicacionrural2').show();
                $('#latitud').prop('readonly', true);
                $('#longitud').prop('readonly', true);

                $("#actividades").show();
                $("#botones_form").show();

                callGooglemaps();
            }
        }

    });


    $('input[name="tipobusqueda"]').click(function ()
    {
        $('#consistencia').hide();
        $('#actividades').hide();

        if ($(this).val() == 'numeropre')
        {
            $('#s2id_usosuelo_pot_ciiu_list').select2('data', null);
            $('#s2id_numeropre_rural').select2('data', null);
            $('#direccion').select2('data', null);
            $('#direccionurbano').hide();
            $('#numeroprenacional').show();
        }
        else if ($(this).val() == 'direccion')
        {
            $('#s2id_usosuelo_pot_ciiu_list').select2('data', null);
            $('#s2id_numeropre_rural').select2('data', null);
            $('#numeropre').select2('data', null);
            $('#s2id_numeropre_rural').select2('data', null);
            $('#numeroprenacional').hide();
            $('#direccionurbano').show();
        }
    });





//  Setup validation
//  var validador = $("#form_solicitud").validate({
    $("#form_solicitud").validate({
        ignore: '.ignore, .select2-input',
        focusInvalid: false,
        rules: {
            'direccion': {
                required: {
                    depends: function () {
                        var tipozona_direccion = $('input:radio[name=tipozona]:checked').val();
                        var consistencia_direccion = $('input:radio[name=consistencia]:checked').val();
                        var tipobusqueda_direccion = $('input:radio[name=tipobusqueda]:checked').val();

                        if (tipozona_direccion == 'urbano' && consistencia_direccion == 'si' && tipobusqueda_direccion == 'direccion')
                        {
                            return true;
                        }
                        else
                        {
                            //alert("ELSE DIR");
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
                        }
                        else
                        {
                            //alert("ELSE NPN");
                            return false;
                        }
                    }
                }
            },
            'numeroprenuevo': {
                required: {
                    depends: function () {
                        var tipozona_numeropre = $('input:radio[name=tipozona]:checked').val();
                        var consistencia_numeropre = $('input:radio[name=consistencia]:checked').val();
                        var tipobusqueda_numeropre = $('input:radio[name=tipobusqueda]:checked').val();

                        if (tipozona_numeropre == 'urbano' && consistencia_numeropre == 'no' && tipobusqueda_numeropre == 'numeropre')
                        {
                            return true;
                        }
                        if (tipozona_numeropre == 'rural' && consistencia_numeropre == 'no' && tipobusqueda_numeropre == 'numeropre')
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                },
                minlength: 30,
                maxlength: 30
            },
            'numeropre_rural': {
                required: false
            },
            'latitud': {
                required: {
                    depends: function () {
                        var tipozona_longitud = $('input:radio[name=tipozona]:checked').val();
                        var consistencia = $('input:radio[name=consistencia]:checked').val();
                        if (tipozona_longitud == 'rural' && consistencia == 'no') {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
            },
            'longitud': {
                required: {
                    depends: function () {
                        var tipozona_longitud = $('input:radio[name=tipozona]:checked').val();
                        var consistencia = $('input:radio[name=consistencia]:checked').val();
                        if (tipozona_longitud == 'rural' && consistencia == 'no') {
                            return true;
                        }
                        else
                        {
                            return false;
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
                        }
                        else if ($('#numeroprenuevo').val() != "")
                        {
                            return false;
                        }
                        else
                        {
                            return true;
                        }
                    }
                },
                minlength: 5
            },
            'direccionadicional': {
                required: false
            }
        },
        messages: {
            direccionnueva: msgdireccionnueva(),
            numeroprenuevo: "1-Por favor ingrese el número predial, son 30 digitos y solo se aceptan números en este campo",
            direccion: "Por favor ingrese la dirección",
            numeropre: "2-Por favor ingrese el número predial, son 30 digitos y solo se aceptan números en este campo",
            longitud: "Este campo es requerido, por favor seleccione en el mapa una ubicación aproximada a su predio",
            latitud: "Este campo es requerido, por favor seleccione en el mapa una ubicación aproximada a su predio"
        }
    });


    $('#direccion').select2({
        minimumInputLength: 4,
        allowClear: true,
        ajax: {
            url: "DireccionIdesc",
            dataType: 'json',
            data: function (term, page) {
                return {
                    q: term
                };
            },
            results: function (data, page) {

                if (data != null) {
                    $('#botones_form').show();
                    $("#actividades").show();
                    $("#consistencia").show();
                    $("#usosuelo_pot_ciiu_list").select2('enable', true);
                }
                if (data == '') {
                    $('#botones_form').hide();
                    $(".select2-chosen").text('');
                }

                return {results: data};
            }
        }
    });

    $('#numeropre').select2({
        minimumInputLength: 4,
        allowClear: true,
        ajax: {
            url: "NumpredialIdesc",
            dataType: 'json',
            data: function (term, page) {
                return {
                    q: '760010100' + term,
                    tipozona: 'urbano'
                };
            },
            results: function (data, page) {
                if (data != null) {
                    if (data.length > 0) {
                        $('#botones_form').show();
                        $("#actividades").show();
                        $("#consistencia").show();
                        $("#usosuelo_pot_ciiu_list").select2('enable', true);
                    }
                }
                if (data == '') {
                    if (data.length < 1) {
                        $("#consistencia").show();
                        $('#botones_form').hide();
                        $(".select2-chosen").text('');
                    }
                }

                return {results: data};
            }
        }
    });

    $('#numeropre_rural').select2({
        minimumInputLength: 8,
        allowClear: true,
        ajax: {
            url: "NumpredialIdesc",
            dataType: 'json',
            data: function (term, page) {
                return {
                    q: '76001' + term,
                    tipozona: 'rural'
                };
            },
            results: function (data, page) {

                if (data != null) {
                    if (data.length > 0) {
                        $('#botones_form').show();
                        $("#actividades").show();
                        $("#consistencia").show();
                        $("#usosuelo_pot_ciiu_list").select2('enable', true);
                    }
                }
                if (data == '') {
                    if (data.length < 1) {
                        $("#consistencia").show();
                        $('#botones_form').hide();
                        $(".select2-chosen").text('');
                    }
                }

                return {results: data};
            }
        }
    });

    $('#Direccion').select2('enable', false);
    $('#NumeroPredio').select2('enable', true);
    $('#NumeroPreRural').select2('enable', true);
    /*** Asignar calse a input de consulta predio ***/
    $('.npn_prefix_rural .select2-search').addClass("npn_prefix_search_rural");
    $('.npn_prefix_urbano .select2-search').addClass("npn_prefix_search_urbano");
});

// MODAL INGRESO NUEVA NOMENCLATURA
function obtenerModalIngresoDireccion() {
    $.ajax({
        url: "../nomenclatura",
        /*data: {fieldNameDireccion: "direccionnueva",
            fieldNameDireccionAdicional: "direccionadicional",
            fieldNameNumeroUnico: "numeroprenuevo",
            fieldNamecallbackFunction: "cerrarModal",
            fieldNameNPNrequerido: true,
            fieldNameDiv: "modalIngresoDireccion"},*/
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