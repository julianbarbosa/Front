$(document).ready(function ()
{
    var dialog;

    $('.wizard-next-step-btn').attr('disabled', true);
    $('.wizard-finish-step-btn').attr('disabled', true);

    // Comportamiento del Wizard para gestionar la actualizacion de estratos en el sistema
    $('.ui-wizard-example').pixelWizard({
        onChange: function () {
            console.log('Current step: ' + this.currentStep());
        },
        onFinish: function () {
            // Disable changing step. To enable changing step just call this.unfreeze()
            this.freeze();
            console.log('Wizard is freezed');
            console.log('Finished!');
        }
    });

    $('.wizard-next-step-btn').click(function () {
        $(this).parents('.ui-wizard-example').pixelWizard('nextStep');
        $('.wizard-next-step-btn').attr('disabled', true);
    });

    $('.wizard-prev-step-btn').click(function () {
        $(this).parents('.ui-wizard-example').pixelWizard('prevStep');
    });

    $('.wizard-go-to-step-btn').click(function () {
        $(this).parents('.ui-wizard-example').pixelWizard('setCurrentStep', 2);
    });

    $('.wizard-eliminar-btn').click(function () {
        dialog = bootbox.dialog({
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner fa-3x"></i> \n\
            <span class="estratificacion-wizard-description"> Eliminando ...</span></div>',
            closeButton: false
        });

        $.ajax({
            url: $('.wizard-eliminar-btn').attr('url'),
            success: function (data) {
                if (data)
                {
                    dialog.modal('hide');
                    bootbox.alert('<div class="note note-success"> <span class="estratificacion-wizard-description"> \n\
                    Los registros de la tabla <strong> "est_bd_atipicas" </strong> fueron eliminados de forma exitosa. </span> </div>');
                    $('.wizard-next-step-btn').attr('disabled', false);
                    $('.wizard-eliminar-btn').attr('disabled', true);
                } else
                {
                    dialog.modal('hide');
                    bootbox.alert('Fallo la eliminación de registros en la tabla "est_bd_atipicas"');
                }
            }
        });
    });

    $('.wizard-validar-btn').click(function () {
        dialog = bootbox.dialog({
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner fa-3x"></i> \n\
            <span class="estratificacion-wizard-description"> Validando ...</span></div>',
            closeButton: false
        });

        $.ajax({
            url: $('.wizard-validar-btn').attr('url'),
            success: function (data) {
                if (data.estado)
                {
                    dialog.modal('hide');

                    bootbox.alert({
                        message: '<div class="note note-success"> <span class="estratificacion-wizard-description">\n\
                                La tabla contiene la siguiente cantidad de registros: <br> <br> \n\
                                <ul> <li> est_bd_atipicas: ' + data.bdatipicas + '</li> </ul> </span> </div>',
                        callback: function () {
                            bootbox.confirm('<div class="note note-success"> <span class="estratificacion-wizard-description">\n\
                            A continuación se realizará una depuración de los datos ingresados en la tabla \n\
                            <strong>"est_bd_atipicas"</strong>. <br> <br> Confirma que desea depurar la tabla? </span> </div>',
                                    function (result) {
                                        if (result)
                                        {
                                            dialog = bootbox.dialog({
                                                message: '<div class="text-center"><i class="fa fa-spin fa-spinner fa-3x"></i> \n\
                                                <span class="estratificacion-wizard-description"> Depurando ...</span></div>',
                                                closeButton: false
                                            });

                                            $.ajax({
                                                url: '../estratificacion/DepurarRegistrosAtipica',
                                                success: function (data) {
                                                    if (data)
                                                    {
                                                        dialog.modal('hide');
                                                        bootbox.alert('<div class="note note-success"> <span class="estratificacion-wizard-description">\n\
                                                        La depuración de la tabla se realizó con exito </span> </div>');
                                                        $('.wizard-next-step-btn').attr('disabled', false);
                                                        $('.wizard-validar-btn').attr('disabled', true);
                                                    } else
                                                    {
                                                        bootbox.alert('<div class="note note-success"> <span class="estratificacion-wizard-description">\n\
                                                        Fallo la depuración de registos en la tabla </span> </div>');
                                                        $('.overlap_espera').hide();
                                                        $('.overlap_espera_1').hide();
                                                    }
                                                }
                                            });
                                        }
                                    });
                        }
                    });
                } else
                {
                    dialog.modal('hide');

                    bootbox.alert('<div class="note note-danger"> <span class="estratificacion-wizard-description"> \n\
                    La tabla no tiene datos. </span> </div>');
                }
            }
        });
    });

    function actualizarPrediosEstrato(estado, url, porcentaje, codigoestadosubproceso)
    {
        if ((estado == 0) && (porcentaje == false))
        {
            dialog = bootbox.dialog({
                message: '<div class="text-center"><i class="fa fa-spin fa-spinner fa-3x"></i> \n\
                <span class="estratificacion-wizard-description"> Actualizando ...</span></div>',
                closeButton: false
            });
        } else if (estado == 0)
        {
            dialog = bootbox.dialog({
                message: '<div class="text-center"><i class="fa fa-spin fa-spinner fa-3x"></i> \n\
                <span class="estratificacion-wizard-description" id="porcentaje"> Actualizando ' + porcentaje + '% ...</span></div>',
                closeButton: false
            });
        }

        $('.wizard-next-step-btn').attr('disabled', false);
        $('.wizard-actualizar-predio-btn').attr('disabled', true);

        $.ajax({
            url: url,
            method: 'GET',
            data: {
                codigoestadosubproceso: codigoestadosubproceso
            },
            success: function (data) {
                if (data.estado)
                {
                    dialog.modal('hide');

                    bootbox.dialog({
                        message: '<div class="text-center"><span class="estratificacion-wizard-description"> \n\
                        La actualización finalizo exitosamente </span></div>',
                        closeButton: false,
                        buttons: {
                            ok: {
                                label: "OK",
                                className: 'btn-info'
                            }
                        }
                    });

                } else
                {
                    if ((estado == 0) || (porcentaje == false))
                    {
                        actualizarPrediosEstrato(1, url, data.porcentaje, codigoestadosubproceso);
                    } else if (data.porcentaje < 100)
                    {
                        $('#porcentaje').text('Actualizando ' + (data.porcentaje) + '% ...');
                        actualizarPrediosEstrato(1, url, data.porcentaje, codigoestadosubproceso);
                    } else
                    {
                        actualizarPrediosEstrato(1, url, data.porcentaje, codigoestadosubproceso);
                    }
                }
            }
        });
    }

    $('.wizard-actualizar-predio-btn').click(function () {
        dialog = bootbox.dialog({
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner fa-3x"></i><span class="estratificacion-wizard-description"> \n\
                        Preparando el sistema para la actualización ... </span></div>',
            closeButton: false
        });

        $.ajax({
            url: $('.wizard-actualizar-predio-btn').attr('url'),
            success: function (data) {
                if (data.minutos == 0)
                {
                    var texto = 'La actualización de los predios va a iniciar.';
                } else
                {
                    var texto = 'La actualización de los predios va a iniciar, esto demorará al rededor de ' + data.minutos + ' minutos.';
                }

                if (data.estado)
                {
                    dialog.modal('hide');

                    bootbox.confirm('<div class="note note-success"> <span class="estratificacion-wizard-description"> ' + texto + ' </span></div>',
                            function (result) {
                                if (result)
                                {
                                    var url = '../estratificacion/ValidarActualizarPrediosAtipica';
                                    actualizarPrediosEstrato(0, url, data.porcentaje, 'actualizarprediosatipica');
                                }
                            });
                } else
                {
                    dialog.modal('hide');

                    bootbox.alert('<div class="note note-danger"> <span class="estratificacion-wizard-description">\n\
                    Fallo la actualización de los predios. </span></div>');
                }
            }
        });
    });

    $('.wizard-generar-reporte-btn').click(function () {
        dialog = bootbox.dialog({
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner fa-3x"></i> \n\
            <span class="estratificacion-wizard-description"> Generando ...</span></div>',
            closeButton: false
        });

        $.ajax({
            url: $('.wizard-generar-reporte-btn').attr('url'),
            success: function (data) {
                if (data.estado)
                {
                    dialog.modal('hide');

                    $('#reporte_est').prepend('<a id="reporte_est" href="../../uploads/documentos/' + data.link + '" target="_blank">DESCARGAR REPORTE</a>');
                    $('.wizard-finish-step-btn').attr('disabled', false);
                    $('.wizard-generar-reporte-btn').attr('disabled', true);
                } else
                {
                    dialog.modal('hide');

                    bootbox.alert('<div class="note note-danger"> <span class="estratificacion-wizard-description">\n\
                    Fallo la generación del reporte. </span></div>');
                }
            }
        });
    });

    $('.wizard-finish-step-btn').click(function () {
        window.location.href = '../estratificacion/actualizarAtipica';
    });

});