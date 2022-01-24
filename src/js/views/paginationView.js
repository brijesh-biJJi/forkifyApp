import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    // Closest similar to querySelector meth. but instead for searching down in the tree, for children it basically search up in the tree, so it looks for parent
    //we cannot just search for e.target becoz button ele contains span & svg, so user may click on span or svg. so we need parent ele.
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, & there are other pages
    if (currPage === 1 && numOfPages > 1) {
      return `
            ${this._generateMarkupBtnNxt(currPage)}
        `;
    }

    // Last Page
    if (currPage === numOfPages && numOfPages > 1) {
      return `
            ${this._generateMarkupBtnPrev(currPage)}
        `;
    }

    // Other Page
    if (currPage < numOfPages) {
      return `
            ${this._generateMarkupBtnPrev(currPage)}
            ${this._generateMarkupBtnNxt(currPage)}
        `;
    }

    // Page 1, & there are No other pages
    return '';
  }

  _generateMarkupBtnPrev(currPage) {
    return `
            <button data-goto="${
              currPage - 1
            }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currPage - 1}</span>
            </button>
        `;
  }

  _generateMarkupBtnNxt(currPage) {
    return `
        <button data-goto="${
          currPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }
}

export default new PaginationView();
