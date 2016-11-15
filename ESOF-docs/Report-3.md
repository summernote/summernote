# Report 3 - Software Design 
## Index
1. [Introduction](#Introduction)
2. [Logical View](#LogicalView)
3. [Deployment View](#DeploymentView)
4. [Process View](#ProcessView)
5. [Group Members Identification](#Group)

<a name="Introduction"> </a>
## Requirements: Introduction

<a name="LogicView"> </a>
## Logical View

<a name="DevelopmentView"> </a>
## Development View

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
