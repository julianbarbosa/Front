saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("plantilla-crear", {
            url: "/plantillas/crear",
            views: {
                "main": {
                    controller: "crearTipoPlantillaCtrl",
                    templateUrl: "../bundles/PlantillasBundle/crearPlantilla/crearPlantilla.tpl.html",
                }
            },
        });
    }
]).controller("crearTipoPlantillaCtrl", ["$scope", "$http", "root", "LoadingOverlap",
    function ($scope, $http, root, LoadingOverlap) {

        $scope.item = {};
        $scope.listar = { lista: [] };
        $scope.plantilla = {};
        $scope.file = null;
        $scope.isFileValid = false;
        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.isModalOpen = false;

        $scope.listar = function () {
            $http.get(root + "Plantilla/listar").then(function (response) {
                if (response.data.success) {
                    $scope.listar = {
                        lista: response.data.data
                    };
                } else {
                    console.error(response.data.message);
                }
            }, function (error) {
                console.error("Error al cargar las plantillas:", error);
            });
            LoadingOverlap.hide();
        }

        // Validar formulario
        $scope.validForm = function () {
            // Validar campo "nombreplantilla"
            var nombre = $scope.item.nombreplantilla; // Obtener el valor del modelo
            $scope.errorNombre = !nombre || nombre.length < 5; // Determinar si hay error

            // Validar campo "iddominio"
            var dominio = $scope.item.iddominio; // Obtener el valor del modelo
            $scope.errorDominio = !dominio; // Determinar si hay error

            // Retornar true si ambos campos son válidos
            return !$scope.errorNombre && !$scope.errorDominio;
        };

        // Función para eliminar plantilla
        $scope.eliminar = function (id) {
            // Mostrar el modal de confirmación con el mensaje
            $('#mensajeConfirmacionEliminar').text("¿Estás seguro de eliminar la plantilla con ID: " + id + "?");
            $('#modalConfirmarEliminar').modal('show');
        
            // Asociar la acción de confirmación al botón del modal
            $('#btnConfirmarEliminar').off('click').on('click', function () {
                // Cerrar el modal de confirmación
                $('#modalConfirmarEliminar').modal('hide');
        
                // Realizar la solicitud de eliminación
                $http.delete(root + "Plantilla/eliminar/" + id)
                    .then(function (response) {
                        if (response.status === 200 && response.data.success) {
                            $scope.mostrarModalMensaje("Éxito", "Plantilla eliminada correctamente.");
                            $scope.listarPlantillas(); // Actualizar la lista
                        } else {
                            $scope.mostrarModalMensaje("Error", "Error al eliminar la plantilla: " + (response.data.message || "Respuesta inesperada."));
                        }
                    })
                    .catch(function (error) {
                        if (error.status === 500) {
                            $scope.mostrarModalMensaje("Error del Servidor", "Error del servidor al intentar eliminar la plantilla. Por favor, inténtalo de nuevo.");
                        } else {
                            $scope.mostrarModalMensaje("Error Desconocido", "Error desconocido: " + (error.data.message || "Sin mensaje de error."));
                        }
                    });
            });
        };

        // Función para listar plantillas
        $scope.listarPlantillas = function () {

            $http.get(root + "Plantilla/listar")
                .then(function (response) {
                    // Asignar los datos de las plantillas a $scope.listar
                    $scope.listar = {
                        lista: response.data.data
                    };
                })
                .catch(function (error) {
                    // En caso de error, puedes manejarlo aquí
                    console.error('Error al listar plantillas:', error);
                })
                .finally(function () {
                    // Finalizar el estado de carga, tanto en éxito como en error
                    LoadingOverlap.hide();
                });
        };

        // Función para listar plantillas
        $scope.listarPlantillasCargando = function () {
            LoadingOverlap.show(); // Iniciar el estado de carga

            $http.get(root + "Plantilla/listar")
                .then(function (response) {
                    // Asignar los datos de las plantillas a $scope.listar
                    $scope.listar = {
                        lista: response.data.data
                    };
                })
                .catch(function (error) {
                    // En caso de error, puedes manejarlo aquí
                    console.error('Error al listar plantillas:', error);
                })
                .finally(function () {
                    // Finalizar el estado de carga, tanto en éxito como en error
                    LoadingOverlap.hide();
                });
        };

        // Inicializa la lista de dominios y el valor seleccionado
        $scope.dominios = [];
        $scope.selectedDominio = null;

        // Función para listar dominios
        $scope.listarDominios = function () {
            $http.get(root + "dominio/ley_codigo_policia")
                .then(function (response) {
                    $scope.dominios = response.data; // Asigna los dominios a la lista
                })
                .catch(function (error) {
                    console.error("Error al listar dominios:", error);
                });
        };

        $scope.limpiar = function () {
            $scope.item = {}; // Limpiar el formulario
        };

        // Función para guardar la plantilla
        $scope.guardar = function () {
            if ($scope.validForm() === true) {
                LoadingOverlap.show();
                $http.post(root + "Plantilla/crear", $scope.item)
                    .then(function (result) {
                        LoadingOverlap.hide();
                        // Manejar respuesta exitosa
                        if (result.data.success) {
                            $scope.mostrarModalMensaje('Éxito', 'Plantilla creada exitosamente');
                            $scope.listarPlantillas(); // Actualiza el listado
                            $scope.limpiar(); // Limpiar el formulario
                            $('#modalCrear').modal('hide'); // Oculta el modal de creación
                        } else {
                            $scope.mostrarModalMensaje('Error', result.data.message);
                        }
                    })
                    .catch(function (error) {
                        LoadingOverlap.hide();
                        // Manejar errores
                        console.error(error);
                        $scope.mostrarModalMensaje('Error del Servidor', error.data.error || 'Error desconocido');
                    });
            } else {
                $scope.mostrarModalMensaje('Formulario no válido', 'El formulario contiene errores. Por favor, revisa los campos obligatorios.');
            }
        };

        // Función para abrir el modal de crear
        $scope.abrirModalCrear = function () {
            // Reiniciar el modelo de la plantilla para evitar datos residuales
            $scope.item = {
                nombreplantilla: '',
                iddominio: null
            };

            // Reiniciar el estado del formulario
            if ($scope.plantillaForm) {
                $scope.plantillaForm.$setPristine();
                $scope.plantillaForm.$setUntouched();
            }

            // Mostrar el modal de creación
            $('#modalCrear').modal('show');
        };

        // Función para abrir el modal y cargar datos
        $scope.abrirModalEditar = function (id) {
            $scope.plantilla = angular.copy(id); // Copia los datos del elemento a editar
            $('#modalEditar').modal('show'); // Muestra el modal

            $http.get(root + "Plantilla/key/" + id)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.plantilla = response.data.data;
                        // Asocia el valor de la ley con idDominio
                        $scope.plantilla.idDominio = $scope.plantilla.ley;
                    } else {
                        bootbox.alert(response.data.message);
                    }
                }, function (error) {
                    bootbox.alert("Error al cargar la plantilla: " + error.statusText);
                });
        };

      // Función para guardar los cambios
        $scope.guardarEdicion = function () {
            $http.put(root + "Plantilla/editar/" + $scope.plantilla.id, $scope.plantilla)
                .then(function (response) {
                    if (response.status === 200) { // Verifica que la respuesta tenga status 200
                        if (response.data.success) {
                            $scope.mostrarModalMensaje("Éxito", response.data.message);
                            $('#modalEditar').modal('hide'); // Oculta el modal de edición
                            $scope.listarPlantillas(); // Actualiza el listado
                        } else if (response.data.error) {
                            // Caso de error específico del negocio (como la plantilla ya existe)
                            $scope.mostrarModalMensaje("Error", response.data.error);
                        } else {
                            // Caso de respuesta inesperada
                            $scope.mostrarModalMensaje("Error", "Ocurrió un error inesperado.");
                        }
                    } else {
                        // Manejo de errores de HTTP (400, 500, etc.)
                        $scope.mostrarModalMensaje("Error", response.data.message);
                    }
                })
                .catch(function (error) {
                    // Manejo de errores del servidor o de la conexión
                    $scope.mostrarModalMensaje("Error del Servidor", error.data.message || error.statusText);
                });
        };

        // Función para mostrar el modal de mensajes
        $scope.mostrarModalMensaje = function (titulo, mensaje) {
            $('#modalMensajeTitulo').text(titulo);
            $('#modalMensajeCuerpo').text(mensaje);
            $('#modalMensaje').modal('show');
        };

        // Inicialización
        $scope.init = function () {
            LoadingOverlap.show();
            $scope.listarPlantillasCargando();
            $scope.listarDominios();
        };

        $scope.init();
    }
]);