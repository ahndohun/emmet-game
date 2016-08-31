(function($){
  'use strict';

  // -----------------------------------------------------------------
  // jQuery 플러그인: $.fn.focusToEnd
  // -----------------------------------------------------------------
  // <textarea> 요소에 자동 포커스 처리한 후, 커서를 텍스트 방향 뒤로 이동시킨다.
  // callback 인자가 존재할 경우, callback 함수를 실행시킨다.
  $.fn.focusToEnd = function(callback) {
      var $this = this;
      return $.each($this, function(index) {
          var $_this = $this.eq(index);
          var v = $_this.val();
          $_this.focus().val("").val(v);
          callback && callback.call($_this);
      });
  };

})(this.jQuery);
