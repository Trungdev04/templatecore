let windowWidth = $('body').width();

let handleApplyCollapse = function ($parent, $firstItem = false, $callFunction = false) {
	let $childUl = $parent.find('> li > ul');
	if ($childUl.length === 0) {
		return;
	}

	if ($callFunction) {
		$parent.find('> li a').each(function () {
			$(this).attr('data-href', $(this).attr('href'))
		});
	}

	let $parentID = '';

	if ($firstItem) {
		$parentID = 'menu-' + Math.random().toString(36).substring(7);
		$parent.attr('id', $parentID);
	}

	if (windowWidth <= 1023) {
		let $objParentAttr = {};
		let $objChildrenAttr = {
			'data-bs-parent': '#' + $parent.attr('id')
		}

		if ($firstItem) {
			$objParentAttr = {
				'data-bs-parent': '#' + $parentID
			}

			$objChildrenAttr = {};
		}

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');
			let $parentListItemAnchor = $parentListItem.children('a');

			let $parentUlID = 'menu-' + Math.random().toString(36).substring(7);

			if (!$parentUl.hasClass('collapse')) {
				$parentUl.addClass('collapse').attr({
					'id': 'collapse-' + $parentUlID, ...$objParentAttr, ...$objChildrenAttr
				});

				$parentListItemAnchor.replaceWith(function () {
					return `<button aria-label="${$parentListItemAnchor.attr('aria-label')}" data-href="${$parentListItemAnchor.attr('data-href')}" data-bs-toggle="collapse" aria-expanded="false" data-bs-target="#${$parentUl.attr('id')}">${$parentListItemAnchor.html()}</button>`
				})

				handleApplyCollapse($parentUl, false);

				$parentUl.on('show.bs.collapse', function () {
					$parentListItem.children('button').attr('aria-expanded', true);
					$parent.find('.collapse.show').not($parentUl).collapse('hide').each(function () {
						$(this).siblings('li').children('button').attr('aria-expanded', false);
					});
				}).on('hide.bs.collapse', function () {
					$parentListItem.children('button').attr('aria-expanded', false);
				});
			}
		});
	} else {
		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');

			$parentUl.removeClass('collapse').removeAttr('data-bs-parent id');
			$parentListItem.children('a').attr('href', $parentListItem.children('a').attr('data-href'));

			$parentListItem.children('button').replaceWith(function () {
				return `<a aria-label="${$(this).attr('aria-label')}" href="${$(this).attr('data-href')}" data-href="${$(this).attr('data-href')}">${$(this).html()}</a>`
			})

			handleApplyCollapse($parentUl);
		});
	}
}

let handleCallMenu = function () {
	const $body = $('body');
	const handleBody = function ($toggle = false) {
		if ($body.hasClass('is-navigation')) {
			$body.removeClass('is-navigation');
			if ($body.hasClass('is-overflow')) {
				$body.removeClass('is-overflow');
			}

			$('#headerNavigation ul').collapse('hide');
		} else {
			if ($toggle) {
				$body.addClass('is-navigation is-overflow')
			}
		}
	}

	if (windowWidth <= 1023) {
		const $hamburger = $('#hamburgerButton');
		if ($hamburger.length) {
			$hamburger.off('click').on('click', function () {
				handleBody(true)
			});
		}

		const $overlay = $('#headerOverlay');
		if ($overlay.length) {
			$overlay.off('click').on('click', function () {
				handleBody();
			});
		}
	} else {
		handleBody();
	}
}

const handleStickHeader = function () {
	if ($('body').height() / $(window).height() > 1.3) {
		$(window).scroll(function (e) {
			if ($(document).scrollTop() > $('#header').innerHeight()) {
				$('#header').addClass('is-scroll');
			} else {
				$('#header').removeClass('is-scroll');
			}
		});
	}
}

const handleHeader = function () {
	handleApplyCollapse($('#headerNavigation > ul'), true, true);
	handleCallMenu();
	handleStickHeader();
	$(window).resize(function () {
		let newWindowWidth = $('body').width();
		if (newWindowWidth !== windowWidth) {
			windowWidth = newWindowWidth;
			handleApplyCollapse($('#headerNavigation > ul'));
			handleCallMenu();
		}
	});
}

const handleSwiper = function (elm, obj = {}) {
	return new Swiper(elm, {
		loop: true, speed: 1000, autoplay: {
			delay: 8000, disableOnInteraction: true,
		}, slidesPerView: 1, ...obj
	});
}

const handleCounter = function () {
	if ($('#handleCounter').length && $('#handleCounter .handleCounterItem').length) {
		const formatPrice = function (price, format = '.') {
			price = price.replace(/[^0-9]/g, '');
			price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, format);
			return price;
		}

		let i = 0;
		$(window).scroll(function () {
			let counterOffsetTop = $('#handleCounter').offset().top - window.innerHeight;
			if (i === 0 && $(window).scrollTop() > counterOffsetTop) {
				$('#handleCounter .handleCounterItem').each(function () {
					let counterItem = $(this), counterItemValue = counterItem.attr('data-value'),
						counterItemFormat = counterItem.attr('data-format'),
						counterItemDecor = counterItem.attr('data-decor') ?? '';
					$({countNum: counterItem.text()}).animate({countNum: counterItemValue}, {
						duration: 2000, easing: 'swing', step: function () {
							counterItem.text(Math.floor(this.countNum));
						}, complete: function () {
							counterItem.html(formatPrice(this.countNum.toString(), counterItemFormat) + ((counterItemDecor != '') ? counterItemDecor : ''));
						}
					});
				});
				i = 1;
			}
		});
	}
}

const handleContentDetail = () => {
	if ($('#detailContent').length > 0) {
		if ($('#detailContent img').length > 0) {
			$('#detailContent img').each((index, elm) => {
				$(elm).wrap(`<a style="cursor: zoom-in" href="${$(elm).attr('src')}" data-caption="${$(elm).attr('alt')}" data-fancybox="images-detail"></a>`);
				$(elm).addClass('img-fluid');
			});

			Fancybox.bind('[data-fancybox]', {
				thumbs: {
					autoStart: true,
				},
			});
		}

		if ($('#detailContent table').length > 0) {
			$('#detailContent table').map(function () {
				$(this).addClass('table table-bordered');
				$(this).wrap('<div class="table-responsive"></div>');
			})
		}
	}
}

const handleTabsPill = function () {
	if ($('#handleTabEffect').length) {
		const tabEffect = $('#handleTabEffect');
		const tabBackground = tabEffect.find('.tab-bg');

		const itemLinkActive = tabEffect.find('.nav-item .nav-link.active')[0];
		tabBackground.css({
			left: parseInt(itemLinkActive.offsetLeft) + "px",
			width: parseInt(itemLinkActive.offsetWidth) + "px",
			opacity: 1
		});

		$(window).resize(function () {
			tabBackground.css({
				left: parseInt(tabEffect.find('.nav-item .nav-link.active')[0].offsetLeft) + "px",
				width: parseInt(tabEffect.find('.nav-item .nav-link.active')[0].offsetWidth) + "px",
				opacity: 1
			});
		});

		setTimeout(function () {
			tabEffect.find('.nav-item .nav-link').addClass('is-done');
			tabBackground.addClass('transition-default')
		}, 300)

		const itemLinks = tabEffect.find('.nav-item .nav-link');

		if (itemLinks.length) {
			itemLinks.each(function () {
				let itemLink = $(this);
				itemLink.on("click", function () {
					itemLinks.removeClass("active");

					itemLink.addClass("active");
					tabBackground.css({
						left: parseInt(itemLink[0].offsetLeft) + "px", width: parseInt(itemLink[0].offsetWidth) + "px",
					});
				});
			})
		}
	}
}

const handleValidationForm = function () {
	const elmForm = $('#formValidation');
	if (elmForm.length === 0) return false;

	elmForm.submit(function (event) {
		if (!elmForm[0].checkValidity()) {
			event.preventDefault();
			event.stopPropagation();
			elmForm.addClass('was-validated has-validated');
		}
		return false;
	});
}

const handleViewPass = function () {
	$(document).on('click', '.buttonViewPassword', function () {
		let elm = $(this), elmID = elm.attr('data-id');
		if (elm.hasClass('is-show')) {
			elm.html('<i class="fas fa-eye">');
			elm.removeClass('is-show');
			$('#' + elmID).attr('type', 'password');
		} else {
			elm.html('<i class="fas fa-eye-slash">');
			elm.addClass('is-show');
			$('#' + elmID).attr('type', 'text');
		}
	});
}

const handleUploadImage = function () {
	const uploadImages = $('.handleUploadImage');
	if (uploadImages.length) {
		uploadImages.each(function () {
			let uploadImage = $(this);
			let inputUpload = uploadImage.find('input[data-type="input"]');
			let previewUpload = uploadImage.find('[data-type="fill"]');
			let previewImage = previewUpload.find('img');

			if (inputUpload.length && previewUpload.length) {
				inputUpload.change(function () {
					let file = this.files[0];
					uploadImage.addClass('is-change');

					if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
						let reader = new FileReader();

						reader.onload = function (e) {
							setTimeout(function () {
								previewImage.attr('src', e.target.result);
								uploadImage.removeClass('is-change');
							}, 500)
						}

						reader.readAsDataURL(file);
					} else {
						alert('Vui lòng chọn hình ảnh đúng định dạng (PNG, JPEG).');
						uploadImage.removeClass('is-change');
					}
				});
			}
		})
	}
}

const handleInitDateRangePicker = function (elmInput) {
	$('.initDateRangePicker input').each(function () {
		let format = 'DD-MM-YYYY';
		const initDateRangePicker = $(this).daterangepicker({
			singleDatePicker: true,
			alwaysShowCalendars: true,
			timePicker: false,
			timePicker24Hour: false,
			timePickerSeconds: false,
			parentEl: 'body',
			autoApply: true,
			locale: {
				format: format,
				daysOfWeek: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
				monthNames: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
				applyLabel: 'Áp dụng',
				cancelLabel: 'Đóng',
			}
		});

		if (typeof type != "undefined" && type === 'time') {
			initDateRangePicker.on('show.daterangepicker', function (ev, picker) {
				picker.container.find(".drp-calendar").addClass('px-3');
				picker.container.find(".calendar-table").hide();
			});
		}
	});
}

const handleInitTooltip = function () {
	if ($('[data-bs-toggle="tooltip"]').length) {
		$('[data-bs-toggle="tooltip"]').tooltip({
			trigger: 'hover', html: true,
		});
	}
}

const handleInitPopover = function () {
	if ($('[data-bs-toggle="popover"]').length) {
		$('[data-bs-toggle="popover"]').popover({
			trigger: 'focus', html: true,
		})
	}
}

const handleMultipleCheckbox = function () {
	const checkbox = $('.handleCheckbox');
	if (checkbox.length) {
		checkbox.change(function () {
			let type = $(this).attr('data-type');

			if (type == -1) {
				let isChecked = $(this).is(':checked');
				$('.handleCheckbox').not('[data-type="-1"]').prop('checked', isChecked);
			} else {
				let allChecked = $('.handleCheckbox').not('[data-type="-1"]').length === $('.handleCheckbox:checked').not('[data-type="-1"]').length;
				$('.handleCheckbox[data-type="-1"]').prop('checked', allChecked);
			}
		});
	}
}


const handleHeadingTabs = function () {
	let itemTabs = $("#headingTabs .nav-item");
	if (itemTabs.length) {
		itemTabs.each(function () {
			let itemTab = $(this);
			itemTab.on("click", function () {
				itemTabs.removeClass("active");

				itemTab.addClass("active");
				$("#headingTabs .heading-tabs_bg").css({
					left: parseInt($(this)[0].offsetLeft) + "px", width: parseInt($(this)[0].offsetWidth) + "px",
				});
			});
		})

		$("#headingTabs .heading-tabs_bg").css({
			left: parseInt($("#headingTabs .nav-item .nav-link.active")[0].offsetLeft) + "px",
			width: parseInt($("#headingTabs .nav-item .nav-link.active")[0].offsetWidth) + "px",
			opacity: 1
		});
	}
}

const handleFillDropdown = function () {
	if ($('.handleFillDropdown').length > 0) {
		$('.handleFillDropdown').click(function () {
			let elmFill = $(this).attr('data-input'),
				valueID = $(this).attr('data-id'),
				valueText = $(this).find('.dropdownValue').text(),
				valuePrice = $(this).find('.dropdownPrice').text();

			$('.handleFillDropdown').removeClass('active');
			$(this).addClass('active');
			$(elmFill).find('.dropdownFillID').val(valueID);
			$(elmFill).find('.dropdownFillValue').text(valueText);
			$(elmFill).find('.dropdownFillPrice').text(valuePrice);
		});
	}
}

$(function () {
	/****
	 *  Handle Navigation and Sticky
	 */
	handleHeader();

	/****
	 *  Handle Init Slider Hero 1
	 */
	if ($('#sliderHero-1').length > 0) {
		const elmSwiper = '#sliderHero-1';
		const objSwiper = {
			speed: 1000, autoplay: {
				delay: 8000, disableOnInteraction: true,
			}, loop: true, slidesPerView: 1, effect: 'fade', fadeEffect: {
				crossFade: true
			}, pagination: {
				el: elmSwiper + ' .slider-pagination',
				type: 'bullets',
				bulletClass: 'slider-pagination_item',
				clickable: true,
			}
		}
		handleSwiper(elmSwiper + ' .swiper', objSwiper);
	}

	/****
	 *  Handle Init Slider Articles 1
	 */

	if ($('#sliderArticle-1').length > 0) {
		const elmSwiper = '#sliderArticle-1';
		const objSwiper = {
			loop: true, speed: 2000, autoplay: {
				delay: 8000, disableOnInteraction: true,
			}, slidesPerView: 4, spaceBetween: 24, breakpoints: {
				320: {
					slidesPerView: 1,
				}, 375: {
					slidesPerView: 1.5,
				}, 575: {
					slidesPerView: 2.5,
				}, 1024: {
					slidesPerView: 3,
				}, 1200: {
					slidesPerView: 4,
				}
			}
		}
		handleSwiper(elmSwiper + ' .swiper', objSwiper);
	}

	/****
	 *  Handle Init Slider Brands 1
	 */

	if ($('#sliderBrands-1').length > 0) {
		const elmSwiper = '#sliderBrands-1';
		const objSwiper = {
			loop: true, speed: 3000, freeMode: {
				enabled: true, sticky: true,
			}, autoplay: {
				delay: 0, disableOnInteraction: false, pauseOnMouseEnter: false,
			}, slidesPerView: 10, spaceBetween: 40, breakpoints: {
				320: {
					slidesPerView: 2,
				}, 375: {
					slidesPerView: 3.5,
				}, 575: {
					slidesPerView: 4.5,
				}, 768: {
					slidesPerView: 5.5,
				}, 991: {
					slidesPerView: 6.5,
				}, 1024: {
					slidesPerView: 8,
				}, 1200: {
					slidesPerView: 10,
				}
			}
		}
		const sliderBrands1 = handleSwiper(elmSwiper + ' .swiper', objSwiper);

		$(elmSwiper).on('mouseenter', function () {
			sliderBrands1.autoplay.pause();
			sliderBrands1.setTranslate(sliderBrands1.getTranslate());
		});

		$(elmSwiper).on('mouseleave', function () {
			sliderBrands1.autoplay.start();
		});
	}

	/****
	 *  Handle Init Slider Image Demo (Chi tiết phần mềm)
	 */
	if ($('#sliderImageDemo').length > 0) {
		const elmSwiper = '#sliderImageDemo';
		const objSwiper = {
			speed: 1000, autoplay: false, loop: false, slidesPerView: 1, spaceBetween: 15, navigation: {
				nextEl: elmSwiper + " .sliderNext", prevEl: elmSwiper + " .sliderPrev",
			},
		}
		handleSwiper(elmSwiper + ' .swiper', objSwiper);
	}


	/****
	 *  Handle Init Slider Catgories 2
	 */

	if ($('#sliderCategories-2').length > 0) {
		const elmSwiper = '#sliderCategories-2';
		const objSwiper = {
			loop: true, speed: 2000, autoplay: {
				delay: 8000, disableOnInteraction: true,
			}, slidesPerView: 6, spaceBetween: 24, breakpoints: {
				320: {
					slidesPerView: 1,
				}, 375: {
					slidesPerView: 1.5,
				}, 575: {
					slidesPerView: 2.5,
				}, 1024: {
					slidesPerView: 3,
				}, 1200: {
					slidesPerView: 6,
				}
			}
		}
		handleSwiper(elmSwiper + ' .swiper', objSwiper);
	}

	/****
	 *  Handle Init Counter
	 */
	handleCounter();

	/****
	 *  Handle Content Detail Default
	 */
	handleContentDetail();

	/****
	 *  Handle Tabs Pill
	 */
	handleTabsPill();

	/****
	 *  Handle View Pass
	 */
	handleViewPass();

	/****
	 *  Handle Validation Form Default
	 */
	handleValidationForm();

	/****
	 *  Handle Upload Image
	 */
	handleUploadImage();

	/****
	 *  Handle Init DateRangePicker
	 */
	handleInitDateRangePicker();

	/****
	 *  Handle Init Tooltip
	 */

	handleInitTooltip();

	/****
	 *  Handle Init Popover
	 */
	handleInitPopover();

	/****
	 *  Handle Multiple Checkbox (Checkbox All - Only)
	 */
	handleMultipleCheckbox();

	/****
	 *  Handle Heading Tabs
	 */
	handleHeadingTabs();


	/****
	 *  Handle Dropdown
	 */
	handleFillDropdown();
});


