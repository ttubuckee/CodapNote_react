import Swal from 'sweetalert2';

export const urlReg = [
  /https:\/\/programmers.co.kr\/learn\/courses\/30\/lessons\/\d{0,}/,
  /https:\/\/www.acmicpc.net\/problem\/+\d{0,}/
]
export const [GITHUB_USER_KEY, GITHUB_PERSONAL_KEY] = ['GITHUB_USER_KEY', 'GITHUB_PERSONAL_KEY'];
export const addGitHubButton = () => {
  // github 등록
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.message === 'showPopUp') {
          setGithub();
          sendResponse({ok:"success"});
        }
    }
  );
}
export const setGithub = () => {
  Swal.mixin({
    input: 'text',
    confirmButtonText: '다음',
    showCancelButton: true,
    progressSteps: ['1', '2']
  }).queue([
    {
      title: '사용자 정보 등록',
      text: 'GitHub ID(author)를 입력해주세요'
    },
    {
      title: '사용자 정보 등록',
      text: 'GitHub Personal Key 정보를 입력해주세요'
    }
  ]).then((result: any) => {
    if (result.value) {
      if(result.value.some((element: any) => { // 영문,숫자 이외의 문자가 섞여있을 경우
        return !/^[0-9a-zA-Z]+$/.test(element);
      })){
        Swal.fire({
          title: '영문, 숫자 조합만 입력해주세요.',
          html: `
            <div>author: ${result.value[0]}</div><div>personal-key: ${result.value[1]}</div>
          `,
          confirmButtonText: '확인'
        })
      } else {
        Swal.fire({
          title: '성공적으로 저장되었습니다.',
          html: `
            <div>author: ${result.value[0]}</div><div>personal-key: ${result.value[1]}</div>
          `,
          confirmButtonText: '확인'
        });
        const items: any = {};
        items[GITHUB_USER_KEY] = result.value[0];
        items[GITHUB_PERSONAL_KEY] = result.value[1];
        return chrome.storage.sync.set(items,()=>{
          
        })
      }
    }
  })
}