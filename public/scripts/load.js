$(document).ready(function(){
    $('#btn-load-more').on('click', function(event){

        // Prevent page to refresh on button clicked
        event.preventDefault();
        event.stopPropagation();

        // Current page number
        var currentPage = $('#container-load-more').attr('data-page');

        // Total number of pages
        var totalPages = $('#container-load-more').attr('data-total-pages');

        // Check if current page is NOT last page
        if (Number(currentPage) != totalPages) {
            // Get next page number
            var nextPageNumber = Number(currentPage) + 1;

            // Make ajax request to /search/:username/:currentPage
            $.ajax({
                url: '/search/' + $('#search-user').val() + '/' + nextPageNumber,
                type: 'GET',
                contentType: 'application/json',
            }).done(function (result) {
                // Remove the previous text result
                $('p#text-result-more').remove();

                // Remove the old text result
                $('p#text-result').remove();

                // Append new users from next page
                $('#container-followers').append(result);
                // console.log("RESULT:\n" + JSON.stringify(result, null, 4));

                // Update next page number
                $('#container-load-more').attr('data-page', nextPageNumber);

                // When reach last page
                if (nextPageNumber >= totalPages) {
                    // Hide the load more button when gets to last page
                    $('#container-load-more').remove();
                }
            });
        }

    });
});