from datetime import datetime
from mongoengine import Document
from mongoengine.fields import (
    DateTimeField,
    DecimalField,
    EmailField,
    StringField,
    IntField,
    ReferenceField,
    BooleanField,
)


class UserAccount(Document):
    meta = {"collection": "user"}

    username = StringField(unique=True, required=True)
    email = EmailField()
    firstname = StringField()
    lastname = StringField()
    preference = StringField()
    isAdmin = BooleanField(default=False)
    password = StringField(required=True)


class BusinessAccount(Document):
    meta = {"collection": "business"}

    company_name = StringField(unique=True, required=True)
    email = EmailField()
    fee = DecimalField()
    bank_account = StringField()
    password = StringField(required=True)


class Organization(Document):
    meta = {"collection": "organization"}

    focus = StringField()
    name = StringField()
    number_projects = IntField()
    address = StringField()
    employees = IntField()
    business = ReferenceField(BusinessAccount)


class Project(Document):
    meta = {"collection": "project"}

    location = IntField()
    number_participants = IntField()
    organization = ReferenceField(Organization)
    part_of = ReferenceField("Project")


class Review(Document):
    meta = {"collection": "review"}

    date = DateTimeField(default=datetime.now)
    rating = DecimalField()
    organization = ReferenceField(Organization)
    user = ReferenceField(UserAccount)


class Receipt(Document):
    meta = {"collection": "receipt"}

    date = DateTimeField(default=datetime.now)
    amount = DecimalField()
    recipient = StringField()
    sender = StringField()
    currency = StringField()


class Donation(Document):
    meta = {"collection": "donation"}

    date = DateTimeField(default=datetime.now)
    currency = StringField()
    amount = DecimalField()
    payment_method = StringField()
    donor = ReferenceField(UserAccount)
    organization = ReferenceField(Organization)
    receipt = ReferenceField(Receipt)
