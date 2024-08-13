saul.config(["$stateProvider",
  function ($stateProvider) {
    $stateProvider.state("control-urbano-reporte-acceso", {
      url: "/reportes/reporte-acceso/",
      views: {
        "main": {
          controller: "ControlUrbanoReporteAccesoCtrl",
          templateUrl: "../bundles/ControlUrbanoReportsBundle/reporte-acceso/template.tpl.html"
        }
      }
    });
  }
]).controller("ControlUrbanoReporteAccesoCtrl", ["$scope", "$http", "root", "UtilForm", "$filter",
  function ($scope, $http, root, UtilForm, $filter) {
    $scope.currentPage = 1;
    $scope.numPerPage = 20;
    $scope.anio = 2024;
    $scope.trimestres = [
      {"codigo": "1", "nombre": "Primer Trimestre", "descripcion": "Enero - Marzo"},
      {"codigo": "2", "nombre": "Segundo Trimestre", "descripcion": "Abril - Junio"},
      {"codigo": "3", "nombre": "Tercer Trimestre", "descripcion": "Julio - Septiembre"},
      {"codigo": "4", "nombre": "Cuarto Trimestre", "descripcion": "Octubre - Diciembre"}
  ]
  
    $scope.busqueda = {};
    $scope.orderBy = 'idvisita';
    $scope.data = []; // Array para almacenar los datos

    // Define los campos de búsqueda
  

 
   
 
    $scope.descargar = function() {
      window.open(root + 'visita/reporte/acceso/'+$scope.anio+'/'+$scope.trimestre);
    }
  }]);