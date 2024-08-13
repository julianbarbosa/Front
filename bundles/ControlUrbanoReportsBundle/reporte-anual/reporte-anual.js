saul.config(["$stateProvider",
  function ($stateProvider) {
    $stateProvider.state("control-urbano-reporte-anual", {
      url: "/reportes/reporte-anual/",
      views: {
        "main": {
          controller: "ControlUrbanoReporteAnualCtrl",
          templateUrl: "../bundles/ControlUrbanoReportsBundle/reporte-anual/template.tpl.html"
        }
      }
    });
  }
]).controller("ControlUrbanoReporteAnualCtrl", ["$scope", "$http", "root", "UtilForm", "$filter",
  function ($scope, $http, root, UtilForm, $filter) {
    $scope.currentPage = 1;
    $scope.numPerPage = 20;
    $scope.anio = 2024;
    $scope.busqueda = {};
    $scope.orderBy = 'idvisita';
    $scope.data = []; // Array para almacenar los datos

    // Define los campos de búsqueda
  

 
   
 
    $scope.descargar = function() {
      window.open(root + 'visita/reporte/anual/'+$scope.anio);
    }
  }]);