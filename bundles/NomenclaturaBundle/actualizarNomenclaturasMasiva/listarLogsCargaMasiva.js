saul.config(["$stateProvider", function($stateProvider){
	$stateProvider.state('logs-carga-masiva',{
		url: '/nomenclatura/logs_carga_masiva/{idProcesoCargaNomenclatura}',
		views:{
			main:{
				controller: 'ListarLogsCargaMasivaCtrl',
				templateUrl: '../bundles/NomenclaturaBundle/actualizarNomenclaturasMasiva/listarLogsCargaMasiva.tpl.html'
			}
		}
	});
}])
.controller('ListarLogsCargaMasivaCtrl', 
	['root','$scope', '$resource','$state', '$stateParams','Upload', 'ListarProcesos', 'ListarLogsProcesoNomenclatura',
	function(root, $scope, $resource, $state, $stateParams, Upload, ListarProcesos, ListarLogsProcesoNomenclatura){

		$scope.log = {};
		$scope.mostarPanelCrud = false;
        /////////////////////////////////////////////////////
        

        $scope.buscar = function(keyCode){
        	if(keyCode == 13){
        		$scope.currentPage = 1;
        		$scope.actualizarDatos();
        	}
        };

        $scope.currentPage = 1;
        $scope.numPerPage = 4;
        $scope.maxSize = 5;
        $scope.orderBy = 'idProcesoCargaNomenclatura';

        $scope.headers = [
            {
            	type: 'action', 
            	name: 'acciones', 
            	title: 'Acciones', 
            	align: 'text-center', 
            	input: false,
                values: [
                    {'icon': '<i class="fa fa-eye" title="Clic para ver"></i>','click': 'toView'}
                ],
                options: []
            },
            {type:'text', name: 'idLogCargaNomenclatura', title: 'Id', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '10%', value: ''},
            {type:'label', name: 'nivelLog', title: 'Tipo Mensaje', values: {1: {text: 'Warning', cssClass:'label-success'}, 2: {text: 'Error', cssClass:'label-danger'}}, header_align: 'text-center', body_align: 'text-center', sorting: false, input: false},
            {type:'text', name: 'dato', title: 'Dato', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', value: ''},
            {type:'text', name: 'respuesta', title: 'Respuesta', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '30%', value: ''},
            {type:'text', name: 'createdAt', title: 'Fecha', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'30%', value: ''}
        ];


        $scope.test = function(item, row){
        	$scope.$eval(item['click']).call([], item,row);
        };

        $scope.toView = function(item, row){
        	$scope.mostarPanelCrud = true;
        	$scope.log = row;
        };

        $scope.actualizarDatos = function () {
        	$scope.numPerPageTemp = $scope.numPerPage;
            var request = [
            	{'name': 'currentPage', 'value': $scope.currentPage}, 
            	{'name': 'idProcesoCargaNomenclatura', 'value': $stateParams.idProcesoCargaNomenclatura}, 
                {'name': 'numPerPage', 'value': $scope.numPerPage},
                {'name': 'orderBy', 'value': $scope.orderBy}
            ];
            for (var header in $scope.headers) {
                if (typeof $scope.headers[header].value !== 'undefined' && $scope.headers[header].value !== '') {
                    request.push({'name': $scope.headers[header].name, 'value': $scope.headers[header].value});
                }
            }

            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

            ListarLogsProcesoNomenclatura.query(request).$promise.then(function (response) {
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");

                $scope.data = response.data;
                $scope.totalItems = response.totalItems;
            });
        };
        
        $scope.ordenarPor = function (name){
            $scope.orderBy = name;
            $scope.actualizarDatos();
        };

        $scope.cancelar = function(){
			$scope.log = {};
			$scope.mostarPanelCrud = false;
        };

        $scope.cambiarNumeroPorPagina = function (keyCode){
        	if(keyCode == 13){
        		$scope.numPerPage = $scope.numPerPageTemp;
        		$scope.currentPage = 1;
        		$scope.actualizarDatos();
        	}
        };

    	$scope.init = function(){
            $(".overlap_espera").fadeOut(500, "linear");
            $(".overlap_espera_1").fadeOut(500, "linear");

            var request = [
            	{name: 'idProcesoCargaNomenclatura', value: $stateParams.idProcesoCargaNomenclatura},
            	{'name': 'numPerPage', 'value': 1}
            ];

        	ListarProcesos.query(request).$promise.then(function (response) {
        		if(response.data.length == 1){
        			$scope.proceso = response.data[0];
                    $scope.proceso.dataMensaje = angular.fromJson(response.data[0].ultimoMensaje);
        		}else{
        			alert('Proceso no existe.');
        		}
            });
            $scope.actualizarDatos();
        };

        $scope.descargarLogs = function(){
            window.open(root+'proceso/descargar_logs/'+$scope.proceso.idProcesoCargaNomenclatura);
        };

        $scope.init();
	}]
)
.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}]);
