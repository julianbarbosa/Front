saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("editar-propiedad-horizontal", {
            url: "/propiedadhorizontal/editar/:idpropiedadhorizontal",
            views: {
                "main": {
                    controller: "editarpropiedadhorizontalCtrl",
                    templateUrl: "../bundles/PropiedadHorizontalBundle/EditarPropiedadHorizontal/editarPropiedadHorizontal.tpl.html",
                }
            },
        });
    }
])
.controller("editarpropiedadhorizontalCtrl", ["$scope", "root", "$http", "$stateParams", "$window",
function ($scope, root, $http, $stateParams, $window) {    
        
        $(".overlap_espera").show();
        $(".overlap_espera_1").show(); 
        $scope.nombrePropiedadHorizontal = '';
        $scope.notificacion_radicado = '';
        $scope.idpropiedadhorizontal = $stateParams.idpropiedadhorizontal;
        console.log($scope.idpropiedadhorizontal);

        $http.post(root+"propiedadhorizontal/validar_propiedad_horizontal", {id: $scope.idpropiedadhorizontal})
            .success(function(data){
                console.log(data);

                if (data.msg == "Ingreso correctamente") {
                    $scope.numeroIdent = data.propiedadHorizontal['id'];
                    $scope.expediente = data.propiedadHorizontal['expediente'];
                    $scope.nit = data.propiedadHorizontal['nit'];
                    $scope.nombrePropiedadHorizontal = data.propiedadHorizontal['nombre'];
                    $scope.direccionPropiedadHorizontal = data.propiedadHorizontal['direccion'];
                    $scope.nombreRepresentanteLegal = data.propiedadHorizontal['nombreRepresentanteLegal'];
                    $scope.representanteLegalFirma = data.propiedadHorizontal['representanteLegalFirma'];
                    $scope.nitEmpresaAdministradora = data.propiedadHorizontal['nitEmpresaAdministradora'];
                    $scope.cedulaRepresentanteLegal = data.propiedadHorizontal['cedulaRepresentanteLegal'];
                    $scope.expedidaRepresentanteLegal = data.propiedadHorizontal['expedidaRepresentanteLegal'];
                    $scope.resolucionPersoneriaJuridica = data.propiedadHorizontal['resolucionPersoneriaJuridica'];
                    $scope.fechaResolucionPersoneriaJuridica = data.propiedadHorizontal['fechaResolucionPersoneriaJuridica'];
                    $scope.personeriaJuridicaExpedidaPor = data.propiedadHorizontal['personeriaJuridicaExpedidaPor'];
                    $scope.fechaResolucionRepresentanteLegal = data.propiedadHorizontal['fechaResolucionRepresentanteLegal'];
                    $scope.periodoRepresentanteLegal = data.propiedadHorizontal['periodoRepresentanteLegal'];
                    $scope.resolucionRepresentanteLegal = data.propiedadHorizontal['resolucionRepresentanteLegal'];
                    $scope.resolucionExpedidaPor = data.propiedadHorizontal['resolucionExpedidaPor'];
                    $scope.numeroActa = data.propiedadHorizontal['numeroActa'];
                    $scope.actaExpedidaPor = data.propiedadHorizontal['actaExpedidaPor'];
                    $scope.numeroEscrituraPublica = data.propiedadHorizontal['numeroEscrituraPublica'];
                    $scope.fechaEscrituraPublica = data.propiedadHorizontal['fechaEscrituraPublica'];
                    $scope.notaria = data.propiedadHorizontal['notaria'];
                    $scope.fechaCertificadoTradicion = data.propiedadHorizontal['fechaCertificadoTradicion'];
                    $scope.numeroMatricula = data.propiedadHorizontal['numeroMatricula'];
                    $scope.numeroAnotacion = data.propiedadHorizontal['numeroAnotacion'];
                    $scope.fechaAnotacion = data.propiedadHorizontal['fechaAnotacion'];
                    $scope.tipoPersona = data.propiedadHorizontal['tipoPersona'];
                    console.log(data.propiedadHorizontal);
                    $scope.notificacion = '';
                    $('#estado').val(data.propiedadHorizontal['estado']);
                    
                }
                else {
                    $scope.notificacion = data.msg;
                    $scope.resultadosConsulta = '';  
                }
                
                //Desactiva el div de carga 
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");  

            })
            .error(function(err){
                console.log(err);
            });

        // Funcion que inicia la solicitud de radicacion
        $scope.actualizarPH = function () {
            var id = $('#id').val();
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
            else if (resolucion_personeria_juridica == undefined || resolucion_personeria_juridica == '') {
                alert("¡Debe ingresar el número de la escritura pública de la propiedad para continuar!");
            }
            else if (fecha_resolucion_personeria_juridica == undefined || fecha_resolucion_personeria_juridica == '') {
                alert("¡Debe ingresar la fecha de la escritura pública de la propiedad para continuar!");
            }
            else if (personeria_juridica_expedida_por == undefined || personeria_juridica_expedida_por == '') {
                alert("¡Debe ingresar el numero de matricula de la propiedad para continuar!");
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
            else if (resolucion_expedida_por == undefined || resolucion_expedida_por == '') {
                alert("¡Debe ingresar por quien fue expedida la resolucion para continuar!");
            }
            else if (numero_acta == undefined || numero_acta == '') {
                alert("¡Debe ingresar el numero de acta para continuar!");
            }
            else if (acta_expedida_por == undefined || acta_expedida_por == '') {
                alert("¡Debe ingresar donde fue expedida el acta para continuar!");
            }
            else {
                var confirmacion = confirm("¿Desea actualizar la propiedad horizontal "+nombre+"?");

                // Verifica la respuesta del usuario
                if (confirmacion) {
                
                    $(".overlap_espera").show();
                    $(".overlap_espera_1").show(); 
                    $http.post(root+"propiedadhorizontal/crear_editar_propiedad_horizontal", 
                    {   modulo: 1,
                        id: id, 
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
                        acta_expedida_por: acta_expedida_por
                    })
                    .success(function(data){
                        console.log(data);
                        
                        if (data.success) {
                            // Redirigir a la nueva URL
                            $scope.notificacion_radicado = 'La actualización de la propiedad horizontal '+nombre+' se ha realizado con exito.';
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