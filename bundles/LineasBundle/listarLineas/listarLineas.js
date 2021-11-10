saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("listar_lineas_demarcacion", {
            url: "/lineas/listar/",
            views: {
                "main": {
                    controller: "ListarLineasCtrl",
                    templateUrl: "../bundles/LineasBundle/listarLineas/listarLineas.tpl.html"
                }
            }
        });
    }
]).controller("ListarLineasCtrl", ["$scope", "LineaDemarcacion",
    function ($scope, LineaDemarcacion) {
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.headers = [
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false,
                values: [                    
                    {'icon': '<i class="ver-detalle fa fa-search" title="Ver Linea></i>', 'link': '#!/lineas/verdetalle/'}
                ],
                options: [
                    {'value': 0, nameValidate: 'estaEnviado', 'name': 'No Enviado', 'link': '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>'}
                ]
            },
            {type:'text', name: 'id', name2: '', title: 'Num Linea', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'numeroPredialNacional', title: 'Predial Nacional', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%'},
            {type:'text', name: 'direccion', name2: 'informacionAdicional', title: 'Dirección', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},
            {type:'link', name: 'radicado', title: 'Radicado', header_align: 'text-center', body_align: 'text-center', width:'10%', link:'http://www.cali.gov.co/aplicaciones/orweb/orweb/principal.php?id='},
            {type:'date', name: 'updatedAt', title: 'Fecha Actualización', header_align: 'text-center', body_align: 'text-center', width:'10%'},
        ];

        $scope.consultar = function (data) {
            LineaDemarcacion.findall(data).$promise.then(function (response) {
                $scope.data = response.data.data;
                $scope.totalItems = responsedata.totalItems;
            });
        };
      
        
    }
]);
