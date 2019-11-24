import Gibbon, { Game, GameObject } from "gibbon.js";
import SnowFactory from "./create/snowFactory";
import * as PIXI from 'pixi.js';
import {Point} from 'pixi.js';
import SnowGroup from "./groups/snowGroup";
import StarGroup from "./groups/starGroup";
import BackSnow from "./components/backSnow";
import Sky from "./components/sky";
import Stats from "./components/stats";
import UIGroup from "./ui/uiGroup";
import ZWorld from "./data/zworld";

const MIN_Z = 32;
const MAX_Z = 200;
const FOCUS = 64;

export default class SnowGame extends Game {

	/**
	 * @property {SnowGroup} flakes
	 */
	get flakes() {return this._flakes; }
	set flakes(v) { this._flakes =v;}

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

		this.flakes = new SnowGroup( this, this.objectLayer );
		//this.objectLayer.addChild( this.flakes.clip );

		this.ui = new UIGroup(this, this.uiLayer );
		this.addGroup( this.ui );

		//this.loader.load( (loader,resources)=>this.assetsLoaded(loader,resources) );
		this.start();

	}

	start() {

		super.start();
		this.flakes.start();
		this.stage.interactive=true;
		this.stage.on( 'click', this.clickBg, this );

	}

	clickBg(e){
		this.stats.clicks++;
		this.flakes.mkFlake( e.data.global );
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

		this.sky = this.instantiate( s );
		this.sky.add( Sky );

		this.stars = new StarGroup(this);
		this.backgroundLayer.addChild( this.stars.clip );

	}

	/**
	 *
	 * @param {PIXI.loaders.Loader} loader
	 * @param {Object} resources
	 */
	assetsLoaded( loader, resources ) {

		console.log('ASSETS LOADED');

	}

}