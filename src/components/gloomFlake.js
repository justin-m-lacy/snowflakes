import { Component } from "gibbon.js";
import { GLOOM_COLOR } from "../ui/uiGroup";

const CHEER_RATE = -0.1;

export default class GloomFlake extends Component {

	init(){
		this.stats = this.game.stats;
		this.clip.tint = GLOOM_COLOR;
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