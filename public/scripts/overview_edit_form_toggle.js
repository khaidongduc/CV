$("#toggle-edit-form").on("click", () => {
    $("#edit-box").removeClass("d-none");
    $("#current-text").addClass("d-none");
})

$("#cancel-edit").on("click", () => {
    $("#edit-box").addClass("d-none");
    $("#current-text").removeClass("d-none");
})