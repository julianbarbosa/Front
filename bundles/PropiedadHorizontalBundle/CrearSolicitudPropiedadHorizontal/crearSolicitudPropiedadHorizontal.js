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
                var file_data = document.querySelectorAll('input[name="docs"]');

                if (file_data != undefined) {
                    // var fileList = [];
                    for (var i = 0; i < file_data.length; i++) {
                        // console.log(file_data[i].files[0].name);
                        if (file_data[i].files[0] != undefined) {
                            if( !extensions.test(file_data[i].files[0].name) ) {
                                alert('¡Por favor seleccione un archivo en los formatos permitidos: jpg, png y pdf para poder continuar!');
                                return false;
                            }
                            else {
                                // fileList.push(file_data[i].files[0]);
                                formData.append('files'+i, file_data[i].files[0]);
                            }    
                        }
                        else {
                            alert('¡Recuerde que la cargar de documentos es obligatoria para poder continuar, por favor verifique e intente nuevamente!');
                            return false;
                        }
                    }
                    // console.log(fileList);

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
                        console.log('datos '+data);
                        
                        // if (data.datos_documentos != null) {
                        //     if (data.datos_documentos.length > 8) {
                        //         var cantRequeridos = 0;
                        //         for (var i = 0; i < data.datos_documentos.length; i++) {
                        //             if (data.datos_documentos[i]['archivo'] != null && data.datos_documentos[i]['requerido'] == 1) {
                        //                 cantRequeridos++;
                        //             }
                        //         }
    
                        //         console.log(cantRequeridos);
                        //         if (cantRequeridos >= 13) {
                        //             $scope.documentos_completos = true;
                        //         }
                        //     }    
                        // }
    
                        //Desactiva el div de carga 
                        $(".overlap_espera").fadeOut(500, "linear");
                        $(".overlap_espera_1").fadeOut(500, "linear"); 
                    })
                    .error(function(err){
                        console.log('Error '+err);
                        //Desactiva el div de carga 
                        $(".overlap_espera").fadeOut(500, "linear");
                        $(".overlap_espera_1").fadeOut(500, "linear");
                        alert('¡No ha sido posible cargar el documento, por favor verifique e intente nuevamente!');
                    }); 
    
                    return false;



                    $(".overlap_espera").show();
                    $(".overlap_espera_1").show();
                    console.log("tipoTramite = "+tp_tramite);
    
                    $http.post(root+"propiedadhorizontal/radicar_solicitud", {tipoSolicitud: tp_tramite})
                    .success(function(data){
                        console.log(data);
                        
                        // if (data.data.numRadicado) {
                        //     // $scope.radicarYnotificarOtrosOrganismos($tipoTramite, $aforoEvento, $infoCosto);
                        //     $scope.notificacion_radicado = 'Su solicitud ha sido radicada con el número '+data.data.numRadicado;
                        //     //Desactiva el div de carga 
                        //     // $(".overlap_espera").fadeOut(500, "linear");
                        //     // $(".overlap_espera_1").fadeOut(500, "linear"); 
                        // }
                    })
                    .error(function(err){
                        console.log(err);
                    });
                }
                else {
                    alert('¡Debe seleccionar un archivo para poder continuar!');
                    return false;
                }
            }

        };

        //Funcion que guarda los documentos de manera sincronica
        $scope.guardarDocumentos = function ($idName, $codigoEvento) {
            //Extensiones permitidas
            var extensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
            
            var formData = new FormData();
            var file_data = $('#documento_'+$idName).prop("files")[0];

            if (file_data != undefined) {

                if( !extensions.test(file_data.name) ) {
                    alert('Por favor seleccione un archivo con los formatos permitidos: jpg, png y pdf');
                    return false;
                }

                $("#ver_documento_"+$idName).attr("hidden", true);
                $("#ver_documento_"+$idName).addClass("ng-hide");
                $("#ver_documento_"+$idName).removeAttr("href");
                
                formData.append("file", file_data);
                formData.append("idName", $idName);
                formData.append("codigoEvento", $codigoEvento);

                $scope.animateprogress($idName, 0, 65);
                $(".overlap_espera").show();
                $(".overlap_espera_1").show();

                var config = {
                    method: 'POST',
                    data: formData,
                    enctype: 'multipart/form-data',
                    url: root+"artesescenicas/guardar_documento",
                    headers: {
                        'Content-Type': undefined
                    }
                };
                
                $http(config).success(function(data){
                    // console.log('datos '+data);
                    $scope.animateprogress($idName, 65, 100);
                    
                    $("#documento_requerido_"+$idName).attr("hidden", true);
                    $("#ver_documento_"+$idName).attr("href", root+"upload/documentos/"+data.nombrearchivo);
                    $("#ver_documento_"+$idName).removeClass("ng-hide");
                    $("#ver_documento_"+$idName).removeAttr("hidden");

                    if (data.datos_documentos != null) {
                        if (data.datos_documentos.length > 8) {
                            var cantRequeridos = 0;
                            for (var i = 0; i < data.datos_documentos.length; i++) {
                                if (data.datos_documentos[i]['archivo'] != null && data.datos_documentos[i]['requerido'] == 1) {
                                    cantRequeridos++;
                                }
                            }

                            console.log(cantRequeridos);
                            if (cantRequeridos >= 13) {
                                $scope.documentos_completos = true;
                            }
                        }    
                    }

                    //Desactiva el div de carga 
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear"); 
                })
                .error(function(err){
                    console.log('Error '+err);
                    $('#barra_estado_'+$idName).val(0);
                    $('#span_'+$idName).html("0%");
                    //Desactiva el div de carga 
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
                    alert('¡No ha sido posible cargar el documento, por favor verifique e intente nuevamente!');
                }); 

                return false;
            }
            else {
                alert('¡Debe seleccionar un archivo para poder continuar!');
                return false;
            }
                
        };

        $scope.onChange = function() {
            var a = $('#tp_tramite').val();
            alert("a= "+a);
        };
    }
]);