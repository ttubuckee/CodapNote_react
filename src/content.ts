import FormGenerator from './components/FormGenerator';
import TimerImpl from './components/TimerImpl';
import Swal from 'sweetalert2';
import {addGitHubButton,urlReg} from './generalData';

// import {GITHUB_USER_KEY, GITHUB_PERSONAL_KEY} from './generalData';

// 타이머
// 폼 데이터 삽입
// 데이터 popup.html에 리스트 추가
// 즐겨찾기


const setId = () => {
  Swal.fire({
    title: 'Submit your Github username',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: '등록',
    showLoaderOnConfirm: true,
    cancelButtonText: '취소',
    preConfirm: (id) => {
      try{
        if(!/^[0-9a-zA-Z]+$/.test(id)) throw new Error('특수문자');
        const item: any = {};
        item['CODAPNOTE_USER_ID'] = id;
        // item[GITHUB_USER_KEY!] = id;
        return chrome.storage.sync.set(item,()=>{
          
        })
      } catch (e) {
        Swal.showValidationMessage(
          `영문, 숫자 조합만 입력해주세요`
        )
      }
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `등록되었습니다.`,
      })
    }
  })
}

// chrome extension에서는 manifest에서 주입시점을 제어해줘야한다.
// 해커랭크는 url 매치를 못한다. 새로고침해야 매치된다. 왜?
// manifest에서 document_start를 쓰면 document에서 css만 로드된 시점이고, 어떤 dom element들도 로드되지 않은 상태이기 때문에 document_idle을 스크립트 실행시점으로 주입해주었다.
// histroy.popstate 이벤트를 감지하기 위해서 url의 변경마다 mutation을 달아줬다.

let oldHref = document.location.href;
window.onload = function () {
  if(urlReg.some(e=>e.test(oldHref))) { // 프로그래머스, 백준의 경우
    console.log('match: '+location.href);
    const timer = new TimerImpl();
    const formGenerator = new FormGenerator(timer);
    formGenerator.init();
  } else if(/https:\/\/www.hackerrank.com/.test(oldHref)){ // hackerrank의 경우
    var bodyList = document.querySelector("body"),
      observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
              if (oldHref != document.location.href) {
                  oldHref = document.location.href;
                  if(/https:\/\/www.hackerrank.com\/challenges\/+.*\/problem/.test(location.href)) {
                    const timer = new TimerImpl();
                    const formGenerator = new FormGenerator(timer);
                    formGenerator.init();
                    addGitHubButton();
                  }
              }
          });
      });
    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList!, config);
  }
  addGitHubButton();
};