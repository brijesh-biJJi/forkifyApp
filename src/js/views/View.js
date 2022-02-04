import icons from '../../img/icons.svg';
export default class View {
  _data;

  /**
   * Render the recieved Object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. Recipe)
   * @param {boolean} [render=true]  If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string}   A markup string is returned if render = false
   * @this {Object} View instance
   * @author AcmeKrsna
   * @todo Finish Implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // The only difference btw Render & Update method is, Update meth will only update texts and attributes in the DOM without having to re-render the entire view.

  /* Updating the DOM only in places where the text or the attributes actually changed */
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    // Once we update the data we then wants the views data to become that new data
    this._data = data;

    // We also want to generate new markup
    // We need entire markup so that we can then compare it to the old markup
    // So we create new markup but not render it, Instead all that we gona do is to generate this markup then compare new html to curr html, then only change text & attr that actually have changed from the old version to the new version
    const newMarkup = this._generateMarkup();

    // CreateContextualFragment method convert the string into real Dom Node Objects
    // Like Virtual Dom - Dom that is not really living on the page but which lives in our memory
    // And now we can use that Dom as if it is a real Dom on our pages

    const newDom = document.createRange().createContextualFragment(newMarkup);

    //New DOM Elements
    const newElements = Array.from(newDom.querySelectorAll('*'));

    //Current DOM Elements
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEle, i) => {
      const currEle = currElements[i];

      // Comparing New and Original DOM element/node
      // If its not equal then update
      // So instead of updating entire DOM Tree , we are updating only necessary part of it

      // Instead of replacing entire container, will replace if ele only contains text becoz thats the only thing we want to replace.

      /* Updates changed TEXT*/
      if (
        !newEle.isEqualNode(currEle) &&
        newEle.firstChild?.nodeValue.trim() !== ''
      ) {
        currEle.textContent = newEle.textContent;
      }

      // Whenever an ele chnges we also wanted to change the attr

      /* Updates changed ATTRIBUTES*/
      if (!newEle.isEqualNode(currEle))
        Array.from(newEle.attributes).forEach(attr =>
          currEle.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  //Display Error Message
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Display Success Message
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
