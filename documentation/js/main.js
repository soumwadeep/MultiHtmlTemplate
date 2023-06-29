/*
Author: Erilisdesign
Author URI: https://themeforest.net/user/Erlisdesign
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

	function getWindowHeight() {
		return Math.max( $(window).height(), window.innerHeight);
	}

	function init_ED_Sidebar() {
		$('#ed-docs-nav a').on('click', function(e){
			e.preventDefault();

			var el = $(this),
				target = el.attr('href'),
				group;

			if( !el.parents('.ed-dn-item').hasClass('active') ){
				if( el.hasClass('ed-dn-link') ){
					group = target;
				} else {
					group = el.parents('.ed-dn-item').find('.ed-dn-link').attr('href');
				}

				$('.ed-dn-item').removeClass('active');
				$('.ed-d-group').removeClass('show');
				setTimeout(function() {
					$('.ed-d-group').removeClass('active');
					//el.next('.ed-sidenav').slideDown(500);
					el.parents('.ed-dn-item').addClass('active');
					$(group).addClass('active');
					$(window).scrollTop(0);
				}, 300);
				setTimeout(function() {
					$(group).addClass('show');
					var offset = $(target).offset().top;
					$(window).scrollTop(offset);
				}, 400);
			} else {
				var offset = $(target).offset().top;
				$(window).scrollTop(offset);
			}
		});
		
		$('.ed-dn-link').first().trigger('click');
	}

	function init_ED_SidebarSize() {
		var edHeaderHeight = $('.ed-header').innerHeight(),
			edFooterHeight = $('.ed-footer').innerHeight(),
			height = getWindowHeight() - edHeaderHeight - edFooterHeight;

		$('.ed-sidebar .ed-links').css( 'height', height );
	}

	// document.ready function
	jQuery(document).ready(function($) {
		init_ED_Sidebar();
		init_ED_SidebarSize();
	});

	// window.resize function
	$(window).on('resize', function () {
		init_ED_SidebarSize();
	});

})(jQuery);