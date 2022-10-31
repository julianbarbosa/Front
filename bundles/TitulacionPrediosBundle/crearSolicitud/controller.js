saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("titulacion-predios-solicitud", {
            url: "/titulacion-predios/solicitud/",
            views: {
                "main": {
                    controller: "TitulacionPrediosSolicitudCtrl",
                    templateUrl: "../bundles/TitulacionPrediosBundle/crearSolicitud/template.tpl.html"
                }
            }            
        });
    }
]).controller("TitulacionPrediosSolicitudCtrl", ["$scope", "$http", "root", "LoadingOverlap","PluginNomenclatura", "ListarTiposDocIdentificacion","UsuarioActual", "Upload",
    function ($scope, $http, root, LoadingOverlap, PluginNomenclatura, ListarTiposDocIdentificacion, UsuarioActual, Upload) {
        
        $scope.root = root;
        $scope.esFuncionario = false;
        $scope.solicitud = {};
        $scope.files = [];
        $scope.solicitud.arrayFamiliares = [];
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
        
        $scope.obtenerParentescos = function() {
            $http.get(root+"dominio/parentesco").then(function(response) {
                $scope.arrayParentesco = response.data;
            });
        }
        $scope.obtenerParentescos();
        
        $scope.obtenerProgramasVivienda = function() {
            $http.get(root+"dominio/programa_vivienda").then(function(response) {
                $scope.arrayProgramaVivienda = response.data;
            });
        }
        $scope.obtenerProgramasVivienda();
        
        $scope.obtenerTipoVia = function() {
            $http.get(root+"pnitem/via").then(function(response) {
                $scope.arrayTipoVia = response.data;
            });
        }
        $scope.obtenerTipoVia();
        
        $scope.validarPermisos = function() {
            LoadingOverlap.show($scope);
            $http.get(root + "usuario/actual").then(function (response) {
                $scope.thisUser =  response.data;
                if($scope.thisUser.funcionario == 1) {
                    if($scope.thisUser.roles.indexOf('radicar-titulacionpredios') !== -1) {
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
            $scope.validaciones += $scope.files.identificacion.$valid==true?1:0;
            $scope.validaciones += $scope.files.acreditacionOcupacion.$valid==true?1:0;
            $scope.validaciones += $scope.files.pazYSalvoImpuesto.$valid==true?1:0;
            $scope.validaciones += $scope.files.protocolizacion==undefined || $scope.files.protocolizacion.$valid!==true?0:1;
            $scope.validaciones += $scope.files.acreditacionEstadoCivil.$valid==true?1:0;
            if($scope.validaciones==5) {
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
                bootbox.alert("Para buscar el ciudadano debe ingresar el tipo de identificación y la identificación.");
            }
        }
        
        $scope.obtenerModalIngresoDireccion = function () {
            PluginNomenclatura.obtenerModalIngresoDireccion($scope,
                function (data) {
                    $scope.solicitud.solicitante.direccion = data.direccion + (data.infoAdicional ? ' ' + data.infoAdicional : '');
                }
            );
        };
        
        //Funciones de gestión
        $scope.guardarFamiliar  = function (persona) {
           if($scope.fileIdentificacionFamiliar.file==null || $scope.fileIdentificacionFamiliar.$errorformato!==null) {
                bootbox.alert("Debe ingresar el documento de identidad del familiar.");
            } else {
                $scope.agregarFamiliar=false;
                persona.filename = $scope.fileIdentificacionFamiliar.file.name;
                filename = persona.filename.split('.');
                file = new File([$scope.fileIdentificacionFamiliar.file], persona.identificacion+'.'+filename[filename.length-1]);
                if(persona.$index==undefined) {
                    persona.actualizado = true;
                    $scope.files.push({"file":file,"codigo":"identificacion", "identificacion":persona.identificacion}); 
                    $scope.solicitud.arrayFamiliares.push(persona);
                } else {
                    persona.actualizado = false;
                    $scope.files[persona.$index] = {"file":file,"codigo":"identificacion", "identificacion":persona.identificacion};
                    $scope.solicitud.arrayFamiliares[persona.$index]= persona;
                } 
                $scope.familiar = [];
                $scope.resetInputFile();
            }
        }
        
        $scope.eliminarFamiliar = function($index) {
            $scope.solicitud.arrayFamiliares.splice($index, 1);
            $scope.resetInputFile();
        }
        
        $scope.editarFamiliar = function($index) {
            $scope.agregarFamiliar=true;
            $scope.familiar = $scope.solicitud.arrayFamiliares[$index];
            $scope.familiar.$index = $index;
            $scope.resetInputFile();
            $scope.file.$valid = true; //Cuando se edita el archivo se encuentra correcto
        }
        
        $scope.cancelarAgregarFamiliar = function() {
            $scope.agregarFamiliar=false;
            $scope.familiar = [];
        }
        
        $scope.mostrarFormularioAgregarFamiliar = function() {
            $scope.agregarFamiliar=true;
            $scope.familiar = [];
        }
        
        $scope.resetInputFile = function() {
            $scope.fileIdentificacionFamiliar.reset();
            $scope.fileIdentificacionFamiliar.$pristine = true;
            $scope.fileIdentificacionFamiliar.$valid = false;  
        }
        
        $scope.saveSolicitud = function (solicitud) {
            if(solicitud.informacion_veridica!==true || solicitud.acepto_formulario!==true) {
                bootbox.alert("Para radicar la solicitud debe aceptar la Declaración bajo gravedad de juramento y la firma digital del formulario.");
            } else {
                LoadingOverlap.show($scope);
                $scope.solicitudEnviada = angular.copy(solicitud);
                Upload.upload({
                    url: root +'titulacionpredios/solicitud',
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
            // 
            // $scope.respuesta.message = "La solicitud se ha almacenado correctamente. <a href='https://www.cali.gov.co/aplicaciones/orweb/orweb/principal.php?id=202141610600000034' target='_blank'>Ver radicado</a>.<br><br>El tiempo de respuesta para este trámite es de x días, para hacerle seguimiento ingresa a 'Mis Solicituedes' en el menú lateral izquierdo.";
        }
    }
]);