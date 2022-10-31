saul.config(["$stateProvider", function(a) {
    a.state("persona-en-construccion-gestionar", {
        url: "/persona-en-construccion/gestionar/:idsolicitud",
        views: {
            main: {
                controller: "PersonaEnConstruccionGestionarCtrl",
                templateUrl: "../bundles/PersonaEnConstruccionBundle/gestionar/template.tpl.html"
            }
        }
    })
}]).controller("PersonaEnConstruccionGestionarCtrl", ["$scope", "$http", "$resource", "root", "UtilForm","$stateParams","Upload","LoadingOverlap",
    function($scope, $http, $resource, root, UtilForm,  $stateParams, Upload, LoadingOverlap) {    
        
        $scope.root = root;
        $scope.item = {};
        $scope.permisoFirma = 'firmar-personaenconstruccion';
        $scope.permisoGestion = 'gestionar-personaenconstruccion';
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
                    if($scope.thisUser.roles.indexOf($scope.permisoGestion) !== -1) {
                        $scope.esUsuarioGestion = true;
                        $scope.titulo = "Gestión de ";
                    } 
                } else if($scope.item.solicitud.estado.codigo=='preaprobada') {
                    if($scope.thisUser.roles.indexOf($scope.permisoFirma) !== -1){
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
                    codigoEstado: estado,
                    data: $scope.respuesta
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
            $resource(root + "personaenconstruccion/respuesta/obtener/"+$scope.item.idSolicitud, {}, {
                query: {
                    method: 'GET',
                    isArray: false,
                    transformResponse: function (json, headerGetter) {
                        return angular.fromJson(json);
                    }
                }
            }).query({
                
            }).$promise.then(function (response) {
                $scope.solicitud = response.solicitud;
                if(response.dataSolicitud!==null) {   
                    $scope.item = response.dataSolicitud;
                    $scope.respuesta = response.dataSolicitud;    
                }                
                if(response.dataRespuesta!==null) {
                    $scope.respuesta = response.dataRespuesta;
                }
                if(response.respuesta!==null){
                    $scope.item.textoRespuesta = response.respuesta.respuesta==undefined?'':response.respuesta.respuesta.replace(new RegExp('</w:t><w:br/><w:t>', 'g'), '\n');
                    $scope.item.respuestaSeleccionada = response.respuesta.tipoRespuesta.id;
                }
                
                $scope.calcularValores(); 
                $scope.item.textoDevolucion = '';
            }, function (error) {
                bootbox.alert('Lo sentimos, no se ha podido realizar la acción, por favor consulte al administrador de la red.');
            }).finally(function() {
                $scope.validarPermisos();
            });
        }
        $scope.obtenerGestion();
        
        $scope.obtenerTextoRespuesta = function($tipoRespuestaOficioId) {
            $http.get(root+"personaenconstruccion/respuesta/obtenertexto/"+$scope.item.idSolicitud+'/'+$tipoRespuestaOficioId).then(function(response) {
                $scope.item.textoRespuesta = response.data;
            })
        }
        
        $scope.obtenerTiposRespuesta = function() {
            $http.get(root+"dominio/respuesta_persona_en_construccion").then(function(response) {
                $scope.tiposDeRespuesta = response.data;
            });
        }
        $scope.obtenerTiposRespuesta();
        
        $scope.calcularValores = function () {
            $scope.respuesta.capitalDeTrabajo = $scope.respuesta.activoCorriente - $scope.respuesta.pasivoCorriente;
            $scope.respuesta.razonCorriente = ($scope.respuesta.activoCorriente / $scope.respuesta.pasivoCorriente).toFixed(2)*1;
            $scope.respuesta.pruebaAcida = (($scope.respuesta.activoCorriente - $scope.respuesta.inventario ) / $scope.respuesta.pasivoCorriente).toFixed(2)*1;
            $scope.respuesta.endeudamiento =  ($scope.respuesta.pasivoTotal / $scope.respuesta.activoTotal).toFixed(2)*1;
            $scope.respuesta.apalancamiento = ($scope.respuesta.pasivoCorriente / $scope.respuesta.patrimonio).toFixed(2)*1;
        }     
    
    }])
