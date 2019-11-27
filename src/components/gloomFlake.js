import { Component } from "gibbon.js";
import { GLOOM_COLOR } from "../ui/uiGroup";
import { TYP_GLOOM, TYP_FLAKE } from "../groups/snowGroup";

const CHEER_RATE = -0.01;

export default class GloomFlake extends Component {

	init(){

		this.stats = this.game.stats;
		this.clip.tint = GLOOM_COLOR;

		this.gameObject.flags = TYP_GLOOM + TYP_FLAKE;

		this.clip.interactive = true;
		this.clip.on('click', this.onClick, this );

	}

	update() {
		this.stats.cheer += CHEER_RATE;
	}

	onClick(e){

		e.stopPropagation();

		this.gameObject.Destroy();
		this.stats = null;
	}

}