angular.module("MyApp", [])
    .controller('MyAppCtrl', ['$scope', '$http', function ($scope, $http) {
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
        $scope.assignData = function (input) {
            if (angular.isString(input)) {
                $scope.assignNewJson(input);

            } else if (angular.isNumber(input)) {
                $scope.assignSampleJson();
            } else {
                $scope.assignNullData();
            }
        };


        // Assigns User JSON input
        $scope.assignNewJson = function (text) {
            $scope.value = JSON.parse(text);
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

        // Converts jsonText to newJson based on Tree View edits
        $scope.assignNewJsonText = function (text) {
            $scope.jsonText = angular.toJson(text, [pretty = true]);
            console.log(text);
        };

        // Converts string value from select box to equiv bool value
        $scope.toBoolean = function (value) {
            if (value == "true") {
                return true;
            } else {
                return false;
            }
        }

    }]);