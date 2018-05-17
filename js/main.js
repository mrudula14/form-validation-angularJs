var app = angular.module("mainApp",[])
app.controller("testCtrl", function($scope){
    $scope.validateFormData = 
        {
          "IsFormActive": true,
          "OnValidationSucceed": function(){
                       
                        alert("ValidationSucced")

          },
         "LstFields": [
            {
             "name":"Field 1",
              "ngModel": "fld1",
              "LstValidations": [
                {
                  "ValidationType": "Mandatory",
                  "ErrorFieldText": "Mandatory Field",
                  "IsActive": true,
                  "IsError": false
                }
              ]
            },
            {
            "name":"Field 2",
              "ngModel": "fld2",
              "LstValidations": [
                {
                  "ValidationType": "Mandatory",
                  "ErrorFieldText": "Mandatory Field",
                  "IsActive": true,
                  "IsError": false
                },
                 {
                  "ValidationType": "MinLength",
                  "ErrorFieldText": "Min Length: @MinLengthParam",
                  "IsActive": true,
                  "IsError": false,
                  "Params":[{
                    "MinLengthParam": 3
                  }]
                }
              ]
            }
          ]
        } 
})
app.directive('fieldValidation', function($window, $compile){
     return {
         restrict: 'A',
         require: 'ngModel',
         scope:{
              fdata:'=',
              ngModel: '=',
              fields: '='
         },
         link: function(scope, element, attrs, ngModel){
              scope.$watch(function(){
                        return ngModel.$viewValue;
                    }, 
                    function(newValue, oldValue){
                        
                        errorFound = false; // flag to check if error exist
                        errorText = [];  // collecting all error messages for particular field
                        angular.forEach(scope.fdata.LstValidations, function(item){
                            // checking for mandatory field
                            if(item.ValidationType==="Mandatory" && item.IsActive==true && newValue==""){
                                item.IsError = true;
                                errorFound =true;
                                errorText.push(item.ErrorFieldText);
                            }
                            
                            // checking Minlength of the field
                            if(item.ValidationType==="MinLength" && item.IsActive==true && newValue.length < 3 ){
                                item.IsError = true;
                                 errorFound = true;
                                 errorAcc =  item.ErrorFieldText; 
                                
                                // creating readable error message from template
                                for(var param of item.Params){
                                    for(var key in param){
                                        if(param.hasOwnProperty(key)){
                                           errorAcc = errorAcc.replace("@"+key, param[key]); 
                                        }
                                       
                                    }
                                    
                                
                                }
                                 errorText.push(errorAcc);
                            }
                        
                        }); // ends forEach
                     scope.fdata.errTxts = errorText;
                     scope.fdata.errBrdr = errorFound; // to apply color border depending on error exist
                    scope.fields.IsFormActive =true;
                    angular.forEach(scope.fields.LstFields,function(currentField){
                     scope.fields.IsFormActive = (!currentField.errBrdr) & scope.fields.IsFormActive; // 
                         
                    }); // Check for each fields on form to decide if its active 
                  
                     
                    }// Checking for each form
                );
         }
     }
     
})