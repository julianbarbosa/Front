saul.config(["$stateProvider",
    function ($stateProvider) {
        // $stateProvider.state("crear-artes-escenicas-parametro", {
        //     url: "/artesescenicas/crear/{idSolicitud}",
        //     views: {
        //         "main": {
        //             controller: "crearSolicitudArtesEscenicasCtrl",
        //             templateUrl: "../bundles/ArtesEscenicasBundle/crearSolicitud/crearSolicitud.tpl.html",
        //         }
        //     },
        // });

        $stateProvider.state("crear-artes-escenicas", {
            url: "/artesescenicas/crear",
            views: {
                "main": {
                    controller: "crearSolicitudArtesEscenicasCtrl",
                    templateUrl: "../bundles/ArtesEscenicasBundle/crearSolicitud/crearSolicitud.tpl.html",
                    // templateUrl: "../bundles/EventosyEspectaculosPublicosBundle/crearSolicitud/crearSolicitud.tpl.html",
                }
            },
        });

        $stateProvider.state("crear-eventos-deportivos", {
            url: "/eventosdeportivos/crear",
            views: {
                "main": {
                    controller: "crearSolicitudEventosDeportivosCtrl",
                    templateUrl: "../bundles/ArtesEscenicasBundle/crearSolicitud/crearSolicitudEventosDeportivos.tpl.html",
                    // templateUrl: "../bundles/EventosyEspectaculosPublicosBundle/crearSolicitud/crearSolicitud.tpl.html",
                }
            },
        });
        
        $stateProvider.state("crear-ferias-empresariales-y-eventos-sociales", {
            url: "/feriasempresarialesyeventossociales/crear",
            views: {
                "main": {
                    controller: "crearSolicitudFeriasEmpresarialesyEventosSocialesCtrl",
                    templateUrl: "../bundles/ArtesEscenicasBundle/crearSolicitud/crearSolicitudFeriasEmpresarialesyEventosSociales.tpl.html",
                    // templateUrl: "../bundles/EventosyEspectaculosPublicosBundle/crearSolicitud/crearSolicitud.tpl.html",
                }
            },
        });
        
        $stateProvider.state("marchas-y-protestas-pacificas", {
            url: "/marchasyprotestaspacificas/crear",
            views: {
                "main": {
                    controller: "crearSolicitudMarchasyProtestasPacificasCtrl",
                    templateUrl: "../bundles/ArtesEscenicasBundle/crearSolicitud/crearSolicitudMarchasyProtestasPacificas.tpl.html",
                    // templateUrl: "../bundles/EventosyEspectaculosPublicosBundle/crearSolicitud/crearSolicitud.tpl.html",
                }
            },
        });
    }
])

// .controller('ModalCtrlArtesEscenicas', ['$scope', '$uibModalInstance',  'FnCtrl',function ($scope, $modalInstance, FnCtrl) {
//         //fdsfsffds


//         //fdsfsf sds
//         // console.log($scope);
//         //$scope.mensaje = DataModal.mensaje;
//         //$scope.titulo = DataModal.titulo;
//         FnCtrl.init($scope);

//         $scope.home = function () {
//             $modalInstance.dismiss('cancel');
//             FnCtrl.afterHome($modalInstance);
//             //window.location.href = 'http://planeacion.cali.gov.co/saul';
//         };      
        
//         $scope.ok = function () {
//             $modalInstance.dismiss('cancel');
//             FnCtrl.afterOk($modalInstance);
//         };

//         $scope.recargar = function(){
//             //$modalInstance.dismiss('cancel');
//             FnCtrl.afterRecargar($modalInstance);
//         };

//         $scope.cambiar = function(){
//             $modalInstance.dismiss('cancel');
//             FnCtrl.afterCambiar($modalInstance);
//         };
//          $scope.cerrarSesion = function(){
//             $modalInstance.dismiss('cancel');
//             FnCtrl.afterCerrarSesion($modalInstance);
//         };
//            $scope.close = function(){         
//             $modalInstance.dismiss('cancel');
//             FnCtrl.afterClose($modalInstance);
//         };

// }])

// .controller("crearSolicitudArtesEscenicasCtrl", ["$scope", "$http", "$state", "root", "ArtesEscenicasProductor","ArtesEscenicasEvento","ArtesEscenicasAforo", "ArtesEscenicasSolicitud", "ArtesEscenicasActualizarEvento", '$uibModal', '$stateParams','$filter', 'ArtesEscenicasArchivosSolicitud', 'ArtesEscenicasDiasEvento','ArtesEscenicasRadicar','ArtesEscenicasPdfContador', 'ArtesEscenicasPdfRadicado', 'ArtesEscenicasActualizarCorreo','rootSaul1',
//     function (                                   $scope, $http, $state, root, ArtesEscenicasProductor, ArtesEscenicasEvento, ArtesEscenicasAforo, ArtesEscenicasSolicitud, ArtesEscenicasActualizarEvento, $modal, $stateParams, $filter, ArtesEscenicasArchivosSolicitud, ArtesEscenicasDiasEvento,ArtesEscenicasRadicar,ArtesEscenicasPdfContador, ArtesEscenicasPdfRadicado, ArtesEscenicasActualizarCorreo, rootSaul1) {
    .controller("crearSolicitudArtesEscenicasCtrl", ["$scope", "$http", "$state", "root", "ArtesEscenicasProductor", "Upload",
    function ($scope, $http, $state, root, ArtesEscenicasProductor, Upload) {
        $scope.notificacion = '';
        $scope.notificacion_radicado = '';
        $scope.notificacion_radicado_documentos = '';
        $scope.link_pulep = false;
        $scope.uperfil = '';

        // Realiza la consulta automatica del productor con los datos del usuario
        ArtesEscenicasProductor.query().$promise.then(function(result){
            
            //Controla el div de consulta del evento
            $scope.result_producer = result.existe;

            //Validamos si hay datos del productor
            if (result.existe == true) {
                
                $('#idDivPrincipal').removeClass('col-md-4');
                            
                $scope.Productor_CodigoProductor = result.datos_productor.CodigoProductor;
                $scope.Productor_TipoIdentificacion = result.datos_productor.TipoIdentificacion;
                $scope.Productor_NumeroIdentificacion = result.datos_productor.NumeroIdentificacion;
                $scope.Productor_RazonSocial = result.datos_productor.RazonSocial;
                $scope.Productor_TipoProductor = result.datos_productor.TipoProductor;
                $scope.Productor_TipoIdentificacionRepresentanteLegal = result.datos_productor.TipoIdentificacionRepresentanteLegal;
                $scope.Productor_NumeroIdentificacionRepresentanteLegal = result.datos_productor.NumeroIdentificacionRepresentanteLegal;
                $scope.Productor_RepresentanteLegal = result.datos_productor.RepresentanteLegal;
                $scope.Productor_Departamento = result.datos_productor.Departamento;
                $scope.Productor_DepartamentoCodigo = result.datos_productor.DepartamentoCodigo;
                $scope.Productor_Municipio = result.datos_productor.Municipio;
                $scope.Productor_MunicipioCodigo = result.datos_productor.MunicipioCodigo;
                $scope.Productor_Direccion = result.datos_productor.Direccion;
                $scope.Productor_Telefono = result.datos_productor.Telefono;
                $scope.Productor_Correo = result.datos_productor.Correo;
                $scope.Productor_PaginaWeb = result.datos_productor.PaginaWeb;
                $scope.Productor_EstadoSolicitud = result.datos_productor.EstadoSolicitud;
                $scope.uperfil = result.u_perfil;

                if (result.datos_productor.CodigoProductor != undefined) {
                    //Desactiva el div de carga 
                    $(".overlap_espera").fadeOut(800, "linear");
                    $(".overlap_espera_1").fadeOut(800, "linear");      
                }
            }
            else {
                //Desactiva el div de carga 
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");  
                $scope.notificacion = result.msg;
                if (result.codigo_error == 2) {
                    $scope.link_pulep = true;
                }
            }
        });

        // Funcion que valida el evento consultado
        $scope.validarEvento = function ($codigoEvento) {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

            $scope.aforoEventos = [];
            $scope.artistaEventos = [];
            $scope.documentosSolicitados = [];
            $scope.result_event = false;
            $scope.notificacion_obligatorio = false;
            $scope.notificacion = '';
            $scope.notificacion_aforo = '';
            $scope.notificacion_artista = '';
            $scope.notificacion_radicado = '';
            $scope.notificacion_radicado_documentos = '';
            $scope.documentos_completos = false;
            $scope.documentos_radicados = false;
            
            
            if ($codigoEvento == undefined) {
                $scope.notificacion_obligatorio = true;
                // alert('¡Debe ingresar el codigo del evento para poder continuar!')
                //Desactiva el div de carga 
                $(".overlap_espera").fadeOut(200, "linear");
                $(".overlap_espera_1").fadeOut(200, "linear"); 
            } 
            else if ($codigoEvento.length < 6) {
                $scope.notificacion_obligatorio = true;
                $scope.notificacion = 'El código del evento debe tener 6 caracteres. Ejemplo: ABC123';
                // alert('¡Debe ingresar el codigo del evento para poder continuar!')
                //Desactiva el div de carga 
                $(".overlap_espera").fadeOut(200, "linear");
                $(".overlap_espera_1").fadeOut(200, "linear"); 
            }
            else {

                $http.post(root+"artesescenicas/consultar_evento", {codigoEvento: $codigoEvento})
                    .success(function(data){
                        console.log(data);
                        // 1 => Notificamos que no ha sido posible establecer la conexion con el PULEP
                        // 2 => Notificamos que el evento no existe en el PULEP
                        // 3 => Notificamos que el codigo del evento pertenece a otro productor
                        // 4 => Notificamos que el codigo del evento pertenece a otra ciudad
                        $scope.codigo_error = [1, 2, 3, 4];

                        //Validamos si llegaron errores
                        if ($scope.codigo_error.includes(data.codigo_error)) {
                            $scope.notificacion = data.msg;
                        }
                        else {
                            $('#idDivPrincipal').addClass('col-md-4');
                            
                            $('#id_tab_carga_de_documentos').removeClass('active');
                            $('#id_tab_condiciones').addClass('active');
                            $('#id_tab_aforo').removeClass('active');
                            $('#id_tab_artistas').removeClass('active');

                            $('#tab_carga_de_documentos').removeClass('active');
                            $('#tab_condiciones').addClass('active');
                            $('#tab_aforo').removeClass('active');
                            $('#tab_artistas').removeClass('active');

                            //Controla el div de los datos del evento
                            $scope.result_event = data.existe;
    
                            //Datos del Evento
                            $scope.Evento_CodigoEvento = data.datos_evento.CodigoEvento;
                            $scope.Evento_TipoIdentificacionProductor = data.datos_evento.TipoIdentificacionProductor;
                            $scope.Evento_NumeroIdentificacionProductor = data.datos_evento.NumeroIdentificacionProductor;
                            $scope.Evento_CodigoProductor = data.datos_evento.CodigoProductor;
                            $scope.Evento_NombreProductor = data.datos_evento.NombreProductor;
                            $scope.Evento_CorreoProductor = data.datos_evento.CorreoProductor;
                            $scope.Evento_OperadorAutorizado = data.datos_evento.OperadorAutorizado;
                            $scope.Evento_TipoIdentificacionOperador = data.datos_evento.TipoIdentificacionOperador;
                            $scope.Evento_NumeroIdentificacionOperador = data.datos_evento.NumeroIdentificacionOperador;
                            $scope.Evento_NombreOperador = data.datos_evento.NombreOperador;
                            $scope.Evento_AbonoRecambio = data.datos_evento.AbonoRecambio;
                            $scope.Evento_CodigoEvento = data.datos_evento.CodigoEvento;
                            $scope.Evento_CodigoProductor = data.datos_evento.CodigoProductor;
                            $scope.Evento_CondicionDeclinacion = data.datos_evento.CondicionDeclinacion;
                            $scope.Evento_CondicionesAccesoEspecial = data.datos_evento.CondicionesAccesoEspecial;
                            $scope.Evento_CondicionesAdmision = data.datos_evento.CondicionesAdmision;
                            $scope.Evento_CorreoProductor = data.datos_evento.CorreoProductor;
                            $scope.Evento_Departamento = data.datos_evento.Departamento;
                            $scope.Evento_DepartamentoCodigo = data.datos_evento.DepartamentoCodigo;
                            $scope.Evento_Devolucion = data.datos_evento.Devolucion;
                            $scope.Evento_DireccionEscenario = data.datos_evento.DireccionEscenario;
                            $scope.Evento_DireccionWeb = data.datos_evento.DireccionWeb;
                            $scope.Evento_Error = data.datos_evento.Error;
                            $scope.Evento_EstadoEvento = data.datos_evento.EstadoEvento;
                            $scope.Evento_FechaFin = data.datos_evento.FechaFin.slice(8, 10)+"/"+data.datos_evento.FechaFin.slice(5, 7)+"/"+data.datos_evento.FechaFin.slice(0, 4);
                            $scope.Evento_FechaInicio = data.datos_evento.FechaInicio.slice(8, 10)+"/"+data.datos_evento.FechaInicio.slice(5, 7)+"/"+data.datos_evento.FechaInicio.slice(0, 4);
                            $scope.Evento_LineaServicioCliente = data.datos_evento.LineaServicioCliente;
                            $scope.Evento_Municipio = data.datos_evento.Municipio;
                            $scope.Evento_MunicipioCodigo = data.datos_evento.MunicipioCodigo;
                            $scope.Evento_NombreEscenario = data.datos_evento.NombreEscenario;
                            $scope.Evento_NombreEvento = data.datos_evento.NombreEvento;
                            $scope.Evento_NumeroFunciones = data.datos_evento.NumeroFunciones;
                            $scope.Evento_TelefonoEscenario = data.datos_evento.TelefonoEscenario;
                            $scope.Evento_TipoEspectaculo = data.datos_evento.TipoEspectaculo;
    


                            // console.log(data.datos_aforo.length);
                            if (data.datos_aforo != null) {
                                //Validamos si hay datos de aforo
                                if (data.datos_aforo.length > 0) {
                                    $scope.aforoEventos = data.datos_aforo;
        
                                    var total = 0;
                                    var valor_costo = 0;
                                    $scope.infoCosto = 'SIN COSTO';
                                    //Recorremos los aforos y obtenemos el valor total del mismo
                                    for (var i = 0; i < $scope.aforoEventos.length; i++){
                                        total =  ( total + Number($scope.aforoEventos[i]['Aforo']) );
                                        valor_costo =  ( valor_costo + Number($scope.aforoEventos[i]['ValorIndividualBoleta']) );
                                    }

                                    if (valor_costo > 0) {
                                        $scope.infoCosto = 'CON COSTO';
                                    }
                                    $scope.aforoTotal = total;
                                }
                                else {
                                    $scope.notificacion_aforo = 'No se encontraron datos del aforo';
                                }
                            }
    
                            //Validamos si hay datos de artistas
                            if (data.datos_artista != null) {
                                if (data.datos_artista.length > 0) {
                                    $scope.artistaEventos = data.datos_artista;
                                }
                                else {
                                    $scope.notificacion_artista = 'No se encontraron datos de los artistas';
                                }
                            }

                            //Validamos si el evento tiene asignada una solicitud
                            if (data.idsolicitud > 0) {
                                $scope.notificacion_radicado = 'El código del evento '+data.datos_evento.CodigoEvento+' tiene asignada la solicitud No. '+data.idsolicitud;
                                // console.log(data.datos_documentos);
                                $scope.documentosSolicitados = data.datos_documentos;
                                $('#id_tab_carga_de_documentos').addClass('active');
                                $('#tab_carga_de_documentos').addClass('active');
                                $('#id_tab_condiciones').removeClass('active');
                                $('#tab_condiciones').removeClass('active');
                            }

                            if (data.datos_documentos != null) {
                                if (data.datos_documentos.length > 0 && data.idsolicitud2 < 1) {
                                    var cantRequeridos = 0;
                                    for (var i = 0; i < data.datos_documentos.length; i++) {
                                        if (data.datos_documentos[i]['archivo'] != null && data.datos_documentos[i]['requerido'] == 1) {
                                            cantRequeridos++;
                                        }
                                    }
                                    console.log(cantRequeridos);
                                    if (cantRequeridos >= 13) {
                                        $scope.documentos_completos = true;
                                    }
                                }    
                            }

                            if (data.idsolicitud2 > 0) {
                                $scope.documentos_radicados = true;
                                $scope.notificacion_radicado_documentos = 'y la solicitud No. '+data.idsolicitud2+'.';
                            }
                            
                        }
    
                        //Desactiva el div de carga 
                        $(".overlap_espera").fadeOut(500, "linear");
                        $(".overlap_espera_1").fadeOut(500, "linear");  
                    })
                    .error(function(err){
                        console.log(err);
                    });
            }
        };

        // Funcion que inicia la solicitud de radicacion
        $scope.radicarEvento = function ($codigoEvento, $aforoEvento, $infoCosto) {
            
            // console.log($aforoEvento);
            if ($aforoEvento == undefined) {
                alert("Debe confirmar el aforo para continuar");
            }
            else {
                $(".overlap_espera").show();
                $(".overlap_espera_1").show();

                $http.post(root+"artesescenicas/radicar_solicitud", {codigoEvento: $codigoEvento, aforoEvento: $aforoEvento, infoCosto: $infoCosto})
                .success(function(data){
                    console.log(data);
                    //Desactiva el div de carga 
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear"); 
                    if (data.data.numRadicado) {
                        $scope.notificacion_radicado = 'Su solicitud ha sido radicada con el número '+data.data.numRadicado;
                    }
                })
                .error(function(err){
                    console.log(err);
                });
            }

        };

        //Funcion que guarda los documentos de manera sincronica
        $scope.guardarDocumentos = function ($idName, $codigoEvento) {
            //Extensiones permitidas
            var extensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
            
            var formData = new FormData();
            var file_data = $('#documento_'+$idName).prop("files")[0];

            if (file_data != undefined) {

                if( !extensions.test(file_data.name) ) {
                    alert('Por favor seleccione un archivo con los formatos permitidos: jpg, png y pdf');
                    return false;
                }

                $("#ver_documento_"+$idName).attr("hidden", true);
                $("#ver_documento_"+$idName).addClass("ng-hide");
                $("#ver_documento_"+$idName).removeAttr("href");
                
                formData.append("file", file_data);
                formData.append("idName", $idName);
                formData.append("codigoEvento", $codigoEvento);

                $scope.animateprogress($idName, 0, 65);
                $(".overlap_espera").show();
                $(".overlap_espera_1").show();

                var config = {
                    method: 'POST',
                    data: formData,
                    enctype: 'multipart/form-data',
                    url: root+"artesescenicas/guardar_documento",
                    headers: {
                        'Content-Type': undefined
                    }
                };
                
                $http(config).success(function(data){
                    // console.log('datos '+data);
                    $scope.animateprogress($idName, 65, 100);
                    
                    $("#documento_requerido_"+$idName).attr("hidden", true);
                    $("#ver_documento_"+$idName).attr("href", root+"upload/documentos/"+data.nombrearchivo);
                    $("#ver_documento_"+$idName).removeClass("ng-hide");
                    $("#ver_documento_"+$idName).removeAttr("hidden");

                    if (data.datos_documentos != null) {
                        if (data.datos_documentos.length > 8) {
                            var cantRequeridos = 0;
                            for (var i = 0; i < data.datos_documentos.length; i++) {
                                if (data.datos_documentos[i]['archivo'] != null && data.datos_documentos[i]['requerido'] == 1) {
                                    cantRequeridos++;
                                }
                            }

                            console.log(cantRequeridos);
                            if (cantRequeridos >= 13) {
                                $scope.documentos_completos = true;
                            }
                        }    
                    }

                    //Desactiva el div de carga 
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear"); 
                })
                .error(function(err){
                    console.log('Error '+err);
                    $('#barra_estado_'+$idName).val(0);
                    $('#span_'+$idName).html("0%");
                    //Desactiva el div de carga 
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
                    alert('¡No ha sido posible cargar el documento, por favor verifique e intente nuevamente!');
                }); 

                return false;
            }
            else {
                alert('¡Debe seleccionar un archivo para poder continuar!');
                return false;
            }
                
        };

        $scope.radicarDocumentos = function ($codigoEvento, $documentosRadicados) {
           // console.log($aforoEvento);
            if ($documentosRadicados) {
                alert("Ya existe un numero de radicado para los documentos cargados, por favor valide.");
            }
            else {
                $(".overlap_espera").show();
                $(".overlap_espera_1").show();

                $http.post(root+"artesescenicas/radicar_documentos", {codigoEvento: $codigoEvento})
                .success(function(data){
                    console.log(data);

                   if (data.data.numRadicado) {
                        $scope.notificacion_radicado_documentos = 'Su solicitud ha sido radicada con el número '+data.data.numRadicado;
                        $scope.validarEvento($codigoEvento);
                    }
                    //Desactiva el div de carga 
                    // $(".overlap_espera").fadeOut(500, "linear");
                    // $(".overlap_espera_1").fadeOut(500, "linear"); 

                })
                .error(function(err){
                    console.log(err);
                });
            } 
        };

        $scope.animateprogress = function (id, val_ini, val_fin){		

            var getRequestAnimationFrame = function () {  /* <------- Declaro getRequestAnimationFrame intentando obtener la máxima compatibilidad con todos los navegadores */
                return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||   
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function ( callback ){
                    window.setTimeout(enroute, 1 / 60 * 1000);
                };
                
            };
            
            var fpAnimationFrame = getRequestAnimationFrame();   
            var i = val_ini;
            var animacion = function () {
                    
            if (i <= val_fin) 
                {
                    $('#barra_estado_'+id).val(i);
                    $('#span_'+id).html( i+"%");
                    // document.getElementById(id).setAttribute("value",i);      /* <----  Incremento el valor de la barra de progreso */
                    // document.getElementById(id+"+ span").innerHTML = i+"%";     /* <---- Incremento el porcentaje y lo muestro en la etiqueta span */
                    i++;
                    fpAnimationFrame(animacion);          /* <------------------ Mientras que el contador no llega al porcentaje fijado la función vuelve a llamarse con fpAnimationFrame     */
                }
            }
            fpAnimationFrame(animacion);   /*  <---- Llamo la función animación por primera vez usando fpAnimationFrame para que se ejecute a 60fps  */
        };

        //Funcion que da formato a los numeros
        $scope.FormatearNumeros = function ($valor) {
            $valor += '';
            var num = $valor.replace(/\./g,'');
            if( !isNaN(num) ){
                num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
                num = num.split('').reverse().join('').replace(/^[\.]/,'');
                return num;
            }
		};

        //Funcion para el funcionamiento del tab, soluciona interferencia con las rutas de SAUL
        $scope.muestraTab = function ($tab) {
            if ($tab == 1) {
                $('#id_tab_carga_de_documentos').removeClass('active');
                $('#id_tab_condiciones').addClass('active');
                $('#id_tab_aforo').removeClass('active');
                $('#id_tab_artistas').removeClass('active');

                $('#tab_carga_de_documentos').removeClass('active');
                $('#tab_condiciones').addClass('active');
                $('#tab_aforo').removeClass('active');
                $('#tab_artistas').removeClass('active');
            }
            else if ($tab == 2) {
                $('#id_tab_carga_de_documentos').removeClass('active');
                $('#id_tab_condiciones').removeClass('active');
                $('#id_tab_aforo').addClass('active');
                $('#id_tab_artistas').removeClass('active');

                $('#tab_carga_de_documentos').removeClass('active');
                $('#tab_condiciones').removeClass('active');
                $('#tab_aforo').addClass('active');
                $('#tab_artistas').removeClass('active');
            } 
            else if ($tab == 3) {
                $('#id_tab_carga_de_documentos').removeClass('active');
                $('#id_tab_condiciones').removeClass('active');
                $('#id_tab_aforo').removeClass('active');
                $('#id_tab_artistas').addClass('active');

                $('#tab_carga_de_documentos').removeClass('active');
                $('#tab_condiciones').removeClass('active');
                $('#tab_aforo').removeClass('active');
                $('#tab_artistas').addClass('active');
            }
            else if ($tab == 4) {
                $('#id_tab_carga_de_documentos').addClass('active');
                $('#id_tab_condiciones').removeClass('active');
                $('#id_tab_aforo').removeClass('active');
                $('#id_tab_artistas').removeClass('active');

                $('#tab_carga_de_documentos').addClass('active');
                $('#tab_condiciones').removeClass('active');
                $('#tab_aforo').removeClass('active');
                $('#tab_artistas').removeClass('active');
            }
        };
    }
])
.controller("crearSolicitudEventosDeportivosCtrl", ["$scope", "$http", "$state", "root", 
    function ($scope, $http, $state, root) {
        $scope.notificacion = 'Estamos trabajando para brindarte un mejor servicio, espéralo pronto. Eventos Deportivos';
    }
])
.controller("crearSolicitudFeriasEmpresarialesyEventosSocialesCtrl", ["$scope", "$http", "$state", "root", 
    function ($scope, $http, $state, root) {
        $scope.notificacion = 'Estamos trabajando para brindarte un mejor servicio, espéralo pronto. Ferias Empresariales / Eventos Sociales';
    }
])
.controller("crearSolicitudMarchasyProtestasPacificasCtrl", ["$scope", "$http", "$state", "root", 
    function ($scope, $http, $state, root) {
        $scope.notificacion = 'Estamos trabajando para brindarte un mejor servicio, espéralo pronto. Marchas / Protestas Pacificas';
    }
]);

// .directive('archivoserver',['root',"ArtesEscenicasConsultarArchivos",'Upload', 'ArtesEscenicasVerArchivos', 'ArtesEscenicasEliminarArchivos', function(root, ArtesEscenicasConsultarArchivos,Upload,ArtesEscenicasVerArchivos,ArtesEscenicasEliminarArchivos) {
//     return {
//         scope: {
//             label: '@',
//             files: '=',
//             maxFileSize: '@',//En kb
//             types: '=',           
//             idSolicitud: '@',
//             idTipoDocumento: '@',
//             required: '@',
//             validate: '@',
//             disabledRemove: '@',
//             disabledDownload: '@'
//         },
//         templateUrl: "../bundles/ArtesEscenicasBundle/crearSolicitud/archivoserver.tpl.html",
//         link: function(scope, component){

//             scope.cargando = false;
//             scope.alerts = [];
//             scope.cargas_archivos =[];
//             scope.typeFiles = null;
//             //console.warn('En directiva: ', scope.label,' - ',scope.required);
            
//             if(!scope.maxFileSize){
//                 scope.maxFileSize = 2048;//kb
//             }

//             if(!scope.types){
//                 scope.typeFiles=[
//                     'application/pdf'
//                 ];
//             }else{
//                 scope.typeFiles = scope.types;

//             }

//             if(scope.files){
//                 //console.warn('Pasado files: ', scope.files);
//                 scope.listFiles = scope.files;
//             }else{
//                 scope.listFiles = [];
//             }

//             function updateHasError(){
//                 scope.hasError = (scope.required=='true' && scope.listFiles.length==0);
//             };

            
     
//             scope.closeAlert = function(index) {
//                scope.alerts.splice(index, 1);
//             };
//            scope.resetInputFile = function(){
//                 var rta = component[0].querySelector('.btn-clear-files').dispatchEvent(new Event('click'));
//             };

//            scope.initInputFile = function(){
//                 var input = component[0].querySelector('.input_file');
//                 $(input).pixelFileInput(
//                     {
//                         placeholder: 'Ningún archivo seleccionado...', 
//                         choose_btn_tmpl: '<a href="#" class="btn btn-xs btn-primary">Seleccionar</a>',
//                         clear_btn_tmpl:  '<a href="#" class="btn btn-xs btn-clear-files"><i class="fa fa-times"></i> Limpiar</a>'
//                     }
//                 );
//                 updateHasError();
//             };

//            scope.eliminarArchivo = function(index){
//                 // $(".overlap_espera").show();
//                 // $(".overlap_espera_1").show();
//                 ArtesEscenicasEliminarArchivos.get(
//                     {
//                         idSolicitud: scope.idSolicitud, 
//                         idSolicitudXDocumento: scope.listFiles[index].idSolicitudXDocumento
//                     }
//                 ).$promise.then(function(result){
//                     // $(".overlap_espera").fadeOut(500, "linear");
//                     // $(".overlap_espera_1").fadeOut(500, "linear");
//                     if(result.success){
//                         //console.warn(result);
//                         alert('Se elimino el archivo');
//                         scope.listarArchivos();
//                     } 
                    
//                     updateHasError();
//                    // console.warn('listFiles', scope.listFiles);
//                   //  console.warn('files',scope.files);
//                 }, function(){
//                     alert('Error encontrado');
//                 });
//                 //updateHasError();
//             };

//             scope.descargarArchivo = function(index){
//                 ArtesEscenicasVerArchivos.openFile(
//                     {
//                         idSolicitud: scope.idSolicitud, 
//                         idDocumento: scope.listFiles[index].tipoDocumento.iddocumento,
//                         idSolicitudXDocumento: scope.listFiles[index].idSolicitudXDocumento, 

//                     }
//                 );
//             };

//             scope.listarArchivos = function(){
//             //    alert(scope.idSolicitud);
//               //  alert(scope.idTipoDocumento);
//                // var lista = [];
//                scope.cargando = true;
                
//                 ArtesEscenicasConsultarArchivos.get(
//                     {
//                         idSolicitud: scope.idSolicitud, 
//                         idTipoDocumento: scope.idTipoDocumento
//                     }
//                 ).$promise.then(function(result){
//                     scope.cargando = false;
                 
//                     if(result.success){

//                         //scope.listFiles = result.data;
//                         scope.listFiles.length = 0;
//                         for(var i in result.data){
                
//                             scope.listFiles.push(result.data[i]);
//                         }
//                     }else{  
//                         alert('Oops, no hemos podido contactar el servidor.');
//                     }
//                     updateHasError();
//                    // console.warn('listFiles', scope.listFiles);
//                   //  console.warn('files',scope.files);
//               });
//             }

//             scope.$on("fileSelected", function (event, args) {
//                 scope.$apply(function () {
//                     if(args.file.size >  scope.maxFileSize*1024 ){
//                         scope.alerts.push({msg: 'El archivo "'+args.file.name+'" tiene un tamaño mayor a '+scope.maxFileSize+'kb.'});
//                         return;
//                     }

//                     var acepted = false;

                    
//                     //console.warn(scope.idSolicitud);
//                     if(args.file.type == scope.typeFiles){
//                        // console.warn("despues "+args.file.type);
//                         acepted = true;
//                     }

//                     if(acepted){
//                         Upload.upload({
//                             url: root +'solicitud/'+scope.idSolicitud+'/adjuntardoc/'+scope.idTipoDocumento,
//                             data: {
//                                 'archivo': args.file
//                             },
//                             transformResponse: function(json, headerGetter){return angular.fromJson(json);}
//                         }).then(function(response){
//                             //console.warn(response);
//                             if(response.data.success){
//                                 scope.listarArchivos();
//                             }else{
//                                 alert('Error cargando archivo');
//                             }
//                             updateHasError();
//                         }, function(){

//                         });
//                         scope.resetInputFile();
//                     }else{
//                         scope.alerts.push({msg: 'El archivo "'+args.file.name+'" debe tener alguno de los siguientes formatos:'+scope.typeFiles+'.', type:'warning'});
//                     }
//                 });
//             });

//             scope.initInputFile();
//             scope.listarArchivos();
//         }
//     };
//   }]);
