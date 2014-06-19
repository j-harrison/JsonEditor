var sampleSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "idbp_schema",
    "description": "Intellidox dashboard profile schema",
    "type": "object",
    "properties": {
        "id": {
            "description": "The unique identifier for a schema",
            "type": "string"
        },
        "hideDashboardMenu": {
            "description": "True to show in list of dashboards",
            "type": "boolean"
        },
        "titleCenter": {
            "description": "",
            "type": "object",
            "properties": {
                "label": {
                    "description": " ",
                    "type": "string"
                },
                "text": {
                    "description": "",
                    "type": "string"
                }
            }
        }
    }
};
angular.module("MyApp")
    .constant("defaultBackground", "bg-warning")
    .constant("invalidBackground", "bg-danger")
    .constant("validBackground", "bg-success")
    .controller("startValidation", function ($scope, defaultBackground, invalidBackground, validBackground) {
        $scope.clearFields = function () {
            $scope.selectedSchemaText = "";
            $scope.jsonText = "";
            $scope.result = "";
            $scope.inputValid = $scope.schemaValid = null;
            $scope.outputText = "";
        };

        /**
         * newSchema can be any JSON schema. Default value will be the sample schema
         * @param newSchema
         */
        $scope.setSchema = function (newSchema) {
            $scope.selectedSchema = newSchema == null ? sampleSchema : newSchema;
            $scope.selectedSchemaText = angular.toJson($scope.selectedSchema, [pretty = true]);
        };

        /**
         * newInput is model that holds the JSON input from user. Default will be set to sample input.
         * @param newInput
         */
        $scope.setInput = function (newInput) {

            if (newInput != null) {
                $scope.selectedInput = newInput;
                $scope.jsonText = angular.toJson($scope.selectedInput, [pretty = true]);
            }
            else {
                $scope.assignSampleJson();
            }
        };

        /**
         * Convert JSON texts (both schema and input) into JSON objects. $scope inherits texts.
         */
        $scope.setJsonValidation = function () {
            try {
                var obj = JSON.parse($scope.jsonText);
            } catch (e) {
                $scope.result = "";
                $scope.outputText = "Input is not valid JSON. Please check your input.";
                $scope.inputValid = false;
                throw new Error($scope.outputText);
            }
            $scope.selectedInput = obj != null ? obj : console.log("Error: Input JSON not loaded correctly.");

            try {
                var schemaObj = JSON.parse($scope.selectedSchemaText);
            } catch (e) {
                $scope.result = "";
                $scope.schemaValid = false;
                $scope.outputText = "Schema is not valid JSON. Please check your schema."
                throw new Error($scope.outputText);
            }
            $scope.schemaValid = true;
            $scope.selectedSchema = schemaObj != null ? schemaObj : console.log("Error: JSON Schema not loaded correctly.");
        };
        /**
         * JSV JSON schema validation
         */
        $scope.jsvValidation = function () {
            try {
                $scope.result = "";//clear result before initialization
                var JSV = require("JSV").JSV;
                var env = JSV.createEnvironment();
                var report = env.validate($scope.selectedInput, $scope.selectedSchema);
                // Check results
                if (report.errors.length) {
                    for (var x = 0; x < report.errors.length; ++x) {
                        $scope.result += "\nProblem: " +
                            report.errors[x].uri + "\nMessage:" +
                            report.errors[x].message +
                            "\nReported by:  " +
                            report.errors[x].schemaUri +
                            "\nAttribute:  " +
                            report.errors[x].attribute +
                            "\nDetails: " +
                            report.errors[x].details + "\n";
                    }
                } else {
                    $scope.result = "Input is valid!";
                }
            } catch (e) {
                $scope.result = "Error: " + e;
            }
        };

        /**
         * Tv5 JSON-Schema validation
         * Use json-schema draft v4
         */
        $scope.tv4Validation = function () {
            $scope.result = "";//clear result before initialization
            $scope.inputValid = tv4.validate($scope.selectedInput, $scope.selectedSchema);
            var check = tv4.validateMultiple($scope.selectedInput, $scope.selectedSchema);
            $scope.result = check;
            $scope.outputText = $scope.inputValid ? "JSON input is valid with the given schema." : "For the given schema, JSON input is NOT correctly implemented: ";
        };


        /**
         * Background color response is determined.
         * @param checkValid
         * @returns {string}
         */
        $scope.setBackground = function (checkValid) {
            var background = "";
            if (checkValid)
                background = validBackground;
            else if (checkValid == null)
                background = defaultBackground;
            else
                background = invalidBackground;
            return background;
        };

        $scope.getInputBackground = function(){
              return $scope.setBackground($scope.inputValid);
        };

        $scope.getSchemaBackground = function(){
            return $scope.setBackground($scope.schemaValid);
        };
    });