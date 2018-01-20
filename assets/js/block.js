const { __ } = wp.i18n;
const { registerBlockType, Editable, BlockControls, InspectorControls, BlockDescription, source: { children } } = wp.blocks;
const { Placeholder, Toolbar, Spinner } = wp.components;
const { decodeEntities } = wp.utils;
const { Component } = wp.element;
const { TextControl, ToggleControl, RangeControl } = wp.blocks.InspectorControls;

import classnames from 'classnames';

const MIN_POSTS = 2;
const MAX_POSTS = 6;
const MAX_POSTS_COLUMNS = 3;

/**
 * Returns a Promise with the related posts or an error on failure.
 *
 * @param   {Number} postsToShow Number of posts to display.
 *
 * @returns Returns a Promise with the related posts.
 */
export function getRelatedPosts( postsToShow = 2 ) {

	return jQuery.post(
		gbrpObject.ajax_url,
		{
			action: 'gbrp_related_posts',
			post_id: gbrpObject.post_id,
			num_of_posts: postsToShow,
			gbrp_security: gbrpObject.ajax_nonce
		}
	);

}


registerBlockType( 'gbrp/related-posts', {

	title: __( 'Related Posts' ),

	description: __( 'Shows a list of related posts.' ),

	icon: 'list-view',

	category: 'widgets',

	keywords: [ __( 'related posts' ) ],

	attributes: {

		title: {
			type: 'string',
			default: __( 'Related' ),
		},
		postsToShow: {
			type: 'number',
			default: 3,
		},
		displayPostDate: {
			type: 'boolean',
			default: false,
		},
		displayPostThumbnail: {
			type: 'boolean',
			default: false,
		},
		layout: {
			type: 'string',
			default: 'list',
		},
		columns: {
			type: 'number',
			default: 3,
		},

	},

	edit: class extends Component {

		constructor() {

			super( ...arguments );

			this.changePostsToShow = this.changePostsToShow.bind( this );

			const { postsToShow } = this.props.attributes;

			this.state = {
				relatedPosts: [],
			};

			this.relatedPostsRequest = getRelatedPosts( postsToShow );

			this.relatedPostsRequest
				.then( relatedPosts => this.setState( { relatedPosts } ) );

			this.toggleDisplayPostDate = this.toggleDisplayPostDate.bind( this );

			this.toggleDisplayPostThumbnail = this.toggleDisplayPostThumbnail.bind( this );

		}

		toggleDisplayPostDate() {
			const { displayPostDate } = this.props.attributes;
			const { setAttributes } = this.props;

			setAttributes( { displayPostDate: ! displayPostDate } );
		}

		toggleDisplayPostThumbnail() {
			const { displayPostThumbnail } = this.props.attributes;
			const { setAttributes } = this.props;

			setAttributes( { displayPostThumbnail: ! displayPostThumbnail } );
		}

		componentWillReceiveProps( nextProps ) {
			const { postsToShow: postToShowCurrent } = this.props.attributes;
			const { postsToShow: postToShowNext } = nextProps.attributes;
			const { setAttributes } = this.props;

			if ( postToShowCurrent === postToShowNext ) {
				return;
			}

			if ( postToShowNext >= MIN_POSTS && postToShowNext <= MAX_POSTS ) {
				this.relatedPostsRequest = getRelatedPosts( postToShowNext );

				this.relatedPostsRequest
					.then( relatedPosts => this.setState( { relatedPosts } ) );

				setAttributes( { postsToShow: postToShowNext } );
			}
		}

		changePostsToShow( postsToShow ) {
			const { setAttributes } = this.props;
			setAttributes( { postsToShow: parseInt( postsToShow, 10 ) || 0 } );
		}

		render() {
			const { relatedPosts } = this.state;

			const { setAttributes } = this.props;

			if ( ! relatedPosts.length ) {
				return (
					<Placeholder
						icon="admin-post"
						label={ __( 'Related Posts' ) }
					>
						<Spinner />
					</Placeholder>
				);
			}

			// Removing posts from display should be instant.
			const postsDifference = relatedPosts.length - this.props.attributes.postsToShow;
			if ( postsDifference > 0 ) {
				relatedPosts.splice( this.props.attributes.postsToShow, postsDifference );
			}

			const { focus } = this.props;
			const { title, displayPostDate, displayPostThumbnail, layout, columns } = this.props.attributes;
			const layoutControls = [
				{
					icon: 'list-view',
					title: __( 'List View' ),
					onClick: () => setAttributes( { layout: 'list' } ),
					isActive: layout === 'list',
				},
				{
					icon: 'grid-view',
					title: __( 'Grid View' ),
					onClick: () => setAttributes( { layout: 'grid' } ),
					isActive: layout === 'grid',
				},
			];

			return [
				focus && (
					<BlockControls key="controls">
						<Toolbar controls={ layoutControls } />
					</BlockControls>
				),

				focus && (
					<InspectorControls key="inspector">
						<h3>{ __( 'Related Posts Settings' ) }</h3>
						<TextControl
							label={ __( 'Title' ) }
							type="text"
							value={ title }
							onChange={ ( value ) => setAttributes( { title: value } ) }
						/>
						<ToggleControl
							label={ __( 'Display post date' ) }
							checked={ displayPostDate }
							onChange={ this.toggleDisplayPostDate }
						/>
						{ layout === 'grid' &&
						<ToggleControl
							label={ __( 'Display post thumbnail' ) }
							checked={ displayPostThumbnail }
							onChange={ this.toggleDisplayPostThumbnail }
						/>
						}
						{ layout === 'grid' &&
							<RangeControl
								label={ __( 'Columns' ) }
								value={ columns }
								onChange={ ( value ) => setAttributes( { columns: value } ) }
								min={ 2 }
								max={ Math.min( MAX_POSTS_COLUMNS, relatedPosts.length ) }
							/>
						}
						<TextControl
							label={ __( 'Number of posts to show' ) }
							type="number"
							min={ MIN_POSTS }
							max={ MAX_POSTS }
							value={ this.props.attributes.postsToShow }
							onChange={ ( value ) => this.changePostsToShow( value ) }
						/>
					</InspectorControls>
				),
				<div className={ this.props.className }>
					{ title &&
						<h3 className="related-posts-title"> {title} </h3>
					}
					<ul
						className={ classnames( 'columns-' + columns, {
							'is-grid': layout === 'grid',
							'is-list': layout === 'list',
						} ) }
						key="related-posts"
					>
						{ relatedPosts.map( ( post, i ) =>
							<li key={ i }>
								{ displayPostThumbnail && post.thumbnail &&
									<img src={ post.thumbnail } />
								}
								<a href={ post.url } target="_blank">{ decodeEntities( post.post_title.trim() ) || __( '(Untitled)' ) }</a>
								{ displayPostDate && post.post_date_gmt &&
									<time dateTime={ moment( post.post_date_gmt ).utc().format() } className={ `${ this.props.className }__post-date` }>
										{ moment( post.post_date_gmt ).local().format( 'MMMM DD, Y' ) }
									</time>
								}
							</li>
						) }
					</ul>
				</div>,
			];
		}

		componentWillUnmount() {
			if ( this.relatedPostsRequest.state() === 'pending' ) {
				this.relatedPostsRequest.abort();
			}
		}

	},

	save() {
		return null;
	},

} );
