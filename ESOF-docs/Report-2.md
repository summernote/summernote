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
The generic purpose of the requirements elicitation process is the gathering of information regarding the real stakeholders needs concerning the development of the software. Requirements elicitation is non-trivial because you can never be sure you get all requirements from the user and customer by just asking them what the system should do OR NOT do (for Safety and Reliability). Requirements elicitation practices include interviews, questionnaires, user observation, workshops, brainstorming, use cases, role playing and prototyping. In the summernote's case, as it is an open source software and follows an open development design concept, besides the initially established project goals upon its inception, the requirements predominantly originate from its user's inputs in the form of issues or pull-requests openly available and accessible at the GitHub repository. The main purpose of the issues tab is to receive feedback from the community about the project's problems or new feature requests. The statements should be as clearly defined as possible and get an understanding of the required properties of a solution to solve a given problem.

#### Handling of issues
When a user/developer opens an issue, usually to report a bug, the input text box is automatically filled with a specific pre-defined issue template containing the desired problem definitions: steps to reproduce the problem, browser and operating system versions and at least a screenshot of the issue. In order to correctly categorise an open issue, a descriptive tag might be added by an authorised developer team member. For example, an [issue](https://github.com/summernote/summernote/issues/1496) was opened to report an external API problem following the previously described template and in the same day the developer `hackerwins` tagged it as a `compatibility` `bug` with `critical` priority. Although not all issues get tagged, when browsing the issues list using some tag as a filter, it can immediately be assumed some developer team member has read and tagged it accordingly. It is possible to get a good overview of the path the project is taking by following and reading the issues tagged as `feature-request`, `critical` and `important`. As it is stated everywhere on the project's repository and official web-site, summernote's goal is to provide a very simple WYSIWYG web editor and as such, new features must be carefully considered in order not to contradict this motto and consequently bloat the software. For instance, a [feature request](https://github.com/summernote/summernote/issues/1168) was opened in June last year for a new option of allowing the paste of content as plain text in the editor and during all this time it has gathered a lot of support from the community but despite it also being tagged as `critical` the request hasn't been officially addressed, instead, a solution has been found by another [summernote plugin](https://github.com/StudioJunkyard/summernote-cleaner). In this case, the summernote's plugin extensibility allowed the developers to indirectly address the users needs. 

#### Handling of pull-requests
Another possible scenario is to directly make a [pull-request](https://github.com/summernote/summernote/pull/732) to the `summernote:develop` branch (the default branch) from a develop fork where the new features and/or fixes are clearly described and the official developer team debates and decides if commits are important and have the required quality to include in a release. At the moment there are also two useful automatic checks available to make the merge decision: continuous integration tool `Travis-CI` assessment of the merge and also code coverage differential analysis provided by `coverage/coveralls`.

<a name="SpecificReq"> </a>
## Specific Requirements and Features (Functional and Non-Functional requirements) 

#### Functional Requirements:

There are several specific requirements required for the software. We have classified them as follows:

##### 1. Interface/User Requirements:

- Different styles such as quote, text, code and header. All the styles should be able to change amongst themselves easily.

- Common formatting tools such as Bold, Italics and Underline can be implemented.

- Change font face and font color.

- Options of ordered and unordered lists as well as paragraphs.

- Insert links, images and videos.

- Editing in full screen mode.

- Insert and format tables.

- Feature for automatic code format

- Adjustable height and width of the editor in the browser

##### 2. System Requirements:

- The editor should be compatible with the most widely used browsers like Google Chrome, Mozilla Firefox, Internet Explorer and Safari in their latest versions.

- Easily switch between text, quotes and code style formats

- Readily available plugins for javascript and CSS.

- //More about plugins

##### 3. Business Requirements

- The code is open source and the source is available on github. The editor should be easy to install, and readily available.

#### Non-Functional Requirements

-


<a name="UseCases"> </a>
## Use Cases (including diagrams) 

In this point we present the Use Case Diagram. Is our intention allow the reader to view the different types of roles in the system that we've been talking and how those roles interact with that same system. So, following, without going deeper into inner workings of the system we provide a high level view:

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
