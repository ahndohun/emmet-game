
// emmet_obj 참조
var emmet_obj = emmet.require('textarea');

// HTML 문제 목록
var html_exam_list = [
	'div>(header>ul>li*2>a)+footer>p',
	'(div>dl>(dt+dd)*3)+footer>p',
	'h$[title=item$]{Header $}*3',
	'div+div>p>span+em^^bq',
	'div+div>p>span+em^bq',
	'html:5',
	'p[title="hello world"]',
	'ul>li.item$*5',
	'div+p+bq',
	'nav>ul>li'
];

// CSS 문제 목록
var css_exam_list = [
	'bg:n',
	'pos:r',
	'ov:h',
	'cur:p',
	'mr:a',
	'bxz',
	'maw',
	'va:t',
	'ta:c',
	'td:n',
	'tbl:f',
	'bd+',
	'bd:n',
	'lis:n'
];

// 상태 변수 모음
var life,
	life_display = $('.life'),
	time,
	time_display = $('.time'),
	start_game_button = $('.start-game'),
	restart_game_button = $('.restart-game'),
	html_mode_button = $('.html-emmet'),
	css_mode_button = $('.css-emmet'),
	game_difficult_select = $('.game-difficult-select'),
	beginner = $('.beginner'),
	expert = $('.expert'),
	master = $('.master'),
	game_play_view = $('.game-view'),
	game_start_view = $('.game-start'),
	game_mode_select = $('.game-mode-select'),
	game_over_view = $('.game-over'),
	exam_list_temp,
	code_view_language = $('pre'),
	code_view = $('code'),
	code_write = $('.answer'),
	hidden_textarea = $('.hidden_textarea'),
	logo = $('.logo'),
	tab_click = $.Event('keydown', {'keyCode': 9, 'target': hidden_textarea[0]});

// 초기화
function initialize() {
	life_display.text(life);
	time_display.text(time);
	nextExam();
}

// 게임시작
function game_start() {
	game_difficult_select.hide();
	initialize();
	game_play_view.fadeIn();
	code_write.focus();
}

// 게임시작 버튼 이벤트
start_game_button.click(function() {
	game_mode();
});

// 게임 모드 선택
function game_mode() {
	game_start_view.hide();
	game_over_view.hide();
	game_mode_select.fadeIn();
	html_mode_button.focus();
}

// html 게임모드
html_mode_button.on("click", function() {

	$(".language-css").removeClass('language-css');
	code_view_language.addClass('language-markup');
	Prism.highlightAll();

	emmet_obj.setup({
		pretty_break: true,
		use_tab: true,
		syntax: 'html'
	});

	exam_list_temp = html_exam_list.slice(0);
	difficult_select();

});

// css 게임모드
css_mode_button.on("click", function() {

	$(".language-markup").removeClass('language-markup');
	code_view_language.addClass('language-css');
	Prism.highlightAll();

	emmet_obj.setup({
		pretty_break: true,
		use_tab: true,
		syntax: 'css'
	});

	exam_list_temp = css_exam_list.slice(0);
	difficult_select();

});

// 난이도 선택
function difficult_select() {
	game_mode_select.hide();
	game_difficult_select.fadeIn();
	beginner.focus();
}


beginner.click(function() {
	life = 5;
	time = 60;
	game_start();
});

expert.click(function() {
	life = 3;
	time = 40;
	game_start();
});

master.click(function() {
	life = 1;
	time = 20;
	game_start();
});

// 게임오버
function game_over() {
	game_play_view.hide();
	game_start_view.hide();
	game_over_view.fadeIn();
	restart_game_button.focus();
}

// 게임 재시작 버튼 이벤트
restart_game_button.click(function() {
	game_play_view.hide();
	game_mode();
});

// 다음문제 출제
function nextExam() {

	var ready_exam = exam_list_temp.pop();
	hidden_textarea.val(ready_exam);

	hidden_textarea.focusToEnd(function() {
		// emmet.js 파일 내부의 runAction 함수를 외부에서 참조할 수 있도록 처리
		emmet_obj.fire.call(this, tab_click);
	});

	code_view.text(hidden_textarea.val());
	Prism.highlightAll();

	code_write.focus();
	code_write.val('');
};

// 타임리미트
setInterval(function() {
	time_display.text(--time);
	if ( time > 10 ) {
		time_display.removeClass("boom");
	}
	if ( time <= 10 ) {
		time_display.addClass("boom");
	}
	if ( time === 0 ) {
		time_display.removeClass("boom");
		game_over();
	}
}, 1000);

// 문제제출
code_write.on('keyup', function(e) {

	var code = e.keyCode || e.which;

	// 답안을 제출했을때
	if (code == '9') {
		var exam = code_view.text().replace(/\s+/g, '').replace(/(\r\n|\n|\r)/gm,"");
		var memory_word = code_write.val().replace(/\s+/g, '').replace(/(\r\n|\n|\r)/gm,"");
		code_write.val('');

		// 정답일 경우
		if (exam === memory_word) {

			logo.addClass("goodjob").delay(500).queue(function(){
			    $(this).removeClass("goodjob").dequeue();
			});

			code_write.addClass("gr").delay(200).queue(function(){
			    $(this).removeClass("gr").dequeue();
			});

			time_display.addClass("time_up").delay(500).queue(function(){
			    $(this).removeClass("time_up").dequeue();
			});

			time += 5;
			nextExam();

		} 

		// 오답일 경우
		else {

			life_display.addClass("damage").delay(500).queue(function(){
			    $(this).removeClass("damage").dequeue();
			});

			code_write.addClass("wn").delay(200).queue(function(){
			    $(this).removeClass("wn").dequeue();
			});

			life_display.text(--life);
		}
	}

	// 생명력이 0 이 될경우
	if (life == 0) {
		game_over();
	}

});

start_game_button.focus();