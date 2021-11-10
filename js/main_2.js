function mostrarTextArea()
{
    $('div.textarea_area').slideDown(1000, function () {
        $('input[name="solicitud[estado]"]').removeAttr('disabled');
    });
    $('div.textarea_area textarea').removeAttr('disabled');
    $('.submitEstado1').hide();
    $('.submitEstado2').show();
    $('div.error').html('');
}
/** Adiciona un Select al filtro de la busqueda en el DataTable
 * recibe la API DataTable
 * @param {Object} api
 * **/
function adicionarFiltroSeleccionable(api)
{
    $('th.filtro_lista').each(function () {
        var name = $(this).attr('name') + ':name';
        titulo = api.column($(this).attr('name') + ':name').header();
        var select = $('<select class="form-control input-sm" style="color: #999;"><option selected value="">' + $(titulo).html() + '</option></select>')
                .appendTo($(this).empty())
                .on('change', function () {
                    var val = $(this).val();
                    api.column(name)
                            .search(val ? '^' + $(this).val() + '$' : val, true, false)
                            .draw();
                });
        api.column(name).data().unique().sort().each(function (d, j) {
            select.append('<option style="color: #555;" value="' + d + '">' + d + '</option>')
        });
    });
}
/** Adiciona text-box como filtros al encabezado de una tabla DataTable 
 * 
 * @param {String} idelemento       el valor del atributo id de la tabla
 * @param {Object DataTable} tabla
 */
function adicionarFiltrosLista(idelemento, tabla)
{
    var r = $('#' + idelemento + ' tfoot tr');
    var timer;
    r.find('th.filtro').each(function () {
        $(this).css('color', '#555');
        var title = $('#' + idelemento + ' thead th').eq($(this).index()).text();
        $(this).html('<input type="text" class="form-control input-sm" placeholder="' + title + '"/></label>');
    });
    r.find('th.filtro input').css('width', '100%');
    $('#' + idelemento + ' thead').prepend(r);
    tabla.columns().eq(0).each(function (colIdx) {
        $('input', tabla.column(colIdx).footer()).on('keyup change keypress', function () {
            value = this.value;
            clearInterval(timer);  //clear any interval on key up
            timer = setTimeout(function () { //then give it a second to see if the user is finished
                tabla.column(colIdx)
                        .search(value)
                        .draw();
            }, 500);
        });
    });
}

function adicionarFiltroSelect(api)
{
    $('th.filtroSelect').each(function () {
        var name = $(this).attr('name') + ':name';
//        titulo = api.column( $(this).attr('name') + ':name' ).header();
        var select = $('th.filtroSelect select')
                .on('change', function () {
                    var val = $(this).val();
                    api.column(name)
                            .search(val ? $(this).val() : val, true, false)
                            .draw();
                });
        /*        api.column( name ).data().unique().sort().each( function ( d, j ) {
         select.append( '<option style="color: #555;" value="' + d + '">'+d+'</option>' )
         });
         */
    });
}

$(document).ready(function ()
{
    $('.caracterespermitidos').keyup(function ()
    {
        if (this.value.match(/[^a-zA-Z0-9 ]/g))
        {
            this.value = this.value.replace(/[^a-zA-Z0-9 ]/g, '');
        }
    });
    $('.numero').keyup(function () {
        this.value = (this.value + '').replace(/[^0-9+\.]/g, '');
    });
    $('.input_file').pixelFileInput({placeholder: 'Ningún archivo seleccionado...'});// Se utiliza para los inputfile de bootstrap.

    $('.menuItem a').click(function () {
        $(this).parent().siblings().children().removeClass();
        $(this).addClass('active');
    });
    /** Eventos para el manejo del Overlap cargando... cuando se realiza un request **/
    $('form').submit(function () {
        if ($(this).attr('novalidate') != 'novalidate')
        {
            if (!$(this).find('input[type="submit"].form_validate') || $(this).find('input[type="button"]'))
            {
                $('.overlap_espera').fadeIn(500, 'linear');
                $('.overlap_espera_1').fadeIn(500, 'linear');
                $(this).find('input[type="submit"]').attr('disabled', true);
                $(this).find('input[type="button"]').attr('disabled', true);
                $(this).find('input[type="submit"]').val('Enviando...');
                $(this).find('input[type="button"]').val('Enviando...');
            }
        }
    });
    $('.boton_link').click(function () {
        $('.overlap_espera').fadeIn(500, 'linear');
        $('.overlap_espera_1').fadeIn(500, 'linear');
        $(this).attr('disabled', true);
        $(this).val('Enviando...');
    });
    $("#listaSolicitudes").on("click", ".enviando", function () {
        $('.overlap_espera').fadeIn(500, 'linear');
        $('.overlap_espera_1').fadeIn(500, 'linear');
    });
    /** Fin Eventos para el manejo del Overlap cargando... **/
    var valorTextArea = $('div.textarea_area textarea').val();
    if (valorTextArea !== '') {
        mostrarTextArea();
        $('input[name="solicitud[estado]"]').attr('checked', true);
        $('input[name="estado"]').attr('checked', true);
    }
    $('.estadoSolicitud').click(function () {
        $(this).attr('disabled', 'disabled');
        //$(this).css('background-position', '2px -15px');
        if ($('div.textarea_area').is(':hidden'))
        {
            mostrarTextArea();
            $(this).removeAttr('disabled');
        } else {
            //$(this).css('background-position', '2px 2px');
            $('.textarea_area').slideUp('slow', function () {
                //$('input[name="solicitud[estado]"]').removeAttr('disabled');
                $('.estadoSolicitud').removeAttr('disabled');
            });
            $('div.textarea_area textarea').attr('disabled', 'disabled');
            $('div.textarea_area textarea').val('');
            $('.submitEstado2').hide();
            $('.submitEstado1').show();
            $('div.error').html('');
        }
    });
    $('.submitEstado2').click(function () {
        var textAreaVal = $('div.textarea_area textarea').val();
        if (textAreaVal === '') {
            $('div.submit_area div.error').html("Si la solicitud no se aprueba, debe detallar respectivamente porque no se aprobó.");
            return false;
        } else
            return true;
    });


    /** Confirm_eliminar_resolucion  para los request desde formularios, se debe tener en cuenta que los input type=submit deben ser type=button
     *  y tener el atributo forma="#id_del_formulario_contenedor"
     */
    $('#eliminaresolucion_pot.confirm_eliminar_resolucion').click(function () {
        var input = $(this);
        bootbox.confirm("Confirma que desea Eliminar la Resolución y sus documentos adjunto en esta acción?",
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result)
                    {
                        eliminar_resolucion();
                    }
                });
    });

    /** Confirm_cambio_estado  para los request desde formularios, se debe tener en cuenta que los input type=submit deben ser type=button
     *  y tener el atributo forma="#id_del_formulario_contenedor"
     */
    $('input[type="button"].confirm_cambio_estado').click(function () {
        var input = $(this);
        bootbox.confirm("Confirma que desea Cambiar el estado de la solicitud a Pendiente Gestion POT en esta acción?",
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result)
                    {
                        cambiarestado();
                    }
                });
    });


    /** Confirm_cambio_estado  para los request desde formularios, se debe tener en cuenta que los input type=submit deben ser type=button
     *  y tener el atributo forma="#id_del_formulario_contenedor"
     */
    $('input[type="button"].confirm_aprobar_estado').click(function () {
        var input = $(this);
        bootbox.confirm("Confirma que desea Aprobar la solicitud en esta acción?",
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result)
                    {
                        var form = input.attr('forma');
                        $(form).submit();
                    }
                });
    });

    /** Confirm para los request desde formularios, se debe tener en cuenta que los input type=submit deben ser type=button
     *  y tener el atributo forma="#id_del_formulario_contenedor"
     */
    $('input[type="button"].confirm').click(function () {
        var input = $(this);
        bootbox.confirm("Confirma que desea realizar esta acción?",
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result)
                    {
                        var form = input.attr('forma');
                        $(form).submit();
                    }
                });
    });

    $('body').on('click', '.fa-warning', function () {
        var input = $(this)
        bootbox.confirm("Confirma que desea realizar esta acción?",
                function (result) {
                    if (result)
                    {
                        var destino = input.attr('destino');
                        window.location.href = destino;
                    }
                });
    });
    /** Manejo del evento click del checkbox para aprobar o no aprobar una solicitud y el TextArea para el comentario**/
    $('input[name="solicitud[estado]"]').click(function () {
        $(this).attr('disabled', 'disabled');
        if ($('div.textarea_area').is(':hidden')) {
            $('div.textarea_area').slideDown(1000, function () {
                $('input[name="solicitud[estado]"]').removeAttr('disabled');
            });
            $('div.textarea_area textarea').removeAttr('disabled');
            $('.submitEstado1').hide();
            $('.submitEstado2').show();
            $('div.error').html('');
        } else {
            $('.textarea_area').slideUp('slow', function () {
                $('input[name="solicitud[estado]"]').removeAttr('disabled');
            });
            $('div.textarea_area textarea').attr('disabled', 'disabled');
            $('div.textarea_area textarea').val('');
            $('.submitEstado2').hide();
            $('.submitEstado1').show();
        }
    });
    $("html").on("mouseenter", '.fa',
            function () {
                if (!$(this).parent().hasClass('overlap_espera_1')) {
                    if ($(this).hasClass("fa-gear"))
                    {
                        $(this).addClass('fa-spin');
                    }
                    $(this).addClass('fa-hover');
                }
            }
    );
    $("html").on("mouseleave", '.fa',
            function () {
                if (!$(this).parent().hasClass('overlap_espera_1')) {
                    $(this).removeClass('fa-hover');
                    if ($(this).hasClass("fa-gear"))
                    {
                        $(this).removeClass('fa-spin');
                    }
                }
            }
    );

    // Configuración del validate del formulario asociarRadicadoRespuesta
    $("#asociar_radicado_respuesta").validate({
        focusInvalid: false,
        rules: {
            'radicadohijo': {
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

// Pipelining function for DataTables. To be used to the `ajax` option of DataTables
//
function pipeline(opts) {
    // Configuration options
    var conf = $.extend({
        pages: 5, // number of pages to cache
        url: '', // script url
        data: null, // function or object with parameters to send to the server
        // matching how `ajax.data` works in DataTables
        method: 'GET' // Ajax HTTP method
    }, opts);
    // Private variables for storing the cache
    var cacheLower = -1;
    var cacheUpper = null;
    var cacheLastRequest = null;
    var cacheLastJson = null;

    return function (request, drawCallback, settings) {
        var ajax = false;
        var requestStart = request.start;
        var drawStart = request.start;
        var requestLength = request.length;
        var requestEnd = requestStart + requestLength;

        if (settings.clearCache) {
            // API requested that the cache be cleared
            ajax = true;
            settings.clearCache = false;
        } else if (cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper) {
            // outside cached data - need to make a request
            ajax = true;
        } else if (JSON.stringify(request.order) !== JSON.stringify(cacheLastRequest.order) ||
                JSON.stringify(request.columns) !== JSON.stringify(cacheLastRequest.columns) ||
                JSON.stringify(request.search) !== JSON.stringify(cacheLastRequest.search)
                ) {
            // properties changed (ordering, columns, searching)
            ajax = true;
        }

        // Store the request for checking next time around
        cacheLastRequest = $.extend(true, {}, request);

        if (ajax) {
            // Need data from the server
            if (requestStart < cacheLower) {
                requestStart = requestStart - (requestLength * (conf.pages - 1));

                if (requestStart < 0) {
                    requestStart = 0;
                }
            }

            cacheLower = requestStart;
            cacheUpper = requestStart + (requestLength * conf.pages);

            request.start = requestStart;
            request.length = requestLength * conf.pages;

            // Provide the same `data` options as DataTables.
            if ($.isFunction(conf.data)) {
                // As a function it is executed with the data object as an arg
                // for manipulation. If an object is returned, it is used as the
                // data object to submit
                var d = conf.data(request);
                if (d) {
                    $.extend(request, d);
                }
            } else if ($.isPlainObject(conf.data)) {
                // As an object, the data given extends the default
                $.extend(request, conf.data);
            }

            settings.jqXHR = $.ajax({
                "type": conf.method,
                "url": conf.url,
                "data": request,
                "dataType": "json",
                "cache": false,
                "success": function (json) {
                    cacheLastJson = $.extend(true, {}, json);

                    if (cacheLower != drawStart) {
                        json.data.splice(0, drawStart - cacheLower);
                    }
                    json.data.splice(requestLength, json.data.length);

                    drawCallback(json);
                }
            });
        } else {
            json = $.extend(true, {}, cacheLastJson);
            json.draw = request.draw; // Update the echo for each response
            json.data.splice(0, requestStart - cacheLower);
            json.data.splice(requestLength, json.data.length);

            drawCallback(json);
        }
    }
}
;

/**
 * Obtiene el html para el template de la accion ver de un tipo de solicitud
 * @param {String} url
 * @returns {html}
 */
function previsualizar(url)
{
    $('.overlap_espera').fadeIn(500, 'linear');
    $('.overlap_espera_1').fadeIn(500, 'linear');
    $.ajax({
        url: url,
    }).done(function (data) {
        $('#modalVer').modal('show');
        contenedor = null;
        contenedor = $("#htmlInformacion div.contenedorForm");
//            contenedorOverlap = $("#htmlInformacion div.overlap_espera_3");
        $('.overlap_espera').fadeOut(500, 'linear');
        $('.overlap_espera_1').fadeOut(500, 'linear');
//            contenedorOverlap.show();
        contenedor.html(data);
    });
}

function obtenerAccion()
{
    $('.overlap_espera').fadeIn(500, 'linear');
    $('.overlap_espera_1').fadeIn(500, 'linear');
}