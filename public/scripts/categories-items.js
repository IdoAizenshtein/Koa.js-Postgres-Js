$(function () {
    $(".item-circle .arrow").on("click", function (e) {
        $('body').addClass("hide-scroll");

        $(".popup-video").addClass('fadeFlex').fadeIn("slow", function () {
            // Animation complete.
        });
    });

    $(".close-popup, .bg-popup").on("click", function (e) {
        $('body').removeClass("hide-scroll");

        $(".popup-video").removeClass('fadeFlex').hide();
        $(".popup-select-company").removeClass('fadeFlex').hide();
    });

    let vid = document.getElementById("video");
    vid.muted = true;
    vid.play();

    $(".load-video").on("click", function (e) {
        let vid = document.getElementById("video");

        if ($(this).hasClass("active")) {
            $(".load-video").removeClass("active");
            $(".video-content").removeClass("active");
            vid.pause();
        } else {
            // $(".img-expert-left > img").hide();
            // $(".img-expert-left > video").show();
            // $(".img-expert-left > video")[0].play();
            // vid.load();
            vid.currentTime = 0;
            vid.muted = false;
            vid.play();
            $(".load-video").addClass("active");
            $(".video-content").addClass("active");
        }
    });

    setTimeout(() => {
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
                    nav: false,
                    dots: true,
                    loop: true,
                    startPosition: 0
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
    }, 200)

});

function select_product(info) {
    window.selected_product = info;
    $('.product-name').text(info.packName);

    $('input[type=radio][name=select_time]').on('change', function () {
        if ($(this).val()) {
            $("#setCompany").prop(
                "disabled",
                false
            );
        } else {
            $("#setCompany").prop(
                "disabled",
                true
            );
        }
    });
    $('body').addClass("hide-scroll");
    $(".popup-select-company").addClass('fadeFlex').fadeIn("slow", function () {

    });
}

function select_time() {
    $('.loader-base').fadeIn();
    $(".popup-select-company").removeClass('fadeFlex').hide();
    const idOfSelectedTime = $('input[name="select_time"]:checked').val();
    if (idOfSelectedTime) {
        const {itemId, id, packPrice, commissionPrc} = window.selected_product;
        fetch(window.location.origin + '/set-lead-user-product', {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                itemId: Number(itemId),
                packId: Number(id),
                status: "lead",
                statusChangeDate: new Date(),
                timeToCall: idOfSelectedTime,
                price: Number(packPrice),
                accCommission: (Number(packPrice) / 100) * (commissionPrc ? commissionPrc : 0)
            })
        }).then(r => {
                console.log("response.status =", r.status);
                return r.json();
            }
        ).then(r => {
            console.log(r)
            $('.loader-base').fadeOut();
            if (r.status !== 200) {
                console.log(r.message_status);
                // $('#alert-otp').text(r.message_status);
            } else {
                window.selected_product = null;
                $('body').removeClass("hide-scroll");
                $('button#select_product_' + id).prop(
                    "disabled",
                    true
                );
            }
        })
    }
}
