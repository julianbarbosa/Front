saul.config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state("controlpolicivo-crear-organismo", {
        url: "/controlpolicivo/crear-organismo",
        views: {
            "main": {
                controller: "ControlPolicivoCrearOrganismoCtrl",
                templateUrl: "../bundles/ControlPolicivoBundle/crearOrganismo/crearOrganismo.tpl.html"
            }
        }
    });
}]).controller("ControlPolicivoCrearOrganismoCtrl", ['$scope', '$http', 'root', 'LoadingOverlap', 
    function ($scope, $http, root, LoadingOverlap) {

    // Inicializar los objetos
    $scope.organismoEdit = null;  
    $scope.nuevoOrganismo = {}; 
    $scope.tiposOrganismo = []; 
    $scope.comunas = [];         
    $scope.responsable = [];  
    $scope.organismopadre = [];   
    $scope.obtenerEstado = [];
    $scope.obtenerOrganismoDetallado = [];

    // Guardar el id del organismo en localStorage (front)
    $scope.guardarOrganismoId = function(organismoId) {

        console.log('organismo.id guardado en localStorage:', organismoId);
    };

    //obtenerOrganismoDetallado para cuando se edite mostrar los datos.
    
    $scope.obtenerOrganismoDetallado = function() {
        const organismoId = localStorage.getItem('organismoId');
        console.log('QUE ORGANISMO TENGO ?', typeof organismoId);
        if (organismoId) {
            return $http.get(root + 'Organismo/obtener-organismo/' + organismoId)
            .then(function(response) {
                console.log(response);
                $scope.organismo = response.data;  // Suponiendo que la respuesta es un array con un objeto
                $scope.buscarResponsable(false);
               
   
                // // Asignar los valores directamente al modelo de AngularJS
                // $scope.organismo = {
                //     nombre: $scope.organismoData.nombre,
                //     direccion: $scope.organismoData.direccion,
                //     telefono: $scope.organismoData.telefono,
                //     tipoOrganismo: $scope.organismoData.tipoOrganismo, 
                //     responsable: $scope.organismoData.responsable,
                //     comuna: $scope.organismoData.idcomuna,  
                //     radicadorOrfeo: $scope.organismoData.radicadorOrfeo,
                //     codDependencia: $scope.organismoData.codDependencia,
                //     organismoPadre: $scope.organismoData.organismoPadre,
                //     estado: $scope.organismoData.estado
                // };
   
                // Marcar que estamos en modo edición
                $scope.esCreacionRegistro = false;
   
                // Mostrar mensaje de éxito después de obtener los datos
                // bootbox.alert({
                //     message: "Organismo editado exitosamente.",
                //     size: 'small'
                // });
   
            })
            .catch(function(error) {
                console.error('Error al obtener los datos del organismo:', error);
                bootbox.alert('Hubo un error al cargar los datos del organismo.');
            });
        }
    };
   
    
    // Llamar la función para obtener los detalles del organismo cuando se carga la página
    $scope.obtenerOrganismoDetallado();
    
    // Función para limpiar el localStorage
    $scope.limpiarLocalStorage = function() {
        localStorage.removeItem('organismoId');
        console.log('LocalStorage limpiado');
    };
    
    
    
    // Función para validar el formulario
    $scope.validarFormulario = function(organismo) {
        if (!organismo.nombre || !organismo.direccion || !organismo.telefono || !organismo.tipoOrganismo || !organismo.radicadorOrfeo
            || !organismo.codDependencia || !organismo.responsable || !organismo.comuna || !organismo.estado) {
                bootbox.alert({
                    message: "Faltan datos importantes por diligenciar.",
                    size: 'small'
                });
            return false;
        }
        return true;
    };

    // Función para crear un nuevo organismo

    
    $scope.crearOrganismo = function() {
        // Si es un nuevo organismo, asignamos el estado "Activo" (idestado = 97)
        // if ($scope.esCreacionRegistro) {
        //     organismo.estado = { idestado: 97, codigo: 'Activo' };  // Estado "Activo"
        // } else {
        //     organismo.estado = { idestado: 82, codigo: 'Inactivo' };  // Estado "Inactivo"
        // }
    
        // Asegúrate de que cada propiedad tiene un valor antes de enviarla
        // var organismoEnviar = {
        //     nombre: organismo.nombre,
        //     direccion: organismo.direccion,
        //     telefono: organismo.telefono,
        //     createdAt: new Date().toISOString(),
        //     tipoOrganismoId: organismo.tipoOrganismo,
        //     responsable: organismo.responsable,
        //     comuna: organismo.comuna,
        //     radicadorOrfeo: organismo.radicadorOrfeo,
        //     codDependencia: organismo.codDependencia,
        //     responsableId: organismo.responsableid,
        //     organismoPadre: organismo.organismoPadre,
        //     estado: organismo.estado.idestado
        // };
    
        // console.warn('Datos finales que se enviarán al servidor:', organismoEnviar);
    
        // Enviar los datos al servidor
        LoadingOverlap.show();
        $http.post(root + 'organismo/crearOrganismo', $scope.organismo)
            .then(function(response) {
                LoadingOverlap.hide();
                // Mostrar mensaje de éxito
                bootbox.alert({
                    message: "Organismo creado exitosamente.!",
                    size: 'small',
                    callback: function() {
                        // Limpiar formulario después de mostrar el mensaje
                        $scope.nuevoOrganismo = {};  // Limpiar el objeto del formulario
                        // location.reload();
                        // $scope.init();
                    }
                });
            },function(error) {
                LoadingOverlap.hide();
                // En caso de error
                bootbox.alert({
                    message: "Hubo error al crear organismos.",
                    size: 'small'
                });
                console.log(error);
            });
    };
    

    // Función para cargar los tipos de organismo
    $scope.cargarTiposOrganismo = function() {
        return $http.get(root + 'organismo/listartipoorganismo') // Retorna la promesa
            .then(function(response) {
                $scope.tiposOrganismo = response.data;
            }, function(error) {
                console.error("Error al cargar tipos de organismo");
            });
    };

    // Función para cargar las comunas
    $scope.cargarComunas = function() {
        $http.get(root + 'comuna/')  
            .then(function(response) {
                $scope.comunas = response.data;
            }, function(error) {
                console.error("Error al cargar comunas", error);
            });
    };

    // Función para buscar responsable
    $scope.buscarResponsable = function(showAlert) {
        var query = $scope.organismo.responsable.username;

        // Limpiar resultados y mensaje de error antes de hacer la búsqueda
        $scope.responsable = [];
        $scope.errorMessage = '';  // Limpiar mensaje de error

        // Si el query tiene menos de 5 caracteres, no hacemos la búsqueda
        if (query.length < 5) {
            return;
        }

        // Llamada a la API para buscar responsable por correo
        $http.get(root + 'organismo/responsable/' + query)  // Asegúrate de usar la ruta correcta con el query
            .then(function(response) {
                console.log(response);

                // Si la respuesta tiene 'exists' true, mostrar el modal de confirmación
                if (response.data.exists && response.data.responsable.id) {
                    $scope.responsable = response.data.responsable;
                    $scope.errorMessage = "El correo existe."; // Mensaje de éxito

                    // Asignar el id del primer responsable a la variable global idresponsable
                    // $scope.idresponsable = $scope.responsable[0].id;
                    // console.log($scope.organismo.responsable);
                
                    $scope.organismo.responsableid = $scope.responsable.id;
                    // Mostrar mensaje con bootbox
                    if(showAlert==true) {
                        bootbox.alert({
                            message: "El correo existe.",
                            size: 'small'
                        });
                    }
                   

                } else {
                    $scope.responsable = [];
                    $scope.errorMessage = "No existe responsable con ese correo.";

                    bootbox.alert({
                        message: "No existe responsable con ese correo.",
                        size: 'small'
                    });

                    // Limpiar idresponsable si no se encontró el responsable
                    $scope.idresponsable = null;
                }
            }, function(error) {
                // En caso de error con la llamada HTTP
                $scope.responsable = [];
                $scope.errorMessage = "Error al realizar la búsqueda.";

                // Mostrar mensaje con bootbox
                bootbox.alert({
                    message: "Error al realizar la búsqueda.",
                    size: 'small'
                });

                // Limpiar idresponsable en caso de error
                $scope.idresponsable = null;
            });
    };

    // Función para validar si el usuario ha dado click o no, solo si idresponsable no es null
    $scope.validarYContinuar = function() {
        if ($scope.idresponsable === null) {
            bootbox.alert({
                message: "Primero debe buscar un responsable por correo.",
                size: 'small'
            });
            return;
        }
    };

    // Inicialización al cargar la página
    $scope.init = function() {
        LoadingOverlap.show();
        $scope.cargarTiposOrganismo().then(function(){
            $scope.cargarComunas();
            $scope.cargarOrgPadre();
            $scope.obtenerOrganismoDetallado().then(function() {
                LoadingOverlap.hide();
            });
        });
    };

    $scope.init();

    // Funcion para buscar organismo padre
    $scope.cargarOrgPadre = function() {
        $http.get(root + 'organismo/listar-organismos')
            .then(function(response) {
                $scope.organismos = response.data;                    
            }, function(error) {
                bootbox.alert({
                    message: "Error al cargar organismos padre",
                    size: 'small'
                });
            });
    };
    
    

    $scope.esCreacionRegistro = true;  
    // Función 
    $scope.obtenerEstado = function() {
        $scope.estados = [{"codigo":"Activo", "nombre":"Activo"},{"codigo":"inactivo", "nombre":"Inactivo"}];
        // const params = { isNew: $scope.esCreacionRegistro };  
    
        // $http.get(root + 'Estado/', { params: params })  
        // .then(function(response) {
        //     console.log('Respuesta de estados:', response.data);  
        //     if (response.data && Array.isArray(response.data)) {
        //         $scope.estados = response.data;  
        //     } else {
        //         console.error('Estado no válido en la respuesta del backend');
        //     }
        // })
        // .catch(function(error) {
        //     console.error('Error al obtener los estados:', error);
        // });
    };
    
$scope.obtenerEstado();
}]);
