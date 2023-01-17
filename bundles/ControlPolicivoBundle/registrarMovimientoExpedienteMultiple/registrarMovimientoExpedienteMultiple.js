saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-registrarmovimientomultiple", {
            url: "/controlsanciones/registrarmovimientomultiple",
            views: {
                "main": {
                    controller: "ControlPolicivoRegistrarMovimientoExpedienteMultipleCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/registrarMovimientoExpedienteMultiple/registrarMovimientoExpedienteMultiple.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoRegistrarMovimientoExpedienteMultipleCtrl", ["root","$scope", "$http", "$uibModal", "ComparendoExpediente", "$filter", "$stateParams", "root", "AnularPedagogiasActivas", "LoadingOverlap", "Upload",
    function (root, $scope, $http, $uibModal, Comparendo, $filter, $stateParams, root, AnularPedagogiasActivas, LoadingOverlap, Upload) {
        $scope.idProgramacionPedagogia = $stateParams.idProgramacionPedagogia;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 100;
        $scope.maxSize = 5;
        $scope.select = [];
        $scope.showHistory=-1;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.cantidadCheckeado = 0;
        
        
		$scope.consultarCantidadCheckeado = function(dataForm) {
			$scope.cantidadCheckeado = 0;
			angular.forEach(dataForm, function(value, key) {
                if(value.isChecked==true) {
                    $scope.cantidadCheckeado++;
                }
            });
		}
        
        
       

        $scope.actualizarDatos = function (estado, inspeccion)
        {
            console.log($scope.busqueda);
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();   
            // console.log("$scope.busqueda.estado=>".$scope.busqueda.estado); 
            // var estado = angular.isUndefined($scope.busqueda.estado) ||  $scope.busqueda.estado==''?'0':$scope.busqueda.estado;                
             $http.get(root+'controlsanciones/expediente/get?estado='+estado+'&inspeccion='+inspeccion).then(function (result) {
                $scope.data = result.data.data;
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");                                
            });                              
        };

        $scope.registrarMovimiento = function(codigoEstado, dataForm) {    
            var comparendoId = ($scope.comparendo==undefined)?null:$scope.comparendo.id;                         
            $scope.arrayExpedientes = [];
            angular.forEach(dataForm, function(value, key) {
                if(value.isChecked==true) {
                    $scope.arrayExpedientes.push(value.id);
                }
            });
            $http.post(root+'controlsanciones/registrarmovimientomultiple',{idComparendo:comparendoId, data:$scope.arrayExpedientes, comentario: $scope.comentario, estado: codigoEstado}).then(function (result) {
                bootbox.alert({
                    message: result.data.msg,
                    size: 'small'
                });
                $scope.limpiar();
            });
        }

        $scope.generarDocumento = function(codigoDocumento, dataForm) {            
            $scope.limpiar();
            var values = '';
            console.log('dataForm=>',dataForm);
            angular.forEach(dataForm, function(value, key) {
                if(value.isChecked==true) {
                    values = values + value.id + ',';
                }
            });
            window.open(root+'controlsanciones/generardocumento?codigoDocumento='+codigoDocumento+'&data='+values)            
        }

        $scope.limpiar = function() {            
            $scope.data = null
            $scope.busqueda = []; 
        }
        $scope.consultarPermisos = function () {
            $scope.permisos = [];            
            $http.get(root+'usuario/permisos',{}).then(function (result) {                
                console.log(result);
                angular.forEach(result.data.permisos, function(value, key) {
                    $scope.permisos[value] = true
                });
                $scope.userId = result.data.id;
            });
        };
        $scope.consultarPermisos();

        $scope.consultarInspecciones = function () {
            $http.get(root+'controlpolicivo/inspector/getall',{}).then(function (result) {                                            
                $scope.inspecciones = result.data.data;
                console.log($scope.inspectores);
            });
        };
        $scope.consultarInspecciones();

        $scope.verExpediente = function (comparendo)
        {
            window.open(root+'../upload/documentos/'+comparendo.documentoExpediente);
        };

        $scope.generarDocumentoDevolucionCSV = function(inspeccion, estado) {
            window.open(root+'controlsanciones/generardevolucioncsv/'+estado+'/'+inspeccion);
        }
        
        $scope.generarDocumentoDevolucion = function(inspeccion, estado) {
            window.open(root+'controlsanciones/generardevolucion/'+inspeccion);
        }
		
		$scope.generarDocumentoEnvioCerradoPorPago = function(inspeccion) {
            window.open(root+'controlsanciones/generarenviocerradoporpago/'+inspeccion);
        }

        $scope.generarFUID = function(estado, idInspeccion) {
            window.open(root+'controlsanciones/generarfuid/'+estado+'/'+idInspeccion);
        }

        $scope.generarBase = function() {
            window.open(root+'controlsanciones/generarbase');
        }

        
        $scope.ordenarPor = function (name)
        {
            $scope.orderBy = name;
            $scope.actualizarDatos();
        }





    }
]);
