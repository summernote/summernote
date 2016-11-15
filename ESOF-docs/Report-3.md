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

The development view illustrates a system from a programmer's perspective and is concerned with software management. 
This view is also known as the implementation view. It uses the UML Component diagram to describe system components.

This is a view of the architecture of a system that includes the components used to mount and release a physical system. 
This view focuses on configuration management
and actual software module organization in the development environment. The software is
actually packaged into components that can be developed and tested by the development
team. While the Logical View is at the conceptual level, the diagrams in this view
represent the physical-level artifacts that are built by the team.

Component Diagrams are used to represent the Implementation View. These diagrams
show different components, the ports available and the dependencies on the environment
in terms of provided and required interfaces. UML 2 has improved the Component
Diagrams specifically with the interfaces and ports. The components can be tied to the
classes and composite structures that realize these components. These diagrams can
now be used to precisely represent the software components built in a system and their
dependencies both in black-box and white-box views.

![DevelopmentView](resources/development-view.png?raw=true "Development View")


<a name="DeploymentView"> </a>
## Deployment View

<a name="ProcessView"> </a>
## Process View

This view considers non-functional aspects such as performance, scalability and
throughput. It shows the main abstractions from the Logical View executing over a thread as an operation. It is important to refer that a `process` is a group of tasks that form an executable unit; a software system is partitioned into sets of tasks. 

In this section we will describe the tasks, which include processes that are involved in the execution and interactions of the Summernote system. We chose from different diagrams the activity diagram to present the information above. 

An `activity diagram` is similar to flowcharts and have a wide range of uses in different view points. In the process view, they can be used to depict the program flows and complex business logic with actions, decision points, branching, merging and parallel processing. This activity diagram shows how, at run-time, the system is composed of interacting processes and is present below:


![ProcessView](resources/process-view.png?raw=true "Process View")

In the above diagram we refer style button and in that case we mean buttons that change the style of presentation / formatting the "text", like `bold` button or `color` button. In the following toolbar of Summernote we can also insert some picture, video, table or link, for example, and because of this reason we distinguish style buttons from other buttons. 


Just one more note to mention that it is possible before writing something in the editor to click a button and then to write something already with that type of defined format or vice versa. This is the reason for the existence of the initial branch on the activity diagram.
 
 
![Toolbar](resources/toolbar.png?raw=true "Toolbar")


<a name="Group"> </a>
## Group Members Identification 

|               Name              |         Email        | Contribution |
|---------------------------------|:--------------------:|:------------:|
| Artur Sousa Ferreira            | ei12168@fe.up.pt     |      25%     |
| José Filipe de Monteiro Peixoto | ei12134@fe.up.pt     |      25%     |
| Nuno Miguel Rainho Valente      | up200204376@fe.up.pt |      25%     |
| Urvish Sanjay Desai                    | up201602683@fe.up.pt |      25%     |
