# MagicBox
The website provides a Web-based forum for laypeople to post their ideas and for experts to pick creative ideas and realize them.

## Installation
1. Run the following commands on your terminal
 ```git clone https://github.com/LuoZhijie-tom/MagicBox1.git```
2. ```npm install```
3. ```node app.js```
4. Open your browser and go to url - localhost3000

## Motivation 
When you come up with some unbridled ideas, isn’t it depressing that you are unable to make it a reality?  
Or, when you are an expert in some specific field, isn't it too bad that you might be trapped in your own thinking trap and cannot come up with some creative ideas?
For example, suppose you have worked out the rough drawings of the properly designed umbrella in which way your backpack won’t always get soaked when it rains (or may just come up with the idea in your mind and describe it in words). But then you may reach a point where your properly designed umbrella can only remain in your imagination since you don’t know how to produce it. Why can’t we just let someone expert in this field (maybe an umbrella company) make it come true? 
So now, what if we let these two groups of people exchange ideas with each other? Each takes what he needs. Life would be much easier and happier! 


## Aim 
We hope to provide a platform where people’s good ideas can be realized with the help of professional knowledge.


## User Stories: 
* As a layperson who comes up with some creative idea(or design drawings) but couldn’t carry it out, I want to post my idea online and make my idea a reality by someone who is able to.
* As a layperson who meets some troubles or inconveniences in life, I want to share my story and get some suggestions from the expert. (also these ‘troubles’ might inspire experts to some extent)
* As an expert/craftsman who is experts on some specific fields, I want to find people’s demand and good ideas that are related to my major/skills, make it come true and then share the final product online.
* As a visitor who just gets spare time to surf the Internet, I want to see what other people's creative ideas are, and how professionals implement them.
 
## Current features: 
1. On the Home Page, there are a sequence of cards displaying users’ posts. Infinite scroll feature is also added, which means as you scroll to the end it will load more display cards. On the nav bar, there is a search bar. You can search any post by some keywords using it.
2. On an individual Show Page, it displays the main information of a post, including its title, author and post content; Here for each post, user can answer and make comments under the post.(‘answer’ refers to providing a potential strategy for realising the author’s idea; while ‘comment’ means to express their own opinions just as visitors); Different buttons lead to some different user behaviours - users can like and collect the post, and mark it as a ‘working-on-it’ idea.
3. Our website has a basic authentication system. Users can register, login and logout on the web. Also, users are authorised to create, edit and delete their own ideas.
4. On the User Page, it shows the basic information of the user, including followers, other users followed, ‘like’ posts, collected posts, ‘working-on-it’ posts of the user.

## Features to be completed by the end of July: 
1.  Refinement of the UI and make some optimization such as to make the search more powerful, display the posting time and make the web page more responsive.
2.  The web will support the posting of video, image and links.
3.  The email during registration will be verified and users can change their password by entering their registered email address.
4.  Add a mobile version
5.  Recommendation system(it may not be based on machine learning, it may be simple  random recommendation )
6.  Perform testing


## About
MagicBox is written by Luo Zhijie and Weng Ying.
