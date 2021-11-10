saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("licencia-buscarlicencia", {
            url: "/licencia/buscarlicencia",
            views: {
                "main": {
                    controller: "LicenciaBuscarLicenciaCtrl",
                    templateUrl: "../bundles/LicenciaBundle/buscarLicencia/buscarLicencia.tpl.html"
                }
            }
        });
    }
]).controller("LicenciaBuscarLicenciaCtrl", ["$scope", "$http", "Licencia", "$filter", "$stateParams", "root",
    function ($scope, $http, ComparendoAll, $filter, $stateParams, root) {
        $scope.idProgramacionPedagogia = $stateParams.idProgramacionPedagogia;
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.busqueda = [];
        $scope.rowActive = '';
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        $scope.headers = [
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false, width: '5%',
                values: [
                    {icon: 'fa-pencil-square-o', title:'Ver Historial Comparendo', link: '#!/licencia/consultarlicencia/', 'action':'activarDetalle'},
                    {icon: 'fa fa-folder', title:'Gestionar Archivos', link: '#!/licencia/archivos/{{licencia.idLicencia}}', action:'gestionarArchivos'}
                ],
                options: [
                    {'value': 0, nameValidate: 'estaEnviado', 'name': 'No Enviado', 'link': '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>'}
                ]
            },
            {type:'text', name: 'id', name2: '', title: 'Identificador', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting',input: false, width: '5%'},
            {type:'text', name: 'identificacionpropietario', name2: '', title: 'Identificación', header_align: 'text-center', body_align: 'text-center',input: false, sorting: 'sorting', width: '5%'},
            {type:'text', name: 'propietario', title: 'Nombre', header_align: 'text-center', body_align: 'text-center',input: false, sorting: 'sorting', width:'40%'},
            {type:'text', name: 'direccion', title: 'Direccion', header_align: 'text-center', body_align: 'text-center',input: false, width:'20%'},       
            {type:'text', name: 'usuario', subname: 'descripcion', title: 'Curaduria', header_align: 'text-center', body_align: 'text-center',input: false, width:'20%'},       
        ];
        
        $scope.esFecha = function(value) {
			return angular.isDate(value);;
		}
		
		$scope.esObjeto = function (value) {
			return angular.isObject(value);			
		}
        
        $scope.consultarCuradurias = function() {
            $http.get(root+'licencias/curaduria/').then(function(data) {
                $scope.arrayCuradurias = data.data;
            });          
        };
        $scope.consultarCuradurias();
        
        $scope.activarDetalle = function(id) {
            if($scope.rowActive !== id) {
                $scope.rowActive = id;
            } else {
                $scope.rowActive = 0;
            }           
        };
        
        function callback(data) {                  
            $scope.validator = {};
            $scope.validator.alert = {};
            
            $scope.validator.alert.content = data.msg + ' <a href="#!/controlpolicivo/verificarlicencia" ><i class="fa fa-file-text" aria-hidden="true"></i> Volver a lista</a>';
            
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
        
        $scope.actualizarDatos = function (page)
        {            
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();                
//            ComparendoAll.get({identificacionPropietario:$scope.busqueda.identificacionPropietario,
//                               nombrePropietario:$scope.busqueda.nombrePropietario,
//                               curaduria:$scope.busqueda.curaduria,
//                               
//                             })            
            var request = [ {'name': 'currentPage', 'value': page}, 
                            {'name': 'numPerPage', 'value': $scope.numPerPage},
                            {'name': 'orderBy', 'value': $scope.orderBy}
                            ];
            request.push({'name': 'identificacionpropietario', 'value': $scope.busqueda.identificacionpropietario});
            request.push({'name': 'propietario', 'value': $scope.busqueda.nombrepropietario});
            request.push({'name': 'idUsuario', 'value': $scope.busqueda.idusuario});
            request.push({'name': 'direccion', 'value': $scope.busqueda.direccion});
            request.push({'name': 'catastral', 'value': $scope.busqueda.catastral});
            request.push({'name': 'matriculainmobiliaria', 'value': $scope.busqueda.matriculainmobiliaria});
            ComparendoAll.get(request)
            .$promise.then(function (response) {
                $scope.data = response['data'];
                $scope.totalItems = response['totalItems'];
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            });
        };        
        
        $scope.ordenarPor = function (name) 
        {
            $scope.orderBy = name;
            $scope.actualizarDatos();
        }
        
        $scope.caller = function (funcion, item) {                    
            $scope.$eval(funcion).call([], item);
        };
        
        $scope.gestionarArchivos = function(id) {
            window.open('#!/licencia/gestionar-archivos/'+id);
        }
                        
    }
]);
