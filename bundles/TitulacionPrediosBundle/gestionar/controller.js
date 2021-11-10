saul.config(["$stateProvider", function(a) {
    a.state("titulacion-predios-gestionar", {
        url: "/titulacion-predios/gestionar/:idsolicitud",
        views: {
            main: {
                controller: "TitulacionPrediosGestionarCtrl",
                templateUrl: "../bundles/TitulacionPrediosBundle/gestionar/template.tpl.html"
            }
        }
    })
}]).controller("TitulacionPrediosGestionarCtrl", ["$scope", "$http", "$resource", "root", "UtilForm","$stateParams","Upload","LoadingOverlap",
    function($scope, $http, $resource, root, UtilForm,  $stateParams, Upload, LoadingOverlap) {    
        
        $scope.root = root;
        $scope.item = {};
        $scope.item.idSolicitud = $stateParams.idsolicitud;
        $scope.respuestaGuardada = false;
        
        $scope.respuesta = {};
        $scope.solicitud = {};
        $scope.respuesta.success = false;
        $scope.esUsuarioGestion = false;
        $scope.esUsuarioFirma = false;
        LoadingOverlap.show($scope);
        
        $scope.validarPermisos = function() {
            $http.get(root + "usuario/actual").then(function (response) {
                $scope.thisUser =  response.data;
                if($scope.item.solicitud.estado.codigo=='pendiente') {
                    if($scope.thisUser.roles.indexOf('gestionar-titulacionpredios') !== -1) {
                        $scope.esUsuarioGestion = true;
                        $scope.titulo = "Gestión de ";
                    } 
                } else if($scope.item.solicitud.estado.codigo=='preaprobada') {
                    if($scope.thisUser.roles.indexOf('firmar-titulacionpredios') !== -1){
                        $scope.esUsuarioFirma = true;
                        $scope.titulo = "Firma de ";  
                    }
                }
            }).finally(function(){
                LoadingOverlap.hide($scope);
            });
            
        }
        
        
        $scope.save = function(estado, finalizar) {
            var nombreEstado = estado;
            if(estado=='preaprobada') {
                nombreEstado = 'Pendiente por Firmar';
            }
            if(estado=='aprobada') {
                nombreEstado = 'Cerrado';
            }
            if(finalizar==1) {
                bootbox.confirm("Confirma que desea cambiar el estado a "+nombreEstado+"?",
                function (result) {
                    if (result) {                        
                         $scope.guardar(estado, finalizar);
                    }
                });       
                     
            } else {
                $scope.guardar(estado, finalizar);
            }
        };
        
        $scope.previsualizar = function(){
			UtilForm.openWith(
				root+"solicitud/respuesta/previsualizar/",
				'post',
				[
                    {
						name: 'idSolicitud',
						value: $scope.item.idSolicitud
					}
				]
			);
		};
        
        $scope.guardar = function(estado, finalizar) {
            
            LoadingOverlap.show($scope);
            if($scope.item.textoRespuesta!==undefined) {
                var textoRespuesta = $scope.item.textoRespuesta.replace(/\r\n/g,'</w:t><w:br/><w:t>').replace(new RegExp('\r?\n','g'), '</w:t><w:br/><w:t>')
            }
            Upload.upload({
                method: 'post',
                url: root+'solicitud/gestionar',  
                data: {
                    textoRespuesta: textoRespuesta,
                    tipoRespuesta: $scope.item.respuestaSeleccionada,
                    textoDevolucion: $scope.item.textoDevolucion,
                    idSolicitud: $scope.item.idSolicitud,
                    codigoEstado: estado
                }
            }).then(function (response) {
                LoadingOverlap.hide($scope);
                $scope.respuestaGuardada = true;
                if(finalizar==1) {
                    $scope.responseSolicitud = response.data;
                } else {
                    bootbox.alert(response.data.msg);
                }
            });   
        }
        
        $scope.obtenerGestion = function() {
            $resource(root + "titulacionpredios/respuesta/obtener/"+$scope.item.idSolicitud, {}, {
                query: {
                    method: 'GET',
                    isArray: false,
                    transformResponse: function (json, headerGetter) {
                        return angular.fromJson(json);
                    }
                }
            }).query({
                
            }).$promise.then(function (response) {
                if(response.data!==null) {
                    $scope.item = response.data;
                }
                if(response.respuesta!==null) {   
                    $scope.respuesta = response.respuesta;
                    $scope.item.textoRespuesta = $scope.respuesta.respuesta==undefined?'':$scope.respuesta.respuesta.replace(new RegExp('</w:t><w:br/><w:t>', 'g'), '\n');
                    $scope.item.respuestaSeleccionada = $scope.respuesta.tipoRespuesta.id;
                }
                $scope.item.textoDevolucion = '';
            }, function (error) {
                bootbox.alert('Lo sentimos, no se ha podido realizar la acción, por favor consulte al administrador de la red.');
            }).finally(function() {
                $scope.validarPermisos();
            });
        }
        $scope.obtenerGestion();
        
        $scope.obtenerTextoRespuesta = function($tipoRespuestaOficioId) {
            $http.get(root+"titulacionpredios/respuesta/obtenertexto/"+$scope.item.idSolicitud+'/'+$tipoRespuestaOficioId).then(function(response) {
                $scope.item.textoRespuesta = response.data;
            })
        }
        
        $scope.obtenerTiposRespuesta = function() {
            $http.get(root+"dominio/respuesta_titulacion_predios").then(function(response) {
                $scope.tiposDeRespuesta = response.data;
            });
        }
        $scope.obtenerTiposRespuesta();
    
    }])
