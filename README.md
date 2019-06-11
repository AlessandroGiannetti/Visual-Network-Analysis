# VA Project – Visual Network Analysis 

## Visualizations
To demonstrate in an efficient way our dataset, we have decided to use some nodes to indicate the IP addresses: so, we created a graph where the links are the communication between two nodes.
In the same time, we can have an overview, like a picture, of what is happening time by time, day by day.
In order to have a representation of each parameter, we have built a PCA, which will be discussed later.
We have four checkboxes, through them we can select the day of the attacks and for each of them, we have placed a slider to choose also the range hour. On their left, we have presented a bar chart, indicating the number of attacks for each attack for that day.
Lastly, we can observe a scatterplot, where we want to highlight the IP address attacked and in which port.
### 1.1	Graph
As we stated previously, in the graph we can see the nodes where they identify an IP address. We have decided to represent the dataset in this way because personally, we thought it was the best solution: using a bipartite graph enables us to identify who are the attackers and who are the victims. In general, all the networks are represented by a union of nodes and links which we can easily pinpoint a source and a target in the communication; the links demonstrate the dialogue between the two parties. In our case, we have drawn three layers: in the first one, we have assigned the attackers; in the second one, we noticed that some IP addresses receive packets but also distributes them, which clearly states a firewall; the third one, we have placed the target of the attacks.
These nodes assume a colour (from violet to yellow) which change depending on how many packets they send and receive. If one scroll over them they can understand that there is a clear line of communication between the nodes.
They are connected by a link, which describes the link between the two IP addresses and the results.
### 1.2	PCA
Given that we have seven features, we draw this plot to have an overview of the situation. We have four axes, one of them describes the following features: Source, Destination Port, Target and Label.
Each tuple in the dataset has been represented by a line, where this line intersects a specific value of these four axes.
### 1.3	Timestamp & Bar Chart
The dataset we have used demonstrates two elements: a slider, where it reveals the beginning of the attacks and the ending of the attacks. There are on this slider some points: they represent the attack in a precise moment and when a node in the graph has been selected, these points are going to be lighter than the others. Finally, these are coloured based on how many packets have been sent while communication.
The second element is a bar chart, which describes the attacks that are present on a specific day and how many packets are sent with that Label.
### 1.4	Scatterplot
Here we have a plane where on the vertical axis are shown all the IP addresses that suffered an attack and in the horizontal axis the number of the destination port. The dot changes size based on how many attacks has been taken by the couple IP address-Port.

Now we have introduced a preview of our application, in the next chapter we are going to explain the functionality of these elements.
## 2	Functionality
About the possible views of our application, we can say something on the graph to give a visual impact for the user of what it is happening, where we can select the communication or the IP address to get focus on that situation, but we can also have an idea just going on the link or on the node to see some outcome.
As an example, once we have chosen our target, on the PCA we can have a brief overview of the communication. More, we can see on the slider the points can be lighter to show when the communication happened and in which hours.
Then in the bar chart, we will notice it will be coloured in orange to demonstrate how many and which packets have been sent or received. 
Finally, in the scatterplot, we circle the selected element to visualize them.
But all these things are not the only one.
There are some filters: on the left of the graph, we can select a range of the number of packets; in the PCA all the axes can be used to filter elements, but if we want to filter by the time or day, we can use checkboxes and sliders. However, when a filter will be applied to all the elements that we explain before changes dynamically.
### 2.1	Graph
As we can see in the picture, we can observe on the left a bar, which shows how many malicious packets have been sent by all the nodes of the communication and it can be used to filter the range of them. They are coloured based on how many of these packets they have delivered.
The links as we said, represent a connection between two nodes and they changed their size in order to how many packets are exchanged between them.
Moreover, if we go on a node or on a link, we have a preview of the communication and in particular some details (in the first case, about the IP address and forwarded packets, in the second case about packets exchanged, total length of forwarded packets (in bytes), source and destination) on that action but when we selected one of them, it will be coloured in orange to get focus on a specific scenario especially if we want to understand which are the nodes related to the selected one. 
### 2.2	PCA
The goal of this representation is to visualize multidimensional data. Ideally, we would like to show relationships between our parameters and the following solution proposed is Principal Component Analysis (PCA).
Essentially, we will move from n dimensions to k dimensions and it is useful for compressing data and using simple visualizations. In our case, n is equal to 7 and k is equal to 1.
We create for each parameter an axis with their corresponding values and each link that crosses these axes is an instance of our dataset.
So, in the first axis, we have the main character of the attacks, in the second in which port they attacked the victim and in the third the IP address of the victim. In the last axis, we can see which attack has been implemented.
However, we can filter or select a range on the axis to get focus on a possible scenario and in addition, if we select a node, the links that correspond to the IP address will be coloured in orange to have an overview of the situation.
In conclusion, we implement zooming on the PCA and dragging/swapping axis in order to read carefully certain data and find eventually relations between different features that is not possible visualize immediately.
### 2.3	Timestamp & Bar Chart
Continuing the analysis of our functionality, we decided to work on the hour of these attacks, because we had the opportunity to analyse and understand when they usually happened. We can see four checkboxes, one for each day of our analysis and on the right, a bar chart plot that represents in descending way the attacks in that day and the total number of packets sent. 
We notice a chroma scale that intuitively shows with the assistance of dots which are coloured how many and when the attacks happened. Also, we can work on the slider if we want to filter a range of hour or if we are not interested in a specific day, we can remove easily the tick on the checkbox.
Like the PCA, if we select a node on the graph, the dots will be lighted up and the bars will be partially coloured in orange (or totally) based on how many packets the selected node has been sent. Furthermore, when we pick out the hour range, the graph and the PCA changed based on what we have filtered and of course, also the bar on the left changed the total number of malicious packets.
### 2.4	Scatterplot
Finally, in the picture above, we describe with this plot the victims that suffered an attack and in which port they had endured it.
On the x-axis, we find the IP addresses while in the y-axis the ports that we have chosen by a select (on that, we are also able to search a certain port in we are interested) and we can interact with this plot just going on a dot (which size changes based on how many packets the couple IP address-Port received) and on this over action we will visualize on the graph the communication and the timestamp slider when it happened.

## 3 References
SLIDE: 	https://www.slideshare.net/AlessandroGiannetti3/visual-network-analysis-148780273/
