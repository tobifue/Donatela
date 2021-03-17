'''
this script populats the db with some test data
'''
from mongoengine import connect

from models import Project, UserAccount, BusinessAccount, Organization

#connect('donatela', host='mongodb://localhost:27017/donatela', alias='default')
connect('donatela', host='mongodb+srv://rudi:gJEzkg3a094nVORu@cluster0.ebgvt.mongodb.net/donatela?retryWrites=true&w=majority', alias='default')


def init_db():
    '''
    project1 = Project(location=1, number_participants=2)
    project1.save()
    project2 = Project(location=1, number_participants=1, part_of=project1)
    project2.save()

    user = UserAccount(username="hans", email="hans@email.com", firstname="hans", lastname="mueller", preference="none")
    user = UserAccount(username="carlo", email="carlo@email.com", firstname="carlo", lastname="arndt", preference="none")
    user.save()
    '''

    business = BusinessAccount(
        email='business@email.com',
        company_name='business1',
        fee=10.10,
        bank_account='AT123456789123'
    )
    business.save()

    organization = Organization(
        focus='sth', 
        name='brot fuer die Welt', 
        employees=1200,
        business=business
    )
    organization.save()

    project = Project(
        location=2,
        number_participants=12,
        organization=organization
    )
    project.save()

if __name__ == "__main__":
    init_db()
