import FormGenerator from './components/FormGenerator';
import TimerImpl from './components/TimerImpl';
// 타이머
// 폼 데이터 삽입
// 데이터 popup.html에 리스트 추가
// 즐겨찾기
console.log('content.ts loaded');

const timer = new TimerImpl();
const formGenerator = new FormGenerator(timer);
formGenerator.init();
// window.addEventListener('DOMContentLoaded',function(){
// 왜 여기서 제어가 안되지?
// });


