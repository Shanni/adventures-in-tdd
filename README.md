# Adventures in Test-Driven Development (TDD)

This repository contains the supporting materials and hands-on material for going through the "Adventures in Test-Driven Development" presentation.

* [Midwest JS 2015 video](https://youtu.be/qZ2Nas4HFwA).
* [Slide deck](https://docs.google.com/presentation/d/1fe888lMobdAMi_D-ziMGOhbbvxv_XbXQ3XJ4eEoq078/edit?usp=sharing)

NOTE: There are some variations between the contents of this repository and the code presented at the Midwest JS recording.
Since the code was develop in a TDD fashion, and the presentation is about the process, the results can vary each time a feature is built using TDD.

## Getting Started

* Checkout this repository
* run `npm install -g karma-cli`
* run `npm install`
* run `git checkout tdd-start`

## Working Through the Tutorial

The following sections walk through building a blind component panel.
A blind component reveals or hides content through clicking on the title bar of the blind, much like [this example](http://bootsnipp.com/snippets/featured/collapsible-panel).
If you want to see my finished implementation, you can check out the `tdd-finished` tag.

## Adding The First Tests

Type `karma start`. If everything is installed correctly, you should see something like this:

![No tests](/karma-console.png?raw=true "No tests")

We don't have any tests yet, so this message makes perfect sense. Let's add some tests. Before we add the tests, let's think about how we want the blind component to function.
It would be nice if we could take a DOM node out of the HTML like this:

```html
<div title="This is a title">
  This is the content
</div>
```

And then simply call `blind(element)` on the DOM node to create the blind.
Let's consider the sample HTML element, plus the function call, to be our interface.
You can also look at `index.html` in the repository to see an example of several blinds that will function once our implementation is completed.

Now that we have an idea of how it should work, let's think about what tests should be in punch list.
A punch list is a collection of tests that we need to complete in order to consider our feature complete.
In considering the feature, here are the first tests that I am going to start with:

1. it should have blind defined.
2. it should accept an element.
3. it should create a blind container.
4. it should open the blind when the title is clicked.

Let's put these into a test file. Create the file `src/blind.spec.js`, and put the following code into the test:

```js
describe('A blind component', function() {

  it('should have blind defined');

  it('should accept an element');

  it('should create a blind container');

  it('should open the blind when the title is clicked');

});
```

Karma will detect that we created a file containing tests, and execute the tests.
Of course, there is still an error, as Karma will report that all four tests were skipped.
This is because we have not added a test function to any of the four tests.
I use the list of skipped tests as an indicator of how many tests I have left to complete and implement in order to finish the feature.

## Defining the Component

So, we have a list of skipped tests, and no feature yet.
Let's pick a test to work on.
The simplest one to me is the first test: testing that `blind` is defined.
The following code should verify this behavior:

```js
it('should have blind defined', function() {
  expect(window.blind).toBeDefined();
});
```

Karma detects the file change on save, and reports we have an error. Success! We have a single goal: make the test pass.
While there are several ways to make it pass, creating `src/blind.js` and adding the following code to it should be sufficient:

```js
window.blind = function() {};
```

The test now passes. You may think that this test was too simple, and you may be right; but, taking simple steps will help us safely build a reliable, well-tested implementation.

## Accepting an Element

Another simple test to implement now would be that the function accepts an Element. Complete the test body as follows:

```js
it('should require an element parameter', function() {
  var element = document.createElement('div');
  expect(window.blind.bind(null, element)).not.toThrowError();
  expect(window.blind).toThrowError('an element is required');
});
```

The `.toThrowError()` matcher expects to evaluate a function reference, rather than a function call, so we use `.bind` to specify the function
argument for the first test. Passing this test is a little more work than the first, but not bad:

```js
window.blind = function(element) {
  if(!(element instanceof Element)) {
    throw new TypeError('an element is required');
  }
};
```

With another simple test completed, let's move on.

## Creating the container

Let's move on to the next test: "it should create the container".
In our initial test list, we determined that we will probably need a container to hold the blind component.
What should the container look like?

For this implementation, I determine that I will use [BEM](https://en.bem.info/method/naming-convention/), or Block-Element-Modifier notation, to define the markup for the component.
This way, I can easily identify the pieces of the component, and the various states of the component (open and closed) simply become classes on an element.
Using BEM, I decide that my container should be an element with the class "blind" on it.

Before we test that a call to blind() returns the component (element with class "blind" on it), we should probably test that it returns an element.
This requires adding another test to `blind.spec.js`, along with test's expectation:

```js
it('should return an element', function() {
  var srcElement = document.createElement('div');
  expect(window.blind(srcElement) instanceof Element).toBeTruthy();
});
```

And, of course, we get a failure. Let's add the minimum amount of code to `blind.js` to get this test to pass:

```js
window.blind = function(element) {
  if(!(element instanceof Element)) {
    throw new TypeError('an element is required');
  }
  return document.createElement('div'); // add this line
};
```

By simply returning an element, we pass the test.

Now, let's add the expectation about being a blind container to the container test:

```js
it('should create a blind container', function() {
  var srcElement = document.createElement('div');
  expect(window.blind(srcElement).classList).toContain('blind');
});
```

The correct test fails with the error we expect, as the element returned has no classes on it. Let's add the class to the return element:

```js
window.blind = function (element) {
  if(!(element instanceof Element)) {
    throw new TypeError('an element is required');
  }

  var blindContainer = document.createElement('div');
  blindContainer.classList.add('blind');
  return blindContainer;
};
```

And, the tests all pass again. Note so far that:

* Each test that we perform should represent a small step towards the finished product.
* The tests should be executed frequently.
* The changes that are required in the source code to make a test pass should be relatively small.

## A Minor Refactor

We introduced a little bit of duplication in the last test. Both tests create a `srcElement`, and execute `window.blind()` with that
element. Let's refactor out the duplication now. Refactoring can be done on tests as well as source code.

To do this, we're going to surround all of our tests, except for "should have blind defined" and "should require an element parameter",
with a `describe()` function. This will allow us to create a `beforeEach()` function that will create the element and call the function
for every test within the `describe()` block.

The tests should look something like this now:

```js
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
      blindElement = window.blind(srcElement);
    });

    it('should return an element', function () {
      expect(blindElement instanceof Element).toBeTruthy();
    });

    it('should create a blind container', function () {
      expect(blindElement.classList).toContain('blind');
    });

    // ... other tests ...
  });
});

```

## Title and Content Containers

Currently, there is only one test left to implement: "it should open the blind when the title is clicked".
Making this test pass right now seems like a large step, because:

* We don't have a title in our container, so we have nothing to click.
* We don't have any content to show or hide yet.
* Our implementation currently doesn't accept any element to extract a title or content from.

It sounds like we have some smaller steps to take care of before addressing the title click test.
Let's add the following four tests to our spec file:

```js
it('should create a title container');

it('should use the title attribute for the content of the title container');

it('should create a content container');

it('should put the content inside of the content container');
```

Wow! Four more tests?!? Yes, but they should all be pretty easy to implement, and they will help us to get the component done.
Let's do the title container and content containers next. They seem easy enough:

```js
it('should create a title container', function() {
  expect(blindElement.querySelector(':first-child').classList).toContain('blind__title');
});
```

The test will succeed if the first child node under our blind container is the title block element.
That is, the markup should look something like this:

```html
<div class="blind">
  <div class="blind__title">Title</div>
</div>
```

This code should make the test pass:

```js
  // added after blindContainer is created
  var blindTitle = document.createElement('div');
  blindTitle.classList.add('blind__title');
  blindContainer.appendChild(blindTitle);
```

Now, let's add the content container. This is basically the same as the last test and implementation, except that the content container should be the second child element:

```js
// in blind.spec.js:
it('should create a content container', function () {
  expect(blindElement.querySelector(':nth-child(2)').classList).toContain('blind__content');
});

// in blind.js
var blindContent = document.createElement('div');
blindContent.classList.add('blind__content');
blindContainer.appendChild(blindContent);
```

One thing that I want to point out is that your code coverage data (presented with the test results) is always very high.
TDD results in code that has high code coverage, because you add no code to a feature without first adding a test. Slick!

## Title Content

Now, let's tackle the title content test: "it should use the title attribute for the content of the title container":

```js
it('should use the title attribute for the content of the title container', function() {
  var titleElement = blindElement.querySelector('.blind__title');
  expect(titleElement.textContent).toBe('I am the title');
});
```

We should also add a title attribute to our test element so that it has a title attribute to get data from:

```js
// in beforeEach() function:
beforeEach(function() {
  var srcElement = document.createElement('div');
  srcElement.setAttribute('title', 'I am the title'); // Add this line!
  blindElement = window.blind(srcElement);
});
```

Now, let's make the test pass:

```js
window.blind = function (element) {

// ...
var blindTitle = document.createElement('div');
blindTitle.classList.add('blind__title');
blindTitle.textContent = element.getAttribute('title'); // add this line
blindContainer.appendChild(blindTitle);
```

## Adding the Content Element

The content element test should be similar to the last test: "it should put the content inside of the content container".
Let's create the test first:

```js
it('should put the content inside of the content container', function() {
  expect(blindElement.querySelector('.blind__content > *')).toBe(srcElement);
});
```

Remember, `srcElement` is the original source element that we created in the `beforeEach()` block.
The test passes if that source element is the child node of our blind content container. Let's make it pass:

```js
  // ... create the blindContent element

  blindContent.appendChild(element); // add this line

  return blindContainer;
}
```

## Opening and closing the blinds

Finally, one more test left on the list. Of course, it won't stay that way for very long.
In order to test opening the panel on click, we should probably verify that it's closed initially.

Let's add the following test:

```js
it('should start closed', function() {
  expect(blindElement.querySelector('.blind__content').classList).toContain('blind__content--closed');
});
```

Using BEM, we determine that the content panel will have a class of "blind__content--closed" on it when it's closed.
Now, let's make it pass:

```js
  var blindContent = document.createElement('div');
  blindContent.classList.add('blind__content');
  blindContent.classList.add('blind__content--closed'); // add this line!
  blindContainer.appendChild(blindContent);
```

Back to the opening test. Let's set up the test:

```js
it('should open the blind when the title is clicked', function() {
  blindElement.querySelector('.blind__title').click();

  expect(blindElement.querySelector('.blind__content').classList).toContain('blind__content--open');
  expect(blindElement.querySelector('.blind__content').classList).not.toContain('blind__content--closed');
});
```

When the title is clicked, the content panel should switch classes from closed to open. Let's make this pass:

```js
// ...

// add this handler
blindTitle.addEventListener('click', function() {
  blindContent.classList.remove('blind__content--closed');
  blindContent.classList.add('blind__content--open');
});

return blindContainer;
```

The test passes again!

## Closing the Panel Again

While all of our tests pass, I have a feeling that we missed something. When the title is clicked again after opening the panel,
it should close. Let's write a test to make sure it works:

```js
it('should close the clind when the title is clicked twice', function () {
  blindElement.querySelector('.blind__title').click();
  blindElement.querySelector('.blind__title').click();

  expect(blindElement.querySelector('.blind__content').classList).toContain('blind__content--closed');
  expect(blindElement.querySelector('.blind__content').classList).not.toContain('blind__content--open');
});
```

And, we're broken. It's because we wrote the event handler to only work for changing the state to open. Let's fix that using the `classList.toggle()` function:

```js
blindTitle.addEventListener('click', function() {
  blindContent.classList.toggle('blind__content--closed'); // toggle FTW!
  blindContent.classList.toggle('blind__content--open');
});
```

And we're passing again!

## Seeing the Result in Action!

`index.html` has some sample content for creating blinds, as well as a stylesheet and the code to convert the content into blinds using your newly tested and implemented function.
Give it a try by opening `index.html` in your browser.

## Extra Credit

Do you want to take this further? Here are some additional items that you can try to test-drive and implement:

1. The current implementation assumes that a blind should start closed. Change the function so that you can add a `data-blind-open` attribute to the element. When it's true, it starts open; otherwise, it starts closed (default).
2. Oftentimes, people group blinds into an accordian group, where exactly one blind is open at any time. Try to modify your solution (or create a variation) that implements an accordian group.

Good luck and good testing!
