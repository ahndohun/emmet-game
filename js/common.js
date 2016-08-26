
// 레벨은 비기너, 익스퍼트, 마스터 순으로 진행된다.
// 비기너 레벨에서는 치트시트를 볼수있다.
// 해당 레벨의 문제중 하나가 랜덤하게 출력된다.

// 사용자가 문제를 보고 emmet 코드를 이용해 동일한 결과물이 나오게 한다.
// emmet 코드를 작성후 tab키를 누르면 결과를 알수있다.

// 변환된 emmet 코드와 문제 코드를 비교할때 모든 공백을 제거후 비교한다.
// 정답일 경우 input text박스가 초기화 된후 다음문제가 출력된다.
// 오답일 경우 애니메이션이 출력된후 계속해서 문제를 풀어야한다.

// 1. code_view가 비어있다면
// 2. 배열에서 emmet 코드를 뺴서 변수에 담는다.
// 3. 해당 변수에서 emmet 컨버터(textarea)에 코드를 삽입한다.
// 4. 삽입된 코드를 key시뮬레이터를 통해 converter 발동시킨다.
// 5. 변경된 html 코드를 code_view에 삽입한다.
// 6. code_write에 남아있는 html 코드는 삭제한다.
// 7. 유저가 문제를 푼다.
// 8. 문제를 풀면 다음문제가 나온다.

function replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
}

emmet.require('textarea').setup({
    pretty_break: true, // enable formatted line breaks (when inserting 
                        // between opening and closing tag) 
    use_tab: true       // expand abbreviations by Tab key
});


var exam_list = [
	'.box02>ul>li*5',
	'.box'
];

var code_view = $('code'),
	code_write = $('.answer'),
	hidden_textarea = $('.hidden_textarea'),
	nextExam = function() {

		var event = $.Event("keyup");
		event.which = 9;
		event.keyCode = 9;
		console.log(event)

		var ready_exam = exam_list.pop();
		hidden_textarea.text(ready_exam);

		hidden_textarea.focus().trigger(event);


		console.log(event)
		console.log('after tab: ',hidden_textarea)
		code_view.text(hidden_textarea.val());
		
		Prism.highlightAll();
	};

nextExam();


code_write.on('keyup', function(e) {

	var code = e.keyCode || e.which;

	if (code == '9') {
		var exam = code_view.text().replace(/\s+/g, '').replace(/(\r\n|\n|\r)/gm,"");
		var memory_word = code_write.val().replace(/\s+/g, '').replace(/(\r\n|\n|\r)/gm,"");
		console.log(memory_word);
		
		if (exam === memory_word) {
			alert('정답!');
			code_write.val('');
			nextExam();
		} else {
			alert('틀렸어!')
			code_write.val('');
		}
	}
});

// var $next_btn = $('.next-btn');
// $next_btn.on('click',function(){

// })