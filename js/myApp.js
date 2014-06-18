angular.module("MyApp", [], function ($rootScopeProvider) {
    $rootScopeProvider.digestTtl(Infinity); // look that up
})
    .directive('treeview', function ($compile)
    {
        return {
            restrict: "E",
            templateUrl: 'value.html',
            compile: function(tElement) {
                var childData = tElement.contents().remove();
                var compiledContents;
                return function(scope, iElement) {
                    if(!compiledContents) {
                        compiledContents = $compile(childData);
                    }
                    compiledContents(scope, function(clone) {
                        iElement.append(clone);
                    });
                };

            }
        }
    })

    .controller('MyAppCtrl', function ($scope, $http) {
        var urlRegEx = /^https?:\/\//;
        $scope.type = function (thing) {
            switch (typeof thing) {
                case "object":
                    if (Object.prototype.toString.call(thing) === "[object Array]") {
                        return 'array';
                    } else if (thing == null) {
                        return 'null';
                    } else {
                        return 'obj';
                    }
                case "string":
                    if (urlRegEx.test(thing)) {
                        return "url";
                    } else {
                        return "string";
                    }
                default:
                    return typeof thing;
            }
        };

        // makes user input something is string fields
        $scope.checkStr = function (obj) {
            if (obj.length == 0) {
                alert("Please enter a valid string");
                return false;
            } else {
                return true;
            }
        };

        // decides which function to call to assign data
        $scope.assignData = function (conditional) {
            if (angular.isString(conditional)) {
                $scope.assignNewJson(conditional);

            } else if (angular.isNumber(conditional)) {
                $scope.assignSampleJson();
            } else {
                $scope.assignNullData();
            }
        };


        // Assigns User JSON input
        $scope.assignNewJson = function (text) {
            $scope.assignNullData();
            $scope.hide = !$scope.hide;

            var obj = angular.copy(text);
            $scope.value = JSON.parse(obj);
            $scope.present = true;
        };

        // Provides User sample Json
        $scope.assignSampleJson = function () {
            $http.get("../assets/data.json").then(function (response) {
                $scope.jsonText = angular.toJson(response.data, [pretty = true]);
            });
        };

        // Clears tree and text area
        $scope.assignNullData = function () {
            $scope.jsonText = "";
            $scope.value = "";
            $scope.present = false;

        };

        // Converts tree to newJson based on Tree View edits
        $scope.assignNewJsonText = function (text) {
            $scope.assignNullData();
            var obj = angular.copy(text);
            $scope.jsonText = angular.toJson(obj, [pretty = true]);
            $scope.hide = !$scope.hide;
        };

        // Converts string value from select box to equiv bool value
        $scope.toBoolean = function (value) {
            if (value == "true") {
                return true;
            } else {
                return false;
            }
        }

    });