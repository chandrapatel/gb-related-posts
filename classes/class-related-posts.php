<?php
/**
 * Related Posts Block
 *
 * @package gb-related-posts
 */

namespace GB\Block;

/**
 * Related Posts Block
 */
class Related_Posts {

	/**
	 * Initialization
	 */
	public function __construct() {

		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ] );

		add_action( 'enqueue_block_assets', [ $this, 'enqueue_block_assets' ] );

		add_action( 'wp_ajax_gbrp_related_posts', [ $this, 'related_posts_ajax_action' ] );

		add_action( 'wp_ajax_no_priv_gbrp_related_posts', [ $this, 'related_posts_ajax_action' ] );

		add_action( 'init', [ $this, 'register_block' ] );

	}

	/**
	 * Enqueue block editor assets
	 *
	 * @since 1.0
	 */
	public function enqueue_block_editor_assets() {

		global $post;

		wp_enqueue_script(
			'gbrp-js',
			plugins_url( 'assets/js/block.build.js', __DIR__ ),
			[ 'wp-blocks', 'wp-i18n', 'wp-element', 'moment' ],
			filemtime( plugin_dir_path( __DIR__ ) . 'assets/js/block.build.js' )
		);

		wp_localize_script( 'gbrp-js', 'gbrpObject', [
			'ajax_url'   => admin_url( 'admin-ajax.php' ),
			'ajax_nonce' => wp_create_nonce( 'gbrp_nonce' ),
			'post_id'    => $post->ID,
		] );

		wp_enqueue_style(
			'gbrp-editor-style',
			plugins_url( 'assets/css/editor.css', __DIR__ ),
			[ 'wp-edit-blocks' ],
			filemtime( plugin_dir_path( __DIR__ ) . 'assets/css/editor.css' )
		);

	}

	/**
	 * Enqueue block assets
	 *
	 * @since 1.0
	 */
	public function enqueue_block_assets() {

		wp_enqueue_style(
			'gbrp-style',
			plugins_url( 'assets/css/style.css', __DIR__ ),
			[ 'wp-blocks' ],
			filemtime( plugin_dir_path( __DIR__ ) . 'assets/css/style.css' )
		);

	}

	/**
	 * Get related posts
	 *
	 * @since 1.0
	 *
	 * @param int $post_id      A Post ID.
	 * @param int $num_of_posts A number of posts needed. Default is 3.
	 *
	 * @return bool|array
	 */
	protected function _gbrp_get_related_posts( $post_id, $num_of_posts = 3 ) {

		if ( empty( $post_id ) ) {
			return false;
		}

		$cat_ids = wp_get_post_categories( $post_id );

		$posts = get_posts( [
			'category__in'        => $cat_ids,
			'post__not_in'        => array( $post_id ),
			'posts_per_page'      => $num_of_posts,
			'ignore_sticky_posts' => true,
			'surpress_filters'    => false,
		] );

		if ( empty( $posts ) || ! is_array( $posts ) ) {
			return false;
		}

		foreach ( $posts as $index => $post ) {

			$posts[ $index ]->url = get_permalink( $post->ID );
			$posts[ $index ]->thumbnail = get_the_post_thumbnail_url( $post->ID );

		}

		return $posts;

	}

	/**
	 * Handle ajax request to get related posts
	 *
	 * @todo Use rest-api. Create custom end point '/posts/related/'.
	 *
	 * @since 1.0
	 */
	public function related_posts_ajax_action() {

		check_ajax_referer( 'gbrp_nonce', 'gbrp_security' );

		$args = wp_parse_args(
			$_POST,  // input var ok.
			[
				'post_id'      => 0,
				'num_of_posts' => 3,
			]
		);

		$related_posts = [];

		if ( ! empty( $args['post_id'] ) ) {
			$related_posts = $this->_gbrp_get_related_posts( $args['post_id'], $args['num_of_posts'] );
		}

		if ( ! empty( $related_posts ) && is_array( $related_posts ) ) {
			wp_send_json( $related_posts );
		} else {
			wp_send_json( [] );
		}

	}

	/**
	 * Register related posts block
	 *
	 * @since 1.0
	 */
	public function register_block() {

		register_block_type(
			'gbrp/related-posts', [
				'attributes' => [
					'title'                => [
						'type'    => 'string',
						'default' => __( 'Related', 'gb-related-posts' ),
					],
					'postsToShow'          => [
						'type'    => 'number',
						'default' => 3,
					],
					'displayPostDate'      => [
						'type'    => 'boolean',
						'default' => false,
					],
					'layout'               => [
						'type'    => 'string',
						'default' => 'list',
					],
					'columns'              => [
						'type'    => 'number',
						'default' => 3,
					],
					'displayPostThumbnail' => [
						'type'    => 'boolean',
						'default' => false,
					],
				],

				'render_callback' => [ $this, 'render_block' ],
			]
		);

	}

	/**
	 * Renders the 'gbrp/related-posts' block on front-end.
	 *
	 * @since 1.0
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string Returns related posts content.
	 */
	function render_block( $attributes ) {

		$related_posts = $this->_gbrp_get_related_posts( get_the_ID(), $attributes['postsToShow'] );

		$list_items_markup = '';

		foreach ( $related_posts as $post ) {

			$list_items_markup .= "<li>\n";

			if ( isset( $attributes['displayPostThumbnail'] ) && $attributes['displayPostThumbnail'] ) {

				$thumbnail = get_the_post_thumbnail_url( $post->ID );

				if ( ! empty( $thumbnail ) ) {
					$list_items_markup .= sprintf(
						'<img src="%s" />',
						esc_url( $thumbnail )

					);
				}

			}

			$title = get_the_title( $post->ID );

			$list_items_markup .= sprintf(
				'<a href="%1$s">%2$s</a>',
				esc_url( get_permalink( $post->ID ) ),
				esc_html( $title )
			);

			if ( isset( $attributes['displayPostDate'] ) && $attributes['displayPostDate'] ) {

				$list_items_markup .= sprintf(
					'<time datetime="%1$s" class="wp-block-gbrp-related-posts__post-date">%2$s</time>',
					esc_attr( get_the_date( 'c', $post->ID ) ),
					esc_html( get_the_date( '', $post->ID ) )
				);

			}

			$list_items_markup .= "</li>\n";

		}

		$class = '';

		if ( isset( $attributes['layout'] ) && 'grid' === $attributes['layout'] ) {
			$class .= 'is-grid';
		} else {
			$class .= 'is-list';
		}

		if ( isset( $attributes['columns'] ) ) {
			$class .= ' columns-' . $attributes['columns'];
		} else {
			$class .= ' columns-3';
		}

		$title_markup = '';

		if ( ! empty( $attributes['title'] ) ) {
			$title_markup = '<h3 class="related-posts-title">' . $attributes['title'] . '</h3>';
		}

		$title_markup .= '</h3>';

		$block_content = sprintf(
			'<div class="wp-block-gbrp-related-posts">%1$s<ul class="%2$s">%3$s</ul></div>',
			$title_markup,
			esc_attr( $class ),
			$list_items_markup
		);

		return $block_content;

	}

}

// Initialize class.
new Related_Posts();
