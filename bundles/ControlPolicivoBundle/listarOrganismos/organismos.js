saul.config(["$stateProvider",function ($stateProvider) {
        $stateProvider.state("controlpolicivo-listar-organismos", {
            url: "/controlpolicivo/listar-organismos",
            views: {
                "main": {
                    controller: "ControlPolicivoListarOrganismosCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/listarOrganismos/organismos.tpl.html"
                }
            }
    });
}]).controller("ControlPolicivoListarOrganismosCtrl", ['$scope', '$http', '$state', 'root', function ($scope, $http, $state, root) {

    // VARIABLES INICIALES
    $scope.currentPage = 1;  // Página actual de la paginación
    $scope.numPerPage = 8;  // Número de registros por página
    $scope.maxSize = 5;      // Máximo tamaño de la paginación
    $scope.orderBy = 'idOrganismo';  // Ordenación inicial por ID del organismo
    $scope.rowWarning = 'estaEnviado';  // Estado del organismo (ajustar según lógica)


    $scope.editarOrganismo = function(organismoId) {
        // Guardar el id del organismo en localStorage
        console.log('ORGANISMO ID' , organismoId)
        localStorage.setItem('organismoId', organismoId);
        $state.go('controlpolicivo-crear-organismo');
    }
    // Llamada para cargar los organismos con la paginación y ordenación correctas
    $scope.actualizarDatos = function () {
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();

        // Parámetros de la consulta para paginación y ordenación
        var request = {
            'currentPage': $scope.currentPage,
            'numPerPage': $scope.numPerPage,
            'orderBy': $scope.orderBy
        };

        // Consultar los datos del servidor
        $http.get(root + 'organismo/listar-organismos', { params: request })
            .then(function(response) {
                console.log('Respuesta completa:', response.data); 
                if (response.data) {
                    $scope.organismos = response.data;  
                    $scope.totalItems = response.data.length || 0; 
                } else {
                    alert('Error al cargar los tipos de organismo');
                }
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            }, function(error) {
                console.error('Error en la conexión con el servidor:', error);
                alert('Error al cargar los datos');
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            });
    };

    // Cargar los organismos al inicio
    $scope.cargarListaOrganismos = function() {
        $scope.actualizarDatos(); // Llamar a actualizarDatos al cargar
    };

    // Llamada inicial para cargar los datos
    $scope.cargarListaOrganismos();

    // Función para cambiar de página en la paginación
    $scope.pageChanged = function() {
        console.log('Página cambiada:', $scope.currentPage);
        $scope.actualizarDatos(); // Volver a cargar los datos con la nueva página
    };
    $scope.customSearch = function(organismo) {
        if (!$scope.searchText) return true;  // Si no hay texto de búsqueda, no filtrar
    
        // Convertir el texto de búsqueda a minúsculas y eliminar espacios extra
        var searchText = $scope.searchText.toLowerCase().replace(/\s+/g, '');
    
        // Los campos a buscar
        var fields = ['nombre', 'tipoOrganismo', ''];
    
        // Comprobar si el texto de búsqueda aparece en algún campo del organismo
        for (var i = 0; i < fields.length; i++) {
            var fieldValue = organismo[fields[i]] ? organismo[fields[i]].toLowerCase().replace(/\s+/g, '') : '';
            
            // Crear una expresión regular para buscar cada letra de la búsqueda en cualquier orden
            var searchRegEx = new RegExp(searchText.split('').join('.*'), 'i'); // Permite la búsqueda
    
            // Si el texto de búsqueda se encuentra en el campo actual, devolver true
            if (searchRegEx.test(fieldValue)) {
                return true;
            }
        }
    
        // Si no se encuentra en ningún campo, devuelve false
        return false;
        
    };
    

}]);

