saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("parametrosOC", {
            url: "/parametrosOC/parametrizacion",
            views: {
                "main": {
                    controller: "listarParametrosCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/parametrizacionInspector/parametrizacion.tpl.html",
                }
            },
        });
    }
])
    .controller("listarParametrosCtrl", ["$scope", "$http", "root", "LoadingOverlap",
        function ($scope, $http, root, LoadingOverlap) {
            $scope.root = root;
            $scope.activeTab = 0; // Establece la pestaña activa inicial en el primer índice

            // Validación de formulario
            $scope.validForm = function () {
                //return $scope.formulario.$valid;
                return true;
            };

            // Función para mostrar el modal de mensajes
            $scope.mostrarModalMensaje = function (titulo, mensaje) {
                $('#modalMensajeTitulo').text(titulo);
                $('#modalMensajeCuerpo').text(mensaje);
                $('#modalMensaje').modal('show');
            };

            // Método para guardar todos los datos
            $scope.guardar = function () {
                if ($scope.validForm() === true) {
                    LoadingOverlap.show();

                    // Obtener el dominio activo basado en la pestaña activa
                    const dominioActivo = $scope.dominios[$scope.activeTab];

                    // Preparar los datos del dominio activo para el envío
                    const datos = {
                        estandar: dominioActivo.estandar,
                        nombre: dominioActivo.nombre,
                        tipo: dominioActivo.tipo,
                        hijos: [],
                    };

                    for (var i = 0; i < dominioActivo.hijos.length; i++) {
                        const hijo = dominioActivo.hijos[i];
                        datos.hijos.push({
                            id: hijo.id,
                            dominio_padre_id: dominioActivo.id,
                            nombre: hijo.nombre,
                            estandar: hijo.estandar,
                            tipo: hijo.tipo,
                            valor: JSON.stringify({
                                tipo: hijo.valor.tipo,
                                min: hijo.valor.min,
                                max: hijo.valor.max,
                                default: hijo.valor.default,
                                help: hijo.valor.help,
                                text_true: hijo.valor.text_true,
                                text_false: hijo.valor.text_false
                            }),
                        });
                    }

                    console.log(datos);

                    // Enviar los datos del dominio activo al backend
                    $http.post(root + "ParametrosOC/guardar", datos)
                        .then(function (response) {
                            $scope.mostrarModalMensaje("Éxito", "Datos guardados exitosamente para el dominio activo." + dominioActivo.nombre );
                            $scope.listarDominios();
                        })
                        .catch(function (error) {
                            const mensajeError = error.data && error.data.message
                                ? error.data.message
                                : "Error desconocido.";
                            $scope.mostrarModalMensaje("Error", "Error al guardar los datos: " + mensajeError);
                        })
                        .finally(function () {
                            LoadingOverlap.hide();
                        });
                } else {
                    $scope.mostrarModalMensaje("Formulario Inválido", "Por favor, complete correctamente todos los campos del formulario.");
                }
            };

            // Función para listar dominios
            $scope.listarDominios = function () {
                $http.get(root + "dominiohijos/ley_codigo_policia")
                    .then(function (response) {
                        // Asignar los dominios a la lista
                        $scope.dominios = response.data.data;

                        // Parsear 'valor' si es un string JSON
                        $scope.dominios.forEach(function (dominio) {
                            dominio.hijos.forEach(function (hijo) {
                                if (typeof hijo.valor === 'string') {
                                    try {
                                        // Hacer el parseo del string JSON
                                        hijo.valor = JSON.parse(hijo.valor);
                                    } catch (e) {
                                        console.error("Error al parsear JSON en hijo.valor: ", hijo.valor);
                                        LoadingOverlap.hide();
                                    }
                                }
                            });
                        });

                        LoadingOverlap.hide();
                    })
                    .catch(function (error) {
                        console.error("Error al listar dominios:", error);
                    });
            };

            // Función para cambiar la pestaña activa
            $scope.setActiveTab = function (index) {
                $scope.activeTab = index;
                //alert(index);
            };

            // Inicialización
            $scope.init = function () {
                $scope.listarDominios();
            };

            $scope.init();
        }
    ]);
