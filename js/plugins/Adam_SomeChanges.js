//=============================================================================
//=============================================================================
 /*:
 * @plugindesc Makes small changes to the game
 * @author Adam
 * @help
 * Some small changes to the game:
 * - Now Substitute check if the other player is alive to protect.
 * - Debugging checking the experience earned every battle.
 * - Criticals now do 1.5x damage.
 * - Add opition to skip display appear message <SkipAppearMessage>
 * - Add opitions to remove TP & MP display for specific characters <RemoveMP> <RemoveTP>
 * - Add display weak to when hit with element <WeakFire> <WeakIce> <WeakHoly> <WeakMagic> <WeakCele> <WeakSpirit> <WeakDeus>
 * - Put enemy names at their center.
 */


(function() {
    // BattleManager.checkSubstitute = function(target) {
    // return target.isAlive() && !this._action.isCertainHit(); //EITHER ALWAYS HAPPENS OR BELOW ONLY AT HALF HEALTH
    // };

    //#region 
    Game_BattlerBase.prototype.isDying = function() {
        return this.isAlive() && this._hp < this.mhp / 2;
    };
    //#endregion

    //#region 
    // BattleManager.gainExp = function() {
    //     var exp = this._rewards.exp;
    //     console.log(exp);
    //     $gameParty.allMembers().forEach(function(actor) {
    //         actor.gainExp(exp);
    //     });
    // };
    //#endregion

    //#region
    BattleManager.startBattle = function() {
        this._phase = 'start';
        $gameSystem.onBattleStart();
        $gameParty.onBattleStart();
        $gameTroop.onBattleStart();
        if ($dataEnemies[$gameTroop._enemies[0]._enemyId].meta.SkipAppearMessage){
            
        }
        else
        {
            this.displayStartMessages();
        }        
    };
    //#endregion   
    
    //#region
    Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
        this.drawActorHp(actor, rect.x + 0, rect.y, 108);
        if (!$dataActors[actor._actorId].meta.RemoveMP){
        this.drawActorMp(actor, rect.x + 123, rect.y, 96);}
        if (!$dataActors[actor._actorId].meta.RemoveTP){
        this.drawActorTp(actor, rect.x + 234, rect.y, 96);}
    };

    Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
        this.drawActorHp(actor, rect.x + 0, rect.y, 201);
        if (!$dataActors[actor._actorId].meta.RemoveMP){
        this.drawActorMp(actor, rect.x + 216, rect.y, 114);}
        if (!$dataActors[actor._actorId].meta.RemoveTP){
        this.drawActorTp(actor, rect.x + 216, rect.y, 114);}
    };

    Window_Status.prototype.drawBasicInfo = function(x, y) {
        var lineHeight = this.lineHeight();
        this.drawActorLevel(this._actor, x, y + lineHeight * 0);
        this.drawActorIcons(this._actor, x, y + lineHeight * 1);
        this.drawActorHp(this._actor, x, y + lineHeight * 2);
        if (!$dataActors[this._actor._actorId].meta.RemoveMP){
        this.drawActorMp(this._actor, x, y + lineHeight * 3);}
        if (!$dataActors[this._actor._actorId].meta.RemoveTP){
        this.drawActorTp(this._actor, x, y + lineHeight * 3);}
    };

    Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
        var lineHeight = this.lineHeight();
        var x2 = x + 180;
        var width2 = Math.min(200, width - 180 - this.textPadding());
        this.drawActorName(actor, x, y);
        this.drawActorLevel(actor, x, y + lineHeight * 1);
        this.drawActorIcons(actor, x, y + lineHeight * 2);
        this.drawActorClass(actor, x2, y);
        this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
        if (!$dataActors[actor._actorId].meta.RemoveMP){
        this.drawActorMp(actor, x2, y + lineHeight * 2, width2);}
        if (!$dataActors[actor._actorId].meta.RemoveTP){
        this.drawActorTp(actor, x2, y + lineHeight * 2, width2);}
    };
    //#endregion 

    //#region 
    Sprite_Damage.prototype.setup = function(target) {
        var result = target.shiftDamagePopup();
        if (result.missed || result.evaded) {
          this.createMiss();
        } else if (result.hpAffected) {
          this.createDigits(0, result.hpDamage);

          if(target._enemyId != null){
            if($dataEnemies[target._enemyId].meta.WeakSpirit && BattleManager._action.item().damage.elementId == 6 ||
            $dataEnemies[target._enemyId].meta.WeakFire && BattleManager._action.item().damage.elementId == 4 ||
            $dataEnemies[target._enemyId].meta.WeakIce && BattleManager._action.item().damage.elementId == 5 ||
            $dataEnemies[target._enemyId].meta.WeakHoly && BattleManager._action.item().damage.elementId == 3 ||
            $dataEnemies[target._enemyId].meta.WeakMagic && BattleManager._action.item().damage.elementId == 2 ||
            $dataEnemies[target._enemyId].meta.WeakCele && BattleManager._action.item().damage.elementId == 7 ||
            $dataEnemies[target._enemyId].meta.WeakDeus && BattleManager._action.item().damage.elementId == 8){
                var w = this.digitWidth();
                var h = this.digitHeight();
                var sprite = this.createChildSprite();
                sprite.setFrame(4 * w, 4 * h, 4 * w, h);
                sprite.move(10,0);
                sprite._anchor.y = 2.2;
                sprite.dy = 1;
            }
          }

        } else if (target.isAlive() && result.mpDamage !== 0) {
          this.createDigits(2, result.mpDamage);
        }
        if (result.critical) {
          this.setupCriticalEffect();
        }
    };
    //#endregion 

    //#region 
    Game_Action.prototype.applyCritical = function(damage) {
        return damage * 1.5;
    };
    //#endregion 

    //#region
    Window_EnemyVisualSelect.prototype.updateWindowPosition = function() {
        if (!this._battler) return;
        this.x = -1 * this.width / 2;
        this.y = -1 * this.height + this.standardPadding();
        this.x += this._battler.spritePosX();
        this.y += this._battler.spritePosY();        
        this.x = this.x.clamp(this._minX, this._maxX);
        this.y = this.y.clamp(this._minY, this._maxY);
        this.y -= this._battler.spriteHeight() / 2;
    };
    //#endregion 

})();