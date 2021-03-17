//=============================================================================
//=============================================================================
 /*:
 * @plugindesc Make any enemies detect if party already has a state affect.
 * @author Adam
 * @help
 * If you want any enemy skill to detect if the oppenent has the same
 * 1 effect add the following to the notetag
 * <StatDetect>
 */

function CheckState(member, action)
{
    var states = member.states();
    var effects = action.item().effects;

    states.forEach(function(state){
        effects.forEach(function(effect){
            if (effect.code == Game_Action.EFFECT_ADD_STATE && effect.value1 == state.id)
            {
                return false;
            }
        });
    });
    return true;
}

(function() {
    // Game_Action.prototype.makeTargets = function() {
    //     var targets = [];
    //     if (!this._forcing && this.subject().isConfused()) {
    //         targets = [this.confusionTarget()];
    //     } else if (this.isForOpponent()) {
    //         targets = this.targetsForOpponents();
    //     } else if (this.isForFriend()) {
    //         targets = this.targetsForFriends();
    //     }
    //     return this.repeatTargets(targets);
    // };
    // Game_Action.prototype.targetsForOpponents = function() {
    //     var targets = [];
    //     var unit = this.opponentsUnit();
    //     if (this.isForRandom()) {
    //         for (var i = 0; i < this.numTargets(); i++) {
    //             targets.push(unit.randomTarget());
    //         }
    //     } else if (this.isForOne()) {
    //         if (this._targetIndex < 0) {
    //             targets.push(unit.randomTarget());
    //         } else {
    //             targets.push(unit.smoothTarget(this._targetIndex));
    //         }
    //     } else {
    //         targets = unit.aliveMembers();
    //     }
    //     return targets;
    // };
    Game_Unit.prototype.randomTarget = function() {      
        var actionNow = BattleManager._action;

        if ($dataSkills[actionNow._item._itemId].meta.StatDetect) 
        {
            var Checker = 1;
            var target = null;
            do
            {
                var tgrRand = Math.random() * this.tgrSum();
                target = null;
                this.aliveMembers().forEach(function(member) {
                    tgrRand -= member.tgr;
                    if (tgrRand <= 0 && !target && CheckState(member, actionNow)) {
                        target = member;
                        checker = 10;
                    }
                });
                if (checker == 9)
                {
                    if (tgrRand <= 0 && !target) {
                        target = member;
                    }
                }
                checker++;
            } while(checker < 10)
            return target;
        }
        else
        {
            var tgrRand = Math.random() * this.tgrSum();
            var target = null;                
            this.aliveMembers().forEach(function(member) {
                tgrRand -= member.tgr;
                if (tgrRand <= 0 && !target) {
                    target = member;
                }
            });
            return target;
        }
    };
})();