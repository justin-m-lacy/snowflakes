export default class Particle {

	get clip(){return this._clip;}
	set clip(v) { this._clip=v}

	get vx(){ return this._vx;}
	set vx(v){this._vx = v;}

	get vy(){ return this._vy;}
	set vy(v){this._vy = v;}

	get ay(){ return this._ay;}
	set ay(v){this._ay = v;}

	/**
	 * @property {number} da - delta alpha per frame.
	 */
	get da(){ return this._da;}
	set da(v){this._da = v;}

	constructor( clip, x, y, vx=0, vy=0, ay=0 ){

		this._clip = clip;
		clip.position.set( x, y );

		this._vx = vx;
		this._vy = vy;
		this._ay = ay;

		this._da = 0;


	}

	update(){

		this._clip.x += this._vx;
		this._clip.y += this._vy;

		this._vy += this._ay;

		this._clip.alpha += this._da;

	}

	destroy(){
		this._clip.destroy();
		this._clip = null;
	}
}