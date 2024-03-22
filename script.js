$(document).ready(function() {
    $("#submit-btn").click(function() {
        var operand1Binary = $("#operand-1-binary").val();
        var operand1Exponent = $("#operand-1-exponent").val();
        var operand2Binary = $("#operand-2-binary").val();
        var operand2Exponent = $("#operand-2-exponent").val();
        var digitsSupported = $("#digits-supported").val();
        var roundingChoice = $('input[name=rounding_choice]:checked').val()

        var binaryRegex = /^[01]+(\.[01]+)?$/;
        var digitsRegex = /^\d+$/;

        if (operand1Binary === "" || operand1Exponent === "" || operand2Binary === "" || operand2Exponent === "" || digitsSupported === "" || roundingChoice === undefined) {
            alert("All fields are required.");
            return;
        }

        if (!binaryRegex.test(operand1Binary) || !binaryRegex.test(operand2Binary)) {
            alert("Operands should be binary.");
            return;
        }

        if (!digitsRegex.test(operand1Exponent) || !digitsRegex.test(operand2Exponent)) {
            alert("Exponent values should be a number.");
            return;
        }

        if (!digitsRegex.test(digitsSupported)) {
            alert("Digits supported should be a number.");
            return;
        }

        alert("Input is valid!");
        return
    });

    $("#clear-btn").click(function() {
        $("#operand-1-binary").val('');
        $("#operand-1-exponent").val('');
        $("#operand-2-binary").val('');
        $("#operand-2-exponent").val('');
        $("#digits-supported").val('');
        $('input[name=rounding_choice]').prop('checked', false);
    });
});