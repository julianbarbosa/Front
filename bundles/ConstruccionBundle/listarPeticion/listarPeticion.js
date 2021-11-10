saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("listar-peticion", {
            url: "/peticion/listar",
            views: {
                "main": {
                    controller: "ListarPeticionCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/listarPeticion/listarPeticion.tpl.html"
                }
            }
        });
    }
]).controller("ListarPeticionCtrl", ["$scope", "Solicitud",
    function ($scope, Solicitud) {
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.headers = [
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false,
                values: [                    
                    {'icon': '<i class="ver-detalle fa fa-history" title="Clic para ver el historial"></i>','link': '#!/expediente/listar_historial/'},
                    
                ],
                options: [
                    {'value': 0, nameValidate: 'estaEnviado', 'name': 'No Enviado', 'link': '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>'}
                ]
            },
            {type:'text', name: 'idsolicitud', name2: '', title: 'Num Solicitud', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'firstName', name2: 'lastName', title: 'Nombre Solicitante', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%'},
            {type:'text', name: 'direccion', name2: 'informacionAdicional', title: 'Dirección', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},
            {type:'link', name: 'radicado', title: 'Radicado', header_align: 'text-left', body_align: 'text-left', width: '10%', link:'http://www.cali.gov.co/aplicaciones/orweb/orweb/principal.php?id='},
            {type:'link', name: 'guia', title: 'Guía', header_align: 'text-left', body_align: 'text-left', width: '10%', link:'http://svc2.sipost.co/trazawebsip2/default.aspx?Buscar='},
            {type:'text', name: 'nombreTipoSolicitud', title: 'Tipo Solicitud', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%'},
            {type:'text', name: 'nombreEstado', title: 'Estado', header_align: 'text-center', body_align: 'text-center', width:'10%'},
            {type:'text', name: 'fechaVencimiento', title: 'Fecha Vencimiento', header_align: 'text-center', body_align: 'text-center', width:'10%'},
            {type:'date', name: 'updatedAt', title: 'Fecha Actualización', header_align: 'text-center', body_align: 'text-center', width:'10%'},
        ];

        $scope.actualizarDatos = function ()
        {
            console.log("entro a actualizar datos");
            var request = [ {'name': 'currentPage', 'value': $scope.currentPage}, 
                            {'name': 'numPerPage', 'value': $scope.numPerPage},
                            {'name': 'orderBy', 'value': $scope.orderBy}
                            ];
            for (header in $scope.headers) {
                if (typeof $scope.headers[header].value !== 'undefined' && $scope.headers[header].value !== '') {
                    request.push({'name': $scope.headers[header].name, 'value': $scope.headers[header].value});
                }
            }
            Solicitud.query(request).$promise.then(function (response) {
                console.log("entro a solicitud query");
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
