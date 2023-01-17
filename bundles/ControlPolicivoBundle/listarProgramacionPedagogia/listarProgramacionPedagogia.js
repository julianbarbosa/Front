saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-listarprogramacionpedagogia", {
            url: "/controlpolicivo/listarprogramacionpedagogia",
            views: {
                "main": {
                    controller: "ControlPolicivoListarProgramacionPedagogiaCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/listarProgramacionPedagogia/listarProgramacionPedagogia.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoListarProgramacionPedagogiaCtrl", ["$scope", "$http", "root", "ProgramacionPedagogia",
    function ($scope, $http, root, ProgramacionPedagogia) {        
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.headers = [
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false,
                values: [
                    {'icon': '<i class="ver-detalle fa fa-plus-circle" title="Agregar Asistente"></i>', 'link': '#!/controlpolicivo/buscarcomparendo/'},
                    {'icon': '<i class="ver-detalle fa fa-hand-paper-o" title="Registrar asistencia"></i>', 'link': '#!/controlpolicivo/registrarasistenciapedagogia/'},
                    {'icon': '<i class="ver-detalle fa fa-pencil" title="Editar la Programación de la Pedagogía"></i>', 'style':'text-danger',  'link': '#!/controlpolicivo/programarpedagogia/'}
                ]                
            },
            {type:'text', name: 'id', name2: '', title: 'Num Programación', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'nombre', title: 'Nombre Pedagogía', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'15%'},
            {type:'text', name: 'lugar', title: 'Lugar Pedagogía', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'30%'},
            {type:'text', name: 'organismo', title: 'Organismo', header_align: 'text-center', body_align: 'text-center', width:'15%'},
			{type:'onlydate', name: 'fecha', title: 'Fecha', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'15%'},                        
            {type:'onlytime', name: 'hora', title: 'Hora', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},                        
            {type:'text', name: 'cupo', title: 'Cupo', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},                        
            {type:'text', name: 'cupoUsado', title: 'Cupo Usado', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'}
            
        ];

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
            ProgramacionPedagogia.query(request).$promise.then(function (response) {
                $scope.data = response['data'];
                $scope.totalItems = response['totalItems'];
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            });
        };
        $scope.actualizarDatos();
        
        $scope.ordenarPor = function (name) 
        {
            $scope.orderBy = name;
            $scope.actualizarDatos();
        }

        $scope.caller = function (funcion, item) {
            $scope.$eval(funcion).call([], item);
        };

        $scope.openModalEditarCupoPedagogia = function (item) {          
            bootbox.prompt(
            {
                title:"Ingrese el nuevo cupo de la pedagogía",
                inputType: 'number',
                value: item.cupo,
                min: item.cupo,
                callback: function (valor) {                    
                    $http.post(root+"controlpolicivo/editarprogramacionpedagogia/"+item.id+"/"+valor)
                    .then(function (result) {
                        if(result.data.success==true) {
                            item.cupo = valor;
                        }
                        bootbox.alert({
                            message: result.data.msg,
                            size: 'small'
                        });
                    });
                }
            });
        };

    }
]);
