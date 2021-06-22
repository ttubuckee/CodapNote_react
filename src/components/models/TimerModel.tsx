import { TimerViewImpl } from "../views/TimerView";

export interface TimerModel {
  updateTime(): void;
  setTime(hour?:number, minute?:number, second?:number): void;

  interval: ReturnType<typeof setInterval> | null;
  totalRemainTime: number;
  hour: number;
  minute: number;
  second: number;
}

export class TimerModelImpl implements TimerModel {
  static readonly ONE_SECOND: number = 1000;
  static readonly ONE_MINUTE: number = 60 * 1000;
  static readonly ONE_HOUR  : number = 60 * 60 * 1000;

  private _interval: ReturnType<typeof setInterval> | null;
  private _totalRemainTime: number;
  private _hour: number;
  private _minute: number;
  private _second: number;
  
  constructor() {
    this._hour = 0;
    this._minute = 0;
    this._second = 0;
    this._totalRemainTime = 0;
    this._interval = null;
  }
  get hour() {
    return this._hour;
  }
  set hour(val: number) {
    this._hour = val | 0;
  }
  get minute() {
    return this._minute;
  }
  set minute(val: number) {
    this._minute = val | 0;
  }
  get second() {
    return this._second;
  }
  set second(val: number) {
    this._second = val | 0;
  }
  get interval() {
    return this._interval!;
  }
  set interval(val: ReturnType<typeof setInterval>) {
    this._interval = val;
  }
  get totalRemainTime() {
    return this._totalRemainTime;
  }
  updateTime() {
    this._totalRemainTime -= TimerModelImpl.ONE_SECOND;
    // if(--this._totalRemainTime <= 0) {
    //   // 잔여시간 0으로 만들고 종료
    //   this._totalRemainTime = 0;
    //   clearInterval(this._interval!);
    // }

    this.setTime(...this.convertTime(this._totalRemainTime));
  }
  convertTime(time: number): Array<number> {
    const hour = Math.floor(time/TimerModelImpl.ONE_HOUR);
    const min  = Math.floor((time%TimerModelImpl.ONE_HOUR)/TimerModelImpl.ONE_MINUTE);
    const sec  = Math.floor((Math.floor((time%TimerModelImpl.ONE_HOUR)%TimerModelImpl.ONE_MINUTE))/TimerModelImpl.ONE_SECOND);

    return [hour,min,sec];
  }
  setTime(hour?: number, minute? : number, second? : number) {
    this._hour = hour ? hour : 0;
    this._minute = minute ? minute : 0;
    this._second = second ? second : 0;

    this._totalRemainTime = this._hour * TimerModelImpl.ONE_HOUR + this._minute * TimerModelImpl.ONE_MINUTE + this._second * TimerModelImpl.ONE_SECOND;
  }
}