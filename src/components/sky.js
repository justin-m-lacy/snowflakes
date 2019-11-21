import { Component } from "gibbon.js";

export default class Sky extends Component {

	get time() { return this._time; }
	set time(v) { this._time = v;}

	constructor() {

		super();

	}

}