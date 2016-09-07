(function($){
  'use strict';

	// emmet_obj 참조
	var emmet_obj = emmet.require('textarea');


	// HTML 문제 목록
	var html_beginner_exam_list = [
		'ul>li.item$*5',
		'ul>li*5',
		'div+p+bq',
		'a{click}',
		'#header',
		'.title',
		'br',
		'a'
	];

	var html_expert_exam_list = [
		'[a="value1" b="value2"]',
		'p[title="hello world"]',
		'table>.row>.col',
		'table+',
		'meta:compat',
		'meta:vp',
		'!'
	];

	var html_master_exam_list = [
		'div>(header>ul>li*2>a)+footer>p',
		'(div>dl>(dt+dd)*3)+footer>p',
		'div>(header>ul>li*2>a)+footer>p',
		'h$[title=item$]{Header $}*3',
		'ul>li.item$@3*5',
		'ul>li.item$@-*5',
		'ul>li.item$$$*5'
	];

	// CSS 문제 목록
	// var css_exam_list = [
	// 	'bg:n',
	// 	'pos:r',
	// 	'ov:h',
	// 	'cur:p',
	// 	'mr:a',
	// 	'bxz',
	// 	'maw',
	// 	'va:t',
	// 	'ta:c',
	// 	'td:n',
	// 	'tbl:f',
	// 	'bd+',
	// 	'bd:n',
	// 	'lis:n'
	// ];


	// 상태 변수 모음
	var life,
		life_display = $('.life'),
		time,
		time_display = $('.time'),
		isTimePaused = false,
		score = 0,
		score_display = $('.score'),
		clear_score,
		leaderboard = $('#leaderboard'),
		hall_of_fame = $('.hall-of-fame'),
		start_game_button = $('.start-game'),
		restart_game_button = $('.restart-game'),
		html_mode_button = $('.html-emmet'),
		css_mode_button = $('.css-emmet'),
		game_difficult,
		game_difficult_select = $('.game-difficult-select'),
		beginner = $('.beginner'),
		expert = $('.expert'),
		master = $('.master'),
		game_play_view = $('.game-view'),
		game_start_view = $('.game-start'),
		game_mode_select = $('.game-mode-select'),
		game_clear_view = $('.game-clear'),
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
		score = 0;
		score_display.text(score);
		life_display.text(life);
		time_display.text(time);
		nextExam();
	}


	// 게임시작
	function game_start() {
		game_difficult_select.hide();
		isTimePaused = true;
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
		hall_of_fame.fadeOut();
		game_start_view.hide();
		game_over_view.hide();
		game_mode_select.fadeIn();
		html_mode_button.focus();
	}

	// html 게임모드
	html_mode_button.on("click", function() {
		$(".language-css").removeClass('language-css');
		code_view_language.addClass('language-markup');
		emmet_obj.setup({
			pretty_break: true,
			use_tab: true,
			syntax: 'html'
		});
		difficult_select();
	});

	// css 게임모드
	// css_mode_button.on("click", function() {
	// 	$(".language-markup").removeClass('language-markup');
	// 	code_view_language.addClass('language-css');
	// 	emmet_obj.setup({
	// 		pretty_break: true,
	// 		use_tab: true,
	// 		syntax: 'css'
	// 	});
	// 	exam_list_temp = css_exam_list.slice(0);
	// 	difficult_select();
	// });


	// 난이도 선택
	function difficult_select() {
		game_mode_select.hide();
		game_difficult_select.fadeIn();
	}

	beginner.click(function() {
		life = 5;
		time = 60;
		exam_list_temp = html_beginner_exam_list.slice(0);
		clear_score = exam_list_temp.length;
		game_difficult = "beginner";
		game_start();
	});

	expert.click(function() {
		if ( emmet_game_progress == "beginner_clear" || emmet_game_progress == "expert_clear" || emmet_game_progress == "master_clear" ) {
			life = 3;
			time = 40;
			exam_list_temp = html_expert_exam_list.slice(0);
			clear_score = exam_list_temp.length;
			game_difficult = "expert";
			game_start();
		} else {
			alert("YOU ARE NOT PREPARED");
		}
	});

	master.click(function() {
		if ( emmet_game_progress == "expert_clear" || emmet_game_progress == "master_clear" ) {
			life = 1;
			time = 20;
			exam_list_temp = html_master_exam_list.slice(0);
			clear_score = exam_list_temp.length;
			game_difficult = "master";
			game_start();
		} else {
			alert("YOU ARE NOT PREPARED");
		}
	});

	// 게임 진척률
	var emmet_game_progress = localStorage.getItem("emmet_progress");

	// 진행률 체크
	function check_game_progress() {

		// 처음이거나 비기너 난이도를 클리어 못했을 경우
		if ( emmet_game_progress == null || emmet_game_progress == undefined ) {
			localStorage.setItem("emmet_progress", "");
		} else if ( emmet_game_progress == "beginner_clear" ) {
			expert.removeClass("disabled");
		} else if ( emmet_game_progress == "expert_clear" ) {
			expert.removeClass("disabled");
			master.removeClass("disabled");
		} else if ( emmet_game_progress == "master_clear" ) {
			expert.removeClass("disabled");
			master.removeClass("disabled");
		}
	}

	check_game_progress();



	// 게임클리어
	function game_clear() {
		hall_of_fame.fadeIn();
		game_play_view.hide();
		game_clear_view.fadeIn();
		restart_game_button.focus();
		emmet_game_progress = localStorage.getItem("emmet_progress");

		// 비기너 난이도를 클리어했을 경우
		if ( emmet_game_progress == "" && game_difficult == "beginner" ) {
			localStorage.setItem("emmet_progress", "beginner_clear");
			emmet_game_progress = localStorage.getItem("emmet_progress");
		}

		// 익스퍼트 난이도를 클리어했을 경우
		else if ( emmet_game_progress == "beginner_clear" && game_difficult == "expert" ) {
			localStorage.setItem("emmet_progress", "expert_clear");
			emmet_game_progress = localStorage.getItem("emmet_progress");
		}

		// 마스터 난이도를 클리어했을 경우
		else if ( (emmet_game_progress == "master_clear" || emmet_game_progress == "expert_clear") && game_difficult == "master" ) {
			localStorage.setItem("emmet_progress", "master_clear");
			emmet_game_progress = localStorage.getItem("emmet_progress");
			leaderboard.css('display', 'block');
			restart_game_button.hide();

			leaderboard.submit(function(event) {

				event.preventDefault();

			    leaderboard.fadeOut();
				var id_input = $(".id_input");

				// 보내기
				$.ajax({
					url: "https://script.google.com/macros/s/AKfycbyiynx6A64yqrn58ULMjMgl9zhks6kemYU5jJy-8Z7xohGUJOhS/exec",
					type: "POST",
					data: {
						"USERNAME": id_input.val(), 
						"SCORE": time
					},
					success:function(data){
			            getLeaderBoard();
						restart_game_button.fadeIn();
			        }
				});

			});

		}
		check_game_progress();
		isTimePaused = false;
	}

	// 게임오버
	function game_over() {
		hall_of_fame.fadeIn();
		game_play_view.hide();
		game_over_view.fadeIn();
		restart_game_button.focus();
		isTimePaused = false;
	}

	// 게임 재시작 버튼 이벤트
	restart_game_button.click(function() {
		game_play_view.hide();
		game_clear_view.hide();
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
		if(isTimePaused) {
		    time_display.text(--time);
			if ( time > 10 ) {
				time_display.removeClass("boom");
			}
			if ( time <= 10 && time >= 1 ) {
				time_display.addClass("boom");
			}
			if ( time === 0 ) {
				time_display.removeClass("boom");
				game_over();
			}
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
				score_display.text(++score);
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

		if (score == clear_score) {
			game_clear();
		}

		// 생명력이 0 이 될경우
		if (life == 0) {
			game_over();
		}

	});

	start_game_button.focus();

	function getLeaderBoard() {
		var GSSurl = "https://spreadsheets.google.com/feeds/list/1s-k6BD-W-Y-O896I_Jp1SuWK4NDwN_QbrHcA9BrAbBU/1/public/basic?alt=json-in-script&orderby=column:SCORE&callback=?";
		$.getJSON(GSSurl,function(data){
			var entry = data.feed.entry;//구글 스프레드 시트의 모든 내용은 feed.entry에 담겨있습니다.

			$('.hall-of-fame *').remove();
			for(var i in entry){ // 각 행에대해 아래 스크립트를 실행합니다.
				hall_of_fame.append("<tr>" + "<td>" + ([i] * 1 + 1) + "</td>" + "<td>" + entry[i].title.$t + "</td>" + "<td>" +  entry[i].content.$t + "</td></tr>");
			}
		});
	}

	getLeaderBoard();

})(this.jQuery);