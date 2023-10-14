/**
 * Holds all the information for a presentation 
 * 
 * @typedef {object} Presentation
 * 
 * @property {PresentationState} globalState Current state of presentation
 * @property {Set<string>} connections All UUIDs connected to presentation
 */

/**
 * Holds the global state for a presentation
 *
 * @typedef {object} PresentationState
 *
 * @property {Map<string, (Point | null)>} pointers map of UUID to points
 * @property {Drawable[][]} drawingSurfaces list of drawables for every slide
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

export const Types = {};