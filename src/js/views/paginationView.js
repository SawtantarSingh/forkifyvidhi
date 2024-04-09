import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    // console.log(numPages);
    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupHelper('next', curPage);
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupHelper('prev', curPage);
    }

    // Other page
    if (curPage < numPages) {
      return this._generateMarkupHelper('both', curPage);
    }

    // Page 1, and there are NO other pages
    return '';
  }
  _generateMarkupHelper(action, curPage) {
    const prevBtn = ` <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
  <span> Page ${curPage - 1} </span>
</button>
`;
    const nextBtn = ` <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${curPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>
`;

    // PAge jado last wa
    if (action === 'prev') {
      return prevBtn;
    }

    // page jado pehla wa
    if (action === 'next') {
      return nextBtn;
    }

    if (action === 'both') {
      return `${prevBtn} ${nextBtn}`;
    }
  }
}
export default new PaginationView();
