saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("crear-propiedad-horizontal", {
            url: "/propiedadhorizontal/crear",
            views: {
                "main": {
                    controller: "crearpropiedadhorizontalCtrl",
                    templateUrl: "../bundles/PropiedadHorizontalBundle/CrearPropiedadHorizontal/crearPropiedadHorizontal.tpl.html",
                }
            },
        });
    }
])
.controller("crearpropiedadhorizontalCtrl",  ["$scope", "root", "$http", "$stateParams", "$window",
function ($scope, root, $http, $stateParams, $window) {   
        $scope.notificacion_radicado = '';
        
        // Funcion que inicia la solicitud de radicacion
        $scope.crearPH = function () {
            var expediente = $('#expediente').val();
            var estado = $('#estado').val();
            var nit = $('#nit').val();
            var nombre = $('#nombre').val();
            var direccion = $('#direccion').val();
            var numero_escritura_publica = $('#numero_escritura_publica').val();
            var fecha_escritura_publica = $('#fecha_escritura_publica').val();
            var numero_matricula = $('#numero_matricula').val();
            var fecha_certificado_tradicion = $('#fecha_certificado_tradicion').val();
            var notaria = $('#notaria').val();
            var numero_anotacion = $('#numero_anotacion').val();
            var fecha_anotacion = $('#fecha_anotacion').val();
            var resolucion_personeria_juridica = $('#resolucion_personeria_juridica').val();
            var fecha_resolucion_personeria_juridica = $('#fecha_resolucion_personeria_juridica').val();
            var personeria_juridica_expedida_por = $('#personeria_juridica_expedida_por').val();
            var nit_empresa_administradora = $('#nit_empresa_administradora').val();
            var cedula_representante_legal = $('#cedula_representante_legal').val();
            var expedida_representante_legal = $('#expedida_representante_legal').val();
            var nombre_representante_legal = $('#nombre_representante_legal').val();
            var periodo_representante_legal = $('#periodo_representante_legal').val();
            var representante_legal_firma = $('#representante_legal_firma').val();
            var resolucion_representante_legal = $('#resolucion_representante_legal').val();
            var fecha_resolucion_representante_legal = $('#fecha_resolucion_representante_legal').val();
            var resolucion_expedida_por = $('#resolucion_expedida_por').val();
            var numero_acta = $('#numero_acta').val();
            var acta_expedida_por = $('#acta_expedida_por').val();
            var tipo_persona = $('#tipo_persona').val();

            if (expediente == undefined || expediente == '') {
                alert("¡Debe ingresar el expediente de la propiedad para continuar!");
            }
            else if (nombre == undefined || nombre == '') {
                alert("¡Debe ingresar el nombre de la propiedad para continuar!");
            }
            else if (direccion == undefined || direccion == '') {
                alert("¡Debe ingresar la direccion de la propiedad para continuar!");
            }
            else if (numero_escritura_publica == undefined || numero_escritura_publica == '') {
                alert("¡Debe ingresar el número de la escritura pública de la propiedad para continuar!");
            }
            else if (fecha_escritura_publica == undefined || fecha_escritura_publica == '') {
                alert("¡Debe ingresar la fecha de la escritura pública de la propiedad para continuar!");
            }
            else if (numero_matricula == undefined || numero_matricula == '') {
                alert("¡Debe ingresar el numero de matricula de la propiedad para continuar!");
            }
            else if (fecha_certificado_tradicion == undefined || fecha_certificado_tradicion == '') {
                alert("¡Debe ingresar la fecha de certificado de para continuar!");
            }
            else if (notaria == undefined || notaria == '') {
                alert("¡Debe ingresar la notaria para continuar!");
            }
            else if (numero_anotacion == undefined || numero_anotacion == '') {
                alert("¡Debe ingresar el numero de anotacion para continuar!");
            }
            else if (fecha_anotacion == undefined || fecha_anotacion == '') {
                alert("¡Debe ingresar la fecha de la anotacion para continuar!");
            }
            else if (fecha_resolucion_personeria_juridica == undefined || fecha_resolucion_personeria_juridica == '') {
                alert("¡Debe ingresar la fecha resolucion personeria juridica para continuar!");
            }
            else if (cedula_representante_legal == undefined || cedula_representante_legal == '') {
                alert("¡Debe ingresar la cedula representante legal para continuar!");
            }
            else if (expedida_representante_legal == undefined || expedida_representante_legal == '') {
                alert("¡Debe ingresar la ciudad de expedicion del documento del representante legal para continuar!");
            }
            else if (nombre_representante_legal == undefined || nombre_representante_legal == '') {
                alert("¡Debe ingresar el nombre del representante legal para continuar!");
            }
            else if (periodo_representante_legal == undefined || periodo_representante_legal == '') {
                alert("¡Debe ingresar el periodo del representante legal para continuar!");
            }
            else if (resolucion_representante_legal == undefined || resolucion_representante_legal == '') {
                alert("¡Debe ingresar la resolucion del representante legal para continuar!");
            }
            else if (fecha_resolucion_representante_legal == undefined || fecha_resolucion_representante_legal == '') {
                alert("¡Debe ingresar la fecha de la resolucion del representante legal para continuar!");
            }
            else if (resolucion_expedida_por == undefined || resolucion_expedida_por == '') {
                alert("¡Debe ingresar por quien fue expedida la resolucion para continuar!");
            }
            else if (numero_acta == undefined || numero_acta == '') {
                alert("¡Debe ingresar el numero de acta para continuar!");
            }
            else if (acta_expedida_por == undefined || acta_expedida_por == '') {
                alert("¡Debe ingresar donde fue expedida el acta para continuar!");
            }
            else if (tipo_persona == undefined || tipo_persona == '') {
                alert("¡Debe seleccionar el tipo de Plantilla para continuar!");
            }
            else {
                var confirmacion = confirm("¿Desea crear la propiedad horizontal "+nombre+"?");

                // Verifica la respuesta del usuario
                if (confirmacion) {
                
                    $(".overlap_espera").show();
                    $(".overlap_espera_1").show();
                    $http.post(root+"propiedadhorizontal/crear_editar_propiedad_horizontal", 
                    {   modulo: 2,
                        id: null,
                        expediente: expediente, 
                        estado: estado,
                        nit: nit, 
                        nombre: nombre, 
                        direccion: direccion, 
                        numero_escritura_publica: numero_escritura_publica, 
                        fecha_escritura_publica: fecha_escritura_publica, 
                        numero_matricula: numero_matricula, 
                        fecha_certificado_tradicion: fecha_certificado_tradicion, 
                        notaria: notaria, 
                        numero_anotacion: numero_anotacion, 
                        fecha_anotacion: fecha_anotacion, 
                        resolucion_personeria_juridica: resolucion_personeria_juridica, 
                        fecha_resolucion_personeria_juridica: fecha_resolucion_personeria_juridica, 
                        personeria_juridica_expedida_por: personeria_juridica_expedida_por, 
                        nit_empresa_administradora: nit_empresa_administradora, 
                        cedula_representante_legal: cedula_representante_legal, 
                        expedida_representante_legal: expedida_representante_legal, 
                        nombre_representante_legal: nombre_representante_legal, 
                        periodo_representante_legal: periodo_representante_legal, 
                        representante_legal_firma: representante_legal_firma, 
                        resolucion_representante_legal: resolucion_representante_legal, 
                        fecha_resolucion_representante_legal: fecha_resolucion_representante_legal, 
                        resolucion_expedida_por: resolucion_expedida_por, 
                        numero_acta: numero_acta, 
                        acta_expedida_por: acta_expedida_por,
                        tipo_persona: tipo_persona
                    })
                    .success(function(data){
                        console.log(data);
                        
                        if (data.success) {
                            // Redirigir a la nueva URL
                            $scope.notificacion_radicado = 'La propiedad horizontal '+nombre+' se ha creado con exito.';
                        }
                        else {
                            alert(data.msg);
                        }
                        //Desactiva el div de carga 
                        $(".overlap_espera").fadeOut(500, "linear");
                        $(".overlap_espera_1").fadeOut(500, "linear"); 
                    })
                    .error(function(err){
                        console.log(err);
                    });
                }
            }
        }
        
    }
]);