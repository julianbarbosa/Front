saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("solicitud-listar-tareas", {
            url: "/solicitud/listar_tareas/",
            views: {
                "main": {
                    controller: "ListarTareasCtrl",
                    templateUrl: "../bundles/SolicitudBundle/listarTareas/listarTareas.tpl.html"
                }
            }            
        });
    }
]).controller("ListarTareasCtrl", ["$scope", "TareaSolicitud", 'DevolverSolicitud', 
    function ($scope, TareaSolicitud, DevolverSolicitud) {
        $scope.currentPage = 1;
        $scope.numPerPage = 15;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.actualizandoDatos = false;
        $scope.headers = [
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false,
                values: [
					{'icon': '<i class="ver-detalle fa fa-external-link" title="Clic para realizar tarea."></i>'},
                    {'icon': '<i class="ver-detalle fa fa-history" title="Clic para ver el historial"></i>','link': '#!/solicitud/verhistorial/'}                    
                ],
                options: [
                    {
                        'value': 0, 
                        'nameValidate': 'estaEnviado', 
                        'name': 'No Enviado', 
                        'link': '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>'
                    },
                    {
                        'nameValidate': 'codigoEstado',
                        'value': 'emitido',
                        'icon': '<i class="fa fa-step-backward" title="Devolver solicitud"></i>',
                        'click': 'toBack'
                    }
                ]
            },
            {type:'text', name: 'idsolicitud', name2: '', title: 'Num Solicitud', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'firstName', name2: 'lastName', title: 'Nombre Solicitante', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%'},
            {type:'label', name: 'interna', title: 'Uso', options: {0: {value:0, name: 'Externo', cssClass:'label-success'}, 1: {value:1, name: 'Interno', cssClass:'label-danger'}}, header_align: 'text-center', body_align: 'text-center', sorting: false, input: true},
            {type:'label', name: 'ciudadano', title: 'Por Ciudadano', options: {0: {value:0, name: 'No', cssClass:'label-success'}, 1: {value:1, name: 'Sí', cssClass:'label-danger'}}, header_align: 'text-center', body_align: 'text-center', sorting: false, input: true},
            {type:'text', name: 'direccion', name2: 'informacionAdicional', title: 'Dirección', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},
            {type:'link', name: 'radicado', title: 'Radicado', header_align: 'text-left', body_align: 'text-left', width: '10%', link:'http://www.cali.gov.co/aplicaciones/orweb/orweb/principal.php?id='},
            {type:'text', name: 'nombreTipoSolicitud', title: 'Tipo Solicitud', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%'},
            {type:'text', name: 'nombreEstado', title: 'Estado', header_align: 'text-center', body_align: 'text-center', width:'10%'},
            {type:'text', name: 'fechaVencimiento', title: 'Fecha Vencimiento', header_align: 'text-center', body_align: 'text-center', width:'10%'},
        ];

        $scope.onClickAction = function(item, row){
            $scope.$eval(item['click']).call([], item, row);
        }

        $scope.toBack = function(item, row){
            bootbox.prompt(
                "¿Desea pasar a estado Pendiente la solicitud de '"+row.nombreTipoSolicitud+
                "' con número "+row.idsolicitud+"?<br><strong>Observación:</strong>", 
                function(observacion) {
                    if(observacion) {
                        $(".overlap_espera").show();
                        $(".overlap_espera_1").show();

                        DevolverSolicitud.devolver(row.idsolicitud, row.codigoTipoSolicitud , observacion).then(function(rta){
                            $(".overlap_espera").fadeOut(500, "linear");
                            $(".overlap_espera_1").fadeOut(500, "linear", function(){
                                bootbox.alert(rta.msg, function(){
                                    $scope.actualizarDatos();
                                });
                            });
                        }, function(error){
                            $(".overlap_espera").fadeOut(500, "linear");
                            $(".overlap_espera_1").fadeOut(500, "linear", function(){
                                alert(error.msg);
                            });
                        });
                    }
            });
        };

        $scope.buscar = function(keyCode){
            if(keyCode == 13){
                $scope.currentPage = 1;
                $scope.actualizarDatos();
            }
        };

        $scope.actualizarDatos = function ()
        {
            if($scope.actualizandoDatos){
                return;
            }

            $scope.actualizandoDatos = true;

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
            TareaSolicitud.query(request).$promise.then(function (response) {
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                $scope.data = response['data'];
                $scope.totalItems = response['totalItems'];
                $scope.actualizandoDatos = false;
            });
        };

        $scope.actualizarDatos();

        $scope.ordenarPor = function (name)
        {
            $scope.orderBy = name;
            $scope.actualizarDatos();
        };

        $scope.desactivar = function (id) {
            //console.log("el id es = " + id);
        };
        
        $scope.parJson = function (json) {
            try {
                return angular.fromJson('['+json+']');;
            } catch (e) {
                return null;
            }
            
        }
    }
]);
