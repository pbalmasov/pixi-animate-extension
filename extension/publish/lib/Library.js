"use strict";

const Bitmap = require('./items/Bitmap');
const Shape = require('./items/Shape');
const Text = require('./items/Text');
const Timeline = require('./items/Timeline');
const Container = require('./items/Container');
const Stage = require('./items/Stage');
const Graphic = require('./items/Graphic');

/**
 * Handle the converting of data assets to typed objects
 * @class Library
 */
const Library = function(data)
{
    /**
     * The collection of Bitmap objects
     * @property {Array} bitmaps
     */
    const bitmaps = this.bitmaps = [];

    /**
     * The collection of Shape objects
     * @property {Array} shapes
     */
    const shapes = this.shapes = [];

    /**
     * The collection of Text objects
     * @property {Array} texts
     */
    const texts = this.texts = [];

    /**
     * The collection of Timeline objects
     * @property {Array} timelines
     */
    const timelines = this.timelines = [];

    /**
     * The look-up of the asset by ID
     * @property {Object} _mapById
     * @private
     */
    const map = this._mapById = {};

    /**
     * Instance of the main stage to use
     * @property {Stage} stage
     */
    this.stage = null;

    /**
     * The build settings
     * @property {Object} meta
     */
    this.meta = data._meta;

    /**
     * If there are non-animated display containers
     * @property {Boolean} hasContainer
     * @default
     */
    this.hasContainer = false;

    const library = this;

    // Convert the bitmaps
    data.Bitmaps.forEach(function(bitmapData)
    {
        const bitmap = new Bitmap(library, bitmapData);
        bitmaps.push(bitmap);
        map[bitmap.assetId] = bitmap;
    });

    // Convert the shapes
    data.Shapes.forEach(function(shapeData)
    {
        const shape = new Shape(library, shapeData);
        shape.name = data._meta.stageName + "_" + shape.assetId;
        shapes.push(shape);
        map[shape.assetId] = shape;
    });

    // Convert the shapes
    data.Texts.forEach(function(textData)
    {
        const text = new Text(library, textData);
        texts.push(text);
        map[text.assetId] = text;
    });

    let self = this;
    data.Timelines.forEach(function(timelineData)
    {
        let timeline;
        if (timelineData.totalFrames <= 1 && timelineData.type != "stage")
        {
            self.hasContainer = true;
            timeline = new Container(library, timelineData);
        }
        else if (timelineData.type == "graphic")
        {
            timeline = new Graphic(library, timelineData);
        }
        else if (timelineData.type == "stage")
        {
            self.stage = timeline = new Stage(library, timelineData, data._meta.framerate);
        }
        else 
        {
            timeline = new Timeline(library, timelineData);
        }
        timelines.push(timeline);
        map[timeline.assetId] = timeline;
    });
};

// Reference to the prototype
const p = Library.prototype;

/**
 * Get an object by id
 * @method createInstance
 * @param {int} assetId The Global asset id
 * @return {Instance} The instance object
 */
p.createInstance = function(assetId, instanceId)
{
    const libraryItem = this._mapById[assetId];
    return libraryItem.create(instanceId);
};

/**
 * Don't use after this
 * @method destroy
 */
p.destroy = function()
{
    this.shapes.length = 0;
    this.shapes = null;

    this.bitmaps.length = 0;
    this.bitmaps = null;
    
    this._mapById = null;
};

module.exports = Library;