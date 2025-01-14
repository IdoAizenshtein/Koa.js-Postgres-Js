function loginOtpSender() {
    const mobile = $('#mobile').val();
    $('#alert').text('');

    if (mobile) {
        $('.loader-base').fadeIn();

        fetch(window.location.origin + '/login-otp-sender', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"mobile": Number(mobile)})
        }).then(r => {
                console.log("response.status =", r.status);
                return r.json();
            }
        ).then(r => {
            console.log(r)
            if (r.status === 200 && r.message_status === 'accepted') {
                $('#login-otp-sender').hide();
                $('#login-otp-auth').show();
                otpLoad();
            } else {
                $('#alert').text(r.message_status);
            }
            $('.loader-base').fadeOut();
        })
    } else {
        $('#alert').text('יש להזין מספר טלפון בשדה');
    }

}

function loginOtpAuth() {
    const mobile = $('#mobile').val();
    const otpCode = $('#otp').val();
    $('#alert-otp').text('');
    $('.loader-base').fadeIn();

    fetch(window.location.origin + '/login-otp-auth', {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"mobile": Number(mobile), "otpCode": otpCode})
    }).then(r => {
            console.log("response.status =", r.status);
            return r.json();
        }
    ).then(r => {
        console.log(r)
        $('.loader-base').fadeOut();
        if (r.status !== 200) {
            $('#alert-otp').text(r.message_status);
        } else {
            if (r.token) {
                window.JwtToken = r.token;
                window.subDomainLink = r.subDomainLink;
                $('body').addClass("hide-scroll");
                $(".popup-save-session").addClass('fadeFlex').fadeIn("slow", function () {

                });
                // setCrossSubdomainCookie("JwtToken", r.token);
            }
            if (r.companies) {
                let text = '';
                const hour = new Date().getHours();
                if (hour >= 5 && hour < 12) {
                    text = 'בוקר טוב'
                }
                if (hour >= 12 && hour < 18) {
                    text = 'צהריים טובים'
                }
                if (hour >= 18 && hour < 21) {
                    text = 'ערב טוב'
                }
                if (hour >= 21 || hour < 5) {
                    text = 'לילה טוב'
                }
                $(".popup-select-company h1").html(text + ', ' + r.firstName);


                let li = "";
                $(r.companies).each(function (index, data) {
                    li += '<li><input type="radio" id="' + data.id + '" name="select_company" value="' + data.id + '"/><label for="' + data.id + '">' + data.companyName + ' מספר ' + data.companyHP + '</label></li>';
                })
                $(".companies-list-select").html(li);

                $('input[type=radio][name=select_company]').on('change', function () {
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
        }
    })
}

function setCompany() {
    $('.loader-base').fadeIn();
    $(".popup-select-company").removeClass('fadeFlex').hide();
    const idOfSelectedCompany = $('input[name="select_company"]:checked').val();
    if (idOfSelectedCompany) {
        fetch(window.location.origin + '/login-set-company', {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"id": Number(idOfSelectedCompany)})
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
                if (r.token) {
                    window.JwtToken = r.token;
                    window.subDomainLink = r.subDomainLink;
                    $('body').addClass("hide-scroll");
                    $(".popup-save-session").addClass('fadeFlex').fadeIn("slow", function () {

                    });
                    // setCrossSubdomainCookie("JwtToken", r.token);
                }
            }
        })
    }
}

function setStorage(setLocalStorage) {
    $('body').removeClass("hide-scroll");
    $(".popup-save-session").removeClass('fadeFlex').hide();
    if (setLocalStorage) {
        setCrossSubdomainCookie("JwtTokenSession", "localStorage");
        window.localStorage.setItem('JwtToken', window.JwtToken);
    } else {
        setCrossSubdomainCookie("JwtTokenSession", "sessionStorage");
        window.sessionStorage.setItem('JwtToken', window.JwtToken);
    }
    const hostname = location.hostname.replace('www.', '');
    const port = location.port;
    const link = `${location.protocol}//${window.subDomainLink}.${hostname}${port !== '' ? ':' + port : ''}`;
    // console.log(link);
    window.location.replace(link + '/loader');
    // window.location.href = link + '/loader';
}

function initiateKeyboard() {
    setTimeout(() => {
        const inputs = document.getElementById("mobile")
        inputs.focus();
        // this.renderer2.removeChild(inputs, this.inputHelper);
    }, 180);
}


$(document).ready(function () {
    $('#login-otp-sender').show();
    $('#login-otp-auth').hide();
    $('#loginOtpSender').attr("disabled", true);
    $('#loginOtpAuth').attr("disabled", true);
    $("input#mobile").focus().click();

    // const el = document.getElementById("mobile")
    // el.focus();

    // const inputs = document.querySelectorAll(".mobile-input input#mobile");
    // $("input#mobile").trigger('focus')
    // const inputs = document.getElementById("mobile")
    // inputs.focus();
    // var $input = $("input#mobile");
    //
    // setTimeout(function() {
    //     $input.focus();
    // }, 100);


    // const inputHelper = document.createElement('input');
    // document.body.appendChild(inputs, inputHelper);
    // inputHelper.focus();

    // let event = new KeyboardEvent('touchstart',{'bubbles':true});
    // inputs.dispatchEvent(event);

    // focusTextInput(inputs);

    // setTimeout(()=> {
    //     inputs[0].focus();
    // },180);

    // const $input = $(inputs[0]);
    // $input.off('click').on('click', function () {
    //     $input.focus();
    // })
    // $input.trigger('click');


    $(".numbers").on("keyup", function () {
        let inputValue = $(this).val();
        if (inputValue) {
            inputValue = inputValue.replace(/\s/g, '');
        }
        console.log(inputValue)
        if (inputValue && (inputValue !== '573160437183') && (inputValue.length !== 10 || !inputValue.startsWith("0"))) {
            $('#loginOtpSender').attr("disabled", true);
        } else if (!inputValue) {
            $('#loginOtpSender').attr("disabled", true);
        } else {
            $('#loginOtpSender').attr("disabled", false);
        }
        $('#alert').text('');
    });
    $(".numbers").on("keypress", function (e) {
        $('#alert').text('');
        if (String.fromCharCode(e.keyCode).match(/[^0-9]/g)) return false;
    });
    $(".numbers").on("blur", function () {
        const val = $(this).val();
        if (val && (val !== '573160437183') && (val.length !== 10 || !val.startsWith("0"))) {
            $('#alert').text('יש להזין מספר טלפון תיקני');
            $('#loginOtpSender').attr("disabled", true);
        } else if (!val) {
            $('#alert').text('יש להזין מספר טלפון בשדה');
            $('#loginOtpSender').attr("disabled", true);
        } else {
            $('#loginOtpSender').attr("disabled", false);
            $('#alert').text('');
        }
    });

    $(".close-popup, .bg-popup").on("click", function (e) {
        $('body').removeClass("hide-scroll");

        $(".popup-video").removeClass('fadeFlex').hide();
        setStorage(false);
    });
})

function focusTextInput(el) {
    var __tempEl__ = document.createElement('input');
    __tempEl__.style.position = 'relative';
    __tempEl__.style.top = el.offsetTop + 'px';
    __tempEl__.style.left = el.offsetLeft + 'px';
    __tempEl__.style.height = 0 + '!important';
    __tempEl__.style.opacity = 0;
    el.after(__tempEl__);
    __tempEl__.focus()
    setTimeout(() => {
        el.focus()
        el.click()
        __tempEl__.remove()
    }, 50);
}

function otpLoad() {
    // try {
    //     const isBrowserSupport = () => window?.OTPCredential;
    //     if (isBrowserSupport) {
    //         const ac = new AbortController();
    //         setTimeout(() => {
    //             ac.abort();
    //         }, 60000);
    //         navigator.credentials
    //             .get({
    //                 otp: {transport: ["sms"]},
    //                 signal: ac.signal
    //             })
    //             .then((otp) => {
    //                 console.log(otp)
    //                 const otp_input = document.getElementById("otp")
    //                 otp_input.value = otp.code;
    //                 loginOtpAuth();
    //             })
    //             .catch((err) => {
    //                 console.error(err);
    //             });
    //     } else {
    //         console.log(isBrowserSupport);
    //     }
    // } catch (e) {
    //     console.error(e);
    // }

    const inputs = document.querySelectorAll("#otp-input input");
    const first_input = document.getElementById("first_input")
    focusTextInput(first_input);
    // const $input = $(inputs[0]);
    // $input.off('click').on('click', function () {
    //     $input.focus();
    // })
    // $input.trigger('click');
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];

        input.addEventListener("input", function () {
            // handling normal input
            if (input.value.length == 1 && i + 1 < inputs.length) {
                inputs[i + 1].focus();
            }

            // if a value is pasted, put each character to each of the next input
            if (input.value.length > 1) {
                // sanitise input
                if (isNaN(input.value)) {
                    input.value = "";
                    updateInput();
                    return;
                }

                // split characters to array
                const chars = input.value.split('');

                for (let pos = 0; pos < chars.length; pos++) {
                    // if length exceeded the number of inputs, stop
                    if (pos + i >= inputs.length) break;

                    // paste value
                    let targetInput = inputs[pos + i];
                    targetInput.value = chars[pos];
                }

                // focus the input next to the last pasted character
                let focus_index = Math.min(inputs.length - 1, i + chars.length);
                inputs[focus_index].focus();
            }
            updateInput();
        });

        input.addEventListener("keydown", function (e) {
            // backspace button
            if (e.keyCode == 8 && input.value == '' && i != 0) {
                // shift next values towards the left
                for (let pos = i; pos < inputs.length - 1; pos++) {
                    inputs[pos].value = inputs[pos + 1].value;
                }

                // clear previous box and focus on it
                inputs[i - 1].value = '';
                inputs[i - 1].focus();
                updateInput();
                return;
            }

            // delete button
            if (e.keyCode == 46 && i != inputs.length - 1) {
                // shift next values towards the left
                for (let pos = i; pos < inputs.length - 1; pos++) {
                    inputs[pos].value = inputs[pos + 1].value;
                }

                // clear the last box
                inputs[inputs.length - 1].value = '';
                input.select();
                e.preventDefault();
                updateInput();
                return;
            }

            // left button
            if (e.keyCode == 37) {
                if (i > 0) {
                    e.preventDefault();
                    inputs[i - 1].focus();
                    inputs[i - 1].select();
                }
                return;
            }

            // right button
            if (e.keyCode == 39) {
                if (i + 1 < inputs.length) {
                    e.preventDefault();
                    inputs[i + 1].focus();
                    inputs[i + 1].select();
                }
                return;
            }
        });
    }

    function updateInput() {
        let inputValue = Array.from(inputs).reduce(function (otp, input) {
            otp += (input.value.length) ? input.value : ' ';
            return otp;
        }, "");
        if (inputValue && inputValue.replace(/\s/g, "").length === 5) {
            $('#loginOtpAuth').attr("disabled", false);
        } else {
            $('#loginOtpAuth').attr("disabled", true);
        }
        document.querySelector("input[name=otp]").value = inputValue;
    }
}

