window.blind = function (element) {
  if(!(element instanceof Element)) {
    throw new TypeError('an element is required');
  }
  var blindContainer = document.createElement('div');
  blindContainer.classList.add('blind');

  var blindTitle = document.createElement('div');
  blindTitle.classList.add('blind__title');
  blindTitle.textContent = element.getAttribute('title');
  blindContainer.appendChild(blindTitle);

  var blindContent = document.createElement('div');
  blindContent.classList.add('blind__content');
  blindContent.classList.add('blind__content--closed');
  blindContainer.appendChild(blindContent);

  blindContent.appendChild(element);

  blindTitle.addEventListener('click', function() {
    blindContent.classList.toggle('blind__content--closed');
    blindContent.classList.toggle('blind__content--open');
  });

  return blindContainer;
};
