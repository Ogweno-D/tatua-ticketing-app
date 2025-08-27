/**
 * Renders active filter and sort tags.
 * @param {Array} currentFilters - Active filters array.
 * @param {Array} currentSorts - Active sorts array.
 * @param {HTMLElement} filterContainer - Container for filter tags.
 * @param {HTMLElement} sortContainer - Container for sort tags.
 */
export function renderActiveTags(currentFilters, currentSorts, filterContainer, sortContainer) {
    if (!filterContainer || !sortContainer) return;

    const filterCount = currentFilters.length;
    const sortCount = currentSorts.length;

    filterContainer.innerHTML = filterCount > 0
        ? `<div class="active-tag" data-type="filter">
            <div class="tag-number">
                <span class="total-tags">${filterCount}</span>
                <span class="tag-type">Filter${filterCount > 1 ? 's' : ''}</span>
            </div>
            <div class="delete-tag" data-type="filter">
                <i class="fa-solid fa-close"></i>
            </div>
        </div>`
        : `<div class="filter-icon">
            <svg width="20" height="18" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7H15V5H3M0 0V2H18V0M7 12H11V10H7V12Z" fill="#DB8A74"/>
            </svg>
            <span>Filter</span>
        </div>`;

    sortContainer.innerHTML = sortCount > 0
        ? `<div class="active-tag" data-type="sort">
            <div class="tag-number">
                <span class="total-tags">${sortCount}</span>
                <span class="tag-type">Sort${sortCount > 1 ? 's' : ''}</span>
            </div>
            <div class="delete-tag" data-type="sort">
                <i class="fa-solid fa-close"></i>
            </div>
        </div>`
        : `<div class="sort-icon">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="black" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 18L12 14H15V4H12L16 0L20 4H17V14H20M0 16V14H10V16M0 10V8H7V10M0 4V2H4V4H0Z" fill="#DB8A74"/>
            </svg>
            <span>Sort</span>
        </div>`;
}