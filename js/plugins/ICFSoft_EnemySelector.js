//=============================================================================
// ICF-Soft Plugins - Enemy Selector
// ICFSoft_EnemySelector.js
//=============================================================================

var Imported = Imported || {};
Imported.ICFSoft_EnemySelector = true;

var ICF = ICF || {};
ICF.EnemySelect = ICF.EnemySelect || {};
ICF.NotetagsProcessor = ICF.NotetagsProcessor || {};

ICF.EnemySelect.Version = 104; // 1.04

//=============================================================================
 /*:
 * @plugindesc v1.04 This plugin allows you to change enemies before
 * start battle.
 * @author ICF-Soft [http://icfsoft.blogspot.com.es/]
 *
 * @param Absolute
 * @desc If true, enemy chage if var is equal to selector instead
 * of equal or higher.   NO - false     YES - true
 * @default false
 *
 * @param Enemy Var
 * @desc The game variable where the selector is stored.
 * @default 40
 *
 * @param Selector Mode
 * @desc What variable use to get selector.
 * 0 - game variable   1 - party variable   2 - both
 * @default 0
 *
 * @param Selector Test
 * @desc A test value for battletests.
 * @default 0
 *
 * @param Developer HaltJS
 * @desc When true it throws an error if an custom enemy selection
 * javascript doesn't work.   NO - false     YES - true
 * @default false
 *
 * @help
 * ============================================================================
 * Introduction
 * 
 * In database we have a 2000 item cap per tab. So we have up to 2000 different
 * enemies and up to 2000 enemy groups.
 * It's usual to use some groups for a different number of same enemy
 * (ex: 2 and 3 bats) and different enemy combinations, so a less number of enemy
 * types are used.
 * 
 * This plugin allow to increase the number of used enemies and, at same time,
 * use a lower number of enemy groups.
 * 
 * Main utility is to implement an ingame difficult increase system with different
 * enemies.
 * 
 * ============================================================================
 * Parameters
 * ============================================================================
 * 
 * Absolute: Tell if value must be exact to swap enemy.
 * When off enemy will change if value is equal or higher, making an ingame
 * difficult increase system.
 * 
 * Enemy Var: Tell wich variable vill be used as selector.
 * 
 * Selector Mode: Allow to use normal selector with variable, a selector based
 * on actor selfvariables or both.
 * 
 *      0 - Variable used in Enemy var parameter.
 *      1 - The sum of all partymembers "enemyselector" selfvariable.
 *      2 - The sum of both.
 * 
 * Selector Test: Uses a value for battle tests because there normal selectors
 * can't be applied.
 * 
 * Developer HaltJS: This is a development variable usefull to check if there is
 * a wrong javascript enemy selection.
 * When true will throw an error when it found a wrong javascript in lunatic
 * mode and tell specified enemiId.
 * When false it will be ignored and game continues.
 * 
 * ============================================================================
 * Config enemies
 * ============================================================================
 * 
 * Enemies are configured via notetags.
 * 
 * Starts with "<ENEMY SELECTOR>", then the selectors come in succesive lines.
 * Minimun 2 numbers separated, first by ":" and others by "," or spaces.
 * The first is the value for the selector and others are enemy ids to alter.
 * You can use ranges.
 * Selectors must be in ascending order.
 * And finish with "</ENEMY SELECTOR>".
 * 
 * Example:
 * 
 * <ENEMY SELECTOR>
 * 1:2
 * 2:10,11
 * 3:5 to 10,3
 * </ENEMY SELECTOR>
 * 
 * This enemy will change to database enemy 2 when selected variable become 1.
 * If selected variable become 2, enemy will be 10 or 11.
 * If selected variable become 3, enemy will be 3 or a number from 5 to 10.
 * 
 * ============================================================================
 * Lunatic Mode
 * ============================================================================
 * 
 * For those who want another way to select enemies I've added a lunatic mode.
 * 
 * It also work in notetags:
 * 
 * <CUSTOM ENEMY SELECTOR>
 * converted = 2;
 * converted += 25;
 * </CUSTOM ENEMY SELECTOR>
 * 
 * It runs after normal selection if you want to use both for an enemy.
 * You can use javascript between these tags to alter the final result.
 * 
 * converted - This is the enemyId that you are changing, by your own formula
 *             for especified enemy.
 * 
 * ============================================================================
 * Lunatic Mode : Global Enemy Selection
 * ============================================================================
 * 
 * When Main Core released you can use global selector.
 * 
 * Use "globalEnemySelect" command to add javascript code that is applied
 * to every enemy. It runs after custom enemy selector tag.
 * 
 * globalEnemySelect converted = 2;
 * converted += 25;
 * 
 * ============================================================================
 * Plugin commands
 * ============================================================================
 * 
 * ChangeEnemySelector x
 * 
 *  - Change the variable where selector is stored.
 * 
 * ResetEnemySelector
 * 
 *  - Reset the variable where selector is stored to it's initial value.
 * 
 * To manage actor enemy selector selfvariables you can use ICF-Soft Main
 * Utility plugin commands.
 * 
 * actorvariable actor enemyselector value
 * increaseactorvariable actor enemyselector value
 * multiplyactorvariable actor enemyselector value
 * divideactorvariable actor enemyselector value
 * modactorvariable actor enemyselector value
 * 
 * ============================================================================
 * Scripting functions
 * ============================================================================
 * 
 * $gameVariables.enemySelector()
 * 
 *  - Get the value stored in current selector.
 * 
 * $gameVariables.initialEnemySelector()
 * 
 *  - Get the value stored in initial selector.
 * 
 * Game_Enemy.initialEnemyID()
 * 
 *  - Get the initial enemyID before change.
 * 
 * ICF.EnemySelect.changeSelector(x)
 * ICF.EnemySelect.initSelector()
 * 
 *  - Scripting alternatives in javascript for plugin commands.
 * 
 * To manage actor enemy selector selfvariables througth scripting you can
 * use ICF-Soft Main Utility scripting functions.
 * 
 * $gameActors.actor[actorid].setselfvariable('enemyselector', value)
 * $gameActors.actor[actorid].increaseselfvariable('enemyselector', value)
 * $gameActors.actor[actorid].multiplyselfvariable('enemyselector', value)
 * $gameActors.actor[actorid].divideselfvariable('enemyselector', value)
 * $gameActors.actor[actorid].modselfvariable('enemyselector', value)
 * 
 * ============================================================================
 * Incompatibilities
 * ============================================================================
 * 
 * There's no known incompatible plugins yet.
 * 
 * ============================================================================
 * Known isues
 * ============================================================================
 * 
 * Different enemy sizes can look weird.
 * Pointer position is on bottom left corner.
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.04:
 * - Allow ICF-Soft Main Core.
 * - New global custom enemy selection.
 * - New selector modes.
 * - A value for test battles.
 *
 * Version 1.03:
 * - Use of ICF-Soft Main Utility.
 * - Use of ranges.
 * - Added plugin commands.
 * - Added scripting functions.
 *
 * Version 1.02:
 * - Improved lunatic mode.
 *
 * Version 1.01:
 * - Added randomizing to standard procedure.
 * - Added lunatic mode.
 *
 * Version 1.00:
 * - Finished plugin!
 * 
 * ============================================================================
 * 
 * For commercial and non-commercial games.
 * Credit to ICF-Soft.
 * This entire header must be included with plugin.
 * 
 * ============================================================================
*/
//=============================================================================
 /*:es
 * @plugindesc v1.04 Este complemento permite cambiar los enemigos antes
 * de que la batalla comience.
 * @author ICF-Soft [http://icfsoft.blogspot.com.es/]
 *
 * @param Absolute
 * @desc Si se activa, el enemigo cambiará solo si coincide el
 * selector, si no, cuando sea mayor o igual.  No - false   Si - true
 * @default false
 *
 * @param Enemy Var
 * @desc La variable donde se almacena el selector.
 * @default 40
 *
 * @param Selector Mode
 * @desc Como obtener el selector.
 * 0 - game variable   1 - party variable   2 - ambas
 * @default 0
 *
 * @param Selector Test
 * @desc Asigna un valor para pruebas de batalla.
 * @default 0
 *
 * @param Developer HaltJS
 * @desc Si está activado salta cuando una función personalizada
 * da error.   No - false   Si - true
 * @default false
 *
 * @help
 * ============================================================================
 * Introducción
 * ============================================================================
 * 
 * En la base de datos hay un tope de 2000 elementos por pestaña. Por un lado
 * tenemos hasta 2000 enemigos distintos y por otro hasta 2000 grupos de enemigos
 * a los que se puede enfrentar en el juego.
 * Normalmente no se utiliza un grupo para cada enemigo, sino varios grupos con dos
 * o tres enemigos del mismo tipo y diversas combinaciones de enemigos, por lo que
 * en realidad se utilizan bastantes tipos de enemigos menos.
 * 
 * Este script permite aprovechar el máximo de enemigos posible reduciendo,
 * a su vez, el número de grupos de enemigos.
 * 
 * La utilidad principal reside en que se puede hacer un sistema de dificultad
 * creciente y/o aprovechar mejor el número de enemigos de la base de datos.
 * 
 * ============================================================================
 * Parámetros
 * ============================================================================
 * 
 * Absolute: Indica si el valor debe ser exacto para que el enemigo cambie.
 * Cuando está desactivado el enemigo cambiará cuando el valor sea mayor o igual,
 * haciendo un sistema de dificultad creciente.
 * 
 * Enemy Var: Indica qué variable vas a utilizar para almacenar el selector.
 * 
 * Selector Mode: Permite usar el modo normal con la variable, un selector
 * basado en variables de actor, o ambas.
 * 
 *      0 - La variable del parámetro Enemy var.
 *      1 - La suma de la variable "enemyselector" del equipo.
 *      2 - La suma de ambos.
 * 
 * Selector Test: Un valor poder utilizar la función de selector de enemigos
 * en las batallas de prueba.
 * 
 * Developer HaltJS: Esta es una variable de uso durante el desarrollo del juego
 * útil cuando quieres comprobar si hay alguna función personalizada incorrecta.
 * Cuando está activado al encontrar un error el juego se para y muestra
 * en qué enemigo se encuentra el error.
 * Cuando está desactivado ignora el error y el juego continúa.
 * 
 * ============================================================================
 * Configurar los enemigos
 * ============================================================================
 * 
 * Los enemigos se configuran en la base de datos en el apartado de las notas.
 * 
 * Se empieza una línea con "<ENEMY SELECTOR>", se ponen en cada línea sucesiva
 * al menos dos números, el primero separado por ":" y el resto por ',' o
 * espacios. El primero es el valor que debe tomar el selector y el resto
 * los enemigos que pueden ocupar su lugar. Se pueden usar rangos.
 * Los selectores deben ir en orden ascendente.
 * Finalmente se termina con la línea "</ENEMY SELECTOR>".
 * 
 * Ejemplo:
 * 
 * <ENEMY SELECTOR>
 * 1:2
 * 2:10,11
 * 3:5 a 10,3
 * </ENEMY SELECTOR>
 * 
 * Este enemigo cuando la variable escogida valga 1 será sustituido por el enemigo
 * número 2 de la base de datos.
 * En cambio, si la variable vale 2 será sustituido por el enemigo número 10 o el 11
 * de la base de datos.
 * Si vale 3, se sustituirá por el 3 o cualquiera entre el 5 y el 10.
 * 
 * ============================================================================
 * Lunatic Mode
 * ============================================================================
 *
 * Para aquellos que quieren otro modo de seleccionar los enemigos he añadido el
 * modo lunático.
 * El modo lunático permite utilizar código javascript diréctamente.
 * 
 * Usa las siguientes etiquetas:
 *
 * <CUSTOM ENEMY SELECTOR>
 * converted = 2;
 * converted += 25;
 * </CUSTOM ENEMY SELECTOR>
 * 
 * En el caso de que se quiera combinar con el modo anterior, este código se
 * ejecuta después.
 * 
 * converted - Este es el resultado, contiene el enemyId inicial que puedes
 *             alterar bajo tu criterio.
 * 
 * ============================================================================
 * Lunatic Mode : Selection Global
 * ============================================================================
 *
 * Si el Main Core está disponible puedes utilizar un selector global.
 * 
 * Mediante el comando "globalEnemySelect" puedes añadir código javascript
 * que afecte a todos los enemigos. Se ejecuta después de custom enemy selector.
 * 
 * globalEnemySelect converted = 2;
 * converted += 25;
 * 
 * ============================================================================
 * Comandos de complemento
 * ============================================================================
 *
 * ChangeEnemySelector x
 * 
 *  - Cambia la variable en donde se guarda el selector.
 * 
 * ResetEnemySelector
 * 
 *  - Reinicia la variable en donde se guarda el selector a su valor
 *    inicial.
 * 
 * Para editar la variable de selección de enemigos de los personajes puedes
 * usar los comandos de ICF-Soft Main Utility.
 * 
 * actorvariable actor enemyselector value
 * increaseactorvariable actor enemyselector value
 * multiplyactorvariable actor enemyselector value
 * divideactorvariable actor enemyselector value
 * modactorvariable actor enemyselector value
 * 
 * ============================================================================
 * Funciones de script
 * ============================================================================
 * 
 * $gameVariables.enemySelector()
 * 
 *  - Obtiene el valor del selector actual.
 * 
 * $gameVariables.initialEnemySelector()
 * 
 *  - Obtiene el valor del selector inicial.
 * 
 * Game_Enemy.initialEnemyID()
 * 
 *  - Permite comprobar el enemigo que fue sustituido.
 * 
 * ICF.EnemySelect.changeSelector(x)
 * ICF.EnemySelect.initSelector()
 * 
 *  - Alternativas en javascript para los comandos de complemento.
 * 
 * Para editar la variable de selección de enemigos de los personajes puedes
 * usar las funciones de script de ICF-Soft Main Utility.
 * 
 * $gameActors.actor[actorid].setselfvariable('enemyselector', value)
 * $gameActors.actor[actorid].increaseselfvariable('enemyselector', value)
 * $gameActors.actor[actorid].multiplyselfvariable('enemyselector', value)
 * $gameActors.actor[actorid].divideselfvariable('enemyselector', value)
 * $gameActors.actor[actorid].modselfvariable('enemyselector', value)
 * 
 * ============================================================================
 * Incompatibilidades
 * ============================================================================
 * 
 * No se conocen complementos que sean incompatibles hasta la fecha.
 * 
 * ============================================================================
 * Problemas conocidos
 * ============================================================================
 * 
 * Si los enemigos que se intercambian son de distintos tamaños pueden quedar
 * vistosamente mal colocados.
 * La posición viene definida por la esquina inferior izquierda.
 * 
 * ============================================================================
 * Historial de versiones
 * ============================================================================
 *
 * Versión 1.04:
 * - Permite el ICF-Soft Main Core.
 * - Nueva función de selección de enemigos global.
 * - Nuevos modos de selector.
 * - Se ha añadido un valor para las batallas de pruebas.
 *
 * Versión 1.03:
 * - Se empieza a utilizar el ICF-Soft Main Utility.
 * - Se pueden usar rangos de enemigos.
 * - Se han añadido los comandos de complemento.
 * - Se han añadido funciones de script.
 *
 * Versión 1.02:
 * - Modo lunático mejorado.
 * 
 * Versión 1.01:
 * - Se ha añadido una función para aleatorizar.
 * - Se ha añadido el modo lunático.
 *
 * Versión 1.00:
 * - Complemento terminado.
 * 
 * ============================================================================
 * 
 * Para juegos comerciales y no comerciales.
 * Se debe incluir a ICF-Soft en los créditos.
 * Esta cabecera debe incluirse íntegramente con el plugin.
 * 
 * ============================================================================
*/
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

ICF.Parameters = PluginManager.parameters('ICFSoft_EnemySelector');
ICF.Param = ICF.Param || {};

ICF.Param.EnemyVarAbsolute = ICF.Parameters['Absolute'].toLowerCase() === "true";
ICF.Param.EnemyVarInitial = Number(ICF.Parameters['Enemy Var']);
ICF.Param.EnemySelMode = Number(ICF.Parameters['Selector Mode']);
ICF.Param.EnemySelTest = Number(ICF.Parameters['Selector Test']);

ICF.Param.EnemySelHalt = ICF.Parameters['Developer HaltJS'].toLowerCase() === "true";

ICF.EnemySelect.Global = '';

if (!Imported.ICFSoft_MainUtility) {throw new Error('This plugin requires ICF-Soft Main Utility plugin version 1.03 to work.\nYou can download it at icfsoft.blogspot.com inside plugins section.');}
if (ICF.MainUtility.Version < 103) {throw new Error('This plugin requires ICF-Soft Main Utility plugin version 1.03 to work.\nYou can download it at icfsoft.blogspot.com inside plugins section.');}

//=============================================================================
// DataManager
//=============================================================================

ICF.EnemySelect.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!ICF.EnemySelect.DataManager_isDatabaseLoaded.call(this)) return false;
    if (!ICF.EnemySelect.Procesed) {
	ICF.NotetagsProcessor.enemySelector($dataEnemies);
	ICF.EnemySelect.Procesed = true;
    }
    return true;
};

ICF.NotetagsProcessor.enemySelector = function(group) {
  var note1 = /<(?:ENEMY SELECTOR)>/i;
  var note2 = /<\/(?:ENEMY SELECTOR)>/i;
  var note3 = /<(?:CUSTOM ENEMY SELECTOR)>/i;
  var note4 = /<\/(?:CUSTOM ENEMY SELECTOR)>/i;

  for (var n = 1; n < group.length; n++) {
	var obj = group[n];
	var notedata = obj.note.split(/[\r\n]+/);

	obj.enemySelect = [];
	obj.customEnemySelect = '';

	var esFlag = false;
	var esFlag2 = false;

	  for (var i = 0; i < notedata.length; i++) {
		var line = notedata[i];
		if (line.match(note1)) {
			esFlag = true;
		} else if (line.match(note2)) {
			esFlag = false;
		} else if (line.match(note3)) {
			esFlag2 = true;
		} else if (line.match(note4)) {
			esFlag2 = false;
		} else if (esFlag) {
			line = line.split(/:|,|\s+/);
			if ((line.length > 1)&&(line[0] != NaN)&&(line[1] != NaN)) {
				line.extend().leaveNumbers();
				obj.enemySelect.push(line);
			}
		} else if (esFlag2) {
			obj.customEnemySelect = obj.customEnemySelect + line + '\n';
		}

	  }
  }
};

//=============================================================================
// Game_Enemy
//=============================================================================

ICF.EnemySelect.setupEnemy = Game_Enemy.prototype.initialize;
Game_Enemy.prototype.initialize = function(enemyId, x, y) {
	this._originalEnemyId = enemyId;
	var converted = enemyId;
	var ary = $dataEnemies[enemyId].enemySelect;
	var selector = 0;
	if (DataManager.isBattleTest()) {
		selector = ICF.Param.EnemySelTest;
	} else {
		if ([0,2].contains(ICF.Param.EnemySelMode)) selector += $gameVariables.enemySelector();
		if ([1,2].contains(ICF.Param.EnemySelMode)) selector += $gameParty.selfvariable("enemyselector");
	}

	if (ary.length == 0) {
		converted = enemyId;
	} else if (ICF.Param.EnemyVarAbsolute) {
		for (i = 0; i < ary.length; i++) {
			if (ary[i][0] == selector) {
				converted = ary[i][Math.floor((Math.random() * (ary[i].length - 1)) + 1)];
				break;
			}
		}
	} else {
		for (i = ary.length - 1; i >= 0; i--) {
			if (ary[i][0] <= selector) {
				converted = ary[i][Math.floor((Math.random() * (ary[i].length - 1)) + 1)];
				break;
			}
		}
	}
	if ($dataEnemies[enemyId].customEnemySelect != '') {
		try {eval($dataEnemies[enemyId].customEnemySelect);}
		catch (e) {if(ICF.Param.EnemySelHalt){throw new Error('Error in custom enemy selection in enemy #' + enemyId);}}
	}
	if (ICF.EnemySelect.Global != '') {
		try {eval(ICF.EnemySelect.Global);}
		catch (e) {if(ICF.Param.EnemySelHalt){throw new Error('Error in global custom enemy selection');}}
	}

	ICF.EnemySelect.setupEnemy.call(this, converted, x, y);
};

Game_Enemy.prototype.initialEnemyID = function() {
	return this._originalEnemyId;
}

//=============================================================================
// Game_Variables
//=============================================================================

Game_Variables.prototype.enemySelector = function() {
    return this._data[$gameSystem.ICF().EnemyVar || ICF.Param.EnemyVarInitial] || 0;
};

Game_Variables.prototype.initialEnemySelector = function() {
    return this._data[ICF.Param.EnemyVarInitial] || 0;
};

//=============================================================================
// Game_Interpreter
//=============================================================================

ICF.EnemySelect.pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
        ICF.EnemySelect.pluginCommand.call(this, command, args);
	if (command.toLowerCase() === 'changeenemyselector') {
		ICF.EnemySelect.changeSelector(args[0]);
	} else if (command.toLowerCase() == 'resetenemyselector') {
		ICF.EnemySelect.initSelector();
	}
};

//=============================================================================
// Some Utilities
//=============================================================================

ICF.EnemySelect.changeSelector = function(newselector) {
	$gameSystem.ICF().EnemyVar = newselector;
}

ICF.EnemySelect.initSelector = function() {
	$gameSystem.ICF().EnemyVar = ICF.Param.EnemyVarInitial;
}

if (Imported.ICFSoft_MainCore) {
	ICF.MainCore.functions['globalEnemySelect'] = function(args, params) {
		ICF.EnemySelect.Global = ICF.EnemySelect.Global + args.join(' ') + '\n';
		ICF.EnemySelect.Global = ICF.EnemySelect.Global + params.join('\n') + '\n';
	}
}

//=============================================================================
// End of File
//=============================================================================
