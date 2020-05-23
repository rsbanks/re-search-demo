class Professor(object):
    
    def __init__(self, netId):
        self.netId = netId

    def setTitle(self, title):
        self.title = title

    def setFirstName(self, first):
        self.first = first

    def setLastName(self, last):
        self.last = last

    def setEmail(self, email):
        self.email = email

    def setPhoneNumber(self, phone):
        self.phone = phone

    def setWebsite(self, website):
        self.website = website
    
    def setRooms(self, rooms):
        rooms = rooms.split(',')
        self.rooms = rooms

    def setDepartment(self, department):
        self.department = department

    def setResearchAreas(self, researchAreas):
        researchAreas = researchAreas.split(',')
        self.researchAreas = researchAreas

    def setBio(self, bio):
        self.bio = bio

    def setImagePath(self, imagePath):
        self.imagePath = imagePath

    def setActualImage(self, image):
        self.actualImage = image

    def setImageExtension(self, imageExtension):
        self.imageExtension = imageExtension

    def getNetId(self):
        return self.netId

    def getTitle(self):
        return self.title

    def getFirstName(self):
         return self.first

    def getLastName(self):
         return self.last

    def getEmail(self):
        return self.email

    def getPhoneNumber(self):
        return self.phone

    def getWebsite(self):
        return self.website
    
    def getRooms(self):
        return self.rooms

    def getDepartment(self):
        return self.department

    def getResearchAreas(self):
        return self.researchAreas

    def getBio(self):
        return self.bio

    def getImagePath(self):
        return self.imagePath

    def getActualImage(self):
        return self.actualImage

    def getImageExtension(self):
        return self.imageExtension

    def getPastPapers(self):
        return self.pastPapers