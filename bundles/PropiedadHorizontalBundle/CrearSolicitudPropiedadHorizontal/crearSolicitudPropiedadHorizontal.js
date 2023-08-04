saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("crear-solicitud-propiedad-horizontal", {
            url: "/propiedadhorizontal/crearsolicitud",
            views: {
                "main": {
                    controller: "crearSolicitudPropiedadHorizontalCtrl",
                    templateUrl: "../bundles/PropiedadHorizontalBundle/CrearSolicitudPropiedadHorizontal/crearSolicitudPropiedadHorizontal.tpl.html",
                }
            },
        });
    }
])
.controller("crearSolicitudPropiedadHorizontalCtrl", ["$scope", "$http", "$state", "root",
    function ($scope, $http, $state, root) {
        $scope.notificacion = '';
        $scope.notificacion_radicado = '';
        // $scope.root = root;

        
        // Funcion que inicia la solicitud de radicacion
        $scope.radicarSolicitud = function () {

            var tp_tramite = $('#tp_tramite').val();
            var nom_propiedad = $('#nom_propiedad').val();
            var dir_predio = $('#dir_predio').val();
            var tel_predio = $('#tel_predio').val();

            //Extensiones permitidas
            var extensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
            
            // console.log($aforoEvento);
            if (tp_tramite == undefined || tp_tramite == '') {
                alert("¡Debe seleccionar un tipo de trámite para continuar!");
            }
            else if (nom_propiedad == undefined || nom_propiedad == '') {
                alert("¡Debe ingresar el nombre de la propiedad para continuar!");
            }
            else if (dir_predio == undefined || dir_predio == '') {
                alert("¡Debe ingresar la dirección del predio para continuar!");
            }
            else if (tel_predio == undefined || tel_predio == '') {
                alert("¡Debe ingresar el telefono del predio para continuar!");
            }
            else {
            
                var formData = new FormData();
                var file_data = document.querySelectorAll('input[name="docs[]"]');
                var name_data = document.querySelectorAll('input[name="namesDocs[]"]:checked');
                var arrayNameData = [];

                if (file_data[0].files.length != 0) {
                    for (var i = 0; i < file_data.length; i++) {
                        if (file_data[i].files[0] != undefined) {
                            if( !extensions.test(file_data[i].files[0].name) ) {
                                alert('¡Por favor seleccione un archivo en los formatos permitidos: jpg, png y pdf para poder continuar!');
                                return false;
                            }
                            else {
                                formData.append('files'+i, file_data[i].files[0]);
                                arrayNameData.push(name_data[i].value);
                            }    
                        }
                        else {
                            alert('¡Recuerde que la carga de documentos es obligatoria para poder continuar, por favor verifique e intente nuevamente!');
                            return false;
                        }
                    }
                    formData.append('nameFiles', arrayNameData);
                    formData.append("tramite", tp_tramite);
                    formData.append("nombre_propiedad", nom_propiedad);
                    formData.append("direccion_predio", dir_predio);
                    formData.append("telefono_predio", tel_predio);
    
                    $(".overlap_espera").show();
                    $(".overlap_espera_1").show();
    
                    var config = {
                        method: 'POST',
                        data: formData,
                        enctype: 'multipart/form-data',
                        url: root+"propiedadhorizontal/radicar_solicitud",
                        headers: {
                            'Content-Type': undefined
                        }
                    };
                    
                    $http(config).success(function(data){
                        // console.log('datos '+data);
                        // console.log('datos2 '+JSON.stringify(data));
                        
                        if (data.data.numRadicado) {
                            $scope.notificacion_radicado = 'Su solicitud ha sido radicada con el número '+data.data.numRadicado;
                        }
    
                        //Desactiva el div de carga 
                        $(".overlap_espera").fadeOut(500, "linear");
                        $(".overlap_espera_1").fadeOut(500, "linear"); 
                    })
                    .error(function(err){
                        console.log('Error '+err);
                        //Desactiva el div de carga 
                        $(".overlap_espera").fadeOut(500, "linear");
                        $(".overlap_espera_1").fadeOut(500, "linear");
                        alert('¡No ha sido posible radicar la solicitud, por favor verifique e intente nuevamente!');
                    }); 
    
                    return false;
                }
                else {
                    alert('¡Debe seleccionar un archivo para poder continuar!');
                    return false;
                }
            }

        };

        //Funcion que activa los documentos necesarios dependiendo de la solicitud
        $scope.onChangeTtramite = function() {
            var tipoTramite = $('#tp_tramite').val();

            if (tipoTramite == 3) {
                $('#divDoc4').removeAttr('hidden');
                $('#divDoc5').removeAttr('hidden');
                $('#doc_4').attr({
                    'required' : true,
                    'name' : 'docs'
                });
                $('#doc_5').attr({
                    'required' : true,
                    'name' : 'docs'
                });    
            }
            else {
                $('#divDoc4').attr('hidden', true);
                $('#divDoc5').attr('hidden', true);
                $('#doc_4').removeAttr('name', 'required');
                $('#doc_5').removeAttr('name', 'required');
            }
        };

        $(document).ready(function() {
            $('.document').change(function() {
                var index = $('.document').index(this);
                $('.validate').eq(index).prop('checked', this.files.length > 0);
            });
            
            $('.validate').change(function() {
                var index = $('.validate').index(this);
                $('.archivo').eq(index).prop('required', !this.checked);
            });
        });
    }
]);