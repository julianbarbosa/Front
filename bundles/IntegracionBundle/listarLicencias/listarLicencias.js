saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("listar-licencia", {
            url: "/licencia/listar",
            views: {
                "main": {
                    controller: "ListarLicenciaCtrl",
                    templateUrl: "../bundles/IntegracionBundle/listarLicencias/listarLicencias.tpl.html"
                }
            }
        });
    }
]).controller("ListarLicenciaCtrl", ["$scope", "Licencia", "WebService",
    function ($scope, Licencia, WebService) {
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idLicenciaDAPM';
        $scope.webService = WebService.query();
        console.log($scope.webService);
        $scope.headers = [
            {name: 'acciones', title: 'Acciones', align: 'text-center', input: false,
                values: [
                    {'link': '<i class="ver-detalle fa fa-angle-right pull-left" title="Ver información adicional"></i>'},
                ],
                options: [
                    {'value': 0, nameValidate: 'estaEnviado', 'name': 'No Enviado', 'link': '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>'}
                ]
            },
            {name: 'idLicencia', title: 'Licencia', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},
            {name: 'observacion', title: 'Observación', header_align: 'text-left', body_align: 'text-left', width: '50%'},
            {name: 'fechaEnvio', title: 'Fecha Envío', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},
            {name: 'estaEnviado', title: 'Estado Envío', header_align: 'text-center', body_align: 'text-center',
                options: [
                    {'value': 1, 'nameValidate': 'estaEnviado', 'name': 'Enviado', 'link': '<i class="fa fa-check" style="color:green" title="Ver información adicional"></i>'},
                    {'value': 0, 'nameValidate': 'estaEnviado', 'name': 'No Enviado', 'link': '<i class="fa fa-exclamation-triangle danger" style="font-size:60px;color:red !important;"></i>'}
                ]
            },
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
            Licencia.query(request).$promise.then(function (response) {
                $scope.licencias = response['data'];
                $scope.totalItems = response['totalItems'];
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
