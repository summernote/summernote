#### What does this PR do?

- Adds following toolbar

this feature, inspired by redactor.js, adds the ability for the toolbar to stay in the viewport while scrolling the page;



#### Where should the reviewer start?

- start on the src/js/base/module/Toolbar.js.
- a setting has been added in settings.js (for both bs3 and bs4) to enable this feature (see row 70 in settings.js); another setting called "otherStaticBarClass" allows the editor's toolbar to calculate properly the offset if the website that is using it already have a fixed top positioned navbar; it should contain that navbar's class name.
- slight changes have been made to the markup in src/js/bs3/ui.js and src/js/bs4/ui.js.

#### How should this be manually tested?

- A few paragraphs have been added to index.html after the editor in order to make possible to scroll the page; while scrolling the toolbar should stay visible until the bottom of the editor is in the viewport.
