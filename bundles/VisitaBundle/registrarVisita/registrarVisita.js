saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("registrar-visita", {
            url: "/visita/:accion/:idVisita",
            views: {
                "main": {
                    controller: "RegistrarVisitaCtrl",
                    templateUrl: "../bundles/VisitaBundle/registrarVisita/registrarVisita.tpl.html"
                }
            }
        });
    }
]).directive('dateInput', function(){
    
    return {
        restrict : 'A',
        scope : {
            ngModel : '='
        },
        link: function (scope) {
            if (scope.ngModel) {                
                scope.ngModel = Date.parse(scope.ngModel);
            }
        }
    }
}).directive('stringToNumber', function () {
    
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                console.log("entro a stringToNumber1 "+scope.ngModel);
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                console.log("entro a stringToNumber2 "+scope.ngModel);
                return parseFloat(value);
            });
        }
    };
}) 
.controller("RegistrarVisitaCtrl", ["$scope", "$http","root", "$stateParams", "Visita", "EncabezadoVisita", "TipoSolicitud", "FormularioVisita", "Visitaxdocumento","dsJqueryUtils", "Upload", "$timeout", "$state", "LoadingOverlap", "PluginNomenclatura",
    function ($scope, $http, root, $stateParams, Visita, EncabezadoVisita, TipoSolicitud, FormularioVisita, Visitaxdocumento, dsJqueryUtils, Upload, $timeout, $state, LoadingOverlap, PluginNomenclatura) {
        var self = this;
        $scope.datavisita = [];
        // self.viewLoaded = false;
        $scope.root = root;
        // $scope.viewLoaded = false;
        $scope.cargarXls = false;
        // $scope.urlImagenes = "//planeacion.cali.gov.co/saul2/images/img_lineas/";        
        // $scope.imageStreetView = ""+$scope.urlImagenes+"street_view.png";
        // $scope.urlGeoportal = "https://geoportal.cali.gov.co/agserver/rest/services/Lineas/lineas_auto/MapServer/0";                               
        $scope.visita = {};
        $scope.files = {}; LoadingOverlap.show($scope);
        $scope.comentario = 'N/A';
        $scope.tipoFormulario = 'estático';
        
        $scope.inputFiles = {}; 
        $scope.dataPlantillaXls;
        $scope.root = root;
        $scope.visita.idVisita = $stateParams.idVisita;
        $scope.accion = $stateParams.accion;
        $scope.ocultarModal = true;
        $scope.notificaciones = [];
        $scope.arrayEstadoFinalVisita = [];
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();

        $scope.camposDinamicosVisita = [
            {"tipo":"texto"}
        ]
        $scope.agregarCampoFormularioDinamico = function($tipoCampo) {
            $scope.camposDinamicosVisita.push({"tipo":$tipoCampo});

        }
        
        //Búsqueda de la visita
        $scope.consultarVisita = function() {
            Visita.find({id: $stateParams.idVisita}).$promise.then(function (response) {
                $scope.visita = response;            
                $scope.comentario = response.observaciones;
                $scope.datavisita.longitud = response.longitud;
                $scope.datavisita.latitud = response.latitud;
                // $scope.agregarLocalizacion($scope.datavisita.longitud,$scope.datavisita.latitud);
                if($scope.accion=='revisar' || $scope.accion=='generar'|| $scope.accion=='firmar') {
                    $scope.camposformularioVisita = FormularioVisita.query({id: $stateParams.idVisita});
                    EncabezadoVisita.query({id: $stateParams.idVisita}).$promise.then(function(response) {
                        $scope.camposLectura = response;
                        $(".overlap_espera").fadeOut(500, "linear");
                        $(".overlap_espera_1").fadeOut(500, "linear");                    
                    });
                } else {
                    alert("Error acción inválida");
                }
                
                $scope.expediente = "";
            });        
        }
        $scope.consultarVisita();
        
        $scope.direccion ="";

        
        $scope.isReadOnly = false;
        $scope.tiposSolicitud = TipoSolicitud.query();

        $scope.tipoSolicitud = {};
        $scope.oculto = true;
        $scope.isSuccess = false;
        $scope.arrayDominio = [];

        $scope.hideAlert = function () {
            $scope.validator = {};
        };

        $scope.getVisitaXDocumento = function() {
            Visitaxdocumento.query({id: $stateParams.idVisita}).$promise.then(function (response) {            
                $scope.visitasxdocumento = response;
            });
        }
        $scope.getVisitaXDocumento();
        
        $scope.getDateValue = function(dateString) {
            console.log("entro a getDateValue");
            try {
                var date = new Date(dateString);
            } catch (exception) {
                var date = new Date();
            }
            if(date = 'Invalid Date') {
                date = null
            }
            return date;
        }

        $scope.getDominio = function(nombreDominio, valor) {
            if($scope.arrayDominio[nombreDominio] == undefined) {
                // LoadingOverlap.show($scope);
                $scope.arrayDominio[nombreDominio] = [];
                $http.get(root+"dominio/"+nombreDominio).then(function(response) {
                    $scope.arrayDominio[nombreDominio] = response.data;
                    $scope.arrayDominio[nombreDominio].unshift({"id":"", "nombre":"- Seleccione -"});
                }).finally(function(){
                    // LoadingOverlap.hide($scope);
                });
            }
        }

        $scope.getNotificaciones = function() {
            $http.get(root+"dominio/notificacion-construcciones").then(function(response) {
                $scope.notificaciones = response.data;                    
            });
        }
        $scope.getNotificaciones();

        $scope.getEstadoFinalVisita = function() {
            $http.get(root+"dominio/estado-final-visita").then(function(response) {
                $scope.arrayEstadoFinalVisita = response.data;                    
            });
        }
        $scope.getEstadoFinalVisita(); 
        
        
        $scope.changeSelect = function(nombreDominio) {
            return $scope.arrayDominio[nombreDominio][0];
            // $scope.selectedId = $scope.selectedItem && $scope.selectedItem.id
         }
        
        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};
            $scope.validator.alert.title = data.title;
            $scope.validator.alert.content = data.msg;
            $scope.validator.alert.type = data.type;
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        };

        //files adjuntos
        $scope.$on("fileSelected", function (event, args) {
            $scope.files = [];
            $scope.$apply(function () {
                $scope.files.push(args.file);
                $(".overlap_espera").show();
                $(".overlap_espera_1").show();
                Upload.upload({
                    url: root + 'visita',
                    data: {
                        idVisita: $scope.visita.idVisita,
                        filesAdjuntos: $scope.files
                    }
                }).then(function (response) {
                    $scope.getVisitaXDocumento();
                    $(".overlap_espera").hide();
                    $(".overlap_espera_1").hide();
                }, function(MessageChannel) {
                    alert("4Ha ocurrido un error informe al desarrollador. Gracias.");
                });
            });
        });
        //files

        $scope.removeFileAdjunto = function(id) {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            Upload.upload({
                url: root + 'visitaxdocumento/'+id
            }).then(function (response) {
                $scope.getVisitaXDocumento();
                $(".overlap_espera").hide();
                $(".overlap_espera_1").hide();
            });
        }

        // Función recursiva para buscar un atributo con un valor específico
        function actualizarPorAtributo(atributo, nuevoValor) {
            Object.keys($scope.camposformularioVisita).forEach(function(key1) {
                if($scope.camposformularioVisita[key1]!==null) {
                    if(Array.isArray($scope.camposformularioVisita[key1].arrayItems)) {
                        Object.keys($scope.camposformularioVisita[key1].arrayItems).forEach(function(key2) {
                            if(atributo == $scope.camposformularioVisita[key1].arrayItems[key2].item.items[0].codigo) {
                                console.error($scope.camposformularioVisita[key1].arrayItems[key2].item.items[0].valor);
                                $scope.camposformularioVisita[key1].arrayItems[key2].item.items[0].valor = nuevoValor;
                                console.log($scope.camposformularioVisita[key1].arrayItems[key2].item.items[0].valor);
                            } 
                        });
                    }
                }
            });
            
        }

        $scope.eliminarImagen = function(input) {
            bootbox.confirm("Confirma que desea elimar la imagen?",
            function (result) {
                if(result) {
                    $scope.valoresFormulario = [];
                    $scope.valoresFormulario.push({codigo: input.codigo, valor: null, tipoItem: input.tipoItem});
                    Upload.upload({
                        url: root + 'visita',
                        data: {
                            idVisita: $scope.visita.idVisita,
                            data: $scope.valoresFormulario
                        }
                    }).then(function (response) {
                        actualizarPorAtributo(input.codigo, null);                
                    }, function(MessageChannel) {
                        alert("Ha ocurrido un error informe al desarrollador. Gracias.");
                    });  
                }                     
            })     
        }

        $scope.agregarNuevaVisita = function() {
            var data = {};
            data['idVisita'] = $scope.visita.idVisita;
            data['direccionQueja'] = $scope.visita.direccionQueja;
            bootbox.confirm("Confirma que desea agregar una nueva visita al proceso?",
                    function (result) {
                        LoadingOverlap.show($scope);
                        if (result) {
                            Upload.upload({
                                url: root + 'visita/hija',
                                data: data
                            }).then(function (response) {
                                $scope.consultarVisita();
                                LoadingOverlap.hide($scope);
                            });
                        }
                    });

        }

        $scope.saveValueVisita = function(inputName, inputValue) {
            var data = {};
            data['idVisita'] = $scope.visita.idVisita;
            data[inputName] = $scope.visita[inputValue];
            Upload.upload({
                url: root + 'visita',
                data: data
            }).then(function (response) {
                
            });
        }

        $scope.saveItem = function(input) {
            if(input !== undefined) {
                $scope.valoresFormulario = [];
                filesToSend = [];
                if(input.tipoItem == 'hora') {
                    const dateObject = new Date(input.valor);
                    const options = { timeZone: 'America/Bogota' };
                    const formattedDate = dateObject.toLocaleString('en-US', options);
                    $scope.valoresFormulario.push({codigo: input.codigo, valor: formattedDate, tipoItem: input.tipoItem});
                } else if(input.tipoItem == 'fecha') {
                    const dateObject = new Date(input.valor);
                    const options = { timeZone: 'America/Bogota', year: 'numeric', month: 'numeric', day: 'numeric' };
                    const formattedDate = dateObject.toLocaleString('en-US', options);
                    $scope.valoresFormulario.push({codigo: input.codigo, valor: formattedDate, tipoItem: input.tipoItem});
                } else if(input.tipoItem == 'imagen') {                   
                    filesToSend[input.codigo] = $scope.inputFiles[input.codigo];
                    $scope.valoresFormulario.push({codigo: input.codigo, valor: input.valor, tipoItem: input.tipoItem});            
                } else {
                    $scope.valoresFormulario.push({codigo: input.codigo, valor: input.valor, tipoItem: input.tipoItem});
                }
                Upload.upload({
                    url: root + 'visita',
                    data: {
                        idVisita: $scope.visita.idVisita,
                        data: $scope.valoresFormulario,
                        files: filesToSend,
                    }
                }).then(function (response) {
                    if(!response.data.success || response.data.success!==true) {
                        console.log(response);
                        alert("Ha ocurrido un error en response informe al desarrollador. Gracias. "+response.data.msg);
                    }
                    if(response.data.value && response.data.value!=='') {
                        actualizarPorAtributo(input.codigo, response.data.value); 
                    }
                }, function(MessageChannel) {
                    alert("2Ha ocurrido un error informe al desarrollador. Gracias.");
                });
            }
        }

        $scope.alerta = function() {
            alert("La alerta con callback funciona");
        }

        $scope.setCargarXls = function(value) {
            console.log("entor a set cargar xls");
            $scope.cargarXls = true;
        }

        $scope.cargarXlsVisita = function() {
            
            Upload.upload({
                url: root + 'constructorvisita/leercampos',
                data: {
                    idVisita: $scope.visita.idVisita,
                    fileXls: $scope.dataPlantillaXls
                }
            }).then(function (response) {
                
            }, function(MessageChannel) {
                alert("3Ha ocurrido un error informe al desarrollador. Gracias.");
            });
        }
        
        $scope.save = function (finalizar) {
            if (finalizar!==0) {
                if($scope.estadoFinalVisita == undefined && finalizar=='firmado' && $scope.accion=='firmar') {
                    bootbox.alert("El estado final de la visita es obligatorio.");
                }
                else if($scope.nuevaVisita.requiereVisita==true && $scope.nuevaVisita.fecha_visita== undefined && $scope.accion=='firmar') {
                    bootbox.alert("La fecha de nueva visita es obligatoria.");
                } else {
                    bootbox.confirm("Confirma que finalizó el proceso?",
                    function (result) {
                        if (result) {
                            $(".overlap_espera").show();
                            $(".overlap_espera_1").show();
                            Upload.upload({
                                url: root + 'visita',
                                data: {
                                    idVisita: $scope.visita.idVisita,
                                    visita: $scope.datavisita,
                                    finalizar: finalizar,
                                    comentario: $scope.comentario,
                                    comentariointerno: $scope.comentariointerno,
                                    notificaciones: $scope.notificaciones,
                                    estadoFinal: $scope.estadoFinalVisita,
                                    nuevaVisita: $scope.nuevaVisita,                                    
                                    respuestasolicitante: $scope.visita.respuestasolicitante
                                }
                            }).then(function (response) {
                                $(".overlap_espera").fadeOut(500, "linear");
                                $(".overlap_espera_1").fadeOut(500, "linear"); 
                                $scope.result = response.data;
                                callback(response.data);
                                if (response.data.success) {
                                    $scope.asignacion = {};
                                }
                                $scope.isSuccess = true;
                            });
                        } else {
                            dsJqueryUtils.goTop();
                        }
                    });
                }
            } else {
                $(".overlap_espera").show();
                $(".overlap_espera_1").show();
                Upload.upload({
                    url: root + 'visita',
                    data: {
                        idVisita: $scope.visita.idVisita,
                        visita: $scope.datavisita,
                        finalizar: finalizar,
                        comentario: $scope.comentario,
                        comentariointerno: $scope.comentariointerno,
                        respuestasolicitante: $scope.respuestasolicitante            
                    }
                }).then(function (response) {
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear"); 
                    $scope.result = response.data;
                    callback(response.data);
                    if (response.data.success) {
                        $scope.asignacion = {};
                    }
                    $scope.isSuccess = true;
                });
            }
        };
        

        $scope.cancel = function () {
        };

        $scope.obtenerModalIngresoDireccion = function (input) {              
            PluginNomenclatura.obtenerModalIngresoDireccion(
              $scope,
              function (data) {
                actualizarPorAtributo(input.codigo, data.direccion + (data.infoAdicional ? " " + data.infoAdicional : ""));     
                input.valor = data.direccion + (data.infoAdicional ? " " + data.infoAdicional : "");
                $scope.saveItem(input);
              }
            );
          };

    }
]);