saul.config(["$stateProvider",
  function ($stateProvider) {
    $stateProvider.state("control-urbano-reporte-rentas", {
      url: "/reportes/reporte-rentas/",
      views: {
        "main": {
          controller: "ControlUrbanoReporteRentasCtrl",
          templateUrl: "../bundles/ControlUrbanoReportsBundle/reporte-rentas/template.tpl.html"
        }
      }
    });
  }
]).controller("ControlUrbanoReporteRentasCtrl", ["$scope", "$http", "root", "UtilForm", "$filter",
  function ($scope, $http, root, UtilForm, $filter) {
    $scope.currentPage = 1;
    $scope.numPerPage = 20;
    $scope.anio = 2024;
    $scope.meses = [
      {"codigo": "01", "nombre": "Enero", "descripcion": "Primer mes del año"},
      {"codigo": "02", "nombre": "Febrero", "descripcion": "Segundo mes del año"},
      {"codigo": "03", "nombre": "Marzo", "descripcion": "Tercer mes del año"},
      {"codigo": "04", "nombre": "Abril", "descripcion": "Cuarto mes del año"},
      {"codigo": "05", "nombre": "Mayo", "descripcion": "Quinto mes del año"},
      {"codigo": "06", "nombre": "Junio", "descripcion": "Sexto mes del año"},
      {"codigo": "07", "nombre": "Julio", "descripcion": "Séptimo mes del año"},
      {"codigo": "08", "nombre": "Agosto", "descripcion": "Octavo mes del año"},
      {"codigo": "09", "nombre": "Septiembre", "descripcion": "Noveno mes del año"},
      {"codigo": "10", "nombre": "Octubre", "descripcion": "Décimo mes del año"},
      {"codigo": "11", "nombre": "Noviembre", "descripcion": "Undécimo mes del año"},
      {"codigo": "12", "nombre": "Diciembre", "descripcion": "Duodécimo mes del año"}
  ];
  $scope.procesos = [
    {"codigo": "preventivo"}, {"codigo": "posterior"}
  ];
  
    $scope.busqueda = {};
    $scope.orderBy = 'idvisita';
    $scope.data = []; // Array para almacenar los datos

    // Define los campos de búsqueda
  

 
   
 
    $scope.descargar = function() {
      window.open(root + 'visita/reporte/rentas/'+$scope.proceso+'/'+$scope.anio+'/'+$scope.mes);
    }
  }]);