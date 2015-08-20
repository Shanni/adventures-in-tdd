describe('A blind component', function () {

  it('should have blind defined', function () {
    expect(window.blind).toBeDefined();
  });

  it('should require an element parameter', function () {
    expect(window.blind.bind(null, document.createElement('div'))).not.toThrowError();
    expect(window.blind).toThrowError('an element is required');
  });

  describe('A default container', function () {

    var blindElement, srcElement;
    beforeEach(function() {
      srcElement = document.createElement('div');
      srcElement.setAttribute('title', 'I am the title');
      blindElement = window.blind(srcElement);
    });

    it('should return an element', function () {
      expect(blindElement instanceof Element).toBeTruthy();
    });

    it('should create a blind container', function () {
      expect(blindElement.classList).toContain('blind');
    });

    it('should create a title container', function () {
      expect(blindElement.querySelector(':first-child').classList).toContain('blind__title');
    });

    it('should use the title attribute for the content of the title container', function () {
      var titleElement = blindElement.querySelector('.blind__title');
      expect(titleElement.textContent).toBe('I am the title');
    });

    it('should create a content container', function () {
      expect(blindElement.querySelector(':nth-child(2)').classList).toContain('blind__content');
    });

    it('should put the content inside of the content container', function() {
      expect(blindElement.querySelector('.blind__content > *')).toBe(srcElement);
    });

    it('should start closed', function() {
      expect(blindElement.querySelector('.blind__content').classList).toContain('blind__content--closed');
    });

    it('should open the blind when the title is clicked', function() {
      blindElement.querySelector('.blind__title').click();

      expect(blindElement.querySelector('.blind__content').classList).toContain('blind__content--open');
      expect(blindElement.querySelector('.blind__content').classList).not.toContain('blind__content--closed');
    });

    it('should close the clind when the title is clicked twice', function () {
      blindElement.querySelector('.blind__title').click();
      blindElement.querySelector('.blind__title').click();

      expect(blindElement.querySelector('.blind__content').classList).toContain('blind__content--closed');
      expect(blindElement.querySelector('.blind__content').classList).not.toContain('blind__content--open');
    });
  });
});
