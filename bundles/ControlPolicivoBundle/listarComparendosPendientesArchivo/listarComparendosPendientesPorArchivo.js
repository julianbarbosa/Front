saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-listarporverificar", {
            url: "/controlpolicivo/verificarcomparendo",
            views: {
                "main": {
                    controller: "ControlPolicivoListarComparendosPendientesPorArchivoCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/listarComparendosPendientesPorArchivo/listarComparendosPendientesPorArchivo.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoListarComparendosPendientesPorArchivoCtrl", ["$scope","ComparendosPorArchivo","$filter",
    function ($scope, ComparendosPorArchivo, $filter) {
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.headers = [
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false,
                values: [
                    {'icon': '<i class="ver-detalle fa fa-pencil-square-o" title="Archivo Comparendo"></i>', 'link': '#!/controlpolicivo/verificarcomparendo/'}
                ],
                options: [
                    {'value': 0, nameValidate: 'estaEnviado', 'name': 'No Enviado', 'link': '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>'}
                ]
            },
            {type:'text', name: 'id', name2: '', title: 'Num Solicitud', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'identificacion', name2: '', title: 'Identificación', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'nombreInfractor', title: 'Nombre Infractor', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'40%'},
            {type:'date', name: 'fechaComparendo', title: 'Fecha Comparendo', header_align: 'text-center', body_align: 'text-center', width:'20%'},
            {type:'button', name: 'anular', title: 'Anular', header_align: 'text-center', body_align: 'text-center', width:'10%', input: false, style: 'btn-danger', action: 'anular' },
            {type:'button', name: 'aprobar', title: 'Aprobar', header_align: 'text-center', body_align: 'text-center', width:'10%', input: false, style: 'btn-success', action: 'aprobar'},
            {type:'button', name: 'aprobar', title: 'Actualizar', header_align: 'text-center', body_align: 'text-center', width:'10%', input: false, style: 'btn-warning', action: 'actualizar'},
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
            ComparendosPorArchivo.get(request).$promise.then(function (response) {
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
        
        $scope.actualizar = function (item) {
            console.log(item.id);
            bootbox.confirm("Confirma que desea <strong><span class='text-warning'>ACTUALIZAR</span></strong> este comparendo por inconsistencia en la cedula "+item.identificacion+" y nombre "+item.nombreInfractor,
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result) {
                        ComparendosPorArchivo.save({data: {'id': item.id,'datosCorrectos': 2}}).$promise.then(function (response) {                            
                            $scope.result = response.data;                                
                            callback(response);
                            if (response.success) {                                  
                                $scope.actualizarDatos();
                            }
                            $scope.isSuccess = true;                   
                        });
                    }
                });
        };

        $scope.anular = function (item) {
            console.log(item.id);
            bootbox.confirm("Confirma que desea realizar <strong><span class='text-danger'>ANULAR</span></strong> este comparendo por inconsistencia en la cedula "+item.identificacion+" y nombre "+item.nombreInfractor,
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result) {
                        ComparendosPorArchivo.save({data: {'id': item.id,'datosCorrectos': false}}).$promise.then(function (response) {                            
                            $scope.result = response.data;                                                    
                            callback(response);
                            if (response.success) {
                                $scope.data.splice($scope.data.indexOf(item), 1);              
                            }
                            $scope.isSuccess = true;                   
                        });
                    }
                });
        };
        
        $scope.aprobar = function (item) {
            console.log(item.id);        
            bootbox.confirm("Confirma que desea realizar <strong><span class='text-success'>APROBAR</span></strong> este comparendo? "+item.nombreInfractor,
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result) {
                         ComparendosPorArchivo.save({data: {'id': item.id,'datosCorrectos': true}}).$promise.then(function (response) {                            
                            $scope.result = response.data; 
                            $scope.data.splice($scope.data.indexOf(item), 1);                            
                            callback(response);
                            if (response.success) {
                                $scope.data.splice($scope.data.indexOf(item), 1);                    
                            }
                            $scope.isSuccess = true;                   
                        });
                    }
                });
        };
    }
]);
