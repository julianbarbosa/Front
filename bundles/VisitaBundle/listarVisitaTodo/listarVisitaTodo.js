saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("listar-visita-todo", {
            url: "/visita/listar_visita_todo",
            views: {
                "main": {
                    controller: "ListarVisitaTodoCtrl",
                    templateUrl: "../bundles/VisitaBundle/listarVisitaTodo/listarVisitaTodo.tpl.html"
                }
            }
        });
    }
]).controller("ListarVisitaTodoCtrl", ["$scope", "Visita",
function ($scope, Visita) {
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.rowWarning = 'estaEnviado';
    $scope.orderBy = 'idsolicitud';
    $scope.headers = [
        {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false, width: '5%',
            values: [  {'icon': '<i class="ver-detalle fa fa-external-link" title="Ver historial"></i>', 'link': '#!/solicitud/verhistorial/', 'idname':'idsolicitud'} ],
        },
        {type:'text', name: 'idvisita', name2: '', title: 'No Visita', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},            
        {type:'text', name: 'direccion', title: 'Dirección', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%'},
        {type:'link', name: 'radicado', title: 'Radicado', header_align: 'text-left', body_align: 'text-left', width: '10%', link:'http://www.cali.gov.co/aplicaciones/orweb/orweb/principal.php?id='},
        {type:'text', name: 'nombreTipoSolicitud', title: 'Tipo Solicitud', options: 
            [                
                {"name":"Control Preventivo", "value":"Control Preventivo"},
                {"name":"Visita Infraestructura Telecomunicaciones", "value":"Visita Infraestructura Telecomunicaciones"},
                {"name":"Visita Control Ornato", "value":"Visita Control Ornato"},
                {"name":"Control Posterior", "value":"Control Posterior"}, 
            ], header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'15%'},
        {type:'text', name: 'nombreEstado', title: 'Estado', header_align: 'text-center', body_align: 'text-center', width:'10%'},    
        {type:'text', name: 'visitador', title: 'Visitador', header_align: 'text-center', body_align: 'text-center', width:'10%'},
        {type:'text', name: 'supervisor', title: 'Revisor', header_align: 'text-center', body_align: 'text-center', width:'10%'},
        {type:'date', name: 'fecha_programacion', title: 'Fecha Actualización', header_align: 'text-center', body_align: 'text-center', width:'10%'},
    ];

    $scope.actualizarDatos = function (inicializarPaginador)
    {
        if(inicializarPaginador == true) {
            $scope.currentPage = 1;
        }
        var request = [ {'name': 'type', 'value': 'all'},
                        {'name': 'currentPage', 'value': $scope.currentPage}, 
                        {'name': 'numPerPage', 'value': $scope.numPerPage},
                        {'name': 'orderBy', 'value': $scope.orderBy}
                        ];
        for (header in $scope.headers) {
            if (typeof $scope.headers[header].value !== 'undefined' && $scope.headers[header].value !== '') {
                request.push({'name': $scope.headers[header].name, 'value': $scope.headers[header].value});
            }
        }
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();         
        Visita.query(request).$promise.then(function (response) {    
            $(".overlap_espera").hide();
            $(".overlap_espera_1").hide();            
            $scope.data = response.data;
            $scope.totalItems = response['totalItems'];
            var i = 0;
            
            // console.log(response);
            for (header in $scope.headers) {
                if ($scope.headers[i].name == 'visitador') {
                    var options = [];
                    for(option in response.visitadores) {
                        options.push({'name': response.visitadores[option].visitador, 'value': response.visitadores[option].visitador});
                    }
                    $scope.headers[i].options = options;
                    
                }
                i++;
            }
        });
    };
    $scope.actualizarDatos(false);
    
    $scope.ordenarPor = function (name) 
    {
        $scope.orderBy = name;
        $scope.actualizarDatos(true);
    }
}
]);
