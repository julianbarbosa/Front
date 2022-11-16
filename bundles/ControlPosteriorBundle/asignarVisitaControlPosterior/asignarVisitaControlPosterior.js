//const { selected } = require("esri/widgets/FeatureTable/Grid/support/ButtonMenuItem");

saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("asignarvisita-controlposterior", {
            url: "/controlposterior/asignarvisita",
            views: {
                "main": {
                    controller: "AsignarVisitaControlPosteriorCtrl",
                    templateUrl: "../bundles/ControlPosteriorBundle/asignarVisitaControlPosterior/asignarVisitaControlPosterior.tpl.html"
                }
            }
        });
    }
]).controller("AsignarVisitaControlPosteriorCtrl", ["$scope","$state","$http", "TecnicosVisita", "AsignacionVisita","ConsultarAsignacionesControlPosterior", "LoadingOverlap", "$stateParams", "root", "$timeout",
    function ($scope,$state, $http,TecnicosVisita, AsignacionVisita,ConsultarAsignacionesControlPosterior,  $timeout, LoadingOverlap, $stateParams, root) {
      
        $scope.currentPage = 1;
        $scope.itemPorPage = 10;
        $scope.maxSize = 5;
        
        $scope.headers = [
            {type: 'text', name: 'idAsignaVisita', title: 'Id asignación', header_align: 'text-center', body_align: 'text-center', width: '5%'},
            {type: 'text', name: 'razonsocial', title: 'Nombre asigandor', header_align: 'text-center', body_align: 'text-center',input: false},
            {type: 'date', name: 'createdAt', title: 'Fecha creación', header_align: 'text-center', body_align: 'text-center', input: false},
            {type: 'action', name: 'acciones', title: 'Acciones', align: 'text-center', input: false,
                values: [
                    {
                        'icon': '<i class="ver-detalle fa fa-pencil-square-o" title="Editar asignacion"></i>',
                        'click': 'actualizarUsuario'
                    }
                ],
            },
        ];

        
        ConsultarAsignacionesControlPosterior.get().$promise.then(function (response) {
            $scope.asignaciones =  response['data'];
            console.log($scope.asignaciones);
            
        });
        $scope.formvisibility=false;
        $scope.actualizarDatos = function () {     
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();     
            $scope.formvisibility = true;
            TecnicosVisita.query({}).$promise.then(function(response) {
                $scope.visitadores = response.map(function(item){                   
                    item["licencias"]=0;
                    item["selected"]=false;
                    return item
                })
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
                console.log($scope.visitadores);
              
            });
            
        }

        $scope.crearAsignacion = function () {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();   
           // $scope.formvisibility = false;
            $scope.user;
            //console.log($scope.visitadores);
            $scope.asignacion = [];

            AsignacionVisita.query($scope.visitadores)
            .$promise.then(function (response) {
                $scope.data = response['data'];
                
                if (response['msg']) {
                    $scope.msg =  response['msg'];
                    alert($scope.msg);
                   
                }
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");

                $state.go('asignarvisita-controlposterior', {}, {reload: "asignarvisita-controlposterior"});

            });

            
        }
        $scope.cancelarAsignacion = function () {
            $scope.formvisibility = false;
            console.log($scope.formvisibility);
            
        }
        
        
        $scope.caller = function (funcion, item) {                    
            $scope.$eval(funcion).call([], item);
        };
                        
    }
]);
