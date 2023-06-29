/*
Author: Erilisdesign
Author URI: http://themeforest.net/user/Erlisdesign
Version: 1.0
License: https://themeforest.net/licenses/standard
*/

(function($) {
	"use strict";

	// Vars
	var body = $('body'),
		scrollTo = $('a.scrollto');

	function getWindowWidth() {
		return Math.max( $(window).width(), window.innerWidth);
	}

	// [1. Sidebar]
	function init_ED_Sidebar() {
		$('.ed-dn-link').on('click', function(e){
			e.preventDefault();

			var el = $(this),
				target = el.attr('href');

			if( el.parent('.ed-dn-item').hasClass('active') ){
				el.next('.ed-sidenav').slideUp(500);
				el.parent('.ed-dn-item').removeClass('active');
				$('.ed-d-group').removeClass('show');
				setTimeout(function() {
					$('.ed-d-group').removeClass('active');
					$(window).scrollTop(0);
				}, 300);
				$('.ed-dn-item [href="#overview"]').trigger('click');
			} else {
				$('.ed-sidenav').slideUp(500);
				$('.ed-dn-item').removeClass('active');
				$('.ed-d-group').removeClass('show');
				setTimeout(function() {
					$('.ed-d-group').removeClass('active');
					el.next('.ed-sidenav').slideDown(500);
					el.parent('.ed-dn-item').addClass('active');
					$(target).addClass('active');
					$(window).scrollTop(0);
				}, 300);
				setTimeout(function() {
					$(target).addClass('show');
				}, 400);
			}
		});
		
		$('.ed-dn-link').first().trigger('click');
	}

	// [2. Scroll progress]
	function init_LN_ScrollProgress(nextIndex) {
		if( getWindowWidth() >= 1200 ){
			var scvp = $(window).scrollTop();

			var dh = $(document).height(),
				dp = $(window).height(),
				scrollPercent = (scvp / (dh-dp)) * 100,
				position = scrollPercent;
			$('.scroll-progress .progress').css('height', position + '%');
		}
	}

	// document.ready function
	jQuery(document).ready(function($) {
		init_ED_Sidebar();
	});

	// window.resize function
	$(window).on('resize', function () {
		init_LN_ScrollProgress('none');
	});
	
	// window.scroll function
	$(window).on('scroll', function () {
		init_LN_ScrollProgress('none');
	});

})(jQuery);