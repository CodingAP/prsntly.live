/**
 * Holds the global state for a presentation 
 * 
 * @typedef {object} Presentation
 * 
 * @property {Map<string, Point>} pointers map of UUID to points
 * @property {List<DrawingSurface>} drawingSurfaces list of drawables for every slide
 * @property {number} currentSlide index of current slide
 * @property {number} count number of slides
 */

/**
 * A 2D point
 * 
 * @typedef {object} Point
 * 
 * @property {number} x
 * @property {number} y
 */

/**
 * A renderable object on the slide
 * 
 * @typedef {object} Drawable
 * 
 * @property {string} type name of drawable
 * @property {string} uuid for undoing and erasing
 * @property {object} data data of drawable
 * @property {string} sentBy uuid of device that sent it
 */

/**
 * The state of drawables of a slide
 * 
 * @typedef {object} DrawingSurface
 * 
 * @property {List<Drawable>} drawables list of all drawables
 * @property {Map<string, string>} blame map of client UUID to drawable UUID
 */

export const Types = {};