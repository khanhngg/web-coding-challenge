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
                // Append new users from next page
                $('#container-followers').append(result);

                // Update next page number
                $('#container-load-more').attr('data-page', nextPageNumber);

                // Hide the load more button when gets to last page
                if (nextPageNumber >= totalPages) {
                    $('#btn-load-more').hide();
                }

                // Update the text showing the number of results
                var numberOfResults = Number(currentPage) * 30;
                $('span#text-result').text('test');
            });
        }

    });
});