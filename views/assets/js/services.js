'use strict';

angular.module('BowlApp.services', [])

// each function returns a promise object 
.factory('WebServices', ['$http', function($http) {
    var WebServices = {
        getFeed: getFeed,
        postVideo: postVideo,
        editVideo: editVideo,
        deletePost: deletePost,
        getCategories: getCategories,
        addCategorie: addCategorie,
        removeCategorie: removeCategorie,
        getVimeoThumb: getVimeoThumb
    };
    
    function getFeed(id_user) {
        return $http.post('/api/getFeed', { id_user: id_user })
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                window.ref("");
            });
    }

    function postVideo(video) {
        return $http.post('/api/postVideo', { videoUrl: video.videoUrl, source: video.source, thumbUrl: video.thumbUrl, nome: video.nome, descricao: video.descricao, categories: video.categories, postDate: video.postDate })
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                window.ref("");
            });
    }
    
    function editVideo(video) {
        return $http.post('/api/postVideo', { _id: video._id, videoUrl: video.videoUrl, source: video.source, thumbUrl: video.thumbUrl, nome: video.nome, descricao: video.descricao, categories: video.categories, postDate: video.postDate })
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                window.ref("");
            });
    }

    function deletePost(post_id) {
        return $http.delete('/api/deletePost?post_id=' + post_id)
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                window.ref("");
            });
    }
    
    function getCategories(user_id) {
        return $http.get('/api/get-categories?user_id=' + user_id)
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                window.ref("");
            });
    }
    
    function addCategorie(name) {
        return $http.post('/api/add-categorie', {name: name})
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                window.ref("");
            });
    }
    
    function removeCategorie(categorie_id) {
         return $http.delete('/api/remove-categorie?categorie_id=' + categorie_id)
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                window.ref("");
            });
    }

    function getVimeoThumb(vimeo_code) {
         return $http.jsonp('http://vimeo.com/api/v2/video/' + vimeo_code + '.json?callback=JSON_CALLBACK')
            .success(function(data) {
                return data;
            })
            .error(function(err) {
                window.ref("");
            });
    }

    return WebServices;

}]);
