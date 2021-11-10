saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("crear-artes-escenicas-parametro", {
            url: "/artesescenicas/crear/{idSolicitud}",
            views: {
                "main": {
                    controller: "crearSolicitudArtesEscenicasCtrl",
                    templateUrl: "../bundles/ArtesEscenicasBundle/crearSolicitud/crearSolicitud.tpl.html",
                }
            },
        });

        $stateProvider.state("crear-artes-escenicas", {
            url: "/artesescenicas/crear",
            views: {
                "main": {
                    controller: "crearSolicitudArtesEscenicasCtrl",
                    templateUrl: "../bundles/ArtesEscenicasBundle/crearSolicitud/crearSolicitud.tpl.html",
                }
            },
        });
    }
])

.controller('ModalCtrlArtesEscenicas', ['$scope', '$uibModalInstance',  'FnCtrl',function ($scope, $modalInstance, FnCtrl) {

   // console.log($scope);
        //$scope.mensaje = DataModal.mensaje;
        //$scope.titulo = DataModal.titulo;
        FnCtrl.init($scope);

        $scope.home = function () {
            $modalInstance.dismiss('cancel');
            FnCtrl.afterHome($modalInstance);
            //window.location.href = 'http://planeacion.cali.gov.co/saul';
        };      
        
        $scope.ok = function () {
            $modalInstance.dismiss('cancel');
            FnCtrl.afterOk($modalInstance);
        };

        $scope.recargar = function(){
            //$modalInstance.dismiss('cancel');
            FnCtrl.afterRecargar($modalInstance);
        };

        $scope.cambiar = function(){
            $modalInstance.dismiss('cancel');
            FnCtrl.afterCambiar($modalInstance);
        };
         $scope.cerrarSesion = function(){
            $modalInstance.dismiss('cancel');
            FnCtrl.afterCerrarSesion($modalInstance);
        };
           $scope.close = function(){         
            $modalInstance.dismiss('cancel');
            FnCtrl.afterClose($modalInstance);
        };

    }])

.controller("crearSolicitudArtesEscenicasCtrl", ["$scope", "$state", "root", "ArtesEscenicasProductor","ArtesEscenicasEvento","ArtesEscenicasAforo", "ArtesEscenicasSolicitud", "ArtesEscenicasActualizarEvento", '$uibModal', '$stateParams','$filter', 'ArtesEscenicasArchivosSolicitud', 'ArtesEscenicasDiasEvento','ArtesEscenicasRadicar','ArtesEscenicasPdfContador', 'ArtesEscenicasPdfRadicado', 'ArtesEscenicasActualizarCorreo','rootSaul1',
    function (                                   $scope, $state, root, ArtesEscenicasProductor, ArtesEscenicasEvento, ArtesEscenicasAforo, ArtesEscenicasSolicitud, ArtesEscenicasActualizarEvento, $modal, $stateParams, $filter, ArtesEscenicasArchivosSolicitud, ArtesEscenicasDiasEvento,ArtesEscenicasRadicar,ArtesEscenicasPdfContador, ArtesEscenicasPdfRadicado, ArtesEscenicasActualizarCorreo, rootSaul1) {

        
        $scope.mostrarDatosEvento = false;
        
      //  $scope.diasradicado=0;
        $scope.accion_radicar = false;
        $scope.select_sn=[{label:'Si', value: 1},{label:'No', value: 0}];
        $scope.selectpoblacion=['Fluctuante','Permanente'];
        $scope.selectsuministro=['Venta','Gratuito','Refrigerio'];
        $scope.selectalimento=['Comida rapida','Procesamiento de alimentos','Productos empacados'];    

        $(".overlap_espera").show();
        $(".overlap_espera_1").show();

        $scope.solicitud ={};
        $scope.inputs = [];

        $scope.misVariables = {
            result_evento: {}
        };

        ArtesEscenicasProductor.query().$promise.then(function(result){
            $scope.result = result;
            
            $(".overlap_espera").fadeOut(500, "linear");
            $(".overlap_espera_1").fadeOut(500, "linear");
            if(result['existe']==true && result['correo_igual']==true){
               if($stateParams.idSolicitud){
                    ArtesEscenicasSolicitud.query({solicitud: $stateParams.idSolicitud}).$promise.then(function(result_solicitud){
                  
                        $scope.result_solicitud=result_solicitud;                       
                        if($scope.result_solicitud.success){     
                            $scope.validarEvento($scope.result_solicitud.evento.codigoEvento); 
                           // $scope.consultarArchivosxSolicitud(12) ;
                        }
                    }, function(err){
                        //console.warn(err);
                    });
                }else{
                    $scope.mostrarDatosEvento = true;
                }
            }else{

                $scope.openModal();
            }
        });

//--------------------------------------------------------------------------
        $scope.misVariables.result_evento = {};

        $scope.item = {};
        $scope.item.cronogramas = [];

        $scope.cargandoDiasEvento = false;


        angular.isUndefinedOrNull = function(value) {
            return angular.isUndefined(value) || null === value
        };
        
        $scope.agregarCronograma = function(data) {
            $scope.item_cronograma = {
                actividad: data.actividad,
                fecha: data.fecha,
                hora: data.hora,
               
            };
            $scope.item.cronogramas.push($scope.item_cronograma);
            $scope.demarcacion = {}
        };
        
        $scope.quitarCronograma = function($index) {
            $scope.item.cronogramas.splice($index, 1);
        };
        
        $scope.onSelect = function ($item, $model, $label) {
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;
        };
        
        $scope.hideAlert = function() {
            $scope.validator = {};
        };

        $scope.validarInputs = function(){
           
            var salida = true;

            for(var i = 0; i<$scope.inputs.length;i++){
                if(
                    /*(
                        $scope.misVariables.result_evento.usoAmplificacionSonora==0 && (
                            $scope.inputs[i].nombre=='Archivo de costos del evento firmado por contador' ||
                            $scope.inputs[i].nombre=='Fotocopia tarjeta profesional del contador' ||
                            $scope.inputs[i].nombre=='Fotocopia CC del solicitante o representante legal' ||
                            $scope.inputs[i].nombre=='Mapa o esquema de ubicacion de equipos de sonido y tarima' 
                           
                        )
                    )
                    ||*/
                    (
                        $scope.suministro == 0 &&(
                            $scope.inputs[i].nombre == 'Contratos proveedores de alimentos' ||
                            $scope.inputs[i].nombre == 'Contratos proveedores de bebidas' 
                     
                        )
                    )
                    ||
                    (
                        $scope.misVariables.result_evento.conceptoFuncionalEscenario==0 && (
                            $scope.inputs[i].nombre=='Concepto tecnico'
                        )
                    )
                    ||
                    $scope.inputs[i].nombre == 'Garantias o polizas para amparar contribucion parafiscal'
                    ||
                     (
                        $scope.misVariables.result_evento.usoAmplificacionSonora==0 && (
                            $scope.inputs[i].nombre=='Mapa o esquema de ubicacion de equipos de sonido y tarima'
                        )
                    )
                ){
                   // console.warn('Dentro del TRUEEEEEEEE: ', $scope.inputs[i]);
                }else{
                   if( $scope.inputs[i].files.length==0 ){
                        salida = false;
                     //   console.warn('El error está en el input ',$scope.inputs[i].nombre, '-', i);
                        break;
           
                    }
                }
            }
            return salida;
           // console.log("Inputs validados >0 son:"+$scope.inputs[i].files.length);
        };

        $scope.radicar = function($arreglo_evento){

            $scope.radicacion="Si";
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

            var arreglojson = angular.toJson($arreglo_evento);   
            if($scope.validarInputs()){        


            console.warn('Intentando radicar...');
            ArtesEscenicasRadicar.query({evento:arreglojson}).$promise.then(function(result_radicado){  
                console.warn('se ha terminado de crear el radicado. Set result_radicado', result_radicado);
                //$scope.validarEvento($scope.misVariables.result_evento.codigoEvento);
                $scope.result_radicado = result_radicado;
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                $scope.accion_radicar = true;
                $scope.openModal();                
                //$scope.recargar(idSolicitud);*/
            });
            }else{
                 alert('No tiene todos los archivos cargados.');
              
            }

        };

         $scope.recargar = function () {
             ArtesEscenicasPdfRadicado.openPdfRadicado({idsolicitud: $scope.misVariables.result_evento.idsolicitud});  
        };
      
        $scope.cambiarCorreo = function(){
            ArtesEscenicasActualizarCorreo.query({correo: $scope.result.datos_productor.Correo}).$promise.then(function(result_cambio){
               // window.location.href = '/saul/logout';
                $scope.result_cambio = result_cambio;
                //console.log($scope.result_cambio);
               $scope.openModal();
                //alert(result_cambio.correo);
            });  
        };

        $scope.SesionOut = function(){
            window.location.href = rootSaul1+'logout';
        };

        $scope.validarDias = function($codigoEvento){
             $scope.diasradicado = 0;   
            
            $scope.mostrardiashabiles=false;
            $scope.cargandoDiasEvento = true;
            ArtesEscenicasDiasEvento.query({evento: $codigoEvento}).$promise.then(function(result_dias){
                $scope.cargandoDiasEvento = false;
                $scope.result_dias=result_dias;
                $scope.diasradicado = $scope.result_dias.diasHabilesRestantes-15;
                $scope.mostrardiashabiles=true;

                if($scope.diasradicado<=0){
                    $scope.diasradicado = 0;
                } 
            }, function(){
                $scope.cargandoDiasEvento = true;
                alert('Ha ocurrido un error cargando días.');
            });

        };

        $scope.validarEvento = function ($codigoEvento) {
            $scope.radicacion="No";
            $scope.mostrarDatosEvento = false;
            $scope.cargandoDiasEvento = true;
            //$scope.misVariables.result_evento = {};
           
            //$scope.mostrardiashabiles=false;
            console.log("Validando evento....", $codigoEvento);
            
            ArtesEscenicasEvento.query({evento: $codigoEvento}).$promise.then(function(result_evento){
                //$scope.mostrardiashabiles=true;
                //console.log(result_evento.aforo);
                if(result_evento.success){
                   // console.log(result_evento.evento.aforo);
                    $scope.validarDias($codigoEvento);

                    //console.log("los dias son mayores a cero");    
                    //console.warn(result_evento.evento);
                    if(result_evento.success){
                        if(result_evento.evento.fechaMontaje!=null && result_evento.evento.fechaDesmontaje!=null){
                            result_evento.evento.fechaMontaje = $filter('date')(result_evento.evento.fechaMontaje.timestamp*1000, 'yyyy-MM-dd');
                            result_evento.evento.fechaDesmontaje = $filter('date')(result_evento.evento.fechaDesmontaje.timestamp*1000, 'yyyy-MM-dd');
                           
                        }
                       
                        $scope.misVariables.result_evento=result_evento.evento;
                        console.log("Evento validado .... SET result_evento: ",result_evento.evento);
                        
                        
                        if(!$scope.misVariables.result_evento.horaFin){
                            $scope.misVariables.result_evento.horaFin = '05:00 PM';
                        }
                        if(!$scope.misVariables.result_evento.horaIngreso){
                            $scope.misVariables.result_evento.horaIngreso = '05:00 PM';
                        }
                        if(!$scope.misVariables.result_evento.horaIngresoAlimento){
                           $scope.misVariables.result_evento.horaIngresoAlimento = '05:00 PM';
                        }
                        if(!$scope.misVariables.result_evento.horaMontaje){
                            $scope.misVariables.result_evento.horaMontaje = '05:00 PM';
                        }
                        if(!$scope.misVariables.result_evento.horaDesmontaje){
                            $scope.misVariables.result_evento.horaDesmontaje = '05:00 PM';
                        }
                        $scope.solicitud_result = result_evento.solicitud;
                        $scope.consultarArchivosxSolicitud($scope.solicitud_result.idtiposolicitud);                                                                 
                        $scope.otro = false;
                        
                        if ($scope.misVariables.result_evento.ingresoOtro) {
                            $scope.otro = true;
                        }else{
                            $scope.otro = false;
                        }
                        if($scope.misVariables.result_evento.tipoSuministro){
                            $scope.suministro = 1;
                        }else{
                            $scope.suministro = 0;
                        }
                        //$state.go('crear-artes-escenicas-parametro', {idSolicitud: $scope.misVariables.result_evento['codigoSolicitud']});

                        ArtesEscenicasAforo.query({evento: $codigoEvento}).$promise.then(function(result_aforo){
                           
                           $scope.result_aforo=result_aforo;
                            for(var i in $scope.result_aforo.Boleteria){
                                $scope.result_aforo.Boleteria[i].totalBoleta = parseFloat($scope.result_aforo.Boleteria[i].ValorIndividualBoleta)+parseFloat($scope.result_aforo.Boleteria[i].ValorServicio);
                            }
                            $scope.mostrarDatosEvento = true;
                        });
                    }else{
                        alert(result_evento.msg);
                        $scope.mostrarDatosEvento = true;
                    }
                }else{
                     $scope.mostrarDatosEvento = true;
                     $scope.mostrardiashabiles=false;
                     $scope.misVariables.result_evento = {};
                    alert(result_evento.msg);             

                  }
            });
        };

        $scope.validaralimentos = function(){
            if($scope.suministro==0){
                $scope.misVariables.result_evento.tipoSuministro="";
                $scope.misVariables.result_evento.tipoAlimento="";
                $scope.misVariables.result_evento.horaIngresoAlimento = '05:00 PM';
            }

        };

         $scope.actualizar = function ($arreglo_evento) {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            //console.warn("Arreglo evento",$arreglo_evento);

            for(var i in $arreglo_evento){
                if(typeof $arreglo_evento[i] == 'undefined'){
                    $arreglo_evento[i] = null;
                }
            }

           // console.warn("arreglo nuevo",$arreglo_evento);

            var arreglojson = angular.toJson($arreglo_evento);

            ArtesEscenicasActualizarEvento.query({evento: arreglojson}).$promise.then(function(result_actualizar){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                $scope.result_actualizar = result_actualizar;
               if(result_actualizar.success){
                    $scope.openModal();
               }else{
                   $scope.openModal();
               }

            }, function(error){
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                alert('Ha ocurrido un error');
            });
         };


        $scope.openModal = function () {
            //alert('Abriendo Modal');
            var FnCtrl = {
                init: function(scope){
                    scope.result_radicado = $scope.result_radicado;
                    scope.result = $scope.result;
                    scope.result_cambio = $scope.result_cambio;
                    scope.result_actualizar = $scope.result_actualizar;
                    scope.radicacion = $scope.radicacion;
                },
                afterClose: function(modal){                   
                },
                afterOk: function (modal) {
                    //$scope.validarEvento($scope.misVariables.result_evento.codigoEvento);
                    
                    window.location.href = rootSaul1 + 'v2\/?url=\/artesescenicas\/crear\/' + $scope.misVariables.result_evento.idsolicitud;
                    $scope.recargar();
                    console.warn('vALIDANDO EVENTO!!!!');
                    //$scope.close();
                    //window.location.href = 'http://planeacion.cali.gov.co/saul';
                },
                afterRecargar: function (modal) {
                    $scope.recargar();
                    //$scope.close();
                    //window.location.href = 'http://planeacion.cali.gov.co/saul';
                }, 
                afterCambiar: function (modal) {
                    $scope.cambiarCorreo();                    
                    //$scope.close();
                    //window.location.href = 'http://planeacion.cali.gov.co/saul';
                },
                afterCerrarSesion: function(modal){
                    $scope.SesionOut();    
                },
                afterHome: function(modal){
                    window.location.href = rootSaul1;
                },               

            };

            var modalInstance = $modal.open({
                templateUrl: "../bundles/ArtesEscenicasBundle/crearSolicitud/modal.tpl.html",
                controller: 'ModalCtrlArtesEscenicas',
                size: 'md',
                //scope: $scope,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    FnCtrl: function () {
                        return FnCtrl;
                    }
                }
            }).closed.then(function () {
                //alert('Callback ejecutado');
                //console.warn($scope.datosModal);
            });
        };


//-------------------------Wizard JQUERY-----------------------------------------------------------------
        $scope.varibalesform = {};

        $scope.pdfContador = function(){

            var arreglocontador = new Object();

            
            arreglocontador['valorMaterias']=$scope.misVariables.result_evento.costoMateria;
            arreglocontador['manoObraUtilizada']=$scope.misVariables.result_evento.costoManoObra;
            arreglocontador['arrendamientos']=$scope.misVariables.result_evento.costoArrendamientoServicios;
            arreglocontador['mantenimientoReparacion']=$scope.misVariables.result_evento.costoMantenimiento;
            arreglocontador['desmantelamiento']=$scope.misVariables.result_evento.costoDesmantelamiento;
            arreglocontador['demasCostos']=$scope.misVariables.result_evento.costoOtros;
            arreglocontador['nombreContador']=$scope.varibalesform.nomcontador2;
            arreglocontador['documentoContador']=$scope.varibalesform.doccontador;
            arreglocontador['numeroTarjeta']=$scope.varibalesform.tarjetacontador;
            arreglocontador['nombreEvento']=$scope.misVariables.result_evento.nombreEvento;
            arreglocontador['codigoEvento']=$scope.misVariables.result_evento.codigoEvento;
            arreglocontador['municipio']=$scope.misVariables.result_evento.municipio;
            arreglocontador['totalCostos']=$scope.misVariables.result_evento.costoManoObra+$scope.misVariables.result_evento.costoMateria+$scope.misVariables.result_evento.costoArrendamientoServicios+$scope.misVariables.result_evento.costoMantenimiento+$scope.misVariables.result_evento.costoDesmantelamiento+$scope.misVariables.result_evento.costoOtros;

            
             ArtesEscenicasPdfContador.openPdfContador({datospdf: arreglocontador});       
           
            
        }
           

//-------------------------Wizard JQUERY-----------------------------------------------------------------

          
        $scope.WizardForm = function(){

                        $('.ui-wizard-example').pixelWizard({
                            onChange: function () {
                                //console.log('Current step: ' + this.currentStep());
                            },
                            onFinish: function () {
                                // Disable changing step. To enable changing step just call this.unfreeze()
                                this.freeze();
                                //console.log('Wizard is freezed');
                                //console.log('Finished!');
                            }
                        });

                        $('.wizard-next-step-btn').click(function () {
                            //$(this).parents('.ui-wizard-example').pixelWizard('nextStep');//No funciona bn
                            $('.ui-wizard-example ul li.active').each(function(i, el){
                                if( !$(el).hasClass('completed') ){
                                    var numero = parseInt($(el).find('.wizard-step-number').text());
                                    $('.ui-wizard-example').pixelWizard('setCurrentStep', numero+1 );
                                }
                            });
                        });

                        $('.wizard-prev-step-btn').click(function () {
                            $('.ui-wizard-example ul li.active').each(function(i, el){
                                if( !$(el).hasClass('completed') ){
                                    var numero = parseInt($(el).find('.wizard-step-number').text());
                                    $('.ui-wizard-example').pixelWizard('setCurrentStep', numero-1 );
                                }
                            });
                        });

                        $('.wizard-steps.wizard-go-to-number > li > span').click(function(el){
                            var numero = $(el.target).parents('li').find('.wizard-step-number').text();
                            $(this).parents('.ui-wizard-example').pixelWizard('setCurrentStep', numero );
                        });

                        $('#ui-wizard-modal').on('show.bs.modal', function (e) {
                            var $modal = $(this),
                                $wizard = $modal.find('.ui-wizard-example'),
                                timer = null,
                                callback = function() {
                                    if (timer) clearTimeout(timer);
                                    if ($modal.hasClass('in')) {
                                        $wizard.pixelWizard('resizeSteps');
                                    } else {
                                        timer = setTimeout(callback, 10);
                                    }
                                };
                            callback();
                        });
        }

//-------------------------Wizard JQUERY Fin-----------------------------------------------------------------

        $scope.consultarArchivosxSolicitud = function($numerosolicitud){
            
            ArtesEscenicasArchivosSolicitud
            .get({idTipoSolicitud: $numerosolicitud})
            .$promise
            .then(function(result){
                $scope.inputs = result;    
                //console.warn('consultarArchivosxSolicitud: ', $scope.inputs);           
                for(var i in $scope.inputs){
                    $scope.inputs[i].files=[];                    
                }
            });
        }
//-------------------------Hora JQUERY-----------------------------------------------------------------
        $scope.timeInput = function(){
                var options = {
                            minuteStep: 5,
                            orientation: $('body').hasClass('right-to-left') ? { x: 'right', y: 'auto'} : { x: 'auto', y: 'auto'}
                        }
                        $('.bs-timepicker-example').timepicker(options);

        }
           
//-------------------------Hora JQUERY----------------------------------------------------------------

        $scope.start = function(){
            $scope.init();
        };


        $scope.init = function(){

            $scope.WizardForm();
            $scope.timeInput();
            //$scope.initInputFile();
            $('.bs-datepicker-component').datepicker({
                format: "yyyy-mm-dd"
            });

        
        };

 $scope.start();
    }
])


 .directive('archivoserver',['root',"ArtesEscenicasConsultarArchivos",'Upload', 'ArtesEscenicasVerArchivos', 'ArtesEscenicasEliminarArchivos', function(root, ArtesEscenicasConsultarArchivos,Upload,ArtesEscenicasVerArchivos,ArtesEscenicasEliminarArchivos) {
    return {
        scope: {
            label: '@',
            files: '=',
            maxFileSize: '@',//En kb
            types: '=',           
            idSolicitud: '@',
            idTipoDocumento: '@',
            required: '@',
            validate: '@',
            disabledRemove: '@',
            disabledDownload: '@'
        },
        templateUrl: "../bundles/ArtesEscenicasBundle/crearSolicitud/archivoserver.tpl.html",
        link: function(scope, component){

            scope.cargando = false;
            scope.alerts = [];
            scope.cargas_archivos =[];
            scope.typeFiles = null;
            //console.warn('En directiva: ', scope.label,' - ',scope.required);
            
            if(!scope.maxFileSize){
                scope.maxFileSize = 2048;//kb
            }

            if(!scope.types){
                scope.typeFiles=[
                    'application/pdf'
                ];
            }else{
                scope.typeFiles = scope.types;

            }

            if(scope.files){
                //console.warn('Pasado files: ', scope.files);
                scope.listFiles = scope.files;
            }else{
                scope.listFiles = [];
            }

            function updateHasError(){
                scope.hasError = (scope.required=='true' && scope.listFiles.length==0);
            };

            
     
            scope.closeAlert = function(index) {
               scope.alerts.splice(index, 1);
            };
           scope.resetInputFile = function(){
                var rta = component[0].querySelector('.btn-clear-files').dispatchEvent(new Event('click'));
            };

           scope.initInputFile = function(){
                var input = component[0].querySelector('.input_file');
                $(input).pixelFileInput(
                    {
                        placeholder: 'Ningún archivo seleccionado...', 
                        choose_btn_tmpl: '<a href="#" class="btn btn-xs btn-primary">Seleccionar</a>',
                        clear_btn_tmpl:  '<a href="#" class="btn btn-xs btn-clear-files"><i class="fa fa-times"></i> Limpiar</a>'
                    }
                );
                updateHasError();
            };

           scope.eliminarArchivo = function(index){
                $(".overlap_espera").show();
                $(".overlap_espera_1").show();
                ArtesEscenicasEliminarArchivos.get(
                    {
                        idSolicitud: scope.idSolicitud, 
                        idSolicitudXDocumento: scope.listFiles[index].idSolicitudXDocumento
                    }
                ).$promise.then(function(result){
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
                    if(result.success){
                        //console.warn(result);
                        alert('Se elimino el archivo');
                        scope.listarArchivos();
                    } 
                    
                    updateHasError();
                   // console.warn('listFiles', scope.listFiles);
                  //  console.warn('files',scope.files);
                }, function(){
                    alert('Error encontrado');
                });
                //updateHasError();
            };

            scope.descargarArchivo = function(index){
                ArtesEscenicasVerArchivos.openFile(
                    {
                        idSolicitud: scope.idSolicitud, 
                        idDocumento: scope.listFiles[index].tipoDocumento.iddocumento,
                        idSolicitudXDocumento: scope.listFiles[index].idSolicitudXDocumento, 

                    }
                );
            };

            scope.listarArchivos = function(){
            //    alert(scope.idSolicitud);
              //  alert(scope.idTipoDocumento);
               // var lista = [];
               scope.cargando = true;
                
                ArtesEscenicasConsultarArchivos.get(
                    {
                        idSolicitud: scope.idSolicitud, 
                        idTipoDocumento: scope.idTipoDocumento
                    }
                ).$promise.then(function(result){
                    scope.cargando = false;
                 
                    if(result.success){

                        //scope.listFiles = result.data;
                        scope.listFiles.length = 0;
                        for(var i in result.data){
                
                            scope.listFiles.push(result.data[i]);
                        }
                    }else{  
                        alert('Oops, no hemos podido contactar el servidor.');
                    }
                    updateHasError();
                   // console.warn('listFiles', scope.listFiles);
                  //  console.warn('files',scope.files);
              });
            }

            scope.$on("fileSelected", function (event, args) {
                scope.$apply(function () {
                    if(args.file.size >  scope.maxFileSize*1024 ){
                        scope.alerts.push({msg: 'El archivo "'+args.file.name+'" tiene un tamaño mayor a '+scope.maxFileSize+'kb.'});
                        return;
                    }

                    var acepted = false;

                    
                    //console.warn(scope.idSolicitud);
                    if(args.file.type == scope.typeFiles){
                       // console.warn("despues "+args.file.type);
                        acepted = true;
                    }

                    if(acepted){
                        Upload.upload({
                            url: root +'solicitud/'+scope.idSolicitud+'/adjuntardoc/'+scope.idTipoDocumento,
                            data: {
                                'archivo': args.file
                            },
                            transformResponse: function(json, headerGetter){return angular.fromJson(json);}
                        }).then(function(response){
                            //console.warn(response);
                            if(response.data.success){
                                scope.listarArchivos();
                            }else{
                                alert('Error cargando archivo');
                            }
                            updateHasError();
                        }, function(){

                        });
                        scope.resetInputFile();
                    }else{
                        scope.alerts.push({msg: 'El archivo "'+args.file.name+'" debe tener alguno de los siguientes formatos:'+scope.typeFiles+'.', type:'warning'});
                    }
                });
            });

            scope.initInputFile();
            scope.listarArchivos();
        }
    };
  }]);
                    
