import { Component } from "gibbon.js";
import { GLOOM_COLOR } from "../ui/uiGroup";
import { TYP_GLOOM } from "../groups/snowGroup";

const CHEER_RATE = -0.01;

export default class GloomFlake extends Component {

	init(){

		this.stats = this.game.stats;
		this.clip.tint = GLOOM_COLOR;

		this.gameObject.flags = TYP_GLOOM;

		this.clip.interactive = true;
		this.clip.on('click', this.onClick, this );

	}

	update() {
		this.stats.cheer += CHEER_RATE;
	}

	onClick(){
		this.gameObject.Destroy();
		this.stats = null;
	}

}