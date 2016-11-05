#!usr/bin/python3.5

import sys

def openFile():
    openFile = open("city.list.txt")
    newFile = open("new_list.json","w",encoding='utf8')
    addCommas(openFile,newFile)

def addCommas(f,n):
    myList = []
    for line in f:
        badAscii = checkAscii(line)
        if (not badAscii):
            myList.append(line.rstrip() + ",\n")
            lastline = line.rstrip()
    n.write("[")
    for line in myList:
        n.write(line)
    n.write(lastline+"]")

def checkAscii(line):
    badAscii = False
    for letter in line:
        if (ord(letter) < 0 or ord(letter) > 128):
            badAscii = True
            break
    return badAscii

if __name__ == "__main__":
    openFile()
