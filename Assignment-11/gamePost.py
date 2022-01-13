#!/usr/bin/python3
#scott campbell, winter 2022, cse270, assignment 11. Post version of jeopardy

API_URL='http://campbest.cec.miamioh.edu:3001'
import requests
import random

#get shows
shows = requests.get(API_URL+"/api/v1/jeopardy/shows");

shows = shows.json();

showNum = random.randrange(len(shows['shows']));
showNum=1

print("Playing game "+shows['shows'][showNum]);

topics= requests.get(API_URL+"/api/v1/jeopardy/topics/"+shows['shows'][showNum]);
topics = topics.json();

print("topics");
i=0;
for x in topics['topics']:
    print (str(i) + ": " + x)
    i = i+1


tn = input("Pick a topic ");


questions= requests.get(API_URL+"/api/v1/jeopardy/questions/"+shows['shows'][showNum]+ "/" + tn);
questions = questions.json();
qn=0
for q in questions['questions']['questions']:
    print("\n********************\nPossible answers ");
    an=0
    for x in questions['questions']['answers']:
        print(str(an) + ": " + x);
        an = an + 1

    print("\nWhat is: ",q)
    a=input("your answer")

    #check= requests.get("http://campbest.cec.miamioh.edu:3001/api/v1/jeopardy/check/"+shows['shows'][showNum]+ "/" + tn + "/" + str(qn) + "/" + questions['questions']['answers'][int(a)]);
    url=API_URL+"/api/v1/jeopardy/check";
    reqData = {"showDate":shows['shows'][showNum],"topicNum":tn,"questionNum":qn,"answer":questions['questions']['answers'][int(a)]}

    check = requests.post(url,json=reqData)

    print("\nresult = " + check.json()['result'] +"\n")
    qn = qn + 1






