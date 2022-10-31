saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("persona-en-construccion-solicitud", {
            url: "/persona-en-construccion/solicitud/",
            views: {
                "main": {
                    controller: "PersonaEnConstruccionSolicitudCtrl",
                    templateUrl: "../bundles/PersonaEnConstruccionBundle/crearSolicitud/template.tpl.html"
                }
            }            
        });
    }
]).controller("PersonaEnConstruccionSolicitudCtrl", ["$scope", "$http", "root", "LoadingOverlap","PluginNomenclatura", "ListarTiposDocIdentificacion", "Upload",
    function ($scope, $http, root, LoadingOverlap, PluginNomenclatura, ListarTiposDocIdentificacion, Upload) {
        
        $scope.root = root;
        $scope.esFuncionario = false;
        $scope.solicitud = {};
        $scope.files = [];
        $scope.solicitud.esEntidadSinAnimoLucro = 1;
        $scope.direccionRequerida = false;
        $scope.seBuscoSolicitante = false;
        $scope.seEncontroSolicitante = false;
        $scope.respuesta = [];
        $scope.respuesta.success = false;
        $scope.familiarIndex = 0;
        $scope.agregarFamiliar=false;
        
        $scope.inicializarDatosSolicitante = function () {
            $scope.solicitud.solicitante = [];
            $scope.seEncontroSolicitante = false;
            $scope.seBuscoSolicitante = false;
        }
        $scope.inicializarDatosSolicitante();
        
        //Funciones Iniciales del Proceso       
        $scope.obtenerTiposIdentificacion = function() {
            ListarTiposDocIdentificacion.query().$promise.then(function(response){
                $scope.arrayTipoIdentificacion = response;
            });
        }
        $scope.obtenerTiposIdentificacion();
        
        $scope.obtenerFechaActual = function() {
            $http.get(root+"funciones/fecha_actual/").then(function(response) {
                $scope.fechaActual = new Date();
                $scope.fechaActual.setTime(Date.parse(response.data.fecha_actual_str));
                console.log("fechaActual:",$scope.fechaActual);
            });
        }
        $scope.obtenerFechaActual();
        
        $scope.diferenciaEnDias = function (date) {
            if(date !== undefined) {
                var fecha = new Date(date);
                var utc1 = Date.UTC(fecha.getFullYear(), fecha.getMonth(),fecha.getDate());
                var utc2 = Date.UTC($scope.fechaActual.getFullYear(), $scope.fechaActual.getMonth(), $scope.fechaActual.getDate());
                var diferencia = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
                return diferencia;
            }
            return 1000;
            
        }
        
        $scope.obtenerTipoVia = function() {
            $http.get(root+"pnitem/via").then(function(response) {
                $scope.arrayTipoVia = response.data;
            });
        }
        $scope.obtenerTipoVia();
        
        $scope.obtenerBarrio = function() {
            $http.get(root+"barrio/").then(function(response) {
                $scope.arrayBarrio = response.data;
            });
        }
        $scope.obtenerBarrio();
        
        $scope.validarPermisos = function() {
            LoadingOverlap.show($scope);
            $http.get(root + "usuario/actual").then(function (response) {
                $scope.thisUser =  response.data;
                if($scope.thisUser.funcionario == 1) {
                    if($scope.thisUser.roles.indexOf('radicar-personaenconstruccion') !== -1) {
                        $scope.esFuncionario = true;
                    }
                } else {
                    $scope.esFuncionario = false;
                    $scope.solicitud.solicitante = angular.fromJson($scope.thisUser);    
                }
            }).finally(function(){
                LoadingOverlap.hide($scope);
            });
            
        }
        $scope.validarPermisos();
    
        $scope.establecerDireccion = function(via, numero, placa, complemento) {
            $scope.direccionRequerida = true;
            return via+' '+(numero==undefined?'':numero)+' # '+(placa==undefined?'':placa)+' '+(complemento==undefined?'':complemento); 
        }
        
        
        $scope.validarFormAdjuntosSolicitud = function() {
            $scope.validaciones = 0;
            var cantidadArchivos = 4;
            if($scope.solicitud.solicitante.idtipodocidentificacion == 2) {
                cantidadArchivos++;
                if($scope.solicitud.esEntidadSinAnimoLucro==1) {
                    cantidadArchivos++;
                }
            }
            $scope.validaciones += $scope.files.certificadoExistencia.$valid==true?1:0;
            $scope.validaciones += $scope.files.estadoSituacionFinanciera.$valid==true?1:0;
            $scope.validaciones += $scope.files.estadoResultados.$valid==true?1:0;
            $scope.validaciones += $scope.files.tarjetaProfesionalContador.$valid!==true?0:1;
            $scope.validaciones += $scope.files.certificadoVigenciaContador.$valid==true?1:0;
            $scope.validaciones += $scope.files.estatutos.$valid==true?1:0;
            console.log("cantidadArchivos=>"+cantidadArchivos, "validaciones=>"+$scope.validaciones);
            if($scope.validaciones==cantidadArchivos) {
                $scope.step = $scope.step + 1;
            } else {
                bootbox.alert({
                    message: "Debe adjuntar todos los archivos requeridos.",
                    size: 'small'
                });
            }
        }
        
        $scope.validarIdentificacionSolicitante = function(idTipoDocIdentificacion, identificacion) {
            if(identificacion>0 && idTipoDocIdentificacion>0) {
                LoadingOverlap.show($scope);
                $scope.seBuscoSolicitante = true;
                $scope.seEncontroSolicitante = false;
                $http.get(root + "usuario/consultar_por_identificacion?id="+identificacion).then(function (response) {
                    $scope.seEncontroSolicitante = true;        
                    $scope.solicitud.solicitante = response.data.data;
                    console.log($scope.solicitud.solicitante);
                    if(response.data.success!==true) {
                        $scope.solicitud.solicitante = {'idtipodocidentificacion':idTipoDocIdentificacion, 'numidentificacion': identificacion};
                        $scope.seEncontroSolicitante = false;
                        LoadingOverlap.hide($scope); 
                    }
                }).finally(function(){     
                    $scope.solicitud.solicitante.idtipodocidentificacion = idTipoDocIdentificacion;
                    $scope.solicitud.solicitante.numidentificacion = identificacion;
                    LoadingOverlap.hide($scope);
                });
            } else {
                bootbox.alert("Para buscar el ciudadano o la entidad debe ingresar el tipo de identificación y número de identificación.");
            }
        }
        
        $scope.obtenerModalIngresoDireccion = function () {
            PluginNomenclatura.obtenerModalIngresoDireccion($scope,
                function (data) {
                    $scope.solicitud.solicitante.direccion = data.direccion + (data.infoAdicional ? ' ' + data.infoAdicional : '');
                }
            );
        };
        
        $scope.saveSolicitud = function (solicitud) {
            if(solicitud.informacion_veridica!==true || solicitud.acepto_formulario!==true) {
                bootbox.alert("Para radicar la solicitud debe aceptar la Declaración bajo gravedad de juramento y la firma digital del formulario.");
            } else {
                LoadingOverlap.show($scope);
                $scope.solicitudEnviada = angular.copy(solicitud);
                Upload.upload({
                    url: root +'personaenconstruccion/solicitud',
                    data: {
                        data: solicitud,
                        files: $scope.files
                    },
                    transformResponse: function(json, headerGetter){return angular.fromJson(json);}
                }).then(function (response) {
                    LoadingOverlap.hide($scope);
                    $scope.respuesta.success = true;
                    $scope.responseSolicitud = response.data;
                });
            }
        }
        
        $scope.calcularValores = function () {
            $scope.solicitud.capitalDeTrabajo = $scope.solicitud.activoCorriente - $scope.solicitud.pasivoCorriente;
            $scope.solicitud.razonCorriente = ($scope.solicitud.activoCorriente / $scope.solicitud.pasivoCorriente).toFixed(2)*1;
            $scope.solicitud.pruebaAcida = (($scope.solicitud.activoCorriente - $scope.solicitud.inventario ) / $scope.solicitud.pasivoCorriente).toFixed(2)*1;
            $scope.solicitud.endeudamiento =  ($scope.solicitud.pasivoTotal / $scope.solicitud.activoTotal).toFixed(2)*1;
            $scope.solicitud.apalancamiento = ($scope.solicitud.pasivoCorriente / $scope.solicitud.patrimonio).toFixed(2)*1;
        }     
    }
]);