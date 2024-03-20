document.addEventListener("DOMContentLoaded", function(){
    var submit_button = document.getElementById("submit-btn-id");
    submit_button.addEventListener('click', addition_of_operands);

    async function addition_of_operands(event){
        event.preventDefault();

        var first_operand_binary = document.getElementById("op-1-bin-id").value;
        //var first_operand_exponent = 0;
        var first_operand_exponent_string = document.getElementById("op-1-ex-id").value;
        var first_operand_exponent = parseInt(first_operand_exponent_string);
        var second_operand_binary = document.getElementById("op-2-bin-id").value;
        //var second_operand_exponent = 0;
        var second_operand_exponent_string = document.getElementById("op-2-ex-id").value;
        var second_operand_exponent = parseInt(second_operand_exponent_string);
        var rounding_option = document.querySelector('input[name="rounding-option"]:checked').value;
        var number_digits_supported = document.getElementById("num-dig-sup-id").value;

        //remove these console logs before submission/deployment
        console.log("first operand binary string: " + first_operand_binary);
        console.log("first operand exponent: " + first_operand_exponent);
        console.log("second operand binary string: " + second_operand_binary);
        console.log("second operand exponent: " + second_operand_exponent);
        console.log("selected rounding option: " + rounding_option);
        console.log("number of digits supported: " + number_digits_supported);

        //Initial Normalization
        
        //normalization of both operands
        var first_operand_length = first_operand_binary.length;
        var first_op_decimal_pos = first_operand_binary.indexOf(".");
        var second_operand_length = second_operand_binary.length;
        var second_op_decimal_pos = second_operand_binary.indexOf(".");
        //console.log("first operand length: " + first_operand_length);

        if(first_op_decimal_pos !== 1){
            var temp_bin = first_operand_binary.replace(".", "");
            var one_f = temp_bin.substring(0, 1);
            var the_rest = temp_bin.substring(1);
            first_operand_binary = one_f + "." + the_rest;
            // first_operand_exponent = first_op_decimal_pos - 1;
            first_operand_exponent = first_operand_exponent + (first_op_decimal_pos - 1);
            console.log("first operand after normalization: " + first_operand_binary);
            console.log("first operand after normalization exponent: " + first_operand_exponent);
        }
        if(second_op_decimal_pos !== 1){
            var temp_bin = second_operand_binary.replace(".", "");
            var one_f = temp_bin.substring(0, 1);
            var the_rest = temp_bin.substring(1);
            second_operand_binary = one_f + "." + the_rest;
            second_operand_exponent = second_operand_exponent + (second_op_decimal_pos - 1);
            // second_operand_exponent = second_op_decimal_pos - 1;
            console.log("second operand after normalization: " + second_operand_binary);
            console.log("second operand after normalization exponent: " + second_operand_exponent);
        }
        
        if(first_operand_exponent > second_operand_exponent){
            var temp_exponent = second_operand_exponent;
            for(var i = second_operand_exponent; i < first_operand_exponent; i++){
                second_operand_binary = "0" + second_operand_binary;
                second_operand_binary = second_operand_binary.slice(0, -1);
                temp_exponent += 1;
            }
            second_operand_exponent = temp_exponent;
            var temp_bin = second_operand_binary.replace(".", "");
            var one_f = temp_bin.substring(0, 1);
            var the_rest = temp_bin.substring(1);
            second_operand_binary = one_f + "." + the_rest;
            console.log("second operand after normalization: " + second_operand_binary);
            console.log("second operand after normalization exponent: " + second_operand_exponent);
        }else if(first_operand_exponent < second_operand_exponent){
            var temp_exponent = first_operand_exponent;
            for(var i = first_operand_exponent; i < second_operand_exponent; i++){
                first_operand_binary = "0" + first_operand_binary;
                first_operand_binary = first_operand_binary.slice(0, -1);
                temp_exponent += 1;
            }
            first_operand_exponent = temp_exponent;
            var temp_bin = first_operand_binary.replace(".", "");
            var one_f = temp_bin.substring(0, 1);
            var the_rest = temp_bin.substring(1);
            first_operand_binary = one_f + "." + the_rest;
            console.log("first operand after normalization: " + first_operand_binary);
            console.log("first operand after normalization exponent: " + first_operand_exponent);
        }
        

        //proceed with GRS or rounding
    }

});

//notes ni arevalo please dont delete unless ipapasa na or deployment

//padding of zeros
// if(first_operand_length < parseInt(number_digits_supported)+1){
//     for(var i = first_operand_length; i < parseInt(number_digits_supported)+1; i++){
//         first_operand_binary += "0";
//     }
// }

