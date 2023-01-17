saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("reporte-lineas-demarcacion-lado-manzana", {
            url: "/lineademarcacion/reporte/ladomanzanaxfuncionario",
            views: {
                "main": {
                    controller: "ReporteLineasLadoManzanaXFuncionarioCtrl",
                    templateUrl: "../bundles/LineasBundle/reporteLineasLadoManzanaXFuncionario/reporteLineasLadoManzanaXFuncionario.tpl.html"
                }
            }
        });
    }
]).controller("ReporteLineasLadoManzanaXFuncionarioCtrl", ["$scope", "$http", "root",
    function ($scope, $http, root) {
        
        //Datepicker options
        $scope.dateOptions = {
			formatYear: 'yy',
			maxDate: new Date(2020, 5, 22),
			minDate: new Date(1940, 1, 1),
			startingDay: 1
		};
        
        //Datepicker para fecha incial
		$scope.popup1 = {
			opened: false
		};

		$scope.open1 = function() {
			$scope.popup1.opened = true;
		};
        
        //Datepicker para fecha final
		$scope.popup2 = {
			opened: false
		};		

		$scope.open2 = function() {
			$scope.popup2.opened = true;
		};
        
        
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.headers = [
            {type:'text', name: 'firstName', title: 'Nombres', header_align: 'text-left', body_align: 'text-center', width:'45%'},
            {type:'text', name: 'lastName', title: 'Apellidos', header_align: 'text-center', body_align: 'text-center', width:'45%'},
            {type:'text', name: '1', title: 'Cantidad', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%'}            
        ];

        $scope.actualizarDatos = function ()
        {
            var request = [ {'name': 'currentPage', 'value': $scope.currentPage}, 
                            {'name': 'numPerPage', 'value': $scope.numPerPage},
                            {'name': 'orderBy', 'value': $scope.orderBy}
                            ];
            for (header in $scope.headers) {
                if (typeof $scope.headers[header].value !== 'undefined' && $scope.headers[header].value !== '') {
                    request.push({'name': $scope.headers[header].name, 'value': $scope.headers[header].value});
                }
            }
            $http.get(root+"lineademarcacion/reporte/consultarlineasporfuncionario/"+$scope.fechainicial+"/"+$scope.fechafinal).then(function (response) {
                $scope.data = response['data'];
                $scope.totalItems = response['totalItems'];
            });
        };
        //$scope.actualizarDatos();
        
        $scope.ordenarPor = function (name) 
        {
            $scope.orderBy = name;
            $scope.actualizarDatos();
        }
    }
]);
