$( document ).ready(function() {

	var $title = document.title;
	
	if( $('.contact-form').length < 1) {
		$('.site-wrapper').append($('<div class="contact-form">').load('contact.html', function() {
	
			//Form is dynamically loaded so, binding event after success of page load.
			$('#cancelForm').on('click', function() {
				overlayToggle();
			});	
			
			$('form').on('submit', function(){
				$name = $('input[name=name]').val();
				$email = $('input[name=email]').val();
				$message = $('textarea[name=message]').val();
				
				if($name.trim()=='' || $email.trim()=='' || $message.trim()=='') {
					$('.alert').css('color', 'red');
					$('.alert').text('Oops! looks like you missed required fields.');
				}
				else {
					$.ajax({
						type: 'POST',
						url: $("form").attr("action"),
						data: $('form').serialize(),
						
						beforeSend: function() {
							//Starting loading animation
							$('.loading').css('display', 'block');
						},						
						
						error: function() {
							$('.alert').text('Error! You can shout at me, at [ gauravbutola at gmail.com ]').css('color', 'red');
							$('.loading').css('display', 'none')
						},
						
						success: function() {
							$('input').prop('disabled', true);
							$('textarea').prop('disabled', true);
						
						
							//Hiding loading animation	
							$('.loading').css('display', 'none');
							$('.alert').text('Thanks for contacting. I\'ll get back to you asap.').css('color', 'green');							
						}
					});
				}
				return false;
			});	
		}));
	}
	
	//Toggle the form
	var overlayToggle = function() {
		if( $('.black_overlay').length < 1) {
			//Add the black overlay if it isn't already there.
			$('body').append("<div class='black_overlay'></div>");
		}

		if($('.contact-form').css('display') == 'none') {	
			$title = document.title;
			//Change page title
			document.title = "Gaurav Butola | Contact";	
 			$(".contact-form").toggle( "bounce", { times: 3 }, 1000 );
			$('.black_overlay').css('display', 'block');
		}
		else {		
			//Change the title back to what it was
			document.title = $title;
		
 			$(".contact-form").toggle( "bounce", { times: 3 }, 1000, function(){
 				/*End overlay only after bounce is finished*/
 				$('.black_overlay').css('display', 'none');
 			} );
			
		}
	}
	
	$('#contact').on('click', function() {
		overlayToggle();
	});
	
	$('#cancelForm').on('click', function() {
		overlayToggle();
	});
	

	if(document.location.hash == '#contact') {
		overlayToggle();
	}

	//toggle menu on mobile
	$('.nav_menu').on('click', function(){
		$('.nav ul').slideToggle();
	});
	
	
	if( $('.project-overlay').length < 1) {
			//Add the black overlay if it isn't already there.
			$('.project').append("<div class='project-overlay'></div>");
	}
	$('.project').mouseenter(function(){
		$(this).find('.project-overlay').fadeIn(200)
		$(this).animate({'height':'300px'}, 150);
	}).mouseleave(function(){
		$(this).find('.project-overlay').fadeOut(200)
		$(this).animate({'height':'150px'}, 150);
	});
	
	//Source warning
	$('.sourceNA').on('click', function(e) {
		e.preventDefault();
		alert("Source not yet made publicly available for this project. Please contact if you want to get a hold of it now.");
	});

	
	
	
	
	
	
	/***************** Google Analytics code start *****************/
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-42712856-1', 'butola.com');
	ga('send', 'pageview');
	/***************** Google Analytics code End *****************/
});

