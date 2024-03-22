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
    //[binary_string, exponent]
    tuple1 = ["", ""];
    tuple2 = ["", ""];

    function GRS(tuple1, tuple2, bitNum){
        var roundedTuple1 = roundGRS(tuple1, bitNum);
        var roundedTuple2 = roundGRS(tuple2, bitNum);
    
        return [roundedTuple1, roundedTuple2];
        
    }
    
    function roundGRS(tuple, bitnum){
        //binary string part
        var binStr = tuple[0];
        //exponent part
        var exp = tuple[1];
    
        var guard, round, sticky = 0
        var res = '';
    
        // >= required number of bits + grs bits, proceed
        if(binStr.length >= bitnum + 3){
    
            // //guard
            // guard = parseInt(binStr[bitnum + 1]);
    
            // //round
            // round = parent(binStr[bitnum + 2]);
    
            //sticky
            for(let i = bitnum + 2; i < binStr.length; i++){
                //if non-0, sticky = 1 but it's 0 by default
                if(binStr[i] == '1'){
                    sticky = 1;
                    break;
                } 
            }
            console.log(res);
            //get required bits + guard and round + sticky
            return res = binStr.substring(0, bitnum + 2).concat(sticky.toString());
        } else {
            console.log(res);
            return res = binStr;
        }
        
    }

    //OPERATION

    function addFloatingPointBinary(addend1, addend2) {
    // extracts binary str ad exp from tuples
    var binStr1 = addend1[0];
    var exp1 = addend1[1];
    var binStr2 = addend2[0];
    var exp2 = addend2[1];
        
    var maxExp = Math.max(exp1, exp2);

    // normalize binary strings to have the same exponent
    binStr1 = normalizeBinaryString(binStr1, exp1, maxExp);
    binStr2 = normalizeBinaryString(binStr2, exp2, maxExp);

    var sum = addBinaryStrings(binStr1, binStr2);

    // normalize the sum
    var expSum = maxExp;
    sum = normalizeBinaryString(sum, expSum, maxExp);

    return [sum, expSum];
    }

    // normalize binary string to a specific exponent
    function normalizeBinaryString(binStr, exp, targetExp) {
        if (exp === targetExp) {
            return binStr;
        } else {
            var diff = Math.abs(targetExp - exp);
            if (exp < targetExp) {
                for (var i = 0; i < diff; i++) {
                    binStr = "0" + binStr;
                }
            } else {
                binStr = binStr.slice(diff);
            }
            return binStr;
        }
    }
    
    //add two binary str
    function addBinaryStrings(binStr1, binStr2) {
        var sum = "";
        var carry = 0;
        var maxLength = Math.max(binStr1.length, binStr2.length);
    
        for (var i = 0; i < maxLength; i++) {
            var digit1 = i < binStr1.length ? parseInt(binStr1[binStr1.length - 1 - i]) : 0;
            var digit2 = i < binStr2.length ? parseInt(binStr2[binStr2.length - 1 - i]) : 0;
            var digitSum = digit1 + digit2 + carry;
            carry = Math.floor(digitSum / 2);
            sum = (digitSum % 2) + sum;
        }
    
        if (carry > 0) {
            sum = carry + sum;
        }
    
        return sum;
    }

    
    function RTN_TTE(tuple1, tuple2, bitNum){
        let roundedTuple1 = roundRTN_TTE(tuple1[0], bitNum);
        let roundedTuple2 = roundRTN_TTE(tuple2[0], bitNum);
        console.log(roundedTuple1);
        console.log(roundedTuple2);
        return[roundedTuple1, roundedTuple2];
    }

    function roundRTN_TTE(tuple, bitNum){
        let index1 = bitNum + 1;
        let index2 = bitNum + 2;
        let resultTuple = "";
        console.log(tuple[index1] + tuple[index2]);
        // 01 - round down
        if(tuple[index1] == '0' && tuple[index2] == '1'){
            resultTuple = tuple.substr(0,bitNum+1);
            return[resultTuple,bitNum];
        }

        // 10 - tie to even
        else if(tuple[index1] == '1' && tuple[index2] == '0'){
            resultTuple = tuple.substr(0,bitNum+1);
            return[resultTuple,bitNum];
        }

        // 11 - round up
        else if(tuple[index1] == '1' && tuple[index2] == '1'){
            resultTuple = incrementTuple(tuple.substr(0,bitNum+1));
            return[resultTuple,bitNum];
            
        }
        else{
            console.log('err');
        }
    }

    function incrementTuple(tuple){
        length = tuple.length-1;
        index = tuple.length-1;

        if(tuple[index] == '0'){
            let resultTuple = tuple.substr(0, index) + '1' + tuple.substr(index);
            return(resultTuple);
        }
        else if (tuple[index] === '1') {
            let previousTuple = incrementTuple(tuple.substring(0, index-1)); 
            return previousTuple + '0'; 
        } else {
            console.log('Error: Invalid bit encountered');
            return tuple; 
        }
        
    }
    

});

//notes ni arevalo please dont delete unless ipapasa na or deployment

//padding of zeros
// if(first_operand_length < parseInt(number_digits_supported)+1){
//     for(var i = first_operand_length; i < parseInt(number_digits_supported)+1; i++){
//         first_operand_binary += "0";
//     }
// }

