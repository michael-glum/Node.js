#!/usr/bin/python3
#scott campbell
#cse470 winter 2022
# play jeopardy by calling server
#
#UPDATE URL

API_URL="http://glummb.270e.csi.miamioh.edu:3011"
import requests
import random

#get shows
shows = requests.get(API_URL+"/api/v1/jeopardy/shows");

shows = shows.json();

showNum = random.randrange(len(shows['shows']));
#showNum=1   add this for debugging purposes

print("\n\nJeopardy Game\n\nPlaying game "+shows['shows'][showNum]);

topics= requests.get(API_URL+"/api/v1/jeopardy/topics/"+shows['shows'][showNum]);
topics = topics.json();

print("\ntopics");
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
    a=input("your answer ")

    check= requests.get(API_URL+"/api/v1/jeopardy/check/"+shows['shows'][showNum]+ "/" + tn + "/" + str(qn) + "/" + questions['questions']['answers'][int(a)]);
    check=check.json();
    print("\nResult ",check['result'])
    qn = qn + 1






