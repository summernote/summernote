# Report 1 - Software Processes Assignment 

### Group Members Identification
|               Name              |         Email        | Contribution |
|---------------------------------|:--------------------:|:------------:|
| Artur Sousa Ferreira            | ei12168@fe.up.pt     |      25%     |
| José Filipe de Monteiro Peixoto | ei12134@fe.up.pt     |      25%     |
| Nuno Miguel Rainho Valente      | up200204376@fe.up.pt |      25%     |
| Urvish Sanjay Desai                    | up201602683@fe.up.pt |      25%     |

### Project Description
Summernote is a JavaScript library built upon open source libraries (jQuery and Bootstrap), licensed under the free MIT software license, that helps to create WYSIWYG editors online. WYSIWYG -  "what you see is what you get" -  implies a user interface that allows the user to view something very similar to the end result while the document is being created. 

![Sample]https://github.com/ei12134/summernote/tree/develop/ESOF-docs/resources/summernote-sample.png)
*Printscreen of a local server running a sample web page including the summernote editor*

Summernote has more than some simple features like editing or styling text. Image manipulation features are available, the user interface can be themed using bootswatch and it also supports plugin extensions like emoticons or connectors.

Summernote’s [official site](http://summernote.org/)  provides further information on how to use the API. There is also information about the development team, a “getting started tab” and an online editor to test the library.

In a more formal way, we could witness the elaborate documentation, the fast implementation and a server-side functionality. Though we won’t need it to get started, it is nice to see that Summernote comes equipped with a thorough documentation explaining all the bits and pieces. Summernote’s documentation contains some very useful demos and examples to get people going. Even server-side implementation with PHP or Node.js is covered.
Summernote formats using inline styles, which you can always check in code-view: (put an image HERE)


#### External Links

Official site: http://summernote.org/

GitHub repository: https://github.com/summernote/summernote

### Development Process

#### History Analysis
The Summernote GitHub repository was created on 21 April 2013. Although the project in itself isn't too big, it had during its development the participation of 149 contributors. The first commit was done on 27 April 2013 along with a funny comment “summer is coming”. Since the initial release, 2100 new commits were done from a grand total of 2226 commits. It has 18 branches, although at the moment of writing, only master and develop branches can really be considered active. The project currently has 655 open issues that need to be addressed and marked as solved after a pull request is made and the changes accepted and merged into the master branch. Looking at the GitHub graphical project overview we can say that nowadays, the project seems a bit stalled, as no new big changes have been introduced and the release cycle seems slower than it once was.

![Evolution of contributions]https://github.com/ei12134/summernote/tree/develop/ESOF-docs/resources/contributions-develop.png)
*Contributions to develop, excluding merge commits between Apr 21, 2013 – Oct 15, 2016*

#### Information Gathering
Unfortunately we did not get an answer to our email that was sent to the top 2 contributors of the [original summernote repository](https://github.com/summernote/summernote "summernote/summernote: Super simple WYSIWYG editor") (by hackerwins and easylogic), inquiring about the project’s software engineering practices, use of prototypes, and also the method of development for bug fixes and features. Neverthelesss, we are still able to infer with  some degree of certainty about the development practices used from the analysis of the commit history, `README.md` and `MAINTAIN.md` files and other less obvious clues. It is possible to know the code convention being used (JSHint) as it is specified in the README.md. We can also conclude that the base (default) branch used for any new development is the branch `develop` and new fixes should be developed in a separate branch following a naming convention like `feature/<name-of-the-feature>` and new bugfixes also in a separate branch like `bugfix/<#issue-number>`.

During the analysis we found the existence of a `CONTRIBUTING.md` file which should have contained information about the development methods and also some relevant information needed before sending pull requests, however, it was broken. This is an issue that probably needs to be addressed at a later stage. Thanks to the control versioning system we managed to rollback to a commit where that link wasn’t broken, but despite those efforts, the file containained little to no relevant information, as it appeared to be a CONTRIBUTING.md template file.

#### Software Processes
Reading through the [release history](https://github.com/summernote/summernote/releases "Releases summernote/summernote") we can point out that at one time the project followed a  relatively fast development pace, with frequent releases of new versions, aproximately two or three per month. Excluding the first two years, where most functionality was implemented, most of the latest releases have been maintenance ones, containing bugfixes and minor changes as requested and disclosed in the GitHub issues tab. The numbering of the versions seems to follow a three number separated by dots format like v0.8.2. We assume that the numbers should be referencing the major, minor and maintenance release numbers in that order.
A continuous integration tool (Travis) is being used to help test code and maintain a 70% code coverage.
If, for example, testers need to test some functionality as soon as the code is done, integration and deployment needs to be almost instantaneous. There are many tools currently in use that facilitate the integration and deployment. Some of them are Puppet and Chef for configuration management and Jenkins, Hudson, Bamboo and Travis(used in this project) for Continuous Integration, Delivery and Deployment. 

#### Opinion, Critics and Alternatives

The project is active, but the daily average of commits is the lowest since the project began. From the lack of response by the contributors and the decreasing activity, we can conclude that the project is in need of more features and more bug fixing activity.
There are more than 650 opened issues with category labels like feature-request, needs-help and discussion. We think this is a good way to organize and motivate collaboration. 
This web-based editor can be the basis for more complex editors, so in the long run, the ability to include plugins becomes essential for the longevity and usefulness of the project. 

This project has the particularity of running in several browsers like Firefox, Chrome, IE  and Safari, which is a good thing because it doesn’t restrict the user to a single browser. We consulted the webpage http://www.w3schools.com/browsers/ and saw that these four previous browsers have a coverage of 97,6% of the users.

The team that has created the project maintains a issue template and a pull request template that gives us an idea on how we should develop new changes and eventually push something in the future to Github. They have a sample plugin called hello that show us how a very simple plugin can be created.
	
Another plus is the use of Grunt. It has a huge library of plugins to automate almost anything we can think of, the community on a whole is using Grunt for all of their projects which leads to contributing, which leads to more plugins, which, as we guessed, leads to greater adoption. This can be easy to get up and running and have lots of documentation.

In one word Grunt can make Automation a real word. The less work we have to do when performing repetitive tasks like minification, compilation, unit testing, linting, etc, the easier our job becomes, and we find great their use in the project.

We are of the opinion that the use of the aforementioned methods/processes have some advantages that we’ve studied in our lecture classes like less documentation to change; system functionality is available earlier; early increments act as a prototype to help elicit requirements for later increments and lower risk of overall project failure. 

##### Critics
We ran this project in our machines and had a first practical approach with the summernote editor. We immediately noticed the bootstrap dependency that might be an issue as it won’t allow us to change the appearance with the same granularity as a no-dependency web-project would. We know that this project was implemented using css bootstrap engine but we are the opinion that this can bring less modularity and also less flexibility.

And on the other hand we know that this method can bring some problems like system structure tends to degrade as new increments are added; regular change tends to corrupt its structure and level of reuse may be suboptimal. 

##### Security notes
Users who use this project need to be careful because there is a  “code view” mode that when active allows others users to enter script contents. So it is necessary make sure to filter/sanitize the html on the server, otherwise, an attacker can inject arbitrary JavaScript code into clients.

##### Conclusion
We feel the Summernote project is reasonably well organized as we can easily access the release notes and also check the project’s issues in its own Github repository. It is also possible to filter the issues list by some labels like “feature request”, “pull-request wanted” or “critical”. This transmits the feeling of insecurity and associated to this we have the lack of recent commits allowing us to support the idea that in our opinion the project was initially well designed but suffered several less successful updates and some others were left aside yet remaining, it is a reasonable version but with a margin of positive progression.
