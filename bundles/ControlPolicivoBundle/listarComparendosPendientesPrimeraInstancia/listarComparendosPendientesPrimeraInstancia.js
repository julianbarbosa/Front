saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-listarprimerainstancia", {
            url: "/controlpolicivo/listarprimerainstancia",
            views: {
                "main": {
                    controller: "ControlPolicivoListarComparendosPendientesPrimeraInstanciaCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/listarComparendosPendientesPrimeraInstancia/listarComparendosPendientesPrimeraInstancia.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoListarComparendosPendientesPrimeraInstanciaCtrl", ["$scope", "root", "ComparendosPrimeraInstancia","$location",
    function ($scope,root, ComparendosPrimeraInstancia, $location) {
        $scope.currentPage = 1;
        $scope.root = root;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.headers = [
            // {type:'check', name: 'numeroFormato', name2: '', title: 'No. Comparendo / Expediente', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'numeroFormato', name2: '', title: 'No. Comparendo / Expediente', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '15%'},
            {type:'text', name: 'tipoIdentificacion', name2: 'identificacion', title: 'Identificación', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '15%'},
            {type:'text', name: 'nombreInfractor', title: 'Nombre Infractor', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'25%'},
            {type:'date', name: 'fechaComparendo', title: 'Fecha Comparendo', header_align: 'text-center', body_align: 'text-center', width:'15%'},
            {type:'text', name: 'estadoExpediente', title: 'Expediente', header_align: 'text-center', body_align: 'text-center', width:'15%'},            
            {type:'button', name: 'Acción', title: 'Detalle', header_align: 'text-center', body_align: 'text-center', width:'10%', input: false, style: 'btn-danger', action: 'verDetalle', condicion: 'tipoMulta'}
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
            for (item in $scope.busqueda) {
                request.push({'name': item, 'value': $scope.busqueda[item]});
            }
            ComparendosPrimeraInstancia.get(request).$promise.then(function (response) {
                $scope.data = response['data'];
                if($scope.data.length==0) {
                    bootbox.alert("No existen comparendos registrados con estos parámetros para esta inspección.");
                }
                $scope.totalItems = response['totalItems'];
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            });
        };
        // $scope.actualizarDatos();

        $scope.ordenarPor = function (name)
        {
            $scope.orderBy = name;
            $scope.actualizarDatos();
        }

        $scope.caller = function (funcion, item) {
            $scope.$eval(funcion).call([], item);
        };

        $scope.verDetalle = function (item) {
            $location.path( "/controlpolicivo/consultarcomparendo/"+item.id );
        };

        $scope.objetar = function (item) {
            $location.path( "/controlpolicivo/resolverpedagogia/"+item.id );
        };
    }
]);
