/**
 *"$schema": "http://json-schema.org/draft-04/schema#",
 "title": "idbp_schema",
 "description": "Intellidox dashboard profile schema",
 "type": "object",
 * @type {{type: string, properties: {id: {description: string, type: string}, hideDashboardMenu: {description: string, type: string}, titleCenter: {description: string, type: string, properties: {label: {description: string, type: string}, text: {description: string, type: string}}}}, required: string[]}}
 */
var schema = {
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
                "type": "number"
            },
            "text": {
                "description": "",
                "type": "string"
            }
        }
    }
};
angular.module("MyApp").controller("startValidation", function ($scope) {

    $scope.clearFields = function () {
        $scope.schemaText = "";
        $scope.jsonText = "";
        $scope.result = "";
        $scope.valid = "";
        $scope.outputText = "";
    };

    /**
     * Function where schema is selected.
     */
    $scope.assignSchemaText = function () {
        $scope.selectedSchema = $scope.selectSchema(null);
        $scope.schemaText = angular.toJson($scope.selectedSchema, [pretty = true]);
    };

    $scope.selectSchema = function (newSchema) {
        return newSchema == null ? schema : newSchema;
    };
    /**
     * Input -> JSON text from input table
     * Convert to JSON object.
     * @param input
     */
    $scope.setJsonValidation = function () {
        try {
            var obj = JSON.parse($scope.jsonText);
        } catch (e) {
            $scope.result = "";
            $scope.outputText = "Input is not valid JSON. Please check your input.";
            throw new Error($scope.outputText);
        }
        $scope.jsonInput = obj != null ? obj : console.log("Error: Input JSON not loaded correctly.");
        try {
            var schemaObj = JSON.parse($scope.schemaText);
        } catch (e) {
            $scope.result = "";
            $scope.outputText = "Schema is not valid JSON. Please check your schema."
            throw new Error($scope.outputText);
        }
        $scope.schemaInput = schemaObj != null ? schemaObj : console.log("Error: JSON Schema not loaded correctly.");
    };
    /**
     * JSV JSON schema validation
     */
    $scope.validatorResult = function () {
        try {
            $scope.result = "";//clear result before initialization
            var JSV = require("JSV").JSV;
            var env = JSV.createEnvironment();
            var report = env.validate($scope.jsonInput, $scope.schemaInput);
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
        $scope.valid = tv4.validate($scope.jsonInput, $scope.schemaInput);
        var check = tv4.validateMultiple($scope.jsonInput, $scope.schemaInput);
        $scope.result = check;
        $scope.outputText = $scope.valid ? "JSON input is valid with the given schema." : "For the given schema, JSON input is NOT correctly implemented: ";
    };
});