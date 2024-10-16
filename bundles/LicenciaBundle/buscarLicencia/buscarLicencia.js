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
]).controller("LicenciaBuscarLicenciaCtrl", ["$scope", "$http", "Licencia", "$filter", "$stateParams", "root", "UtilForm",
    function ($scope, $http, ComparendoAll, $filter, $stateParams, root, UtilForm) {
        $scope.idProgramacionPedagogia = $stateParams.idProgramacionPedagogia;
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.busqueda = {};
        $scope.rowActive = '';
        $scope.rowWarning = 'estaEnviado';
        $scope.orderBy = 'idsolicitud';
        
        $scope.camposBusqueda = [
            { 
                label: "Fecha Inicial Radicación",
                name: "fechainicialradicacion",
                type: "date", 
                estado: "activo"
            },
            { 
                label: "Fecha Final de Radicación",
                name: "fechafinalradicacion",
                type: "date",
                estado: "activo"
            },
            { 
                label: "Curaduría",
                type: "select",
                name: "curaduria",
                store: "arrayCuradurias",
                estado: "activo"
            },
            { 
                label: "Identificación Propietario",
                name: "identificacionpropietario",
                type: "integer",
                estado: "activo"
            },
            { 
                label: "Nombre Propietario",
                name: "propietario",
                type: "string"
            },
            { 
                label: "Dirección del Predio",
                name: "direccion",
                type: "string",
                estado: "activo"
            },
            { 
                label: "Estado",
                type: "select",
                name: "estado",
                store: "arrayEstados"
            },
            { 
                label: "Licencia",
                name: "licencia",
                type: "string"
            },
            { 
                label: "Tipo Licencia",
                name: "tipolicencia",
                type: "string"
            },
            { 
                label: "Número Predial Nacional",
                name: "numeropredialnacional",
                type: "string" 
            },
            { 
                label: "Número Catastral",
                name: "catastral",
                type: "string"
            }
            
        ];     
        
        $scope.getCamposBusquedaInhabilitados = function() {
            $scope.camposBusquedaInhabilitados = [];
            $scope.consecutivo=0;
            $scope.camposBusqueda.forEach(function(item) {                
                if(item.estado!=='activo') {
                    $scope.camposBusquedaInhabilitados[$scope.consecutivo] = {text: item.label, value: item.name};
                    $scope.consecutivo++;
                }
            })
            return $scope.camposBusquedaInhabilitados;
        }
        $scope.eliminarCampo = function(index) {
            $scope.camposBusqueda[index].estado = 'inactivo';
        }
        
        $scope.agregarCampo = function() {
            bootbox.prompt({
                title: "Seleccione el campo a agregar",
                inputType: 'select',
                inputOptions: $scope.getCamposBusquedaInhabilitados(),
                callback: function (result) {
                    $scope.camposBusqueda.forEach(function(item, index) {
                        if(item.name==result) {
                            $scope.camposBusqueda[index].estado = 'activo';
                            $scope.$apply();    
                        }                        
                    })
                }
            });
        }
        
        $scope.downloadData = function() {
            $scope.request = [];
            $scope.camposBusqueda.forEach(function(item) {
                if(item.estado=='activo') {
                    $scope.request.push({'name': item.name, 'value': $scope.busqueda[item.name]});    
                }                
            });
            UtilForm.openWith(
                root + "licencia/descargarcsv",
                'post', $scope.request);
        }

        $scope.downloadAllData = function() {
            $scope.request = [];
            UtilForm.openWith(
                root + "licencia/descargarcsv",
                'post', $scope.request);
        }
        
        $scope.arrayEstados = [ {codigo: "expedido", nombre: "Expedida"}, 
                                {codigo: "ejecutoriada", nombre: "Ejecutoriada"} ];
        
        $scope.headers = [
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false, width: '5%',
                values: [
                    {icon: 'fa-pencil-square-o', title:'Ver Detalle', link: '#!/licencia/consultarlicencia/', 'action':'activarDetalle'},
                    {icon: 'fa fa-folder', title:'Gestionar Archivos', link: '#!/licencia/archivos/{{licencia.idLicencia}}', action:'gestionarArchivos'}
                ],
                options: [
                    {'value': 0, nameValidate: 'estaEnviado', 'name': 'No Enviado', 'link': '<a href="integracion/crear_licencia/{{licencia.idLicencia}}"><i class="ver-detalle fa fa-refresh pull-left" title="Enviar a DAMP"></i></a>'}
                ]
            },
            {type:'text', name: 'licencia', name2: '', title: 'Licencia', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting',input: false, width: '5%'},
            {type:'text', name: 'identificacionpropietario', name2: '', title: 'Identificación', header_align: 'text-center', body_align: 'text-center',input: false, sorting: 'sorting', width: '5%'},
            {type:'text', name: 'propietario', title: 'Nombre', header_align: 'text-center', body_align: 'text-center',input: false, sorting: 'sorting', width:'40%'},
            {type:'text', name: 'direccion', title: 'Direccion', header_align: 'text-center', body_align: 'text-center',input: false, width:'20%'},       
            {type:'text', name: 'nombre_curaduria', title: 'Curaduria', header_align: 'text-center', body_align: 'text-center',input: false, width:'20%'},       
        ];
        
        
        $scope.getStore = function(nameStore) {
            return $scope.$eval(nameStore);
        }
        $scope.esFecha = function(value) {
			return angular.isDate(value);;
		}
		
		$scope.esObjeto = function (value) {
			return angular.isObject(value);			
		}
        
        $scope.consultarCuradurias = function() {
            $http.get(root+'licencias/curaduria/').then(function(data) {
                $scope.arrayCuradurias = data.data;
                $scope.arrayCuradurias.forEach(function(item) {
                    item['nombre'] = item.curaduria;
                })
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
            $scope.request = [ {'name': 'currentPage', 'value': page}, 
                            {'name': 'numPerPage', 'value': $scope.numPerPage},
                            {'name': 'orderBy', 'value': $scope.orderBy}
                            ];
            
            $scope.camposBusqueda.forEach(function(item) {
                if(item.estado=='activo') {
                    $scope.request.push({'name': item.name, 'value': $scope.busqueda[item.name]});    
                }                
            });
            ComparendoAll.get($scope.request)
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
