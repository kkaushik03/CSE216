/* Home page: summary stats and department tiles. */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var UCR = window.UCR;
    var regs = UCR.getRegistrations();
    var deptCodes = Object.keys(UCR.data.departments);

    document.getElementById('stat-courses').textContent = UCR.data.courses.length;
    document.getElementById('stat-depts').textContent = deptCodes.length;
    document.getElementById('stat-registered').textContent = regs.length;
    document.getElementById('stat-credits').textContent = UCR.totalCredits(regs);

    document.getElementById('dept-grid').innerHTML = deptCodes.map(function (code) {
      var count = UCR.data.courses.filter(function (c) { return c.dept === code; }).length;
      var name = UCR.escapeHTML(UCR.data.departments[code]);
      return '<li><a class="dept-tile dept-' + code + '" href="catalog.html?dept=' + code + '">' +
        name + '<span class="count">' + count + (count === 1 ? ' course' : ' courses') + '</span></a></li>';
    }).join('');
  });
})();
