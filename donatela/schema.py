import graphene
from graphql import GraphQLError
from graphene import String, Int, Decimal
from graphene.relay import Node
from graphene_mongo import MongoengineConnectionField, MongoengineObjectType
from datetime import datetime


from models import Project, UserAccount, BusinessAccount, Organization, Receipt, Review, Donation
from flask_graphql_auth import (
    AuthInfoField,
    query_jwt_required,
    mutation_jwt_refresh_token_required,
    get_jwt_identity,
    create_access_token,
    create_refresh_token,
)

class CustomNode(graphene.Node):
    class Meta:
        name = 'CustomNode'

    @staticmethod
    def to_global_id(type, id):
        return id


# Login and Refresh Mutation for Authentication
class LoginMutation(graphene.Mutation):
    class Arguments(object):
        username = graphene.String()
        password = graphene.String()

    access_token = graphene.String()
    refresh_token = graphene.String()
    userId = graphene.String()
    preference = graphene.String()
    isAdmin = graphene.Boolean()

    def mutate(self, info, username, password):
        user = UserAccount.objects.get(username=username, password=password)
        if not user:
            raise Exception('Failure: not registered')
        return LoginMutation(
            access_token = create_access_token(username),
            refresh_token = create_refresh_token(username),
            preference = user.preference,
            isAdmin = user.isAdmin,
            userId = str(user.id)
        )


class LoginBusinessMutation(graphene.Mutation):
    class Arguments(object):
        company_name= graphene.String()
        password = graphene.String()

    access_token = graphene.String()
    refresh_token = graphene.String()
    businessId = graphene.String()

    def mutate(self, info, company_name, password):
        business = BusinessAccount.objects.get(company_name=company_name, password=password)
        if not business:
            raise Exception('Failure: not registered')
        return LoginBusinessMutation(
            access_token = create_access_token(company_name),
            refresh_token = create_refresh_token(company_name),
            businessId = str(business.id)
        )
    

class RefreshMutation(graphene.Mutation):
    class Arguments(object):
        refresh_token = graphene.String()

    new_token = graphene.String()

    @mutation_jwt_refresh_token_required
    def mutate(self):
        current_user = get_jwt_identity()
        return RefreshMutation(new_token=create_access_token(identity=current_user))


# Queries starting here
class UserAccountOT(MongoengineObjectType):
    class Meta:
        model = UserAccount
        interfaces = (CustomNode, )


class BusinessAccountOT(MongoengineObjectType):
    class Meta:
        model = BusinessAccount
        interfaces = (CustomNode, )


class ProjectOT(MongoengineObjectType):
    class Meta:
        model = Project
        interfaces = (CustomNode, )


class OrganizationOT(MongoengineObjectType):
    class Meta:
        model = Organization 
        interfaces = (CustomNode, )


class ReviewOT(MongoengineObjectType):
    class Meta:
        model = Review
        interfaces = (CustomNode, )


class ReceiptOT(MongoengineObjectType):
    class Meta:
        model = Receipt 
        interfaces = (CustomNode, )


class DonationOT(MongoengineObjectType):
    class Meta:
        model = Donation
        interfaces = (CustomNode, )


# Mutations starting here
class UserAccountInput(graphene.InputObjectType):
    id = String ()
    username = String()
    email = String()
    firstname = String()
    lastname = String()
    preference = String()
    isAdmin = graphene.Boolean()
    password = String()


class CreateUserAccount(graphene.Mutation):
    user_account = graphene.Field(UserAccountOT)

    class Arguments:
        user_account_data = UserAccountInput()

    def mutate(root, info, user_account_data):
        user = UserAccount(
            username=user_account_data.username,
            email=user_account_data.email,
            firstname=user_account_data.firstname,
            lastname=user_account_data.lastname,
            preference=user_account_data.preference,
            isAdmin=user_account_data.isAdmin,
            password=user_account_data.password
        )
        user.save()
        return CreateUserAccount(user_account=user)


class UpdateUserAccount(graphene.Mutation):
    user_account = graphene.Field(UserAccountOT)

    class Arguments:
        user_account_data = UserAccountInput()

    @staticmethod
    def get_object(id):
        return UserAccount.objects.get(pk=id)

    def mutate(root, info, user_account_data):
        user = UpdateUserAccount.get_object(user_account_data.id)
        if user_account_data.email:
            user.email = user_account_data.email
        if user_account_data.firstname:
            user.firstname = user_account_data.firstname
        if user_account_data.lastname:
            user.lastname = user_account_data.lastname
        if user_account_data.preference:
            user.preference = user_account_data.preference
        if user_account_data.password:
            user.password = user_account_data.password

        user.save()
        return UpdateUserAccount(user_account=user)


class DeleteUserAccount(graphene.Mutation):
    user_account = graphene.Field(UserAccountOT)

    class Arguments:
        user_account_data = UserAccountInput()

    @staticmethod
    def get_object(id):
        return UserAccount.objects.get(pk=id)

    def mutate(root, info, user_account_data):
        user = UpdateUserAccount.get_object(user_account_data.id)
        
        user.delete()
        return DeleteUserAccount(user_account=user)


class DonationInput(graphene.InputObjectType):

    id = String()
    date = datetime.now
    currency = String()
    amount = String()
    payment_method = String()
    donor = String()
    organization = String()
    receipt = String()


class CreateDonation(graphene.Mutation):
    donation = graphene.Field(DonationOT)

    class Arguments:
        donation_data = DonationInput()

    def mutate(root, info, donation_data):
        don = Donation(
            date=donation_data.date,
            currency=donation_data.currency,
            amount=donation_data.amount,
            payment_method=donation_data.payment_method,
            donor=donation_data.donor,
            organization=donation_data.organization,
            receipt=donation_data.receipt

        )
        don.save()
        return CreateDonation(donation=don)


class ReceiptInput(graphene.InputObjectType):

    id = String()
    date = String()
    amount = String()
    recipient = String()
    sender = String()
    currency = String()


class CreateReceipt(graphene.Mutation):
    receipt = graphene.Field(ReceiptOT)

    class Arguments:
        receipt_data = ReceiptInput()

    def mutate(root, info, receipt_data):
        rec = Receipt(
            date=receipt_data.date,
            amount=receipt_data.amount,
            recipient=receipt_data.recipient,
            sender=receipt_data.sender,
            currency=receipt_data.currency
        )
       
        rec.save()
        return CreateReceipt(receipt=rec)


class BusinessAccountInput(graphene.InputObjectType):
    company_name = String()
    email = String()
    fee = Decimal()
    bank_account = String()
    password = String()


class CreateBusinessAccount(graphene.Mutation):
    business_account = graphene.Field(BusinessAccountOT)

    class Arguments:
        business_account_data = BusinessAccountInput()

    def mutate(root, info, business_account_data):
        business = BusinessAccount(
            company_name=business_account_data.company_name,
            email=business_account_data.email,
            fee=business_account_data.fee,
            bank_account=business_account_data.bank_account,
            password=business_account_data.password
        )
        business.save()
        return CreateBusinessAccount(business_account=business)


class UpdateBusinessAccount(graphene.Mutation):
    business_account = graphene.Field(BusinessAccountOT)

    class Arguments:
        business_account_data = BusinessAccountInput()

    @staticmethod
    def get_object(id):
        return BusinessAccount.objects.get(pk=id)

    def mutate(root, info, business_account_data):
        user = UpdateBusinessAccount.get_object(business_account_data.id)
        if business_account_data.company_name:
            user.company_name = business_account_data.company_name
        if business_account_data.email:
            user.email = business_account_data.email
        if business_account_data.fee:
            user.fee = business_account_data.fee
        if business_account_data.bank_account:
            user.bank_account = business_account_data.bank_account
        if business_account_data.password:
            user.password = business_account_data.password

        user.save()
        return UpdateBusinessAccount(business_account=user)


class DeleteBusinessAccount(graphene.Mutation):
    business_account = graphene.Field(BusinessAccountOT)

    class Arguments:
        business_account_data = BusinessAccountInput()

    @staticmethod
    def get_object(id):
        return BusinessAccount.objects.get(pk=id)

    def mutate(root, info, business_account_data):
        user = DeleteBusinessAccount.get_object(business_account_data.id)
        
        user.delete()
        return DeleteBusinessAccount(business_account=user)


class OrganizationInput(graphene.InputObjectType):

    id = String()
    focus = String()
    name = String()
    number_projects = Int()
    address = String()
    employees = Int()
    business = String()


class CreateOrganization(graphene.Mutation):
    organization = graphene.Field(OrganizationOT)

    class Arguments:
        organization_data = OrganizationInput()

    def mutate(root, info, organization_data):
        organization = Organization(
            focus=organization_data.focus,
            name=organization_data.name, 
            number_projects=organization_data.number_projects,
            address=organization_data.address,
            employees=organization_data.employees,
            business=organization_data.business
        )
        organization.save()
        return CreateOrganization(organization=organization)


class UpdateOrganization(graphene.Mutation):
    organization = graphene.Field(OrganizationOT)

    class Arguments:
        organization_data = OrganizationInput()

    def mutate(root, info, organization_data):
        organization = Organization.objects.get(pk=organization_data.id)
        if organization_data.focus:
            organization.focus = organization_data.focus
        if organization_data.name:
            organization.name = organization_data.name
        if organization_data.number_projects:
            organization.number_projects = organization_data.number_projects
        if organization_data.address:
            organization.address = organization_data.address
        if organization_data.employees:
            organization.employees = organization_data.employees
        if organization_data.business:
            organization.business = organization_data.business
        organization.save()
        return UpdateOrganization(organization=organization)


class DeleteOrganization(graphene.Mutation):
    organization = graphene.Field(OrganizationOT)

    class Arguments:
        organization_data = OrganizationInput()

    def mutate(root, info, organization_data):
        organization = Organization.objects.get(pk=organization_data.id)
        organization.delete()
        return DeleteOrganization(organization=organization)



class Mutation(graphene.ObjectType):
    login = LoginMutation.Field()
    loginBusiness = LoginBusinessMutation.Field()
    refresh_token = RefreshMutation.Field()
    create_user_account = CreateUserAccount.Field()
    create_business_account = CreateBusinessAccount.Field()
    create_organization = CreateOrganization.Field()
    update_organization = UpdateOrganization.Field()
    delete_organization = DeleteOrganization.Field()
    update_user_account = UpdateUserAccount.Field()
    delete_user_account = DeleteUserAccount.Field()
    create_donation = CreateDonation.Field()
    create_receipt = CreateReceipt.Field()
    update_business_account = UpdateBusinessAccount.Field()
    delete_business_account = DeleteBusinessAccount.Field()


class Query(graphene.ObjectType):
    node = Node.Field()
    userAccounts = MongoengineConnectionField(UserAccountOT, token=graphene.String())
    businessAccounts = MongoengineConnectionField(BusinessAccountOT, token=graphene.String())
    organizations = MongoengineConnectionField(OrganizationOT, token=graphene.String())
    projects = MongoengineConnectionField(ProjectOT, token=graphene.String())
    reviews = MongoengineConnectionField(ReviewOT, token=graphene.String())
    receipts = MongoengineConnectionField(ReceiptOT, token=graphene.String())
    donations = MongoengineConnectionField(DonationOT, token=graphene.String())

    def resolve_userAccounts(self, info, **kwargs):
        @query_jwt_required
        def protected_resolver(**kwargs):
            return Query.userAccounts.resolve_connection(
                Query.userAccounts.type, kwargs, UserAccount.objects(**kwargs).all()
            )
        res = protected_resolver(**kwargs) 
        if (res.__class__ == AuthInfoField):
            raise GraphQLError(res.message)
        return res

    def resolve_businessAccounts(self, info, **kwargs):
        @query_jwt_required
        def protected_resolver(**kwargs):
            return Query.businessAccounts.resolve_connection(
                Query.businessAccounts.type, kwargs, BusinessAccount.objects(**kwargs).all()
            )
        res = protected_resolver(**kwargs) 
        if (res.__class__ == AuthInfoField):
            raise GraphQLError(res.message)
        return res

    def resolve_organizations(self, info, **kwargs):
        @query_jwt_required
        def protected_resolver(**kwargs):
            return Query.organizations.resolve_connection(
                Query.organizations.type, kwargs, Organization.objects(**kwargs).all()
            )
        res = protected_resolver(**kwargs) 
        if (res.__class__ == AuthInfoField):
            raise GraphQLError(res.message)
        return res

    def resolve_projects(self, info, **kwargs):
        @query_jwt_required
        def protected_resolver(**kwargs):
            return Query.projects.resolve_connection(
                Query.projects.type, kwargs, Project.objects(**kwargs).all()
            )
        res = protected_resolver(**kwargs) 
        if (res.__class__ == AuthInfoField):
            raise GraphQLError(res.message)
        return res

    def resolve_reviews(self, info, **kwargs):
        @query_jwt_required
        def protected_resolver(**kwargs):
            return Query.reviews.resolve_connection(
                Query.reviews.type, kwargs, Review.objects(**kwargs).all()
            )
        res = protected_resolver(**kwargs) 
        if (res.__class__ == AuthInfoField):
            raise GraphQLError(res.message)
        return res

    def resolve_receipts(self, info, **kwargs):
        @query_jwt_required
        def protected_resolver(**kwargs):
            return Query.receipts.resolve_connection(
                Query.receipts.type, kwargs, Receipt.objects(**kwargs).all()
            )
        res = protected_resolver(**kwargs) 
        if (res.__class__ == AuthInfoField):
            raise GraphQLError(res.message)
        return res

    def resolve_donations(self, info, **kwargs):
        @query_jwt_required
        def protected_resolver(**kwargs):
            return Query.donations.resolve_connection(
                Query.donations.type, kwargs, Donation.objects(**kwargs).all()
            )
        res = protected_resolver(**kwargs) 
        if (res.__class__ == AuthInfoField):
            raise GraphQLError(res.message)
        return res

schema = graphene.Schema(query=Query, mutation=Mutation, types=[UserAccountOT, BusinessAccountOT, OrganizationOT, ProjectOT, ReviewOT, ReceiptOT, DonationOT])
