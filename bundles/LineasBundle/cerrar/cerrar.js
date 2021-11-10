saul.config(["$stateProvider", function(a) {
    a.state("cerrar-solicitud-lineas", {
        url: "/lineas/cerrar/:idsolicitud",
        views: {
            main: {
                controller: "CerrarLineasCtrl",
                templateUrl: "../bundles/LineasBundle/cerrar/cerrar.tpl.html"
            }
        }
    })
}]).controller("CerrarLineasCtrl", ["$scope", "$http", "root", "UtilForm","$stateParams","Upload",
    function($scope, $http, root, UtilForm,  $stateParams, Upload) {
        
        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};
            $scope.validator.alert.title = data.title;
            $scope.validator.alert.content = data.msg;
            $scope.validator.alert.type = data.type;
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        };        
        $scope.item = {};
        $scope.root = root;
        $scope.demarcacion = {};
        $scope.item.idSolicitud = $stateParams.idsolicitud;
        $scope.maxlengthcodigounico = 30;
        $scope.maxlengthnumeropredial = 13;
        $scope.faltante_codigo_unico = $scope.maxlengthcodigounico;
        $scope.urlLinea = null;
        
        $scope.file = '';
        $scope.$on("fileSelected", function (event, args) {              
            $scope.file = args.file;            
        });
        
        $scope.save = function(cerrar) {
            if(cerrar===1) {
                bootbox.confirm("Confirma que desea realizar esta acción?",
                function (result) {
                    if (result) {                        
                         $scope.guardar(1);
                    }
                });            
            } else {
                $scope.guardar(0);
            }
               
             
        };
        
        $scope.previsualizar = function(){
			UtilForm.openWith(
				root+"linea/oficio/previsualizar/",
				'post',
				[
					{
						name: 'textoRespuesta',
						value: $scope.item.textoRespuesta
					},
                    {
						name: 'reviso',
						value: $scope.item.reviso
					},
                    {
						name: 'idSolicitud',
						value: $scope.item.idSolicitud
					}
				]
			);
		};
        
        $scope.guardar = function() {
            $scope.iniciarEspera();
            Upload.upload({
                method: 'post',
                url: root+'linea/oficio',  
                data: {
                    textoRespuesta: $scope.item.textoRespuesta,
                    reviso: $scope.item.reviso,
                    idSolicitud: $scope.item.idSolicitud
                }
            }).then(function (response) {
                $scope.finalizarEspera();
                $scope.result = response.data;
                callback(response.data);                
                $scope.item = [];
                $scope.isSuccess = true;
            });   
        }
        
        $scope.obtenerTextoRespuesta = function($tipoRespuestaOficioId) {
             $http.get(root+"linea/oficio/obtenerrespuesta/"+$scope.item.idSolicitud+"/"+$tipoRespuestaOficioId).then(function(response) {
                $scope.item.textoRespuesta = response.data;
            });
        }
        
        $scope.obtenerTiposRespuesta = function() {
            $http.get(root+"dominio/respuesta_oficio_linea_demarcacion").then(function(response) {
                $scope.tiposDeRespuesta = response.data;
            });
        }
        $scope.obtenerTiposRespuesta();
        
        $scope.obtenerOficioDiligenciado = function() {
            $http.get(root+"linea/oficio/obtenerdiligenciado/"+$scope.item.idSolicitud).then(function(response) {
                $scope.item.textoRespuesta = response.data.respuesta;
                $scope.item.reviso = response.data.reviso == undefined? 'Gilberto Moreno – Profesional Universitario' : response.data.reviso ;
            });
        }
        $scope.obtenerOficioDiligenciado();
    }])
