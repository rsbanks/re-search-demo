import psycopg2
from profsDB import profsDB
from os import environ

def writeImageLocation(conn, net_id, imagePath):
    try:
        image = open(imagePath, 'rb').read()
        cur = conn.cursor()
        stmt = ""
        stmt += "UPDATE profs"
        stmt += " SET image=%s"
        stmt += " WHERE netid=%s"
        cur.execute(stmt, (imagePath, net_id))
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

def read_Image(conn, net_id, path_to_dir):
    try:
        cur = conn.cursor()
        stmt = "SELECT image FROM profs WHERE netid = %s"
        cur.execute(stmt, (net_id, ))

        blob = cur.fetchone()
        print(blob[0])
        open(path_to_dir + blob[0] + '.' + blob[1], 'wb').write(blob[2])
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

if __name__ == '__main__':

    hostname = environ.get('DATABASE_HOST')
    username = environ.get('DATABASE_USERNAME')
    password = environ.get('DATABASE_PASSWORD')
    database = environ.get('DATABASE_NAME')

    conn = psycopg2.connect( host=hostname, user=username, password=password, dbname=database)
    # replace netid with prof's netid
    netid = "wmassey"
    file_path = "static\profImages\\" + netid + ".jpg"
    writeImageLocation(conn, netid, file_path)
    conn.close()