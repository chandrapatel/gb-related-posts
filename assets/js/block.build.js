/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["getRelatedPosts"] = getRelatedPosts;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_classnames__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_classnames__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __ = wp.i18n.__;
var _wp$blocks = wp.blocks,
    registerBlockType = _wp$blocks.registerBlockType,
    Editable = _wp$blocks.Editable,
    BlockControls = _wp$blocks.BlockControls,
    InspectorControls = _wp$blocks.InspectorControls,
    BlockDescription = _wp$blocks.BlockDescription,
    children = _wp$blocks.source.children;
var _wp$components = wp.components,
    Placeholder = _wp$components.Placeholder,
    Toolbar = _wp$components.Toolbar,
    Spinner = _wp$components.Spinner;
var decodeEntities = wp.utils.decodeEntities;
var Component = wp.element.Component;
var _wp$blocks$InspectorC = wp.blocks.InspectorControls,
    TextControl = _wp$blocks$InspectorC.TextControl,
    ToggleControl = _wp$blocks$InspectorC.ToggleControl,
    RangeControl = _wp$blocks$InspectorC.RangeControl;




var MIN_POSTS = 2;
var MAX_POSTS = 6;
var MAX_POSTS_COLUMNS = 3;

/**
 * Returns a Promise with the related posts or an error on failure.
 *
 * @param   {Number} postsToShow Number of posts to display.
 *
 * @returns Returns a Promise with the related posts.
 */
function getRelatedPosts() {
	var postsToShow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;


	return jQuery.post(gbrpObject.ajax_url, {
		action: 'gbrp_related_posts',
		post_id: gbrpObject.post_id,
		num_of_posts: postsToShow,
		gbrp_security: gbrpObject.ajax_nonce
	});
}

registerBlockType('gbrp/related-posts', {

	title: __('Related Posts'),

	icon: 'list-view',

	category: 'widgets',

	keywords: [__('related posts')],

	attributes: {

		title: {
			type: 'string',
			default: __('Related')
		},
		postsToShow: {
			type: 'number',
			default: 3
		},
		displayPostDate: {
			type: 'boolean',
			default: false
		},
		displayPostThumbnail: {
			type: 'boolean',
			default: false
		},
		layout: {
			type: 'string',
			default: 'list'
		},
		columns: {
			type: 'number',
			default: 3
		}

	},

	edit: function (_Component) {
		_inherits(edit, _Component);

		function edit() {
			_classCallCheck(this, edit);

			var _this = _possibleConstructorReturn(this, (edit.__proto__ || Object.getPrototypeOf(edit)).apply(this, arguments));

			_this.changePostsToShow = _this.changePostsToShow.bind(_this);

			var postsToShow = _this.props.attributes.postsToShow;


			_this.state = {
				relatedPosts: []
			};

			_this.relatedPostsRequest = getRelatedPosts(postsToShow);

			_this.relatedPostsRequest.then(function (relatedPosts) {
				return _this.setState({ relatedPosts: relatedPosts });
			});

			_this.toggleDisplayPostDate = _this.toggleDisplayPostDate.bind(_this);

			_this.toggleDisplayPostThumbnail = _this.toggleDisplayPostThumbnail.bind(_this);

			return _this;
		}

		_createClass(edit, [{
			key: 'toggleDisplayPostDate',
			value: function toggleDisplayPostDate() {
				var displayPostDate = this.props.attributes.displayPostDate;
				var setAttributes = this.props.setAttributes;


				setAttributes({ displayPostDate: !displayPostDate });
			}
		}, {
			key: 'toggleDisplayPostThumbnail',
			value: function toggleDisplayPostThumbnail() {
				var displayPostThumbnail = this.props.attributes.displayPostThumbnail;
				var setAttributes = this.props.setAttributes;


				setAttributes({ displayPostThumbnail: !displayPostThumbnail });
			}
		}, {
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(nextProps) {
				var _this2 = this;

				var postToShowCurrent = this.props.attributes.postsToShow;
				var postToShowNext = nextProps.attributes.postsToShow;
				var setAttributes = this.props.setAttributes;


				if (postToShowCurrent === postToShowNext) {
					return;
				}

				if (postToShowNext >= MIN_POSTS && postToShowNext <= MAX_POSTS) {
					this.relatedPostsRequest = getRelatedPosts(postToShowNext);

					this.relatedPostsRequest.then(function (relatedPosts) {
						return _this2.setState({ relatedPosts: relatedPosts });
					});

					setAttributes({ postsToShow: postToShowNext });
				}
			}
		}, {
			key: 'changePostsToShow',
			value: function changePostsToShow(postsToShow) {
				var setAttributes = this.props.setAttributes;

				setAttributes({ postsToShow: parseInt(postsToShow, 10) || 0 });
			}
		}, {
			key: 'render',
			value: function render() {
				var _this3 = this;

				var relatedPosts = this.state.relatedPosts;
				var setAttributes = this.props.setAttributes;


				if (!relatedPosts.length) {
					return wp.element.createElement(
						Placeholder,
						{
							icon: 'admin-post',
							label: __('Related Posts')
						},
						wp.element.createElement(Spinner, null)
					);
				}

				// Removing posts from display should be instant.
				var postsDifference = relatedPosts.length - this.props.attributes.postsToShow;
				if (postsDifference > 0) {
					relatedPosts.splice(this.props.attributes.postsToShow, postsDifference);
				}

				var focus = this.props.focus;
				var _props$attributes = this.props.attributes,
				    title = _props$attributes.title,
				    displayPostDate = _props$attributes.displayPostDate,
				    displayPostThumbnail = _props$attributes.displayPostThumbnail,
				    layout = _props$attributes.layout,
				    columns = _props$attributes.columns;

				var layoutControls = [{
					icon: 'list-view',
					title: __('List View'),
					onClick: function onClick() {
						return setAttributes({ layout: 'list' });
					},
					isActive: layout === 'list'
				}, {
					icon: 'grid-view',
					title: __('Grid View'),
					onClick: function onClick() {
						return setAttributes({ layout: 'grid' });
					},
					isActive: layout === 'grid'
				}];

				return [focus && wp.element.createElement(
					BlockControls,
					{ key: 'controls' },
					wp.element.createElement(Toolbar, { controls: layoutControls })
				), focus && wp.element.createElement(
					InspectorControls,
					{ key: 'inspector' },
					wp.element.createElement(
						BlockDescription,
						null,
						wp.element.createElement(
							'p',
							null,
							__('Shows a list of related posts.')
						)
					),
					wp.element.createElement(
						'h3',
						null,
						__('Related Posts Settings')
					),
					wp.element.createElement(TextControl, {
						label: __('Title'),
						type: 'text',
						value: title,
						onChange: function onChange(value) {
							return setAttributes({ title: value });
						}
					}),
					wp.element.createElement(ToggleControl, {
						label: __('Display post date'),
						checked: displayPostDate,
						onChange: this.toggleDisplayPostDate
					}),
					layout === 'grid' && wp.element.createElement(ToggleControl, {
						label: __('Display post thumbnail'),
						checked: displayPostThumbnail,
						onChange: this.toggleDisplayPostThumbnail
					}),
					layout === 'grid' && wp.element.createElement(RangeControl, {
						label: __('Columns'),
						value: columns,
						onChange: function onChange(value) {
							return setAttributes({ columns: value });
						},
						min: 2,
						max: Math.min(MAX_POSTS_COLUMNS, relatedPosts.length)
					}),
					wp.element.createElement(TextControl, {
						label: __('Number of posts to show'),
						type: 'number',
						min: MIN_POSTS,
						max: MAX_POSTS,
						value: this.props.attributes.postsToShow,
						onChange: function onChange(value) {
							return _this3.changePostsToShow(value);
						}
					})
				), wp.element.createElement(
					'div',
					{ className: this.props.className },
					title && wp.element.createElement(
						'h3',
						{ className: 'related-posts-title' },
						' ',
						title,
						' '
					),
					wp.element.createElement(
						'ul',
						{
							className: __WEBPACK_IMPORTED_MODULE_0_classnames___default()('columns-' + columns, {
								'is-grid': layout === 'grid',
								'is-list': layout === 'list'
							}),
							key: 'related-posts'
						},
						relatedPosts.map(function (post, i) {
							return wp.element.createElement(
								'li',
								{ key: i },
								displayPostThumbnail && post.thumbnail && wp.element.createElement('img', { src: post.thumbnail }),
								wp.element.createElement(
									'a',
									{ href: post.url, target: '_blank' },
									decodeEntities(post.post_title.trim()) || __('(Untitled)')
								),
								displayPostDate && post.post_date_gmt && wp.element.createElement(
									'time',
									{ dateTime: moment(post.post_date_gmt).utc().format(), className: _this3.props.className + '__post-date' },
									moment(post.post_date_gmt).local().format('MMMM DD, Y')
								)
							);
						})
					)
				)];
			}
		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				if (this.relatedPostsRequest.state() === 'pending') {
					this.relatedPostsRequest.abort();
				}
			}
		}]);

		return edit;
	}(Component),

	save: function save() {
		return null;
	}
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return classNames;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ })
/******/ ]);