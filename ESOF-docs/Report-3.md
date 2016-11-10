# Report 3 - Software Design 
## Index
1. [Introduction](#Introduction)
2. [Logical View](#LogicalView)
3. [Deployment View](#DeploymentView)
4. [Process View](#ProcessView)
5. [Implementation View](#ImplementationView)
6. [Group Members Identification](#Group)

<a name="Introduction"> </a>
## Introduction

#### Software Architectural View Model

In this report we'll use a model for describing the architecture of Summernote software system, based on the use of multiple, concurrent views. This use of multiple views has some advantages such like addressing separately the concerns of the various stakeholders of the architecture like clients, developers, systems engineers, project managers and so on and still allows to handle separately the functional and non functional requirements, already presented in the [last report](Report-2.md/#SpecificReq).

Our approach to the architecture of Summernote software system will be based on the 4 + 1 software architecture view model, which follows below. The four views represent the logical view, deployment view, process view and implementation view, having the additional view, use cases, also been presented in the [previous report](Report-2.md/#UseCases).

![4+1 view model](resources/view4+1.png?raw=true "4+1 View Model of Software Architecture")

Each of these views will be subject of a detailed study in this document, in the following sections.

#### Architectural Pattern

An architectural pattern is a general, reusable solution to a commonly occurring problem in software architecture within a given context. Architectural patterns are often documented as software design patterns.

Following traditional building architecture, a 'software architectural style' is a specific method of construction, characterized by the features that make it notable. An architectural style defines a family of systems in terms of a pattern of structural organization.

There are many recognized architectural patterns and styles but we think that in this case is being used the `Model View Controller` architectural pattern and we begin to explain: this model separates application data, inside the model, from graphical presentation components - the view, and input-processing logic - the controller. In Summernote project, a user, for example, inputs text, from the keyboard and formats this text using the mouse by clicking on a editor button. The program stores this text and format information into a series of data structures, then displays this information on screen for the user to read what has been inputted. When a user provides some input, the controller modifies the model's data with the given input. When the model changes, it notifies the view of the change and the view can update its presentation with the changed data. A basic example is when the application displays characters using a particular font. 

This model have some advantages because we can see by the last example announced that it allows the data and its representation to change independently and supports presentation, once we can have the text wrote in different fonts and other styles without changing that text. 

<a name="LogicView"> </a>
## Logical View

<a name="DevelopmentView"> </a>
## Development View

<a name="DeploymentView"> </a>
## Deployment View

<a name="ProcessView"> </a>
## Process View

<a name="Group"> </a>
## Group Members Identification 

|               Name              |         Email        | Contribution |
|---------------------------------|:--------------------:|:------------:|
| Artur Sousa Ferreira            | ei12168@fe.up.pt     |      25%     |
| José Filipe de Monteiro Peixoto | ei12134@fe.up.pt     |      25%     |
| Nuno Miguel Rainho Valente      | up200204376@fe.up.pt |      25%     |
| Urvish Sanjay Desai                    | up201602683@fe.up.pt |      25%     |
