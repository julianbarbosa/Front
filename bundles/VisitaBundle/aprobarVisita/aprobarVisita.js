saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("aprobar-visita", {
            url: "/visita/aprobar_visita/:idVisita",
            views: {
                "main": {
                    controller: "AprobarVisitaCtrl",
                    templateUrl: "../bundles/VisitaBundle/aprobarVisita/aprobarVisita.tpl.html"
                }
            }
        });
    }
]).directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value);
      });
    }
  };
}).config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.transformResponse.push(function(responseData){
        convertDateStringsToDates(responseData);
        return responseData;
    });
}]).controller("AprobarVisitaCtrl", ["$scope", "root", "$stateParams", "Visita", "EncabezadoVisita",  "TipoSolicitud", "FormularioVisita", "dsJqueryUtils", "Upload", "$timeout", "$state",
    function ($scope, root, $stateParams, Visita, EncabezadoVisita, TipoSolicitud, FormularioVisita, dsJqueryUtils, Upload, $timeout, $state) {        
        $scope.root = root;
        $scope.visita = {};
        $scope.id = $stateParams.idVisita;
        $scope.visita.idVisita = $stateParams.idVisita;        
        $scope.ocultarModal = true;        
        Visita.find({id: $stateParams.idVisita }).$promise.then(function(response){        
            $scope.visita = response;         
            $scope.camposformularioVisita = FormularioVisita.query({id:$stateParams.idVisita});
            $scope.camposLectura = EncabezadoVisita.query({id:$stateParams.idVisita});          
            $scope.expediente = "1234567";
        });         
        $scope.isReadOnly=false;
        $scope.tiposSolicitud = TipoSolicitud.query();
        
        $scope.tipoSolicitud = {};
        $scope.oculto = true;
        $scope.isSuccess = false;
      
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

        $scope.popup1 = {
            opened: false
        };
        
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.save = function (estado) {
            $scope.valoresFormulario =  [];
            angular.forEach($scope.camposformularioVisita, function(campo) {
                angular.forEach(campo.arrayItems, function(arrayItem){
                    angular.forEach(arrayItem.item.items, function(item) {
                        if(item.valor!==null && item.valor!=='' && item.valor!=='null' && item.soloLectura===0) {
                            $scope.valoresFormulario.push({codigo: item.codigo, valor: item.valor, tipoItem: item.tipoItem });
                        } 
                    });
                });              
            });
            if (true) {
                $(".overlap_espera").show();
                $(".overlap_espera_1").show();
                Upload.upload({
                    url: root+'aprobar_visita',
                    data: {
                        idVisita: $scope.visita.idVisita,
                        data:  $scope.valoresFormulario,
                        estado: estado,
                        nuevaVisita: $scope.nuevaVisita
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
                    $timeout(function() {                        
                        $state.go('listar-visita');
                        }, 3000);
                });
            } else {
                dsJqueryUtils.goTop();
            }
        };

        $scope.cancel = function () {
        };
    }
]);


var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

function convertDateStringsToDates(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        // TODO: Improve this regex to better match ISO 8601 date strings.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
            // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
            var milliseconds = Date.parse(match[0]);
            if (!isNaN(milliseconds)) {
                input[key] = new Date(milliseconds);
            }
        } else if (typeof value === "object") {
            // Recurse into object
            convertDateStringsToDates(value);
        }
    }
}

