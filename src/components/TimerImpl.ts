import Swal from 'sweetalert2';

interface Timer {
  start(resume: boolean): void;
  stop(): void;
  pause(): void;
  setTime(): void;
  updateClock(): void;
  
  hours: number;
  minutes: number;
  seconds: number;
}

class TimerImpl implements Timer {
  
  static readonly ONE_SECOND: number = 1000;
  private interval: ReturnType<typeof setInterval> | null;
  private start_time: Date | null;
  private end_time: Date | null;
  private remainTime: number;
  private _hours: number;
  private _minutes: number;
  private _seconds: number;
  private clock: HTMLDivElement | null;

  constructor() { // 여기 초기화 0으로 하는거 손 볼 것.
    this.interval = null;
    this.start_time = null;
    this.end_time = null;
    this.remainTime = 0;
    this._hours = 0;
    this._minutes = 0;
    this._seconds = 0;
    this.clock = null;
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
  start(resume: boolean) {
    if(resume) {
      this.interval = setInterval(this.updateClock.bind(this), TimerImpl.ONE_SECOND);
    } else {
      this.clock = document.getElementById('clock-div') as HTMLDivElement;
      this.start_time = new Date();
      this.end_time = new Date(this.start_time);
      this.end_time.setHours(this.end_time.getHours() + this.hours);
      this.end_time.setMinutes(this.end_time.getMinutes() + this.minutes);
      this.end_time.setSeconds(this.end_time.getSeconds() + this.seconds);
      this.remainTime = this.end_time.getTime() - this.start_time.getTime();

      this.interval = setInterval(this.updateClock.bind(this), TimerImpl.ONE_SECOND);
    }
  }
  updateClock () {
    let remain_hours: number = Math.floor((this.remainTime % (TimerImpl.ONE_SECOND * 60 * 60 * 24)) / (TimerImpl.ONE_SECOND  * 60 * 60));
    let remain_minutes: number = Math.floor((this.remainTime % (TimerImpl.ONE_SECOND  * 60 * 60)) / (TimerImpl.ONE_SECOND  * 60));
    let remain_seconds: number = Math.floor((this.remainTime % (TimerImpl.ONE_SECOND  * 60)) / TimerImpl.ONE_SECOND );

    this.clock!.innerText 
    = (remain_hours < 10 ? '0' + remain_hours.toString() : remain_hours.toString()) + " : " 
    + (remain_minutes < 10 ? '0' + remain_minutes.toString() : remain_minutes.toString()) + " : "
    + (remain_seconds < 10 ? '0' + remain_seconds.toString() : remain_seconds.toString());

    if (this.remainTime < 0) {
        // notify();
        this.stop();

        (document.getElementById('action-button') as HTMLButtonElement).innerText = "시작";
        (document.getElementById('input-h') as HTMLInputElement).style.display = 'block';
        (document.getElementById('input-m') as HTMLInputElement).style.display = 'block';
        (document.getElementById('input-s') as HTMLInputElement).style.display = 'block';

        if (Notification.permission === 'granted') {
            Swal.fire({
              icon: 'success',
              title: '종료!',
              text: '고생하셨습니다',
              confirmButtonText: '확인'
            })
        } else {
            const span = document.createElement("span");
            span.innerHTML = "고생하셨습니다<br>(현재 사이트에서 알림 설정이 차단되어<br>푸시 알림이 가지않습니다.<br>푸시 알림을 허용해주세요.)",
            Swal.fire({
              title: '종료',
              icon: 'success',
              html: span,
              showConfirmButton: true,
              showCloseButton: true,
              confirmButtonText: '푸시 알림 설정',
              closeButtonHtml: '확인'
            }).then((result)=>{
              if(result.isConfirmed) {
                
              } else {
                // requestPermission();
              }
            });
        }
    } else {
        this.remainTime -= 1000;
    }
  }
  pause() {
    clearInterval(this.interval as NodeJS.Timeout);
  }
  stop() {
    clearInterval(this.interval as NodeJS.Timeout);
    this.clock!.innerText = '';
  }
}

export default TimerImpl;