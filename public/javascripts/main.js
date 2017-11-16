window.onload = function() {
function validateForm() {
    var form = document.getElementByName('s4');
    console.log("call on me")
    if (input.value.trim().length < 1) {
        alert("Sentence cannot be blank");
        return false;
    }

    return true;
}
form.onsubmit = function(event) {
    if (!validateForm()) {
        // Will stop form from submitting anyway,
        // by preventing default functionality
        event.preventDefault();
        console.log("call dicks me")
    }
};

};
