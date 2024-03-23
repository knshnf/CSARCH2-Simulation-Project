$(document).ready(function() {
    var fileContent = "";
    $("#submit-btn").click(function() {
        $(".temp").remove();
        $(".binary").removeClass("negative");

        let operand1Binary = $("#operand-1-binary").val();
        let operand1Exponent = $("#operand-1-exponent").val();
        let operand2Binary = $("#operand-2-binary").val();
        let operand2Exponent = $("#operand-2-exponent").val();
        let digitsSupported = $("#digits-supported").val();
        let roundingChoice = $('input[name=rounding_choice]:checked').val()

        let binaryRegex = /^-?[01]+(\.[01]+)?$/;
        let digitsRegex = /^\d+$/;
        let digitsRegexWithNegative = /^-?\d+$/;

        if (operand1Binary === "" || operand1Exponent === "" || operand2Binary === "" || operand2Exponent === "" || digitsSupported === "" || roundingChoice === undefined) {
            alert("All fields are required.");
            return;
        }

        if (!binaryRegex.test(operand1Binary) || !binaryRegex.test(operand2Binary)) {
            alert("Operands should be binary.");
            return;
        }

        if (!digitsRegexWithNegative.test(operand1Exponent) || !digitsRegexWithNegative.test(operand2Exponent)) {
            alert("Exponent values should be a number.");
            return;
        }

        if (!digitsRegex.test(digitsSupported)) {
            alert("Digits supported should be a number.");
            return;
        }

        if (!checkif32Bits(operand1Binary, parseInt(operand1Exponent)) || !checkif32Bits(operand2Binary, parseInt(operand2Exponent))) {
            alert("Operands should be within 32 bits.");
            return;
        }

        var operand1IsNegative = false;
        var operand2IsNegative = false;
        var bothOperandsNegative = false;
        if (operand1Binary.charAt(0) === '-') {
            operand1IsNegative = true;
            operand1Binary = operand1Binary.substring(1);
            $("#solution-operand1-binary").addClass("negative")
        }
        if (operand2Binary.charAt(0) === '-') {
            operand2IsNegative = true;
            operand2Binary = operand2Binary.substring(1);
            $("#solution-operand2-binary").addClass("negative")
        }

        if (operand1IsNegative && operand2IsNegative) {
            bothOperandsNegative = true;
            $(".binary").addClass("negative");

        } else if (operand1IsNegative) {
            var twosComplement = twosComplementBinaryFloat(operand1Binary)
        } else if (operand2IsNegative) {
            var twosComplement = twosComplementBinaryFloat(operand2Binary)
        }

        fileContent = fileContent.concat("IEEE-754 Binary-32 Floating-Point Addition\n\n");
        var fileContentSteps = ""

        // Display the inputs
        $("#solution-operand1-binary").text(operand1Binary);
        $("#solution-operand1-exponent").text("2^".concat(operand1Exponent));
        $("#solution-operand2-binary").text(operand2Binary);
        $("#solution-operand2-exponent").text("2^".concat(operand2Exponent));
        fileContent = fileContent.concat("Operand 1: " + operand1Binary + " x 2^".concat(operand1Exponent) + "\n");
        fileContent = fileContent.concat("Operand 2: " + operand2Binary + " x 2^".concat(operand2Exponent) + "\n");
        fileContent = fileContent.concat("Choice of Rounding: " + roundingChoice + "\n");
        fileContent = fileContent.concat("Digits Supported: " + digitsSupported + "\n\n");

        let operand0 = [operand1Binary, parseInt(operand1Exponent)];
        let operand1 = [operand2Binary, parseInt(operand2Exponent)];

        // Get twos complement if one of the operand is negative
        if (!bothOperandsNegative && operand1IsNegative) {
            let htmlContent = `
                <p class="font-bold mb-2 temp"> Get the twos complement of the negative operand </p>
                <div class="flex flex-row temp">
                    <p class="w-fit text-right"> Operand 1: </p>
                    <p class="w-8/12 text-right output-field" style='color:red'>` + twosComplement + `</p>
                    <p class="w-1/12 text-center"> x </p>
                    <p class="w-1/12 output-field"> 2^` + operand0[1] + `</p>
                </div>
                <div class="flex flex-row temp mb-4">
                    <p class="w-fit text-right"> Operand 2: </p>
                    <p class="w-8/12 text-right output-field">` + operand1[0] + `</p>
                    <p class="w-1/12 text-center"> x </p>
                    <p class="w-1/12 output-field"> 2^` + operand1[1] + `</p>
                </div>`;
            $("#1-container").prepend(htmlContent);
            operand0 = [twosComplement, operand0[1]]
        } else if (!bothOperandsNegative && operand2IsNegative) {
            let htmlContent = `
                    <p class="font-bold mb-2 temp"> Get the twos complement of the negative operand </p>
                    <div class="flex flex-row temp">
                        <p class="w-fit text-right"> Operand 1: </p>
                        <p class="w-8/12 text-right output-field">` + operand0[0] + `</p>
                        <p class="w-1/12 text-center"> x </p>
                        <p class="w-1/12 output-field"> 2^` + operand0[1] + `</p>
                    </div>
                    <div class="flex flex-row temp mb-4">
                        <p class="w-fit text-right"> Operand 2: </p>
                        <p class="w-8/12 text-right output-field" style='color:red'>` + twosComplement + `</p>
                        <p class="w-1/12 text-center"> x </p>
                        <p class="w-1/12 output-field"> 2^` + operand1[1] + `</p>
                    </div>`;
            $("#1-container").prepend(htmlContent);
            operand1 = [twosComplement, operand1[1]]
        }


        // 1.a.i Normalize both operands
        let [normalizedOperand0, normalizedOperand1] = normalizeBothOperands(operand0, operand1);
        console.log(normalizeBothOperands(operand0, operand1));
        $("#1ai-operand1-binary").text(normalizedOperand0[0]);
        $("#1ai-operand1-exponent").text("2^".concat(normalizedOperand0[1]));
        $("#1ai-operand2-binary").text(normalizedOperand1[0]);
        $("#1ai-operand2-exponent").text("2^".concat(normalizedOperand1[1]));
        fileContentSteps = fileContentSteps.concat("1. INITIAL NORMALIZATION " + "\n");
        fileContentSteps = fileContentSteps.concat("    Normalize both operands " + "\n");
        fileContentSteps = fileContentSteps.concat("    Operand 1: " + normalizedOperand0[0] + " x 2^".concat(normalizedOperand0[1]) + "\n");
        fileContentSteps = fileContentSteps.concat("    Operand 2: " + normalizedOperand1[0] + " x 2^".concat(normalizedOperand1[1]) + "\n\n");

        // 1.a.ii, 1.a.iii
        $("#1aii-operand1-binary").text(normalizedOperand0[0]);
        $("#1aii-operand1-exponent").html("2^<span style='color:red'>" + normalizedOperand0[1] + "</span>");
        $("#1aii-operand2-binary").text(normalizedOperand1[0]);
        $("#1aii-operand2-exponent").html("2^<span style='color:red'>" + normalizedOperand1[1] + "</span>");
        let [shiftedOperand0, shiftedOperand1] = compareExponentsThenShift(normalizedOperand0, normalizedOperand1);
        $("#1aiii-operand1-binary").text(shiftedOperand0[0]);
        $("#1aiii-operand1-exponent").text("2^".concat(shiftedOperand0[1]));
        $("#1aiii-operand2-binary").text(shiftedOperand1[0]);
        $("#1aiii-operand2-exponent").text("2^".concat(shiftedOperand1[1]));
        fileContentSteps = fileContentSteps.concat("    Compare the Exponents " + "\n");
        fileContentSteps = fileContentSteps.concat("    Operand 1: " + normalizedOperand0[0] + " x 2^".concat(normalizedOperand0[1]) + "\n");
        fileContentSteps = fileContentSteps.concat("    Operand 2: " + normalizedOperand1[0] + " x 2^".concat(normalizedOperand1[1]) + "\n\n");

        fileContentSteps = fileContentSteps.concat("    Shift the number with smaller exponent to match the larger exponent " + "\n");
        fileContentSteps = fileContentSteps.concat("    Operand 1: " + shiftedOperand0[0] + " x 2^".concat(shiftedOperand0[1]) + "\n");
        fileContentSteps = fileContentSteps.concat("    Operand 2: " + shiftedOperand1[0] + " x 2^".concat(shiftedOperand1[1]) + "\n\n");


        // 1.a.iiii Perform GRS or Round to Nearest - Ties to Even
        if (roundingChoice === "GRS") {
            $("#1-perform-title").text("Perform GRS");
            fileContentSteps = fileContentSteps.concat("    Perform GRS " + "\n");
            var roundedOperand0 = [roundGRS(shiftedOperand0, parseInt(digitsSupported)), shiftedOperand0[1]];
            var roundedOperand1 = [roundGRS(shiftedOperand1, parseInt(digitsSupported)), shiftedOperand1[1]];
        }

        if (roundingChoice === "RTN") {
            $("#1-perform-title").text("Perform RTN-TE");
            fileContentSteps = fileContentSteps.concat("    Perform RTN-TE " + "\n");
            console.log(shiftedOperand0, shiftedOperand1, digitsSupported);
            var [roundedOperand0, roundedOperand1] = RTN_TTE(shiftedOperand0, shiftedOperand1, parseInt(digitsSupported));
            var roundedOperand0 = [roundedOperand0[0], shiftedOperand0[1]];
            var roundedOperand1 = [roundedOperand1[0], shiftedOperand1[1]];
        }

        if (roundingChoice === "TRUNCATE") {
            $("#1-perform-title").text("Perform Rounding - Truncate");
            fileContentSteps = fileContentSteps.concat("    Perform Rounding - Truncate " + "\n");
            var roundedOperand0 = [shiftedOperand0[0].substr(0, parseInt(digitsSupported) + 1), shiftedOperand0[1]];
            var roundedOperand1 = [shiftedOperand1[0].substr(0, parseInt(digitsSupported) + 1), shiftedOperand1[1]];
        }

        if (roundingChoice === "CEIL") {
            $("#1-perform-title").text("Perform Rounding - Ceiling");
            fileContentSteps = fileContentSteps.concat("    Perform Rounding - Ceiling " + "\n");
            let ceiled1 = shiftedOperand0[0].substr(0, parseInt(digitsSupported));
            let ceiled2 = shiftedOperand1[0].substr(0, parseInt(digitsSupported));

            if (!operand1IsNegative) {
                if (shiftedOperand0[0][parseInt(digitsSupported)] === "1") {
                    ceiled1 = ceiled1.concat("1");

                    let pointIndex = ceiled1.indexOf('.');
                    let binaryWithoutPointLength = ceiled1.replace('.', '').length;

                    ceiled1 = addBinary(ceiled1.replace('.', ''), String("1").padStart(binaryWithoutPointLength, '0'));
                    ceiled1 = ceiled1.substring(0, pointIndex) + '.' + ceiled1.substring(pointIndex);
                } else {
                    ceiled1 = ceiled1.concat("1");
                }
            } else {
                ceiled1 = shiftedOperand0[0].substr(0, parseInt(digitsSupported + 1));
            }

            // Operand 2
            if (!operand2IsNegative) {
                if (shiftedOperand1[0][parseInt(digitsSupported)] === "1") {
                    ceiled2 = ceiled2.concat("1");

                    let pointIndex = ceiled2.indexOf('.');
                    let binaryWithoutPointLength = ceiled2.replace('.', '').length;

                    ceiled2 = addBinary(ceiled2.replace('.', ''), String("1").padStart(binaryWithoutPointLength, '0'));
                    ceiled2 = ceiled2.substring(0, pointIndex) + '.' + ceiled2.substring(pointIndex);
                } else {
                    ceiled2 = ceiled2.concat("1");
                }
            } else {
                ceiled2 = shiftedOperand1[0].substr(0, parseInt(digitsSupported) + 1);
            }

            var roundedOperand0 = [ceiled1, shiftedOperand0[1]];
            var roundedOperand1 = [ceiled2, shiftedOperand1[1]];
        }

        if (roundingChoice === "FLOOR") {
            $("#1-perform-title").text("Perform Rounding - Floor");
            fileContentSteps = fileContentSteps.concat("    Perform Rounding - Floor " + "\n");
            let floored1 = shiftedOperand0[0].substr(0, parseInt(digitsSupported));
            let floored2 = shiftedOperand1[0].substr(0, parseInt(digitsSupported));

            // Operand 1
            if (operand1IsNegative) {
                if (shiftedOperand0[0][parseInt(digitsSupported)] === "1") {
                    floored1 = floored1.concat("1");

                    let pointIndex = floored1.indexOf('.');
                    let binaryWithoutPointLength = floored1.replace('.', '').length

                    floored1 = addBinary(floored1.replace('.', ''), String("1").padStart(binaryWithoutPointLength, '0'));
                    floored1 = floored1.substring(0, pointIndex) + '.' + floored1.substring(pointIndex);

                } else {
                    floored1 = floored1.concat("1");
                }
                var roundedOperand0 = [floored1, shiftedOperand0[1]];
            } else {
                floored1 = shiftedOperand0[0].substr(0, parseInt(digitsSupported) + 1)
                var roundedOperand0 = [floored1, shiftedOperand0[1]];
            }

            // Operand 2
            if (operand2IsNegative) {
                if (shiftedOperand1[0][parseInt(digitsSupported)] === "1") {
                    floored2 = floored2.concat("1");

                    let pointIndex = floored2.indexOf('.');
                    let binaryWithoutPointLength = floored2.replace('.', '').length

                    floored2 = addBinary(floored2.replace('.', ''), String("1").padStart(binaryWithoutPointLength, '0'));
                    floored2 = floored2.substring(0, pointIndex) + '.' + floored2.substring(pointIndex);

                } else {
                    floored2 = floored2.concat("1");
                }
                var roundedOperand1 = [floored2, shiftedOperand1[1]];
            } else {
                floored2 = shiftedOperand1[0].substr(0, parseInt(digitsSupported) + 1);
                var roundedOperand1 = [floored2, shiftedOperand1[1]];
            }

            if (parseInt(digitsSupported) === 1) {
                var roundedOperand0 = [shiftedOperand0[0].substr(0, 2), shiftedOperand0[1]];
                var roundedOperand1 = [shiftedOperand1[0].substr(0, 2), shiftedOperand0[1]];
            }
        }

        $("#1aiiii-operand1-binary").text(roundedOperand0[0]);
        $("#1aiiii-operand1-exponent").text("2^".concat(roundedOperand0[1]));
        $("#1aiiii-operand2-binary").text(roundedOperand1[0]);
        $("#1aiiii-operand2-exponent").text("2^".concat(roundedOperand1[1]));
        fileContentSteps = fileContentSteps.concat("    Operand 1: " + roundedOperand0[0] + " x 2^".concat(roundedOperand0[1]) + "\n");
        fileContentSteps = fileContentSteps.concat("    Operand 2: " + roundedOperand1[0] + " x 2^".concat(roundedOperand1[1]) + "\n\n\n\n");

        // 2 Add two floating point binary
        $("#2-operand1-binary").text(roundedOperand0[0]);
        $("#2-operand1-exponent").text("2^".concat(roundedOperand0[1]));
        $("#2-operand2-binary").text(roundedOperand1[0]);
        $("#2-operand2-exponent").text("2^".concat(roundedOperand1[1]));
        let sum = addFloatingPointBinary(roundedOperand0, roundedOperand1);
        $("#2-sum-binary").text(sum[0]);
        $("#2-sum-exponent").text("2^".concat(sum[1]));
        fileContentSteps = fileContentSteps.concat("2. OPERATION " + "\n");
        fileContentSteps = fileContentSteps.concat("    Add the two operands " + "\n");
        fileContentSteps = fileContentSteps.concat("    Sum: " + sum[0] + " x 2^".concat(sum[1]) + "\n\n\n\n");

        // 3. Normalize
        let normalizedSum = normalize(sum);
        normalizedSum = [normalizedSum[0], parseInt(normalizedSum[1])];
        $("#3-normalized-binary").text(normalizedSum[0]);
        $("#3-normalized-exponent").text("2^".concat(normalizedSum[1]));
        fileContentSteps = fileContentSteps.concat("3. POST-OPERATION NORMALIZATION " + "\n");
        fileContentSteps = fileContentSteps.concat("    Normalize the sum " + "\n");
        fileContentSteps = fileContentSteps.concat("    Sum: " + normalizedSum[0] + " x 2^".concat(normalizedSum[1]) + "\n\n");

        // var roundedSum = roundRTN_TTE(normalizedSum[0], parseInt(digitsSupported));
        var [roundedSum, copy] = RTN_TTE(normalizedSum, normalizedSum, parseInt(digitsSupported));
        var roundedSum = [roundedSum[0], normalizedSum[1]]
        $("#3-rounded-binary").text(roundedSum[0]);
        $("#3-rounded-exponent").text("2^".concat(roundedSum[1]));
        fileContentSteps = fileContentSteps.concat("    Round to the appropriate number of bits using RTN-TE " + "\n");
        fileContentSteps = fileContentSteps.concat("    Sum: " + roundedSum[0] + " x 2^".concat(roundedSum[1]) + "\n\n\n\n");

        // 4. Final Answer
        $("#4-final-binary").text(roundedSum[0]);
        $("#4-final-exponent").text("2^".concat(roundedSum[1]));
        $("#final-answer").text(roundedSum[0] + " " + "x 2^".concat(roundedSum[1]));
        fileContentSteps = fileContentSteps.concat("4. FINAL ANSWER " + "\n");
        fileContentSteps = fileContentSteps.concat("    " + roundedSum[0] + " x 2^".concat(roundedSum[1]) + "\n\n");
        fileContent = fileContent.concat("Final Answer: " + roundedSum[0] + " x 2^".concat(roundedSum[1]) + "\n\n\n")
        fileContent = fileContent.concat(fileContentSteps);

        $("#solution-steps").show();
    });

    $("#clear-btn").click(function() {
        $("#operand-1-binary").val('');
        $("#operand-1-exponent").val('');
        $("#operand-2-binary").val('');
        $("#operand-2-exponent").val('');
        $("#digits-supported").val('');
        $('input[name=rounding_choice]').prop('checked', false);
        $("#solution-steps").hide();
    });

    $("#save-btn").click(function() {
        download("output.txt", fileContent);
    });
});

// 1.a.i Normalize both operands
function normalizeBothOperands(operand0, operand1) {
    console.log("normalizeBothOperands invoked")

    let first_operand_binary = operand0[0]
    let first_operand_exponent = operand0[1]
    let second_operand_binary = operand1[0]
    let second_operand_exponent = operand1[1]

    let first_operand_length = first_operand_binary.length;
    let first_op_decimal_pos = first_operand_binary.indexOf(".");
    let second_operand_length = second_operand_binary.length;
    let second_op_decimal_pos = second_operand_binary.indexOf(".");
    //console.log("first operand length: " + first_operand_length);
    let number_digits_supported = $("#digits-supported").val();

    if (first_op_decimal_pos !== 1) {
        let temp_bin = first_operand_binary.replace(".", "");
        let one_f = temp_bin.substring(0, 1);
        let the_rest = temp_bin.substring(1);
        first_operand_binary = one_f + "." + the_rest;
        // first_operand_exponent = first_op_decimal_pos - 1;
        first_operand_exponent = first_operand_exponent + (first_op_decimal_pos - 1);
        console.log("first operand after normalization: " + first_operand_binary);
        console.log("first operand after normalization exponent: " + first_operand_exponent);
    }
    if (second_op_decimal_pos !== 1) {
        let temp_bin = second_operand_binary.replace(".", "");
        let one_f = temp_bin.substring(0, 1);
        let the_rest = temp_bin.substring(1);
        second_operand_binary = one_f + "." + the_rest;
        second_operand_exponent = second_operand_exponent + (second_op_decimal_pos - 1);
        // second_operand_exponent = second_op_decimal_pos - 1;
        console.log("second operand after normalization: " + second_operand_binary);
        console.log("second operand after normalization exponent: " + second_operand_exponent);
    }

    //padding of zeros
    if (first_operand_length < parseInt(number_digits_supported) + 1) {
        for (var i = first_operand_length; i < parseInt(number_digits_supported) + 1; i++) {
            first_operand_binary += "0";
        }
        console.log("first operand after padding of zeros: " + first_operand_binary);
    }

    if (second_operand_length < parseInt(number_digits_supported) + 1) {
        for (var i = second_operand_length; i < parseInt(number_digits_supported) + 1; i++) {
            second_operand_binary += "0";
        }
        console.log("second operand after padding of zeros: " + second_operand_binary);
    }

    // console.log([first_operand_binary, first_operand_exponent], [second_operand_binary, second_operand_exponent])
    return [
        [first_operand_binary, first_operand_exponent],
        [second_operand_binary, second_operand_exponent]
    ]
}

// 1.a.i Compare exponents and shift
function compareExponentsThenShift(operand0, operand1) {
    console.log("compareExponentsThenShift invoked")

    let first_operand_binary = operand0[0]
    let first_operand_exponent = operand0[1]
    let second_operand_binary = operand1[0]
    let second_operand_exponent = operand1[1]

    if (first_operand_exponent > second_operand_exponent) {
        let temp_exponent = parseInt(second_operand_exponent);
        for (let i = second_operand_exponent; i < first_operand_exponent; i++) {
            second_operand_binary = "0" + second_operand_binary;
            second_operand_binary = second_operand_binary.slice(0, -1);
            temp_exponent += 1;
        }
        second_operand_exponent = temp_exponent;
        let temp_bin = second_operand_binary.replace(".", "");
        let one_f = temp_bin.substring(0, 1);
        let the_rest = temp_bin.substring(1);
        second_operand_binary = one_f + "." + the_rest;
    } else if (first_operand_exponent < second_operand_exponent) {
        let temp_exponent = parseInt(first_operand_exponent);
        for (let i = first_operand_exponent; i < second_operand_exponent; i++) {
            first_operand_binary = "0" + first_operand_binary;
            first_operand_binary = first_operand_binary.slice(0, -1);
            temp_exponent += 1;
        }
        first_operand_exponent = temp_exponent;
        let temp_bin = first_operand_binary.replace(".", "");
        let one_f = temp_bin.substring(0, 1);
        let the_rest = temp_bin.substring(1);
        first_operand_binary = one_f + "." + the_rest;
    }

    console.log([first_operand_binary, first_operand_exponent.toString()], [second_operand_binary, second_operand_exponent.toString()])
    return [
        [first_operand_binary, first_operand_exponent],
        [second_operand_binary, second_operand_exponent]
    ]
}

function normalize(operand0) {
    let first_operand_binary = operand0[0]
    let first_operand_exponent = operand0[1]
    console.log("normalize invoked")
    console.log("first operand before normalization: " + first_operand_binary);
    console.log("first operand before normalization exponent: " + first_operand_exponent);



    let first_operand_length = first_operand_binary.length;
    let first_op_decimal_pos = first_operand_binary.indexOf(".");
    //console.log("first operand length: " + first_operand_length);
    let number_digits_supported = $("#digits-supported").val();

    if (first_op_decimal_pos !== 1) {
        let temp_bin = first_operand_binary.replace(".", "");
        let one_f = temp_bin.substring(0, 1);
        let the_rest = temp_bin.substring(1);
        first_operand_binary = one_f + "." + the_rest;
        // first_operand_exponent = first_op_decimal_pos - 1;
        first_operand_exponent = first_operand_exponent + (first_op_decimal_pos - 1);
        console.log("first operand after normalization: " + first_operand_binary);
        console.log("first operand after normalization exponent: " + first_operand_exponent);
    }

    if (first_operand_length < parseInt(number_digits_supported) + 1) {
        for (var i = first_operand_length; i < parseInt(number_digits_supported) + 1; i++) {
            first_operand_binary += "0";
        }
        console.log("first operand after padding of zeros: " + first_operand_binary);
    }


    console.log([first_operand_binary, first_operand_exponent])
    return [first_operand_binary, first_operand_exponent]
}

function GRS(tuple1, tuple2, bitNum) {
    var roundedTuple1 = roundGRS(tuple1, bitNum);
    var roundedTuple2 = roundGRS(tuple2, bitNum);

    return [roundedTuple1, roundedTuple2];

}

function roundGRS(tuple, bitnum) {
    //binary string part
    var binStr = tuple[0];
    //exponent part
    //var exp = tuple[1];

    //var guard, round, sticky = 0
    var sticky = 0;
    var res = '';

    // >= required number of bits + grs bits, proceed
    if (binStr.length >= bitnum + 3) {

        // //guard
        // guard = parseInt(binStr[bitnum + 1]);

        // //round
        // round = parent(binStr[bitnum + 2]);

        //sticky
        for (let i = bitnum + 2; i < binStr.length; i++) {
            //if non-0, sticky = 1 but it's 0 by default
            if (binStr[i] == '1') {
                sticky = 1;
                break;
            }
        }
        console.log(res);
        //get required bits + guard and round + sticky
        return res = binStr.substring(0, bitnum + 3).concat(sticky.toString());
    } else {
        console.log(res);
        return res = binStr;
    }
}

// Floating Point Addition
// function addFloatingPointBinary(addend1, addend2) {
//     console.log("addFloatingPointBinary invoked")

//     // extracts binary str ad exp from tuples
//     let binStr1 = addend1[0];
//     let exp1 = addend1[1];
//     let binStr2 = addend2[0];
//     let exp2 = addend2[1];

//     let maxExp = Math.max(exp1, exp2);

//     // normalize binary strings to have the same exponent
//     binStr1 = normalizeBinaryString(binStr1, exp1, maxExp);
//     binStr2 = normalizeBinaryString(binStr2, exp2, maxExp);

//     let sum = addBinaryStrings(binStr1, binStr2);

//     // Normalize the sum
//     let expSum = maxExp;
//     sum = normalizeBinaryString(sum, expSum, maxExp);

//     return [sum, expSum];
// }

// // Normalize binary string to a specific exponent
// function normalizeBinaryString(binStr, exp, targetExp) {
//     if (exp === targetExp) {
//         return binStr;
//     } else {
//         let diff = Math.abs(targetExp - exp);
//         if (exp < targetExp) {
//             for (let i = 0; i < diff; i++) {
//                 binStr = "0" + binStr;
//             }
//         } else {
//             binStr = binStr.slice(diff);
//         }
//         return binStr;
//     }
// }

// // Add two binary str
// function addBinaryStrings(binStr1, binStr2) {
//     var sum = "";
//     var carry = 0;
//     var maxLength = Math.max(binStr1.length, binStr2.length);

//     for (var i = 0; i < maxLength; i++) {
//         var digit1 = i < binStr1.length ? parseInt(binStr1[binStr1.length - 1 - i]) : 0;
//         var digit2 = i < binStr2.length ? parseInt(binStr2[binStr2.length - 1 - i]) : 0;
//         var digitSum = digit1 + digit2 + carry;
//         carry = Math.floor(digitSum / 2);
//         sum = (digitSum % 2) + sum;
//     }

//     if (carry > 0) {
//         sum = carry + sum;
//     }

//     return sum;
// }

// Input (0.f or 1.f, int)
function checkif32Bits(binaryString, exponent) {
    console.log("checkif32Bits invoked");

    // Normalize the binary string to 1.f
    if (binaryString[0] === '1') {
        let decimalPointIndex = binaryString.indexOf('.');
        let shift = decimalPointIndex - 1;
        var mantissa = binaryString.replace('.', '').substring(1);
        exponent += shift;
    } else {
        let firstOneIndex = binaryString.replace('.', '').indexOf('1')
        if (firstOneIndex + 1 === binaryString.replace('.', '').length) {
            var mantissa = binaryString.replace('.', '').substring(firstOneIndex + 1);;
            exponent -= firstOneIndex;
        } else {
            var mantissa = binaryString.replace('.', '').substring(firstOneIndex + 1);
            exponent -= firstOneIndex;
        }
    }

    if (exponent > 127 || exponent < -127) {
        return false;
    }

    if (mantissa.length > 23 && (mantissa.substring(23).match(/1/g) || []).length > 0) {
        return false;
    }

    return true;
}

// Javascript has no native support for big binary numbers
// https://stackoverflow.com/questions/40353000/javascript-add-two-binary-numbers-returning-binary
function halfAdder(a, b) {
    const sum = xor(a, b);
    const carry = and(a, b);
    return [sum, carry];
}

function fullAdder(a, b, carry) {
    halfAdd = halfAdder(a, b);
    const sum = xor(carry, halfAdd[0]);
    carry = and(carry, halfAdd[0]);
    carry = or(carry, halfAdd[1]);
    return [sum, carry];
}

function xor(a, b) { return (a === b ? 0 : 1); }

function and(a, b) { return a == 1 && b == 1 ? 1 : 0; }

function or(a, b) { return (a || b); }

function addBinary(a, b) {

    let sum = '';
    let carry = '';

    for (var i = a.length - 1; i >= 0; i--) {
        if (i == a.length - 1) {
            //half add the first pair
            const halfAdd1 = halfAdder(a[i], b[i]);
            sum = halfAdd1[0] + sum;
            carry = halfAdd1[1];
        } else {
            //full add the rest
            const fullAdd = fullAdder(a[i], b[i], carry);
            sum = fullAdd[0] + sum;
            carry = fullAdd[1];
        }
    }

    return carry ? carry + sum : sum;
}

function addFloatingPointBinary(addend1, addend2) {
    // Assuming addend1 and addend2 are already normalized
    let binStr1 = addend1[0];
    let exp1 = addend1[1];
    let binStr2 = addend2[0];
    let exp2 = addend2[1];

    let mantissaLength = binStr1.length - 2;
    let res = addBinary(binStr1.replace('.', ''), binStr2.replace('.', ''))
    console.log(res);
    let result = res.slice(0, res.length - mantissaLength) + "." + res.slice(res.length - mantissaLength, res.length);
    return [result, exp1];
}

function RTN_TTE(tuple1, tuple2, bitNum) {
    let negTuple1 = isNegative(tuple1[0]);
    let negTuple2 = isNegative(tuple2[0]);
    console.log(negTuple1);

    if (negTuple1 == true) {
        tuple1[0] = removeNegative(tuple1[0]);
    }
    if (negTuple2 == true) {
        tuple2[0] = removeNegative(tuple2[0]);
    }

    let roundedTuple1 = roundRTN_TTE(tuple1[0], bitNum, negTuple1);
    let roundedTuple2 = roundRTN_TTE(tuple2[0], bitNum, negTuple2);

    if (negTuple1 == true) {
        roundedTuple1[0] = addNegative(roundedTuple1[0]);
    }
    if (negTuple2 == true) {
        roundedTuple2[0] = addNegative(roundedTuple2[0]);
    }

    console.log(roundedTuple1); // remove 
    console.log(roundedTuple2); // remove
    return [roundedTuple1, roundedTuple2];
}

function roundRTN_TTE(tuple, bitNum, negative) {
    if (tuple.length - 1 === bitNum) {
        return [tuple, bitNum];
    }
    let index1 = bitNum + 1;
    let index2 = bitNum + 2;
    let resultTuple = "";
    console.log(tuple[index1] + tuple[index2]); // remove

    if (negative == false) {
        // 01 - round down
        if (tuple[index1] == '0') { // index2 doesnt matter since it will round down
            resultTuple = tuple.substr(0, bitNum + 1);
            return [resultTuple, bitNum];
        }

        // 10 - tie to even
        else if (tuple[index1] == '1' && isMiddle(tuple, index2) == true) {
            resultTuple = tuple.substr(0, bitNum + 1);
            return [resultTuple, bitNum];
        }

        // 11 - round up
        else if (tuple[index1] == '1' && isMiddle(tuple, index2) == false) {
            resultTuple = incrementTuple(tuple.substr(0, bitNum + 1));
            return [resultTuple, bitNum];

        } else {
            console.log('Error');
            return true;
        }
    } else {
        // 01 - round up
        if (tuple[index1] == '0') { // index2 doesnt matter since it will round down
            resultTuple = incrementTuple(tuple.substr(0, bitNum + 1));
            return [resultTuple, bitNum];
        }

        // 10 - tie to even
        else if (tuple[index1] == '1' && isMiddle(tuple, index2) == true) {
            resultTuple = tuple.substr(0, bitNum + 1);
            return [resultTuple, bitNum];
        }

        // 11 - round up
        else if (tuple[index1] == '1' && isMiddle(tuple, index2) == false) {
            resultTuple = tuple.substr(0, bitNum + 1);
            return [resultTuple, bitNum];
        } else {
            console.log('Error');
            return true;
        }
    }


}

function isMiddle(tuple, index2) { // cycle through the string to confirm if all are zeroes
    for (let i = index2; i < tuple.length; i++) {
        if (tuple[i] !== '0') {
            return false;
        }
    }
    return true;
}

function incrementTuple(tuple) {
    if (tuple.length === 0) {
        return '1';
    }

    let lastBit = tuple.charAt(tuple.length - 1);

    if (lastBit === '0') {
        return tuple.substring(0, tuple.length - 1) + '1';
    } else if (lastBit === '1') {
        let previousTuple = incrementTuple(tuple.substring(0, tuple.length - 1));
        return previousTuple + '0';
    } else if (lastBit === '.') {
        let previousTuple = incrementTuple(tuple.substring(0, tuple.length - 1));
        return previousTuple + '.';
    } else {
        console.log('Error: Invalid bit encountered');
        return tuple;
    }
}

function isNegative(tuple) {
    if (tuple[0] == '-') {
        return true;
    }
    return false;
}

function removeNegative(tuple) {
    return (tuple.substring(1, tuple.length - 1));
}

function addNegative(tuple) {
    return ('-' + tuple);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function twosComplementBinaryFloat(binary) {
    let binaryArray = binary.split('');
    for (let i = 0; i < binaryArray.length; i++) {
        if (binaryArray[i] === '0') {
            binaryArray[i] = '1';
        } else if (binaryArray[i] === '1') {
            binaryArray[i] = '0';
        }
    }
    let onesComplement = binaryArray.join('');
    let pointIndex = binary.indexOf('.');

    let binaryWithoutPointLength = onesComplement.replace('.', '').length
    let twosComplement = addBinary(onesComplement.replace('.', ''), String("1").padStart(binaryWithoutPointLength, '0'));
    twosComplement = twosComplement.substring(0, pointIndex) + '.' + twosComplement.substring(pointIndex);
    console.log(twosComplement);
    return twosComplement;
}