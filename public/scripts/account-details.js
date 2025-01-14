$(function () {
    $(".account-details-tabs").tabs({
        active: 0
    });
    $(".close-popup, .bg-popup").on("click", function (e) {
        $('body').removeClass("hide-scroll");
        $(".popup-select-company").removeClass('fadeFlex disconnect').hide();
        $('#textarea-title').text("");
        $('.product-name').text("");
        $('#textarea-review').show();
    });
    // $('#textarea-review').on('keyup', function () {
    //     if ($(this).val()) {
    //         $("#setCompany").prop(
    //             "disabled",
    //             false
    //         );
    //     } else {
    //         $("#setCompany").prop(
    //             "disabled",
    //             true
    //         );
    //     }
    // });
    $(".open-bottom-nav").on("click", function (e) {
        $(this).toggleClass("active");
        $(this).next('.nav-popup').toggle();
    });
    $(".nav-popup li").on("click", function (e) {
        $(".nav-popup").hide();
        $(".open-bottom-nav").removeClass("active");
    });
    $(document).mouseup(function (e) {
        if ($(e.target).closest(".nav-popup").length === 0 && !$(e.target).closest(".nav-popup").length) {
            $(".nav-popup").hide();
            $(".open-bottom-nav").removeClass("active");
        }
    });
});

function openServiceCallModal(info) {
    info.type = 'openServiceCallModal';
    window.selected_product = info;
    $('#textarea-review').show();
    $('#textarea-title').text("פתיחת קריאת שירות");

    $('.product-name').html(
        "ביקשת לפתוח קריאת שירות על מוצר "
        +
        info.title
        + "<br class='mobile-hide'>" +
        " נשמח לשמוע קצת על הבעיה ונטפל בהקדם.");

    $('body').addClass("hide-scroll");
    $(".popup-select-company").addClass('fadeFlex').fadeIn("slow", function () {

    });
}

function openDisconnectModal(info) {
    info.type = 'openDisconnectModal';
    window.selected_product = info;
    $('#textarea-review').show();
    $('#textarea-title').text("זה סופי?");

    $('.product-name').html(
        "ביקשת להתנתק ממוצר "
        +
        info.title
        + ",<br class='mobile-hide'>" +
        " נשמח אם תוכל לפרט לנו מה הסיבה לכך");

    $('body').addClass("hide-scroll");
    $(".popup-select-company").addClass('fadeFlex').fadeIn("slow", function () {

    });
}

function setStatusUserProduct() {
    if (window.selected_product) {
        $('.loader-base').fadeIn();
        const textareaReview = $('#textarea-review').val();
        const {packId, type} = window.selected_product;
        let objData = {
            packId: Number(packId),
            divisionDesc: textareaReview,
        }
        if (type === 'openDisconnectModal') {
            objData['nextBillingDate'] = null;
            objData['status'] = "disconnect";
        } else {
            objData['status'] = "division";
        }
        fetch(window.location.origin + '/set-status-user-product', {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(objData)
        }).then(r => {
                console.log("response.status =", r.status);
                return r.json();
            }
        ).then(r => {
            console.log(r)
            $('.loader-base').fadeOut();
            if (type === 'openServiceCallModal') {
                $(".popup-select-company").removeClass('fadeFlex').hide();
            }
            if (r.status !== 200) {
                console.log(r.message_status);
                // $('#alert-otp').text(r.message_status);
            } else {
                if (type === 'openDisconnectModal') {
                    $('#textarea-review').hide();
                    $('.account-details-popup').addClass('disconnect');
                    $('#textarea-title').text("התנתקת בהצלחה");
                    $('.product-name').text("לא תחוייב יותר בעבור מוצר " + window.selected_product.title);
                    window.selected_product = null;
                } else {
                    $('#textarea-title').text("");
                    $('.product-name').text("");
                    window.selected_product = null;
                    $('body').removeClass("hide-scroll");
                    window.location.reload();
                }
            }
        })
    } else {
        $(".popup-select-company").removeClass('fadeFlex disconnect').hide();
        $('#textarea-review').show();
        $('body').removeClass("hide-scroll");
        window.location.reload();
    }
}
