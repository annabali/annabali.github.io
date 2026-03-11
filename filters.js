(function () {
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

    function trackFilter(action, value) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'filter_used',
        filter_action: action,
        filter_value: value || 'none',
        selected_competencies: Array.from(selectedCompetencies).join(',') || 'none',
        page_lang: document.documentElement.lang || 'unknown'
      });
    }

    function applyFilters() {
      var visibleCount = 0;

      rows.forEach(function (row) {
        var rowCompetencies = parseList(row.getAttribute('data-competencies'));

        var competencyMatch = selectedCompetencies.size === 0 || rowCompetencies.some(function (item) {
          return selectedCompetencies.has(item);
        });

        row.style.display = competencyMatch ? '' : 'none';
        if (competencyMatch) visibleCount += 1;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var value = chip.getAttribute('data-value');
        var isActive = chip.classList.toggle('active');

        if (isActive) selectedCompetencies.add(value);
        else selectedCompetencies.delete(value);

        applyFilters();
        trackFilter(isActive ? 'select' : 'deselect', value);
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        selectedCompetencies.clear();

        chips.forEach(function (chip) {
          chip.classList.remove('active');
        });

        applyFilters();
        trackFilter('reset', 'all');
      });
    }

    applyFilters();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sections = Array.from(document.querySelectorAll('.table_card'));
    sections.forEach(initFilterSection);
  });
})();
