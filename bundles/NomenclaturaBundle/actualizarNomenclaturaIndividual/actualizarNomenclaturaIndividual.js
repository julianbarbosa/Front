saul.config(["$stateProvider", function($stateProvider){
	$stateProvider.state('carga-individual-nomenclatura',{
		url: '/nomenclatura/carga_nomenclatura_individual',
		views:{
			main:{
				controller: 'CargarNomenclaturaIndividualCtrl',
				templateUrl: '../bundles/NomenclaturaBundle/actualizarNomenclaturaIndividual/actualizarNomenclaturaIndividual.tpl.html'
			}
		}
	});
}])
.controller('CargarNomenclaturaIndividualCtrl', 
	['root','$scope', '$resource','$state', '$stateParams','Upload', 'ListarNomenclaturas', 'urlPlugInNomenclatura', 'Nomenclaturax', '$uibModal', 'LoadingOverlap',
	function(root, $scope, $resource, $state, $stateParams, Upload, ListarNomenclaturas, urlPlugInNomenclatura, Nomenclaturax, $modal, LoadingOverlap){

		$scope.entidad = {};
		$scope.mostrarFormulario = false;
        $scope.verHistorico = false;
        $scope.loadingHistorico = false;

        $scope.historico = null;

        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.orderBy = 'idnomenclatura';

        $scope.estadosPosibles = {
            'pendiente': 'Pendiente',
            'porverificar': 'Por Verificar',
            'porinvestigar': 'Por Investigar',
            'verificada': 'Verificada',
            'anulada': 'Anulada',
            'certificada': 'Certificada',
            'porcertificar': 'Por Certificar',
            'certificadaporsistema': 'Certificada por Sistema'
        };

        $scope.headers = [
            {
            	type: 'action', 
            	name: 'acciones', 
            	title: 'Acciones', 
            	align: 'text-center', 
                width: '20%',
            	input: false,
                values: [],
                options: [
                    {
                        'nameValidate': 'codigo_estado',
                        'value': "certificada",
                        'icon': '<i class="fa fa-edit" title="Clic para editar"></i>',
                        'click': 'toEdit'
                    },
                    {
                        'nameValidate': 'codigo_estado',
                        'value': "pendiente",
                        'icon': '<i class="fa fa-edit" title="Clic para editar"></i>',
                        'click': 'toEdit'
                    },
                    {
                        'nameValidate': 'codigo_estado',
                        'value': "anulada",
                        'icon': '<i class="fa fa-edit" title="Clic para editar"></i>',
                        'click': 'toEdit'
                    },
                    {
                        'nameValidate': 'codigo_estado',
                        'value': "porverificar",
                        'icon': '<i class="fa fa-edit" title="Clic para editar"></i>',
                        'click': 'toEdit'
                    },
                    {
                        'nameValidate': 'codigo_estado',
                        'value': "porinvestigar",
                        'icon': '<i class="fa fa-edit" title="Clic para editar"></i>',
                        'click': 'toEdit'
                    },
                    {
                        'nameValidate': 'codigo_estado',
                        'value': "verificada",
                        'icon': '<i class="fa fa-edit" title="Clic para editar"></i>',
                        'click': 'toEdit'
                    },
                    {
                        'nameValidate': 'codigo_estado',
                        'value': "porcertificar",
                        'icon': '<i class="fa fa-edit" title="Clic para editar"></i>',
                        'click': 'toEdit'
                    },
                    {
                        'nameValidate': 'codigo_estado',
                        'value': "certificadaporsistema",
                        'icon': '<i class="fa fa-edit" title="Clic para editar"></i>',
                        'click': 'toEdit'
                    },
                ]
            },
            {type:'text', name: 'codigo_barrio', title: 'Código Barrio', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%', value: ''},
            {type:'text', name: 'barrio', title: 'Barrio', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%', value: ''},
            {type:'text', name: 'npn', title: 'NPN', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%', value: ''},
            {type:'text', name: 'numero', title: 'Alfanumérico', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%', value: ''},
            {type:'text', name: 'direccion', title: 'Direccion', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '10%', value: ''},
            {type:'text', name: 'informacionadicional', title: 'Complemento', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '10%', value: ''},
            {type:'text', name: 'direccionAnterior', title: 'Direccion Anterior', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '10%', value: ''},
            {type:'text', name: 'direccionVisual', title: 'Direccion Visual', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '10%', value: ''},
            {type:'text', name: 'estado', title: 'Estado', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'20%', value: ''},
            {type:'text', name: 'observacion', title: 'Observaciones', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width: '30%', value: ''}
            //{type:'map', hash:{'1':'Sí', '0':'No'},options:[{'name':'Sí', 'value':'1'},{'name':'No', 'value':'0'}], name: 'persistir', title: 'Modificar', header_align: 'text-center', body_align: 'text-center', sorting: 'sorting', width:'10%', value: ''}
        ];


        $scope.test = function(item, row){
        	$scope.$eval(item['click']).call([], item,row);
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

            ListarNomenclaturas.query(request).$promise.then(function (response) {
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");

                $scope.verHistorico = response.verHistorico;
                $scope.data = response.data;
                $scope.totalItems = response.totalItems;
            }, function(error){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");

                alert('Ha ocurrido un error');
            });
            
        };

        $scope.mostrarFormularioEdicion = function (entidad){
            var opciones = {
                accion: 'editar',
                cargar: true,
                nomenclatura: { idnomenclatura: entidad.idnomenclatura},
                respuesta: '-'
            };
            var modalInstance = $modal.open({
                templateUrl: '../bundles/NomenclaturaBundle/actualizarNomenclaturaIndividual/nomenclaturaForm.tpl.html',
                controller: 'nomenclaturaFormController',
                size: 'md',
                resolve: {
                    Opciones: function(){
                        return opciones;
                    }
                }
            }).closed.then(function(){
                //Si se modificó, y la modificación fue exitosa
                if(opciones.respuesta.type == 'success'){
                    entidad.npn = opciones.respuesta.data.predio.codigounico;
                    entidad.direccion = opciones.respuesta.data.direccion;
                    entidad.informacionadicional = opciones.respuesta.data.informacionadicional;
                    entidad.direccionAnterior = opciones.respuesta.data.direccionAnterior;
                    entidad.direccionVisual = opciones.respuesta.data.direccionVisual;
                    entidad.observacion = opciones.respuesta.data.observacion;
                }
            });
        };

        //Crea la entidad
        $scope.crearEntidad = function(){
            var opciones = {
                accion: 'crear',
                cargar: false,
                nomenclatura: {},
                respuesta: '-'
            };
            var modalInstance = $modal.open({
                templateUrl: '../bundles/NomenclaturaBundle/actualizarNomenclaturaIndividual/nomenclaturaForm.tpl.html',
                controller: 'nomenclaturaFormController',
                size: 'md',
                resolve: {
                    Opciones: function(){
                        return opciones;
                    }
                }
            }).closed.then(function(){
                //Si se modificó, y la modificación fue exitosa
                if(opciones.respuesta.type == 'success'){
                    var entidad = {};
                    entidad.idnomenclatura = opciones.respuesta.data.idnomenclatura;
                    entidad.npn = opciones.respuesta.data.predio.codigounico;
                    entidad.direccion = opciones.respuesta.data.direccion;
                    entidad.informacionadicional = opciones.respuesta.data.informacionadicional;
                    entidad.direccionAnterior = opciones.respuesta.data.direccionAnterior;
                    entidad.direccionVisual = opciones.respuesta.data.direccionVisual;
                    entidad.observacion = opciones.respuesta.data.observacion;
                    entidad.numero = opciones.respuesta.data.predio.numero;
                    entidad.codigo_estado = opciones.respuesta.data.estado.codigo;
                    entidad.estado = opciones.respuesta.data.estado.nombre;
                    if(opciones.respuesta.data.predio.barrio){
                        entidad.barrio = opciones.respuesta.data.predio.barrio.nombre;
                        entidad.codigo_barrio = opciones.respuesta.data.predio.barrio.codigo;
                    }
                    $scope.data.push(entidad);
                }
            });
        };

        $scope.buscar = function(keyCode){
            if(keyCode == 13){
                $scope.currentPage = 1;
                $scope.actualizarDatos();
            }
        };

        $scope.descargarNomenclaturas = function(){
            var request = [ {'name': 'currentPage', 'value': $scope.currentPage}, 
                            //{'name': 'numPerPage', 'value': $scope.numPerPage},
                            {'name': 'orderBy', 'value': $scope.orderBy}
                        ];
            var strUrl = root+'nomenclatura/descargar?';
            for(var i in request){
                strUrl += (i+'='+encodeURIComponent( angular.toJson(request[i]) ) + '&');
            }
            window.open(strUrl);
        };
        
        $scope.ordenarPor = function (name){
            $scope.orderBy = name;
            $scope.actualizarDatos();
        };

        $scope.cambiarNumeroPorPagina = function (keyCode){
        	if(keyCode == 13){
        		$scope.numPerPage = $scope.numPerPageTemp;
        		$scope.currentPage = 1;
        		$scope.actualizarDatos();
        	}
        };



        /**
         * Cuando se desee certificar una nomenclatura de las que aparecen en el listado de nomenclaturas del predio
         * @param  {integer} i Índice de la nomenclatura a certificar en el arreglo '$scope.nomenclaturasConsultado'
         * @return {void}
         */
        $scope.certificarNomenclatura = function(idNomenclatura){
            //Abrimos el overlap
            LoadingOverlap.show( $scope, function(){
                //Enviamos a certificar
                Nomenclaturax.certificar( idNomenclatura )
                .then( function(data){
                    //Cerramos el Overlap
                    LoadingOverlap.hide( $scope, function(data){
                        //$scope.nomenclaturasConsultado[i] = data;
                        alert( 'Se ha certificado correctamente.' );
                        $scope.actualizarDatos();
                    }, data);
                }, function(error){
                    //Cerramos el Overlap
                    LoadingOverlap.hide( $scope, function(){
                        alert( error.msg );
                    });
                });

            });
        };

        /**
         * Cuando se desee inactivar una nomenclatura de las que aparecen en el listado de nomenclaturas del predio
         * @param  {integer} i ïndice de la nomenclatura a certificar en el arreglo '$scope.nomenclaturasConsultado'
         * @return void
         */
        $scope.inactivarNomenclatura = function(idNomenclatura){
            //Abrimos el overlap
            LoadingOverlap.show( $scope, function(){
                //Enviamos a certificar
                Nomenclaturax.inactivar( idNomenclatura )
                .then( function(data){
                    //Cerramos el Overlap
                    LoadingOverlap.hide( $scope, function(data){
                        //$scope.nomenclaturasConsultado[i] = data;
                        alert( 'Se ha inactivado correctamente.' );
                        $scope.actualizarDatos();
                    }, data);
                }, function(error){
                    //Cerramos el Overlap
                    LoadingOverlap.hide( $scope, function(){
                        alert( error.msg );
                    });
                });

            });
        };

        /**
         * Cuando se desee anular una nomenclatura de las que aparecen en el listado de nomenclaturas del predio
         * @param  {integer} i ïndice de la nomenclatura a certificar en el arreglo '$scope.nomenclaturasConsultado'
         * @return void
         */
        $scope.anularNomenclatura = function(idNomenclatura){
            //Abrimos el overlap
            LoadingOverlap.show( $scope, function(){
                //Enviamos a certificar
                Nomenclaturax.anular( idNomenclatura )
                .then( function(data){
                    //Cerramos el Overlap
                    LoadingOverlap.hide( $scope, function(data){
                        //$scope.nomenclaturasConsultado[i] = data;
                        alert( 'Se ha anulado correctamente.' );
                        $scope.actualizarDatos();
                    }, data);
                }, function(error){
                    //Cerramos el Overlap
                    LoadingOverlap.hide( $scope, function(){
                        alert( error.msg );
                    });
                });
            });
        };

        $scope.actualizarDatos();
	}]
);
