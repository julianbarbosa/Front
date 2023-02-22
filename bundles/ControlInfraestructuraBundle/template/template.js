saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlinfraestructura_creartemplate", {
            url: "/controlinfraestructura/template",
            views: {
                "main": {
                    controller: "CrearTemplateControlInfraestruturaCtrl",
                    templateUrl: "../bundles/ControlInfraestructuraBundle/template/template.tpl.html"
                }
            }
        });
    }
]).controller("CrearTemplateControlInfraestruturaCtrl", ["$scope", "root", "urlPlugInNomenclatura","Nomenclatura", "Comuna", "Barrio", "Predio", "Usuario", "dsJqueryUtils", "$uibModal", "Upload",
    function ($scope, root, urlPlugInNomenclatura, Nomenclatura, Comuna, Barrio, Predio, Usuario, dsJqueryUtils, $uibModal, Upload) {        
        $scope.peticion = {};  
        $scope.root = root;
        $scope.saveButton = true;
        $scope.ocultarModal = true;        
        $scope.modalOpen = false;                
        $scope.comunas = Comuna.query();
        $scope.peticion.zona_predio = 1;
        $scope.tiposIdentificacion = [{ id: 1, name: 'Cédula' },{ id: 2, name: 'NIT' }];
        $scope.options = {maskDefinitions: {'Z': /[a-zA-ZñÑ]/}};
        
        $scope.getBarrios = function (viewValue) {            
            return Barrio.query({"clave": viewValue}).
                $promise.then(function (response) {
                    if (response.length == 0) {
                       console.log("no encontró resultados");
                    }
                    return response.map(function (item) {                        
                        return item;
                    });
                });
        };
        
        $scope.onSelect = function ($item, $model, $label) {
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;
        };
        
        $scope.hideAlert = function () {
            $scope.validator = {};
        };        
        
    }
]);
