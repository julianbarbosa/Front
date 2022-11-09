saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-listarpedagogiasrealizadas", {
            url: "/controlpolicivo/listarpedagogiasrealizadas",
            views: {
                "main": {
                    controller: "ControlPolicivoListarPedagogiasRealizadasCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/ListarPedagogiasRealizadas/ListarPedagogiasRealizadas.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoListarPedagogiasRealizadasCtrl", ["$scope", "$stateParams", "$http", "root",
    function ($scope, $stateParams, $http, root) {
        $scope.id = $stateParams.id;
		$scope.root = root;
		console.log(root);
		$scope.busqueda = {};
        $scope.currentPage = 1;
        $scope.numPerPage = 50;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.tableFilter = false;
        $scope.pagination = false;
        $scope.headers = [
            {type:'text', name: 'id', name2: '', title: 'Num Programación', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'identificacion', title: 'Identificación', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%'},
            {type:'text', name: 'nombre', name2: 'apellido', title: 'Nombre Infractor', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%'},
            {type:'text', name: 'descripcion', title: 'Comportamiento Contrario', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},
            {type:'date', name: 'fechaPedagogia', title: 'Fecha Pedagogía', header_align: 'text-center', body_align: 'text-center', width:'10%'},
			{type:'accion', name: 'id', name2: '', title: 'Certificado', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'}
        ];
       

        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};
            $scope.validator.alert.title = data.title;
            $scope.validator.alert.content = data.msg;
            $scope.validator.alert.type = data.type;
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        };

        $scope.actualizarDatos = function ()
        {
			$(".overlap_espera").show();
			$(".overlap_espera_1").show();
            var request = [ {'name': 'currentPage', 'value': $scope.currentPage},
                            {'name': 'numPerPage', 'value': $scope.numPerPage},
                            {'name': 'orderBy', 'value': $scope.orderBy}
                            ];
            for (header in $scope.headers) {
                if (typeof $scope.headers[header].value !== 'undefined' && $scope.headers[header].value !== '') {
                    request.push({'name': $scope.headers[header].name, 'value': $scope.headers[header].value});
                }
            }
			$http.post(root+'controlpolicivo/asistentesprogramacionpedagogiaxinspeccion/', {"id":$scope.busqueda.inspeccion, "fecha":$scope.busqueda.fecha}).then(function(response) {
				console.log(response);
				$scope.data = response.data.data;
                $scope.totalItems = response.data.totalItems;
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
			});
        };
		
		 $scope.consultarInspecciones = function () {
            $http.get(root+'controlpolicivo/inspector/getall').then(function (result) {                                            
                $scope.inspecciones = result.data.data;
				$scope.inspecciones.unshift({"id":0, "nombre":"Todas"});
            });
        };
        $scope.consultarInspecciones();

        $scope.ordenarPor = function (name)
        {
            $scope.orderBy = name;
            $scope.actualizarDatos();
        }

  
    }
]);
