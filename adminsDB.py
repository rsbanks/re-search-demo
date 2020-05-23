from os import environ
from sys import argv, stderr
import psycopg2

class adminsDB:

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
            error_statement = 'Unable to connect to server. Please contact owner of the Application.'
            print(error_statement, file=stderr)

        return error_statement

    def disconnect(self):
        self.conn.close()