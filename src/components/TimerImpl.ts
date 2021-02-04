interface Timer {
  start(): void;
  stop(): void;
  setTime(): void;
  
  hours: number;
  minutes: number;
  seconds: number;
}

class TimerImpl implements Timer {
  
  static readonly ONE_SECOND: number = 1000;
  private _hours: number;
  private _minutes: number;
  private _seconds: number;

  constructor() { // 여기 초기화 0으로 하는거 손 볼 것.
    this._hours = 0;
    this._minutes = 0;
    this._seconds = 0;
  }
  get hours() {
    return this._hours;
  }
  set hours(val: number) {
    this._hours = val ? val : 0;
  }
  get minutes() {
    return this._minutes;
  }
  set minutes(val: number) {
    this._minutes = val ? val : 0;
  }
  get seconds() {
    return this._seconds;
  }
  set seconds(val: number) {
    this._seconds = val ? val : 0;
  }
  setTime(h?:number,m?:number,s?:number) {
    this._hours = h ? h : 0;
    this._minutes = m ? m : 0;
    this._seconds = s ? s : 0;
  }
  start() {

  }
  stop() {

  }
}

export default TimerImpl;