import Timer from './TimerImpl';

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
      "titleselector": "#problemtitle",
      "navselector": ".page-header"
  }
};
type FormElements = HTMLElement | null;
class FormGenerator {
  private clock: FormElements;
  private input_tag_h: FormElements;
  private input_tag_m: FormElements;
  private input_tag_s: FormElements;
  private formTag: FormElements;
  private starImg: FormElements;
  private inputWrapper: FormElements;
  private actionButton: FormElements;
  private timer: Timer;
  
  constructor(timer: Timer) {
    this.clock = null;
    this.input_tag_h = null;
    this.input_tag_m = null;
    this.input_tag_s = null;
    this.formTag = null;
    this.starImg = null;
    this.inputWrapper = null;
    this.actionButton = null;
    this.timer = timer;
  }
  get getTimer () {
    return this.timer;
  }
  get getHourTag() {
    return this.input_tag_h;
  }
  set setHourTag(val: FormElements) {
    this.input_tag_h = val;
  }
  get getMinuteTag() {
    return this.input_tag_m;
  }
  set setMinuteTag(val: FormElements) {
    this.input_tag_m = val;
  }
  get getSecondTag() {
    return this.input_tag_s;
  }
  set setSecondTag(val: FormElements) {
    this.input_tag_s = val;
  }
  init(): void{
    const data = this.getSiteData(location.href);
    const { clockcolor, url, titleselector, navselector } = data;
    const targetDiv = document.querySelector(navselector);

    // form 태그, input 태그, wrapper 생성
    this.formTag = this.generateTag('timer-form','form');
    this.inputWrapper = this.generateTag('input-wrapper','div');
    this.starImg = this.generateTag('star-img','img');
    this.input_tag_h = this.generateTag('input-h','input');
    this.input_tag_m = this.generateTag('input-m','input');
    this.input_tag_s = this.generateTag('input-s','input');
    this.actionButton = this.generateTag('action-button','button');
    this.clock = this.generateTag('clock-div','div');
    
    // appendchild
    targetDiv?.append(this.clock);
    targetDiv?.appendChild(this.formTag);
    this.formTag.appendChild(this.inputWrapper);
    this.inputWrapper.appendChild(this.starImg);
    this.inputWrapper.appendChild(this.input_tag_h);
    this.inputWrapper.appendChild(this.input_tag_m);
    this.inputWrapper.appendChild(this.input_tag_s);
    this.inputWrapper.appendChild(this.actionButton);

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