(function () {
  'use strict';
  var UCR = window.UCR;
  var list = document.getElementById('featured-list');
  var featured = ['CSE 340', 'MATH 310', 'BIO 101', 'ART 150'];

  function render() {
    list.textContent = '';
    featured.forEach(function (code) {
      var course = UCR.findCourse(code);
      if (course) list.appendChild(UCR.createCourseCard(course));
    });
  }

  UCR.bindWaitlist(list);
  render();
})();
