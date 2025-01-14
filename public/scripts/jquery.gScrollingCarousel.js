(function ($) {
    $.fn.extend({
        gScrollingCarousel: function (options) {
            var defaults = {
                mouseScrolling: true,
                scrollAmount: 'viewport',
                draggable: true,
                snapOnDrag: true,
                mobileNative: true,
                showRadioButton: false,
            };

            options = $.extend(defaults, options);

            var supportsTouch = false;
            if ('ontouchstart' in window) {
                supportsTouch = true;
            } else if (window.navigator.msPointerEnabled) {
                supportsTouch = true;
            } else if ('ontouchstart' in document.documentElement) {
                supportsTouch = true;
            }

            function getMaxScrollLeft(carousel) {
                return Math.ceil(carousel.get(0).scrollWidth - carousel.get(0).clientWidth);
            }

            function updateNavigationVisibility(carousel) {
                var maxScrollLeft = getMaxScrollLeft(carousel);
                var left = Math.ceil(carousel.scrollLeft());
                carousel.data("leftElem").css("display", left == 0 ? "none" : "inline-block");
                carousel.data("rightElem").css("display", left >= maxScrollLeft ? "none" : "inline-block");
                var firstElemWidth = carousel.data("firstElemWidth");
                var firstElemMargin = carousel.data("firstElemMargin");
                var currentScrollLeft = carousel.scrollLeft();
                var itemsPerViewport = Math.floor((carousel.width() - firstElemWidth + firstElemMargin) / firstElemWidth) + 1;
                var amountToScroll = options.scrollAmount === 'viewport' ? itemsPerViewport * firstElemWidth : firstElemWidth;
                var scrollAmount = currentScrollLeft % firstElemWidth;
                var elementsLength = carousel.data("elementsLength");
                var stepsNumber = (elementsLength - itemsPerViewport) + 1;
                var currentStep = Math.ceil(currentScrollLeft / amountToScroll) + 1;
                // console.log(currentStep, stepsNumber, currentScrollLeft)
                carousel.parent().find('.jc-radio-item').each((index, item) => {
                    if (index === currentStep - 1) {
                        $(item).addClass('active').html('<svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">\n' +
                            '  <circle cx="9.5" cy="9.60596" r="9" stroke="#77C2CC"/>\n' +
                            '  <circle cx="9.5" cy="9.60596" r="6.5" fill="#77C2CC"/>\n' +
                            '</svg>');
                    } else {
                        $(item).removeClass('active').html('<svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none"> <circle cx="9.5" cy="9.60596" r="9" stroke="#CCC8C3"/> </svg>');
                    }
                })
            }

            function handleClickRadio(carousel, index) {
                var firstElemWidth = carousel.data("firstElemWidth");
                var firstElemMargin = carousel.data("firstElemMargin");
                var itemsPerViewport = Math.floor((carousel.width() - firstElemWidth + firstElemMargin) / firstElemWidth) + 1;
                var amountToScroll = options.scrollAmount === 'viewport' ? itemsPerViewport * firstElemWidth : firstElemWidth;
                var newScrollPosition = amountToScroll * index;

                carousel.stop(true).animate({scrollLeft: newScrollPosition}, 200, function () {
                    if (newScrollPosition <= getMaxScrollLeft(carousel)) {
                        var snapIndex = Math.round(carousel.scrollLeft() / carousel.data("firstElemWidth"));
                        var snapPosition = snapIndex * carousel.data("firstElemWidth");
                        carousel.scrollLeft(snapPosition);
                    }

                    updateNavigationVisibility(carousel);
                });
            }

            function handleClickNavigation(carousel, direction) {
                var firstElemWidth = carousel.data("firstElemWidth");
                var firstElemMargin = carousel.data("firstElemMargin");
                var currentScrollLeft = carousel.scrollLeft();
                var itemsPerViewport = Math.floor((carousel.width() - firstElemWidth + firstElemMargin) / firstElemWidth) + 1;
                var amountToScroll = options.scrollAmount === 'viewport' ? itemsPerViewport * firstElemWidth : firstElemWidth;
                var scrollAmount = currentScrollLeft % (firstElemWidth);
                // var elementsLength = carousel.data("elementsLength");
                // var stepsNumber = (elementsLength - itemsPerViewport) + 1;

                var maxScrollLeft = getMaxScrollLeft(carousel);
                var left = Math.ceil(carousel.scrollLeft());


                // console.log(maxScrollLeft, left)

                var newScrollPosition;
                if (direction === 1) {
                    if (scrollAmount === 0) {
                        newScrollPosition = currentScrollLeft + amountToScroll;
                    } else {
                        var partiallyVisibleItemWidth = firstElemWidth - scrollAmount;
                        newScrollPosition = currentScrollLeft + (amountToScroll + partiallyVisibleItemWidth);
                    }
                } else {
                    if (scrollAmount === 0 || maxScrollLeft === left) {
                        newScrollPosition = currentScrollLeft - amountToScroll;
                    } else {
                        var partiallyVisibleItemWidth = firstElemWidth - scrollAmount;
                        newScrollPosition = currentScrollLeft - (amountToScroll - partiallyVisibleItemWidth);
                    }
                }
                // var currentStep = Math.ceil(newScrollPosition/amountToScroll) + 1;
                // console.log(currentStep, stepsNumber, newScrollPosition)
                // console.log(newScrollPosition, currentScrollLeft-amountToScroll)
                // debugger
                carousel.stop(true).animate({scrollLeft: newScrollPosition}, 200, function () {
                    if (newScrollPosition <= getMaxScrollLeft(carousel)) {
                        var snapIndex = Math.round(carousel.scrollLeft() / carousel.data("firstElemWidth"));
                        var snapPosition = snapIndex * carousel.data("firstElemWidth");
                        carousel.scrollLeft(snapPosition);
                    }

                    updateNavigationVisibility(carousel);
                });
            }

            function getFirstElemWidth(carousel) {
                var firstElem = carousel.children(":first");
                var marginRight = parseInt(firstElem.css("marginRight"));
                var marginLeft = parseInt(firstElem.css("marginLeft"));
                return firstElem.width() + marginRight + marginLeft;
            }

            function getFirstElemMargin(carousel) {
                var firstElem = carousel.children(":first");
                return parseInt(firstElem.css("marginRight")) + parseInt(firstElem.css("marginLeft"));
            }

            function getElementsNumber(carousel) {
                return parseInt(carousel.children('li').length);
            }

            return this.each(function () {
                var carousel = $(this);
                if (!supportsTouch || !options.mobileNative) {
                    var leftElem = $('<span />').addClass('jc-left').html('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="37" viewBox="0 0 36 37" fill="none">\n' +
                        '<path d="M23.625 30.481L12.375 19.231L23.625 7.98096" stroke="#CCC8C3" stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round"/>\n' +
                        '</svg>');
                    var rightElem = $('<span />').addClass('jc-right').html('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="37" viewBox="0 0 36 37" fill="none">\n' +
                        '<path d="M12.375 7.98096L23.625 19.231L12.375 30.481" stroke="#CCC8C3" stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round"/>\n' +
                        '</svg>');
                    carousel.parent().append(leftElem).append(rightElem);
                    carousel.data("leftElem", leftElem);
                    carousel.data("rightElem", rightElem);
                    carousel.data("firstElemWidth", getFirstElemWidth(carousel));
                    carousel.data("firstElemMargin", getFirstElemMargin(carousel));
                    carousel.data("elementsLength", getElementsNumber(carousel));
                    var firstElemWidth = carousel.data("firstElemWidth");
                    var firstElemMargin = carousel.data("firstElemMargin");
                    var carouselWidth = carousel.width();
                    var itemsPerViewport = Math.floor((carousel.width() - firstElemWidth + firstElemMargin) / firstElemWidth) + 1;
                    var elementsLength = carousel.data("elementsLength");
                    var scrollLeft = elementsLength * (firstElemWidth + firstElemMargin);
                    var stepsNumber = (elementsLength - itemsPerViewport) + 1;
                    var ulRadioElem = $('<ul />').addClass('jc-radio-list').html('');
                    if (stepsNumber > 1 && options.showRadioButton) {
                        for (var i = 0; i < stepsNumber; i++) {
                            var liElem = $('<li />').addClass('jc-radio-item').html('<svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none"> <circle cx="9.5" cy="9.60596" r="9" stroke="#CCC8C3"/> </svg>');
                            liElem.data("liElemIndex", i);
                            liElem.on("mouseup mousedown click", function () {
                                handleClickRadio(carousel, $(this).data("liElemIndex"));
                            });
                            ulRadioElem.append(liElem);
                        }
                        carousel.removeClass('full-width').parent().append(ulRadioElem);
                    } else {
                        if (stepsNumber > 1) {
                            carousel.removeClass('full-width');
                        } else {
                            carousel.addClass('full-width');
                        }
                    }
                    if (stepsNumber > 1) {
                        // var maxScrollLeft = getMaxScrollLeft(carousel);
                        carousel.stop(true).animate({scrollLeft: scrollLeft}, 1, function () {
                            leftElem.off("click");
                            leftElem.on("click", function () {
                                handleClickNavigation(carousel, -1);
                            });
                            rightElem.off("click");
                            rightElem.on("click", function () {
                                handleClickNavigation(carousel, 1);
                            });
                            updateNavigationVisibility(carousel);

                            if (options.mouseScrolling) {
                                var firstElemWidth = carousel.data("firstElemWidth");
                                var scrollAmount;
                                carousel.off("wheel");
                                setTimeout(() => {
                                    carousel.on("wheel", function (event) {
                                        event.preventDefault();
                                        carousel.scrollLeft(scrollAmount);
                                        var deltaY = event.originalEvent.deltaY;
                                        var direction = deltaY > 0 ? 1 : -1;
                                        if (direction == 1) {
                                            scrollAmount = $(this).scrollLeft() + firstElemWidth;
                                        } else {
                                            scrollAmount = $(this).scrollLeft() - firstElemWidth;
                                        }

                                        carousel.stop(true).animate({scrollLeft: scrollAmount}, 100, function () {
                                            updateNavigationVisibility(carousel);
                                        });
                                    });
                                }, 100)
                            }
                            if (options.draggable) {
                                var down, startX, startScrollLeft, newScrollPosition, isDragging;
                                carousel.off("mousedown.gScrollingCarousel");
                                carousel.off("mousemove.gScrollingCarousel");
                                $(document).off("mouseup.gScrollingCarousel");
                                carousel.off("mouseup mousedown click");
                                setTimeout(() => {
                                    carousel.on("mousedown.gScrollingCarousel", function (e) {
                                        e.preventDefault();
                                        startX = e.pageX;
                                        startScrollLeft = carousel.scrollLeft();

                                        carousel.on("mousemove.gScrollingCarousel", function (e) {
                                            if (e.pageX != startX) {
                                                isDragging = true;
                                                var deltaX = e.pageX - startX;
                                                newScrollPosition = startScrollLeft - deltaX
                                                carousel.scrollLeft(newScrollPosition);
                                            }
                                        });

                                        $(document).on("mouseup.gScrollingCarousel", function () {
                                            carousel.off("mousemove.gScrollingCarousel");
                                            $(document).off("mouseup.gScrollingCarousel");
                                            if (options.snapOnDrag && newScrollPosition < getMaxScrollLeft(carousel)) {
                                                var snapIndex = Math.round(carousel.scrollLeft() / carousel.data("firstElemWidth"));
                                                var snapPosition = snapIndex * carousel.data("firstElemWidth");
                                                carousel.stop(true).animate({scrollLeft: snapPosition}, 200, function () {
                                                    updateNavigationVisibility(carousel);
                                                });
                                            } else {
                                                updateNavigationVisibility(carousel);
                                            }
                                        });
                                    });
                                    carousel.on("mouseup mousedown click", function (e) {  //prevent clicking while moving
                                        if (isDragging) {
                                            e.preventDefault();
                                            setTimeout(function () {
                                                isDragging = false;
                                            }, 1);
                                        }
                                    });
                                }, 100)
                            }
                        });
                    }
                } else {
                    carousel.css("overflow-x", "scroll")
                }
            });
        }
    });
})(jQuery);
