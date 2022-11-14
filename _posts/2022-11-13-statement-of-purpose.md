---
title: Statement of Purpose
feature_text: |
  ## Statement of Purpose
  Rough draft of statement of purpose for grad school application
categories:
- Graduate School Application
feature_image: "https://picsum.photos/2560/600?image=872"
---

I am currently an undergraduate student in Statistics and Computer Science at the University of Illinois, Urbana - Champaign (UIUC). During my four-years of college study, I have completed many excellent and useful courses, including the high-level courses on artificial intelligence and computer vision, and I got a high GPA in these years study (3.95/4.0). Besides the course works, I have two software engineer internship experiences: one as an android developer in NetEase, another as an ML data analysist in VMware. I also joined 3 different research projects after I coming back to campus from industry. These three projects mainly lie in the area of artificial intelligence, especially in the fields of Robotics, Graph Neural Network, and Computer Vision. I want to pursue a Master of Computer Science focusing on letting our computer deeply understand the surrounding world, including the research on Machine Perception, Explainable Artificial Intelligence, and General-Purpose Computer Vision. I believed that those fields are really crucial for the next generation tech product which could enrich and facilitate people’s life.
 
My motivation to pursue a master’s degree in computer science comes from my past research experience and the goal of my life. I always consider myself as a fortunate person who not only have a happy and fulfilling family, but also have a clear life goal to pursue: I dreamed to be a successful entrepreneur who can stand on the stage of a product event, like Steve Jobs, to publish a product that revolutionized the world.  AR device, I believe, is the product that could change everyone’s lifestyles and the perspective of technology. However, AR glasses have a long way to go before becoming a mature product. Since the AR device requires to understand the real-world situation surround itself, I set my plan to first start with understanding and engaging the state-of-the-art works in the Computer Vision field.
 
To better comprehend how to enable computer to recognize the real world, in the winter of 2022, I started my research at the Intelligent Motion Lab, supervised by Prof. Kris Hauser and Prof. Yuxiong Wang. I mainly focused on designing and implementing a continual learning segmentation system (CLSS). CLSS is a system mainly for letting robot to continuously learn to recognize new object categories based on our incremental learning algorithm (GAPS). Our pipeline performs a semantic level segmentation task and give our robot the ability to classify the new objects based on people’s instructions. When user observe that there is an unrecognized object, user could use CLSS to provide annotation (mask and label) to the robot, and the robot will learn this object simultaneously without any halting. We integrate an interactive segmentation model (RITM) into our continual learning pipeline (CLSS) in order to reduce user’s operation cost when perform annotation. We also integrated a video tracking component (VOS) to increase the instant segmentation accuracy (the new object segmentation accuracy immediate after user providing the annotation). I worked as a full-stack developer who not only deals with frontend and backend development of our system but also completely understood GAPS/RITM/VOS and modified GAPS/RITM/VOS to accommodate our whole system. Besides the whole pipeline we designed, I also helped our team to design an incremental learning benchmark which we count the inference latency during training time as a very important factor since in the real-world settings, robot needs to get the inference result immediately to determine its later actions.

After understanding the field of continual learning and semantic segmentation, I intend to dive deeper into the area of artificial intelligence, especially I want to have more experience on working on an actual research paper. In the summer of 2022, I was selected to work as an undergraduate research assistant with Professor Tarek Abdelzaher and Dr. Ruijie Wang to investigate graph adversarial learning on dynamic link prediction. I am in charge of building our experiment infrastructure and reimplementing many baselines (VGAE/Evolve-GCN/Euler) and attacking methods such as random-attack and meta-attack in this project. I found that there are very few of works in academia that mainly focus on the adversarial defense on dynamic link prediction in graph neural network. So, I did a lot of investigation on the graph data after global attack on other GNN tasks and finally found several generic patterns (e.g., the attacked graph sparsity is dense). We designed several new optimization restrictions based on those patterns and finally beat most of exiting methods. Our paper on developing a new model to defend against adversarial global attacks on knowledge graph is due to be submitted to XXXX by the end of December. This project provided me with a deeper grasp of research, namely the entire pipeline of a research project from a vague notion to a highly specific thorough article, which confirmed my passion for working in a research lab to develop new technologies and products.

Working on adversarial learning on graph made me realized the fragility of deep learning models. It also made me really curious about AI’s black box. Why will the model make this prediction? Which factor determined its result? Therefore, in my senior year, I decide to go back to the field of computer vision and start to work on interpreting the model’s black box. Supervised by Prof. Derek Hoiem and Dr. Yao Xiao, we are trying to build up a pipeline for concept-based classification. We want to interpret model’s prediction by measuring the contribution of different concept of an object (e.g., “bird” could be divided to: “wings”, “beak”, “feathers”).  So, one of the most important parts in this project is to figure out how to extract those concepts from training data. We decide to extract one layer of CLIP’s image encoder in inference time and cut this latent map to several patches. Finally, we use k-means algorithm to cluster patches and build up those concepts. I implemented this concept extraction pipeline and construct a similarity dataset (the similarity between each training image and all concepts) for training. Our attribute classification pipeline got similar test accuracy with other end-to-end models, but we could utilize this concept-based pipeline to figure out the contribution of each concept during inference time by SHAP or Grad Cam. I am still working on this project now, and I am really eager to find more interesting application for our attribute classification pipeline. We schedule to submit our work on ICCV’2023.

Professional training at a higher institute has been a key priority in my agenda. Carnegie Mellon University, as the world's best university in computer science, is the ideal solution for me. I explored the program brochure and excited to find courses like Visual Learning and Recognition and Geometry-based Methods in Vision, which will lay a solid foundation for the modeling and sophisticated calculations required in the construction of augmented reality, bringing me closer to understanding 3D-vision and actual machine perception technology. The Master of Science in Computer Science program at CMU stands out as my dream program not only because of the rigorous coursework it offers, but also because of the school's research facility, the Augmented Perception Lab. Since 2014, I've established the objective of creating a wonderful product that can impact people's lives; I never lose sight of this goal and continue to strive in the connected field. I wish to make the computer feel the world because a deeper understanding of the world would allow it to better serve human life. Therefore, I look forward to becoming a part of this lab. Overall, I believe CMU’s abundant resources and collaborative environment can provide the best guidance to my academic career, and I would also love to give back to the CMU community with my positive spirit and ceaseless hard work.

