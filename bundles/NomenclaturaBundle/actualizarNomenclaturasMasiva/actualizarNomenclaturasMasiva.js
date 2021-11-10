saul.config(["$stateProvider", function($stateProvider){
	$stateProvider.state('carga-masiva',{
		url: '/nomenclatura/carga_nomenclatura_masiva',
		views:{
			main:{
				controller: 'CargarNomenclaturaMasivaCtrl',
				templateUrl: '../bundles/NomenclaturaBundle/actualizarNomenclaturasMasiva/actualizarNomenclaturasMasiva.tpl.html'
			}
		}
	});
}])
.controller('CargarNomenclaturaMasivaCtrl', 
	['root','$scope', '$resource','$state', '$stateParams','Upload', 'ListarProcesos', 'Proceso2Ready','ProcesoAutorizar',
	function(root, $scope, $resource, $state, $stateParams, Upload, ListarProcesos, Proceso2Ready, ProcesoAutorizar){

		$scope.dirDownloadFile = root+'../upload/documentos/csv/';
		$scope.proceso = {};
		$scope.mostarPanelCargaMasiva = false;

		$scope.mostrarFormularioCreacion = function (){
			$scope.proceso = {};
			$scope.mostarPanelCargaMasiva = true;
		};

		$scope.mostrarFormularioEdicion = function (proceso){
			$scope.proceso = angular.copy(proceso);
			$scope.mostarPanelCargaMasiva = true;
		};

		//Para los archivos
		$scope.alerts = [];

		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

		$scope.resetInputFile = function(){
	        $('#clear_btn_dom').trigger('click');
		};

		$scope.initInputFile = function(){
			$('#input_file').pixelFileInput(
				{
					placeholder: 'Ningún archivo seleccionado...', 
					choose_btn_tmpl: '<a href="#" class="btn btn-xs btn-primary">Seleccionar</a>',
					clear_btn_tmpl:  '<a id="clear_btn_dom" href="#" class="btn btn-xs"><i class="fa fa-times"></i> Limpiar</a>'
				}
			);
		};

		$scope.eliminarArchivo = function(index){
			$scope.resetInputFile();
			$scope.files.splice(index, 1);
		};


        //files
        $scope.files = [];
        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
            	var name = args.file.name.split('.');
            	//console.warn(name);
            	if(name[1].toLowerCase() != 'csv'){
            		$scope.alerts.push({msg: 'El archivo "'+args.file.name+'" no está en formato CSV.'});
            		$scope.resetInputFile();
            	}else if(args.file.size >  5242880 ){
            		$scope.alerts.push({msg: 'El archivo "'+args.file.name+'" tiene un tamaño mayor a 5M.'});
            		$scope.resetInputFile();
            	}else{
            		if($scope.files.length == 0){
            			$scope.files.push(args.file);
            		}else{
            			$scope.files[0] = args.file;
            		}
            	}
            });
        });
        /////////////////////////////////////////////////////
        

        $scope.actualizarProceso = function(){
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

			Upload.upload({
                    url: root +'proceso/actualizar',
                    data: {
                    	idProcesoCargaNomenclatura: $scope.proceso.idProcesoCargaNomenclatura,
                    	nombre:$scope.proceso.nombre,
                    	persistir:$scope.proceso.persistir,
                    	descripcion:$scope.proceso.descripcion
                    },
                    transformResponse: function(json, headerGetter){return angular.fromJson(json);}
                }).then(
	                function(resp){
                		response = resp.data;
						if(response.success){
							$scope.actualizarDatos();
						}else{
			                $(".overlap_espera").fadeOut(500, "linear");
			                $(".overlap_espera_1").fadeOut(500, "linear");
							alert('Ha ocurrido un error.'+response.msg);
						}
					},
					function(error){
		                $(".overlap_espera").fadeOut(500, "linear");
		                $(".overlap_espera_1").fadeOut(500, "linear");
						$scope.messageErrorCliente = "Ooops, Ha ocurrido un error!!!, por favor vuelva a intentarlo.";
						switch(error.status){
							case 500:
								alert('Lo sentimos, ha ocurrido un error interno en el servidor (500), por favor consulte al administrador.');
							break;
							case 404:
								alert('Lo sentimos, no se ha podido encontrar el servidor (404), por favor consulte al administrador de la red.');
							break;
						}
					}, function (evt) {
	                    $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	                }
	            );
        };
        //Craga el archivoa al servidor
        $scope.crearProceso = function(){
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

    		Upload.upload({
                url: root +'nomenclatura/cargamasivaxls',
                data: {
                	files: $scope.files,
                	process_name: $scope.proceso.nombre,
                	process_description: $scope.proceso.descripcion,
                    process_persistir: $scope.proceso.persistir
                },
                transformResponse: function(json, headerGetter){
                    try{
                        var fromJson = angular.fromJson(json);
                        return fromJson;
                    }catch(error){
                        if(headerGetter.status == 403){
                            return {success: false, msg:'No tiene permisos para ejecutar esta acción.'};
                        }else{
                            return {success: false, msg: headerGetter.statusText}
                        }
                    }
                }
            }).then(
                function (resp) {
                	response = resp.data;
                	$scope.files.length = 0;
                	$scope.resetInputFile();

	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear", function(){
						if(response.success){
                            $scope.data.push(response.proceso);
                            $scope.totalItems++;
							alert('Se ha creado el proceso.');
						}else{
							alert('Ha ocurrido un error. '+response.msg);
						}
	                });
                }, function (error) {
	                $(".overlap_espera").fadeOut(500, "linear");
	                $(".overlap_espera_1").fadeOut(500, "linear", function(){
						switch(error.status){
							case 500:
								alert('Lo sentimos, ha ocurrido un error interno en el servidor (500), por favor consulte al administrador.');
							break;
                            case 404:
                                alert('Lo sentimos, no se ha podido encontrar el servidor (404), por favor consulte al administrador de la red.');
                            break;
                            case 403:
                                alert('Lo sentimos, no tiene permisos para ejecutar esta acción.');
                            break;
						}
	                });
                }, function (evt) {
                    //$scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                }
            );
        };

        $scope.buscar = function(keyCode){
        	if(keyCode == 13){
        		$scope.currentPage = 1;
        		$scope.actualizarDatos();
        	}
        };

        
        $scope.linkOrfeo = 'http://www.cali.gov.co/aplicaciones/orweb/orweb/principal.php?id=';
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.orderBy = 'idProcesoCargaNomenclatura';

        $scope.headers = [
            {
            	type: 'action', 
            	name: 'acciones', 
            	title: 'Acciones', 
            	align: 'text-center', 
            	input: false,
                values: [
                    //{'icon': '<i class="fa fa-play-circle" title="Clic para iniciar ejecución"></i>','click': 'toReady'},
                    //{'icon': '<i class="fa fa-book" title="Ver logs"></i>','link': '#!/nomenclatura/logs_carga_masiva/'}
                    //{'icon': '<i class="fa fa-edit" title="Clic para editar"></i>','link': '#!/solicitudos/gestionar/','target':'blank'}
                ],
                options: [
                    {
                        'nameValidate': 'estado',
                        'value': "running",
                        'icon': '<i class="fa fa-book" title="Ver logs hasta el momento"></i>',
                        'click': 'toLogs'
                    },
                    {
                        'nameValidate': 'estado',
                        'value': "completed",
                        'icon': '<i class="fa fa-book" title="Ver todos los logs"></i>',
                        'click': 'toLogs'
                    },
                    {
                        'nameValidate': 'estado',
                        'value': "stoped",
                        'icon': '<i class="fa fa-edit" title="Clic para editar"></i>',
                        'click': 'toEdit'
                    },
                    {
                        'nameValidate': 'estado',
                        'value': "stoped",
                        'icon': '<i class="fa fa-play-circle" title="Clic para iniciar ejecución"></i>',
                        'click': 'toReady'
                    },
                    {
                        'nameValidate': 'estado',
                        'value': "waiting",
                        'icon': '<i class="fa fa-check" title="Clic para autorizar ejecución"></i>',
                        'click': 'autorizar'
                    }
                ]
            },
            {type:'text', name: 'idProcesoCargaNomenclatura', title: 'Id', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '10%', value: ''},
            {type:'text', name: 'nombre', title: 'Nombre', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '30%', value: ''},
            {type:'text', name: 'estado', title: 'Estado', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%', value: ''},
            {type:'map', hash:{'1':'Sí', '0':'No'},options:[{'name':'Sí', 'value':'1'},{'name':'No', 'value':'0'}], name: 'persistir', title: 'Modificar', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%', value: ''}
        ];


        $scope.test = function(item, row){
        	$scope.$eval(item['click']).call([], item,row);
        };

        $scope.toLogs = function(item, row){
            $state.go('logs-carga-masiva', {idProcesoCargaNomenclatura: row.idProcesoCargaNomenclatura})
        };


        $scope.toReady = function(item, row){
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

            Proceso2Ready.query({
                idProcesoCargaNomenclatura: row.idProcesoCargaNomenclatura
            }).$promise.then(function (response) {
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                if(response.success){
                    alert(response.msg);
                    row.estado = 'ready';
                    //$scope.actualizarDatos();
                }else{
                    alert(response.msg);
                }
            }, function(error){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");

                switch(error.status){
                    case 500:
                        alert('Lo sentimos, ha ocurrido un error interno en el servidor (500), por favor consulte al administrador.');
                    break;
                    case 404:
                        alert('Lo sentimos, no se ha podido encontrar el servidor (404), por favor consulte al administrador de la red.');
                    break;
                    case 403:
                        alert('No tiene permisos para ejecutar esta acción.');
                    break;
                    default:
                        alert('No se ha podido procesar la petición, puede que no tenga permisos o hay ocurrido un error.');
                    break;
                }
            });
        };

        $scope.autorizar = function(item, row){
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

            ProcesoAutorizar.query({
                idProcesoCargaNomenclatura: row.idProcesoCargaNomenclatura
            }).$promise.then(function (response) {
                if(response.success){
                    alert(response.msg);
                    $scope.actualizarDatos();
                }else{
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
                    alert(response.msg);
                }
            }, function(error){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                console.warn(error);

                switch(error.status){
                    case 500:
                        alert('Lo sentimos, ha ocurrido un error interno en el servidor (500), por favor consulte al administrador.');
                    break;
                    case 404:
                        alert('Lo sentimos, no se ha podido encontrar el servidor (404), por favor consulte al administrador de la red.');
                    break;
                    case 403:
                        alert('No tiene permisos para ejecutar esta acción.');
                    break;
                    default:
                        alert(error.statusText);
                    break;
                }
            });
        };


        $scope.toEdit = function(item, row){
        	$scope.mostrarFormularioEdicion(row);
        };

        $scope.actualizarDatos = function () {
        	$scope.numPerPageTemp = $scope.numPerPage;
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

            ListarProcesos.query(request).$promise.then(function (response) {
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");

                $scope.data = response.data;
                $scope.totalItems = response.totalItems;
            });
            
        };
        
        $scope.ordenarPor = function (name){
            $scope.orderBy = name;
            $scope.actualizarDatos();
        };

        $scope.cancelar = function(){
			$scope.proceso = {};
			$scope.mostarPanelCargaMasiva = false;
        };

        $scope.cambiarNumeroPorPagina = function (keyCode){
        	if(keyCode == 13){
        		$scope.numPerPage = $scope.numPerPageTemp;
        		$scope.currentPage = 1;
        		$scope.actualizarDatos();
        	}
        };
        $scope.initInputFile();
        $scope.actualizarDatos();
	}]
);
