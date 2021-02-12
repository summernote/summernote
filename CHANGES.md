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
