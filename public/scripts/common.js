(function () {
    // setTimeout(() => {
    //     alert("clientWidth: " + document.documentElement.clientWidth + " ,  outerWidth:" + window.outerWidth + " ,  iPad:" + iPad + iPad2)
    // }, 1000)
    const iPad = !!(navigator.userAgent.match(/(iPad)/)
        || (navigator.platform === "MacIntel" && typeof navigator.standalone !== "undefined"))

    const iPad2 = ((/\b(iPad)\b/.test(navigator.userAgent)
            && /WebKit/.test(navigator.userAgent)
            && !window.MSStream)
        || (navigator.platform === 'MacIntel'
            && navigator.maxTouchPoints
            && navigator.maxTouchPoints === 5)
    )
    if (iPad && iPad2) {
        $("body").addClass("iPad");
    }
    const logoutCookies = getCookie('logout');
    if (logoutCookies) {
        window.localStorage.removeItem('JwtToken');
        window.sessionStorage.removeItem('JwtToken');
        setCrossSubdomainCookie("logout", '');
    }
    $('#loader').fadeOut();
    const [, , subdomain] = window.location.hostname.split(".").reverse();
    if (subdomain && subdomain !== 'www') {
        const jwtTokenCookies = getCookie('JwtToken')
        if (jwtTokenCookies) {
            if (getCookie('JwtTokenSession') === 'localStorage') {
                window.localStorage.setItem('JwtToken', jwtTokenCookies);
            } else {
                window.sessionStorage.setItem('JwtToken', jwtTokenCookies);
            }
        }
        const JwtToken = window.localStorage.getItem('JwtToken') || window.sessionStorage.getItem('JwtToken');
        if (JwtToken) {
            setCrossSubdomainCookie("JwtToken", JwtToken);
            if (!jwtTokenCookies && (window.location.pathname !== '/loader')) {
                const hostname = location.hostname.replace('www.', '');
                const port = location.port;
                window.location = `${location.protocol}//${hostname}${port !== '' ? ':' + port : ''}`
            }
        }

        // const JwtToken = window.localStorage.getItem('JwtToken') || window.sessionStorage.getItem('JwtToken');
        // if(!jwtTokenCookies && JwtToken){
        //
        // }
        // if (JwtToken) {
        //     fetch(window.location.origin + '/token-verify', {
        //         headers: {
        //             'Authorization': 'Bearer ' + JwtToken,
        //         }
        //     }).then(r => {
        //             console.log("response.status =", r.status);
        //             if (r.status !== 200) {
        //                 window.localStorage.removeItem('JwtToken');
        //                 window.sessionStorage.removeItem('JwtToken');
        //                 const mainPath = window.location.origin.replace(subdomain + '.', '');
        //                 window.location.replace(mainPath);
        //                 return;
        //             }
        //             return r.text();
        //         }
        //     ).then(subDomainLink => {
        //         if (subDomainLink !== subdomain) {
        //             const mainPath = window.location.origin.replace(subdomain + '.', subDomainLink + '.');
        //             window.location.replace(mainPath);
        //         } else {
        //             $('#loader').fadeOut();
        //         }
        //     })
        // } else {
        //     const mainPath = window.location.origin.replace(subdomain + '.', '');
        //     window.location.replace(mainPath);
        // }
    } else {
        // if (subdomain && subdomain === 'www') {
        //     const mainPath = window.location.origin.replace('www.', '');
        //     window.location.replace(mainPath);
        //     return;
        // }
        const JwtToken = window.localStorage.getItem('JwtToken') || window.sessionStorage.getItem('JwtToken');
        if (JwtToken) {
            const jwtTokenCookies = getCookie('JwtToken')
            setCrossSubdomainCookie("JwtToken", JwtToken);

            const logoutCookies = getCookie('logout')
            if (logoutCookies) {
                setCrossSubdomainCookie("logout", '');
                window.localStorage.removeItem('JwtToken');
                window.sessionStorage.removeItem('JwtToken');
            }

            if (!jwtTokenCookies && (window.location.pathname !== '/loader')) {
                const hostname = location.hostname.replace('www.', '');
                const port = location.port;
                window.location = `${location.protocol}//${hostname}${port !== '' ? ':' + port : ''}`
            }
        }
    }
})();

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCrossSubdomainCookie(name, value) {
    const assign = name + "=" + (value ? encodeURIComponent(value) : "") + ";";
    const path = "path=/;";
    const domain = "domain=" + (document.domain.match(/[^\.]*\.[^.]*$/)[0]) + ";";
    document.cookie = assign + path + domain;
}

function logout() {
    setCrossSubdomainCookie("logout", 'true');
    window.localStorage.removeItem('JwtToken');
    window.sessionStorage.removeItem('JwtToken');
    window.location.href = '/logout';
}

(function updatePixelRatio() {
    matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
        .addEventListener('change', updatePixelRatio, {once: true});
    // console.log("devicePixelRatio: " + window.devicePixelRatio);
})();
$(function () {
    if (window.location.pathname === '/loader') {
        const port = location.port;
        const host = location.hostname.replace('www.', '').split('.')
        const domain = host.length > 1 ? host.slice(-2).join('.') : host[0]
        const link = `${location.protocol}//${domain}${port !== '' ? ':' + port : ''}`
        window.location.replace('/');

        // fetch(link).then((res) => res.text()).then((text) => {
        //     setTimeout(() => {
        //         window.location.replace('/');
        //     }, 3000)
        // })
    }

    $(window).resize(function () {
        calculateNewScale();
    });

    function calculateNewScale() {
        // const realWidth = window.innerWidth > window.outerWidth ? window.innerWidth : window.outerWidth;
        const realWidth = document.documentElement.clientWidth; // window.screen.width  $(window).width();
        const isTablet = realWidth <= 1024 && realWidth > 430;
        // console.log('realWidth: ', realWidth)
        // console.log('isTablet: ', isTablet)
        // const numCalc = window.innerWidth / window.outerWidth;
        // const calcZoom = realWidth <= 1024 ? 100 : (100 - ((((window.devicePixelRatio * 100) / 2) - 100) * numCalc));
        // document.body.style.zoom = calcZoom + '%';
        const zoom = Number((window.outerWidth / 1920).toFixed(3));
        const zoomTablet = Number((window.outerWidth / 1024).toFixed(3));
        document.body.style.zoom = realWidth <= 430 ? 1 : (isTablet ? zoomTablet : zoom);

        // setTimeout(function () {
        // const zoom = Number((window.outerWidth / 1920).toFixed(3));
        const numCalc = document.documentElement.clientWidth / window.outerWidth;
        const calcZoom = realWidth <= 430 ? 100 : (numCalc * 100);
        $(".body").css({
            "zoom": realWidth <= 430 ? 1 : calcZoom + '%'
        });
        // alert("window.outerWidth: " + window.outerWidth + "window.screen.width: " + window.screen.width + "$(window).width(): " + $(window).width() + "clientWidth: " + document.documentElement.clientWidth + " zoom: " + (realWidth <= 430 ? 1 : (isTablet ? zoomTablet : zoom)) + " , body_zoom:" + (realWidth <= 430 ? 1 : calcZoom + '%'))

        if (location.pathname === '/login') {
            document.body.style.height = realWidth <= 430 ? '100vh' : ((document.documentElement.clientHeight - 48) / (isTablet ? zoomTablet : zoom)) + 'px';

            $(".body").css({
                "height": '100%'
            });
            $(".main-login").css({
                "height": '100%'
            });
        }

        // let zoom = Math.ceil(((window.outerWidth) / window.innerWidth) * 100);
        // console.log(zoom)
        // if(zoom !== 100){
        //     const zoom = Number((window.outerWidth / 1920).toFixed(3));
        //     $(".body").css({
        //         "zoom": realWidth <= 1024 ? 1 : zoom
        //     });
        // }else{
        //     $(".body").css({
        //         "zoom": 1
        //     });
        // }
        // }, 10)

    }

    calculateNewScale();

    $(window).on('load', function () {
        $('#loader').fadeOut();
        console.log("window is loaded");
    });

    $("#dropdown-nav").on("click", function (e) {
        var posX = $('#dropdown-nav > svg').position().left,
            posY = $('#dropdown-nav > svg').position().top;
        // console.log(posX + ' , ' + posY);
        // $( ".block" ).animate({ "left": "+=50px" }, "slow" );
        $('#dropdown-nav > svg').toggleClass("rotate");
        if ($("#dropdown").css('display') == 'none') {
            if (navigator.platform === "MacIntel") {
                $("#dropdown").css({top: 68.4951, left: posX + 56}).show();
            } else {
                $("#dropdown").css({top: 68.4951, left: posX - 33}).show();
            }
        } else {
            $("#dropdown").hide();
        }
        // $("#dropdown").css({top: posY + 40, left: posX - 33}).slideToggle( "fast", function() {
        //     // Animation complete.
        // });
    });
    $(document).mouseup(function (e) {
        if ($(e.target).closest("#dropdown").length === 0 && !$(e.target).closest("#dropdown-nav").length) {
            $("#dropdown").hide();
        }
    });
    $("#open-nav-mobile").on("click", function (e) {
        $('#open-nav-mobile > .icon-Hamburger').toggleClass("icon-close");
        $("#nav-mobile").slideToggle("fast", function () {
            // Animation complete.
        });
    });
    $("#dropdown-nav-mobile").on("click", function (e) {
        $('#dropdown-nav-mobile > svg').toggleClass("rotate");
        $(".inline-nav-mobile").slideToggle("fast", function () {
            // Animation complete.
        });
    });
    $(".link-close").on("click", function (e) {
        $("#open-nav-mobile").trigger("click");
    });
    // let query5 = 'mutation ($myItemName: String!, $columnVals: JSON!) { create_item (board_id:1609924442,  item_name:$myItemName, column_values:$columnVals) { id } }';
    // let vars = {
    //     "myItemName" : "Hello, world!",
    //     "columnVals" : JSON.stringify({
    //         "status" : {"label" : "Done"},
    //         "date4" : {"date" : "1993-08-27"}
    //     })
    // };
    //
    // fetch ("https://api.monday.com/v2", {
    //     method: 'post',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization' : 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQyMzUxNTI2MSwiYWFpIjoxMSwidWlkIjo2NTM0NzAwNCwiaWFkIjoiMjAyNC0xMC0xNVQwMDoxNzo0OS45MzlaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjUxNDk1MDYsInJnbiI6ImV1YzEifQ.kKv7maqGsjaoEAityIsFeevG9t4d-I2oJ62oTtmylsc'
    //     },
    //     body: JSON.stringify({
    //         'query' : query5,
    //         'variables' : JSON.stringify(vars)
    //     })
    // })
    //     .then(res => res.json())
    //     .then(res => console.log(JSON.stringify(res, null, 2)));
});
