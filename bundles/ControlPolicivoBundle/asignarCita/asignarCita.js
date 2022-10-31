saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-asignarcita", {
            url: "/controlpolicivo/asignar/:idsolicitud",
            views: {
                "main": {
                    controller: "ControlPolicivoAsignarCitaCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/asignarCita/asignarCita.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoAsignarCitaCtrl", ["$scope", "root", "$stateParams", "GAPI", "Calendar", "Comparendo", "Fecha", "dsJqueryUtils", "Upload", "$timeout", "$state",
    function ($scope, root, $stateParams, GAPI, Calendar, Comparendo, Fecha, dsJqueryUtils, Upload, $timeout, $state) {
        $scope.cita = {};
        $scope.cita.idsolicitud = $stateParams.idsolicitud;
        $scope.root = root;
        $scope.ocultarModal = true;
        $scope.isReadOnly = false;        
        $scope.isSuccess = false;
        $scope.comparendo = Comparendo.query({id:$scope.cita.idsolicitud});
        $scope.fechas = Fecha.query();
        $scope.oculto = true;
        
        $scope.authorize = function () {
            GAPI.init(); 
        };
        
        $scope.hideAlert = function () {
            $scope.validator = {};
        };

        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};
            $scope.validator.alert.title = data.title;
            $scope.validator.alert.content = data.msg;
            $scope.validator.alert.type = data.type;
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        }
        ;

        function validateSave() {
            var validator = {};            
            $scope.validator = validator;
            return $.isEmptyObject(validator);
        };
        
        $scope.consultarEventos = function () {                        
            GAPI.init().then(function () {         
                var fechaInicial = new Date($scope.cita.fechaCita.fecha);
                fechaInicial.setHours(0);                
                var fechaFinal = new Date(fechaInicial.getFullYear(), fechaInicial.getMonth(), fechaInicial.getDate()+1,0,0,0);
                Calendar.listEvents('primary',{'timeMin': fechaInicial.toISOString(),'timeMax':fechaFinal.toISOString(),'orderBy':'starttime', 'singleEvents':true}).then(function (response) {
                    var events = response.items;         
                    var intervaloMinutos = 10;
                    var contadorEventos = 0;                  
                    var duracionCita = $scope.cita.duracion*1;
                    if(duracionCita>0) {
                        var horaFinal = new Date(0, 0, 0, 20, 0-duracionCita);
                        $scope.arrayHorasDisponibles = [];
                        for(var hora=new Date(0, 0, 0, 8, 0); hora<=horaFinal; hora=new Date(0, 0, 0, hora.getHours(), hora.getMinutes()+intervaloMinutos)) {              
                            if (events.length > 0 && contadorEventos<events.length) {                                
                                var event = events[contadorEventos];  
                                var minutosActual = (hora.getHours()*60)+hora.getMinutes();               
                                var fechaInicialEvento = new Date(event.start.dateTime);                                
                                var fechaFinalEvento = new Date(event.end.dateTime);
                                var minutosEvento = (fechaInicialEvento.getHours()*60)+fechaInicialEvento.getMinutes();
                                if(minutosActual+(duracionCita*1)<=minutosEvento ) {
                                    $scope.arrayHorasDisponibles.push({"hora":hora});  
                                } else {
                                    hora = new Date(0, 0, 0, fechaFinalEvento.getHours(), fechaFinalEvento.getMinutes()-intervaloMinutos);
                                    contadorEventos++;
                                }
                            } else {
                                $scope.arrayHorasDisponibles.push({"hora":hora});  
                            }
                        }
                    }
                });                 
            });
        }


        function saveCita() {
            GAPI.init().then(function () { 
                var fechaInicial = new Date($scope.cita.fechaCita.fecha);               
                var horaInicial = new Date($scope.cita.horaCita.hora);                
                fechaInicial.setHours(horaInicial.getHours());
                fechaInicial.setMinutes(horaInicial.getMinutes());
                var fechaFinal = new Date(fechaInicial.getFullYear(), fechaInicial.getMonth(), fechaInicial.getDate(),fechaInicial.getHours(),fechaInicial.getMinutes()+($scope.cita.duracion*1),0);
                var descripcion = '';
                if($scope.comparendo.solicitante!==null) {
                    descripcion += $scope.comparendo.solicitante.nombre+' '+$scope.comparendo.solicitante.apellido+', ';
                }
                descripcion += $scope.comparendo.infractor.nombre+' '+$scope.comparendo.infractor.apellido;
                var event = {
                    'start':  {
                        'dateTime':fechaInicial.toISOString()
                    },
                    'end':  {
                        'dateTime':fechaFinal.toISOString()
                    },
                    'summary': 'Citación '+descripcion+'<a href="http://planeacion.cali.gov.co/saul" target="_blank">Saul</a>', 
                    'description':'Citación '+descripcion+'<a href="http://planeacion.cali.gov.co/saul">Saul</a>', 
                    'location':'Inspección de policía Corregimiento'
                };
                Calendar.insertEvents('primary', event);
                $scope.cita = {};
            });
        }
        
        $scope.save = function () {
            isSuccess = true;
            var validate = validateSave();
            if (validate) {
                Upload.upload({
                    url: root+'controlpolicivo/citacion',
                    data: {
                        data: $scope.cita
                    }
                }).then(function (response) {
                    $scope.result = response.data;
                    console.log("response.success=>",$scope.result.success);
                    callback($scope.result);
                    if ($scope.result.success===true) {
                        saveCita();                        
                        $scope.isSuccess = false;
                    }
                    
//                    $timeout(function () {
//                        $state.go('listar-visita');
//                    }, 3000);
                });
            } else {
                dsJqueryUtils.goTop();
            }
        };

        $scope.cancel = function () {
        };




        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                    mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function () {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                    mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }



    }
]);
