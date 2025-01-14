$(function () {
    var isMobile = document.documentElement.clientWidth <= 430;
    $(".item-circle .arrow").on("click", function (e) {
        $('body').addClass("hide-scroll");
        const popup = $(this).data('popup');
        $(".flex-video h1").html(popup.supplierName);
        $(".flex-video p#sub_title").html(popup.titleDesc);
        $(".cvDesc p").html(popup.cvDesc);
        let li = "";
        $(popup.cv.split('~')).each(function (index, data) {
            li += "<li><p>" + data + "</p></li>";
        })
        $(".flex-video ul.list-items").html(li);

        li = "";
        $(popup.products).each(function (index, data) {
            li += "<button><a href='/categories/"+ data.itemId +"'><span>" + data.title + "</span></a></button>";
        })
        $(".flex-video .buttons").html(li);
        $(".flex-video img").attr('src', "/assets/images/" + popup.pictureName);

        // $(".flex-video video source").attr('src', "/assets/video/" + popup.video_link);
        // $(".flex-video video")[0].load();
        $(".popup-video").addClass('fadeFlex').fadeIn("slow", function () {
            // Animation complete.
        });
    });

    $(".close-popup, .bg-popup").on("click", function (e) {
        $('body').removeClass("hide-scroll");

        $(".popup-video").removeClass('fadeFlex').hide();
    });

    var id;
    $(window).resize(function () {
        clearTimeout(id);
        id = setTimeout(doneResizing, 500);
    });

    function doneResizing() {
        $(".jc-left").remove();
        $(".jc-right").remove();
        $(".jc-radio-list").remove();
        setTimeout(() => {
            // $(".products-banner-items .items").gScrollingCarousel({
            //     mouseScrolling: false,
            //     draggable: true,
            //     snapOnDrag: true,
            //     mobileNative: true,
            //     scrollAmount: 'single',
            //     showRadioButton: true
            // });
            // $(".top-five-banner-items .items").gScrollingCarousel({
            //     mouseScrolling: false,
            //     draggable: true,
            //     snapOnDrag: true,
            //     mobileNative: true,
            //     scrollAmount: 'single',
            //     showRadioButton: true
            // });
            if (document.documentElement.clientWidth <= 430 && !isMobile) {
                isMobile = true;
                var carousel = $(".ktrv").waterwheelCarousel({
                    // number tweeks to change apperance
                    startingItem: 1,   // item to place in the center of the carousel. Set to 0 for auto
                    separation: 132, // distance between items in carousel
                    separationMultiplier: 0.6, // multipled by separation distance to increase/decrease distance for each additional item
                    horizonOffset: 0,   // offset each item from the "horizon" by this amount (causes arching)
                    horizonOffsetMultiplier: 1,   // multipled by horizon offset to increase/decrease offset for each additional item
                    sizeMultiplier: 1, // determines how drastically the size of each item changes
                    opacityMultiplier: 1, // determines how drastically the opacity of each item changes
                    horizon: 0,   // how "far in" the horizontal/vertical horizon should be set from the container wall. 0 for auto
                    flankingItems: 1,   // the number of items visible on either side of the center

                    // // animation
                    // speed:                      500,      // speed in milliseconds it will take to rotate from one to the next
                    // animationEasing:            'linear', // the easing effect to use when animating
                    // quickerForFurther:          true,     // set to true to make animations faster when clicking an item that is far away from the center
                    // edgeFadeEnabled:            false,    // when true, items fade off into nothingness when reaching the edge. false to have them move behind the center image
                    //
                    // // misc
                    linkHandling: 2,                 // 1 to disable all (used for facebox), 2 to disable all but center (to link images out)
                    autoPlay: 2000,                 // indicate the speed in milliseconds to wait before autorotating. 0 to turn off. Can be negative
                    // orientation:                'horizontal',      // indicate if the carousel should be 'horizontal' or 'vertical'
                    // activeClassName:            'carousel-center', // the name of the class given to the current item in the center
                    // keyboardNav:                false,             // set to true to move the carousel with the arrow keys
                    // keyboardNavOverride:        true,              // set to true to override the normal functionality of the arrow keys (prevents scrolling)
                    // imageNav:                   true,              // clicking a non-center image will rotate that image to the center
                    //
                    // // preloader
                    preloadImages: true,  // disable/enable the image preloader.
                    forcedImageWidth: 260.674,     // specify width of all images; otherwise the carousel tries to calculate it
                    forcedImageHeight: 260.674,     // specify height of all images; otherwise the carousel tries to calculate it
                    //
                    // // callback functions
                    // movingToCenter:             $.noop, // fired when an item is about to move to the center position
                    // movedToCenter:              $.noop, // fired when an item has finished moving to the center
                    // clickedCenter:              $.noop, // fired when the center item has been clicked
                    // movingFromCenter:           $.noop, // fired when an item is about to leave the center position
                    // movedFromCenter:            $.noop  // fired when an item has finished moving from the center
                });
                $(".ktrv").on("swipeleft", function () {
                    carousel.next();
                });
                $(".ktrv").on("swiperight", function () {
                    carousel.prev();
                });
            }
            // $(".stories-items .items").gScrollingCarousel({
            //     mouseScrolling: true,
            //     draggable: true,
            //     snapOnDrag: true,
            //     mobileNative: true,
            //     scrollAmount: 'single',
            //     showRadioButton: true
            // });
        }, 200)
    }


    $(".jc-left").remove();
    $(".jc-right").remove();
    $(".jc-radio-list").remove();

    setTimeout(() => {
        // $(".products-banner-items .items").gScrollingCarousel({
        //     mouseScrolling: false,
        //     draggable: true,
        //     snapOnDrag: true,
        //     mobileNative: true,
        //     scrollAmount: 'single',
        //     showRadioButton: true
        // });
        // $(".top-five-banner-items .items").gScrollingCarousel({
        //     mouseScrolling: false,
        //     draggable: true,
        //     snapOnDrag: true,
        //     mobileNative: true,
        //     scrollAmount: 'single',
        //     showRadioButton: true
        // });
        // $(".stories-items .items").gScrollingCarousel({
        //     mouseScrolling: true,
        //     draggable: true,
        //     snapOnDrag: true,
        //     mobileNative: true,
        //     scrollAmount: 'single',
        //     showRadioButton: true
        // });
        $('.top-five-banner-items .items').owlCarousel({
            navText: ["<svg width=\"98\" height=\"98\" viewBox=\"0 0 98 98\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "    <g id=\"browse\">\n" +
            "        <g id=\"Ellipse 9\" filter=\"url(#filter0_d_280_55829)\">\n" +
            "            <circle cx=\"49\" cy=\"45\" r=\"32\" fill=\"white\"/>\n" +
            "        </g>\n" +
            "        <path id=\"Vector 7\" d=\"M41 30L58 45L41 60\" stroke=\"#77C2CC\" stroke-width=\"3\" stroke-linecap=\"round\"\n" +
            "              stroke-linejoin=\"round\"/>\n" +
            "    </g>\n" +
            "    <defs>\n" +
            "        <filter id=\"filter0_d_280_55829\" x=\"0.200001\" y=\"0.200001\" width=\"97.6\" height=\"97.6\"\n" +
            "                filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\">\n" +
            "            <feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/>\n" +
            "            <feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"\n" +
            "                           result=\"hardAlpha\"/>\n" +
            "            <feOffset dy=\"4\"/>\n" +
            "            <feGaussianBlur stdDeviation=\"8.4\"/>\n" +
            "            <feComposite in2=\"hardAlpha\" operator=\"out\"/>\n" +
            "            <feColorMatrix type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0\"/>\n" +
            "            <feBlend mode=\"normal\" in2=\"BackgroundImageFix\" result=\"effect1_dropShadow_280_55829\"/>\n" +
            "            <feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"effect1_dropShadow_280_55829\" result=\"shape\"/>\n" +
            "        </filter>\n" +
            "    </defs>\n" +
            "</svg>", "<svg width=\"98\" height=\"98\" viewBox=\"0 0 98 98\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "    <g id=\"browse\" filter=\"url(#filter0_d_280_55828)\">\n" +
            "        <rect x=\"17\" y=\"13\" width=\"64\" height=\"64\" rx=\"32\" fill=\"white\" shape-rendering=\"crispEdges\"/>\n" +
            "        <path id=\"Vector 7\" d=\"M55 30L38 45L55 60\" stroke=\"#77C2CC\" stroke-width=\"3\" stroke-linecap=\"round\"\n" +
            "              stroke-linejoin=\"round\"/>\n" +
            "    </g>\n" +
            "    <defs>\n" +
            "        <filter id=\"filter0_d_280_55828\" x=\"0.200001\" y=\"0.200001\" width=\"97.6\" height=\"97.6\"\n" +
            "                filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\">\n" +
            "            <feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/>\n" +
            "            <feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"\n" +
            "                           result=\"hardAlpha\"/>\n" +
            "            <feOffset dy=\"4\"/>\n" +
            "            <feGaussianBlur stdDeviation=\"8.4\"/>\n" +
            "            <feComposite in2=\"hardAlpha\" operator=\"out\"/>\n" +
            "            <feColorMatrix type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0\"/>\n" +
            "            <feBlend mode=\"normal\" in2=\"BackgroundImageFix\" result=\"effect1_dropShadow_280_55828\"/>\n" +
            "            <feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"effect1_dropShadow_280_55828\" result=\"shape\"/>\n" +
            "        </filter>\n" +
            "    </defs>\n" +
            "</svg>"],
            loop: false,
            rtl: true,
            nav: true,
            margin: 0,
            autoWidth: false,
            responsiveClass: true,
            responsive: {
                0: {
                    rtl: true,
                    items: 1,
                    nav: false,
                    dots: true,
                    loop: false,
                    stagePadding: 35,
                    margin: 0,
                    autoWidth: false,
                },
                395: {
                    rtl: true,
                    items: 1,
                    nav: false,
                    dots: true,
                    loop: false,
                    stagePadding: 50,
                    margin: 0,
                    autoWidth: false,
                },
                431: {
                    rtl: true,
                    center: false,
                    startPosition: 0,
                    stagePadding: 100,
                    items: 2.1,
                    nav: true,
                    dots: false,
                    margin: 0,
                    loop: false,
                    autoWidth: false,
                },
                1025: {
                    rtl: true,
                    center: false,
                    startPosition: 0,
                    stagePadding: 130,
                    items: 3,
                    nav: true,
                    dots: false,
                    margin: 0,
                    loop: false,
                    autoWidth: false,
                }
            }
        })
        $('.products-banner-items .items').owlCarousel({
            navText: ["<svg width=\"14\" height=\"25\" viewBox=\"0 0 14 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "<path d=\"M1.375 0.980956L12.625 12.231L1.375 23.481\" stroke=\"#CCC8C3\" stroke-width=\"1.23077\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
            "</svg>", "<svg width=\"14\" height=\"25\" viewBox=\"0 0 14 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "<path d=\"M12.625 23.481L1.375 12.231L12.625 0.980957\" stroke=\"#CCC8C3\" stroke-width=\"1.23077\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
            "</svg>"],
            loop: false,
            rtl: true,
            nav: true,
            margin: 0,
            autoWidth: false,
            responsiveClass: true,
            responsive: {
                0: {
                    rtl: true,
                    items: 2,
                    nav: true,
                    dots: true,
                    margin: 6,
                    autoWidth: false,
                    stagePadding: 40,
                    center: false,
                    startPosition: 0,
                },
                // 600:{
                //     rtl: true,
                //     items:4,
                //     nav:true,
                //     dots: true,
                //     margin: 6,
                //     autoWidth:false,
                //     stagePadding: 0,
                //     center:false,
                //     startPosition: 0,
                // },
                430: {
                    rtl: true,
                    items: 5,
                    loop: false,
                    nav: true,
                    dots: false,
                    margin: 24,
                    autoWidth: true,
                    stagePadding: 0,
                    center: false,
                    startPosition: 0,
                }
            }
        })
        $('.stories-items .items').owlCarousel({
            navText: ["<svg width=\"98\" height=\"98\" viewBox=\"0 0 98 98\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "    <g id=\"browse\">\n" +
            "        <g id=\"Ellipse 9\" filter=\"url(#filter0_d_280_55829)\">\n" +
            "            <circle cx=\"49\" cy=\"45\" r=\"32\" fill=\"white\"/>\n" +
            "        </g>\n" +
            "        <path id=\"Vector 7\" d=\"M41 30L58 45L41 60\" stroke=\"#77C2CC\" stroke-width=\"3\" stroke-linecap=\"round\"\n" +
            "              stroke-linejoin=\"round\"/>\n" +
            "    </g>\n" +
            "    <defs>\n" +
            "        <filter id=\"filter0_d_280_55829\" x=\"0.200001\" y=\"0.200001\" width=\"97.6\" height=\"97.6\"\n" +
            "                filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\">\n" +
            "            <feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/>\n" +
            "            <feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"\n" +
            "                           result=\"hardAlpha\"/>\n" +
            "            <feOffset dy=\"4\"/>\n" +
            "            <feGaussianBlur stdDeviation=\"8.4\"/>\n" +
            "            <feComposite in2=\"hardAlpha\" operator=\"out\"/>\n" +
            "            <feColorMatrix type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0\"/>\n" +
            "            <feBlend mode=\"normal\" in2=\"BackgroundImageFix\" result=\"effect1_dropShadow_280_55829\"/>\n" +
            "            <feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"effect1_dropShadow_280_55829\" result=\"shape\"/>\n" +
            "        </filter>\n" +
            "    </defs>\n" +
            "</svg>", "<svg width=\"98\" height=\"98\" viewBox=\"0 0 98 98\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "    <g id=\"browse\" filter=\"url(#filter0_d_280_55828)\">\n" +
            "        <rect x=\"17\" y=\"13\" width=\"64\" height=\"64\" rx=\"32\" fill=\"white\" shape-rendering=\"crispEdges\"/>\n" +
            "        <path id=\"Vector 7\" d=\"M55 30L38 45L55 60\" stroke=\"#77C2CC\" stroke-width=\"3\" stroke-linecap=\"round\"\n" +
            "              stroke-linejoin=\"round\"/>\n" +
            "    </g>\n" +
            "    <defs>\n" +
            "        <filter id=\"filter0_d_280_55828\" x=\"0.200001\" y=\"0.200001\" width=\"97.6\" height=\"97.6\"\n" +
            "                filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\">\n" +
            "            <feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/>\n" +
            "            <feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"\n" +
            "                           result=\"hardAlpha\"/>\n" +
            "            <feOffset dy=\"4\"/>\n" +
            "            <feGaussianBlur stdDeviation=\"8.4\"/>\n" +
            "            <feComposite in2=\"hardAlpha\" operator=\"out\"/>\n" +
            "            <feColorMatrix type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0\"/>\n" +
            "            <feBlend mode=\"normal\" in2=\"BackgroundImageFix\" result=\"effect1_dropShadow_280_55828\"/>\n" +
            "            <feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"effect1_dropShadow_280_55828\" result=\"shape\"/>\n" +
            "        </filter>\n" +
            "    </defs>\n" +
            "</svg>"],
            loop: false,
            rtl: true,
            nav: true,
            margin: 24,
            autoWidth: false,
            responsiveClass: true,
            responsive: {
                0: {
                    rtl: true,
                    items: 1,
                    startPosition: 0,
                    nav: false,
                    dots: true,
                    loop: true
                },
                431: {
                    rtl: true,
                    center: false,
                    startPosition: 0,
                    stagePadding: 230,
                    items: 1,
                    nav: true,
                    dots: false,
                    margin: 24,
                    loop: true,
                    autoWidth: false,
                },
                1025: {
                    rtl: true,
                    center: false,
                    startPosition: 0,
                    stagePadding: 400,
                    items: 2,
                    nav: true,
                    dots: false,
                    margin: 24,
                    loop: true,
                    autoWidth: false,
                }
            },
            // autoWidth:true,
            // items:4
        })

        if (isMobile) {
            var carousel = $(".ktrv").waterwheelCarousel({
                // number tweeks to change apperance
                startingItem: 1,   // item to place in the center of the carousel. Set to 0 for auto
                separation: 132, // distance between items in carousel
                separationMultiplier: 0.6, // multipled by separation distance to increase/decrease distance for each additional item
                horizonOffset: 0,   // offset each item from the "horizon" by this amount (causes arching)
                horizonOffsetMultiplier: 1,   // multipled by horizon offset to increase/decrease offset for each additional item
                sizeMultiplier: 1, // determines how drastically the size of each item changes
                opacityMultiplier: 1, // determines how drastically the opacity of each item changes
                horizon: 0,   // how "far in" the horizontal/vertical horizon should be set from the container wall. 0 for auto
                flankingItems: 1,   // the number of items visible on either side of the center

                // // animation
                // speed:                      500,      // speed in milliseconds it will take to rotate from one to the next
                // animationEasing:            'linear', // the easing effect to use when animating
                // quickerForFurther:          true,     // set to true to make animations faster when clicking an item that is far away from the center
                // edgeFadeEnabled:            false,    // when true, items fade off into nothingness when reaching the edge. false to have them move behind the center image
                //
                // // misc
                linkHandling: 2,                 // 1 to disable all (used for facebox), 2 to disable all but center (to link images out)
                autoPlay: 2000,                 // indicate the speed in milliseconds to wait before autorotating. 0 to turn off. Can be negative
                // orientation:                'horizontal',      // indicate if the carousel should be 'horizontal' or 'vertical'
                // activeClassName:            'carousel-center', // the name of the class given to the current item in the center
                // keyboardNav:                false,             // set to true to move the carousel with the arrow keys
                // keyboardNavOverride:        true,              // set to true to override the normal functionality of the arrow keys (prevents scrolling)
                // imageNav:                   true,              // clicking a non-center image will rotate that image to the center
                //
                // // preloader
                preloadImages: true,  // disable/enable the image preloader.
                forcedImageWidth: 260.674,     // specify width of all images; otherwise the carousel tries to calculate it
                forcedImageHeight: 260.674,     // specify height of all images; otherwise the carousel tries to calculate it
                //
                // // callback functions
                // movingToCenter:             $.noop, // fired when an item is about to move to the center position
                // movedToCenter:              $.noop, // fired when an item has finished moving to the center
                // clickedCenter:              $.noop, // fired when the center item has been clicked
                // movingFromCenter:           $.noop, // fired when an item is about to leave the center position
                // movedFromCenter:            $.noop  // fired when an item has finished moving from the center
            });
            $(".ktrv").on("swipeleft", function () {
                carousel.next();
            });
            $(".ktrv").on("swiperight", function () {
                carousel.prev();
            });
        }


    }, 200)

});
