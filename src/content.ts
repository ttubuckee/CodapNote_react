// import FormGenerator from './components/FormGenerator'; import TimerImpl from
// './components/TimerImpl';
import {TimerControllerImpl} from './components/controllers/TimerController';
import {TimerViewImpl} from './components/views/TimerView';
import {TimerModelImpl} from './components/models/TimerModel';
import {urlReg} from './generalData/url';
import Swal from 'sweetalert2';

// chrome extension에서는 manifest에서 주입시점을 제어해줘야한다. 해커랭크는 url 매치를 못한다. 새로고침해야 매치된다.
// 왜? manifest에서 document_start를 쓰면 document에서 css만 로드된 시점이고, 어떤 dom element들도
// 로드되지 않은 상태이기 때문에 document_idle을 스크립트 실행시점으로 주입해주었다. histroy.popstate 이벤트를
// 감지하기 위해서 url의 변경마다 mutation을 달아줬다.

let oldHref = document.location.href;
window.onload = function () {
  console.log(document.location.href);
    if (urlReg.some(e => e.test(oldHref))) { // 프로그래머스, 백준의 경우

        const model = new TimerModelImpl();
        const view = new TimerViewImpl(model);
        const controller = new TimerControllerImpl(model, view);

    } else if (/https:\/\/www.hackerrank.com/.test(oldHref)) { // hackerrank의 경우
        // setInterval를 사용하게되면 web app 퍼포먼스를 저하시킬 수 있기 떄문에 MutationObserver를 사용하는게 좋다.
        let bodyList = document.querySelector("body"),
            observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) { // mutation은 각 dom들의 변화들 (mutation records)
                    if (oldHref != document.location.href) {
                        oldHref = document.location.href;

                        if (/https:\/\/www.hackerrank.com\/challenges\/+.*\/problem/.test(location.href)) {

                            const model = new TimerModelImpl();
                            const view = new TimerViewImpl(model);
                            const controller = new TimerControllerImpl(model, view);
                            // observer.disconnect();
                        }
                    }
                });
            });
        const config = {
            childList: true,
            subtree: true
        };
        observer.observe(bodyList!, config);
    }
};