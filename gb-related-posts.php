<?php
/**
 * Plugin Name: Gutenberg Related Posts Block
 * Plugin URI:
 * Description: Related Posts block for Gutenberg editor.
 * Version: 1.0
 * Author: Chandra Patel
 * Author URI: https://chandrapatel.in
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: gb-related-posts
 *
 * @package gb-related-posts
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'GBRP_VERSION' ) ) {
	define( 'GBRP_VERSION', '1.0' );
}

if ( ! defined( 'GBRP_DIR' ) ) {
	define( 'GBRP_DIR', __DIR__ );
}

if ( ! defined( 'GBRP_URL' ) ) {
	define( 'GBRP_URL', WP_PLUGIN_URL . '/gb-related-posts' );
}

if ( ! function_exists( 'is_plugin_active' ) ) {
	include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
}

if ( ! is_plugin_active( 'gutenberg/gutenberg.php' ) ) {

	add_action( 'admin_notices', function() {

		printf(
			'<div class="error"><p>%s</p></div>',
			esc_html__(
				'Gutenberg Related Posts Block plugin require Gutenberg plugin. Install or Activate Gutenberg plugin.',
				'gb-related-posts'
			)
		);

		deactivate_plugins( [ 'gb-related-posts/gb-related-posts.php' ] );

	} );

	return;

}

// Load Related Posts Block.
require_once( GBRP_DIR . '/classes/class-related-posts.php' );



//EOF
