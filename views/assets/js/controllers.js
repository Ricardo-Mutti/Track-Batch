'use strict';

/* Controllers */

angular.module('BowlApp.controllers', []).
controller('LoginController', ['$scope', '$auth', 'md5', 'localStorageService', '$window', function LoginController($scope, $auth, md5, localStorageService, $window) {
    $scope.login = {};
    $scope.invalidLogin = false;

    $scope.getUser = function(login) {
        if (login.username != null && login.password != null) {
            $scope.login = login;

            var credentials = {};
            credentials.username = login.username;
            credentials.password = md5.createHash(login.password || '');

            // Use Satellizer's $auth service to login
            $auth.login(credentials)
                .then(function(data) {
                    $scope.invalidLogin = false;
                    if (data.data.response.usuario === undefined) {
                        //Tratar resposta de erro de login
                    } else if (data.data.success) {
                        var usuario = data.data.response.usuario;
                        localStorageService.set('bwuserId', usuario._id);
                        localStorageService.set('bwemail', usuario.email);
                        localStorageService.set('bwfirst_name', usuario.first_name);
                        localStorageService.set('bwlast_name', usuario.last_name);
                        localStorageService.set('bwusername', usuario.username);
                        localStorageService.set('bwfollowers', usuario.followers);
                        localStorageService.set('bwfollowing', usuario.following);
                        localStorageService.set('bwlikes', usuario.likes);
                        localStorageService.set('bwposts', usuario.posts);
                        if (data.data.response.admin) {
                            $window.location.href = 'lista'
                        }
                    }
                })
                .catch(function(err) {
                    // $window.alert("Username or password is incorrect.");
                    $scope.invalidLogin = true;
                });
        }
    }
}]).
controller('ListaController', ['$scope', 'WebServices', 'localStorageService', '$window', function ListaController($scope, WebServices, localStorageService, $window) {
    var view = this;
    var userId = localStorageService.get('bwuserId');
    view.categories = {};
    localStorageService.set('bwvideo', {});

    if (userId === null || userId === undefined) {
        $window.location.href = 'index';
        return;
    }

    WebServices.getFeed(userId)
        .success(function(data) {
            if (!data.success) {

            } else if (data.success) {
                view.feed = data.response.feed;
                WebServices.getCategories(userId)
                    .success(function(data) {
                        if (!data.success) {

                        } else if (data.success) {
                            view.categories = data.response.categorias;
                            for (var i = 0; i < view.feed.length; i++) {
                                view.feed[i].categories_name = [];
                                for (var j = 0; j < view.categories.length; j++) {
                                    for (var k = 0; k < view.feed[i].categories.length; k++) {
                                        if (view.categories[j]._id === view.feed[i].categories[k]) {
                                            view.feed[i].categories_name.push(view.categories[j].name);
                                        }
                                    }
                                }
                            }
                        }
                    })
                    .error(function(err) {
                        console.log(err);
                    })
            }
        })
        .error(function(err) {
            console.log(err);
        })

    $scope.deletePost = function(video) {
        if (video.list != null && video.list != undefined) {
            WebServices.deletePost(video.list._id)
                .success(function(data) {
                    if (!data.success) {

                    } else if (data.success) {
                        WebServices.getFeed(userId)
                            .success(function(data) {
                                if (!data.success) {

                                } else if (data.success) {
                                    view.feed = data.response.feed;
                                }
                            })
                            .error(function(err) {
                                console.log(err);
                            })

                    }
                })
                .error(function(err) {
                    console.log(err);
                })
        }
    }

    $scope.update = function(video) {
        if (video.list != null && video.list != undefined) {
            localStorageService.set('bwvideo', video.list);
            $window.location.href = 'editar_video';
        }
    }

    $scope.logout = function() {
        localStorageService.set('bwuserId', undefined);
        localStorageService.set('bwemail', undefined);
        localStorageService.set('bwfirst_name', undefined);
        localStorageService.set('bwlast_name', undefined);
        localStorageService.set('bwusername', undefined);
        localStorageService.set('bwfollowers', undefined);
        localStorageService.set('bwfollowing', undefined);
        localStorageService.set('bwlikes', undefined);
        localStorageService.set('bwposts', undefined);

        $window.location.href = 'index'
    }
}]).
controller('NovoVideoController', ['$scope', '$filter', 'WebServices', 'localStorageService', '$window', '$element', function NovoVideoController($scope, $filter, WebServices, localStorageService, $window, $element) {
    $scope.http = 'http://';
    $scope.source = [{ nome: 'Youtube', value: 'Youtube' }, { nome: 'Vimeo', value: 'Vimeo' }];
    $scope.support = false;
    var dateFromStart = new Date();
    var userId = localStorageService.get('bwuserId');
    var view = this;

    if (userId === null || userId === undefined) {
        $window.location.href = 'index';
        return;
    }


    $scope.editarVideo = localStorageService.get('bwvideo');
    if ($scope.editarVideo != null && $scope.editarVideo != undefined && Object.keys($scope.editarVideo).length > 0) {
        $scope.video = $scope.editarVideo;
        console.log($scope.video.postDate);
        $scope.video.postDate = new Date($scope.video.postDate);
    } else {
        // currentDate = $filter('datetime')(currentDate, 'dd/MM/yyyy HH:mm');
        $scope.video = { source: $scope.source[0].value, postDate: dateFromStart };
    }

    WebServices.getCategories(userId)
        .success(function(data) {
            if (!data.success) {

            } else if (data.success) {
                $scope.categories = data.response.categorias;
            }
        })
        .error(function(err) {
            console.log(err);
        })

    $scope.addVideo = function(video) {
        var currentDate = new Date();
        var element = document.getElementById('formWithNoSupport');
        $scope.support = element.value;
        if (video.videoUrl != null && video.source != null && video.source != '?' && video.nome != null && video.descricao != null && video.categories != null) {
            // video.postDate = $filter('date')(video.postDate, "yyyy-MM-dd") + 'T00:00:00.000Z';
            // video.postDate = new Date('2015-11-13T06:16:11.399Z');
            // if (video.postDate === undefined && video.postDate === null) {

            // }
            // console.log(video.postDate);
            if ($scope.support === true) {
                var datePicker = document.getElementById('datepicker');
                var date = new Date(datePicker.value);
                if (date != null && date.getTime() != NaN && !isNaN(date)) {
                    video.postDate = date;
                } else {
                    return;
                }
            } else {
                if (video.postDate === null || video.postDate === undefined) {
                    return;
                }
            }
            video.postDate.setHours(currentDate.getHours());
            video.postDate.setMinutes(currentDate.getMinutes());
            // console.log(video.postDate);
            // console.log(video);

            if (video.source === 'Vimeo') {
                WebServices.getVimeoThumb(video.videoUrl)
                    .success(function(data) {
                        video.thumbUrl = data[0]['thumbnail_large'];
                        if ($scope.editarVideo != null && $scope.editarVideo != undefined) {
                            video._id = $scope.editarVideo._id;
                            view.postVideo(video, true);
                        } else {
                            view.postVideo(video, false);
                        }
                    })
                    .error(function(err) {
                        console.log(err);
                    })
            } else if (video.source === 'Youtube') {
                console.log("Youtube");
                video.thumbUrl = 'http://img.youtube.com/vi/' + video.videoUrl + '/0.jpg';
                if ($scope.editarVideo != null && $scope.editarVideo != undefined) {
                    video._id = $scope.editarVideo._id;
                    view.postVideo(video, true);
                } else {
                    view.postVideo(video, false);
                }
            } else {
                console.log("Source with error");
            }

        } else {
            console.log('Preencha todos os campos.');
        }
    }

    view.postVideo = function(video, isEdit) {
        // console.log(video);
        if (isEdit === true) {
            WebServices.editVideo(video)
                .success(function(data) {
                    if ($scope.support === true) {
                        var date = new Date(data.response.post.postDate);
                        date.setDate(date.getDate() + 1);
                        $scope.video.postDate = date;
                        date = $filter('date')(date, "yyyy-MM-dd") + 'T00:00:00.000Z';
                        data.response.post.postDate = date;
                    }
                    if (!data.success) {

                    } else if (data.success) {
                        $window.history.back();
                    }
                })
                .error(function(err) {
                    console.log(err);
                })
        } else {
            WebServices.postVideo(video)
                .success(function(data) {
                    if ($scope.support === true) {
                        var date = new Date(data.response.post.postDate);
                        date.setDate(date.getDate() + 1);
                        $scope.video.postDate = date;
                        date = $filter('date')(date, "yyyy-MM-dd") + 'T00:00:00.000Z';
                        data.response.post.postDate = date;
                    }
                    if (!data.success) {

                    } else if (data.success) {
                        $window.history.back();
                    }
                })
                .error(function(err) {
                    console.log(err);
                })
        }
    }

    $scope.back = function() {
        $window.history.back();
    }
}]).
controller('AdicionarCategoriaController', ['$scope', 'WebServices', 'localStorageService', '$window', function AdicionarCategoriaController($scope, WebServices, localStorageService, $window) {
    $scope.category = {};
    var userId = localStorageService.get('bwuserId');

    if (userId === null || userId === undefined) {
        $window.location.href = 'index';
        return;
    }


    WebServices.getCategories(userId)
        .success(function(data) {
            if (!data.success) {

            } else if (data.success) {
                $scope.categories = data.response.categorias;
            }
        })
        .error(function(err) {
            console.log(err);
        })

    $scope.remove = function(category) {
        WebServices.removeCategorie(category.list._id)
            .success(function(data) {
                if (!data.success) {

                } else if (data.success) {
                    WebServices.getCategories(userId)
                        .success(function(data) {
                            if (!data.success) {

                            } else if (data.success) {
                                $scope.categories = data.response.categorias;
                            }
                        })
                        .error(function(err) {
                            console.log(err);
                        })
                }
            })
            .error(function(err) {
                console.log(err);
            })
    }

    $scope.addCategory = function(category) {
        if (category != null && category != undefined) {
            WebServices.addCategorie(category.name)
                .success(function(data) {
                    $scope.category = {};
                    if (!data.success) {

                    } else if (data.success) {
                        WebServices.getCategories(userId)
                            .success(function(data) {
                                if (!data.success) {

                                } else if (data.success) {
                                    $scope.categories = data.response.categorias;
                                }
                            })
                            .error(function(err) {
                                console.log(err);
                            })
                    }
                })
                .error(function(err) {
                    console.log(err);
                })
        }
    }

    $scope.back = function() {
        $window.history.back();
    }
}]);
