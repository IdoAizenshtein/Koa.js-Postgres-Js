$(function () {
    $(".filter-list > li").on("click", function () {
        $(this).toggleClass('active');
        var arrayValueFiltered = [];
        $(".filter-list > li").each(function () {
            var isActive = $(this).hasClass('active');
            var value = $(this).data('type');
            if (isActive) {
                arrayValueFiltered.push(value)
            }
        })
        // console.log(arrayValueFiltered);
        $(".categories-list > ul > li").filter(function () {
            if (arrayValueFiltered.length) {
                if (arrayValueFiltered.includes($(this).data('type'))) {
                    $(this).addClass('filtered').show();
                } else {
                    $(this).removeClass('filtered').hide();
                }
            } else {
                $(this).removeClass('filtered').show();
            }
        });
    });

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has('query')) {
        const query = urlParams.get('query');
        urlParams.delete("query");
        window.history.replaceState(null, null, window.location.pathname);

        $(".filter-list > li").each(function () {
            if (query === $(this).data('type')) {
                $(this).trigger("click");
                return false;
            }
        })
    }
});
