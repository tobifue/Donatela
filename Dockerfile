FROM python:3.8

WORKDIR /app

COPY . /app

RUN pip install pipenv
RUN pipenv install --system --deploy 

EXPOSE 80

CMD ["uwsgi", "app.ini"]
