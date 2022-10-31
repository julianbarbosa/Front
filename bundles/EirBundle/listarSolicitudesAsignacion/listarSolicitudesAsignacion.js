saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("listar-solicitudes-asignacion", {
            url: "/nomenclatura/listar_solicitudes_asignacion/{tipoUsuario}",
            views: {
                "main": {
                    controller: "ListarSolicitudesAsignacionCtrl",
                    templateUrl: "../bundles/NomenclaturaBundle/listarSolicitudesAsignacion/listarSolicitudesAsignacion.tpl.html"
                }
            }
        });
    }
]).filter('urlOrfeoPdf', function(){
    return function(radicado){
        if(radicado == null){
            return '';
        }
        return 'http://web1.cali.gov.co/aplicaciones/orweb/orweb/verAnexo.php?ruta=../bodega//'+
                    radicado.substring(0,4)+'/'+
                    radicado.substring(4,10)+'/docs/'+
                    radicado+'.pdf';

    };
}).controller("ListarSolicitudesAsignacionCtrl", ["$scope", 'ListarSolicitudAsignacion','$stateParams',
    function ($scope, ListarSolicitudAsignacion, $stateParams) {
        $scope.linkOrfeo = 'http://www.cali.gov.co/aplicaciones/orweb/orweb/principal.php?id=';
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';

        $scope.headers = [
            {
            	type: 'action', 
            	name: 'acciones', 
            	title: 'Acciones', 
            	align: 'text-center', 
            	input: false,
                values: [
                    //{'icon': '<i class="fa fa-history" title="Clic para gestionar la solicitud"></i>','link': '#!/solicitudos/gestionar/','target':'blank'},
                    //{'icon': '<i class="fa fa-file-pdf-o" title="Ver documento"></i>','link': '../../saul2/app_dev.php/solicitudos/previsualizar/','target':'blank'}
                ],
                options: [
                    {
                        'value': "preradicada", //Pendiente Por Aprobación
                        'nameValidate': 'codigoestado',
                        'icon': '<i class="fa fa-eye" title="Clic para visualizar la solicitud"></i>',
                        'link': '#!/nomenclatura/solicitar_asignacion/'+$stateParams.tipoUsuario+'/',
                        //'target':'blank',
                    },
                ]
            },
            {type:'text', name: 'idsolicitud', title: 'Num Solicitud', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'nombreestado', title: 'Estado', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '5%'},
            {type:'text', name: 'numidentificacion', title: 'Identificación Solicitante', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%'},
            {type:'text', name: 'first_name', name2: 'last_name', title: 'Nombre Solicitante', input: true, header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%'},
            {type:'text', name: 'direccion', title: 'Dirección',  input: true, header_align: 'text-center', body_align: 'text-center', sorting: 'sorting'},
            {type:'link', name: 'radicado', title: 'Radicado Entrada',  input: true, header_align: 'text-left', body_align: 'text-left', width: '10%', link: $scope.linkOrfeo},
            {type:'link', name: 'radicadohijo', title: 'Radicado Salida',  input: true, header_align: 'text-left', body_align: 'text-left', width: '10%', link: $scope.linkOrfeo},
        ];


        if($stateParams.tipoUsuario == 'funcionario'){
            $scope.headers[0].options.push({
                'value': "pendiente", //Pendiente
                'nameValidate': 'codigoestado',
                'icon': '<i class="fa fa-file-pdf-o" title="Clic para gestionar la solicitud"></i>',
                'link': '#!/solicitudasignomen/gestionar/',
                //'target':'blank',
            });
        }

        $scope.actualizarDatos = function () {
            var request = [ {'name': 'currentPage', 'value': $scope.currentPage}, 
                            {'name': 'numPerPage', 'value': $scope.numPerPage},
                            {'name': 'orderBy', 'value': $scope.orderBy}
                            ];
            for (var header in $scope.headers) {
                if (typeof $scope.headers[header].value !== 'undefined' && $scope.headers[header].value !== '') {
                    request.push({'name': $scope.headers[header].name, 'value': $scope.headers[header].value});
                }
            }

            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

            ListarSolicitudAsignacion.query(request).$promise.then(function (response) {

                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");

                $scope.data = response['data'];
                $scope.totalItems = response['totalItems'];
            });
            
        };
        
        $scope.ordenarPor = function (name){
            $scope.orderBy = name;
            $scope.actualizarDatos();
        };

        $scope.cargarFuncionario = function(){
            $resource(root+"asignomenclatura/imfuncionario", {}, {
                query: {
                    method: 'GET', 
                    isArray: false, 
                    transformResponse: function(json, headerGetter){
                        return angular.fromJson(json);
                    }
                }
            }).query(
                {
                    data: angular.toJson($scope.validacion),
                    idsolicitud: $scope.solicitud.idSolicitud
                }
            ).$promise.then(function(response){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                if(response.success){
                    $scope.funcionario = response.data==1;
                    $scope.mostrarFormSolicitud = response.data!=1;
                    //alert($scope.mostrarFormSolicitud);
                }else{
                    alert(response.msg);
                }
            }, function(error){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            });
        };

        $scope.actualizarDatos();
    }
]);
