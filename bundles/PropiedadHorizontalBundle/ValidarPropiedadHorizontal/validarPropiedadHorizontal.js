saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("validar-propiedad-horizontal", {
            url: "/propiedadhorizontal/validar/:idpropiedadhorizontal",
            views: {
                "main": {
                    controller: "validarPropiedadHorizontalCtrl",
                    templateUrl: "../bundles/PropiedadHorizontalBundle/ValidarPropiedadHorizontal/validarPropiedadHorizontal.tpl.html"
                }
            }
        });
    }
]).controller("validarPropiedadHorizontalCtrl", ["$scope", "root", "$http", "$stateParams", "$window",
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
                    $scope.tipoPersona = data.propiedadHorizontal['tipoPersona'];
                    $scope.estado = data.propiedadHorizontal['estado'];
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
                    console.log(data.propiedadHorizontal);
                    $scope.notificacion = '';
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
        $scope.solicitarCertificado = function ($numeroIdent, $tipoTramite) {
            
            if ($numeroIdent == undefined) {
                alert("Debe consultar un propiedad horizontal para continuar");
            }
            else {
                $(".overlap_espera").show();
                $(".overlap_espera_1").show();

                $http.post(root+"propiedadhorizontal/radicar_solicitud", {numeroIdent: $numeroIdent, tramite: $tipoTramite})
                .success(function(data){
                    console.log(data);
                    
                    
                    if (data.error) {
                        // Redirigir a la nueva URL
                        window.location.href = '/saul/login_funcionario';
                    }
                    else if (data.data.numRadicado) {
                        $scope.notificacion_radicado = 'Su solicitud ha sido radicada con el número '+data.data.numRadicado;
                        //Desactiva el div de carga 
                        $(".overlap_espera").fadeOut(500, "linear");
                        $(".overlap_espera_1").fadeOut(500, "linear"); 
                    }
                })
                .error(function(err){
                    console.log(err);
                });
            }

        };

        // Funcion que notifica al usuario que el servicio esta temporalmene
        $scope.solicitarCertificadoTemporal = function () {
            alert("Estimado ciudadano, \n\nEste servicio estará activo a partir del 15 de enero del 2024.");
        };
    }
]);
