//allsubject里面的 控制器   服务
var app1=angular.module("app.allSubject",[]);
app1.controller("allSubCon",function ($scope,allSubSer,$routeParams,findSubjects,$location) {

    allSubSer.deparment(function (data) {
       $scope.deparments=data
    })

    allSubSer.level(function (data) {
        $scope.levels=data;
    })


    allSubSer.topic(function (data) {
        $scope.topics=data;
    })

    allSubSer.type(function (data) {
        $scope.types=data;
    })

    //根据题干查找

    $scope.findSub=function () {
        allSubSer.stemSub($scope.val,function (data) {
            $scope.subjects=data
        })
    }


//$routeparams  获取到的是浏览器地址中的参数值
    $scope.params=$routeParams
    var tiaojian={};
    for(var index in $routeParams){
        var val=$routeParams[index];
        if(val!=0) {
            switch (index) {
                case "a":
                    tiaojian["subject.department.id"] =val
                    break;
                case "b":
                    tiaojian["subject.subjectLevel.id"] = val
                    break;
                case "c":
                    tiaojian["subject.topic.id"] = val;
                    break;
                case "d":
                    tiaojian["subject.subjectType.id"] = val;
                    break;
            }
        }
    }
    $scope.val=""
    $scope.tiaojian=tiaojian;

    findSubjects.ajax(tiaojian,function (data) {
        $scope.subjects=data
        $scope.length=data.length;
        data.forEach(function(sub,index){
            if(sub.subjectType!=null){
                if(sub.subjectType.id!=3){
                    var arrchoice=[]
                    sub.choices.forEach(function (choice,index) {
                        choice.no=allSubSer.setNO(index)
                        if(choice.correct){
                            arrchoice.push(choice.no)
                        }
                    })
                    $scope.choice= arrchoice.join(",")
                }
            }


        })

    })
    $scope.subject={
        type:1,
        level:1,
        deparment:1,
        topic:1,
        stem:"",
        answer:"",
        analysis:"",
       contents:[],
        correct:[]
    }
    //保存
    $scope.saveSubject=function () {
        findSubjects.saveSubject($scope.subject)
        $location.path("/addOne")
    }
    //保存并返回
    $scope.saveBack=function () {
        findSubjects.saveSubject($scope.subject);
        $location.path("/allSubjects/a/0/b/0/c/0/d/0")
    }
})
app1.service("allSubSer",function ($http) {
    this.deparment=function (fun) {
        $http.get("data/departmentes.json").success(function (data) {
            fun(data)
        })
    };
    this.level=function (fun) {
        $http.get("data/levels.json").success(function (data) {
            fun(data)
        })
    };
    this.type=function (fun) {
        $http.get("data/types.json").success(function (data) {
            fun(data)
        })
    };
    this.topic=function (fun) {
        $http.get("data/topics.json").success(function (data) {
            fun(data)
        })
    }

    this.setNO=function (index) {
        return index==0?"A":(index==1?"B":(index==2?"C":"D"))
    };
    ///
    this.stemSub=function (val,fun) {
        $http.get("aa.action",{stem:val}).success(function (data) {
            fun(data)
        })
    }
})
app1.provider("findSubjects",function () {
    this.$get=function ($http,$httpParamSerializer) {
        return{
            ajax:function (tiaojian,fun) {
            $http.get("data/subjects.json",{
                params:tiaojian
            }).success(function (data) {
                fun(data)
            })
        },
            saveSubject:function (obj) {
                var subject={}
                for(var index in obj){
                    var val=obj[index]
                    if(val){
                    switch(index){
                        case "type":
                            subject["subject.subjectType.id"]=val
                            break;
                        case "level":
                            subject["subject.subjectLevel.id"]=val
                            break;
                        case "topic":
                            subject["subject.topic.id"]=val
                            break;
                        case "stem":
                            subject["subject.stem"]=val
                            break;
                        case "answer":
                            subject["subject.answer"]=val;
                            break;
                        case "analysis":
                            subject["subject.analysis"]=val
                            break;
                        case "contents":
                            subject["choiceContent"]=val;
                            break;
                        case "correct":
                            subject["choiceCorrect"]=val;
                            break;
                    }
                    }
                }

                var subject=$httpParamSerializer(subject)
                console.log(subject)
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",subject,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"}
                }).success(function (data) {
                    alert(data)

                })
            },
            delSubject:function (id,fun) {
                //console.log(id)
                $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                    params:{
                        "subject.id":id
                    }
                }).success(function (data) {
                    fun(data)

                })
            },
            checkSubject:function (id,pass,fun) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{params:{
                    "subject.id":id,
                    "subject.checkState":pass
                }}).success(function (data) {
                    fun(data)
                })
            }
        }
    }
})
app1.controller("delsubject",function ($location,$routeParams,findSubjects) {
    var id=$routeParams.id;
    findSubjects.delSubject(id,function (data) {
            alert(data)
        $location.path("/allSubjects/a/0/b/0/c/0/d/0")
   })
})
app1.controller("checkController",function ($location,$routeParams,findSubjects) {
    var id=$routeParams.id
    console.log(id)
    findSubjects.checkSubject(id,"通过",function (data) {
        alert(data);
        $location.path("/allSubjects/a/0/b/0/c/0/d/0")
    })

})
app1.controller("checkControllerTwo",function ($location,$routeParams,findSubjects) {
    var id=$routeParams.id
    findSubjects.checkSubject(id,"不通过",function (data) {
        alert(data);
        $location.path("/allSubjects/a/0/b/0/c/0/d/0")
    })

})
//用来配置单个添加题目的路径
app1.config(function ($routeProvider) {
    $routeProvider.when("/addOne",{
        templateUrl:"tpl/addone.html",
        controller:"allSubCon"
    }).when("/deleteSubject/id/:id",{
        templateUrl:"tpl/allsubject.html",
        controller:"delsubject"
    }).when("/checkSubject/id/:id",{
        templateUrl:"tpl/allsubject.html",
        controller:"checkController"
    }).when("/checkSubjectTwo/id/:id",{
        templateUrl:"tpl/allsubject.html",
        controller:"checkControllerTwo"
    })
})
//-------------定义一个过来用来筛选相应department方向的知识点
app1.filter("findTopic",function(){
    return function(topics,depId){
  if(topics){
     var arr= topics.filter(function(topic){
       return topic.department.id==depId;
      })

  }

  return arr;
    }
})

///定义一个指令帮我们绑定一个事件   能够拿到一个element并可以拿到里面的checked属性
app1.directive("getInput",function () {
    return{
        link:function (scope,element) {
            scope.subject.correct=[false,false,false,false];
           $(element).on("change",function () {
               if($(this).attr("name")=="radio"){
                   var id=$(this).val()
                 for(i=0;i<4;i++){
                       if(id==i){
                           scope.subject.correct[i]=true
                       }else{
                           scope.subject.correct[i]=false
                       }
                       scope.$digest()
                 }
               }else if($(this).attr("name")=="check"){
                   var id=$(this).val()
                   if($(this).prop("checked")){

                       for(i=0;i<4;i++){
                           if(id==i){
                               scope.subject.correct[i]=true;
                           }

                       }
                       scope.$digest()
                   }else{
                       for(i=0;i<4;i++){
                           if(id==i){
                               scope.subject.correct[i]=false;
                           }

                       }

                   }
                   scope.$digest()
               }

           })
        }
    }
})
//scope.$digest()强制更新scope里的内容
//定义一个指令清除上次所选内容
app1.directive("clearnHistory",function () {
    return{
        link:function (scope,element) {
            element.on("change",function () {
                    scope.subject.stem=""
                    scope.subject.answer=""
                    scope.subject.analysis=""
                    scope.subject.contents=[]
                    scope.subject.correct=[false,false,false,false];
                    scope.$digest()
            })
        }
    }
})