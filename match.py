from profsDB import profsDB
from profPreferencesDB import profPreferencesDB
from prof import Professor

# Import PuLP modeller functions
from pulp import *

def optimizePreferences(student_cap, pref_limit):
    # Number of students a professor can take
    # student_cap = 5

    # Number of professors a student can list
    # pref_limit = 4

    profids = []
    # for prof in profs:
        # The preferences database only contains professor names instead of netids
        # profids.append(profs.getNetId())
        # profids.append(prof[1] + " " + prof[2])

    # Creates a dictionary for the number of units of supply for each supply node
    # supply = {}
    # for prof in profids:
    #   supply[prof] = student_cap

    # Creates a list of all demand nodes
    profPreferencesDB_ = profPreferencesDB()
    error_statement = profPreferencesDB_.connect()

    if error_statement == '':
        connection = profPreferencesDB_.conn
        try:
            studentprefs = profPreferencesDB_.getAdvisors()
        except Exception as e:
            error_statement = str(e)
    else:
        print(error_statement)

    profPreferencesDB_.disconnect()

    studentids = []

    # Creates a dictionary for the number of units of demand for each demand node
    # (All demands are 1 for this case)

    # Creates a list of costs (rankings) of each pairing
    costs = {}

    # Dictionary of students and preferences
    prefs_dict = {}

    # This is written assuming prefs is a list with the first index being the student's netid and the rest being the preferences
    # This is also written such that students who select < pref_limit professors are at somewhat of a disadvantage
    report = studentprefs.pop(0)
    print(studentprefs)
    for prefs in studentprefs:
        student_id = prefs.pop(0)
        cost = pref_limit - 1
        pref_duplicates = []
        for pref in reversed(prefs):
            if pref not in pref_duplicates:
                if pref not in profids:
                    if pref != "Non ORFE professor":
                        if pref != "" and pref != "None":
                            profids.append(pref)
                    else:
                        student_id += "*"
                costs[pref, student_id] = cost
                cost -= 1
                pref_duplicates.append(pref)
        studentids.append(student_id)
        prefs_dict[student_id] = prefs

    for prof in profids:
        for student in studentids:
            if (prof, student) not in costs:
                costs[prof, student] = pref_limit

    # Creates the prob variable to contain the problem data
    prob = LpProblem("Student-Advisor Matching",LpMinimize)

    # Creates a list of tuples containing all the possible student-advisor pairings
    pairings = [(p,s) for p in profids for s in studentids]

    # A dictionary called pairing_vars is created to contain the referenced variables (the pairings)
    pairing_vars = LpVariable.dicts("",(profids,studentids),0,None,cat='Binary')

    # The objective function is added to prob first
    prob += lpSum([pairing_vars[p][s]*costs[p,s] for (p,s) in pairings]), "Sum of Transporting Costs"

    # The supply maximum constraints are added to prob for each supply node (professor)
    for p in profids:
        prob += lpSum([pairing_vars[p][s] for s in studentids]) <= student_cap, "Sum of students for professor %s"%p

    # The demand minimum constraints are added to prob for each demand node (student)
    for s in studentids:
        prob += lpSum([pairing_vars[p][s] for p in profids]) == 1, "Sum of professors for student %s"%s

    # The problem data is written to an .lp file
    #prob.writeLP("preferences.lp")

    # The problem is solved using PuLP's choice of Solver
    prob.solve()

    # The status of the solution is printed to the screen
    print("Status:", LpStatus[prob.status])

    # Each of the variables is printed with its resolved optimum value

    # professor with students
    prof_student_list = {}

    # student with professor
    student_prof_list = {}
    for v in prob.variables():
        print(v.name, "=", v.varValue)
        prof_student = v.name.split('_')
        prof_name = prof_student[1]
        for i in range(2, len(prof_student)-1):
            prof_name += " " + prof_student[i]
        if v.varValue > 0:
            student_name = prof_student[len(prof_student)-1]
            if prof_name not in prefs_dict[student_name]:
                student_name += "$"
            if prof_name not in prof_student_list.keys():
                prof_student_list[prof_name] = [student_name]
            else:
                prof_student_list[prof_name].append(student_name)
            if student_name not in student_prof_list.keys():
                student_prof_list[student_name] = prof_name

    return report, prof_student_list, student_prof_list

if __name__ == '__main__':
    report, prof_student_list, student_prof_list = optimizePreferences(5, 4)
    print(report)
    print(prof_student_list)
    print(student_prof_list)