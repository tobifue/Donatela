FROM python:3.8

WORKDIR /app

COPY . /app

RUN pip install pipenv
RUN pipenv install --system --deploy 

CMD ["uwsgi", "app.ini"]
