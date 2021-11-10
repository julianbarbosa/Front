saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("rit-cancelar", {
            url: "/rit/cancelar",
            views: {
                "main": {
                    controller: "RegistroMercantilCancelarCtrl",
                    templateUrl: "../bundles/RegistroMercantilBundle/cancelarRit/template.tpl.html"
                }
            }            
        });
    }
]).controller("RegistroMercantilCancelarCtrl", ["$scope", "$http", "root", "LoadingOverlap","PluginNomenclatura", "ListarTiposDocIdentificacion","UsuarioActual", "Upload",
    function ($scope, $http, root, LoadingOverlap, PluginNomenclatura, ListarTiposDocIdentificacion, UsuarioActual, Upload) {
        
        $scope.root = root;
        $scope.esFuncionario = false;
        $scope.registro = {};
        $scope.files = [];
        $scope.registro.arrayEstablecimientos = [];
        $scope.registro.arrayRepresentantes = [];
        $scope.registro.arrayActividadesEconomicas = [];
        $scope.direccionRequerida = false;
        $scope.seBuscoSolicitante = false;
        $scope.seEncontroSolicitante = false;
        $scope.respuesta = [];
        $scope.respuesta.success = false;
        $scope.establecimientoIndex = 0;
        $scope.agregarEstablecimiento=false;
        
        $scope.motivosCancelacion = [ {id:1, codigo: "FU", descripcion:"Fusión"},{id:2, codigo: "AB", descripcion:"Absorción"},{id:3, codigo: "ES", descripcion:"Escisión"},{id:4, codigo: "TR", descripcion:"Traslado de domicilio"},{id:5, codigo: "SL", descripcion:"Sociedad Líquida"},{id:6, codigo: "RT", descripcion:"Terminación proceso de reestructuración"},{id:7, codigo: "RE", descripcion:"Terminación proceso de reestructuración"},{id:8, codigo: "NO", descripcion:"No ejerce actividades ICA"}];
        
        
        $scope.inicializarDatosSolicitante = function () {
            $scope.registro.solicitante = [];
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
        
        $scope.obtenerActividadesEconomicas = function() {
            $http.get(root+"ciiu/consutar").then(function(response) {
                $scope.arrayActividadEconomica = response.data;
                console.log(response);
            });
        }
        $scope.obtenerActividadesEconomicas();
        
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
                    if($scope.thisUser.roles.indexOf('radicar-RegistroMercantil') !== -1) {
                        $scope.esFuncionario = true;
                    }
                } else {
                    $scope.esFuncionario = false;
                    $scope.registro.solicitante = angular.fromJson($scope.thisUser);    
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
                    $scope.registro.solicitante = response.data.data;
                    console.log($scope.registro.solicitante);
                    if(response.data.success!==true) {
                        $scope.registro.solicitante = {'idtipodocidentificacion':idTipoDocIdentificacion, 'numidentificacion': identificacion};
                        $scope.seEncontroSolicitante = false;
                        LoadingOverlap.hide($scope); 
                    }
                }).finally(function(){     
                    $scope.registro.solicitante.idtipodocidentificacion = idTipoDocIdentificacion;
                    $scope.registro.solicitante.numidentificacion = identificacion;
                    LoadingOverlap.hide($scope);
                });
            } else {
                bootbox.alert("Para buscar el ciudadano debe ingresar el tipo de identificación y la identificación.");
            }
        }
        
        $scope.obtenerModalIngresoDireccion = function () {
            PluginNomenclatura.obtenerModalIngresoDireccion($scope,
                function (data) {
                    $scope.registro.solicitante.direccion = data.direccion + (data.infoAdicional ? ' ' + data.infoAdicional : '');
                }
            );
        };
        
        //Funciones de gestión
        $scope.guardarEstablecimiento  = function (establecimiento) {
            $scope.agregarEstablecimiento=false;
            if(establecimiento.$index==undefined) {
                establecimiento.actualizado = true;
                $scope.registro.arrayEstablecimientos.push(establecimiento);
            } else {
                establecimiento.actualizado = false;
                $scope.registro.arrayEstablecimientos[establecimiento.$index]= establecimiento;
            } 
            $scope.establecimiento = [];
        }
        
        $scope.eliminarEstablecimiento = function($index) {
            $scope.registro.arrayEstablecimientos.splice($index, 1);
        }
        
        $scope.editarEstablecimiento = function($index) {
            $scope.agregarEstablecimiento=true;
            $scope.establecimiento = $scope.registro.arrayEstablecimientos[$index];
            $scope.establecimiento.$index = $index;
            $scope.file.$valid = true; //Cuando se edita el archivo se encuentra correcto
        }
        
        $scope.cancelaragregarEstablecimiento = function() {
            $scope.agregarEstablecimiento=false;
            $scope.establecimiento = [];
        }
        
        $scope.mostrarFormularioAgregarEstablecimiento = function() {
            $scope.agregarEstablecimiento=true;
            $scope.establecimiento = [];
        }
        
        //Representantes
        //Funciones de gestión
        $scope.guardarRepresentante  = function (representante) {
            $scope.agregarRepresentante=false;
            if(representante.$index==undefined) {
                representante.actualizado = true;
                $scope.registro.arrayRepresentantes.push(representante);
            } else {
                representante.actualizado = false;
                $scope.registro.arrayRepresentantes[representante.$index]= representante;
            } 
            $scope.representante = [];
            
        }
        
        $scope.eliminarRepresentante = function($index) {
            $scope.registro.arrayRepresentantes.splice($index, 1);
            
        }
        
        $scope.editarRepresentante = function($index) {
            $scope.agregarRepresentante=true;
            $scope.representante = $scope.registro.arrayRepresentantes[$index];
            $scope.representante.$index = $index;
            
            $scope.file.$valid = true; //Cuando se edita el archivo se encuentra correcto
        }
        
        $scope.cancelarAgregarRepresentante = function() {
            $scope.agregarRepresentante=false;
            $scope.representante = [];
        }
        
        $scope.mostrarFormularioAgregarRepresentante = function() {
            $scope.agregarRepresentante=true;
            $scope.representante = [];
        }
        
        //Funciones de gestión Actividad economica
        $scope.guardarActividadEconomica = function (actividadEconomica) {
            console.log(actividadEconomica);
            $scope.agregarActividadEconomica = false;
            if(actividadEconomica.$index==undefined) {
                actividadEconomica.actualizado = true;
                $scope.registro.arrayActividadesEconomicas.push(actividadEconomica);
            } else {
                actividadEconomica.actualizado = false;
                $scope.registro.arrayActividadesEconomicas[actividadEconomica.$index]= actividadEconomica;
            } 
            $scope.actividadEconomica = [];
        }
        
        $scope.mostrarFormularioAgregarActividadEconomica = function() {
            $scope.agregarActividadEconomica=true;
            $scope.establecimiento = [];
        }
        
        $scope.saveSolicitud = function (registro) {
            if(registro.informacion_veridica!==true || registro.acepto_formulario!==true) {
                bootbox.alert("Para radicar la registro debe aceptar la Declaración bajo gravedad de juramento y la firma digital del formulario.");
            } else {
                LoadingOverlap.show($scope);
                $scope.registroEnviada = angular.copy(registro);
                Upload.upload({
                    url: root +'RegistroMercantil/registro',
                    data: {
                        data: registro
                    },
                    transformResponse: function(json, headerGetter){return angular.fromJson(json);}
                }).then(function (response) {
                    LoadingOverlap.hide($scope);
                    $scope.respuesta.success = true;
                    $scope.responseSolicitud = response.data;
                });
            }
            // 
            // $scope.respuesta.message = "La registro se ha almacenado correctamente. <a href='https://www.cali.gov.co/aplicaciones/orweb/orweb/principal.php?id=202141610600000034' target='_blank'>Ver radicado</a>.<br><br>El tiempo de respuesta para este trámite es de x días, para hacerle seguimiento ingresa a 'Mis Solicituedes' en el menú lateral izquierdo.";
        }
    }
]);