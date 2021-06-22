import {TimerModelImpl} from '../models/TimerModel';
import {TimerViewImpl} from '../views/TimerView';
import Swal from 'sweetalert2';

export interface TimerController {
  model: TimerModelImpl;
  view: TimerViewImpl;
}

export class TimerControllerImpl implements TimerController {
  private _model: TimerModelImpl;
  private _view: TimerViewImpl;

  constructor(model: TimerModelImpl, view: TimerViewImpl) {
    this._model = model;
    this._view = view;

    this._view.init();
    this.setEventListener();
  }
  get model() {
    return this._model;
  }
  get view() {
    return this._view;
  }
  private setEventListener(): void{
    // starImg event
    this._view.starImg.addEventListener("click", () => {
      const url = window.location.href;
      const title = document.querySelector(this._view.data.titleselector)!.textContent;

      if (this._view.starImg.alt === "unstar") {
          this._view.starImg.alt = "star";
          this._view.starImg.src = chrome.runtime.getURL("img/Star.png?time=") + new Date().getTime();
          this._view.addUnsolvedQuestions(title!, url);
      } else {
          this._view.starImg.alt = "unstar";
          this._view.starImg.src = chrome.runtime.getURL("img/unStar.png?time=") + new Date().getTime();
          // remove from list
          this._view.removeUnStaredQuestion(title!);
      }
    });
    // actionButton event
    this._view.actionButton.addEventListener("click", (e) => {
      if((e.target as HTMLButtonElement).innerText === '시작'){
        if(this._view.validation()){
          this._view.hideInputForms();
          this._view.showClock();
          
          const time = this._view.input_arr.map(e=>{
            const { value } = (e as HTMLInputElement);
            
            return value ? parseInt(value) : 0;
          });
        
          this._model.setTime(...time);
          this._view.start();
          this._view.resetInput(); 
        } else { // 비정상적 값이 입력된 경우
          Swal.fire({
            icon: 'error',
            title: '앗!',
            text: '정상적인 값을 입력해주세요',
          });
        }
      } else if((e.target as HTMLButtonElement).innerText === '재개') {
        this._view.resume();
      } else { // 중지
        Swal.fire({
          title: "타이머가 실행중입니다.",
          showDenyButton: true,
          showCancelButton: true,
          cancelButtonText: '취소',
          confirmButtonText: '일시정지',
          denyButtonText: '초기화',
        }).then((result)=>{
          if(result.isConfirmed) {
            this._view.pause();
            this._view.actionButton.innerText = '재개';
          } else if (result.isDenied) {
            Swal.fire(
              '초기화 됨',
              '타이머가 초기화 되었습니다!',
              'success'
            )
            this._view.stop();
            this._view.input_tag_h.focus();
          }
        }); 
      }
    });
    // input event
    this._view.input_arr.forEach(input => {
      input.addEventListener('keyup',(e: KeyboardEvent)=>{
        if(e.code == 'Enter') this._view.actionButton.click();
      });
    });
  }
}