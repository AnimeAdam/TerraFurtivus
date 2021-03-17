//=============================================================================
//=============================================================================
 /*:
 * @plugindesc Make any skill do normal attack animation.
 * @author Adam
 * @help
 * If you want any skill to use the attack animation
 * add this to the notebox of a skill
 * <AttAnim>
 */


(function() {
Game_Actor.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);

    var forceAttackAnimation = false;
    if (action.isSkill()){
        if ($dataSkills[action._item._itemId].meta.AttAnim)
        forceAttackAnimation = true;
    }

    if (forceAttackAnimation) {
        this.performAttack();
    }
    else {
        if (action.isAttack()) {
            this.performAttack();
        } else if (action.isGuard()) {
            this.requestMotion('guard');
        } else if (action.isMagicSkill()) {
            this.requestMotion('spell');
        } else if (action.isSkill()) {
            this.requestMotion('skill');
        } else if (action.isItem()) {
            this.requestMotion('item');
        }
    }
};
})();