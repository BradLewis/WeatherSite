#!/bin/python3.5

#Opens the file
def open_file():
    file_opened = open("city.list.txt")
    new_file = open("new_list.json", "w", encoding='utf8')
    add_commas(file_opened, new_file)

#adds commas to the file
def add_commas(f, n):
    my_list = []
    for line in f:
        bad_ascii = check_ascii(line)
        if not bad_ascii:
            my_list.append(line.rstrip() + ",\n")
            lastline = line.rstrip()
    n.write("[")
    for line in my_list:
        n.write(line)
    n.write(lastline + "]")

#Checks if the ascii value is between 0 and 128
def check_ascii(line):
    bad_ascii = False
    for letter in line:
        if ord(letter) < 0 or ord(letter) > 128:
            bad_ascii = True
            break
    return bad_ascii

#main function
if __name__ == "__main__":
    open_file()
