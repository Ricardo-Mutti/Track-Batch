angular.module('BowlApp', [
    'ngRoute',
    'satellizer',
    'LocalStorageModule',
    'angular.aws.s3',
    'angular-md5',
    'BowlApp.directives',
    'BowlApp.controllers',
    'BowlApp.services'
]).
config(['$routeProvider', '$locationProvider', '$authProvider', function($routeProvider, $locationProvider, $authProvider) {
    // Satellizer configuration that specifies which API
    // route the JWT should be retrieved from
    $authProvider.loginUrl = '/api/login'; //end point do login

    $routeProvider.
    when('/index', {
        templateUrl: 'index.html',
        controller: 'LoginController',
        controllerAs: 'login'
    }).
    when('/lista', {
        templateUrl: 'lista.html',
        controller: 'ListaController',
        controllerAs: 'lista'
    }).
    when('/novo_video', {
        templateUrl: 'novo_video.html',
        controller: 'NovoVideoController',
        controllerAs: 'nvideo'
    }).
    when('/editar_video', {
        templateUrl: 'novo_video.html',
        controller: 'NovoVideoController',
        controllerAs: 'nvideo',
        directives: 'datepicker'
    }).
    when('/adicionar_categoria', {
        templateUrl: 'adicionar_categoria.html',
        controller: 'AdicionarCategoriaController',
        controllerAs: 'addcategoria',
        directives: 'datepicker'
    }).
    otherwise({
        redirectTo: '/index'
    });
    $locationProvider.html5Mode(true);
}]);
