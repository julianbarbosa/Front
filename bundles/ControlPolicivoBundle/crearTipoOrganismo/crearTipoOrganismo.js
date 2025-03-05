saul.config(["$stateProvider", function ($stateProvider) {
  $stateProvider.state("controlpolicivo-crear-tipo-organismo", {
      url: "/controlpolicivo/crear-tipo-organismo",
      views: {
          "main": {
              controller: "ControlPolicivoCrearTipoOrganismoCtrl",
              templateUrl: "../bundles/ControlPolicivoBundle/crearTipoOrganismo/crearTipoOrganismo.tpl.html"
          }
      }
  });
}]).controller("ControlPolicivoCrearTipoOrganismoCtrl", ['$scope', '$http', 'root', function ($scope, $http, root) {

  $scope.organismoEdit = null;  
  $scope.nuevoOrganismo = {}; 

  // Cargar la lista de organismos
  $scope.cargarOrganismos = function() {
    console.log('Cargando organismos...');
    $http.get(root + 'organismo/listartipoorganismo')
      .then(function(response) {
        console.log('Respuesta:', response);
        if (response.data) {
          $scope.organismos = response.data;
        } else {
          alert('Error al cargar los tipos de organismo');
        }
      }, function(error) {
        alert('Error en la conexión con el servidor');
      });
  };

// Cargar los organismos cuando cargue la vista.
$scope.cargarOrganismos();

// Función para abrir el modal de edición o creación
$scope.prepararOrganismo = function(organismo) {
  if (organismo) {
    // Si se pasa un organismo, es un caso de edición
    $scope.organismoEdit = angular.copy(organismo);
  } else {
    // Si no se pasa un organismo, es un caso de creación
    $scope.organismoEdit = {}; 
  }
  if (!$scope.organismoEdit.estado) {
    $scope.organismoEdit.estado = 'Activo';
  }

   // Mostrar el modal de creación o edición
  $('#tipoOrganismoModal').modal('show'); 
};

  // Función para guardar un nuevo organismo o editar uno existente
  $scope.guardarOrganismo = function() {
    // Validar que el nombre no exceda los 150 caracteres
    if ($scope.organismoEdit.nombre && $scope.organismoEdit.nombre.length > 150) {
        bootbox.alert({
            message: "El nombre del organismo no puede exceder los 150 caracteres.",
            size: 'small',
        });
        return;  // Detener el proceso si el nombre es demasiado largo
    }

    // Validar si el nombre del organismo ya existe
    if ($scope.validarNombreExistente($scope.organismoEdit.nombre)) {
        bootbox.alert({
            message: "El nombre del tipo de organismo ya existe. Por favor ingrese uno diferente.",
            size: 'small',
        });
        return;  // Detener el proceso si el nombre ya existe
    }

    // Verificar si el organismo tiene id, indicando que estamos editando
    if ($scope.organismoEdit && $scope.organismoEdit.id) {
        // Editar el organismo existente
        $scope.editarOrganismoEnServidor($scope.organismoEdit);
    } else {
        // Crear un nuevo organismo
        $scope.crearOrganismo($scope.organismoEdit);
    }
};

// Función para crear un nuevo organismo
$scope.crearOrganismo = function(organismo) {

  if ($scope.validarNombreExistente(organismo.nombre)) {
    return;  // Si el nombre ya existe, detiene el proceso de creación
  }
  // Asegúrate de que el estado esté configurado correctamente
  if (!organismo.estado) {
      organismo.estado = 'Activo';
  }
  $http.post(root + 'organismo/crearTipoOrganismo', organismo)
    .then(function(response) {
      console.log("Nuevo organismo creado");
      // Actualizar la lista de organismos
      $scope.cargarOrganismos();
      $scope.organismoEdit = {}; 
      $('#tipoOrganismoModal').modal('hide'); // Cerrar el modal
      // Mostrar el modal de éxito
      $('#tipoOrganismoExitoModal').modal('show');
      // Cerrar automáticamente el modal de éxito después de 2 seg.
      setTimeout(function() {
        $('#tipoOrganismoExitoModal').modal('hide'); // Cerrar el modal de éxito
      }, 2000);
    }, function(error) {
      alert('Error al guardar el nuevo organismo');
    });
};
$scope.validarNombreExistente = function(nombre) {
  if (!$scope.organismos || $scope.organismos.length === 0) return false;
  // Si existen organismos, validar si ya existe el nombre
  return $scope.organismos.some(function(organismo) {
    return organismo.nombre.toLowerCase() === nombre.toLowerCase();
  });
};
// Función para editar un organismo existente
$scope.editarOrganismoEnServidor = function(organismo) {

  if (!organismo.estado) {
    organismo.estado = 'Activo';  // Asigna un valor por defecto si no se especifica
  }
  $http.put(root + 'organismo/editarTipoOrganismo/' + organismo.id, organismo)
    .then(function(response) {
      console.log("Organismo editado", response);
      // Actualizar la lista de organismos
      $scope.cargarOrganismos();
      // Limpiar el objeto organismoEdit y cerrar el modal
      $scope.organismoEdit = {};  // Reiniciar el objeto
      $('#tipoOrganismoModal').modal('hide'); // Cerrar el modal
    }, function(error) {
      alert('Error al editar el organismo');
    });
};
}]);


