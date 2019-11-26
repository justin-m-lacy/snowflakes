import Gibbon, { Game, GameObject } from "gibbon.js";
import SnowFactory from "./create/snowFactory";
import * as PIXI from 'pixi.js';
import {Point} from 'pixi.js';
import SnowGroup from "./groups/snowGroup";
import StarGroup from "./groups/starGroup";
import BackSnow from "./components/backSnow";
import Sky from "./components/sky";
import Stats, { EVT_PLAY, EVT_END, EVT_MENU } from "./components/stats";
import UIGroup from "./ui/uiGroup";
import ZWorld from "./data/zworld";
import GameMode from "./groups/gameMode";
import CasualMode from "./groups/casualMode";

const MIN_Z = 32;
const MAX_Z = 148;
const FOCUS = 64;

export default class SnowGame extends Game {

	/**
	 * @property {System} controller - PlayMode or GameMode.
	 */
	get controller() { return this._controller; }
	set controller(v) { this._controller =v;}

	/**
	 * @property {string} mode
	 */
	get mode(){ return this._controller.mode;}

	/**
	 * @property {UIGroup} ui
	 */
	get ui(){return this._ui};
	set ui(v){this._ui = v;}

	/**
	 * @property {Stats} stats
	 */
	get stats() { return this._stats; }

	/**
	 * @property {Point} wind
	 */
	get wind(){ return this._wind; }
	set wind(v) { this._wind = v}

	/**
	 * Construction done in init() to allow Game to be a shared export
	 * but initialized from index.js.
	 * @param {PIXI.Application} app - PIXI Application.
	 */
	constructor( app ) {

		super(app);

		this.enableWheel();
		this.wheelScale = 3;

		this.factory = new SnowFactory( this );

	}

	init() {

		super.init();

		this.wind = new Point();

		this.initBg();
		this.initZWorld();

		this.root.add( BackSnow );
		this._stats = this.root.add( Stats );

		this.ui = new UIGroup(this, this.uiLayer );
		this.addGroup( this.ui );

		this.emitter.on( EVT_MENU, this.showMenu, this );
		this.emitter.on( EVT_END, this.endGame, this );
		this.emitter.on( EVT_PLAY, this.onPlay, this );

		//this.loader.load( (loader,resources)=>this.assetsLoaded(loader,resources) );
		this.start();

	}

	start() {
		super.start();
		this.showMenu();
	}


	showMenu(){

		if ( this.controller ) {
			this.removeGroup( this.controller );
			this.controller.destroy();
			this.controller = null;
		}

		this.ui.hideGameView();
		this.ui.showMenu();
	}

	onPlay( mode ) {

		var grp;

		if ( mode === 'game') {

			grp = new GameMode( this );

		} else {

			grp = new CasualMode( this );

		}

		this.ui.hideMenu();

		this.addGroup( grp );
		this.controller = grp;
		this.controller.start();

	}

	/**
	 * End game and report all stats.
	 */
	endGame() {

		// report all stats.
		this.reportStats();

	}

	onReset() {

		// reset sky
		// reset stats
		// reset wind
		// destroy controller
		// reset snowGroup

		// event listeners?

	}

	/**
	 * Report all stats to backend, if any.
	 */
	reportStats() {
	}

	onStat( stat, v ){
		window.kong.stats.submit( stat, v );
	}

	/**
	 * Initialize game parallax vars.
	 */
	initZWorld() {

		let zworld = new ZWorld( MIN_Z, MAX_Z, FOCUS );
		this.root.addExisting( zworld, ZWorld );

	}

	initBg(){

		let s = new PIXI.ParticleContainer();
		this.backgroundLayer.addChild( s );

		this.skyObj = this.instantiate( s );
		this.sky = this.skyObj.add( Sky );

		this.stars = new StarGroup(this);
		this.backgroundLayer.addChild( this.stars.clip );

	}

	/**
	 *
	 * @param {PIXI.loaders.Loader} loader
	 * @param {Object} resources
	 */
	/*assetsLoaded( loader, resources ) {

		console.log('ASSETS LOADED');

	}*/

}