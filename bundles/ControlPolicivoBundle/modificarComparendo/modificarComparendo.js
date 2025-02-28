saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-modificarcomparendo", {
            url: "/controlpolicivo/modificarcomparendo",
            views: {
                "main": {
                    controller: "ControlPolicivoModificarComparendoCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/modificarComparendo/modificarComparendo.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoModificarComparendoCtrl", ["root","$scope", "$http", "$uibModal", "ComparendoExpediente", "$filter", "$stateParams", "root", "AnularPedagogiasActivas", "LoadingOverlap", "Upload", "ComportamientoContrario",
    function (root, $scope, $http, $uibModal, Comparendo, $filter, $stateParams, root, AnularPedagogiasActivas, LoadingOverlap, Upload, ComportamientoContrario) {
        $scope.idProgramacionPedagogia = $stateParams.idProgramacionPedagogia;
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.showHistory=-1;
        $scope.data = {};
		$scope.root = root;
		$scope.estadoRevision = false; 
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        

        
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
            var idInterno = angular.isUndefined($scope.busqueda.idInterno) ||  $scope.busqueda.idInterno==''?'0':$scope.busqueda.idInterno;                
            var numeroFormato = angular.isUndefined($scope.busqueda.comparendo) || $scope.busqueda.comparendo==''?'0':$scope.busqueda.comparendo;
            Comparendo.get({'idInterno':idInterno, 'numeroFormato':numeroFormato}).$promise.then(function (response) {                
                if(response.success==true) {                    
                    $scope.comparendo = response.data;                        
                    $http.get(root+'comparendo/expediente/get/'+$scope.comparendo.id).then(function (result) {
                        console.log(result);
                        $scope.expediente = result.data;
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
                        $scope.pago = result2.data.data;						
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
        
        $scope.limpiar = function() {
            $scope.data = {};
            $scope.comparendo = null;
            $scope.expediente = null;
            $scope.busqueda =null; 
			angular.forEach($scope.criteriosVerificacion, function (value, key) {			
				$scope.criteriosVerificacion[key].checked = false;
			});
        }
		
		$scope.modificarComparendo = function() {
            $scope.data.comparendoId = $scope.comparendo.id;
			$http.post(root+'controlpolicivo/modificarcomparendo',$scope.data).then(function (result) {                
               bootbox.alert({
                    message: result.data.msg,
                    size: 'small'
                });
                $scope.limpiar(); 
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

        $scope.ordenarPor = function (name)
        {
            $scope.orderBy = name;
            $scope.actualizarDatos();
        }
        
        $scope.consultarInspecciones = function () {
            $http.get(root+'controlpolicivo/inspector/getall',{}).then(function (result) {                                            
                $scope.inspecciones = result.data.data;
            });
        };
        $scope.consultarInspecciones();
    }
]);
