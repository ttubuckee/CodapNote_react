import Swal from 'sweetalert2';
// import 'sweetalert2/dist/sweetalert2.min';
import TimerImpl from './TimerImpl';

interface UrlData {
  clockcolor: string;
  url: string;
  titleselector: string;
  navselector: string;
}
const base_urls: { [key:string]: UrlData } = {
  "https://programmers.co.kr/": {
      "clockcolor": "white",
      "url": "https://programmers.co.kr/",
      "titleselector": "body > div.navbar.navbar-dark.navbar-expand-lg.navbar-application.navbar-breadcrumb > ol > li.active",
      "navselector": "body > div.navbar.navbar-dark.navbar-expand-lg.navbar-application.navbar-breadcrumb > div.navbar-collapse.collapse"
  },
  "https://www.hackerrank.com/": {
      "clockcolor": "black",
      "url": "https://www.hackerrank.com/",
      "titleselector": "#content > div > div > div > header > div > div > div.community-header-breadcrumb-items > div > h1 > div > h1",
      "navselector": ".toolbar-left"
  },
  "https://www.acmicpc.net/problem": {
      "clockcolor": "black",
      "url": "https://www.acmicpc.net/",
      "titleselector": "#problem_title",
      "navselector": ".page-header"
  }
};
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
});

type FormElements = HTMLElement | null;
class FormGenerator {
  private data: UrlData;
  private top_nav: FormElements;
  private clock: HTMLDivElement;
  private input_tag_h: HTMLInputElement;
  private input_tag_m: HTMLInputElement;
  private input_tag_s: HTMLInputElement;
  private input_arr: Array<HTMLElement>;
  private starImg: HTMLImageElement;
  private inputWrapper: HTMLDivElement;
  private actionButton: HTMLButtonElement;
  private timer: TimerImpl;
  
  constructor(timer: TimerImpl) {
    this.data = this.getSiteData(location.href);
    this.top_nav = null;
    this.inputWrapper = this.generateTag('input-wrapper','div') as HTMLDivElement;
    this.starImg = this.generateTag('star-img','img') as HTMLImageElement;
    this.input_tag_h = this.generateTag('input-h','input') as HTMLInputElement;
    this.input_tag_m = this.generateTag('input-m','input') as HTMLInputElement;
    this.input_tag_s = this.generateTag('input-s','input') as HTMLInputElement;
    this.input_arr = [this.input_tag_h,this.input_tag_m,this.input_tag_s];
    this.actionButton = this.generateTag('action-button','button') as HTMLButtonElement;
    this.clock = this.generateTag('clock-div','div') as HTMLDivElement;
    this.timer = timer;
  }
  get getTimer () {
    return this.timer;
  }
  get getHourTag() {
    return this.input_tag_h;
  }
  set setHourTag(val: HTMLInputElement) {
    this.input_tag_h = val;
  }
  get getMinuteTag() {
    return this.input_tag_m;
  }
  set setMinuteTag(val: HTMLInputElement) {
    this.input_tag_m = val;
  }
  get getSecondTag() {
    return this.input_tag_s;
  }
  set setSecondTag(val: HTMLInputElement) {
    this.input_tag_s = val;
  }
  init() {
    this.appendTags();
    this.setTagStyles();
    this.setEventListener();
    this.setMutation();
  }
  private appendTags(): void{
    // appendchild
    const targetDiv = document.querySelector(this.data.navselector);
    // targetDiv?.append(this.clock);
    targetDiv?.appendChild(this.inputWrapper);
    this.inputWrapper.appendChild(this.starImg);
    this.inputWrapper.appendChild(this.input_tag_h);
    this.inputWrapper.appendChild(this.input_tag_m);
    this.inputWrapper.appendChild(this.input_tag_s);
    this.inputWrapper.appendChild(this.clock);
    this.inputWrapper.appendChild(this.actionButton);
  }
  private setTagStyles(): void{
    const { clockcolor, url, titleselector, navselector } = this.data;
    // set specific attributes
    this.input_tag_h.setAttribute('placeholder', '시간');
    this.input_tag_m.setAttribute('placeholder', '분');
    this.input_tag_s.setAttribute('placeholder', '초');

    this.inputWrapper.style.display = "flex";
    this.inputWrapper.style.flexDirection = "row";
    this.inputWrapper.style.margin = "2px 5px 2px 5px";
    this.inputWrapper.style.alignItems = "center";

    //clock
    this.clock.setAttribute('display','none');
    this.clock.style.marginRight = "5px";
    this.clock.style.color = clockcolor;
    this.clock.style.fontWeight = "bold";

    //star
    this.starImg.style.width = "20px";
    this.starImg.style.height = "20px";
    this.starImg.style.marginRight = "10px";

    //action_btn
    this.actionButton.innerHTML = "시작";
    this.actionButton.style.backgroundColor = '#0078FF';
    this.actionButton.style.color = 'white';
    this.actionButton.style.fontWeight = 'bold';
    this.actionButton.style.padding = "5px";
    this.actionButton.style.marginLeft = "5px";
    this.actionButton.style.border = "2px solid #0078FF";
    this.actionButton.style.borderRadius = '3px'; // standard
    // this.actionButton.style.MozBorderRadius = '3px'; // Mozilla

    this.input_arr.forEach(e=>{
      e.style.borderRadius = '3px';
      e.setAttribute('size', '4');
      e.style.padding = '5px';
    });
  }
  private setMutation(): void{
    if(this.data["url"] === "https://www.hackerrank.com/"){ // 특정 위치에 원소 삽입
        const mutation = new MutationObserver(()=>{
            this.top_nav = document.querySelector(this.data['navselector']);
            if (this.top_nav) {
                this.top_nav.appendChild(this.inputWrapper);
                this.input_tag_h.focus();
                this.isFavor().then(result=> this.checkStar(result));
                // this.checkStar(this.isFavor());
                mutation.disconnect();
            } else {
                console.log('시도중...');
            }
        });
        mutation.observe(document.getElementsByClassName('.hr-monaco-editor-wrapper')[0],{childList:true});
    }else {
        this.top_nav = document.querySelector(this.data['navselector']);
        this.top_nav!.appendChild(this.inputWrapper);
        this.input_tag_h.focus();
        this.isFavor().then(result=> this.checkStar(result));
    }
  }
  private setEventListener(): void{
    // starImg event
    this.starImg.addEventListener("click", () => {
      const url = window.location.href;
      const title = document.querySelector(this.data.titleselector)!.textContent;

      if (this.starImg.alt === "unstar") {
          this.starImg.alt = "star";
          this.starImg.src = chrome.runtime.getURL("img/Star.png?time=") + new Date().getTime();
          // addUnsolvedQuestions(title, url);
      } else {
          this.starImg.alt = "unstar";
          this.starImg.src = chrome.runtime.getURL("img/unStar.png?time=") + new Date().getTime();
          // remove from list
          // removeUnStaredQuestion(title);
      }
    });
    // actionButton event
    this.actionButton.addEventListener("click", (e) => {
      if((e.target as HTMLButtonElement).innerText === '시작'){
        if(this.validation()){
          this.hideInputForms();
          this.showClock();
          this.actionButton.innerText = '중지';

          const h = parseInt(this.input_tag_h.value);
          const m = parseInt(this.input_tag_m.value);
          const s = parseInt(this.input_tag_s.value);

          this.timer.setTime(h,m,s);
          this.timer.start();
          this.resetInput(); 
        } else { // 비정상적 값이 입력된 경우
          Swal.fire({
            icon: 'error',
            title: '앗!',
            text: '정상적인 값을 입력해주세요',
          });
        }
      } else { // 중지
        swalWithBootstrapButtons.fire({
          title: "타이머가 실행중입니다.\n초기화 하시겠습니까?",
          text: "'예' 를 누르시면 타이머가 초기화 됩니다.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '아니요',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
              '초기화 됨',
              '타이머가 초기화 되었습니다!',
              'success'
            )
            this.timer.stop();
            this.resetInput();
            this.hideClock();
            this.showInputForm();
            this.actionButton.innerText = '시작';
            this.input_tag_h.focus();
          }
        });
      }
    });
    // input event
    this.input_arr.forEach(input => {
      input.addEventListener('keyup',(e: KeyboardEvent)=>{
        if(e.code == 'Enter') this.actionButton.click();
      });
    });
  }
  private resetInput(): void{
    this.input_tag_h.value = '';
    this.input_tag_m.value = '';
    this.input_tag_s.value = '';
  }
  private validation(): boolean{
      return this.input_arr.reduce((acc, cur) => acc && (this.isNumber((cur as HTMLInputElement).value) || (cur as HTMLInputElement).value === "")
      , this.isNumber((this.input_arr[0] as HTMLInputElement).value) || (this.input_arr[0] as HTMLInputElement).value === '');
  }
  private isNumber(num: string): boolean{
    const regex = /^[0-9]+$/;
    return regex.test(num);
  }
  private hideInputForms(): void{
    this.input_tag_h.style.display = 'none';
    this.input_tag_m.style.display = 'none';
    this.input_tag_s.style.display = 'none';
  }
  private showInputForm(): void{
    this.input_tag_h.style.display = 'block';
    this.input_tag_m.style.display = 'block';
    this.input_tag_s.style.display = 'block';
  }
  private hideClock(): void{
    this.clock.style.display = 'none';
  }
  private showClock(): void{
    this.clock.style.display = 'block';
  }
  private checkStar(check: boolean): void{
    if (check) {
        // 별을 색칠
        this.starImg.alt = "star";
        this.starImg.src = chrome.runtime.getURL("img/Star.png?time=") + new Date().getTime();
    } else {
        // 별을 빈칸으로
        this.starImg.alt = "unstar";
        this.starImg.src = chrome.runtime.getURL("img/unStar.png?time=") + new Date().getTime();
    }
  }
  private isFavor(): Promise<boolean>{
    return new Promise(resolve => {
      if(document.querySelector(this.data.titleselector) !== null){
        const title = document.querySelector(this.data.titleselector)!.textContent;

        chrome.storage.sync.get(null, function (items) {
          const keys = Object.keys(items);
          keys.includes(title!) ? resolve(true) : resolve(false);
        });
      } else {
        throw new Error('no titleSelector');
      }
    });
  }
  private generateTag(id: string,type: string): HTMLElement{ 
    const tag = document.createElement(type);
    tag.setAttribute('id',id);
    return tag;
  }
  
  private getSiteData(url: string): UrlData {
    // const reg = new RegExp(url);  
    for(let obj in base_urls) { // url 매칭 검사
      if(url.includes(obj)) { 
        return base_urls[obj];
      }
    }
    throw new Error('wrong access');
  }
}

export default FormGenerator;