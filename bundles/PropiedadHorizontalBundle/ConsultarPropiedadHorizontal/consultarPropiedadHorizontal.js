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
        $scope.accessEditPH = false;
        
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
                            $scope.accessEditPH = data.access;
                            console.log($scope.accessEditPH);
                            
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
        

    }
]);

