import csv

with open('profs.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    queries = []
    for row in readCSV:
        query = "INSERT INTO profs(netid, email, last, first, title, phone, website, rooms, department, area, bio) VALUES ("
        for i in range(len(row) - 1):
           query += "\'" + str(row[i]).replace("\'", "\'\'") + "\', "
        query += "\'" + str(row[len(row)-1]) + "\'"
        query += ");"
        queries.append(query)

for query in queries:
    print()
    print(query)