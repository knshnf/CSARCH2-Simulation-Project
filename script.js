$(document).ready(function() {
    $("#clear-btn").click(function() {
        $("#operand-1-binary").val('');
        $("#operand-1-exponent").val('');
        $("#operand-2-binary").val('');
        $("#operand-2-exponent").val('');
        $("#digits-supported").val('');
        $('input[name=rounding_choice]').prop('checked', false);
    });
});