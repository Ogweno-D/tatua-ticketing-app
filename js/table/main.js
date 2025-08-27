import { renderTable } from './table.js';
import { openModal, closeModal } from './modals.js';
import { openFilterModal, closeFilterModal, addFilterRow, submitFilters, resetFilters } from './filters.js';
import { openSortModal, closeSortModal, addSortRow, submitSorts, resetSorts } from './sorts.js';
import { actionHandlers } from './actions.js';
import { saveStateToUrl, loadStateFromUrl } from './state.js';
import { showToast } from '../toast.js';
import {renderActiveTags} from "./utils";

document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector("#ticketsTable tbody");
    if (!tableBody) {
        console.error("Table body not found");
        return;
    }

    await window.storageReady;
    const storage = window.storage;
    if (!storage) {
        console.error("Storage not available");
        return;
    }

    let submissions = await storage.getSubmissions();
    let tableState = await storage.getTableState() || { filters: [], sorts: [] };
    let currentFilters = Array.isArray(tableState.filters) ? tableState.filters : [];
    let currentSorts = Array.isArray(tableState.sorts) ? tableState.sorts : [];

    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modalBody");
    const modalTitle = document.getElementById("modalTitle");
    const closeBtn = document.getElementById("closeModal");
    const filterModal = document.getElementById("filterModal");
    const filterOverlay = document.getElementById("filterOverlay");
    const filtersContainer = document.getElementById("filtersContainer");
    const sortModal = document.getElementById("sortModal");
    const sortOverlay = document.getElementById("sortOverlay");
    const sortContainer = document.getElementById("sortsContainer");
    const filterContainer = document.getElementById("filterContainer");
    const sortContainerElement = document.getElementById("sortContainer");

    // Load state from URL
    tableState = loadStateFromUrl(tableState);
    currentFilters = tableState.filters || [];
    currentSorts = tableState.sorts || [];

    // Centralized event delegation
    document.addEventListener('click', e => {
        const close = e.target.closest('.close');
        if (close) {
            const modal = close.closest('.modal');
            if (modal) closeModal(modal);
            if (sortOverlay) sortOverlay.style.display = 'none';
            if (filterOverlay) filterOverlay.style.display = 'none';
        }

        if (e.target.closest('.delete-tag')) {
            e.stopPropagation();
            const type = e.target.closest('.delete-tag').dataset.type;
            if (type === 'filter') currentFilters.length = 0;
            else if (type === 'sort') currentSorts.length = 0;
            tableState = { filters: currentFilters, sorts: currentSorts };
            storage.saveTableState(tableState);
            saveStateToUrl(tableState);
            renderActiveTags(currentFilters, currentSorts, filterContainer, sortContainerElement);
            renderTable(submissions, currentFilters, currentSorts, tableBody, () => actionHandlers(submissions, storage, (content, options) => openModal(modal, modalBody, modalTitle, closeBtn, content, options), closeModal, showToast, renderTable), showToast, () => closeFilterModal(filterModal, filterOverlay), () => closeSortModal(sortModal, sortOverlay), () => renderActiveTags(currentFilters, currentSorts, filterContainer, sortContainerElement));
        }

        if (e.target.closest('.filter-icon')) {
            openFilterModal(filterModal, filterOverlay, filtersContainer);
        }

        if (e.target.closest('.sort-icon')) {
            openSortModal(sortModal, sortOverlay, sortContainer);
        }

        if (e.target === modal) {
            closeModal(modal);
        }

        if (e.target === filterOverlay) {
            closeFilterModal(filterModal, filterOverlay);
        }

        if (e.target === sortOverlay) {
            closeSortModal(sortModal, sortOverlay);
        }
    });

    // Other event listeners
    document.querySelector(".refresh-icon")?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        location.reload();
    });

    document.querySelector(".add-filter")?.addEventListener("click", () => addFilterRow(filtersContainer));
    document.querySelector(".add-sort")?.addEventListener("click", () => addSortRow(sortContainer));
    document.getElementById("applyFilterBtn")?.addEventListener("click", () => submitFilters(filtersContainer, currentFilters, () => {
        tableState = { filters: currentFilters, sorts: currentSorts };
        storage.saveTableState(tableState);
        saveStateToUrl(tableState);
        renderTable(submissions, currentFilters, currentSorts, tableBody, () => actionHandlers(submissions, storage, (content, options) => openModal(modal, modalBody, modalTitle, closeBtn, content, options), closeModal, showToast, renderTable), showToast, () => closeFilterModal(filterModal, filterOverlay), () => closeSortModal(sortModal, sortOverlay), () => renderActiveTags(currentFilters, currentSorts, filterContainer, sortContainerElement));
    }, filterModal, filterOverlay));
    document.getElementById("resetFilterBtn")?.addEventListener("click", () => resetFilters(filtersContainer, currentFilters, () => {
        tableState = { filters: currentFilters, sorts: currentSorts };
        storage.saveTableState(tableState);
        saveStateToUrl(tableState);
        renderTable(submissions, currentFilters, currentSorts, tableBody, () => actionHandlers(submissions, storage, (content, options) => openModal(modal, modalBody, modalTitle, closeBtn, content, options), closeModal, showToast, renderTable), showToast, () => closeFilterModal(filterModal, filterOverlay), () => closeSortModal(sortModal, sortOverlay), () => renderActiveTags(currentFilters, currentSorts, filterContainer, sortContainerElement));
    }));
    document.getElementById("applySortBtn")?.addEventListener("click", () => submitSorts(sortContainer, currentSorts, () => {
        tableState = { filters: currentFilters, sorts: currentSorts };
        storage.saveTableState(tableState);
        saveStateToUrl(tableState);
        renderTable(submissions, currentFilters, currentSorts, tableBody, () => actionHandlers(submissions, storage, (content, options) => openModal(modal, modalBody, modalTitle, closeBtn, content, options), closeModal, showToast, renderTable), showToast, () => closeFilterModal(filterModal, filterOverlay), () => closeSortModal(sortModal, sortOverlay), () => renderActiveTags(currentFilters, currentSorts, filterContainer, sortContainerElement));
    }, sortModal, sortOverlay));
    document.getElementById("resetSortBtn")?.addEventListener("click", () => resetSorts(sortContainer, currentSorts, () => {
        tableState = { filters: currentFilters, sorts: currentSorts };
        storage.saveTableState(tableState);
        saveStateToUrl(tableState);
        renderTable(submissions, currentFilters, currentSorts, tableBody, () => actionHandlers(submissions, storage, (content, options) => openModal(modal, modalBody, modalTitle, closeBtn, content, options), closeModal, showToast, renderTable), showToast, () => closeFilterModal(filterModal, filterOverlay), () => closeSortModal(sortModal, sortOverlay), () => renderActiveTags(currentFilters, currentSorts, filterContainer, sortContainerElement));
    }));
    document.querySelectorAll(".close-filter-sort").forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".style-modal");
            if (!modal) return;
            modal.style.display = "none";
            if (modal.id === "filterModal" && filterOverlay) filterOverlay.style.display = "none";
            else if (modal.id === "sortModal" && sortOverlay) sortOverlay.style.display = "none";
        });
    });

    // Initial render
    renderTable(submissions, currentFilters, currentSorts, tableBody, () => actionHandlers(submissions, storage, (content, options) => openModal(modal, modalBody, modalTitle, closeBtn, content, options), closeModal, showToast, renderTable), showToast, () => closeFilterModal(filterModal, filterOverlay), () => closeSortModal(sortModal, sortOverlay), () => renderActiveTags(currentFilters, currentSorts, filterContainer, sortContainerElement));
});