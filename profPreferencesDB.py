import psycopg2
from profsDB import profsDB
from prof import Professor
from sys import argv, stderr
from os import environ

class profPreferencesDB:
    
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
            error_statement = 'Unable to connect to server. Please contact owner of Application.'
            print(error_statement, file=stderr)

        return error_statement

    def disconnect(self):
        self.conn.close()

    def createProfPreference(self, data):
        error_statement = ''
        report = "Successful Add"

        try:
            cur = self.conn.cursor()

            # if user has already submitted, do an update instead. 
            cur.execute("SELECT * FROM preferences WHERE username=%s", [data[0]])
            result = cur.fetchone()
            if result != None:
                report = self.updateProfPreference(data)
            else:
                stmt = """INSERT INTO preferences(username, courseselection, advisor1, topiccomments1, advisor2, topiccomments2, advisor3, topiccomments3, advisor4, topiccomments4, submittedtime, completedtime) VALUES"""
                stmt += "(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

                cur.execute(stmt, data)
                self.conn.commit()
                cur.close()
                self.conn.close()
            return report
        except Exception as error:
            error_statement = str(error)
            print(error_statement)
            report = "Failed Add"
        finally:
            return report



    def updateProfPreference(self, data):
        error_statement = ''
        report = "Successful Update"

        try:
            cur = self.conn.cursor()

            stmt = "UPDATE preferences "
            stmt += " SET courseselection=%s,"
            stmt += " advisor1=%s,"
            stmt += " topiccomments1=%s,"
            stmt += " advisor2=%s,"
            stmt += " topiccomments2=%s,"
            stmt += " advisor3=%s,"
            stmt += " topiccomments3=%s,"
            stmt += " advisor4=%s,"
            stmt += " topiccomments4=%s,"
            stmt += " modifiedtime=%s,"
            stmt += " completedtime=%s"
            stmt += " WHERE username=%s"

            cur.execute(stmt, [data[1], data[2],data[3], data[4], data[5]
                ,data[6], data[7], data[8],data[9], data[10], data[11],data[0]])
            self.conn.commit()
            cur.close()
            self.conn.close()
            return report
        except Exception as error:
            error_statement = str(error)
            print(error_statement)
            report = "Failed Update"
        finally:
            return report

    # Returns a list of all the rows in the preferences table
    def getProfPreference(self):
        error_statement = ''
        report = 'Successful Download'

        try:
            cur = self.conn.cursor()

            stmt = "SELECT * FROM preferences"
            cur.execute(stmt)

            preferences = []
            preferences.append(report)
            row = cur.fetchone()
            while row is not None:
                preferences.append(row)
                row = cur.fetchone()

            self.conn.commit()
            cur.close()
            self.conn.close()

            return preferences
        except Exception as error:
            error_statement = str(error)
            print(error_statement)
            report = "Failed Download"
            return [report]

    # Returns a list of just each student and thier advisors in the preferences table
    def getAdvisors(self):
        error_statement = ''
        report = 'Successful Download'

        try:
            cur = self.conn.cursor()

            stmt = "SELECT username, advisor1, advisor2, advisor3, advisor4 FROM preferences"
            cur.execute(stmt)

            advisors = []
            advisors.append(report)
            row = cur.fetchone()
            while row is not None:
                advisor = []
                for col in row:
                    if str(col) != "null" and str(col) != "":
                        advisor.append(str(col))

                advisors.append(advisor)
                row = cur.fetchone()

            self.conn.commit()
            cur.close()
            self.conn.close()

            return advisors
        except Exception as error:
            error_statement = str(error)
            print(error_statement)
            report = "Failed Download"
            return [report]


if __name__ == '__main__':

    pPDB = profPreferencesDB()
    pPDB.connect()
    print(pPDB.getAdvisors()[1:])
    pPDB.disconnect()