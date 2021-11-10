saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-registrarasistenciapedagogia", {
            url: "/controlpolicivo/registrarasistenciapedagogia/:id",
            views: {
                "main": {
                    controller: "ControlPolicivoRegistrarAsistenciaPedagogiaCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/registrarAsistenciaPedagogia/registrarAsistenciaPedagogia.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoRegistrarAsistenciaPedagogiaCtrl", ["$scope", "$stateParams", "AsistentesProgramacionPedagogia",
    function ($scope, $stateParams, AsistentesProgramacionPedagogia) {
        $scope.id = $stateParams.id;
        $scope.currentPage = 1;
        $scope.numPerPage = 50;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.tableFilter = false;
        $scope.pagination = false;
        $scope.headers = [
            {type: 'checkbox', name: 'Asistió', title: 'Asistió', align: 'text-center' },
            {type:'text', name: 'id', name2: '', title: 'Num Programación', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'identificacion', title: 'Identificación', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%'},
            {type:'text', name: 'nombre', name2: 'apellido', title: 'Nombre Infractor', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%'},
            {type:'date', name: 'fechaComparendo', title: 'Fecha Comparendo', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},                                    
            {type:'text', name: 'descripcion', title: 'Comportamiento Contrario', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},                                    
            {type:'date', name: 'createdAt', title: 'Fecha Creación', header_align: 'text-center', body_align: 'text-center', width:'10%'}
        ];
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();

        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};
            $scope.validator.alert.title = data.title;
            $scope.validator.alert.content = data.msg;
            $scope.validator.alert.type = data.type;
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        };
        
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
            AsistentesProgramacionPedagogia.get({id:$scope.id}).$promise.then(function (response) {
                $scope.data = response['data'];
                $scope.programacionPedagogia = response['programacionPedagogia'];
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
        
        $scope.save = function(b) {
            bootbox.confirm("Confirma que desea realizar esta acción?",
            function (result) {
                $(this).attr('disabled', true);
                $(this).val('Enviando...');
                if (result) {
                    $(".overlap_espera").show();
                    $(".overlap_espera_1").show();              
                    AsistentesProgramacionPedagogia.save({
                        data: $scope.data,
                        programacionPedagogia: $scope.programacionPedagogia ,
                        asistentes: 123
                    }).$promise.then(function(result) {
                        callback(result);
                        $(".overlap_espera").fadeOut(500, "linear");
                        $(".overlap_espera_1").fadeOut(500, "linear");
                    });
                    $scope.ocultarModal = !1;
                };
            });
        }
    }
]);
