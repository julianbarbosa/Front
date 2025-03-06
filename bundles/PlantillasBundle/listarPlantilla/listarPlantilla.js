saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("plantilla-listar", {
            url: "/plantillas/listar",
            views: {
                "main": {
                    controller: "listarPlantillaCtrl",
                    templateUrl: "../bundles/PlantillasBundle/listarPlantilla/listarPlantilla.tpl.html",
                }
            },
        });
    }
])
    .directive("fileInput", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                element.bind("change", function () {
                    scope.$apply(function () {
                        scope[attrs.fileInput] = element[0].files[0]; // Asigna el archivo al modelo
                        console.log("Archivo seleccionado:", scope[attrs.fileInput]); // Verificar archivo
                    });
                });
            }
        };
    })
    .controller("listarPlantillaCtrl", ["$scope", "$http", "root","LoadingOverlap",
        function ($scope, $http, root,LoadingOverlap) {
            $scope.root = root;
            $scope.archivo = {}; // Inicializamos el modelo para cargar el archivo


            // Función para listar plantillas
            $scope.listarPlantillas = function () {
                LoadingOverlap.show();
                $http.get(root + "Plantilla/listarActivas")
                    .then(function (response) {
                        LoadingOverlap.hide();
                        //$scope.listar = response.data;
                        $scope.listar = {
                            lista: response.data.data
                        };
                    }).catch(function (error) {
                        // En caso de error, puedes manejarlo aquí
                        console.error('Error al listar plantillas:', error);
                    })
                    .finally(function () {
                        // Finalizar el estado de carga, tanto en éxito como en error
                        LoadingOverlap.hide();
                    });
            };

            // Función para listar plantillas Cargando
            $scope.listarPlantillasCargando = function () {
                LoadingOverlap.show(); // Iniciar el estado de carga
                $http.get(root + "Plantilla/listarActivas")
                    .then(function (response) {
                        //$scope.listar = response.data;
                        $scope.listar = {
                            lista: response.data.data
                        };
                    }).catch(function (error) {
                        // En caso de error, puedes manejarlo aquí
                        console.error('Error al listar plantillas:', error);
                    })
                    .finally(function () {
                        // Finalizar el estado de carga, tanto en éxito como en error
                        LoadingOverlap.hide();
                    });
            };
            // Función para abrir el modal y asociar el ID de la plantilla
            $scope.abrirModalCargarArchivo = function (idPlantilla) {
                $scope.validarCantidadArchivos(idPlantilla);
                $scope.archivo = {
                    idPlantilla: idPlantilla, // Asignar el ID de la plantilla seleccionada
                    archivo: null
                };
                $('#modalCargarArchivo').modal('show'); // Mostrar el modal
            };

            // Función para manejar el archivo seleccionado
            $scope.onArchivoSeleccionado = function (files) {
                if (files && files.length > 0) {
                    const archivoSeleccionado = files[0];
                    const maxSizeInMB = 5;
                    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

                    const allowedExtensions = ['docx', 'xlsx'];
                    const fileExtension = archivoSeleccionado.name.split('.').pop().toLowerCase();

                    // Validar extensión
                    if (!allowedExtensions.includes(fileExtension)) {
                        $scope.mostrarModalMensaje("Extensión no válida", "Solo se permiten archivos con extensión .docx y .xlsx.");
                        $scope.archivo.archivo = null; // Limpiar el archivo si no cumple
                        return;
                    }

                    // Validar tamaño
                    if (archivoSeleccionado.size > maxSizeInBytes) {
                        $scope.mostrarModalMensaje("Tamaño excedido", "El archivo no debe pesar más de 5 MB.");
                        $scope.archivo.archivo = null; // Limpiar el archivo si no cumple
                        return;
                    }

                    // Almacenar detalles del archivo en el modelo
                    $scope.$apply(function () {
                        $scope.archivo = {
                            idPlantilla: $scope.archivo.idPlantilla,
                            archivo: archivoSeleccionado,
                            nombre: archivoSeleccionado.name,
                            tipo: archivoSeleccionado.type,
                            tamano: (archivoSeleccionado.size / 1024).toFixed(2), // Tamaño en KB
                        };
                        $scope.archivoSeleccionado = true;
                    });
                    console.log("Archivo seleccionado:", $scope.archivo.archivo);
                } else {
                    $scope.archivo = null; // Asegurar que no hay archivo si no se selecciona
                    console.log("No se seleccionó ningún archivo.");
                }
            };
            
            // Función para guardar el archivo
            $scope.guardarArchivo = function () {
                if (!$scope.archivo.archivo || !$scope.archivo.idPlantilla) {
                    $scope.mostrarModalMensaje("Campos Obligatorios", "Debe completar todos los campos.");
                    return;
                }

                var formData = new FormData();
                formData.append('archivo', $scope.archivo.archivo);
                formData.append('idPlantilla', $scope.archivo.idPlantilla);
                // document.getElementById('archivo').value(null);
                // Enviar el archivo al backend
                LoadingOverlap.show();
                $http({
                    method: 'POST',
                    url: root + 'Plantilla/cargar-archivo',
                    data: formData,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).then(function (response) {
                    LoadingOverlap.hide();
                    $scope.mostrarModalMensaje("Éxito", "Archivo cargado exitosamente.");
                    $('#modalCargarArchivo').modal('hide'); // Cerrar el modal de carga
                    $scope.archivo = {}; // Limpiar el modelo
                    $scope.listarPlantillas(); // Actualizar la lista de plantillas
                }).catch(function (error) {
                    LoadingOverlap.hide();
                    $scope.mostrarModalMensaje("Error", "Error al cargar el archivo. Por favor, inténtelo nuevamente.");
                    console.error(error);
                });
            };

            // Función para obtener los archivos de una plantilla específica
            $scope.verArchivos = function (idPlantilla) {
                $http.get(root + 'Plantilla/ver-archivo/' + idPlantilla)
                    .then(function (response) {
                        $scope.archivos = response.data; // Guardar los archivos en el modelo
                        $('#modalVerArchivos').modal('show'); // Abrir el modal
                    })
                    .catch(function (error) {
                        console.error("Error al cargar los archivos:", error);
                        alert("No se pudieron cargar los archivos.");
                    });
            };

            // Función para mostrar el modal de mensajes
            $scope.mostrarModalMensaje = function (titulo, mensaje) {
                $('#modalMensajeTitulo').text(titulo);
                $('#modalMensajeCuerpo').text(mensaje);
                $('#modalMensaje').modal('show');
            };

            // Función para eliminar un archivo
            $scope.eliminarArchivo = function (idArchivo) {
                // Mostrar el modal de confirmación
                $('#modalConfirmarEliminarArchivo').modal('show');

                // Asignar el evento al botón de confirmación
                $('#btnConfirmarEliminarArchivo').off('click').on('click', function () {
                    // Cerrar el modal de confirmación
                    $('#modalConfirmarEliminarArchivo').modal('hide');

                    // Realizar la solicitud para eliminar el archivo
                    LoadingOverlap.show();
                    $http.post(root + 'Plantilla/eliminar-archivo/' + idArchivo)
                        .then(function (response) {
                            LoadingOverlap.hide();
                            $scope.mostrarModalMensaje("Éxito", "Archivo eliminado correctamente.");
                            // Eliminar el archivo de la lista local
                            $scope.archivos = $scope.archivos.filter(function (archivo) {
                                return archivo.id !== idArchivo;
                            });
                            $scope.archivo = {}; // Limpiar el modelo
                            $scope.listarPlantillas(); // Actualizar la lista
                            $('#modalVerArchivos').modal('hide'); // Cerrar el modal de archivos
                        })
                        .catch(function (error) {
                            LoadingOverlap.hide();
                            console.error("Error al eliminar el archivo:", error);
                            $scope.mostrarModalMensaje("Error", "No se pudo eliminar el archivo.");
                        });
                });
            };

            $scope.validarCantidadArchivos = function (idPlantilla) {
                $http.get(root + 'Plantilla/contar-archivos/' + idPlantilla)
                    .then(function (response) {
                        const cantidadArchivos = response.data.data;

                        if (cantidadArchivos >= 200) { // Cambiar 5 por el límite que desees
                            alert("No se pueden asociar más de 200 archivos a esta plantilla.");
                            return;
                        }

                        // Si pasa la validación, abrir el modal para cargar el archivo
                        //$scope.abrirModalCargarArchivo(idPlantilla);
                    })
                    .catch(function (error) {
                        console.error("Error al validar la cantidad de archivos:", error);
                        alert("Hubo un error al validar la cantidad de archivos.");
                    });
            };

            // Inicialización
            $scope.init = function () {
                LoadingOverlap.show();
                $scope.listarPlantillasCargando();
            };

            $scope.init();
        }
    ]);