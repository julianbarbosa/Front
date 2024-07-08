saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-buscarcomparendo", {
            url: "/controlpolicivo/buscarcomparendo/:idProgramacionPedagogia",
            views: {
                "main": {
                    controller: "ControlPolicivoBuscarComparendoCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/buscarComparendo/buscarComparendo.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoBuscarComparendoCtrl", ["root","$scope", "$http", "$uibModal", "ComparendoAll", "$filter", "$stateParams", "root", "AnularPedagogiasActivas", "LoadingOverlap", "Upload",
    function (root, $scope, $http, $uibModal, ComparendoAll, $filter, $stateParams, root, AnularPedagogiasActivas, LoadingOverlap, Upload) {
        $scope.idProgramacionPedagogia = $stateParams.idProgramacionPedagogia;
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.headers = [
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false, width: '5%',
                values: [
                    {'icon': '<i class="ver-detalle fa fa-pencil-square-o" title="Ver Historial Comparendo"></i>', 'link': '#!/controlpolicivo/consultarcomparendo/'},
                    {'icon': '<i class="fa fa-ban text-danger" title="Anular Programación Pedagogia"></i>', 'style':'text-danger', action: 'anular'},
                    {'icon': '<i class="fa fa-cloud-upload text-success" title="Subir Expediente"></i>', 'style':'text-danger', action: 'openModalSubirExpediente', permission: 'subirarchivos_controlpolicivo', condition: "row['documentoExpediente']=='null' || row['documentoExpediente']==null"},
                    {'icon': '<i class="fa fa-eye text-warning" title="Ver Expediente"></i>', 'style':'text-warning', action: 'verExpediente', permission: 'subirarchivos_controlpolicivo', condition: "row['documentoExpediente']!=='null' && row['documentoExpediente']!==null"},
                    {'icon': '<i class="fa fa-times text-secondary" title="Eliminar Expediente"></i>', 'style':'text-warning', action: 'eliminarExpediente', permission: 'subirarchivos_controlpolicivo', condition: "row['documentoExpediente']!=='null' && row['documentoExpediente']!==null"},
                    {'icon': '<i class="fa fa-money text-success" title="Crear Recibo Pago"></i>', style:'text-danger', action: 'openModalAcuerdoPago', permission: 'subirarchivos_controlpolicivo', condition: "row['documentoExpediente']=='null' || row['documentoExpediente']==null"},
					{'icon': '<i class="fa fa-calendar text-warning" title="Aumentar días ProntoPago"></i>', style:'text-danger', action: 'openModalProntoPago', permission: 'subirarchivos_controlpolicivo', condition: "row['documentoExpediente']=='null' || row['documentoExpediente']==null"},
					{'icon': '<i class="fa fa-user text-secondary" title="Modificar Infractor"></i>', style:'text-danger', action: 'openModalModificarInfractor', permission: 'subirarchivos_controlpolicivo'}
                ],
                options: [
                    {'value': 0, nameValidate: 'estaEnviado', 'name': 'No Enviado', 'link': '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>'}
                ]
            },
            {type:'text', name: 'numeroFormato', name2: '', title: 'Num Comparendo', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting',input: false, width: '5%'},
            {type:'text', name: 'identificacion', name2: '', title: 'Identificación', header_align: 'text-center', body_align: 'text-center',input: false, sorting: 'sorting', width: '5%'},
            {type:'text', name: 'nombreInfractor', title: 'Nombre Infractor', header_align: 'text-center', body_align: 'text-center',input: false, sorting: 'sorting', width:'40%'},
            {type:'date', name: 'fechaComparendo', title: 'Fecha Comparendo', header_align: 'text-center', body_align: 'text-center',input: false, width:'20%'},
        ];

        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};

            $scope.validator.alert.content = data.msg ;

            if(data.success===true) {
                $scope.validator.alert.type = 'alert-success';
                $scope.validator.alert.title = "Exito: ";
            } else {
                $scope.validator.alert.type = 'alert-danger';
                $scope.validator.alert.title = "Advertencia: ";
            }
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        };

        $scope.actualizarDatos = function ()
        {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            var identificacion = $scope.busqueda.identificacion;
            if(angular.isUndefined($scope.busqueda.identificacion)) {
                identificacion = '0';
            }
            ComparendoAll.get({id:identificacion,'numeroFormato':$scope.busqueda.comparendo}).$promise.then(function (response) {
                $scope.data = response['data'];
                $scope.totalItems = response['totalItems'];
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            });
        };

        $scope.verExpediente = function (comparendo)
        {
            window.open(root+'../upload/documentos/'+comparendo.documentoExpediente);
        };

        $scope.ordenarPor = function (name)
        {
            $scope.orderBy = name;
            $scope.actualizarDatos();
        }

        $scope.caller = function (funcion, item) {
            $scope.$eval(funcion).call([], item);
        };

        $scope.inscribirAPedagogia = function(idComparendo) {
            bootbox.prompt("Ingrese la justificación para inscribir al infractor a la pedagogía?",
                function (result) {
                    $http.post(root+"controlpolicivo/pedagogiacomparendo/"+idComparendo+"/"+$scope.idProgramacionPedagogia, {'justificacion':result}).then(function (result) {
                        bootbox.alert({
                            message: result.data.msg,
                            size: 'small'
                        });
                    });
            });
        }

        $scope.eliminarExpediente = function(comparendo) {
            bootbox.confirm("Confirma que desea eliminar el expediente ?",
                function (result) {
                    if (result) {
                        LoadingOverlap.show($scope);
                        $http.post(root+"controlpolicivo/eliminarexpediente/"+comparendo.id).then(function (result) {
                            LoadingOverlap.hide($scope);
                            if(result.data.success==true) {
                                comparendo.documentoExpediente = null;
                            }
                            bootbox.alert({
                                message: result.data.msg,
                                size: 'small'
                            });
                        });
                    }
            });
        }


        $scope.actualizar = function (item) {
            bootbox.confirm("Confirma que desea <strong><span class='text-warning'>ACTUALIZAR</span></strong> este comparendo por inconsistencia en la cedula "+item.identificacion+" y nombre "+item.nombreInfractor,
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result) {
                        ComparendosPorVerificar.save({data: {'id': item.id,'datosCorrectos': 2}}).$promise.then(function (response) {
                            $scope.result = response.data;
                            callback(response);
                            if (response.success) {
                                $scope.actualizarDatos();
                            }
                            $scope.isSuccess = true;
                        });
                    }
                });
        };

        $scope.anular = function (item) {

            bootbox.confirm("Confirma que desea <strong><span class='text-danger'>ANULAR</span></strong> las pedagogías asociadas a este comparendo del siguiente infractor: cedula "+item.identificacion+" y nombre "+item.nombreInfractor,
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result) {
                        LoadingOverlap.show($scope);
                        AnularPedagogiasActivas.get(item.id).then(function (response) {
                            callback(response);
                            LoadingOverlap.hide($scope);
                        });
                    }
                });
        };

        $scope.aprobar = function (item) {
            console.log(item.id);
            bootbox.confirm("Confirma que desea realizar <strong><span class='text-success'>APROBAR</span></strong> este comparendo? "+item.nombreInfractor,
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result) {
                         ComparendosPorVerificar.save({data: {'id': item.id,'datosCorrectos': true}}).$promise.then(function (response) {
                            $scope.result = response.data;
                            $scope.data.splice($scope.data.indexOf(item), 1);
                            callback(response);
                            if (response.success) {
                                $scope.data.splice($scope.data.indexOf(item), 1);
                            }
                            $scope.isSuccess = true;
                        });
                    }
                });
        };

		
		
        $scope.openModalSubirExpediente = function (comparendo) {
            $scope.modalInstance = $uibModal.open({
                templateUrl: '../bundles/ControlPolicivoBundle/buscarComparendo/subirExpediente.tpl.html',
                resolve: {
                    comparendo: function () {
                        return comparendo;
                    }
                },
                controller: ['$scope','$uibModalInstance', 'comparendo',
                function($scope,$uibModalInstance, comparendo) {
                    $scope.cerrarModalSubirExpediente = function() {
                         $uibModalInstance.close();
                    };

                    //files
                    $scope.files = [];
                    $scope.$on("fileSelected", function (event, args) {
                        $scope.$apply(function () {
                            $scope.files[0] = args.file;
                        });
                    });
                    //files

                    $scope.uploadExpediente = function () {
                        LoadingOverlap.show($scope);
                        Upload.upload({
                            url: root+'controlpolicivo/subirexpedientecomparendo',
                            data: {
                                file: $scope.files,
                                data: comparendo.id
                            }
                        }).then(function (response) {
                            comparendo.documentoExpediente = response.data.file;
                            $uibModalInstance.close();
                            bootbox.alert({
                                message: response.data.msg,
                                size: 'small'
                            });
                            LoadingOverlap.hide($scope);
                        });
                    };
                }],
                size: 'large'
            }).closed.then(function () {

            });
        };

		$scope.openModalProntoPago = function(comparendo) {
			bootbox.prompt({
				title: "Ingrese la cantidad de días que se desea dar para  prontopago. Infractor: "+comparendo.nombreInfractor,
				inputType: 'date',
				callback: function (result) {
					$http.post(root+'controlpolicivo/modificarcomparendo',{'id':comparendo.id, 'fechaProntoPago':result}).then(function (result) {                
					   bootbox.alert({
							message: result.data.msg,
							size: 'small'
						});
						$scope.limpiar(); 
					});
				}
			});
		}
		
		$scope.openModalModificarInfractor = function(comparendo) {
			window.open('#!/controlpolicivo/modificartercero/'+comparendo.id);
		}
		
        $scope.openModalAcuerdoPago = function (comparendo) {
            window.open('#!/controlpolicivo/crearrecibopago/'+comparendo.id);
        };




    }
]);
