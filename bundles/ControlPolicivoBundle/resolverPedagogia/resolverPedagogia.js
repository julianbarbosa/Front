saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-resolverpedagogia", {
            url: "/controlpolicivo/resolverpedagogia/:idcomparendo",
            views: {
                "main": {
                    controller: "ControlPolicivoResolverPedagogiaCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/resolverPedagogia/resolverPedagogia.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoResolverPedagogiaCtrl", ["$scope", "root", "$stateParams", "Comparendo", "ComparendosResolverPedagogia","dsJqueryUtils", "Upload", "$timeout", "$state",
    function ($scope, root, $stateParams, Comparendo, ComparendosResolverPedagogia, dsJqueryUtils, Upload, $timeout, $state) {
        $scope.audiencia = {};
        $scope.audiencia.idcomparendo = $stateParams.idcomparendo;
        $scope.root = root;
        $scope.ocultarModal = true;
        $scope.isReadOnly = false;        
        $scope.isSuccess = false;
        Comparendo.query({id:$scope.audiencia.idcomparendo}).$promise.then(function(result) {
            $scope.comparendo = result.data;
        });        
        $scope.oculto = true;

        $scope.hideAlert = function () {
            $scope.validator = {};
        };

        function callback(data) {
            
            $scope.validator = {};
            $scope.validator.alert = data;            
            $scope.validator.alert.title = data.title;
            $scope.validator.alert.content = data.msg;
            if( $scope.validator.alert.success==true) {
                 $scope.validator.alert.type='alert-success';
            } else  {
                 $scope.validator.alert.type='alert-danger';
            }
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        }
        ;

        function validateSave() {
            var validator = {};            
            $scope.validator = validator;
            return $.isEmptyObject(validator);
        }
        ;


        $scope.save = function () {
            var validate = validateSave();
            if (validate) {
                ComparendosResolverPedagogia.save({data: $scope.audiencia}).$promise.then(function (response) {                     
                    $scope.result = response;
                    callback(response);
                    if (response.success) {
                        $scope.audiencia = {};
                    }
                    $scope.isSuccess = true;                   
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
