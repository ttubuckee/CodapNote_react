import { TimerModelImpl, TimerModel } from '../models/TimerModel';
import { urlDataObj, UrlData } from '../../generalData/url';
import Swal from 'sweetalert2';

export interface TimerView {
  start(h?: number,m?: number, s?: number): void;
  stop(): void;
  pause(): void;
  resume(): void;
  updateView(): void;

  model: TimerModel;
  data: UrlData;
  top_nav: HTMLElement | null;
  clock: HTMLDivElement;
  input_tag_h: HTMLInputElement;
  input_tag_m: HTMLInputElement;
  input_tag_s: HTMLInputElement;
  input_arr: Array<HTMLElement>;
  starImg: HTMLImageElement;
  inputWrapper: HTMLDivElement;
  actionButton: HTMLButtonElement;
}

export class TimerViewImpl implements TimerView {
  private _model: TimerModel;
  private _data: UrlData;
  private _top_nav: HTMLElement | null;
  private _clock: HTMLDivElement;
  private _input_tag_h: HTMLInputElement;
  private _input_tag_m: HTMLInputElement;
  private _input_tag_s: HTMLInputElement;
  private _input_arr: Array<HTMLElement>;
  private _starImg: HTMLImageElement;
  private _inputWrapper: HTMLDivElement;
  private _actionButton: HTMLButtonElement;

  constructor(model: TimerModel) {
    this._model = model;
    this._data = this.getSiteData(location.href);
    this._top_nav = null;
    this._inputWrapper = this.generateTag('input-wrapper','div') as HTMLDivElement;
    this._starImg = this.generateTag('star-img','img') as HTMLImageElement;
    this._input_tag_h = this.generateTag('input-h','input') as HTMLInputElement;
    this._input_tag_m = this.generateTag('input-m','input') as HTMLInputElement;
    this._input_tag_s = this.generateTag('input-s','input') as HTMLInputElement;
    this._input_arr = [this._input_tag_h,this._input_tag_m,this._input_tag_s];
    this._actionButton = this.generateTag('action-button','button') as HTMLButtonElement;
    this._clock = this.generateTag('clock-div','div') as HTMLDivElement;
  }
  get model() {
    return this._model;
  }
  get data() {
    return this._data;
  }
  get top_nav() {
    return this._top_nav;
  }
  get inputWrapper() {
    return this._inputWrapper;
  }
  get starImg() {
    return this._starImg;
  }
  get clock() {
    return this._clock;
  }
  get input_tag_h() {
    return this._input_tag_h;
  }
  set input_tag_h(val: HTMLInputElement) {
    this._input_tag_h = val;
  }
  get input_tag_m() {
    return this._input_tag_m;
  }
  set input_tag_m(val: HTMLInputElement) {
    this._input_tag_m = val;
  }
  get input_tag_s() {
    return this._input_tag_s;
  }
  set input_tag_s(val: HTMLInputElement) {
    this._input_tag_s = val;
  }
  get input_arr () {
    return this._input_arr;
  }
  get actionButton () {
    return this._actionButton;
  }
  start(h?: number,m?: number, s?: number) {
    this.showClock();

    this.model.interval = setInterval(()=>{
      this.model.updateTime();
      this.updateView();
    },TimerModelImpl.ONE_SECOND);

    this._actionButton.innerText = "중지";
  }
  stop() {
    clearInterval(this.model.interval as NodeJS.Timeout);
    this.clock!.innerText = '';
    this.hideClock(); // 이게 맞는 것 같은데?
    this.showInputForm();
    this.resetInput();

    this.model.setTime(0,0,0);
    this._actionButton.innerText = "시작";
  }
  pause() {
    clearInterval(this.model.interval as NodeJS.Timeout);
    this._actionButton.innerText = "재개";
  }
  resume() {
    this.model.interval = setInterval(()=>{
      this.model.updateTime();
      this.updateView();
    },TimerModelImpl.ONE_SECOND);

    this._actionButton.innerText = "중지";
  }
  updateView() {
    const h = this.model.hour;
    const m = this.model.minute;
    const s = this.model.second;
    
    this.clock!.innerText
    = (h < 10 ? '0'+h : h) + ' : '
    + (m < 10 ? '0'+m : m) + ' : '
    + (s < 10 ? '0'+s : s);

    if(this.model.totalRemainTime <= 0) {
      this.stop();

      if (Notification.permission === 'granted') {
          this.notify();
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
              this.requestPermission();
            }
          });
      }
    }
  }
  init() {
    this.appendTags();
    this.setTagStyles();
    this.setMutation();
    this.requestPermission();
  }
  requestPermission() {
    if (window.Notification) {
        Notification.requestPermission();
    }
  }
  notify() { // 여기 수정
    return new Notification('시간 종료 알림', {
        icon: chrome.extension.getURL("/img/timer_icon.png"),
        body: '정해진 시간이 되어 타이머가 종료되었습니다.',
    });
  }
  private appendTags(): void{

    // appendchild
    const targetDiv = document.querySelector(this._data.navselector);
    // targetDiv?.append(this._clock);
    targetDiv?.appendChild(this._inputWrapper);
    this._inputWrapper.appendChild(this._starImg);
    this._inputWrapper.appendChild(this._input_tag_h);
    this._inputWrapper.appendChild(this._input_tag_m);
    this._inputWrapper.appendChild(this._input_tag_s);
    this._inputWrapper.appendChild(this._clock);
    this._inputWrapper.appendChild(this._actionButton);
  }
  private setTagStyles(): void{
    const { clockcolor, url, titleselector, navselector } = this._data;
    // set specific attributes
    this._input_tag_h.setAttribute('placeholder', '시간');
    this._input_tag_m.setAttribute('placeholder', '분');
    this._input_tag_s.setAttribute('placeholder', '초');

    this._inputWrapper.style.display = "flex";
    this._inputWrapper.style.flexDirection = "row";
    this._inputWrapper.style.margin = "2px 5px 2px 5px";
    this._inputWrapper.style.alignItems = "center";

    //clock
    this._clock.setAttribute('display','none');
    this._clock.style.marginRight = "5px";
    this._clock.style.color = clockcolor;
    this._clock.style.fontWeight = "bold";

    //star
    this._starImg.style.width = "20px";
    this._starImg.style.height = "20px";
    this._starImg.style.marginRight = "10px";

    //action_btn
    this._actionButton.innerHTML = "시작";
    this._actionButton.style.backgroundColor = '#0078FF';
    this._actionButton.style.color = 'white';
    this._actionButton.style.fontWeight = 'bold';
    this._actionButton.style.padding = "5px";
    this._actionButton.style.marginLeft = "5px";
    this._actionButton.style.border = "2px solid #0078FF";
    this._actionButton.style.borderRadius = '3px'; // standard
    // this._actionButton.style.MozBorderRadius = '3px'; // Mozilla

    this._input_arr.forEach(e=>{
      e.style.borderRadius = '3px';
      e.setAttribute('size', '4');
      e.style.padding = '5px';
    });
  }
  private setMutation(): void{
    if(this._data["url"] === "https://www.hackerrank.com/"){ // 특정 위치에 원소 삽입
        const interval = setInterval(()=>{
          this._top_nav = document.querySelector(this.data.navselector);

          if(this._top_nav) {
            this._top_nav.appendChild(this._inputWrapper);
            this._input_tag_h.focus();
            this.isFavor().then(result => this.checkStar(result));
            clearInterval(interval);
          } else {
            console.log('시도중...');
          }
        },1000);
        // const cb = function(this: TimerViewImpl,mutations: Array<MutationRecord>) {
        //   mutations.forEach((mutation)=>{
        //     this._top_nav = document.querySelector(this._data['navselector']);
            
        //     if (this._top_nav) {
        //         this._top_nav.appendChild(this._inputWrapper);
        //         this._input_tag_h.focus();
        //         // this.checkStar(await this.isFavor());
                
        //         this.isFavor().then(result=> this.checkStar(result));
        //         // // this.checkStar(this.isFavor());
        //         observer.disconnect();
        //     }
        //   });
        // }
        // const observer = new MutationObserver(cb.bind(this));
        
        // const config = {
        //   childList: true,
        //   subtree: true
        // };
        // observer.observe(document.querySelector("body")!,config);
    }else {
        this._top_nav = document.querySelector(this._data['navselector']);
        this._top_nav!.appendChild(this._inputWrapper);
        this._input_tag_h.focus();
        this.isFavor().then(result=> this.checkStar(result));
    }
  }
  addUnsolvedQuestions(key: string, value: string) {
    // const item = {key: value};  // 추가할 항목들
    const item: any = {};

    item[key] = value;

    chrome.storage.sync.get(null, function (items) {
      const keys = Object.keys(items);
      if (!keys.includes(key)) {
        chrome.storage.sync.set(item, function () {
          
        });
      }
    });
  }
  // function addUnsolvedQuestions(key, value) {
  //   let item = {};  // 추가할 항목들
  //   item[key] = value;
  //   chrome.storage.sync.get(null, function (items) {
  //       const keys = Object.keys(items);
  //       if (!keys.includes(key)) {
  //           chrome.storage.sync.set(item, function () {

  //           });
  //       }
  //   });
  // }
  removeUnStaredQuestion(title: string) {
    chrome.storage.sync.remove(title);
  }
  resetInput(): void{
    this._input_tag_h.value = '';
    this._input_tag_m.value = '';
    this._input_tag_s.value = '';
  }
  validation(): boolean{
      return this._input_arr.reduce((acc, cur) => acc && (this.isNumber((cur as HTMLInputElement).value) || (cur as HTMLInputElement).value === "")
      , this.isNumber((this._input_arr[0] as HTMLInputElement).value) || (this._input_arr[0] as HTMLInputElement).value === '');
  }
  isNumber(num: string): boolean{
    const regex = /^[0-9]+$/;
    return regex.test(num);
  }
  hideInputForms(): void{
    this._input_tag_h.style.display = 'none';
    this._input_tag_m.style.display = 'none';
    this._input_tag_s.style.display = 'none';
  }
  showInputForm(): void{
    this._input_tag_h.style.display = 'block';
    this._input_tag_m.style.display = 'block';
    this._input_tag_s.style.display = 'block';
  }
  hideClock(): void{
    this._clock.style.display = 'none';
  }
  showClock(): void{
    this.clock.style.display = 'block';
  }
  private checkStar(check: boolean): void{
    if (check) {
        // 별을 색칠
        this._starImg.alt = "star";
        this._starImg.src = chrome.runtime.getURL("img/Star.png?time=") + new Date().getTime();
    } else {
        // 별을 빈칸으로
        this._starImg.alt = "unstar";
        this._starImg.src = chrome.runtime.getURL("img/unStar.png?time=") + new Date().getTime();
    }
  }
  private isFavor(): Promise<boolean>{
    return new Promise(resolve => {
      try {
          if(document.querySelector(this._data.titleselector) !== null){
          const title = document.querySelector(this._data.titleselector)!.textContent;

          chrome.storage.sync.get(null, function (items) {
            const keys = Object.keys(items);
            keys.includes(title!) ? resolve(true) : resolve(false);
          });
        } else {
          throw new Error('no titleSelector');
        }
      } catch(e) {
        console.log(e);
        resolve(false);
      }
    });
  }
  private generateTag(id: string,type: string): HTMLElement{
    const tag = document.createElement(type);
    tag.setAttribute('id',id);
    return tag;
  }
  private getSiteData(url: string): UrlData {
    for(let obj in urlDataObj) { // url 매칭 검사
      if(url.includes(obj)) {
        return urlDataObj[obj];
      }
    }
    throw new Error('wrong access');
  }
}