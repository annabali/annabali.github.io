(function () {
  function toSet(values) {
    return new Set(values);
  }

  function parseList(raw) {
    if (!raw) return [];
    return raw.split(',').map(function (item) {
      return item.trim();
    }).filter(Boolean);
  }

  function initFilterSection(root) {
    var table = root.querySelector('[data-portfolio-table]');
    if (!table) return;

    var rows = Array.from(table.querySelectorAll('tbody tr'));
    var chips = Array.from(root.querySelectorAll('.filter_chip'));
    var resetBtn = root.querySelector('[data-reset-filters]');
    var emptyState = root.querySelector('[data-empty-state]');

    var selectedCompetencies = new Set();
    var selectedRoles = new Set();

    function applyFilters() {
      var visibleCount = 0;

      rows.forEach(function (row) {
        var rowCompetencies = parseList(row.getAttribute('data-competencies'));
        var rowRole = row.getAttribute('data-role');

        var competencyMatch = selectedCompetencies.size === 0 || rowCompetencies.some(function (item) {
          return selectedCompetencies.has(item);
        });

        var roleMatch = selectedRoles.size === 0 || selectedRoles.has(rowRole);

        var visible = competencyMatch && roleMatch;
        row.style.display = visible ? '' : 'none';
        if (visible) visibleCount += 1;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var group = chip.getAttribute('data-group');
        var value = chip.getAttribute('data-value');
        var isActive = chip.classList.toggle('active');

        if (group === 'competency') {
          if (isActive) selectedCompetencies.add(value);
          else selectedCompetencies.delete(value);
        } else if (group === 'role') {
          if (isActive) selectedRoles.add(value);
          else selectedRoles.delete(value);
        }

        applyFilters();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        selectedCompetencies = toSet([]);
        selectedRoles = toSet([]);

        chips.forEach(function (chip) {
          chip.classList.remove('active');
        });

        applyFilters();
      });
    }

    applyFilters();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sections = Array.from(document.querySelectorAll('.table_card'));
    sections.forEach(initFilterSection);
  });
})();
