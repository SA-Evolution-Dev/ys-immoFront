document.addEventListener('DOMContentLoaded', function () {


    // DROPDOW SEARCH IMMO
    const toggleBtn = document.getElementById('toggleBtn');
    const collapseElement = document.getElementById('advancedFields');

    if (toggleBtn && collapseElement) {
        collapseElement.addEventListener('show.bs.collapse', () => {
            toggleBtn.innerHTML = '<span class="fa fa-minus"></span>';
        });
        collapseElement.addEventListener('hide.bs.collapse', () => {
            toggleBtn.innerHTML = '<span class="fa fa-plus"></span>';
        });
    }

});