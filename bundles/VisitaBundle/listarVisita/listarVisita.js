saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("listar-visita", {
            url: "/visita/listar_visita",
            views: {
                "main": {
                    controller: "ListarVisitaCtrl",
                    templateUrl: "../bundles/VisitaBundle/listarVisita/listarVisita.tpl.html"
                }
            }
        });
    }
]).controller("ListarVisitaCtrl", ["$scope", "Visita",
    function ($scope, Visita) {
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.headers = [
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false,
                values: [  {'icon': '<i class="ver-detalle fa fa-external-link" title="Clic para ver la información completa del expediente"></i>'} ],
                options: [
                    {'value': 0, nameValidate: 'estaEnviado', 'name': 'No Enviado', 'link': '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>'}
                ]
            },
            {type:'text', name: 'idvisita', name2: '', title: 'No Visita', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'propietario', title: 'Propietario', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%'},
            {type:'text', name: 'direccion', title: 'Dirección', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},
            {type:'text', name: 'comuna', title: 'Comuna', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},
            {type:'link', name: 'radicado', title: 'Radicado', header_align: 'text-left', body_align: 'text-left', width: '10%', link:'http://www.cali.gov.co/aplicaciones/orweb/orweb/principal.php?id='},
            {type:'text', name: 'nombreTipoSolicitud', title: 'Tipo Solicitud', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%'},
            {type:'text', name: 'nombreEstado', title: 'Estado', header_align: 'text-center', body_align: 'text-center', width:'10%'},    
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
            Visita.query(request).$promise.then(function (response) {                
                $scope.data = response['data'];
                $scope.totalItems = 20;//response['totalItems'];
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
