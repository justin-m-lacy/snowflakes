import { Component } from "gibbon.js";

export default class FlakeSpawner extends Component {

	/**
	 * @property {number} rate - flakes per frame.
	 */
	get rate(){return 1 / this._frames; }
	set rate(v) {
		if ( v === 0 ) v = 1;
		this._frames = 1/v;
	}

	/**
	 * @property {number} frames - frames between spawns.
	 */
	get frames(){return this._frames;}
	set frames(v){this._frames = v;}

	init(){

		this.mouseInfo = this.game.mouseInfo;
		this.flakes = this.game.flakes;

		this.rate = 0.2;
		this.timer = 0;

	}

	update(){

		if ( ++this.timer > this._frames ) {

			this.flakes.createFlake( this.mouseInfo.global );
			this.timer = 0;

		}

	}


}