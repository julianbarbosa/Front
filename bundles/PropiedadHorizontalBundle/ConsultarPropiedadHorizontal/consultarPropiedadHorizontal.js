saul.config(["$stateProvider", 
    function ($stateProvider) {
        $stateProvider.state("consultar-propiedad-horizontal", {
            url: "/propiedadhorizontal/consultar",
            views: {
                "main": {
                    controller: "consultarPropiedadHorizontalCtrl",
                    templateUrl: "../bundles/PropiedadHorizontalBundle/ConsultarPropiedadHorizontal/consultarPropiedadHorizontal.tpl.html",
                }
            },
        });
    }
])
.controller("consultarPropiedadHorizontalCtrl", ["$scope", "$http", "$state", "root", 
    function ($scope, $http, $state, root) {
        
        //Desactiva el div de carga 
        $(".overlap_espera").fadeOut(500, "linear");
        $(".overlap_espera_1").fadeOut(500, "linear");  
        $scope.notificacion = '';
        $scope.notificacion_obligatorio = false;
        $scope.notificacion_minimo = false;
        $scope.resultadosConsulta = '';
        $scope.root = root;
        
        // Funcion que consulta los datos ingresados
        $scope.consultarPropiedadHorizontal = function() {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();

            var datosAConsultar = $("#datos_consulta").val();
            $scope.notificacion = '';
                      
            if (datosAConsultar == undefined || datosAConsultar == '') {
                $scope.notificacion_obligatorio = true;
                $scope.notificacion_minimo = false;
                //Desactiva el div de carga 
                $(".overlap_espera").fadeOut(200, "linear");
                $(".overlap_espera_1").fadeOut(200, "linear"); 
            } 
            else if (datosAConsultar.length < 4) {
                $scope.notificacion_obligatorio = false;
                $scope.notificacion_minimo = true;
                //Desactiva el div de carga 
                $(".overlap_espera").fadeOut(200, "linear");
                $(".overlap_espera_1").fadeOut(200, "linear"); 
            }
            else {
                $scope.notificacion_obligatorio = false;
                $scope.notificacion_minimo = false;
                // //Desactiva el div de carga 
                // $(".overlap_espera").fadeOut(500, "linear");
                // $(".overlap_espera_1").fadeOut(500, "linear");  

                $http.post(root+"propiedadhorizontal/consultar_propiedad_horizontal", {datosconsulta: datosAConsultar})
                    .success(function(data){
                        console.log(data);

                        if (data.msg == "Ingreso correctamente") {
                            $scope.resultadosConsulta = data.resultQuery;
                            $scope.notificacion = '';
                        }
                        else {
                            $scope.notificacion = data.msg;
                            $scope.resultadosConsulta = '';
                        }
                            
                        //Desactiva el div de carga 
                        $(".overlap_espera").fadeOut(500, "linear");
                        $(".overlap_espera_1").fadeOut(500, "linear");  
                    })
                    .error(function(err){
                        console.log(err);
                    });
            }
        };

        
        $('#datos_consulta').on('keyup', function (e) {
            var keycode = e.keyCode || e.which;
            if (keycode == 13) {
                $scope.consultarPropiedadHorizontal();
            }
        });
        

        // // Funcion que inicia la solicitud de radicacion
        // $scope.radicarEvento = function ($codigoEvento, $aforoEvento, $infoCosto) {
            
        //     // console.log($aforoEvento);
        //     if ($aforoEvento == undefined) {
        //         alert("Debe confirmar el aforo para continuar");
        //     }
        //     else {
        //         $(".overlap_espera").show();
        //         $(".overlap_espera_1").show();

        //         $http.post(root+"artesescenicas/radicar_solicitud", {codigoEvento: $codigoEvento, aforoEvento: $aforoEvento, infoCosto: $infoCosto})
        //         .success(function(data){
        //             console.log(data);
        //             //Desactiva el div de carga 
        //             $(".overlap_espera").fadeOut(500, "linear");
        //             $(".overlap_espera_1").fadeOut(500, "linear"); 
        //             if (data.data.numRadicado) {
        //                 $scope.notificacion_radicado = 'Su solicitud ha sido radicada con el número '+data.data.numRadicado;
        //             }
        //         })
        //         .error(function(err){
        //             console.log(err);
        //         });
        //     }

        // };

        // //Funcion que guarda los documentos de manera sincronica
        // $scope.guardarDocumentos = function ($idName, $codigoEvento) {
        //     //Extensiones permitidas
        //     var extensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
            
        //     var formData = new FormData();
        //     var file_data = $('#documento_'+$idName).prop("files")[0];

        //     if (file_data != undefined) {

        //         if( !extensions.test(file_data.name) ) {
        //             alert('Por favor seleccione un archivo con los formatos permitidos: jpg, png y pdf');
        //             return false;
        //         }

        //         $("#ver_documento_"+$idName).attr("hidden", true);
        //         $("#ver_documento_"+$idName).addClass("ng-hide");
        //         $("#ver_documento_"+$idName).removeAttr("href");
                
        //         formData.append("file", file_data);
        //         formData.append("idName", $idName);
        //         formData.append("codigoEvento", $codigoEvento);

        //         $scope.animateprogress($idName, 0, 65);
        //         $(".overlap_espera").show();
        //         $(".overlap_espera_1").show();

        //         var config = {
        //             method: 'POST',
        //             data: formData,
        //             enctype: 'multipart/form-data',
        //             url: root+"artesescenicas/guardar_documento",
        //             headers: {
        //                 'Content-Type': undefined
        //             }
        //         };
                
        //         $http(config).success(function(data){
        //             // console.log('datos '+data);
        //             $scope.animateprogress($idName, 65, 100);
                    
        //             $("#documento_requerido_"+$idName).attr("hidden", true);
        //             $("#ver_documento_"+$idName).attr("href", root+"upload/documentos/"+data.nombrearchivo);
        //             $("#ver_documento_"+$idName).removeClass("ng-hide");
        //             $("#ver_documento_"+$idName).removeAttr("hidden");

        //             if (data.datos_documentos != null) {
        //                 if (data.datos_documentos.length > 8) {
        //                     var cantRequeridos = 0;
        //                     for (var i = 0; i < data.datos_documentos.length; i++) {
        //                         if (data.datos_documentos[i]['archivo'] != null && data.datos_documentos[i]['requerido'] == 1) {
        //                             cantRequeridos++;
        //                         }
        //                     }

        //                     console.log(cantRequeridos);
        //                     if (cantRequeridos >= 13) {
        //                         $scope.documentos_completos = true;
        //                     }
        //                 }    
        //             }

        //             //Desactiva el div de carga 
        //             $(".overlap_espera").fadeOut(500, "linear");
        //             $(".overlap_espera_1").fadeOut(500, "linear"); 
        //         })
        //         .error(function(err){
        //             console.log('Error '+err);
        //             $('#barra_estado_'+$idName).val(0);
        //             $('#span_'+$idName).html("0%");
        //             //Desactiva el div de carga 
        //             $(".overlap_espera").fadeOut(500, "linear");
        //             $(".overlap_espera_1").fadeOut(500, "linear");
        //             alert('¡No ha sido posible cargar el documento, por favor verifique e intente nuevamente!');
        //         }); 

        //         return false;
        //     }
        //     else {
        //         alert('¡Debe seleccionar un archivo para poder continuar!');
        //         return false;
        //     }
                
        // };

        // $scope.radicarDocumentos = function ($codigoEvento, $documentosRadicados) {
        //    // console.log($aforoEvento);
        //     if ($documentosRadicados) {
        //         alert("Ya existe un numero de radicado para los documentos cargados, por favor valide.");
        //     }
        //     else {
        //         $(".overlap_espera").show();
        //         $(".overlap_espera_1").show();

        //         $http.post(root+"artesescenicas/radicar_documentos", {codigoEvento: $codigoEvento})
        //         .success(function(data){
        //             console.log(data);

        //            if (data.data.numRadicado) {
        //                 $scope.notificacion_radicado_documentos = 'Su solicitud ha sido radicada con el número '+data.data.numRadicado;
        //                 $scope.validarEvento($codigoEvento);
        //             }
        //             //Desactiva el div de carga 
        //             // $(".overlap_espera").fadeOut(500, "linear");
        //             // $(".overlap_espera_1").fadeOut(500, "linear"); 

        //         })
        //         .error(function(err){
        //             console.log(err);
        //         });
        //     } 
        // };

        // $scope.animateprogress = function (id, val_ini, val_fin){		

        //     var getRequestAnimationFrame = function () {  /* <------- Declaro getRequestAnimationFrame intentando obtener la máxima compatibilidad con todos los navegadores */
        //         return window.requestAnimationFrame ||
        //         window.webkitRequestAnimationFrame ||   
        //         window.mozRequestAnimationFrame ||
        //         window.oRequestAnimationFrame ||
        //         window.msRequestAnimationFrame ||
        //         function ( callback ){
        //             window.setTimeout(enroute, 1 / 60 * 1000);
        //         };
                
        //     };
            
        //     var fpAnimationFrame = getRequestAnimationFrame();   
        //     var i = val_ini;
        //     var animacion = function () {
                    
        //     if (i <= val_fin) 
        //         {
        //             $('#barra_estado_'+id).val(i);
        //             $('#span_'+id).html( i+"%");
        //             // document.getElementById(id).setAttribute("value",i);      /* <----  Incremento el valor de la barra de progreso */
        //             // document.getElementById(id+"+ span").innerHTML = i+"%";     /* <---- Incremento el porcentaje y lo muestro en la etiqueta span */
        //             i++;
        //             fpAnimationFrame(animacion);          /* <------------------ Mientras que el contador no llega al porcentaje fijado la función vuelve a llamarse con fpAnimationFrame     */
        //         }
        //     }
        //     fpAnimationFrame(animacion);   /*  <---- Llamo la función animación por primera vez usando fpAnimationFrame para que se ejecute a 60fps  */
        // };

        // //Funcion que da formato a los numeros
        // $scope.FormatearNumeros = function ($valor) {
        //     $valor += '';
        //     var num = $valor.replace(/\./g,'');
        //     if( !isNaN(num) ){
        //         num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        //         num = num.split('').reverse().join('').replace(/^[\.]/,'');
        //         return num;
        //     }
		// };

        // //Funcion para el funcionamiento del tab, soluciona interferencia con las rutas de SAUL
        // $scope.muestraTab = function ($tab) {
        //     if ($tab == 1) {
        //         $('#id_tab_carga_de_documentos').removeClass('active');
        //         $('#id_tab_condiciones').addClass('active');
        //         $('#id_tab_aforo').removeClass('active');
        //         $('#id_tab_artistas').removeClass('active');

        //         $('#tab_carga_de_documentos').removeClass('active');
        //         $('#tab_condiciones').addClass('active');
        //         $('#tab_aforo').removeClass('active');
        //         $('#tab_artistas').removeClass('active');
        //     }
        //     else if ($tab == 2) {
        //         $('#id_tab_carga_de_documentos').removeClass('active');
        //         $('#id_tab_condiciones').removeClass('active');
        //         $('#id_tab_aforo').addClass('active');
        //         $('#id_tab_artistas').removeClass('active');

        //         $('#tab_carga_de_documentos').removeClass('active');
        //         $('#tab_condiciones').removeClass('active');
        //         $('#tab_aforo').addClass('active');
        //         $('#tab_artistas').removeClass('active');
        //     } 
        //     else if ($tab == 3) {
        //         $('#id_tab_carga_de_documentos').removeClass('active');
        //         $('#id_tab_condiciones').removeClass('active');
        //         $('#id_tab_aforo').removeClass('active');
        //         $('#id_tab_artistas').addClass('active');

        //         $('#tab_carga_de_documentos').removeClass('active');
        //         $('#tab_condiciones').removeClass('active');
        //         $('#tab_aforo').removeClass('active');
        //         $('#tab_artistas').addClass('active');
        //     }
        //     else if ($tab == 4) {
        //         $('#id_tab_carga_de_documentos').addClass('active');
        //         $('#id_tab_condiciones').removeClass('active');
        //         $('#id_tab_aforo').removeClass('active');
        //         $('#id_tab_artistas').removeClass('active');

        //         $('#tab_carga_de_documentos').addClass('active');
        //         $('#tab_condiciones').removeClass('active');
        //         $('#tab_aforo').removeClass('active');
        //         $('#tab_artistas').removeClass('active');
        //     }
        // };
    }
]);

