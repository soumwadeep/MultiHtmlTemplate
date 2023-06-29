/*
Theme Name: Petri
Description: Creative Coming Soon Template
Author: Erilisdesign
Theme URI: http://preview.erilisdesign.com/html/petri/
Author URI: http://themeforest.net/user/erilisdesign
Version: 1.2.1
License: https://themeforest.net/licenses/standard
*/

/*------------------------------------------------------------------
[Table of contents]

1. Preloader
2. Navigation
3. Back to top
4. Backgrounds
5. Masonry
6. Magnific Popup
7. Slider
8. Countdown
9. Mailchimp
10. Contact Form
-------------------------------------------------------------------*/

(function($) {
	"use strict";

	// Vars
	var $body = $('body'),
		$sideBlock = $('#side-block'),
		$siteHeader = $('.site-header'),
		$headerBase = $('.header-base'),
		$siteNavigation = $('.site-navigation'),
		$navToggle = $('#navigation-toggle'),
		closeOverlayNavAfterClick = true,
		closeOverlayNavAfterClick_mobile = true,
		closeClassicNavAfterClick_mobile = true,
		$backToTop = $('#back-to-top'),
		$closeSideBlock = $('#close-side-block'),
		$smoothScrollLinks = $('a.scrollto, .site-header a[href^="#"]'),
		$globalMask = $('.global-mask'),
		$preloader = $('#preloader'),
		preloaderDelay = 1200,
		preloaderFadeOutTime = 500,
		target,
		trueMobile;

	function getWindowWidth() {
		return Math.max( $(window).width(), window.innerWidth);
	}

	function getWindowHeight() {
		return Math.max( $(window).height(), window.innerHeight);
	}

	// Mobile Detector
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$body.addClass('mobile');
	}

	// [1. Preloader]
	function petri_preloader() {
		$preloader.delay(preloaderDelay).fadeOut(preloaderFadeOutTime);
	}

	// [2. Navigation]
	function petri_navigation() {
		var headerBaseHeight = parseInt($headerBase.innerHeight(), 10);

		if( !( 1199 >= getWindowWidth() || $body.hasClass('mobile') ) ) {
			if( $sideBlock.length > 0 ){
				$body.addClass('has-side-block');
			}

			if( $sideBlock.hasClass('hide-side-block') ){
				$body.addClass('has-hide-side-block');
			}

			$siteNavigation.css('display','');

			if( $body.hasClass('mCS_destroyed') || !$body.hasClass('mCustomScrollbar') ){
				$body.mCustomScrollbar({
					axis: 'y',
					scrollbarPosition: 'inside',
					scrollInertia: 150,
					mouseWheel:{
						enable: true,
						scrollAmount: 100,
						axis: 'y'
					},
					autoHideScrollbar: false,
					alwaysShowScrollbar: 1,
					callbacks:{
						whileScrolling: function(){
							// Show - Back to top button
							if( $body.hasClass('side-block-open') || !$body.hasClass('has-hide-side-block') ){
								if(this.mcs.top <= -100){
									$backToTop.addClass('active');
								} else {
									$backToTop.removeClass('active');
								}
							}
						},
						onScroll: function(){
							if ( !$body.hasClass('side-block-open') )
								return true;
						}
					}
				});

				// Vegas Fix
				if( $body.hasClass('vegas-container') ){
					$body.vegas('destroy');
					$body.find('.vegas-slide').remove();
					petri_vegas();
				}

			}
		} else {

			if( $body.hasClass('has-side-block') ){
				$body.removeClass('has-side-block');
			}

			if( $body.hasClass('has-hide-side-block') ){
				$body.removeClass('has-hide-side-block');
			}

			if ( $body.hasClass('side-block-open') ) {
				$body.removeClass('side-block-open');
			}

			if($body.hasClass('mCustomScrollbar')){
				$body.mCustomScrollbar('destroy');
			}

			// Hide - Close side block button
			if( $closeSideBlock.hasClass('active') ){
				$closeSideBlock.removeClass('active');
			}

			// Hide - Global mask
			if( $globalMask.hasClass('active') ){
				$globalMask.removeClass('active');
			}

		}

		// Fix video autoplay
		if( ( !$body.hasClass('mobile') && document.querySelectorAll('video[autoplay]').length > 0 ) && ( $body.hasClass('mCustomScrollbar') || $body.hasClass('mCS_destroyed') ) ){
			var video = document.querySelectorAll('.overlay-video video')[0],
				isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;

			if ( !isPlaying ) {
				video.play();
			}
		}

		// Fix first section padding
		if( $siteHeader.hasClass('header-classic-mobile-fixed') || $siteHeader.hasClass('header-overlay-navigation') ){
			if( 1199 >= getWindowWidth() ) {
				var headerBaseHeight = $headerBase.innerHeight();

				$body.find('section').first().css('padding-top','');
				$body.find('section').first().css('padding-top', parseInt( $body.find('section').first().css('padding-top'), 10) + headerBaseHeight);
			}
		}

		// Fix overlay navigation padding
		if( $siteHeader.hasClass('header-overlay-navigation') ){
			var headerBaseHeight = $headerBase.innerHeight();

			$siteHeader.find('.overlay-navigation-container').first().css('height','').css('margin-top','');
			$siteHeader.find('.overlay-navigation-container nav').first().css('min-height','');
			$siteHeader.find('.overlay-navigation-container').first().css('height', getWindowHeight() - parseInt(headerBaseHeight, 10)).css('margin-top', parseInt(headerBaseHeight, 10));
			$siteHeader.find('.overlay-navigation-container nav').first().css('min-height', getWindowHeight() - parseInt(headerBaseHeight, 10));
		}

		// Mobile navigation toggle
		$navToggle.off('click');
		$navToggle.on('click', function(e) {
			e.preventDefault();

			if( $siteHeader.hasClass('header-overlay-navigation') ){
				if(!$(this).hasClass('open')){
					$(this).addClass('open');
					$('.overlay-navigation').addClass('open');
				} else {
					$('.overlay-navigation').removeClass('open');
					$(this).removeClass('open');
				}
			} else if( $siteHeader.hasClass('header-classic-navigation') ){
				if(!$(this).hasClass('open')){
					$(this).addClass('open');
					$('.header-collapse').slideDown(500);
				} else {
					$('.header-collapse').slideUp(500);
					$(this).removeClass('open');
				}
			}
		});

		// Smooth Scroll
		function mCustomScrollbarScrollToOffset(el){
			var offset = headerBaseHeight,
				elTop = $(el).offset().top - $('.mCSB_container').offset().top;
			return elTop - offset;
		}

		$smoothScrollLinks.off('click');
		$smoothScrollLinks.on('click', function(e) {
			e.preventDefault();
			var target = $(this).attr('href');

			if( !( 1199 >= getWindowWidth() || $body.hasClass('mobile') ) ) {

				if( $(target).parents('#side-block').length > 0 ){

					if( !$body.hasClass('side-block-open') ){
						$body.addClass('side-block-open');
					}

					$('body.side-block-open').mCustomScrollbar( 'scrollTo', mCustomScrollbarScrollToOffset( $body.find('.mCSB_container').find(target) ), {
						scrollInertia: 800
					});

					// Show - Close side block button
					if( $sideBlock.hasClass('hide-side-block') ){
						$closeSideBlock.addClass('active');
					}

					// Show - Global mask
					if( $globalMask.hasClass('hide-global-mask') && $sideBlock.hasClass('hide-side-block') ){
						$globalMask.addClass('active');
					}

				} else {
					if( $body.hasClass('has-side-block') && $body.hasClass('side-block-open') ){
						$closeSideBlock.trigger('click');
					}
				}

				// Close overlay navigation after menu element click
				if( closeOverlayNavAfterClick === true  && $(target).parents('.site-header') && $siteHeader.hasClass('header-overlay-navigation') && $navToggle.hasClass('open') ){
					$navToggle.trigger('click');
				}

			} else {

				$.smoothScroll({
					offset: -headerBaseHeight,
					easing: 'swing',
					speed: 800,
					scrollTarget: target,
					preventDefault: false
				});

				// Close overlay navigation after menu element click - only for mobile view
				if( closeOverlayNavAfterClick_mobile === true && $(target).parents('.site-header') && $siteHeader.hasClass('header-overlay-navigation') && $navToggle.hasClass('open') ){
					$navToggle.trigger('click');
				}

				// Close classic navigation after menu element click - only for mobile view
				if( closeClassicNavAfterClick_mobile === true && $(target).parents('.site-header') && $siteHeader.hasClass('header-classic-navigation') && $navToggle.hasClass('open') ){
					$navToggle.trigger('click');
				}

			}
		});

		// Close side block button
		$closeSideBlock.off('click');
		$closeSideBlock.on('click', function(e) {
			e.preventDefault();

			if ( !$(this).hasClass('active') )
				return true;

			// Hide - Close side block button
			$(this).removeClass('active');

			if( $body.hasClass('side-block-open') ){
				$body.removeClass('side-block-open');

				// Hide - Global mask
				if( $globalMask.hasClass('active') ){
					$globalMask.removeClass('active');
				}

				// Hide - Back to top button
				if( $backToTop.hasClass('active') ){
					$backToTop.removeClass('active');
				}

				setTimeout(function(){
					if( $body.hasClass('mCustomScrollbar') ){
						$body.mCustomScrollbar('scrollTo', ['top',null],{
							scrollInertia: 0
						});
					}
				}, 500);
			}
		});

	}

	// [3. Back to top]
	function petri_backToTopShowHide() {
		if( 576 >= getWindowWidth() ){
			if( !$body.hasClass('mCS_destroyed') && !$body.hasClass('mCustomScrollbar') ){
				var scrollpos = $(window).scrollTop();

				if ( scrollpos > 100 ) {
					$backToTop.addClass('active');
				} else {
					$backToTop.removeClass('active');
				}
			}
		} else {
			$backToTop.removeClass('active');
		}
	}

	function petri_backToTopButton() {
		$backToTop.off('click');
		$backToTop.on('click', function(e) {
			e.preventDefault();
			if( !$body.hasClass('mCS_destroyed') && !$body.hasClass('mCustomScrollbar') ){
				$.smoothScroll({
					offset: 0,
					easing: 'swing',
					speed: 800,
					scrollTarget: 0,
					preventDefault: false
				});
			} else {
				if( !( 1199 >= getWindowWidth() || $body.hasClass('mobile') ) && ( $body.hasClass('side-block-open') || !$sideBlock.hasClass('hide-side-block') ) ) {
					$('body.side-block-open').mCustomScrollbar('scrollTo',['top',null],{
						scrollInertia: 800
					});
				}
			}
		});
	}

	// [4. Backgrounds]
	function petri_backgrounds() {

		// Image
		var $bgImage = $('.bg-image-holder');
		if($bgImage.length) {
			$bgImage.each(function(){
				var src = $(this).children('img').attr('src');
				var $self = $(this);

				$self.css('background-image','url('+src+')').children('img').hide();

				$self.imagesLoaded({
					background: true
				}, function(instance, image) {
					$self.addClass('loaded');
				});
			});
		}

		// Vegas Backgrounds
		petri_vegas();

		// Youtube Video
		if ($('#youtube-background').length > 0) {
			var videos = [
				{videoURL: "iXkJmJa4NvE", showControls:false, containment:'.overlay-video',autoPlay:true, mute:true, startAt:0,opacity:1, loop:true, showYTLogo:false, realfullscreen: true, addRaster:true}
			];

			$('.player').YTPlaylist(videos, true);
		}

		// Youtube Multiple Videos
		if ($('#youtube-multiple-background').length > 0) {

			var videos = [
				{videoURL: "CG20eBusRg0", showControls:false, containment:'.overlay-video',autoPlay:true, mute:true, startAt:0,opacity:1, loop:false, showYTLogo:false, realfullscreen: true, addRaster:true},
				{videoURL: "iXkJmJa4NvE", showControls:false, containment:'.overlay-video',autoPlay:true, mute:true, startAt:0,opacity:1, loop:false, showYTLogo:false, realfullscreen: true, addRaster:true}
			];

			$('.player').YTPlaylist(videos, true);

		}

		// Video Background
		if($body.hasClass('mobile')) {
			$('.video-wrapper').css('display', 'none');
		}

		// Granim
		$('[data-gradient-bg]').each(function(index,element){
    		var granimParent = $(this),
    			granimID = 'granim-'+index+'',
				colours = granimParent.attr('data-gradient-bg'),
				colours = colours.replace(' ',''),
				colours = colours.replace(/'/g, '"')
				colours = JSON.parse( colours );

			// Add canvas
			granimParent.prepend('<canvas id="'+granimID+'"></canvas>');

			var granimInstance = new Granim({
				element: '#'+granimID,
				name: 'basic-gradient',
				direction: 'left-right', // 'diagonal', 'top-bottom', 'radial'
				opacity: [1, 1],
				isPausedWhenNotInView: true,
				states : {
					"default-state": {
						gradients: colours
					}
				}
			});
    	});

	}

	function petri_vegas() {
		// Slideshow
		if ($body.hasClass('slideshow-background')) {
			$body.vegas({
				preload: true,
				timer: false,
				delay: 5000,
				transition: 'fade',
				transitionDuration: 1000,
				slides: [
					{ src: 'demo/images/image-15.jpg' },
					{ src: 'demo/images/image-16.jpg' },
					{ src: 'demo/images/image-17.jpg' },
					{ src: 'demo/images/image-4.jpg' }
				]
			});
		}

		// Slideshow - ZoomOut
		if ($body.hasClass('slideshow-zoom-background')) {
			$body.vegas({
				preload: true,
				timer: false,
				delay: 7000,
				transition: 'zoomOut',
				transitionDuration: 4000,
				slides: [
					{ src: 'demo/images/image-4.jpg' },
					{ src: 'demo/images/image-16.jpg' },
					{ src: 'demo/images/image-17.jpg' },
					{ src: 'demo/images/image-15.jpg' }
				]
			});
		}

		// Slideshow with Video
		if ($body.hasClass('slideshow-video-background')) {
			$body.vegas({
				preload: true,
				timer: false,
				delay: 5000,
				transition: 'fade',
				transitionDuration: 1000,
				slides: [
					{ src: 'demo/images/image-15.jpg' },
					{ src: 'demo/video/marine.jpg',
						video: {
							src: [
								'demo/video/marine.mp4',
								'demo/video/marine.webm',
								'demo/video/marine.ogv'
							],
							loop: false,
							mute: true
						}
					},
					{ src: 'demo/images/image-16.jpg' },
					{ src: 'demo/images/image-17.jpg' }
				]
			});
		}

		// Kenburns
		if ($body.hasClass('kenburns-background')) {

			var kenburnsDisplayBackdrops = false;
			var kenburnsBackgrounds = [
				{ src: 'demo/images/image-15.jpg', valign: 'top' },
				{ src: 'demo/images/image-14.jpg', valign: 'top' },
				{ src: 'demo/images/image-17.jpg', valign: 'top' }
			];

			$body.vegas({
				preload: true,
				transition: 'swirlLeft2',
				transitionDuration: 4000,
				timer: false,
				delay: 10000,
				slides: kenburnsBackgrounds,
				walk: function (nb) {
					if (kenburnsDisplayBackdrops === true) {
						var backdrop;

						backdrop = backdrops[nb];
						backdrop.animation = 'kenburns';
						backdrop.animationDuration = 20000;
						backdrop.transition = 'fade';
						backdrop.transitionDuration = 1000;

						$body
							.vegas('options', 'slides', [ backdrop ])
							.vegas('next');
					}
				}
			});
		}

	}

	// [5. Masonry]
	function petri_masonryLayout() {
		if ($('.isotope-container').length > 0) {
			var $isotopeContainer = $('.isotope-container');
			var $columnWidth = $isotopeContainer.data('column-width');

			if($columnWidth == null){
				var $columnWidth = '.isotope-item';
			}

			$isotopeContainer.isotope({
				filter: '*',
				animationEngine: 'best-available',
				resizable: false,
				itemSelector : '.isotope-item',
				masonry: {
					columnWidth: $columnWidth
				},
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				}
			});
		}

		$('nav.isotope-filter ul a').on('click', function() {
			var selector = $(this).attr('data-filter');
			$isotopeContainer.isotope({ filter: selector });
			$('nav.isotope-filter ul a').removeClass('active');
			$(this).addClass('active');
			return false;
		});

	}

	// [6. Magnific Popup]
	function petri_magnificPopup() {
		if(	document.querySelectorAll('.mfp-image').length > 0 ||
			document.querySelectorAll('.mfp-gallery').length > 0 ||
			document.querySelectorAll('.mfp-iframe').length > 0 ||
			document.querySelectorAll('.mfp-ajax').length > 0 ||
			document.querySelectorAll('.open-popup-link').length > 0 ){

			if(!$().magnificPopup) {
				console.log('MagnificPopup: magnificPopup not defined.');
				return true;
			}

			$('.mfp-image').magnificPopup({
				type:'image',
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="fas fa-times"></i></button>',
				removalDelay: 300,
				mainClass: 'mfp-fade'
			});

			$('.mfp-gallery').each(function() {
				$(this).magnificPopup({
					delegate: 'a',
					type: 'image',
					gallery: {
						enabled: true
					},
					arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
					closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="fas fa-times"></i></button>',
					removalDelay: 300,
					mainClass: 'mfp-fade'
				});
			});

			$('.mfp-iframe').magnificPopup({
				type: 'iframe',
				iframe: {
					patterns: {
						youtube: {
							index: 'youtube.com/',
							id: 'v=',
							src: '//www.youtube.com/embed/%id%?autoplay=1'
						},
						vimeo: {
							index: 'vimeo.com/',
							id: '/',
							src: '//player.vimeo.com/video/%id%?autoplay=1'
						},
						gmaps: {
							index: '//maps.google.',
							src: '%id%&output=embed'
						}
					},
					srcAction: 'iframe_src'
				},
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="fas fa-times"></i></button>',
				removalDelay: 300,
				mainClass: 'mfp-fade'
			});

			$('.mfp-ajax').magnificPopup({
				type: 'ajax',
				ajax: {
					settings: null,
					cursor: 'mfp-ajax-cur',
					tError: '<a href="%url%">The content</a> could not be loaded.'
				},
				midClick: true,
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="fas fa-times"></i></button>',
				removalDelay: 300,
				mainClass: 'mfp-fade',
				callbacks: {
					ajaxContentAdded: function(mfpResponse) {
						ln_Slider();
					}
				}
			});

			$('.open-popup-link').magnificPopup({
				type: 'inline',
				midClick: true,
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="fas fa-times"></i></button>',
				removalDelay: 300,
				mainClass: 'mfp-zoom-in'
			});

			$('.popup-modal-dismiss').on('click', function (e) {
				e.preventDefault();
				$.magnificPopup.close();
			});

		}
	}

	// [7. Slider]
	function petri_slider() {
		var slider = $('.slider');
		if(slider.length > 0){
			slider.slick({
				slidesToShow: 1,
				infinite: true,
				nextArrow: '<button type="button" class="slick-next"><i class="fas fa-angle-right"></i></button>',
				prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-angle-left"></i></button>'
			});
		}
	}

	// [8. Countdown]
	function petri_countdown() {
		var countdown = $('.countdown[data-countdown]');

		if (countdown.length > 0) {
			countdown.each(function() {
				var $countdown = $(this),
					finalDate = $countdown.data('countdown');
				$countdown.countdown(finalDate, function(event) {
					$countdown.html(event.strftime(
						'<div class="countdown-container row"><div class="countdown-item col-6 col-sm"><div class="number">%-D</div><span>Day%!d</span></div><div class="countdown-item col-6 col-sm"><div class="number">%H</div><span>Hours</span></div><div class="countdown-item col-6 col-sm"><div class="number">%M</div><span>Minutes</span></div><div class="countdown-item col-6 col-sm"><div class="number">%S</div><span>Seconds</span></div></div>'
					));
				});
			});
		}
	}

	// [9. Mailchimp]
	function petri_mailchimp() {
		var subscribeForm = $('.subscribe-form');
		if( subscribeForm.length < 1 ){ return true; }

		subscribeForm.each( function(){
			var el = $(this),
				elResult = el.find('.subscribe-form-result');

			el.find('form').validate({
				submitHandler: function(form) {
					elResult.fadeOut( 500 );

					$(form).ajaxSubmit({
						target: elResult,
						dataType: 'json',
						resetForm: true,
						success: function( data ) {
							elResult.html( data.message ).fadeIn( 500 );
							if( data.alert != 'error' ) {
								$(form).clearForm();
								setTimeout(function(){
									elResult.fadeOut( 500 );
								}, 5000);
							};
						}
					});
				}
			});

		});
	}

	// [10. Contact Form]
	function petri_contactForm() {
		var contactForm = $('.contact-form');
		if( contactForm.length < 1 ){ return true; }

		contactForm.each( function(){
			var el = $(this),
				elResult = el.find('.contact-form-result');

			el.find('form').validate({
				submitHandler: function(form) {
					elResult.fadeOut( 500 );

					$(form).ajaxSubmit({
						target: elResult,
						dataType: 'json',
						success: function( data ) {
							elResult.html( data.message ).fadeIn( 500 );
							if( data.alert != 'error' ) {
								$(form).clearForm();
								setTimeout(function(){
									elResult.fadeOut( 500 );
								}, 5000);
							};
						}
					});
				}
			});

		});
	}

	// window load function
	$(window).on('load', function() {
		petri_preloader();
		petri_masonryLayout();
	});

	// document.ready function
	jQuery(document).ready(function($) {
		petri_navigation();
		petri_backgrounds();
		petri_backToTopButton();
		petri_magnificPopup();
		petri_slider();
		petri_countdown();
		petri_mailchimp();
		petri_contactForm();
	});

	// window.resize function
	$(window).on('resize', function() {
		petri_slider();
		petri_navigation();
		petri_backToTopShowHide();
		petri_masonryLayout();
	});

	// window.scroll function
	$(window).on('scroll', function() {
		petri_backToTopShowHide();
	});

})(jQuery);