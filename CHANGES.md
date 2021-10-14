# v0.8.20
---------

This is a hotfix for fixing path problem on css files.


# v0.8.19
---------

## New feature
- #4091: Add Bootstrap 5 style (@simialbi)

## Improvement
- #4008: Add support for Peertube hosted video (@mxc)
- #4034: Support jQuery 3.5+ (@nbolender)

## Bug Fix
- #4041: Fix nextSibling and update all content (@faithgvn)
- #4090: Show table popover with multiline content in cell (@Dheerajkawatra)

## Translation
- #4082: Fixe the language key in summernote-de-CH.js (@adil-jaafar)

## Misc
- #4048: Insert a table on mouseup (@kylepwarren)
- #4155: Clean up files and update directory layout (@lqez)
- 57e16a8: Remove unused env variables (@lqez)
- 578f353: Bump jQuery to 3.6.0
- 9f78a30: Fix Webpack configuration for newer version
- c063870: Add a short delay before running the first test to prevent irrelevant errors (@lqez)


# v0.8.18
---------

- Update dist files for v0.8.17


# v0.8.17
---------

## New feature
- #3664: Allow CodeMirror to accept programmatic changes (@pryanlo)

## Improvement
- #3615: Support to use mobile youtube link (@matsu4ki)
- #3625: Support external CodeMirror constructor (@easylogic)
- #3629: Add Lite Styling for Tabbed Panes for Modal Content (@DiemenDesign)
- #3632: Replace 'inherit' value with 'transparent' (@DiemenDesign)
- #3653: Add an option for enabling autolink behavior shows only domain names  (@lqez)
- #3677: Use scss for summernote icons (@NicolasRoehm)
- #3694: Fix styles for (dark) themes (@lqez)
- #3698: Add ability to allow plugins to not have buttons disable when in codeview (@DiemenDesign)
- #3708: Update qq video url pattern (@lostship)

## Bug Fix
- #3609: Hide air popover in code view (@roseline124)
- #3614: Remove Duplicate \<output\> in BS4 ui.js (@DiemenDesign)
- #3649: Fix bs4 note-btn on popover (@SebouChu)
- #3661: Adding control to identify text blocks inside block and apply style (@reinaldocoelho)
- #3681: Fix broken layout while testing color buttons (@lqez)
- #3706: Fix pasteHTML issue (@lqez)
- #3709, #3720, #3725: Fix for jQuery 3.5 (@easylogic, @JyoshnaKothapally, @lqez)
- #3635: Update to font selection error (@reinaldocoelho)
- #3726: Fix font styling by creating a new range with given spans (@lqez)
- c11943634fb7f0e8647b4853222f9b86426c40f2:  Fix fontsize range (@easylogic)

## Translation
- #3655: Add missing translations and correct one for Norwegian Bokmål (@hareland)
- #3723: Updates to Greek language (@JoshBour)

## Misc
- #3636: Include steps to run debug with VSCode (@reinaldocoelho)
- #3670: Fix simple typo, toogle -> toggle (@timgates42)
- #3679: Use same pipeline while debugging with test:debug script (@lqez)
- #3680: Update packages (@lqez)
- #3703: Migrate to yarn (@lqez)
- f5113a5b9e7f8fe11032e460a3c352525720f3fb: Remove npm-check-updates which was added by mistake (@lqez)


# v0.8.16
---------

## New feature
- #3552: Allow airpopover on contextmenu (@lqez)

## Improvement
- #3546: Support keydown event to record undo history (@easylogic)
- #3556: Add babel preset for ecma2015+ (@easylogic)
- #3562: Remove TypeScript plugins and add Babel settings (@lqez)
- #3563: Add an option for limiting history stack (@lqez)
- #3602: Replace deprecated styleWithSpan with styleWithCSS (@lqez)
- 3e417eebbd3ab744a1258a069e7ce13658d934e1: Remove XSS vulnerability of LinkPopover (@lqez)
  - Reported with a solution by Antoine Prieëls(@aprieels), much appreciated.

## Bug Fix
- #3583: Correct following/fixed toolbar height (@ikeblaster)
- #3597: Fixed air popover position when it is scrolling (@easylogic)
- 1f0f2622b528cc69fab42c6f9ce7820af1de9bf3: Fix paste event for IE (@lqez)
- d6fb8552edc1cc39d82a814b375a303df94fcbed: Fix color picker issue on Bootstrap3 and Lite (@lqez)
- e4f2c89c89b430005393143a8abb3091a11d396e: Fix button handling in color palette (@lqez)

## Translation
- #3587: Update Spanish translation (@quique)
- #3596: add summernote-az-AZ.js (@ramilaliyev007)

## Misc
- #3564: Apply recommended rule of ESLint (@lqez)
- #3567: Add mode-switcher example (@easylogic)
- #3568: Remove load-grunt-tasks in package.json (@easylogic)
- 7767a2bc5e6e9c423b2020bc2ab56d3764b24ac9: Fix palette button styles (@lqez)


# v0.8.15
---------

This is a hotfix release.

## Bug fix
- #3542: Fix ui container (@lqez)
- #3543: Fix container and popover position issues  (@lqez)
- #3545: Fix production version of webpack.externals issue (@lqez)


# v0.8.14
---------

## New feature
- #2070: Allow hint multiple words (@JoniJnm)
- #3310: Add `addDefaultFonts` to add default fonts (@michael-volynets)
- #3319: Add `inheritPlaceholder` option (@lqez)
- #3361: Add checkbox to use protocol (@roseline124)
- #3426: Add disable TAB/Shift+TAB option (@DiemenDesign)
- #3426: Add disableGrammar option (@DiemenDesign)
- #3436: Add option to change toolbar position (@DiemenDesign)
- #3510: Add setting to change font size unit (@jadomag)

## Improvement
- #2708: Calculate image selection to cover other layouts and content formats (@nmandrescu)
- #3255: Fix omitted styles and match lines between less and scss (@lqez)
- #3265: Remove fixed z-index of Toolbar from styles (@lqez)
- #3322: Remove duplicated codes and fix lite styles (@lqez)
- #3353: Rename foreground to text (@roseline124)
- #3356: Add karma-detect-browsers (@lqez)
- #3377: Apply composition-text canceling on maxTextLength option (@anpaul0615)
- #3380: Improve behaviours with maxTextLength option (@anpaul0615)
- #3433: Adjust removeMedia to remove wrapping Figure and FigCaption elements (@DiemenDesign)
- #3439: Add ability to use Codeview in airMode (@DiemenDesign)
- #3530: Improve airmode focusout (@andrews05)
- #3531: Fix tooltips, popovers and dialogs of lite theme and others (@lqez)

## Bug Fix
- #3119:  Item selected overwrite the node beginning text (@jokamax)
- #3177: Do not add quotes to the generic font families (@tenbits)
- #3251: Fix missing required parameter "event" (@daumling)
- #3256: Remove the asterisk selector from Lite U (@lqez)
- #3269: Generic fonts were not rendered correctly in fontname dropdown (@lqez)
- #3284: Modified custom button to work (@jangjichang)
- #3285: Add `lists` in settings.js (@amorfati0310)
- #3299: Fix contains method to use .contains for DOMTokenList (@Dakkers)
- #3316: Add Safari to airmode focusout workaround (@andrews05)
- #3324: Fix dropzone issues (@lqez)
- #3327: Fix drop-Event in Firefox contains two moz-specific Datatransfer-Type issue (@stefl0n)
- #3354: Change inequality when maxTextLenth is compared (@roseline124)
- #3357: Resolve issue which maxTextLenght not working on paste (@PyBack)
- #3363: Resolve omitted missing jquery import (@anpaul0615)
- #3386: Remove duplicate tooltip on color palette for lite theme (@anotherlizwong)
- #3416: Bug fix for custom color issue and add image exception issue. (@reysu47)
- #3425: Don't disable Full Screen toggle when activating Code View (@kamikkels)
- #3428: Fix AutoLink to resolve tel: protocol and remove protocol for text (@DiemenDesign)
- #3457: Fix Toolbar Problems after reload (@constmoon)
- #3459: Fix cliboard paste image two times bug (@roseline124)
- #3490: Fix wrong last range (@easylogic)
- #3492: Dropzone should be target for pointer events (@jboysen)
- #3498: Fix not to use p-br tag (@easylogic)
- #3503: Fix popover behavior when summernote has focus (@jadomag)
- #3522: Fix wrong focus in .node-editable (@easylogic)
- #3523: Fix key binding for shortcut (@easylogic)

## Translation
- #3402: Update summernote-fa-IR.js (@alizamani1616)
- #3497: Update arabic translation (@lion4h)

## Misc
- #3264: Rename and fix wrong attributes (@lqez)
- #3266: Match styles (@lqez)
- #3279: Remove less and extract creating font as separated command (@lqez)
- #3455: Update font size test (@FKgk)
- #3471: Fixed documentation typos (@hastadhana)
- 8ad17636df160392d95df3bee565196c7ea9655c: Simplify deepestChildIsEmpty function (@lqez)
- be4b28e2a07c02a68c06950988fd644b0f19c059: Enhance testing with mocha's done feature (@lqz)


# v0.8.12
---------

## New feature
- #3048, #3171: Add `CodeView` filtering and whitelist for embedding (@blood72, @lqez)
- #3042: Add default color options for color buttons (@lqez)
- #3083: Add new callback for capturing changes on `CodeView` (@lqez)

## Improvement
- #3045: Show valid link URLs only in `LinkDialog` (@adeelhussain)
- #3065: Hide tooltips when buttons are clicked (@lqez)
- #3076: Update image popover with new icons (@lqez)
- #3087: Allow Facebook video URLs (@lqez)
- #3215: Less jQuery dependencies (@benjamingraf)
- 6c65ade1351e421b24c86e6197e50033e7cb9fdd: Do not add default protocol to relative links (@lqez)
- e8e4212c6ec106fa59025cd8ead100bce298dc6c: Enhance check method for font existence by using canvas (@lqez)

## Bug Fix
- #3054: Update last focus manager (@easylogic)
- #3063: Fix multiple issues on Lite UI (@lqez)
- #3068: Fix `insertImagesOrCallback` for drag-and-drop images (@lqez)
- #3078: Fix multiple toolbar issues (jross-tm, @lqez)
- #3082: Fix callbacks to use proper arguments (@lqez)
- #3096: Incorrect usage of event global variable in Handle and ImagePopover on FireFox (Rudy Zeinoun)
- #3113: Fix `setEnd` on `Range` (@gioboa)
- #3168: Fix disabled image button while pasting an image URL (@lqez)
- #3217: Removed automatic requirement of CodeMirror (@benjamingraf)
- 10bb48dc24a12724421dcb343ed8b26fb4b94cc4: Fix duplicated image bug on Internet Explorer (@hackerwins)
- 7b2a514f5d53edeffcb8c67cde30eb59381d7f75: Fix indent/outdent crashing (@lqez)
- 5785431b46d661e0eb2f65a87215b3148504bda3: Fix undo error from malformed range (@lqez)


## Translation
- #2959: Update for fr-FR (@jokamax)
- #3148: Update for ja-JP (@rw-nue)
- #3167: Update for ko-KR (@neatnet)
- #3208: Update for de-DE (@frobinsonj)
- #3210: Update for cs-CZ (@frobinsonj)


## Misc
- #3055: Allow trailing commas for multiline (@lqez)
- #3060: Add `<audio>` to void elements (@hendrismit)
- #3064: Merge into single settings for multiple UIs (@lqez)
- #3074: Add option for toggling browser default spellchecker (@lqez)
- #3143, #3193: Fix Travis CI build (@hackerwins)
- 5f674eb19c108f5afd656c899cf7eec83fb21fab: Turn off `--fix` for eslint (@lqez)
- 6f7593b9b2572719e371e4a485798c6c94feab59: Add empty `fontNameIgnoreCheck` in settings (@lqez)
- ff516c9beac5909cf8df6aa924a153c6a605c40d: Update ImageDIalog for Bootstrap4 (@lqez)
- ad0d7e07213aafa80c3925451ededb9c6509ccca: Remove default focusing style effect of browsers (@lqez)
- 789dfdaa49b2eda9bfcd6c0dbd6241d0fc078d23: Set `followingToolbar` as false by default (@lqez)
- 8b9180ae74d31d5673f71eb79a77b11a84a7ebd5: Find the exact element has given tagName before applying custom class (@lqez)
- 6e18c0ebbfdb939e92115d8091ec8119ba8a065c: Extract saucelabs from Gruntfile (@hackerwins)


# v0.8.11
---------

## Improvement and bug fix
 - Implemented commit command (resets history but keeps editor content).
 - Add color picker support
 - Add start parameter for YouTube embedding
 - Add OnImageLinkInsert callback for handling inserted urls
 - Make the "range" object available for external modules.
 - When creating a link Summernote now checks maxTextLength
 - Add uglify for summernote-lite
 - Do not add default scheme for relative URLs
 - Update custom color selection logic
 - Move test file into the right location
 - Clean up test codes
 - Add styles for custom color selection
 - Add forecolor and backcolor buttons
 - Apply latest style changes into another
 - Do not wrap bs4 toolbar to prevent text flooding over toolbar UI
 - Do not wrap bs3 toolbar to prevent loosing the background shading
 - Add an example for placeholder text
 - Add an example for custom styletags
 - Drop debounce rate from 100ms to 10ms
 - Remove wrong executable attributes
 - Use default Bootstrap 4 checkbox style, not custom-control
 - Make AutoLink module follows linkTargetBlank option
 - Use class instead of id for "open in new window" checkbox to avoid du… …
 - Add randomized id to link dialog checkbox
 - Move random id generation to Context
 - Revert the randomization changes
 - Prevent error by settings the default container
 - Less clutter by moving templates into .github
 - Allow html tags on placeholder
 - Allow protocol-less URL for YouTube video insertion
 - Make full screen mode properly even with maxHeight option
 - Add an example for Lite + Legacy Bootstrap
 - Add video and embed tag into the void element list
 - Fixed #1410 using a configurable blockquote breaking level.
 - FIX click on HintPopover suggestions doesnt insert
 - Fix issue #1964 with copy paste content in reverse order
 - Fix wrong argument result due to the use of incorrect function type
 - Fix link autodetection  …
 - Fix dropdown toggle issue on lite while using with Bootstrap
 - Fix wrong lite style
 - Fix wrong bs4 checkbox
 - Fix expectContents to work with given context
 - Fix tests - to expect valid markup.
 - Fixed indentation of list items  …
 - Fixed outdent of nested list items.  …
 - Fix conflict by merging #1574
 - Fix indentation on checkbox creations
 - Fix Bootstrap4 background transparency issue #3024
 - Fix blocking form submitting issue #530
 - Fix minor things
 - Fix order of Airmode elements
 - Fix broken examples and update to use latest libraries
 - Fix class name for AirMode in lite.js

## Translation
 - Improved translation in pt-PT for image, table, style and help sections
 - Improved translation in pt-BR for image section
 - Added missing new line at the end of file lang/summernote-pt-PT.js
 - pl-PL i18n update
 - Update summernote-nl-NL.js
 - Update summernote-pt-BR.js
 - Add missing translations in zh-CN for table, etc
 - Update summernote-de-DE.js  …
 - Fix pt-BR and gl-ES lang keys for style.p translations
 - Update summernote-th-TH.js
 - Missing translations with tabel (#3031)  …
 - Update Finnish translation


# v0.8.10
---------

## Compatibility
 - Update Bootstrap version to 4.0.0

## Improvement
 - Hide icon bar when resize is disabled

## Translation
 - Create summernote-uz-UZ.js
 - More german translations
 - Use localized tooltip on buttons like style.h1
 - Update polish (pl-PL) translation for subscript and superscript


# v0.8.9
--------

## Enhancement
 - Support standalone ui with summernote-lite. summernote-lite is beta. #2434
 - Following toolbar #2459
 - Add custom style for style dropdown #2474
 - Make the toolbar simpler again #2578

## Bugfix
 - Fix issue when drag-and-drop disabled #2468
 - Fix margin and padding of paragraph styles in the dropdown menu #2473
 - Fix warnings and errors from Bootlint checks #2472
 - Rollback default behavior of tab/untab by condition #2466
 - Wrong usage of self #2475
 - Allow user set the container of tooltip and container instead of default 'body' #2476
 - Multiple Hint - second hint has no default selected element #2564
 - Fix change event on input not firing in EDGE #2583
 - Add default fonts and a fix for styling #2584
 - Do not trigger focus events on mobile #2585
 - Changes to removeMedia in module/Editor.js to remove Figure Elements... #2588
 - Do not remove statusbar by reset #2592
 - Some Japanese labels improved. #2607


# v0.8.8
--------

## enhancement
 - support bootstrap 4 beta with `dist/summernote-bs4.js`, `dist/summernote-bs4.css`
 - you can use summernote on bootstrap 3 with `dist/summernote.js`, `dist/summernote.css`

supporting bootstrap 4 is beta.

## bugfix
 - fixed toolbar position in fullscreen mode #1762
 - add font `*.less` file #1763
 - Corrects the foreground color font tag behavior to compatible HTML5 (inline styling) #1715
 - Fix issue #2428
 - Fix issue #2443
 - Fix issue #2439

## translation
 - Better translation for p tag in german #2421
 - Change some french traductions for headers and hr #2423


# v0.8.7
--------

## translation
 - Fix missing french traduction on table #2404

## bug fix
 - Add image margin when floats #1827
 - fixed a bug that delete key cannot trigger recordUndo action #2380
 - Deselect image when scrolling on the handle overlay #2386
 - Image popover is not displayed properly issue still exists #2381
 - Fixed tooltip shown at color picking dialog even when tooltip:false option set #2408
 - Image resize handle still show after changing to code mode. #2407

## misc
 - bump up jquery version 2.1.4 to 3.2.1


# v0.8.6
--------
## enhancement
 - table editing popover #2366, #1948
 - videoDialog support v.qq.com #2048

## bug fix
 - fixed a bug that image editing with handle is still working after disabling editor. #2075
 - add to void element. #2373


# v0.8.5
--------

## bug fix
 - Better regex to match legit shorter vimeo video ids (ex.: https://vimeo.com/2) #2281
 - fix InvalidCharacterError when pasting an image in Firefox #2284
 - LinkDialog and some checkbox library mixed, checkbox state is not visible #2323
 - fix for https://github.com/summernote/angular-summernote/issues/162 #2160

## enhancement
 - Add support to custom styletags right into the style toolbar menu #1919
 - Math Functions And Science Characters hint avaiable.(=) #2178
 - Feature | Added target blank option #2195
 - Tooltip can be shown/hidden by settings #1917

## translation
 - (locale fr-FR) Add specialChar #2324


# v0.8.3
--------

## maintenance
 - update dependency libraries and recover CI
 - #2248, #2216, #2249

## bug fix
 - onCreateLink #2180

## enhancement
 - onDestory handler #2185

## translation
 - #2173, #2197 #2217, #2218, #2228


# v0.8.2
--------

## Bug fix
 - Fixed several bugs.
 - For more details... v0.8.2 issues: https://github.com/summernote/summernote/pull/1976


# v0.8.1
--------

## Bug fix
 - Added fonts on meteor package.


# v0.8.0
--------

## Task
 - Replace fontawesome with summernote icon

## Bug fix
 - Fixed several bugs

UPDATE: 2016-02-10
 - Added font in a compressed file.


# v0.7.3
--------

## Enhancement
 - empty API for cleaning contents: #1605
 - Allow dialog fade via dialogsFade option: #1597

## Bug fix
 - Fixed several bugs.


# v0.7.2
--------

## Enhancement
 - toolbar container option: #1543
 - use the `<kbd>` for keyboard shortcut in help dialog.
 - support toolbar container #1543
 - create individual buttons for justify, indent, outdent. #1578

Bug fix
 - Fixed several bugs.


# v0.7.1
--------

## Main task
 - Use karma for tests instead qunit: #1289

## Enhancement
 - Reset API: #1493
 - insertImage API: #1494
 - disable or enable editor API: #1470

## Bug fix
 - Fixed several bugs.


# v0.7.0
--------

## Main task
 - Reassemble with module system.

## Enhancement
 - Placeholder
 - Autolink
 - Hint(autocomplete)

## Bug fix
 - Fixed several bugs. 


# v0.6.16
---------

## hotfix
 - Fixed #1265, script error on airMode. regression with #1256.


# v0.6.15
---------

Missing dist files at v0.6.14.


# v0.6.14
---------

## Bug fix
 - #331, #928, #933, #963, #1185, #1248, #1257.

## Features
 - disableResizeImage option
 - textarea auto sync on change


# v0.6.13
---------

## Hotfix
 - fix a bug that fullscreen not working.


# v0.6.12
---------

## Hotfix
 - fix a bug that codeview not working without codemirror.


# v0.6.11
---------

## Task and enhancement.
 - Use bootstrap panel as editor body for bootstrap theme style and remove bootstrap 2 styles.
 - Test full features on IE11.

## Bug fix
 - #45, #1107, #1205 and clipboard bugs fixed.


# v0.6.10
---------

## Plugin
 - #1195 refactoring hint plugin

## Enhancement
 - #1169 Renderer.js add tplDropdown() helper
 - #1179 apply modal dialogs into document.body

## Bug fix
 - #1192 fixed createLink api , set default options and range value
 - #1197 fixed paste bug in IE and FF
 - #1172 fixed Changing font-size using the font style plugin does not update selected option in menu
 - #1196 fixed script error on creating bullet with multiple lines on firefox.


# v0.6.9
--------

 - Missing dist files at previous version.


# v0.6.8
--------

 - Update external library on development
 - Merged: #1090, #1097, #1106, #1121, #1091, #1137, #1143, #1152, #1132, #1154, #1128, #1160
 - Fixed: #1111, #1140, #1175


# v0.6.7
--------

 - Add summernote-ext-hint.js plugin.
 - Add Portuguese(Portugal) Translation by @pHAlkaline
 - Fix bugs : #1021, #1050, #1051, #1052, #1053, #1056, #1057, #1058, #1067.



# v0.6.6
--------

Hotfix for v0.6.5's critical bugs.
 - Fixed custom event bugs. #1041, #1021, #977, #758, #1045
 - Fixed enter bugs with rollback #1038(related with #1045).



# v0.6.5
--------

 - Support more range API: `range.pasteHTML`, `range.getWordRange`
 - Merge `summernote-ext-fontstyle.js` plugin with base code
 - Bugfix : #1003, #1026, #1038, some of #1012


# v0.6.4
--------

 - Fixed option bug(about #1009 and #1008).

# v0.6.3
--------

 - Support External API access
 - Support callbacks with jquery custom event.


# v0.6.2
--------

 - Fixed drag and drop text bugs.


# v0.6.1
--------

 - Fixed bugs about links, bullets and ranges.


# v0.6.0
--------

 - Simple plugin system.
 - Extract fontstyle and video plugins from base code.


# v0.5.10
---------

 - Image editing
  - Image shape: rounded, circle, thumbnail, none
  - resize images to %, #99, #262
 - IE8 patch
  - same visible point case: range was collapsed
  - array.indexOf to $.inArray


# v0.5.9
--------

 - Dom Editing: insert(Un)OrderedList, indent/outdent
 - History in a line


# v0.5.8
--------

 - remove autoFormatRange option, use dom.html instead, #561, #280
 - update arguments order on onChange, #577
 - trigger onChange after dom editing, #515
 - comment on range.createFromBookmark(textnode normalize issue, miss match offset)


# v0.5.7
--------

`insertParagraph`
 - Remove empty anchors on enter key press.
 - range.deleteContents: remove empty parents.
 - Fix bug: new line does not have previous line formatting on firefox, range.normalize
 - blockquote is also bodycontainer.

`codeview`
 - codeview: add newline on block element.


# v0.5.6
--------

 - Fix enter key bug. #569


# v0.5.5
--------

 - Dom Editing(hotfix).
 - Implement `range.nodes`


# v0.5.4
--------
 
 - Implement insertParagraph, insertNode


# v0.5.3
--------

 - Extract codemirror.autoFormatOnStart option.
 - Fixed Insert Link Bug: #449.


# v0.5.2
--------

 - Air Mode
 - And bug patch (scroll, createLink, ...)


# v0.5.1
--------

 - Support 15 Languages(https://github.com/HackerWins/summernote/tree/master/lang)
 - Add local-server for develop summernote.
 - Font style: Font-Family
 - And Bug patch.


# v0.5.0
--------

 - Support both Font-Awesome 3.x and 4.x
 - CodeMirror as Codeview
 - Insert Video (by cdownie)
 - Support 5 languages(by hendrismit, tschiela, inomies, cverond)
 - Restructuring: jQuery build pattern


# v0.4.0
--------

 - Support both Bootstrap 3.0 and 2.x
 - Fullscreen
 - Code view
 - Image upload callback


# v0.3.0
--------

Init options and resizebar.
 - Init options(event callbacks, custom toolbar)
 - Resize bar and help dialog
 - Supporting IE8(Beta)
 - Bug patch


# v0.2.0
--------

Implemented undo/redo and image sizing.

 - Undo/Redo
 - Sizing handle and Popover for images
 - Supporting multiple editors
 - jQuery.curstyles dependency removed


# v0.1.0
--------

Initial version: Implement basic features.

 - Font style: size, color, bold, italic, underline, remove font style
 - Paragraph style: bullet, align, outdent, indent, line height
 - Image: drag & drop, dialog
 - Link: popover and dialog
 - Table: create table with dimension picker

