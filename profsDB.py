from os import environ
from os import path, stat
from sys import argv, stderr
from prof import Professor
import psycopg2

class profsDB:

    def __init__(self):
        self.conn = None

    def connect(self):
        error_statement = ''

        try:
            hostname = environ.get('DATABASE_HOST')
            username = environ.get('DATABASE_USERNAME')
            password = environ.get('DATABASE_PASSWORD')
            database = environ.get('DATABASE_NAME')

            self.conn = psycopg2.connect(host=hostname, user=username, password=password, dbname=database)
        except Exception as e:
            error_statement = 'Unable to connect to server. Please contact owner of Application'
            print(error_statement, file=stderr)

        return error_statement

    def disconnect(self):
        self.conn.close()

    def displayAllProfessors(self, connection):
        stmtStr = 'SELECT profs.netid, profs.title, profs.first, profs.last, profs.email,' + \
                ' profs.phone, profs.website, profs.rooms, profs.department, profs.area,' + \
                ' profs.bio, profs.image, profs.image_actual, profs.image_extension' + \
                ' FROM profs ' + \
                ' ORDER BY profs.last ASC'
        cur = connection.cursor()
        cur.execute(stmtStr)
        return self.return_profs(cur)

    def displayProfessorsByFilter(self, connection, search_criteria, input_arguments):
        stmtStr = 'SELECT profs.netid, profs.title, profs.first, profs.last, profs.email,' \
                ' profs.phone, profs.website, profs.rooms, profs.department, profs.area,' \
                ' profs.bio, profs.image, profs.image_actual, profs.image_extension' + \
                ' FROM profs' + \
                ' WHERE ' + search_criteria + \
                ' ORDER BY profs.last ASC'
        cur = connection.cursor()
        cur.execute(stmtStr, input_arguments)
        return self.return_profs(cur)

    def return_profs(self, cur): 
        profs = []
        row = cur.fetchone()
        while row is not None:
            prof = Professor(row[0])
            prof.setTitle(row[1])
            prof.setFirstName(row[2])
            prof.setLastName(row[3])
            prof.setEmail(row[4])
            prof.setPhoneNumber(row[5])
            prof.setWebsite(row[6])
            prof.setRooms(row[7])
            prof.setDepartment(row[8])
            prof.setResearchAreas(row[9])
            prof.setBio(row[10])
            prof.setImagePath(row[11])
            prof.setActualImage(row[12])
            prof.setImageExtension(row[13])
            profs.append(prof)
            row = cur.fetchone()
        cur.close()
        return profs

    def return_profs_list(self, profs):
        profs_list = []
        for prof in profs:
            prof_listing = []
            prof_listing.append(prof.getNetId())
            prof_listing.append(prof.getFirstName())
            prof_listing.append(prof.getLastName())
            prof_listing.append(prof.getTitle())
            prof_listing.append(prof.getEmail())
            prof_listing.append(prof.getPhoneNumber())
            prof_listing.append(prof.getWebsite())
            rooms = " ".join(prof.getRooms())
            prof_listing.append(rooms)
            prof_listing.append(prof.getDepartment())
            researchAreas = ", ".join(prof.getResearchAreas())
            prof_listing.append(researchAreas)
            prof_listing.append(prof.getBio())
            prof_listing.append(prof.getImagePath())
            prof_listing.append(prof.getActualImage())
            prof_listing.append(prof.getImageExtension())
            profs_list.append(prof_listing)
        return profs_list

    def print_profs(self, profs):
        profs_list = self.return_profs_list(profs)
        for prof in profs_list:
            prof_ = ''
            for item in prof:
                prof_ +=  ' ' + item
            print(prof_) 


if __name__ == '__main__':
    profsDB = profsDB()
    error_statement = profsDB.connect()
    if error_statement == '':
        connection = profsDB.conn
        profs = profsDB.displayAllProfessors(connection)
        profsDB.print_profs(profs)
    else:
        print(error_statement)
    profsDB.disconnect()
        

