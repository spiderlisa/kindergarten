$(function() {
    $("#choose-all-btn").click(function () {
        var inputs = $('input[name=present]');
        if (!(inputs.prop('checked')))
            inputs.prop('checked', true);
        else
            inputs.prop('checked', false);
    });
});