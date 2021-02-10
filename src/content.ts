import FormGenerator from './components/FormGenerator';
import TimerImpl from './components/TimerImpl';
import Swal from 'sweetalert2';
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
      confirmButtonText: 'Register',
      showLoaderOnConfirm: true,
      preConfirm: (id) => {
        try{
          if(!/^[0-9a-zA-Z]+$/.test(id)) throw new Error('특수문자');
          const item: any = {};
          item['CODAPNOTE_USER_ID'] = id;
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
const timer = new TimerImpl();
const formGenerator = new FormGenerator(timer);
formGenerator.init();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if(request.message === 'showPopUp') {
        // console.log('message arrived');
        setId();
        sendResponse({ok:"success"});
      }
  }
);
// document.addEventListener('DOMContentLoaded',function(){

// });


