# Report 2 - Requirements Elicitation Assignment 
## Index
1. [Requirements: Introduction, Purpose/Scope, and Description](#Requirements)
2. [Specific Requirements and Features](#SpecificReq)
3. [Use Cases](#UseCases)
4. [Domain Model](#DomainModel)
5. [Group Members Identification](#Group)

<a name="Requirements"> </a>
## Requirements: Introduction, Purpose/Scope, and Description

#### Introduction
The generic purpose of the requirements elicitation process is the gathering of information regarding the real stakeholders needs concerning the development of the software. Requirements elicitation is non-trivial because you can never be sure you get all requirements from the user and customer by just asking them what the system should do OR NOT do (for Safety and Reliability). Requirements elicitation practices include interviews, questionnaires, user observation, workshops, brainstorming, use cases, role playing and prototyping.

In the summernote's case, as it is an open source software and follows an open development design concept, besides the initially established project goals upon its inception, the requirements predominantly originate from its user's inputs in the form of issues or pull-requests openly available and accessible at the GitHub repository. The main purpose of the issues tab is to receive feedback from the community about the project's problems or new feature requests. The statements should be as clearly defined as possible and get an understanding of the required properties of a solution to solve a given problem.

#### Handling of issues
When a user/developer opens an issue, usually to report a bug, the input text box is automatically filled with a specific pre-defined issue template containing the desired problem definitions: steps to reproduce the problem, browser and operating system versions and at least a screenshot of the issue. In order to correctly categorise an open issue, a descriptive tag might be added by an authorised developer team member. For example, an [issue](https://github.com/summernote/summernote/issues/1496) was opened to report an external API problem following the previously described template and in the same day the developer `hackerwins` tagged it as a `compatibility` `bug` with `critical` priority. Although not all issues get tagged, when browsing the issues list using some tag as a filter, it can immediately be assumed some developer team member has read and tagged it accordingly. It is possible to get a good overview of the path the project is taking by following and reading the issues tagged as `feature-request`, `critical` and `important`. As it is stated everywhere on the project's repository and official web-site, summernote's goal is to provide a very simple WYSIWYG web editor and as such, new features must be carefully considered in order not to contradict this motto and consequently bloat the software. For instance, a [feature request](https://github.com/summernote/summernote/issues/1168) was opened in June last year for a new option of allowing the paste of content as plain text in the editor and during all this time it has gathered a lot of support from the community but despite it also being tagged as `critical` the request hasn't been officially addressed, instead, a solution has been found by another [summernote plugin](https://github.com/StudioJunkyard/summernote-cleaner). In this case, the summernote's plugin extensibility allowed the developers to indirectly address the users needs. 

#### Handling of pull-requests
Another possible scenario is to directly make a [pull-request](https://github.com/summernote/summernote/pull/732) to the `summernote:develop` branch (the default branch) from a develop fork where the new features and/or fixes are clearly described and the official developer team debates and decides if commits are important and have the required quality to include in a release. At the moment there are also two useful automatic checks available to make the merge decision: continuous integration tool `Travis-CI` assessment of the merge and also code coverage differential analysis provided by `coverage/coveralls`.

<a name="SpecificReq"> </a>
## Specific Requirements and Features

### Functional Requirements:

In order to implement a [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG) editor, it is very important to provide user with specific requirements and features that make the input provided, readable and realistic for a printable format. We can define the behaviour of the software using functional requirements. This primarily describes what Summernote can do and what functions Summernote must be able to perform. We have classified these functional requirements as follows:

##### 1. Interface/User Requirements:

- The basic toolbar contains options for different styles such as quote, text, code and header. All the styles should be able to change amongst themselves easily.
- Tools like place holder, fontnames are customizable and the toolbar itself is also customisable in javascript. 
- Common formatting tools such as Bold, Underline, font face, font color, lists can be implemented in the basic toolbar while more options of formatting can be added externally.
- Different dynamic methods of mouse and keyboard can be implemented.
- Insert links, images and videos.
- Editing in full screen mode.
- Insert and format tables.
- Feature for automatic code format.
- Adjustable height and width of the editor in the browser.
- Editor can be used using the shortcuts provided in the help menu.
- A custom button can be implemented with different options on clicking.


##### 2. System Requirements:

- Summernote is available in compiled CSS, JavaScript version, through source code implementation, through clone or fork via Github and installation with Bower.
- The editor should be compatible with the most widely used browsers like Google Chrome, Mozilla Firefox, Internet Explorer and Safari in their latest versions.
- Summernote can be compiled using other 3rd party integration like Django, Ruby on Rails, AngularJS, Apache Wicket, Webpack and Meteor.
- This editor is available in 39 other languages.

##### 3. Business Requirements

- Summernote is free to use and easily available for all web developers.

#### Non-Functional Requirements

In order to correctly implement the functional requirements, we need a set of operations defining how the software shall work. For this, we need to show the quality factors through non-functional requirements. We must have a proper system design to ensure that the quality of the software remains high during execution as well as in background evolution. The non-functional requirements can be given as:

#####1. System design

- The software can be implemented in a basic mode or in a customized user version using the [Deep Dive](http://summernote.org/deep-dive/) guide available on the summernote website.
- The expandable features can be supported by the module system that was inspired by the spring framework.
- This can be done through the implementation given in the API of the software.
- The API is used for the implementation of all the interface requirements and uses the javascript libraries.
- Summernote can be set up in different languages by including the respective lang file found [here](https://github.com/summernote/summernote/tree/master/lang).

#####2. Maintainablity and Extensibility:

- As Summernote is an open-source project, all the issues can be reported using the Github link.
- These issues are solved by the team and other contributors using pull requests.
- New features too are added to Summernote by release of latest versions (Currently on the version v0.8.2).

#####3. Stability:

- As Summernote is based on JQuery and Bootstrap libraries of Javascript, it is very stable and rarely faces any issues with stability.

#####4. Portability:

- The code of Summernote can be easily ported to different browsers as it is based on Bootstrap and JQuery.

#####5. Price:

- The Summernote editor is free of cost and hence the source code of the same is available on [github/summernote](https://github.com/summernote/summernote).

#####6. Certification:

- Summernote is licensed and can be distributed under the MIT license, thus open-source.

<a name="UseCases"> </a>
## Use Cases (including diagrams) 

Use case analysis is an important and valuable requirement analysis technique that has been widely used in modern software engineering. It is a methodology used in system analysis to identify, clarify, and organize system requirements.

The use case is made up of a set of possible sequences of interactions between systems and users in a particular environment and related to a particular goal.

Is our intention allow the reader to view the different types of roles in the system that we've been talking and how those roles interact with that same system. So, following, without going deeper into inner workings of the system we provide a high level view:

![UseCases](resources/use-cases.png?raw=true "Use Cases")

<a name="DomainModel"> </a>
## Domain Model 

The domain model is a representation of meaningful real-world concepts pertinent to the domain that need to be modeled in software. Generally uses the vocabulary of the domain so that a representation of the model can be used to communicate with non-technical stakeholders.

It seems to us that we are in the presence of an application that have a very simple Domain Model.


Packages that seem to exist in our application are:
- Webserver
- Plugins
- Tools (external tools)

![DomainModel](resources/domain-model.png?raw=true "Domain Model")

<a name="Group"> </a>
## Group Members Identification 

|               Name              |         Email        | Contribution |
|---------------------------------|:--------------------:|:------------:|
| Artur Sousa Ferreira            | ei12168@fe.up.pt     |      25%     |
| José Filipe de Monteiro Peixoto | ei12134@fe.up.pt     |      25%     |
| Nuno Miguel Rainho Valente      | up200204376@fe.up.pt |      25%     |
| Urvish Sanjay Desai                    | up201602683@fe.up.pt |      25%     |
