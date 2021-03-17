// WeaponSize.js
// Created on 9/27/2018

/*:
* @plugindesc This plugin is meant to allow the game
* creator to use weapon sprites of a nonstandard size.
* @author Yethwhinger
*
* @help This plugin allows the use of weapon sprites that
* do not conform to the usual 96-pixel pattern width and
* 64-pixel pattern height. Weapon patterns still need to
* be laid out in columns that are six weapons tall
* and three patterns wide. Weapons1 and Weapons2 images
* still need to have 2 weapon columns and Weapons3 is
* still only 1 column.
*/

//----------------------------
// Changes to Sprite_Weapon
//----------------------------

Sprite_Weapon.prototype.updateFrame = function () {
    if (this._weaponImageId > 0) {
        var index = (this._weaponImageId - 1) % 12;
        var w = this.patternWidth();
        var h = this.patternHeight();
        var sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
        var sy = Math.floor(index % 6) * h;
        this.setFrame(sx, sy, w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};

Sprite_Weapon.prototype.patternWidth = function () {
    var pageId = Math.floor((this._weaponImageId - 1) / 12) + 1;
    if (pageId == 3) {
        return this.bitmap.width / 3;
    } else {
        return this.bitmap.width / 6;
    }
};

Sprite_Weapon.prototype.patternHeight = function () {
    return this.bitmap.height / 6;
};
