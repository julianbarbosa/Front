saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-listarsegundainstancia", {
            url: "/controlpolicivo/listarsegundainstancia",
            views: {
                "main": {
                    controller: "ControlPolicivoListarComparendosPendientesSegundaInstanciaCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/listarComparendosPendientesSegundaInstancia/listarComparendosPendientesSegundaInstancia.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoListarComparendosPendientesSegundaInstanciaCtrl", ["$scope","ComparendosSegundaInstancia","$location",
    function ($scope, ComparendosSegundaInstancia, $location) {
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.headers = [
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false,
                values: [
                    {'icon': '<i class="ver-detalle fa fa-pencil-square-o" title="Verificar Comparendo"></i>', 'link': '#!/controlpolicivo/verificarcomparendo/'}
                ],
                options: [
                    {'value': 0, nameValidate: 'estaEnviado', 'name': 'No Enviado', 'link': '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>'}
                ]
            },
            {type:'text', name: 'numeroFormato', name2: '', title: 'Num Formato', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'identificacion', name2: '', title: 'Identificación', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'nombreInfractor', title: 'Nombre Infractor', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'40%'},
            {type:'text', name: 'tipoMulta', title: 'Tipo Multa', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%'},            
            {type:'date', name: 'fechaComparendo', title: 'Fecha Comparendo', header_align: 'text-center', body_align: 'text-center', width:'20%'},
            {type:'button', name: 'Confirmar', title: 'Decidir Multa', header_align: 'text-center', body_align: 'text-center', width:'10%', input: false, style: 'btn-danger', action: 'apelar', condicion: 'tipoMulta'},            
        ];
        
        function callback(data) {                  
            $scope.validator = {};
            $scope.validator.alert = {};
            
            $scope.validator.alert.content = data.msg + ' <a href="#!/controlpolicivo/verificarcomparendo" ><i class="fa fa-file-text" aria-hidden="true"></i> Volver a lista</a>';
            
            if(data.success===true) {
                $scope.validator.alert.type = 'alert-success';
                $scope.validator.alert.title = "Exito: ";
            } else {
                $scope.validator.alert.type = 'alert-danger';
                $scope.validator.alert.title = "Advertencia: ";
            }
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
            ComparendosSegundaInstancia.get(request).$promise.then(function (response) {
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
                
        $scope.apelar = function (item) {
            $location.path( "/controlpolicivo/resolversegundainstancia/"+item.id );
        };
                
    }
]);
