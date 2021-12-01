saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("listar-perfiles-viales", {
            url: "/perfilvial/listarperfilvial/",
            views: {
                "main": {
                    controller: "ListarPerfilVialCtrl",
                    templateUrl: "../bundles/LineasBundle/listarPerfilVial/ListarPerfilVial.tpl.html"
                }
            }
        });
    }
]).controller("ListarPerfilVialCtrl", ["$scope", "PerfilVial",
    function ($scope, PerfilVial) {
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.headers = [
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false,
                values: [
                    {'icon': '<i class="ver-detalle fa fa-pencil-square-o" title="Ver Linea"></i>', 'link': '#!/perfilvial/crearperfilvial/'},
                    {'icon': '<i class="ver-detalle fa fa-check-square-o" title="Revisar Linea"></i>', 'link': '#!/perfilvial/aprobarperfilvial/','afterLink': '/1/revisar', 'condicion':'visualizacion'}
                ],
                options: [
                    {'value': 0, nameValidate: 'estaEnviado', 'name': 'No Enviado', 'link': '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>'}
                ]
            },
            {type:'text', name: 'id', name2: '', title: 'id', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'nombreTipoViaPrincipal', title: 'Tipo Via Principal', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%'},
            {type:'text', name: 'nombreViaPrincipal', title: 'Via Principal', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%'},
            {type:'text', name: 'nombreTipoViaSecundaria', title: 'Tipo ViaSecundaria', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%'},
            {type:'text', name: 'nombreViaSecundaria', title: 'Via Secundaria', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%'},
            {type:'text', name: 'nombreEstado', title: 'Estado', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%'},
            {type:'text', name: 'creador', title: 'Creado Por', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%'},
            {type:'date', name: 'createdAt', title: 'Fecha Creación', header_align: 'text-center', body_align: 'text-center', width:'10%'},
            {type:'date', name: 'updatedAt', title: 'Fecha Actualización', header_align: 'text-center', body_align: 'text-center', width:'10%'},
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
            PerfilVial.get(request).$promise.then(function (response) {
                $scope.data = response['data'];
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
