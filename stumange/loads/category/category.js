var app = angular.module("app.category",["ngRoute"]);
app.config(function($routeProvider){
	$routeProvider.when("/category",{
		templateUrl:"loads/category/category.html",
		controller:"categoryController"
	});
});

app.controller("categoryController",function($scope,modalService){
	$scope.data={
		categorys : $scope.$parent.categorys

	}

});
