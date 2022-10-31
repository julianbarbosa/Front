saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-listarpedagogia", {
            url: "/controlpolicivo/listarpedagogia",
            views: {
                "main": {
                    controller: "ControlPolicivoListarPedagogiaCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/listarPedagogia/listarPedagogia.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoListarPedagogiaCtrl", ["$scope", "Pedagogia",
    function ($scope, Pedagogia) {
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.headers = [
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false,
                values: [
                    {'icon': '<i class="ver-detalle fa fa-pencil-square-o" title="Editar Pedagogía"></i>', 'link': '#!/controlpolicivo/crearpedagogia/'}
                ],
                options: [
                    {'value': 0, nameValidate: 'estaEnviado', 'name': 'No Enviado', 'link': '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>'}
                ]
            },
            {type:'text', name: 'id', name2: '', title: 'Num Solicitud', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'nombre', name2: 'nombre', title: 'Nombre Pedagogía', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%'},
            {type:'text', name: 'descripcion', name2: 'descripcion', title: 'Descripción', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},                        
            {type:'date', name: 'createdAt', title: 'Fecha Creación', header_align: 'text-center', body_align: 'text-center', width:'20%'},
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
            Pedagogia.query(request).$promise.then(function (response) {
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
    }
]);
