saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-registrarmovimiento", {
            url: "/controlsanciones/registrarmovimiento/:id",
            views: {
                "main": {
                    controller: "ControlPolicivoRegistrarMovimientoExpedienteCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/registrarMovimientoExpediente/registrarMovimientoExpediente.tpl.html"
                }
            }
        })
    }
]).controller("ControlPolicivoRegistrarMovimientoExpedienteCtrl", ["root","$scope", "$http", "ComparendoExpediente", "$stateParams", "root", "ComportamientoContrario",
    function (root, $scope, $http, Comparendo, $stateParams, root, ComportamientoContrario) {
        $scope.busqueda = {};
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.showHistory=-1;
        $scope.data = {};
		$scope.root = root;
		$scope.estadoRevision = false; 
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.criteriosVerificacion = [{'id':1, 'nombre': 'Debe contener numero de decisión o TRD'},
										{'id':2, 'nombre': 'Debe coincidir la dirección del comparendo con la dirección en la decisión.'},
										{'id':3, 'nombre': 'La fecha de decisión debe ser la misma de la constancia de ejecutoria.'},
										{'id':4, 'nombre': 'El infractor debe estar plenamente identificado en la decisión.'},
										{'id':5, 'nombre': 'La decision debe ser realizada en un día habil'},
                                        {'id':6, 'nombre': 'La sanción debe conicidir el valor de multa en letras o números.'},
                                        {'id':7, 'nombre': 'La constancia ejecutoria debe contener la fecha de firmeza claramente.'},
										{'id':8, 'nombre': 'El TRD o Decisión debe coincidir en la ejecutoria y decisión.'},
										{'id':9, 'nombre': 'El número de comparendo debe coincidir en la decisión.'},
										{'id':10, 'nombre': 'Falta firma del inspector.'},
										{'id':11, 'nombre': 'Nombre y/o cédula no coincide con lo registrado en el RNMC.'}];
        $scope.headers = [
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false, width: '5%',
                values: [
                    {'icon': '<i class="ver-detalle fa fa-pencil-square-o" title="Ver Historial Comparendo"></i>', 'link': '#!/controlpolicivo/consultarcomparendo/'},
                    {'icon': '<i class="fa fa-ban text-danger" title="Anular Programación Pedagogia"></i>', 'style':'text-danger', action: 'anular'},
                    {'icon': '<i class="fa fa-cloud-upload text-success" title="Subir Expediente"></i>', 'style':'text-danger', action: 'openModalSubirExpediente', permission: 'subirarchivos_controlpolicivo', condition: "row['documentoExpediente']=='null' || row['documentoExpediente']==null"},
                    {'icon': '<i class="fa fa-eye text-warning" title="Ver Expediente"></i>', 'style':'text-warning', action: 'verExpediente', permission: 'subirarchivos_controlpolicivo', condition: "row['documentoExpediente']!=='null' && row['documentoExpediente']!==null"},
                    {'icon': '<i class="fa fa-times text-secondary" title="Eliminar Expediente"></i>', 'style':'text-warning', action: 'eliminarExpediente', permission: 'subirarchivos_controlpolicivo', condition: "row['documentoExpediente']!=='null' && row['documentoExpediente']!==null"},
                    {'icon': '<i class="fa fa-money text-success" title="Crear Recibo Acruerdo Pago"></i>', style:'text-danger', action: 'openModalAcuerdoPago', permission: 'subirarchivos_controlpolicivo', condition: "row['documentoExpediente']=='null' || row['documentoExpediente']==null"}

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

        $scope.getComportamientosContrarios = function (viewValue, idPadre) {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            return ComportamientoContrario.query({"clave": viewValue, 'idPadre': idPadre}).
                $promise.then(function (response) {
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
                    if (response.length == 0) {
                       console.log("no encontró resultados");
                    }
                    return response.map(function (item) {
                        return item;
                    });
                });
        };
		
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

        $scope.setEstadoRevision = function() {
			$scope.estadoRevision = true;
			angular.forEach($scope.criteriosVerificacion, function (value, key) {			
				if(value.checked!==true) {
					$scope.estadoRevision = false;
				}
			});
			if($scope.estadoRevision==true) {
				$scope.data.comentario = "";
			}
		}

		$scope.generarTextoDevolucion = function () {		
			var text = '';
			angular.forEach($scope.criteriosVerificacion, function (value, key) {			
				if(value.checked!==true) {
					text += value.nombre + ', ';
				}
			});
			$scope.data.comentario = text;
		}

        $scope.obtenerEsMultaEspecial= function(expediente) {           
            return $scope.comparendo.expediente.substr(0,8)=='76-001-1' ? true : false;
        }
		
       
        
        $scope.actualizarDatos = function ()
        {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            var idInterno = angular.isUndefined($scope.busqueda.idInterno) ||  $scope.busqueda.idInterno==''?'0':$scope.busqueda.idInterno;                
            var numeroFormato = angular.isUndefined($scope.busqueda.comparendo) || $scope.busqueda.comparendo==''?'0':$scope.busqueda.comparendo;
            Comparendo.get({'idInterno':idInterno, 'numeroFormato':numeroFormato}).$promise.then(function (response) {                
                if(response.success==true) {                    
                    $scope.comparendo = response.data;                        
                    $http.get(root+'comparendo/expediente/get/'+$scope.comparendo.id).then(function (result) {
                        console.log(result);
                        $scope.expediente = result.data;
                        $scope.esMultaEspecial = $scope.obtenerEsMultaEspecial($scope.expediente);                      
                        $http.get(root+'controlsanciones/responsables').then(function (result) {
                            $scope.responsables = result.data;
                            $(".overlap_espera").fadeOut(500, "linear");
                            $(".overlap_espera_1").fadeOut(500, "linear");                
                        });                        
                    });      
                    $http.get(root+'controlsanciones/movimientocomparendo/'+$scope.comparendo.id).then(function (result) {
                        $scope.historial = result.data;
                    });       
                    $http.get(root+'comparendo/pago/get/'+$scope.comparendo.id).then(function (result2) {
                        $scope.pago = result2.data.dataPago;
						$scope.idComparendoXProgramacionPedagogia = result2.data.idComparendoXProgramacionPedagogia;						
                    });     
                } else {
                    bootbox.alert({
                        message: response.msg,
                        size: 'small'
                    });   
                    $scope.busqueda = {};                 
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
    
                }                
            });     
        };
        
        if($stateParams.id !== undefined && $stateParams.id>0) {
            $scope.busqueda.idInterno = $stateParams.id ;
            $scope.actualizarDatos();
        }

        $scope.registrarMovimiento = function(codigoEstado, dataForm) {            
            
            $http.post(root+'controlsanciones/registrarmovimiento',{idComparendo:$scope.comparendo.id, data:dataForm, comentario: $scope.comentario, estado: codigoEstado}).then(function (result) {
                bootbox.alert({
                    message: result.data.msg,
                    size: 'small'
                });
                $scope.limpiar();                
            });
        }
        $scope.limpiar = function() {
            $scope.data = {};
            $scope.historial = {};
            $scope.comparendo = null;
            $scope.expediente = null;
            $scope.busqueda =null; 
			angular.forEach($scope.criteriosVerificacion, function (value, key) {			
				$scope.criteriosVerificacion[key].checked = false;
			});
        }
        $scope.consultarPermisos = function () {
            $scope.permisos = [];            
            $http.get(root+'usuario/permisos',{}).then(function (result) {                
                console.log(result);
                angular.forEach(result.data.permisos, function(value, key) {
                    $scope.permisos[value] = true
                });
                $scope.userId = result.data.id+'';
            });

        };
        $scope.consultarPermisos();

        $scope.verExpediente = function (comparendo)
        {
            window.open(root+'../upload/documentos/'+comparendo.documentoExpediente);
        };

        $scope.ordenarPor = function (name)
        {
            $scope.orderBy = name;
            $scope.actualizarDatos();
        }
    }
]);
