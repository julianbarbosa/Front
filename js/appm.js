var saul = angular
.module("saul", [
"ngResource",
"ngSanitize",
"ui.router", 
"angularUtils.directives.dirPagination",
"ui.bootstrap.tpls",
"ui.bootstrap",
"checklist-model",
"ngFileUpload",
"angular-loading-bar",
"ui.mask",
"esri.map",
"textAngular"
])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
}])
.config(['uiMask.ConfigProvider', function(uiMaskConfigProvider) {
  uiMaskConfigProvider.maskDefinitions({'A': /[a-zñA-ZÑ]/});  
  uiMaskConfigProvider.clearOnBlur(false);
  uiMaskConfigProvider.eventsToHandle(['input', 'keyup', 'click']);
}])
.config(["$locationProvider",
"$urlRouterProvider",
"$httpProvider",
"$stateProvider",
function ($locationProvider, $urlRouterProvider, $httpProvider, $stateProvider) {    
    $locationProvider.hashPrefix('!');
    //$urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise("/inicio");
    $stateProvider.state('inicio',{
      url: '/inicio',
      views:{
        main:{
          templateUrl: '../bundles/inicio.tpl.html'
        }
      }
    });
    $httpProvider.interceptors.push(["$q",
    "$rootScope",
    function($q, $rootScope) {
        return {
            request: function(config) {
                $rootScope.$broadcast('REQUEST_START');
                return config;
            },
            response: function(response) {
               $rootScope.$broadcast('REQUEST_END');
               return response;
            },
            responseError: function(rejection) {
               $rootScope.$broadcast('REQUEST_END');
               return $q.reject(rejection);
            }
        };
    }]);
}]).value('GoogleApp', {
    apiKey: 'AIzaSyBjvjsGjjE-j3y7HDaW7a8QHcTurq6y1pY',
    clientId: '232209661906-0di0360cp7frju1vckcpcn3gvnbb8jbu.apps.googleusercontent.com',
    scopes: [
        'https://www.googleapis.com/auth/calendar'
    ],
    'X-Frame-Options': 'sameorigin'
}).directive('dsScrollTo', [function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, attrs) {
            var idToScroll = attrs.dsScrollTo,
                $target;

            $elm.on('click', function() {
                $target = idToScroll? $("#"+idToScroll): $elm;
                $("body").animate({
                    scrollTop: $target.offset().top
                }, "slow");
            });
        }
    }
}]).directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0;i<files.length;i++) {
                    //emit event upward
                    scope.$emit("fileSelected", { file: files[i] });
                }                                       
            });
        }
    };
})
.directive('numberConverter', function() {
  return {
    priority: 1,
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attr, ngModel) {
        function toModel(value) {
          if(angular.isUndefined(value) || value===null ) {
              return "0";
          }  
          return "" + value; // convert to string
        }

        function toView(value) {
            
            if(angular.isUndefined(value) || value===null ) {
                return 0;
            } else {
                return parseFloat(value); // convert to number
            }
      }

      ngModel.$formatters.push(toView);
      ngModel.$parsers.push(toModel);
    }
  };
}).directive('loadingMsg', [function() {
    return {
      template: '<div ng-show="pending" id="overlay"></div>',
      scope: {},
      link: function(scope, element, attrs) {
        scope.pending = 0;

        scope.$on('REQUEST_START', function() {
            scope.pending+=1;
        });
        scope.$on('REQUEST_END', function() {
            scope.pending-=1;
        });
      }
    };
//Creación de Alertas
}]).directive("saul-alerta", [function() {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "../bundles/directives/alerta/alerta.tpl.html",
        scope: {
            type: "@",
            title: "@",
            content: "@",
            close: "&"
        }
    };
}]).factory("dsJqueryUtils", ["$http",
function ($http) {
    var publico = {};

    publico.print = function (url, send, config) {
        var promise;
        config = angular.extend({
            method: 'get',
            url: url
        }, config);
        send = config.method === 'get'? {params: send}: {data: send};
        angular.extend(config, send);
        promise = $http(config);
        promise.processing = true;

        promise.success(function (html) {
            var frame = $("#frame-ajax")[0],
                r = (frame.contentWindow || frame.contentDocument);
            r.document.body.innerHTML = html;
            var images = r.document.getElementsByTagName('img'),
                imagesLength = images.length,
                imagesCount = 0,
                loadCallback = function () {
                    imagesCount++;
                    if (imagesLength == imagesCount) {
                        r.print();
                    }
                 };
            if (imagesLength) {
                $(images).on("load", loadCallback)
                         .on("error", loadCallback);
            } else {
                r.print();
            }
        })['finally'](function () {
            promise.processing = false;
        });
        return promise;
    }

    publico.goTop = function () {
        $("html, body").animate({
            scrollTop: 0
        }, "slow", "swing");
    }

    return publico;
}]).directive('uppercaseOnly', [ 
  function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        element.on('keypress', function(e) {
          var char = e.char || String.fromCharCode(e.charCode);
          if (!/^[A-Z0-9ÑÁÉÍÓÚ]$/i.test(char)) {
            e.preventDefault();
            return false;
          }
        });

        function parser(value) {
          if (ctrl.$isEmpty(value)) {
            return value;
          }
          var formatedValue = value.toUpperCase();
          if (ctrl.$viewValue !== formatedValue) {
            ctrl.$setViewValue(formatedValue);
            ctrl.$render();
          }
          return formatedValue;
        }

        function formatter(value) {
          if (ctrl.$isEmpty(value)) {
            return value;
          }
          return value.toUpperCase();
        }

        ctrl.$formatters.push(formatter);
        ctrl.$parsers.push(parser);
      }
    };
  }
]).run(['$rootScope', function($rootScope) {
    $rootScope.iniciarEspera = function() {
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();
    };
    $rootScope.finalizarEspera = function() {
        $(".overlap_espera").fadeOut(500, "linear");
        $(".overlap_espera_1").fadeOut(500, "linear");
    };
}]);
