// 错误1: 调用方法错误
function foo() {
  console.log(script_js_error);
}

// 错误2: 调用事件错误
document.body.addEventListener('click', function aa(e) {
  console.log(script_click_event_error);
});
// window.addEventListener('scroll', function aa(e) {
//   console.log(scroll_error);
// });

// 错误3: 加载时就报错 该报错信息无法获取, 只会显示[Script error]
// console.log(script_error);

// 错误4: 该报错信息无法获取, 只会显示[Script error]
// window.onclick = function bb(e) {
//   console.log(click_error);
// };

// 错误5(Promise.reject): 该报错无法捕获
// function script_reject() {
//   Promise.reject('Hello, script Promise reject');
// }
// script_reject();
