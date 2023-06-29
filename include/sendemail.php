<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';

// If you intend you use SMTP, uncomment next line
//require 'phpmailer/src/SMTP.php';


// Receiver's Email
$toemails = array();

$toemails[] = array(
	'email' => 'your@email.com', // Your Email Address
	'name' => 'Your Name' // Your Name
);


// Sender's Email
$fromemail = array(
	'email' => 'no-reply@companywebsite.com', // Company's Email Address (preferably currently used Domain Name)
	'name' => 'Company Name' // Company Name
);


// reCaptcha - Add this only if you use reCaptcha with your Contact Forms
$recaptcha_secret = ''; // Your reCaptcha Secret


// PHPMailer Initialization
$mail = new PHPMailer();

// If you intend you use SMTP, add your SMTP Code after this Line


// End of SMTP


// Form Messages
$message = array(
	'success'           => 'We have successfully received your Message and will get Back to you as soon as possible.',
	'error'             => 'Email could not be sent due to some Unexpected Error. Please Try Again later.',
	'error_bot'         => 'Bot Detected! Form could not be processed! Please Try Again!',
	'error_unexpected'  => 'An unexpected error occured. Please Try Again later.',
	'recaptcha_invalid' => 'Captcha not Validated! Please Try Again!',
	'recaptcha_error'   => 'Captcha not Submitted! Please Try Again.'
);

// Form Processor
if( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

	$prefix    = !empty( $_POST['prefix'] ) ? $_POST['prefix'] : '';
	$submits   = $_POST;
	$botpassed = false;
	
	$message_form                 = !empty( $submits['message'] ) ? $submits['message'] : array();
	$message['success']           = !empty( $message_form['success'] ) ? $message_form['success'] : $message['success'];
	$message['error']             = !empty( $message_form['error'] ) ? $message_form['error'] : $message['error'];
	$message['error_bot']         = !empty( $message_form['error_bot'] ) ? $message_form['error_bot'] : $message['error_bot'];
	$message['error_unexpected']  = !empty( $message_form['error_unexpected'] ) ? $message_form['error_unexpected'] : $message['error_unexpected'];
	$message['recaptcha_invalid'] = !empty( $message_form['recaptcha_invalid'] ) ? $message_form['recaptcha_invalid'] : $message['recaptcha_invalid'];
	$message['recaptcha_error']   = !empty( $message_form['recaptcha_error'] ) ? $message_form['recaptcha_error'] : $message['recaptcha_error'];


	// Bot Protection
	if( isset( $submits[ $prefix . 'botcheck' ] ) ) {
		$botpassed = true;
	}

	if( !empty( $submits[ $prefix . 'botcheck' ] ) ) {
		$botpassed = false;
	}

	if( $botpassed == false ) {
		echo '{ "alert": "error", "message": "' . $message['error_bot'] . '" }';
		exit;
	}


	// reCaptcha
	if( isset( $submits['g-recaptcha-response'] ) ) {

		$recaptcha_data = array(
			'secret' => $recaptcha_secret,
			'response' => $submits['g-recaptcha-response']
		);

		$recap_verify = curl_init();
		curl_setopt( $recap_verify, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify" );
		curl_setopt( $recap_verify, CURLOPT_POST, true );
		curl_setopt( $recap_verify, CURLOPT_POSTFIELDS, http_build_query( $recaptcha_data ) );
		curl_setopt( $recap_verify, CURLOPT_SSL_VERIFYPEER, false );
		curl_setopt( $recap_verify, CURLOPT_RETURNTRANSFER, true );
		$recap_response = curl_exec( $recap_verify );

		$g_response = json_decode( $recap_response );

		if ( $g_response->success !== true ) {
			echo '{ "alert": "error", "message": "' . $message['recaptcha_invalid'] . '" }';
			exit;
		}
	}

	$template	= !empty( $submits['template'] ) ? $submits['template'] : 'html';
	$html_title	= !empty( $submits['html_title'] ) ? $submits['html_title'] : 'Form Response';
	$forcerecap	= ( !empty( $submits['force_recaptcha'] ) && $submits['force_recaptcha'] != 'false' ) ? true : false;
	$replyto	= !empty( $submits['replyto'] ) ? explode( ',', $submits['replyto'] ) : false;

	if( $forcerecap ) {
		if( !isset( $submits['g-recaptcha-response'] ) ) {
			echo '{ "alert": "error", "message": "' . $message['recaptcha_error'] . '" }';
			exit;
		}
	}

	$mail->Subject = !empty( $submits['subject'] ) ? $submits['subject'] : 'Form Response from your Website';
	$mail->SetFrom( $fromemail['email'] , $fromemail['name'] );

	if( !empty( $replyto ) ) {
		if( count( $replyto ) > 1 ) {
			$replyto_e = $submits[ $replyto[0] ];
			$replyto_n = $submits[ $replyto[1] ];
			$mail->AddReplyTo( $replyto_e , $replyto_n );
		} elseif( count( $replyto ) == 1 ) {
			$replyto_e = $submits[ $replyto[0] ];
			$mail->AddReplyTo( $replyto_e );
		}
	}

	foreach( $toemails as $toemail ) {
		$mail->AddAddress( $toemail['email'] , $toemail['name'] );
	}

	$unsets = array( 'prefix', 'subject', 'replyto', 'template', 'html_title', 'message', $prefix . 'botcheck', 'g-recaptcha-response', 'force_recaptcha', $prefix . 'submit' );

	foreach( $unsets as $unset ) {
		unset( $submits[ $unset ] );
	}

	$fields = array();

	foreach( $submits as $name => $value ) {
		if( empty( $value ) ) continue;

		$name = str_replace( $prefix , '', $name );
		$name = ucwords( str_replace( '-', ' ', $name ) );

		if( is_array( $value ) ) {
			$value = implode( ', ', $value );
		}

		$fields[$name] = $value;
	}

	$files = $_FILES;

	foreach( $files as $file => $filevalue ) {
		if( is_array( $filevalue['name'] ) ) {
			$filecount = count( $filevalue['name'] );

			for( $f = 0; $f < $filecount; $f++ ) {
				if ( isset( $_FILES[ $file ] ) && $_FILES[ $file ]['error'][ $f ] == UPLOAD_ERR_OK ) {
					$mail->IsHTML(true);
					$mail->AddAttachment( $_FILES[ $file ]['tmp_name'][ $f ], $_FILES[ $file ]['name'][ $f ] );
				}
			}
		} else {
			if ( isset( $_FILES[ $file ] ) && $_FILES[ $file ]['error'] == UPLOAD_ERR_OK ) {
				$mail->IsHTML(true);
				$mail->AddAttachment( $_FILES[ $file ]['tmp_name'], $_FILES[ $file ]['name'] );
			}
		}
	}

	$response = array();

	foreach( $fields as $fieldname => $fieldvalue ) {
		if( $template == 'text' ) {
			$response[] = $fieldname . ': ' . $fieldvalue;
		} else {
			$fieldname = '<tr><td class="content-msg__title" style="font-size: 16px; line-height: 24px; font-weight: bold; padding: 0 30px 5px 30px;" align="left">' . $fieldname . '</td></tr>';
			$fieldvalue = '<tr><td class="content-msg__content" style="font-size: 16px; line-height: 24px; color: #737373; padding: 0 30px 30px 30px;" align="left">' . $fieldvalue . '</td></tr>';
			$response[] = $fieldname . $fieldvalue;
		}
	}

	$referrer = $_SERVER['HTTP_REFERER'] ? '<br><br><br>This Form was submitted from: ' . $_SERVER['HTTP_REFERER'] : '';

	$html_before = '<table class="wrapper" border="0" cellpadding="0" cellspacing="0" width="100%" height="100%" bgcolor="#f3f3f3" style="width: 100%; height: 100%; padding: 50px 0 50px 0;">
						<tr>
							<td valign="top" align="center" width="100%">
								<table class="container" border="0" cellpadding="0" cellspacing="0" width="640" style="width:640px;">
									<tr>
										<td align="center" valign="top">';

	$html_after = '</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>';

	$html_header = '<!-- Header -->
		<table class="header" border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="width: 100%;">
			<tr>
				<td align="center" style="color: #000; text-align: center; font-size: 24px; font-weight: bold; padding: 0 30px 30px 30px;">
					' . $html_title . '
				</td>
			</tr>
		</table>';

	$html_content = '<!-- Content -->
		<table class="content" border="0" cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#ffffff" style="width: 100%; padding: 60px 0 30px 0; border-radius: 3px; border-width: 1px; border-style: solid; border-color: #e3e3e3;">
			' . implode( '', $response ) . '
		</table>';

	$html_footer = '<!-- Footer -->
		<table class="footer" border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="width: 100%;">
			<tr>
				<td align="center" style="color: #737373; text-align: center; font-size: 12px; padding: 30px 30px 0 30px; line-height: 22px;">
					' . strip_tags( $referrer ) . '
				</td>
			</tr>
		</table>';

	if( $template == 'text' ) {
		$body = implode( "<br>", $response ) . $referrer;
	} else {
		$html = $html_before . $html_header . $html_content . $html_footer . $html_after;

		$body = $html;
	}

	$mail->MsgHTML( $body );
	$sendEmail = $mail->Send();

	if( $sendEmail == true ):
		if( $autores && !empty( $replyto_e ) ) {
			$send_arEmail = $autoresponder->Send();
		}

		echo '{ "alert": "success", "message": "' . $message['success'] . '" }';
	else:
		echo '{ "alert": "error", "message": "' . $message['error'] . '<br><br><strong>Reason:</strong><br>' . $mail->ErrorInfo . '" }';
	endif;

} else {
	echo '{ "alert": "error", "message": "' . $message['error_unexpected'] . '" }';
}

?>