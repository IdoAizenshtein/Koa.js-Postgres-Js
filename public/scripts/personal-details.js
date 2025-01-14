const validRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

$(function () {
    if ($(".account-details-tabs").length) {
        $(".account-details-tabs").tabs({
            active: 0,
            activate: function (event, ui) {
                const idTab = $('.companies-select li.ui-tabs-active').attr('aria-controls');
                const data_city = $('#city_dropdown_' + idTab).val();
                if (data_city) {
                    const getCityName = window.cities.find(city => city.city.includes(data_city));
                    if (getCityName) {
                        $('#dropdownDisplayCity_' + idTab).text(getCityName.city);
                        $('#city_dropdown_' + idTab).val(getCityName.city);
                        $('#dropdownListCities_' + idTab + ' li').removeClass('selected')
                        $(`#dropdownListCities_${idTab} li[data-code='${getCityName.code}']`).addClass('selected');
                    }
                    liCity = $('#dropdownListCities_' + idTab + ' li');
                    liSelectedCity = $('#dropdownListCities_' + idTab + ' li.selected');
                }
            }
        });
    }

    const userType = $('#userType').val();

    const checkValidate = validateForms(userType);
    if (userType === 'accountant') {
        if (!checkValidate) {
            $('#submitButton').attr("disabled", true);
        } else {
            $('#submitButton').attr("disabled", false);
        }
        $("#accountNumber").on("keypress", function (e) {
            if (String.fromCharCode(e.keyCode).match(/[^0-9]/g)) return false;
        });
        [
            'firstName',
            'lastName',
            'mail',
            'address',
            'city_dropdown',
            'firstName_accountant',
            'lastName_accountant'
        ].forEach((elem) => {
            $('#' + elem).on('keyup', function () {
                if (validateField(userType, elem === 'city_dropdown' ? 'city' : elem)) {
                    $(this).removeClass('error');
                } else {
                    $(this).addClass('error');
                }
                runSubmitButtonValid();
            });
            $('#' + elem).trigger('keyup');
        })
    }
    if (userType === 'customer') {
        $('.companies-select li.ui-tabs-tab').each((index, el) => {
            const idTab = $(el).attr('aria-controls');
            // const idTab = $('.companies-select li.ui-tabs-active').attr('aria-controls');
            if (!checkValidate) {
                $('#submitButton_' + idTab).attr("disabled", true);
            } else {
                $('#submitButton_' + idTab).attr("disabled", false);
            }
            [
                'firstName',
                'lastName',
                'mail',
                'address',
                'city_dropdown',
                'companyHP',
                'companyName'
            ].forEach((elem) => {
                if (elem === 'companyHP') {
                    $("#companyHP_" + idTab).on("keypress", function (e) {
                        if (String.fromCharCode(e.keyCode).match(/[^0-9]/g)) return false;
                    });
                }
                $('#' + elem + '_' + idTab).on('keyup', function () {
                    if (validateField(userType, elem === 'city_dropdown' ? 'city' : elem, idTab)) {
                        $(this).removeClass('error');
                    } else {
                        $(this).addClass('error');
                    }
                    runSubmitButtonValid();
                });
                $('#' + elem + '_' + idTab).trigger('keyup');
            })
        })
    }

    function runSubmitButtonValid() {
        if (userType === 'accountant') {
            if (!validateForms(userType)) {
                $('#submitButton').attr("disabled", true);
            } else {
                $('#submitButton').attr("disabled", false);
            }
        }
        if (userType === 'customer') {
            $('.companies-select li.ui-tabs-tab').each((index, el) => {
                const idTab = $(el).attr('aria-controls');
                // const idTab = $('.companies-select li.ui-tabs-active').attr('aria-controls');
                if (!validateForms(userType)) {
                    $('#submitButton_' + idTab).attr("disabled", true);
                } else {
                    $('#submitButton_' + idTab).attr("disabled", false);
                }
            })
        }
    }


    var liBank = $('#dropdownList li');
    var liBranch = $('#dropdownList2 li');
    var liSelectedBank;
    var liSelectedBranch;
    var liCity = $('#dropdownListCities li');
    var liSelectedCity;
    if ($('#dropdownList').length) {
        $.ajax({
            url: 'https://data.gov.il/api/3/action/datastore_search?resource_id=1c5bc716-8210-4ec7-85be-92e6271955c2',
            success: function (data) {
                // console.log(data.result.records)
                const result = Object.groupBy(data.result.records, ({Bank_Code}) => Bank_Code);
                // console.log(result)
                let banks = []
                Object.values(result).forEach((v) => {
                    banks.push({
                        Bank_Code: v[0].Bank_Code,
                        Bank_Name: v[0].Bank_Name
                    })
                    $('#dropdownList').append("<li data-code='" + v[0].Bank_Code + "'>" + v[0].Bank_Name + "</li>")
                })
                // console.log(banks)
                window.records_banks = result;
                liBank = $('#dropdownList li');

                const data_bank = window.data_bank;
                if (data_bank && data_bank.Bank_Code) {
                    const getBankName = banks.find(bank => bank.Bank_Code === Number(data_bank.Bank_Code));
                    $('#dropdownDisplay').text(getBankName.Bank_Name);
                    $('#bank_dropdown').val(data_bank.Bank_Code);
                    $('#dropdownList li').removeClass('selected')
                    $(`#dropdownList li[data-code='${data_bank.Bank_Code}']`).addClass('selected');
                    // console.log(window.records_banks[data_bank.Bank_Code])
                    liBank = $('#dropdownList li');
                    liSelectedBank = $('#dropdownList li.selected');

                    if (data_bank.Branch_Code) {
                        window.records_banks[data_bank.Bank_Code].sort((a, b) => a.Branch_Code - b.Branch_Code);
                        $("#dropdownList2 li").remove();
                        window.records_banks[data_bank.Bank_Code].forEach((v) => {
                            $('#dropdownList2').append("<li data-code='" + v.Branch_Code + "'>" + v.Branch_Code + ' - ' + v.Branch_Name + "</li>")
                        })
                        const getBranchName = window.records_banks[data_bank.Bank_Code].find(branch => branch.Branch_Code === Number(data_bank.Branch_Code));
                        $('#dropdownDisplay2').text(getBranchName.Branch_Code + ' - ' + getBranchName.Branch_Name);
                        $('#branch_dropdown').val(getBranchName.Branch_Code);
                        $('#dropdownList2 li').removeClass('selected')
                        $(`#dropdownList2 li[data-code='${getBranchName.Branch_Code}']`).addClass('selected');
                        liBranch = $('#dropdownList2 li');
                        liSelectedBranch = $('#dropdownList2 li.selected');
                    }
                }

            }
        });
    }

    if ($('.dropdownListCities').length) {
        $.ajax({
            url: 'https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba',
            success: function (data) {
                // console.log(data.result.records)
                // const result = Object.groupBy(data.result.records, ({Bank_Code}) => Bank_Code);
                // console.log(result)
                data.result.records.sort(function (a, b) {
                    return a['שם_ישוב'].localeCompare(b['שם_ישוב']);
                })
                window.cities = data.result.records.map((record) => {
                    return {
                        'city': record['שם_ישוב'].trim(),
                        'code': record['_id']
                    }
                });
                data.result.records.forEach((v) => {
                    $('.dropdownListCities').append("<li data-code='" + v['_id'] + "'>" + v['שם_ישוב'].trim() + "</li>")
                })
                if (!$('.companies-select li.ui-tabs-active').length) {
                    const data_city = $('#city_dropdown').val();
                    if (data_city) {
                        const getCityName = window.cities.find(city => city.city.includes(data_city));
                        if (getCityName) {
                            $('#dropdownDisplayCity').text(getCityName.city);
                            $('#city_dropdown').val(getCityName.city);
                            $('#dropdownListCities li').removeClass('selected')
                            $(`#dropdownListCities li[data-code='${getCityName.code}']`).addClass('selected');
                        }
                        liCity = $('#dropdownListCities li');
                        liSelectedCity = $('#dropdownListCities li.selected');
                    }
                } else {
                    $('.companies-select li.ui-tabs-tab').each((index, el) => {
                        const idTab = $(el).attr('aria-controls');
                        $('#dropdownDisplayCity_' + idTab).on('click', function () {
                            const selected = $('#dropdownListCities_' + idTab + ' li.selected');
                            if (selected.length) {
                                const index = selected.index();
                                $("#dropdownListCities_" + idTab).animate({
                                    scrollTop: 34 * index
                                }, 10);
                            } else {
                                $("#dropdownListCities_" + idTab).animate({
                                    scrollTop: 0
                                }, 10);
                            }
                            $('#dropdownContent').hide();
                            $('#dropdownContent2').hide();
                            $('#dropdownContentCity_' + idTab).toggle();
                        });
                        $('#searchInputCity_' + idTab).on('input', function () {
                            let value = $(this).val().toLowerCase();
                            $('#dropdownListCities_' + idTab + ' li').filter(function () {
                                $(this).toggle($(this).text()
                                    .toLowerCase().indexOf(value) > -1);
                            });
                            liCity = $('#dropdownListCities_' + idTab + ' li');
                            liSelectedCity = $('#dropdownListCities_' + idTab + ' li.selected');
                        });
                        $('#dropdownListCities_' + idTab).on('click', 'li', function () {
                            $('#dropdownListCities_' + idTab + ' li').removeClass('selected')
                            $(this).addClass('selected');
                            $('#dropdownDisplayCity_' + idTab).text($(this).text());
                            $('#city_dropdown_' + idTab).val($(this).text());
                            liSelectedCity = $('#dropdownListCities_' + idTab + ' li.selected');
                            $('#dropdownContentCity_' + idTab).hide();
                            $('#city_dropdown_' + idTab).removeClass('error');
                            runSubmitButtonValid();
                        });
                    })
                    const idTab = $('.companies-select li.ui-tabs-active').attr('aria-controls');
                    const data_city = $('#city_dropdown_' + idTab).val();
                    if (data_city) {
                        const getCityName = window.cities.find(city => city.city.includes(data_city));
                        if (getCityName) {
                            $('#dropdownDisplayCity_' + idTab).text(getCityName.city);
                            $('#city_dropdown_' + idTab).val(getCityName.city);
                            $('#dropdownListCities_' + idTab + ' li').removeClass('selected')
                            $(`#dropdownListCities_${idTab} li[data-code='${getCityName.code}']`).addClass('selected');
                        }
                        liCity = $('#dropdownListCities_' + idTab + ' li');
                        liSelectedCity = $('#dropdownListCities_' + idTab + ' li.selected');
                    }
                }


            }
        });
    }
    $(window).on("keydown", function (e) {
        if (e.which === 13) {
            if ($('#dropdownList').is(":visible")) {
                $('#dropdownList li.selected').trigger('click');
            }
            if ($('#dropdownList2').is(":visible")) {
                $('#dropdownList2 li.selected').trigger('click');
            }
            if ($('#dropdownListCities').is(":visible")) {
                $('#dropdownListCities li.selected').trigger('click');
            }
        }
        if (e.which === 40) {
            if ($('#dropdownList').is(":visible")) {
                e.preventDefault();
                if (liSelectedBank) {
                    liSelectedBank.removeClass('selected');
                    // next = liSelectedBank.next();
                    next = liSelectedBank.nextAll('li:visible').first();
                    if (next.length > 0) {
                        liSelectedBank = next.addClass('selected');
                    } else {
                        liSelectedBank = liBank.eq(0).addClass('selected');
                    }
                } else {
                    liSelectedBank = liBank.eq(0).addClass('selected');
                }

                var elHeight = 34;
                var scrollTop = $('#dropdownList').scrollTop();
                var viewport = scrollTop + $('#dropdownList').height();
                var elOffset = elHeight * liSelectedBank.index();
                if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                    $("#dropdownList").animate({
                        scrollTop: elOffset
                    }, 10);
                }

            }

            if ($('#dropdownList2').is(":visible")) {
                e.preventDefault();
                if (liSelectedBranch) {
                    liSelectedBranch.removeClass('selected');
                    // next2 = liSelectedBranch.next();
                    next2 = liSelectedBranch.nextAll('li:visible').first();
                    if (next2.length > 0) {
                        liSelectedBranch = next2.addClass('selected');
                    } else {
                        liSelectedBranch = liBranch.eq(0).addClass('selected');
                    }
                } else {
                    liSelectedBranch = liBranch.eq(0).addClass('selected');
                }
                var elHeight = 34;
                var scrollTop = $('#dropdownList2').scrollTop();
                var viewport = scrollTop + $('#dropdownList2').height();
                var elOffset = elHeight * liSelectedBranch.index();
                if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                    $("#dropdownList2").animate({
                        scrollTop: elOffset
                    }, 10);
                }
            }

            if ($('#dropdownListCities').is(":visible")) {
                e.preventDefault();
                if (liSelectedCity) {
                    liSelectedCity.removeClass('selected');
                    next3 = liSelectedCity.nextAll('li:visible').first();
                    if (next3.length > 0) {
                        liSelectedCity = next3.addClass('selected');
                    } else {
                        liSelectedCity = liCity.eq(0).addClass('selected');
                    }
                } else {
                    liSelectedCity = liCity.eq(0).addClass('selected');
                }
                var elHeight = 34;
                var scrollTop = $('#dropdownListCities').scrollTop();
                var viewport = scrollTop + $('#dropdownListCities').height();
                var elOffset = elHeight * liSelectedCity.index();
                if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                    $("#dropdownListCities").animate({
                        scrollTop: elOffset
                    }, 10);
                }
            }
        } else if (e.which === 38) {
            if ($('#dropdownList').is(":visible")) {
                e.preventDefault();

                if (liSelectedBank) {
                    liSelectedBank.removeClass('selected');
                    // next = liSelectedBank.prev();
                    next = liSelectedBank.prevAll('li:visible').first();

                    if (next.length > 0) {
                        liSelectedBank = next.addClass('selected');
                    } else {
                        liSelectedBank = liBank.last().addClass('selected');
                    }
                } else {
                    liSelectedBank = liBank.last().addClass('selected');
                }

                var elHeight = 34;
                var scrollTop = $('#dropdownList').scrollTop();
                var viewport = scrollTop + $('#dropdownList').height();
                var elOffset = elHeight * liSelectedBank.index();
                if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                    $("#dropdownList").animate({
                        scrollTop: elOffset
                    }, 10);
                }
            }

            if ($('#dropdownList2').is(":visible")) {
                e.preventDefault();

                if (liSelectedBranch) {
                    liSelectedBranch.removeClass('selected');
                    // next2 = liSelectedBranch.prev();
                    next2 = liSelectedBranch.prevAll('li:visible').first();

                    if (next2.length > 0) {
                        liSelectedBranch = next2.addClass('selected');
                    } else {
                        liSelectedBranch = liBranch.last().addClass('selected');
                    }
                } else {
                    liSelectedBranch = liBranch.last().addClass('selected');
                }

                var elHeight = 34;
                var scrollTop = $('#dropdownList2').scrollTop();
                var viewport = scrollTop + $('#dropdownList2').height();
                var elOffset = elHeight * liSelectedBranch.index();
                if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                    $("#dropdownList2").animate({
                        scrollTop: elOffset
                    }, 10);
                }
            }

            if ($('#dropdownListCities').is(":visible")) {
                e.preventDefault();

                if (liSelectedCity) {
                    liSelectedCity.removeClass('selected');
                    next3 = liSelectedCity.prevAll('li:visible').first();

                    if (next3.length > 0) {
                        liSelectedCity = next3.addClass('selected');
                    } else {
                        liSelectedCity = liCity.last().addClass('selected');
                    }
                } else {
                    liSelectedCity = liCity.last().addClass('selected');
                }

                var elHeight = 34;
                var scrollTop = $('#dropdownListCities').scrollTop();
                var viewport = scrollTop + $('#dropdownListCities').height();
                var elOffset = elHeight * liSelectedCity.index();
                if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                    $("#dropdownListCities").animate({
                        scrollTop: elOffset
                    }, 10);
                }
            }
        }

        if ($('.companies-select li.ui-tabs-active').length) {
            const idTab = $('.companies-select li.ui-tabs-active').attr('aria-controls');
            if (e.which === 13) {
                if ($('#dropdownListCities_' + idTab).is(":visible")) {
                    $('#dropdownListCities_' + idTab + ' li.selected').trigger('click');
                }
            }
            if (e.which === 40) {
                if ($('#dropdownListCities_' + idTab).is(":visible")) {
                    e.preventDefault();
                    if (liSelectedCity) {
                        liSelectedCity.removeClass('selected');
                        next3 = liSelectedCity.nextAll('li:visible').first();
                        if (next3.length > 0) {
                            liSelectedCity = next3.addClass('selected');
                        } else {
                            liSelectedCity = liCity.eq(0).addClass('selected');
                        }
                    } else {
                        liSelectedCity = liCity.eq(0).addClass('selected');
                    }
                    var elHeight = 34;
                    var scrollTop = $('#dropdownListCities_' + idTab).scrollTop();
                    var viewport = scrollTop + $('#dropdownListCities_' + idTab).height();
                    var elOffset = elHeight * liSelectedCity.index();
                    if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                        $("#dropdownListCities_" + idTab).animate({
                            scrollTop: elOffset
                        }, 10);
                    }
                }
            } else if (e.which === 38) {
                if ($('#dropdownListCities_' + idTab).is(":visible")) {
                    e.preventDefault();

                    if (liSelectedCity) {
                        liSelectedCity.removeClass('selected');
                        next3 = liSelectedCity.prevAll('li:visible').first();

                        if (next3.length > 0) {
                            liSelectedCity = next3.addClass('selected');
                        } else {
                            liSelectedCity = liCity.last().addClass('selected');
                        }
                    } else {
                        liSelectedCity = liCity.last().addClass('selected');
                    }

                    var elHeight = 34;
                    var scrollTop = $('#dropdownListCities_' + idTab).scrollTop();
                    var viewport = scrollTop + $('#dropdownListCities_' + idTab).height();
                    var elOffset = elHeight * liSelectedCity.index();
                    if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
                        $("#dropdownListCities_" + idTab).animate({
                            scrollTop: elOffset
                        }, 10);
                    }
                }
            }
        }
    });
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.search-dropdown').length) {
            $('#dropdownContent').hide();
            $('#dropdownContent2').hide();
            $('#dropdownContentCity').hide();
            if ($('.companies-select li.ui-tabs-active').length) {
                const idTab = $('.companies-select li.ui-tabs-active').attr('aria-controls');
                $('#dropdownContentCity_' + idTab).hide();
            }
        }
    });
    $('#dropdownDisplay').on('click', function () {
        const selected = $('#dropdownList li.selected');
        if (selected.length) {
            const index = selected.index();
            $("#dropdownList").animate({
                scrollTop: 34 * index
            }, 10);
        }
        $('#dropdownContent2').hide();
        $('#dropdownContent').toggle();

    });

    $('#searchInput').on('input', function () {
        let value = $(this).val().toLowerCase();
        $('#dropdownList li').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
        liBank = $('#dropdownList li');
        liSelectedBank = $('#dropdownList li.selected');
    });

    $('#dropdownList').on('click', 'li', function () {
        $('#dropdownList li').removeClass('selected')
        $(this).addClass('selected');
        liBank = $('#dropdownList li');
        liSelectedBank = $('#dropdownList li.selected');

        $('#dropdownDisplay').text($(this).text());
        $('#bank_dropdown').val($(this).data('code'));
        window.records_banks[$(this).data('code')].sort((a, b) => a.Branch_Code - b.Branch_Code);
        console.log(window.records_banks[$(this).data('code')])
        $("#dropdownList2 li").remove();
        window.records_banks[$(this).data('code')].forEach((v) => {
            $('#dropdownList2').append("<li data-code='" + v.Branch_Code + "'>" + v.Branch_Code + ' - ' + v.Branch_Name + "</li>")
        })

        liBranch = $('#dropdownList2 li');
        liSelectedBranch = $('#dropdownList2 li.selected');
        $('#dropdownDisplay2').text('בחר סניף');
        $('#branch_dropdown').val('');
        $('#dropdownList2 li').removeClass('selected')
        $('#dropdownContent').hide();
    });

    $('#dropdownDisplay2').on('click', function () {
        const selected = $('#dropdownList2 li.selected');
        if (selected.length) {
            const index = selected.index();
            $("#dropdownList2").animate({
                scrollTop: 34 * index
            }, 10);
        } else {
            $("#dropdownList2").animate({
                scrollTop: 0
            }, 10);
        }
        $('#dropdownContent').hide();
        $('#dropdownContent2').toggle();
    });

    $('#searchInput2').on('input', function () {
        let value = $(this).val().toLowerCase();
        $('#dropdownList2 li').filter(function () {
            $(this).toggle($(this).text()
                .toLowerCase().indexOf(value) > -1);
        });
        liBranch = $('#dropdownList2 li');
        liSelectedBranch = $('#dropdownList2 li.selected');
    });

    $('#dropdownList2').on('click', 'li', function () {
        $('#dropdownList2 li').removeClass('selected')
        $(this).addClass('selected');
        $('#dropdownDisplay2').text($(this).text());
        $('#branch_dropdown').val($(this).data('code'));
        liSelectedBranch = $('#dropdownList2 li.selected');
        // console.log(window.records_banks[$(this).data('code')])
        $('#dropdownContent2').hide();
    });


    $('#dropdownDisplayCity').on('click', function () {
        const selected = $('#dropdownListCities li.selected');
        if (selected.length) {
            const index = selected.index();
            $("#dropdownListCities").animate({
                scrollTop: 34 * index
            }, 10);
        } else {
            $("#dropdownListCities").animate({
                scrollTop: 0
            }, 10);
        }
        $('#dropdownContent').hide();
        $('#dropdownContent2').hide();
        $('#dropdownContentCity').toggle();
    });

    $('#searchInputCity').on('input', function () {
        let value = $(this).val().toLowerCase();
        $('#dropdownListCities li').filter(function () {
            $(this).toggle($(this).text()
                .toLowerCase().indexOf(value) > -1);
        });
        liCity = $('#dropdownListCities li');
        liSelectedCity = $('#dropdownListCities li.selected');
    });

    $('#dropdownListCities').on('click', 'li', function () {
        $('#dropdownListCities li').removeClass('selected')
        $(this).addClass('selected');
        $('#dropdownDisplayCity').text($(this).text());
        $('#city_dropdown').val($(this).text());
        liSelectedCity = $('#dropdownListCities li.selected');
        $('#dropdownContentCity').hide();
        $('#city_dropdown').removeClass('error');
        runSubmitButtonValid();
    });


    $(".mainPicture_customer").on("change", async function () {
        const id = $(this).attr('name').replace('mainPicture_', '');

        $('#mainPicture_form_' + id + ' .loader_upload').show();

        const file = $(this)[0].files[0];
        const [, , subdomain] = window.location.hostname.split(".").reverse();
        const newFileName = file.name.split('.')[0] + ((subdomain && subdomain !== 'www') ? ('_' + subdomain) : '') + '_mainPicture_customer_' + id + '.' + file.name.split('.')[1]
        var newFile = new File([file], newFileName, {
            type: file.type,
        });
        const formData = new FormData();
        formData.set("photo", newFile);

        await fetch(window.location.origin + '/upload', {
            method: "POST",
            body: formData,
            headers: {
                type: "mainPicture",
                id: id
            }
        }).then(r => {
                console.log("response.status =", r.status);
                return r.json();
            }
        ).then(r => {
            if (r.status === 200) {
                $('#logoName_form_' + id + ' .loader_upload').hide();
                $('#logoName_form_' + id + ' img:not(.loader_upload)').attr('src', r.body);
                // r.body
                // window.location.reload();
            } else {
                $('#logoName_form_' + id + ' .loader_upload').hide();
            }
        })
    });
    $("#mainPicture").on("change", async function () {
        $('#mainPicture_form .loader_upload').show();
        const file = $('#mainPicture')[0].files[0];
        const [, , subdomain] = window.location.hostname.split(".").reverse();
        const newFileName = file.name.split('.')[0] + ((subdomain && subdomain !== 'www') ? ('_' + subdomain) : '') + '_mainPicture' + '.' + file.name.split('.')[1]
        var newFile = new File([file], newFileName, {
            type: file.type,
        });
        const formData = new FormData();
        formData.set("photo", newFile);

        await fetch(window.location.origin + '/upload', {
            method: "POST",
            body: formData,
            headers: {
                type: "mainPicture"
            }
        }).then(r => {
                console.log("response.status =", r.status);
                return r.json();
            }
        ).then(r => {
            if (r.status === 200) {
                $('#mainPicture_form .loader_upload').hide();
                $('#mainPicture_form img:not(.loader_upload)').attr('src', r.body);
                // r.body
                // window.location.reload();
            } else {
                $('#mainPicture_form .loader_upload').hide();
            }
        })
    });
    $("#signaturePicture").on("change", async function () {
        $('#signaturePicture_form .loader_upload').show();
        const file = $('#signaturePicture')[0].files[0];
        const [, , subdomain] = window.location.hostname.split(".").reverse();
        const newFileName = file.name.split('.')[0] + ((subdomain && subdomain !== 'www') ? ('_' + subdomain) : '') + '_signaturePicture' + '.' + file.name.split('.')[1]
        var newFile = new File([file], newFileName, {
            type: file.type,
        });
        const formData = new FormData();
        formData.set("photo", newFile);

        await fetch(window.location.origin + '/upload', {
            method: "POST",
            body: formData,
            headers: {
                type: "signaturePicture"
            }
        }).then(r => {
                console.log("response.status =", r.status);
                return r.json();
            }
        ).then(r => {
            if (r.status === 200) {
                $('#signaturePicture_form .loader_upload').hide();
                $('#signaturePicture_form img:not(.loader_upload)').attr('src', r.body);
                // r.body
                // window.location.reload();
            } else {
                $('#signaturePicture_form .loader_upload').hide();
            }
        })
    });
    $("#logoName").on("change", async function () {
        $('#logoName_form .loader_upload').show();
        const file = $('#logoName')[0].files[0];
        const [, , subdomain] = window.location.hostname.split(".").reverse();
        const newFileName = file.name.split('.')[0] + ((subdomain && subdomain !== 'www') ? ('_' + subdomain) : '') + '_logoName' + '.' + file.name.split('.')[1]
        var newFile = new File([file], newFileName, {
            type: file.type,
        });
        const formData = new FormData();
        formData.set("photo", newFile);

        await fetch(window.location.origin + '/upload', {
            method: "POST",
            body: formData,
            headers: {
                type: "logoName"
            }
        }).then(r => {
                console.log("response.status =", r.status);
                return r.json();
            }
        ).then(r => {
            if (r.status === 200) {
                $('#logoName_form .loader_upload').hide();
                // $('#logoName_form img:not(.loader_upload)').attr('src', r.body);
                // r.body
                window.location.reload();
            } else {
                $('#logoName_form .loader_upload').hide();
            }
        })
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


const mapped = {
    '-': '-', // HYPHEN-MINUS
    '\u{00AD}': '-', // SOFT HYPHEN
    '\u{00AF}': '-', // MACRON
    '\u{02D7}': '-', // MODIFIER LETTER MINUS SIGN
    '\u{058A}': '-', // ARMENIAN HYPHEN
    '\u{05BE}': '-', // HEBREW PUNCTUATION MAQAF
    '\u{180A}': '-', // MONGOLIAN NIRUGU
    '\u{2010}': '-', // HYPHEN
    '\u{2011}': '-', // NON-BREAKING HYPHEN
    '\u{2012}': '-', // FIGURE DASH
    '\u{2013}': '-', // EN DASH
    '\u{2014}': '-', // EM DASH
    '\u{2015}': '-', // HORIZONTAL BAR
    '\u{203E}': '-', // OVERLINE
    '\u{2043}': '-', // HYPHEN BULLET
    '\u{207B}': '-', // SUPERSCRIPT MINUS
    '\u{208B}': '-', // SUBSCRIPT MINUS
    '\u{2212}': '-', // MINUS SIGN
    '\u{23AF}': '-', // HORIZONTAL LINE EXTENSION
    '\u{23BA}': '-', // HORIZONTAL SCAN LINE-1
    '\u{23BB}': '-', // HORIZONTAL SCAN LINE-3
    '\u{23BC}': '-', // HORIZONTAL SCAN LINE-7
    '\u{23BD}': '-', // HORIZONTAL SCAN LINE-9
    '\u{23E4}': '-', // STRAIGHTNESS
    '\u{FF0D}': '-', // FULLWIDTH HYPHEN-MINUS
    '\u{FE63}': '-', // SMALL HYPHEN-MINUS
    '\u{FFE3}': '-', // FULLWIDTH MACRON

    '*': '*',
    '\u{066D}': '*', // ARABIC FIVE POINTED STAR
    '\u{070D}': '*', // SYRIAC HARKLEAN ASTERISCUS
    '\u{2055}': '*', // FLOWER PUNCTUATION MARK
    '\u{A60E}': '*', // VAI FULL STOP
    '\u{2217}': '*', // ASTERISK OPERATOR
    '\u{22C6}': '*', // STAR OPERATOR
    '\u{204E}': '*', // LOW ASTERISK
    '\u{2731}': '*', // HEAVY ASTERISK
    '\u{2732}': '*', // OPEN CENTRE ASTERISK
    '\u{2733}': '*', // EIGHT SPOKED ASTERISK
    '\u{273A}': '*', // SIXTEEN POINTED ASTERISK
    '\u{273B}': '*', // TEARDROP-SPOKED ASTERISK
    '\u{273C}': '*', // OPEN CENTRE TEARDROP-SPOKED ASTERISK
    '\u{273D}': '*', // HEAVY TEARDROP-SPOKED ASTERISK
    '\u{2743}': '*', // HEAVY TEARDROP-PINWHEEL ASTERISK
    '\u{2749}': '*', // BALLON-SPOKED ASTERISK
    '\u{274A}': '*', // EIGHT TEARDROP-SPOKED PROPELLER ASTERISK
    '\u{274B}': '*', // HEAVY EIGHT TEARDROP-SPOKED PROPELLER ASTERISK
    '\u{FE61}': '*', // SMALL ASTERISK
    '\u{FF0A}': '*', // FULLWIDTH ASTERISK

    ',': ',',
    '\u{00B8}': ',', // CEDILLA
    '\u{060C}': ',', // ARABIC COMMA
    '\u{066B}': ',', // ARABIC DECIMAL SEPARATOR
    '\u{066C}': ',', // ARABIC THOUSANDS SEPARATOR
    '\u{201A}': ',', // SINGLE LOW-9 QUOTATION MARK
    '\u{2032}': ',', // PRIME
    '\u{2E34}': ',', // RAISED COMMA
    '\u{3001}': ',', // IDEOGRAPHIC COMMA
    '\u{FF0C}': ',', // FULLWIDTH COMMA
    '\u{FE11}': ',', // PRESENTATION FORM FOR VERTICAL COMMA
    '\u{FE50}': ',', // SMALL COMMA
    '\u{FE51}': ',', // SMALL IDEOGRAPHIC COMMA
    '\u{FF64}': ',', // HALFWIDTH IDEOGRAPHIC COMMA

    '.': '.', // FULL STOP
    '\u{00B7}': '.', // MIDDLE DOT
    '\u{02D9}': '.', // DOT ABOVE
    '\u{0387}': '.', // GREEK ANO TELEIA
    '\u{06D4}': '.', // ARABIC FULL STOP
    '\u{0701}': '.', // SYRIAC SUPRALINEAR FULL STOP
    '\u{0702}': '.', // SYRIAC SUBLINEAR FULL STOP
    '\u{0830}': '.', // SAMARITAN PUNCTUATION NEQUDAA
    '\u{0F0B}': '.', // TIBETAN MARK INTERSYLLABIC TSHEG
    '\u{0F0C}': '.', // TIBETAN MARK DELIMITER TSHEG BSTAR
    // prettier-ignore
    "\u{1427}": ".", // CANADIAN SYLLABICS FINAL MIDDLE DOT
    '\u{16EB}': '.', // RUNIC SINGLE PUNCTUATION
    '\u{2219}': '.', // BULLET OPERATOR
    '\u{2022}': '.', // BULLET
    '\u{2024}': '.', // ONE DOT LEADER
    '\u{2027}': '.', // HYPHENATION POINT
    '\u{22C5}': '.', // DOT OPERATOR
    '\u{2E31}': '.', // WORD SEPARATOR MIDDLE DOT
    '\u{2E33}': '.', // RAISED DOT
    '\u{3002}': '.', // IDEOGRAPHIC FULL STOP
    '\u{30FB}': '.', // KATAKANA MIDDLE DOT
    '\u{FE52}': '.', // SMALL FULL STOP
    '\u{FF0E}': '.', // FULLWIDTH FULL STOP
    '\u{FF65}': '.', // HALFWIDTH KATAKANA MIDDLE DOT
    '\u{FBB2}': '.', // ARABIC SYMBOL DOT ABOVE
    '\u{FBB3}': '.', // ARABIC SYMBOL DOT BELOW
    '\u{10101}': '.', // AEGEAN WORD SEPARATOR DOT
    '\u{1091F}': '.', // PHOENICIAN WORD SEPARATOR
    '\u{10A50}': '.', // KHAROSHTHI PUNCTUATION DOT

    '/': '/',
    '\u{2044}': '/', // FRACTION SLASH
    '\u{2215}': '/', // DIVISION SLASH
    '\u{29F8}': '/', // BIG SOLIDUS
    '\u{FF0F}': '/', // FULLWIDTH SOLIDUS
    '\u{083C}': '/', // SAMARITAN PUNCTUATION ARKAANU
    '\u{27CB}': '/', // MATHEMATICAL RISING DIAGONAL

    ':': ':',
    '\u{1361}': ':', // ETHIOPIC WORDSPACE
    '\u{16EC}': ':', // RUNIC MULTIPLE PUNCTUATION
    '\u{1804}': ':', // MONGOLIAN COLON
    '\u{FE13}': ':', // PRESENTATION FORM FOR VERTICAL COLON
    '\u{FE30}': ':', // PRESENTATION FORM FOR VERTICAL TWO DOT LEADER
    '\u{FF1A}': ':', // FULLWIDTH COLON
    '\u{FE55}': ':', // SMALL COLON

    ' ': ' ',
    '\u{0009}': ' ', // TAB
    '\u{000B}': ' ', // VERTICAL TAB
    '\u{000C}': ' ', // FORM FEED
    '\u{00A0}': ' ', // NO-BREAK-SPACE
    '\u{1680}': ' ', // Ogham Space Mark
    '\u{2000}': ' ', // EN QUAD
    '\u{2001}': ' ', // EM QUAD
    '\u{2002}': ' ', // EN SPACE
    '\u{2003}': ' ', // EM SPACE
    '\u{2004}': ' ', // THREE-PER-EM SPACE
    '\u{2005}': ' ', // FOUR-PER-EM SPACE
    '\u{2006}': ' ', // SIX-PER-EM SPACE
    '\u{2007}': ' ', // FIGURE SPACE
    '\u{2008}': ' ', // PUNCTUATION SPACE
    '\u{2009}': ' ', // THIN SPACE
    '\u{200A}': ' ', // HAIR SPACE
    '\u{2028}': ' ', // LINE SEPARATOR
    '\u{2029}': ' ', // PARAGRAPH SEPARATOR
    '\u{202F}': ' ', // NARROW NO-BREAK SPACE
    '\u{205F}': ' ', // MEDIUM MATHEMATICAL SPACE
    '\u{3000}': ' ', // IDEOGRAPHIC SPACE

    "'": "'",
    '\u{0060}': "'", // GRAVE ACCENT
    '\u{00B4}': "'", // ACUTE ACCENT
    // prettier-ignore
    "\u{02BE}": "'", // MODIFIER LETTER RIGHT HALF RING
    // prettier-ignore
    "\u{02BF}": "'", // MODIFIER LETTER LEFT HALF RING
    // prettier-ignore
    "\u{02B9}": "'", // MODIFIER LETTER PRIME
    // prettier-ignore
    "\u{02BB}": "'", // MODIFIER LETTER TURNED COMMA
    // prettier-ignore
    "\u{02BC}": "'", // MODIFIER LETTER APOSTROPHE
    // prettier-ignore
    "\u{02C8}": "'", // MODIFIER LETTER VERTICAL LINE
    // prettier-ignore
    "\u{0300}": "'", // COMBINING GRAVE ACCENT
    '\u{0301}': "'", // COMBINING ACUTE ACCENT
    '\u{0312}': "'", // COMBINING TURNED COMMA ABOVE
    '\u{0313}': "'", // COMBINING COMMA ABOVE
    '\u{055A}': "'", // ARMENIAN APOSTROPHE
    '\u{201B}': "'", // SINGLE HIGH-REVERSED-9 QUOTATION MARK
    '\u{2018}': "'", // LEFT SINGLE QUOTATION MARK
    '\u{2019}': "'", // RIGHT SINGLE QUOTATION MARK

    '0': '0',
    '\u{0660}': '0', // ARABIC-INDIC DIGIT ZERO
    '\u{06F0}': '0', // EASTERN-ARABIC DIGIT ZERO
    '\u{FF10}': '0', // FULLWIDTH DIGIT ZERO
    '\u{1D7CE}': '0', // MATHEMATICAL BOLD DIGIT ZERO
    '\u{1D7D8}': '0', // MATHEMATICAL DOUBLE-STRUCK DIGIT ZERO
    '\u{1D7E2}': '0', // MATHEMATICAL SANS-SERIF DIGIT ZERO
    '\u{1D7EC}': '0', // MATHEMATICAL SANS-SERIF BOLD DIGIT ZERO
    '\u{1D7F6}': '0', // MATHEMATICAL MONOSPACE DIGIT ZERO

    '1': '1',
    '\u{0661}': '1', // ARABIC-INDIC DIGIT ONE
    '\u{06F1}': '1', // EASTERN-ARABIC DIGIT ONE
    '\u{FF11}': '1', // FULLWIDTH DIGIT ONE
    '\u{1D7CF}': '1', // MATHEMATICAL BOLD DIGIT ONE
    '\u{1D7D9}': '1', // MATHEMATICAL DOUBLE-STRUCK DIGIT ONE
    '\u{1D7E3}': '1', // MATHEMATICAL SANS-SERIF DIGIT ONE
    '\u{1D7ED}': '1', // MATHEMATICAL SANS-SERIF BOLD DIGIT ONE
    '\u{1D7F7}': '1', // MATHEMATICAL MONOSPACE DIGIT ONE

    '2': '2',
    '\u{06F2}': '2', // EASTERN-ARABIC DIGIT TWO
    '\u{0662}': '2', // ARABIC-INDIC DIGIT TWO
    '\u{FF12}': '2', // FULLWIDTH DIGIT TWO
    '\u{1D7D0}': '2', // MATHEMATICAL BOLD DIGIT TWO
    '\u{1D7DA}': '2', // MATHEMATICAL DOUBLE-STRUCK DIGIT TWO
    '\u{1D7E4}': '2', // MATHEMATICAL SANS-SERIF DIGIT TWO
    '\u{1D7EE}': '2', // MATHEMATICAL SANS-SERIF BOLD DIGIT TWO
    '\u{1D7F8}': '2', // MATHEMATICAL MONOSPACE DIGIT TWO

    '3': '3',
    '\u{06F3}': '3', // EASTERN-ARABIC DIGIT THREE
    '\u{0663}': '3', // ARABIC-INDIC DIGIT THREE
    '\u{FF13}': '3', // FULLWIDTH DIGIT THREE
    '\u{1D7D1}': '3', // MATHEMATICAL BOLD DIGIT THREE
    '\u{1D7DB}': '3', // MATHEMATICAL DOUBLE-STRUCK DIGIT THREE
    '\u{1D7E5}': '3', // MATHEMATICAL SANS-SERIF DIGIT THREE
    '\u{1D7EF}': '3', // MATHEMATICAL SANS-SERIF BOLD DIGIT THREE
    '\u{1D7F9}': '3', // MATHEMATICAL MONOSPACE DIGIT THREE

    '4': '4',
    '\u{06F4}': '4', // EASTERN-ARABIC DIGIT FOUR
    '\u{0664}': '4', // ARABIC-INDIC DIGIT FOUR
    '\u{FF14}': '4', // FULLWIDTH DIGIT FOUR
    '\u{1D7D2}': '4', // MATHEMATICAL BOLD DIGIT FOUR
    '\u{1D7DC}': '4', // MATHEMATICAL DOUBLE-STRUCK DIGIT FOUR
    '\u{1D7E6}': '4', // MATHEMATICAL SANS-SERIF DIGIT FOUR
    '\u{1D7F0}': '4', // MATHEMATICAL SANS-SERIF BOLD DIGIT FOUR
    '\u{1D7FA}': '4', // MATHEMATICAL MONOSPACE DIGIT FOUR

    '5': '5',
    '\u{06F5}': '5', // EASTERN-ARABIC DIGIT FIVE
    '\u{0665}': '5', // ARABIC-INDIC DIGIT FIVE
    '\u{FF15}': '5', // FULLWIDTH DIGIT FIVE
    '\u{1D7D3}': '5', // MATHEMATICAL BOLD DIGIT FIVE
    '\u{1D7DD}': '5', // MATHEMATICAL DOUBLE-STRUCK DIGIT FIVE
    '\u{1D7E7}': '5', // MATHEMATICAL SANS-SERIF DIGIT FIVE
    '\u{1D7F1}': '5', // MATHEMATICAL SANS-SERIF BOLD DIGIT FIVE
    '\u{1D7FB}': '5', // MATHEMATICAL MONOSPACE DIGIT FIVE

    '6': '6',
    '\u{06F6}': '6', // EASTERN-ARABIC DIGIT SIX
    '\u{0666}': '6', // ARABIC-INDIC DIGIT SIX
    '\u{FF16}': '6', // FULLWIDTH DIGIT SIX
    '\u{1D7D4}': '6', // MATHEMATICAL BOLD DIGIT SIX
    '\u{1D7DE}': '6', // MATHEMATICAL DOUBLE-STRUCK DIGIT SIX
    '\u{1D7E8}': '6', // MATHEMATICAL SANS-SERIF DIGIT SIX
    '\u{1D7F2}': '6', // MATHEMATICAL SANS-SERIF BOLD DIGIT SIX
    '\u{1D7FC}': '6', // MATHEMATICAL MONOSPACE DIGIT SIX

    '7': '7',
    '\u{06F7}': '7', // EASTERN-ARABIC DIGIT SEVEN
    '\u{0667}': '7', // ARABIC-INDIC DIGIT SEVEN
    '\u{FF17}': '7', // FULLWIDTH DIGIT SEVEN
    '\u{1D7D5}': '7', // MATHEMATICAL BOLD DIGIT SEVEN
    '\u{1D7DF}': '7', // MATHEMATICAL DOUBLE-STRUCK DIGIT SEVEN
    '\u{1D7E9}': '7', // MATHEMATICAL SANS-SERIF DIGIT SEVEN
    '\u{1D7F3}': '7', // MATHEMATICAL SANS-SERIF BOLD DIGIT SEVEN
    '\u{1D7FD}': '7', // MATHEMATICAL MONOSPACE DIGIT SEVEN

    '8': '8',
    '\u{06F8}': '8', // EASTERN-ARABIC DIGIT EIGHT
    '\u{0668}': '8', // ARABIC-INDIC DIGIT EIGHT
    '\u{FF18}': '8', // FULLWIDTH DIGIT EIGHT
    '\u{1D7D6}': '8', // MATHEMATICAL BOLD DIGIT EIGHT
    '\u{1D7E0}': '8', // MATHEMATICAL DOUBLE-STRUCK DIGIT EIGHT
    '\u{1D7EA}': '8', // MATHEMATICAL SANS-SERIF DIGIT EIGHT
    '\u{1D7F4}': '8', // MATHEMATICAL SANS-SERIF BOLD DIGIT EIGHT
    '\u{1D7FE}': '8', // MATHEMATICAL MONOSPACE DIGIT EIGHT

    // 9
    '9': '9',
    '\u{06F9}': '9', // EASTERN-ARABIC DIGIT NINE
    '\u{0669}': '9', // ARABIC-INDIC DIGIT NINE
    '\u{FF19}': '9', // FULLWIDTH DIGIT NINE
    '\u{1D7D7}': '9', // MATHEMATICAL BOLD DIGIT NINE
    '\u{1D7E1}': '9', // MATHEMATICAL DOUBLE-STRUCK DIGIT NINE
    '\u{1D7EB}': '9', // MATHEMATICAL SANS-SERIF DIGIT NINE
    '\u{1D7F5}': '9', // MATHEMATICAL SANS-SERIF BOLD DIGIT NINE
    '\u{1D7FF}': '9', // MATHEMATICAL MONOSPACE DIGIT NINE
};

function cleanUnicode(
    value,
    deletechars = ' ',
    stripPrefix,
) {
    if (typeof value !== 'string') {
        return ['', 'InvalidFormat'];
    }

    const cleaned = [...value]
        .map(c => mapped[c] ?? c)
        .filter(c => !deletechars.includes(c))
        .join('')
        .toLocaleUpperCase();

    if (stripPrefix && stripPrefix.length !== 0) {
        let prefix;

        if (Array.isArray(stripPrefix)) {
            prefix = stripPrefix.find(p => cleaned.startsWith(p));
        } else if (cleaned.startsWith(stripPrefix)) {
            prefix = stripPrefix;
        }

        if (prefix !== undefined) {
            return [cleaned.substring(prefix.length), null];
        }
    }

    return [cleaned, null];
}

function luhnChecksumValidate(
    value,
    alphabet = '0123456789',
) {
    const parity = value.length % 2;

    const sum = value
        .split('')
        .map(v => alphabet.indexOf(v))
        .reduce((acc, val, idx) => {
            let v = val;
            if (idx % 2 === parity) {
                v = val * 2;
                if (v > 9) {
                    v -= 9;
                }
            }

            return acc + v;
        }, 0);

    return sum % 10 === 0;
}

function validateHP(input) {
    const [value, error] = cleanUnicode(input, ' -');

    if (error) {
        return {isValid: false, error};
    }
    if (value.length !== 9) {
        return {isValid: false, error: 'InvalidLength'};
    }
    if (!/^[0-9]+$/.test(value)) {
        return {isValid: false, error: 'InvalidFormat'};
    }
    if (value[0] !== '5') {
        return {isValid: false, error: 'InvalidComponent'};
    }
    if (!luhnChecksumValidate(value)) {
        return {isValid: false, error: 'InvalidChecksum'};
    }

    return {
        isValid: true,
        compact: value,
        isIndividual: false,
        isCompany: true,
    };
}

function validateForms(type) {
    if (type === 'accountant') {
        const mail = $('#mail').val();
        const params = {
            user: {
                firstName: $('#firstName').val(),
                lastName: $('#lastName').val(),
                mail: mail
            },
            accountants: {
                address: $('#address').val(),
                city: $('#city_dropdown').val(),
                firstName: $('#firstName_accountant').val(),
                lastName: $('#lastName_accountant').val()
            }
        }
        const userValid = Object.values(params.user).every((value) => value);
        const accountantsValid = Object.values(params.accountants).every((value) => value);
        if (!userValid || !accountantsValid || (mail && !mail.match(validRegex))) {
            return false;
        }
    }
    if (type === 'customer') {
        const idTab = $('.companies-select li.ui-tabs-active').attr('aria-controls');
        const mail = $('#mail_' + idTab).val();
        const companyHP = $('#companyHP_' + idTab).val();
        const params = {
            user: {
                firstName: $('#firstName_' + idTab).val(),
                lastName: $('#lastName_' + idTab).val(),
                mail: mail,
                address: $('#address_' + idTab).val(),
                city: $('#city_dropdown_' + idTab).val(),
                companyHP: companyHP,
                companyName: $('#companyName_' + idTab).val(),
            }
        }
        const userValid = Object.values(params.user).every((value) => value);
        const {isValid} = validateHP(companyHP);
        if (!userValid || (mail && !mail.match(validRegex)) || !isValid) {
            return false;
        }
    }
    return true;
}

function validateField(type, name, idTab) {
    if (type === 'accountant') {
        const mail = $('#mail').val();
        const params = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            mail: mail,
            address: $('#address').val(),
            city: $('#city_dropdown').val(),
            firstName_accountant: $('#firstName_accountant').val(),
            lastName_accountant: $('#lastName_accountant').val()
        }

        if (!params[name] || (name === 'mail' && (mail && !mail.match(validRegex)))) {
            return false;
        }
    }
    if (type === 'customer') {
        const mail = $('#mail_' + idTab).val();
        const companyHP = $('#companyHP_' + idTab).val();
        const params = {
            firstName: $('#firstName_' + idTab).val(),
            lastName: $('#lastName_' + idTab).val(),
            mail: mail,
            address: $('#address_' + idTab).val(),
            city: $('#city_dropdown_' + idTab).val(),
            companyHP: companyHP,
            companyName: $('#companyName_' + idTab).val()
        }
        const {isValid} = validateHP(companyHP);
        if (!params[name] || (name === 'mail' && (mail && !mail.match(validRegex))) || (name === 'companyHP' && (!isValid))) {
            return false;
        }
    }
    return true;
}

async function submitForm(type) {
    let params;
    const headers = {
        "Content-Type": "application/json",
    }
    if (type === 'accountant') {
        params = {
            user: {
                firstName: $('#firstName').val(),
                lastName: $('#lastName').val(),
                mail: $('#mail').val()
            },
            accountants: {
                address: $('#address').val(),
                city: $('#city_dropdown').val(),
                firstName: $('#firstName_accountant').val(),
                lastName: $('#lastName_accountant').val(),
                bankNumber: $('#bank_dropdown').val() ? Number($('#bank_dropdown').val()) : null,
                snifNumber: $('#branch_dropdown').val() ? Number($('#branch_dropdown').val()) : null,
                accountNumber: $('#accountNumber').val() ? Number($('#accountNumber').val()) : null
            }
        }
    }
    if (type === 'customer') {
        const idTab = $('.companies-select li.ui-tabs-active').attr('aria-controls');
        headers.id = Number(idTab);
        params = {
            user: {
                firstName: $('#firstName_' + idTab).val(),
                lastName: $('#lastName_' + idTab).val(),
                mail: $('#mail_' + idTab).val(),
                address: $('#address_' + idTab).val(),
                city: $('#city_dropdown_' + idTab).val(),
                companyHP: Number($('#companyHP_' + idTab).val()),
                companyName: $('#companyName_' + idTab).val(),
            }
        }
    }
    console.log(params);
    const isValid = validateForms(type);
    if (!isValid) {
        return;
    }
    $('#loader').fadeIn();
    await fetch(window.location.origin + '/updates-user-accountants', {
        method: "POST",
        headers: headers,
        body: JSON.stringify(params)
    }).then(r => {
            console.log("response.status =", r.status);
            return r.json();
        }
    ).then(r => {
        if (r.status === 200) {
            window.location.reload();
        } else {
            $('#loader').fadeOut();
        }
    })
}
