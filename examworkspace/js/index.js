//jQuery
$(function () {
    //左侧滑动栏
    $(".baseUI").find("ul").slideUp();
    $(".baseUI").on("click","li",function (event) {
        $(".baseUI").find("ul").slideUp();
         $(event.currentTarget).find("ul").slideDown()


    })

    $(".baseUI>li>ul>li").on("click",function () {
        $(".baseUI").find("li").removeClass("current");
       $(this).addClass("current")
    })


})
//angular
// var app=angular.module("my",["ngRoute","app.allSubject","app.manage"]);
// //var app=angualr.module("my",["ngRoute","app.allsubject","app.manage"])
// app.config(function ($routeProvider) {
//     $routeProvider.when("/addstu",{
//         templateUrl:"",
//         controller:allsubject
//        })
// })
    $location.path("/allSubjects/a/0/b/0/c/0/d/0")
})
app.config(function ($routeProvider) {
    $routeProvider.when("/allSubjects/a/:a/b/:b/c/:c/d/:d",{
        templateUrl:"tpl/allsubject.html",
        controller:"allSubCon"
    }).when("/manageSub",{
        templateUrl:"tpl/manageSub.html",
        controller:"manageSubCon"
    })
})
