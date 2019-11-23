import * as PIXI from 'pixi.js';
import { Component } from "gibbon.js";

export default class FlakeSpawner extends Component {

	get rate(){return this._rate; }
	set rate(v) { this._rate = v; }

	init(){

		// ugh. pixi.
		this.mouseInfo = this.game.renderer.plugins.interaction.mouse;
		this.flakes = this.game.flakes;

	}

	update(){

		if ( Math.random() < 1 ) {
			this.flakes.createFlake( this.mouseInfo.global );
		}

	}


}