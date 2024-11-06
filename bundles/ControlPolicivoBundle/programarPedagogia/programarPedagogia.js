saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-programarpedagogia", {
            url: "/controlpolicivo/programarpedagogia",
            views: {
                "main": {
                    controller: "ControlPolicivoProgramarPedagogiaCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/programarPedagogia/programarPedagogia.tpl.html"
                }
            }
        }),
        $stateProvider.state("controlpolicivo-programarpedagogia2", {
            url: "/controlpolicivo/programarpedagogia/:id",
            views: {
                "main": {
                    controller: "ControlPolicivoProgramarPedagogiaCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/programarPedagogia/programarPedagogia.tpl.html"
                }
            }
        })
    }
]).controller("ControlPolicivoProgramarPedagogiaCtrl", ["$scope", "root", "$http", "$stateParams",  "GoogleCalendar", "Pedagogia", "ProgramacionPedagogia","Fecha", "CasaJusticia", "dsJqueryUtils", "Upload", "$timeout", "$state",
    function ($scope, root, $http, $stateParams,  GoogleCalendar, Pedagogia, ProgramacionPedagogia, Fecha, CasaJusticia, dsJqueryUtils, Upload, $timeout, $state) {
        $scope.programacion = {};
        $scope.root = root;
        $scope.edicion = false;
        $scope.ocultarModal = true;
        $scope.isReadOnly = false;
        $scope.isSuccess = false;
        $scope.texto_lugar_virtual = 'URL aula virtual (<a href="https://meet.google.com/" target="_blank">meet</a>)';
        $scope.texto_lugar_presencial = 'Lugar de encuentro';
        
        
        if($stateParams.id !== undefined) {
            $http.get(root + 'controlpolicivo/programacionpedagogia/'+$stateParams.id).then(function (result) {
                $scope.programacion = result.data;
                $scope.programacion.responsable = $scope.programacion.casaJusticia;
                $scope.edicion = true;
                $scope.programacion.lugar = result.data.lugar;
                $scope.programacion.modalidad = result.data.modalidad;
                if($scope.programacion.lugar!=='') {
                    $scope.programacion.modalidad = 'virtual';
                }
            });    
        }

		$http.get(root + 'controlpolicivo/organismo/1').then(function (result) {
			$scope.responsables = result.data; 
		});

        $http.get(root + 'controlpolicivo/pedagogia/usuario').then(function (result) {
			$scope.pedagogias = result.data;
		});	

        $scope.fechas = Fecha.query();
        $scope.oculto = true;

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
        };

        function validateSave() {
            var validator = {};
            if(!$scope.programacion.horaCita) {
                validator.hora = "Debe ingresar la hora.";
            }
            if(!$scope.programacion.fechaCita) {
                validator.fecha = "Debe ingresar la fecha.";
            }
            if(!$scope.programacion.cupo) {
                validator.cupo = "Debe ingresar el cupo.";
            }
            if(!$scope.programacion.duracion) {
                validator.duracion = "Debe ingresar la duración.";
            }
            if(!$scope.programacion.pedagogia) {
                validator.pedagogia = "Debe ingresar la pedagogía.";
            }
            $scope.validator = validator;
            console.log(validator);
            return $.isEmptyObject(validator);
        };

        $scope.consultarEventos = function () {
            if(angular.isUndefined($scope.programacion.fechaCita) || $scope.programacion.fechaCita === null) {
                return;
            }
            var fechaInicial = new Date($scope.programacion.fechaCita.fecha);
            fechaInicial.setHours(0);
            var fechaFinal = new Date(fechaInicial.getFullYear(), fechaInicial.getMonth(), fechaInicial.getDate()+1,0,0,0);
         //   GoogleCalendar.query({fechaInicial: fechaInicial.toISOString(), fechaFinal: fechaFinal.toISOString()}).$promise.then(function(response) {
                var events = [];
                var intervaloMinutos = 10;
                var contadorEventos = 0;
                var duracionCita = $scope.programacion.duracion*1;
                if(duracionCita>0) {
                    var horaFinal = new Date(0, 0, 0, 20, 0-duracionCita);
                    $scope.arrayHorasDisponibles = [];
                    for(var hora=new Date(0, 0, 0, 8, 0); hora<=horaFinal; hora=new Date(0, 0, 0, hora.getHours(), hora.getMinutes()+intervaloMinutos)) {
                        if (events.length > 0 && contadorEventos<events.length) {
                            var event = events[contadorEventos];
                            var minutosActual = (hora.getHours()*60)+hora.getMinutes();
                            var fechaInicialEvento = new Date(event.start);
                            var fechaFinalEvento = new Date(event.end);
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
          //  });
        }

        $scope.save = function () {
            isSuccess = true;
            var validate = validateSave();
            $('.overlap_espera').show();
            $('.overlap_espera_1').show();
            if (validate) {
                var fechaInicial = new Date($scope.programacion.fechaCita.fecha);
                var horaInicial = new Date($scope.programacion.horaCita.hora);
                fechaInicial.setHours(horaInicial.getHours());
                fechaInicial.setMinutes(horaInicial.getMinutes());
                var fechaFinal = new Date(fechaInicial.getFullYear(), fechaInicial.getMonth(), fechaInicial.getDate(),fechaInicial.getHours(),fechaInicial.getMinutes()+($scope.programacion.duracion*1),0);
                $scope.programacion.fechaInicialISO = fechaInicial.toISOString();
                $scope.programacion.fechaFinalISO = fechaFinal.toISOString();
                ProgramacionPedagogia.save($scope.programacion).$promise.then(function (response) {
                    $scope.result = response;
                    callback($scope.result);
                    if ($scope.result.success===true) {
                        $scope.isSuccess = false;
                        $scope.form.$setUntouched();
                        $scope.form.$setPristine();
                        $('.overlap_espera').fadeOut(500, 'linear');
                        $('.overlap_espera_1').fadeOut(500, 'linear');
                    }
                });
            } else {
                dsJqueryUtils.goTop();
                $('.overlap_espera').fadeOut(500, 'linear');
                $('.overlap_espera_1').fadeOut(500, 'linear');
            }
        };
        
        $scope.edit = function () {
            isSuccess = true;
            $('.overlap_espera').show();
            $('.overlap_espera_1').show();
            if($scope.programacion.fechaCita!==undefined) {
                var fechaInicial = new Date($scope.programacion.fechaCita.fecha);
                var horaInicial = new Date($scope.programacion.horaCita.hora);
                fechaInicial.setHours(horaInicial.getHours());
                fechaInicial.setMinutes(horaInicial.getMinutes());
                var fechaFinal = new Date(fechaInicial.getFullYear(), fechaInicial.getMonth(), fechaInicial.getDate(),fechaInicial.getHours(),fechaInicial.getMinutes()+($scope.programacion.duracion*1),0);
                $scope.programacion.fechaInicialISO = fechaInicial.toISOString();
                $scope.programacion.fechaFinalISO = fechaFinal.toISOString();
            }            
            ProgramacionPedagogia.save($scope.programacion).$promise.then(function (response) {
                $scope.result = response;
                callback($scope.result);
                if ($scope.result.success===true) {
                    $scope.isSuccess = false;
                    $scope.form.$setUntouched();
                    $scope.form.$setPristine();
                   
                }
                $('.overlap_espera').fadeOut(500, 'linear');
                $('.overlap_espera_1').fadeOut(500, 'linear');
            });
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
